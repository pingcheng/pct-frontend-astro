export interface BlogFrontmatter {
    title: string;
    description?: string;
    publishedAt: string;
    topic: string;
}

export function formatPostDate(value: string): string {
    return new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

const WORDS_PER_MINUTE = 200;
const CJK_CHARS_PER_MINUTE = 350;
// Han, kana and Hangul are read character by character, not as space-separated words.
const CJK_CHAR =
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
// CJK and fullwidth punctuation (、。，：「」 etc.) is not read as words.
const CJK_PUNCTUATION = /[\u3000-\u303f\uff00-\uffef]/gu;

const HAS_CJK_CHAR =
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

export function containsCjk(text: string): boolean {
    return HAS_CJK_CHAR.test(text);
}

export function readingMinutes(content: string): number {
    const cjkChars = content.match(CJK_CHAR)?.length ?? 0;
    const rest = content
        .replace(CJK_CHAR, " ")
        .replace(CJK_PUNCTUATION, " ")
        .trim();
    const words = rest ? rest.split(/\s+/).length : 0;
    return Math.max(
        1,
        Math.ceil(words / WORDS_PER_MINUTE + cjkChars / CJK_CHARS_PER_MINUTE),
    );
}
