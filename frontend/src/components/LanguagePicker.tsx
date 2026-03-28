import { useStore } from "@nanostores/react";
import { locale } from "@/lib/i18n";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function LanguagePicker() {
  const currentLocale = useStore(locale);

  return (
    <ToggleGroup
      type="single"
      value={currentLocale}
      onValueChange={(nextLocale) => {
        if (nextLocale === "en" || nextLocale === "th") {
          locale.set(nextLocale);
        }
      }}
      className="rounded-full bg-secondary/75"
      aria-label="Language switcher"
    >
      <ToggleGroupItem
        value="en"
        size="sm"
        className="rounded-full px-3.5"
        aria-label="English"
      >
        EN
      </ToggleGroupItem>
      <ToggleGroupItem
        value="th"
        size="sm"
        className="rounded-full px-3.5"
        aria-label="Thai"
      >
        ไทย
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
