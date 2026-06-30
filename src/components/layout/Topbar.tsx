import React from 'react';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbItem } from '../../types';
import styles from './Topbar.module.css';

interface TopbarProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  onMenuToggle: () => void;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ breadcrumbs, onNavigate, onMenuToggle, onLogout }) => (
  <header className={styles.topbar}>
    <button type="button" className={styles.menuBtn} onClick={onMenuToggle} aria-label="Abrir menu">
      <span className="material-symbols-rounded">menu</span>
    </button>

    <div className={styles.breadcrumbArea}>
      <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />
    </div>

    <div className={styles.actions}>
      <button type="button" className={styles.btn} title="Sair" onClick={onLogout}>
        <span className="material-symbols-rounded">logout</span>
      </button>
    </div>
  </header>
);

export default Topbar;
