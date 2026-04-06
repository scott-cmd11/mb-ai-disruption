"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";

// ── NavMenu ───────────────────────────────────────────────────────────────────

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus first link when menu opens
  useEffect(() => {
    if (open && menuRef.current) {
      const first = menuRef.current.querySelector("a");
      first?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Desktop nav — hidden on mobile */}
      <nav aria-label="Main navigation" className="hidden md:block">
        <ul className="flex items-center gap-1 sm:gap-2 lg:gap-4" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`nav-link${pathname === href ? " nav-link-active" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile hamburger — visible on mobile only */}
      <div className="md:hidden">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors"
          style={{
            color: "var(--color-text-inverse)",
            backgroundColor: open ? "rgba(255,255,255,0.1)" : "transparent",
          }}
        >
          {/* Hamburger / X icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>

        {/* Mobile menu overlay */}
        {open && (
          <div
            id="mobile-nav-menu"
            ref={menuRef}
            role="navigation"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-full z-50 border-t"
            style={{
              backgroundColor: "var(--color-navy-deep)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <ul className="flex flex-col py-2 px-4" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-3 px-3 text-sm font-medium rounded-lg transition-colors"
                    style={{
                      color:
                        pathname === href
                          ? "var(--color-gold)"
                          : "rgba(248,250,252,0.7)",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
