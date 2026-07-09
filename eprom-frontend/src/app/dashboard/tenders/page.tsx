'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './tenders.module.css';
import { PlusCircle, FileText, Users, Calendar } from 'lucide-react';

interface Tender {
  tender_id: number;
  nama_pekerjaan: string;
  nomor_wo: string;
  estimasi_harga: number;
  status_tender: string;
  tanggal_mulai_tender: string;
  tenderVendors: any[];
  dokumens: any[];
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await api.get('/tenders');
      setTenders(response.data);
    } catch (error) {
      console.error('Failed to fetch tenders', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Daftar Tender</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Kelola pengadaan dan evaluasi vendor dalam satu tempat.
          </p>
        </div>
        <Link href="/tenders/create">
          <button className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} />
            Buat Tender Baru
          </button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Memuat data...
        </div>
      ) : tenders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', marginTop: '2rem' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h3>Belum ada tender</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Mulai buat tender pertamamu sekarang.</p>
          <Link href="/tenders/create">
            <button className={styles.btnPrimary}>Buat Tender</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {tenders.map((tender) => (
            <Link href={`/tenders/${tender.tender_id}`} key={tender.tender_id}>
              <div className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                    {tender.nomor_wo}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    background: tender.status_tender === 'draft' ? '#f1f5f9' : '#dcfce7',
                    color: tender.status_tender === 'draft' ? '#475569' : '#166534',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}>
                    {tender.status_tender}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {tender.nama_pekerjaan}
                </h3>

                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  Rp {tender.estimasi_harga.toLocaleString('id-ID')}
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} />
                    <span>{tender.tenderVendors?.length || 0} Vendor</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} />
                    <span>{tender.dokumens?.length || 0} Dokumen</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
