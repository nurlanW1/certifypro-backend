/**
 * React Signature Canvas Integration
 * 
 * This module provides React Signature Canvas integration for signature drawing
 * functionality in the editor.
 * 
 * Reference: https://github.com/agilgur5/react-signature-canvas
 * Documentation: https://agilgur5.github.io/react-signature-canvas/
 */

(function() {
  'use strict';

  // Check if React and ReactDOM are available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM is not loaded. React Signature Canvas will not work.');
    return;
  }

  /**
   * React Signature Canvas Manager
   * Handles signature canvas initialization and management
   */
  window.SignatureCanvasManager = {
    /**
     * React Signature Canvas component (loaded dynamically)
     */
    SignatureCanvasComponent: null,

    /**
     * Initialize React Signature Canvas
     * @returns {Promise<Function>} Promise that resolves with SignatureCanvas component
     */
    async init() {
      if (this.SignatureCanvasComponent) {
        return this.SignatureCanvasComponent;
      }

      // Check if react-signature-canvas is already loaded
      if (typeof window.ReactSignatureCanvas !== 'undefined') {
        this.SignatureCanvasComponent = window.ReactSignatureCanvas.default || window.ReactSignatureCanvas;
        return this.SignatureCanvasComponent;
      }

      // For CDN usage, we'll create a wrapper component
      // Note: react-signature-canvas requires signature_pad library
      if (typeof window.SignaturePad === 'undefined') {
        console.warn('SignaturePad library is required for react-signature-canvas');
        // Try to load signature_pad
        await this.loadSignaturePad();
      }

      // Create a wrapper component if the library is not available as UMD
      this.SignatureCanvasComponent = this.createSignatureCanvasWrapper();
      return this.SignatureCanvasComponent;
    },

    /**
     * Load SignaturePad library
     * @returns {Promise<void>}
     */
    async loadSignaturePad() {
      return new Promise((resolve, reject) => {
        if (typeof window.SignaturePad !== 'undefined') {
          resolve();
          return;
        }

        if (document.querySelector('script[src*="signature_pad"]')) {
          const checkSignaturePad = setInterval(() => {
            if (typeof window.SignaturePad !== 'undefined') {
              clearInterval(checkSignaturePad);
              resolve();
            }
          }, 100);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/signature_pad@4.1.6/dist/signature_pad.umd.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.SignaturePad !== 'undefined') {
            resolve();
          } else {
            reject(new Error('SignaturePad failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load SignaturePad script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Create a wrapper component for SignatureCanvas
     * This is a simplified version that works with vanilla React
     * @returns {Function} React component
     */
    createSignatureCanvasWrapper() {
      const { useState, useEffect, useRef, useImperativeHandle, forwardRef } = React;

      return forwardRef(function SignatureCanvas(props, ref) {
        const canvasRef = useRef(null);
        const signaturePadRef = useRef(null);
        const [isReady, setIsReady] = useState(false);

        const {
          canvasProps = {},
          backgroundColor = 'rgba(0,0,0,0)',
          clearOnResize = true,
          penColor = 'black',
          minWidth = 0.5,
          maxWidth = 2.5,
          velocityFilterWeight = 0.7,
          minDistance = 5,
          dotSize,
          throttle = 16,
          onEnd,
          onBegin,
          ...restProps
        } = props;

        // Initialize SignaturePad
        useEffect(() => {
          if (!canvasRef.current || typeof window.SignaturePad === 'undefined') {
            return;
          }

          const canvas = canvasRef.current;
          const signaturePad = new window.SignaturePad(canvas, {
            backgroundColor: backgroundColor,
            penColor: penColor,
            minWidth: minWidth,
            maxWidth: maxWidth,
            velocityFilterWeight: velocityFilterWeight,
            minDistance: minDistance,
            dotSize: dotSize || (() => (minWidth + maxWidth) / 2),
            throttle: throttle
          });

          signaturePadRef.current = signaturePad;
          setIsReady(true);

          // Event handlers
          if (onBegin) {
            canvas.addEventListener('beginStroke', onBegin);
          }
          if (onEnd) {
            canvas.addEventListener('endStroke', onEnd);
          }

          // Handle resize
          if (clearOnResize) {
            const handleResize = () => {
              signaturePad.clear();
            };
            window.addEventListener('resize', handleResize);
            return () => {
              window.removeEventListener('resize', handleResize);
              signaturePad.off();
            };
          }

          return () => {
            signaturePad.off();
          };
        }, []);

        // Update SignaturePad when props change
        useEffect(() => {
          if (!signaturePadRef.current) return;

          const pad = signaturePadRef.current;
          pad.penColor = penColor;
          pad.minWidth = minWidth;
          pad.maxWidth = maxWidth;
          pad.velocityFilterWeight = velocityFilterWeight;
          pad.minDistance = minDistance;
          pad.throttle = throttle;
          if (dotSize) {
            pad.dotSize = typeof dotSize === 'function' ? dotSize : () => dotSize;
          }
        }, [penColor, minWidth, maxWidth, velocityFilterWeight, minDistance, throttle, dotSize]);

        // Expose API methods via ref
        useImperativeHandle(ref, () => ({
          isEmpty: () => signaturePadRef.current ? signaturePadRef.current.isEmpty() : true,
          clear: () => {
            if (signaturePadRef.current) {
              signaturePadRef.current.clear();
            }
          },
          fromDataURL: (base64String, options) => {
            if (signaturePadRef.current) {
              signaturePadRef.current.fromDataURL(base64String, options);
            }
          },
          toDataURL: (mimetype, encoderOptions) => {
            return signaturePadRef.current ? signaturePadRef.current.toDataURL(mimetype, encoderOptions) : '';
          },
          fromData: (pointGroupArray) => {
            if (signaturePadRef.current) {
              signaturePadRef.current.fromData(pointGroupArray);
            }
          },
          toData: () => {
            return signaturePadRef.current ? signaturePadRef.current.toData() : [];
          },
          off: () => {
            if (signaturePadRef.current) {
              signaturePadRef.current.off();
            }
          },
          on: () => {
            if (signaturePadRef.current) {
              signaturePadRef.current.on();
            }
          },
          getCanvas: () => canvasRef.current,
          getTrimmedCanvas: () => {
            if (!signaturePadRef.current || !canvasRef.current) return null;
            const canvas = canvasRef.current;
            const copy = document.createElement('canvas');
            const ctx = copy.getContext('2d');
            const img = new Image();
            
            return new Promise((resolve) => {
              img.onload = () => {
                const data = signaturePadRef.current.toData();
                if (data.length === 0) {
                  resolve(null);
                  return;
                }

                // Calculate bounding box
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                data.forEach(pointGroup => {
                  pointGroup.points.forEach(point => {
                    minX = Math.min(minX, point.x);
                    minY = Math.min(minY, point.y);
                    maxX = Math.max(maxX, point.x);
                    maxY = Math.max(maxY, point.y);
                  });
                });

                const padding = 10;
                const width = maxX - minX + padding * 2;
                const height = maxY - minY + padding * 2;

                copy.width = width;
                copy.height = height;

                ctx.translate(-minX + padding, -minY + padding);
                signaturePadRef.current.fromData(data);
                ctx.drawImage(canvas, 0, 0);
                resolve(copy);
              };
              img.src = signaturePadRef.current.toDataURL();
            });
          },
          getSignaturePad: () => signaturePadRef.current
        }), [isReady]);

        return React.createElement('canvas', {
          ref: canvasRef,
          ...canvasProps,
          ...restProps
        });
      });
    },

    /**
     * Create a signature canvas component
     * @param {Object} props - Component props
     * @param {React.Ref} ref - Component ref
     * @returns {React.ReactElement} SignatureCanvas component
     */
    async createSignatureCanvas(props = {}, ref = null) {
      const SignatureCanvas = await this.init();
      return React.createElement(SignatureCanvas, { ...props, ref });
    }
  };

  /**
   * Helper function to create a signature canvas
   * @param {Object} props - Component props
   * @returns {React.ReactElement} SignatureCanvas component
   */
  window.createSignatureCanvas = async function(props) {
    return await SignatureCanvasManager.createSignatureCanvas(props);
  };

  /**
   * React Signature Canvas Component (for direct use)
   * Usage: <ReactSignatureCanvas penColor="blue" canvasProps={{width: 500, height: 200}} />
   */
  window.ReactSignatureCanvas = async function(props) {
    const SignatureCanvas = await SignatureCanvasManager.init();
    return React.createElement(SignatureCanvas, props);
  };

  console.log('React Signature Canvas integration loaded');
  console.log('Usage: <ReactSignatureCanvas penColor="blue" canvasProps={{width: 500, height: 200}} />');
})();
