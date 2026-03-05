"use client"

import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedBrandProps {
    className?: string;
    iconSize?: number;
    textSize?: string;
    showIcon?: boolean;
}

export function AnimatedBrand({
    className,
    iconSize = 24,
    textSize = "text-xl",
    showIcon = true
}: AnimatedBrandProps) {
    const letters = "Feedback.ai".split("");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2
            },
        },
    } as any;

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 10,
            filter: "blur(4px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    } as any;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {showIcon && (
                <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1
                    }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                    <MessageSquareQuote
                        size={iconSize}
                        className="text-primary relative z-10"
                    />
                </motion.div>
            )}

            <motion.div
                className={cn("font-black tracking-tighter flex", textSize)}
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        variants={child}
                        className={cn(
                            "inline-block",
                            letter === "." && "text-primary",
                            index >= 9 && "text-primary" // ".ai" part
                        )}
                        whileHover={{
                            y: -4,
                            scale: 1.1,
                            color: "var(--primary)",
                            transition: { duration: 0.2 }
                        }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
}
