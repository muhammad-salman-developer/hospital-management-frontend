"use client"

import { useRouter } from "next/navigation"
import { MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071E2B] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#36B9A6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#36B9A6]/5 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#082C3C] p-8 shadow-2xl">
        {/* Icon Circle */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#36B9A6]/40 shadow-[0_0_25px_rgba(54,185,166,0.25)]">
            <MailCheck
              className="h-9 w-9 text-[#36B9A6]"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold tracking-wide text-white">
            Verify Your Email
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            We&apos;ve sent a verification link to your email address.
            Please check your inbox and click the link to activate your
            account.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/login")}
            className="w-full cursor-pointer rounded-full border border-[#36B9A6]/30 bg-[#36B9A6] py-6 font-semibold tracking-wider text-[#071E2B] transition-all hover:bg-[#6ED6C5]"
          >
            GO TO LOGIN
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/resend-verification")}
            className="w-full cursor-pointer rounded-full border border-[#36B9A6]/30 bg-transparent py-6 font-medium tracking-wider text-[#36B9A6] transition-colors hover:bg-[#36B9A6]/10 hover:text-[#6ED6C5]"
          >
            DIDN&apos;T RECEIVE THE EMAIL? RESEND
          </Button>
        </div>
      </div>
    </div>
  )
}