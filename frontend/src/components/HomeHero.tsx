import { useStore } from "@nanostores/react";
import { ArrowRight } from "lucide-react";
import { i18n } from "@/lib/i18n";

export const homeDict = i18n("home", {
  title: "Create & Share Tier Lists",
  description:
    "Create beautiful image-based tier lists and share them with anyone",
  tag: "Free · No signup · Instant sharing",
  headline1: "Rank Everything",
  headline2: "With Your Own.",
  subtitle:
    "Build a tier list in seconds, drag items where they belong, and send one clean link when it is ready.",
  cta: "Create Tier List",
  feature1Title: "Drag & Drop",
  feature1Desc:
    "Move items across tiers naturally and reorder them without friction.",
  feature2Title: "Instant Sharing",
  feature2Desc:
    "Every board gets a link immediately, so you can send it as soon as it looks right.",
  feature3Title: "Text & Image-Based",
  feature3Desc:
    "Use text or image items for games, food, anime, products, and anything else worth ranking.",
  sectionLabel: "Built for fast ranking",
  sectionTitle: "One editor. One link. One clean export.",
});

export default function HomeHero() {
  const dict = useStore(homeDict);
  const featureCards = [
    {
      number: "01",
      title: dict.feature1Title,
      description: dict.feature1Desc,
    },
    {
      number: "02",
      title: dict.feature2Title,
      description: dict.feature2Desc,
    },
    {
      number: "03",
      title: dict.feature3Title,
      description: dict.feature3Desc,
    },
  ];

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <section className="relative grid min-h-[38rem] gap-14 overflow-hidden border-b border-black pb-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.72fr)] lg:items-center lg:pb-20">
        <div className="relative z-10 max-w-4xl">
          <div className="label-caps mb-8 inline-flex rounded-full bg-surface-1 px-4 py-2 text-white">
            {dict.tag}
          </div>

          <h1 className="max-w-5xl text-[clamp(3.6rem,8vw,7.75rem)] font-light leading-[0.84] tracking-[-0.065em]">
            <span>{dict.headline1}</span>
            <br />
            <span className="font-display font-normal tracking-[-0.045em]">
              {dict.headline2}
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg font-light leading-7 text-foreground sm:text-xl sm:leading-8">
            {dict.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="/create"
              className="inline-flex h-12 items-center gap-3 rounded-full border border-black bg-black px-6 text-base font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              <span>{dict.cta}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <span className="label-caps text-muted-foreground">S / A / B / C / D</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[31rem] lg:translate-y-8">
          <div className="absolute -inset-16 -z-10 bg-[radial-gradient(circle_at_20%_40%,#ffedbe_0_12%,transparent_36%),radial-gradient(circle_at_52%_72%,#ffbcc3_0_12%,transparent_40%),radial-gradient(circle_at_75%_30%,#cdffea_0_16%,transparent_42%),radial-gradient(circle_at_86%_76%,#e7d4ff_0_16%,transparent_40%)] blur-xl" />
          <div className="border border-black bg-white">
            <div className="flex h-12 items-center justify-between border-b border-black bg-black px-4 text-white">
              <p className="label-caps">{dict.title}</p>
              <div className="flex gap-1" aria-hidden="true">
                <span className="size-2 bg-white" />
                <span className="size-2 border border-white" />
              </div>
            </div>
            {[
              {
                label: "S",
                color: "#ff7f7f",
                items: ["Thai Milk Tea", "Brown Sugar Boba"],
              },
              {
                label: "A",
                color: "#ffbf7f",
                items: ["Cola", "Lemon Tea"],
              },
              {
                label: "B",
                color: "#ffdf7f",
                items: ["Peach Soda", "Matcha Latte"],
              },
              {
                label: "C",
                color: "#ffff7f",
                items: ["Sparkling Water"],
              },
            ].map((row) => (
              <div key={row.label} className="flex min-h-20 border-b border-black last:border-b-0">
                <div
                  className="flex w-20 shrink-0 items-center justify-center border-r border-black text-2xl font-medium text-black"
                  style={{
                    backgroundColor: row.color,
                  }}
                >
                  {row.label}
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-2 p-3">
                  {row.items.map((item) => (
                    <div
                      key={item}
                      className="flex min-h-12 flex-1 basis-[7rem] items-center justify-center border border-black bg-white px-3 text-center text-xs font-medium leading-4"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex h-11 items-center justify-between border-t border-black px-4 text-xs text-muted-foreground">
              <span>DRAG TO RANK</span>
              <span className="size-2 bg-mint-300" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-caps text-muted-foreground">
              {dict.sectionLabel}
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-medium leading-none tracking-[-0.05em] sm:text-5xl">
              {dict.sectionTitle}
            </h2>
          </div>
        </div>

        <div className="grid border-l border-t border-black sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature) => {
            return (
              <div key={feature.title} className="min-h-64 border-b border-r border-black bg-white p-7 sm:p-8">
                <p className="label-caps text-muted-foreground">{feature.number}</p>
                <h3 className="mt-12 text-2xl font-medium tracking-[-0.035em]">{feature.title}</h3>
                <p className="mt-4 max-w-sm text-base font-light leading-7 text-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
          <a
            href="/create"
            className="group flex min-h-64 flex-col justify-between border-b border-r border-black bg-surface-1 p-7 text-white hover:bg-black sm:p-8"
          >
            <span className="label-caps text-white/70">READY?</span>
            <span className="flex items-end justify-between gap-4 text-2xl font-medium tracking-[-0.035em]">
              {dict.cta}
              <ArrowRight className="mb-1 size-5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
