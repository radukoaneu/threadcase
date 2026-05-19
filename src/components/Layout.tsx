import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useWalletStore } from "../store/walletStore";

const NAV = [
  ["board", "线索墙"],
  ["trace", "追踪"],
  ["report", "报告"],
  ["notes", "笔记"],
  ["send", "调证"],
] as const;

export function Layout() {
  const session = useWalletStore((s) => s.session);
  const unlocked = useWalletStore((s) => s.unlocked);
  const setUnlocked = useWalletStore((s) => s.setUnlocked);
  const setWalletPassword = useWalletStore((s) => s.setWalletPassword);
  const nav = useNavigate();

  if (!session || !unlocked) return <Outlet />;

  return (
    <div className="min-h-screen">
      <header className="border-b-4 border-corkDark/50 bg-paper/90 px-4 py-3 text-center shadow-note">
        <p className="tc-label">ThreadCase Bureau</p>
        <h1 className="font-serif text-lg font-bold text-ink">线案 · 链上刑侦台</h1>
      </header>
      <main className="tc-shell">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 px-3 pb-4">
        <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-1 rounded border-2 border-ink/20 bg-paper/95 p-2 shadow-polaroid">
          {NAV.map(([to, label]) => (
            <NavLink
              key={to}
              to={`/${to}`}
              className={({ isActive }) =>
                `rounded px-2 py-1.5 text-[10px] font-bold ${isActive ? "bg-thread text-paper" : "text-inkMuted"}`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            className="rounded px-2 py-1.5 text-[10px] text-inkMuted"
            onClick={() => {
              setUnlocked(false);
              setWalletPassword("");
              nav("/");
            }}
          >
            收队
          </button>
        </div>
      </nav>
    </div>
  );
}
