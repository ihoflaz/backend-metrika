import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import User from './models/userModel.js';
import Project from './models/projectModel.js';
import Task from './models/taskModel.js';
import Notification from './models/notificationModel.js';
import Activity from './models/activityModel.js';
import Document from './models/documentModel.js';
import Sprint from './models/sprintModel.js';
import CalendarEvent from './models/calendarEventModel.js';
import Analysis from './models/analysisModel.js';
import Settings from './models/settingsModel.js';
import { HelpArticle, SupportTicket } from './models/helpModel.js';
import Goal from './models/goalModel.js';


dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB directly
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Helper functions
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'];
const locations = ['Istanbul', 'Ankara', 'Izmir', 'Remote', 'London', 'Berlin'];
const techStacks = ['React', 'Node.js', 'Python', 'Go', 'AWS', 'Docker', 'Kubernetes', 'MongoDB'];
const projectPrefixes = ['Metrika', 'Alpha', 'Omega', 'Phoenix', 'Nexus', 'Terra', 'Solar', 'Lunar', 'Cyber', 'Quantum'];
const projectSuffixes = ['Dashboard', 'API', 'Mobile App', 'Analytics', 'Platform', 'Portal', 'Hub', 'System', 'Engine'];

const firstNames = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Can', 'Cem', 'Elif', 'Zeynep', 'Deniz', 'Derya', 'Emre', 'Burak', 'Selin', 'Ece', 'Ozan'];
const lastNames = ['Yılmaz', 'Demir', 'Kaya', 'Çelik', 'Şahin', 'Yıldız', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara'];

const taskVerbs = ['Implement', 'Design', 'Refactor', 'Fix bug in', 'Test', 'Deploy', 'Analyze', 'Document', 'Review'];
const taskNouns = ['Authentication', 'API Endpoints', 'User Interface', 'Database Schema', 'CI/CD Pipeline', 'Unit Tests', 'Performance', 'Security', 'Navigation', 'Redux Store'];

// Achievement keys that users can unlock
const achievementKeys = ['first_task', 'task_hunter', 'task_master', 'streak_7', 'streak_30', 'level_5', 'project_contributor', 'doc_uploader'];

const generateUsers = async (count) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const users = [
        {
            name: 'Hulusi',
            email: 'admin@metrika.com',
            password: hashedPassword,
            role: 'Admin',
            department: 'Engineering',
            location: 'Istanbul',
            avatar: 1,
            xp: 2500,
            level: 3,
            status: 'online',
            currentStreak: 12,
            longestStreak: 25,
            lastActiveDate: new Date(),
            unlockedAchievements: ['first_task', 'task_hunter', 'streak_7', 'project_contributor'],
            badges: [
                { name: 'Proje Ustası', icon: 'Trophy', color: 'Yellow' },
                { name: 'Hız Ustası', icon: 'Zap', color: 'Purple' }
            ],
            skills: [
                { name: 'Project Management', level: 95 },
                { name: 'Full Stack', level: 90 },
                { name: 'Team Leadership', level: 85 }
            ],
            bio: 'Deneyimli yazılım geliştirici ve proje yöneticisi.',
            phone: '+90 532 123 4567',
            joinDate: new Date('2023-01-15')
        }
    ];

    for (let i = 0; i < count - 1; i++) {
        const fName = sample(firstNames);
        const lName = sample(lastNames);
        const name = `${fName} ${lName}`;
        const xp = randomInt(100, 5000);
        const level = Math.floor(xp / 1000) + 1;

        users.push({
            name,
            email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@metrika.com`,
            password: hashedPassword,
            role: Math.random() > 0.8 ? 'Project Manager' : 'Member',
            department: sample(departments),
            location: sample(locations),
            avatar: randomInt(2, 70),
            xp,
            level,
            status: sample(['online', 'busy', 'offline', 'away']),
            currentStreak: randomInt(0, 15),
            longestStreak: randomInt(5, 30),
            lastActiveDate: new Date(Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000),
            unlockedAchievements: achievementKeys.slice(0, randomInt(0, 4)),
            badges: Math.random() > 0.5 ? [{ name: 'Takım Lideri', icon: 'Users', color: 'Blue' }] : [],
            skills: [
                { name: sample(techStacks), level: randomInt(40, 95) },
                { name: sample(techStacks), level: randomInt(40, 95) }
            ],
            bio: 'Metrika ekibinin değerli bir üyesi.',
            joinDate: new Date(Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000)
        });
    }

    return await User.insertMany(users);
};

const generateProjects = async (users, count) => {
    const projects = [];
    const projectManagers = users.filter(u => u.role === 'Project Manager' || u.role === 'Admin');

    for (let i = 0; i < count; i++) {
        const manager = sample(projectManagers);
        const memberCount = randomInt(3, 8);
        const members = [manager._id];

        for (let j = 0; j < memberCount; j++) {
            const randomUser = sample(users);
            if (!members.includes(randomUser._id)) {
                members.push(randomUser._id);
            }
        }

        const title = `${sample(projectPrefixes)} ${sample(projectSuffixes)} ${2024 + i}`;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - randomInt(0, 6));

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + randomInt(2, 12));

        projects.push({
            title,
            description: `Comprehensive development project for ${title}. Involves multiple teams and advanced stack.`,
            status: sample(['Active', 'Active', 'Active', 'Completed', 'On Hold', 'At Risk']),
            methodology: sample(['Scrum', 'Scrum', 'Hybrid', 'Waterfall']),
            progress: randomInt(0, 100),
            startDate,
            endDate,
            budget: randomInt(50000, 500000),
            budgetUsed: randomInt(10000, 200000),
            color: sample(['blue', 'purple', 'green', 'yellow', 'cyan', 'red']),
            manager: manager._id,
            members,
            kpis: [
                { name: 'Sprint Velocity', target: 40, unit: 'points', current: randomInt(20, 50) },
                { name: 'Bug Rate', target: 5, unit: '%', current: randomInt(0, 10) },
                { name: 'Code Coverage', target: 80, unit: '%', current: randomInt(60, 95) }
            ]
        });
    }

    return await Project.insertMany(projects);
};

const generateSprints = async (projects) => {
    const sprints = [];

    for (const project of projects) {
        if (project.methodology !== 'Waterfall') {
            // Create 3-4 sprints per Scrum/Hybrid project
            const sprintCount = randomInt(3, 4);
            const sprintStart = new Date(project.startDate);

            for (let i = 0; i < sprintCount; i++) {
                const startDate = new Date(sprintStart);
                startDate.setDate(startDate.getDate() + (i * 14)); // 2-week sprints

                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 14);

                const status = i === 0 ? 'Completed' :
                    i === 1 ? 'Active' : 'Planning';

                sprints.push({
                    name: `Sprint ${i + 1}`,
                    project: project._id,
                    startDate,
                    endDate,
                    goal: `Sprint ${i + 1} hedefleri: Temel özellikleri tamamla`,
                    status,
                    velocity: status === 'Completed' ? randomInt(30, 50) : 0,
                    plannedPoints: randomInt(35, 45),
                    completedPoints: status === 'Completed' ? randomInt(30, 45) : 0
                });
            }
        }
    }

    return await Sprint.insertMany(sprints);
};

const generateCalendarEvents = async (projects, users) => {
    const events = [];
    const now = new Date();

    // Create various calendar events
    for (const project of projects.slice(0, 5)) {
        const projectMembers = users.filter(u => project.members.includes(u._id));
        const creator = sample(projectMembers);

        // Sprint Planning
        events.push({
            title: `${project.title} - Sprint Planning`,
            description: 'Yeni sprint için planlama toplantısı',
            type: 'meeting',
            startDate: new Date(now.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
            color: project.color,
            project: project._id,
            creator: creator._id,
            attendees: projectMembers.slice(0, 5).map(u => u._id),
            location: 'Toplantı Odası A',
            meetingUrl: 'https://zoom.us/j/' + randomInt(100000000, 999999999)
        });

        // Daily Standup
        events.push({
            title: 'Daily Standup',
            description: 'Günlük durum toplantısı',
            type: 'meeting',
            startDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
            color: 'blue',
            project: project._id,
            creator: creator._id,
            attendees: projectMembers.slice(0, 3).map(u => u._id)
        });

        // Deadline
        events.push({
            title: `${project.title} - Milestone Teslimi`,
            description: 'Önemli milestone teslim tarihi',
            type: 'deadline',
            startDate: new Date(now.getTime() + randomInt(5, 20) * 24 * 60 * 60 * 1000),
            allDay: true,
            color: 'red',
            project: project._id,
            creator: creator._id
        });
    }

    // Personal reminders for admin
    const admin = users.find(u => u.role === 'Admin');
    events.push({
        title: 'Haftalık Rapor Hazırla',
        description: 'Yönetim için haftalık ilerleme raporu',
        type: 'reminder',
        startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        allDay: true,
        color: 'purple',
        creator: admin._id
    });

    return await CalendarEvent.insertMany(events);
};

const generateTasksAndActivities = async (projects, users, sprints) => {
    const tasks = [];
    const activities = [];
    const notifications = [];

    for (const project of projects) {
        const taskCount = randomInt(8, 20);
        const projectSprints = sprints.filter(s => s.project.toString() === project._id.toString());
        const activeSprint = projectSprints.find(s => s.status === 'Active');

        const columnOrders = {
            'Todo': 0,
            'In Progress': 0,
            'Review': 0,
            'Done': 0
        };

        for (let i = 0; i < taskCount; i++) {
            const assignee = sample(users.filter(u => project.members.includes(u._id)));
            const status = sample(['Todo', 'In Progress', 'In Progress', 'Review', 'Done', 'Done']);
            const priority = sample(['Low', 'Medium', 'Medium', 'High', 'Urgent']);

            const task = {
                title: `${sample(taskVerbs)} ${sample(taskNouns)}`,
                description: 'Detailed description for this specific task. Needs attention to detail and proper testing.',
                status,
                priority,
                project: project._id,
                sprint: activeSprint ? activeSprint._id : undefined,
                assignee: assignee._id,
                dueDate: new Date(new Date().setDate(new Date().getDate() + randomInt(-5, 30))),
                estimatedHours: randomInt(2, 40),
                loggedHours: randomInt(0, 10),
                tags: [sample(techStacks), sample(['Frontend', 'Backend', 'DevOps'])],
                order: columnOrders[status]++
            };

            tasks.push(task);
        }
    }

    const createdTasks = await Task.insertMany(tasks);

    for (const task of createdTasks) {
        activities.push({
            user: task.assignee,
            project: task.project,
            task: task._id,
            action: 'created task',
            type: 'create',
            content: `Created ${task.title}`
        });

        // Add some comments
        if (Math.random() > 0.6) {
            activities.push({
                user: sample(users)._id,
                project: task.project,
                task: task._id,
                action: 'commented',
                type: 'comment',
                content: sample([
                    'Bu konuda yardıma ihtiyacım var.',
                    'Harika ilerleme, devam edelim!',
                    'Kod incelemesi yaptım, birkaç öneri var.',
                    'Test sonuçları başarılı.'
                ]),
                xpEarned: 5
            });
        }

        if (task.status === 'Done') {
            activities.push({
                user: task.assignee,
                project: task.project,
                task: task._id,
                action: 'completed task',
                type: 'complete',
                content: `Completed ${task.title}`,
                xpEarned: 50
            });

            notifications.push({
                recipient: task.assignee,
                type: 'success',
                title: 'Görev Tamamlandı',
                message: `${task.title} tamamlandı. 50 XP kazanıldı!`,
                isRead: Math.random() > 0.5,
                metadata: { xpAmount: 50 }
            });
        }
    }

    // Various notification types for users
    for (const user of users) {
        notifications.push({
            recipient: user._id,
            type: 'info',
            title: 'Haftalık Rapor Hazır',
            message: 'Geçen haftanın performans raporu incelenebilir.',
            isRead: false,
            actions: [{ label: 'Raporu Görüntüle', url: '/reports', type: 'primary' }]
        });
        notifications.push({
            recipient: user._id,
            type: 'meeting',
            title: 'Sprint Planning',
            message: 'Yarın saat 10:00\'da Sprint Planning toplantısı var.',
            isRead: true,
            metadata: { meetingUrl: 'https://zoom.us/j/123456' },
            actions: [
                { label: 'Katıl', url: 'https://zoom.us/j/123456', type: 'primary' },
                { label: 'Ertele', type: 'secondary' }
            ]
        });
        notifications.push({
            recipient: user._id,
            type: 'deadline',
            title: 'Teslim Tarihi Yaklaşıyor',
            message: 'Proje teslimine 2 gün kaldı.',
            isRead: false,
            metadata: { projectName: 'Metrika API' }
        });
        notifications.push({
            recipient: user._id,
            type: 'mention',
            title: 'Yeni Yorumda Bahsedildiniz',
            message: 'Mustafa S. sizi "API Authorization" görevinde etiketledi.',
            isRead: true
        });
        notifications.push({
            recipient: user._id,
            type: 'ai',
            title: 'AI Risk Uyarısı',
            message: 'Proje bütçesinde %15 sapma tespit edildi.',
            isRead: false,
            metadata: { projectName: 'Metrika Dashboard', deviation: 15 },
            actions: [{ label: 'Analizi Görüntüle', url: '/kpi', type: 'primary' }]
        });
        if (Math.random() > 0.7) {
            notifications.push({
                recipient: user._id,
                type: 'badge',
                title: 'Yeni Rozet Kazandınız!',
                message: 'Tebrikler! "Hız Ustası" rozetini kazandınız.',
                isRead: false,
                metadata: { badgeName: 'Hız Ustası' },
                actions: [{ label: 'Profile Git', url: '/gamification', type: 'primary' }]
            });
        }
    }

    await Activity.insertMany(activities);
    await Notification.insertMany(notifications);

    return createdTasks;
};

const generateAnalyses = async (documents, users) => {
    const analyses = [];

    for (const doc of documents) {
        analyses.push({
            document: doc._id,
            status: 'completed',
            summary: 'Bu doküman detaylı bir teknik spesifikasyon içermektedir. Genel yapı tutarlı ve kapsamlı görünmektedir. Proje gereksinimleri net bir şekilde tanımlanmış.',
            findings: [
                { type: 'positive', content: 'Gereksinimler net bir şekilde tanımlanmış.', page: 3 },
                { type: 'positive', content: 'Proje kapsamı iyi belirlenmiş.', page: 5 },
                { type: 'negative', content: 'Güvenlik gereksinimleri daha detaylı olabilir.', page: 12 },
            ],
            risks: [
                { severity: 'medium', content: 'Zaman çizelgesi agresif görünüyor', page: 8 },
                { severity: 'low', content: 'Kaynak planlaması gözden geçirilmeli', page: 15 },
            ],
            suggestedActions: [
                { title: 'Güvenlik denetimi yaptır', priority: 'high', canCreateTask: true, addedAsTask: false },
                { title: 'Zaman çizelgesini gözden geçir', priority: 'medium', canCreateTask: true, addedAsTask: false },
                { title: 'Paydaşlarla onay toplantısı düzenle', priority: 'low', canCreateTask: true, addedAsTask: false },
            ],
            userActions: [],
            tags: ['teknik', 'spesifikasyon', sample(['proje-planı', 'analiz', 'rapor'])],
            aiModel: 'gpt-4',
            confidence: randomInt(75, 95),
            analyzedAt: new Date(),
            createdBy: sample(users)._id
        });
    }

    if (analyses.length > 0) {
        await Analysis.insertMany(analyses);
    }

    return analyses;
};

const generateSettings = async (users) => {
    const settings = [];

    for (const user of users) {
        settings.push({
            user: user._id,
            notifications: {
                email: Math.random() > 0.3,
                desktop: Math.random() > 0.2,
                taskAssignments: true,
                deadlineReminders: Math.random() > 0.4,
                weeklyReport: Math.random() > 0.5,
                mentionAlerts: true,
                projectUpdates: true,
            },
            preferences: {
                language: 'tr',
                timezone: 'Europe/Istanbul',
                theme: sample(['light', 'dark', 'system']),
                dateFormat: 'DD/MM/YYYY'
            }
        });
    }

    await Settings.insertMany(settings);
};

const generateHelpArticles = async () => {
    const articles = [
        {
            title: 'Yeni proje nasıl oluşturulur?',
            content: '1. Sol menüden "Projeler" sayfasına gidin.\n2. "Yeni Proje" butonuna tıklayın.\n3. 5 adımlı wizard\'ı takip edin:\n   - Metodoloji seçin (Scrum/Waterfall/Hybrid)\n   - Proje bilgilerini girin\n   - Ekip üyelerini seçin\n   - KPI\'ları tanımlayın\n   - Özeti onaylayın',
            category: 'getting-started',
            tags: ['proje', 'başlangıç', 'wizard'],
            order: 1
        },
        {
            title: 'XP puanları nasıl hesaplanır?',
            content: 'XP puanları şu şekilde kazanılır:\n- Görev tamamlama: 10-50 XP (önceliğe göre)\n- Yorum yapma: 5 XP\n- Doküman yükleme: 10 XP\n- AI analizi tetikleme: 15 XP\n- 7 günlük streak: 50 XP\n- 30 günlük streak: 200 XP',
            category: 'gamification',
            tags: ['xp', 'puan', 'seviye'],
            order: 2
        },
        {
            title: 'Takım üyeleri nasıl davet edilir?',
            content: '1. "Ekip" sayfasına gidin.\n2. "Üye Ekle" butonuna tıklayın.\n3. E-posta adresi ve rol bilgilerini girin.\n4. Davet gönder butonuna tıklayın.',
            category: 'team',
            tags: ['ekip', 'davet', 'üye'],
            order: 3
        },
        {
            title: 'Kanban board nasıl kullanılır?',
            content: 'Kanban board ile görevlerinizi sürükle-bırak yöntemiyle yönetebilirsiniz:\n- Görevleri kolonlar arasında sürükleyin\n- Kolon içinde sıralama değiştirin\n- Göreve tıklayarak detay modal\'ını açın',
            category: 'tasks',
            tags: ['kanban', 'görev', 'sürükle-bırak'],
            order: 4
        },
        {
            title: 'AI doküman analizi nasıl çalışır?',
            content: 'Dokümanlarınızı AI ile analiz etmek için:\n1. "Dokümanlar" sayfasına gidin.\n2. Doküman yükleyin veya mevcut bir dokümanı seçin.\n3. "Analiz Et" butonuna tıklayın.\n4. AI özet, bulgular, riskler ve aksiyon önerileri sunar.\n5. Önerileri görev olarak ekleyebilirsiniz.',
            category: 'projects',
            tags: ['ai', 'analiz', 'doküman'],
            order: 5
        },
        {
            title: 'Bildirim ayarları nasıl değiştirilir?',
            content: '1. Sağ üstteki profil simgesine tıklayın.\n2. "Ayarlar" seçeneğini seçin.\n3. "Bildirimler" sekmesine gidin.\n4. İstediğiniz bildirimleri açın/kapatın.\n5. "Kaydet" butonuna tıklayın.',
            category: 'settings',
            tags: ['bildirim', 'ayar'],
            order: 6
        },
        {
            title: 'Sprint nasıl başlatılır?',
            content: 'Scrum metodolojisi kullanan projelerde:\n1. Proje detay sayfasına gidin.\n2. "Sprints" sekmesine tıklayın.\n3. "Yeni Sprint" ile sprint oluşturun.\n4. Görevleri sprint\'e atayın.\n5. "Sprint Başlat" butonuna tıklayın.',
            category: 'projects',
            tags: ['sprint', 'scrum', 'agile'],
            order: 7
        },
        {
            title: 'Şifremi unuttum, ne yapmalıyım?',
            content: 'Giriş sayfasında "Şifremi Unuttum" linkine tıklayın. E-posta adresinizi girin ve sıfırlama bağlantısı alın. (Not: Bu özellik henüz aktif edilmemiştir, sistem yöneticisiyle iletişime geçin.)',
            category: 'faq',
            tags: ['şifre', 'sıfırlama', 'giriş'],
            order: 8
        }
    ];

    await HelpArticle.insertMany(articles);
};

const uploadRealDocuments = async (projects, users) => {
    const downloadsPath = path.join('C:', 'Users', 'hulus', 'Downloads');
    console.log(`Scanning for files in ${downloadsPath}...`);

    if (!fs.existsSync(downloadsPath)) {
        console.log('Downloads folder not found. Creating mock documents...');
        // Create some mock document entries without actual files
        const mockDocs = [];
        for (let i = 0; i < 5; i++) {
            mockDocs.push({
                name: `Demo Document ${i + 1}.pdf`,
                project: sample(projects)._id,
                uploader: sample(users)._id,
                type: 'PDF',
                size: `${randomInt(1, 5)}.${randomInt(0, 9)} MB`,
                path: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
                analysis: {
                    status: 'completed',
                    summary: 'Demo analiz özeti.',
                    findings: [{ type: 'positive', content: 'Demo bulgu.' }]
                }
            });
        }
        const docs = await Document.insertMany(mockDocs);
        console.log(`${docs.length} mock documents created.`);
        return docs;
    }

    const files = fs.readdirSync(downloadsPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.xlsx'].includes(ext);
    });

    const filesToUpload = files.slice(0, 5);
    console.log(`Found ${files.length} files. Uploading ${filesToUpload.length} demo files...`);

    const documents = [];

    for (const fileName of filesToUpload) {
        const filePath = path.join(downloadsPath, fileName);
        try {
            const stats = fs.statSync(filePath);
            if (stats.size > 5 * 1024 * 1024) {
                console.log(`Skipping ${fileName} (too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
                continue;
            }

            console.log(`Uploading ${fileName}...`);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'metrika-uploads',
                resource_type: 'auto',
                use_filename: true,
                unique_filename: false,
                timeout: 60000
            });

            const project = sample(projects);
            const uploader = sample(users);

            documents.push({
                name: fileName,
                project: project._id,
                uploader: uploader._id,
                type: path.extname(fileName).substring(1).toUpperCase(),
                size: `${(result.bytes / 1024 / 1024).toFixed(2)} MB`,
                path: result.secure_url,
                analysis: {
                    status: 'completed',
                    summary: 'AI Analysis simulated during seeding.',
                    findings: [
                        { type: 'positive', content: 'Automatically imported from Downloads.' }
                    ]
                }
            });
        } catch (err) {
            console.error(`Failed to upload ${fileName}:`, err.message);
        }
    }

    if (documents.length > 0) {
        const docs = await Document.insertMany(documents);
        console.log(`${docs.length} documents uploaded and created.`);
        return docs;
    }

    return [];
};

