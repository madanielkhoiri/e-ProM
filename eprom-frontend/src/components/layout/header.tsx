import { Bell, HelpCircle, Mail, Menu } from 'lucide-react';
import './header.css';

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  return (
    <header className="dashboard-header">
      <div className="desktop-header-left">
        <button type="button" className="header-menu-button">
          <Menu size={22} />
        </button>

        <div>
          <p>
            Selamat datang, <strong>Angga Dwi Cahyanto</strong>
          </p>
          <h1>Owner Dashboard</h1>
        </div>
      </div>

      <div className="mobile-header-left">
        <div className="mobile-header-top">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={onOpenSidebar}
          >
            <Menu size={22} />
          </button>

          <h1>Dashboard</h1>

          <button type="button" className="mobile-bell-button">
            <Bell size={21} />
            <span>7</span>
          </button>
        </div>

        <div className="mobile-welcome">
          <p>Selamat datang,</p>
          <strong>Angga Dwi Cahyanto</strong>
          <span>Owner</span>
        </div>
      </div>

      <div className="dashboard-header-right">
        <button type="button" className="header-icon-button notification">
          <Bell size={21} />
          <span>7</span>
        </button>

        <button type="button" className="header-icon-button">
          <Mail size={21} />
        </button>

        <button type="button" className="header-icon-button">
          <HelpCircle size={21} />
        </button>

        <div className="header-profile">
          <div className="header-avatar">A</div>
          <div>
            <strong>Angga Dwi Cahyanto</strong>
            <p>Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}