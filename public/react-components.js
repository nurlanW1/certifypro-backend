/**
 * React Components for Editor
 * 
 * This file contains React components for the editor, including:
 * - LayerList: Drag-and-drop layer list using React Beautiful DnD
 * - TemplateGallery: Drag-and-drop template gallery
 */

(function() {
  'use strict';

  // Check if React is available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM is not loaded. React components will not work.');
    return;
  }

  // Check if React Beautiful DnD is available
  if (typeof ReactBeautifulDnd === 'undefined') {
    console.warn('React Beautiful DnD is not loaded. Layer drag and drop will not work.');
  }

  const { useState, useEffect, useCallback } = React;
  const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd || {};

  // React-Konva components (if available)
  let ReactKonva = null;
  if (typeof window.ReactKonva !== 'undefined') {
    ReactKonva = window.ReactKonva;
  }

  // Export React-Konva components if available
  if (ReactKonva) {
    window.Rect = ReactKonva.Rect;
    window.Stage = ReactKonva.Stage;
    window.Layer = ReactKonva.Layer;
    window.Group = ReactKonva.Group;
    window.Circle = ReactKonva.Circle;
    window.Line = ReactKonva.Line;
    window.Text = ReactKonva.Text;
    window.Image = ReactKonva.Image;
    window.Ellipse = ReactKonva.Ellipse;
    window.Polygon = ReactKonva.Polygon;
    window.Star = ReactKonva.Star;
    window.Arrow = ReactKonva.Arrow;
    window.Label = ReactKonva.Label;
    window.Tag = ReactKonva.Tag;
    window.Path = ReactKonva.Path;
    window.RegularPolygon = ReactKonva.RegularPolygon;
    window.Ring = ReactKonva.Ring;
    window.Arc = ReactKonva.Arc;
    window.Wedge = ReactKonva.Wedge;
    window.Sprite = ReactKonva.Sprite;
    window.Transformer = ReactKonva.Transformer;
  }

  /**
   * Konva Rect Component (React wrapper)
   * Example usage:
   * <Rect
   *   x={50}
   *   y={50}
   *   width={100}
   *   height={100}
   *   fill="red"
   *   draggable
   *   onDragEnd={(e) => console.log(e.target.x(), e.target.y())}
   * />
   */
  window.KonvaRectComponent = function KonvaRect({ 
    x, y, width, height, fill, stroke, strokeWidth, draggable, 
    onDragStart, onDragMove, onDragEnd, gridSize, ...props 
  }) {
    const rectRef = React.useRef(null);
    const stageRef = React.useRef(null);
    const layerRef = React.useRef(null);

    useEffect(() => {
      if (!window.Konva) {
        console.warn('Konva is not loaded');
        return;
      }

      // Create stage if not exists
      if (!stageRef.current) {
        const container = document.createElement('div');
        container.id = 'konva-react-container';
        container.style.width = '100%';
        container.style.height = '100%';
        
        // Find or create container
        const existingContainer = document.getElementById('konva-react-container');
        if (!existingContainer) {
          document.body.appendChild(container);
        }

        stageRef.current = new Konva.Stage({
          container: 'konva-react-container',
          width: window.innerWidth,
          height: window.innerHeight
        });

        layerRef.current = new Konva.Layer();
        stageRef.current.add(layerRef.current);
      }

      // Create or update rect
      if (!rectRef.current) {
        rectRef.current = new Konva.Rect({
          x: x || 50,
          y: y || 50,
          width: width || 100,
          height: height || 100,
          fill: fill || 'red',
          stroke: stroke,
          strokeWidth: strokeWidth || 0,
          draggable: draggable !== false,
          ...props
        });

        // Enable grid snap if gridSize is provided
        if (gridSize && window.KonvaGridSnap) {
          window.KonvaGridSnap.enableForNode(rectRef.current, { gridSize });
        }

        // Add event listeners
        if (onDragStart) {
          rectRef.current.on('dragstart', onDragStart);
        }
        if (onDragMove) {
          rectRef.current.on('dragmove', onDragMove);
        }
        if (onDragEnd) {
          rectRef.current.on('dragend', onDragEnd);
        }

        layerRef.current.add(rectRef.current);
        layerRef.current.draw();
      } else {
        // Update existing rect
        rectRef.current.x(x || 50);
        rectRef.current.y(y || 50);
        rectRef.current.width(width || 100);
        rectRef.current.height(height || 100);
        rectRef.current.fill(fill || 'red');
        if (stroke !== undefined) rectRef.current.stroke(stroke);
        if (strokeWidth !== undefined) rectRef.current.strokeWidth(strokeWidth);
        rectRef.current.draggable(draggable !== false);
        layerRef.current.draw();
      }

      return () => {
        if (rectRef.current && layerRef.current) {
          rectRef.current.destroy();
          layerRef.current.draw();
        }
      };
    }, [x, y, width, height, fill, stroke, strokeWidth, draggable, gridSize]);

    return null; // This component doesn't render anything in React tree
  };

  /**
   * LayerList Component
   * A draggable list of layers using React Beautiful DnD
   */
  window.LayerListComponent = function LayerList({ layers, selectedId, onSelect, onReorder, onToggleVisibility, onToggleLock }) {
    const [localLayers, setLocalLayers] = useState(layers || []);

    // Update local layers when props change
    useEffect(() => {
      setLocalLayers(layers || []);
    }, [layers]);

    const handleDragEnd = useCallback((result) => {
      if (!result.destination) {
        return;
      }

      const items = Array.from(localLayers);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setLocalLayers(items);

      // Notify parent component about reorder
      if (onReorder) {
        onReorder(items);
      }
    }, [localLayers, onReorder]);

    if (!DragDropContext || !Droppable || !Draggable) {
      // Fallback to non-draggable list if React Beautiful DnD is not available
      return React.createElement('div', { className: 'pf-layers' },
        localLayers.map((layer, index) => {
          const isSelected = layer.id === selectedId;
          return React.createElement('div', {
            key: layer.id,
            className: `pf-layer ${isSelected ? 'is-selected' : ''}`,
            onClick: () => onSelect && onSelect(layer.id),
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '14px',
              border: `1px solid ${isSelected ? 'rgba(37,99,235,0.5)' : 'var(--pf-border, rgba(15,23,42,0.1))'}`,
              background: '#fff',
              cursor: 'pointer',
              transition: 'border 120ms ease, box-shadow 120ms ease'
            }
          },
            React.createElement('div', { style: { minWidth: 0 } },
              React.createElement('div', { className: 'pf-layer__name', style: { fontWeight: 600, fontSize: '13px' } }, layer.name || layer.id),
              React.createElement('div', { className: 'pf-layer__meta', style: { fontSize: '12px', color: 'var(--pf-muted, rgba(15,23,42,0.55))' } }, layer.type)
            )
          );
        })
      );
    }

    return React.createElement(DragDropContext, { onDragEnd: handleDragEnd },
      React.createElement(Droppable, { droppableId: 'layers' },
        (provided, snapshot) => React.createElement('div', {
          ...provided.droppableProps,
          ref: provided.innerRef,
          className: 'pf-layers',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: snapshot.isDraggingOver ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
            transition: 'background-color 0.2s ease'
          }
        },
          localLayers.map((layer, index) => {
            const isSelected = layer.id === selectedId;
            return React.createElement(Draggable, {
              key: layer.id,
              draggableId: layer.id,
              index: index
            },
              (provided, snapshot) => React.createElement('div', {
                ...provided.draggableProps,
                ...provided.dragHandleProps,
                ref: provided.innerRef,
                className: `pf-layer ${isSelected ? 'is-selected' : ''}`,
                onClick: () => onSelect && onSelect(layer.id),
                style: {
                  ...provided.draggableProps.style,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  border: `1px solid ${isSelected ? 'rgba(37,99,235,0.5)' : 'var(--pf-border, rgba(15,23,42,0.1))'}`,
                  background: '#fff',
                  cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                  opacity: snapshot.isDragging ? 0.5 : 1,
                  boxShadow: snapshot.isDragging ? '0 10px 30px rgba(15,23,42,0.2)' : (isSelected ? '0 0 0 2px rgba(37,99,235,0.15)' : 'none'),
                  transition: 'border 120ms ease, box-shadow 120ms ease, opacity 0.2s ease'
                }
              },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 } },
                  React.createElement('div', { style: { 
                    width: '20px', 
                    height: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--pf-muted, rgba(15,23,42,0.55))',
                    cursor: 'grab'
                  } },
                    React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                      React.createElement('path', { d: 'M9 5h6M9 12h6M9 19h6' })
                    )
                  ),
                  React.createElement('div', { style: { minWidth: 0, flex: 1 } },
                    React.createElement('div', { 
                      className: 'pf-layer__name', 
                      style: { 
                        fontWeight: 600, 
                        fontSize: '13px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      } 
                    }, layer.name || layer.id),
                    React.createElement('div', { 
                      className: 'pf-layer__meta', 
                      style: { 
                        fontSize: '12px', 
                        color: 'var(--pf-muted, rgba(15,23,42,0.55))' 
                      } 
                    }, layer.type)
                  )
                ),
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
                  React.createElement('button', {
                    type: 'button',
                    onClick: (e) => {
                      e.stopPropagation();
                      if (onToggleVisibility) onToggleVisibility(layer.id);
                    },
                    style: {
                      width: '24px',
                      height: '24px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: layer.hidden ? 'var(--pf-muted, rgba(15,23,42,0.3))' : 'var(--pf-text, rgba(15,23,42,0.88))'
                    },
                    title: layer.hidden ? 'Show layer' : 'Hide layer'
                  },
                    React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                      layer.hidden 
                        ? React.createElement('path', { d: 'M1 1l22 22M13 13a3 3 0 1 1-4-4M9 9a10 10 0 0 0-5 5M15 15a10 10 0 0 1 5-5M2 2a10 10 0 0 0 5 5M22 22a10 10 0 0 1-5-5' })
                        : React.createElement('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' })
                    )
                  ),
                  React.createElement('button', {
                    type: 'button',
                    onClick: (e) => {
                      e.stopPropagation();
                      if (onToggleLock) onToggleLock(layer.id);
                    },
                    style: {
                      width: '24px',
                      height: '24px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: layer.locked ? 'var(--pf-primary, #2563eb)' : 'var(--pf-muted, rgba(15,23,42,0.3))'
                    },
                    title: layer.locked ? 'Unlock layer' : 'Lock layer'
                  },
                    React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                      layer.locked
                        ? React.createElement('path', { d: 'M7 11h10M7 11V8a5 5 0 0 1 10 0v3M7 11v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8' })
                        : React.createElement('path', { d: 'M8 11V8a4 4 0 0 1 8 0v3M8 11h8v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8z' })
                    )
                  )
                )
              )
            ),
            provided.placeholder
          )
        )
      )
    );
  };

  /**
   * TemplateGallery Component
   * A draggable template gallery using React DnD
   */
  window.TemplateGalleryComponent = function TemplateGallery({ templates, onSelect }) {
    if (!window.ReactDnDIntegration || !window.ReactDnDIntegration.isAvailable()) {
      // Fallback to non-draggable gallery
      return React.createElement('div', { className: 'pf-templates-min' },
        templates.map(template => 
          React.createElement('div', {
            key: template.id,
            className: 'pf-template-mini',
            onClick: () => onSelect && onSelect(template.id),
            style: {
              cursor: 'pointer',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 22px rgba(15,23,42,0.10)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }
          },
            React.createElement('div', { style: { padding: '12px' } }, template.name || template.id)
          )
        )
      );
    }

    // React DnD implementation would go here
    return React.createElement('div', { className: 'pf-templates-min' },
      templates.map(template => 
        React.createElement('div', {
          key: template.id,
          className: 'pf-template-mini',
          onClick: () => onSelect && onSelect(template.id)
        }, template.name || template.id)
      )
    );
  };

  console.log('React Components loaded');
})();
