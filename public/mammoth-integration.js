/**
 * Mammoth.js Integration
 * 
 * This module provides Mammoth.js integration for converting Word documents
 * (.docx files) to HTML.
 * 
 * Reference: https://github.com/mwilliamson/mammoth.js
 * Documentation: https://github.com/mwilliamson/mammoth.js
 */

(function() {
  'use strict';

  /**
   * Mammoth.js Manager
   * Handles Word document to HTML conversion
   */
  window.MammothManager = {
    /**
     * Mammoth instance (loaded dynamically)
     */
    mammoth: null,

    /**
     * Initialize Mammoth.js
     * @returns {Promise<Object>} Promise that resolves with Mammoth instance
     */
    async init() {
      if (this.mammoth) {
        return this.mammoth;
      }

      // Check if Mammoth is already loaded
      if (typeof window.mammoth !== 'undefined') {
        this.mammoth = window.mammoth;
        return this.mammoth;
      }

      // Load Mammoth.js from CDN
      return new Promise((resolve, reject) => {
        // Check if script is already loading
        if (document.querySelector('script[src*="mammoth"]')) {
          // Wait for Mammoth to be available
          const checkMammoth = setInterval(() => {
            if (typeof window.mammoth !== 'undefined') {
              clearInterval(checkMammoth);
              this.mammoth = window.mammoth;
              resolve(this.mammoth);
            }
          }, 100);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.mammoth !== 'undefined') {
            this.mammoth = window.mammoth;
            resolve(this.mammoth);
          } else {
            reject(new Error('Mammoth.js failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load Mammoth.js script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Get Mammoth instance (initialize if needed)
     * @returns {Promise<Object>} Promise that resolves with Mammoth instance
     */
    async getInstance() {
      if (!this.mammoth) {
        await this.init();
      }
      return this.mammoth;
    },

    /**
     * Convert Word document to HTML
     * @param {File|ArrayBuffer|string} input - Word document file, ArrayBuffer, or URL
     * @param {Object} options - Conversion options
     * @returns {Promise<Object>} Promise that resolves with conversion result
     */
    async convertToHtml(input, options = {}) {
      const mammoth = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        try {
          let inputData;

          if (input instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                inputData = new Uint8Array(e.target.result);
                mammoth.convertToHtml({ arrayBuffer: inputData }, options)
                  .then(result => resolve(result))
                  .catch(reject);
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsArrayBuffer(input);
          } else if (input instanceof ArrayBuffer) {
            inputData = new Uint8Array(input);
            mammoth.convertToHtml({ arrayBuffer: inputData }, options)
              .then(result => resolve(result))
              .catch(reject);
          } else if (typeof input === 'string') {
            // URL
            if (input.startsWith('http://') || input.startsWith('https://')) {
              fetch(input)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const data = new Uint8Array(buffer);
                  mammoth.convertToHtml({ arrayBuffer: data }, options)
                    .then(result => resolve(result))
                    .catch(reject);
                })
                .catch(reject);
            } else {
              reject(new Error('String input must be a URL'));
            }
          } else {
            reject(new Error('Invalid input type'));
          }
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Convert Word document to markdown
     * @param {File|ArrayBuffer|string} input - Word document file, ArrayBuffer, or URL
     * @param {Object} options - Conversion options
     * @returns {Promise<Object>} Promise that resolves with conversion result
     */
    async convertToMarkdown(input, options = {}) {
      const mammoth = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        try {
          let inputData;

          if (input instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                inputData = new Uint8Array(e.target.result);
                mammoth.convertToMarkdown({ arrayBuffer: inputData }, options)
                  .then(result => resolve(result))
                  .catch(reject);
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsArrayBuffer(input);
          } else if (input instanceof ArrayBuffer) {
            inputData = new Uint8Array(input);
            mammoth.convertToMarkdown({ arrayBuffer: inputData }, options)
              .then(result => resolve(result))
              .catch(reject);
          } else if (typeof input === 'string') {
            // URL
            if (input.startsWith('http://') || input.startsWith('https://')) {
              fetch(input)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const data = new Uint8Array(buffer);
                  mammoth.convertToMarkdown({ arrayBuffer: data }, options)
                    .then(result => resolve(result))
                    .catch(reject);
                })
                .catch(reject);
            } else {
              reject(new Error('String input must be a URL'));
            }
          } else {
            reject(new Error('Invalid input type'));
          }
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Extract raw text from Word document
     * @param {File|ArrayBuffer|string} input - Word document file, ArrayBuffer, or URL
     * @param {Object} options - Extraction options
     * @returns {Promise<Object>} Promise that resolves with text extraction result
     */
    async extractRawText(input, options = {}) {
      const mammoth = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        try {
          let inputData;

          if (input instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                inputData = new Uint8Array(e.target.result);
                mammoth.extractRawText({ arrayBuffer: inputData }, options)
                  .then(result => resolve(result))
                  .catch(reject);
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsArrayBuffer(input);
          } else if (input instanceof ArrayBuffer) {
            inputData = new Uint8Array(input);
            mammoth.extractRawText({ arrayBuffer: inputData }, options)
              .then(result => resolve(result))
              .catch(reject);
          } else if (typeof input === 'string') {
            // URL
            if (input.startsWith('http://') || input.startsWith('https://')) {
              fetch(input)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const data = new Uint8Array(buffer);
                  mammoth.extractRawText({ arrayBuffer: data }, options)
                    .then(result => resolve(result))
                    .catch(reject);
                })
                .catch(reject);
            } else {
              reject(new Error('String input must be a URL'));
            }
          } else {
            reject(new Error('Invalid input type'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }
  };

  /**
   * Helper function to convert Word document to HTML
   * @param {File|ArrayBuffer|string} input - Word document
   * @param {Object} options - Conversion options
   * @returns {Promise<Object>} Promise that resolves with conversion result
   */
  window.convertDocxToHtml = async function(input, options) {
    return await MammothManager.convertToHtml(input, options);
  };

  /**
   * Helper function to convert Word document to Markdown
   * @param {File|ArrayBuffer|string} input - Word document
   * @param {Object} options - Conversion options
   * @returns {Promise<Object>} Promise that resolves with conversion result
   */
  window.convertDocxToMarkdown = async function(input, options) {
    return await MammothManager.convertToMarkdown(input, options);
  };

  /**
   * Helper function to extract raw text from Word document
   * @param {File|ArrayBuffer|string} input - Word document
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} Promise that resolves with text extraction result
   */
  window.extractTextFromDocx = async function(input, options) {
    return await MammothManager.extractRawText(input, options);
  };

  console.log('Mammoth.js integration loaded');
  console.log('Usage: const result = await MammothManager.convertToHtml(file)');
  console.log('Usage: const result = await MammothManager.convertToMarkdown(file)');
})();
