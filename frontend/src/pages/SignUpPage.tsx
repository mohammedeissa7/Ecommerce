import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, Check, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // Clear API error when user edits any field
  useEffect(() => {
    if (error) clearError();
  }, [form.name, form.email, form.password]);

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const blur = (field: keyof typeof touched) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  //  Validation
  const nameValid = form.name.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordRulesPassed = PASSWORD_RULES.every((r) =>
    r.test(form.password),
  );
  const canSubmit =
    nameValid && emailValid && passwordRulesPassed && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (!canSubmit) return;
    try {
      // Calls POST /auth/signup → { name, email, password }
      await signUp(form.name.trim(), form.email, form.password);
      // On success store sets isAuthenticated=true → useEffect above redirects
    } catch {
      // Error is already stored in useAuthStore — no extra handling needed
    }
  };

  const passedCount = PASSWORD_RULES.filter((r) =>
    r.test(form.password),
  ).length;
  const strengthWidth = `${(passedCount / PASSWORD_RULES.length) * 100}%`;
  const strengthColor =
    passedCount === 0
      ? "bg-stone-200"
      : passedCount === 1
        ? "bg-red-400"
        : passedCount === 2
          ? "bg-amber-400"
          : "bg-emerald-500";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-['Jost',sans-serif]">
      {/* Left — image panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-stone-900">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8s] hover:scale-100"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Brand */}
          <Link to="/" className="w-fit">
            <span
              className="text-white text-2xl tracking-[0.4em] uppercase font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Eissa
            </span>
            <p className="text-white/40 text-[9px] tracking-[0.5em] uppercase mt-0.5 font-light">
              Paris
            </p>
          </Link>

          {/* Bottom copy */}
          <div className="space-y-5">
            <div className="w-8 h-px bg-white/30" />
            <p
              className="text-white/90 text-[32px] leading-[1.2] font-light max-w-sm"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Begin your story with us.
            </p>
            <p className="text-white/40 text-[11px] tracking-[0.2em] leading-relaxed max-w-xs uppercase">
              Members receive early access to new collections, exclusive offers
              & curated edits.
            </p>

            {/* Perks */}
            <ul className="space-y-2 pt-2">
              {[
                "Free shipping on every order",
                "Early access to new arrivals",
                "Exclusive member-only sales",
              ].map((perk) => (
                <li key={perk} className="flex items-center gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-white/50 text-[10px] tracking-[0.15em] uppercase">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right — form panel  */}
      <div className="flex items-center justify-center bg-white px-6 py-16 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link to="/">
              <span
                className="text-stone-900 text-xl tracking-[0.4em] uppercase font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Eissa
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1
              className="text-[30px] text-stone-900 font-light tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Create account
            </h1>
            <p className="text-stone-400 text-[12px] tracking-[0.08em]">
              Join Eissa and enjoy exclusive member benefits.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full name */}
            <div className="space-y-2">
              <Label className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium">
                Full Name
              </Label>
              <Input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
                onBlur={blur("name")}
                placeholder="Your full name"
                className={cn(
                  "rounded-none border-0 border-b bg-transparent px-0 h-10 text-stone-900 text-sm tracking-wide placeholder:text-stone-300 focus-visible:ring-0 transition-colors duration-200",
                  touched.name && !nameValid
                    ? "border-red-400"
                    : "border-stone-200 focus-visible:border-stone-900",
                )}
              />
              {touched.name && !nameValid && (
                <p className="text-red-400 text-[11px] tracking-wide">
                  Please enter your full name.
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium">
                Email Address
              </Label>
              <Input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                onBlur={blur("email")}
                placeholder="you@example.com"
                className={cn(
                  "rounded-none border-0 border-b bg-transparent px-0 h-10 text-stone-900 text-sm tracking-wide placeholder:text-stone-300 focus-visible:ring-0 transition-colors duration-200",
                  touched.email && !emailValid
                    ? "border-red-400"
                    : "border-stone-200 focus-visible:border-stone-900",
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
              <Label className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update("password")}
                  onBlur={() => {
                    blur("password")();
                    setPasswordFocused(false);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  placeholder="••••••••"
                  className={cn(
                    "rounded-none border-0 border-b bg-transparent px-0 h-10 text-stone-900 text-sm tracking-widest placeholder:text-stone-300 focus-visible:ring-0 transition-colors duration-200 pr-8",
                    touched.password && !passwordRulesPassed
                      ? "border-red-400"
                      : "border-stone-200 focus-visible:border-stone-900",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={15} strokeWidth={1.5} />
                  ) : (
                    <Eye size={15} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="h-px w-full bg-stone-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        strengthColor,
                      )}
                      style={{ width: strengthWidth }}
                    />
                  </div>

                  {/* Rules checklist — visible when focused or has content */}
                  {(passwordFocused || touched.password) && (
                    <ul className="space-y-1 pt-0.5">
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(form.password);
                        return (
                          <li
                            key={rule.label}
                            className="flex items-center gap-2"
                          >
                            {passed ? (
                              <Check
                                size={11}
                                className="text-emerald-500 flex-shrink-0"
                              />
                            ) : (
                              <X
                                size={11}
                                className="text-stone-300 flex-shrink-0"
                              />
                            )}
                            <span
                              className={cn(
                                "text-[10px] tracking-wide",
                                passed ? "text-stone-400" : "text-stone-300",
                              )}
                            >
                              {rule.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* API error — maps to your backend's { message } shape */}
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
              className="w-full rounded-none bg-stone-900 hover:bg-stone-700 text-white h-12 text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 group disabled:opacity-40 mt-2"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  Create Account
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

          {/* Sign in link */}
          <p className="text-center text-[11px] tracking-[0.1em] text-stone-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-stone-900 underline underline-offset-4 hover:text-stone-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
