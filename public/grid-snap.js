/**
 * Grid Snap & Guidelines Snap Library
 * Enhanced snapping functionality for precise element positioning
 * 
 * Features:
 * - Grid snapping (configurable grid size)
 * - Guidelines snapping (smart guides)
 * - Object-to-object snapping
 * - Visual snap indicators
 * - Smooth snap transitions
 */

class GridSnapManager {
  constructor(options = {}) {
    this.gridSize = options.gridSize || 10;
    this.snapThreshold = options.snapThreshold || 5;
    this.enabled = options.enabled !== false;
    this.showGrid = options.showGrid !== false;
    this.showSnapIndicators = options.showSnapIndicators !== false;
    
    // Guidelines
    this.guidelines = options.guidelines || [];
    this.guidelineSnapEnabled = options.guidelineSnapEnabled !== false;
    this.guidelineThreshold = options.guidelineThreshold || 6;
    
    // Object snapping
    this.objectSnapEnabled = options.objectSnapEnabled !== false;
    this.objects = options.objects || [];
    this.objectSnapThreshold = options.objectSnapThreshold || 6;
    
    // Visual feedback
    this.snapIndicators = {
      vertical: null,
      horizontal: null
    };
    
    // Callbacks
    this.onSnap = options.onSnap || null;
    this.onUnsnap = options.onUnsnap || null;
  }
  
  /**
   * Enable/disable grid snapping
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  
  /**
   * Set grid size
   */
  setGridSize(size) {
    this.gridSize = Math.max(1, size);
  }
  
