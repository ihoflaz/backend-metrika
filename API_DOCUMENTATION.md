# Metrika API Documentation

## Base URL
```
Production: https://backend-metrika.vercel.app
Development: http://localhost:5000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Test Credentials
```
Email: admin@metrika.com
Password: 123456
```

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Projects](#3-projects)
4. [Tasks](#4-tasks)
5. [Sprints](#5-sprints)
6. [Documents](#6-documents)
7. [Analyses](#7-analyses)
8. [Gamification](#8-gamification)
9. [Dashboard](#9-dashboard)
10. [Calendar](#10-calendar)
11. [Team](#11-team)
12. [KPI](#12-kpi)
13. [Notifications](#13-notifications)
14. [Settings](#14-settings)
15. [Help](#15-help)
16. [Search](#16-search)

---

## 1. Authentication

### POST /auth/register
Yeni kullanıcı kaydı.

**Request Body:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Response:** `201 Created`
```json
{
  "_id": "...",
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "token": "eyJhbGciOiJ..."
}
```

---

### POST /auth/login
Kullanıcı girişi.

**Request Body:**
```json
{
  "email": "admin@metrika.com",
  "password": "123456"
}
```

**Response:** `200 OK`
```json
{
  "_id": "...",
  "name": "Hulusi",
  "email": "admin@metrika.com",
  "role": "Admin",
  "level": 3,
  "xp": 2500,
  "token": "eyJhbGciOiJ..."
}
```

---

## 2. Users

### GET /users/me
Oturumdaki kullanıcının profilini getirir.

### PATCH /users/me
Kullanıcı profilini güncelle.

### GET /users/:id
Belirli kullanıcının profilini getirir.

### GET /users/:id/stats
Kullanıcı istatistiklerini getirir.

### GET /users/:id/tasks
Kullanıcının görevlerini getirir.

### GET /users/:id/projects
Kullanıcının projelerini getirir.

### GET /users/:id/badges
Kullanıcının rozetlerini getirir.

### GET /users/:id/skills
Kullanıcının becerilerini getirir.

### GET /users/:id/activity
Kullanıcının son aktivitelerini getirir.

### POST /users/:id/praise
Bir kullanıcıyı takdir et.

### POST /users/:id/assign-task
Kullanıcıya hızlı görev ata.

---

## 3. Projects

### GET /projects
Projeleri listele.

**Query Parameters:**
- `search` - Proje adında arama
- `status` - `Active`, `Completed`, `On Hold`, `At Risk`
- `methodology` - `Scrum`, `Waterfall`, `Hybrid`
- `page`, `limit` - Sayfalama

### POST /projects
Yeni proje oluştur.

### GET /projects/:id
Proje detaylarını getir.

### PATCH /projects/:id
Projeyi güncelle.

### DELETE /projects/:id
Projeyi sil.

### GET /projects/stats
Proje istatistiklerini getir.

### GET /projects/:id/timeline
Proje zaman çizelgesini getir.

### GET /projects/:id/burndown
Sprint burndown chart verisi.

### GET /projects/:id/tasks
Projenin görevlerini getir.

### GET /projects/:id/members
Proje ekip üyelerini getir.

### POST /projects/:id/members
Projeye üye ekle.

### PATCH /projects/:id/members/:userId
Üye rolünü güncelle.

### DELETE /projects/:id/members/:userId
Üyeyi projeden çıkar.

### GET /projects/:id/documents
Proje dokümanlarını getir.

### GET /projects/:id/kpis
Proje KPI'larını getir.

### POST /projects/:id/kpis
Projeye KPI ekle.

### GET /projects/:id/sprints
Proje sprintlerini getir.

### POST /projects/:id/sprints
Yeni sprint oluştur.

### GET /projects/:id/current-sprint
Aktif sprinti getir.

---

## 4. Tasks

### GET /tasks
Görevleri listele.

**Query Parameters:**
- `search` - Görev başlığında arama
- `status` - `Todo`, `In Progress`, `Review`, `Done`, `Blocked`
- `priority` - `Low`, `Medium`, `High`, `Urgent`
- `projectId` - Projeye göre filtrele
- `dueDate_start`, `dueDate_end` - Tarih aralığı

### POST /tasks
Yeni görev oluştur.

### GET /tasks/:id
Görev detaylarını getir.

### PATCH /tasks/:id
Görevi güncelle.

### DELETE /tasks/:id
Görevi sil.

### PATCH /tasks/:id/status
Görev durumunu güncelle.

### GET /tasks/:id/comments
Görev yorumlarını getir.

### POST /tasks/:id/comments
Yorum ekle.

### GET /tasks/:id/activity
Görev aktivite geçmişini getir.

### GET /tasks/:id/time-logs
Görev zaman kayıtlarını getir.

### POST /tasks/:id/time-logs
Zaman kaydı ekle.

### GET /tasks/:id/kpi-impact
Görevin KPI etkisini getir.

### GET /tasks/:id/ai-suggestions
Görev için AI önerilerini getir.

### POST /tasks/:id/attachments
Görev ekini yükle.

### POST /tasks/bulk
Toplu görev oluştur.

### GET /tasks/stats/by-status
Durum bazlı görev istatistikleri.

---

### Multi-Project & Document Linking (Yeni)

### GET /tasks/:id/projects
Göreve bağlı tüm projeleri getir.

**Response:**
```json
[
  { "_id": "...", "title": "Proje A", "color": "blue", "progress": 75 },
  { "_id": "...", "title": "Proje B", "color": "green", "progress": 50 }
]
```

### POST /tasks/:id/projects/:projectId
Görevi ek bir projeye bağla.

**Response:** `200 OK`
```json
{
  "message": "Task linked to project",
  "linkedProjects": [...]
}
```

### DELETE /tasks/:id/projects/:projectId
Görevi projeden çıkar (ana proje hariç).

### GET /tasks/:id/documents
Göreve bağlı dokümanları getir.

### POST /tasks/:id/documents/:documentId
Göreve doküman bağla.

**Response:**
```json
{
  "message": "Document linked to task",
  "linkedDocuments": [...]
}
```

### DELETE /tasks/:id/documents/:documentId
Görevden doküman bağlantısını kaldır.

---

## 5. Sprints

### GET /sprints/:id
Sprint detaylarını getir.

### PATCH /sprints/:id
Sprint'i güncelle.

### PATCH /sprints/:id/start
Sprint'i başlat.

### PATCH /sprints/:id/complete
Sprint'i tamamla.

---

## 6. Documents

### GET /documents
Dokümanları listele.

**Query Parameters:**
- `projectId` - Projeye göre filtrele
- `type` - `PDF`, `DOCX`, `XLSX`, `PPTX`, `TXT`
- `analysisStatus` - `pending`, `analyzing`, `completed`
- `sortBy`, `sortOrder` - Sıralama

### GET /documents/stats
Doküman istatistiklerini getir.

**Response:**
```json
{
  "total": 25,
  "analyzed": 18,
  "pending": 7,
  "byType": {
    "pdf": 15,
    "docx": 5,
    "xlsx": 3,
    "pptx": 1,
    "txt": 1,
    "other": 0
  }
}
```

### POST /documents/upload
Doküman yükle (multipart/form-data).

### GET /documents/:id
Doküman detaylarını getir.

### PATCH /documents/:id
Dokümanı güncelle.

### DELETE /documents/:id
Dokümanı sil.

### POST /documents/:id/analyze
AI analizi başlat.

### GET /documents/:id/analysis
Doküman analizini getir.

---

## 7. Analyses

### GET /analyses
Tüm analizleri listele.

### GET /analyses/:id
Analiz detaylarını getir.

### PATCH /analyses/:id/save
Analizi kaydet.

### POST /analyses/:id/share
Analizi paylaş.

### POST /analyses/:id/generate-link
Paylaşım linki oluştur.

### PATCH /analyses/:id/actions/:actionId/mark-as-task
Aksiyonu görev olarak işaretle.

---

## 8. Gamification

### GET /gamification/profile
Kullanıcının oyunlaştırma profilini getir.

### GET /gamification/leaderboard
Liderlik tablosunu getir.

**Query Parameters:**
- `period` - `all-time`, `weekly`, `monthly`
- `limit`, `page` - Sayfalama

### GET /gamification/badges
Tüm rozetleri getir.

### GET /gamification/achievements
Tüm başarımları ilerleme ile getir.

### GET /gamification/achievements/:id
Tek başarım detayı.

### POST /gamification/achievements/:id/unlock
Başarım aç.

### GET /gamification/streak
Seri bilgisini getir.

### GET /gamification/recent-activities
Son XP aktivitelerini getir.

### GET /gamification/skills
Beceri dağılımını getir.

---

## 9. Dashboard

### GET /dashboard/stats
Dashboard özet istatistikleri.

### GET /dashboard/active-projects
Aktif projeleri getir.

### GET /dashboard/upcoming-tasks
Yaklaşan görevleri getir.

### GET /dashboard/ai-suggestions
AI önerilerini getir.

### GET /dashboard/kpi-summary
KPI özeti.

### GET /dashboard/risk-alerts
Risk uyarıları.

---

## 10. Calendar

### GET /calendar/events
Takvim etkinliklerini getir.

**Query Parameters:**
- `year`, `month` - Tarih filtresi
- `projectId` - Projeye göre filtrele

### POST /calendar/events
Etkinlik oluştur.

### GET /calendar/events/:id
Etkinlik detayı.

### PATCH /calendar/events/:id
Etkinliği güncelle.

### DELETE /calendar/events/:id
Etkinliği sil.

### PATCH /calendar/events/:id/respond
Etkinliğe yanıt ver.

---

## 11. Team

### GET /team/members
Ekip üyelerini listele.

**Query Parameters:**
- `department` - Departmana göre filtrele
- `search` - İsim veya pozisyon ara
- `status` - `online`, `busy`, `offline`, `away`

### GET /team/departments
Departmanları listele.

### POST /team/members
Yeni ekip üyesi davet et.

---

## 12. KPI

### GET /kpi/dashboard
KPI dashboard verisi.

**Query Parameters:**
- `projectId` - Projeye göre filtrele

**Response:**
```json
{
  "revenue": { "total": 2450000, "used": 1800000, "trend": 12.5, "currency": "₺" },
  "projectSuccessRate": 94,
  "avgCompletionTime": 14,
  "activeIssues": 12,
  "taskCompletionRate": 72,
  "totalProjects": 12,
  "completedProjects": 5,
  "riskProjects": 2,
  "avgProgress": 65
}
```

### GET /kpi/revenue
Gelir verileri (grafik için).

**Query Parameters:**
- `period` - `ytd`, `month`, `quarter`
- `projectId` - Projeye göre filtrele

### GET /kpi/project-performance
Proje bazlı performans karşılaştırma.

### GET /kpi/completion-stats
Tamamlanma istatistikleri.

### GET /kpi/issues
Aktif sorunlar.

### GET /kpi/team-performance
Ekip performans sıralaması.

**Query Parameters:**
- `projectId` - Projeye göre filtrele
- `period` - Dönem filtresi

**Response:**
```json
[
  {
    "userId": "...",
    "name": "Ahmet Yılmaz",
    "role": "Developer",
    "avatar": 5,
    "completedTasks": 25,
    "totalTasks": 30,
    "totalHours": 120,
    "efficiency": 83,
    "score": 2500
  }
]
```

---

### KPI Goals (Yeni - Özel Hedef Yönetimi)

### GET /kpi/goals
KPI hedeflerini listele.

**Query Parameters:**
- `projectId` - Projeye göre filtrele
- `category` - `revenue`, `project`, `team`, `quality`
- `status` - `on-track`, `at-risk`, `behind`, `completed`

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Aylık Gelir Hedefi",
    "target": 500000,
    "current": 425000,
    "unit": "₺",
    "category": "revenue",
    "status": "on-track",
    "progress": 85,
    "isCustom": false
  }
]
```

