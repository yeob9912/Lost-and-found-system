import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    baseAlpha: number;
}

export default function PlexusBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Check reduced motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let prefersReducedMotion = mediaQuery.matches;

        const handleMotionPreference = (e: MediaQueryListEvent) => {
            prefersReducedMotion = e.matches;
        };
        mediaQuery.addEventListener("change", handleMotionPreference);

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Responsive particle density
        const getParticleCount = (w: number) => {
            if (w < 640) return 32;
            if (w < 1024) return 55;
            return 80;
        };

        let particles: Particle[] = [];
        const connectionDistance = width < 640 ? 100 : 135;
        const connectionDistSq = connectionDistance * connectionDistance;
        const mouseConnectionDist = 160;
        const mouseConnectionDistSq = mouseConnectionDist * mouseConnectionDist;

        const initParticles = () => {
            const count = getParticleCount(width);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.65,
                    vy: (Math.random() - 0.5) * 0.65,
                    radius: Math.random() * 1.8 + 1.6,
                    baseAlpha: Math.random() * 0.3 + 0.55,
                });
            }
        };

        initParticles();

        // Mouse tracking for dynamic interactive plexus reaction
        const mouse = {
            x: -1000,
            y: -1000,
            isActive: false,
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.isActive = true;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
            mouse.isActive = false;
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });

        // Animation render loop
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Node and edge color palettes based on active theme
            const nodeColor = isDark
                ? "rgba(52, 211, 153, " // Emerald-400
                : "rgba(16, 149, 107, "; // Emerald-700
            const edgeColor = isDark
                ? "52, 211, 153"
                : "16, 149, 107";
            const mouseEdgeColor = isDark
                ? "45, 212, 191" // Teal-400
                : "13, 148, 136";

            // 1. Update and draw particles (nodes)
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!prefersReducedMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Bounce off viewport boundaries smoothly
                    if (p.x < 0) {
                        p.x = 0;
                        p.vx *= -1;
                    } else if (p.x > width) {
                        p.x = width;
                        p.vx *= -1;
                    }

                    if (p.y < 0) {
                        p.y = 0;
                        p.vy *= -1;
                    } else if (p.y > height) {
                        p.y = height;
                        p.vy *= -1;
                    }

                    // Interactive mouse repulsion/reaction
                    if (mouse.isActive) {
                        const dx = p.x - mouse.x;
                        const dy = p.y - mouse.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < mouseConnectionDistSq && distSq > 0) {
                            const dist = Math.sqrt(distSq);
                            const force = (mouseConnectionDist - dist) / mouseConnectionDist;
                            // Gentle push away from cursor
                            p.x += (dx / dist) * force * 1.2;
                            p.y += (dy / dist) * force * 1.2;
                        }
                    }
                }

                // Render particle node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${nodeColor}${p.baseAlpha})`;
                ctx.fill();
            }

            // 2. Connect nearby particles with edges
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];

                // Connect with mouse cursor
                if (mouse.isActive) {
                    const mdx = p1.x - mouse.x;
                    const mdy = p1.y - mouse.y;
                    const mDistSq = mdx * mdx + mdy * mdy;

                    if (mDistSq < mouseConnectionDistSq) {
                        const mAlpha = (1 - Math.sqrt(mDistSq) / mouseConnectionDist) * (isDark ? 0.35 : 0.25);
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(${mouseEdgeColor}, ${mAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect with other particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistSq) {
                        const alpha = (1 - Math.sqrt(distSq) / connectionDistance) * (isDark ? 0.28 : 0.20);
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${edgeColor}, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }
            }

            if (!prefersReducedMotion) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", handleResize);
            mediaQuery.removeEventListener("change", handleMotionPreference);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            style={{ width: "100vw", height: "100vh" }}
        />
    );
}

