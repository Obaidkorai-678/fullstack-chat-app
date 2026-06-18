import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT - FORM */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="panel rounded-4xl p-6 sm:p-8">
            {/* HEADER */}
            <div className="mb-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="grid size-14 place-items-center rounded-3xl bg-primary/15 ring-1 ring-primary/20">
                  <MessageSquare className="size-7 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-extrabold">
                  Welcome back
                </h1>
                <p className="text-sm text-base-content/60">
                  Sign in to continue your conversations
                </p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 pl-11 pr-3 text-sm outline-none transition-all focus:border-primary/50 focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-base-content/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 pl-11 pr-11 text-sm outline-none transition-all focus:border-primary/50 focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40 disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <p className="mt-6 text-center text-sm text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (ONLY DESKTOP) */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};

export default LoginPage;
