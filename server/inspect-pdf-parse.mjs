import * as pdfParseModule from 'pdf-parse';
console.log('top keys', Object.keys(pdfParseModule));
console.log('PDFParse prototype keys', Object.getOwnPropertyNames(pdfParseModule.PDFParse.prototype));
console.log('PDFParse static keys', Object.getOwnPropertyNames(pdfParseModule.PDFParse));
