import type { ChainNode } from "./chains";

async function rpc(url: string, method: string, params: unknown[]): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const j = (await res.json()) as { result?: string; error?: { message: string } };
  if (j.error) throw new Error(j.error.message);
  return j.result || "0x0";
}

export async function fetchGasPrice(chain: ChainNode): Promise<bigint> {
  if (!chain.rpcUrl) throw new Error("无 RPC");
  const hex = await rpc(chain.rpcUrl, "eth_gasPrice", []);
  return BigInt(hex);
}

export function formatGwei(wei: bigint): string {
  return (Number(wei) / 1e9).toFixed(2);
}

export function parseAmount(eth: string): bigint {
  const [w, f = ""] = eth.trim().split(".");
  const frac = (f + "000000000000000000").slice(0, 18);
  return BigInt(w || "0") * 10n ** 18n + BigInt(frac);
}

export async function broadcastRaw(chain: ChainNode, raw: string): Promise<string> {
  if (!chain.rpcUrl) throw new Error("无 RPC");
  const hash = await rpc(chain.rpcUrl, "eth_sendRawTransaction", [raw]);
  return hash;
}
