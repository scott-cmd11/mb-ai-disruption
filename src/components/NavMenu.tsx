"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ENTRIES } from "@/lib/nav";
import type { NavEntry } from "@/lib/nav";

// ── Chevron icon (shared) ────────────────────────────────────────────────────

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ── Desktop dropdown ─────────────────────────────────────────────────────────

function NavDropdown({
  label,
  items,
  pathname,
}: {
  label: string;
  items: { href: string; label: string }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Highlight trigger if any child is active
  const isActive = items.some((item) => pathname === item.href);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`nav-link flex items-center gap-1${isActive ? " nav-link-active" : ""}`}
      >
        {label}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] rounded-lg border py-2 shadow-lg"
          style={{
            backgroundColor: "var(--color-navy-deep)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
          role="menu"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm transition-colors"
              style={{
                color:
                  pathname === item.href
                    ? "var(--color-gold)"
                    : "rgba(248,250,252,0.7)",
              }}
              onMouseEnter={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.color = "rgba(248,250,252,1)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.color = "rgba(248,250,252,0.7)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NavMenu ──────────────────────────────────────────────────────────────────

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
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

  // Focus first link when mobile menu opens
  useEffect(() => {
    if (open && menuRef.current) {
      const first = menuRef.current.querySelector("a");
      first?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Desktop nav — hidden on mobile */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex items-center gap-1"
      >
        {NAV_ENTRIES.map((entry) => {
          if (entry.type === "link") {
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className={`nav-link${pathname === entry.href ? " nav-link-active" : ""}`}
                style={entry.primary ? { color: "var(--color-gold)" } : undefined}
              >
                {entry.label}
              </Link>
            );
          }
          return (
            <NavDropdown
              key={entry.label}
              label={entry.label}
              items={entry.items}
              pathname={pathname}
            />
          );
        })}
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
              {NAV_ENTRIES.map((entry) => {
                if (entry.type === "link") {
                  return (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        className="block py-3 px-3 text-sm font-medium rounded-lg transition-colors"
                        style={{
                          color:
                            pathname === entry.href
                              ? "var(--color-gold)"
                              : entry.primary
                                ? "var(--color-gold)"
                                : "rgba(248,250,252,0.7)",
                        }}
                      >
                        {entry.label}
                      </Link>
                    </li>
                  );
                }
                // Group — use native <details>
                return (
                  <li key={entry.label}>
                    <details className="group">
                      <summary
                        className="flex items-center justify-between py-3 px-3 text-sm font-medium rounded-lg cursor-pointer list-none [&::-webkit-details-marker]:hidden transition-colors"
                        style={{ color: "rgba(248,250,252,0.7)" }}
                      >
                        {entry.label}
                        <ChevronDown className="w-4 h-4 transition-transform duration-150 group-open:rotate-180" />
                      </summary>
                      <ul className="pl-4 pb-1" role="list">
                        {entry.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="block py-2.5 px-3 text-sm rounded-lg transition-colors"
                              style={{
                                color:
                                  pathname === item.href
                                    ? "var(--color-gold)"
                                    : "rgba(248,250,252,0.55)",
                              }}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
