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
        goal: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Planning', 'Active', 'Completed', 'Cancelled'],
            default: 'Planning',
        },
        velocity: {
            type: Number,
            default: 0,
        },
        plannedPoints: {
            type: Number,
            default: 0,
        },
        completedPoints: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
