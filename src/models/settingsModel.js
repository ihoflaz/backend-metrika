import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        notifications: {
            email: { type: Boolean, default: true },
            desktop: { type: Boolean, default: true },
            taskAssignments: { type: Boolean, default: true },
            deadlineReminders: { type: Boolean, default: false },
            weeklyReport: { type: Boolean, default: false },
            mentionAlerts: { type: Boolean, default: true },
            projectUpdates: { type: Boolean, default: true },
        },
        preferences: {
            language: { type: String, default: 'tr' },
            timezone: { type: String, default: 'Europe/Istanbul' },
            theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
            dateFormat: { type: String, default: 'DD/MM/YYYY' },
        },
    },
    {
        timestamps: true,
    }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
