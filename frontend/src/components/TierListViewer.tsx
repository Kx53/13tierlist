import type { Tier, TierItem } from "@/lib/api";
import TierListBoard from "@/components/TierListBoard";

interface Props {
  tiers: Tier[];
  unrankedItems?: TierItem[];
}

export default function TierListViewer({ tiers, unrankedItems }: Props) {
  return (
    <TierListBoard
      tiers={tiers}
      unrankedItems={unrankedItems}
      className="space-y-2 animate-in fade-in-0"
    />
  );
}
