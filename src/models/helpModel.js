import mongoose from 'mongoose';

const helpArticleSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['getting-started', 'projects', 'tasks', 'gamification', 'team', 'settings', 'faq'],
            required: true,
        },
        tags: [String],
        order: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const supportTicketSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['bug', 'feature', 'question', 'other'],
            default: 'question',
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved', 'closed'],
            default: 'open',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        responses: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            message: String,
            createdAt: { type: Date, default: Date.now },
        }],
    },
    {
        timestamps: true,
    }
);

export const HelpArticle = mongoose.model('HelpArticle', helpArticleSchema);
export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
