/**
 * React DnD and React Beautiful DnD Integration
 * 
 * This module provides integration helpers for using React DnD libraries
 * with the vanilla JavaScript editor.
 * 
 * Note: These libraries require React, so they're best used for specific
 * React components within the editor (e.g., layer reordering, template gallery).
 */

(function() {
  'use strict';

  // Check if React and libraries are loaded
  if (typeof React === 'undefined') {
    console.warn('React is not loaded. React DnD libraries require React.');
    return;
  }

  if (typeof ReactDnD === 'undefined') {
    console.warn('React DnD is not loaded.');
  }

  if (typeof ReactBeautifulDnd === 'undefined') {
    console.warn('React Beautiful DnD is not loaded.');
  }

  /**
   * React DnD Integration Helper
   * Provides utilities for drag and drop functionality
   */
  window.ReactDnDIntegration = {
    /**
     * Check if React DnD is available
     */
    isAvailable: function() {
      return typeof ReactDnD !== 'undefined' && typeof ReactDnDHTML5Backend !== 'undefined';
    },

    /**
     * Create a DndProvider wrapper component
     */
    createDndProvider: function() {
      if (!this.isAvailable()) {
        console.warn('React DnD is not available');
        return null;
      }

      const { DndProvider } = ReactDnD;
      const { HTML5Backend } = ReactDnDHTML5Backend;

      return function DndProviderWrapper(props) {
        return React.createElement(DndProvider, { backend: HTML5Backend }, props.children);
      };
    },

    /**
     * Create a draggable component
     */
    createDraggable: function(type, item, collect) {
      if (!this.isAvailable()) {
        console.warn('React DnD is not available');
        return null;
      }

      const { useDrag } = ReactDnD;

      return function useDraggableComponent(Component) {
        return function DraggableComponent(props) {
          const [collected, drag, dragPreview] = useDrag(() => ({
            type: type,
            item: typeof item === 'function' ? item(props) : item,
            collect: collect || (monitor => ({
              isDragging: monitor.isDragging()
            }))
          }), [props]);

          return React.createElement(Component, {
            ...props,
            ...collected,
            drag: drag,
            dragPreview: dragPreview
          });
        };
      };
    },

    /**
     * Create a droppable component
     */
    createDroppable: function(type, accept, collect) {
      if (!this.isAvailable()) {
        console.warn('React DnD is not available');
        return null;
      }

      const { useDrop } = ReactDnD;

      return function useDroppableComponent(Component) {
        return function DroppableComponent(props) {
          const [collected, drop] = useDrop(() => ({
            accept: accept || type,
            drop: (item, monitor) => {
              if (props.onDrop) {
                props.onDrop(item, monitor);
              }
            },
            collect: collect || (monitor => ({
              isOver: monitor.isOver(),
              canDrop: monitor.canDrop()
            }))
          }), [props]);

          return React.createElement(Component, {
            ...props,
            ...collected,
            drop: drop
          });
        };
      };
    }
  };

  /**
   * React Beautiful DnD Integration Helper
   * Provides utilities for beautiful list drag and drop
   */
  window.ReactBeautifulDndIntegration = {
    /**
     * Check if React Beautiful DnD is available
     */
    isAvailable: function() {
      return typeof ReactBeautifulDnd !== 'undefined';
    },

    /**
     * Create a DragDropContext wrapper component
     */
    createDragDropContext: function() {
      if (!this.isAvailable()) {
        console.warn('React Beautiful DnD is not available');
        return null;
      }

      const { DragDropContext } = ReactBeautifulDnd;

      return function DragDropContextWrapper(props) {
        const onDragEnd = (result) => {
          if (!result.destination) {
            return;
          }

          if (props.onDragEnd) {
            props.onDragEnd(result);
          }
        };

        return React.createElement(DragDropContext, { onDragEnd: onDragEnd }, props.children);
      };
    },

    /**
     * Create a Droppable component
     */
    createDroppable: function(droppableId) {
      if (!this.isAvailable()) {
        console.warn('React Beautiful DnD is not available');
        return null;
      }

      const { Droppable } = ReactBeautifulDnd;

      return function DroppableWrapper(props) {
        return React.createElement(
          Droppable,
          { droppableId: droppableId || props.droppableId },
          (provided, snapshot) => {
            return React.createElement(
              'div',
              {
                ...provided.droppableProps,
                ref: provided.innerRef,
                style: {
                  ...props.style,
                  backgroundColor: snapshot.isDraggingOver ? 'rgba(37, 99, 235, 0.1)' : 'transparent'
                }
              },
              props.children(provided, snapshot),
              provided.placeholder
            );
          }
        );
      };
    },

    /**
     * Create a Draggable component
     */
    createDraggable: function(draggableId, index) {
      if (!this.isAvailable()) {
        console.warn('React Beautiful DnD is not available');
        return null;
      }

      const { Draggable } = ReactBeautifulDnd;

      return function DraggableWrapper(props) {
        return React.createElement(
          Draggable,
          {
            draggableId: draggableId || props.draggableId,
            index: index !== undefined ? index : props.index
          },
          (provided, snapshot) => {
            return React.createElement(
              'div',
              {
                ...provided.draggableProps,
                ...provided.dragHandleProps,
                ref: provided.innerRef,
                style: {
                  ...props.style,
                  ...provided.draggableProps.style,
                  opacity: snapshot.isDragging ? 0.5 : 1,
                  transform: provided.draggableProps.style?.transform
                }
              },
              props.children(provided, snapshot)
            );
          }
        );
      };
    }
  };

  console.log('React DnD Integration loaded');
  console.log('React DnD available:', window.ReactDnDIntegration.isAvailable());
  console.log('React Beautiful DnD available:', window.ReactBeautifulDndIntegration.isAvailable());
})();
