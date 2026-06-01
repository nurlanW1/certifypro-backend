/**
 * Transform Frame Library
 * Professional bounding box and transform handles for canvas-based editors
 * 
 * Features:
 * - Selection frame (bounding box)
 * - 8 resize handles (nw, n, ne, e, se, s, sw, w)
 * - Rotate handle
 * - Center lines (vertical & horizontal)
 * - Visual feedback
 * - Customizable styles
 */

class TransformFrame {
  constructor(options = {}) {
    this.container = options.container || null;
    this.canvas = null;
    this.ctx = null;
    this.selectedObject = null;
    this.zoom = options.zoom || 1;
    
    // Style configuration
    this.styles = {
      frame: {
        stroke: options.frameColor || '#2563eb',
        strokeWidth: options.frameWidth || 2,
        dash: options.frameDash || [4, 4],
        fill: 'transparent'
      },
      handle: {
        fill: options.handleFill || '#ffffff',
        stroke: options.handleStroke || '#2563eb',
        strokeWidth: options.handleStrokeWidth || 2,
        size: options.handleSize || 10,
        hoverSize: options.handleHoverSize || 12
      },
      rotateHandle: {
        fill: options.rotateFill || '#ffffff',
        stroke: options.rotateStroke || '#2563eb',
        strokeWidth: options.rotateStrokeWidth || 2,
        size: options.rotateSize || 10,
        distance: options.rotateDistance || 32,
        icon: options.showRotateIcon !== false
      },
      centerLine: {
        stroke: options.centerLineColor || '#2563eb',
        strokeWidth: options.centerLineWidth || 1,
        dash: options.centerLineDash || [2, 2],
        opacity: options.centerLineOpacity || 0.5
      }
    };
    
    // Handle positions cache
    this.handlePositions = {};
    this.hoveredHandle = null;
    this.isDragging = false;
    
    // Event callbacks
    this.onResizeStart = options.onResizeStart || null;
    this.onResize = options.onResize || null;
    this.onResizeEnd = options.onResizeEnd || null;
    this.onRotateStart = options.onRotateStart || null;
    this.onRotate = options.onRotate || null;
    this.onRotateEnd = options.onRotateEnd || null;
    this.onMoveStart = options.onMoveStart || null;
    this.onMove = options.onMove || null;
    this.onMoveEnd = options.onMoveEnd || null;
    
    // Initialize
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.error('TransformFrame: container is required');
      return;
    }
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'auto';
    this.canvas.style.zIndex = '1000';
    this.canvas.style.cursor = 'default';
    this.container.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size
    this.resize();
    
    // Event listeners
    this.setupEventListeners();
    
