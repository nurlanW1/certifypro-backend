/**
 * React Root Initialization
 * 
 * This file initializes React roots for different parts of the editor
 * and integrates them with the existing vanilla JavaScript code.
 */

(function() {
  'use strict';

  // Wait for DOM and React to be ready
  function initReactRoots() {
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
      console.warn('React or ReactDOM is not loaded. React roots will not be initialized.');
      return;
    }

    // Initialize LayerList React root
    function initLayerListRoot() {
      const layersContainer = document.querySelector('[data-layers]');
      if (!layersContainer) {
        console.warn('Layers container not found');
        return;
      }

      // Create a container for React root
      const reactContainer = document.createElement('div');
      reactContainer.id = 'react-layers-root';
      reactContainer.style.width = '100%';
      reactContainer.style.height = '100%';
      
      // Clear existing content and add React container
      layersContainer.innerHTML = '';
      layersContainer.appendChild(reactContainer);

      // Get editor state (we'll need to expose this from editor.js)
      let currentLayers = [];
      let currentSelectedId = null;

      // Function to update layers from editor state
      function updateLayersFromEditor() {
        // Try to get layers from global editor state
        if (window.editorState && window.editorState.doc && window.editorState.doc.elements) {
          currentLayers = window.editorState.doc.elements.map(el => ({
            id: el.id,
            name: el.name || el.id,
            type: el.type,
            hidden: el.hidden || false,
            locked: el.locked || false
          })).reverse(); // Reverse to show topmost first
        }

        if (window.editorState && window.editorState.selectionId) {
          currentSelectedId = window.editorState.selectionId;
        }

        renderLayerList();
      }

      // Function to render LayerList component
      function renderLayerList() {
        if (!window.LayerListComponent) {
          console.warn('LayerListComponent is not available');
          return;
        }

        const root = ReactDOM.createRoot(reactContainer);
        root.render(
          React.createElement(window.LayerListComponent, {
            layers: currentLayers,
            selectedId: currentSelectedId,
            onSelect: (id) => {
              // Call editor's select function
              if (window.editorSelect) {
                window.editorSelect(id);
              }
            },
            onReorder: (newLayers) => {
              // Reorder layers in editor
              if (window.editorReorderLayers) {
                window.editorReorderLayers(newLayers.map(l => l.id));
              }
            },
            onToggleVisibility: (id) => {
              // Toggle layer visibility
              if (window.editorToggleLayerVisibility) {
                window.editorToggleLayerVisibility(id);
              }
            },
            onToggleLock: (id) => {
              // Toggle layer lock
              if (window.editorToggleLayerLock) {
                window.editorToggleLayerLock(id);
              }
            }
          })
        );
      }

      // Initial render
      updateLayersFromEditor();

      // Watch for changes in editor state
      const observer = new MutationObserver(() => {
        updateLayersFromEditor();
      });

      // Observe the layers container's parent for changes
      if (layersContainer.parentElement) {
        observer.observe(layersContainer.parentElement, {
          childList: true,
          subtree: true,
          attributes: true
        });
      }

      // Also listen to custom events from editor
      document.addEventListener('editor:layersChanged', () => {
        updateLayersFromEditor();
      });

      document.addEventListener('editor:selectionChanged', () => {
        updateLayersFromEditor();
      });

      // Expose update function globally
      window.updateReactLayerList = updateLayersFromEditor;

      console.log('LayerList React root initialized');
    }

    // Initialize all React roots
    initLayerListRoot();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactRoots);
  } else {
    // DOM is already ready
    setTimeout(initReactRoots, 100); // Small delay to ensure editor.js has initialized
  }

  // Also try to initialize after a longer delay in case editor.js loads later
  setTimeout(initReactRoots, 1000);
})();
