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

**User Story (TR):** *Kullanıcı olarak, sisteme kayıt olarak hesap oluşturabilmeliyim.*

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

**User Story (TR):** *Kullanıcı olarak, e-posta ve şifremle giriş yapabilmeliyim.*

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

**User Story (TR):** *Kullanıcı olarak, kendi profil bilgilerimi görüntüleyebilmeliyim.*

**Response:** `200 OK`
```json
{
  "_id": "...",
  "name": "Hulusi",
  "email": "admin@metrika.com",
  "role": "Admin",
  "department": "Engineering",
  "location": "Istanbul",
  "avatar": 1,
  "level": 3,
  "xp": 2500,
  "badges": [...],
  "skills": [...],
  "currentStreak": 12,
  "longestStreak": 25
}
```

---

### PATCH /users/me
Kullanıcı profilini güncelle.

**Request Body:**
```json
{
  "name": "Yeni İsim",
  "bio": "Yeni biyografi",
  "phone": "+90 555 123 4567"
}
```

---

### GET /users/:id
Belirli kullanıcının profilini getirir.

**User Story (TR):** *Kullanıcı olarak, ekip üyelerinin profillerini inceleyebilmeliyim.*

---

### GET /users/:id/stats
Kullanıcı istatistiklerini getirir.

**Response:**
```json
{
  "completedTasks": 45,
  "activeTasks": 8,
  "activeProjects": 3,
  "totalProjects": 7,
  "avgTaskTime": "3.5 gün",
  "onTimeRate": 92
}
```

---

### GET /users/:id/tasks
Kullanıcının görevlerini getirir.

**Query Parameters:**
- `status` - `active` | `Todo` | `In Progress` | `Done`

---

### GET /users/:id/projects
Kullanıcının projelerini getirir.

---

### GET /users/:id/badges
Kullanıcının rozetlerini getirir.

---

### GET /users/:id/skills
Kullanıcının becerilerini getirir.

---

### GET /users/:id/activity
Kullanıcının son aktivitelerini getirir.

---

### POST /users/:id/praise
Bir kullanıcıyı takdir et (XP kazandırır).

**User Story (TR):** *Kullanıcı olarak, başarılı ekip arkadaşlarımı takdir edebilmeliyim.*

**Request Body:**
```json
{
  "message": "Harika iş çıkardın!"
}
```

---

### POST /users/:id/assign-task
Kullanıcıya hızlı görev ata.

**Request Body:**
```json
{
  "title": "Yeni Görev",
  "projectId": "...",
  "priority": "High",
  "dueDate": "2024-12-31"
}
```

---

## 3. Projects

### GET /projects
Projeleri listele.

**User Story (TR):** *Proje yöneticisi olarak, tüm projeleri filtreleyerek görüntüleyebilmeliyim.*

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Proje adında arama |
| status | string | `Active`, `Completed`, `On Hold`, `At Risk` |
| methodology | string | `Scrum`, `Waterfall`, `Hybrid` |
| page | number | Sayfa numarası (default: 1) |
| limit | number | Sayfa başına öğe (default: 10) |

**Response:**
```json
{
  "projects": [...],
  "page": 1,
  "pages": 2,
  "total": 12
}
```

---

### POST /projects
Yeni proje oluştur.

**Request Body:**
```json
{
  "title": "Metrika Dashboard 2024",
  "description": "Yeni dashboard projesi",
  "methodology": "Scrum",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "budget": 150000,
  "color": "blue",
  "teamMemberIds": ["userId1", "userId2"],
  "kpis": [
    { "name": "Sprint Velocity", "target": 40, "unit": "points" }
  ]
}
```

---

### GET /projects/:id
Proje detaylarını getir.

---

### PATCH /projects/:id
Projeyi güncelle.

---

### DELETE /projects/:id
Projeyi sil.

---

### GET /projects/:id/stats
Proje istatistiklerini getir.

---

### GET /projects/:id/timeline
Proje zaman çizelgesini getir.

