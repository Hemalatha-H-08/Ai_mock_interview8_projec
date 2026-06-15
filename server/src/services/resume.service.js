import * as pdfParseModule from 'pdf-parse';
import Resume from '../models/Resume.models.js';
import { isDatabaseConnected } from '../config/db.config.js';
import { demoStore, createDemoId } from '../utils/demoStore.js';

// Get parser export from the module (pdf-parse exports a class in this version)
const PDFParse = pdfParseModule.PDFParse || pdfParseModule.default?.PDFParse || pdfParseModule.default;

const parsePdfBuffer = async (buffer) => {
  if (!PDFParse) {
    throw new Error('PDF parser export not found. Ensure pdf-parse is installed.');
  }

  if (typeof PDFParse === 'function') {
    const parser = new PDFParse({ data: Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer) });

    if (typeof parser.getText !== 'function') {
      throw new Error('PDFParse class does not expose getText().');
    }

    const result = await parser.getText();
    if (typeof parser.destroy === 'function') {
      await parser.destroy();
    }
    return result;
  }

  throw new Error('Unsupported pdf-parse export format.');
};

export const parseResumePDF = async (buffer) => {
  try {
    if (!buffer) {
      throw new Error('No buffer provided. File may not have been uploaded.');
    }

    if (!PDFParse || typeof PDFParse !== 'function') {
      throw new Error('PDF parser function not found. Ensure pdf-parse is properly installed.');
    }

    console.log('[Resume] Parsing PDF:', { bufferSize: buffer.length, bufferType: Buffer.isBuffer(buffer) });

    console.log('[Resume] Extracting text from PDF...');
    const result = await parsePdfBuffer(buffer);

    console.log('[Resume] PDF parsed successfully. Result type:', typeof result, 'has text:', !!result?.text);

    // Handle the result - pdf-parse returns an object with .text property
    const extractedText = (result?.text || result?.pages?.[0]?.text || result || '')
      .toString()
      .trim()
      .substring(0, 50000); // Limit to 50KB to prevent storage issues

    if (!extractedText || extractedText.length === 0) {
      throw new Error('No text could be extracted from the PDF. The file may be empty, corrupted, or contains only images.');
    }

    console.log('[Resume] Text extracted successfully:', { textLength: extractedText.length });
    return extractedText;
  } catch (error) {
    console.error('[Resume] PDF parsing error:', error.message, error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

export const saveResume = async (userId, fileName, extractedText) => {
  try {
    if (!isDatabaseConnected()) {
      const resume = {
        _id: createDemoId(),
        userId: String(userId),
        fileName,
        extractedText,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      demoStore.resumes.set(String(userId), resume);
      return resume;
    }

    // Remove any existing resume for the user
    await Resume.findOneAndDelete({ userId });

    // Create new resume
    const resume = new Resume({
      userId,
      fileName,
      extractedText,
    });

    await resume.save();
    return resume;
  } catch (error) {
    throw new Error(`Failed to save resume: ${error.message}`);
  }
};

export const getUserResume = async (userId) => {
  try {
    if (!isDatabaseConnected()) {
      return demoStore.resumes.get(String(userId)) || null;
    }
    return await Resume.findOne({ userId });
  } catch (error) {
    throw new Error(`Failed to get resume: ${error.message}`);
  }
};