const importData = async () => {
    try {
        await connectDB();

        console.log('🧹 Cleaning Database...');
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();
        await Notification.deleteMany();
        await Activity.deleteMany();
        await Document.deleteMany();
        await Sprint.deleteMany();
        await CalendarEvent.deleteMany();
        await Analysis.deleteMany();
        await Settings.deleteMany();
        await HelpArticle.deleteMany();
        await SupportTicket.deleteMany();

        console.log('👥 Generating Users...');
        const users = await generateUsers(15);

        console.log('📁 Generating Projects...');
        const projects = await generateProjects(users, 12);

        console.log('🏃 Generating Sprints...');
        const sprints = await generateSprints(projects);

        console.log('📅 Generating Calendar Events...');
        await generateCalendarEvents(projects, users);

        console.log('✅ Generating Tasks, Activities, and Notifications...');
        await generateTasksAndActivities(projects, users, sprints);

        console.log('📤 Uploading Demo Documents...');
        const documents = await uploadRealDocuments(projects, users);

        console.log('🤖 Generating AI Analyses...');
        await generateAnalyses(documents, users);

        console.log('⚙️ Generating User Settings...');
        await generateSettings(users);

        console.log('📚 Generating Help Articles...');
        await generateHelpArticles();

        console.log('🎯 Generating KPI Goals...');
        await generateGoals(projects, users);

        console.log('\n✨ Data Seeding Completed! 🚀');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`  👥 ${users.length} Users`);
        console.log(`  📁 ${projects.length} Projects`);
        console.log(`  🏃 ${sprints.length} Sprints`);
        console.log(`  📄 ${documents.length} Documents`);
        console.log(`  📚 8 Help Articles`);
        console.log(`  🎯 KPI Goals`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔑 Login: admin@metrika.com / 123456\n');

        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        process.exit(1);
    }
};

