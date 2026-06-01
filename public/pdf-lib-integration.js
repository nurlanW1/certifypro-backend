/**
 * PDF-lib Integration
 * 
 * This module provides PDF-lib integration for creating and modifying PDF documents
 * in the browser.
 * 
 * Reference: https://github.com/Hopding/pdf-lib
 * Documentation: https://pdf-lib.js.org/
 */

(function() {
  'use strict';

  /**
   * PDF-lib Manager
   * Handles PDF creation and modification in the browser
   */
  window.PDFLibManager = {
    /**
     * PDF-lib instance (loaded dynamically)
     */
    pdfLib: null,

    /**
     * Initialize PDF-lib
     * @returns {Promise<Object>} Promise that resolves with PDF-lib module
     */
    async init() {
      if (this.pdfLib) {
        return this.pdfLib;
      }

      // Check if PDF-lib is already loaded
      if (typeof window.PDFLib !== 'undefined') {
        this.pdfLib = window.PDFLib;
        return this.pdfLib;
      }

      // Load PDF-lib from CDN
      return new Promise((resolve, reject) => {
        // Check if script is already loading
        if (document.querySelector('script[src*="pdf-lib"]')) {
          // Wait for PDF-lib to be available
          const checkPDFLib = setInterval(() => {
            if (typeof window.PDFLib !== 'undefined') {
              clearInterval(checkPDFLib);
              this.pdfLib = window.PDFLib;
              resolve(this.pdfLib);
            }
          }, 100);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.PDFLib !== 'undefined') {
            this.pdfLib = window.PDFLib;
            resolve(this.pdfLib);
          } else {
            reject(new Error('PDF-lib failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load PDF-lib script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Get PDF-lib instance (initialize if needed)
     * @returns {Promise<Object>} Promise that resolves with PDF-lib module
     */
    async getInstance() {
      if (!this.pdfLib) {
        await this.init();
      }
      return this.pdfLib;
    },

    /**
     * Create a new PDF document
     * @param {Object} options - PDF document options
     * @returns {Promise<Object>} Promise that resolves with PDFDocument
     */
    async createPDF(options = {}) {
      const pdfLib = await this.getInstance();
      const { PDFDocument } = pdfLib;
      
      return PDFDocument.create();
    },

    /**
     * Load an existing PDF document
     * @param {Uint8Array|ArrayBuffer} pdfBytes - PDF file bytes
     * @param {Object} options - Load options
     * @returns {Promise<Object>} Promise that resolves with PDFDocument
     */
    async loadPDF(pdfBytes, options = {}) {
      const pdfLib = await this.getInstance();
      const { PDFDocument } = pdfLib;
      
      return PDFDocument.load(pdfBytes, options);
    },

    /**
     * Add a page to PDF document
     * @param {Object} pdfDoc - PDFDocument instance
     * @param {Object} options - Page options (width, height, etc.)
     * @returns {Object} PDFPage instance
     */
    async addPage(pdfDoc, options = {}) {
      return pdfDoc.addPage(options);
    },

    /**
     * Draw text on PDF page
     * @param {Object} page - PDFPage instance
     * @param {string} text - Text to draw
     * @param {Object} options - Text options (x, y, size, font, color, etc.)
     */
    async drawText(page, text, options = {}) {
      const {
        x = 50,
        y = 50,
        size = 12,
        font,
        color = { r: 0, g: 0, b: 0 },
        ...rest
      } = options;

      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: color.r !== undefined ? color : { r: 0, g: 0, b: 0 },
        ...rest
      });
    },

    /**
     * Draw rectangle on PDF page
     * @param {Object} page - PDFPage instance
     * @param {Object} options - Rectangle options
     */
    async drawRectangle(page, options = {}) {
      const {
        x = 50,
        y = 50,
        width = 100,
        height = 100,
        color = { r: 0, g: 0, b: 0 },
        borderColor,
        borderWidth = 0,
        ...rest
      } = options;

      if (borderWidth > 0 && borderColor) {
        page.drawRectangle({
          x,
          y,
          width,
          height,
          borderColor: borderColor.r !== undefined ? borderColor : { r: 0, g: 0, b: 0 },
          borderWidth,
          ...rest
        });
      } else {
        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: color.r !== undefined ? color : { r: 0, g: 0, b: 0 },
          ...rest
        });
      }
    },

    /**
     * Draw image on PDF page
     * @param {Object} pdfDoc - PDFDocument instance
     * @param {Object} page - PDFPage instance
     * @param {Uint8Array|ArrayBuffer|string} imageBytes - Image data or URL
     * @param {Object} options - Image options
     */
    async drawImage(pdfDoc, page, imageBytes, options = {}) {
      const {
        x = 50,
        y = 50,
        width,
        height,
        ...rest
      } = options;

      let image;
      
      // If imageBytes is a URL, fetch it first
      if (typeof imageBytes === 'string') {
        const response = await fetch(imageBytes);
        const arrayBuffer = await response.arrayBuffer();
        image = await pdfDoc.embedPng(arrayBuffer);
      } else {
        image = await pdfDoc.embedPng(imageBytes);
      }

      page.drawImage(image, {
        x,
        y,
        width,
        height,
        ...rest
      });
    },

    /**
     * Embed font in PDF document
     * @param {Object} pdfDoc - PDFDocument instance
     * @param {Uint8Array|ArrayBuffer} fontBytes - Font file bytes
     * @returns {Promise<Object>} Promise that resolves with PDFFont
     */
    async embedFont(pdfDoc, fontBytes) {
      return pdfDoc.embedFont(fontBytes);
    },

    /**
     * Save PDF document as bytes
     * @param {Object} pdfDoc - PDFDocument instance
     * @returns {Promise<Uint8Array>} Promise that resolves with PDF bytes
     */
    async savePDF(pdfDoc) {
      return pdfDoc.save();
    },

    /**
     * Download PDF document
     * @param {Object} pdfDoc - PDFDocument instance
     * @param {string} filename - Filename for download
     */
    async downloadPDF(pdfDoc, filename = 'document.pdf') {
      const pdfBytes = await this.savePDF(pdfDoc);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },

    /**
     * Merge multiple PDF documents
     * @param {Array<Uint8Array|ArrayBuffer>} pdfBytesArray - Array of PDF bytes
     * @returns {Promise<Object>} Promise that resolves with merged PDFDocument
     */
    async mergePDFs(pdfBytesArray) {
      const pdfLib = await this.getInstance();
      const { PDFDocument } = pdfLib;
      
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfBytes of pdfBytesArray) {
        const pdf = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
      
      return mergedPdf;
    },

    /**
     * Extract pages from PDF document
     * @param {Uint8Array|ArrayBuffer} pdfBytes - PDF file bytes
     * @param {Array<number>} pageIndices - Array of page indices to extract
     * @returns {Promise<Object>} Promise that resolves with extracted PDFDocument
     */
    async extractPages(pdfBytes, pageIndices) {
      const pdfLib = await this.getInstance();
      const { PDFDocument } = pdfLib;
      
      const sourcePdf = await PDFDocument.load(pdfBytes);
      const pdfDoc = await PDFDocument.create();
      const pages = await pdfDoc.copyPages(sourcePdf, pageIndices);
      pages.forEach((page) => pdfDoc.addPage(page));
      
      return pdfDoc;
    }
  };

  /**
   * Helper function to create a new PDF
   * @returns {Promise<Object>} Promise that resolves with PDFDocument
   */
  window.createPDF = async function() {
    return await PDFLibManager.createPDF();
  };

  /**
   * Helper function to load an existing PDF
   * @param {Uint8Array|ArrayBuffer} pdfBytes - PDF file bytes
   * @returns {Promise<Object>} Promise that resolves with PDFDocument
   */
  window.loadPDF = async function(pdfBytes) {
    return await PDFLibManager.loadPDF(pdfBytes);
  };

  /**
   * Helper function to download PDF
   * @param {Object} pdfDoc - PDFDocument instance
   * @param {string} filename - Filename for download
   */
  window.downloadPDF = async function(pdfDoc, filename) {
    return await PDFLibManager.downloadPDF(pdfDoc, filename);
  };

  console.log('PDF-lib integration loaded');
  console.log('Usage: const pdfDoc = await PDFLibManager.createPDF()');
})();
