import { useEffect } from "react";
import { useWalletStore } from "../store/walletStore";

export function Toast() {
  const toast = useWalletStore((s) => s.toast);
  const clear = useWalletStore((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clear, 3200);
    return () => clearTimeout(t);
  }, [toast, clear]);
  if (!toast) return null;
  return (
    <div
      className={`fixed left-1/2 top-4 z-50 max-w-sm -translate-x-1/2 rounded border-2 px-4 py-2 text-sm font-semibold shadow-note ${
        toast.kind === "ok" ? "border-stamp bg-paper text-stamp" : "border-thread bg-sticky text-thread"
      }`}
    >
      {toast.msg}
    </div>
  );
}
