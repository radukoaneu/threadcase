import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Toast } from "./components/Toast";
import { GatePage } from "./pages/GatePage";
import { BoardPage } from "./pages/BoardPage";
import { TracePage } from "./pages/TracePage";
import { ReportPage } from "./pages/ReportPage";
import { NotesPage } from "./pages/NotesPage";
import { TransferPage } from "./pages/TransferPage";
import { useWalletStore } from "./store/walletStore";

function CaseGuard({ children }: { children: React.ReactNode }) {
  const session = useWalletStore((s) => s.session);
  const unlocked = useWalletStore((s) => s.unlocked);
  if (!session || !unlocked) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const hydrate = useWalletStore((s) => s.hydrate);
  const hydrated = useWalletStore((s) => s.hydrated);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  if (!hydrated) return null;
  const base = import.meta.env.BASE_URL;
  return (
    <BrowserRouter basename={base === "/" ? undefined : base.replace(/\/$/, "")}>
      <Toast />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GatePage />} />
          <Route path="/board" element={<CaseGuard><BoardPage /></CaseGuard>} />
          <Route path="/trace" element={<CaseGuard><TracePage /></CaseGuard>} />
          <Route path="/report" element={<CaseGuard><ReportPage /></CaseGuard>} />
          <Route path="/notes" element={<CaseGuard><NotesPage /></CaseGuard>} />
          <Route path="/send" element={<CaseGuard><TransferPage /></CaseGuard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
