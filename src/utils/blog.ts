export interface BlogFrontmatter {
    title: string;
    description: string;
    publishedAt: string;
    topic: string;
    sample?: boolean;
}

export function formatPostDate(value: string): string {
    return new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

export function readingMinutes(content: string): number {
    return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}
