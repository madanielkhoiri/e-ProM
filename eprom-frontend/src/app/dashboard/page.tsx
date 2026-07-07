import {
  AlertTriangle,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileArchive,
  FileCheck2,
  FileText,
  Folder,
  Home,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Trophy,
  WalletCards,
  Wrench,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import './dashboard.css';

const quickMenus = [
  { title: 'Tender', mobileTitle: 'Tender', icon: FileText, color: 'blue' },
  { title: 'Kontrak', mobileTitle: 'Kontrak', icon: FileArchive, color: 'green' },
  { title: 'Progress', mobileTitle: 'Progress', icon: BarChart3, color: 'teal' },
  { title: 'Dokumen', mobileTitle: 'Dokumen', icon: Folder, color: 'yellow' },
  { title: 'Approval', mobileTitle: 'Approval', icon: FileCheck2, color: 'orange' },
  { title: 'Laporan Harian', mobileTitle: 'Laporan Harian', icon: CalendarDays, color: 'cyan' },
  { title: 'Inspection', mobileTitle: 'Inspection', icon: ShieldCheck, color: 'purple' },
  { title: 'NCR', mobileTitle: 'NCR', icon: AlertTriangle, color: 'red' },
];

const ownerCards = [
  {
    title: 'Tender',
    icon: ClipboardCheck,
    items: ['Upload Dokumen Tender', 'Undangan Peserta Tender', 'Klarifikasi Tender', 'Evaluasi Penawaran'],
  },
  {
    title: 'Penentuan Pemenang',
    icon: Trophy,
    items: ['Evaluasi Teknis', 'Evaluasi Harga', 'Negosiasi', 'Penetapan Pemenang'],
  },
  {
    title: 'Kontrak',
    icon: FileText,
    items: ['Pembuatan Kontrak', 'Persetujuan Kontrak', 'Penandatanganan', 'NTP / SPMK'],
  },
];

const projectCards = [
  { title: 'Engineering', icon: Home, color: 'blue' },
  { title: 'Construction', icon: Landmark, color: 'orange' },
  { title: 'Quality Control', icon: ShieldCheck, color: 'green' },
  { title: 'Document Control', icon: FileArchive, color: 'purple' },
  { title: 'Financial Monitoring', icon: WalletCards, color: 'teal' },
  { title: 'Project Closing', icon: FileCheck2, color: 'red' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DesktopDashboard />
      <MobileDashboard />
    </DashboardLayout>
  );
}

function DesktopDashboard() {
  return (
    <div className="desktop-dashboard-view">
      <section className="stats-grid">
        <StatCard title="Total Project" value="12" desc="Proyek Aktif" color="blue" icon={<Building2 />} />
        <StatCard title="Tender Aktif" value="5" desc="Dalam Proses" color="green" icon={<ClipboardCheck />} />
        <StatCard title="Approval Pending" value="23" desc="Menunggu Approval" color="orange" icon={<FileCheck2 />} />
        <StatCard title="NCR Open" value="3" desc="Belum Closing" color="red" icon={<AlertTriangle />} />
        <StatCard title="Progress Fisik" value="68%" desc="Rata-Rata" color="purple" icon={<TrendingUp />} />
        <StatCard title="Progress Keuangan" value="62%" desc="Rata-Rata" color="teal" icon={<BarChart3 />} />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card progress-chart-card">
          <div className="section-title-row">
            <h2>Progress Proyek</h2>
            <select>
              <option>Semua Proyek</option>
            </select>
          </div>

          <div className="chart-placeholder">
            <div className="chart-line blue-line"></div>
            <div className="chart-line green-line"></div>
            <div className="chart-line red-line"></div>
            <div className="chart-percent percent-blue">72%</div>
            <div className="chart-percent percent-green">68%</div>
            <div className="chart-percent percent-red">62%</div>
            <div className="chart-months">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card project-progress-card">
          <h2>Progress per Project</h2>
          {['Sport Hall Indoor PPA', 'Mess Karyawan PPA', 'Office Building Site', 'Workshop & Warehouse', 'Drainase & Infrastruktur'].map((item, index) => (
            <div className="project-row" key={item}>
              <div className="project-thumb"></div>
              <div className="project-info">
                <strong>{item}</strong>
                <div className="mini-progress">
                  <span style={{ width: `${80 - index * 7}%` }}></span>
                </div>
              </div>
              <b>{80 - index * 7}%</b>
            </div>
          ))}
        </div>

        <div className="dashboard-card notification-card">
          <h2>Notifikasi Terbaru</h2>
          {[
            'Shop Drawing menunggu approval',
            'Material Approval pending',
            'NCR No.003 belum closed',
            'PHO siap diproses',
            'MC Progress MC-03',
          ].map((item, index) => (
            <div className="notif-row" key={item}>
              <span className={`notif-dot dot-${index}`}></span>
              <div>
                <strong>{item}</strong>
                <p>{index + 1} jam lalu</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="quick-menu-grid">
        {quickMenus.map((item) => {
          const Icon = item.icon;
          return (
            <div className={`quick-menu-card ${item.color}`} key={item.title}>
              <Icon size={34} />
              <span>{item.title}</span>
            </div>
          );
        })}
      </section>

      <section className="bottom-grid">
        <div className="dashboard-card owner-area-card">
          <div className="area-label owner-label">OWNER AREA</div>
          <div className="owner-card-grid">
            {ownerCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className="owner-mini-card" key={card.title}>
                  <Icon size={38} />
                  <h3>{card.title}</h3>
                  {card.items.map((item) => (
                    <p key={item}>› {item}</p>
                  ))}
                  <button>Lihat Semua</button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-card project-area-card">
          <div className="area-label project-label">PROJECT AREA</div>
          <div className="project-card-grid">
            {projectCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className={`project-module-card ${card.color}`} key={card.title}>
                  <Icon size={42} />
                  <span>{card.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-card weekly-table-card">
          <div className="section-title-row">
            <h2>Progress Mingguan</h2>
            <select>
              <option>Sport Hall Indoor</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Pekerjaan</th>
                <th>Planned</th>
                <th>Actual</th>
                <th>Deviasi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {['Pekerjaan Struktur', 'Pekerjaan Arsitektur', 'Pekerjaan MEP', 'Pekerjaan Finishing'].map((row, index) => (
                <tr key={row}>
                  <td>{index + 1}</td>
                  <td>{row}</td>
                  <td>{80 - index * 10}%</td>
                  <td>{78 - index * 8}%</td>
                  <td className={index === 2 ? 'positive' : 'negative'}>{index === 2 ? '+2%' : '-2%'}</td>
                  <td><span className="status-dot"></span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MobileDashboard() {
  return (
    <div className="mobile-dashboard-view">
      <section className="mobile-project-card">
        <div className="mobile-project-title">
          <h2>Sport Hall Indoor PPA</h2>
          <span>Progress Proyek</span>
        </div>

        <div className="mobile-progress-number">68%</div>

        <div className="mobile-main-progress">
          <span></span>
        </div>

        <div className="mobile-stat-row">
          <div>
            <p>Total Project</p>
            <strong>12</strong>
          </div>
          <div>
            <p>Approval Pending</p>
            <strong className="orange">23</strong>
          </div>
          <div>
            <p>NCR Open</p>
            <strong className="red">3</strong>
          </div>
        </div>
      </section>

      <div className="mobile-menu-title">
        <h3>Menu Cepat</h3>
        <button>Edit</button>
      </div>

      <section className="mobile-quick-grid">
        {quickMenus.map((item) => {
          const Icon = item.icon;
          return (
            <div className={`mobile-quick-item ${item.color}`} key={item.title}>
              <Icon size={22} />
              <span>{item.mobileTitle}</span>
            </div>
          );
        })}
      </section>

      <section className="mobile-activity-section">
        <div className="mobile-menu-title">
          <h3>Aktivitas Terbaru</h3>
          <button>Lihat Semua</button>
        </div>

        <div className="mobile-activity-card">
          <div className="activity-icon">
            <FileText size={20} />
          </div>
          <div>
            <strong>Shop Drawing menunggu approval</strong>
            <p>Sport Hall Indoor PPA</p>
          </div>
          <span>10 menit lalu</span>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  desc,
  color,
  icon,
}: {
  title: string;
  value: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`stat-card ${color}`}>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{desc}</span>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}