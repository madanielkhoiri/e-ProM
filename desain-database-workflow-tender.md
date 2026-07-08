# Desain Database & Workflow Sistem Tender/Pengadaan

## 1. Ringkasan Alur Besar

```
PROJECT ──► TENDER ──► UNDANG VENDOR ──► PENAWARAN VENDOR ──► EVALUASI PENAWARAN ──► KONTRAK
```

4 menu utama:
1. **Menu Project** — bikin project, di dalamnya bikin tender + undang vendor + upload dokumen pekerjaan
2. **Menu Tender** (tabel inti) — undang, view dokumen, hapus
3. **Menu Evaluasi Penawaran** — ambil data dari tabel tender yang sudah ada penawaran masuk
4. **Menu Kontrak** — ambil tender yang diikuti **lebih dari 1 vendor** (proses kompetitif) dan sudah selesai evaluasi

---

## 2. Desain Database (ERD Ringkas)

```
m_project (1) ──< (N) t_tender (1) ──< (N) t_tender_vendor (N) >── (1) m_vendor
                        │                        │
                        │                        └──< (1) t_evaluasi_penawaran
                        │
                        ├──< (N) t_tender_dokumen
                        │
                        └──< (N) t_kontrak >── (1) m_vendor (vendor pemenang)
```

### 2.1 `m_project`
| Field | Tipe | Ket |
|---|---|---|
| project_id | PK | |
| nama_project | varchar | |
| deskripsi | text | |
| pic | varchar | penanggung jawab |
| status | enum | aktif / selesai / batal |
| created_by, created_at, updated_at | | |

### 2.2 `t_tender` (tabel inti sesuai poin 1)
| Field | Tipe | Ket |
|---|---|---|
| tender_id | PK | |
| project_id | FK → m_project | |
| nama_pekerjaan | varchar | |
| nomor_wo | varchar, unique | |
| estimasi_harga | decimal | |
| deskripsi_pekerjaan | text | |
| tanggal_mulai_tender | date | |
| tanggal_batas_penawaran | date | |
| status_tender | enum | draft, diundang, penawaran_masuk, evaluasi, kontrak, selesai, batal |
| is_deleted | boolean | untuk fitur "hapus" → **soft delete**, jangan hard delete karena ada relasi vendor/dokumen |
| created_by, created_at, updated_at | | |

> Catatan: `nomor_vendor` di request awal sebaiknya **tidak** jadi kolom langsung di `t_tender`, karena satu tender bisa punya banyak vendor (many-to-many). Relasinya dipindah ke tabel junction `t_tender_vendor` di bawah.

### 2.3 `m_vendor` (master data vendor — jawaban poin 2)
| Field | Tipe | Ket |
|---|---|---|
| vendor_id | PK | |
| nomor_vendor | varchar, **unique** | kode vendor |
| nama_vendor | varchar | |
| npwp | varchar | |
| alamat | text | |
| nama_pic, no_telepon, email | varchar | |
| status_aktif | boolean | |
| created_at, updated_at | | |

**Cara master ini terisi:** saat user "undang vendor" di menu tender, sistem cek `nomor_vendor` — kalau sudah ada di `m_vendor`, tinggal dipakai (dropdown pilih vendor lama); kalau belum ada, form input vendor baru otomatis insert ke `m_vendor` sekaligus. Jadi `m_vendor` terbangun **dari histori tabel tender**, tapi disimpan terpisah supaya bisa dipakai ulang lintas tender/project (tidak perlu input vendor yang sama berkali-kali).

### 2.4 `t_tender_vendor` (junction — ini yang menjawab fitur "undang")
| Field | Tipe | Ket |
|---|---|---|
| tender_vendor_id | PK | |
| tender_id | FK → t_tender | |
| vendor_id | FK → m_vendor | |
| status_undangan | enum | diundang, dilihat, submit_penawaran, menolak, expired |
| tanggal_undang | datetime | |
| tanggal_submit_penawaran | datetime | |
| harga_penawaran | decimal | |
| catatan | text | |

### 2.5 `t_tender_dokumen` (fitur "upload file" & "view dokumen")
| Field | Tipe | Ket |
|---|---|---|
| dokumen_id | PK | |
| tender_id | FK → t_tender | |
| tender_vendor_id | FK, **nullable** | null = dokumen pekerjaan dari panitia; terisi = dokumen penawaran dari vendor tsb |
| jenis_dokumen | enum | dokumen_pekerjaan, dokumen_penawaran, dokumen_evaluasi, dokumen_kontrak |
| nama_file | varchar | |
| path_file | varchar | lokasi/URL storage |
| tipe_file | varchar | pdf, xlsx, csv, dll — mendukung multiple upload, jadi 1 baris = 1 file |
| ukuran_file | int | |
| uploaded_by, uploaded_at | | |

