import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
    // sync to server if authenticated (non-blocking)
    const auth = useAuthStore.getState();
    if (auth.authUser) {
      auth.syncThemeToServer(theme);
    }
  },
}));