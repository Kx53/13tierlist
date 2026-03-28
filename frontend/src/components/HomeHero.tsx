import { useStore } from "@nanostores/react";
import { ArrowRight, Image as ImageIcon, Link, MousePointer2 } from "lucide-react";
import { i18n } from "@/lib/i18n";

export const homeDict = i18n("home", {
  title: "Create & Share Tier Lists",
  description: "Create beautiful image-based tier lists and share them with anyone",
  tag: "Free · No signup · Instant sharing",
  headline1: "Rank Everything",
  headline2: "With Your Own Eye",
  subtitle:
    "Build a tier list in seconds, drag items where they belong, and send one clean link when it is ready.",
  cta: "Create Tier List",
  feature1Title: "Drag & Drop",
  feature1Desc: "Move items across tiers naturally and reorder them without friction.",
  feature2Title: "Instant Sharing",
  feature2Desc: "Every board gets a link immediately, so you can send it as soon as it looks right.",
  feature3Title: "Image-Based",
  feature3Desc: "Use text or image items for games, food, anime, products, and anything else worth ranking.",
  sectionLabel: "Built for fast ranking",
  sectionTitle: "One editor. One link. One clean export.",
});

export default function HomeHero() {
  const dict = useStore(homeDict);
  const featureCards = [
    {
      icon: MousePointer2,
      title: dict.feature1Title,
      description: dict.feature1Desc,
    },
    {
      icon: Link,
      title: dict.feature2Title,
      description: dict.feature2Desc,
    },
    {
      icon: ImageIcon,
      title: dict.feature3Title,
      description: dict.feature3Desc,
    },
  ];

  return (
    <div className="relative overflow-hidden px-2 py-10 sm:px-4 lg:px-6 lg:py-14">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-6 h-72 w-72 rounded-full bg-mint-300/8 blur-3xl" />
      <section className="relative grid gap-14 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-center">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-border/80 bg-secondary/55 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-brand-200">
            {dict.tag}
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.93] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            <span className="text-gradient-brand">{dict.headline1}</span>
            <br />
            <span className="text-gradient-signal">{dict.headline2}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {dict.subtitle}
          </p>

          <div className="mt-10">
            <a href="/create" className="noise-button inline-flex items-center gap-2">
              <span className="relative z-10">{dict.cta}</span>
              <ArrowRight className="relative z-10 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative">
          <p className="mb-5 text-sm uppercase tracking-[0.32em] text-brand-200/80">
            {dict.title}
          </p>
          <div className="space-y-3">
              {[
              { label: "S", color: "#ff7f7f", item: "ghjkl" },
              { label: "A", color: "#ffbf7f", item: "qwerty" },
              { label: "B", color: "#ffdf7f", item: "Empty" },
              { label: "C", color: "#ffff7f", item: "Empty" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex min-h-[5.5rem] overflow-hidden rounded-[26px] border border-border/80 bg-[#12091b]/78 backdrop-blur"
              >
                <div
                  className="flex w-24 shrink-0 items-center justify-center text-2xl font-black"
                  style={{ backgroundColor: `${row.color}28`, color: row.color }}
                >
                  {row.label}
                </div>
                <div className="flex flex-1 items-center px-4 py-3">
                  <div className="flex min-h-14 min-w-[9rem] items-center justify-center rounded-[20px] border border-border/70 bg-[#191b1c]/70 px-4 text-center font-semibold text-foreground">
                    {row.item}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 py-16">
        <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-200/80">
              {dict.sectionLabel}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {dict.sectionTitle}
            </h2>
          </div>
        </div>

        <div className="grid gap-8 border-t border-border/50 pt-8 md:grid-cols-3 md:gap-10">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55 text-mint-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="max-w-sm text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
