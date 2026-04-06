import type { Metadata } from "next";
import { getIndustries, getOccupations } from "@/lib/data";
import { ExplorerWrapper } from "./ExplorerWrapper";

export const metadata: Metadata = {
  title: "Industry Explorer",
  description:
    "Interactive graph of all 20 Manitoba NAICS sectors — explore AI disruption risk, supply-chain linkages, and key occupations.",
};

export default function ExplorerPage() {
  const industries = getIndustries();
  const occupations = getOccupations();

  return <ExplorerWrapper industries={industries} occupations={occupations} />;
}
