import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ClueBoard } from "../components/ClueBoard";
import { StickyNote } from "../components/StickyNote";
import { buildClueGraph } from "../lib/detectiveAi";
import { shortAddr } from "../lib/utils";
import { useWalletStore } from "../store/walletStore";

export function BoardPage() {
  const session = useWalletStore((s) => s.session)!;
  const graph = useMemo(() => buildClueGraph(session.address), [session.address]);

  return (
    <div className="space-y-4">
      <StickyNote title="案情摘要 · AI 初判" variant="pink">
        围绕主钱包 <span className="font-mono font-bold">{shortAddr(session.address, 8, 6)}</span> 已关联{" "}
        {graph.nodes.length - 1} 个可疑节点，红线为资金流向与授权关联（演示推演）。
      </StickyNote>
      <ClueBoard nodes={graph.nodes} edges={graph.edges} />
      <div className="grid grid-cols-2 gap-2">
        <Link to="/trace" className="tc-btn block text-center text-xs">
          深度追踪
        </Link>
        <Link to="/report" className="tc-btn tc-btn-red block text-center text-xs">
          合约报告
        </Link>
      </div>
    </div>
  );
}
