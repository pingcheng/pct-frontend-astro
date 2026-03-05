import { useState, useEffect } from "react";

enum TypewriterState {
    TYPING = "typing",
    PAUSING = "pausing",
    DELETING = "deleting",
    TRANSITIONING = "transitioning",
}

function getCurrentState(
    isTyping: boolean,
    isDeleting: boolean,
    displayLength: number,
    targetLength: number,
): TypewriterState {
    if (isDeleting) {
        return displayLength > 0 ? TypewriterState.DELETING : TypewriterState.TRANSITIONING;
    }
    if (isTyping) {
        return displayLength < targetLength ? TypewriterState.TYPING : TypewriterState.PAUSING;
    }
    return TypewriterState.PAUSING;
}

function getAnimationDelay(
    state: TypewriterState,
    typeSpeed: number,
    deleteSpeed: number,
    pauseTime: number,
): number {
    switch (state) {
        case TypewriterState.TYPING:
            return typeSpeed;
        case TypewriterState.DELETING:
            return deleteSpeed;
        case TypewriterState.PAUSING:
            return pauseTime;
        case TypewriterState.TRANSITIONING:
            return 0;
        default:
            return typeSpeed;
    }
}

export interface CyclingTypewriterEffectProps {
    texts: string[];
    typeSpeed?: number;
    deleteSpeed?: number;
    pauseTime?: number;
    delay?: number;
    cursor?: boolean;
    cursorChar?: string;
    className?: string;
}

export function CyclingTypewriterEffect({
    texts,
    typeSpeed = 100,
    deleteSpeed = 50,
    pauseTime = 2000,
    delay = 0,
    cursor = true,
    cursorChar = "|",
    className = "",
}: CyclingTypewriterEffectProps) {
    const [displayText, setDisplayText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [isTyping] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(cursor);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) {
            const initialTimer = setTimeout(() => {
                setHasStarted(true);
            }, delay);
            return () => clearTimeout(initialTimer);
        }

        if (!hasStarted) return;

        const currentText = texts[textIndex];
        const currentState = getCurrentState(
            isTyping,
            isDeleting,
            displayText.length,
            currentText.length,
        );

        switch (currentState) {
            case TypewriterState.TYPING: {
                const timeout = setTimeout(() => {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                }, getAnimationDelay(currentState, typeSpeed, deleteSpeed, pauseTime));
                return () => clearTimeout(timeout);
            }
            case TypewriterState.PAUSING: {
                const pauseTimeout = setTimeout(() => {
                    setIsDeleting(true);
                }, getAnimationDelay(currentState, typeSpeed, deleteSpeed, pauseTime));
                return () => clearTimeout(pauseTimeout);
            }
            case TypewriterState.DELETING: {
                const timeout = setTimeout(() => {
                    setDisplayText(currentText.slice(0, displayText.length - 1));
                }, getAnimationDelay(currentState, typeSpeed, deleteSpeed, pauseTime));
                return () => clearTimeout(timeout);
            }
            case TypewriterState.TRANSITIONING: {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
                break;
            }
            default:
                break;
        }
    }, [displayText, textIndex, isTyping, isDeleting, hasStarted, texts, typeSpeed, deleteSpeed, pauseTime, delay]);

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
