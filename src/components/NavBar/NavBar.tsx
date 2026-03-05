import { useState, useRef, useEffect, type KeyboardEvent, forwardRef } from "react";
import { profile } from "@/data/profile";
import styles from "./style.module.css";

type MenuItem = {
    label: string;
    path: string;
    activePattern?: RegExp;
};

const menuItems: MenuItem[] = [
    { label: "Home", path: "/" },
    { label: "Portfolio", path: "/portfolio", activePattern: /\/portfolio.*/ },
    { label: "About me", path: "/about" },
];

function isActive(item: MenuItem, pathName: string): boolean {
    const normalizedPath = pathName.endsWith('/') && pathName !== '/'
        ? pathName.slice(0, -1)
        : pathName;

    if (item.activePattern) {
        return item.activePattern.test(normalizedPath);
    }
    return normalizedPath === item.path;
}

function MenuIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            className={`block h-6 w-6 ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function CloseIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            className={`block h-6 w-6 ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

type MobileMenuProps = {
    menuItems: MenuItem[];
    isVisible: boolean;
    onItemClick: () => void;
    currentPath: string;
};

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
    ({ menuItems, isVisible, onItemClick, currentPath }, ref) => {
        return (
            <div
                id="mobile-menu"
                ref={ref}
                className={`sm:hidden ${styles.mobileMenu} ${isVisible ? styles.expanded : ""}`}
                aria-hidden={!isVisible}
            >
                <div className="px-4 pt-2 pb-3 space-y-1">
                    {menuItems.map((item) => (
                        <a
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${isActive(item, currentPath) ? styles["active"] : ""}`}
                            onClick={onItemClick}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        );
    }
);

MobileMenu.displayName = "MobileMenu";

interface NavBarProps {
    currentPath: string;
}

export default function NavBar({ currentPath }: NavBarProps) {
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const logoStyles = {
        borderTop: "3px solid var(--logo-line-color)",
        borderBottom: "3px solid var(--logo-line-color)",
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsMobileMenuVisible(!isMobileMenuVisible);
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuVisible(!isMobileMenuVisible);
    const closeMobileMenu = () => setIsMobileMenuVisible(false);

    useEffect(() => {
        const menu = mobileMenuRef.current;
        if (!menu) return;
        if (isMobileMenuVisible) {
            menu.style.maxHeight = menu.scrollHeight + "px";
        } else {
            menu.style.maxHeight = "0px";
        }
    }, [isMobileMenuVisible]);

    useEffect(() => {
        const handleEscape = (event: Event) => {
            if (event instanceof KeyboardEvent && event.key === "Escape" && isMobileMenuVisible) {
                setIsMobileMenuVisible(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuVisible]);

    return (
        <>
            <nav role="navigation" aria-label="Main navigation">
                <div className="page-container relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-4 flex items-center sm:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            onKeyDown={handleKeyDown}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-expanded={isMobileMenuVisible}
                            aria-controls="mobile-menu"
                            aria-label={isMobileMenuVisible ? "Close main menu" : "Open main menu"}
                        >
                            <MenuIcon className={isMobileMenuVisible ? "hidden" : "block"} />
                            <CloseIcon className={isMobileMenuVisible ? "block" : "hidden"} />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="shrink-0 flex items-center">
                            <div className="font-bold text-primary" style={logoStyles}>
                                {profile.fullName}
                            </div>

                            <div className="hidden sm:block sm:ml-6">
                                <div className="flex space-x-4">
                                    {menuItems.map((item) => (
                                        <a
                                            key={item.path}
                                            href={item.path}
                                            className={`${styles.navItem} ${isActive(item, currentPath) ? styles["active"] : ""}`}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <MobileMenu
                    ref={mobileMenuRef}
                    menuItems={menuItems}
                    isVisible={isMobileMenuVisible}
                    onItemClick={closeMobileMenu}
                    currentPath={currentPath}
                />
            </nav>
        </>
    );
}
