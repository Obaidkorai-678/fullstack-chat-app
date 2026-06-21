


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
    <div className="min-h-screen flex">
      
      {/* LEFT FORM */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-10">
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
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 pl-11 pr-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 pl-11 pr-11 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
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
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-content"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="animate-spin size-5" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <p className="mt-6 text-center text-sm text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold">
                Create account
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:flex flex-1">
        <AuthImagePattern
          title="Welcome back!"
          subtitle="Sign in to continue your conversations and catch up with your messages."
        />
      </div>

    </div>
  );
};

export default LoginPage;