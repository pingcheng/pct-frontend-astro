import { useState, useRef, useEffect } from "react";
import { profile } from "@/data/profile";
import styles from "./style.module.css";

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Blog", path: "/blog/" },
    { label: "About me", path: "/about" },
];

function isActive(item: (typeof menuItems)[number], path: string): boolean {
    const normalized = path.replace(/\/+$/, "") || "/";
    const itemPath = item.path.replace(/\/+$/, "") || "/";
    return itemPath !== "/"
        ? normalized === itemPath || normalized.startsWith(`${itemPath}/`)
        : normalized === itemPath;
}

export default function NavBar({ currentPath }: { currentPath: string }) {
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isMobileMenuVisible) {
                setIsMobileMenuVisible(false);
                toggleRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuVisible]);

    useEffect(() => {
        if (!window.matchMedia) return;
        const desktop = window.matchMedia("(min-width: 641px)");
        const closeOnDesktop = () => {
            if (desktop.matches) setIsMobileMenuVisible(false);
        };
        desktop.addEventListener("change", closeOnDesktop);
        return () => desktop.removeEventListener("change", closeOnDesktop);
    }, []);

    const renderLinks = () =>
        menuItems.map((item) => (
            <a
                key={item.path}
                href={item.path}
                className={`${styles.navItem} ${isActive(item, currentPath) ? styles.active : ""}`}
                aria-current={isActive(item, currentPath) ? "page" : undefined}
                onClick={() => setIsMobileMenuVisible(false)}
            >
                {item.label}
            </a>
        ));

    return (
        <nav className={styles.navBarRoot} aria-label="Main navigation">
            <div className={`page-container ${styles.navInner}`}>
                <a
                    className={styles.identity}
                    href="/"
                    aria-label={`${profile.fullName} home`}
                >
                    <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M0 5h5V0h15v5h5v15h-5v5H5v-5H0V5Zm5 0v15h15V5H5Zm4 4h7v3h-4v4H9V9Z" />
                    </svg>
                    <span>{profile.fullName}</span>
                </a>
                <div className={styles.desktopMenu}>{renderLinks()}</div>
                <button
                    ref={toggleRef}
                    onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
                    className={styles.menuToggle}
                    aria-expanded={isMobileMenuVisible}
                    aria-controls="mobile-menu"
                    aria-label={
                        isMobileMenuVisible
                            ? "Close main menu"
                            : "Open main menu"
                    }
                >
                    <span>{isMobileMenuVisible ? "Close" : "Menu"}</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        {isMobileMenuVisible ? (
                            <path d="m3 2 5 5 5-5 1 1-5 5 5 5-1 1-5-5-5 5-1-1 5-5-5-5 1-1Z" />
                        ) : (
                            <path d="M1 3h14v2H1V3Zm0 8h14v2H1v-2Z" />
                        )}
                    </svg>
                </button>
            </div>
            <div
                id="mobile-menu"
                className={`${styles.mobileMenu} ${isMobileMenuVisible ? styles.expanded : ""}`}
                inert={!isMobileMenuVisible}
                aria-hidden={!isMobileMenuVisible}
            >
                <div className={styles.mobileClip}>
                    <div className={`page-container ${styles.mobileLinks}`}>
                        {renderLinks()}
                    </div>
                </div>
            </div>
        </nav>
    );
}
