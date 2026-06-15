import * as resumeService from '../services/resume.service.js';

export const uploadResume = async (req, res, next) => {
  try {
    console.log('[Resume Upload] Starting upload:', {
      hasFile: !!req.file,
      fileSize: req.file?.size,
      mimetype: req.file?.mimetype,
      originalName: req.file?.originalname,
      userId: req.user?._id
    });

    if (!req.file) {
      console.log('[Resume Upload] No file provided');
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded. Please select a PDF.' 
      });
    }

    if (!req.file.buffer) {
      console.log('[Resume Upload] File has no buffer');
      return res.status(400).json({ 
        success: false, 
        message: 'File uploaded but no data received. Please try again.' 
      });
    }

    console.log('[Resume Upload] Parsing PDF...');
    const extractedText = await resumeService.parseResumePDF(req.file.buffer);
    console.log('[Resume Upload] PDF parsed successfully');

    console.log('[Resume Upload] Saving resume...');
    const resume = await resumeService.saveResume(
      req.user._id,
      req.file.originalname,
      extractedText
    );
    console.log('[Resume Upload] Resume saved successfully');

    return res.json({
      success: true,
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        preview: extractedText.substring(0, 500),
        text: extractedText,
      },
    });
  } catch (error) {
    console.error('[Resume Upload] Failed:', {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getUserResume(req.user._id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'No resume found. Please upload one.' });
    }

    return res.json({
      success: true,
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        preview: resume.extractedText.substring(0, 500),
        text: resume.extractedText,
      },
    });
  } catch (error) {
    next(error);
  }
};