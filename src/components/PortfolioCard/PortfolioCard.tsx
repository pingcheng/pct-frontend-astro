import { useState, useRef, useEffect } from "react";
import { type Portfolio } from "@/models/Portfolio/Portfolio";
import { throttle } from "@/utils/throttle";
import { calculateRotation } from "@/utils/calculateRotation";
import styles from "./style.module.css";

type PortfolioCardProps = {
    portfolio: Portfolio;
};

function PortfolioCardDetails({ portfolio }: { portfolio: Portfolio }) {
    return (
        <div className="absolute bottom-0 p-2 text-gray-200" style={{ zIndex: 10 }}>
            <div className="flex items-center gap-2">
                <div className="text-sm font-bold">{portfolio.name}</div>
                {portfolio.year && <div className="text-xs text-gray-300">({portfolio.year})</div>}
            </div>
            <div className="text-xs">{portfolio.shortDescription}</div>
        </div>
    );
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
    const [imageError, setImageError] = useState(false);
    const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            setTransform("rotateX(0deg) rotateY(0deg)");
            return;
        }

        const handleGlobalMouseMove = throttle((e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setTransform(calculateRotation(e.clientX, e.clientY, rect));
        }, 16);

        document.addEventListener("mousemove", handleGlobalMouseMove);
        return () => document.removeEventListener("mousemove", handleGlobalMouseMove);
    }, []);

    if (imageError) {
        return (
            <div
                className={styles.imageFallback}
                role="img"
                aria-label={`Cover image for ${portfolio.name} project (image unavailable)`}
            >
                <PortfolioCardDetails portfolio={portfolio} />
            </div>
        );
    }

    return (
        <div ref={containerRef} className={styles.perspectiveContainer}>
            <div
                className={styles.portfolioCard}
                style={{
                    backgroundImage: `url('${portfolio.coverImage}')`,
                    backgroundSize: "cover",
                    transform: transform,
                }}
                role="article"
                aria-label={`${portfolio.name} project`}
                onError={() => setImageError(true)}
            >
                <PortfolioCardDetails portfolio={portfolio} />
            </div>
        </div>
    );
}
