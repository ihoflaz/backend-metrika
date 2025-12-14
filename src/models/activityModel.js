import mongoose from 'mongoose';

const activitySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
        action: {
            type: String, // e.g., "created task", "commented", "earned badge"
            required: true,
        },
        type: {
            type: String,
            enum: ['create', 'comment', 'approval', 'update', 'gamification'],
            default: 'update',
        },
        content: {
            type: String, // detailed content like comment text
        },
        xpEarned: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
