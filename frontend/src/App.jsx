import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import PageWrapper from "./components/PageWrapper";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div
        data-theme={theme}
        className="flex flex-col items-center justify-center h-screen gap-4 bg-base-200 text-base-content"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl" />
          <div className="relative size-16 rounded-3xl panel flex items-center justify-center">
            <Loader2 className="size-7 animate-spin text-primary" />
          </div>
        </div>
        <p className="text-sm text-base-content/60 tracking-wide">
          Connecting you to your conversations…
        </p>
      </div>
    );

  return (
    <div
      data-theme={theme}
      className="relative min-h-screen overflow-hidden bg-base-200 text-base-content"
    >
      {/* Ambient animated glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="glow-blob animate-float-slow -top-32 -left-24 size-[28rem] bg-primary" />
        <div className="glow-blob animate-float-slow-2 top-1/3 -right-24 size-[26rem] bg-secondary" />
        <div className="glow-blob animate-float-slow bottom-0 left-1/3 size-[22rem] bg-accent" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={
                !authUser ? (
                  <PageWrapper>
                    <SignUpPage />
                  </PageWrapper>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !authUser ? (
                  <PageWrapper>
                    <LoginPage />
                  </PageWrapper>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/settings"
              element={
                <PageWrapper>
                  <SettingsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                authUser ? (
                  <PageWrapper>
                    <ProfilePage />
                  </PageWrapper>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Toast system (global) */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "16px",
            background: "hsl(var(--b1))",
            color: "hsl(var(--bc))",
            border: "1px solid color-mix(in oklab, hsl(var(--bc)) 10%, transparent)",
          },
        }}
      />
    </div>
  );
};

export default App;
