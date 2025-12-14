import Notification from '../models/notificationModel.js';

// @desc    Get user notifications
// @route   GET /notifications
// @access  Private
const getNotifications = async (req, res) => {
    const pageSize = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const isRead = req.query.isRead;

    const filter = { recipient: req.user._id };
    if (isRead !== undefined && isRead !== '') {
        filter.isRead = isRead === 'true';
    }

    const count = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ notifications, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc    Get unread count
// @route   GET /notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    const count = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false
    });
    res.json({ count });
};

// @desc    Mark as read
// @route   PATCH /notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification && notification.recipient.toString() === req.user._id.toString()) {
        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
};

// @desc    Mark all as read
// @route   PATCH /notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read' });
};

export { getNotifications, getUnreadCount, markAsRead, markAllAsRead };
