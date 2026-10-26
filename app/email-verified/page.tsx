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
      icon: <CheckCircle2 className="w-9 h-9 text-[#6ED6C5]" strokeWidth={1.5} />,
      title: "Email Verified!",
      message:
        "Your email has been successfully verified. You can now log in to your account.",
    },
    "already-verified": {
      icon: <AlertCircle className="w-9 h-9 text-[#6ED6C5]" strokeWidth={1.5} />,
      title: "Already Verified",
      message:
        "This email address has already been verified. You can log in to your account.",
    },
    invalid: {
      icon: <XCircle className="w-9 h-9 text-[#6ED6C5]" strokeWidth={1.5} />,
      title: "Invalid or Expired Link",
      message:
        "This verification link is invalid or has expired. Please request a new one.",
    },
  }

  const current =
    content[status as keyof typeof content] ?? content.invalid

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#071E2B] via-[#0B303C] to-[#071E2B] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[#6ED6C5]/20 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(54,185,166,0.2)] p-8">
        {/* Icon Circle */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-[#36B9A6]/50 flex items-center justify-center shadow-[0_0_25px_rgba(54,185,166,0.25)]">
            {current.icon}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-white tracking-wide">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-[#B7DAD7]">
            {current.message}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => {
              window.location.href = "/login"
            }}
            className="w-full rounded-full bg-[#36B9A6] hover:bg-[#6ED6C5] text-[#071E2B] tracking-wider font-semibold py-6 shadow-[0_0_20px_rgba(54,185,166,0.25)] border border-[#6ED6C5]/30 cursor-pointer"
          >
            GO TO LOGIN
          </Button>

          {status === "invalid" && (
            <Button
              variant="outline"
              onClick={() => router.push("/resend-verification")}
              className="w-full rounded-full bg-transparent hover:bg-[#36B9A6]/10 text-[#B7DAD7] tracking-wider font-medium py-6 border border-[#36B9A6]/30 cursor-pointer"
            >
              RESEND VERIFICATION EMAIL
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}