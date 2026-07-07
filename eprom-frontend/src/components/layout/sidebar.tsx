'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight, Home, X } from 'lucide-react';
import { useState } from 'react';
import { sidebarMenus } from '@/lib/menu';
import './sidebar.css';

export default function Sidebar({
  isMobileOpen = false,
  onClose,
}: {
  isMobileOpen?: boolean;
  onClose?: () => void;
}) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'OWNER AREA': true,
    'PROJECT AREA': true,
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      <div
        className={`mobile-sidebar-overlay ${isMobileOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-mobile-header">
          <span>Menu E-ProM</span>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-logo">
          <img src="/images/logo-eprom.png" alt="E-ProM Logo" />
        </div>

        <nav className="sidebar-nav">
          {sidebarMenus.map((menu) => {
            const Icon = menu.icon || Home;
            const isOpen = openMenus[menu.title];

            if (menu.href) {
              return (
                <Link
                  key={menu.title}
                  href={menu.href}
                  className="sidebar-link active"
                  onClick={onClose}
                >
                  <Icon size={20} />
                  <span>{menu.title}</span>
                </Link>
              );
            }

            return (
              <div key={menu.title} className="sidebar-group">
                <button
                  type="button"
                  className="sidebar-group-title"
                  onClick={() => toggleMenu(menu.title)}
                >
                  <span>
                    <Icon size={20} />
                    {menu.title}
                  </span>
                  {isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isOpen && (
                  <div className="sidebar-submenu">
                    {menu.children?.map((child) => {
                      const childOpen = openMenus[child.title];

                      return (
                        <div key={child.title} className="sidebar-subgroup">
                          <button
                            type="button"
                            className="sidebar-subgroup-title"
                            onClick={() => toggleMenu(child.title)}
                          >
                            <span>{child.title}</span>
                            {childOpen ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </button>

                          {childOpen && (
                            <div className="sidebar-subitems">
                              {child.children?.map((item) => (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  className="sidebar-subitem"
                                  onClick={onClose}
                                >
                                  {item.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer-card">
          <p>Total Project</p>
          <h3>12</h3>
          <span>Active 8 | Closing 2 | Retention 2</span>
        </div>
      </aside>
    </>
  );
}