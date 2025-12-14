import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';

// @desc    Get dashboard stats
// @route   GET /dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'Active' });
    const activeTasks = await Task.countDocuments({ status: { $in: ['Todo', 'In Progress', 'Review'] } });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const completedTasksThisMonth = await Task.countDocuments({
        status: 'Done',
        updatedAt: { $gte: startOfMonth }
    });

    res.json({
        projects: { count: totalProjects, trend: '+2%' },
        activeProjects: { count: activeProjects },
        activeTasks: { count: activeTasks, trend: '+5%' },
        completedTasksThisMonth
    });
};

// @desc    Get active projects for dashboard
// @route   GET /dashboard/active-projects
// @access  Private
const getActiveProjects = async (req, res) => {
    const limit = Number(req.query.limit) || 4;
    const projects = await Project.find({ status: 'Active' })
        .limit(limit)
        .select('title description progress color manager')
        .populate('manager', 'name avatar');
    res.json(projects);
};

// @desc    Get upcoming tasks
// @route   GET /dashboard/upcoming-tasks
// @access  Private
const getUpcomingTasks = async (req, res) => {
    const limit = Number(req.query.limit) || 3;
    const tasks = await Task.find({
        assignee: req.user._id,
        status: { $ne: 'Done' },
        dueDate: { $exists: true }
    })
        .sort({ dueDate: 1 })
        .limit(limit)
        .select('title dueDate priority')
        .populate('project', 'title color');

    res.json(tasks);
};

// @desc    Get AI suggestions for dashboard
// @route   GET /dashboard/ai-suggestions
// @access  Private
const getAiSuggestions = async (req, res) => {
    // Mock AI suggestions
    res.json([
        {
            id: '1',
            type: 'sprint',
            title: 'Sprint Hızı Uyarısı',
            message: 'Son 2 sprintte velocity %15 azaldı. Kapasite planlamasını gözden geçirin.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
        },
        {
            id: '2',
            type: 'document',
            title: 'Doküman Analizi Tamamlandı',
            message: '3 adet risk tespit edildi, aksiyon önerileri hazır.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
        },
        {
            id: '3',
            type: 'budget',
            title: 'Bütçe Sapması',
            message: 'Proje A bütçesinin %85\'ine ulaştı, gözetim önerilir.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
        }
    ]);
};

// @desc    Get KPI summary for dashboard
// @route   GET /dashboard/kpi-summary
// @access  Private
const getKpiSummary = async (req, res) => {
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const totalProjects = await Project.countDocuments();
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Mock budget usage (would come from project aggregation)
    const budgetUsage = 72;

    res.json({
        completionRate,
        budgetUsage,
        onTimeDelivery: 85,
        teamSatisfaction: 92
    });
};

// @desc    Get risk alerts for dashboard
// @route   GET /dashboard/risk-alerts
// @access  Private
const getRiskAlerts = async (req, res) => {
    // Find projects at risk
    const atRiskProjects = await Project.find({ status: 'At Risk' })
        .limit(5)
        .select('title description progress');

    // Find overdue tasks
    const today = new Date();
    const overdueTasks = await Task.find({
        status: { $ne: 'Done' },
        dueDate: { $lt: today }
    })
        .limit(5)
        .populate('project', 'title');

    res.json({
        atRiskProjects,
        overdueTasks,
        criticalCount: atRiskProjects.length + overdueTasks.length
    });
};

export {
    getDashboardStats,
    getActiveProjects,
    getUpcomingTasks,
    getAiSuggestions,
    getKpiSummary,
    getRiskAlerts
};
