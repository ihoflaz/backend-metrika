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
```

### 1.3 Uygulama Yapısı

```
src/
├── App.tsx              → Ana uygulama ve routing
├── main.tsx             → Entry point
├── types.ts             → Temel tip tanımları
├── components/
│   ├── Header.tsx       → Üst navigasyon
│   ├── Sidebar.tsx      → Yan menü
│   └── ProjectEditModal.tsx
└── pages/
    ├── Dashboard.tsx
    ├── ProjectsPage.tsx
    ├── CreateProjectWizard.tsx
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
    └── HelpPage.tsx
```

---

## 2. Sayfa Bazlı Analiz

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
- Yeni üye ekleme

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
  projectId: string;
  projectName: string;
  projectColor: string;
  assignee: {
    name: string;
    avatar: number;
  };
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
  createdAt: string;
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

#### Sol Kolon (Ana İçerik):
- Status badge
- Görev başlığı
- Atanan kişi (avatar + isim)
- Son tarih
- Tahmini süre
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
- **Etkilediği KPI'lar**: İlgili metrikler ve etki yüzdeleri
- **İlgili Dokümanlar**: PDF, Excel vb.
- Doküman ekleme butonu

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
```

---

### 2.7 AI Doküman Analizi

**Dosya**: `src/pages/DocumentAnalysis.tsx`

#### Sol Kolon:
- Doküman önizleme
- Yükleme tarihi
- Analiz durumu (Status badge)
- İndir ve paylaş butonları

#### Sağ Kolon:
- **Yönetici Özeti**: AI tarafından üretilen özet metin
- **Etiketler**: AI tarafından çıkarılan anahtar kelimeler
- **Öne Çıkan Bulgular**: Pozitif bulgular listesi
- **Tespit Edilen Riskler**: Kritik seviye göstergeli risk listesi (sayfa numarası ile)
- **Önerilen Aksiyonlar**: Her biri için "Görev Oluştur" butonu

#### Analiz Geçmişi Tablosu:
```typescript
interface AnalysisHistory {
  documentName: string;
  date: string;
  type: 'PDF' | 'DOCX' | 'XLSX';
  status: 'Tamamlandı' | 'İşleniyor' | 'Başarısız';
}
```

#### Gerekli API:
```
GET /documents?projectId=&analysisStatus=
GET /documents/:id
GET /documents/:id/analysis
POST /documents/upload
POST /documents/:id/analyze
POST /tasks (aksiyon → görev dönüşümü)
```

---

### 2.8 Oyunlaştırma Profili

**Dosya**: `src/pages/GamificationProfile.tsx`

#### Profil Header:
- Avatar + seviye badge
- Kullanıcı adı ve ünvan
- XP progress bar (currentXP → xpToNextLevel)
- Kalan XP miktarı
- Toplam XP
- Sıralama

#### Rozetler Grid:
```typescript
interface Badge {
  name: string;
  icon: string;  // lucide icon name
  color: string; // yellow, blue, purple, green...
}
```
- Kazanılan (8 adet örnek)
- Toplam rozet sayısı

#### Son Aktiviteler:
```typescript
interface GamificationActivity {
  title: string;
  xp: string;      // "+25 XP"
  time: string;    // "2 saat önce"
  icon: string;
  color: string;
}
```

#### Beceri Dağılımı:
```typescript
interface Skill {
  name: string;    // "Proje Yönetimi"
  val: number;     // 0-100
}
```

#### Liderlik Snippet (Top 5):
- Sıra, isim, XP miktarı
- Mevcut kullanıcı vurgusu

#### Gerekli API:
```
GET /gamification/profile
GET /gamification/badges
GET /gamification/recent-activities
GET /gamification/skills
GET /gamification/leaderboard?limit=5
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

#### Header:
- Ay navigasyonu (önceki/sonraki)
- Etkinlik Ekle butonu

#### Takvim Grid:
- 7 günlük header (Pazartesi - Pazar)
- Aylık görünüm (35 hücre)
- Mevcut gün vurgusu
- Hover'da "+" butonu

#### Etkinlik Tipleri:
```typescript
interface CalendarEvent {
  day: number;
  title: string;
  type: 'meeting' | 'deadline' | 'task';
  color: 'purple' | 'red' | 'blue' | 'yellow' | 'green';
}
```

#### Gerekli API:
```
GET /calendar/events?year=&month=&projectId=
POST /calendar/events
GET /calendar/events/:id
PATCH /calendar/events/:id
DELETE /calendar/events/:id
```

---

### 2.12 Ekip Listesi

**Dosya**: `src/pages/TeamPage.tsx`

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

#### Özet Kartları:
| Metrik | Veri |
|--------|------|
| Toplam Gelir (YTD) | ₺2,450,000 (+12.5% trend) |
| Proje Başarı Oranı | 94% (Hedef: 90%) |
| Ort. Tamamlanma | 14 Gün (-2 gün trend) |
| Aktif Sorunlar | 12 (+3 bu hafta) |

#### Grafikler:

**Finansal Genel Bakış (AreaChart)**:
```typescript
{ name: string, revenue: number, profit: number }[]
```

**Proje Bazlı Performans (BarChart)**:
```typescript
{ name: string, onTime: number, budget: number }[]
```

#### Gerekli API:
```
GET /kpi/dashboard
GET /kpi/revenue?period=ytd
GET /kpi/project-performance
GET /kpi/completion-stats
GET /kpi/issues
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
  avatar: string;
  role: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
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
POST   /documents/upload
GET    /documents/:id
DELETE /documents/:id
POST   /documents/:id/analyze
GET    /documents/:id/analysis
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
GET    /gamification/leaderboard
GET    /gamification/xp-history
GET    /gamification/recent-activities
GET    /gamification/skills
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

> **Son Güncelleme**: Bu doküman, frontend kaynak kodunun tamamının analiz edilmesiyle oluşturulmuştur. Backend geliştiricilerin tüm gereksinimleri karşılayabilmesi için detaylı bilgi içermektedir.

---

**Hazırlayan**: Antigravity AI Assistant  
**Tarih**: 14 Aralık 2024  
**Versiyon**: 1.0
