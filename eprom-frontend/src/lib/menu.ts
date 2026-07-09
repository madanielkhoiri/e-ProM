import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  FileCheck,
  FileText,
  Folder,
  Home,
  Landmark,
  Settings,
  ShieldCheck,
  Trophy,
} from 'lucide-react';

export const sidebarMenus = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    label: 'OWNER AREA',
    icon: Landmark,
    children: [
      {
        label: 'Master Data',
        children: [
          {
            label: 'Master Vendor',
            href: '/dashboard/vendors',
          },
          {
            label: 'Master Project',
            href: '/dashboard/projects',
          },
        ],
      },
      {
        label: 'Tender',
        children: [
          {
            label: 'Upload Dokumen Tender',
            href: '#',
          },
          {
            label: 'Undangan Peserta Tender',
            href: '#',
          },
          {
            label: 'Klarifikasi Tender',
            href: '#',
          },
          {
            label: 'Evaluasi Penawaran',
            href: '/dashboard/evaluasi-penawaran',
          },
        ],
      },
      {
        label: 'Penentuan Pemenang',
        children: [
          {
            label: 'Evaluasi Teknis',
            href: '#',
          },
          {
            label: 'Evaluasi Harga',
            href: '#',
          },
          {
            label: 'Negosiasi',
            href: '#',
          },
          {
            label: 'Penetapan Pemenang',
            href: '#',
          },
        ],
      },
      {
        label: 'Kontrak',
        children: [
          {
            label: 'Data Kontrak',
            href: '/dashboard/kontrak',
          },
          {
            label: 'Pembuatan Kontrak',
            href: '/dashboard/kontrak',
          },
          {
            label: 'Persetujuan Kontrak',
            href: '#',
          },
          {
            label: 'Penandatanganan',
            href: '#',
          },
          {
            label: 'NTP / SPMK',
            href: '#',
          },
        ],
      },
    ],
  },
  {
    label: 'PROJECT AREA',
    icon: Building2,
    children: [
      {
        label: 'Engineering',
        children: [
          { label: 'Shop Drawing', href: '#' },
          { label: 'Material Approval', href: '#' },
          { label: 'Method Statement', href: '#' },
          { label: 'Technical Query', href: '#' },
        ],
      },
      {
        label: 'Construction',
        children: [
          { label: 'Checklist Tahapan Pekerjaan', href: '#' },
          { label: 'Inspection Request', href: '#' },
          { label: 'Progress Harian', href: '#' },
          { label: 'Progress Mingguan', href: '#' },
          { label: 'Progress Bulanan', href: '#' },
        ],
      },
      {
        label: 'Quality Control',
        children: [
          { label: 'Checklist QC', href: '#' },
          { label: 'NCR', href: '#' },
          { label: 'Corrective Action', href: '#' },
          { label: 'Punch List', href: '#' },
        ],
      },
      {
        label: 'Document Control',
        children: [
          { label: 'Surat Masuk', href: '#' },
          { label: 'Surat Keluar', href: '#' },
          { label: 'Berita Acara', href: '#' },
          { label: 'Arsip Dokumen', href: '#' },
        ],
      },
      {
        label: 'Financial Monitoring',
        children: [
          { label: 'Progress Payment', href: '#' },
          { label: 'MC Progress', href: '#' },
          { label: 'Variation Order', href: '#' },
          { label: 'Addendum', href: '#' },
        ],
      },
      {
        label: 'Project Closing',
        children: [
          { label: 'As Built Drawing', href: '#' },
          { label: 'Commissioning', href: '#' },
          { label: 'Serah Terima / PHO', href: '#' },
          { label: 'Masa Pemeliharaan', href: '#' },
          { label: 'FHO', href: '#' },
        ],
      },
    ],
  },
  {
    label: 'Report & Analytics',
    icon: BarChart3,
    href: '#',
  },
  {
    label: 'Notifikasi',
    icon: Bell,
    href: '#',
  },
  {
    label: 'Calendar',
    icon: CalendarDays,
    href: '#',
  },
  {
    label: 'Setting',
    icon: Settings,
    href: '#',
  },
];

export const quickMenus = [
  {
    title: 'Tender',
    icon: FileText,
    href: '#',
  },
  {
    title: 'Kontrak',
    icon: FileCheck,
    href: '/dashboard/kontrak',
  },
  {
    title: 'Progress',
    icon: BarChart3,
    href: '#',
  },
  {
    title: 'Dokumen',
    icon: Folder,
    href: '#',
  },
  {
    title: 'Approval',
    icon: ClipboardCheck,
    href: '#',
  },
  {
    title: 'Laporan Harian',
    icon: CalendarDays,
    href: '#',
  },
  {
    title: 'Inspection',
    icon: ShieldCheck,
    href: '#',
  },
  {
    title: 'NCR',
    icon: AlertTriangle,
    href: '#',
  },
];

export const ownerCards = [
  {
    title: 'Tender',
    icon: CheckSquare,
    items: [
      'Upload Dokumen Tender',
      'Undangan Peserta Tender',
      'Klarifikasi Tender',
      'Evaluasi Penawaran',
    ],
  },
  {
    title: 'Penentuan Pemenang',
    icon: Trophy,
    items: ['Evaluasi Teknis', 'Evaluasi Harga', 'Negosiasi', 'Penetapan Pemenang'],
  },
  {
    title: 'Kontrak',
    icon: FileText,
    items: ['Data Kontrak', 'Pembuatan Kontrak', 'Persetujuan Kontrak', 'Penandatanganan'],
  },
];

export const projectCards = [
  {
    title: 'Engineering',
    icon: Home,
    items: ['Shop Drawing', 'Material Approval', 'Method Statement', 'Technical Query'],
  },
  {
    title: 'Construction',
    icon: Landmark,
    items: ['Checklist Tahapan Pekerjaan', 'Inspection Request', 'Progress Harian'],
  },
  {
    title: 'Quality Control',
    icon: ShieldCheck,
    items: ['Checklist QC', 'NCR', 'Corrective Action', 'Punch List'],
  },
  {
    title: 'Document Control',
    icon: Folder,
    items: ['Surat Masuk', 'Surat Keluar', 'Berita Acara', 'Arsip Dokumen'],
  },
  {
    title: 'Financial Monitoring',
    icon: BarChart3,
    items: ['Progress Payment', 'MC Progress', 'Variation Order', 'Addendum'],
  },
  {
    title: 'Project Closing',
    icon: FileCheck,
    items: ['As Built Drawing', 'Commissioning', 'Serah Terima / PHO', 'FHO'],
  },
];
