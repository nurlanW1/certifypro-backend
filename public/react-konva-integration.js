/**
 * React-Konva Integration
 * 
 * This module provides React-Konva integration for drawing complex canvas graphics
 * using React components.
 * 
 * Reference: https://github.com/konvajs/react-konva
 * Documentation: https://konvajs.github.io/docs/react/
 */

(function() {
  'use strict';

  // Check if React and ReactDOM are available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM is not loaded. React-Konva will not work.');
    return;
  }

  // Check if Konva is available
  if (typeof Konva === 'undefined') {
    console.warn('Konva.js is not loaded. React-Konva requires Konva.js.');
    return;
  }

  // Check if React-Konva is available
  let ReactKonva = null;
  if (typeof window.ReactKonva !== 'undefined') {
    ReactKonva = window.ReactKonva;
  } else if (typeof ReactKonva !== 'undefined') {
    ReactKonva = window.ReactKonva = ReactKonva;
  } else {
    console.warn('React-Konva is not loaded. Please include react-konva script.');
    return;
  }

  const { useState, useEffect, useRef, useCallback } = React;
  const { Stage, Layer, Group, Rect, Circle, Line, Text, Image, Ellipse, Polygon, Star, Arrow, Label, Tag, Path, RegularPolygon, Ring, Arc, Wedge, Sprite, Transformer } = ReactKonva;

  /**
   * React-Konva Manager
   * Provides helper functions and utilities for React-Konva
   */
  window.ReactKonvaManager = {
    /**
     * React-Konva components
     */
    components: {
      Stage,
      Layer,
      Group,
      Rect,
      Circle,
      Line,
      Text,
      Image,
      Ellipse,
      Polygon,
      Star,
      Arrow,
      Label,
      Tag,
      Path,
      RegularPolygon,
      Ring,
      Arc,
      Wedge,
      Sprite,
      Transformer
    },

    /**
     * Create a React-Konva Stage component
     * @param {Object} props - Stage props
     * @param {React.ReactNode} children - Stage children
     * @returns {React.ReactElement} Stage component
     */
    createStage(props, children) {
      return React.createElement(Stage, props, children);
    },

    /**
     * Create a React-Konva Layer component
     * @param {Object} props - Layer props
     * @param {React.ReactNode} children - Layer children
     * @returns {React.ReactElement} Layer component
     */
    createLayer(props, children) {
      return React.createElement(Layer, props, children);
    },

    /**
     * Create a React-Konva Rect component
     * @param {Object} props - Rect props
     * @returns {React.ReactElement} Rect component
     */
    createRect(props) {
      return React.createElement(Rect, props);
    },

    /**
     * Create a React-Konva Circle component
     * @param {Object} props - Circle props
     * @returns {React.ReactElement} Circle component
     */
    createCircle(props) {
      return React.createElement(Circle, props);
    },

    /**
     * Create a React-Konva Text component
     * @param {Object} props - Text props
     * @returns {React.ReactElement} Text component
     */
    createText(props) {
      return React.createElement(Text, props);
    },

    /**
     * Create a React-Konva Image component
     * @param {Object} props - Image props
     * @returns {React.ReactElement} Image component
     */
    createImage(props) {
      return React.createElement(Image, props);
    },

    /**
     * Create a React-Konva Transformer component
     * @param {Object} props - Transformer props
     * @returns {React.ReactElement} Transformer component
     */
    createTransformer(props) {
      return React.createElement(Transformer, props);
    },

    /**
     * Create a draggable shape with grid snap
     * @param {string} shapeType - Shape type (Rect, Circle, etc.)
     * @param {Object} props - Shape props
     * @param {number} gridSize - Grid size for snapping
     * @returns {React.ReactElement} Shape component with grid snap
     */
    createDraggableShape(shapeType, props = {}, gridSize = null) {
      const ShapeComponent = this.components[shapeType];
      if (!ShapeComponent) {
        console.warn(`Shape type "${shapeType}" not found in React-Konva`);
        return null;
      }

      const handleDragMove = (e) => {
        if (gridSize) {
          const node = e.target;
          const newX = Math.round(node.x() / gridSize) * gridSize;
          const newY = Math.round(node.y() / gridSize) * gridSize;
          node.x(newX);
          node.y(newY);
        }
        if (props.onDragMove) {
          props.onDragMove(e);
        }
      };

      return React.createElement(ShapeComponent, {
        ...props,
        draggable: props.draggable !== false,
        onDragMove: handleDragMove
      });
    }
  };

  /**
   * React-Konva Rect Component (Enhanced)
   * Example usage:
   * <ReactKonvaRect
   *   x={50}
   *   y={50}
   *   width={100}
   *   height={100}
   *   fill="red"
   *   draggable
   *   gridSize={10}
   *   onDragEnd={(e) => console.log(e.target.x(), e.target.y())}
   * />
   */
  window.ReactKonvaRect = function ReactKonvaRect({
    x = 50,
    y = 50,
    width = 100,
    height = 100,
    fill = 'red',
    stroke,
    strokeWidth = 0,
    draggable = false,
    gridSize,
    onDragStart,
    onDragMove,
    onDragEnd,
    ...props
  }) {
    const handleDragMove = useCallback((e) => {
      if (gridSize) {
        const node = e.target;
        const newX = Math.round(node.x() / gridSize) * gridSize;
        const newY = Math.round(node.y() / gridSize) * gridSize;
        node.x(newX);
        node.y(newY);
      }
      if (onDragMove) {
        onDragMove(e);
      }
    }, [gridSize, onDragMove]);

    return React.createElement(Rect, {
      x,
      y,
      width,
      height,
      fill,
      stroke,
      strokeWidth,
      draggable,
      onDragStart,
      onDragMove: handleDragMove,
      onDragEnd,
      ...props
    });
  };

  /**
   * React-Konva Circle Component (Enhanced)
   */
  window.ReactKonvaCircle = function ReactKonvaCircle({
    x = 100,
    y = 100,
    radius = 50,
    fill = 'blue',
    stroke,
    strokeWidth = 0,
    draggable = false,
    gridSize,
    onDragStart,
    onDragMove,
    onDragEnd,
    ...props
  }) {
    const handleDragMove = useCallback((e) => {
      if (gridSize) {
        const node = e.target;
        const newX = Math.round(node.x() / gridSize) * gridSize;
        const newY = Math.round(node.y() / gridSize) * gridSize;
        node.x(newX);
        node.y(newY);
      }
      if (onDragMove) {
        onDragMove(e);
      }
    }, [gridSize, onDragMove]);

    return React.createElement(Circle, {
      x,
      y,
      radius,
      fill,
      stroke,
      strokeWidth,
      draggable,
      onDragStart,
      onDragMove: handleDragMove,
      onDragEnd,
      ...props
    });
  };

  /**
   * React-Konva Text Component (Enhanced)
   */
  window.ReactKonvaText = function ReactKonvaText({
    x = 50,
    y = 50,
    text = 'Hello World',
    fontSize = 20,
    fontFamily = 'Arial',
    fill = 'black',
    draggable = false,
    gridSize,
    onDragStart,
    onDragMove,
    onDragEnd,
    ...props
  }) {
    const handleDragMove = useCallback((e) => {
      if (gridSize) {
        const node = e.target;
        const newX = Math.round(node.x() / gridSize) * gridSize;
        const newY = Math.round(node.y() / gridSize) * gridSize;
        node.x(newX);
        node.y(newY);
      }
      if (onDragMove) {
        onDragMove(e);
      }
    }, [gridSize, onDragMove]);

    return React.createElement(Text, {
      x,
      y,
      text,
      fontSize,
      fontFamily,
      fill,
      draggable,
      onDragStart,
      onDragMove: handleDragMove,
      onDragEnd,
      ...props
    });
  };

  /**
   * React-Konva Stage with Layer (Helper Component)
   * Example usage:
   * <ReactKonvaStage
   *   width={800}
   *   height={600}
   *   children={[
   *     <ReactKonvaRect x={50} y={50} width={100} height={100} fill="red" draggable />
   *   ]}
   * />
   */
  window.ReactKonvaStage = function ReactKonvaStage({
    width = window.innerWidth,
    height = window.innerHeight,
    children,
    ...props
  }) {
    return React.createElement(Stage, {
      width,
      height,
      ...props
    },
      React.createElement(Layer, null, children)
    );
  };

  /**
   * React-Konva Draggable Group (Helper Component)
   * Groups multiple shapes together for dragging
   */
  window.ReactKonvaDraggableGroup = function ReactKonvaDraggableGroup({
    x = 0,
    y = 0,
    draggable = true,
    gridSize,
    onDragStart,
    onDragMove,
    onDragEnd,
    children,
    ...props
  }) {
    const handleDragMove = useCallback((e) => {
      if (gridSize) {
        const node = e.target;
        const newX = Math.round(node.x() / gridSize) * gridSize;
        const newY = Math.round(node.y() / gridSize) * gridSize;
        node.x(newX);
        node.y(newY);
      }
      if (onDragMove) {
        onDragMove(e);
      }
    }, [gridSize, onDragMove]);

    return React.createElement(Group, {
      x,
      y,
      draggable,
      onDragStart,
      onDragMove: handleDragMove,
      onDragEnd,
      ...props
    }, children);
  };

  /**
   * React-Konva Transformer Component (Helper)
   * Adds transform handles to a shape
   */
  window.ReactKonvaTransformer = function ReactKonvaTransformer({
    selectedShapeName,
    ...props
  }) {
    const transformerRef = useRef(null);
    const layerRef = useRef(null);

    useEffect(() => {
      if (!transformerRef.current || !selectedShapeName) return;

      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne('.' + selectedShapeName);
      
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, [selectedShapeName]);

    return React.createElement(Transformer, {
      ref: transformerRef,
      ...props
    });
  };

  // Export React-Konva components to global scope for easy access
  window.ReactKonvaComponents = {
    Stage,
    Layer,
    Group,
    Rect,
    Circle,
    Line,
    Text,
    Image,
    Ellipse,
    Polygon,
    Star,
    Arrow,
    Label,
    Tag,
    Path,
    RegularPolygon,
    Ring,
    Arc,
    Wedge,
    Sprite,
    Transformer
  };

  console.log('React-Konva integration loaded');
  console.log('Usage: <ReactKonvaRect x={50} y={50} width={100} height={100} fill="red" draggable />');
  console.log('Components available: ReactKonvaRect, ReactKonvaCircle, ReactKonvaText, ReactKonvaStage');
})();
