import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'], // 'Blocked' added per analysis
            default: 'Todo',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium',
        },
        order: {
            type: Number,
            default: 0,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        sprint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sprint',
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        dueDate: {
            type: Date,
        },
        estimatedHours: {
            type: Number,
            default: 0,
        },
        loggedHours: {
            type: Number,
            default: 0,
        },
        tags: [String],
        attachments: [
            {
                name: String,
                url: String, // or path
                type: String,
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
