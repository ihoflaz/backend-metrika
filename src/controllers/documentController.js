import Document from '../models/documentModel.js';
import Analysis from '../models/analysisModel.js';
import User from '../models/userModel.js';

// @desc    Get documents
// @route   GET /documents
// @access  Private
const getDocuments = async (req, res) => {
    const filter = {};
    if (req.query.projectId) filter.project = req.query.projectId;
    if (req.query.analysisStatus) filter['analysis.status'] = req.query.analysisStatus;

    const documents = await Document.find(filter)
        .populate('uploader', 'name avatar')
        .populate('project', 'title')
        .sort({ createdAt: -1 });
    res.json(documents);
};

// @desc    Get single document
// @route   GET /documents/:id
// @access  Private
const getDocumentById = async (req, res) => {
    const doc = await Document.findById(req.params.id)
        .populate('uploader', 'name avatar')
        .populate('project', 'title');

    if (doc) {
        res.json(doc);
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
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
    const filePath = req.file.path; // Cloudinary URL

    const doc = new Document({
        name: req.file.originalname,
        project: projectId,
        uploader: req.user._id,
        type: req.file.originalname.split('.').pop().toUpperCase(),
        size: req.file.size ? `${(req.file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
        path: filePath
    });

    const createdDoc = await doc.save();

    // Award XP for document upload
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 10 } });

    res.status(201).json(createdDoc);
};

// @desc    Update document
// @route   PATCH /documents/:id
// @access  Private
const updateDocument = async (req, res) => {
    const doc = await Document.findById(req.params.id);

    if (doc) {
        Object.assign(doc, req.body);
        const updatedDoc = await doc.save();
        res.json(updatedDoc);
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
};

// @desc    Delete document
// @route   DELETE /documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
    const doc = await Document.findById(req.params.id);

    if (doc) {
        await doc.deleteOne();
        res.json({ message: 'Document removed' });
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
};

// @desc    Analyze document (triggers AI analysis)
// @route   POST /documents/:id/analyze
// @access  Private
const analyzeDocument = async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Create analysis record
    const analysis = new Analysis({
        document: doc._id,
        status: 'analyzing',
        createdBy: req.user._id,
    });
    await analysis.save();

    // Simulate AI analysis (would be async in production)
    setTimeout(async () => {
        analysis.status = 'completed';
        analysis.summary = 'Bu doküman detaylı bir teknik spesifikasyon içermektedir. Genel yapı tutarlı ve kapsamlı görünmektedir.';
        analysis.findings = [
            { type: 'positive', content: 'Gereksinimler net bir şekilde tanımlanmış.', page: 3 },
            { type: 'positive', content: 'Proje kapsamı iyi belirlenmiş.', page: 5 },
            { type: 'negative', content: 'Güvenlik gereksinimleri eksik.', page: 12 },
        ];
        analysis.risks = [
            { severity: 'high', content: 'Güvenlik açıkları risk oluşturabilir', page: 12 },
            { severity: 'medium', content: 'Zaman çizelgesi agresif görünüyor', page: 8 },
        ];
        analysis.suggestedActions = [
            { title: 'Güvenlik denetimi yaptır', priority: 'high', canCreateTask: true },
            { title: 'Zaman çizelgesini gözden geçir', priority: 'medium', canCreateTask: true },
            { title: 'Paydaşlarla onay toplantısı düzenle', priority: 'low', canCreateTask: true },
        ];
        analysis.tags = ['teknik', 'spesifikasyon', 'proje-planı'];
        analysis.aiModel = 'gpt-4';
        analysis.confidence = 87;
        analysis.analyzedAt = new Date();
        await analysis.save();
    }, 3000);

    // Award XP for triggering analysis
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 15 } });

    res.json({
        message: 'Analysis started',
        analysisId: analysis._id,
        status: 'analyzing'
    });
};

// @desc    Get document analysis
// @route   GET /documents/:id/analysis
// @access  Private
const getDocumentAnalysis = async (req, res) => {
    const analysis = await Analysis.findOne({ document: req.params.id })
        .populate('document', 'name type size path')
        .sort({ createdAt: -1 });

    if (analysis) {
        res.json(analysis);
    } else {
        res.status(404);
        throw new Error('Analysis not found');
    }
};

// @desc    Get document statistics
// @route   GET /documents/stats
// @access  Private
const getDocumentStats = async (req, res) => {
    const total = await Document.countDocuments();

    // Count by analysis status
    const analyzed = await Document.countDocuments({ 'analysis.status': 'completed' });

    // Count by type
    const pdfCount = await Document.countDocuments({ type: 'PDF' });
    const docxCount = await Document.countDocuments({ type: 'DOCX' });
    const xlsxCount = await Document.countDocuments({ type: 'XLSX' });
    const pptxCount = await Document.countDocuments({ type: 'PPTX' });
    const txtCount = await Document.countDocuments({ type: 'TXT' });
    const otherCount = total - pdfCount - docxCount - xlsxCount - pptxCount - txtCount;

    res.json({
        total,
        analyzed,
        pending: total - analyzed,
        byType: {
            pdf: pdfCount,
            docx: docxCount,
            xlsx: xlsxCount,
            pptx: pptxCount,
            txt: txtCount,
            other: otherCount > 0 ? otherCount : 0
        }
    });
};

export {
    getDocuments,
    getDocumentById,
    uploadDocument,
    updateDocument,
    deleteDocument,
    analyzeDocument,
    getDocumentAnalysis,
    getDocumentStats
};
