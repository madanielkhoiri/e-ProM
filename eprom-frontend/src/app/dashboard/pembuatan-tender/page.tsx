'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCrudPage from '../components/DataCrudPage';

const MySwal = withReactContent(Swal);

const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

export default function PembuatanTenderPage() {
  const router = useRouter();
  const [projectOptions, setProjectOptions] = useState<{label: string, value: number}[]>([]);
  const [availableVendors, setAvailableVendors] = useState<{label: string, value: number}[]>([]);

  // Modal State
  const [detailModalTender, setDetailModalTender] = useState<any>(null);
  const [inviteModalTender, setInviteModalTender] = useState<any>(null);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Vendor Invite Pagination & Search State
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorPage, setVendorPage] = useState(1);
  const VENDORS_PER_PAGE = 5;

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Fetch Projects
    fetch('http://localhost:3000/projects', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjectOptions(data.map((p: any) => ({
            label: p.nama_project,
            value: p.project_id
          })));
        }
      })
      .catch(err => console.error('Gagal mengambil data project', err));

    // Fetch Vendors
    fetch('http://localhost:3000/vendors', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAvailableVendors(data.map((v: any) => ({
            label: `${v.nama_vendor} (${v.email})`,
            value: v.vendor_id
          })));
        }
      })
      .catch(err => console.error('Gagal mengambil data vendor', err));
  }, []);

  const handleAfterSave = async (data: any, form: Record<string, any>) => {
    try {
      // 1. Upload Documents
      if (form.files && form.files.length > 0) {
        const formData = new FormData();
        formData.append('jenis_dokumen', 'dokumen_pekerjaan');
        Array.from(form.files).forEach((f: any) => formData.append('files', f));
        
        await fetch(`http://localhost:3000/tenders/${data.tender_id}/documents`, {
          method: 'POST',
          body: formData,
        });
      }
      
      Toast.fire({
        icon: 'success',
        title: 'Tender baru berhasil disimpan.'
      });
    } catch (error) {
      console.error('Gagal mengupload dokumen', error);
      MySwal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Tender berhasil dibuat, tetapi ada kesalahan saat mengupload dokumen.',
      });
    }
  };

  const openInviteModal = async (row: any) => {
    setModalLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/tenders/${row.tender_id}`, { cache: 'no-store' });
      const freshRow = await res.json();
      setInviteModalTender(freshRow);
      if (freshRow.tenderVendors && Array.isArray(freshRow.tenderVendors)) {
        setSelectedVendors(freshRow.tenderVendors.map((tv: any) => tv.vendor_id || tv.vendor?.vendor_id).filter(Boolean));
      } else {
        setSelectedVendors([]);
      }
      setVendorSearch('');
      setVendorPage(1);
    } catch (err) {
      console.error(err);
      MySwal.fire('Error', 'Gagal memuat data tender', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const submitInvite = async () => {
    setModalLoading(true);
    try {
      const inviteResponse = await fetch(`http://localhost:3000/tenders/${inviteModalTender.tender_id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_ids: selectedVendors }),
      });
      
      if (!inviteResponse.ok) throw new Error('Gagal mengundang vendor');
      
      Toast.fire({
        icon: 'success',
        title: 'Undangan berhasil dikirim.'
      });
      setInviteModalTender(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat mengundang vendor.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const openDetailModal = async (row: any) => {
    setModalLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/tenders/${row.tender_id}`, { cache: 'no-store' });
      const data = await res.json();
      setDetailModalTender(data);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat detail tender');
    } finally {
      setModalLoading(false);
    }
  };

  // Vendor Pagination Logic
  const filteredVendors = availableVendors.filter(v => 
    v.label.toLowerCase().includes(vendorSearch.toLowerCase())
  );
  const totalVendorPages = Math.ceil(filteredVendors.length / VENDORS_PER_PAGE) || 1;
  const paginatedVendors = filteredVendors.slice(
    (vendorPage - 1) * VENDORS_PER_PAGE,
    vendorPage * VENDORS_PER_PAGE
  );

  return (
    <DashboardLayout>
      <DataCrudPage
        title="Pembuatan Tender"
        description="Kelola pembuatan tender, upload dokumen, dan undang vendor secara bersamaan."
        apiUrl="http://localhost:3000/tenders"
        idKey="tender_id"
        addButtonText="Buat Tender"
        emptyText="Data tender belum tersedia"
        afterSave={handleAfterSave}
        disableEdit={true}
        customActions={(row) => (
          <>
            <button 
              type="button" 
              className="crud-action-invite" 
              onClick={() => openInviteModal(row)}
              disabled={modalLoading}
            >
              Undang
            </button>
            <button 
              type="button" 
              className="crud-action-detail" 
              onClick={() => openDetailModal(row)}
              disabled={modalLoading}
            >
              Detail
            </button>
          </>
        )}
        defaultForm={{
          project_id: '',
          nama_pekerjaan: '',
          nomor_wo: '',
          estimasi_harga: '',
          deskripsi_pekerjaan: '',
          tanggal_mulai_tender: '',
          tanggal_batas_penawaran: '',
          vendor_ids: [],
          files: null,
        }}
        fields={[
          {
            name: 'project_id',
            label: 'Project',
            type: 'select',
            required: true,
            options: projectOptions,
            full: true
          },
          { name: 'nomor_wo', label: 'Nomor WO', required: true },
          { name: 'nama_pekerjaan', label: 'Nama Pekerjaan', required: true },
          { name: 'estimasi_harga', label: 'Estimasi Harga (Rp)', type: 'number', required: true },
          { name: 'tanggal_mulai_tender', label: 'Tanggal Mulai', type: 'date', required: true },
          {
            name: 'tanggal_batas_penawaran',
            label: 'Tanggal Batas Penawaran',
            type: 'date',
            required: true,
          },
          { name: 'deskripsi_pekerjaan', label: 'Deskripsi Pekerjaan', type: 'textarea', full: true, required: true },
          {
            name: 'files',
            label: 'Upload Dokumen Pendukung',
            type: 'file',
            multiple: true,
            required: true,
            full: true,
            excludeFromPayload: true
          }
        ]}
        columns={[
          { key: 'nomor_wo', label: 'Nomor WO' },
          { key: 'nama_pekerjaan', label: 'Nama Pekerjaan' },
          { key: 'estimasi_harga', label: 'Estimasi Harga', format: 'currency' },
          { key: 'status_tender', label: 'Status', badge: true },
        ]}
        refreshTrigger={refreshTrigger}
      />

      {/* Detail Modal */}
      {detailModalTender && (
        <div className="crud-modal-backdrop">
          <div className="crud-modal-content" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="crud-modal-header">
              <h2>Detail Tender - {detailModalTender.nama_pekerjaan}</h2>
              <button onClick={() => setDetailModalTender(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}>&times;</button>
            </div>
            <div className="crud-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <svg style={{ width: '20px', height: '20px', marginRight: '8px', color: '#4338ca' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Informasi Utama
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem' }}>
                  <div><div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</div><div style={{ fontWeight: 500, color: '#334155' }}>{detailModalTender.project?.nama_project || '-'}</div></div>
                  <div><div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nomor WO</div><div style={{ fontWeight: 500, color: '#334155' }}>{detailModalTender.nomor_wo}</div></div>
                  <div><div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Tender</div><div><span className="crud-badge blue" style={{ padding: '0.25rem 0.75rem' }}>{detailModalTender.status_tender}</span></div></div>
                  {detailModalTender.estimasi_harga && (
                    <div><div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimasi Harga</div><div style={{ fontWeight: 600, color: '#059669' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detailModalTender.estimasi_harga)}</div></div>
                  )}
                  {detailModalTender.tanggal_mulai_tender && (
                    <div><div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tanggal Mulai</div><div style={{ fontWeight: 500, color: '#334155' }}>{new Date(detailModalTender.tanggal_mulai_tender).toLocaleDateString('id-ID')}</div></div>
                  )}
                  {detailModalTender.tanggal_batas_penawaran && (
                    <div><div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batas Penawaran</div><div style={{ fontWeight: 500, color: '#b91c1c' }}>{new Date(detailModalTender.tanggal_batas_penawaran).toLocaleDateString('id-ID')}</div></div>
                  )}
                  {detailModalTender.deskripsi_pekerjaan && (
                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0' }}>
                      <div style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deskripsi Pekerjaan</div>
                      <div style={{ fontWeight: 400, color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{detailModalTender.deskripsi_pekerjaan}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '20px', height: '20px', marginRight: '8px', color: '#0284c7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Vendor Terundang
                  </div>
                  <span style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem', padding: '0.1rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{detailModalTender.tenderVendors?.length || 0} Vendor</span>
                </h3>
                {detailModalTender.tenderVendors?.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {detailModalTender.tenderVendors.map((inv: any) => (
                      <div key={inv.tender_vendor_id} style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.875rem' }}>{inv.vendor?.nama_vendor || `Vendor #${inv.vendor_id}`}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Status: {inv.status_undangan}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
                    Belum ada vendor yang diundang ke tender ini.
                  </div>
                )}
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '20px', height: '20px', marginRight: '8px', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Dokumen Pendukung
                  </div>
                  <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', padding: '0.1rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{detailModalTender.dokumens?.length || 0} File</span>
                </h3>
                {detailModalTender.dokumens?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {detailModalTender.dokumens.map((doc: any) => (
                      <div key={doc.dokumen_id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#334155' }}>{doc.nama_file || doc.path_file?.split('/').pop() || 'Dokumen Tanpa Nama'}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Jenis: {doc.jenis_dokumen}</div>
                        </div>
                        <a href={`http://localhost:3000/${doc.path_file}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', background: '#fff', color: '#0284c7', borderRadius: '6px', fontSize: '0.875rem', textDecoration: 'none', border: '1px solid #bae6fd', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                          <span>📂</span> Buka
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
                    Belum ada dokumen yang diunggah.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button onClick={() => setDetailModalTender(null)} style={{ padding: '0.6rem 1.5rem', background: '#e2e8f0', color: '#334155', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModalTender && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Undang Vendor</h3>
              <button onClick={() => setInviteModalTender(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <p style={{ marginBottom: '1rem', color: '#475569', fontSize: '0.9rem' }}>
                Cari dan pilih vendor yang akan diundang ke tender <strong style={{ color: '#0f172a' }}>{inviteModalTender.nama_pekerjaan}</strong>:
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Cari nama vendor atau email..."
                  value={vendorSearch}
                  onChange={(e) => {
                    setVendorSearch(e.target.value);
                    setVendorPage(1); // Reset page on search
                  }}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div className="crud-checkbox-group" style={{ maxHeight: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                {paginatedVendors.length > 0 ? (
                  paginatedVendors.map((v) => (
                    <label key={v.value} className="crud-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(v.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVendors(prev => [...prev, v.value]);
                          } else {
                            setSelectedVendors(prev => prev.filter(id => id !== v.value));
                          }
                        }}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ color: '#334155', fontWeight: 500 }}>{v.label}</span>
                    </label>
                  ))
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    Tidak ada vendor yang cocok dengan pencarian "{vendorSearch}".
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalVendorPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
                  <button 
                    onClick={() => setVendorPage(p => Math.max(1, p - 1))}
                    disabled={vendorPage === 1}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: vendorPage === 1 ? '#f1f5f9' : '#fff', color: vendorPage === 1 ? '#94a3b8' : '#334155', cursor: vendorPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Sebelumnya
                  </button>
                  <span style={{ color: '#64748b' }}>Halaman {vendorPage} dari {totalVendorPages}</span>
                  <button 
                    onClick={() => setVendorPage(p => Math.min(totalVendorPages, p + 1))}
                    disabled={vendorPage === totalVendorPages}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: vendorPage === totalVendorPages ? '#f1f5f9' : '#fff', color: vendorPage === totalVendorPages ? '#94a3b8' : '#334155', cursor: vendorPage === totalVendorPages ? 'not-allowed' : 'pointer' }}
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
              
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4338ca', fontWeight: 600 }}>
                Total terpilih: {selectedVendors.length} vendor
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#f8fafc' }}>
              <button onClick={() => setInviteModalTender(null)} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', color: '#475569', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Batal
              </button>
              <button onClick={submitInvite} disabled={modalLoading} style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: '#fff', borderRadius: '6px', border: 'none', cursor: modalLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                {modalLoading ? 'Mengundang...' : 'Kirim Undangan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
