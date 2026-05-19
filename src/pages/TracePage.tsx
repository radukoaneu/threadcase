import { useMemo, useState } from "react";
import { StickyNote } from "../components/StickyNote";
import { traceSuspiciousFlow } from "../lib/detectiveAi";
import { useWalletStore } from "../store/walletStore";

export function TracePage() {
  const session = useWalletStore((s) => s.session)!;
  const [target, setTarget] = useState("");
  const [ran, setRan] = useState(false);
  const flow = useMemo(
    () => (ran ? traceSuspiciousFlow(target || session.address) : null),
    [ran, target, session.address]
  );

  return (
    <div className="space-y-4">
      <StickyNote title="资金追踪科">
        输入可疑地址或留空以本案钱包为起点，AI 将推演分层跳转路径（本地演示，非链上实时）。
      </StickyNote>
      <input
        className="tc-input"
        placeholder="0x… 可疑地址（可留空）"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      <button
        type="button"
        className="tc-btn tc-btn-red w-full"
        onClick={() => {
          setRan(true);
        }}
      >
        启动 AI 追踪
      </button>
      {flow && (
        <article className="tc-paper space-y-3 p-4">
          <p className="font-serif text-sm font-bold text-thread">{flow.summary}</p>
          <ol className="space-y-2 border-l-2 border-thread pl-3">
            {flow.hops.map((h) => (
              <li key={h.step} className="text-sm">
                <span className="font-mono text-xs text-inkMuted">#{h.step}</span>{" "}
                <span className="font-mono">{h.addr}</span>
                <span className="ml-1 text-inkMuted">— {h.note}</span>
                {h.flag && <span className="ml-1 text-xs font-bold text-thread">⚠ 异常</span>}
              </li>
            ))}
          </ol>
        </article>
      )}
    </div>
  );
}
