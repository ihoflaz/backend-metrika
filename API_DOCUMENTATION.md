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
17. [Database Models](#17-database-models)

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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/me` | GET | Oturumdaki kullanıcının profili |
| `/users/me` | PATCH | Profil güncelle |
| `/users/:id` | GET | Kullanıcı profili |
| `/users/:id/stats` | GET | Kullanıcı istatistikleri |
| `/users/:id/tasks` | GET | Kullanıcının görevleri |
| `/users/:id/projects` | GET | Kullanıcının projeleri |
| `/users/:id/badges` | GET | Kullanıcının rozetleri |
| `/users/:id/skills` | GET | Kullanıcının becerileri |
| `/users/:id/activity` | GET | Kullanıcının aktiviteleri |
| `/users/:id/praise` | POST | Kullanıcıyı takdir et |
| `/users/:id/assign-task` | POST | Kullanıcıya görev ata |

---

## 3. Projects

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/projects` | GET | Proje listesi |
| `/projects` | POST | Yeni proje oluştur |
| `/projects/stats` | GET | Proje istatistikleri |
| `/projects/:id` | GET | Proje detay |
| `/projects/:id` | PATCH | Proje güncelle |
| `/projects/:id` | DELETE | Proje sil |
| `/projects/:id/timeline` | GET | Zaman çizelgesi |
| `/projects/:id/burndown` | GET | Burndown chart |
| `/projects/:id/tasks` | GET | Proje görevleri |
| `/projects/:id/members` | GET | Ekip üyeleri |
| `/projects/:id/members` | POST | Üye ekle |
| `/projects/:id/members/:userId` | DELETE | Üye çıkar |
| `/projects/:id/documents` | GET | Proje dokümanları |
| `/projects/:id/kpis` | GET | Proje KPI'ları |
| `/projects/:id/sprints` | GET | Proje spritleri |
| `/projects/:id/current-sprint` | GET | Aktif sprint |

---

## 4. Tasks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tasks` | GET | Görev listesi |
| `/tasks` | POST | Yeni görev |
| `/tasks/bulk` | POST | Toplu görev oluştur |
| `/tasks/stats/by-status` | GET | Durum istatistikleri |
| `/tasks/:id` | GET | Görev detay |
| `/tasks/:id` | PATCH | Görev güncelle |
| `/tasks/:id` | DELETE | Görev sil |
| `/tasks/:id/status` | PATCH | Durum güncelle |
| `/tasks/:id/comments` | GET | Yorumlar |
| `/tasks/:id/comments` | POST | Yorum ekle |
| `/tasks/:id/activity` | GET | Aktivite geçmişi |
| `/tasks/:id/time-logs` | GET | Zaman kayıtları |
| `/tasks/:id/time-logs` | POST | Zaman kaydı ekle |
| `/tasks/:id/attachments` | POST | Ek yükle |

### Multi-Linking (Çoklu Bağlantı)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tasks/:id/projects` | GET | Bağlı projeler |
| `/tasks/:id/projects/:projectId` | POST | Projeye bağla |
| `/tasks/:id/projects/:projectId` | DELETE | Projeden çıkar |
| `/tasks/:id/documents` | GET | Bağlı dokümanlar |
| `/tasks/:id/documents/:documentId` | POST | Doküman bağla |
| `/tasks/:id/documents/:documentId` | DELETE | Doküman çıkar |

---

## 5. Sprints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sprints/:id` | GET | Sprint detay |
| `/sprints/:id` | PATCH | Sprint güncelle |
| `/sprints/:id/start` | PATCH | Sprint başlat |
| `/sprints/:id/complete` | PATCH | Sprint tamamla |

---

## 6. Documents

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents` | GET | Doküman listesi |
| `/documents/stats` | GET | Doküman istatistikleri |
| `/documents/upload` | POST | Doküman yükle (multipart) |
| `/documents/:id` | GET | Doküman detay |
| `/documents/:id` | PATCH | Doküman güncelle |
| `/documents/:id` | DELETE | Doküman sil |
| `/documents/:id/analyze` | POST | AI analizi başlat |
| `/documents/:id/analysis` | GET | Analiz sonucu |

---

## 7. Analyses

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyses` | GET | Analiz listesi |
| `/analyses/:id` | GET | Analiz detay |
| `/analyses/:id/save` | PATCH | Analizi kaydet |
| `/analyses/:id/share` | POST | Analizi paylaş |
| `/analyses/:id/generate-link` | POST | Paylaşım linki oluştur |

---

## 8. Gamification

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/gamification/profile` | GET | Oyunlaştırma profili |
| `/gamification/leaderboard` | GET | Liderlik tablosu |
| `/gamification/badges` | GET | Tüm rozetler |
| `/gamification/achievements` | GET | Başarımlar |
| `/gamification/achievements/:id` | GET | Başarım detay |
| `/gamification/achievements/:id/unlock` | POST | Başarım aç |
| `/gamification/streak` | GET | Seri bilgisi |
| `/gamification/recent-activities` | GET | Son XP aktiviteleri |
| `/gamification/skills` | GET | Beceri dağılımı |

---

## 9. Dashboard

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dashboard/stats` | GET | Özet istatistikler |
| `/dashboard/active-projects` | GET | Aktif projeler |
| `/dashboard/upcoming-tasks` | GET | Yaklaşan görevler |
| `/dashboard/ai-suggestions` | GET | AI önerileri |
| `/dashboard/kpi-summary` | GET | KPI özeti |
| `/dashboard/risk-alerts` | GET | Risk uyarıları |

---

## 10. Calendar

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/calendar/events` | GET | Etkinlikler |
| `/calendar/events` | POST | Etkinlik oluştur |
| `/calendar/events/:id` | GET | Etkinlik detay |
| `/calendar/events/:id` | PATCH | Etkinlik güncelle |
| `/calendar/events/:id` | DELETE | Etkinlik sil |
| `/calendar/events/:id/respond` | PATCH | Etkinliğe yanıt |

---

## 11. Team

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/team/members` | GET | Ekip üyeleri |
| `/team/departments` | GET | Departmanlar |
| `/team/members` | POST | Üye davet et |

---

## 12. KPI

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/kpi/dashboard` | GET | KPI dashboard |
| `/kpi/revenue` | GET | Gelir verileri |
| `/kpi/project-performance` | GET | Proje performansı |
| `/kpi/completion-stats` | GET | Tamamlanma istatistikleri |
| `/kpi/issues` | GET | Aktif sorunlar |
| `/kpi/team-performance` | GET | Ekip performansı |
| `/kpi/goals` | GET | KPI hedefleri |
| `/kpi/goals` | POST | Hedef oluştur |
| `/kpi/goals/:id` | PATCH | Hedef güncelle |
| `/kpi/goals/:id` | DELETE | Hedef sil |

---

## 13. Notifications

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/notifications` | GET | Bildirimler |
| `/notifications/unread-count` | GET | Okunmamış sayısı |
| `/notifications/:id/read` | PATCH | Okundu işaretle |
| `/notifications/read-all` | PATCH | Tümünü okundu işaretle |
| `/notifications/:id` | DELETE | Bildirimi sil |

---

## 14. Settings

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/settings/notifications` | GET | Bildirim ayarları |
| `/settings/notifications` | PATCH | Ayarları güncelle |

---

## 15. Help

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/help/search` | GET | Yardım ara |
| `/help/articles` | GET | Yardım makaleleri |
| `/help/faq` | GET | SSS |
| `/help/support-ticket` | POST | Destek talebi |

---

## 16. Search

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search` | GET | Global arama |

---

## 17. Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'Member'),
  department: String (default: 'General'),
  location: String (default: 'Remote'),
  bio: String,
  avatar: Number (Picsum ID),
  status: ['online', 'busy', 'offline', 'away'],
  // Gamification
  level: Number (default: 1),
  xp: Number (default: 0),
  badges: [{ name, icon, color, earnedAt }],
  skills: [{ name, level }],
  currentStreak: Number,
  longestStreak: Number,
  lastActiveDate: Date,
  unlockedAchievements: [String],
  phone: String,
  joinDate: Date
}
// Virtual: xpToNextLevel = level * 1000
```

### Project
```javascript
{
  title: String (required),
  description: String,
  status: ['Active', 'Completed', 'On Hold', 'At Risk'],
  methodology: ['Waterfall', 'Scrum', 'Hybrid'],
  progress: Number (0-100),
  startDate: Date (required),
  endDate: Date (required),
  budget: Number,
  budgetUsed: Number,
  color: String,
  manager: ObjectId -> User (required),
  members: [ObjectId -> User],
  kpis: [{ name, target, unit, current }]
}
```

### Task
```javascript
{
  title: String (required),
  description: String,
  status: ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'],
  priority: ['Low', 'Medium', 'High', 'Urgent'],
  order: Number (Kanban sıralama),
  project: ObjectId -> Project (required),
  projects: [ObjectId -> Project], // Multi-linking
  sprint: ObjectId -> Sprint,
  assignee: ObjectId -> User,
  dueDate: Date,
  estimatedHours: Number,
  loggedHours: Number,
  tags: [String],
  attachments: [{ name, url, mimeType, size, uploadedAt }],
  documents: [ObjectId -> Document] // Multi-linking
}
// Virtual: progress = (loggedHours / estimatedHours) * 100
```

### Sprint
```javascript
{
  name: String (required),
  project: ObjectId -> Project (required),
  startDate: Date (required),
  endDate: Date (required),
  goal: String,
  status: ['Planning', 'Active', 'Completed', 'Cancelled'],
  velocity: Number,
  plannedPoints: Number,
  completedPoints: Number
}
```

### Document
```javascript
{
  name: String (required),
  project: ObjectId -> Project,
  uploader: ObjectId -> User (required),
  type: String (PDF, DOCX, XLSX...),
  size: String ("2.4 MB"),
  path: String (Cloudinary URL),
  analysis: {
    status: ['pending', 'processing', 'completed', 'failed'],
    summary: String,
    findings: [{ type, content }],
    risks: [{ severity, content, page }],
    suggestedActions: [{ title, priority, canCreateTask }],
    tags: [String]
  }
}
```

### Analysis
```javascript
{
  document: ObjectId -> Document (required),
  status: ['pending', 'analyzing', 'completed', 'failed'],
  summary: String,
  findings: [{ type, content, page }],
  risks: [{ severity, content, page, section }],
  suggestedActions: [{ title, priority, canCreateTask, addedAsTask, taskId }],
  userActions: [{ text, priority, addedAsTask, taskId }],
  tags: [String],
  aiModel: String (default: 'gpt-4'),
  confidence: Number (0-100),
  analyzedAt: Date,
  savedAt: Date,
  sharedWith: [ObjectId -> User],
  shareLink: String,
  createdBy: ObjectId -> User (required)
}
```

### Notification
```javascript
{
  recipient: ObjectId -> User (required),
  type: ['xp', 'warning', 'badge', 'ai', 'meeting', 'task', 'success', 'error', 'info', 'mention', 'deadline'],
  title: String (required),
  message: String (required),
  isRead: Boolean (default: false),
  actions: [{ label, url, type }],
  metadata: Map
}
```

### Activity
```javascript
{
  user: ObjectId -> User (required),
  project: ObjectId -> Project,
  task: ObjectId -> Task,
  action: String (required),
  type: ['create', 'update', 'complete', 'comment', 'approval', 'gamification', 'time_log', 'achievement', 'praise'],
  content: String,
  xpEarned: Number
}
```

### CalendarEvent
```javascript
{
  title: String (required),
  description: String,
  type: ['meeting', 'deadline', 'task', 'reminder', 'other'],
  startDate: Date (required),
  endDate: Date,
  allDay: Boolean,
  color: String,
  project: ObjectId -> Project,
  task: ObjectId -> Task,
  creator: ObjectId -> User (required),
  attendees: [ObjectId -> User],
  location: String,
  meetingUrl: String,
  reminders: [{ time, sent }]
}
```

### Goal (KPI)
```javascript
{
  name: String (required),
  description: String,
  target: Number (required),
  current: Number (default: 0),
  unit: String,
  category: ['revenue', 'project', 'team', 'quality'],
  deadline: Date,
  status: ['on-track', 'at-risk', 'behind', 'completed'],
  project: ObjectId -> Project,
  createdBy: ObjectId -> User (required),
  isCustom: Boolean
}
// Virtual: progress = (current / target) * 100
```

### Settings
```javascript
{
  user: ObjectId -> User (required, unique),
  notifications: {
    email: Boolean,
    desktop: Boolean,
    taskAssignments: Boolean,
    deadlineReminders: Boolean,
    weeklyReport: Boolean,
    mentionAlerts: Boolean,
    projectUpdates: Boolean
  },
  preferences: {
    language: String (default: 'tr'),
    timezone: String (default: 'Europe/Istanbul'),
    theme: ['light', 'dark', 'system'],
    dateFormat: String
  }
}
```

### Achievement
```javascript
{
  key: String (required, unique),
  name: String (required),
  description: String (required),
  howTo: String,
  icon: String (Lucide icon),
  xp: Number (default: 50),
  color: String,
  requirement: Number,
  type: ['tasks', 'streak', 'level', 'projects', 'documents']
}
```

### HelpArticle
```javascript
{
  title: String (required),
  content: String (required),
  category: ['getting-started', 'projects', 'tasks', 'gamification', 'team', 'settings', 'faq'],
  tags: [String],
  order: Number,
  isPublished: Boolean
}
```

### SupportTicket
```javascript
{
  user: ObjectId -> User (required),
  subject: String (required),
  message: String (required),
  category: ['bug', 'feature', 'question', 'other'],
  status: ['open', 'in-progress', 'resolved', 'closed'],
  priority: ['low', 'medium', 'high'],
  responses: [{ user, message, createdAt }]
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

| Event | Description |
|-------|-------------|
| `notification` | Yeni bildirim |
| `task:updated` | Görev güncellendi |
| `task:created` | Yeni görev |
| `project:updated` | Proje güncellendi |
| `comment:added` | Yeni yorum |
| `user:status` | Kullanıcı durumu |
| `xp:earned` | XP kazanıldı |
| `level:up` | Seviye atlandı |
| `badge:earned` | Rozet kazanıldı |

---

**Last Updated:** December 25, 2024  
**Version:** 2.2

### Changelog
- **v2.2**: Added complete Database Models section (13 models)
- **v2.1**: Task multi-project/document linking, KPI Goals CRUD
- **v2.0**: All new endpoints
- **v1.0**: Initial release
