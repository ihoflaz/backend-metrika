
// Mock controller for features not yet fully implemented

// @desc Search
// @route GET /search
export const searchGlobal = async (req, res) => {
    // Mock response
    res.json({
        projects: [],
        tasks: [],
        documents: [],
        users: []
    });
};

// @desc Get Help Articles
// @route GET /help/articles
export const getHelpArticles = async (req, res) => {
    res.json([
        { id: 1, title: 'Getting Started', category: 'General' },
        { id: 2, title: 'How to create a project', category: 'Projects' }
    ]);
};

// @desc Get Team Departments
// @route GET /team/departments
export const getDepartments = async (req, res) => {
    res.json(['Engineering', 'Design', 'Product', 'Marketing']);
};

// @desc Get Team Members
// @route GET /team/members
export const getTeamMembers = async (req, res) => {
    res.json([
        { id: 1, name: 'Hulusi', role: 'Admin', dept: 'Engineering', status: 'online' },
        { id: 2, name: 'Jane Doe', role: 'Member', dept: 'Design', status: 'busy' }
    ]);
};

// @desc Get KPIs
// @route GET /kpi/dashboard
export const getKpiDashboard = async (req, res) => {
    res.json({
        revenue: { total: 2450000, trend: 12.5 },
        projectSuccessRate: 94,
        avgCompletionTime: 14,
        activeIssues: 12
    });
};

// @desc Get Calendar Events
// @route GET /calendar/events
export const getCalendarEvents = async (req, res) => {
    res.json([
        { id: 1, title: 'Sprint Review', start: new Date(), type: 'meeting' }
    ]);
};

// @desc Get Unread Messages Count
// @route GET /messages/unread-count
export const getUnreadMessagesCount = async (req, res) => {
    res.json({ count: 3 });
};
