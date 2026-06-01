/**
 * SheetJS (xlsx) Integration
 * 
 * This module provides SheetJS integration for reading and writing Excel
 * and other spreadsheet formats.
 * 
 * Reference: https://github.com/SheetJS/sheetjs
 * Documentation: https://docs.sheetjs.com/
 */

(function() {
  'use strict';

  /**
   * SheetJS Manager
   * Handles Excel/spreadsheet file operations
   */
  window.SheetJSManager = {
    /**
     * XLSX instance (loaded dynamically)
     */
    XLSX: null,

    /**
     * Initialize SheetJS
     * @returns {Promise<Object>} Promise that resolves with XLSX instance
     */
    async init() {
      if (this.XLSX) {
        return this.XLSX;
      }

      // Check if SheetJS is already loaded
      if (typeof window.XLSX !== 'undefined') {
        this.XLSX = window.XLSX;
        return this.XLSX;
      }

      // Load SheetJS from CDN
      return new Promise((resolve, reject) => {
        // Check if script is already loading
        if (document.querySelector('script[src*="xlsx"]')) {
          // Wait for XLSX to be available
          const checkXLSX = setInterval(() => {
            if (typeof window.XLSX !== 'undefined') {
              clearInterval(checkXLSX);
              this.XLSX = window.XLSX;
              resolve(this.XLSX);
            }
          }, 100);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.XLSX !== 'undefined') {
            this.XLSX = window.XLSX;
            resolve(this.XLSX);
          } else {
            reject(new Error('SheetJS failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load SheetJS script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Get XLSX instance (initialize if needed)
     * @returns {Promise<Object>} Promise that resolves with XLSX instance
     */
    async getInstance() {
      if (!this.XLSX) {
        await this.init();
      }
      return this.XLSX;
    },

    /**
     * Read Excel file
     * @param {File|ArrayBuffer|string} input - Excel file, ArrayBuffer, or file path
     * @param {Object} options - Read options
     * @returns {Promise<Object>} Promise that resolves with workbook object
     */
    async readFile(input, options = {}) {
      const XLSX = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        try {
          let workbook;

          if (input instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const data = new Uint8Array(e.target.result);
                workbook = XLSX.read(data, {
                  type: 'array',
                  ...options
                });
                resolve(workbook);
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsArrayBuffer(input);
          } else if (input instanceof ArrayBuffer) {
            const data = new Uint8Array(input);
            workbook = XLSX.read(data, {
              type: 'array',
              ...options
            });
            resolve(workbook);
          } else if (typeof input === 'string') {
            // URL or base64 string
            if (input.startsWith('http://') || input.startsWith('https://')) {
              fetch(input)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const data = new Uint8Array(buffer);
                  workbook = XLSX.read(data, {
                    type: 'array',
                    ...options
                  });
                  resolve(workbook);
                })
                .catch(reject);
            } else {
              // Base64 string
              const binaryString = atob(input);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              workbook = XLSX.read(bytes, {
                type: 'array',
                ...options
              });
              resolve(workbook);
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
     * Convert workbook to JSON
     * @param {Object} workbook - Workbook object
     * @param {Object} options - Conversion options
     * @returns {Array|Object} JSON data
     */
    async workbookToJSON(workbook, options = {}) {
      const XLSX = await this.getInstance();
      
      const {
        sheetName = null,
        header = 1,
        defval = '',
        blankrows = true,
        ...restOptions
      } = options;

      if (sheetName) {
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        return XLSX.utils.sheet_to_json(worksheet, {
          header,
          defval,
          blankrows,
          ...restOptions
        });
      } else {
        // Convert all sheets
        const result = {};
        workbook.SheetNames.forEach(name => {
          const worksheet = workbook.Sheets[name];
          result[name] = XLSX.utils.sheet_to_json(worksheet, {
            header,
            defval,
            blankrows,
            ...restOptions
          });
        });
        return result;
      }
    },

    /**
     * Convert JSON to workbook
     * @param {Array|Object} data - JSON data
     * @param {Object} options - Conversion options
     * @returns {Object} Workbook object
     */
    async jsonToWorkbook(data, options = {}) {
      const XLSX = await this.getInstance();
      
      const {
        sheetName = 'Sheet1',
        header = true,
        ...restOptions
      } = options;

      const worksheet = XLSX.utils.json_to_sheet(data, {
        header,
        ...restOptions
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      return workbook;
    },

    /**
     * Write workbook to file
     * @param {Object} workbook - Workbook object
     * @param {string} filename - Output filename
     * @param {Object} options - Write options
     * @returns {Promise<void>}
     */
    async writeFile(workbook, filename = 'export.xlsx', options = {}) {
      const XLSX = await this.getInstance();
      
      const {
        bookType = 'xlsx',
        ...restOptions
      } = options;

      const wbout = XLSX.write(workbook, {
        bookType,
        type: 'array',
        ...restOptions
      });

      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },

    /**
     * Convert JSON to Excel and download
     * @param {Array|Object} data - JSON data
     * @param {string} filename - Output filename
     * @param {Object} options - Conversion and write options
     * @returns {Promise<void>}
     */
    async exportToExcel(data, filename = 'export.xlsx', options = {}) {
      const workbook = await this.jsonToWorkbook(data, options);
      await this.writeFile(workbook, filename, options);
    },

    /**
     * Get sheet names from workbook
     * @param {Object} workbook - Workbook object
     * @returns {Array<string>} Array of sheet names
     */
    getSheetNames(workbook) {
      return workbook.SheetNames || [];
    },

    /**
     * Get sheet data as array of arrays
     * @param {Object} workbook - Workbook object
     * @param {string} sheetName - Sheet name
     * @returns {Array<Array>} Sheet data as 2D array
     */
    async sheetToArray(workbook, sheetName) {
      const XLSX = await this.getInstance();
      
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
      }
      return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    }
  };

  /**
   * Helper function to read Excel file
   * @param {File|ArrayBuffer|string} input - Excel file
   * @param {Object} options - Read options
   * @returns {Promise<Object>} Promise that resolves with workbook
   */
  window.readExcelFile = async function(input, options) {
    return await SheetJSManager.readFile(input, options);
  };

  /**
   * Helper function to export JSON to Excel
   * @param {Array|Object} data - JSON data
   * @param {string} filename - Output filename
   * @param {Object} options - Options
   * @returns {Promise<void>}
   */
  window.exportToExcel = async function(data, filename, options) {
    return await SheetJSManager.exportToExcel(data, filename, options);
  };

  /**
   * Helper function to convert workbook to JSON
   * @param {Object} workbook - Workbook object
   * @param {Object} options - Conversion options
   * @returns {Promise<Array|Object>} Promise that resolves with JSON data
   */
  window.workbookToJSON = async function(workbook, options) {
    return await SheetJSManager.workbookToJSON(workbook, options);
  };

  console.log('SheetJS integration loaded');
  console.log('Usage: const workbook = await SheetJSManager.readFile(file)');
  console.log('Usage: await SheetJSManager.exportToExcel(data, "export.xlsx")');
})();
