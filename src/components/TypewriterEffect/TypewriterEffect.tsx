import { useState, useEffect } from "react";

export interface TypewriterEffectProps {
    text: string;
    speed?: number;
    delay?: number;
    cursor?: boolean;
    cursorChar?: string;
    onComplete?: () => void;
    className?: string;
}

export function TypewriterEffect({
    text,
    speed = 100,
    delay = 0,
    cursor = true,
    cursorChar = "|",
    onComplete,
    className = "",
}: TypewriterEffectProps) {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(cursor);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, currentIndex === 0 ? delay : speed);
            return () => clearTimeout(timeout);
        } else if (!isComplete) {
            setIsComplete(true);
            onComplete?.();
        }
    }, [currentIndex, text, speed, delay, onComplete, isComplete]);

    useEffect(() => {
        if (!cursor) return;
        const CURSOR_BLINK_MS = 530;
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, CURSOR_BLINK_MS);
        return () => clearInterval(cursorInterval);
    }, [cursor]);

    return (
        <span className={className}>
            {displayText}
            {cursor && (
                <span
                    className={`inline-block ${showCursor ? "opacity-100" : "opacity-0"}`}
                    style={{ transition: "opacity 0.1s" }}
                >
                    {cursorChar}
                </span>
            )}
        </span>
    );
}
