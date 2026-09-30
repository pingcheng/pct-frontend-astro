import { useState } from "react";
import { profile } from "@/data/profile";

type AvatarProps = {
  width: number;
  height: number;
  src?: string;
  alt?: string;
  fallbackLabel?: string;
  className?: string;
};

export function Avatar({ width, height, src, alt, fallbackLabel, className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = src ?? profile.avatarUrl;

  return (
    <div
      className={`max-w-full ${className || ""}`}
      style={{ width, height }}
    >
            {!imageError ? (
                <img
                    src={imageSrc}
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
                    <span
                        className="text-xs animate-fade-in animate-delay-200"
                        style={fallbackLabel ? { fontSize: `${Math.round(width / 2.8)}px` } : undefined}
                    >
                        {fallbackLabel ?? "No Image"}
                    </span>
                </div>
            )}
        </div>
    );
}
