import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';

// @desc    Get KPI Dashboard Data
// @route   GET /kpi/dashboard
// @access  Private
const getKpiDashboard = async (req, res) => {
    // Calculate overall KPIs across all projects
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const projectSuccessRate = totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Done' });

    // Calculate average completion time (mock for now)
    const avgCompletionTime = 14; // days

    // Active issues (tasks that are blocked or overdue)
    const today = new Date();
    const activeIssues = await Task.countDocuments({
        $or: [
            { status: 'Blocked' },
            { dueDate: { $lt: today }, status: { $ne: 'Done' } }
        ]
    });

    res.json({
        revenue: {
            total: 2450000,
            trend: 12.5,
            currency: '₺'
        },
        projectSuccessRate,
        avgCompletionTime,
        activeIssues,
        taskCompletionRate: totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0,
    });
};

// @desc    Get Revenue Data
// @route   GET /kpi/revenue
// @access  Private
const getRevenueData = async (req, res) => {
    const { period } = req.query; // 'ytd', 'month', 'quarter'

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
        onTime: p.progress,
        budget: p.budget > 0 ? Math.round((p.budgetUsed / p.budget) * 100) : 0,
    }));

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

    // Blocked tasks
    const blockedTasks = await Task.find({ status: 'Blocked' })
        .populate('project', 'title')
        .populate('assignee', 'name')
        .limit(10);

    // Overdue tasks
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
        thisWeek: Math.floor(Math.random() * 5) + 1, // Mock
    });
};

export {
    getKpiDashboard,
    getRevenueData,
    getProjectPerformance,
    getCompletionStats,
    getActiveIssues,
};
