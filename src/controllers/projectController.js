import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';
import Document from '../models/documentModel.js';
import Sprint from '../models/sprintModel.js';
import User from '../models/userModel.js';

// @desc    Get all projects
// @route   GET /projects
// @access  Private
const getProjects = async (req, res) => {
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
    if (req.query.status && req.query.status !== 'All') {
        filter.status = req.query.status;
    }
    if (req.query.methodology && req.query.methodology !== 'All') {
        filter.methodology = req.query.methodology;
    }

    const count = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
        .populate('manager', 'name avatar')
        .populate('members', 'name avatar')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ projects, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc    Get single project
// @route   GET /projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('manager', 'name avatar email')
        .populate('members', 'name avatar email role department status');

    if (project) {
        res.json(project);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Create a project
// @route   POST /projects
// @access  Private
const createProject = async (req, res) => {
    const { title, description, startDate, endDate, methodology, budget, teamMemberIds, kpis, color } = req.body;

    const project = new Project({
        title,
        description,
        startDate,
        endDate,
        methodology,
        budget,
        budgetUsed: 0,
        color,
        members: teamMemberIds,
        manager: req.user._id,
        kpis: kpis || []
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
};

// @desc    Update a project
// @route   PATCH /projects/:id
// @access  Private
const updateProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        Object.assign(project, req.body);
        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Delete a project
// @route   DELETE /projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Get project stats
// @route   GET /projects/stats
// @access  Private
const getProjectStats = async (req, res) => {
    const total = await Project.countDocuments();
    const active = await Project.countDocuments({ status: 'Active' });
    const completed = await Project.countDocuments({ status: 'Completed' });
    const atRisk = await Project.countDocuments({ status: 'At Risk' });
    const onHold = await Project.countDocuments({ status: 'On Hold' });

    res.json({ total, active, completed, atRisk, onHold });
};

// @desc    Get project timeline
// @route   GET /projects/:id/timeline
// @access  Private
const getProjectTimeline = async (req, res) => {
    const project = await Project.findById(req.params.id);
    const sprints = await Sprint.find({ project: req.params.id }).sort({ startDate: 1 });

    // Build timeline phases from sprints or generate mock phases
    const phases = sprints.length > 0
        ? sprints.map((s, i) => ({
            id: s._id,
            name: s.name,
            startDate: s.startDate,
            endDate: s.endDate,
            status: s.status === 'Completed' ? 'completed' :
                s.status === 'Active' ? 'in-progress' : 'planned',
            progress: s.status === 'Completed' ? 100 :
                s.status === 'Active' ? 50 : 0
        }))
        : [
            { id: '1', name: 'Faz 1 - Planlama', status: 'completed', progress: 100 },
            { id: '2', name: 'Faz 2 - Tasarım', status: 'completed', progress: 100 },
            { id: '3', name: 'Faz 3 - Geliştirme', status: 'in-progress', progress: 60 },
            { id: '4', name: 'Faz 4 - Test', status: 'planned', progress: 0 },
        ];

    res.json({
        projectId: req.params.id,
        startDate: project?.startDate,
        endDate: project?.endDate,
        phases
    });
};

// @desc    Get project burndown chart data
// @route   GET /projects/:id/burndown
// @access  Private
const getProjectBurndown = async (req, res) => {
    // Mock burndown data
    const data = [
        { day: 'Gün 1', ideal: 100, actual: 100 },
        { day: 'Gün 2', ideal: 90, actual: 95 },
        { day: 'Gün 3', ideal: 80, actual: 85 },
        { day: 'Gün 4', ideal: 70, actual: 78 },
        { day: 'Gün 5', ideal: 60, actual: 65 },
        { day: 'Gün 6', ideal: 50, actual: 55 },
        { day: 'Gün 7', ideal: 40, actual: 48 },
        { day: 'Gün 8', ideal: 30, actual: 35 },
        { day: 'Gün 9', ideal: 20, actual: 25 },
        { day: 'Gün 10', ideal: 10, actual: 15 },
    ];

    res.json(data);
};

// @desc    Get project tasks
// @route   GET /projects/:id/tasks
// @access  Private
const getProjectTasks = async (req, res) => {
    const { grouped } = req.query;
    const tasks = await Task.find({ project: req.params.id })
        .populate('assignee', 'name avatar')
        .populate('project', 'title color')
        .populate('projects', 'title color')
        .populate('documents', 'name type size path')
        .populate('sprint', 'name status')
        .sort({ order: 1 });

    if (grouped === 'status') {
        const grouped = {
            'Todo': tasks.filter(t => t.status === 'Todo'),
            'In Progress': tasks.filter(t => t.status === 'In Progress'),
            'Review': tasks.filter(t => t.status === 'Review'),
            'Done': tasks.filter(t => t.status === 'Done'),
        };
        res.json(grouped);
    } else {
        res.json(tasks);
    }
};

// @desc    Get project members
// @route   GET /projects/:id/members
// @access  Private
const getProjectMembers = async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('members', 'name avatar email role department status')
        .populate('manager', 'name avatar email role');

    if (project) {
        res.json({
            manager: project.manager,
            members: project.members
        });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Add member to project
// @route   POST /projects/:id/members
// @access  Private
const addProjectMember = async (req, res) => {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
        if (!project.members.includes(userId)) {
            project.members.push(userId);
            await project.save();
        }
        res.json({ message: 'Member added', members: project.members });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Update member role in project
// @route   PATCH /projects/:id/members/:userId
// @access  Private
const updateProjectMember = async (req, res) => {
    // This could update the member's role within the project context
    res.json({ message: 'Member role updated' });
};

// @desc    Remove member from project
// @route   DELETE /projects/:id/members/:userId
// @access  Private
const removeProjectMember = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        project.members = project.members.filter(
            m => m.toString() !== req.params.userId
        );
        await project.save();
        res.json({ message: 'Member removed' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Get project documents
// @route   GET /projects/:id/documents
// @access  Private
const getProjectDocuments = async (req, res) => {
    const documents = await Document.find({ project: req.params.id })
        .populate('uploader', 'name avatar')
        .sort({ createdAt: -1 });
    res.json(documents);
};

// @desc    Get project KPIs
// @route   GET /projects/:id/kpis
// @access  Private
const getProjectKpis = async (req, res) => {
    const project = await Project.findById(req.params.id).select('kpis budget budgetUsed');

    if (project) {
        const tasks = await Task.find({ project: req.params.id });
        const completedTasks = tasks.filter(t => t.status === 'Done').length;
        const totalTasks = tasks.length;

        res.json({
            kpis: project.kpis,
            budgetUsage: project.budget > 0
                ? Math.round((project.budgetUsed / project.budget) * 100)
                : 0,
            budget: project.budget,
            budgetUsed: project.budgetUsed,
            taskCompletion: totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0,
            sprintVelocity: [
                { name: 'Sprint 1', planned: 20, actual: 18 },
                { name: 'Sprint 2', planned: 22, actual: 24 },
                { name: 'Sprint 3', planned: 25, actual: 22 },
            ]
        });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Add KPI to project
// @route   POST /projects/:id/kpis
// @access  Private
const addProjectKpi = async (req, res) => {
    const { name, target, unit } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
        project.kpis.push({ name, target, unit, current: 0 });
        await project.save();
        res.status(201).json(project.kpis);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
};

// @desc    Get project sprints
// @route   GET /projects/:id/sprints
// @access  Private
const getProjectSprints = async (req, res) => {
    const sprints = await Sprint.find({ project: req.params.id })
        .sort({ startDate: -1 });
    res.json(sprints);
};

// @desc    Create project sprint
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

// @desc    Get current sprint
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
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
    getProjectTimeline,
    getProjectBurndown,
    getProjectTasks,
    getProjectMembers,
    addProjectMember,
    updateProjectMember,
    removeProjectMember,
    getProjectDocuments,
    getProjectKpis,
    addProjectKpi,
    getProjectSprints,
    createProjectSprint,
    getCurrentSprint
};
