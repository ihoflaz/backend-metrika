import mongoose from 'mongoose';

const sprintSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Planned', 'Active', 'Completed'],
            default: 'Planned',
        },
        goal: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
