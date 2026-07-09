'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import './crud-page.css';

type FieldOption = {
  label: string;
  value: string | boolean | number;
};

type FieldConfig = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'textarea' | 'select';
  required?: boolean;
  options?: FieldOption[];
  full?: boolean;
};

type ColumnConfig = {
  key: string;
  label: string;
  badge?: boolean;
};

type DataCrudPageProps = {
  title: string;
  description: string;
  apiUrl: string;
  idKey: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  defaultForm: Record<string, any>;
  addButtonText: string;
  emptyText: string;
};

export default function DataCrudPage({
  title,
  description,
  apiUrl,
  idKey,
  fields,
  columns,
  defaultForm,
  addButtonText,
  emptyText,
}: DataCrudPageProps) {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [form, setForm] = useState<Record<string, any>>(defaultForm);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function fetchRows(keyword = '') {
    setLoading(true);
    setErrorMessage('');

    try {
      const url = keyword ? `${apiUrl}?search=${encodeURIComponent(keyword)}` : apiUrl;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Gagal mengambil data');
      }

      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRows();
  }, []);

  function resetForm() {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(row: Record<string, any>) {
    const nextForm: Record<string, any> = {};

    fields.forEach((field) => {
      nextForm[field.name] = row[field.name] ?? defaultForm[field.name] ?? '';
    });

    setForm(nextForm);
    setEditingId(row[idKey]);
    setShowForm(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(editingId ? `${apiUrl}/${editingId}` : apiUrl, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan data');
      }

      resetForm();
      fetchRows(search);
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number | string) {
    const confirmed = window.confirm('Yakin ingin menghapus data ini?');

    if (!confirmed) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menghapus data');
      }

      fetchRows(search);
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetchRows(search);
  }

  function renderValue(row: Record<string, any>, column: ColumnConfig) {
    const value = row[column.key];

    if (value === true) return 'Aktif';
    if (value === false) return 'Tidak Aktif';
    if (value === null || value === undefined || value === '') return '-';

    return String(value);
  }

  function getBadgeClass(value: any) {
    const text = String(value).toLowerCase();

    if (text.includes('aktif') || text.includes('lulus') || text.includes('selesai')) {
      return 'green';
    }

    if (text.includes('batal') || text.includes('tidak') || text.includes('terminasi')) {
      return 'red';
    }

    if (text.includes('pending') || text.includes('draft') || text.includes('negosiasi')) {
      return 'yellow';
    }

    return 'blue';
  }

  return (
    <div className="crud-page">
      <div className="crud-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <button
          type="button"
          className="crud-add-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + {addButtonText}
        </button>
      </div>

      <div className="crud-card">
        {errorMessage && <div className="crud-error">{errorMessage}</div>}
        {loading && <div className="crud-loading">Memproses data...</div>}

        {showForm && (
          <form className="crud-form" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div
                key={field.name}
                className={`crud-field ${field.full ? 'crud-form-full' : ''}`}
              >
                <label>{field.label}</label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={form[field.name] ?? ''}
                    onChange={(event) =>
                      setForm({ ...form, [field.name]: event.target.value })
                    }
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={String(form[field.name] ?? '')}
                    onChange={(event) => {
                      const selected = field.options?.find(
                        (option) => String(option.value) === event.target.value,
                      );

                      setForm({
                        ...form,
                        [field.name]: selected ? selected.value : event.target.value,
                      });
                    }}
                    required={field.required}
                  >
                    {field.options?.map((option) => (
                      <option key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={form[field.name] ?? ''}
                    onChange={(event) => {
                      const value =
                        field.type === 'number'
                          ? Number(event.target.value)
                          : event.target.value;

                      setForm({ ...form, [field.name]: value });
                    }}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="crud-form-actions">
              <button type="button" className="crud-cancel-button" onClick={resetForm}>
                Batal
              </button>
              <button type="submit" className="crud-save-button">
                {editingId ? 'Update Data' : 'Simpan Data'}
              </button>
            </div>
          </form>
        )}

        <form className="crud-toolbar" onSubmit={handleSearchSubmit}>
          <input
            className="crud-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari data..."
          />

          <button type="submit" className="crud-refresh-button">
            Cari / Refresh
          </button>
        </form>

        <div className="crud-table-wrap">
          <table className="crud-table">
            <thead>
              <tr>
                <th>No</th>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="crud-empty">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row[idKey]}>
                    <td>{index + 1}</td>

                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.badge ? (
                          <span className={`crud-badge ${getBadgeClass(row[column.key])}`}>
                            {renderValue(row, column)}
                          </span>
                        ) : (
                          renderValue(row, column)
                        )}
                      </td>
                    ))}

                    <td>
                      <div className="crud-actions">
                        <button
                          type="button"
                          className="crud-action-edit"
                          onClick={() => handleEdit(row)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="crud-action-delete"
                          onClick={() => handleDelete(row[idKey])}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
