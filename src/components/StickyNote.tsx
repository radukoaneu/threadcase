import type { ReactNode } from "react";

export function StickyNote({
  title,
  children,
  variant = "yellow",
  className = "",
}: {
  title: string;
  children: ReactNode;
  variant?: "yellow" | "pink";
  className?: string;
}) {
  return (
    <article className={`${variant === "pink" ? "tc-sticky-pink" : "tc-sticky"} p-3 ${className}`}>
      <p className="font-serif text-xs font-bold text-ink/80">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-ink">{children}</div>
    </article>
  );
}
