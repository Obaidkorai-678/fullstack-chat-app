

import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const { pathname } = useLocation();

  const navItem = (active) =>
    `inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-medium
     transition-all duration-300 lift
     ${
       active
         ? "bg-primary text-primary-content shadow-lg shadow-primary/25"
         : "text-base-content/70 hover:text-base-content hover:bg-base-content/5"
     }`;

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="glass-strong border-b border-base-content/5">
<div className="w-full h-16 px-4">
            <div className="flex items-center justify-between h-full">
            {/* Brand */}
            <Link
              to="/"
              onClick={() => setSelectedUser(null)}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-primary/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative size-10 rounded-2xl bg-primary/15 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col leading-none">
                <h1 className="font-display text-lg font-extrabold tracking-tight">
                  Chat<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">
  App
</span>
                </h1>
                <span className="text-[10px] uppercase tracking-[0.25em] text-base-content/40 font-semibold">
                  Realtime
                </span>
              </div>
            </Link>

            {/* Actions */}
            {authUser && (
              <nav className="flex items-center gap-1.5">
                <Link to="/settings" className={navItem(pathname === "/settings")}>
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <Link to="/profile" className={navItem(pathname === "/profile")}>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-medium text-error/80 hover:text-error hover:bg-error/10 transition-all duration-300 lift"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;