import React from 'react';
import styles from './StatusBadge.module.css';

const CONFIG: Record<string, { color: keyof typeof styles; icon: string }> = {
  'Ativo':      { color: 'green',  icon: 'check_circle' },
  'Inativo':    { color: 'gray',   icon: 'cancel' },
  'Concluída':  { color: 'green',  icon: 'task_alt' },
  'Pendente':   { color: 'yellow', icon: 'schedule' },
  'Cancelada':  { color: 'red',    icon: 'do_not_disturb_on' },
};

interface Props { value: string; }

const StatusBadge: React.FC<Props> = ({ value }) => {
  const cfg = CONFIG[value] ?? { color: 'gray', icon: 'info' };
  return (
    <span className={`${styles.badge} ${styles[cfg.color]}`}>
      <span className={`material-symbols-rounded ${styles.icon}`}>{cfg.icon}</span>
      {value}
    </span>
  );
};

export default StatusBadge;
