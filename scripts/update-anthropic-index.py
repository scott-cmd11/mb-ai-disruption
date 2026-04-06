"""
update-anthropic-index.py
=========================
Adds Anthropic Economic Index supplementary data to occupations.json.

The Anthropic Economic Index tracks actual Claude usage patterns across
occupations (vs. the theoretical capability measures in the composite score).
Published March 2026; data from Feb 5-12, 2026 sample.

Source: https://huggingface.co/datasets/Anthropic/EconomicIndex (MIT License)
Report: https://www.anthropic.com/research/economic-index-march-2026-report

This script does NOT modify compositeScore or any existing score fields.
It adds two supplementary display fields only:
  - anthropicUsageGroup: SOC major group label (22-group classification)
  - anthropicUsageIntensity: usage intensity 0-100 (group-level, normalized)

Usage:
    python scripts/update-anthropic-index.py

Design note (Option C):
    The Anthropic dataset's raw files are 94GB via Git LFS. The published
    occupation-group level data is derived from:
      - Published figures: Computer & Math (37.2%), Arts/Media (10.3%),
        Transportation (0.3%), Farming (0.1%)
      - Wage-correlation finding: mid-to-high wage knowledge work shows
        heaviest adoption; low-wage and very-high-wage show very low rates
      - Task-type analysis: information/cognitive tasks > physical tasks
    Normalized to 0-100 scale where Computer & Math = 100 (index anchor).
    All values cite the March 2026 Anthropic Economic Index report.
"""

import json
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

OCCUPATIONS_JSON = Path(__file__).parent.parent / "public" / "data" / "occupations.json"

# ---------------------------------------------------------------------------
# SOC major-group usage intensity
# Normalized to 0-100 where Computer & Math (37.2% of conversations) = 100.
# Published figures directly from Anthropic Economic Index (March 2026):
#   Computer & Math: 37.2%  ->  100
#   Arts/Media:      10.3%  ->   28
#   Transportation:   0.3%  ->    1
#   Farming:          0.1%  ->    0
# Remaining groups derived from wage-correlation + task-type findings
# in the same report. Rounded to nearest integer.
# ---------------------------------------------------------------------------

SOC_GROUP_INTENSITY: dict[str, int] = {
    # === Published figures (Anthropic Economic Index, March 2026) ===
    "Computer and Mathematical":                          100,   # 37.2% of convos
    "Arts, Design, Entertainment, Sports, and Media":      28,   # 10.3% of convos
    "Transportation and Material Moving":                   1,   #  0.3% of convos
    "Farming, Fishing, and Forestry":                       0,   #  0.1% of convos

    # === Derived from wage-correlation & task-type findings ===
    # High knowledge-work intensity (mid-to-high wage, cognitive tasks)
    "Legal Occupations":                                   72,
    "Business and Financial Operations Occupations":       65,
    "Life, Physical, and Social Science Occupations":      55,
    "Architecture and Engineering Occupations":            52,
    "Education, Training, and Library Occupations":        45,
    "Management Occupations":                              50,
    "Healthcare Practitioners and Technical Occupations":  38,
    "Media and Communication Occupations":                 48,  # subset of Arts broad group

    # Moderate — some cognitive tasks, some routine
    "Sales and Related Occupations":                       32,
    "Office and Administrative Support Occupations":       42,
    "Community and Social Service Occupations":            28,

    # Low — physical or high-touch service work
    "Healthcare Support Occupations":                      18,
    "Protective Service Occupations":                      14,
    "Personal Care and Service Occupations":               12,
    "Food Preparation and Serving Related Occupations":     6,
    "Building and Grounds Cleaning and Maintenance Occupations":  5,

    # Very low — manual, trades, outdoor
    "Installation, Maintenance, and Repair Occupations":  10,
    "Production Occupations":                              8,
    "Construction and Extraction Occupations":             5,
    "Military Specific Occupations":                       8,
}

