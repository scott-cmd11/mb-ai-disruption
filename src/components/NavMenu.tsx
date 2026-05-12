"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ENTRIES } from "@/lib/nav";

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus first link when menu opens
  useEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
        {NAV_ENTRIES.map(({ href, label, primary }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname === href ? " nav-link-active" : ""}`}
            style={primary ? { color: "var(--color-gold)" } : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-[rgba(185,71,42,0.12)]"
          style={{
            color: "var(--color-text-primary)",
            backgroundColor: open ? "rgba(185,71,42,0.12)" : "transparent",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></>
            ) : (
              <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
            )}
          </svg>
        </button>

        {open && (
          <div
            id="mobile-nav-menu"
            ref={menuRef}
            role="navigation"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-full z-50 border-t"
            style={{ backgroundColor: "var(--color-paper)", borderColor: "var(--color-text-primary)" }}
          >
            <ul className="flex flex-col py-2 px-4" role="list">
              {NAV_ENTRIES.map(({ href, label, primary }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-3 px-3 text-sm font-medium rounded-lg transition-colors hover:bg-[rgba(49,84,103,0.08)]"
                    style={{
                      color: pathname === href
                        ? "var(--color-gold)"
                        : primary
                          ? "var(--color-gold)"
                          : "var(--color-text-primary)",
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
