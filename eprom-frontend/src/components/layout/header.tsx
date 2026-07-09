'use client';

import { useEffect, useState } from 'react';
import { Bell, HelpCircle, Mail, Menu, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import './header.css';

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUserData(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar Aplikasi?',
      text: "Anda harus login kembali untuk masuk.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  };

  const getRoleName = (roleId?: number) => {
    switch (roleId) {
      case 1: return 'Owner';
      case 2: return 'Panitia';
      case 3: return 'Vendor';
      default: return 'User';
    }
  };

  const name = userData?.name || userData?.username || 'Angga Dwi Cahyanto';
  const roleName = userData ? getRoleName(userData.role_id) : 'Owner';

  return (
    <header className="dashboard-header">
      <div className="desktop-header-left">
        <button type="button" className="header-menu-button">
          <Menu size={22} />
        </button>

        <div>
          <p>
            Selamat datang, <strong>{name}</strong>
          </p>
          <h1>{roleName} Dashboard</h1>
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
          <strong>{name}</strong>
          <span>{roleName}</span>
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
          <div className="header-avatar">{name.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{name}</strong>
            <p>{roleName}</p>
          </div>
        </div>

        <div style={{ width: '1px', height: '32px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>

        <button 
          type="button" 
          className="header-icon-button" 
          onClick={handleLogout} 
          style={{ color: '#ef4444' }}
          title="Keluar (Logout)"
        >
          <LogOut size={21} />
        </button>
      </div>
    </header>
  );
}