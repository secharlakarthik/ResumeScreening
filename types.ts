import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { BrainCircuit, Mail, Lock, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export const ForgotPassword: React.FC = () => {
  const { apiFetch, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Reset form states
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please input your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
      showToast("Simulation: Password reset email dispatched!", "success");
    } catch (err: any) {
      setError(err.message || "Email address not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword) {
      setError("Please input the validation code and your new password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, tempToken: code, newPassword }),
      });
      setResetCompleted(true);
      showToast("Password reset successfully verified!", "success");
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-left">
      <div className="w-full max-w-md glass-panel border border-gray-200/80 dark:border-gray-850 p-8 rounded-3xl shadow-2xl bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 brand-gradient opacity-5 rounded-full blur-2xl" />
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <span className="p-2 rounded-xl bg-emerald-500 text-white flex items-center justify-center w-fit">
            <BrainCircuit className="w-6 h-6" />
          </span>
          <h1 className="text-xl font-display font-extrabold mt-1">Workspace Security</h1>
          <p className="text-xs text-gray-400">Recover your account settings</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-500/10 rounded-xl">
            {error}
          </div>
        )}

        {/* Phase 3: Final Reset Completion Success */}
        {resetCompleted ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
            <div>
              <h2 className="text-base font-bold">Password Reset Completed</h2>
              <p className="text-xs text-gray-400 mt-1">Your credentials have been updated. You can now sign in with your new password.</p>
            </div>
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-4 rounded-xl brand-gradient hover:brand-gradient-hover text-xs mt-3 shadow-md"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : !success ? (
          /* Phase 1: Request Email Reset */
          <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-email" className="text-xs font-bold text-gray-700 dark:text-gray-300">Registered Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@workspace.com"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/35 placeholder-gray-400"
                />
              </div>
              <p className="text-[10px] text-gray-400">We will simulate sending a 6-digit reset verification token directly to this inbox.</p>
            </div>

            <button
              id="request-reset-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-4 rounded-xl brand-gradient hover:brand-gradient-hover disabled:opacity-50 text-xs shadow-md shadow-emerald-500/10 mt-1"
            >
              {loading ? "Sending..." : "Request Reset Instructions"}
            </button>

            <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-2 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </form>
        ) : (
          /* Phase 2: Enter code and verify new password */
          <form onSubmit={handleCompleteReset} className="flex flex-col gap-4">
            <div className="p-3 text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/10 rounded-xl leading-relaxed">
              <b>Simulation Mode:</b> Since this is a test sandbox, we have auto-generated the temporary token <b>RESET2026</b>. Enter it below to proceed.
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-code" className="text-xs font-bold text-gray-700 dark:text-gray-300">Verification Code</label>
              <input
                id="reset-code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="RESET2026"
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/35 font-mono uppercase"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-new-password" className="text-xs font-bold text-gray-700 dark:text-gray-300">New Secure Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="reset-new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/35"
                />
              </div>
            </div>

            <button
              id="complete-reset-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-4 rounded-xl brand-gradient hover:brand-gradient-hover disabled:opacity-50 text-xs shadow-md mt-1"
            >
              {loading ? "Verifying..." : "Confirm New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
