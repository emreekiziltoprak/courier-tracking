import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { CalciteButton } from "@esri/calcite-components-react";
import { useSSE } from "@/hooks/useSSE";
import { useDataInit } from "@/hooks/useDataInit";
import { useUiStore } from "@/store/uiStore";
import { useCourierStore } from "@/store/courierStore";
import { useStoreStore } from "@/store/storeStore";
import { memo } from "react";
import { DashboardPage } from "@/pages/DashboardPage";
import { CouriersPage } from "@/pages/CouriersPage";
import { StatusBadge } from "@/components/common/StatusBadge";

const MemoizedDashboard = memo(DashboardPage);
const MemoizedCouriers = memo(CouriersPage);

function NavCounters() {
  const courierCount = useCourierStore((s) => Object.keys(s.couriersById).length);
  const storeCount = useStoreStore((s) => s.stores.length);
  return (
    <div className="nav-counters">
      <div className="nav-counters__item">
        <div className="nav-counters__value nav-counters__value--warning">
          {courierCount}
        </div>
        <div className="nav-counters__label">
          Couriers
        </div>
      </div>
      <div className="nav-counters__item">
        <div className="nav-counters__value nav-counters__value--brand">
          {storeCount}
        </div>
        <div className="nav-counters__label">
          Stores
        </div>
      </div>
    </div>
  );
}

function SseIndicator() {
  const connected = useUiStore((s) => s.sseConnected);
  return <StatusBadge connected={connected} />;
}

function AppShell() {
  useSSE();
  useDataInit();

  const navigate = useNavigate();

  return (
    <div className="calcite-mode-dark app-shell">
      <nav className="nav">
        <div className="nav__left">

          <div className="nav__divider" />

          <NavLink to="/dashboard" className="nav__link">
            {({ isActive }) => (
              <CalciteButton
                appearance="transparent"
                kind={isActive ? "brand" : "neutral"}
                iconStart="map"
                scale="s"
              >
                Dashboard
              </CalciteButton>
            )}
          </NavLink>
          <NavLink to="/couriers" className="nav__link">
            {({ isActive }) => (
              <CalciteButton
                appearance="transparent"
                kind={isActive ? "brand" : "neutral"}
                iconStart="user"
                scale="s"
              >
                Couriers
              </CalciteButton>
            )}
          </NavLink>
        </div>

        <div className="nav__right">
          <NavCounters />
          <div className="nav__divider nav__divider--sm" />
          <SseIndicator />
          <CalciteButton
            appearance="transparent"
            kind="neutral"
            iconStart="reset"
            scale="s"
            onClick={() => navigate(0)}
            title="Refresh data"
          />
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<MemoizedDashboard />} />
          <Route path="/couriers" element={<MemoizedCouriers />} />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
