import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Vercel Serverless Function Handler
export default async function handler(req, res) {
    // Ensure DB is connected
    await connectDB();

    // Hand off to Express
    return app(req, res);
}
