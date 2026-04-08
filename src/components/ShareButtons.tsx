"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const BASE_URL = "https://mb-ai-disruption.vercel.app";
const SITE_TITLE =
  "Manitoba AI Disruption Explorer — how exposed is your business to AI disruption?";

// ── Icons (inline SVG — no external deps) ───────────────────────────────────

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── ShareButtons ─────────────────────────────────────────────────────────────

export function ShareButtons() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const url = `${BASE_URL}${pathname}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: ignore if clipboard API unavailable
    }
  };

  const shareLinks = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: <LinkedInIcon />,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(SITE_TITLE)}`,
      icon: <XIcon />,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: <FacebookIcon />,
    },
    {
      label: "Share via email",
      href: `mailto:?subject=${encodeURIComponent(SITE_TITLE)}&body=${encodeURIComponent(`Check out this tool: ${url}`)}`,
      icon: <EmailIcon />,
      external: false,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(({ label, href, icon, external }) => (
        <a
          key={label}
          href={href}
          target={external === false ? undefined : "_blank"}
          rel={external === false ? undefined : "noopener noreferrer"}
          aria-label={label}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
          style={{
            color: "rgba(248,250,252,0.4)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(248,250,252,0.9)";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(248,250,252,0.4)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {icon}
        </a>
      ))}

      {/* Copy link button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link to this page"}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
        style={{
          color: copied ? "var(--color-gold)" : "rgba(248,250,252,0.4)",
          backgroundColor: copied ? "rgba(217,119,6,0.15)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            e.currentTarget.style.color = "rgba(248,250,252,0.9)";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            e.currentTarget.style.color = "rgba(248,250,252,0.4)";
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>

      {copied && (
        <span
          className="text-xs font-medium ml-1 animate-in fade-in"
          style={{ color: "var(--color-gold)" }}
        >
          Copied!
        </span>
      )}
    </div>
  );
}
