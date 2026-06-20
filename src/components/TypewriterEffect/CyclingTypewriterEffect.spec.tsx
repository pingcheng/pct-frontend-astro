import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { CyclingTypewriterEffect } from "./CyclingTypewriterEffect";

// The component renders <span>{displayText}<span>{cursor}</span></span>, so the
// outer span's text content mixes in the cursor character. We render with the
// cursor off and read the container's text content to observe only typed text.
function renderTyped(
    props: React.ComponentProps<typeof CyclingTypewriterEffect>,
) {
    const utils = render(<CyclingTypewriterEffect cursor={false} {...props} />);
    const read = () => utils.container.textContent ?? "";
    return { ...utils, read };
}

// Advance fake timers and flush React updates.
function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

// Drive the typewriter for `steps` ticks of `ms` each, recording every distinct
// value the display takes. Robust to off-by-one timing assumptions because we
// collect the whole trajectory instead of asserting any single frame.
function collectTrajectory(
    read: () => string,
    steps: number,
    ms: number,
): Set<string> {
    const seen = new Set<string>();
    for (let i = 0; i < steps; i += 1) {
        tick(ms);
        seen.add(read());
    }
    return seen;
}

describe("CyclingTypewriterEffect", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders nothing typed before the delay elapses", () => {
        const { read } = renderTyped({
            texts: ["Hello"],
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseTime: 2000,
            delay: 1000,
        });
        tick(500);
        expect(read()).toBe("");
    });

    it("reaches the full text of the first item", () => {
        const { read } = renderTyped({
            texts: ["Hello"],
            typeSpeed: 10,
            deleteSpeed: 10,
            pauseTime: 20,
            delay: 0,
        });
        // Plenty of steps to fully type five characters regardless of the
        // initial setup tick.
        const seen = collectTrajectory(read, 20, 10);
        expect(seen.has("Hello")).toBe(true);
        // And it built up monotonically through each prefix.
        for (const prefix of ["H", "He", "Hel", "Hell"]) {
            expect(seen.has(prefix)).toBe(true);
        }
    });

    it("cycles through multiple texts", () => {
        const { read } = renderTyped({
            texts: ["AB", "CD"],
            typeSpeed: 10,
            deleteSpeed: 10,
            pauseTime: 20,
            delay: 0,
        });
        // Run long enough to type both texts fully.
        const seen = collectTrajectory(read, 80, 10);
        expect(seen.has("AB")).toBe(true);
        expect(seen.has("CD")).toBe(true);
    });

    it("wraps back to the first text after the last one", () => {
        const { read } = renderTyped({
            texts: ["X", "Y"],
            typeSpeed: 10,
            deleteSpeed: 10,
            pauseTime: 10,
            delay: 0,
        });

        // Track rising edges: how many times the display *becomes* 'X' (i.e.
        // was re-typed after being deleted). Once is the initial type; a second
        // means we wrapped past 'Y' back to 'X'.
        let xRises = 0;
        let prev = read();
        for (let i = 0; i < 120; i += 1) {
            tick(10);
            const cur = read();
            if (cur === "X" && prev !== "X") xRises += 1;
            prev = cur;
        }
        expect(xRises).toBeGreaterThanOrEqual(2);
    });

    it("types emoji as whole graphemes without exposing lone surrogates", () => {
        const { read } = renderTyped({
            texts: ["🍳 Cooking"],
            typeSpeed: 10,
            deleteSpeed: 10,
            pauseTime: 20,
            delay: 0,
        });

        // Snapshot every intermediate display value while typing. A half-emoji
        // (a lone surrogate) renders as the replacement char U+FFFD and is
        // malformed UTF-16 — neither should ever be observed after the fix.
        const seen = collectTrajectory(read, 30, 10);

        for (const value of seen) {
            // No replacement char should ever appear (the old bug surface).
            expect(value.includes("�")).toBe(false);
        }

        // The emoji must appear intact at some point as a complete grapheme...
        expect(seen.has("🍳")).toBe(true);
        // ...and the fully typed string too.
        expect(seen.has("🍳 Cooking")).toBe(true);
        // It must never appear as a lone leading surrogate of the emoji.
        // '🍳'.charAt(0) is exactly that malformed fragment; the old code would
        // have surfaced it as an intermediate value.
        expect(seen.has("🍳".charAt(0))).toBe(false);
    });

    it("deletes emoji as whole graphemes (no partial emoji while deleting)", () => {
        const { read } = renderTyped({
            texts: ["🍳"],
            typeSpeed: 10,
            deleteSpeed: 10,
            pauseTime: 20,
            delay: 0,
        });

        const seen = collectTrajectory(read, 40, 10);
        expect(seen.has("🍳")).toBe(true);

        // While deleting, the emoji should vanish in a single step — never a
        // trailing/leading surrogate fragment. Assert no malformed value is
        // ever produced.
        for (const value of seen) {
            expect(value.includes("�")).toBe(false);
        }
        // The empty (fully deleted) state must be reached.
        expect(seen.has("")).toBe(true);
    });

    it("renders a cursor by default", () => {
        const { container } = render(
            <CyclingTypewriterEffect
                texts={["Hi"]}
                typeSpeed={10}
                delay={0}
                cursorChar="|"
            />,
        );
        expect(container.textContent).toContain("|");
    });
});

// When Intl.Segmenter is unavailable (older browsers like Safari < 15.4), the
// component must fall back to Array.from-based splitting and still keep emoji
// intact. This guards the feature check added in review.
describe("CyclingTypewriterEffect without Intl.Segmenter", () => {
    const originalSegmenter = Intl.Segmenter;

    beforeEach(() => {
        vi.useFakeTimers();
        // Hide Intl.Segmenter so the module falls through to the fallback.
        // @ts-expect-error — intentionally deleting a global for the test.
        delete Intl.Segmenter;
        vi.resetModules();
    });

    afterEach(() => {
        vi.useRealTimers();
        Object.defineProperty(Intl, "Segmenter", {
            value: originalSegmenter,
            writable: true,
            configurable: true,
        });
    });

    it("types emoji as whole code points via the Array.from fallback", async () => {
        const mod = await import("./CyclingTypewriterEffect");
        const utils = render(<mod.CyclingTypewriterEffect cursor={false} texts={["🍳 Cooking"]} typeSpeed={10} deleteSpeed={10} pauseTime={20} delay={0} />);
        const read = () => utils.container.textContent ?? "";

        const seen = collectTrajectory(read, 30, 10);
        expect(seen.has("🍳")).toBe(true);
        expect(seen.has("🍳 Cooking")).toBe(true);
        for (const value of seen) {
            expect(value.includes("�")).toBe(false);
        }
        // No lone surrogate of the emoji should leak through the fallback.
        expect(seen.has("🍳".charAt(0))).toBe(false);
    });
});
