import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Check,
  Palette,
  Bell,
  Keyboard,
  Eye,
  Sparkles,
  Shield,
  Monitor,
} from "lucide-react";
import toast from "react-hot-toast";

const PRIVACY_OPTIONS = [
  { value: "everyone", label: "Everyone" },
  { value: "contacts", label: "Contacts Only" },
  { value: "nobody", label: "Nobody" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, updatePreferences, updatePrivacy } = useAuthStore();

  const handleThemeChange = (t) => {
    setTheme(t);
    toast.success(
      `${THEMES.find((x) => x.id === t)?.label || t} theme applied`,
      { duration: 1500 }
    );
  };

  const handlePrefChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  const handlePrivacyChange = (key, value) => {
    updatePrivacy({ [key]: value });
  };

  const prefs = authUser?.preferences || {
    soundEnabled: true,
    enterToSend: true,
    showTypingIndicators: true,
    messageAnimations: true,
    showOnlineStatus: true,
  };

  const privacy = authUser?.privacy || {
    lastSeenVisibility: "everyone",
    onlineStatusVisibility: "everyone",
  };

  return (
<div className="min-h-screen w-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 flex justify-center">     
  
<div className="w-full max-w-5xl space-y-6 pb-10">
        {/* THEMES */}
        <div className="w-full rounded-3xl bg-base-100/60 border border-base-content/10 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/15">
              <Palette className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold">Appearance</h2>
              <p className="text-sm text-base-content/60">Choose a curated theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {THEMES.map((t) => {
              const isActive = theme === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`group relative flex flex-col gap-2 rounded-2xl border p-2.5 text-left transition-all ${
                    isActive
                      ? "border-primary/50 ring-2 ring-primary/25"
                      : "border-base-content/10 hover:border-base-content/25"
                  }`}
                >
                  <div
                    className="relative h-14 w-full overflow-hidden rounded-xl"
                    data-theme={t.id}
                  >
                    <div className="grid h-full grid-cols-3 gap-1 bg-base-100 p-1.5">
                      <div
                        className="rounded-md"
                        style={{ background: t.swatch[1] }}
                      />
                      <div className="rounded-md bg-base-300" />
                      <div
                        className="rounded-md"
                        style={{ background: t.swatch[2] }}
                      />
                    </div>

                    {isActive && (
                      <div className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-primary text-primary-content shadow">
                        <Check className="size-3" />
                      </div>
                    )}
                  </div>

                  <span
                    className={`truncate text-center text-xs font-medium ${
                      isActive ? "text-primary" : "text-base-content/70"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT PREFERENCES */}
        <div className="rounded-3xl p-6 sm:p-8 bg-base-100/60 border border-base-content/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-secondary/15">
              <Sparkles className="size-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold">
                Chat Preferences
              </h2>
              <p className="text-sm text-base-content/60">
                Personalize your messaging experience
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <ToggleRow
              icon={Bell}
              label="Sound Effects"
              description="Play sound on new messages"
              value={prefs.soundEnabled}
              onChange={(v) => handlePrefChange("soundEnabled", v)}
            />
            <ToggleRow
              icon={Keyboard}
              label="Enter to Send"
              description="Press Enter to send messages"
              value={prefs.enterToSend}
              onChange={(v) => handlePrefChange("enterToSend", v)}
            />
            <ToggleRow
              icon={Eye}
              label="Typing Indicators"
              description="Show when others are typing"
              value={prefs.showTypingIndicators}
              onChange={(v) => handlePrefChange("showTypingIndicators", v)}
            />
            <ToggleRow
              icon={Sparkles}
              label="Message Animations"
              description="Animate messages"
              value={prefs.messageAnimations}
              onChange={(v) => handlePrefChange("messageAnimations", v)}
            />
            <ToggleRow
              icon={Monitor}
              label="Show Online Status"
              description="Let others see when you're online"
              value={prefs.showOnlineStatus}
              onChange={(v) => handlePrefChange("showOnlineStatus", v)}
            />
          </div>
        </div>

        {/* PRIVACY */}
        <div className="rounded-3xl p-6 sm:p-8 bg-base-100/60 border border-base-content/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-accent/15">
              <Shield className="size-5 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold">Privacy</h2>
              <p className="text-sm text-base-content/60">
                Control who can see your activity
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <SelectRow
              label="Last Seen"
              description="Who can see your last activity"
              options={PRIVACY_OPTIONS}
              value={privacy.lastSeenVisibility}
              onChange={(v) =>
                handlePrivacyChange("lastSeenVisibility", v)
              }
            />

            <SelectRow
              label="Online Status"
              description="Who can see your online status"
              options={PRIVACY_OPTIONS}
              value={privacy.onlineStatusVisibility}
              onChange={(v) =>
                handlePrivacyChange("onlineStatusVisibility", v)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* TOGGLE ROW */
const ToggleRow = ({ icon: Icon, label, description, value, onChange }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl p-3 sm:p-4 hover:bg-base-content/5 transition-colors">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-base-content/5">
        <Icon className="size-4 text-base-content/60" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">{label}</p>
        <p className="text-xs text-base-content/50 break-words">
          {description}
        </p>
      </div>
    </div>

    <button
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        value ? "bg-primary" : "bg-base-300"
      }`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-base-100 shadow transition-transform ${
          value ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

/* SELECT ROW */
const SelectRow = ({ label, description, options, value, onChange }) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl p-3 hover:bg-base-content/5">
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-base-content/50">{description}</p>
    </div>

    <div className="flex gap-1 rounded-2xl bg-base-200/60 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-xl px-3 py-1.5 text-xs font-medium ${
            value === o.value
              ? "bg-primary text-primary-content shadow"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

export default SettingsPage;