import React, { useState } from 'react';
import type { Column, TableAction } from '../../types';
import styles from './DataTable.module.css';

interface DataTableProps<T extends { id: string | number }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  onNew?: () => void;
  newLabel?: string;
  searchPlaceholder?: string;
}

function DataTable<T extends { id: string | number }>({
  title,
  data,
  columns,
  actions = [],
  onNew,
  newLabel = 'Novo',
  searchPlaceholder = 'Buscar...',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);
  const perPage = 8;

  const filtered = data.filter(row =>
    Object.values(row as Record<string, unknown>).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const getCellValue = (row: T, col: Column<T>) => {
    if (col.render) return col.render(row);
    return String((row as Record<string, unknown>)[col.key as string] ?? '');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.count}>{filtered.length} registros</span>
        </div>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <span className={`material-symbols-rounded ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <button type="button" className={styles.searchClear} onClick={() => { setSearch(''); setPage(1); }}>
                <span className="material-symbols-rounded">close</span>
              </button>
            )}
          </div>
          {onNew && (
            <button type="button" className={styles.btnNew} onClick={onNew}>
              <span className="material-symbols-rounded">add</span>
              <span>{newLabel}</span>
            </button>
          )}
        </div>
      </div>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={String(col.key)}>{col.label}</th>
              ))}
              {actions.length > 0 && <th className={styles.actionsCol}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className={styles.emptyCell}
                >
                  <span className="material-symbols-rounded">search_off</span>
                  <p>Nenhum registro encontrado</p>
                </td>
              </tr>
            ) : (
              paginated.map(row => (
                <tr key={row.id} className={styles.row}>
                  {columns.map(col => (
                    <td key={String(col.key)}>{getCellValue(row, col)}</td>
                  ))}
                  {actions.length > 0 && (
                    <td className={styles.actionsCell}>
                      <div className={styles.actionBtns}>
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`${styles.actionBtn} ${action.variant === 'danger' ? styles.actionBtnDanger : ''}`}
                            title={action.label}
                            onClick={() => action.onClick(row)}
                          >
                            <span className="material-symbols-rounded">{action.icon}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span className={styles.paginationInfo}>
          Mostrando {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} de {filtered.length}
        </span>
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              type="button"
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
