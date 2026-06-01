/**
 * Hammer.js Gestures Integration
 * Enhanced touch and gesture support for the editor
 * 
 * This module integrates Hammer.js with the editor for better
 * touch gesture support on mobile and tablet devices.
 */

(function() {
  'use strict';

  // Wait for Hammer.js to load
  if (typeof Hammer === 'undefined') {
    console.warn('Hammer.js is not loaded. Gesture support will be limited.');
    return;
  }

  /**
   * Initialize Hammer.js gestures for editor elements
   */
  function initEditorGestures() {
    const stage = document.querySelector('[data-stage]');
    const viewport = document.querySelector('[data-viewport]');
    
    if (!stage) return;

    // Create Hammer manager for stage
    const stageManager = new Hammer.Manager(stage, {
      recognizers: [
        [Hammer.Tap, { time: 250 }],
        [Hammer.DoubleTap, { time: 300 }],
        [Hammer.Press, { time: 500, threshold: 10 }],
        [Hammer.Pan, { threshold: 10, direction: Hammer.DIRECTION_ALL }],
        [Hammer.Pinch, { threshold: 0.1 }],
        [Hammer.Rotate, { threshold: 0.1 }],
        [Hammer.Swipe, { velocity: 0.3, threshold: 10, direction: Hammer.DIRECTION_ALL }]
      ]
    });

    // Tap gesture - select element
    stageManager.on('tap', function(e) {
      const nodeEl = e.target.closest?.('.pf-node');
      if (nodeEl && nodeEl.dataset.id) {
        const event = new CustomEvent('gesture:select', {
          detail: { id: nodeEl.dataset.id, originalEvent: e }
        });
        stage.dispatchEvent(event);
      }
    });

    // Double tap - edit text
    stageManager.on('doubletap', function(e) {
      const nodeEl = e.target.closest?.('.pf-node');
      if (nodeEl && nodeEl.dataset.id) {
        const event = new CustomEvent('gesture:doubletap', {
          detail: { id: nodeEl.dataset.id, originalEvent: e }
        });
        stage.dispatchEvent(event);
      }
    });

    // Press - show context menu or start drag
    stageManager.on('press', function(e) {
      const nodeEl = e.target.closest?.('.pf-node');
      if (nodeEl && nodeEl.dataset.id) {
        const event = new CustomEvent('gesture:press', {
          detail: { id: nodeEl.dataset.id, originalEvent: e }
        });
        stage.dispatchEvent(event);
      }
    });

    // Pan - move element
    let panStartId = null;
    stageManager.on('panstart', function(e) {
      const nodeEl = e.target.closest?.('.pf-node');
      if (nodeEl && nodeEl.dataset.id) {
        panStartId = nodeEl.dataset.id;
        const event = new CustomEvent('gesture:panstart', {
          detail: {
            id: panStartId,
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            originalEvent: e
          }
        });
        stage.dispatchEvent(event);
      }
    });

    stageManager.on('panmove', function(e) {
      if (panStartId) {
        const event = new CustomEvent('gesture:panmove', {
          detail: {
            id: panStartId,
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            originalEvent: e
          }
        });
        stage.dispatchEvent(event);
      }
    });

    stageManager.on('panend', function(e) {
      if (panStartId) {
        const event = new CustomEvent('gesture:panend', {
          detail: {
            id: panStartId,
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            originalEvent: e
          }
        });
        stage.dispatchEvent(event);
        panStartId = null;
      }
    });

    // Pinch - zoom canvas
    if (viewport) {
      const viewportManager = new Hammer.Manager(viewport, {
        recognizers: [
          [Hammer.Pinch, { threshold: 0.1 }],
          [Hammer.Pan, { threshold: 10, direction: Hammer.DIRECTION_ALL }]
        ]
      });

      let initialZoom = 1;
      viewportManager.on('pinchstart', function(e) {
        initialZoom = parseFloat(viewport.dataset.zoom || '1');
      });

      viewportManager.on('pinchmove', function(e) {
        const newZoom = initialZoom * e.scale;
        const event = new CustomEvent('gesture:pinch', {
          detail: {
            scale: e.scale,
            zoom: newZoom,
            originalEvent: e
          }
        });
        viewport.dispatchEvent(event);
      });

      // Pan viewport
      let panStartScroll = { left: 0, top: 0 };
      viewportManager.on('panstart', function(e) {
        panStartScroll = {
          left: viewport.scrollLeft,
          top: viewport.scrollTop
        };
      });

      viewportManager.on('panmove', function(e) {
        viewport.scrollLeft = panStartScroll.left - e.deltaX;
        viewport.scrollTop = panStartScroll.top - e.deltaY;
      });
    }

    // Swipe gestures
    stageManager.on('swipeleft', function(e) {
      const event = new CustomEvent('gesture:swipeleft', {
        detail: { originalEvent: e }
      });
      stage.dispatchEvent(event);
    });

    stageManager.on('swiperight', function(e) {
      const event = new CustomEvent('gesture:swiperight', {
        detail: { originalEvent: e }
      });
      stage.dispatchEvent(event);
    });

    stageManager.on('swipeup', function(e) {
      const event = new CustomEvent('gesture:swipeup', {
        detail: { originalEvent: e }
      });
      stage.dispatchEvent(event);
    });

    stageManager.on('swipedown', function(e) {
      const event = new CustomEvent('gesture:swipedown', {
        detail: { originalEvent: e }
      });
      stage.dispatchEvent(event);
    });

    // Rotate gesture
    let rotateStartAngle = 0;
    stageManager.on('rotatestart', function(e) {
      const nodeEl = e.target.closest?.('.pf-node');
      if (nodeEl && nodeEl.dataset.id) {
        rotateStartAngle = e.rotation;
        const event = new CustomEvent('gesture:rotatestart', {
          detail: {
            id: nodeEl.dataset.id,
            rotation: e.rotation,
            originalEvent: e
          }
        });
        stage.dispatchEvent(event);
      }
    });

    stageManager.on('rotatemove', function(e) {
      const nodeEl = e.target.closest?.('.pf-node');
      if (nodeEl && nodeEl.dataset.id) {
        const event = new CustomEvent('gesture:rotatemove', {
          detail: {
            id: nodeEl.dataset.id,
            rotation: e.rotation,
            deltaRotation: e.rotation - rotateStartAngle,
            originalEvent: e
          }
        });
        stage.dispatchEvent(event);
      }
    });

    stageManager.on('rotateend', function(e) {
      const nodeEl = e.target.closest?.('.pf-node');
      if (nodeEl && nodeEl.dataset.id) {
        const event = new CustomEvent('gesture:rotateend', {
          detail: {
            id: nodeEl.dataset.id,
            rotation: e.rotation,
            originalEvent: e
          }
        });
        stage.dispatchEvent(event);
        rotateStartAngle = 0;
      }
    });

    console.log('Hammer.js gestures initialized for editor');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditorGestures);
  } else {
    initEditorGestures();
  }

  // Export for global access
  window.EditorGestures = {
    init: initEditorGestures
  };
})();
