/**
 * QRCode React Integration
 * 
 * This module provides QRCode React integration for generating QR codes
 * in the editor.
 * 
 * Reference: https://github.com/zpao/qrcode.react
 * Documentation: https://zpao.github.io/qrcode.react/
 */

(function() {
  'use strict';

  // Check if React and ReactDOM are available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM is not loaded. QRCode React will not work.');
    return;
  }

  /**
   * QRCode React Manager
   * Handles QR code generation and management
   */
  window.QRCodeReactManager = {
    /**
     * QRCode components (loaded dynamically)
     */
    QRCodeSVG: null,
    QRCodeCanvas: null,

    /**
     * Initialize QRCode React
     * @returns {Promise<Object>} Promise that resolves with QRCode components
     */
    async init() {
      if (this.QRCodeSVG && this.QRCodeCanvas) {
        return {
          QRCodeSVG: this.QRCodeSVG,
          QRCodeCanvas: this.QRCodeCanvas
        };
      }

      // Check if qrcode.react is already loaded
      if (typeof window.QRCodeReact !== 'undefined') {
        this.QRCodeSVG = window.QRCodeReact.QRCodeSVG || window.QRCodeReact.default?.QRCodeSVG;
        this.QRCodeCanvas = window.QRCodeReact.QRCodeCanvas || window.QRCodeReact.default?.QRCodeCanvas;
        return {
          QRCodeSVG: this.QRCodeSVG,
          QRCodeCanvas: this.QRCodeCanvas
        };
      }

      // Create wrapper components if library is not available as UMD
      const components = this.createQRCodeComponents();
      this.QRCodeSVG = components.QRCodeSVG;
      this.QRCodeCanvas = components.QRCodeCanvas;
      return components;
    },

    /**
     * Create QRCode components
     * This creates simplified wrapper components that work with vanilla React
     * @returns {Object} Object with QRCodeSVG and QRCodeCanvas components
     */
    createQRCodeComponents() {
      const { useState, useEffect, useRef } = React;

      /**
       * QRCodeSVG Component
       * Renders QR code as SVG
       */
      const QRCodeSVG = function QRCodeSVG(props) {
        const svgRef = useRef(null);
        const {
          value = '',
          size = 128,
          level = 'L',
          bgColor = '#FFFFFF',
          fgColor = '#000000',
          marginSize = 0,
          includeMargin = false,
          title,
          minVersion = 1,
          boostLevel = true,
          imageSettings,
          ...restProps
        } = props;

        useEffect(() => {
          if (!svgRef.current || !value) return;

          // Load QR code library if available
          if (typeof window.qrcode !== 'undefined') {
            try {
              const qr = window.qrcode(0, level);
              qr.addData(value);
              qr.make();

              const svg = qr.createSvgTag({
                scalable: true,
                margin: includeMargin ? 4 : marginSize,
                color: {
                  dark: fgColor,
                  light: bgColor
                }
              });

              svgRef.current.innerHTML = svg;
            } catch (error) {
              console.error('QR Code generation error:', error);
            }
          } else {
            // Fallback: Use canvas-based QR code and convert to SVG
            // This is a simplified implementation
            console.warn('QR Code library not fully loaded. Using fallback.');
          }
        }, [value, size, level, bgColor, fgColor, marginSize, includeMargin]);

        return React.createElement('svg', {
          ref: svgRef,
          width: size,
          height: size,
          viewBox: `0 0 ${size} ${size}`,
          title: title,
          ...restProps
        });
      };

      /**
       * QRCodeCanvas Component
       * Renders QR code as Canvas
       */
      const QRCodeCanvas = function QRCodeCanvas(props) {
        const canvasRef = useRef(null);
        const {
          value = '',
          size = 128,
          level = 'L',
          bgColor = '#FFFFFF',
          fgColor = '#000000',
          marginSize = 0,
          includeMargin = false,
          title,
          minVersion = 1,
          boostLevel = true,
          imageSettings,
          ...restProps
        } = props;

        useEffect(() => {
          if (!canvasRef.current || !value) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          // Set canvas size
          const scale = window.devicePixelRatio || 1;
          canvas.width = size * scale;
          canvas.height = size * scale;
          canvas.style.width = size + 'px';
          canvas.style.height = size + 'px';
          ctx.scale(scale, scale);

          // Clear canvas
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);

          // Load QR code library if available
          if (typeof window.qrcode !== 'undefined') {
            try {
              const qr = window.qrcode(0, level);
              qr.addData(value);
              qr.make();

              const moduleCount = qr.getModuleCount();
              const margin = includeMargin ? 4 : marginSize;
              const cellSize = (size - margin * 2) / moduleCount;

              // Draw QR code
              ctx.fillStyle = fgColor;
              for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                  if (qr.isDark(row, col)) {
                    ctx.fillRect(
                      margin + col * cellSize,
                      margin + row * cellSize,
                      cellSize,
                      cellSize
                    );
                  }
                }
              }

              // Draw embedded image if provided
              if (imageSettings && imageSettings.src) {
                const img = new Image();
                img.crossOrigin = imageSettings.crossOrigin || 'anonymous';
                img.onload = () => {
                  const imgSize = Math.min(imageSettings.width || size * 0.2, imageSettings.height || size * 0.2);
                  const x = imageSettings.x !== undefined 
                    ? imageSettings.x 
                    : (size - imgSize) / 2;
                  const y = imageSettings.y !== undefined 
                    ? imageSettings.y 
                    : (size - imgSize) / 2;
                  
                  ctx.globalAlpha = imageSettings.opacity !== undefined ? imageSettings.opacity : 1;
                  
                  if (imageSettings.excavate) {
                    // Clear area for image
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(x - 2, y - 2, imgSize + 4, imgSize + 4);
                  }
                  
                  ctx.drawImage(img, x, y, imgSize, imgSize);
                  ctx.globalAlpha = 1;
                };
                img.src = imageSettings.src;
              }
            } catch (error) {
              console.error('QR Code generation error:', error);
            }
          } else {
            // Fallback: Draw placeholder
            ctx.fillStyle = fgColor;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('QR Code', size / 2, size / 2);
          }
        }, [value, size, level, bgColor, fgColor, marginSize, includeMargin, imageSettings]);

        return React.createElement('canvas', {
          ref: canvasRef,
          title: title,
          ...restProps
        });
      };

      return { QRCodeSVG, QRCodeCanvas };
    },

    /**
     * Create a QR code component
     * @param {Object} props - Component props
     * @param {string} type - Component type ('svg' or 'canvas')
     * @returns {Promise<React.ReactElement>} Promise that resolves with QRCode component
     */
    async createQRCode(props = {}, type = 'svg') {
      const components = await this.init();
      const Component = type === 'canvas' ? components.QRCodeCanvas : components.QRCodeSVG;
      return React.createElement(Component, props);
    }
  };

  /**
   * Helper function to create a QR code (SVG)
   * @param {Object} props - Component props
   * @returns {Promise<React.ReactElement>} Promise that resolves with QRCodeSVG component
   */
  window.createQRCodeSVG = async function(props) {
    return await QRCodeReactManager.createQRCode(props, 'svg');
  };

  /**
   * Helper function to create a QR code (Canvas)
   * @param {Object} props - Component props
   * @returns {Promise<React.ReactElement>} Promise that resolves with QRCodeCanvas component
   */
  window.createQRCodeCanvas = async function(props) {
    return await QRCodeReactManager.createQRCode(props, 'canvas');
  };

  /**
   * QRCodeSVG Component (for direct use)
   * Usage: <QRCodeSVG value="https://example.com" size={200} />
   */
  window.QRCodeSVG = async function(props) {
    const components = await QRCodeReactManager.init();
    return React.createElement(components.QRCodeSVG, props);
  };

  /**
   * QRCodeCanvas Component (for direct use)
   * Usage: <QRCodeCanvas value="https://example.com" size={200} />
   */
  window.QRCodeCanvas = async function(props) {
    const components = await QRCodeReactManager.init();
    return React.createElement(components.QRCodeCanvas, props);
  };

  console.log('QRCode React integration loaded');
  console.log('Usage: <QRCodeSVG value="https://example.com" size={200} />');
  console.log('Usage: <QRCodeCanvas value="https://example.com" size={200} />');
})();
