// ============================================
// upload.middleware.js - Multer File Upload Config
// ============================================
// Configures multer to handle file uploads.
// Uses memory storage (stores file in buffer).
// Includes file size limits and type filtering.
// Reference: Middleware pattern - reference-backend.md
// ============================================

import multer from 'multer';

// Use memory storage - files are stored as Buffer in req.file.buffer
const storage = multer.memoryStorage();

// File filter for PDF resume uploads
const resumeFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
    'text/x-pdf'
  ];

  console.log('[Upload] Resume file validation:', {
    fileName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    fieldName: file.fieldname
  });

  // Check MIME type
  if (allowedMimeTypes.includes(file.mimetype)) {
    console.log('[Upload] ✅ Resume accepted - MIME type matched');
    cb(null, true);
  }
  // Also check file extension as fallback
  else if (file.originalname && file.originalname.toLowerCase().endsWith('.pdf')) {
    console.log('[Upload] ✅ Resume accepted - Extension matched (.pdf)');
    cb(null, true);
  } else {
    console.log('[Upload] ❌ Resume rejected - Invalid format. MIME:', file.mimetype, 'Extension:', file.originalname?.split('.').pop());
    cb(new Error('Only PDF files are allowed for resume upload.'), false);
  }
};

// File filter for audio uploads
const audioFilter = (req, file, cb) => {
  console.log('[Upload] Audio file validation:', {
    fileName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    fieldName: file.fieldname
  });

  if (file.mimetype.startsWith('audio/')) {
    console.log('[Upload] ✅ Audio accepted');
    cb(null, true);
  } else {
    console.log('[Upload] ❌ Audio rejected - Invalid format. MIME:', file.mimetype);
    cb(new Error('Only audio files are allowed.'), false);
  }
};

// Create upload middleware instances with size limits
// "resume" field for PDF resume uploads (max 10MB)
export const uploadResume = multer({
  storage,
  fileFilter: resumeFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('resume');

// "audio" field for voice recording uploads (max 25MB)
export const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
}).single('audio');
