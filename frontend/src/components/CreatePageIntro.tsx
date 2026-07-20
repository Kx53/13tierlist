import { useStore } from "@nanostores/react";
import { i18n } from "@/lib/i18n";

export const createPageDict = i18n("createPage", {
  eyebrow: "Start Fresh",
  title: "Create a New Tier List",
  subtitle: "Give your tier list a name and start ranking!",
});

export default function CreatePageIntro() {
  const dict = useStore(createPageDict);

  return (
    <div>
      <p className="label-caps inline-flex rounded-full bg-surface-1 px-4 py-2 text-white">
        {dict.eyebrow}
      </p>
      <h1 className="font-display mt-7 max-w-2xl text-5xl font-normal leading-[0.95] tracking-[-0.045em] sm:text-7xl">
        {dict.title}
      </h1>
      <p className="mt-6 max-w-lg text-lg font-light leading-7 text-foreground">
        {dict.subtitle}
      </p>
    </div>
  );
}
