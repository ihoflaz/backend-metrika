import Sprint from '../models/sprintModel.js';
import Task from '../models/taskModel.js';

// @desc    Get sprint by ID
// @route   GET /sprints/:id
// @access  Private
const getSprintById = async (req, res) => {
    const sprint = await Sprint.findById(req.params.id)
        .populate('project', 'title');

    if (sprint) {
        // Get tasks in this sprint
        const tasks = await Task.find({ sprint: sprint._id })
            .populate('assignee', 'name avatar');

        res.json({
            ...sprint.toJSON(),
            tasks,
            taskCount: tasks.length,
            completedCount: tasks.filter(t => t.status === 'Done').length
        });
    } else {
        res.status(404);
        throw new Error('Sprint not found');
    }
};

// @desc    Update sprint
// @route   PATCH /sprints/:id
// @access  Private
const updateSprint = async (req, res) => {
    const sprint = await Sprint.findById(req.params.id);

    if (sprint) {
        Object.assign(sprint, req.body);
        const updatedSprint = await sprint.save();
        res.json(updatedSprint);
    } else {
        res.status(404);
        throw new Error('Sprint not found');
    }
};

// @desc    Start sprint
// @route   PATCH /sprints/:id/start
// @access  Private
const startSprint = async (req, res) => {
    const sprint = await Sprint.findById(req.params.id);

    if (sprint) {
        sprint.status = 'Active';
        sprint.startDate = new Date();
        await sprint.save();
        res.json({ message: 'Sprint started', sprint });
    } else {
        res.status(404);
        throw new Error('Sprint not found');
    }
};

// @desc    Complete sprint
// @route   PATCH /sprints/:id/complete
// @access  Private
const completeSprint = async (req, res) => {
    const sprint = await Sprint.findById(req.params.id);

    if (sprint) {
        sprint.status = 'Completed';
        sprint.endDate = new Date();

        // Calculate velocity based on completed tasks
        const completedTasks = await Task.countDocuments({
            sprint: sprint._id,
            status: 'Done'
        });
        sprint.completedPoints = completedTasks;

        await sprint.save();
        res.json({ message: 'Sprint completed', sprint });
    } else {
        res.status(404);
        throw new Error('Sprint not found');
    }
};

// @desc    Get sprints for a project
// @route   GET /projects/:id/sprints
// @access  Private
const getProjectSprints = async (req, res) => {
    const sprints = await Sprint.find({ project: req.params.id })
        .sort({ startDate: -1 });
    res.json(sprints);
};

// @desc    Create sprint for a project
// @route   POST /projects/:id/sprints
// @access  Private
const createProjectSprint = async (req, res) => {
    const { name, startDate, endDate, goal, plannedPoints } = req.body;

    const sprint = await Sprint.create({
        name,
        project: req.params.id,
        startDate,
        endDate,
        goal,
        plannedPoints,
        status: 'Planning'
    });

    res.status(201).json(sprint);
};

// @desc    Get current sprint for a project
// @route   GET /projects/:id/current-sprint
// @access  Private
const getCurrentSprint = async (req, res) => {
    const sprint = await Sprint.findOne({
        project: req.params.id,
        status: 'Active'
    });

    if (sprint) {
        const tasks = await Task.find({ sprint: sprint._id })
            .populate('assignee', 'name avatar');

        res.json({
            ...sprint.toJSON(),
            tasks,
            taskCount: tasks.length,
            completedCount: tasks.filter(t => t.status === 'Done').length,
            progress: tasks.length > 0
                ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100)
                : 0
        });
    } else {
        res.json(null);
    }
};

export {
    getSprintById,
    updateSprint,
    startSprint,
    completeSprint,
    getProjectSprints,
    createProjectSprint,
    getCurrentSprint
};
