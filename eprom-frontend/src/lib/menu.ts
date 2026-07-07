import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle,
  ClipboardCheck,
  FileArchive,
  FileText,
  FolderKanban,
  Home,
  Landmark,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Trophy,
  WalletCards,
  Wrench,
} from 'lucide-react';

export const sidebarMenus = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'OWNER AREA',
    icon: Landmark,
    children: [
      {
        title: 'Tender',
        children: [
          { title: 'Upload Dokumen Tender', href: '/module/owner-area/tender/upload-dokumen-tender' },
          { title: 'Undangan Peserta Tender', href: '/module/owner-area/tender/undangan-peserta-tender' },
          { title: 'Klarifikasi Tender', href: '/module/owner-area/tender/klarifikasi-tender' },
          { title: 'Evaluasi Penawaran', href: '/module/owner-area/tender/evaluasi-penawaran' },
        ],
      },
      {
        title: 'Penentuan Pemenang',
        children: [
          { title: 'Evaluasi Teknis', href: '/module/owner-area/pemenang/evaluasi-teknis' },
          { title: 'Evaluasi Harga', href: '/module/owner-area/pemenang/evaluasi-harga' },
          { title: 'Negosiasi', href: '/module/owner-area/pemenang/negosiasi' },
          { title: 'Penetapan Pemenang', href: '/module/owner-area/pemenang/penetapan-pemenang' },
        ],
      },
      {
        title: 'Kontrak',
        children: [
          { title: 'Pembuatan Kontrak', href: '/module/owner-area/kontrak/pembuatan-kontrak' },
          { title: 'Persetujuan Kontrak', href: '/module/owner-area/kontrak/persetujuan-kontrak' },
          { title: 'Penandatanganan', href: '/module/owner-area/kontrak/penandatanganan' },
          { title: 'NTP / SPMK', href: '/module/owner-area/kontrak/ntp-spmk' },
        ],
      },
    ],
  },
  {
    title: 'PROJECT AREA',
    icon: FolderKanban,
    children: [
      {
        title: 'Engineering',
        children: [
          { title: 'Shop Drawing', href: '/module/project-area/engineering/shop-drawing' },
          { title: 'Material Approval', href: '/module/project-area/engineering/material-approval' },
          { title: 'Method Statement', href: '/module/project-area/engineering/method-statement' },
          { title: 'Technical Query', href: '/module/project-area/engineering/technical-query' },
        ],
      },
      {
        title: 'Construction',
        children: [
          { title: 'Checklist Tahapan Pekerjaan', href: '/module/project-area/construction/checklist-tahapan-pekerjaan' },
          { title: 'Inspection Request', href: '/module/project-area/construction/inspection-request' },
          { title: 'Progress Harian', href: '/module/project-area/construction/progress-harian' },
          { title: 'Progress Mingguan', href: '/module/project-area/construction/progress-mingguan' },
          { title: 'Progress Bulanan', href: '/module/project-area/construction/progress-bulanan' },
        ],
      },
      {
        title: 'Quality Control',
        children: [
          { title: 'Checklist QC', href: '/module/project-area/quality-control/checklist-qc' },
          { title: 'NCR', href: '/module/project-area/quality-control/ncr' },
          { title: 'Corrective Action', href: '/module/project-area/quality-control/corrective-action' },
          { title: 'Punch List', href: '/module/project-area/quality-control/punch-list' },
        ],
      },
      {
        title: 'Document Control',
        children: [
          { title: 'Surat Masuk', href: '/module/project-area/document-control/surat-masuk' },
          { title: 'Surat Keluar', href: '/module/project-area/document-control/surat-keluar' },
          { title: 'Berita Acara', href: '/module/project-area/document-control/berita-acara' },
          { title: 'Arsip Dokumen', href: '/module/project-area/document-control/arsip-dokumen' },
        ],
      },
      {
        title: 'Financial Monitoring',
        children: [
          { title: 'Progress Payment', href: '/module/project-area/financial-monitoring/progress-payment' },
          { title: 'MC Progress', href: '/module/project-area/financial-monitoring/mc-progress' },
          { title: 'Variation Order', href: '/module/project-area/financial-monitoring/variation-order' },
          { title: 'Addendum', href: '/module/project-area/financial-monitoring/addendum' },
        ],
      },
      {
        title: 'Project Closing',
        children: [
          { title: 'As Built Drawing', href: '/module/project-area/project-closing/as-built-drawing' },
          { title: 'Commissioning', href: '/module/project-area/project-closing/commissioning' },
          { title: 'Serah Terima / PHO', href: '/module/project-area/project-closing/pho' },
          { title: 'Masa Pemeliharaan', href: '/module/project-area/project-closing/masa-pemeliharaan' },
          { title: 'FHO', href: '/module/project-area/project-closing/fho' },
        ],
      },
    ],
  },
  {
    title: 'Report & Analytics',
    href: '/module/report-analytics',
    icon: BarChart3,
  },
  {
    title: 'Notifikasi',
    href: '/module/notifikasi',
    icon: Bell,
  },
  {
    title: 'Calendar',
    href: '/module/calendar',
    icon: CalendarDays,
  },
  {
    title: 'Setting',
    href: '/module/setting',
    icon: Settings,
  },
];

export const quickMenus = [
  { title: 'Shop Drawing', icon: FileText, color: 'blue' },
  { title: 'Material Approval', icon: FileArchive, color: 'green' },
  { title: 'Checklist Pekerjaan', icon: ClipboardCheck, color: 'orange' },
  { title: 'Inspection Request', icon: ShieldCheck, color: 'purple' },
  { title: 'Progress Harian', icon: CalendarDays, color: 'cyan' },
  { title: 'Progress Mingguan', icon: BarChart3, color: 'teal' },
  { title: 'NCR', icon: Wrench, color: 'red' },
  { title: 'Dokumen', icon: FolderKanban, color: 'yellow' },
];

export const ownerCards = [
  { title: 'Tender', icon: ClipboardCheck, items: ['Upload Dokumen Tender', 'Undangan Peserta Tender', 'Klarifikasi Tender', 'Evaluasi Penawaran'] },
  { title: 'Penentuan Pemenang', icon: Trophy, items: ['Evaluasi Teknis', 'Evaluasi Harga', 'Negosiasi', 'Penetapan Pemenang'] },
  { title: 'Kontrak', icon: FileText, items: ['Pembuatan Kontrak', 'Persetujuan Kontrak', 'Penandatanganan', 'NTP / SPMK'] },
];

export const projectCards = [
  { title: 'Engineering', icon: Home, color: 'blue' },
  { title: 'Construction', icon: Landmark, color: 'orange' },
  { title: 'Quality Control', icon: ShieldCheck, color: 'green' },
  { title: 'Document Control', icon: FileArchive, color: 'purple' },
  { title: 'Financial Monitoring', icon: WalletCards, color: 'teal' },
  { title: 'Project Closing', icon: CheckCircle, color: 'red' },
];