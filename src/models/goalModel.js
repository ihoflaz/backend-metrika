import mongoose from 'mongoose';

const goalSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        target: {
            type: Number,
            required: true,
        },
        current: {
            type: Number,
            default: 0,
        },
        unit: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            enum: ['revenue', 'project', 'team', 'quality'],
            default: 'project',
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['on-track', 'at-risk', 'behind', 'completed'],
            default: 'on-track',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isCustom: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for progress percentage
goalSchema.virtual('progress').get(function () {
    if (this.target > 0) {
        return Math.min(Math.round((this.current / this.target) * 100), 100);
    }
    return 0;
});

goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
