import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
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
            enum: ['Active', 'Completed', 'On Hold', 'At Risk'],
            default: 'Active',
        },
        methodology: {
            type: String,
            enum: ['Waterfall', 'Scrum', 'Hybrid'],
            default: 'Hybrid',
        },
        progress: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: { // mapped from dueDate
            type: Date,
            required: true,
        },
        budget: {
            type: Number,
            default: 0,
        },
        budgetUsed: {
            type: Number,
            default: 0,
        },
        color: {
            type: String,
            default: 'blue', // blue, purple, green, yellow, cyan, red
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        // Embed or reference KPIs? Requirement says GET /projects/:id/kpis
        // We can store generic KPIs here or separate model. Let's use separate model for complex KPIs, 
        // but maybe simple ones here?
        // Analysis says "KPI Definition" in Wizard.
        kpis: [{
            name: String,
            target: Number,
            unit: String,
            current: { type: Number, default: 0 }
        }]
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
