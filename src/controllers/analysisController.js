import Analysis from '../models/analysisModel.js';
import Document from '../models/documentModel.js';
import Task from '../models/taskModel.js';
import crypto from 'crypto';

// @desc    Get all analyses
// @route   GET /analyses
// @access  Private
const getAnalyses = async (req, res) => {
    const { documentId, status } = req.query;

    let filter = {};
    if (documentId) filter.document = documentId;
    if (status) filter.status = status;

    const analyses = await Analysis.find(filter)
        .populate('document', 'name type size')
        .populate('createdBy', 'name avatar')
        .sort({ createdAt: -1 });

    res.json(analyses);
};

// @desc    Get single analysis
// @route   GET /analyses/:id
// @access  Private
const getAnalysisById = async (req, res) => {
    const analysis = await Analysis.findById(req.params.id)
        .populate('document')
        .populate('createdBy', 'name avatar')
        .populate('sharedWith', 'name email');

    if (analysis) {
        res.json(analysis);
    } else {
        res.status(404);
        throw new Error('Analysis not found');
    }
};

// @desc    Save/update analysis
// @route   PATCH /analyses/:id/save
// @access  Private
const saveAnalysis = async (req, res) => {
    const analysis = await Analysis.findById(req.params.id);

    if (analysis) {
        analysis.savedAt = new Date();
        if (req.body.userActions) {
            analysis.userActions = req.body.userActions;
        }
        await analysis.save();
        res.json({ message: 'Analysis saved', analysis });
    } else {
        res.status(404);
        throw new Error('Analysis not found');
    }
};

// @desc    Share analysis
// @route   POST /analyses/:id/share
// @access  Private
const shareAnalysis = async (req, res) => {
    const { userIds, emails } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (analysis) {
        if (userIds && userIds.length > 0) {
            analysis.sharedWith = [...new Set([...analysis.sharedWith, ...userIds])];
        }
        await analysis.save();

        // TODO: Send email notifications if emails provided

        res.json({ message: 'Analysis shared successfully' });
    } else {
        res.status(404);
        throw new Error('Analysis not found');
    }
};

// @desc    Generate share link
// @route   POST /analyses/:id/generate-link
// @access  Private
const generateShareLink = async (req, res) => {
    const analysis = await Analysis.findById(req.params.id);

    if (analysis) {
        const token = crypto.randomBytes(16).toString('hex');
        analysis.shareLink = `${process.env.FRONTEND_URL || 'https://metrika.vercel.app'}/shared-analysis/${token}`;
        await analysis.save();

        res.json({ link: analysis.shareLink });
    } else {
        res.status(404);
        throw new Error('Analysis not found');
    }
};

// @desc    Mark action as task
// @route   PATCH /analyses/:id/actions/:actionId/mark-as-task
// @access  Private
const markActionAsTask = async (req, res) => {
    const { actionId } = req.params;
    const { projectId, assigneeId, priority, dueDate } = req.body;

    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
        res.status(404);
        throw new Error('Analysis not found');
    }

    // Find the action
    const action = analysis.suggestedActions.id(actionId) ||
        analysis.userActions.find(a => a._id.toString() === actionId);

    if (!action) {
        res.status(404);
        throw new Error('Action not found');
    }

    // Create task from action
    const task = await Task.create({
        title: action.title || action.text,
        description: `Doküman analizinden oluşturuldu`,
        status: 'Todo',
        priority: priority || action.priority || 'Medium',
        project: projectId,
        assignee: assigneeId || req.user._id,
        dueDate,
    });

    // Update action
    action.addedAsTask = true;
    action.taskId = task._id;
    await analysis.save();

    res.json({ message: 'Task created from action', task });
};

// @desc    Create tasks from all actions
// @route   POST /tasks/bulk
// @access  Private
const createBulkTasksFromAnalysis = async (req, res) => {
    const { analysisId, projectId, assigneeId } = req.body;

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
        res.status(404);
        throw new Error('Analysis not found');
    }

    const actionsToConvert = analysis.suggestedActions.filter(a => !a.addedAsTask);
    const createdTasks = [];

    for (const action of actionsToConvert) {
        const task = await Task.create({
            title: action.title,
            description: 'Doküman analizinden toplu oluşturuldu',
            status: 'Todo',
            priority: action.priority || 'Medium',
            project: projectId,
            assignee: assigneeId || req.user._id,
        });

        action.addedAsTask = true;
        action.taskId = task._id;
        createdTasks.push(task);
    }

    await analysis.save();

    res.status(201).json({
        message: `${createdTasks.length} tasks created`,
        tasks: createdTasks,
    });
};

export {
    getAnalyses,
    getAnalysisById,
    saveAnalysis,
    shareAnalysis,
    generateShareLink,
    markActionAsTask,
    createBulkTasksFromAnalysis,
};
