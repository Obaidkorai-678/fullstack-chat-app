
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

import { Loader as Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import StatusViewer from "./components/StatusViewer";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div
        data-theme={theme}
        className="flex h-screen items-center justify-center bg-base-200 text-base-content"
      >
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
<div data-theme={theme} className="flex h-screen flex-col overflow-hidden">
      
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN APP AREA */}
      <div className="flex flex-1 overflow-hidden">
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
                  <PageWrapper><SignUpPage /></PageWrapper>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !authUser ? (
                  <PageWrapper><LoginPage /></PageWrapper>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
            <Route path="/profile" element={authUser ? <PageWrapper><ProfilePage /></PageWrapper> : <Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </div>

      <Toaster position="top-right" />
      <StatusViewer />
    </div>
  );
};

export default App;