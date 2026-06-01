/**
 * React Dropzone Integration
 * 
 * This module provides React Dropzone integration for drag-and-drop file upload
 * functionality in the editor.
 * 
 * Reference: https://github.com/react-dropzone/react-dropzone
 * Documentation: https://react-dropzone.js.org/
 */

(function() {
  'use strict';

  // Check if React and ReactDOM are available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM is not loaded. React Dropzone will not work.');
    return;
  }

  /**
   * React Dropzone Manager
   * Handles dropzone initialization and provides helper functions
   */
  window.ReactDropzoneManager = {
    /**
     * React Dropzone hook/component (loaded dynamically)
     */
    useDropzone: null,
    Dropzone: null,

    /**
     * Initialize React Dropzone
     * @returns {Promise<Object>} Promise that resolves with Dropzone components
     */
    async init() {
      if (this.useDropzone && this.Dropzone) {
        return {
          useDropzone: this.useDropzone,
          Dropzone: this.Dropzone
        };
      }

      // Check if react-dropzone is already loaded
      if (typeof window.ReactDropzone !== 'undefined') {
        this.useDropzone = window.ReactDropzone.useDropzone || window.ReactDropzone.default?.useDropzone;
        this.Dropzone = window.ReactDropzone.default || window.ReactDropzone;
        return {
          useDropzone: this.useDropzone,
          Dropzone: this.Dropzone
        };
      }

      // Create wrapper hook/component if library is not available as UMD
      const components = this.createDropzoneComponents();
      this.useDropzone = components.useDropzone;
      this.Dropzone = components.Dropzone;
      return components;
    },

    /**
     * Create Dropzone components
     * This creates simplified wrapper components that work with vanilla React
     * @returns {Object} Object with useDropzone hook and Dropzone component
     */
    createDropzoneComponents() {
      const { useState, useCallback, useRef, useEffect } = React;

      /**
       * useDropzone Hook
       * Custom hook for creating dropzone functionality
       */
      const useDropzone = function useDropzone(options = {}) {
        const {
          onDrop,
          onDropAccepted,
          onDropRejected,
          onDragEnter,
          onDragLeave,
          onDragOver,
          accept,
          multiple = true,
          maxSize,
          minSize,
          maxFiles,
          disabled = false,
          noClick = false,
          noKeyboard = false,
          noDrag = false,
          preventDropOnDocument = true,
          useFsAccessApi = false,
          getFilesFromEvent,
          validator,
          ...restOptions
        } = options;

        const [isDragActive, setIsDragActive] = useState(false);
        const [isFocused, setIsFocused] = useState(false);
        const inputRef = useRef(null);
        const rootRef = useRef(null);

        // File validation
        const validateFile = useCallback((file) => {
          if (validator) {
            const error = validator(file);
            if (error) return { file, errors: [error] };
          }

          const errors = [];

          // Check file type
          if (accept) {
            const acceptedTypes = Array.isArray(accept) ? accept : Object.keys(accept);
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            const mimeType = file.type;

            const isAccepted = acceptedTypes.some(type => {
              if (typeof type === 'string') {
                return type === mimeType || type === fileExtension || type === file.name;
              }
              if (type instanceof RegExp) {
                return type.test(file.name) || type.test(mimeType);
              }
              return false;
            });

            if (!isAccepted) {
              errors.push({
                code: 'file-invalid-type',
                message: `File type ${mimeType} is not accepted`
              });
            }
          }

          // Check file size
          if (maxSize && file.size > maxSize) {
            errors.push({
              code: 'file-too-large',
              message: `File is larger than ${maxSize} bytes`
            });
          }

          if (minSize && file.size < minSize) {
            errors.push({
              code: 'file-too-small',
              message: `File is smaller than ${minSize} bytes`
            });
          }

          return errors.length > 0 ? { file, errors } : null;
        }, [accept, maxSize, minSize, validator]);

        // Handle file drop
        const handleDrop = useCallback(async (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);

          const files = Array.from(e.dataTransfer?.files || []);
          
          if (files.length === 0) return;

          // Validate files
          const acceptedFiles = [];
          const rejectedFiles = [];

          for (const file of files) {
            const error = validateFile(file);
            if (error) {
              rejectedFiles.push(error);
            } else {
              acceptedFiles.push(file);
            }
          }

          // Check max files
          if (maxFiles && acceptedFiles.length > maxFiles) {
            const excess = acceptedFiles.slice(maxFiles);
            acceptedFiles.splice(maxFiles);
            excess.forEach(file => {
              rejectedFiles.push({
                file,
                errors: [{
                  code: 'too-many-files',
                  message: `Too many files. Maximum is ${maxFiles}`
                }]
              });
            });
          }

          // Callbacks
          if (onDrop) {
            onDrop(acceptedFiles, rejectedFiles, e);
          }
          if (acceptedFiles.length > 0 && onDropAccepted) {
            onDropAccepted(acceptedFiles, e);
          }
          if (rejectedFiles.length > 0 && onDropRejected) {
            onDropRejected(rejectedFiles, e);
          }
        }, [onDrop, onDropAccepted, onDropRejected, validateFile, maxFiles]);

        // Handle drag events
        const handleDragEnter = useCallback((e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer?.types.includes('Files')) {
            setIsDragActive(true);
            if (onDragEnter) {
              onDragEnter(e);
            }
          }
        }, [onDragEnter]);

        const handleDragOver = useCallback((e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onDragOver) {
            onDragOver(e);
          }
        }, [onDragOver]);

        const handleDragLeave = useCallback((e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragActive(false);
            if (onDragLeave) {
              onDragLeave(e);
            }
          }
        }, [onDragLeave]);

        // Handle file input change
        const handleInputChange = useCallback((e) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;

          const acceptedFiles = [];
          const rejectedFiles = [];

          for (const file of files) {
            const error = validateFile(file);
            if (error) {
              rejectedFiles.push(error);
            } else {
              acceptedFiles.push(file);
            }
          }

          if (maxFiles && acceptedFiles.length > maxFiles) {
            const excess = acceptedFiles.slice(maxFiles);
            acceptedFiles.splice(maxFiles);
            excess.forEach(file => {
              rejectedFiles.push({
                file,
                errors: [{
                  code: 'too-many-files',
                  message: `Too many files. Maximum is ${maxFiles}`
                }]
              });
            });
          }

          if (onDrop) {
            onDrop(acceptedFiles, rejectedFiles, e);
          }
          if (acceptedFiles.length > 0 && onDropAccepted) {
            onDropAccepted(acceptedFiles, e);
          }
          if (rejectedFiles.length > 0 && onDropRejected) {
            onDropRejected(rejectedFiles, e);
          }

          // Reset input
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        }, [onDrop, onDropAccepted, onDropRejected, validateFile, maxFiles]);

        // Open file dialog
        const open = useCallback(() => {
          if (!disabled && inputRef.current) {
            inputRef.current.click();
          }
        }, [disabled]);

        // Get root props
        const getRootProps = useCallback((props = {}) => {
          return {
            ...props,
            ref: (node) => {
              rootRef.current = node;
              if (props.ref) {
                if (typeof props.ref === 'function') {
                  props.ref(node);
                } else {
                  props.ref.current = node;
                }
              }
            },
            onDragEnter: noDrag ? props.onDragEnter : (e) => {
              props.onDragEnter?.(e);
              handleDragEnter(e);
            },
            onDragOver: noDrag ? props.onDragOver : (e) => {
              props.onDragOver?.(e);
              handleDragOver(e);
            },
            onDragLeave: noDrag ? props.onDragLeave : (e) => {
              props.onDragLeave?.(e);
              handleDragLeave(e);
            },
            onDrop: noDrag ? props.onDrop : (e) => {
              props.onDrop?.(e);
              handleDrop(e);
            },
            onClick: noClick ? props.onClick : (e) => {
              props.onClick?.(e);
              if (!disabled) {
                open();
              }
            },
            onKeyDown: noKeyboard ? props.onKeyDown : (e) => {
              props.onKeyDown?.(e);
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!disabled) {
                  open();
                }
              }
            },
            onFocus: (e) => {
              props.onFocus?.(e);
              setIsFocused(true);
            },
            onBlur: (e) => {
              props.onBlur?.(e);
              setIsFocused(false);
            },
            tabIndex: disabled ? -1 : (props.tabIndex !== undefined ? props.tabIndex : 0)
          };
        }, [noDrag, noClick, noKeyboard, disabled, handleDragEnter, handleDragOver, handleDragLeave, handleDrop, open]);

        // Get input props
        const getInputProps = useCallback((props = {}) => {
          return {
            ...props,
            ref: (node) => {
              inputRef.current = node;
              if (props.ref) {
                if (typeof props.ref === 'function') {
                  props.ref(node);
                } else {
                  props.ref.current = node;
                }
              }
            },
            type: 'file',
            accept: accept ? (Array.isArray(accept) ? accept.join(',') : Object.keys(accept).join(',')) : undefined,
            multiple: multiple,
            disabled: disabled,
            onChange: (e) => {
              props.onChange?.(e);
              handleInputChange(e);
            },
            style: { display: 'none', ...props.style }
          };
        }, [accept, multiple, disabled, handleInputChange]);

        return {
          getRootProps,
          getInputProps,
          isDragActive,
          isFocused,
          isDragAccept: isDragActive,
          isDragReject: false,
          open,
          rootRef,
          inputRef
        };
      };

      /**
       * Dropzone Component
       * Render prop component for dropzone
       */
      const Dropzone = function Dropzone(props) {
        const dropzone = useDropzone(props);
        const { children } = props;

        if (typeof children === 'function') {
          return children(dropzone);
        }

        return React.createElement(React.Fragment, null, children);
      };

      return { useDropzone, Dropzone };
    }
  };

  /**
   * Helper function to create a dropzone
   * @param {Object} options - Dropzone options
   * @returns {Function} useDropzone hook
   */
  window.useDropzone = async function(options) {
    const components = await ReactDropzoneManager.init();
    return components.useDropzone(options);
  };

  /**
   * Dropzone Component (for direct use)
   * Usage: <Dropzone onDrop={(files) => console.log(files)}>...</Dropzone>
   */
  window.Dropzone = async function(props) {
    const components = await ReactDropzoneManager.init();
    return React.createElement(components.Dropzone, props);
  };

  console.log('React Dropzone integration loaded');
  console.log('Usage: const { getRootProps, getInputProps } = useDropzone({ onDrop: (files) => console.log(files) })');
})();
