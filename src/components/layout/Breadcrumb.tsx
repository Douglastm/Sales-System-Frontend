import React from 'react';
import type { BreadcrumbItem } from '../../types';
import styles from './Breadcrumb.module.css';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => (
  <nav className={styles.breadcrumb} aria-label="Navegação">
    <button
      type="button"
      className={styles.link}
      onClick={() => onNavigate?.('/dashboard')}
      aria-label="Ir para dashboard"
    >
      <span className={`material-symbols-rounded ${styles.home}`}>home</span>
    </button>

    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        <span className={`material-symbols-rounded ${styles.sep}`}>chevron_right</span>

        {item.path && idx < items.length - 1 ? (
          <button className={styles.link} onClick={() => onNavigate?.(item.path!)}>
            {item.label}
          </button>
        ) : (
          <span className={`${styles.current} ${idx === items.length - 1 ? styles.currentActive : ''}`}>
            {item.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumb;
