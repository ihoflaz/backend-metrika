import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';
// import KPI from '../models/kpiModel.js'; // Future

// @desc    Get dashboard stats
// @route   GET /dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    const totalProjects = await Project.countDocuments();
    const activeTasks = await Task.countDocuments({ status: 'In Progress' }); // Or 'Todo' + 'In Progress'?
    // "Bu ay tamamlanan görevler" - needs date filtering
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const completedTasksThisMonth = await Task.countDocuments({
        status: 'Done',
        updatedAt: { $gte: startOfMonth }
    });

    res.json({
        projects: { count: totalProjects, trend: '+2%' }, // Mock trend for now
        activeTasks: { count: activeTasks, trend: '+5%' },
        completedTasksThisMonth
    });
};

// @desc    Get active projects for dashboard
// @route   GET /dashboard/active-projects
// @access  Private
const getActiveProjects = async (req, res) => {
    const projects = await Project.find({ status: 'Active' })
        .limit(4)
        .select('title description progress color');
    res.json(projects);
};

// @desc    Get upcoming tasks
// @route   GET /dashboard/upcoming-tasks
// @access  Private
const getUpcomingTasks = async (req, res) => {
    const tasks = await Task.find({
        assignee: req.user._id,
        status: { $ne: 'Done' }
    })
        .sort({ dueDate: 1 })
        .limit(3)
        .select('title dueDate priority');

    res.json(tasks);
};

export { getDashboardStats, getActiveProjects, getUpcomingTasks };
