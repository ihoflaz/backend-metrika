import User from '../models/userModel.js';
import Activity from '../models/activityModel.js';

// @desc    Get gamification profile
// @route   GET /gamification/profile
// @access  Private
const getGamificationProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('level xp xpToNextLevel badges skills rank');
    const recentActivity = await Activity.find({ user: req.user._id, type: 'gamification' })
        .sort({ createdAt: -1 })
        .limit(5);

    // Calculate rank (mock logic or real count)
    const rank = await User.countDocuments({ xp: { $gt: user.xp } }) + 1;

    res.json({
        ...user.toJSON(),
        rank,
        recentActivity
    });
};

// @desc    Get leaderboard
// @route   GET /gamification/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    const period = req.query.period || 'all-time';
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Filter by period logic would go here if we had xp history tracking by date
    // For now, simpler implementation:

    const users = await User.find({})
        .sort({ xp: -1 })
        .limit(limit)
        .skip(limit * (page - 1))
        .select('name avatar role department xp level');

    res.json(users);
};

// @desc    Get badges
// @route   GET /gamification/badges
// @access  Private
const getBadges = async (req, res) => {
    // This could return all available badges, or just the user's badges
    // For now, let's return a static list of all possible badges + user earned status

    const allBadges = [
        { name: 'Proje Ustası', icon: 'Trophy', color: 'Yellow', description: '10 proje tamamla' },
        { name: 'Takım Lideri', icon: 'Users', color: 'Blue', description: '5 projede liderlik' },
        // ... add others from analysis
    ];

    const user = await User.findById(req.user._id);
    const userBadgeNames = user.badges.map(b => b.name);

    const badgesWithStatus = allBadges.map(b => ({
        ...b,
        earned: userBadgeNames.includes(b.name)
    }));

    res.json(badgesWithStatus);
};

export { getGamificationProfile, getLeaderboard, getBadges };
