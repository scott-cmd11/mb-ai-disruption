"""
update-llm-exposure.py
======================
Downloads the Eloundou et al. (2023) "GPTs are GPTs" occupation-level dataset
from the official OpenAI GitHub repo and patches occupations.json with real
human_rating_beta scores, replacing the estimated llmExposure values.

Usage:
    python scripts/update-llm-exposure.py

Requirements:
    pip install requests

What it does:
    1. Downloads data/occ_level.csv from github.com/openai/GPTs-are-GPTs
    2. Looks up human_rating_beta (0–1) for each occupation via NOC→O*NET mapping
    3. Normalises to 0–100 scale
    4. Recalculates compositeScore using the updated llmExposure
    5. Recalculates riskTier thresholds
    6. Writes updated occupations.json in-place
    7. Prints a diff summary showing what changed
"""

import json
import csv
import io
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ONET_CSV_URL = (
    "https://raw.githubusercontent.com/openai/GPTs-are-GPTs/main/data/occ_level.csv"
)

OCCUPATIONS_JSON = Path(__file__).parent.parent / "public" / "data" / "occupations.json"

# Composite score weights (must match src/app/calculator logic)
W_FREY   = 0.30
W_AIOE   = 0.30
W_LLM    = 0.25
W_ADOPT  = 0.15   # adoption gap — backed out from current composite, kept unchanged

# Risk tier thresholds
TIER_LOW_MAX    = 35
TIER_MEDIUM_MAX = 65

# ---------------------------------------------------------------------------
# NOC → O*NET-SOC mapping
# Hand-curated for the 49 occupations in occupations.json.
# Where an occupation maps to multiple O*NET codes, the score is averaged.
# O*NET-SOC codes use format: "XX-XXXX.XX"
# ---------------------------------------------------------------------------