**User Story (TR):** *Proje yöneticisi olarak, proje fazlarını timeline üzerinde görebilmeliyim.*

**Response:**
```json
{
  "projectId": "...",
  "startDate": "...",
  "endDate": "...",
  "phases": [
    { "name": "Faz 1 - Planlama", "status": "completed", "progress": 100 },
    { "name": "Faz 2 - Geliştirme", "status": "in-progress", "progress": 60 }
  ]
}
```

---

### GET /projects/:id/burndown
Sprint burndown chart verisi.

---

### GET /projects/:id/tasks
Projenin görevlerini getir.

**Query Parameters:**
- `grouped=status` - Durumlara göre grupla (Kanban için)

---

### GET /projects/:id/members
Proje ekip üyelerini getir.

---

### POST /projects/:id/members
Projeye üye ekle.

**Request Body:**
```json
{
  "userId": "..."
}
```

---

### PATCH /projects/:id/members/:userId
Üye rolünü güncelle.

---

### DELETE /projects/:id/members/:userId
Üyeyi projeden çıkar.

---

### GET /projects/:id/documents
Proje dokümanlarını getir.

---

### GET /projects/:id/kpis
Proje KPI'larını getir.

---

### POST /projects/:id/kpis
Projeye KPI ekle.

---

### GET /projects/:id/sprints
Proje sprintlerini getir.

---

### POST /projects/:id/sprints
Yeni sprint oluştur.

---

### GET /projects/:id/current-sprint
Aktif sprinti getir.

---

## 4. Tasks

### GET /tasks
Görevleri listele.

**User Story (TR):** *Kullanıcı olarak, görevlerimi filtreleyerek listeleyebilmeliyim.*

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Görev başlığında arama |
| status | string | `Todo`, `In Progress`, `Review`, `Done` |
| priority | string | `Low`, `Medium`, `High`, `Urgent` |
| projectId | string | Projeye göre filtrele |
| dueDate_start | date | Başlangıç tarihi |
| dueDate_end | date | Bitiş tarihi |
| page | number | Sayfa numarası |
| limit | number | Sayfa başına öğe |

---

### POST /tasks
Yeni görev oluştur.

**Request Body:**
```json
{
  "title": "API Endpoint Geliştir",
  "description": "Yeni authentication endpoint'leri",
  "status": "Todo",
  "priority": "High",
  "projectId": "...",
  "assigneeId": "...",
  "dueDate": "2024-12-31",
  "estimatedHours": 8,
  "tags": ["Backend", "Auth"]
}
```

---

### GET /tasks/:id
Görev detaylarını getir.

---

### PATCH /tasks/:id
Görevi güncelle.

---

### DELETE /tasks/:id
Görevi sil.

---

### PATCH /tasks/:id/status
Görev durumunu güncelle.

**Request Body:**
```json
{
  "status": "Done"
}
```

---

### GET /tasks/:id/comments
Görev yorumlarını getir.

**User Story (TR):** *Kullanıcı olarak, görev üzerindeki tartışmaları takip edebilmeliyim.*

---

### POST /tasks/:id/comments
Yorum ekle.

**Request Body:**
```json
{
  "content": "Bu konuda yardıma ihtiyacım var."
}
```

---

### GET /tasks/:id/activity
Görev aktivite geçmişini getir.

---

### GET /tasks/:id/time-logs
Görev zaman kayıtlarını getir.

---

### POST /tasks/:id/time-logs
Zaman kaydı ekle.

**Request Body:**
```json
{
  "hours": 2.5,
  "description": "API geliştirme"
}
```

---

### GET /tasks/:id/kpi-impact
Görevin KPI etkisini getir.

---

### GET /tasks/:id/ai-suggestions
Görev için AI önerilerini getir.

**User Story (TR):** *Kullanıcı olarak, AI'dan görevim için öneriler alabilmeliyim.*

---

### POST /tasks/:id/attachments
Görev ekini yükle (multipart/form-data).

---

