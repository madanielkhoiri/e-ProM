import { Bell, BriefcaseBusiness, Home, Plus, UserRound } from 'lucide-react';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav">
      <a href="/dashboard" className="mobile-nav-item active">
        <Home size={20} />
        <span>Home</span>
      </a>

      <a href="/module/project" className="mobile-nav-item">
        <BriefcaseBusiness size={20} />
        <span>Project</span>
      </a>

      <button type="button" className="mobile-plus-button">
        <Plus size={27} />
      </button>

      <a href="/module/notifikasi" className="mobile-nav-item notification-nav">
        <Bell size={20} />
        <span>Notifikasi</span>
        <b>7</b>
      </a>

      <a href="/module/akun" className="mobile-nav-item">
        <UserRound size={20} />
        <span>Akun</span>
      </a>
    </nav>
  );
}