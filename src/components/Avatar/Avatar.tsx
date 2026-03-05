import { useState } from "react";
import { profile } from "@/data/profile";

type AvatarProps = {
    width: number;
    height: number;
    alt?: string;
    className?: string;
};

export function Avatar({ width, height, alt, className }: AvatarProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            className={`max-w-full ${className || ""}`}
            style={{ width, height }}
        >
            {!imageError ? (
                <img
                    src={profile.avatarUrl}
                    alt={alt || `${profile.fullName} profile photo`}
                    width={width}
                    height={height}
                    style={{ borderRadius: "50%" }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div
                    className="bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-full animate-fade-in"
                    style={{ width, height }}
                    role="img"
                    aria-label={alt || `${profile.fullName} profile photo (image unavailable)`}
                >
                    <span className="text-xs animate-fade-in animate-delay-200">No Image</span>
                </div>
            )}
        </div>
    );
}
