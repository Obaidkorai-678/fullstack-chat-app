import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Check, Palette } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-24">
      <div className="panel rounded-4xl p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary/15">
            <Palette className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold">Appearance</h2>
            <p className="text-sm text-base-content/60">
              Choose a theme for your chat interface
            </p>
          </div>
        </div>

        {/* Theme grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {THEMES.map((t) => {
            const isActive = theme === t;
            return (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  toast.success(`${t} theme selected`, { duration: 1500 });
                }}
                className={`group relative flex flex-col gap-2 rounded-2xl border p-2.5 text-left transition-all lift ${
                  isActive
                    ? "border-primary/50 ring-2 ring-primary/25"
                    : "border-base-content/10 hover:border-base-content/25"
                }`}
              >
                {/* Preview */}
                <div
                  className="relative h-12 w-full overflow-hidden rounded-xl"
                  data-theme={t}
                >
                  <div className="grid h-full grid-cols-4 gap-1 bg-base-100 p-1.5">
                    <div className="rounded-md bg-primary" />
                    <div className="rounded-md bg-secondary" />
                    <div className="rounded-md bg-accent" />
                    <div className="rounded-md bg-neutral" />
                  </div>
                  {isActive && (
                    <div className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-primary text-primary-content shadow">
                      <Check className="size-3" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <span
                  className={`truncate text-center text-[11px] font-medium ${
                    isActive ? "text-primary" : "text-base-content/70"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
