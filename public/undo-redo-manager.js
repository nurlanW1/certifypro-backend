/**
 * Professional Undo/Redo Manager
 * Lightweight, efficient history management for editor applications
 */

class UndoRedoManager {
  constructor(options = {}) {
    this.maxHistorySize = options.maxHistorySize || 100;
    this.debounceMs = options.debounceMs || 300;
    this.past = [];
    this.future = [];
    this.currentTransaction = null;
    this.listeners = {
      undo: [],
      redo: [],
      change: []
    };
    this.debounceTimer = null;
  }

  /**
   * Mark the beginning of a transaction
   * @param {string} label - Label for this transaction (e.g., "move", "textEdit")
   * @param {any} beforeState - State before the change
   */
  markBefore(label, beforeState) {
    if (this.currentTransaction) return; // Already in a transaction
    
    this.currentTransaction = {
      label,
      before: this.deepClone(beforeState),
      timestamp: Date.now()
    };
  }

  /**
   * Commit the current transaction
   * @param {any} afterState - State after the change
   * @returns {boolean} - True if state actually changed
   */
  commit(afterState) {
    if (!this.currentTransaction) return false;

    const before = this.currentTransaction.before;
    const after = this.deepClone(afterState);
    
    // Check if state actually changed
    if (this.statesEqual(before, after)) {
      this.currentTransaction = null;
      return false;
    }

    // Clear future when new action is committed
    this.future = [];
    
    // Add to past
    this.past.push({
      label: this.currentTransaction.label,
      before,
      after,
      timestamp: this.currentTransaction.timestamp
    });

    // Limit history size
    if (this.past.length > this.maxHistorySize) {
      this.past.shift();
    }

    this.currentTransaction = null;
    this.notifyListeners('change');
    return true;
  }

  /**
   * Discard current transaction without committing
   */
  discard() {
    this.currentTransaction = null;
  }

  /**
   * Undo last action
   * @returns {any|null} - Previous state or null if nothing to undo
   */
  undo() {
    if (this.past.length === 0) {
      this.notifyListeners('undo', false);
      return null;
    }

    const transaction = this.past.pop();
    const previousState = transaction.before;
    
    // Move to future for redo
    this.future.push(transaction);
    
    this.notifyListeners('undo', true);
    this.notifyListeners('change');
    
    return previousState;
  }

  /**
   * Redo last undone action
   * @returns {any|null} - Next state or null if nothing to redo
   */
  redo() {
    if (this.future.length === 0) {
      this.notifyListeners('redo', false);
      return null;
    }

    const transaction = this.future.pop();
    const nextState = transaction.after;
    
    // Move back to past
    this.past.push(transaction);
    
    this.notifyListeners('redo', true);
    this.notifyListeners('change');
    
    return nextState;
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.past.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.future.length > 0;
  }

  /**
   * Get history info
   */
  getHistoryInfo() {
    return {
      pastCount: this.past.length,
      futureCount: this.future.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      lastAction: this.past.length > 0 ? this.past[this.past.length - 1].label : null
    };
  }

  /**
   * Clear all history
   */
  clear() {
    this.past = [];
    this.future = [];
    this.currentTransaction = null;
    this.notifyListeners('change');
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Notify listeners
   */
  notifyListeners(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error('Error in undo/redo listener:', error);
        }
      });
    }
  }

  /**
   * Deep clone helper
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  /**
   * Compare two states for equality
   */
  statesEqual(a, b) {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (error) {
      // Fallback to reference equality if JSON.stringify fails
      return a === b;
    }
  }

  /**
   * Debounced commit (useful for continuous edits like typing)
   */
  debouncedCommit(afterState) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.commit(afterState);
    }, this.debounceMs);
  }
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UndoRedoManager;
} else {
  window.UndoRedoManager = UndoRedoManager;
}
