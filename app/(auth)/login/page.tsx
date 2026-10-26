"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071E2B] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#36B9A6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#36B9A6]/5 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#082C3C] p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[#36B9A6]/30">
            <Image
              src="/hmms.png"
              alt="HMS Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <h1 className="text-center text-xl font-bold text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-sm text-slate-400">
          Log in to manage your appointments
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-[#36B9A6]/50">
            <Mail className="size-4 shrink-0 text-[#36B9A6]" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="h-auto border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus-visible:ring-0"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-[#36B9A6]/50">
            <Lock className="size-4 shrink-0 text-[#36B9A6]" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="h-auto border-0 bg-transparent p-0 text-white placeholder:text-slate-500 shadow-none focus-visible:ring-0 dark:bg-transparent focus:bg-transparent!"
            />
          </div>

          {/* Remember me / Forgot password */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="size-3.5 rounded accent-[#36B9A6]"
              />
              Remember me
            </label>
            <a href="#" className="transition-colors hover:text-[#36B9A6]">
              Forgot Password?
            </a>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
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
            className="w-full rounded-full bg-[#36B9A6] py-6 font-semibold tracking-wide text-[#071E2B] transition-all hover:bg-[#6ED6C5] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-[#36B9A6] hover:text-[#6ED6C5]">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}