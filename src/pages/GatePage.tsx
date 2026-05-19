import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_CHAIN, getChain } from "../lib/chains";
import {
  createFromMnemonic,
  generateMnemonicPhrase,
  verifyWalletPassword,
} from "../lib/walletCore";
import { useWalletStore } from "../store/walletStore";

type Tab = "new" | "mnemonic";
type Phase = "form" | "login";

export function GatePage() {
  const nav = useNavigate();
  const session = useWalletStore((s) => s.session);
  const setSession = useWalletStore((s) => s.setSession);
  const setUnlocked = useWalletStore((s) => s.setUnlocked);
  const setWalletPassword = useWalletStore((s) => s.setWalletPassword);
  const toastOk = useWalletStore((s) => s.toastOk);
  const toastErr = useWalletStore((s) => s.toastErr);

  const hasSession = !!session;
  const [tab, setTab] = useState<Tab>("new");
  const [phase, setPhase] = useState<Phase>(hasSession ? "login" : "form");

  useEffect(() => {
    setPhase(session ? "login" : "form");
  }, [session]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const chain = getChain(DEFAULT_CHAIN);

  async function randomMnemonic() {
    setGenerating(true);
    try {
      setMnemonic(await generateMnemonicPhrase());
      toastOk("已随机生成助记词，请封存备份");
    } catch (e) {
      toastErr(e instanceof Error ? e.message : "生成失败");
    } finally {
      setGenerating(false);
    }
  }

  async function submitWallet() {
    if (password.length < 8) return toastErr("探员证密码至少 8 位");
    if (password !== confirm) return toastErr("两次密码不一致");
    if (!mnemonic.trim()) return toastErr("请先点击「随机生成助记词」");
    setBusy(true);
    try {
      setSession(await createFromMnemonic(password, mnemonic, chain));
      setWalletPassword(password);
      setUnlocked(true);
      toastOk("入职登记完成，进入刑侦台");
      nav("/board");
    } catch (e) {
      toastErr(e instanceof Error ? e.message : "失败");
    } finally {
      setBusy(false);
    }
  }

  async function passwordLogin() {
    if (loginPassword.length < 8) return toastErr("请输入探员证密码");
    if (!session) return toastErr("请先入职登记");
    setBusy(true);
    try {
      if (!(await verifyWalletPassword(session, loginPassword, chain))) {
        return toastErr("密码错误");
      }
      setWalletPassword(loginPassword);
      setUnlocked(true);
      toastOk("归队成功");
      nav("/board");
    } catch (e) {
      toastErr(e instanceof Error ? e.message : "登入失败");
    } finally {
      setBusy(false);
    }
  }

  if (phase === "login" && hasSession) {
    return (
      <div className="tc-shell max-w-md py-10">
        <div className="tc-sticky mx-auto max-w-xs p-4 text-center">
          <p className="font-serif text-xl font-bold text-ink">档案已封存</p>
          <p className="mt-1 text-xs text-inkMuted">输入探员证密码归队</p>
        </div>
        <article className="tc-paper mt-6 space-y-3 p-5">
          <input
            type="password"
            className="tc-input"
            placeholder="探员证密码"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void passwordLogin()}
          />
          <button type="button" className="tc-btn tc-btn-red w-full" disabled={busy} onClick={() => void passwordLogin()}>
            {busy ? "核验中…" : "密码归队"}
          </button>
        </article>
      </div>
    );
  }

  return (
    <div className="tc-shell max-w-md py-8">
      <div className="tc-paper mx-auto max-w-sm p-5 text-center">
        <p className="tc-label">Case File #001</p>
        <h1 className="font-serif text-2xl font-bold text-ink">ThreadCase 线案</h1>
        <p className="mt-2 text-sm text-inkMuted">链上追踪 · 红线关联 · 自托管刑侦钱包</p>
      </div>
      <article className="tc-paper mt-6 p-5">
        <div className="flex gap-2">
          {(
            [
              ["new", "入职登记"],
              ["mnemonic", "导入卷宗"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`tc-tab ${tab === id ? "tc-tab-on" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          <textarea
            className="tc-input min-h-[72px]"
            placeholder={tab === "new" ? "点击下方随机生成助记词" : "粘贴已有助记词"}
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
          />
          {tab === "new" && (
            <button type="button" className="tc-btn w-full text-xs" disabled={generating} onClick={() => void randomMnemonic()}>
              {generating ? "生成中…" : "随机生成助记词"}
            </button>
          )}
          <input type="password" className="tc-input" placeholder="探员证密码" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" className="tc-input" placeholder="确认密码" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button type="button" className="tc-btn tc-btn-red w-full" disabled={busy} onClick={() => void submitWallet()}>
            {busy ? "登记中…" : "盖章入职"}
          </button>
        </div>
      </article>
    </div>
  );
}