### POST /kpi/goals
Yeni KPI hedefi oluştur.

**Request Body:**
```json
{
  "name": "Sprint Velocity Hedefi",
  "description": "Q1 için sprint hızı hedefi",
  "target": 50,
  "current": 35,
  "unit": "points",
  "category": "project",
  "deadline": "2025-03-31",
  "status": "on-track",
  "projectId": "..." 
}
```

### PATCH /kpi/goals/:id
KPI hedefini güncelle.

### DELETE /kpi/goals/:id
KPI hedefini sil (sadece özel hedefler).

### GET /kpis/:id
Tek KPI detayı.

### POST /kpis/:id/record
KPI değeri kaydet.

### GET /kpis/:id/history
KPI geçmişi.

---

## 13. Notifications

### GET /notifications
Bildirimleri listele.

**Query Parameters:**
- `isRead` - `true` | `false`
- `type` - `info`, `success`, `warning`, `error`, `meeting`, `deadline`, `mention`, `ai`, `badge`, `xp`
- `page`, `limit` - Sayfalama

### GET /notifications/unread-count
Okunmamış bildirim sayısı.

### PATCH /notifications/:id/read
Bildirimi okundu işaretle.

### PATCH /notifications/read-all
Tümünü okundu işaretle.

### DELETE /notifications/:id
Bildirimi sil.

