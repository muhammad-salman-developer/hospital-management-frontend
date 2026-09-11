"use client";

import { useState } from "react";
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.3)] p-8">
        {/* Icon Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-blue-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(96,165,250,0.6)]">
            <User className="w-9 h-9 text-blue-300" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-center text-white/90 text-lg font-medium mb-6 tracking-wide">
          Patient Registration
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div className="flex items-center gap-3 rounded-full bg-blue-950/50 border border-blue-400/20 px-4 py-3">
            <User className="w-4 h-4 text-blue-300 shrink-0" />
            <Input
              id="name"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="border-0 bg-transparent text-white placeholder:text-blue-200/60 focus-visible:ring-0 h-auto p-0"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 rounded-full bg-blue-950/50 border border-blue-400/20 px-4 py-3">
            <Mail className="w-4 h-4 text-blue-300 shrink-0" />
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

          {/* Phone */}
          <div className="flex items-center gap-3 rounded-full bg-blue-950/50 border border-blue-400/20 px-4 py-3">
            <Phone className="w-4 h-4 text-blue-300 shrink-0" />
            <Input
              id="phone_number"
              name="phone_number"
              placeholder="Phone Number"
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
              className="border-0 bg-transparent text-white placeholder:text-blue-200/60 focus-visible:ring-0 h-auto p-0"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center gap-3 rounded-full bg-blue-950/50 border border-blue-400/20 px-4 py-3">
            <Lock className="w-4 h-4 text-blue-300 shrink-0" />
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="border-0 bg-transparent text-white placeholder:text-blue-200/60 focus-visible:ring-0 h-auto p-0"
            />
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-600/80 hover:bg-blue-500 text-white tracking-wider font-medium py-6 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30 mt-2"
          >
            {loading ? "REGISTERING..." : "REGISTER"}
          </Button>
        </form>

        <p className="text-xs text-center mt-6 text-blue-100/70">
          Already have an account?{" "}
          <a href="/login" className="text-blue-300 underline hover:text-blue-200">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}