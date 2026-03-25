import { useStore } from '@nanostores/react';
import { i18n } from '@/lib/i18n';
import { Heart } from 'lucide-react';

export const footerDict = i18n('footer', {
  builtWith: "Built with",
  by: "by"
});

export default function FooterText() {
  const dict = useStore(footerDict);
  return (
    <>
      {dict.builtWith} <Heart className="w-4 h-4 inline-block text-red-500 mx-1 mb-0.5 fill-current" /> {dict.by} <a
        href="https://github.com/Kx53"
        target="_blank"
        rel="noopener noreferrer"
        className="text-surface-300 hover:text-accent-400 font-medium transition-colors"
      >
        Kx53
      </a>
    </>
  );
}
