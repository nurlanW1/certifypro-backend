/**
 * PapaParse Integration
 * 
 * This module provides PapaParse integration for CSV parsing and conversion
 * functionality in the editor.
 * 
 * Reference: https://github.com/mholt/PapaParse
 * Documentation: https://www.papaparse.com/
 */

(function() {
  'use strict';

  /**
   * PapaParse Manager
   * Handles CSV parsing and conversion
   */
  window.PapaParseManager = {
    /**
     * PapaParse instance (loaded dynamically)
     */
    Papa: null,

    /**
     * Initialize PapaParse
     * @returns {Promise<Object>} Promise that resolves with PapaParse instance
     */
    async init() {
      if (this.Papa) {
        return this.Papa;
      }

      // Check if PapaParse is already loaded
      if (typeof window.Papa !== 'undefined') {
        this.Papa = window.Papa;
        return this.Papa;
      }

      // Load PapaParse from CDN
      return new Promise((resolve, reject) => {
        // Check if script is already loading
        if (document.querySelector('script[src*="papaparse"]')) {
          // Wait for PapaParse to be available
          const checkPapa = setInterval(() => {
            if (typeof window.Papa !== 'undefined') {
              clearInterval(checkPapa);
              this.Papa = window.Papa;
              resolve(this.Papa);
            }
          }, 100);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.Papa !== 'undefined') {
            this.Papa = window.Papa;
            resolve(this.Papa);
          } else {
            reject(new Error('PapaParse failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load PapaParse script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Get PapaParse instance (initialize if needed)
     * @returns {Promise<Object>} Promise that resolves with PapaParse instance
     */
    async getInstance() {
      if (!this.Papa) {
        await this.init();
      }
      return this.Papa;
    },

    /**
     * Parse CSV string
     * @param {string} csv - CSV string to parse
     * @param {Object} config - Parse configuration
     * @returns {Promise<Object>} Promise that resolves with parsed data
     */
    async parse(csv, config = {}) {
      const Papa = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        const defaultConfig = {
          header: false,
          dynamicTyping: true,
          skipEmptyLines: true,
          ...config,
          complete: (results) => {
            if (config.complete) {
              config.complete(results);
            }
            resolve(results);
          },
          error: (error) => {
            if (config.error) {
              config.error(error);
            }
            reject(error);
          }
        };

        Papa.parse(csv, defaultConfig);
      });
    },

    /**
     * Parse CSV file
     * @param {File} file - CSV file to parse
     * @param {Object} config - Parse configuration
     * @returns {Promise<Object>} Promise that resolves with parsed data
     */
    async parseFile(file, config = {}) {
      const Papa = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        const defaultConfig = {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          ...config,
          complete: (results) => {
            if (config.complete) {
              config.complete(results);
            }
            resolve(results);
          },
          error: (error) => {
            if (config.error) {
              config.error(error);
            }
            reject(error);
          }
        };

        Papa.parse(file, defaultConfig);
      });
    },

    /**
     * Parse CSV from URL
     * @param {string} url - URL to CSV file
     * @param {Object} config - Parse configuration
     * @returns {Promise<Object>} Promise that resolves with parsed data
     */
    async parseURL(url, config = {}) {
      const Papa = await this.getInstance();
      
      return new Promise((resolve, reject) => {
        const defaultConfig = {
          header: true,
          dynamicTyping: true,
          download: true,
          skipEmptyLines: true,
          ...config,
          complete: (results) => {
            if (config.complete) {
              config.complete(results);
            }
            resolve(results);
          },
          error: (error) => {
            if (config.error) {
              config.error(error);
            }
            reject(error);
          }
        };

        Papa.parse(url, defaultConfig);
      });
    },

    /**
     * Convert JSON to CSV
     * @param {Array|Object} data - JSON data to convert
     * @param {Object} config - Unparse configuration
     * @returns {string} CSV string
     */
    async unparse(data, config = {}) {
      const Papa = await this.getInstance();
      
      const defaultConfig = {
        header: true,
        delimiter: ',',
        newline: '\n',
        ...config
      };

      return Papa.unparse(data, defaultConfig);
    },

    /**
     * Stream parse CSV (for large files)
     * @param {string|File} input - CSV string or file
     * @param {Object} config - Parse configuration
     * @returns {Object} Parse stream object
     */
    async parseStream(input, config = {}) {
      const Papa = await this.getInstance();
      
      const defaultConfig = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        step: (results, parser) => {
          if (config.step) {
            config.step(results, parser);
          }
        },
        complete: (results) => {
          if (config.complete) {
            config.complete(results);
          }
        },
        error: (error) => {
          if (config.error) {
            config.error(error);
          }
        },
        ...config
      };

      return Papa.parse(input, defaultConfig);
    },

    /**
     * Detect delimiter in CSV string
     * @param {string} csv - CSV string
     * @returns {string} Detected delimiter
     */
    async detectDelimiter(csv) {
      const Papa = await this.getInstance();
      return Papa.RECORD_SEP || ',';
    }
  };

  /**
   * Helper function to parse CSV
   * @param {string|File} input - CSV string or file
   * @param {Object} config - Parse configuration
   * @returns {Promise<Object>} Promise that resolves with parsed data
   */
  window.parseCSV = async function(input, config) {
    if (input instanceof File) {
      return await PapaParseManager.parseFile(input, config);
    }
    return await PapaParseManager.parse(csv, config);
  };

  /**
   * Helper function to convert JSON to CSV
   * @param {Array|Object} data - JSON data
   * @param {Object} config - Unparse configuration
   * @returns {Promise<string>} Promise that resolves with CSV string
   */
  window.convertToCSV = async function(data, config) {
    return await PapaParseManager.unparse(data, config);
  };

  /**
   * Helper function to parse CSV from URL
   * @param {string} url - URL to CSV file
   * @param {Object} config - Parse configuration
   * @returns {Promise<Object>} Promise that resolves with parsed data
   */
  window.parseCSVFromURL = async function(url, config) {
    return await PapaParseManager.parseURL(url, config);
  };

  console.log('PapaParse integration loaded');
  console.log('Usage: const results = await PapaParseManager.parse(csvString)');
  console.log('Usage: const csv = await PapaParseManager.unparse(jsonData)');
})();
