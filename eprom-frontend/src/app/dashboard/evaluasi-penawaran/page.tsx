import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCrudPage from '../components/DataCrudPage';

export default function EvaluasiPenawaranPage() {
  return (
    <DashboardLayout>
      <DataCrudPage
        title="Evaluasi Penawaran"
        description="Kelola hasil evaluasi penawaran vendor."
        apiUrl="http://localhost:3000/evaluasi-penawaran"
        idKey="evaluasi_id"
        addButtonText="Tambah Evaluasi"
        emptyText="Data evaluasi penawaran belum tersedia"
        defaultForm={{
          project_id: 1,
          vendor_id: 1,
          nama_project: '',
          nama_vendor: '',
          harga_penawaran: 0,
          nilai_teknis: 0,
          nilai_harga: 0,
          status_evaluasi: 'negosiasi',
          catatan: '',
          created_by: 'Owner',
        }}
        fields={[
          { name: 'project_id', label: 'Project ID', type: 'number' },
          { name: 'vendor_id', label: 'Vendor ID', type: 'number' },
          { name: 'nama_project', label: 'Nama Project' },
          { name: 'nama_vendor', label: 'Nama Vendor' },
          { name: 'harga_penawaran', label: 'Harga Penawaran', type: 'number' },
          { name: 'nilai_teknis', label: 'Nilai Teknis', type: 'number' },
          { name: 'nilai_harga', label: 'Nilai Harga', type: 'number' },
          {
            name: 'status_evaluasi',
            label: 'Status Evaluasi',
            type: 'select',
            options: [
              { label: 'Lulus', value: 'lulus' },
              { label: 'Tidak Lulus', value: 'tidak_lulus' },
              { label: 'Negosiasi', value: 'negosiasi' },
            ],
          },
          { name: 'created_by', label: 'Created By' },
          { name: 'catatan', label: 'Catatan', type: 'textarea', full: true },
        ]}
        columns={[
          { key: 'nama_project', label: 'Nama Project' },
          { key: 'nama_vendor', label: 'Nama Vendor' },
          { key: 'harga_penawaran', label: 'Harga Penawaran' },
          { key: 'nilai_teknis', label: 'Nilai Teknis' },
          { key: 'nilai_harga', label: 'Nilai Harga' },
          { key: 'total_nilai', label: 'Total Nilai' },
          { key: 'status_evaluasi', label: 'Status', badge: true },
          { key: 'catatan', label: 'Catatan' },
        ]}
      />
    </DashboardLayout>
  );
}