    // Window resize handler
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    if (!this.container || !this.canvas) return;
    
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    
    this.render();
  }
  
  setupEventListeners() {
    if (!this.canvas) return;
    
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseDown({
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0
      });
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.handleMouseUp({});
    });
  }
  
  /**
   * Set the selected object to display transform frame
   * @param {Object} object - Object with {x, y, w, h, rotate} properties
   */
  setSelectedObject(object) {
    this.selectedObject = object;
    this.render();
  }
  
  /**
   * Clear selection
   */
  clearSelection() {
    this.selectedObject = null;
    this.hoveredHandle = null;
    this.render();
  }
  
  /**
   * Update zoom level
   */
  setZoom(zoom) {
    this.zoom = zoom;
    this.render();
  }
  
  /**
   * Calculate handle positions based on object bounds
   */
  calculateHandlePositions() {
    if (!this.selectedObject) return {};
    
    const { x, y, w, h, rotate = 0 } = this.selectedObject;
    const cx = x + w / 2;
    const cy = y + h / 2;
    
    const positions = {
      nw: { x: x, y: y },
      n: { x: cx, y: y },
      ne: { x: x + w, y: y },
      e: { x: x + w, y: cy },
      se: { x: x + w, y: y + h },
      s: { x: cx, y: y + h },
      sw: { x: x, y: y + h },
      w: { x: x, y: cy },
      rotate: {
        x: cx,
        y: y - this.styles.rotateHandle.distance
      },
      center: { x: cx, y: cy }
    };
    
    // Apply rotation if needed
    if (Math.abs(rotate) > 0.01) {
      const rad = (rotate * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      
      Object.keys(positions).forEach(key => {
        if (key === 'center') return;
        const pos = positions[key];
        const dx = pos.x - cx;
        const dy = pos.y - cy;
        pos.x = cx + dx * cos - dy * sin;
        pos.y = cy + dx * sin + dy * cos;
      });
    }
    
    return positions;
  }
  
  /**
   * Get handle at point (square hit test)
   */
  getHandleAtPoint(x, y) {
    const positions = this.calculateHandlePositions();
    const handleSize = this.styles.handle.size / this.zoom;
    const threshold = handleSize * 1.5;
    const halfThreshold = threshold / 2;
    
    for (const [key, pos] of Object.entries(positions)) {
      if (key === 'center') continue;
      
      // For square handles, use rectangular hit test
      const dx = Math.abs(x - pos.x);
      const dy = Math.abs(y - pos.y);
      
      // Check if point is within square bounds
      if (dx <= halfThreshold && dy <= halfThreshold) {
        return key;
      }
    }
    
    return null;
  }
  
  /**
   * Get cursor for handle
   */
  getCursorForHandle(handle) {
    const cursors = {
      nw: 'nwse-resize',
      n: 'ns-resize',
      ne: 'nesw-resize',
      e: 'ew-resize',
      se: 'nwse-resize',
      s: 'ns-resize',
      sw: 'nesw-resize',
      w: 'ew-resize',
      rotate: 'grab',
      center: 'move'
    };
    return cursors[handle] || 'default';
  }
  
  /**
   * Render transform frame
   */
  render() {
    if (!this.ctx || !this.canvas) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!this.selectedObject) return;
    
    const { x, y, w, h, rotate = 0 } = this.selectedObject;
    const positions = this.calculateHandlePositions();
    this.handlePositions = positions;
    
    // Save context
    this.ctx.save();
    
    // Apply zoom
    this.ctx.scale(this.zoom, this.zoom);
    
    // Draw frame (bounding box)
    this.drawFrame(x, y, w, h, rotate);
    
    // Draw center lines
    this.drawCenterLines(positions.center);
    
    // Draw handles
    this.drawHandles(positions);
    
    // Draw rotate handle
    this.drawRotateHandle(positions.rotate, positions.center);
    
    // Restore context
    this.ctx.restore();
  }
  
  /**
   * Draw bounding box frame (with square corners)
   */
  drawFrame(x, y, w, h, rotate) {
    const style = this.styles.frame;
    this.ctx.save();
    
    // Apply rotation
    const cx = x + w / 2;
    const cy = y + h / 2;
    this.ctx.translate(cx, cy);
    this.ctx.rotate((rotate * Math.PI) / 180);
    this.ctx.translate(-cx, -cy);
    
    // Draw frame with square corners
    this.ctx.strokeStyle = style.stroke;
    this.ctx.lineWidth = style.strokeWidth / this.zoom;
    this.ctx.setLineDash(style.dash);
    this.ctx.lineJoin = 'miter';
    this.ctx.lineCap = 'square';
    this.ctx.miterLimit = 10;
    
    // Draw rectangle with sharp corners
    this.ctx.strokeRect(x, y, w, h);
    
    this.ctx.restore();
  }
  
  /**
   * Draw center lines
   */
  drawCenterLines(center) {
    const style = this.styles.centerLine;
    this.ctx.save();
    
    this.ctx.strokeStyle = style.stroke;
    this.ctx.globalAlpha = style.opacity;
    this.ctx.lineWidth = style.strokeWidth / this.zoom;
    this.ctx.setLineDash(style.dash);
    
    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(center.x, 0);
    this.ctx.lineTo(center.x, this.canvas.height / this.zoom);
    this.ctx.stroke();
    
    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(0, center.y);
    this.ctx.lineTo(this.canvas.width / this.zoom, center.y);
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  /**
   * Draw resize handles (square corners)
   */
  drawHandles(positions) {
    const style = this.styles.handle;
    const handleSize = style.size / this.zoom;
    const isHovered = (key) => this.hoveredHandle === key;
    
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    
    handles.forEach(key => {
      const pos = positions[key];
      if (!pos) return;
      
      const size = isHovered(key) ? style.hoverSize / this.zoom : handleSize;
      const halfSize = size / 2;
      
      this.ctx.save();
      
      // Draw square handle
      this.ctx.fillStyle = style.fill;
      this.ctx.strokeStyle = style.stroke;
      this.ctx.lineWidth = style.strokeWidth / this.zoom;
      this.ctx.lineJoin = 'miter';
      this.ctx.lineCap = 'square';
      
      // Draw square (centered at pos)
      this.ctx.fillRect(pos.x - halfSize, pos.y - halfSize, size, size);
      this.ctx.strokeRect(pos.x - halfSize, pos.y - halfSize, size, size);
      
      this.ctx.restore();
    });
  }
  
  /**
   * Draw rotate handle
   */
  drawRotateHandle(rotatePos, center) {
    const style = this.styles.rotateHandle;
    const size = (this.hoveredHandle === 'rotate' ? style.size * 1.2 : style.size) / this.zoom;
    
    this.ctx.save();
    
    // Draw line from center to rotate handle
    this.ctx.strokeStyle = style.stroke;
    this.ctx.lineWidth = (style.strokeWidth * 0.5) / this.zoom;
    this.ctx.setLineDash([2, 2]);
    this.ctx.beginPath();
    this.ctx.moveTo(center.x, center.y);
    this.ctx.lineTo(rotatePos.x, rotatePos.y);
    this.ctx.stroke();
    
    // Draw rotate handle circle
    this.ctx.fillStyle = style.fill;
    this.ctx.strokeStyle = style.stroke;
    this.ctx.lineWidth = style.strokeWidth / this.zoom;
    this.ctx.setLineDash([]);
    
    this.ctx.beginPath();
    this.ctx.arc(rotatePos.x, rotatePos.y, size / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw rotate icon if enabled
    if (style.icon) {
      this.drawRotateIcon(rotatePos, size);
    }
    
    this.ctx.restore();
  }
  
  /**
   * Draw rotate icon (circular arrow)
   */
  drawRotateIcon(pos, size) {
    this.ctx.save();
    this.ctx.strokeStyle = this.styles.rotateHandle.stroke;
    this.ctx.lineWidth = (this.styles.rotateHandle.strokeWidth * 0.8) / this.zoom;
    this.ctx.lineCap = 'round';
    
    const radius = size * 0.3;
    const startAngle = -Math.PI / 4;
    const endAngle = Math.PI * 1.5;
    
    // Draw arc
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, startAngle, endAngle);
    this.ctx.stroke();
    
    // Draw arrow head
    const arrowAngle = endAngle;
    const arrowX = pos.x + Math.cos(arrowAngle) * radius;
    const arrowY = pos.y + Math.sin(arrowAngle) * radius;
    
    this.ctx.beginPath();
    this.ctx.moveTo(arrowX, arrowY);
    this.ctx.lineTo(
      arrowX - Math.cos(arrowAngle - Math.PI / 6) * radius * 0.4,
      arrowY - Math.sin(arrowAngle - Math.PI / 6) * radius * 0.4
    );
    this.ctx.moveTo(arrowX, arrowY);
    this.ctx.lineTo(
      arrowX - Math.cos(arrowAngle + Math.PI / 6) * radius * 0.4,
      arrowY - Math.sin(arrowAngle + Math.PI / 6) * radius * 0.4
    );
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  /**
   * Handle mouse down
   */
  handleMouseDown(e) {
    if (!this.selectedObject) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.zoom;
    const y = (e.clientY - rect.top) / this.zoom;
    
    const handle = this.getHandleAtPoint(x, y);
    
    if (!handle) {
      // Check if clicking on frame (for move)
      const { x: objX, y: objY, w, h } = this.selectedObject;
      if (x >= objX && x <= objX + w && y >= objY && y <= objY + h) {
        if (this.onMoveStart) {
          this.isDragging = true;
          this.dragStart = { x, y, handle: 'center' };
          this.onMoveStart({ x, y, originalEvent: e });
        }
      }
      return;
    }
    
    this.isDragging = true;
    this.dragStart = { x, y, handle };
    
    if (handle === 'rotate') {
      if (this.onRotateStart) {
        this.onRotateStart({ x, y, originalEvent: e });
      }
    } else if (handle !== 'center') {
      if (this.onResizeStart) {
        this.onResizeStart({ handle, x, y, originalEvent: e });
      }
    }
  }
  
  /**
   * Handle mouse move
   */
  handleMouseMove(e) {
    if (!this.selectedObject) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.zoom;
    const y = (e.clientY - rect.top) / this.zoom;
    
    if (this.isDragging && this.dragStart) {
      const dx = x - this.dragStart.x;
      const dy = y - this.dragStart.y;
      
      if (this.dragStart.handle === 'rotate') {
        if (this.onRotate) {
          const center = this.handlePositions.center;
          const startAngle = Math.atan2(
            this.dragStart.y - center.y,
            this.dragStart.x - center.x
          );
          const currentAngle = Math.atan2(y - center.y, x - center.x);
          const deltaAngle = ((currentAngle - startAngle) * 180) / Math.PI;
          this.onRotate({ angle: deltaAngle, x, y, originalEvent: e });
        }
      } else if (this.dragStart.handle === 'center') {
        if (this.onMove) {
          this.onMove({ dx, dy, x, y, originalEvent: e });
        }
      } else {
        if (this.onResize) {
          this.onResize({
            handle: this.dragStart.handle,
            dx,
            dy,
            x,
            y,
            originalEvent: e
          });
        }
      }
      
      this.render();
      return;
    }
    
    // Update hover state
    const handle = this.getHandleAtPoint(x, y);
    if (handle !== this.hoveredHandle) {
      this.hoveredHandle = handle;
      this.canvas.style.cursor = handle ? this.getCursorForHandle(handle) : 'default';
      this.render();
    }
  }
  
  /**
   * Handle mouse up
   */
  handleMouseUp(e) {
    if (!this.isDragging || !this.dragStart) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.zoom;
    const y = (e.clientY - rect.top) / this.zoom;
    
    if (this.dragStart.handle === 'rotate') {
      if (this.onRotateEnd) {
        this.onRotateEnd({ x, y, originalEvent: e });
      }
    } else if (this.dragStart.handle === 'center') {
      if (this.onMoveEnd) {
        this.onMoveEnd({ x, y, originalEvent: e });
      }
    } else {
      if (this.onResizeEnd) {
        this.onResizeEnd({ handle: this.dragStart.handle, x, y, originalEvent: e });
      }
    }
    
    this.isDragging = false;
    this.dragStart = null;
  }
  
  /**
   * Handle mouse leave
   */
  handleMouseLeave() {
    this.hoveredHandle = null;
    this.canvas.style.cursor = 'default';
    if (!this.isDragging) {
      this.render();
    }
  }
  
  /**
   * Destroy transform frame
   */
  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
    this.selectedObject = null;
  }
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TransformFrame;
} else {
  window.TransformFrame = TransformFrame;
}
