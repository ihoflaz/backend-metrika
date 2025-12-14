import Document from '../models/documentModel.js';

// @desc    Get documents
// @route   GET /documents
// @access  Private
const getDocuments = async (req, res) => {
    const filter = {};
    if (req.query.projectId) filter.project = req.query.projectId;

    const documents = await Document.find(filter)
        .populate('uploader', 'name');
    res.json(documents);
};

// @desc    Upload document
// @route   POST /documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const { projectId } = req.body;

    // With Cloudinary storage, req.file contains `path` which is the secure_url from Cloudinary
    const filePath = req.file.path; // This is now the Cloudinary URL

    const doc = new Document({
        name: req.file.originalname,
        project: projectId,
        uploader: req.user._id,
        // Since Cloudinary might not provide mimetype in same way, we extract from originalname or use file info
        type: req.file.originalname.split('.').pop().toUpperCase(),
        size: req.file.size ? `${(req.file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown Size', // Size might not always be available immediately depending on storage engine versions
        path: filePath
    });

    const createdDoc = await doc.save();
    res.status(201).json(createdDoc);
};

// @desc    Analyze document (Mock AI)
// @route   POST /documents/:id/analyze
// @access  Private
const analyzeDocument = async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
        res.status(404);
        throw new Error('Document not found');
    }

    doc.analysis.status = 'processing';
    await doc.save();

    // Simulate AI delay
    setTimeout(async () => {
        doc.analysis.status = 'completed';
        doc.analysis.summary = 'This is a mocked AI summary of the document. It appears to be a technical specification.';
        doc.analysis.findings = [
            { type: 'positive', content: 'Clear requirements defined.' },
            { type: 'negative', content: 'Missing security outcomes.' }
        ];
        // ... more mock data
        await doc.save();
    }, 2000);

    res.json({ message: 'Analysis started', status: 'processing' });
};

export { getDocuments, uploadDocument, analyzeDocument };
