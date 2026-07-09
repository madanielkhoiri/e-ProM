'use client';

import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { sidebarMenus } from '@/lib/menu';
import './sidebar.css';

type SidebarItem = {
  label: string;
  icon?: any;
  href?: string;
  children?: SidebarItem[];
};

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
    'Master Data': true,
    Tender: true,
    'Penentuan Pemenang': true,
    Kontrak: true,
  });

  function toggleMenu(label: string) {
    setOpenMenus((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>, href?: string) {
    if (!href || href === '#') {
      event.preventDefault();
      return;
    }

    onClose?.();
  }

  function renderLink(item: SidebarItem, className: string) {
    return (
      <a
        key={item.label}
        href={item.href || '#'}
        className={className}
        onClick={(event) => handleLinkClick(event, item.href)}
      >
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <>
      <div
        className={`mobile-sidebar-overlay ${isMobileOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-mobile-header">
          <strong>Menu</strong>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-logo">
          <img src="/images/logo-eprom.png" alt="E-ProM" />
        </div>

        <nav className="sidebar-nav">
          {sidebarMenus.map((menu: SidebarItem) => {
            const Icon = menu.icon;
            const hasChildren = menu.children && menu.children.length > 0;

            if (!hasChildren) {
              return (
                <a
                  key={menu.label}
                  href={menu.href || '#'}
                  className="sidebar-main-link"
                  onClick={(event) => handleLinkClick(event, menu.href)}
                >
                  {Icon && <Icon size={18} />}
                  <span>{menu.label}</span>
                </a>
              );
            }

            return (
              <div key={menu.label} className="sidebar-group">
                <button
                  type="button"
                  className="sidebar-group-title"
                  onClick={() => toggleMenu(menu.label)}
                >
                  <span>
                    {Icon && <Icon size={17} />}
                    {menu.label}
                  </span>

                  {openMenus[menu.label] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {openMenus[menu.label] && (
                  <div className="sidebar-group-content">
                    {menu.children?.map((child) => {
                      const childHasChildren =
                        child.children && child.children.length > 0;

                      if (!childHasChildren) {
                        return renderLink(child, 'sidebar-link');
                      }

                      return (
                        <div key={child.label} className="sidebar-subgroup">
                          <button
                            type="button"
                            className="sidebar-subgroup-title"
                            onClick={() => toggleMenu(child.label)}
                          >
                            <span>{child.label}</span>

                            {openMenus[child.label] ? (
                              <ChevronDown size={15} />
                            ) : (
                              <ChevronRight size={15} />
                            )}
                          </button>

                          {openMenus[child.label] && (
                            <div className="sidebar-subgroup-content">
                              {child.children?.map((subitem) =>
                                renderLink(subitem, 'sidebar-subitem'),
                              )}
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
      </aside>
    </>
  );
}
