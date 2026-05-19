import { create } from "zustand";
import { CHAINS, DEFAULT_CHAIN } from "../lib/chains";
import { clearSession, loadChainId, loadSession, saveChainId } from "../lib/walletCore";
import type { WalletSession } from "../types";

interface State {
  hydrated: boolean;
  session: WalletSession | null;
  unlocked: boolean;
  walletPassword: string;
  chainId: string;
  toast: { kind: "ok" | "err"; msg: string } | null;
  hydrate: () => void;
  setSession: (s: WalletSession | null) => void;
  setUnlocked: (v: boolean) => void;
  setWalletPassword: (p: string) => void;
  setChain: (id: string) => void;
  lock: () => void;
  toastOk: (m: string) => void;
  toastErr: (m: string) => void;
  clearToast: () => void;
}

export const useWalletStore = create<State>((set) => ({
  hydrated: false,
  session: null,
  unlocked: false,
  walletPassword: "",
  chainId: DEFAULT_CHAIN,
  toast: null,
  hydrate: () => {
    const session = loadSession();
    const cid = loadChainId() || DEFAULT_CHAIN;
    set({
      session,
      chainId: CHAINS[cid] ? cid : DEFAULT_CHAIN,
      hydrated: true,
    });
  },
  setSession: (s) => set({ session: s, unlocked: false }),
  setUnlocked: (v) => set({ unlocked: v }),
  setWalletPassword: (p) => set({ walletPassword: p }),
  setChain: (id) => {
    saveChainId(id);
    set({ chainId: id });
  },
  lock: () => {
    clearSession();
    set({ session: null, unlocked: false, walletPassword: "" });
  },
  toastOk: (msg) => set({ toast: { kind: "ok", msg } }),
  toastErr: (msg) => set({ toast: { kind: "err", msg } }),
  clearToast: () => set({ toast: null }),
}));
