import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCrudPage from '../components/DataCrudPage';

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <DataCrudPage
        title="Master Data Project"
        description="Kelola data project yang digunakan dalam proses tender."
        apiUrl="http://localhost:3000/projects"
        idKey="project_id"
        addButtonText="Tambah Project"
        emptyText="Data project belum tersedia"
        defaultForm={{
          nama_project: '',
          deskripsi: '',
          pic: '',
          status: 'aktif',
          created_by: 'Owner',
        }}
        fields={[
          { name: 'nama_project', label: 'Nama Project', required: true },
          { name: 'pic', label: 'PIC / Penanggung Jawab' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { label: 'Aktif', value: 'aktif' },
              { label: 'Selesai', value: 'selesai' },
              { label: 'Batal', value: 'batal' },
            ],
          },
          { name: 'created_by', label: 'Created By' },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', full: true },
        ]}
        columns={[
          { key: 'nama_project', label: 'Nama Project' },
          { key: 'pic', label: 'PIC' },
          { key: 'status', label: 'Status', badge: true },
          { key: 'created_by', label: 'Created By' },
          { key: 'deskripsi', label: 'Deskripsi' },
        ]}
      />
    </DashboardLayout>
  );
}
