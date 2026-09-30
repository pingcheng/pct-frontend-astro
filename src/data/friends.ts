import type { Friend } from "@/models/Friend/Friend";

/**
 * Friend links shown on the /friends page.
 * Add an entry here and it appears on the page at build time.
 */
export const Friends: Friend[] = [
    {
        name: "Ken Chen",
        url: "https://kenchen.info",
        avatar: "/images/friends/kenchen.png",
        description:
            "Sydney-based Data Engineer passionate about data, cloud, and AI — sharing what he learns.",
    },
    {
        name: "Yangyang Cai",
        url: "https://yangyangcai.me",
        avatar: "/images/friends/yangyangcai.png",
        description:
            "Melbourne-based Senior Data Engineer building data platforms for renewable energy and making AI practical.",
    },
    {
        name: "Xiangyu Zhou",
        url: "https://xiangyuzhou.xyz",
        description: "Ex-Googler, aka 韭天 — something fun is on the way.",
    },
];
