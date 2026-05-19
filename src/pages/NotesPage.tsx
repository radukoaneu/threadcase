import { useMemo } from "react";
import { StickyNote } from "../components/StickyNote";
import { scanAbnormalAuth } from "../lib/detectiveAi";
import { useWalletStore } from "../store/walletStore";

export function NotesPage() {
  const session = useWalletStore((s) => s.session)!;
  const notes = useMemo(() => scanAbnormalAuth(session.address), [session.address]);

  return (
    <div className="space-y-3">
      <StickyNote title="授权侦探笔记">
        扫描本案钱包历史授权痕迹，标出无限额度与可疑 Spender（本地推演）。
      </StickyNote>
      {notes.map((n, i) => (
        <article
          key={n.id}
          className={i % 2 === 0 ? "tc-sticky p-3" : "tc-sticky-pink p-3"}
          style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
        >
          <p className="font-mono text-xs text-inkMuted">{n.time}</p>
          <p className="mt-1 font-serif font-bold text-ink">{n.risk}</p>
          <p className="mt-1 text-sm">
            {n.token} → <span className="font-mono text-xs">{n.spender}</span>
          </p>
        </article>
      ))}
    </div>
  );
}
