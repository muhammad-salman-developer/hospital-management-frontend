"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, MailCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/axios"

export default function ResendVerificationPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await api.post("/email/resend", { email })
      setSent(true)
      toast.success("Verification link sent successfully.")
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again."

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const cardClass =
    "w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_0_60px_rgba(59,130,246,0.3)] backdrop-blur-xl"

  const iconCircleClass =
    "flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-400/50 shadow-[0_0_25px_rgba(96,165,250,0.6)]"

  const primaryButtonClass =
    "w-full rounded-full border border-blue-400/30 bg-blue-600/80 py-6 font-medium tracking-wider text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-500"

  const secondaryButtonClass =
    "w-full rounded-full border border-blue-400/30 bg-transparent py-6 font-medium tracking-wider text-blue-200 hover:bg-blue-950/50"

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071E2B] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#36B9A6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#36B9A6]/5 blur-3xl" />

      <div className={`${cardClass} relative border border-white/10 bg-[#082C3C] shadow-2xl`}>
        {/* Icon Circle */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#36B9A6]/40 shadow-[0_0_25px_rgba(54,185,166,0.25)]">
            {sent ? (
              <MailCheck
                className="h-9 w-9 text-[#36B9A6]"
                strokeWidth={1.5}
              />
            ) : (
              <Mail
                className="h-9 w-9 text-[#36B9A6]"
                strokeWidth={1.5}
              />
            )}
          </div>
        </div>

        {sent ? (
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Check Your Email
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              We&apos;ve sent a new verification link to{" "}
              <span className="break-all font-medium text-[#36B9A6]">{email}</span>.
              Please check your inbox and spam folder.
            </p>

            <Button
              type="button"
              onClick={() => router.push("/login")}
              className={`${primaryButtonClass} mt-6`}
            >
              GO TO LOGIN
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-xl font-semibold tracking-wide text-white">
                Resend Verification Email
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Enter your email address and we&apos;ll send you a new
                verification link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-[#36B9A6]/50">
                <Mail className="h-4 w-4 shrink-0 text-[#36B9A6]" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {error && (
                <p className="text-center text-sm text-red-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={`${primaryButtonClass} w-full rounded-full bg-[#36B9A6] py-6 font-semibold tracking-wide text-[#071E2B] transition-all hover:bg-[#6ED6C5] disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {loading ? "SENDING..." : "SEND VERIFICATION LINK"}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Remembered your account is verified?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-[#36B9A6] underline transition-colors hover:text-[#6ED6C5]"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}