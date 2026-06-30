import React, { useEffect, useState } from 'react';
import type { NavItem } from '../../types';
import { NAV_ITEMS } from '../../data/navigation';
import styles from './Sidebar.module.css';
import authService from '../../services/authService';
import UserService from '../../services/userService';
import type { User } from '../../types/user';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen?: boolean;
}

interface NavItemProps {
  item: NavItem;
  currentPath: string;
  onNavigate: (path: string) => void;
  depth?: number;
}

const NavItemComponent: React.FC<NavItemProps> = ({ item, currentPath, onNavigate, depth = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children!.some(c => currentPath.startsWith(c.path));
  const [open, setOpen] = useState(isChildActive);
  const isActive = currentPath === item.path || (hasChildren && currentPath.startsWith(item.path));

  const handleClick = () => {
    if (hasChildren) {
      setOpen(prev => !prev);
      return;
    }

    onNavigate(item.path);
  };

  const itemClass = [
    styles.navItem,
    isActive ? styles.navItemActive : '',
    isChildActive ? styles.navItemParentActive : '',
    depth > 0 ? styles.navItemChild : '',
  ].filter(Boolean).join(' ');

  return (
    <li>
      <button type="button" className={itemClass} onClick={handleClick} title={item.label}>
        <span className={`material-symbols-rounded ${styles.navIcon}`}>{item.icon}</span>
        <span className={styles.navLabel}>{item.label}</span>
        {hasChildren && (
          <span className={`material-symbols-rounded ${styles.navChevron} ${open ? styles.navChevronOpen : ''}`}>
            chevron_right
          </span>
        )}
      </button>

      {hasChildren && open && (
        <ul className={styles.navChildren}>
          {item.children!.map(child => (
            <NavItemComponent
              key={child.key}
              item={child}
              currentPath={currentPath}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, isOpen }) => {
  const sidebarClass = [styles.sidebar, isOpen ? styles.sidebarOpen : ''].filter(Boolean).join(' ');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    void loadCurrentUser();
  }, []);

  async function loadCurrentUser() {
    try {
      const currentUserId = authService.getCurrentUserId();

      if (currentUserId) {
        const user = await UserService.findById(currentUserId);
        setCurrentUser(user);
        return;
      }

      const currentUserEmail = authService.getCurrentUserEmail();

      if (!currentUserEmail) {
        return;
      }

      const users = await UserService.findAll();
      const matchedUser = users.find((user) => user.email.toLowerCase() === currentUserEmail.toLowerCase());

      if (matchedUser) {
        setCurrentUser(matchedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuario do sidebar:', error);
    }
  }

  return (
    <aside className={sidebarClass}>
      <button type="button" className={styles.logo} onClick={() => onNavigate('/dashboard')}>
        <div className={styles.logoIcon}>
          <span className="material-symbols-rounded">storefront</span>
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>Sales</span>
          <span className={styles.logoSub}>System</span>
        </div>
      </button>

      <div className={styles.divider} />

      {/* Nav */}
      <nav className={styles.nav}>
        <p className={styles.sectionLabel}>Menu</p>
        <ul className={styles.navList}>
          {NAV_ITEMS.map(item => (
            <NavItemComponent
              key={item.key}
              item={item}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.divider} />
        <button
          type="button"
          className={`${styles.navItem} ${currentPath === '/settings' ? styles.navItemActive : ''}`}
          onClick={() => onNavigate('/settings')}
        >
          <span className={`material-symbols-rounded ${styles.navIcon}`}>settings</span>
          <span className={styles.navLabel}>Configurações</span>
        </button>
        <button type="button" className={styles.userCard} onClick={() => onNavigate('/settings')}>
          <div className={styles.userAvatar}>{getUserInitials(currentUser?.name)}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{currentUser?.name ?? 'Usuário'}</span>
            <span className={styles.userRole}>{formatRole(currentUser?.role)}</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

function getUserInitials(name?: string) {
  if (!name?.trim()) {
    return 'US';
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const firstInitial = parts[0]?.[0] ?? '';
  const lastInitial = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';

  return `${firstInitial}${lastInitial || firstInitial}`.toUpperCase().slice(0, 2);
}

function formatRole(role?: string) {
  switch ((role ?? '').toUpperCase()) {
    case 'ADMIN':
      return 'Administrador';
    case 'MANAGER':
      return 'Gerente';
    case 'SELLER':
      return 'Vendedor';
    case 'USER':
      return 'Usuario';
    default:
      return role ?? 'Sem perfil';
  }
}

export default Sidebar;
