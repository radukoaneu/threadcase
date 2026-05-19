export function shortAddr(addr: string, head = 6, tail = 4): string {
  if (!addr || addr.length < head + tail + 2) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function normalizeAddr(addr: string): string {
  const a = addr.trim();
  if (!/^0x[a-fA-F0-9]{40}$/.test(a)) throw new Error("无效 EVM 地址");
  return a;
}

export function formatAmount(wei: bigint, decimals = 18): string {
  const s = wei.toString().padStart(decimals + 1, "0");
  const whole = s.slice(0, -decimals) || "0";
  const frac = s.slice(-decimals).replace(/0+$/, "").slice(0, 6);
  return frac ? `${whole}.${frac}` : whole;
}