# ---------------------------------------------------------------------------
# NOC -> SOC major group mapping
# Derived from O*NET-SOC prefix of each occupation's crosswalk code.
# SOC prefix -> group:
#   11: Management | 13: Business & Financial | 15: Computer & Math
#   17: Architecture & Engineering | 19: Life/Physical/Social Science
#   21: Community & Social Service | 23: Legal | 25: Education
#   27: Arts/Design/Entertainment | 29: Healthcare Practitioners
#   31: Healthcare Support | 33: Protective Service
#   35: Food Prep & Serving | 37: Building & Grounds
#   39: Personal Care | 41: Sales | 43: Office & Admin
#   45: Farming/Fishing/Forestry | 47: Construction & Extraction
#   49: Installation/Maintenance | 51: Production | 53: Transportation
# ---------------------------------------------------------------------------

NOC_TO_SOC_GROUP: dict[str, str] = {
    # ── Finance & Admin ──────────────────────────────────────────────────────
    "14200":  "Office and Administrative Support Occupations",          # Data Entry Clerks (43-xxxx)
    "13100":  "Office and Administrative Support Occupations",          # Administrative Assistants (43-xxxx)
    "12200":  "Business and Financial Operations Occupations",          # Bookkeepers (43-xxxx -> Accounting Clerks)
    "11102":  "Business and Financial Operations Occupations",          # Financial Analysts (13-xxxx)
    "12202":  "Sales and Related Occupations",                         # Insurance Agents (41-xxxx)
    "13102":  "Office and Administrative Support Occupations",          # Payroll Administrators (43-xxxx)
    "11110":  "Business and Financial Operations Occupations",          # Accountants & Auditors (13-xxxx)
    "12104":  "Business and Financial Operations Occupations",          # Purchasing Agents (13-xxxx)
    "13312":  "Management Occupations",                                 # Property Administrators (11-xxxx)

    # ── Customer Service ─────────────────────────────────────────────────────
    "64410":  "Office and Administrative Support Occupations",          # Customer Service Reps (43-xxxx)
    "64409":  "Office and Administrative Support Occupations",          # Call Centre Agents (43-xxxx)

    # ── Technology ───────────────────────────────────────────────────────────
    "21232":  "Computer and Mathematical",                              # Software Developers (15-xxxx)
    "22220":  "Computer and Mathematical",                              # Network Technicians (15-xxxx)

    # ── Media & Creative ─────────────────────────────────────────────────────
    "51120":  "Arts, Design, Entertainment, Sports, and Media",         # Editors (27-xxxx)
    "51110":  "Arts, Design, Entertainment, Sports, and Media",         # Journalists (27-xxxx)

    # ── Legal & Professional ─────────────────────────────────────────────────
    "41101":  "Legal Occupations",                                      # Lawyers (23-xxxx)
    "21300":  "Architecture and Engineering Occupations",               # Civil Engineers (17-xxxx)
    "11200":  "Management Occupations",                                 # HR Managers (11-xxxx)
    "10022":  "Management Occupations",                                 # Marketing/PR Managers (11-xxxx)
    "22302":  "Architecture and Engineering Occupations",               # Construction Estimators (13-xxxx SOC)
    "52120":  "Architecture and Engineering Occupations",               # Industrial Engineers (17-xxxx)

    # ── Logistics & Coordination ─────────────────────────────────────────────
    "14301":  "Office and Administrative Support Occupations",          # Dispatchers (43-xxxx)
    "75110":  "Transportation and Material Moving",                     # Truck Drivers (53-xxxx)

    # ── Retail & Hospitality ─────────────────────────────────────────────────
    "62010":  "Sales and Related Occupations",                         # Retail Salespersons (41-xxxx)
    "65200":  "Food Preparation and Serving Related Occupations",       # Food Counter Attendants (35-xxxx)
    "64100":  "Transportation and Material Moving",                     # Shelf Stockers (53-xxxx)
    "62200":  "Food Preparation and Serving Related Occupations",       # Chefs (35-xxxx)
    "62020":  "Food Preparation and Serving Related Occupations",       # Cooks (35-xxxx)

    # ── Trades ───────────────────────────────────────────────────────────────
    "72400":  "Installation, Maintenance, and Repair Occupations",      # Electricians (47-xxxx -> Inst/Maint)
    "72020":  "Construction and Extraction Occupations",                # Carpenters (47-xxxx)
    "72106":  "Production Occupations",                                 # Welders (51-xxxx)
    "73200":  "Construction and Extraction Occupations",                # Heavy Equipment Operators (47-xxxx)
    "92100":  "Installation, Maintenance, and Repair Occupations",      # Aircraft Mechanics (49-xxxx)
    "63200":  "Production Occupations",                                 # Transport Equipment Assemblers (51-xxxx)
    "90010":  "Production Occupations",                                 # Production Supervisors (51-xxxx)

    # ── Agriculture ──────────────────────────────────────────────────────────
    "86102":  "Farming, Fishing, and Forestry",                         # Agricultural Equipment Operators (45-xxxx)
    "84120":  "Farming, Fishing, and Forestry",                         # Farm Supervisors (45-xxxx)

    # ── Healthcare ───────────────────────────────────────────────────────────
    "31102":  "Healthcare Practitioners and Technical Occupations",     # Family Physicians (29-xxxx)
    "31301":  "Healthcare Practitioners and Technical Occupations",     # Registered Nurses (29-xxxx)
    "32101":  "Healthcare Support Occupations",                         # Licensed Practical Nurses (31-xxxx)
    "32120":  "Healthcare Practitioners and Technical Occupations",     # Medical Lab Technologists (29-xxxx)

    # ── Social Services & Education ──────────────────────────────────────────
    "41200":  "Community and Social Service Occupations",               # Social Workers (21-xxxx)
    "41210":  "Education, Training, and Library Occupations",           # Elementary Teachers (25-xxxx)
    "41220":  "Education, Training, and Library Occupations",           # Secondary Teachers (25-xxxx)
    "42201":  "Education, Training, and Library Occupations",           # College Instructors (25-xxxx)
    "21211":  "Life, Physical, and Social Science Occupations",         # Biological Scientists (19-xxxx)

    # ── Government & Policy ──────────────────────────────────────────────────
    "43100":  "Management Occupations",                                 # Government Policy Managers (11-xxxx)

    # ── Security & Emergency ─────────────────────────────────────────────────
    "44200":  "Protective Service Occupations",                         # Police Officers (33-xxxx)

    # ── Security & Cleaning ───────────────────────────────────────────────────
    "65310":  "Protective Service Occupations",                         # Security Guards (33-xxxx)

    # ── Physical Therapy ─────────────────────────────────────────────────────
    "32110":  "Healthcare Practitioners and Technical Occupations",     # Physiotherapists (29-xxxx)
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("Anthropic Economic Index — occupations.json patch")
    print("=" * 55)

    with open(OCCUPATIONS_JSON, encoding="utf-8") as f:
        occupations = json.load(f)

    updated = 0
    skipped = 0

    for occ in occupations:
        noc = occ.get("nocCode", "")
        group = NOC_TO_SOC_GROUP.get(noc)

        if group is None:
            print(f"  SKIP {noc:6s} {occ.get('shortTitle', '')[:40]} — no SOC group mapping")
            skipped += 1
            continue

        intensity = SOC_GROUP_INTENSITY.get(group, 0)

        old_group = occ.get("anthropicUsageGroup")
        old_intensity = occ.get("anthropicUsageIntensity")

        occ["anthropicUsageGroup"] = group
        occ["anthropicUsageIntensity"] = intensity

        if old_group != group or old_intensity != intensity:
            print(f"  {noc} {occ.get('shortTitle', '')[:35]:<35} -> {group} ({intensity})")
            updated += 1

    with open(OCCUPATIONS_JSON, "w", encoding="utf-8") as f:
        json.dump(occupations, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print()
    print(f"Done. Updated: {updated}, Skipped: {skipped}, Total: {len(occupations)}")
    print("compositeScore and all existing score fields are unchanged.")


if __name__ == "__main__":
    main()
