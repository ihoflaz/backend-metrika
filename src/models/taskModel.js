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
            enum: ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'],
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
        // Multi-project support: main project + additional projects
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        // Additional linked projects (for multi-project tasks)
        projects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        }],
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
                url: String,
                type: String,
                size: Number,
                uploadedAt: { type: Date, default: Date.now }
            }
        ],
        // Linked documents
        documents: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
        }],
    },
    {
        timestamps: true,
    }
);

// Virtual for progress calculation
taskSchema.virtual('progress').get(function () {
    if (this.estimatedHours > 0) {
        return Math.min(Math.round((this.loggedHours / this.estimatedHours) * 100), 100);
    }
    return 0;
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
