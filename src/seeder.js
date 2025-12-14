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
import connectDB from './config/db.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

// Helper to get random item from array
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random integer between min and max
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

const generateUsers = async (count) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Always create Admin first
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
            badges: [
                { name: 'Proje Ustası', icon: 'Trophy', color: 'Yellow' },
                { name: 'Hız Ustası', icon: 'Zap', color: 'Purple' }
            ],
            skills: [{ name: 'Project Management', level: 95 }, { name: 'Full Stack', level: 90 }]
        }
    ];

    for (let i = 0; i < count - 1; i++) {
        const fName = sample(firstNames);
        const lName = sample(lastNames);
        const name = `${fName} ${lName}`;

        users.push({
            name,
            email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@metrika.com`,
            password: hashedPassword,
            role: Math.random() > 0.8 ? 'Project Manager' : 'Member',
            department: sample(departments),
            location: sample(locations),
            avatar: randomInt(2, 70),
            xp: randomInt(100, 5000),
            level: randomInt(1, 5),
            status: sample(['online', 'busy', 'offline', 'away']),
            badges: Math.random() > 0.5 ? [{ name: 'Takım Lideri', icon: 'Users', color: 'Blue' }] : [],
            skills: [
                { name: sample(techStacks), level: randomInt(40, 95) },
                { name: sample(techStacks), level: randomInt(40, 95) }
            ]
        });
    }

    return await User.insertMany(users);
};

const generateProjects = async (users, count) => {
    const projects = [];
    const projectManagers = users.filter(u => u.role === 'Project Manager' || u.role === 'Admin');

    for (let i = 0; i < count; i++) {
        const manager = sample(projectManagers);
        // Random subset of users as members (3 to 8 members)
        const memberCount = randomInt(3, 8);
        const members = [manager._id]; // Manager is always a member

        for (let j = 0; j < memberCount; j++) {
            const randomUser = sample(users);
            if (!members.includes(randomUser._id)) {
                members.push(randomUser._id);
            }
        }

        const title = `${sample(projectPrefixes)} ${sample(projectSuffixes)} ${2024 + i}`;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - randomInt(0, 6)); // Started 0-6 months ago

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + randomInt(2, 12)); // Duration 2-12 months

        projects.push({
            title,
            description: `Comprehensive development project for ${title}. Involves multiple teams and advanced stack.`,
            status: sample(['Active', 'Active', 'Active', 'Completed', 'On Hold', 'At Risk']), // Weighted random
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
                { name: 'Bug Rate', target: 5, unit: '%', current: randomInt(0, 10) }
            ]
        });
    }

    return await Project.insertMany(projects);
};

const generateTasksAndActivities = async (projects, users) => {
    const tasks = [];
    const activities = [];
    const notifications = [];

    for (const project of projects) {
        const taskCount = randomInt(8, 20);

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

        if (task.status === 'Done') {
            activities.push({
                user: task.assignee,
                project: task.project,
                task: task._id,
                action: 'completed task',
                type: 'update',
                content: `Completed ${task.title}`,
                xpEarned: 50
            });

            notifications.push({
                recipient: task.assignee,
                type: 'success',
                title: 'Görev Tamamlandı',
                message: `${task.title} tamamlandı. 50 XP kazanıldı!`,
                isRead: Math.random() > 0.5
            });
        }
    }

    for (const user of users) {
        notifications.push({
            recipient: user._id,
            type: 'info',
            title: 'Haftalık Rapor Hazır',
            message: 'Geçen haftanın performans raporu incelenebilir.',
            isRead: false
        });
        notifications.push({
            recipient: user._id,
            type: 'meeting',
            title: 'Sprint Planning',
            message: 'Yarın saat 10:00 da Sprint Planning toplantısı var.',
            isRead: true,
            metadata: { meetingUrl: 'https://zoom.us/j/123456' }
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
    }

    await Activity.insertMany(activities);
    await Notification.insertMany(notifications);
};

// --- NEW FUNCTION: Upload real files from Downloads ---
const uploadRealDocuments = async (projects, users) => {
    const downloadsPath = path.join('C:', 'Users', 'hulus', 'Downloads');
    console.log(`Scanning for files in ${downloadsPath}...`);

    if (!fs.existsSync(downloadsPath)) {
        console.log('Downloads folder not found. Skipping file upload.');
        return;
    }

    // Filter interesting file types
    const files = fs.readdirSync(downloadsPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.xlsx'].includes(ext);
    });

    // Take max 5 files
    const filesToUpload = files.slice(0, 5); // Take first 5
    console.log(`Found ${files.length} files. Uploading ${filesToUpload.length} demo files...`);

    const documents = [];

    for (const fileName of filesToUpload) {
        const filePath = path.join(downloadsPath, fileName);
        try {
            // Check file size (skip if > 5MB to avoid timeouts/limits)
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
                timeout: 60000 // 60s timeout
            });

            // Randomly assign to a project and user
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
            // Continue to next file instead of crashing
        }
    }

    if (documents.length > 0) {
        await Document.insertMany(documents);
        console.log(`${documents.length} documents uploaded and created.`);
    }
};

const importData = async () => {
    try {
        console.log('Cleaning Database...');
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();
        await Notification.deleteMany();
        await Activity.deleteMany();
        await Document.deleteMany();

        console.log('Generating Users...');
        const users = await generateUsers(15);

        console.log('Generating Projects...');
        const projects = await generateProjects(users, 12);

        console.log('Generating Tasks, Activities, and Notifications...');
        await generateTasksAndActivities(projects, users);

        console.log('Uploading Real Demo Files...');
        await uploadRealDocuments(projects, users);

        console.log('Data Seeding Completed! 🚀');
        console.log(`- ${users.length} Users created`);
        console.log(`- ${projects.length} Projects created`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

importData();
