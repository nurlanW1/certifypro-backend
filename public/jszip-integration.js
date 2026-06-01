/**
 * JSZip Integration
 * 
 * This module provides JSZip integration for creating, reading and editing
 * ZIP files in the editor.
 * 
 * Reference: https://github.com/Stuk/jszip
 * Documentation: https://stuk.github.io/jszip/
 */

(function() {
  'use strict';

  /**
   * JSZip Manager
   * Handles ZIP file operations
   */
  window.JSZipManager = {
    /**
     * JSZip instance (loaded dynamically)
     */
    JSZip: null,

    /**
     * Initialize JSZip
     * @returns {Promise<Function>} Promise that resolves with JSZip constructor
     */
    async init() {
      if (this.JSZip) {
        return this.JSZip;
      }

      // Check if JSZip is already loaded
      if (typeof window.JSZip !== 'undefined') {
        this.JSZip = window.JSZip;
        return this.JSZip;
      }

      // Load JSZip from CDN
      return new Promise((resolve, reject) => {
        // Check if script is already loading
        if (document.querySelector('script[src*="jszip"]')) {
          // Wait for JSZip to be available
          const checkJSZip = setInterval(() => {
            if (typeof window.JSZip !== 'undefined') {
              clearInterval(checkJSZip);
              this.JSZip = window.JSZip;
              resolve(this.JSZip);
            }
          }, 100);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.JSZip !== 'undefined') {
            this.JSZip = window.JSZip;
            resolve(this.JSZip);
          } else {
            reject(new Error('JSZip failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load JSZip script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Get JSZip constructor (initialize if needed)
     * @returns {Promise<Function>} Promise that resolves with JSZip constructor
     */
    async getInstance() {
      if (!this.JSZip) {
        await this.init();
      }
      return this.JSZip;
    },

    /**
     * Create a new ZIP file
     * @returns {Promise<Object>} Promise that resolves with JSZip instance
     */
    async createZip() {
      const JSZip = await this.getInstance();
      return new JSZip();
    },

    /**
     * Load ZIP file
     * @param {File|ArrayBuffer|string} input - ZIP file, ArrayBuffer, or base64 string
     * @param {Object} options - Load options
     * @returns {Promise<Object>} Promise that resolves with JSZip instance
     */
    async loadZip(input, options = {}) {
      const JSZip = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        try {
          if (input instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                JSZip.loadAsync(e.target.result, options)
                  .then(zip => resolve(zip))
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
            JSZip.loadAsync(input, options)
              .then(zip => resolve(zip))
              .catch(reject);
          } else if (typeof input === 'string') {
            // Base64 string or URL
            if (input.startsWith('http://') || input.startsWith('https://')) {
              fetch(input)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  JSZip.loadAsync(buffer, options)
                    .then(zip => resolve(zip))
                    .catch(reject);
                })
                .catch(reject);
            } else {
              // Base64 string
              JSZip.loadAsync(input, { base64: true, ...options })
                .then(zip => resolve(zip))
                .catch(reject);
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
     * Add file to ZIP
     * @param {Object} zip - JSZip instance
     * @param {string} filename - File name in ZIP
     * @param {string|Blob|ArrayBuffer|Uint8Array} content - File content
     * @param {Object} options - File options
     * @returns {Object} JSZip instance
     */
    async addFile(zip, filename, content, options = {}) {
      zip.file(filename, content, options);
      return zip;
    },

    /**
     * Add folder to ZIP
     * @param {Object} zip - JSZip instance
     * @param {string} folderName - Folder name
     * @returns {Object} JSZip folder instance
     */
    async addFolder(zip, folderName) {
      return zip.folder(folderName);
    },

    /**
     * Get file from ZIP
     * @param {Object} zip - JSZip instance
     * @param {string} filename - File name
     * @param {Object} options - Read options
     * @returns {Promise<string|Blob|ArrayBuffer|Uint8Array>} Promise that resolves with file content
     */
    async getFile(zip, filename, options = {}) {
      const file = zip.file(filename);
      if (!file) {
        throw new Error(`File "${filename}" not found in ZIP`);
      }

      const {
        type = 'string',
        ...restOptions
      } = options;

      return file.async(type, restOptions);
    },

    /**
     * Get all file names from ZIP
     * @param {Object} zip - JSZip instance
     * @returns {Array<string>} Array of file names
     */
    getFileNames(zip) {
      const files = [];
      zip.forEach((relativePath, file) => {
        if (!file.dir) {
          files.push(relativePath);
        }
      });
      return files;
    },

    /**
     * Get all folder names from ZIP
     * @param {Object} zip - JSZip instance
     * @returns {Array<string>} Array of folder names
     */
    getFolderNames(zip) {
      const folders = [];
      zip.forEach((relativePath, file) => {
        if (file.dir) {
          folders.push(relativePath);
        }
      });
      return folders;
    },

    /**
     * Remove file from ZIP
     * @param {Object} zip - JSZip instance
     * @param {string} filename - File name to remove
     * @returns {Object} JSZip instance
     */
    async removeFile(zip, filename) {
      zip.remove(filename);
      return zip;
    },

    /**
     * Generate ZIP file as Blob
     * @param {Object} zip - JSZip instance
     * @param {Object} options - Generation options
     * @returns {Promise<Blob>} Promise that resolves with ZIP Blob
     */
    async generateBlob(zip, options = {}) {
      const defaultOptions = {
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        },
        ...options
      };

      return zip.generateAsync(defaultOptions);
    },

    /**
     * Generate ZIP file as ArrayBuffer
     * @param {Object} zip - JSZip instance
     * @param {Object} options - Generation options
     * @returns {Promise<ArrayBuffer>} Promise that resolves with ZIP ArrayBuffer
     */
    async generateArrayBuffer(zip, options = {}) {
      const defaultOptions = {
        type: 'arraybuffer',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        },
        ...options
      };

      return zip.generateAsync(defaultOptions);
    },

    /**
     * Generate ZIP file as base64 string
     * @param {Object} zip - JSZip instance
     * @param {Object} options - Generation options
     * @returns {Promise<string>} Promise that resolves with ZIP base64 string
     */
    async generateBase64(zip, options = {}) {
      const defaultOptions = {
        type: 'base64',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        },
        ...options
      };

      return zip.generateAsync(defaultOptions);
    },

    /**
     * Download ZIP file
     * @param {Object} zip - JSZip instance
     * @param {string} filename - Output filename
     * @param {Object} options - Generation options
     * @returns {Promise<void>}
     */
    async downloadZip(zip, filename = 'archive.zip', options = {}) {
      const blob = await this.generateBlob(zip, options);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  /**
   * Helper function to create ZIP
   * @returns {Promise<Object>} Promise that resolves with JSZip instance
   */
  window.createZip = async function() {
    return await JSZipManager.createZip();
  };

  /**
   * Helper function to load ZIP
   * @param {File|ArrayBuffer|string} input - ZIP file
   * @param {Object} options - Load options
   * @returns {Promise<Object>} Promise that resolves with JSZip instance
   */
  window.loadZip = async function(input, options) {
    return await JSZipManager.loadZip(input, options);
  };

  /**
   * Helper function to download ZIP
   * @param {Object} zip - JSZip instance
   * @param {string} filename - Output filename
   * @param {Object} options - Generation options
   * @returns {Promise<void>}
   */
  window.downloadZip = async function(zip, filename, options) {
    return await JSZipManager.downloadZip(zip, filename, options);
  };

  console.log('JSZip integration loaded');
  console.log('Usage: const zip = await JSZipManager.createZip()');
  console.log('Usage: await JSZipManager.downloadZip(zip, "archive.zip")');
})();
