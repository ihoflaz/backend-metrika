# Metrika Frontend Analiz Raporu - Backend Geliştirme İçin

> **Hazırlanma Amacı**: Bu doküman, Metrika frontend projesinin detaylı analizini içermekte olup, backend geliştiricilerin hiçbir eksik kalmadan tüm API'leri, veri modellerini ve iş kurallarını oluşturabilmesi için hazırlanmıştır.

---

## 📋 İçindekiler

1. [Proje Genel Bakış](#1-proje-genel-bakış)
2. [Sayfa Bazlı Analiz](#2-sayfa-bazlı-analiz)
3. [Veri Modelleri (Frontend Perspektifi)](#3-veri-modelleri-frontend-perspektifi)
4. [API Gereksinimleri](#4-api-gereksinimleri)
5. [Gamification Sistemi](#5-gamification-sistemi)
6. [AI Entegrasyonu](#6-ai-entegrasyonu)
7. [Gerçek Zamanlı Özellikler](#7-gerçek-zamanlı-özellikler)
8. [Mevcut Spesifikasyonda Tespit Edilen Eksikler](#8-mevcut-spesifikasyonda-tespit-edilen-eksikler)
9. [Özet ve Öneriler](#9-özet-ve-öneriler)

---

## 1. Proje Genel Bakış

### 1.1 Teknoloji Stack

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| React | 19.2.0 | UI Framework |
| TypeScript | ~5.9.3 | Type Safety |
| Vite | 7.2.4 | Build Tool |
| React Router DOM | 7.10.1 | Routing |
| Zustand | 5.0.9 | State Management |
| Recharts | 3.5.1 | Grafikler |
| Lucide React | 0.561.0 | İkonlar |
| TailwindCSS | 4.1.18 | Styling |
| @dnd-kit | * | Drag & Drop Library |

### 1.2 Sayfa ve Route Yapısı

```
/                        → Dashboard (Ana Sayfa)
/projects                → Proje Listesi
/projects/new            → Yeni Proje Oluşturma Wizard
/projects/:id            → Proje Detay
/tasks                   → Görev Listesi
/tasks/:id               → Görev Detay
/documents               → Doküman Listesi (Yeni)
/documents/analysis      → AI Doküman Analizi
/gamification            → Oyunlaştırma Profili
/leaderboard             → Liderlik Tablosu
/notifications           → Bildirimler
/settings                → Ayarlar
/calendar                → Takvim
/team                    → Ekip Listesi
/team/:id                → Ekip Üyesi Profili
/kpi                     → KPI Dashboard
/help                    → Yardım Merkezi
/login                   → Giriş Sayfası (Yeni - API Entegrasyonu)
```

### 1.3 Uygulama Yapısı

```
src/
├── App.tsx              → Ana uygulama ve routing (Protected Routes)
├── main.tsx             → Entry point
├── types.ts             → Temel tip tanımları
├── components/
│   ├── Header.tsx           → Üst navigasyon (arama, bildirimler, profil)
│   ├── Sidebar.tsx          → Yan menü (navigasyon, çıkış)
│   ├── KanbanBoard.tsx      → DnD Kanban bileşeni (@dnd-kit)
│   ├── ProjectEditModal.tsx → Proje düzenleme modal
│   ├── CreateTaskModal.tsx  → Görev oluşturma modal
│   ├── AddEventModal.tsx    → Takvim etkinlik ekleme modal
│   ├── AddMemberModal.tsx   → Ekip üyesi ekleme modal
│   ├── DocumentUploadModal.tsx   → Doküman yükleme modal (AI analiz)
│   ├── ShareAnalysisModal.tsx    → Analiz paylaşım modal
│   ├── CreateTaskFromDocModal.tsx → Doküman aksiyonundan görev oluşturma
│   ├── AddTaskToProjectModal.tsx  → Görevi projelere bağlama modal
│   ├── AddDocumentToTaskModal.tsx → Dokümanı göreve bağlama modal
│   ├── LinkedProjectsCard.tsx     → Göreve bağlı projeler kartı
│   ├── LinkedTasksCard.tsx        → Dokümana bağlı görevler kartı
│   ├── LinkedDocumentsModal.tsx   → Göreve bağlı dokümanlar modal
│   ├── ToastContainer.tsx         → Bildirim toast sistemi
│   ├── ActionCard.tsx             → Aksiyon kartı bileşeni
│   ├── CustomDropdown.tsx         → Özel dropdown bileşeni
│   ├── EmptyState.tsx             → Boş durum bileşeni
│   └── UndoToast.tsx              → Geri al bildirimi
├── services/                       → API Servisleri (Yeni - Backend Entegrasyonu)
│   ├── api.ts               → Merkezi API istemcisi (JWT, _id mapping)
│   └── documentApi.ts       → Doküman API servisi
├── store/
│   ├── index.ts             → Store export hub
│   ├── authStore.ts         → Kimlik doğrulama state (Yeni - API)
│   ├── userStore.ts         → Kullanıcı state yönetimi (API entegre)
│   ├── projectStore.ts      → Proje state yönetimi (API entegre)
│   ├── taskStore.ts         → Görev state yönetimi (API entegre)
│   ├── notificationStore.ts → Bildirim state yönetimi (API entegre)
│   ├── documentStore.ts     → Doküman ve AI analiz state yönetimi
│   └── uiStore.ts           → UI state (sidebar toggle vb.)
├── utils/
│   └── colorUtils.ts        → Renk yardımcı fonksiyonları
└── pages/
    ├── LoginPage.tsx        → Giriş sayfası (Yeni - API Entegrasyonu)
    ├── Dashboard.tsx
    ├── ProjectsPage.tsx
    ├── CreateProjectWizard.tsx
    ├── MethodologySelection.tsx → Metodoloji seçim sayfası
    ├── ProjectDetail.tsx
    ├── TasksPage.tsx
    ├── TaskDetail.tsx
    ├── DocumentAnalysis.tsx
    ├── GamificationProfile.tsx
    ├── Leaderboard.tsx
    ├── Notifications.tsx
    ├── Settings.tsx
    ├── CalendarPage.tsx
    ├── TeamPage.tsx
    ├── TeamMemberProfile.tsx
    ├── KPIPage.tsx
    ├── DocumentsPage.tsx    → Doküman listesi sayfası
    └── HelpPage.tsx
```

---

## 2. Sayfa Bazlı Analiz

### 2.0 Giriş Sayfası (LoginPage) - YENİ

**Dosya**: `src/pages/LoginPage.tsx`

> **Backend Entegrasyonu**: Bu sayfa gerçek backend API'si ile çalışır.

#### Özellikler:
- Email ve şifre ile giriş formu
- Form validasyonu (required fields)
- Loading state (spinner)
- Hata mesajları gösterimi
- "Beni Hatırla" checkbox
- Test credentials bilgisi (development mod)

#### Veri Akışı:
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  token: string;  // JWT Token
}
```

#### Gerekli API:
```
POST /auth/login { email, password }
POST /auth/register { name, email, password }
GET  /users/me (token validation)
```

---

### 2.1 Dashboard (Ana Sayfa)

**Dosya**: `src/pages/Dashboard.tsx`

#### Gösterilen Veriler:
- Hoş geldin mesajı (kullanıcı adı ile)
- **İstatistik Kartları**:
  - Toplam Proje sayısı (trend: +2%)
  - Aktif Görev sayısı (trend: +5%)
  - Bu ay tamamlanan görevler

- **Aktif Projeler Grid** (4 adet):
  - Proje başlığı, açıklama, ilerleme yüzdesi
  - Renk göstergesi (blue, purple, green, yellow)

- **AI Önerileri Paneli**:
  - Sprint hızı uyarıları
  - Doküman analizi bildirimleri
  - Zaman damgası (örn: "2 saat önce")

- **KPI Özet Grafiği** (Pie Chart):
  - Tamamlanan yüzde
  - Bütçe kullanımı

- **Yaklaşan Görevler** (3 adet):
  - Görev başlığı, son tarih, öncelik

- **Risk Uyarı Kartı**:
  - Kritik risk bildirimleri

#### Gerekli API Endpoint'leri:
```
GET /dashboard/stats
GET /dashboard/active-projects (limit: 4)
GET /dashboard/ai-suggestions
GET /dashboard/kpi-summary
GET /dashboard/upcoming-tasks (limit: 3)
GET /dashboard/risk-alerts
```

---

### 2.2 Projeler Sayfası

**Dosya**: `src/pages/ProjectsPage.tsx`

#### Veri Modeli (Frontend'de tanımlı):
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'At Risk';
  progress: number;
  methodology: 'Waterfall' | 'Scrum' | 'Hybrid';
  startDate: string;
  dueDate: string;
  teamSize: number;
  tasksCompleted: number;
  totalTasks: number;
  budget: number;
  budgetUsed: number;
  color: string;
  manager: {
    name: string;
    avatar: number; // picsum id
  };
}
```

#### İstatistik Kartları:
- Toplam proje sayısı
- Aktif proje sayısı
- Tamamlanan proje sayısı
- Riskli proje sayısı

#### Filtreleme:
- **Arama**: Başlık ve açıklamada
- **Status Filter**: All, Active, Completed, On Hold, At Risk
- **Methodology Filter**: All, Scrum, Waterfall, Hybrid

#### Görüntüleme Modları:
- Grid View (Card)
- List View (Table)

#### Gerekli API:
```
GET /projects?search=&status=&methodology=&page=&limit=&sortBy=&sortOrder=
GET /projects/stats (istatistik kartları için)
```

---

### 2.3 Proje Oluşturma Wizard

**Dosya**: `src/pages/CreateProjectWizard.tsx`

#### 5 Adımlı Wizard:

**Adım 1 - Metodoloji Seçimi**:
- Waterfall, Scrum, Hybrid seçenekleri
- Her metodoloji için açıklama ve uygun proje türleri

**Adım 2 - Proje Bilgileri**:
```typescript
{
  name: string;           // Zorunlu
  description: string;    // Opsiyonel
  startDate: string;      // Zorunlu (date)
  endDate: string;        // Zorunlu (date)
  budget: string;         // Opsiyonel (number olarak gönderilmeli)
}
```

**Adım 3 - Ekip Seçimi**:
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: number;
}
```
- Mevcut kullanıcılar listesinden seçim
- Arama özelliği (isim veya rol)
- Minimum 1 üye zorunlu

**Adım 4 - KPI Tanımlama** (Opsiyonel):
```typescript
interface KPI {
  id: string;
  name: string;
  target: string;
  unit: string;
}
```
- Hazır şablonlar: Sprint Hızı, Bütçe Kullanımı, Zamanında Teslimat, Bug Sayısı, Müşteri Memnuniyeti, Code Coverage

**Adım 5 - Özet ve Onay**:
- Tüm bilgilerin görüntülenmesi
- Düzenleme için geri dönebilme

#### Gerekli API:
```
GET /users?role=member                     # Ekip üyesi listesi
POST /projects                             # Proje oluşturma
{
  methodology: string,
  title: string,
  description?: string,
  startDate: string,
  endDate: string,
  budget?: number,
  teamMemberIds: string[],
  kpis?: { name: string, target: number, unit: string }[]
}
```

---

### 2.4 Proje Detay

**Dosya**: `src/pages/ProjectDetail.tsx`

#### 5 Tab Yapısı:

**Tab 1 - Overview (Genel Bakış)**:
- Zaman çizelgesi (Gantt benzeri)
  - Faz bazlı görünüm (Faz 1, 2, 3...)
  - Sprint bazlı görünüm
  - Durum göstergeleri (Tamamlandı, Devam Ediyor, Planlandı)
- Son 3 doküman
- Sprint detayları:
  - Sprint adı, başlangıç/bitiş tarihi
  - İlerleme yüzdesi
  - Görev sayısı (Toplam, Biten, Bekleyen)
  - Sprint görevleri listesi
- Proje ekibi özeti (ilk 4 kişi + fazla sayı)

**Tab 2 - Tasks (Görevler - Kanban)**:
```typescript
interface KanbanTask {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  assignee: number; // avatar id
}
```
Kolonlar:
- Yapılacaklar (gray)
- İşlemde (blue)
- Kontrol (purple)
- Tamamlandı (green)

**Özellikleri**:
- **Trello Tarzı Sürükle-Bırak (Drag & Drop)**: Görevlerin durumu sütunlar arası sürüklenerek değiştirilebilir.
- **Sıralama**: Sütun içindeki görev sırası değiştirilebilir.
- **Task Modal**: Göreve tıklandığında detay sayfası yerine Modal açılır (Create/Edit task burada yapılır).


**Tab 3 - Docs (Dokümanlar)**:
```typescript
interface Document {
  id: number;
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'Link';
  size: string;
  uploader: string;
  date: string;
}
```
- Arama özelliği
- Toplam dosya sayısı ve boyut
- İndirme ve silme aksiyonları

**Tab 4 - KPIs**:
- Bütçe Kullanımı (₺ ve %)
- Sprint Tamamlanma (%)
- Hata Yoğunluğu (adet/sprint + trend)
- Sprint Hız Grafiği (BarChart):
  ```typescript
  { name: string, planned: number, actual: number }
  ```

**Tab 5 - Team (Ekip)**:
- Üye kartları: avatar, isim, rol, email, status
- Mesaj ve ara butonları
- Yeni üye ekleme (AddMemberModal)

**Diğer Özellikler**:
- **Action Menu**: Düzenle, Sil, Dışa Aktar, Arşivle
- **Project Edit Modal**: Proje başlığı, açıklama, durum, metodoloji güncelleme

#### Gerekli API:
```
GET /projects/:id
GET /projects/:id/timeline
GET /projects/:id/tasks?grouped=status
GET /projects/:id/documents
GET /projects/:id/kpis
GET /projects/:id/members
GET /projects/:id/current-sprint
GET /projects/:id/burndown
POST /projects/:id/documents (upload)
POST /projects/:id/members
DELETE /projects/:id/members/:userId
PATCH /projects/:id/tasks/reorder (Drag&drop sıralama güncellemesi için)
```

---

### 2.5 Görevler Sayfası

**Dosya**: `src/pages/TasksPage.tsx`

#### Veri Modeli:
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  projectIds: string[];     // Birden fazla projeye bağlanabilir (Yeni)
  assigneeId: string;
  documentIds?: string[];   // Göreve bağlı doküman ID'leri (Yeni)
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
  createdAt: string;
  updatedAt: string;
}
```

#### İstatistik Kartları:
- Toplam görev
- Yapılacak görev
- İşlemdeki görev
- Tamamlanan görev

#### Filtreler:
- Arama (başlık ve açıklama)
- Status: All, Todo, In Progress, Review, Done
- Priority: All, Urgent, High, Medium, Low
- Project: Dinamik liste

#### Görüntüleme:
- List View (Table)
- Board View (Kanban)

#### Gerekli API:
```
GET /tasks?search=&status=&priority=&projectId=&page=&limit=
GET /tasks/stats/by-status
```

---

### 2.6 Görev Detay

**Dosya**: `src/pages/TaskDetail.tsx`

**İlgili Bileşenler** (Yeni):
- `LinkedProjectsCard.tsx` - Göreve bağlı projeler kartı
- `LinkedDocumentsModal.tsx` - Göreve bağlı dokümanlar modali
- `AddTaskToProjectModal.tsx` - Görevi projelere bağlama

#### Sol Kolon (Ana İçerik):
- Status badge
- Görev başlığı
- Atanan kişi (avatar + isim)
- Son tarih
- Tahmini süre
- **Bağlı Projeler** (birden fazla proje gösterimi, renk badge'leri)
- Açıklama (zengin metin)
- Etiketler (tags)
- İlerleme çubuğu (loggedHours / estimatedHours)

**Aktivite Geçmişi**:
```typescript
interface Activity {
  user: string;
  action: string;        // "görevi oluşturdu", "yorum yaptı", "onayladı"
  timestamp: string;
  type: 'create' | 'comment' | 'approval';
  content?: string;      // Yorum içeriği
}
```
- Yorum yazma alanı

#### Sağ Kolon (Sidebar):
- **YZ Önerileri**: Yapay zeka tarafından üretilen öneriler
- **Görev İstatistikleri**: Zaman kullanımı, oluşturma/güncelleme tarihleri
- **Bağlı Projeler Kartı** (`LinkedProjectsCard`):
  - Projelere tıklanarak yönlendirme
  - Projeden çıkarma butonu
  - "Projeye Ekle" butonu (`AddTaskToProjectModal` açar)
- **Bağlı Dokümanlar** butonuyla `LinkedDocumentsModal` açılır

#### Multi-Linking Özellikleri (Yeni):
- Bir görev birden fazla projeye eş zamanlı olarak bağlanabilir
- Dokümanlar görevlere bağlanabilir ve bağlı dokümanlar modal ile görüntülenebilir
- Toast bildirimleri ile bağlama/çıkarma işlemleri kullanıcıya bildirilir

#### Gerekli API:
```
GET /tasks/:id
GET /tasks/:id/activity
GET /tasks/:id/comments
POST /tasks/:id/comments
PATCH /tasks/:id/status
PATCH /tasks/:id (update)
POST /tasks/:id/attachments
GET /tasks/:id/kpi-impact
GET /tasks/:id/ai-suggestions

# Multi-Linking API (Yeni)
POST /tasks/:id/projects/:projectId     # Görevi projeye bağla
DELETE /tasks/:id/projects/:projectId   # Görevi projeden çıkar
POST /tasks/:id/documents/:documentId   # Göreve doküman bağla
DELETE /tasks/:id/documents/:documentId # Görevden doküman çıkar
```

---

### 2.7 AI Doküman Analizi

**Dosya**: `src/pages/DocumentAnalysis.tsx`

**İlgili Bileşenler**:
- `DocumentUploadModal.tsx` - Doküman yükleme (multi-file, drag & drop)
- `ShareAnalysisModal.tsx` - Analiz paylaşımı (link, e-posta, ekip)
- `CreateTaskFromDocModal.tsx` - Aksiyondan görev oluşturma
- `documentStore.ts` - Doküman ve analiz state yönetimi

#### Sayfa Yapısı:

**Boş Durum** (Analiz yoksa):
- "Henüz Analiz Yok" mesajı
- "Doküman Yükle" butonu
- Dashboard'a dön butonu

**Header Aksiyonları**:
- "Yeni Doküman Yükle" butonu (yeşil)
- "Kaydet" butonu (loading state animasyonu)
- "Analizi Paylaş" butonu

#### Sol Kolon (Doküman Kartı):
- Doküman önizleme (mock preview)
- Dosya adı ve boyutu
- Yükleme tarihi
- Analiz durumu badge
- Güvenilirlik yüzdesi (AI confidence)
- AI Model bilgisi (gpt-4, mock-ai vb.)
- Hover'da Download/Share butonları

#### Sağ Kolon (Analiz Sonuçları):

**Yönetici Özeti Kartı**:
- AI tarafından üretilen özet metin
- Etiket listesi (hashtag formatında)

**Bulgular Grid (2 sütun)**:
1. **Öne Çıkan Bulgular** (yeşil border):
   - Pozitif bulgular listesi
   - Sayfa numarası bilgisi

2. **Tespit Edilen Riskler** (kırmızı border):
   - Risk açıklaması
   - Seviye badge (Kritik, Yüksek, Orta, Düşük)
   - Sayfa numarası

**Aksiyon Panosu** (Kanban-benzeri Görünüm):
- Post-it tarzı tasarım
- 2 sütunlu yapı:
  1. **AI Önerileri**: Backend'den gelen aksiyonlar
  2. **Kendi Aksiyonlarım**: Kullanıcının manuel eklediği aksiyonlar

**AI Önerisi Kartı Yapısı**:
```typescript
interface SuggestedAction {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  addedAsTask: boolean;    // Görev olarak eklendi mi?
  taskId?: string;         // Oluşturulan görev ID'si
}
```
- Öncelik göstergesi (🔥 Yüksek, ⚡ Orta, ✨ Düşük)
- "Görev Yap" butonu → CreateTaskFromDocModal açar
- "Görevi Gör" butonu (eğer görev oluşturulduysa)
- "Tümünü Görevlere Ekle" butonu

**Kullanıcı Aksiyonu Ekleme Formu**:
- Aksiyon metni input
- Öncelik seçici (select)
- Ekle butonu
- Silme ve görev oluşturma aksiyonları

#### Analiz Geçmişi Tablosu:
```typescript
interface DocumentAnalysis {
  id: string;
  documentId: string;
  document: Document;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  summary: string;
  findings: Finding[];
  risks: Risk[];
  suggestedActions: SuggestedAction[];
  tags: string[];
  analyzedAt: string;
  savedAt?: string;
  sharedWith?: string[];     // Paylaşılan kullanıcı ID'leri
  shareLink?: string;        // Paylaşım linki
  aiModel?: string;          // Kullanılan AI modeli
  confidence?: number;       // AI güvenilirlik skoru (0-100)
}
```
- Tablo: Doküman Adı, Tarih, Tür, Durum, İşlem
- Aktif analiz vurgulama
- "Görüntüle" butonu

#### Document Store Modeli:
```typescript
interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'TXT' | 'Other';
  size: number;              // bytes
  sizeFormatted: string;     // "2.4 MB"
  url: string;               // Dosya URL'i
  thumbnailUrl?: string;
  uploaderId: string;
  projectId?: string;
  uploadDate: string;
  lastModified: string;
  tags: string[];
  metadata?: Record<string, any>;
}

interface Risk {
  id: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  page?: number;
  section?: string;
}

interface Finding {
  id: string;
  text: string;
  isPositive: boolean;
  page?: number;
}
```

#### Document Upload Modal:
- Drag & drop alanı
- Multi-file upload desteği
- Upload progress bar
- İşlem aşamaları: uploading → processing → analyzing → completed
- Dosya tipi ikonları (PDF, DOCX, XLSX vb.)
- Hata durumu gösterimi

#### Share Analysis Modal:
- Link oluştur ve kopyala
- E-posta ile paylaş
- Ekip üyelerini seç (checkbox listesi)
- Paylaşım onay bildirimi

#### Create Task From Doc Modal:
- Seçili aksiyon metni (readonly)
- Görev başlığı (aksiyon metninden önerilir)
- Proje seçimi
- Atanan kişi seçimi
- Öncelik seçimi
- Bitiş tarihi
- Tahmini süre
- "Tümünü Görev Olarak Oluştur" modu

#### Gerekli API:
```
GET /documents?projectId=&analysisStatus=
GET /documents/:id
GET /documents/:id/analysis
POST /documents/upload (multipart/form-data)
POST /documents/:id/analyze
PATCH /documents/:id
DELETE /documents/:id

# Analiz İşlemleri
GET /analyses?documentId=&status=
GET /analyses/:id
PATCH /analyses/:id/save
POST /analyses/:id/share
POST /analyses/:id/generate-link
PATCH /analyses/:id/actions/:actionId/mark-as-task

# Görev Dönüşümü
POST /tasks (action → task dönüşümü)
POST /tasks/bulk (toplu aksiyon → görev)
```

---

### 2.7.1 Doküman Listesi Sayfası (Yeni)

**Dosya**: `src/pages/DocumentsPage.tsx`

> **Yeni Sayfa**: Tüm dokümanların grid/list görünümü ile yönetimi ve AI analiz entegrasyonu.

**İlgili Bileşenler**:
- `DocumentUploadModal.tsx` - Doküman yükleme
- `LinkedTasksCard.tsx` - Dokümana bağlı görevler

#### Sayfa Özellikleri:

**Header**:
- "Dokümanlar" başlığı
- "Yeni Doküman Yükle" butonu (gradient tasarım)

**İstatistik Kartları (4 adet)**:
1. **Toplam Doküman**: Tüm doküman sayısı
2. **Analiz Edilmiş**: AI ile analiz edilen doküman sayısı
3. **PDF Dosyaları**: PDF türünde doküman sayısı
4. **Diğer Formatlar**: PDF dışı doküman sayısı

**Filtreler ve Sıralama**:
- Arama (doküman adı)
- Dosya Türü Filtresi: Tümü, PDF, DOCX, XLSX, PPTX, TXT, Other
- Proje Filtresi: Tümü, Projesiz, [Proje Listesi]
- Sıralama: Tarih, Ad, Boyut, Tür
- Sıralama Yönü: Artan/Azalan

**Görüntüleme Modları**:
- **Grid View**: Kart bazlı görünüm
  - Dosya tipi ikonu (renkli)
  - Dosya adı, boyutu, türü
  - Proje adı (varsa)
  - Yükleme tarihi
  - AI Analiz durumu badge
  - Hover: Görüntüle, Sil butonları
  
- **List View**: Tablo bazlı görünüm
  - Kolonlar: Doküman, Tür, Boyut, Proje, Tarih, Durum, İşlem
  - Dropdown menü: İndir, Sil

**Doküman Aksiyonları**:
- Tıklama: Analiz varsa görüntüle, yoksa AI analiz başlat
- Analiz sayfasına yönlendirme
- Silme (onay diyaloğu)

**View Mode Persistence**:
- LocalStorage'a kaydedilen görünüm tercihi

#### Gerekli API:
```
GET /documents?type=&projectId=&sortBy=&sortOrder=&search=&page=&limit=
GET /documents/stats
POST /documents/upload (multipart/form-data)
DELETE /documents/:id
GET /documents/:id/analysis
POST /documents/:id/analyze
```

---

### 2.8 Oyunlaştırma Profili (Gelişmiş Karakter Sistemi)

**Dosya**: `src/pages/GamificationProfile.tsx`

> **Yeni Özellik**: Trello-benzeri interaktif karakter sistemi, animasyonlar ve detaylı başarım takibi.

#### Unvan (Title) Sistemi:
```typescript
const TITLES = [
  { minLevel: 1, maxLevel: 5, name: 'Çaylak', key: 'caylak',
    icon: '🌱', emoji: '🐣',
    color: 'text-green-400', gradient: 'from-green-500 to-emerald-400',
    description: 'Yeni başlayan, öğrenmeye hevesli',
    personality: 'Meraklı ve enerjik' },
    
  { minLevel: 6, maxLevel: 10, name: 'Geliştirici', key: 'gelistirici',
    icon: '⚡', emoji: '🦊', ... },
    
  { minLevel: 11, maxLevel: 20, name: 'Uzman', key: 'uzman',
    icon: '🔥', emoji: '🦁', ... },
    
  { minLevel: 21, maxLevel: 30, name: 'Usta', key: 'usta',
    icon: '💎', emoji: '🐉', ... },
    
  { minLevel: 31, maxLevel: 999, name: 'Efsane', key: 'efsane',
    icon: '👑', emoji: '🦅', ... },
];
```

#### Başarım (Achievement) Sistemi:
```typescript
interface Achievement {
  id: string;              // 'first_task', 'task_hunter', vb.
  name: string;            // 'İlk Adım'
  description: string;     // 'İlk görevini tamamla'
  howTo: string;           // Kazanma yöntemi açıklaması
  icon: LucideIcon;        // React bileşeni
  xp: number;              // Kazanılacak XP (50-500)
  color: string;           // 'green', 'blue', 'purple', vb.
  requirement: number;     // Gerekli sayı
  type: 'tasks' | 'streak' | 'level' | 'projects' | 'documents';
  link: string;            // Yönlendirme linki
  linkText: string;        // 'Görevlere Git'
}
```

#### İnteraktif Karakter Bileşeni:
- Büyük glow efektleri (gradient-based)
- Dönen kesikli çember animasyonu
- 3 adet dönen ✨ sparkle
- Hover efektleri
- Entrance ve Breathing animasyonları

#### Sayfa Yapısı:

**Header**:
- "Başarılarım" başlığı
- "Liderlik Tablosu" butonu

**İstatistik Kartları (4 adet)**:
1. **Seviye Kartı**: Unvan, Seviye, XP bar
2. **Toplam XP Kartı**: Toplam XP, Sonraki seviye
3. **Tamamlanan Görev Kartı**: CheckCircle ikonu, sayı
4. **Streak Kartı**: Flame ikonu, Güncel/En Uzun streak

**Ana İçerik Grid (3 sütun)**:

**Sol 2 Sütun**:
1. **Başarımlar Paneli**: 
   - İlerleme çubuğu
   - Başarım kartları (icon, name, progress bar)
   - Badge kazanımı (yeşil tık)
   
2. **Karakter Vitrin Alanı**:
   - Premium gradient arka plan
   - Merkezi büyük karakter
   - Unvan/Seviye bilgileri
   - **Unvan Yolculuğu**: Karakter evrimi (past/current/future)

**Sağ Sütun**:
1. **Bu Hafta Takvimi**: 7 günlük streak görünümü, günlük bonus
2. **İstatistikler Paneli**: Görev, Proje, Doküman linkleri ve sayıları
3. **Sıralama Kartı**: Büyük sıra numarası, XP özeti

#### User Model Gamification Alanları:
```typescript
interface User {
  // ... diğer alanlar
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank?: number;
  currentStreak?: number;
  longestStreak?: number;
  lastActiveDate?: string;
  unlockedAchievements?: string[];  // Achievement ID'leri
}
```

#### Gerekli API:
```
GET /gamification/profile
GET /gamification/badges
GET /gamification/achievements
GET /gamification/achievements/:id
GET /gamification/recent-activities
GET /gamification/skills
GET /gamification/streak
POST /gamification/achievements/:id/unlock
```

---

### 2.9 Liderlik Tablosu

**Dosya**: `src/pages/Leaderboard.tsx`

#### Filtre:
- Bu Ay / Tüm Zamanlar toggle

#### Tablo Kolonları:
- Sıralama (Trophy/Medal ikonları ile)
- Kullanıcı (avatar + isim)
- Takım (rol/departman)
- XP
- Seviye (progress bar ile)
- İşlem (Takdir Et butonu)

#### Sayfalama:
- Sayfa numaraları (1, 2, 3...)

#### Bilgi Kartları:
- "Nasıl Daha Fazla XP Kazanabilirim?"
- "Aktif İletişim Kur"
- "KPI'ları Geliştir"

#### Gerekli API:
```
GET /gamification/leaderboard?period=month|all-time&page=&limit=
```

---

### 2.10 Bildirimler

**Dosya**: `src/pages/Notifications.tsx`

#### Bildirim Tipleri:
1. **XP Kazanma** (success - yeşil)
   - Görev tamamlama bildirimi
   - XP miktarı
   - Aksiyon: Dashboard'a Dön

2. **Metodoloji Uyum Uyarısı** (warning - sarı)
   - Scrum/Waterfall uyumsuzluk
   - Aksiyonlar: Yoksay, Düzelt

3. **Rozet Kazanma** (badge - turuncu)
   - Rozet adı ve açıklaması
   - Aksiyon: Profile Git

4. **YZ Bağlamsal Uyarısı** (AI - mavi)
   - Risk tespiti
   - Sayısal veri (örn: bütçe sapması: 15%)
   - Aksiyon: Analizi Görüntüle

5. **Toplantı Hatırlatması** (meeting - mor)
   - Toplantı adı ve süre
   - Aksiyonlar: Ertele, Katıl (Zoom link)

6. **Görev Tamamlandı** (completed - gri)
   - Kim tamamladı bilgisi

#### Veri Modeli:
```typescript
interface Notification {
  id: string;
  type: 'xp' | 'warning' | 'badge' | 'ai' | 'meeting' | 'task' | 'success' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actions?: {
    label: string;
    url?: string;
    type: 'primary' | 'secondary';
  }[];
  metadata?: {
    xpAmount?: number;
    badgeName?: string;
    meetingUrl?: string;
    projectName?: string;
  };
}
```

#### Gerekli API:
```
GET /notifications?isRead=&type=&page=&limit=
GET /notifications/unread-count
PATCH /notifications/:id/read
PATCH /notifications/read-all
DELETE /notifications/:id
POST /notifications/:id/dismiss
```

---

### 2.11 Takvim

**Dosya**: `src/pages/CalendarPage.tsx`

**İlgili Bileşenler**:
- `AddEventModal.tsx` - Etkinlik ekleme modal

#### Header:
- "Bugün" butonu (hızlı navigasyon)
- Ay navigasyonu (önceki/sonraki ay butonları)
- Ay ve yıl gösterimi
- "Etkinlik Ekle" butonu (AddEventModal açar)

#### Takvim Grid:
- 7 günlük header (Pazartesi - Pazar, mobilde kısaltılmış)
- Aylık görünüm (35/42 hücre - dinamik)
- Önceki/sonraki ay günleri soluk renkte
- Bugün vurgusu (mavi yuvarlak + shadow)
- Hover'da "+" butonu (ilgili güne etkinlik ekle)

#### Etkinlik Görünümü:
- Görevler (taskStore'dan çekiliyor)
- Renk kodlaması (proje rengine göre)
- Maksimum 3 etkinlik gösterimi
- "+N daha" göstergesi

#### AddEventModal Özellikleri:
```typescript
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;    // Tıklanan gün
}
```
- Görev başlığı
- Bitiş tarihi (seçili gün ile ön dolduruluyor)
- Proje seçimi
- Atanan kişi seçimi
- Öncelik seçimi
- Tahmini süre
- Açıklama
- Etiketler
- Form validasyonu

#### Yaklaşan Görevler Özeti:
- Alt panel (grid 4 sütun)
- Aktif görevler (Done olmayan)
- Bitiş tarihine göre sıralı
- Kalan gün hesaplaması (renk kodlu: kırmızı/sarı/yeşil)
- Proje adı

#### Etkinlik Tipleri:
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'task' | 'completed';
  color: ProjectColor;    // proje rengine göre
  projectName: string;
}
```

#### Gerekli API:
```
GET /calendar/events?year=&month=&projectId=
POST /calendar/events
GET /calendar/events/:id
PATCH /calendar/events/:id
DELETE /calendar/events/:id

# Görev bazlı takvim verisi
GET /tasks?dueDate_start=&dueDate_end=
```

---

### 2.12 Ekip Listesi

**Dosya**: `src/pages/TeamPage.tsx`

**İlgili Bileşenler**:
- `AddMemberModal.tsx` - Üye ekleme modal

#### Departman Filtreleri:
- Tümü, Yönetim, Yazılım, Tasarım, Veri, Kalite, İK

#### Arama:
- İsim veya pozisyon

#### Üye Kartları:
```typescript
interface TeamMember {
  id: number;
  name: string;
  role: string;
  dept: string;
  status: 'online' | 'busy' | 'offline';
  avatar: number;
  location: string;
}
```

#### Aksiyonlar:
- Mail gönder
- Telefon
- Context menu (MoreHorizontal)

#### Gerekli API:
```
GET /team/members?department=&search=&status=
GET /team/departments
POST /team/members (davet)
```

---

### 2.13 Ekip Üyesi Profili

**Dosya**: `src/pages/TeamMemberProfile.tsx`

#### Kapsamlı Veri Modeli:
```typescript
interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  avatar: number;
  status: 'online' | 'busy' | 'offline' | 'away';
  bio: string;
  
  // Gamification
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: number;
  
  // Skills
  skills: { name: string; level: number }[];
  
  // Badges
  badges: { name: string; icon: string; color: string }[];
  
  // Stats
  stats: {
    completedTasks: number;
    activeProjects: number;
    totalProjects: number;
    avgTaskTime: string;
    onTimeRate: number;
  };
  
  // Görevler
  currentTasks: {
    id: string;
    title: string;
    project: string;
    status: string;
    dueDate: string;
    priority: string;
  }[];
  
  // Projeler
  projects: {
    id: string;
    name: string;
    role: string;
    progress: number;
    color: string;
  }[];
  
  // Aktivite
  recentActivity: {
    action: string;
    project: string;
    time: string;
    xp: number;
  }[];
}
```

#### Hızlı İşlemler:
- Mesaj Gönder
- Görev Ata
- Takdir Et

#### Gerekli API:
```
GET /users/:id
GET /users/:id/stats
GET /users/:id/tasks?status=active
GET /users/:id/projects
GET /users/:id/badges
GET /users/:id/skills
GET /users/:id/activity
POST /users/:id/praise (takdir)
POST /users/:id/assign-task
```

---

### 2.14 KPI Dashboard

**Dosya**: `src/pages/KPIPage.tsx`

> **Güncelleme**: Tab sistemi, özel hedef yönetimi, ekip performans sıralaması ve proje bazlı filtreleme eklendi.

#### Tab Sistemi:
1. **Genel (Overview)**: Genel bakış ve grafikler
2. **Hedefler (Goals)**: Hedef takip ve özel hedef oluşturma
3. **Ekip (Team)**: Ekip performans sıralaması

#### Zaman Aralığı Filtresi:
- Haftalık / Aylık / Çeyreklik / Yıllık

#### Proje Filtresi:
- Tüm Projeler / [Proje Seçimi]

#### Özet Kartları (Overview Tab):
| Metrik | Veri |
|--------|------|
| Toplam Bütçe | ₺ formatında, trend göstergesi |
| Tamamlanan Görevler | Tamamlanan/Toplam |
| Ortalama İlerleme | % formatında |
| Riskli Projeler | Sayı + aktif proje bilgisi |

#### Grafikler (Overview Tab):

**Finansal Genel Bakış**:
- Alan, Çubuk, Çizgi grafik seçimi
```typescript
{ name: string, revenue: number, profit: number }[]
```

**Ekip Yetkinlik** (Radar Chart):
```typescript
{ subject: string, A: number, B: number, fullMark: number }[]
```

**Proje Performans Karşılaştırması** (Area Chart):
```typescript
{ name: string, ilerleme: number, bütçe: number, görev: number }[]
```

#### Hedef Yönetimi (Goals Tab):
```typescript
interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  category: 'revenue' | 'project' | 'team' | 'quality';
  deadline: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  projectId?: string;  // Projeye özgü hedefler için
}
```

**Özel Hedef Oluşturma** (Yeni):
- Modal ile yeni hedef ekleyebilme
- Hedef adı, hedef/mevcut değer, birim
- Kategori seçimi (💰 Gelir, 🎯 Proje, 👥 Ekip, ✅ Kalite)
- Durum seçimi
- Proje bağlantısı (opsiyonel)
- Özel hedefler silinebilir

#### Ekip Performansı (Team Tab):
```typescript
interface TeamPerformance {
  userId: string;
  name: string;
  role: string;
  avatar: number;
  completedTasks: number;
  totalHours: number;
  efficiency: number;  // % olarak verimlilik
  score: number;       // XP bazlı skor
}
```

**Sıralama Görünümü**:
- 1-3. sırada madalya ikonları
- XP skoru ve görev sayısı
- Verimlilik yüzdesi

#### Gerekli API:
```
GET /kpi/dashboard
GET /kpi/revenue?period=ytd&projectId=
GET /kpi/project-performance
GET /kpi/completion-stats
GET /kpi/issues
GET /kpi/team-performance?projectId=&period=

# Hedef Yönetimi API (Yeni)
GET /kpi/goals?projectId=&category=&status=
POST /kpi/goals
PATCH /kpi/goals/:id
DELETE /kpi/goals/:id
```

---

### 2.15 Ayarlar

**Dosya**: `src/pages/Settings.tsx`

#### Tab 1 - Profilim:
- Avatar değiştirme
- Ad Soyad
- E-posta
- Ünvan
- Telefon
- Biyografi

#### Tab 2 - Bildirimler:
| Ayar | Varsayılan |
|------|------------|
| E-posta Bildirimleri | ✓ |
| Masaüstü Bildirimleri | ✓ |
| Görev Atamaları | ✓ |
| Son Tarih Hatırlatıcıları | ✗ |
| Haftalık Rapor | ✗ |

#### Tab 3 - Güvenlik:
- Mevcut şifre
- Yeni şifre
- Şifre güncelle butonu
- Hesap silme (tehlikeli bölge)

#### Gerekli API:
```
GET /users/me
PATCH /users/me
PATCH /users/me/avatar (multipart)
GET /settings/notifications
PATCH /settings/notifications
PATCH /users/me/password
DELETE /users/me (hesap silme)
```

---

### 2.16 Yardım Sayfası

**Dosya**: `src/pages/HelpPage.tsx`

#### Arama:
- Soru veya konu arama

#### Kategori Kartları:
1. Dokümantasyon
2. Sıkça Sorulanlar (SSS)
3. Canlı Destek

#### Popüler Konular:
- Yeni proje nasıl oluşturulur?
- XP puanları nasıl hesaplanır?
- Takım üyeleri nasıl davet edilir?
- API anahtarları nerede bulunur?
- Bildirim ayarları nasıl değiştirilir?
- Şifremi unuttum, ne yapmalıyım?

#### Gerekli API:
```
GET /help/search?q=
GET /help/articles?category=
GET /help/faq
POST /help/support-ticket
```

---

### 2.17 Header Bileşeni

**Dosya**: `src/components/Header.tsx`

- Metrika logosu ve başlık
- Global arama
- Bildirim butonu (kırmızı badge - okunmamış sayısı)
- Mesaj butonu (mavi badge)
- Kullanıcı profil mini kartı (isim + seviye)

#### Gerekli API:
```
GET /notifications/unread-count
GET /messages/unread-count
GET /search?q=
```

---

### 2.18 Sidebar Bileşeni

**Dosya**: `src/components/Sidebar.tsx`

#### Navigasyon Items:
1. Dashboard
2. Projeler
3. Görevler
4. Dokümanlar
5. KPI'lar
6. Oyunlaştırma
7. Ekip
8. Takvim
9. Ayarlar
10. Yardım
11. Çıkış

---

## 3. Veri Modelleri (Frontend Perspektifi)

### 3.1 Mevcut types.ts

```typescript
// src/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: number; // picsum id
  role: string;
  department: string;
  location: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank?: number;
  bio?: string;
  joinDate: string;
  // Gamification
  currentStreak?: number;
  longestStreak?: number;
  lastActiveDate?: string;
  unlockedAchievements?: string[];
}

export interface Project {
  id: string;
  title: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
  methodology?: 'Waterfall' | 'Scrum' | 'Hybrid';
  description?: string;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  assignee: User;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
```

> **Dikkat**: Bu tipler temel düzeyde olup, sayfalarda daha detaylı inline tipler kullanılmaktadır.

---

## 4. API Gereksinimleri

### 4.1 Özet API Endpoint Listesi

#### Authentication
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
```

#### Users
```
GET    /users/me
PATCH  /users/me
PATCH  /users/me/avatar
PATCH  /users/me/password
DELETE /users/me
GET    /users
GET    /users/:id
GET    /users/:id/stats
GET    /users/:id/tasks
GET    /users/:id/projects
GET    /users/:id/badges
GET    /users/:id/skills
GET    /users/:id/activity
POST   /users/:id/praise
POST   /users/:id/assign-task
```

#### Dashboard
```
GET    /dashboard/stats
GET    /dashboard/active-projects
GET    /dashboard/ai-suggestions
GET    /dashboard/kpi-summary
GET    /dashboard/upcoming-tasks
GET    /dashboard/risk-alerts
```

#### Projects
```
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
GET    /projects/:id/stats
GET    /projects/:id/timeline
GET    /projects/:id/burndown
GET    /projects/:id/tasks
GET    /projects/:id/members
POST   /projects/:id/members
PATCH  /projects/:id/members/:userId
DELETE /projects/:id/members/:userId
GET    /projects/:id/documents
GET    /projects/:id/kpis
POST   /projects/:id/kpis
GET    /projects/:id/sprints
POST   /projects/:id/sprints
GET    /projects/:id/current-sprint
```

#### Tasks
```
GET    /tasks
POST   /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
PATCH  /tasks/:id/status
GET    /tasks/:id/comments
POST   /tasks/:id/comments
GET    /tasks/:id/time-logs
POST   /tasks/:id/time-logs
GET    /tasks/:id/activity
GET    /tasks/:id/kpi-impact
GET    /tasks/:id/ai-suggestions
POST   /tasks/:id/attachments
GET    /tasks/stats/by-status
```

#### Sprints
```
GET    /sprints/:id
PATCH  /sprints/:id
PATCH  /sprints/:id/start
PATCH  /sprints/:id/complete
```

#### Documents
```
GET    /documents
POST   /documents/upload (multipart)
GET    /documents/:id
DELETE /documents/:id
PATCH  /documents/:id
POST   /documents/:id/analyze
GET    /documents/:id/analysis

# Analiz Aksiyonları & Paylaşım
GET    /analyses
GET    /analyses/:id
PATCH  /analyses/:id/save
POST   /analyses/:id/share
POST   /analyses/:id/generate-link
PATCH  /analyses/:id/actions/:actionId/mark-as-task
```

#### KPIs
```
GET    /kpi/dashboard
GET    /kpis/:id
PATCH  /kpis/:id
DELETE /kpis/:id
POST   /kpis/:id/record
GET    /kpis/:id/history
GET    /kpi/revenue
GET    /kpi/project-performance
GET    /kpi/completion-stats
GET    /kpi/issues
```

#### Gamification
```
GET    /gamification/profile
GET    /gamification/badges
GET    /gamification/achievements
GET    /gamification/achievements/:id
GET    /gamification/leaderboard
GET    /gamification/streak
GET    /gamification/recent-activities
GET    /gamification/skills
POST   /gamification/achievements/:id/unlock
```

#### Notifications
```
GET    /notifications
GET    /notifications/unread-count
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
DELETE /notifications/:id
```

#### Calendar
```
GET    /calendar/events
POST   /calendar/events
GET    /calendar/events/:id
PATCH  /calendar/events/:id
DELETE /calendar/events/:id
PATCH  /calendar/events/:id/respond
```

#### Team
```
GET    /team/members
GET    /team/departments
POST   /team/members
```

#### Settings
```
GET    /settings/notifications
PATCH  /settings/notifications
```

#### Help
```
GET    /help/search
GET    /help/articles
GET    /help/faq
POST   /help/support-ticket
```

#### Search (Global)
```
GET    /search
```

---

## 5. Gamification Sistemi

### 5.1 XP Kaynakları (Frontend'den Gözlemlenen)

| Kaynak | XP | Koşul |
|--------|-----|-------|
| Görev tamamlama | 10-50 | Önceliğe göre değişir |
| Yorum yapma | 5-10 | - |
| Doküman yükleme | 10 | - |
| AI analizi tetikleme | 15 | - |
| Rozet kazanma | 25-100 | Rozete göre değişir |
| 7 günlük streak | 50 | Kesintisiz çalışma |
| 30 günlük streak | 200 | Kesintisiz çalışma |

### 5.2 Seviye Sistemi

```
Seviye 1 → 1,000 XP gerekli
Seviye 2 → 2,000 XP gerekli
Seviye N → N × 1,000 XP gerekli
```

### 5.3 Rozet Kategorileri

| Rozet | İkon | Renk | Açıklama |
|-------|------|------|----------|
| Proje Ustası | Trophy | Yellow | 10 proje tamamla |
| Takım Lideri | Users | Blue | 5 projede liderlik |
| Hız Ustası | Zap | Purple | 50 görevi zamanında tamamla |
| Dokümantasyon | FileText | Green | 25 doküman yükle |
| İletişim Kralı | Star | Orange | Yoğun yorum aktivitesi |
| Analitik | TrendingUp | Pink | KPI hedeflerini aş |
| Teknoloji | Shield | Cyan | Teknik başarılar |
| Kalite | CheckCircle | Emerald | Kalite standartlarını karşıla |

### 5.4 Beceri Kategorileri

- Proje Yönetimi
- Ekip Liderliği
- Analitik
- İletişim
- Backend Development
- Database Design
- API Design
- DevOps
- Problem Solving

---

## 6. AI Entegrasyonu

### 6.1 Doküman Analizi Çıktıları

```typescript
interface AIAnalysisResult {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  analyzedAt?: string;
  summary: string;
  findings: {
    type: 'positive' | 'negative';
    content: string;
  }[];
  risks: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    content: string;
    page?: number;
  }[];
  suggestedActions: {
    title: string;
    priority: 'low' | 'medium' | 'high';
    canCreateTask: boolean;
  }[];
  tags: string[];
}
```

### 6.2 AI Önerileri (Dashboard)

- Sprint hızı analizi
- Bütçe sapma uyarıları  
- Kaynak planlama önerileri
- Risk tespitleri

### 6.3 Görev Bazlı AI Önerileri

- Görev detay sayfasında sağ sidebar'da gösteriliyor
- Örnek: "Raporunuza rakip kampanyalarla karşılaştırmalı analiz ekleyebilirsiniz"

---

## 7. Gerçek Zamanlı Özellikler

### 7.1 WebSocket Gereksinimleri

| Olay | Açıklama | Payload |
|------|----------|---------|
| `notification` | Yeni bildirim | `{id, type, title, message}` |
| `task:updated` | Görev güncellendi | `{taskId, changes, updatedBy}` |
| `task:created` | Yeni görev | `{task}` |
| `project:updated` | Proje güncellendi | `{projectId, changes}` |
| `comment:added` | Yeni yorum | `{taskId, comment}` |
| `user:status` | Kullanıcı durumu | `{userId, status}` |
| `xp:earned` | XP kazanıldı | `{amount, reason, newTotal}` |
| `level:up` | Seviye atlandı | `{newLevel, message}` |
| `badge:earned` | Rozet kazanıldı | `{badge}` |

### 7.2 Kullanıcı Durumları

- `online` (yeşil)
- `busy` (kırmızı)
- `away` (sarı)
- `offline` (gri)

---

## 8. Mevcut Spesifikasyonda Tespit Edilen Eksikler

Mevcut `BACKEND_SPECIFICATION.md` dosyası oldukça kapsamlı hazırlanmış. Ancak frontend incelemesi sonucu aşağıdaki eksikler tespit edilmiştir:

### 8.1 Eksik API Endpoint'leri

| Endpoint | Kullanım Yeri | Açıklama |
|----------|---------------|----------|
| `GET /gamification/achievements` | Gamification | Tüm başarımları listele |
| `GET /gamification/streak` | Gamification | Streak bilgisini getir |
| `POST /analyses/:id/share` | Doc Analysis | Analiz paylaşımı |
| `POST /tasks/bulk` | Doc Analysis | Dokümandan toplu görev açma |
| `GET /dashboard/active-projects` | Dashboard | Sadece aktif projeler (limit:4) |
| `GET /dashboard/risk-alerts` | Dashboard | Kritik risk uyarıları |
| `GET /tasks/:id/kpi-impact` | Task Detail | Görevin KPI'lara etkisi |
| `GET /tasks/:id/ai-suggestions` | Task Detail | Görev için AI önerileri |
| `GET /tasks/:id/activity` | Task Detail | Aktivite timeline |
| `GET /tasks/stats/by-status` | Tasks Page | Status bazlı istatistikler |
| `GET /kpi/dashboard` | KPI Page | Genel KPI dashboard verileri |
| `GET /kpi/revenue` | KPI Page | Gelir verileri |
| `GET /kpi/project-performance` | KPI Page | Proje performans karşılaştırma |
| `GET /kpi/issues` | KPI Page | Aktif sorun sayısı |
| `GET /gamification/recent-activities` | Gamification | Son XP aktiviteleri |
| `GET /gamification/skills` | Gamification | Beceri dağılımı |
| `POST /users/:id/praise` | Team Member | Takdir et özelliği |
| `POST /users/:id/assign-task` | Team Member | Hızlı görev atama |
| `GET /messages/unread-count` | Header | Mesaj sayacı |
| `GET /help/*` | Help Page | Yardım merkezi API'leri |
| `GET /search` | Header | Global arama |

### 8.2 Tespit Edilen Frontend Tutarsızlıkları

1. **Kanban Implementasyonu**:
   - `TasksPage.tsx`: Basit, sürükle-bırak özelliği olmayan statik bir board kullanıyor.
   - `ProjectDetail.tsx`: `@dnd-kit` ile geliştirilmiş, sürükle-bırak ve sıralama özellikli gelişmiş `KanbanBoard` bileşenini kullanıyor. Backend tarafının bu gelişmiş yapıyı (sıralama vb.) desteklemesi bekleniyor.

2. **Görev Düzenleme**:
   - Analiz raporunda `/tasks/:id` sayfası öngörülürken, gelişmiş Kanban board üzerinde işlemler **Modal (Drop-up)** üzerinden yapılıyor.

3. **Veri Kalıcılığı**:
   - Mevcut kod yapısında (`taskStore.ts`), veriler `zustand/middleware/persist` kullanılarak `localStorage` üzerinde tutuluyor. Backend entegrasyonunda bu yapı API çağrılarına evrilecek.

### 8.3 Eksik Veri Alanları

#### Project Model:
- `color` alanı mevcut değil (renk seçimi için)
- `actualEndDate` görüntülenmesi

#### Task Model:
- `projectColor` alanı (Kanban'da gösterim için)
- `progress` hesaplaması (loggedHours/estimatedHours)
- `order_index` (Kanban sıralaması için gerekli)

#### User Model:
- `skills` array'i (beceri dağılımı için)

#### Notification Model:
- `actions[]` array'i (aksiyonlar için)
- `metadata` object (XP, badge, meeting URL vb.)

### 8.3 Eksik İş Kuralları

1. **Proje Renk Seçimi**: Frontend'de blue, purple, green, yellow, cyan, red renkleri kullanılıyor
2. **Metodoloji Bazlı Özellikler**:
   - Scrum: Sprint yönetimi, backlog, burndown
   - Waterfall: Faz bazlı timeline, quality gates
   - Hybrid: Her iki özellik
3. **Global Arama**: Projeler, görevler, dokümanlar, kullanıcılar arasında arama

### 8.4 Eksik Enum Değerleri

```typescript
// Status değerlerinde "Cancelled" eksik frontend'de kullanılmıyor
// Task status'a "Blocked" eklenecek (BACKEND_SPEC'te var ama frontend'de yok)

// Notification types genişletilmeli:
type NotificationType = 
  | 'info' | 'success' | 'warning' | 'error'  // Mevcut
  | 'xp' | 'badge' | 'task' | 'mention' | 'deadline'  // Mevcut
  | 'meeting' | 'ai';  // Eksik
```

---

## 9. Özet ve Öneriler

### 9.1 Backend Geliştirme Öncelikleri

1. **Kritik (Hemen)**:
   - Authentication & Authorization
   - Users CRUD
   - Projects CRUD
   - Tasks CRUD
   - Dashboard Stats API

2. **Yüksek Öncelik**:
   - Gamification sistemi (XP, Level, Badges)
   - Notifications (CRUD + WebSocket)
   - Document upload & AI analysis

3. **Orta Öncelik**:
   - Sprint management
   - KPI tracking
   - Calendar events
   - Team management

4. **Düşük Öncelik**:
   - Help center
   - Advanced search
   - Analytics & reporting

### 9.2 Veritabanı Önerileri

Mevcut `BACKEND_SPECIFICATION.md`'deki şema yeterli. Ek olarak:

```sql
-- Project color için
ALTER TABLE projects ADD COLUMN color VARCHAR(20) DEFAULT 'blue';

-- Task için progress hesaplaması view olarak
CREATE VIEW task_progress AS
SELECT 
  id,
  title,
  CASE 
    WHEN estimated_hours > 0 THEN (logged_hours / estimated_hours) * 100
    ELSE 0
  END as progress_percent
FROM tasks;

-- Notification actions için JSONB
ALTER TABLE notifications ADD COLUMN actions JSONB DEFAULT '[]';
ALTER TABLE notifications ADD COLUMN metadata JSONB DEFAULT '{}';
```

### 9.3 API Response Standartları

Tüm API response'ları aşağıdaki formatta olmalı:

```typescript
// Başarılı response
{
  success: true,
  data: { ... },
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Hata response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### 9.4 Frontend Entegrasyonu

1. **State Management**: Zustand kullanılıyor, API çağrıları için store'lar oluşturulmalı
2. **Error Handling**: Toast notifications için hata mesajları Türkçe olmalı
3. **Loading States**: Skeleton loaders için API response süreleri optimize edilmeli
4. **Cache**: React Query veya SWR entegrasyonu önerilir

---

## 10. API Servis Katmanı (Yeni)

> **Backend Entegrasyonu**: Bu bölüm gerçek backend ile entegrasyon için oluşturulan servis katmanını açıklar.

### 10.1 API İstemcisi (api.ts)

**Dosya**: `src/services/api.ts`

#### Temel Özellikler:
- Singleton API client pattern
- JWT Bearer token yönetimi (localStorage'da saklanır)
- `_id` → `id` field mapping (MongoDB uyumu)
- `isRead` → `read` field mapping (Notification uyumu)
- Otomatik hata yakalama ve formatla

```typescript
// API Client yapısı
class ApiClient {
  // Base URL: https://backend-metrika.vercel.app
  
  get<T>(endpoint: string): Promise<T>
  post<T>(endpoint: string, body?: unknown): Promise<T>
  patch<T>(endpoint: string, body?: unknown): Promise<T>
  delete<T>(endpoint: string): Promise<T>
  upload<T>(endpoint: string, formData: FormData): Promise<T>
}

// Token Yönetimi
const TOKEN_KEY = 'metrika-auth-token';
getToken(): string | null
setToken(token: string): void
removeToken(): void
```

### 10.2 Kimlik Doğrulama Store'u (authStore.ts)

**Dosya**: `src/store/authStore.ts`

#### State Yapısı:
```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}
```

#### Zustand Persist:
- Token `localStorage`'da saklanır
- User bilgisi `checkAuth()` ile API'den çekilir
- Session yönetimi için `zustand/middleware/persist` kullanılır

---

## 11. API Entegrasyon Durumu

> **Not**: Aşağıdaki tablo, frontend'de hangi API'lerin gerçek backend ile çalıştığını ve hangilerinin henüz mock veri kullandığını gösterir.

### 11.1 Entegre API'ler ✅

| Modül | Endpoint | Durum | Açıklama |
|-------|----------|-------|----------|
| **Auth** | `POST /auth/login` | ✅ Çalışıyor | Email/şifre ile giriş |
| **Auth** | `POST /auth/register` | ✅ Çalışıyor | Yeni kullanıcı kaydı |
| **Auth** | `GET /users/me` | ✅ Çalışıyor | Token doğrulama |
| **Users** | `GET /users` | ✅ Çalışıyor | Kullanıcı listesi |
| **Projects** | `GET /projects` | ✅ Çalışıyor | Proje listesi |
| **Projects** | `GET /projects/:id` | ✅ Çalışıyor | Proje detay |
| **Projects** | `POST /projects` | ✅ Çalışıyor | Proje oluşturma |
| **Projects** | `PATCH /projects/:id` | ✅ Çalışıyor | Proje güncelleme |
| **Projects** | `DELETE /projects/:id` | ✅ Çalışıyor | Proje silme |
| **Tasks** | `GET /tasks` | ✅ Çalışıyor | Görev listesi |
| **Tasks** | `GET /tasks/:id` | ✅ Çalışıyor | Görev detay |
| **Tasks** | `POST /tasks` | ✅ Çalışıyor | Görev oluşturma |
| **Tasks** | `PATCH /tasks/:id` | ✅ Çalışıyor | Görev güncelleme |
| **Tasks** | `DELETE /tasks/:id` | ✅ Çalışıyor | Görev silme |
| **Notifications** | `GET /notifications` | ✅ Çalışıyor | Bildirim listesi |
| **Notifications** | `PATCH /notifications/:id` | ✅ Çalışıyor | Okundu işaretleme |

### 11.2 Mock Veri Kullanan Modüller ⏳

| Modül | Dosya | Durum | Açıklama |
|-------|-------|-------|----------|
| **Dashboard** | `Dashboard.tsx` | ⏳ Mock | İstatistikler mock veri |
| **Gamification** | `GamificationProfile.tsx` | ⏳ Mock | XP, Badge, Streak sistemi |
| **Leaderboard** | `Leaderboard.tsx` | ⏳ Mock | Liderlik tablosu |
| **Calendar** | `CalendarPage.tsx` | ⏳ Kısmi | Tasks API'den çekiyor, events mock |
| **KPI** | `KPIPage.tsx` | ⏳ Mock | KPI verileri ve grafikler |
| **Documents** | `DocumentsPage.tsx` | ⏳ Mock | Doküman listesi |
| **AI Analysis** | `DocumentAnalysis.tsx` | ⏳ Mock | AI analiz sonuçları |
| **Team** | `TeamPage.tsx` | ⏳ Mock | Ekip üyeleri listesi |
| **Settings** | `Settings.tsx` | ⏳ Mock | Profil ve bildirim ayarları |
| **Help** | `HelpPage.tsx` | ⏳ Mock | Yardım içerikleri |

---

## 12. Yapılacaklar (Planned Features)

> **Not**: Aşağıdaki liste, frontend'de henüz yapılmamış veya eksik olan özellikleri içerir.

### 12.1 Yüksek Öncelik (High Priority) 🔴

| Özellik | Dosya/Bileşen | Açıklama |
|---------|---------------|----------|
| Dashboard API Entegrasyonu | `Dashboard.tsx` | Mock veriler gerçek API'ye bağlanacak |
| Proje Timeline (Gantt) | `ProjectDetail.tsx` | Gerçek sprint ve faz verisi ile entegrasyon |
| Görev Yorum Sistemi | `TaskDetail.tsx` | Comments API entegrasyonu |
| Görev Aktivite Geçmişi | `TaskDetail.tsx` | Activity timeline API |
| Doküman Yükleme | `DocumentUploadModal.tsx` | Gerçek dosya upload API |

### 12.2 Orta Öncelik (Medium Priority) 🟡

| Özellik | Dosya/Bileşen | Açıklama |
|---------|---------------|----------|
| Gamification API | `GamificationProfile.tsx` | XP, Badge, Achievement endpoints |
| Leaderboard API | `Leaderboard.tsx` | `/gamification/leaderboard` entegrasyonu |
| Sprint Yönetimi | `ProjectDetail.tsx` | Sprint CRUD işlemleri |
| KPI Dashboard API | `KPIPage.tsx` | Gerçek KPI metrikleri |
| Ekip Yönetimi API | `TeamPage.tsx` | `/users` ve `/team` endpoints |
| Takvim Etkinlik API | `CalendarPage.tsx` | `/calendar/events` entegrasyonu |
| AI Doküman Analizi | `DocumentAnalysis.tsx` | AI backend entegrasyonu |

### 12.3 Düşük Öncelik (Low Priority) 🟢

| Özellik | Dosya/Bileşen | Açıklama |
|---------|---------------|----------|
| Global Arama | `Header.tsx` | `/search` endpoint entegrasyonu |
| Profil Ayarları API | `Settings.tsx` | Avatar upload, profil güncelleme |
| Şifre Değiştirme | `Settings.tsx` | `/users/me/password` endpoint |
| Yardım Merkezi API | `HelpPage.tsx` | FAQ ve help article endpoints |
| WebSocket Entegrasyonu | Global | Real-time bildirimler |
| Mesaj Sistemi | `Header.tsx` | Chat/mesajlaşma özelliği |

### 12.4 Gelecek Özellikler (Future Features) 📋

| Özellik | Açıklama | Durum |
|---------|----------|-------|
| Proje Arşivleme | Tamamlanan projeleri arşivleme | Planlandı |
| Görev Şablonları | Tekrarlanan görevler için şablonlar | Planlandı |
| Çoklu Dil Desteği | i18n entegrasyonu | Planlandı |
| Dark/Light Mode Toggle | Tema değiştirme | Planlandı |
| Mobil Responsive | Tam mobil uyumluluk | Kısmen Mevcut |
| PDF Rapor Export | Proje ve KPI raporları PDF olarak | Planlandı |
| Slack/Teams Entegrasyonu | Bildirim entegrasyonları | Planlandı |
| 2FA (İki Faktörlü Doğrulama) | Güvenlik artırımı | Planlandı |

---

## 13. Frontend Konfigürasyonu

### 13.1 Environment Variables

```bash
# .env
VITE_API_URL=https://backend-metrika.vercel.app
```

### 13.2 Test Credentials

```
Email: admin@metrika.com
Password: 123456
```

---

> **Son Güncelleme**: Bu doküman, frontend kaynak kodunun tamamının analiz edilmesiyle oluşturulmuştur. Backend geliştiricilerin tüm gereksinimleri karşılayabilmesi için detaylı bilgi içermektedir.

---

**Hazırlayan**: Antigravity AI Assistant  
**Tarih**: 25 Aralık 2024  
**Versiyon**: 1.3

### Değişiklik Geçmişi
- **v1.3 (25 Aralık 2024)**: API Service Layer, Login Page, API Entegrasyon Durumu, Yapılacaklar bölümleri eklendi
- **v1.2 (25 Aralık 2024)**: Task-Project multi-linking, Task-Document linking, DocumentsPage, KPI custom goals eklendi
- **v1.1 (14 Aralık 2024)**: Gamification karakter sistemi, 5 yeni modal bileşeni eklendi
- **v1.0 (14 Aralık 2024)**: İlk sürüm