NOC_TO_ONET: dict[str, list[str]] = {
    # ── Finance & Admin ──────────────────────────────────────────────────────
    "14200":  ["43-9021.00"],                          # Data Entry Clerks
    "13100":  ["43-6014.00"],                          # Administrative Assistants
    "12200":  ["43-3031.00"],                          # Bookkeepers
    "11102":  ["13-2051.00", "13-2052.00"],            # Financial Analysts / Advisors
    "12202":  ["41-3021.00"],                          # Insurance Agents
    "13102":  ["43-3051.00"],                          # Payroll Administrators
    "11110":  ["13-2011.00"],                          # Accountants and Auditors
    "12104":  ["13-1023.00"],                          # Purchasing Agents
    "13312":  ["11-9141.00"],                          # Property Administrators

    # ── Customer Service ─────────────────────────────────────────────────────
    "64410":  ["43-4051.00"],                          # Customer Service Reps
    "64409":  ["43-4051.00"],                          # Call Centre Agents

    # ── Technology ───────────────────────────────────────────────────────────
    "21232":  ["15-1252.00", "15-1251.00"],            # Software Developers / Programmers
    "22220":  ["15-1241.00"],                          # Computer Network Technicians

    # ── Media & Creative ─────────────────────────────────────────────────────
    "51120":  ["27-3041.00"],                          # Editors
    "51110":  ["27-3023.00"],                          # Journalists

    # ── Legal & Professional ─────────────────────────────────────────────────
    "41101":  ["23-1011.00"],                          # Lawyers
    "21300":  ["17-2051.00"],                          # Civil Engineers
    "11200":  ["11-3121.00"],                          # HR Managers
    "10022":  ["11-2021.00", "11-2031.00"],            # Marketing / PR Managers
    "22302":  ["13-1051.00"],                          # Construction Estimators
    "52120":  ["17-2112.00"],                          # Industrial/Manufacturing Engineers

    # ── Logistics & Coordination ─────────────────────────────────────────────
    "14301":  ["43-5032.00"],                          # Dispatchers
    "75110":  ["53-3032.00"],                          # Truck Drivers

    # ── Retail & Hospitality ─────────────────────────────────────────────────
    "62010":  ["41-2031.00"],                          # Retail Salespersons
    "65200":  ["35-3023.00"],                          # Food Counter Attendants
    "64100":  ["43-5081.00"],                          # Shelf Stockers
    "62200":  ["35-1011.00"],                          # Chefs
    "62020":  ["35-2014.00"],                          # Cooks

    # ── Trades ───────────────────────────────────────────────────────────────
    "72400":  ["47-2111.00"],                          # Electricians
    "72020":  ["47-2031.00"],                          # Carpenters
    "72106":  ["51-4121.00"],                          # Welders
    "73200":  ["47-2073.00"],                          # Heavy Equipment Operators
    "92100":  ["49-3011.00"],                          # Aircraft Mechanics
    "63200":  ["51-2099.00"],                          # Transport Equipment Assemblers
    "90010":  ["51-1011.00"],                          # Production Supervisors

    # ── Agriculture ──────────────────────────────────────────────────────────
    "86102":  ["45-2091.00"],                          # Agricultural Equipment Operators
    "84120":  ["45-1011.00"],                          # Farm Supervisors

    # ── Healthcare ───────────────────────────────────────────────────────────
    "31102":  ["29-1215.00"],                          # Family Physicians
    "31301":  ["29-1141.00"],                          # Registered Nurses
    "32101":  ["29-2061.00"],                          # Licensed Practical Nurses
    "32120":  ["29-2012.00"],                          # Medical Lab Technologists

    # ── Social Services & Education ──────────────────────────────────────────
    "41200":  ["21-1021.00"],                          # Social Workers
    "41210":  ["25-2021.00"],                          # Elementary Teachers
    "41220":  ["25-2031.00"],                          # Secondary School Teachers
    "42201":  ["25-1099.00"],                          # College Instructors
    "21211":  ["19-1029.00"],                          # Biological Scientists

    # ── Security & Public Safety ─────────────────────────────────────────────
    "65310":  ["33-9032.00"],                          # Security Guards
    "44200":  ["33-3051.00"],                          # Police Officers

    # ── Government ───────────────────────────────────────────────────────────
    "43100":  ["11-9161.00", "11-1021.00"],            # Government Policy Managers
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def download_onet_scores(url: str) -> dict[str, float]:
    """Download occ_level.csv and return {onet_code: human_rating_beta}."""
    print(f"Downloading Eloundou et al. dataset from:\n  {url}\n")
    with urllib.request.urlopen(url) as resp:
        content = resp.read().decode("utf-8")

    reader = csv.DictReader(io.StringIO(content))
    scores: dict[str, float] = {}
    for row in reader:
        code = row.get("O*NET-SOC Code", "").strip()
        raw  = row.get("human_rating_beta", "").strip()
        if code and raw:
            try:
                scores[code] = float(raw)
            except ValueError:
                pass

    print(f"  Loaded {len(scores)} O*NET occupation scores.")
    return scores


def lookup_llm_exposure(noc: str, onet_scores: dict[str, float]) -> float | None:
    """Return the averaged, normalised (0–100) LLM exposure for a NOC code."""
    onet_codes = NOC_TO_ONET.get(noc, [])
    if not onet_codes:
        return None

    matched = [onet_scores[c] for c in onet_codes if c in onet_scores]
    if not matched:
        return None

    avg_raw = sum(matched) / len(matched)
    return round(avg_raw * 100)


def recalculate_composite(occ: dict, new_llm: int) -> int:
    """
    Recalculate compositeScore given updated llmExposure.
    Backs out the adoption gap contribution from the current composite so it
    remains unchanged, only swapping in the new LLM score.
    """
    old_llm    = occ["llmExposure"]
    frey       = occ["freyOsborne"]
    aioe       = occ["aioeScore"]
    old_comp   = occ["compositeScore"]

    # Back out implied adoption gap contribution from current composite
    adopt_contribution = old_comp - (frey * W_FREY) - (aioe * W_AIOE) - (old_llm * W_LLM)

    new_comp = (frey * W_FREY) + (aioe * W_AIOE) + (new_llm * W_LLM) + adopt_contribution
    return round(new_comp)


def risk_tier(score: int) -> str:
    if score <= TIER_LOW_MAX:
        return "low"
    if score <= TIER_MEDIUM_MAX:
        return "medium"
    return "high"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    onet_scores = download_onet_scores(ONET_CSV_URL)

    with open(OCCUPATIONS_JSON, encoding="utf-8") as f:
        occupations: list[dict] = json.load(f)

    matched   = 0
    unmatched = []
    changes   = []

    for occ in occupations:
        noc = occ["nocCode"]
        new_llm = lookup_llm_exposure(noc, onet_scores)

        if new_llm is None:
            unmatched.append(f"  {noc}  {occ['title']}")
            continue

        old_llm   = occ["llmExposure"]
        old_comp  = occ["compositeScore"]
        old_tier  = occ["riskTier"]

        new_comp = recalculate_composite(occ, new_llm)
        new_tier = risk_tier(new_comp)

        occ["llmExposure"]    = new_llm
        occ["compositeScore"] = new_comp
        occ["riskTier"]       = new_tier
        occ["scoreConfidence"] = "published"

        matched += 1
        if old_llm != new_llm or old_comp != new_comp:
            tier_change = f"  [{old_tier}->{new_tier}]" if old_tier != new_tier else ""
            changes.append(
                f"  {noc}  {occ['shortTitle']:<35}"
                f"  llm {old_llm:>3}->{new_llm:>3}"
                f"  composite {old_comp:>3}->{new_comp:>3}"
                f"{tier_change}"
            )

    # Write updated file
    with open(OCCUPATIONS_JSON, "w", encoding="utf-8") as f:
        json.dump(occupations, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # Report
    print(f"Results: {matched} matched, {len(unmatched)} unmatched\n")

    if changes:
        print(f"Changed ({len(changes)} occupations):")
        for line in changes:
            print(line)
    else:
        print("No score changes (Eloundou scores match existing estimates closely).")

    if unmatched:
        print(f"\nNot matched ({len(unmatched)}) — scores unchanged:")
        for line in unmatched:
            print(line)

    print(f"\nDone. Updated: {OCCUPATIONS_JSON}")


if __name__ == "__main__":
    main()
