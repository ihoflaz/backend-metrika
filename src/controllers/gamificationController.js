import User from '../models/userModel.js';
import Activity from '../models/activityModel.js';
import Achievement from '../models/achievementModel.js';
import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';
import Document from '../models/documentModel.js';

// Achievement definitions
const ACHIEVEMENTS = [
    { key: 'first_task', name: 'İlk Adım', description: 'İlk görevini tamamla', howTo: 'Bir görevi Done durumuna getir', icon: 'CheckCircle', xp: 50, color: 'green', requirement: 1, type: 'tasks' },
    { key: 'task_hunter', name: 'Görev Avcısı', description: '10 görev tamamla', howTo: '10 görevi tamamla', icon: 'Target', xp: 100, color: 'blue', requirement: 10, type: 'tasks' },
    { key: 'task_master', name: 'Görev Ustası', description: '50 görev tamamla', howTo: '50 görevi tamamla', icon: 'Award', xp: 250, color: 'purple', requirement: 50, type: 'tasks' },
    { key: 'streak_7', name: 'Haftalık Seri', description: '7 gün üst üste aktif ol', howTo: '7 gün kesintisiz çalış', icon: 'Flame', xp: 100, color: 'orange', requirement: 7, type: 'streak' },
    { key: 'streak_30', name: 'Aylık Seri', description: '30 gün üst üste aktif ol', howTo: '30 gün kesintisiz çalış', icon: 'Zap', xp: 500, color: 'yellow', requirement: 30, type: 'streak' },
    { key: 'level_5', name: 'Yükselen Yıldız', description: 'Seviye 5\'e ulaş', howTo: 'XP toplayarak 5. seviyeye ulaş', icon: 'Star', xp: 150, color: 'cyan', requirement: 5, type: 'level' },
    { key: 'project_contributor', name: 'Proje Katılımcısı', description: '3 projede çalış', howTo: '3 farklı projede görev al', icon: 'FolderOpen', xp: 100, color: 'indigo', requirement: 3, type: 'projects' },
    { key: 'doc_uploader', name: 'Belgeleme Ustası', description: '10 doküman yükle', howTo: 'Projelere 10 doküman ekle', icon: 'FileText', xp: 100, color: 'emerald', requirement: 10, type: 'documents' },
];

// @desc    Get gamification profile
// @route   GET /gamification/profile
// @access  Private
const getGamificationProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('name avatar level xp badges skills currentStreak longestStreak lastActiveDate unlockedAchievements');

    // Calculate xpToNextLevel
    const currentLevel = user.level || 1;
    const xpToNextLevel = currentLevel * 1000;

    // Calculate rank
    const rank = await User.countDocuments({ xp: { $gt: user.xp } }) + 1;

    // Get recent activities
    const recentActivity = await Activity.find({ user: req.user._id })
        .populate('project', 'title')
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        ...user.toJSON(),
        xpToNextLevel,
        rank,
        recentActivity
    });
};

// @desc    Get leaderboard
// @route   GET /gamification/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    const period = req.query.period || 'all-time';
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const users = await User.find({})
        .sort({ xp: -1 })
        .limit(limit)
        .skip(limit * (page - 1))
        .select('name avatar role department xp level');

    const usersWithRank = users.map((user, index) => ({
        ...user.toJSON(),
        rank: (page - 1) * limit + index + 1,
    }));

    const total = await User.countDocuments();

    res.json({
        users: usersWithRank,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
};

// @desc    Get all badges
// @route   GET /gamification/badges
// @access  Private
const getBadges = async (req, res) => {
    const allBadges = [
        { name: 'Proje Ustası', icon: 'Trophy', color: 'Yellow', description: '10 proje tamamla' },
        { name: 'Takım Lideri', icon: 'Users', color: 'Blue', description: '5 projede liderlik' },
        { name: 'Hız Ustası', icon: 'Zap', color: 'Purple', description: '50 görevi zamanında tamamla' },
        { name: 'Dokümantasyon', icon: 'FileText', color: 'Green', description: '25 doküman yükle' },
        { name: 'İletişim Kralı', icon: 'Star', color: 'Orange', description: 'Yoğun yorum aktivitesi' },
        { name: 'Analitik', icon: 'TrendingUp', color: 'Pink', description: 'KPI hedeflerini aş' },
        { name: 'Teknoloji', icon: 'Shield', color: 'Cyan', description: 'Teknik başarılar' },
        { name: 'Kalite', icon: 'CheckCircle', color: 'Emerald', description: 'Kalite standartlarını karşıla' },
    ];

    const user = await User.findById(req.user._id).select('badges');
    const userBadgeNames = (user?.badges || []).map(b => b.name);

    const badgesWithStatus = allBadges.map(b => ({
        ...b,
        earned: userBadgeNames.includes(b.name)
    }));

    res.json(badgesWithStatus);
};

// @desc    Get all achievements with progress
// @route   GET /gamification/achievements
// @access  Private
const getAchievements = async (req, res) => {
    const userId = req.user._id;

    // Get user's current counts
    const completedTasks = await Task.countDocuments({ assignee: userId, status: 'Done' });
    const projectCount = await Project.countDocuments({ members: userId });
    const documentCount = await Document.countDocuments({ uploader: userId });

    const user = await User.findById(userId).select('level currentStreak unlockedAchievements');
    const unlockedAchievements = user?.unlockedAchievements || [];

    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
        let current = 0;

        switch (achievement.type) {
            case 'tasks':
                current = completedTasks;
                break;
            case 'streak':
                current = user?.currentStreak || 0;
                break;
            case 'level':
                current = user?.level || 1;
                break;
            case 'projects':
                current = projectCount;
                break;
            case 'documents':
                current = documentCount;
                break;
        }

        const progress = Math.min((current / achievement.requirement) * 100, 100);
        const unlocked = unlockedAchievements.includes(achievement.key);

        return {
            ...achievement,
            current,
            progress,
            unlocked,
        };
    });

    res.json(achievementsWithProgress);
};

