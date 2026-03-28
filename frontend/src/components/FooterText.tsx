import { useStore } from "@nanostores/react";
import { Heart } from "lucide-react";
import { i18n } from "@/lib/i18n";

export const footerDict = i18n("footer", {
  builtWith: "Built with",
  by: "by",
});

export default function FooterText() {
  const dict = useStore(footerDict);

  return (
    <>
      {dict.builtWith}{" "}
      <Heart className="mx-1 mb-0.5 inline-block h-4 w-4 fill-current text-red-500" />{" "}
      {dict.by}{" "}
      <a
        href="https://github.com/Kx53"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground/85 hover:text-brand-400"
      >
        Kx53
      </a>
    </>
  );
}
