'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './crud-page.css';

const MySwal = withReactContent(Swal);

const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

type FieldOption = {
  label: string;
  value: string | boolean | number;
};

type FieldConfig = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'textarea' | 'select' | 'file' | 'checkbox-group';
  required?: boolean;
  options?: FieldOption[];
  full?: boolean;
  multiple?: boolean;
  excludeFromPayload?: boolean;
};

type ColumnConfig = {
  key: string;
  label: string;
  badge?: boolean;
  file?: boolean;
  format?: 'currency';
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
  customActions?: (row: Record<string, any>) => React.ReactNode;
  afterSave?: (data: any, form: Record<string, any>) => Promise<void>;
  disableEdit?: boolean;
  refreshTrigger?: number;
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
  customActions,
  afterSave,
  disableEdit = false,
  refreshTrigger = 0,
}: DataCrudPageProps) {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [form, setForm] = useState<Record<string, any>>(defaultForm);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function getLoginUserName() {
    try {
      const userText = localStorage.getItem('user');
      if (!userText) return 'Owner';

      const user = JSON.parse(userText);
      return user?.name || user?.username || 'Owner';
    } catch {
      return 'Owner';
    }
  }

  function getFinalForm() {
    const finalForm = { ...form };

    if ('created_by' in defaultForm) {
      finalForm.created_by = finalForm.created_by || getLoginUserName();
    }

    fields.forEach((field) => {
      if (field.excludeFromPayload) {
        delete finalForm[field.name];
      } else if (finalForm[field.name] === '') {
        finalForm[field.name] = null;
      }
    });

    return finalForm;
  }

  async function fetchRows(keyword = '') {
    setLoading(true);
    setErrorMessage('');

    try {
      const url = keyword ? `${apiUrl}?search=${encodeURIComponent(keyword)}` : apiUrl;
      // Add cache: 'no-store' to prevent Next.js from aggressively caching the response
      const response = await fetch(url, { cache: 'no-store' });

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
  }, [refreshTrigger]);

  function resetForm() {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(row: Record<string, any>) {
    const nextForm: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === 'file') {
        nextForm[field.name] = null;
      } else {
        nextForm[field.name] = row[field.name] ?? defaultForm[field.name] ?? '';
      }
    });

    if ('created_by' in defaultForm) {
      nextForm.created_by = row.created_by ?? getLoginUserName();
    }

    setForm(nextForm);
    setEditingId(row[idKey]);
    setShowForm(true);
  }

  function hasFileField(finalForm: Record<string, any>) {
    return fields.some((field) => field.type === 'file' && finalForm[field.name]);
  }

  function buildRequestBody() {
    const finalForm = getFinalForm();

    if (!hasFileField(finalForm)) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalForm),
      };
    }

    const formData = new FormData();

    Object.entries(finalForm).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, value);
      }
    });

    return {
      body: formData,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const requestBody = buildRequestBody();

      const response = await fetch(editingId ? `${apiUrl}/${editingId}` : apiUrl, {
        method: editingId ? 'PATCH' : 'POST',
        ...requestBody,
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.message || 'Gagal menyimpan data';
        if (Array.isArray(data.message)) {
          errorMsg = `<ul style="text-align: left; margin: 0; padding-left: 1.5rem;">${data.message.map((m: string) => `<li>${m}</li>`).join('')}</ul>`;
        }
        throw new Error(errorMsg);
      }

      if (afterSave) {
        await afterSave(data, form);
      } else {
        Toast.fire({
          icon: 'success',
          title: 'Data berhasil disimpan.'
        });
      }

      resetForm();
      fetchRows(search);
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan');
      MySwal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        html: error.message || 'Harap periksa kembali isian Anda.',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number | string) {
    const result = await MySwal.fire({
      title: 'Yakin ingin menghapus data ini?',
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

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

      await fetchRows(search);
      
      Toast.fire({
        icon: 'success',
        title: 'Data berhasil dihapus.'
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan');
      MySwal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat menghapus data.',
      });
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

    if (column.format === 'currency') {
      return `Rp ${Number(value).toLocaleString('id-ID')}`;
    }

    if (column.file) {
      const fileName = String(value).split('/').pop();
      return <span title={String(value)}>{fileName || String(value)}</span>;
    }

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
                ) : field.type === 'file' ? (
                  <input
                    type="file"
                    multiple={field.multiple}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [field.name]: field.multiple ? event.target.files : event.target.files?.[0],
                      })
                    }
                    required={field.required && !editingId}
                  />
                ) : field.type === 'checkbox-group' ? (
                  <div className="crud-checkbox-group">
                    {field.options?.map((opt) => (
                      <label key={String(opt.value)} className="crud-checkbox-label">
                        <input
                          type="checkbox"
                          value={String(opt.value)}
                          checked={(form[field.name] || []).includes(opt.value)}
                          onChange={(e) => {
                            const curr = form[field.name] || [];
                            if (e.target.checked) {
                              setForm({ ...form, [field.name]: [...curr, opt.value] });
                            } else {
                              setForm({ ...form, [field.name]: curr.filter((v: any) => v !== opt.value) });
                            }
                          }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : field.type === 'select' ? (
                  <Select
                    options={field.options}
                    value={field.options?.find(opt => String(opt.value) === String(form[field.name] ?? '')) || null}
                    onChange={(selected: any) => {
                      setForm({
                        ...form,
                        [field.name]: selected ? selected.value : '',
                      });
                    }}
                    placeholder={`-- Pilih ${field.label} --`}
                    isClearable
                    required={field.required && !form[field.name]}
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: '0.2rem',
                        borderRadius: '8px',
                        borderColor: '#cbd5e1',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#94a3b8'
                        }
                      })
                    }}
                  />
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
                        {customActions && customActions(row)}
                        {!disableEdit && (
                          <button
                            type="button"
                            className="crud-action-edit"
                            onClick={() => handleEdit(row)}
                          >
                            Edit
                          </button>
                        )}
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
