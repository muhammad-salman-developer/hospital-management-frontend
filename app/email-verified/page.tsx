"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailVerifiedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get("status")

  const content = {
    success: {
      icon: <CheckCircle2 className="w-9 h-9 text-blue-300" strokeWidth={1.5} />,
      title: "Email Verified!",
      message:
        "Your email has been successfully verified. You can now log in to your account.",
    },
    "already-verified": {
      icon: <AlertCircle className="w-9 h-9 text-blue-300" strokeWidth={1.5} />,
      title: "Already Verified",
      message:
        "This email address has already been verified. You can log in to your account.",
    },
    invalid: {
      icon: <XCircle className="w-9 h-9 text-blue-300" strokeWidth={1.5} />,
      title: "Invalid or Expired Link",
      message:
        "This verification link is invalid or has expired. Please request a new one.",
    },
  }

  const current =
    content[status as keyof typeof content] ?? content.invalid

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.3)] p-8">
        {/* Icon Circle */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-blue-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(96,165,250,0.6)]">
            {current.icon}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-white tracking-wide">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-blue-100/70">
            {current.message}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/login")}
            className="w-full rounded-full bg-blue-600/80 hover:bg-blue-500 text-white tracking-wider font-medium py-6 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30 cursor-pointer"
          >
            GO TO LOGIN
          </Button>

          {status === "invalid" && (
            <Button
              variant="outline"
              onClick={() => router.push("/resend-verification")}
              className="w-full rounded-full bg-transparent hover:bg-blue-950/50 text-blue-200 tracking-wider font-medium py-6 border border-blue-400/30 cursor-pointer"
            >
              RESEND VERIFICATION EMAIL
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
