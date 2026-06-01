/**
 * SVG.js Integration
 * 
 * This module provides SVG.js integration for manipulating and animating SVG
 * elements in the editor.
 * 
 * Reference: https://github.com/svgdotjs/svg.js
 * Documentation: https://svgjs.dev/
 */

(function() {
  'use strict';

  /**
   * SVG.js Manager
   * Handles SVG.js initialization and provides helper functions
   */
  window.SVGJSManager = {
    /**
     * SVG.js instance (loaded dynamically)
     */
    SVG: null,

    /**
     * Initialize SVG.js
     * @returns {Promise<Object>} Promise that resolves with SVG.js instance
     */
    async init() {
      if (this.SVG) {
        return this.SVG;
      }

      // Check if SVG.js is already loaded
      if (typeof window.SVG !== 'undefined') {
        this.SVG = window.SVG;
        return this.SVG;
      }

      // Load SVG.js from CDN
      return new Promise((resolve, reject) => {
        // Check if script is already loading
        if (document.querySelector('script[src*="svg.js"]')) {
          // Wait for SVG.js to be available
          const checkSVG = setInterval(() => {
            if (typeof window.SVG !== 'undefined') {
              clearInterval(checkSVG);
              this.SVG = window.SVG;
              resolve(this.SVG);
            }
          }, 100);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.2.5/dist/svg.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.SVG !== 'undefined') {
            this.SVG = window.SVG;
            resolve(this.SVG);
          } else {
            reject(new Error('SVG.js failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load SVG.js script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Get SVG.js instance (initialize if needed)
     * @returns {Promise<Object>} Promise that resolves with SVG.js instance
     */
    async getInstance() {
      if (!this.SVG) {
        await this.init();
      }
      return this.SVG;
    },

    /**
     * Create a new SVG drawing
     * @param {string|HTMLElement} container - Container selector or element
     * @param {Object} options - SVG options (width, height, etc.)
     * @returns {Promise<Object>} Promise that resolves with SVG drawing instance
     */
    async createSVG(container, options = {}) {
      const SVG = await this.getInstance();
      const {
        width = 800,
        height = 600,
        ...restOptions
      } = options;

      return SVG(container).size(width, height).attr(restOptions);
    },

    /**
     * Create a rectangle
     * @param {Object} drawing - SVG drawing instance
     * @param {Object} options - Rectangle options
     * @returns {Object} Rectangle element
     */
    async createRect(drawing, options = {}) {
      const {
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        fill = '#000000',
        stroke,
        strokeWidth = 0,
        ...restOptions
      } = options;

      const rect = drawing.rect(width, height).move(x, y).fill(fill);
      
      if (stroke) {
        rect.stroke({ color: stroke, width: strokeWidth });
      }

      Object.keys(restOptions).forEach(key => {
        rect.attr(key, restOptions[key]);
      });

      return rect;
    },

    /**
     * Create a circle
     * @param {Object} drawing - SVG drawing instance
     * @param {Object} options - Circle options
     * @returns {Object} Circle element
     */
    async createCircle(drawing, options = {}) {
      const {
        x = 0,
        y = 0,
        r = 50,
        fill = '#000000',
        stroke,
        strokeWidth = 0,
        ...restOptions
      } = options;

      const circle = drawing.circle(r * 2).center(x, y).fill(fill);
      
      if (stroke) {
        circle.stroke({ color: stroke, width: strokeWidth });
      }

      Object.keys(restOptions).forEach(key => {
        circle.attr(key, restOptions[key]);
      });

      return circle;
    },

    /**
     * Create a line
     * @param {Object} drawing - SVG drawing instance
     * @param {Object} options - Line options
     * @returns {Object} Line element
     */
    async createLine(drawing, options = {}) {
      const {
        x1 = 0,
        y1 = 0,
        x2 = 100,
        y2 = 100,
        stroke = '#000000',
        strokeWidth = 1,
        ...restOptions
      } = options;

      const line = drawing.line(x1, y1, x2, y2).stroke({ color: stroke, width: strokeWidth });

      Object.keys(restOptions).forEach(key => {
        line.attr(key, restOptions[key]);
      });

      return line;
    },

    /**
     * Create text
     * @param {Object} drawing - SVG drawing instance
     * @param {Object} options - Text options
     * @returns {Object} Text element
     */
    async createText(drawing, options = {}) {
      const {
        x = 0,
        y = 0,
        text = '',
        fontSize = 16,
        fontFamily = 'Arial',
        fill = '#000000',
        ...restOptions
      } = options;

      const textElement = drawing.text(text).move(x, y).font({
        size: fontSize,
        family: fontFamily
      }).fill(fill);

      Object.keys(restOptions).forEach(key => {
        textElement.attr(key, restOptions[key]);
      });

      return textElement;
    },

    /**
     * Create a path
     * @param {Object} drawing - SVG drawing instance
     * @param {Object} options - Path options
     * @returns {Object} Path element
     */
    async createPath(drawing, options = {}) {
      const {
        d = '',
        fill = 'none',
        stroke = '#000000',
        strokeWidth = 1,
        ...restOptions
      } = options;

      const path = drawing.path(d).fill(fill).stroke({ color: stroke, width: strokeWidth });

      Object.keys(restOptions).forEach(key => {
        path.attr(key, restOptions[key]);
      });

      return path;
    },

    /**
     * Create an image
     * @param {Object} drawing - SVG drawing instance
     * @param {Object} options - Image options
     * @returns {Promise<Object>} Promise that resolves with Image element
     */
    async createImage(drawing, options = {}) {
      const {
        href = '',
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        ...restOptions
      } = options;

      const image = drawing.image(href).move(x, y).size(width, height);

      Object.keys(restOptions).forEach(key => {
        image.attr(key, restOptions[key]);
      });

      return image;
    },

    /**
     * Create a group
     * @param {Object} drawing - SVG drawing instance
     * @param {Object} options - Group options
     * @returns {Object} Group element
     */
    async createGroup(drawing, options = {}) {
      const group = drawing.group();

      if (options.transform) {
        group.transform(options.transform);
      }

      Object.keys(options).forEach(key => {
        if (key !== 'transform' && key !== 'children') {
          group.attr(key, options[key]);
        }
      });

      return group;
    },

    /**
     * Animate an element
     * @param {Object} element - SVG element
     * @param {Object} options - Animation options
     * @returns {Object} Animation instance
     */
    async animate(element, options = {}) {
      const {
        duration = 1000,
        delay = 0,
        ease = '>',
        ...animationProps
      } = options;

      return element.animate(duration, ease, delay).attr(animationProps);
    },

    /**
     * Export SVG as string
     * @param {Object} drawing - SVG drawing instance
     * @returns {string} SVG string
     */
    async exportSVG(drawing) {
      return drawing.svg();
    },

    /**
     * Export SVG as data URL
     * @param {Object} drawing - SVG drawing instance
     * @param {string} mimeType - MIME type (default: 'image/svg+xml')
     * @returns {string} Data URL
     */
    async exportDataURL(drawing, mimeType = 'image/svg+xml') {
      const svgString = await this.exportSVG(drawing);
      const encoded = encodeURIComponent(svgString);
      return `data:${mimeType};charset=utf-8,${encoded}`;
    }
  };

  /**
   * Helper function to create SVG drawing
   * @param {string|HTMLElement} container - Container selector or element
   * @param {Object} options - SVG options
   * @returns {Promise<Object>} Promise that resolves with SVG drawing instance
   */
  window.createSVGDrawing = async function(container, options) {
    return await SVGJSManager.createSVG(container, options);
  };

  /**
   * Helper function to create rectangle
   * @param {Object} drawing - SVG drawing instance
   * @param {Object} options - Rectangle options
   * @returns {Promise<Object>} Promise that resolves with Rectangle element
   */
  window.createSVGRect = async function(drawing, options) {
    return await SVGJSManager.createRect(drawing, options);
  };

  /**
   * Helper function to create circle
   * @param {Object} drawing - SVG drawing instance
   * @param {Object} options - Circle options
   * @returns {Promise<Object>} Promise that resolves with Circle element
   */
  window.createSVGCircle = async function(drawing, options) {
    return await SVGJSManager.createCircle(drawing, options);
  };

  /**
   * Helper function to create text
   * @param {Object} drawing - SVG drawing instance
   * @param {Object} options - Text options
   * @returns {Promise<Object>} Promise that resolves with Text element
   */
  window.createSVGText = async function(drawing, options) {
    return await SVGJSManager.createText(drawing, options);
  };

  console.log('SVG.js integration loaded');
  console.log('Usage: const drawing = await SVGJSManager.createSVG("#container", { width: 800, height: 600 })');
})();
