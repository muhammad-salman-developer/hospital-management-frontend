"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axios"

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)

        try {
            await api.post("/contact", form)
            toast.success("Your message has been sent. We'll get back to you soon.")
            setForm({ name: "", email: "", phone: "", subject: "", message: "" })
        } catch (error: any) {
            console.error("Failed to send message:", error)
            toast.error(
                error?.response?.data?.message ?? "Failed to send message. Please try again."
            )
        } finally {
            setSending(false)
        }
    }

    const contactDetails = [
        {
            icon: MapPin,
            label: "Address",
            value: "123 Main Street, Multan, Punjab, Pakistan",
        },
        {
            icon: Phone,
            label: "Phone",
            value: "+92 300 1234567",
        },
        {
            icon: Mail,
            label: "Email",
            value: "info@hms.com",
        },
        {
            icon: Clock,
            label: "Working Hours",
            value: "Mon – Sat: 9:00 AM – 8:00 PM",
        },
    ]

    return (
        <main className="bg-[#071E2B]">

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden py-20 sm:py-24">
                <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#36B9A6]/10 blur-3xl" />

                <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#36B9A6]">
                        Get in Touch
                    </span>

                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        We're here to help
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                        Have a question about an appointment, a department, or anything
                        else? Send us a message and our team will respond shortly.
                    </p>
                </div>
            </section>

            {/* ================= CONTACT GRID ================= */}
            <section className="pb-24 lg:mt-10">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">

                        {/* ================= CONTACT INFO ================= */}
                        <div className="lg:col-span-2">
                            <div className="flex flex-col gap-5">
                                {contactDetails.map((detail) => (
                                    <div
                                        key={detail.label}
                                        className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#082C3C] p-5"
                                    >
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#36B9A6]/10">
                                            <detail.icon className="size-5 text-[#36B9A6]" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                                {detail.label}
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-white">
                                                {detail.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Map placeholder */}
                            <div className="mt-5 h-56 overflow-hidden rounded-2xl border border-white/10 bg-[#082C3C]">
                                <iframe
                                    src="https://www.google.com/maps?q=Multan,Pakistan&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: "grayscale(0.3) invert(0.92) contrast(0.9)" }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Clinic location"
                                />
                            </div>
                        </div>

                        {/* ================= CONTACT FORM ================= */}
                        <div className="lg:col-span-3 ">
                            <form
                                onSubmit={handleSubmit}
                                className="rounded-2xl border border-white/10 bg-[#082C3C] p-6 sm:p-8 lg:p-13"
                            >
                                <h2 className="text-lg font-semibold text-white">
                                    Send us a message
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Fill out the form and we'll respond within one business day.
                                </p>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#36B9A6]/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="+92 300 1234567"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#36B9A6]/50"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#36B9A6]/50"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        placeholder="Appointment question"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#36B9A6]/50"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Tell us how we can help..."
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#36B9A6]/50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#36B9A6] py-3 text-sm font-semibold text-[#071E2B] transition-all hover:bg-[#6ED6C5] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8 cursor-pointer"
                                >
                                    {sending ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="size-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}