### POST /tasks/bulk
Toplu görev oluştur.

**Request Body:**
```json
{
  "projectId": "...",
  "assigneeId": "...",
  "tasks": [
    { "title": "Görev 1", "priority": "High" },
    { "title": "Görev 2", "priority": "Medium" }
  ]
}
```

---

### GET /tasks/stats/by-status
Durum bazlı görev istatistikleri.

**Response:**
```json
{
  "total": 156,
  "todo": 42,
  "inProgress": 35,
  "review": 23,
  "done": 56
}
```

---

## 5. Sprints

### GET /sprints/:id
Sprint detaylarını getir.

---

### PATCH /sprints/:id
Sprint'i güncelle.

---

### PATCH /sprints/:id/start
Sprint'i başlat.

**User Story (TR):** *Scrum Master olarak, hazırlanan sprint'i başlatabilmeliyim.*

---

### PATCH /sprints/:id/complete
Sprint'i tamamla.

---

## 6. Documents

### GET /documents
Dokümanları listele.

**Query Parameters:**
- `projectId` - Projeye göre filtrele
- `analysisStatus` - `pending`, `analyzing`, `completed`

---

### POST /documents/upload
Doküman yükle (multipart/form-data).

**User Story (TR):** *Kullanıcı olarak, projelere doküman yükleyebilmeliyim.*

**Form Fields:**
- `file` - Dosya
- `projectId` - Proje ID

---

### GET /documents/:id
Doküman detaylarını getir.

---

### PATCH /documents/:id
Dokümanı güncelle.

---

### DELETE /documents/:id
Dokümanı sil.

---

### POST /documents/:id/analyze
AI analizi başlat.

**User Story (TR):** *Kullanıcı olarak, yüklediğim dokümanları AI ile analiz ettirebilmeliyim.*

**Response:**
```json
{
  "message": "Analysis started",
  "analysisId": "...",
  "status": "analyzing"
}
```

---

### GET /documents/:id/analysis
Doküman analizini getir.

---

## 7. Analyses

### GET /analyses
Tüm analizleri listele.

---

### GET /analyses/:id
Analiz detaylarını getir.

**Response:**
```json
{
  "_id": "...",
  "document": {...},
  "status": "completed",
  "summary": "Bu doküman...",
  "findings": [
    { "type": "positive", "content": "...", "page": 3 }
  ],
  "risks": [
    { "severity": "high", "content": "...", "page": 12 }
  ],
  "suggestedActions": [
    { "title": "Güvenlik denetimi", "priority": "high", "canCreateTask": true }
  ],
  "tags": ["teknik", "spesifikasyon"],
  "confidence": 87
}
```

---

### PATCH /analyses/:id/save
Analizi kaydet.

---

### POST /analyses/:id/share
Analizi paylaş.

**Request Body:**
```json
{
  "userIds": ["userId1", "userId2"]
}
```

---

### POST /analyses/:id/generate-link
Paylaşım linki oluştur.

**Response:**
```json
{
  "link": "https://metrika.vercel.app/shared-analysis/abc123..."
}
```

---

### PATCH /analyses/:id/actions/:actionId/mark-as-task
Aksiyonu görev olarak işaretle.

**User Story (TR):** *Kullanıcı olarak, AI önerilerini tek tıkla göreve dönüştürebilmeliyim.*

**Request Body:**
```json
{
  "projectId": "...",
  "assigneeId": "...",
  "priority": "High"
}
```

---

## 8. Gamification

### GET /gamification/profile
Kullanıcının oyunlaştırma profilini getir.

**User Story (TR):** *Kullanıcı olarak, seviye, XP ve rozetlerimi görebilmeliyim.*

**Response:**
```json
{
  "level": 3,
  "xp": 2500,
  "xpToNextLevel": 3000,
  "rank": 5,
  "badges": [...],
  "skills": [...],
  "currentStreak": 12,
  "longestStreak": 25,
  "recentActivity": [...]
}
```

---

### GET /gamification/leaderboard
Liderlik tablosunu getir.

