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
    <div className="mb-10 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-brand-200/85">
        {dict.eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        {dict.title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
        {dict.subtitle}
      </p>
    </div>
  );
}
