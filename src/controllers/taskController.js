import Task from '../models/taskModel.js';
import Activity from '../models/activityModel.js';
import Project from '../models/projectModel.js';
import User from '../models/userModel.js';

// @desc    Get all tasks
// @route   GET /tasks
// @access  Private
const getTasks = async (req, res) => {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
        ? {
            title: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {};

    const filter = { ...keyword };
    if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;
    if (req.query.priority && req.query.priority !== 'All') filter.priority = req.query.priority;
    if (req.query.projectId) filter.project = req.query.projectId;

    // Date range filter for calendar
    if (req.query.dueDate_start && req.query.dueDate_end) {
        filter.dueDate = {
            $gte: new Date(req.query.dueDate_start),
            $lte: new Date(req.query.dueDate_end)
        };
    }

    const count = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .populate('assignee', 'name avatar')
        .populate('project', 'title color')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ tasks, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc    Get single task
// @route   GET /tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id)
        .populate('assignee', 'name avatar')
        .populate('project', 'title color');

    if (task) {
        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Create a task
// @route   POST /tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, status, priority, projectId, assigneeId, dueDate, estimatedHours, tags } = req.body;

    // Get max order for the column to append
    const maxOrderTask = await Task.findOne({ project: projectId, status }).sort({ order: -1 });
    const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = new Task({
        title,
        description,
        status,
        priority,
        project: projectId,
        assignee: assigneeId,
        dueDate,
        estimatedHours,
        loggedHours: 0,
        tags,
        order
    });

    const createdTask = await task.save();

    await Activity.create({
        user: req.user._id,
        project: projectId,
        task: createdTask._id,
        action: 'created task',
        type: 'create',
        content: `Created task ${createdTask.title}`,
        xpEarned: 10
    });

    // Award XP
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 10 } });

    res.status(201).json(createdTask);
};

// @desc    Update task
// @route   PATCH /tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        const oldStatus = task.status;
        Object.assign(task, req.body);
        if (req.body.assigneeId) task.assignee = req.body.assigneeId;

        const updatedTask = await task.save();

        // If task completed, award XP
        if (oldStatus !== 'Done' && updatedTask.status === 'Done') {
            const xpAmount = updatedTask.priority === 'Urgent' ? 50 :
                updatedTask.priority === 'High' ? 30 :
                    updatedTask.priority === 'Medium' ? 20 : 10;
            await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpAmount } });

            await Activity.create({
                user: req.user._id,
                project: task.project,
                task: task._id,
                action: 'completed task',
                type: 'complete',
                content: `Completed task ${task.title}`,
                xpEarned: xpAmount
            });
        }

        res.json(updatedTask);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Update task status
// @route   PATCH /tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
        task.status = status;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Get task comments
// @route   GET /tasks/:id/comments
// @access  Private
const getTaskComments = async (req, res) => {
    const activities = await Activity.find({
        task: req.params.id,
        type: 'comment'
    })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });

    res.json(activities);
};

// @desc    Add task comment
// @route   POST /tasks/:id/comments
// @access  Private
const addTaskComment = async (req, res) => {
    const { content } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const comment = await Activity.create({
        user: req.user._id,
        task: req.params.id,
        project: task.project,
        action: 'commented',
        type: 'comment',
        content,
        xpEarned: 5
    });

    // Award XP for commenting
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 5 } });

    await comment.populate('user', 'name avatar');

    res.status(201).json(comment);
};

// @desc    Get task activity timeline
// @route   GET /tasks/:id/activity
// @access  Private
const getTaskActivity = async (req, res) => {
    const activities = await Activity.find({ task: req.params.id })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });

    res.json(activities);
};

// @desc    Get time logs for task
// @route   GET /tasks/:id/time-logs
// @access  Private
const getTaskTimeLogs = async (req, res) => {
    const activities = await Activity.find({
        task: req.params.id,
        type: 'time_log'
    }).populate('user', 'name avatar').sort({ createdAt: -1 });

    res.json(activities);
};

// @desc    Add time log
// @route   POST /tasks/:id/time-logs
// @access  Private
const addTaskTimeLog = async (req, res) => {
    const { hours, description } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    task.loggedHours = (task.loggedHours || 0) + hours;
    await task.save();

    const log = await Activity.create({
        user: req.user._id,
        task: req.params.id,
        project: task.project,
        action: 'logged time',
        type: 'time_log',
        content: description || `Logged ${hours} hours`,
    });

    res.status(201).json({ log, newTotal: task.loggedHours });
};

// @desc    Get KPI impact
// @route   GET /tasks/:id/kpi-impact
// @access  Private
const getTaskKpiImpact = async (req, res) => {
    // Mock KPI impact data
    res.json([
        { name: 'Sprint Velocity', impact: '+2%' },
        { name: 'On-Time Delivery', impact: '+1.5%' },
        { name: 'Team Productivity', impact: '+0.5%' },
    ]);
};

// @desc    Get AI suggestions for task
// @route   GET /tasks/:id/ai-suggestions
// @access  Private
const getTaskAiSuggestions = async (req, res) => {
    // Mock AI suggestions
    res.json([
        { id: '1', text: 'Raporunuza rakip kampanyalarla karşılaştırmalı analiz ekleyebilirsiniz.', priority: 'medium' },
        { id: '2', text: 'Görsel materyaller eklemek etkileşimi artırabilir.', priority: 'low' },
    ]);
};

