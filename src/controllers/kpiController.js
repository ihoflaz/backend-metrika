import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';
import Goal from '../models/goalModel.js';

// @desc    Get KPI Dashboard Data
// @route   GET /kpi/dashboard
// @access  Private
const getKpiDashboard = async (req, res) => {
    const { projectId } = req.query;

    const projectFilter = projectId ? { project: projectId } : {};

    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const projectSuccessRate = totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    const totalTasks = await Task.countDocuments(projectFilter);
    const completedTasks = await Task.countDocuments({ ...projectFilter, status: 'Done' });

    const avgCompletionTime = 14; // days (mock)

    const today = new Date();
    const activeIssues = await Task.countDocuments({
        ...projectFilter,
        $or: [
            { status: 'Blocked' },
            { dueDate: { $lt: today }, status: { $ne: 'Done' } }
        ]
    });

    // Calculate budget totals
    const budgetAgg = await Project.aggregate([
        { $group: { _id: null, totalBudget: { $sum: '$budget' }, totalUsed: { $sum: '$budgetUsed' } } }
    ]);
    const budget = budgetAgg[0] || { totalBudget: 0, totalUsed: 0 };

    res.json({
        revenue: {
            total: budget.totalBudget,
            used: budget.totalUsed,
            trend: 12.5,
            currency: '₺'
        },
        projectSuccessRate,
        avgCompletionTime,
        activeIssues,
        totalProjects,
        completedProjects,
        riskProjects: await Project.countDocuments({ status: 'At Risk' }),
        taskCompletionRate: totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0,
        totalTasks,
        completedTasks,
        avgProgress: Math.round((await Project.aggregate([
            { $group: { _id: null, avg: { $avg: '$progress' } } }
        ]))[0]?.avg || 0)
    });
};

// @desc    Get Revenue Data
// @route   GET /kpi/revenue
// @access  Private
const getRevenueData = async (req, res) => {
    const { period, projectId } = req.query;

    // Mock data for revenue chart
    const data = [
        { name: 'Oca', revenue: 186000, profit: 45000 },
        { name: 'Şub', revenue: 205000, profit: 52000 },
        { name: 'Mar', revenue: 237000, profit: 61000 },
        { name: 'Nis', revenue: 273000, profit: 72000 },
        { name: 'May', revenue: 209000, profit: 48000 },
        { name: 'Haz', revenue: 214000, profit: 55000 },
        { name: 'Tem', revenue: 256000, profit: 68000 },
        { name: 'Ağu', revenue: 289000, profit: 78000 },
        { name: 'Eyl', revenue: 302000, profit: 85000 },
        { name: 'Eki', revenue: 315000, profit: 92000 },
        { name: 'Kas', revenue: 328000, profit: 98000 },
        { name: 'Ara', revenue: 340000, profit: 105000 },
    ];

    res.json(data);
};

// @desc    Get Project Performance Comparison
// @route   GET /kpi/project-performance
// @access  Private
const getProjectPerformance = async (req, res) => {
    const projects = await Project.find({ status: { $in: ['Active', 'Completed'] } })
        .limit(6)
        .select('title progress budget budgetUsed');

    const data = projects.map(p => ({
        name: p.title.substring(0, 15),
        ilerleme: p.progress,
        bütçe: p.budget > 0 ? Math.round((p.budgetUsed / p.budget) * 100) : 0,
        görev: 0, // will be calculated
    }));

    // Calculate task counts per project
    for (const item of data) {
        const project = projects.find(p => p.title.substring(0, 15) === item.name);
        if (project) {
            item.görev = await Task.countDocuments({ project: project._id, status: 'Done' });
        }
    }

    res.json(data);
};

// @desc    Get Completion Stats
// @route   GET /kpi/completion-stats
// @access  Private
const getCompletionStats = async (req, res) => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const completedRecently = await Task.countDocuments({
        status: 'Done',
        updatedAt: { $gte: last30Days }
    });

    const onTimeCompleted = await Task.countDocuments({
        status: 'Done',
        updatedAt: { $gte: last30Days },
        $expr: { $lte: ['$updatedAt', '$dueDate'] }
    });

    res.json({
        totalCompleted: completedRecently,
        onTime: onTimeCompleted,
        onTimeRate: completedRecently > 0
            ? Math.round((onTimeCompleted / completedRecently) * 100)
            : 100,
        avgDays: 3.5,
    });
};

