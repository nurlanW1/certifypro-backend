/**
 * PDF Helpers
 * 
 * This module provides helper functions for PDF generation using pdf-lib and svg-to-pdfkit
 * 
 * References:
 * - https://github.com/Hopding/pdf-lib
 * - https://github.com/alafr/SVG-to-PDFKit
 */

const { PDFDocument: PDFLibDocument, rgb, StandardFonts } = require("pdf-lib");
const PDFKitDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Create a PDF document using pdf-lib
 * @param {Object} options - PDF creation options
 * @returns {Promise<Uint8Array>} Promise that resolves with PDF bytes
 */
async function createPDFWithPDFLib(options = {}) {
  const {
    pages = [{ width: 595, height: 842 }], // Default A4 size
    content = []
  } = options;

  const pdfDoc = await PDFLibDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add pages
  for (const pageConfig of pages) {
    const page = pdfDoc.addPage([pageConfig.width, pageConfig.height]);

    // Add content to page
    for (const item of content) {
      if (item.type === 'text') {
        page.drawText(item.text, {
          x: item.x || 50,
          y: item.y || 50,
          size: item.size || 12,
          font: item.font || helvetica,
          color: item.color || rgb(0, 0, 0),
        });
      } else if (item.type === 'rectangle') {
        page.drawRectangle({
          x: item.x || 50,
          y: item.y || 50,
          width: item.width || 100,
          height: item.height || 100,
          color: item.color || rgb(0, 0, 0),
          borderColor: item.borderColor,
          borderWidth: item.borderWidth || 0,
        });
      } else if (item.type === 'image' && item.imageBytes) {
        const image = await pdfDoc.embedPng(item.imageBytes);
        page.drawImage(image, {
          x: item.x || 50,
          y: item.y || 50,
          width: item.width || image.width,
          height: item.height || image.height,
        });
      }
    }
  }

  return pdfDoc.save();
}

/**
 * Add SVG to PDFKit document
 * @param {Object} doc - PDFKit document instance
 * @param {string} svgString - SVG string content
 * @param {Object} options - SVG options (x, y, width, height)
 */
function addSVGToPDFKit(doc, svgString, options = {}) {
  const {
    x = 0,
    y = 0,
    width,
    height
  } = options;

  try {
    SVGtoPDF(doc, svgString, x, y, {
      width: width,
      height: height
    });
  } catch (error) {
    console.error('Error adding SVG to PDFKit:', error);
    throw error;
  }
}

/**
 * Create PDF with SVG content using PDFKit and svg-to-pdfkit
 * @param {Object} options - PDF creation options
 * @returns {Promise<Buffer>} Promise that resolves with PDF buffer
 */
async function createPDFWithSVG(options = {}) {
  return new Promise((resolve, reject) => {
    const {
      size = 'A4',
      layout = 'portrait',
      svgContent = '',
      svgOptions = {}
    } = options;

    const doc = new PDFKitDocument({
      size: size,
      layout: layout,
      margins: { top: 0, left: 0, right: 0, bottom: 0 }
    });

    const chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    doc.on('error', (error) => {
      reject(error);
    });

    // Add SVG content
    if (svgContent) {
      addSVGToPDFKit(doc, svgContent, svgOptions);
    }

    doc.end();
  });
}

/**
 * Merge multiple PDFs using pdf-lib
 * @param {Array<Uint8Array>} pdfBytesArray - Array of PDF bytes
 * @returns {Promise<Uint8Array>} Promise that resolves with merged PDF bytes
 */
async function mergePDFs(pdfBytesArray) {
  const mergedPdf = await PDFLibDocument.create();

  for (const pdfBytes of pdfBytesArray) {
    const pdf = await PDFLibDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

/**
 * Extract pages from PDF using pdf-lib
 * @param {Uint8Array} pdfBytes - PDF file bytes
 * @param {Array<number>} pageIndices - Array of page indices to extract
 * @returns {Promise<Uint8Array>} Promise that resolves with extracted PDF bytes
 */
async function extractPDFPages(pdfBytes, pageIndices) {
  const sourcePdf = await PDFLibDocument.load(pdfBytes);
  const pdfDoc = await PDFLibDocument.create();
  const pages = await pdfDoc.copyPages(sourcePdf, pageIndices);
  pages.forEach((page) => pdfDoc.addPage(page));
  return pdfDoc.save();
}

/**
 * Embed font in PDF using pdf-lib
 * @param {Object} pdfDoc - PDFDocument instance
 * @param {string} fontPath - Path to font file
 * @returns {Promise<Object>} Promise that resolves with embedded font
 */
async function embedFontInPDF(pdfDoc, fontPath) {
  const fontBytes = fs.readFileSync(fontPath);
  return pdfDoc.embedFont(fontBytes);
}

module.exports = {
  createPDFWithPDFLib,
  addSVGToPDFKit,
  createPDFWithSVG,
  mergePDFs,
  extractPDFPages,
  embedFontInPDF
};
