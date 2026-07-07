'use client';

import { useState } from 'react';
import Header from './header';
import MobileBottomNav from './MobileBottomNav';
import Sidebar from './sidebar';
import './DashboardLayout.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="dashboard-main">
        <Header onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <div className="dashboard-content">{children}</div>
      </main>

      <MobileBottomNav />
    </div>
  );
}