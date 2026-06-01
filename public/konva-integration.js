/**
 * Konva.js Integration
 * 
 * This module provides Konva.js integration for the editor,
 * including grid snap functionality for draggable objects.
 * 
 * Reference: https://github.com/konvajs/konva
 */

(function() {
  'use strict';

  // Check if Konva is available
  if (typeof Konva === 'undefined') {
    console.warn('Konva.js is not loaded. Konva integration will not work.');
    return;
  }

  /**
   * Konva Grid Snap Manager
   * Provides grid snapping functionality for Konva draggable objects
   */
  window.KonvaGridSnap = {
    /**
     * Default grid size
     */
    gridSize: 10,

    /**
     * Enable grid snap for a Konva node
     * @param {Konva.Node} node - Konva node to enable grid snap for
     * @param {Object} options - Options for grid snap
     * @param {number} options.gridSize - Grid size (default: 10)
     * @param {boolean} options.snapX - Enable X-axis snapping (default: true)
     * @param {boolean} options.snapY - Enable Y-axis snapping (default: true)
     */
    enableForNode(node, options = {}) {
      if (!node || !(node instanceof Konva.Node)) {
        console.warn('Invalid Konva node provided to enableGridSnap');
        return;
      }

      const gridSize = options.gridSize || this.gridSize;
      const snapX = options.snapX !== false;
      const snapY = options.snapY !== false;

      // Make node draggable if not already
      node.draggable(true);

      // Add dragmove event listener for grid snapping
      node.on('dragmove', (e) => {
        const target = e.target;
        let newX = target.x();
        let newY = target.y();

        // Apply grid snap
        if (snapX) {
          newX = Math.round(newX / gridSize) * gridSize;
        }
        if (snapY) {
          newY = Math.round(newY / gridSize) * gridSize;
        }

        // Update position
        target.x(newX);
        target.y(newY);
      });
    },

    /**
     * Disable grid snap for a Konva node
     * @param {Konva.Node} node - Konva node to disable grid snap for
     */
    disableForNode(node) {
      if (!node) return;
      node.off('dragmove');
    },

    /**
     * Set global grid size
     * @param {number} size - Grid size in pixels
     */
    setGridSize(size) {
      if (typeof size === 'number' && size > 0) {
        this.gridSize = size;
      }
    },

    /**
     * Get current grid size
     * @returns {number} Current grid size
     */
    getGridSize() {
      return this.gridSize;
    },

    /**
     * Snap a point to grid
     * @param {Object} point - Point with x and y coordinates
     * @param {number} gridSize - Optional grid size (uses default if not provided)
     * @returns {Object} Snapped point with x and y coordinates
     */
    snapPoint(point, gridSize = null) {
      const size = gridSize || this.gridSize;
      return {
        x: Math.round(point.x / size) * size,
        y: Math.round(point.y / size) * size
      };
    },

    /**
     * Create a Konva stage with grid snap enabled
     * @param {Object} config - Konva Stage configuration
     * @param {Object} options - Grid snap options
     * @returns {Konva.Stage} Configured Konva stage
     */
    createStage(config, options = {}) {
      const stage = new Konva.Stage(config);
      
      // Enable grid snap for all draggable nodes added to this stage
      if (options.enableGlobalSnap !== false) {
        const gridSize = options.gridSize || this.gridSize;
        
        // Listen for node additions
        stage.on('add', (e) => {
          const node = e.target;
          if (node.draggable && node.draggable()) {
            this.enableForNode(node, { gridSize });
          }
        });
      }

      return stage;
    }
  };

  /**
   * Helper function to create a Konva shape with grid snap
   * @param {string} shapeType - Type of shape (Rect, Circle, etc.)
   * @param {Object} config - Shape configuration
   * @param {Object} options - Grid snap options
   * @returns {Konva.Shape} Created shape with grid snap enabled
   */
  window.createKonvaShapeWithGridSnap = function(shapeType, config, options = {}) {
    if (!Konva[shapeType]) {
      console.warn(`Konva shape type "${shapeType}" not found`);
      return null;
    }

    const shape = new Konva[shapeType](config);
    
    // Enable grid snap if draggable
    if (config.draggable !== false) {
      KonvaGridSnap.enableForNode(shape, options);
    }

    return shape;
  };

  /**
   * Example usage helper
   */
  window.KonvaIntegrationExample = {
    /**
     * Create a simple draggable rectangle with grid snap
     * @param {Konva.Layer} layer - Layer to add rectangle to
     * @param {Object} config - Rectangle configuration
     * @param {number} gridSize - Grid size (default: 10)
     * @returns {Konva.Rect} Created rectangle
     */
    createDraggableRect(layer, config = {}, gridSize = 10) {
      const rect = new Konva.Rect({
        x: config.x || 50,
        y: config.y || 50,
        width: config.width || 100,
        height: config.height || 50,
        fill: config.fill || '#00D2FF',
        stroke: config.stroke || 'black',
        strokeWidth: config.strokeWidth || 4,
        draggable: true,
        ...config
      });

      // Enable grid snap
      KonvaGridSnap.enableForNode(rect, { gridSize });

      // Add to layer
      if (layer) {
        layer.add(rect);
      }

      return rect;
    },

    /**
     * Create a simple draggable circle with grid snap
     * @param {Konva.Layer} layer - Layer to add circle to
     * @param {Object} config - Circle configuration
     * @param {number} gridSize - Grid size (default: 10)
     * @returns {Konva.Circle} Created circle
     */
    createDraggableCircle(layer, config = {}, gridSize = 10) {
      const circle = new Konva.Circle({
        x: config.x || 100,
        y: config.y || 100,
        radius: config.radius || 50,
        fill: config.fill || '#00D2FF',
        stroke: config.stroke || 'black',
        strokeWidth: config.strokeWidth || 4,
        draggable: true,
        ...config
      });

      // Enable grid snap
      KonvaGridSnap.enableForNode(circle, { gridSize });

      // Add to layer
      if (layer) {
        layer.add(circle);
      }

      return circle;
    }
  };

  /**
   * Konva Layer Management
   * Provides comprehensive layer management functionality for Konva stages
   */
  window.KonvaLayerManager = {
    /**
     * Create a new layer
     * @param {Konva.Stage} stage - Konva stage to add layer to
     * @param {Object} options - Layer options
     * @param {string} options.name - Layer name
     * @param {boolean} options.visible - Layer visibility (default: true)
     * @param {boolean} options.listening - Layer listening state (default: true)
     * @param {number} options.opacity - Layer opacity (0-1, default: 1)
     * @returns {Konva.Layer} Created layer
     */
    createLayer(stage, options = {}) {
      if (!stage || !(stage instanceof Konva.Stage)) {
        console.warn('Invalid Konva stage provided to createLayer');
        return null;
      }

      const layer = new Konva.Layer({
        name: options.name || `Layer ${stage.children.length + 1}`,
        visible: options.visible !== false,
        listening: options.listening !== false,
        opacity: options.opacity !== undefined ? options.opacity : 1,
        ...options
      });

      stage.add(layer);
      return layer;
    },

    /**
     * Get layer by name
     * @param {Konva.Stage} stage - Konva stage
     * @param {string} name - Layer name
     * @returns {Konva.Layer|null} Found layer or null
     */
    getLayerByName(stage, name) {
      if (!stage) return null;
      return stage.findOne(`.${name}`) || stage.children.find(layer => layer.name() === name) || null;
    },

    /**
     * Get layer by index
     * @param {Konva.Stage} stage - Konva stage
     * @param {number} index - Layer index
     * @returns {Konva.Layer|null} Found layer or null
     */
    getLayerByIndex(stage, index) {
      if (!stage || !stage.children[index]) return null;
      return stage.children[index];
    },

    /**
     * Get all layers
     * @param {Konva.Stage} stage - Konva stage
     * @returns {Array<Konva.Layer>} Array of layers
     */
    getAllLayers(stage) {
      if (!stage) return [];
      return stage.children.filter(child => child instanceof Konva.Layer);
    },

    /**
     * Remove layer
     * @param {Konva.Stage} stage - Konva stage
     * @param {Konva.Layer|string|number} layer - Layer instance, name, or index
     * @returns {boolean} Success status
     */
    removeLayer(stage, layer) {
      if (!stage) return false;

      let targetLayer = null;
      if (typeof layer === 'string') {
        targetLayer = this.getLayerByName(stage, layer);
      } else if (typeof layer === 'number') {
        targetLayer = this.getLayerByIndex(stage, layer);
      } else if (layer instanceof Konva.Layer) {
        targetLayer = layer;
      }

      if (!targetLayer) return false;

      targetLayer.destroy();
      return true;
    },

    /**
     * Show layer
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    showLayer(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return false;
      targetLayer.show();
      targetLayer.draw();
      return true;
    },

    /**
     * Hide layer
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    hideLayer(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return false;
      targetLayer.hide();
      targetLayer.draw();
      return true;
    },

    /**
     * Toggle layer visibility
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} New visibility state
     */
    toggleLayerVisibility(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return false;
      const isVisible = targetLayer.visible();
      if (isVisible) {
        this.hideLayer(targetLayer);
      } else {
        this.showLayer(targetLayer);
      }
      return !isVisible;
    },

    /**
     * Set layer opacity
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {number} opacity - Opacity value (0-1)
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    setLayerOpacity(layer, opacity, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return false;
      targetLayer.opacity(Math.max(0, Math.min(1, opacity)));
      targetLayer.draw();
      return true;
    },

    /**
     * Move layer to top (highest z-index)
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    moveLayerToTop(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !stage) return false;
      targetLayer.moveToTop();
      stage.draw();
      return true;
    },

    /**
     * Move layer to bottom (lowest z-index)
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    moveLayerToBottom(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !stage) return false;
      targetLayer.moveToBottom();
      stage.draw();
      return true;
    },

    /**
     * Move layer up (one position)
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    moveLayerUp(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !stage) return false;
      targetLayer.moveUp();
      stage.draw();
      return true;
    },

    /**
     * Move layer down (one position)
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    moveLayerDown(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !stage) return false;
      targetLayer.moveDown();
      stage.draw();
      return true;
    },

    /**
     * Move layer to specific index
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {number} index - Target index
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    moveLayerToIndex(layer, index, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !stage) return false;
      const maxIndex = stage.children.length - 1;
      const targetIndex = Math.max(0, Math.min(maxIndex, index));
      targetLayer.zIndex(targetIndex);
      stage.draw();
      return true;
    },

    /**
     * Lock layer (disable interactions)
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    lockLayer(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return false;
      targetLayer.listening(false);
      // Lock all children
      targetLayer.children.forEach(child => {
        child.draggable(false);
        child.listening(false);
      });
      targetLayer.draw();
      return true;
    },

    /**
     * Unlock layer (enable interactions)
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    unlockLayer(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return false;
      targetLayer.listening(true);
      // Unlock all children (restore their draggable state)
      targetLayer.children.forEach(child => {
        child.listening(true);
        // Note: We don't restore draggable state automatically
        // as it might have been false before locking
      });
      targetLayer.draw();
      return true;
    },

    /**
     * Rename layer
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {string} newName - New layer name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    renameLayer(layer, newName, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !newName) return false;
      targetLayer.name(newName);
      return true;
    },

    /**
     * Clone layer
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @param {Object} options - Clone options
     * @param {string} options.name - Name for cloned layer
     * @returns {Konva.Layer|null} Cloned layer or null
     */
    cloneLayer(layer, stage = null, options = {}) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !stage) return null;

      const clonedLayer = targetLayer.clone({
        name: options.name || `${targetLayer.name()} Copy`
      });

      stage.add(clonedLayer);
      return clonedLayer;
    },

    /**
     * Get layer info
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {Object|null} Layer info object
     */
    getLayerInfo(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer || !stage) return null;

      const index = stage.children.indexOf(targetLayer);
      return {
        name: targetLayer.name(),
        index: index,
        visible: targetLayer.visible(),
        listening: targetLayer.listening(),
        opacity: targetLayer.opacity(),
        nodeCount: targetLayer.children.length,
        zIndex: targetLayer.zIndex()
      };
    },

    /**
     * Get all layers info
     * @param {Konva.Stage} stage - Konva stage
     * @returns {Array<Object>} Array of layer info objects
     */
    getAllLayersInfo(stage) {
      if (!stage) return [];
      return this.getAllLayers(stage).map(layer => this.getLayerInfo(layer, stage));
    },

    /**
     * Clear layer (remove all nodes)
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @returns {boolean} Success status
     */
    clearLayer(layer, stage = null) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return false;
      targetLayer.destroyChildren();
      targetLayer.draw();
      return true;
    },

    /**
     * Export layer to image
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage (required if layer is string)
     * @param {Object} options - Export options
     * @param {string} options.mimeType - MIME type (default: 'image/png')
     * @param {number} options.quality - Quality for JPEG (0-1, default: 1)
     * @param {number} options.pixelRatio - Pixel ratio (default: 1)
     * @returns {Promise<string>} Data URL of exported image
     */
    async exportLayerToImage(layer, stage = null, options = {}) {
      const targetLayer = this._resolveLayer(layer, stage);
      if (!targetLayer) return null;

      const mimeType = options.mimeType || 'image/png';
      const quality = options.quality !== undefined ? options.quality : 1;
      const pixelRatio = options.pixelRatio || 1;

      return new Promise((resolve, reject) => {
        targetLayer.toDataURL({
          mimeType,
          quality,
          pixelRatio,
          callback: (dataUrl) => {
            if (dataUrl) {
              resolve(dataUrl);
            } else {
              reject(new Error('Failed to export layer to image'));
            }
          }
        });
      });
    },

    /**
     * Helper method to resolve layer from various input types
     * @private
     * @param {Konva.Layer|string} layer - Layer instance or name
     * @param {Konva.Stage} stage - Konva stage
     * @returns {Konva.Layer|null} Resolved layer or null
     */
    _resolveLayer(layer, stage) {
      if (layer instanceof Konva.Layer) {
        return layer;
      }
      if (typeof layer === 'string' && stage) {
        return this.getLayerByName(stage, layer);
      }
      return null;
    }
  };

  console.log('Konva.js Grid Snap integration loaded');
  console.log('Usage: KonvaGridSnap.enableForNode(node, { gridSize: 10 })');
  console.log('Konva.js Layer Management loaded');
  console.log('Usage: KonvaLayerManager.createLayer(stage, { name: "My Layer" })');
})();