// @desc    Add attachment to task
// @route   POST /tasks/:id/attachments
// @access  Private
const addTaskAttachment = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Assuming file is uploaded via middleware
    if (req.file) {
        if (!task.attachments) task.attachments = [];
        task.attachments.push({
            name: req.file.originalname,
            path: req.file.path,
            type: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date()
        });
        await task.save();
    }

    res.json(task);
};

// @desc    Create bulk tasks from analysis
// @route   POST /tasks/bulk
// @access  Private
const createBulkTasks = async (req, res) => {
    const { tasks: taskList, projectId, assigneeId } = req.body;

    const createdTasks = [];
    for (const taskData of taskList) {
        const task = await Task.create({
            title: taskData.title,
            description: taskData.description || 'Doküman analizinden oluşturuldu',
            status: 'Todo',
            priority: taskData.priority || 'Medium',
            project: projectId,
            assignee: assigneeId || req.user._id,
            dueDate: taskData.dueDate,
        });
        createdTasks.push(task);
    }

    res.status(201).json({ message: `${createdTasks.length} tasks created`, tasks: createdTasks });
};

// @desc    Reorder tasks (Drag & Drop)
// @route   PATCH /projects/:id/tasks/reorder
// @access  Private
const reorderTasks = async (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
        res.status(400);
        throw new Error('Invalid items array');
    }

    const bulkOps = items.map(item => ({
        updateOne: {
            filter: { _id: item.id },
            update: { $set: { order: item.order, status: item.status } }
        }
    }));

    if (bulkOps.length > 0) {
        await Task.bulkWrite(bulkOps);
    }

    res.json({ message: 'Tasks reordered' });
};

// @desc    Get task stats
// @route   GET /tasks/stats/by-status
// @access  Private
const getTaskStats = async (req, res) => {
    const total = await Task.countDocuments();
    const todo = await Task.countDocuments({ status: 'Todo' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const review = await Task.countDocuments({ status: 'Review' });
    const done = await Task.countDocuments({ status: 'Done' });

    res.json({ total, todo, inProgress, review, done });
};

// ================== MULTI-LINKING ENDPOINTS ==================

// @desc    Link task to additional project
// @route   POST /tasks/:id/projects/:projectId
// @access  Private
const linkTaskToProject = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const projectId = req.params.projectId;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Initialize projects array if needed
    if (!task.projects) task.projects = [];

    // Check if already linked
    if (task.project.toString() === projectId ||
        task.projects.some(p => p.toString() === projectId)) {
        res.status(400);
        throw new Error('Task is already linked to this project');
    }

    task.projects.push(projectId);
    await task.save();

    await task.populate('projects', 'title color');

    res.json({
        message: 'Task linked to project',
        linkedProjects: [task.project, ...task.projects]
    });
};

// @desc    Unlink task from project
// @route   DELETE /tasks/:id/projects/:projectId
// @access  Private
const unlinkTaskFromProject = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const projectId = req.params.projectId;

    // Cannot unlink from main project
    if (task.project.toString() === projectId) {
        res.status(400);
        throw new Error('Cannot unlink from main project. Delete the task instead.');
    }

    // Remove from projects array
    if (task.projects) {
        task.projects = task.projects.filter(p => p.toString() !== projectId);
        await task.save();
    }

    res.json({ message: 'Task unlinked from project' });
};

// @desc    Link document to task
// @route   POST /tasks/:id/documents/:documentId
// @access  Private
const linkDocumentToTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const documentId = req.params.documentId;

    // Initialize documents array if needed
    if (!task.documents) task.documents = [];

    // Check if already linked
    if (task.documents.some(d => d.toString() === documentId)) {
        res.status(400);
        throw new Error('Document is already linked to this task');
    }

    task.documents.push(documentId);
    await task.save();

    await task.populate('documents', 'name type size path');

    res.json({
        message: 'Document linked to task',
        linkedDocuments: task.documents
    });
};

// @desc    Unlink document from task
// @route   DELETE /tasks/:id/documents/:documentId
// @access  Private
const unlinkDocumentFromTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const documentId = req.params.documentId;

    if (task.documents) {
        task.documents = task.documents.filter(d => d.toString() !== documentId);
        await task.save();
    }

    res.json({ message: 'Document unlinked from task' });
};

// @desc    Get task's linked documents
// @route   GET /tasks/:id/documents
// @access  Private
const getTaskDocuments = async (req, res) => {
    const task = await Task.findById(req.params.id)
        .populate('documents', 'name type size path uploadDate uploader');

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.json(task.documents || []);
};

// @desc    Get task's linked projects
// @route   GET /tasks/:id/projects
// @access  Private
const getTaskProjects = async (req, res) => {
    const task = await Task.findById(req.params.id)
        .populate('project', 'title color progress status')
        .populate('projects', 'title color progress status');

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Combine main project with additional projects
    const allProjects = [task.project, ...(task.projects || [])];

    res.json(allProjects);
};

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskComments,
    addTaskComment,
    getTaskActivity,
    getTaskTimeLogs,
    addTaskTimeLog,
    getTaskKpiImpact,
    getTaskAiSuggestions,
    addTaskAttachment,
    createBulkTasks,
    getTaskStats,
    reorderTasks,
    // Multi-linking
    linkTaskToProject,
    unlinkTaskFromProject,
    linkDocumentToTask,
    unlinkDocumentFromTask,
    getTaskDocuments,
    getTaskProjects
};

