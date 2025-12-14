import mongoose from 'mongoose';

const documentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String, // PDF, DOCX, XLSX
            required: true,
        },
        size: {
            type: String, // e.g., "2.4 MB"
        },
        path: {
            type: String, // File path or URL
            required: true,
        },
        // AI Analysis Results
        analysis: {
            status: {
                type: String,
                enum: ['pending', 'processing', 'completed', 'failed'],
                default: 'pending',
            },
            summary: String,
            findings: [{ type: { type: String }, content: String }], // type: positive/negative
            risks: [{ severity: String, content: String, page: Number }],
            suggestedActions: [{ title: String, priority: String, canCreateTask: Boolean }],
            tags: [String]
        }
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
