import Project from '../models/projectModel.js';
import User from '../models/userModel.js';

// @desc    Get all projects
// @route   GET /projects?:search=&status=&methodology=&page=&limit=
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
        .populate('members', 'name avatar email role department');

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
        manager: req.user._id, // Current user is manager
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
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.status = req.body.status || project.status;
        project.progress = req.body.progress || project.progress;
        project.budgetUsed = req.body.budgetUsed || project.budgetUsed;
        // Add other fields as needed

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

// @desc    Get project stats (for dashboard or list)
// @route   GET /projects/stats
// @access  Private
const getProjectStats = async (req, res) => {
    // Example aggregation
    const total = await Project.countDocuments();
    const active = await Project.countDocuments({ status: 'Active' });
    const completed = await Project.countDocuments({ status: 'Completed' });
    const atRisk = await Project.countDocuments({ status: 'At Risk' });

    res.json({ total, active, completed, atRisk });
};

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats
};