// Generate KPI Goals
const generateGoals = async (projects, users) => {
    const goals = [];
    const admin = users.find(u => u.role === 'Admin');

    // System goals (not deletable)
    goals.push({
        name: 'Aylık Gelir Hedefi',
        description: 'Aylık gelir hedefi',
        target: 500000,
        current: 425000,
        unit: '₺',
        category: 'revenue',
        status: 'on-track',
        createdBy: admin._id,
        isCustom: false
    });

    goals.push({
        name: 'Görev Tamamlama Oranı',
        description: 'Aylık görev tamamlama hedefi',
        target: 100,
        current: 72,
        unit: '%',
        category: 'project',
        status: 'on-track',
        createdBy: admin._id,
        isCustom: false
    });

    goals.push({
        name: 'Ekip Memnuniyeti',
        description: 'Çeyreklik ekip memnuniyet anketi',
        target: 90,
        current: 85,
        unit: '%',
        category: 'team',
        status: 'on-track',
        createdBy: admin._id,
        isCustom: false
    });

    goals.push({
        name: 'Bug Oranı',
        description: 'Sprint başına maksimum bug sayısı',
        target: 5,
        current: 3,
        unit: 'adet',
        category: 'quality',
        status: 'on-track',
        createdBy: admin._id,
        isCustom: false
    });

    // Project-specific goals
    for (const project of projects.slice(0, 4)) {
        goals.push({
            name: `${project.title.substring(0, 15)} - Sprint Velocity`,
            target: 40,
            current: randomInt(25, 45),
            unit: 'points',
            category: 'project',
            project: project._id,
            status: sample(['on-track', 'at-risk', 'completed']),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdBy: admin._id,
            isCustom: true
        });
    }

    await Goal.deleteMany();
    await Goal.insertMany(goals);
};

importData();

