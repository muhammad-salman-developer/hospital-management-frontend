"use client"

import { motion } from "framer-motion"

export default function AdminLoadingScreen() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#361221]">
            {/* Spinner */}
            <div className="relative flex size-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#42182b]" />
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#36B9A6]"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Animated HMS text */}
            <div className="mt-6 flex items-center gap-1">
                {"Health Care".split("").map((letter, index) => (
                    <motion.span
                        key={index}
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0.3, y: 0 }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.15,
                            ease: "easeInOut",
                        }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </div>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white">
                Loading Admin Panel
            </p>
        </div>
    )
}