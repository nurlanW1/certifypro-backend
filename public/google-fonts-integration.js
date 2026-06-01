/**
 * Google Fonts Integration
 * 
 * This module provides Google Fonts integration for the editor,
 * allowing dynamic loading and usage of Google Fonts.
 * 
 * Reference: https://github.com/google/fonts
 * API: https://fonts.google.com/
 */

(function() {
  'use strict';

  /**
   * Google Fonts Manager
   * Handles loading and managing Google Fonts
   */
  window.GoogleFontsManager = {
    /**
     * Loaded fonts cache
     */
    loadedFonts: new Set(),

    /**
     * Google Fonts API base URL
     */
    apiBaseUrl: 'https://fonts.googleapis.com/css2',

    /**
     * Load a Google Font family
     * @param {string|Array} fontFamily - Font family name(s) to load
     * @param {Object} options - Loading options
     * @param {Array} options.weights - Font weights to load (default: [400, 700])
     * @param {Array} options.styles - Font styles to load (default: ['normal'])
     * @param {string} options.display - Font display strategy (default: 'swap')
     * @returns {Promise} Promise that resolves when font is loaded
     */
    async loadFont(fontFamily, options = {}) {
      const families = Array.isArray(fontFamily) ? fontFamily : [fontFamily];
      const weights = options.weights || [400, 700];
      const styles = options.styles || ['normal'];
      const display = options.display || 'swap';

      // Check if already loaded
      const fontKey = families.join('|');
      if (this.loadedFonts.has(fontKey)) {
        return Promise.resolve();
      }

      // Build Google Fonts API URL
      const fontParams = families.map(family => {
        const weightParams = weights.map(w => `0,${w}`).join(';');
        return `family=${encodeURIComponent(family)}:wght@${weightParams}`;
      }).join('&');

      const url = `${this.apiBaseUrl}?${fontParams}&display=${display}`;

      // Create and inject link element
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => {
          this.loadedFonts.add(fontKey);
          resolve();
        };
        link.onerror = () => {
          reject(new Error(`Failed to load font: ${fontFamily}`));
        };
        document.head.appendChild(link);
      });
    },

    /**
     * Load multiple Google Fonts
     * @param {Array} fonts - Array of font family names or objects
     * @returns {Promise} Promise that resolves when all fonts are loaded
     */
    async loadFonts(fonts) {
      const promises = fonts.map(font => {
        if (typeof font === 'string') {
          return this.loadFont(font);
        } else if (typeof font === 'object' && font.family) {
          return this.loadFont(font.family, font.options || {});
        }
        return Promise.resolve();
      });
      return Promise.all(promises);
    },

    /**
     * Check if a font is already loaded
     * @param {string} fontFamily - Font family name
     * @returns {boolean} True if font is loaded
     */
    isFontLoaded(fontFamily) {
      return this.loadedFonts.has(fontFamily);
    },

    /**
     * Get list of popular Google Fonts
     * @returns {Array} Array of popular font family names
     */
    getPopularFonts() {
      return [
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Oswald',
        'Source Sans Pro',
        'Slabo 27px',
        'Raleway',
        'PT Sans',
        'Merriweather',
        'Ubuntu',
        'Playfair Display',
        'Lora',
        'Poppins',
        'Nunito',
        'Crimson Text',
        'Dancing Script',
        'Pacifico',
        'Indie Flower',
        'Shadows Into Light'
      ];
    },

    /**
     * Search for fonts (simplified - would need API for full search)
     * @param {string} query - Search query
     * @returns {Array} Array of matching font names (from popular fonts)
     */
    searchFonts(query) {
      const popular = this.getPopularFonts();
      const lowerQuery = query.toLowerCase();
      return popular.filter(font => 
        font.toLowerCase().includes(lowerQuery)
      );
    },

    /**
     * Preload common fonts used in the editor
     * @returns {Promise} Promise that resolves when fonts are loaded
     */
    async preloadCommonFonts() {
      const commonFonts = [
        'Inter',
        'Space Grotesk',
        'Roboto',
        'Open Sans',
        'Poppins'
      ];
      return this.loadFonts(commonFonts);
    }
  };

  /**
   * Helper function to use Google Font in CSS
   * @param {string} fontFamily - Font family name
   * @param {Object} options - Font options
   * @returns {string} CSS font-family value
   */
  window.useGoogleFont = function(fontFamily, options = {}) {
    const weights = options.weights || [400, 700];
    const styles = options.styles || ['normal'];
    
    // Load font if not already loaded
    if (!GoogleFontsManager.isFontLoaded(fontFamily)) {
      GoogleFontsManager.loadFont(fontFamily, options).catch(err => {
        console.warn('Failed to load Google Font:', err);
      });
    }

    // Return CSS-ready font family name
    return `"${fontFamily}", sans-serif`;
  };

  /**
   * React component helper for Google Fonts
   * (For use with React components)
   */
  window.GoogleFontsReactHelper = {
    /**
     * Create a React component that uses Google Font
     * @param {string} fontFamily - Font family name
     * @param {Object} options - Font options
     * @returns {Object} React component props with font style
     */
    getFontStyle(fontFamily, options = {}) {
      // Load font
      GoogleFontsManager.loadFont(fontFamily, options).catch(err => {
        console.warn('Failed to load Google Font:', err);
      });

      return {
        fontFamily: `"${fontFamily}", sans-serif`
      };
    }
  };

  // Auto-preload common fonts on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      GoogleFontsManager.preloadCommonFonts().catch(err => {
        console.warn('Failed to preload common fonts:', err);
      });
    });
  } else {
    GoogleFontsManager.preloadCommonFonts().catch(err => {
      console.warn('Failed to preload common fonts:', err);
    });
  }

  console.log('Google Fonts integration loaded');
  console.log('Usage: GoogleFontsManager.loadFont("Roboto", { weights: [400, 700] })');
})();
