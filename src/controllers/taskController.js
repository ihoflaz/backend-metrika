import Task from '../models/taskModel.js';
import Activity from '../models/activityModel.js';
import Project from '../models/projectModel.js';

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

    const count = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
        .sort({ order: 1, createdAt: -1 }) // Sort by order first
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
        content: `Created task ${createdTask.title}`
    });

    res.status(201).json(createdTask);
};

// @desc    Update task
// @route   PATCH /tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;
        task.priority = req.body.priority || task.priority;
        if (req.body.loggedHours) task.loggedHours = req.body.loggedHours;
        if (req.body.assigneeId) task.assignee = req.body.assigneeId;

        const updatedTask = await task.save();

        res.json(updatedTask);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Reorder tasks (Drag & Drop)
// @route   PATCH /projects/:id/tasks/reorder
// @access  Private
const reorderTasks = async (req, res) => {
    const { taskId, newStatus, newOrder, affectedTaskIds } = req.body;
    // Simplified logic: Client sends just the moved task and its new position, 
    // or the entire list of IDs for a column. 
    // Best practice for dnd-kit: Send the new array of IDs for the column.

    // Implementation based on: "items" array in body which is Array<{id, order, status}>
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
    const done = await Task.countDocuments({ status: 'Done' });

    res.json({ total, todo, inProgress, done });
};

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    getTaskStats,
    reorderTasks
};
