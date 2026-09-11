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
        err.response?.data?.message || "Something went wrong. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.3)] p-8">
        {/* Icon Circle */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-blue-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(96,165,250,0.6)]">
            {sent ? (
              <MailCheck className="w-9 h-9 text-blue-300" strokeWidth={1.5} />
            ) : (
              <Mail className="w-9 h-9 text-blue-300" strokeWidth={1.5} />
            )}
          </div>
        </div>

        {sent ? (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white tracking-wide">
              Check Your Email
            </h1>
            <p className="mt-2 text-sm text-blue-100/70">
              We&apos;ve sent a new verification link to{" "}
              <span className="text-blue-300">{email}</span>. Please check
              your inbox.
            </p>

            <Button
              onClick={() => router.push("/login")}
              className="w-full mt-6 rounded-full bg-blue-600/80 hover:bg-blue-500 text-white tracking-wider font-medium py-6 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30"
            >
              GO TO LOGIN
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-semibold text-white tracking-wide">
                Resend Verification Email
              </h1>
              <p className="mt-2 text-sm text-blue-100/70">
                Enter your email address and we&apos;ll send you a new
                verification link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 rounded-full bg-blue-950/50 border border-blue-400/20 px-4 py-3">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 bg-transparent text-white placeholder:text-blue-200/60 focus-visible:ring-0 h-auto p-0"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blue-600/80 hover:bg-blue-500 text-white tracking-wider font-medium py-6 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30"
              >
                {loading ? "SENDING..." : "SEND VERIFICATION LINK"}
              </Button>
            </form>
          </>
        )}

        <p className="text-xs text-center mt-6 text-blue-100/70">
          Remembered your account is verified?{" "}
          <a href="/login" className="text-blue-300 underline hover:text-blue-200">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
