import Settings from '../models/settingsModel.js';
import { HelpArticle, SupportTicket } from '../models/helpModel.js';

// ============ SETTINGS ============

// @desc    Get user notification settings
// @route   GET /settings/notifications
// @access  Private
const getNotificationSettings = async (req, res) => {
    let settings = await Settings.findOne({ user: req.user._id });

    if (!settings) {
        // Create default settings
        settings = await Settings.create({ user: req.user._id });
    }

    res.json(settings.notifications);
};

// @desc    Update notification settings
// @route   PATCH /settings/notifications
// @access  Private
const updateNotificationSettings = async (req, res) => {
    let settings = await Settings.findOne({ user: req.user._id });

    if (!settings) {
        settings = new Settings({ user: req.user._id });
    }

    settings.notifications = { ...settings.notifications, ...req.body };
    await settings.save();

    res.json(settings.notifications);
};

// ============ HELP ============

// @desc    Search help articles
// @route   GET /help/search
// @access  Private
const searchHelp = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.json([]);
    }

    const articles = await HelpArticle.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
        ],
        isPublished: true,
    }).limit(10);

    res.json(articles);
};

// @desc    Get help articles by category
// @route   GET /help/articles
// @access  Private
const getHelpArticles = async (req, res) => {
    const { category } = req.query;

    let filter = { isPublished: true };
    if (category) {
        filter.category = category;
    }

    const articles = await HelpArticle.find(filter).sort({ order: 1 });
    res.json(articles);
};

// @desc    Get FAQ
// @route   GET /help/faq
// @access  Private
const getFAQ = async (req, res) => {
    const faqs = await HelpArticle.find({ category: 'faq', isPublished: true }).sort({ order: 1 });
    res.json(faqs);
};

// @desc    Create support ticket
// @route   POST /help/support-ticket
// @access  Private
const createSupportTicket = async (req, res) => {
    const { subject, message, category, priority } = req.body;

    const ticket = await SupportTicket.create({
        user: req.user._id,
        subject,
        message,
        category: category || 'question',
        priority: priority || 'medium',
    });

    res.status(201).json({
        message: 'Support ticket created successfully',
        ticket,
    });
};

export {
    getNotificationSettings,
    updateNotificationSettings,
    searchHelp,
    getHelpArticles,
    getFAQ,
    createSupportTicket,
};
