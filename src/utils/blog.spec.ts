import { describe, expect, it } from "vitest";
import { readingMinutes } from "./blog";

const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");
const han = (n: number) => "字".repeat(n);

describe("readingMinutes", () => {
    it("counts English by whitespace-separated words at 200 per minute", () => {
        expect(readingMinutes(words(200))).toBe(1);
        expect(readingMinutes(words(201))).toBe(2);
        expect(readingMinutes(`  ${words(800)}\n\n${words(1)}  `)).toBe(5);
    });

    it("never reports less than one minute", () => {
        expect(readingMinutes("")).toBe(1);
        expect(readingMinutes("   ")).toBe(1);
        expect(readingMinutes("hello")).toBe(1);
    });

    it("counts CJK characters at 350 per minute", () => {
        expect(readingMinutes(han(350))).toBe(1);
        expect(readingMinutes(han(351))).toBe(2);
        expect(readingMinutes(han(1400))).toBe(4);
    });

    it("ignores CJK punctuation instead of counting it as words", () => {
        const sentence = `${han(9)}，${han(9)}。`;
        expect(readingMinutes(Array(20).fill(sentence).join(""))).toBe(2);
        expect(readingMinutes("「」、。，：？！".repeat(100))).toBe(1);
    });

    it("sums CJK reading time and English word time for mixed text", () => {
        // 700 Han chars = 2 min, 300 English words = 1.5 min → 3.5 → 4
        const mixed = Array.from(
            { length: 100 },
            () => `${han(7)} word word word`,
        ).join("");
        expect(readingMinutes(mixed)).toBe(4);
        expect(readingMinutes(`我用 Home Assistant 和 Tesla 充电`)).toBe(1);
    });
});
