import DashboardLayout from '@/components/layout/DashboardLayout';
import DataCrudPage from '../components/DataCrudPage';

export default function VendorsPage() {
  return (
    <DashboardLayout>
      <DataCrudPage
        title="Master Data Vendor"
        description="Kelola data vendor untuk kebutuhan tender dan kontrak."
        apiUrl="http://localhost:3000/vendors"
        idKey="vendor_id"
        addButtonText="Tambah Vendor"
        emptyText="Data vendor belum tersedia"
        defaultForm={{
          nomor_vendor: '',
          nama_vendor: '',
          alamat: '',
          no_telepon: '',
          email: '',
          status_aktif: true,
        }}
        fields={[
          { name: 'nomor_vendor', label: 'Nomor Vendor', required: true },
          { name: 'nama_vendor', label: 'Nama Vendor', required: true },
          { name: 'no_telepon', label: 'No Telepon' },
          { name: 'email', label: 'Email', type: 'email' },
          {
            name: 'status_aktif',
            label: 'Status Aktif',
            type: 'select',
            options: [
              { label: 'Aktif', value: true },
              { label: 'Tidak Aktif', value: false },
            ],
          },
          { name: 'alamat', label: 'Alamat', type: 'textarea', full: true },
        ]}
        columns={[
          { key: 'nomor_vendor', label: 'Nomor Vendor' },
          { key: 'nama_vendor', label: 'Nama Vendor' },
          { key: 'no_telepon', label: 'No Telepon' },
          { key: 'email', label: 'Email' },
          { key: 'status_aktif', label: 'Status', badge: true },
          { key: 'alamat', label: 'Alamat' },
        ]}
      />
    </DashboardLayout>
  );
}
