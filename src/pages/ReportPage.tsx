import { useState } from "react";
import { StickyNote } from "../components/StickyNote";
import { analyzeContract } from "../lib/detectiveAi";

export function ReportPage() {
  const [contract, setContract] = useState("");
  const [report, setReport] = useState<ReturnType<typeof analyzeContract> | null>(null);

  return (
    <div className="space-y-4">
      <StickyNote title="漏洞分析科" variant="pink">
        粘贴目标合约地址，生成本地风险研判报告（规则演示，非专业审计替代）。
      </StickyNote>
      <input
        className="tc-input"
        placeholder="0x… 合约地址"
        value={contract}
        onChange={(e) => setContract(e.target.value)}
      />
      <button
        type="button"
        className="tc-btn w-full"
        onClick={() => setReport(analyzeContract(contract))}
      >
        生成分析报告
      </button>
      {report && (
        <article className="tc-paper p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif font-bold text-ink">{report.title}</h2>
            <span className="font-mono text-2xl font-bold text-thread">{report.score}</span>
          </div>
          <p className="tc-label mt-2">风险指数 / 100</p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink">
            {report.findings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}
