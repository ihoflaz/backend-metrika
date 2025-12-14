# Metrika Backend API Dokümantasyonu

**Base URL:** `https://backend-metrika.vercel.app`

**Kimlik Doğrulama:** Tüm korumalı endpoint'ler `Authorization: Bearer <token>` header'ı gerektirir.

---

## 📋 İçindekiler

1. [Kimlik Doğrulama (Auth)](#1-kimlik-doğrulama-auth)
2. [Kullanıcı (Users)](#2-kullanıcı-users)
3. [Projeler (Projects)](#3-projeler-projects)
4. [Görevler (Tasks)](#4-görevler-tasks)
5. [Oyunlaştırma (Gamification)](#5-oyunlaştırma-gamification)
6. [Dashboard](#6-dashboard)
7. [Dokümanlar (Documents)](#7-dokümanlar-documents)
8. [Bildirimler (Notifications)](#8-bildirimler-notifications)
9. [Diğer Servisler](#9-diğer-servisler)

---

## 1. Kimlik Doğrulama (Auth)

### Kullanıcı Hikayesi 🇹🇷
> *"Bir kullanıcı olarak, sisteme kayıt olabilmeli ve giriş yapabilmeliyim ki proje yönetim araçlarına erişebileyim."*

### POST `/auth/register`
Yeni kullanıcı kaydı oluşturur.

**Request Body:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "role": "Member",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST `/auth/login`
Mevcut kullanıcı girişi yapar.

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "_id": "...",
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "role": "Member",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Kullanıcı (Users)

### Kullanıcı Hikayesi 🇹🇷
> *"Bir kullanıcı olarak, kendi profilimi görüntüleyebilmeli ve güncelleyebilmeliyim."*

### GET `/users/me` 🔒
Giriş yapmış kullanıcının profil bilgilerini döner.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "_id": "...",
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "role": "Member",
  "department": "Engineering",
  "xp": 1500,
  "level": 2,
  "badges": [{"name": "Takım Lideri", "icon": "Users", "color": "Blue"}],
  "skills": [{"name": "React", "level": 85}]
}
```

---

### PATCH `/users/me` 🔒
Kullanıcı profilini günceller.

**Request Body:**
```json
{
  "name": "Ahmet Y.",
  "department": "Product"
}
```

---

## 3. Projeler (Projects)

### Kullanıcı Hikayesi 🇹🇷
> *"Bir proje yöneticisi olarak, yeni projeler oluşturabilmeli, mevcut projeleri düzenleyebilmeli ve takım üyelerimi atayabilmeliyim."*

### GET `/projects` 🔒
Tüm projeleri listeler.

**Query Params:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `page` | number | Sayfa numarası (varsayılan: 1) |
| `limit` | number | Sayfa başına kayıt (varsayılan: 10) |
| `status` | string | Filtre: Active, Completed, On Hold, At Risk |
| `search` | string | Başlıkta arama |

**Response (200):**
```json
{
  "projects": [...],
  "page": 1,
  "pages": 3,
  "total": 25
}
```

---

### POST `/projects` 🔒
Yeni proje oluşturur.

**Request Body:**
```json
{
  "title": "Metrika Dashboard 2025",
  "description": "Yeni nesil proje yönetim paneli",
  "methodology": "Scrum",
  "startDate": "2025-01-01",
  "endDate": "2025-06-30",
  "budget": 150000,
  "color": "blue"
}
```

---

### GET `/projects/:id` 🔒
Belirli bir projenin detaylarını getirir.

---

### PATCH `/projects/:id` 🔒
Projeyi günceller.

---

### DELETE `/projects/:id` 🔒
Projeyi siler.

---

### GET `/projects/stats` 🔒
Proje istatistiklerini döner.

**Response:**
```json
{
  "total": 12,
  "active": 8,
  "completed": 3,
  "onHold": 1
}
```

---

### PATCH `/projects/:id/tasks/reorder` 🔒
Kanban board'da görev sıralamasını günceller (Drag & Drop).

**Kullanıcı Hikayesi 🇹🇷:**
> *"Bir kullanıcı olarak, görevleri sürükle-bırak ile başka sütunlara taşıyabilmeliyim ve bu değişiklik kalıcı olmalı."*

**Request Body:**
```json
{
  "items": [
    {"id": "task_id_1", "order": 0, "status": "In Progress"},
    {"id": "task_id_2", "order": 1, "status": "In Progress"}
  ]
}
```

---

## 4. Görevler (Tasks)

### Kullanıcı Hikayesi 🇹🇷
> *"Bir ekip üyesi olarak, bana atanan görevleri görebilmeli, durumlarını güncelleyebilmeli ve yeni görevler oluşturabilmeliyim."*

### GET `/tasks` 🔒
Tüm görevleri listeler.

**Query Params:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `projectId` | string | Projeye göre filtrele |
| `status` | string | Todo, In Progress, Review, Done |
| `priority` | string | Low, Medium, High, Urgent |
| `search` | string | Başlıkta arama |

---

### POST `/tasks` 🔒
Yeni görev oluşturur.

**Request Body:**
```json
{
  "title": "API Entegrasyonu",
  "description": "Backend API'lerini frontend'e bağla",
  "status": "Todo",
  "priority": "High",
  "projectId": "...",
  "assigneeId": "...",
  "dueDate": "2025-01-15",
  "estimatedHours": 8,
  "tags": ["Backend", "API"]
}
```

---

### GET `/tasks/:id` 🔒
Görev detaylarını getirir.

---

### PATCH `/tasks/:id` 🔒
Görevi günceller.

---

### GET `/tasks/stats/by-status` 🔒
Görev istatistiklerini döner.

**Response:**
```json
{
  "total": 150,
  "todo": 45,
  "inProgress": 30,
  "done": 75
}
```

---

## 5. Oyunlaştırma (Gamification)

### Kullanıcı Hikayesi 🇹🇷
> *"Bir kullanıcı olarak, XP puanımı, seviyemi, rozetlerimi ve liderlik tablosundaki pozisyonumu görebilmeliyim ki motivasyonum artsın."*

### GET `/gamification/profile` 🔒
Kullanıcının oyunlaştırma profilini döner.

**Response:**
```json
{
  "xp": 2500,
  "level": 3,
  "nextLevelXp": 3000,
  "badges": [
    {"name": "Proje Ustası", "icon": "Trophy", "color": "Yellow"}
  ],
  "recentActivities": [...]
}
```

---

### GET `/gamification/leaderboard` 🔒
Liderlik tablosunu döner.

**Response:**
```json
[
  {"rank": 1, "name": "Hulusi", "xp": 2500, "avatar": 1},
  {"rank": 2, "name": "Ayşe Demir", "xp": 2100, "avatar": 5}
]
```

---

### GET `/gamification/badges` 🔒
Tüm mevcut rozetleri listeler.

---

## 6. Dashboard

### Kullanıcı Hikayesi 🇹🇷
> *"Bir yönetici olarak, tüm projelerin ve görevlerin genel durumunu tek bir ekranda görebilmeliyim."*

### GET `/dashboard/stats` 🔒
Genel istatistikleri döner.

**Response:**
```json
{
  "totalProjects": 12,
  "activeTasks": 45,
  "completedTasks": 120,
  "activeProjects": 8
}
```

---

### GET `/dashboard/active-projects` 🔒
Aktif projelerin kısa listesini döner.

---

### GET `/dashboard/upcoming-tasks` 🔒
Yaklaşan görevleri döner.

---

## 7. Dokümanlar (Documents)

### Kullanıcı Hikayesi 🇹🇷
> *"Bir kullanıcı olarak, projelere dosya yükleyebilmeli ve bu dosyaları listeleyebilmeliyim."*

### GET `/documents` 🔒
Tüm dokümanları listeler.

**Query Params:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `projectId` | string | Projeye göre filtrele |

---

### POST `/documents/upload` 🔒
Dosya yükler (Cloudinary'ye).

**Request:** `multipart/form-data`
| Field | Tip | Açıklama |
|-------|-----|----------|
| `file` | File | Yüklenecek dosya |
| `projectId` | string | İlişkili proje ID |

**Response:**
```json
{
  "_id": "...",
  "name": "rapor.pdf",
  "path": "https://res.cloudinary.com/...",
  "type": "PDF",
  "size": "2.4 MB"
}
```

---

### POST `/documents/:id/analyze` 🔒
Dokümanı AI ile analiz eder (Mock).

---

## 8. Bildirimler (Notifications)

### Kullanıcı Hikayesi 🇹🇷
> *"Bir kullanıcı olarak, bana gelen bildirimleri görebilmeli, okundu olarak işaretleyebilmeli ve okunmamış bildirim sayısını anlık görebilmeliyim."*

### GET `/notifications` 🔒
Kullanıcının bildirimlerini listeler.

**Query Params:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `type` | string | Bildirim tipi filtresi |
| `isRead` | boolean | Okunma durumu filtresi |

---

### GET `/notifications/unread-count` 🔒
Okunmamış bildirim sayısını döner.

**Response:**
```json
{ "count": 5 }
```

---

### PATCH `/notifications/:id/read` 🔒
Belirli bir bildirimi okundu olarak işaretler.

---

### PATCH `/notifications/read-all` 🔒
Tüm bildirimleri okundu olarak işaretler.

---

## 9. Diğer Servisler

### Kullanıcı Hikayesi 🇹🇷
> *"Bir kullanıcı olarak, arama yapabilmeli, ekip üyelerini görebilmeli ve KPI verilerine erişebilmeliyim."*

### GET `/search` 🔒
Global arama yapar.

**Query Params:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `q` | string | Arama terimi |

---

### GET `/team/departments` 🔒
Departman listesini döner.

---

### GET `/team/members` 🔒
Ekip üyelerini listeler.

---

### GET `/kpi/dashboard` 🔒
KPI verilerini döner.

---

### GET `/calendar/events` 🔒
Takvim etkinliklerini döner.

---

### GET `/help/articles` 🔒
Yardım makalelerini listeler.

---

### GET `/messages/unread-count` 🔒
Okunmamış mesaj sayısını döner.

---

## 🔐 Hata Kodları

| Kod | Anlam |
|-----|-------|
| 200 | Başarılı |
| 201 | Oluşturuldu |
| 400 | Geçersiz İstek |
| 401 | Yetkisiz (Token gerekli) |
| 403 | Yasaklı (Yetki yok) |
| 404 | Bulunamadı |
| 500 | Sunucu Hatası |

---

## 🧪 Test Kullanıcısı

Demo verileriyle test için:
- **Email:** `admin@metrika.com`
- **Password:** `123456`

---

## 📝 Notlar

1. Tüm tarihler ISO 8601 formatındadır.
2. Dosya yükleme Cloudinary üzerinden yapılır.
3. WebSocket desteği gelecek sürümde eklenecektir.
4. KPI, Search, Help, Calendar endpoint'leri şu an mock veri döndürmektedir.

---

*Son Güncelleme: 14 Aralık 2025*
