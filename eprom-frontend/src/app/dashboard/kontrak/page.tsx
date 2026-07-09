import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCrudPage from '../components/DataCrudPage';

export default function KontrakPage() {
  return (
    <DashboardLayout>
      <DataCrudPage
        title="Kontrak"
        description="Kelola data kontrak sesuai tabel t_kontrak."
        apiUrl="http://localhost:3000/kontrak"
        idKey="kontrak_id"
        addButtonText="Tambah Kontrak"
        emptyText="Data kontrak belum tersedia"
        defaultForm={{
          nomor_kontrak: '',
          nilai_kontrak: 0,
          tanggal_kontrak: '',
          tanggal_mulai: '',
          tanggal_selesai: '',
          status_kontrak: 'draft',
          file_kontrak: null,
          created_by: 'Owner',
        }}
        fields={[
          { name: 'nomor_kontrak', label: 'Nomor Kontrak', required: true },
          { name: 'nilai_kontrak', label: 'Nilai Kontrak', type: 'number' },
          { name: 'tanggal_kontrak', label: 'Tanggal Kontrak', type: 'date' },
          { name: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'date' },
          { name: 'tanggal_selesai', label: 'Tanggal Selesai', type: 'date' },
          {
            name: 'status_kontrak',
            label: 'Status Kontrak',
            type: 'select',
            options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Aktif', value: 'aktif' },
              { label: 'Selesai', value: 'selesai' },
              { label: 'Terminasi', value: 'terminasi' },
            ],
          },
          { name: 'file_kontrak', label: 'Upload File Kontrak', type: 'file', full: true },
        ]}
        columns={[
          { key: 'nomor_kontrak', label: 'Nomor Kontrak' },
          { key: 'nilai_kontrak', label: 'Nilai Kontrak' },
          { key: 'tanggal_kontrak', label: 'Tanggal Kontrak' },
          { key: 'tanggal_mulai', label: 'Tanggal Mulai' },
          { key: 'tanggal_selesai', label: 'Tanggal Selesai' },
          { key: 'status_kontrak', label: 'Status', badge: true },
          { key: 'file_kontrak', label: 'File Kontrak', file: true },
          { key: 'created_by', label: 'Created By' },
        ]}
      />
    </DashboardLayout>
  );
}

