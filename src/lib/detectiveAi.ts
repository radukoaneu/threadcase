import type { ClueEdge, ClueNode } from "../types";
import { shortAddr } from "./utils";

function hashUnit(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 10000;
}

const SUSPECT_LABELS = ["混币出口", "钓鱼收款", "中继热钱包", "授权滥用", "闪电贷套利", "假 U 质押"];

export function buildClueGraph(centerAddress: string): { nodes: ClueNode[]; edges: ClueEdge[] } {
  const base = hashUnit(centerAddress.toLowerCase());
  const nodes: ClueNode[] = [
    {
      id: "center",
      label: "本案钱包",
      sub: shortAddr(centerAddress, 8, 6),
      x: 50,
      y: 48,
      risk: "low",
    },
  ];
  const edges: ClueEdge[] = [];
  for (let i = 0; i < 5; i++) {
    const u = (base + i * 997) % 10000;
    const angle = (i / 5) * Math.PI * 2 + (u / 10000) * 0.8;
    const r = 28 + (u % 12);
    const id = `n${i}`;
    const risk = u % 3 === 0 ? "high" : u % 2 === 0 ? "med" : "low";
    nodes.push({
      id,
      label: SUSPECT_LABELS[i % SUSPECT_LABELS.length],
      sub: `0x${((base + i * 12345) % 0xffffff).toString(16).padStart(6, "0")}…${(u % 9999).toString(16)}`,
      x: 50 + Math.cos(angle) * r,
      y: 48 + Math.sin(angle) * r,
      risk,
    });
    edges.push({ from: "center", to: id });
    if (i > 0 && u % 4 === 0) edges.push({ from: `n${i - 1}`, to: id });
  }
  return { nodes, edges };
}

export interface FlowTrace {
  summary: string;
  hops: { step: number; addr: string; note: string; flag: boolean }[];
}

export function traceSuspiciousFlow(seed: string): FlowTrace {
  const h = hashUnit(seed);
  const hops = Array.from({ length: 4 }, (_, i) => ({
    step: i + 1,
    addr: `0x${((h + i * 7919) % 0xffffffff).toString(16).padStart(8, "0").slice(0, 8)}…`,
    note: ["分拆转出", "跨链桥存入", "DEX 兑换", "归集冷址"][i],
    flag: (h + i) % 3 === 0,
  }));
  return {
    summary: `AI 研判：检测到 ${hops.filter((x) => x.flag).length} 处异常跳点，疑似洗钱分层；建议冻结关联授权并保全链上证据。`,
    hops,
  };
}

export interface ContractReport {
  score: number;
  title: string;
  findings: string[];
}

export function analyzeContract(target: string): ContractReport {
  const h = hashUnit(target || "0x");
  const score = 20 + (h % 70);
  const findings = [
    score > 60 ? "发现未限制 mint 的后门函数签名" : "未发现明显 mint 后门",
    h % 2 === 0 ? "owner 可任意升级实现（代理模式）" : "合约不可升级",
    h % 3 === 0 ? "历史存在大额异常转出事件" : "转出模式正常",
    "建议：核对开源代码与链上 bytecode 一致性",
  ];
  return {
    score,
    title: score > 55 ? "高风险 · 慎交互" : "中低风险 · 可继续取证",
    findings,
  };
}

export interface AuthNote {
  id: string;
  spender: string;
  token: string;
  risk: string;
  time: string;
}

export function scanAbnormalAuth(wallet: string): AuthNote[] {
  const h = hashUnit(wallet);
  return Array.from({ length: 3 }, (_, i) => ({
    id: `note-${i}`,
    spender: `0x${((h + i * 3333) % 0xffffff).toString(16).padStart(6, "0")}…approve`,
    token: ["USDT", "WETH", "UNKNOWN"][i],
    risk: i === 0 ? "无限额度授权 · 高危" : i === 1 ? "过期未撤销" : "新合约首次授权",
    time: `T-${i + 1}h`,
  }));
}