  /**
   * Add guideline
   */
  addGuideline(axis, position) {
    const id = `guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.guidelines.push({ id, axis, position });
    return id;
  }
  
  /**
   * Remove guideline
   */
  removeGuideline(id) {
    this.guidelines = this.guidelines.filter(g => g.id !== id);
  }
  
  /**
   * Clear all guidelines
   */
  clearGuidelines() {
    this.guidelines = [];
  }
  
  /**
   * Update objects list for object-to-object snapping
   */
  updateObjects(objects) {
    this.objects = objects || [];
  }
  
  /**
   * Snap value to grid
   */
  snapToGrid(value) {
    if (!this.enabled) return value;
    return Math.round(value / this.gridSize) * this.gridSize;
  }
  
  /**
   * Snap point to grid
   */
  snapPointToGrid(point) {
    return {
      x: this.snapToGrid(point.x),
      y: this.snapToGrid(point.y)
    };
  }
  
  /**
   * Find nearest guideline snap
   */
  findGuidelineSnap(value, axis, threshold = null) {
    if (!this.guidelineSnapEnabled) return null;
    
    const thresh = threshold || this.guidelineThreshold;
    const relevantGuides = this.guidelines.filter(g => g.axis === axis);
    
    let nearest = null;
    let minDist = Infinity;
    
    relevantGuides.forEach(guide => {
      const dist = Math.abs(value - guide.position);
      if (dist < thresh && dist < minDist) {
        minDist = dist;
        nearest = guide.position;
      }
    });
    
    return nearest;
  }
  
  /**
   * Find object snap candidates
   */
  findObjectSnapCandidates(movingObject, threshold = null) {
    if (!this.objectSnapEnabled || !this.objects.length) {
      return { xs: [], ys: [] };
    }
    
    const thresh = threshold || this.objectSnapThreshold;
    const xs = new Set();
    const ys = new Set();
    
    this.objects.forEach(obj => {
      if (obj.id === movingObject.id) return;
      
      // Object edges
      xs.add(obj.x);
      xs.add(obj.x + obj.w / 2);
      xs.add(obj.x + obj.w);
      ys.add(obj.y);
      ys.add(obj.y + obj.h / 2);
      ys.add(obj.y + obj.h);
    });
    
    return { xs: Array.from(xs), ys: Array.from(ys) };
  }
  
  /**
   * Find nearest object snap
   */
  findObjectSnap(value, axis, movingObject, threshold = null) {
    if (!this.objectSnapEnabled) return null;
    
    const candidates = this.findObjectSnapCandidates(movingObject, threshold);
    const values = axis === 'x' ? candidates.xs : candidates.ys;
    const thresh = threshold || this.objectSnapThreshold;
    
    let nearest = null;
    let minDist = Infinity;
    
    values.forEach(candidate => {
      const dist = Math.abs(value - candidate);
      if (dist < thresh && dist < minDist) {
        minDist = dist;
        nearest = candidate;
      }
    });
    
    return nearest;
  }
  
  /**
   * Snap rectangle with all snapping options
   */
  snapRect(rect, movingObject = null) {
    let { x, y, w, h } = rect;
    let snapX = null;
    let snapY = null;
    
    // Grid snap
    if (this.enabled) {
      x = this.snapToGrid(x);
      y = this.snapToGrid(y);
    }
    
    // Guideline snap
    if (this.guidelineSnapEnabled) {
      const guideX = this.findGuidelineSnap(x, 'x');
      const guideY = this.findGuidelineSnap(y, 'y');
      const guideXRight = this.findGuidelineSnap(x + w, 'x');
      const guideYBottom = this.findGuidelineSnap(y + h, 'y');
      const guideXCenter = this.findGuidelineSnap(x + w / 2, 'x');
      const guideYCenter = this.findGuidelineSnap(y + h / 2, 'y');
      
      if (guideX !== null) {
        snapX = guideX;
        x = guideX;
      } else if (guideXRight !== null) {
        snapX = guideXRight;
        x = guideXRight - w;
      } else if (guideXCenter !== null) {
        snapX = guideXCenter;
        x = guideXCenter - w / 2;
      }
      
      if (guideY !== null) {
        snapY = guideY;
        y = guideY;
      } else if (guideYBottom !== null) {
        snapY = guideYBottom;
        y = guideYBottom - h;
      } else if (guideYCenter !== null) {
        snapY = guideYCenter;
        y = guideYCenter - h / 2;
      }
    }
    
    // Object snap
    if (this.objectSnapEnabled && movingObject) {
      const objSnapX = this.findObjectSnap(x, 'x', movingObject);
      const objSnapY = this.findObjectSnap(y, 'y', movingObject);
      const objSnapXRight = this.findObjectSnap(x + w, 'x', movingObject);
      const objSnapYBottom = this.findObjectSnap(y + h, 'y', movingObject);
      const objSnapXCenter = this.findObjectSnap(x + w / 2, 'x', movingObject);
      const objSnapYCenter = this.findObjectSnap(y + h / 2, 'y', movingObject);
      
      if (objSnapX !== null && (snapX === null || Math.abs(x - objSnapX) < Math.abs(x - (snapX || x)))) {
        snapX = objSnapX;
        x = objSnapX;
      } else if (objSnapXRight !== null && (snapX === null || Math.abs(x + w - objSnapXRight) < Math.abs(x + w - (snapX || x + w)))) {
        snapX = objSnapXRight;
        x = objSnapXRight - w;
      } else if (objSnapXCenter !== null && (snapX === null || Math.abs(x + w / 2 - objSnapXCenter) < Math.abs(x + w / 2 - (snapX || x + w / 2)))) {
        snapX = objSnapXCenter;
        x = objSnapXCenter - w / 2;
      }
      
      if (objSnapY !== null && (snapY === null || Math.abs(y - objSnapY) < Math.abs(y - (snapY || y)))) {
        snapY = objSnapY;
        y = objSnapY;
      } else if (objSnapYBottom !== null && (snapY === null || Math.abs(y + h - objSnapYBottom) < Math.abs(y + h - (snapY || y + h)))) {
        snapY = objSnapYBottom;
        y = objSnapYBottom - h;
      } else if (objSnapYCenter !== null && (snapY === null || Math.abs(y + h / 2 - objSnapYCenter) < Math.abs(y + h / 2 - (snapY || y + h / 2)))) {
        snapY = objSnapYCenter;
        y = objSnapYCenter - h / 2;
      }
    }
    
    // Notify snap events
    if (snapX !== null || snapY !== null) {
      if (this.onSnap) {
        this.onSnap({ x: snapX, y: snapY });
      }
    } else {
      if (this.onUnsnap) {
        this.onUnsnap();
      }
    }
    
    return { x, y, w, h, snapX, snapY };
  }
  
  /**
   * Snap point (for drag operations)
   */
  snapPoint(point, movingObject = null) {
    let { x, y } = point;
    let snapX = null;
    let snapY = null;
    
    // Grid snap
    if (this.enabled) {
      x = this.snapToGrid(x);
      y = this.snapToGrid(y);
    }
    
    // Guideline snap
    if (this.guidelineSnapEnabled) {
      const guideX = this.findGuidelineSnap(x, 'x');
      const guideY = this.findGuidelineSnap(y, 'y');
      
      if (guideX !== null) {
        snapX = guideX;
        x = guideX;
      }
      
      if (guideY !== null) {
        snapY = guideY;
        y = guideY;
      }
    }
    
    // Object snap
    if (this.objectSnapEnabled && movingObject) {
      const objSnapX = this.findObjectSnap(x, 'x', movingObject);
      const objSnapY = this.findObjectSnap(y, 'y', movingObject);
      
      if (objSnapX !== null && (snapX === null || Math.abs(x - objSnapX) < Math.abs(x - (snapX || x)))) {
        snapX = objSnapX;
        x = objSnapX;
      }
      
      if (objSnapY !== null && (snapY === null || Math.abs(y - objSnapY) < Math.abs(y - (snapY || y)))) {
        snapY = objSnapY;
        y = objSnapY;
      }
    }
    
    return { x, y, snapX, snapY };
  }
  
  /**
   * Create visual snap indicators
   */
  createSnapIndicators(container) {
    if (!this.showSnapIndicators) return;
    
    // Vertical indicator
    this.snapIndicators.vertical = document.createElement('div');
    this.snapIndicators.vertical.className = 'grid-snap-indicator grid-snap-indicator--vertical';
    this.snapIndicators.vertical.style.cssText = `
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      background: #2563eb;
      pointer-events: none;
      z-index: 10000;
      display: none;
      opacity: 0.8;
    `;
    container.appendChild(this.snapIndicators.vertical);
    
    // Horizontal indicator
    this.snapIndicators.horizontal = document.createElement('div');
    this.snapIndicators.horizontal.className = 'grid-snap-indicator grid-snap-indicator--horizontal';
    this.snapIndicators.horizontal.style.cssText = `
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: #2563eb;
      pointer-events: none;
      z-index: 10000;
      display: none;
      opacity: 0.8;
    `;
    container.appendChild(this.snapIndicators.horizontal);
  }
  
  /**
   * Show snap indicator
   */
  showSnapIndicator(axis, position) {
    if (!this.showSnapIndicators) return;
    
    const indicator = axis === 'x' 
      ? this.snapIndicators.vertical 
      : this.snapIndicators.horizontal;
    
    if (indicator) {
      if (axis === 'x') {
        indicator.style.left = `${position}px`;
      } else {
        indicator.style.top = `${position}px`;
      }
      indicator.style.display = 'block';
    }
  }
  
  /**
   * Hide snap indicators
   */
  hideSnapIndicators() {
    if (this.snapIndicators.vertical) {
      this.snapIndicators.vertical.style.display = 'none';
    }
    if (this.snapIndicators.horizontal) {
      this.snapIndicators.horizontal.style.display = 'none';
    }
  }
  
  /**
   * Update snap indicators based on snap result
   */
  updateSnapIndicators(snapResult) {
    if (!this.showSnapIndicators) return;
    
    if (snapResult.snapX !== null) {
      this.showSnapIndicator('x', snapResult.snapX);
    } else {
      if (this.snapIndicators.vertical) {
        this.snapIndicators.vertical.style.display = 'none';
      }
    }
    
    if (snapResult.snapY !== null) {
      this.showSnapIndicator('y', snapResult.snapY);
    } else {
      if (this.snapIndicators.horizontal) {
        this.snapIndicators.horizontal.style.display = 'none';
      }
    }
  }
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GridSnapManager;
} else {
  window.GridSnapManager = GridSnapManager;
}