**Query Parameters:**
- `period` - `all-time`, `weekly`, `monthly`
- `limit` - Sonuç sayısı (default: 10)
- `page` - Sayfa numarası

**Response:**
```json
{
  "users": [
    { "name": "Hulusi", "xp": 2500, "level": 3, "rank": 1, "avatar": 1 }
  ],
  "page": 1,
  "pages": 2,
  "total": 15
}
```

---

### GET /gamification/badges
Tüm rozetleri getir (kazanılma durumu ile).

---

### GET /gamification/achievements
Tüm başarımları ilerleme ile getir.

**User Story (TR):** *Kullanıcı olarak, başarım hedeflerimi ve ilerlememi görebilmeliyim.*

**Response:**
```json
[
  {
    "key": "first_task",
    "name": "İlk Adım",
    "description": "İlk görevini tamamla",
    "icon": "CheckCircle",
    "xp": 50,
    "requirement": 1,
    "current": 1,
    "progress": 100,
    "unlocked": true
  },
  {
    "key": "task_master",
    "name": "Görev Ustası",
    "description": "50 görev tamamla",
    "requirement": 50,
    "current": 23,
    "progress": 46,
    "unlocked": false
  }
]
```

---

### GET /gamification/achievements/:id
Tek başarım detayı.

---

### POST /gamification/achievements/:id/unlock
Başarım aç (şartlar sağlandığında).

---

### GET /gamification/streak
Seri (streak) bilgisini getir.

**Response:**
```json
{
  "currentStreak": 12,
  "longestStreak": 25,
  "lastActiveDate": "2024-12-14",
  "weeklyActivity": [1, 2, 3, 4, 5]
}
```

---

### GET /gamification/recent-activities
Son XP aktivitelerini getir.

---

### GET /gamification/skills
Beceri dağılımını getir.

---

## 9. Dashboard

### GET /dashboard/stats
Dashboard özet istatistikleri.

**Response:**
```json
{
  "projects": { "count": 12, "trend": "+2%" },
  "activeProjects": { "count": 8 },
  "activeTasks": { "count": 45, "trend": "+5%" },
  "completedTasksThisMonth": 23
}
```

---

### GET /dashboard/active-projects
Aktif projeleri getir (limit: 4).

---

### GET /dashboard/upcoming-tasks
Yaklaşan görevleri getir.

---

### GET /dashboard/ai-suggestions
AI önerilerini getir.

**User Story (TR):** *Kullanıcı olarak, dashboard'da AI'ın proaktif önerilerini görebilmeliyim.*

**Response:**
```json
[
  {
    "id": "1",
    "type": "sprint",
    "title": "Sprint Hızı Uyarısı",
    "message": "Son 2 sprintte velocity %15 azaldı.",
    "priority": "high"
  }
]
```

---

### GET /dashboard/kpi-summary
KPI özeti.

---

### GET /dashboard/risk-alerts
Risk uyarıları.

---

## 10. Calendar

### GET /calendar/events
Takvim etkinliklerini getir.

**Query Parameters:**
- `year` - Yıl
- `month` - Ay
- `projectId` - Projeye göre filtrele

---

### POST /calendar/events
Etkinlik oluştur.

**User Story (TR):** *Kullanıcı olarak, toplantı ve deadline'ları takvime ekleyebilmeliyim.*

**Request Body:**
```json
{
  "title": "Sprint Planning",
  "description": "Haftalık sprint planlama",
  "type": "meeting",
  "startDate": "2024-12-20T10:00:00Z",
  "endDate": "2024-12-20T11:00:00Z",
  "color": "blue",
  "projectId": "...",
  "attendees": ["userId1", "userId2"],
  "meetingUrl": "https://zoom.us/j/123456"
}
```

---

### GET /calendar/events/:id
Etkinlik detayı.

---

### PATCH /calendar/events/:id
Etkinliği güncelle.

---

### DELETE /calendar/events/:id
Etkinliği sil.

---

