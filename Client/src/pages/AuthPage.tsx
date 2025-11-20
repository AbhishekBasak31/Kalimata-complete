// src/pages/Auth/Auth.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/Hook"; // adjust path if needed
import { loginUser, clearAuthError, fetchMe } from "../Store/AuthSlice";
import type { AppDispatch } from "../Store/Store";

import { Eye, EyeOff } from "lucide-react";

const Auth: React.FC = () => {
  const dispatch = useAppDispatch() as AppDispatch;
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    dispatch(clearAuthError());
    // Attempt to restore session on mount (no-op if unauthenticated)
    dispatch(fetchMe());

    // load saved email if user selected remember me earlier
    const savedEmail = typeof window !== "undefined" ? localStorage.getItem("rememberEmail") : null;
    const savedPassword = typeof window !== "undefined" ? localStorage.getItem("rememberPassword") : null;

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  if (savedPassword) {
      setPassword(savedPassword);
      setRememberMe(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter email and password");
      return;
    }

    try {
      const userRes = await dispatch(loginUser({ email, password })).unwrap();

      // persist email to localStorage if rememberMe checked
      if (rememberMe) {
        try {
          localStorage.setItem("rememberEmail", email);
          localStorage.setItem("rememberPassword", password);

        } catch {
          // ignore localStorage errors silently
        }
      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.setItem("rememberPassword", password);
      }

      // login successful and store updated via slice
      navigate("/admin/dashboard");
    } catch (err: any) {
      // err is the rejected value (string) from thunk or an Error
      const message = typeof err === "string" ? err : err?.message ?? "Login failed";
      setLocalError(message);
    }
  };

  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in</h2>
          <p className="text-sm text-gray-300 mb-6">Sign in with your email and password.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="auth-email" className="text-sm text-gray-300 block">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-400"
                placeholder="you@example.com"
                required
                aria-required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="text-sm text-gray-300 block">
                Password
              </label>

              <div className="mt-1 relative">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-400 pr-12"
                  placeholder="Your password"
                  required
                  aria-required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-400 bg-transparent"
                />
                <span>Remember me</span>
              </label>

              {/* optional place for a forgot password link */}
              <div>
                <a
                  href="/auth/forgot"
                  className="text-xs text-gray-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {(localError || error) && (
              <div className="text-red-400 text-sm">
                {localError ?? error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="text-xs text-gray-400 mt-4">
            By signing in you agree to the terms. (Demo)
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
