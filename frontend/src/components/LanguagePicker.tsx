import { useStore } from '@nanostores/react';
import { locale } from '@/lib/i18n';
import { Button } from '@heroui/react';

export default function LanguagePicker() {
  const currentLocale = useStore(locale);

  return (
    <div className="flex bg-surface-800/50 p-1 rounded-lg border border-surface-700/50 backdrop-blur-sm gap-1">
      <Button
        size="sm"
        variant={currentLocale === 'en' ? 'primary' : 'ghost'}
        className={`px-3 py-1 font-medium transition-all ${
          currentLocale === 'en'
            ? 'bg-accent-500 text-white shadow-sm'
            : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
        }`}
        onPress={() => locale.set('en')}
      >
        EN
      </Button>
      <Button
        size="sm"
        variant={currentLocale === 'th' ? 'primary' : 'ghost'}
        className={`px-3 py-1 font-medium transition-all ${
          currentLocale === 'th'
            ? 'bg-accent-500 text-white shadow-sm'
            : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
        }`}
        onPress={() => locale.set('th')}
      >
        ไทย
      </Button>
    </div>
  );
}
