import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() === true) signup(formData);
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
                  Create account
                </h1>
                <p className="text-sm text-base-content/60">
                  Get started with your free account
                </p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* FULL NAME */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 pl-11 pr-3 text-sm outline-none transition-all focus:border-primary/50 focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

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
                disabled={isSigningUp}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40 disabled:opacity-60"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <p className="mt-6 text-center text-sm text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT - IMAGE (desktop only) */}
      <AuthImagePattern
        title="Stay Connected"
        subtitle="Chat instantly, share memories, and stay close to the people who matter most."
      />
    </div>
  );
};

export default SignUpPage;
