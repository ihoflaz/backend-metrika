import mongoose from 'mongoose';

const achievementSchema = mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        howTo: {
            type: String,
        },
        icon: {
            type: String, // Lucide icon name
            default: 'Trophy',
        },
        xp: {
            type: Number,
            default: 50,
        },
        color: {
            type: String,
            default: 'green',
        },
        requirement: {
            type: Number,
            default: 1,
        },
        type: {
            type: String,
            enum: ['tasks', 'streak', 'level', 'projects', 'documents'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