// @desc    Get Active Issues
// @route   GET /kpi/issues
// @access  Private
const getActiveIssues = async (req, res) => {
    const today = new Date();

    const blockedTasks = await Task.find({ status: 'Blocked' })
        .populate('project', 'title')
        .populate('assignee', 'name')
        .limit(10);

    const overdueTasks = await Task.find({
        dueDate: { $lt: today },
        status: { $nin: ['Done', 'Blocked'] }
    })
        .populate('project', 'title')
        .populate('assignee', 'name')
        .limit(10);

    res.json({
        total: blockedTasks.length + overdueTasks.length,
        blocked: blockedTasks,
        overdue: overdueTasks,
        thisWeek: Math.floor(Math.random() * 5) + 1,
    });
};

// ================== TEAM PERFORMANCE ==================

// @desc    Get Team Performance Rankings
// @route   GET /kpi/team-performance
// @access  Private
const getTeamPerformance = async (req, res) => {
    const { projectId, period } = req.query;

    // Get all users with their task stats
    const users = await User.find({ role: { $ne: 'Admin' } })
        .select('name role avatar xp level')
        .limit(20);

    const performance = [];

    for (const user of users) {
        const filter = { assignee: user._id };
        if (projectId) filter.project = projectId;

        const completedTasks = await Task.countDocuments({ ...filter, status: 'Done' });
        const totalTasks = await Task.countDocuments(filter);

        // Calculate logged hours
        const hoursAgg = await Task.aggregate([
            { $match: { assignee: user._id } },
            { $group: { _id: null, total: { $sum: '$loggedHours' } } }
        ]);
        const totalHours = hoursAgg[0]?.total || 0;

        performance.push({
            userId: user._id,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            completedTasks,
            totalTasks,
            totalHours,
            efficiency: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            score: user.xp || 0
        });
    }

    // Sort by score (XP)
    performance.sort((a, b) => b.score - a.score);

    res.json(performance);
};

// ================== GOALS CRUD ==================

// @desc    Get KPI Goals
// @route   GET /kpi/goals
// @access  Private
const getGoals = async (req, res) => {
    const { projectId, category, status } = req.query;

    const filter = {};
    if (projectId) filter.project = projectId;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const goals = await Goal.find(filter)
        .populate('project', 'title color')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });

    res.json(goals);
};

// @desc    Create KPI Goal
// @route   POST /kpi/goals
// @access  Private
const createGoal = async (req, res) => {
    const { name, description, target, current, unit, category, deadline, status, projectId } = req.body;

    const goal = await Goal.create({
        name,
        description,
        target,
        current: current || 0,
        unit,
        category,
        deadline,
        status: status || 'on-track',
        project: projectId,
        createdBy: req.user._id,
        isCustom: true
    });

    await goal.populate('project', 'title color');

    res.status(201).json(goal);
};

// @desc    Update KPI Goal
// @route   PATCH /kpi/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    Object.assign(goal, req.body);

    // Auto-update status based on progress
    if (goal.target > 0) {
        const progress = (goal.current / goal.target) * 100;
        if (progress >= 100) {
            goal.status = 'completed';
        } else if (progress < 50 && goal.deadline && new Date(goal.deadline) < new Date()) {
            goal.status = 'behind';
        }
    }

    await goal.save();

    res.json(goal);
};

// @desc    Delete KPI Goal
// @route   DELETE /kpi/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    // Only allow deleting custom goals
    if (!goal.isCustom) {
        res.status(403);
        throw new Error('Cannot delete system goals');
    }

    await goal.deleteOne();

    res.json({ message: 'Goal deleted' });
};

// @desc    Get single KPI by ID
// @route   GET /kpis/:id
// @access  Private
const getKpiById = async (req, res) => {
    const goal = await Goal.findById(req.params.id)
        .populate('project', 'title color')
        .populate('createdBy', 'name');

    if (!goal) {
        res.status(404);
        throw new Error('KPI not found');
    }

    res.json(goal);
};

// @desc    Record KPI value
// @route   POST /kpis/:id/record
// @access  Private
const recordKpiValue = async (req, res) => {
    const { value } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('KPI not found');
    }

    goal.current = value;
    await goal.save();

    res.json(goal);
};

// @desc    Get KPI history
// @route   GET /kpis/:id/history
// @access  Private
const getKpiHistory = async (req, res) => {
    // Mock history data
    res.json([
        { date: '2024-01-01', value: 10 },
        { date: '2024-02-01', value: 25 },
        { date: '2024-03-01', value: 40 },
        { date: '2024-04-01', value: 55 },
        { date: '2024-05-01', value: 70 },
    ]);
};

export {
    getKpiDashboard,
    getRevenueData,
    getProjectPerformance,
    getCompletionStats,
    getActiveIssues,
    getTeamPerformance,
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getKpiById,
    recordKpiValue,
    getKpiHistory,
};