### POST /notifications/:id/dismiss
Bildirimi kapat.

---

## 14. Settings

### GET /settings/notifications
Bildirim ayarlarını getir.

### PATCH /settings/notifications
Bildirim ayarlarını güncelle.

---

## 15. Help

### GET /help/search
Yardım makalelerinde ara.

**Query Parameters:**
- `q` - Arama terimi

### GET /help/articles
Kategoriye göre makaleler.

**Query Parameters:**
- `category` - `getting-started`, `projects`, `tasks`, `gamification`, `team`, `settings`, `faq`

### GET /help/faq
Sık sorulan soruları getir.

### POST /help/support-ticket
Destek talebi oluştur.

---

## 16. Search

### GET /search
Global arama.

**Query Parameters:**
- `q` - Arama terimi

**Response:**
```json
{
  "projects": [...],
  "tasks": [...],
  "documents": [...],
  "users": [...]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Geçersiz istek |
| 401 | Unauthorized - Kimlik doğrulama gerekli |
| 403 | Forbidden - Yetkisiz erişim |
| 404 | Not Found - Kaynak bulunamadı |
| 500 | Server Error - Sunucu hatası |

---

## WebSocket Events

| Event | Description | Payload |
|-------|-------------|---------|
| `notification` | Yeni bildirim | `{id, type, title, message}` |
| `task:updated` | Görev güncellendi | `{taskId, changes, updatedBy}` |
| `task:created` | Yeni görev | `{task}` |
| `project:updated` | Proje güncellendi | `{projectId, changes}` |
| `comment:added` | Yeni yorum | `{taskId, comment}` |
| `user:status` | Kullanıcı durumu | `{userId, status}` |
| `xp:earned` | XP kazanıldı | `{amount, reason, newTotal}` |
| `level:up` | Seviye atlandı | `{newLevel, message}` |
| `badge:earned` | Rozet kazanıldı | `{badge}` |

---

**Last Updated:** December 25, 2024  
**Version:** 2.1

### Değişiklik Geçmişi
- **v2.1 (25 Aralık 2024):** Task multi-project linking, task-document linking, KPI Goals CRUD, team performance, document stats eklendi
- **v2.0 (15 Aralık 2024):** Tüm yeni endpoint'ler eklendi
- **v1.0 (29 Kasım 2024):** İlk sürüm
