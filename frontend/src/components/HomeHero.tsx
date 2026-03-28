import { useStore } from "@nanostores/react";
import {
  ArrowRight,
  Image as ImageIcon,
  Link,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { i18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const homeDict = i18n("home", {
  title: "13TierList — Create & Share Tier Lists",
  description: "Create beautiful image-based tier lists and share them with anyone",
  tag: "Free · No signup · Instant sharing",
  headline1: "Rank Everything",
  headline2: "Your Way",
  subtitle:
    "Create stunning image-based tier lists, drag & drop to rank, and share with anyone — no account needed.",
  cta: "Create Tier List",
  feature1Title: "Drag & Drop",
  feature1Desc: "Intuitively rank items by dragging them between tiers. Reorder within tiers too.",
  feature2Title: "Instant Sharing",
  feature2Desc: "Get a shareable link immediately. No login required — share with anyone.",
  feature3Title: "Image-Based",
  feature3Desc: "Add images via URL to create visual tier lists for games, anime, food, and more.",
  heroNote: "Build a board in under a minute.",
  previewLabel: "Live Board",
  previewBadge: "No signup",
  whyLabel: "Why people use it",
  whyTitle: "Built for quick ranking, not account setup.",
  whySubtitle:
    "One clean editor, one shareable link, and an export that is ready to post.",
  featureExtra: "Made to stay fast and obvious even on a phone.",
});

export default function HomeHero() {
  const dict = useStore(homeDict);
  const featureCards = [
    {
      icon: MousePointer2,
      title: dict.feature1Title,
      description: dict.feature1Desc,
      accent: "from-brand-400/20 to-brand-500/5",
    },
    {
      icon: Link,
      title: dict.feature2Title,
      description: dict.feature2Desc,
      accent: "from-ember-300/20 to-brand-500/5",
    },
    {
      icon: ImageIcon,
      title: dict.feature3Title,
      description: dict.feature3Desc,
      accent: "from-brand-500/20 to-emerald-300/5",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 marketing-grid opacity-40" />
      <div className="pointer-events-none absolute left-0 top-16 -z-10 h-72 w-72 rounded-full bg-brand-400/12 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-28 -z-10 h-96 w-96 rounded-full bg-brand-500/14 blur-3xl" />

      <section className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div className="max-w-3xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/65 px-4 py-2 text-sm font-medium text-brand-200 backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-400" />
            {dict.tag}
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            <span className="text-gradient-brand">{dict.headline1}</span>
            <br />
            <span className="text-gradient-signal">{dict.headline2}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {dict.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="/create"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-7")}
            >
              {dict.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <span className="h-8 w-8 rounded-full border border-border bg-surface-2" />
                <span className="h-8 w-8 rounded-full border border-border bg-surface-3" />
                <span className="h-8 w-8 rounded-full border border-border bg-surface-4" />
              </div>
              <span>{dict.heroNote}</span>
            </div>
          </div>
        </div>

        <div className="surface-shell relative overflow-hidden p-5 animate-in fade-in-0 slide-in-from-bottom-6 duration-700 sm:p-6">
          <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-brand-400/70 to-transparent" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-200/85">
                {dict.previewLabel}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {dict.title}
              </h2>
            </div>
            <div className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs text-muted-foreground">
              {dict.previewBadge}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "S", color: "#ff7f7f", item: "ghjkl" },
              { label: "A", color: "#ffbf7f", item: "qwerty" },
              { label: "B", color: "#ffe17f", item: "Empty" },
              { label: "C", color: "#fbff7a", item: "Empty" },
            ].map((row, index) => (
              <div
                key={row.label}
                className="overflow-hidden rounded-[24px] border border-border bg-[#09112a] animate-in fade-in-0 slide-in-from-right-3 duration-500"
                style={{ animationDelay: `${0.12 + index * 0.08}s` }}
              >
                <div className="flex min-h-22 items-stretch">
                  <div
                    className="flex w-24 shrink-0 items-center justify-center text-2xl font-black"
                    style={{ backgroundColor: `${row.color}26`, color: row.color }}
                  >
                    {row.label}
                  </div>
                  <div className="flex flex-1 items-center justify-start px-4 py-3">
                    <div className="flex min-h-16 min-w-[10rem] items-center justify-center rounded-[20px] border border-border bg-secondary px-4 text-center font-semibold text-foreground">
                      {row.item}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="surface-shell p-6 sm:p-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-brand-200/85">
                {dict.whyLabel}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {dict.whyTitle}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              {dict.whySubtitle}
            </p>
          </div>

          <Separator className="mb-6 bg-border/70" />

          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${0.18 + index * 0.08}s` }}
                >
                  <Card className="h-full overflow-hidden border-border/70 bg-card/65">
                    <CardHeader className="pb-4">
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-linear-to-br ${feature.accent}`}
                      >
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription className="leading-6">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">
                      {dict.featureExtra}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
