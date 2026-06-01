// ==================== VERIFY EVENT ASSET PAGE - Enhanced ====================

(() => {
  'use strict';

  // DOM Elements
  const form = document.querySelector('[data-verify-form]');
  const idInput = document.querySelector('[data-verify-input]');
  const fileInput = document.querySelector('[data-file-input]');
  const dropzone = document.querySelector('[data-dropzone]');
  const errorAlert = document.querySelector('[data-verify-error]');
  const resultWrapper = document.querySelector('[data-result-wrapper]');
  const resultCard = document.querySelector('[data-result-card]');
  const statusTitle = document.querySelector('[data-status-title]');
  const statusMessage = document.querySelector('[data-status-message]');
  const resultsContainer = document.querySelector('[data-results-container]');
  const actionsContainer = document.querySelector('[data-actions-container]');
  const messageContainer = document.querySelector('[data-message-container]');
  const messageText = document.querySelector('[data-message-text]');
  const copyBtn = document.querySelector('[data-copy-btn]');
  const downloadBtn = document.querySelector('[data-download-btn]');
  const filenameDisplay = document.querySelector('[data-filename-display]');
  const filenameText = document.querySelector('[data-filename]');
  const clearInputBtn = document.querySelector('[data-clear-input]');
  const removeFileBtn = document.querySelector('[data-remove-file]');
  const submitBtn = document.querySelector('[data-submit-btn]');

  // Field elements for results
  const fields = {
    recipient: document.querySelector('[data-field="recipient"]'),
    id: document.querySelector('[data-field="id"]'),
    date: document.querySelector('[data-field="date"]'),
    issuer: document.querySelector('[data-field="issuer"]'),
    template: document.querySelector('[data-field="template"]'),
    status: document.querySelector('[data-field="status"]'),
  };

  // Demo data for testing
  const demoData = {
    'ABC123': {
      recipient: 'Xusanov Davron',
      date: '12 March 2025',
      issuer: 'Gildia Studio',
      template: 'Classic Elegant',
      status: 'Verified ✓',
    },
    'UZ-2025-0001': {
      recipient: 'Akbarali Turgunov',
      date: '02 April 2025',
      issuer: 'Gildia Studio',
      template: 'Academic Diploma',
      status: 'Verified ✓',
    },
    'PRO-2026-0042': {
      recipient: 'Nargiza Karimova',
      date: '18 January 2026',
      issuer: 'Gildia Studio',
      template: 'Modern Minimal',
      status: 'Verified ✓',
    },
  };

  const SUPPORTED_TYPES = new Set([
    'application/pdf',
    'image/png',
    'image/jpeg',
  ]);

  const VERIFICATION_DELAY = 1200;
  let currentFile = null;

  // Guard clause
  if (!form || !resultCard) {
    console.warn('Verify page: Required elements not found');
    return;
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Show or hide an element
   */
  const setVisibility = (el, visible) => {
    if (!el) return;
    if (visible) {
      el.removeAttribute('hidden');
      el.style.display = '';
    } else {
      el.setAttribute('hidden', '');
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setVisibility(errorAlert, false);
  };

  /**
   * Show error message with animation
   */
  const showError = (message) => {
    const errorText = errorAlert?.querySelector('[data-error-text]');
    if (errorText) {
      errorText.textContent = message;
    }
    setVisibility(errorAlert, true);
    errorAlert?.focus();
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      clearError();
    }, 5000);
  };

  /**
   * Normalize and validate asset ID
   */
  const normalizeAssetId = (value) => {
    return String(value || '').trim().toUpperCase();
  };

  /**
   * Validate asset ID format
   */
  const isValidAssetId = (id) => {
    // Accept alphanumeric with hyphens, at least 3 characters
    return /^[A-Z0-9\-]{3,}$/.test(id);
  };

  /**
   * Set loading state on submit button
   */
  const setLoadingState = (loading) => {
    if (!submitBtn) return;
    
    if (loading) {
      submitBtn.setAttribute('data-loading', 'true');
      submitBtn.disabled = true;
    } else {
      submitBtn.removeAttribute('data-loading');
      submitBtn.disabled = false;
    }
  };

  /**
   * Update result card state and header
   */
  const setResultState = (state, title, message) => {
    resultCard?.setAttribute('data-state', state);
    if (statusTitle) statusTitle.textContent = title;
    if (statusMessage) statusMessage.textContent = message;
    
    // Update icon based on state using Lucide icons
    const iconWrapper = resultCard?.querySelector('[data-result-icon]');
    if (iconWrapper) {
      let iconName = 'check-circle-2'; // default
      if (state === 'verified') iconName = 'check-circle-2';
      else if (state === 'invalid') iconName = 'x-circle';
      else if (state === 'pending') iconName = 'loader-2';
      else if (state === 'idle') iconName = 'shield-check';
      
      iconWrapper.innerHTML = `<i data-lucide="${iconName}" class="verify-result-icon lucide-icon"></i>`;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  };

  /**
   * Display asset data in results grid
   */
  const displayResults = (data) => {
    Object.entries(fields).forEach(([key, el]) => {
      if (el) {
        const value = data?.[key] ?? '—';
        el.textContent = value;
        
        // Add animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        setTimeout(() => {
          el.style.transition = 'all 0.3s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      }
    });
  };

  /**
   * Show/hide results section with animation
   */
  const showResultsSection = (show) => {
    if (!resultsContainer) return;
    
    if (show) {
      setVisibility(resultsContainer, true);
      // Trigger animation
      setTimeout(() => {
        resultsContainer.style.opacity = '0';
        resultsContainer.style.transform = 'translateY(10px)';
        setTimeout(() => {
          resultsContainer.style.transition = 'all 0.4s ease';
          resultsContainer.style.opacity = '1';
          resultsContainer.style.transform = 'translateY(0)';
        }, 10);
      }, 200);
    } else {
      resultsContainer.style.opacity = '0';
      setTimeout(() => setVisibility(resultsContainer, false), 300);
    }
  };

  /**
   * Show/hide actions section with animation
   */
  const showActionsSection = (show) => {
    if (!actionsContainer) return;
    
    if (show) {
      setVisibility(actionsContainer, true);
      setTimeout(() => {
        actionsContainer.style.opacity = '0';
        actionsContainer.style.transform = 'translateY(10px)';
        setTimeout(() => {
          actionsContainer.style.transition = 'all 0.4s ease';
          actionsContainer.style.opacity = '1';
          actionsContainer.style.transform = 'translateY(0)';
        }, 10);
      }, 300);
    } else {
      actionsContainer.style.opacity = '0';
      setTimeout(() => setVisibility(actionsContainer, false), 300);
    }
  };

  /**
   * Show/hide message section with animation
   */
  const showMessage = (message) => {
    if (!messageContainer) return;
    
    if (message) {
      if (messageText) messageText.textContent = message;
      setVisibility(messageContainer, true);
      setTimeout(() => {
        messageContainer.style.opacity = '0';
        messageContainer.style.transform = 'translateY(10px)';
        setTimeout(() => {
          messageContainer.style.transition = 'all 0.4s ease';
          messageContainer.style.opacity = '1';
          messageContainer.style.transform = 'translateY(0)';
        }, 10);
      }, 400);
    } else {
      messageContainer.style.opacity = '0';
      setTimeout(() => setVisibility(messageContainer, false), 300);
    }
  };

  /**
   * Reset results display
   */
  const resetResults = () => {
    displayResults({});
    showResultsSection(false);
    showActionsSection(false);
    showMessage('');
  };

  /**
   * Clear file selection
   */
  const clearFile = () => {
    if (fileInput) {
      fileInput.value = '';
    }
    currentFile = null;
    setVisibility(filenameDisplay, false);
    if (idInput) {
      idInput.focus();
    }
  };

  /**
   * Clear ID input
   */
  const clearIdInput = () => {
    if (idInput) {
      idInput.value = '';
      idInput.focus();
      clearError();
    }
  };

  /**
   * Look up asset data
   */
  const lookupAsset = (id) => {
    if (!id) {
      return {
        state: 'invalid',
        title: 'Invalid Asset ID',
        message: 'Please enter a valid asset ID.',
      };
    }

    // Check for pending status
    if (id.includes('PEND')) {
      return {
        state: 'pending',
        title: 'Verification Pending',
        message: 'Your verification request is being processed. Please check back shortly.',
      };
    }

    // Look up in demo data
    if (demoData[id]) {
      return {
        state: 'verified',
        title: 'Asset Verified ✓',
        message: 'This event asset has been successfully verified and is authentic.',
        data: { id, ...demoData[id] },
      };
    }

    return {
      state: 'invalid',
      title: 'Asset Not Found',
      message: 'No matching asset found. Please check the ID and try again.',
    };
  };

  /**
   * Simulate verification process
   */
  const simulateVerification = (id) => {
    clearError();
    resetResults();
    setLoadingState(true);
    setVisibility(resultWrapper, true);
    setVisibility(resultCard, true);

    // Show pending state
    setResultState('pending', 'Verifying Asset', 'Checking asset details...');
    
    // Scroll to result
    setTimeout(() => {
      resultWrapper?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);

    // Simulate verification delay
    setTimeout(() => {
      const result = lookupAsset(id);

      setResultState(result.state, result.title, result.message);

      if (result.state === 'verified') {
        displayResults(result.data);
        showResultsSection(true);
        showActionsSection(true);
        showMessage('✓ This event asset is authentic and can be downloaded for your records.');
      } else if (result.state === 'pending') {
        showResultsSection(false);
        showActionsSection(false);
        showMessage('');
      } else {
        showResultsSection(false);
        showActionsSection(false);
        showMessage('');
      }
      
      setLoadingState(false);
    }, VERIFICATION_DELAY);
  };

  // ==================== EVENT HANDLERS ====================

  /**
   * Handle form submission
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const rawId = idInput?.value;
    const id = normalizeAssetId(rawId);

    // Check if file is selected
    if (currentFile) {
      const filenameParts = currentFile.name.split('.');
      const idFromFilename = normalizeAssetId(filenameParts[0]);
      const finalId = idFromFilename || id;

      if (!finalId || !isValidAssetId(finalId)) {
        showError('Could not extract asset ID from filename. Please enter a valid asset ID.');
        return;
      }

      simulateVerification(finalId);
      return;
    }

    // Validate ID input
    if (!id || !isValidAssetId(id)) {
      showError('Please enter a valid asset ID (e.g., ABC123 or UZ-2025-0001).');
      resetResults();
      setVisibility(resultWrapper, false);
      setVisibility(resultCard, false);
      return;
    }

    clearError();
    simulateVerification(id);
  };

  /**
   * Validate and handle file upload
   */
  const handleFileUpload = (file) => {
    if (!file) return;

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showError('File size exceeds 10MB limit. Please upload a smaller file.');
      resetResults();
      return;
    }

    // Check file type
    const isSupportedType = SUPPORTED_TYPES.has(file.type) ||
      /\.(pdf|png|jpe?g)$/i.test(file.name || '');

    if (!isSupportedType) {
      showError('Unsupported file type. Please upload a PDF, PNG, or JPG file.');
      resetResults();
      return;
    }

    clearError();
    currentFile = file;

    // Display filename
    if (filenameDisplay && filenameText) {
      filenameText.textContent = file.name;
      setVisibility(filenameDisplay, true);
    }

    // Clear ID input if file is selected
    if (idInput) {
      idInput.value = '';
    }
  };

  /**
   * Copy verification details to clipboard
   */
  const handleCopyDetails = async () => {
    const data = Object.entries(fields)
      .map(([key, el]) => {
        const value = el?.textContent || '—';
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
        return `${label}: ${value}`;
      })
      .join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data);
        
        // Show success feedback
        const originalText = copyBtn?.textContent;
        if (copyBtn) {
          copyBtn.innerHTML = '<i data-lucide="check" class="lucide-icon"></i> Copied!';
          lucide.createIcons();
          setTimeout(() => {
            if (copyBtn) {
              copyBtn.innerHTML = originalText || 'Copy Details';
            }
          }, 2000);
        }
        
        showMessage('✓ Asset details copied to clipboard!');
        setTimeout(() => showMessage(''), 3000);
      } else {
        showMessage('Copy not supported in this browser.');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      showMessage('Unable to copy details. Please try again.');
    }
  };

  /**
   * Handle download
   */
  const handleDownload = () => {
    showMessage('📥 Download functionality will be available upon backend integration.');
    setTimeout(() => showMessage(''), 4000);
  };

  // ==================== DRAG & DROP ====================

  /**
   * Setup drag and drop
   */
  const setupDragAndDrop = () => {
    if (!dropzone) return;

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => {
        dropzone.classList.add('is-active');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => {
        dropzone.classList.remove('is-active');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files?.length) {
        handleFileUpload(files[0]);
      }
    }, false);

    // Click to upload
    dropzone.addEventListener('click', () => {
      fileInput?.click();
    });

    // Keyboard support
    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput?.click();
      }
    });
  };

  // ==================== INITIALIZATION ====================

  // Attach event listeners
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', handleCopyDetails);
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownload);
  }

  if (clearInputBtn) {
    clearInputBtn.addEventListener('click', clearIdInput);
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', clearFile);
  }

  // ID input real-time validation
  if (idInput) {
    idInput.addEventListener('input', () => {
      clearError();
      if (currentFile) {
        clearFile();
      }
    });

    idInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        form?.requestSubmit();
      }
    });
  }

  // Setup drag and drop
  setupDragAndDrop();

  // Initialize UI state
  setResultState('idle', 'Ready to verify', 'Enter an asset ID or upload a file to verify its authenticity');
  resetResults();
  setVisibility(resultWrapper, false);
  setVisibility(resultCard, false);

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
})();
