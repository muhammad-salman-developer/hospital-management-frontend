"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
    } catch {
      // error context mein handle ho chuka hai
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071E2B] px-4 py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#36B9A6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#36B9A6]/5 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#082C3C] p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
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
          Create an Account
        </h1>
        <p className="mt-1 text-center text-sm text-slate-400">
          Register to start booking appointments
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {/* Name */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-[#36B9A6]/50">
            <User className="size-4 shrink-0 text-[#36B9A6]" />
            <Input
              id="name"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="h-auto border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus-visible:ring-0"
            />
          </div>

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

          {/* Phone */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-[#36B9A6]/50">
            <Phone className="size-4 shrink-0 text-[#36B9A6]" />
            <Input
              id="phone_number"
              name="phone_number"
              placeholder="Phone Number"
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

          {/* Confirm Password */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-[#36B9A6]/50">
            <Lock className="size-4 shrink-0 text-[#36B9A6]" />
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="h-auto border-0 bg-transparent p-0 text-white placeholder:text-slate-500 shadow-none focus-visible:ring-0 dark:bg-transparent focus:bg-transparent!"
            />
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-[#36B9A6] py-6 font-semibold tracking-wide text-[#071E2B] transition-all hover:bg-[#6ED6C5]  disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#36B9A6] hover:text-[#6ED6C5]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}