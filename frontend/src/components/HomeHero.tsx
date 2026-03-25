import { Gamepad2, MousePointer2, Link, Image as ImageIcon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { i18n } from '@/lib/i18n';

export const homeDict = i18n('home', {
  title: "13TierList — Create & Share Tier Lists",
  description: "Create beautiful image-based tier lists and share them with anyone",
  tag: "Free · No signup · Instant sharing",
  headline1: "Rank Everything",
  headline2: "Your Way",
  subtitle: "Create stunning image-based tier lists, drag & drop to rank, and share with anyone — no account needed.",
  cta: "Create Tier List",
  feature1Title: "Drag & Drop",
  feature1Desc: "Intuitively rank items by dragging them between tiers. Reorder within tiers too.",
  feature2Title: "Instant Sharing",
  feature2Desc: "Get a shareable link immediately. No login required — share with anyone.",
  feature3Title: "Image-Based",
  feature3Desc: "Add images via URL to create visual tier lists for games, anime, food, and more."
});

export default function HomeHero() {
  const dict = useStore(homeDict);

  return (
    <>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-8">
            <Gamepad2 className="w-4 h-4" /> {dict.tag}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight animate-slide-up">
          <span className="bg-linear-to-r from-white via-surface-200 to-surface-400 bg-clip-text text-transparent">
            {dict.headline1}
          </span>
          <br />
          <span className="bg-linear-to-r from-accent-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {dict.headline2}
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {dict.subtitle}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <a href="/create" className="btn-primary text-base px-8 py-3.5 rounded-2xl shadow-2xl shadow-accent-500/20 hover:shadow-accent-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {dict.cta}
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card hover:border-accent-500/30 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <MousePointer2 className="w-6 h-6 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-100 mb-2">{dict.feature1Title}</h3>
            <p className="text-surface-400 text-sm">{dict.feature1Desc}</p>
          </div>

          <div className="card hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <Link className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-100 mb-2">{dict.feature2Title}</h3>
            <p className="text-surface-400 text-sm">{dict.feature2Desc}</p>
          </div>

          <div className="card hover:border-pink-500/30 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-100 mb-2">{dict.feature3Title}</h3>
            <p className="text-surface-400 text-sm">{dict.feature3Desc}</p>
          </div>
        </div>
      </section>
    </>
  );
}
