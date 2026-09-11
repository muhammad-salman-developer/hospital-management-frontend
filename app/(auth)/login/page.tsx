"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react";
import Link from "next/link";


export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form);
    } catch {
      // error context mein handle ho chuka hai
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.3)] p-8">
        {/* Icon Circle */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-blue-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(96,165,250,0.6)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5v-9z"
              />
            </svg>
          </div>
        </div>

        {/* {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 rounded-full bg-blue-950/50 border border-blue-400/20 px-4 py-3">
            <User className="w-4 h-4 text-blue-300 shrink-0" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="border-0 bg-transparent text-white placeholder:text-blue-200/60 focus-visible:ring-0 h-auto p-0"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 rounded-full bg-blue-950/50 border border-blue-400/20 px-4 py-3">
            <Lock className="w-4 h-4 text-blue-300 shrink-0" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="border-0  bg-accent-foreground text-white placeholder:text-blue-200/60 focus-visible:ring-0 h-auto p-0 focus:bg-transparent! shadow-none dark:bg-transparent"
            />
          </div>

          {/* Remember me / Forgot password */}
          <div className="flex items-center justify-between text-xs text-blue-100/80 px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded accent-blue-400 w-3.5 h-3.5"
              />
              Remember mez
            </label>
            <a href="#" className="italic hover:text-blue-300 transition">
              Forgot Password?
            </a>
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
              {error.includes("verify your email") && (
                <Link href="/resend-verification" className="ml-1 underline">
                  Resend verification email
                </Link>
              )}
            </div>
          )}
          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-600/80 hover:bg-blue-500 text-white tracking-wider font-medium py-6 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </Button>
        </form>

        <p className="text-xs text-center mt-6 text-blue-100/70">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-300 underline hover:text-blue-200">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}