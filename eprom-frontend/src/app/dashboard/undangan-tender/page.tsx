'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCrudPage from '../components/DataCrudPage';
import { UploadCloud, CheckCircle2, Eye } from 'lucide-react';

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

export default function UndanganTenderPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [detailModalTender, setDetailModalTender] = useState<any>(null);
  const [submitModalTender, setSubmitModalTender] = useState<any>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    harga_penawaran: '',
    catatan: '',
    file: null as File | null
  });

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.vendor_id) {
        setVendorId(Number(user.vendor_id));
      } else {
        // Fallback for testing if not a vendor
        setVendorId(2);
      }
    } else {
      setVendorId(2);
    }
  }, []);

  const openSubmitModal = (tender: any) => {
    const myTenderVendor = tender.tenderVendors?.find((tv: any) => tv.vendor.vendor_id === vendorId);
    const hasSubmitted = myTenderVendor?.status_undangan === 'submit_penawaran';

    if (hasSubmitted) {
      MySwal.fire({
        icon: 'info',
        title: 'Sudah Submit',
        text: 'Anda sudah mengirimkan penawaran untuk tender ini.',
      });
      return;
    }

    setSubmitForm({ harga_penawaran: '', catatan: '', file: null });
    setSubmitModalTender(tender);
  };

  const handleBerikanPenawaran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.harga_penawaran) {
      Toast.fire({ icon: 'warning', title: 'Harga penawaran wajib diisi' });
      return;
    }
    if (!submitForm.file) {
      Toast.fire({ icon: 'warning', title: 'Dokumen penawaran wajib diunggah' });
      return;
    }

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append('harga_penawaran', submitForm.harga_penawaran);
    if (submitForm.catatan) formData.append('catatan', submitForm.catatan);
    formData.append('files', submitForm.file);

    try {
      const response = await fetch(`http://localhost:3000/tenders/${submitModalTender.tender_id}/vendors/${vendorId}/penawaran`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Gagal mengirim penawaran');

      Toast.fire({
        icon: 'success',
        title: 'Penawaran berhasil dikirim.'
      });
      
      setSubmitModalTender(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat mengirim penawaran.',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const openDetailModal = async (row: any) => {
    try {
      const res = await fetch(`http://localhost:3000/tenders/${row.tender_id}`, { cache: 'no-store' });
      const data = await res.json();
      setDetailModalTender(data);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat detail tender');
    }
  };

  const customActions = (row: any) => {
    const myTenderVendor = row.tenderVendors?.find((tv: any) => tv.vendor.vendor_id === vendorId);
    const hasSubmitted = myTenderVendor?.status_undangan === 'submit_penawaran';

    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => openDetailModal(row)}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '4px',
            border: 'none',
            background: '#0ea5e9',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          Detail
        </button>

        <button
          type="button"
          onClick={() => openSubmitModal(row)}
          disabled={hasSubmitted}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '4px',
            border: 'none',
            background: hasSubmitted ? '#f1f5f9' : '#4f46e5',
            color: hasSubmitted ? '#94a3b8' : 'white',
            cursor: hasSubmitted ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {hasSubmitted ? 'Disubmit' : 'Beri Penawaran'}
        </button>
      </div>
    );
  };

  if (vendorId === null) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Memuat data pengguna...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DataCrudPage
        title="Undangan Tender (Vendor)"
        description={`Daftar tender yang mengundang Anda (Vendor ID: ${vendorId})`}
        apiUrl={`http://localhost:3000/tenders/vendor/${vendorId}`}
        idKey="tender_id"
        fields={[]}
        columns={[
          { key: 'nomor_wo', label: 'Nomor WO' },
          { key: 'nama_pekerjaan', label: 'Nama Pekerjaan' },
          { key: 'status_tender', label: 'Status Utama', badge: true },
        ]}
        defaultForm={{}}
        addButtonText=""
        emptyText="Belum ada undangan tender untuk Anda."
        customActions={customActions}
        disableCreate={true}
        disableEdit={true}
        disableDelete={true}
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
                  <div><div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimasi Harga</div><div style={{ fontWeight: 600, color: '#16a34a' }}>Rp {detailModalTender.estimasi_harga?.toLocaleString() || '0'}</div></div>
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

      {/* Submit Modal */}
      {submitModalTender && (
        <div className="crud-modal-backdrop" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="crud-modal-content" style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '550px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div className="crud-modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Kirim Penawaran Harga</h2>
              <button onClick={() => setSubmitModalTender(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}>&times;</button>
            </div>
            
            <form onSubmit={handleBerikanPenawaran}>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Tender Tujuan</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{submitModalTender.nama_pekerjaan}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>WO: {submitModalTender.nomor_wo}</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                    Harga Penawaran (Rp) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    type="number" 
                    value={submitForm.harga_penawaran}
                    onChange={(e) => setSubmitForm({...submitForm, harga_penawaran: e.target.value})}
                    placeholder="Contoh: 150000000"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                    Dokumen Penawaran (PDF/Excel/Word) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', background: '#f8fafc', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => document.getElementById('actualFileInput')?.click()}>
                    <UploadCloud size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                      {submitForm.file ? submitForm.file.name : 'Klik untuk memilih file dokumen'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      {submitForm.file ? `${Math.round(submitForm.file.size / 1024)} KB` : 'Ukuran maksimal: 10MB'}
                    </div>
                    <input 
                      type="file"
                      id="actualFileInput"
                      onChange={(e) => setSubmitForm({...submitForm, file: e.target.files ? e.target.files[0] : null})}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                    Catatan Tambahan <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Opsional)</span>
                  </label>
                  <textarea 
                    value={submitForm.catatan}
                    onChange={(e) => setSubmitForm({...submitForm, catatan: e.target.value})}
                    placeholder="Tuliskan pesan atau catatan untuk panitia (opsional)..."
                    rows={3}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#f8fafc', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setSubmitModalTender(null)} 
                  disabled={submitLoading}
                  style={{ padding: '0.6rem 1.25rem', background: 'transparent', color: '#64748b', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: submitLoading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={submitLoading}
                  style={{ padding: '0.6rem 1.5rem', background: '#4f46e5', color: '#fff', borderRadius: '8px', border: 'none', cursor: submitLoading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {submitLoading ? (
                    <>
                      <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      Kirim Penawaran
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
