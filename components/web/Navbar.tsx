
"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, Stethoscope } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Doctors", href: "/doctors" },
    { name: "Contact", href: "/contact" },
]

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#071E2B]/95 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3"
                >
                    <div className="relative h-15 w-15 overflow-hidden rounded-xl">
                        <Image
                            src="/hms-logo.png"
                            alt="HMS Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* <div className="hidden sm:block">
                        <h1 className="text-lg font-bold tracking-tight text-white">
                            HMS
                        </h1>

                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Hospital Management
                        </p>
                    </div> */}
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-medium text-slate-300 transition-colors hover:text-[#36B9A6]"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link href="/login">
                        <Button
                            variant="ghost"
                            className="font-medium text-white hover:bg-white/10 hover:text-[#36B9A6]"
                        >
                            Login
                        </Button>
                    </Link>

                    <Link href="/register">
                        <Button
                            className="rounded-lg bg-[#36B9A6] px-5 font-medium text-[#071E2B] shadow-sm transition-all hover:bg-[#2FA890] hover:shadow-md"
                        >
                            Register
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger className="rounded-lg p-2 text-white transition-colors hover:bg-white/10">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-[300px] border-l border-white/10 bg-[#071E2B] px-6 text-white"
                        >
                            <SheetHeader className="border-b border-white/10 pb-5 text-left">
                                <SheetTitle className="flex items-center gap-3 text-white">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                                        <Image
                                            src="/images/hms-logo.png"
                                            alt="HMS Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div>
                                        <span className="block text-lg font-bold text-white">
                                            HMS
                                        </span>

                                        <span className="block text-[10px] font-normal uppercase tracking-wider text-slate-400">
                                            Hospital Management
                                        </span>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            {/* Mobile Links */}
                            <nav className="mt-8 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-[#36B9A6]"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Auth */}
                            <div className="mt-8 border-t border-white/10 pt-6">
                                <div className="flex flex-col gap-3">
                                    <Link href="/login">
                                        <Button
                                            variant="outline"
                                            className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-[#36B9A6]"
                                        >
                                            Login
                                        </Button>
                                    </Link>

                                    <Link href="/register">
                                        <Button
                                            className="w-full bg-[#36B9A6] text-[#071E2B] hover:bg-[#2FA890]"
                                        >
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Footer */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Stethoscope className="h-4 w-4 text-[#36B9A6]" />
                                    <span>
                                        Healthcare made simpler
                                    </span>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    )
}