### PATCH /calendar/events/:id/respond
Etkinliğe yanıt ver (kabul/reddet).

**Request Body:**
```json
{
  "response": "accept"
}
```

---

## 11. Team

### GET /team/members
Ekip üyelerini listele.

**Query Parameters:**
- `department` - Departmana göre filtrele
- `search` - İsim veya pozisyon ara
- `status` - `online`, `busy`, `offline`, `away`

---

### GET /team/departments
Departmanları listele.

---

### POST /team/members
Yeni ekip üyesi davet et (Admin).

**Request Body:**
```json
{
  "name": "Yeni Üye",
  "email": "yeni@metrika.com",
  "role": "Developer",
  "department": "Engineering"
}
```

---

## 12. KPI

### GET /kpi/dashboard
KPI dashboard verisi.

**Response:**
```json
{
  "revenue": { "total": 2450000, "trend": 12.5, "currency": "₺" },
  "projectSuccessRate": 94,
  "avgCompletionTime": 14,
  "activeIssues": 12,
  "taskCompletionRate": 72
}
```

---

### GET /kpi/revenue
Gelir verileri (grafik için).

**Query Parameters:**
- `period` - `ytd`, `month`, `quarter`

---

### GET /kpi/project-performance
Proje bazlı performans karşılaştırma.

---

### GET /kpi/completion-stats
Tamamlanma istatistikleri.

---

### GET /kpi/issues
Aktif sorunlar.

---

## 13. Notifications

### GET /notifications
Bildirimleri listele.

**Query Parameters:**
- `isRead` - `true` | `false`
- `type` - `info`, `success`, `warning`, `error`, `meeting`, `deadline`, `mention`, `ai`, `badge`
- `page`, `limit` - Sayfalama

---

### GET /notifications/unread-count
Okunmamış bildirim sayısı.

**Response:**
```json
{
  "count": 5
}
```

---

### PATCH /notifications/:id/read
Bildirimi okundu işaretle.

---

### PATCH /notifications/read-all
Tümünü okundu işaretle.

---

### DELETE /notifications/:id
Bildirimi sil.

---

### POST /notifications/:id/dismiss
Bildirimi kapat (silmeden).

---

## 14. Settings

### GET /settings/notifications
Bildirim ayarlarını getir.

**Response:**
```json
{
  "email": true,
  "desktop": true,
  "taskAssignments": true,
  "deadlineReminders": false,
  "weeklyReport": false,
  "mentionAlerts": true,
  "projectUpdates": true
}
```

---

### PATCH /settings/notifications
Bildirim ayarlarını güncelle.

**Request Body:**
```json
{
  "deadlineReminders": true,
  "weeklyReport": true
}
```

---

## 15. Help

### GET /help/search
Yardım makalelerinde ara.

**Query Parameters:**
- `q` - Arama terimi

---

### GET /help/articles
Kategoriye göre makaleler.

**Query Parameters:**
- `category` - `getting-started`, `projects`, `tasks`, `gamification`, `team`, `settings`, `faq`

---

### GET /help/faq
Sık sorulan soruları getir.

---

### POST /help/support-ticket
Destek talebi oluştur.

**Request Body:**
```json
{
  "subject": "Yardım lazım",
  "message": "Detaylı açıklama...",
  "category": "question",
  "priority": "medium"
}
```

---

## 16. Search

### GET /search
Global arama.

**User Story (TR):** *Kullanıcı olarak, proje, görev, doküman ve kullanıcılar arasında tek yerden arama yapabilmeliyim.*

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

**Error Response Format:**
```json
{
  "message": "Hata açıklaması",
  "stack": "..." // Sadece development'ta
}
```

---

## Pagination

Paginated endpoint'ler şu formatta döner:
```json
{
  "data": [...],
  "page": 1,
  "pages": 5,
  "total": 48
}
```

---

## WebSocket Events

Real-time özellikler için WebSocket bağlantısı:

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

**Last Updated:** December 15, 2024  
**Version:** 2.0
