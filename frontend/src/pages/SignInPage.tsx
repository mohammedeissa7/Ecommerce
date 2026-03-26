import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Redirect if already signed in
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // Clear store error when user starts typing
  useEffect(() => {
    if (error) clearError();
  }, [email, password]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const canSubmit = emailValid && passwordValid && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-['Jost',sans-serif]">
      {/* ── Left panel — editorial image side ── */}
      <div className="hidden lg:flex relative overflow-hidden bg-stone-100">
        {/* Background texture */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80')",
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/60 via-stone-800/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Brand mark */}
          <div>
            <span
              className="text-white text-2xl tracking-[0.4em] uppercase font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Eissa
            </span>
          </div>

          {/* Quote */}
          <div className="space-y-4">
            <p
              className="text-white/90 text-3xl leading-snug font-light max-w-xs"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              "Elegance is not about being noticed, it's about being
              remembered."
            </p>
            <p className="text-white/40 text-[11px] tracking-[0.25em] uppercase">
              — Giorgio Armani
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex items-center justify-center bg-white px-6 py-16 lg:px-16">
        <div className="w-full max-w-[400px] space-y-10">
          {/* Header */}
          <div className="space-y-2">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8">
              <span
                className="text-stone-900 text-xl tracking-[0.4em] uppercase font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Eissa
              </span>
            </div>
            <h1
              className="text-[28px] text-stone-900 font-light tracking-wide leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Welcome back
            </h1>
            <p className="text-stone-400 text-[12px] tracking-[0.1em]">
              Sign in to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@example.com"
                className={cn(
                  "rounded-none border-0 border-b bg-transparent px-0 h-10 text-stone-900 text-sm tracking-wide placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-900 transition-colors duration-200",
                  touched.email && !emailValid
                    ? "border-red-400"
                    : "border-stone-200",
                )}
              />
              {touched.email && !emailValid && (
                <p className="text-red-400 text-[11px] tracking-wide">
                  Please enter a valid email.
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium"
                >
                  Password
                </Label>
                
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  className={cn(
                    "rounded-none border-0 border-b bg-transparent px-0 h-10 text-stone-900 text-sm tracking-widest placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-900 transition-colors duration-200 pr-8",
                    touched.password && !passwordValid
                      ? "border-red-400"
                      : "border-stone-200",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={15} strokeWidth={1.5} />
                  ) : (
                    <Eye size={15} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {touched.password && !passwordValid && (
                <p className="text-red-400 text-[11px] tracking-wide">
                  Password must be at least 6 characters.
                </p>
              )}
            </div>

            {/* API error */}
            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-red-500 text-[11px] tracking-wide">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-none bg-stone-900 hover:bg-stone-700 text-white h-12 text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 group disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  Sign In
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-stone-300">
              or
            </span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          {/* Create account */}
          <p className="text-center text-[11px] tracking-[0.1em] text-stone-400">
            New to Eissa?{" "}
            <Link
              to="/signup"
              className="text-stone-900 underline underline-offset-4 hover:text-stone-600 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
