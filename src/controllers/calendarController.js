import CalendarEvent from '../models/calendarEventModel.js';

// @desc    Get calendar events
// @route   GET /calendar/events
// @access  Private
const getCalendarEvents = async (req, res) => {
    const { year, month, projectId } = req.query;

    let filter = {};

    if (year && month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        filter.startDate = { $gte: startDate, $lte: endDate };
    }

    if (projectId) {
        filter.project = projectId;
    }

    // Also include events where user is an attendee
    filter.$or = [
        { creator: req.user._id },
        { attendees: req.user._id }
    ];

    const events = await CalendarEvent.find(filter)
        .populate('project', 'title color')
        .populate('creator', 'name avatar')
        .populate('attendees', 'name avatar')
        .sort({ startDate: 1 });

    res.json(events);
};

// @desc    Create calendar event
// @route   POST /calendar/events
// @access  Private
const createCalendarEvent = async (req, res) => {
    const { title, description, type, startDate, endDate, allDay, color, projectId, attendees, location, meetingUrl } = req.body;

    const event = new CalendarEvent({
        title,
        description,
        type,
        startDate,
        endDate,
        allDay,
        color,
        project: projectId,
        attendees,
        location,
        meetingUrl,
        creator: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
};

// @desc    Get single calendar event
// @route   GET /calendar/events/:id
// @access  Private
const getCalendarEventById = async (req, res) => {
    const event = await CalendarEvent.findById(req.params.id)
        .populate('project', 'title color')
        .populate('creator', 'name avatar')
        .populate('attendees', 'name avatar');

    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
};

// @desc    Update calendar event
// @route   PATCH /calendar/events/:id
// @access  Private
const updateCalendarEvent = async (req, res) => {
    const event = await CalendarEvent.findById(req.params.id);

    if (event) {
        Object.assign(event, req.body);
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
};

// @desc    Delete calendar event
// @route   DELETE /calendar/events/:id
// @access  Private
const deleteCalendarEvent = async (req, res) => {
    const event = await CalendarEvent.findById(req.params.id);

    if (event) {
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
};

// @desc    Respond to calendar event (accept/decline)
// @route   PATCH /calendar/events/:id/respond
// @access  Private
const respondToCalendarEvent = async (req, res) => {
    const { response } = req.body; // 'accept' or 'decline'
    const event = await CalendarEvent.findById(req.params.id);

    if (event) {
        if (response === 'accept') {
            if (!event.attendees.includes(req.user._id)) {
                event.attendees.push(req.user._id);
            }
        } else if (response === 'decline') {
            event.attendees = event.attendees.filter(
                (id) => id.toString() !== req.user._id.toString()
            );
        }
        await event.save();
        res.json({ message: `Event ${response}ed` });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
};

export {
    getCalendarEvents,
    createCalendarEvent,
    getCalendarEventById,
    updateCalendarEvent,
    deleteCalendarEvent,
    respondToCalendarEvent,
};
