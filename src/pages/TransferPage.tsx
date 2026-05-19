import { useEffect, useState } from "react";
import { CHAIN_LIST, getChain } from "../lib/chains";
import { fetchGasPrice, formatGwei } from "../lib/rpc";
import { signTransfer } from "../lib/walletCore";
import { normalizeAddr, shortAddr } from "../lib/utils";
import { useWalletStore } from "../store/walletStore";

export function TransferPage() {
  const session = useWalletStore((s) => s.session)!;
  const walletPassword = useWalletStore((s) => s.walletPassword);
  const chainId = useWalletStore((s) => s.chainId);
  const setChain = useWalletStore((s) => s.setChain);
  const toastOk = useWalletStore((s) => s.toastOk);
  const toastErr = useWalletStore((s) => s.toastErr);

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState(walletPassword);
  const [gas, setGas] = useState<bigint | null>(null);
  const [busy, setBusy] = useState(false);

  const chain = getChain(chainId);

  useEffect(() => {
    void fetchGasPrice(chain).then(setGas).catch(() => setGas(null));
  }, [chain]);

  async function execute() {
    try {
      normalizeAddr(to);
    } catch {
      return toastErr("地址无效");
    }
    if (!gas) return toastErr("无法读取 Gas");
    setBusy(true);
    try {
      const { txHash } = await signTransfer(session, password, chain, to, amount, gas.toString(), true);
      toastOk(txHash ? `调证封存 tx ${shortAddr(txHash, 10, 8)}` : "已签名广播");
    } catch (e) {
      toastErr(e instanceof Error ? e.message : "失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <article className="tc-paper p-4">
        <p className="tc-label">调证钱包</p>
        <p className="font-mono text-xs text-ink">{shortAddr(session.address, 10, 8)}</p>
        <select className="tc-input mt-3" value={chainId} onChange={(e) => setChain(e.target.value)}>
          {CHAIN_LIST.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </article>
      <input className="tc-input" placeholder="目标地址 0x…" value={to} onChange={(e) => setTo(e.target.value)} />
      <input className="tc-input" placeholder={`金额 (${chain.symbol})`} value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="password" className="tc-input" placeholder="探员证密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      {gas !== null && <p className="text-xs text-inkMuted">Gas ≈ {formatGwei(gas)} Gwei</p>}
      <button type="button" className="tc-btn tc-btn-red w-full" disabled={busy} onClick={() => void execute()}>
        {busy ? "封存中…" : "签名并广播（调证）"}
      </button>
    </div>
  );
}
