import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import rotaryLogo from '../assets/WhatsApp Image 2026-04-27 at 15.27.48.jpeg';

export default function LaunchOverlay({ onLaunch }) {
    const [isLaunching, setIsLaunching] = useState(false);

    const handleLaunch = () => {
        setIsLaunching(true);

        // Celebration effect
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Confetti bursts from random positions
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Transition to main site after celebration
        setTimeout(() => {
            onLaunch();
        }, 3500);
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0518] overflow-hidden"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[120px]"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.1 }}
                        className="relative group mb-12"
                    >
                        {/* Elegant Glow Backdrop */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                        
                        {/* The Plaque */}
                        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-[1.5rem] shadow-2xl overflow-hidden">
                            <div className="bg-white rounded-[1.2rem] p-6 shadow-inner flex flex-col items-center border border-amber-500/10">
                                <img src={rotaryLogo} alt="Rotary Colombo Centennial" className="h-16 md:h-20 object-contain filter drop-shadow-sm brightness-105" />
                            </div>
                        </div>

                        {/* Subtle Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-amber-400 text-[8px] font-bold uppercase tracking-[0.3em] px-5 py-1.5 rounded-full shadow-2xl border border-amber-500/30 whitespace-nowrap">
                            MSME Initiative
                        </div>
                    </motion.div>

                    <div className="mb-12 text-center">
                        <h2 className="text-white text-lg md:text-xl font-extralight tracking-[0.5em] uppercase leading-tight opacity-90">
                            Experience the Unveiling
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-6"></div>
                    </div>
                    <h1 className="font-display text-6xl md:text-8xl text-white mb-8 drop-shadow-2xl">
                        Yoli <span className="text-primary-light italic text-4xl md:text-5xl block mt-2">Your Launch To Opportunity</span>
                    </h1>
                </motion.div>

                {!isLaunching ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.6
                        }}
                        className="relative group"
                    >
                        {/* Pulse effect rings */}
                        <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl group-hover:bg-primary/60 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-secondary/30 rounded-full blur-2xl group-hover:bg-secondary/50 transition-all duration-500 animate-pulse delay-700" />

                        <button
                            onClick={handleLaunch}
                            className="relative px-12 py-6 bg-white text-[#0a0518] rounded-full font-bold text-2xl tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:scale-110 active:scale-95 transition-all duration-300 overflow-hidden group"
                        >
                            <span className="relative z-10">LAUNCH</span>
                            <motion.div
                                className="absolute inset-0 bg-primary-light opacity-0 group-hover:opacity-20 transition-opacity"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        className="text-white"
                    >
                        <h2 className="text-4xl md:text-6xl font-display italic">The Collection is Now Live</h2>
                    </motion.div>
                )}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1.2 }}
                    className="mt-12 text-gray-400 max-w-md text-sm"
                >
                    Explore our curated selection of premium products, where elegance meets authenticity.
                </motion.p>
            </div>

            {/* Custom SVG particles for extra flair */}
            {!isLaunching && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                                opacity: Math.random() * 0.5
                            }}
                            animate={{
                                y: [null, '-=100'],
                                opacity: [null, 0]
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}
