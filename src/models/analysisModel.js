import mongoose from 'mongoose';

const analysisSchema = mongoose.Schema(
    {
        document: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'analyzing', 'completed', 'failed'],
            default: 'pending',
        },
        summary: {
            type: String,
        },
        findings: [{
            type: { type: String }, // 'positive' or 'negative'
            content: String,
            page: Number,
        }],
        risks: [{
            severity: {
                type: String,
                enum: ['low', 'medium', 'high', 'critical'],
            },
            content: String,
            page: Number,
            section: String,
        }],
        suggestedActions: [{
            title: String,
            priority: {
                type: String,
                enum: ['low', 'medium', 'high'],
            },
            canCreateTask: { type: Boolean, default: true },
            addedAsTask: { type: Boolean, default: false },
            taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        }],
        userActions: [{
            text: String,
            priority: {
                type: String,
                enum: ['low', 'medium', 'high'],
            },
            addedAsTask: { type: Boolean, default: false },
            taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        }],
        tags: [String],
        aiModel: {
            type: String,
            default: 'gpt-4',
        },
        confidence: {
            type: Number,
            min: 0,
            max: 100,
        },
        analyzedAt: {
            type: Date,
        },
        savedAt: {
            type: Date,
        },
        sharedWith: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        shareLink: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