// @desc    Get single achievement
// @route   GET /gamification/achievements/:id
// @access  Private
const getAchievementById = async (req, res) => {
    const achievement = ACHIEVEMENTS.find(a => a.key === req.params.id);

    if (achievement) {
        res.json(achievement);
    } else {
        res.status(404);
        throw new Error('Achievement not found');
    }
};

// @desc    Get streak info
// @route   GET /gamification/streak
// @access  Private
const getStreak = async (req, res) => {
    const user = await User.findById(req.user._id).select('currentStreak longestStreak lastActiveDate');

    // Calculate weekly activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyActivity = await Activity.aggregate([
        { $match: { user: req.user._id, createdAt: { $gte: weekAgo } } },
        { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } }
    ]);

    const daysActive = weeklyActivity.map(d => d._id);

    res.json({
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
        lastActiveDate: user?.lastActiveDate,
        weeklyActivity: daysActive,
    });
};

// @desc    Get recent XP activities
// @route   GET /gamification/recent-activities
// @access  Private
const getRecentActivities = async (req, res) => {
    const activities = await Activity.find({
        user: req.user._id,
        xpEarned: { $gt: 0 }
    })
        .populate('project', 'title')
        .sort({ createdAt: -1 })
        .limit(10);

    res.json(activities);
};

// @desc    Get skills distribution
// @route   GET /gamification/skills
// @access  Private
const getSkills = async (req, res) => {
    const user = await User.findById(req.user._id).select('skills');
    res.json(user?.skills || []);
};

// @desc    Unlock achievement
// @route   POST /gamification/achievements/:id/unlock
// @access  Private
const unlockAchievement = async (req, res) => {
    const achievementKey = req.params.id;
    const achievement = ACHIEVEMENTS.find(a => a.key === achievementKey);

    if (!achievement) {
        res.status(404);
        throw new Error('Achievement not found');
    }

    const user = await User.findById(req.user._id);

    if (!user.unlockedAchievements) {
        user.unlockedAchievements = [];
    }

    if (user.unlockedAchievements.includes(achievementKey)) {
        res.status(400);
        throw new Error('Achievement already unlocked');
    }

    // Verify requirements are met (simplified)
    user.unlockedAchievements.push(achievementKey);
    user.xp = (user.xp || 0) + achievement.xp;

    // Check for level up
    const newLevel = Math.floor(user.xp / 1000) + 1;
    if (newLevel > user.level) {
        user.level = newLevel;
    }

    await user.save();

    // Create activity
    await Activity.create({
        user: user._id,
        action: 'unlocked achievement',
        type: 'achievement',
        content: `${achievement.name} başarımını kazandı`,
        xpEarned: achievement.xp,
    });

    res.json({
        message: 'Achievement unlocked!',
        achievement,
        xpAwarded: achievement.xp,
        newTotal: user.xp,
    });
};

export {
    getGamificationProfile,
    getLeaderboard,
    getBadges,
    getAchievements,
    getAchievementById,
    getStreak,
    getRecentActivities,
    getSkills,
    unlockAchievement,
};
