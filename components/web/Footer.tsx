"use client"

import Link from "next/link"
import {
    Mail,
    MapPin,
    Phone,
} from "lucide-react"

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
} from "react-icons/fa"

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#071E2B] text-white">

            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Column 1 - Logo & Description */}
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#36B9A6]">
                                <span className="text-lg font-bold text-[#071E2B]">
                                    H
                                </span>
                            </div>

                            <span className="text-xl font-semibold tracking-tight">
                                HMS
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
                            A modern hospital management system designed to
                            make healthcare simple, accessible, and convenient
                            for patients and healthcare professionals.
                        </p>

                        {/* Social Links */}
                        <div className="mt-6 flex items-center gap-3">
                            <Link
                                href="#"
                                aria-label="Facebook"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#36B9A6]/40 hover:bg-[#36B9A6]/10 hover:text-[#36B9A6]"
                            >
                                <FaFacebookF className="h-4 w-4" />
                            </Link>

                            <Link
                                href="#"
                                aria-label="Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#36B9A6]/40 hover:bg-[#36B9A6]/10 hover:text-[#36B9A6]"
                            >
                                <FaInstagram className="h-4 w-4" />
                            </Link>

                            <Link
                                href="#"
                                aria-label="Twitter"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#36B9A6]/40 hover:bg-[#36B9A6]/10 hover:text-[#36B9A6]"
                            >
                                <FaTwitter className="h-4 w-4" />
                            </Link>

                            <Link
                                href="#"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#36B9A6]/40 hover:bg-[#36B9A6]/10 hover:text-[#36B9A6]"
                            >
                                <FaLinkedinIn className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h3>

                        <ul className="mt-5 space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/doctors"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Doctors
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - Services */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Services
                        </h3>

                        <ul className="mt-5 space-y-3">
                            <li>
                                <Link
                                    href="/doctors"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Find a Doctor
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/appointments"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Book Appointment
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/departments"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Medical Departments
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/records"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Medical Records
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/prescriptions"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    Prescriptions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 - Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Contact Us
                        </h3>

                        <ul className="mt-5 space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#36B9A6]" />

                                <span className="text-sm leading-6 text-white/55">
                                    123 Healthcare Avenue,
                                    <br />
                                    Karachi, Pakistan
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-[#36B9A6]" />

                                <a
                                    href="tel:+923001234567"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    +92 300 1234567
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-[#36B9A6]" />

                                <a
                                    href="mailto:info@hms.com"
                                    className="text-sm text-white/55 transition hover:text-[#36B9A6]"
                                >
                                    info@hms.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row lg:px-8">

                    <p className="text-center text-xs text-white/40 sm:text-left">
                        © {new Date().getFullYear()} Hospital Management
                        System. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <Link
                            href="/privacy"
                            className="text-xs text-white/40 transition hover:text-[#36B9A6]"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="text-xs text-white/40 transition hover:text-[#36B9A6]"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

        </footer>
    )
}

