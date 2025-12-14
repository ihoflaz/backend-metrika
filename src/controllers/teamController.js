import User from '../models/userModel.js';
import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';
import Activity from '../models/activityModel.js';

// @desc    Get team members
// @route   GET /team/members
// @access  Private
const getTeamMembers = async (req, res) => {
    const { department, search, status } = req.query;

    let filter = {};

    if (department && department !== 'Tümü') {
        filter.department = department;
    }

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } }
        ];
    }

    const members = await User.find(filter)
        .select('-password')
        .sort({ name: 1 });

    res.json(members);
};

// @desc    Get departments
// @route   GET /team/departments
// @access  Private
const getDepartments = async (req, res) => {
    const departments = await User.distinct('department');
    res.json(departments);
};

// @desc    Invite team member
// @route   POST /team/members
// @access  Private (Admin only)
const inviteTeamMember = async (req, res) => {
    const { email, name, role, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    // Create user with temporary password (in production, send invite email)
    const user = await User.create({
        name,
        email,
        password: 'temppass123', // Should be random and emailed
        role: role || 'Member',
        department: department || 'Engineering',
        status: 'offline',
    });

    res.status(201).json({
        message: 'Team member invited successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
        }
    });
};

// @desc    Get user profile by ID
// @route   GET /users/:id
// @access  Private
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Get user stats
// @route   GET /users/:id/stats
// @access  Private
const getUserStats = async (req, res) => {
    const userId = req.params.id;

    const completedTasks = await Task.countDocuments({ assignee: userId, status: 'Done' });
    const activeTasks = await Task.countDocuments({ assignee: userId, status: { $ne: 'Done' } });
    const activeProjects = await Project.countDocuments({ members: userId, status: 'Active' });
    const totalProjects = await Project.countDocuments({ members: userId });

    // Calculate on-time rate (simplified)
    const allTasks = await Task.find({ assignee: userId, status: 'Done' });
    let onTime = 0;
    allTasks.forEach(task => {
        if (task.dueDate && task.updatedAt <= task.dueDate) {
            onTime++;
        }
    });
    const onTimeRate = allTasks.length > 0 ? Math.round((onTime / allTasks.length) * 100) : 100;

    res.json({
        completedTasks,
        activeTasks,
        activeProjects,
        totalProjects,
        avgTaskTime: '3.5 gün', // Mock
        onTimeRate,
    });
};

// @desc    Get user's tasks
// @route   GET /users/:id/tasks
// @access  Private
const getUserTasks = async (req, res) => {
    const { status } = req.query;
    let filter = { assignee: req.params.id };

    if (status === 'active') {
        filter.status = { $ne: 'Done' };
    } else if (status) {
        filter.status = status;
    }

    const tasks = await Task.find(filter)
        .populate('project', 'title color')
        .sort({ dueDate: 1 })
        .limit(10);

    res.json(tasks);
};

// @desc    Get user's projects
// @route   GET /users/:id/projects
// @access  Private
const getUserProjects = async (req, res) => {
    const projects = await Project.find({ members: req.params.id })
        .select('title status progress color')
        .sort({ updatedAt: -1 });

    res.json(projects);
};

// @desc    Get user's badges
// @route   GET /users/:id/badges
// @access  Private
const getUserBadges = async (req, res) => {
    const user = await User.findById(req.params.id).select('badges');
    res.json(user?.badges || []);
};

// @desc    Get user's skills
// @route   GET /users/:id/skills
// @access  Private
const getUserSkills = async (req, res) => {
    const user = await User.findById(req.params.id).select('skills');
    res.json(user?.skills || []);
};

// @desc    Get user's recent activity
// @route   GET /users/:id/activity
// @access  Private
const getUserActivity = async (req, res) => {
    const activities = await Activity.find({ user: req.params.id })
        .populate('project', 'title')
        .sort({ createdAt: -1 })
        .limit(10);

    res.json(activities);
};

// @desc    Praise a user
// @route   POST /users/:id/praise
// @access  Private
const praiseUser = async (req, res) => {
    const { message } = req.body;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
        res.status(404);
        throw new Error('User not found');
    }

    // Add XP to target user
    targetUser.xp = (targetUser.xp || 0) + 10;
    await targetUser.save();

    // Create activity
    await Activity.create({
        user: req.params.id,
        action: 'received praise',
        type: 'praise',
        content: message || `${req.user.name} takdir etti`,
        xpEarned: 10,
    });

    res.json({ message: 'Praise sent successfully', xpAwarded: 10 });
};

// @desc    Quick assign task to user
// @route   POST /users/:id/assign-task
// @access  Private
const assignTaskToUser = async (req, res) => {
    const { taskId, title, projectId, priority, dueDate } = req.body;

    if (taskId) {
        // Assign existing task
        const task = await Task.findById(taskId);
        if (task) {
            task.assignee = req.params.id;
            await task.save();
            res.json({ message: 'Task assigned', task });
        } else {
            res.status(404);
            throw new Error('Task not found');
        }
    } else {
        // Create new task
        const task = await Task.create({
            title,
            project: projectId,
            assignee: req.params.id,
            priority: priority || 'Medium',
            dueDate,
            status: 'Todo',
        });
        res.status(201).json({ message: 'Task created and assigned', task });
    }
};

export {
    getTeamMembers,
    getDepartments,
    inviteTeamMember,
    getUserById,
    getUserStats,
    getUserTasks,
    getUserProjects,
    getUserBadges,
    getUserSkills,
    getUserActivity,
    praiseUser,
    assignTaskToUser,
};