### 2.6 `t_evaluasi_penawaran`
| Field | Tipe | Ket |
|---|---|---|
| evaluasi_id | PK | |
| tender_vendor_id | FK → t_tender_vendor | |
| nilai_administrasi | decimal | |
| nilai_teknis | decimal | |
| nilai_harga | decimal | |
| nilai_total | decimal | |
| ranking | int | |
| status_evaluasi | enum | lolos, tidak_lolos, pending |
| catatan_evaluasi | text | |
| evaluated_by, evaluated_at | | |

### 2.7 `t_kontrak`
| Field | Tipe | Ket |
|---|---|---|
| kontrak_id | PK | |
| tender_id | FK → t_tender | |
| vendor_id | FK → m_vendor | vendor pemenang |
| nomor_kontrak | varchar, unique | |
| nilai_kontrak | decimal | |
| tanggal_kontrak, tanggal_mulai, tanggal_selesai | date | |
| status_kontrak | enum | draft, aktif, selesai, terminasi |
| file_kontrak | varchar | |
| created_by, created_at | | |

---

## 3. Workflow Lengkap

### A. Menu Project
1. User buat **Project** baru (nama, deskripsi, PIC).
2. Di dalam project, user buat **Tender** baru: isi nama pekerjaan, nomor WO, estimasi harga.
3. Upload **dokumen pekerjaan** (KAK/spesifikasi/RAB) — multiple file, tersimpan di `t_tender_dokumen` dengan `jenis_dokumen = dokumen_pekerjaan`.
4. **Undang vendor**: pilih dari master `m_vendor` atau tambah vendor baru (auto tersimpan ke master). Setiap vendor yang diundang → 1 baris baru di `t_tender_vendor` (status `diundang`).
5. Sistem kirim notifikasi/email ke vendor.
6. Vendor upload **dokumen penawaran** (harga + dokumen teknis) → status di `t_tender_vendor` berubah jadi `submit_penawaran`, `status_tender` di `t_tender` berubah jadi `penawaran_masuk`.

### B. Menu Evaluasi Penawaran
7. List tender yang statusnya `penawaran_masuk` (diambil dari `t_tender` join `t_tender_vendor`).
8. Evaluator buka satu tender → lihat semua vendor yang sudah submit + dokumennya (view dokumen dari `t_tender_dokumen`).
9. Input nilai per vendor (administrasi/teknis/harga) → tersimpan di `t_evaluasi_penawaran`.
10. Sistem hitung `nilai_total` dan `ranking` otomatis, tandai calon pemenang.
11. Update `status_tender` → `evaluasi`.

### C. Menu Kontrak
12. List tender yang: (a) `status_tender = evaluasi` (sudah dinilai) **dan** (b) jumlah baris di `t_tender_vendor` untuk tender tsb **> 1** (proses kompetitif, bukan penunjukan langsung).
13. User pilih tender → sistem tampilkan hasil ranking evaluasi → user tetapkan vendor pemenang.
14. Input nomor kontrak, nilai kontrak, tanggal, upload dokumen kontrak → tersimpan di `t_kontrak`.
15. `status_tender` berubah jadi `kontrak`, lalu `selesai` setelah kontrak aktif berjalan.

### Fitur di tabel Tender (poin 1)
- **Undang** → insert baris ke `t_tender_vendor`.
- **View dokumen** → query `t_tender_dokumen` by `tender_id` (dan `tender_vendor_id` jika mau lihat dokumen milik vendor tertentu).
- **Hapus** → soft delete (`is_deleted = true`) di `t_tender`, bukan hard delete, supaya histori vendor/dokumen/evaluasi tidak ikut hilang.

---

## 4. Hal yang Perlu Dikonfirmasi
- Bagaimana proses untuk tender dengan **1 vendor saja** (penunjukan langsung)? Apakah tetap lewat menu Kontrak tapi tanpa tahap evaluasi kompetitif, atau alur terpisah?
- Apakah perlu tabel **log aktivitas/audit trail** (siapa undang siapa, kapan upload, dsb) untuk keperluan tracking/compliance?
- Apakah vendor punya akses login sendiri (portal vendor) untuk upload penawaran, atau upload dilakukan oleh panitia atas nama vendor?
