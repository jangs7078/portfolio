"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/assets", label: "Assets" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card px-4 py-3 sm:py-4 shadow-[0_0_0_1px_var(--card-border)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="hidden text-lg font-extrabold tracking-tight sm:block">
          Portfolio
        </Link>
        <div className="flex w-full justify-around gap-2 sm:w-auto sm:justify-end sm:gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base transition-all ${
                  active
                    ? "bg-accent text-accent-dark font-semibold"
                    : "text-muted hover:text-foreground hover:scale-105 active:scale-95"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
