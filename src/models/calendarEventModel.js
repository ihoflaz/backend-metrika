import mongoose from 'mongoose';

const calendarEventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ['meeting', 'deadline', 'task', 'reminder', 'other'],
            default: 'task',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        allDay: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: 'blue',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attendees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        location: {
            type: String,
        },
        meetingUrl: {
            type: String,
        },
        reminders: [{
            time: Number, // minutes before
            sent: { type: Boolean, default: false }
        }],
    },
    {
        timestamps: true,
    }
);

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

export default CalendarEvent;
