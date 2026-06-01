// Lucide Icons Initialization Script
// This script initializes all Lucide icons on page load and after DOM updates

(function() {
  'use strict';

  // Initialize Lucide icons
  function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLucideIcons);
  } else {
    initLucideIcons();
  }

  // Re-initialize after dynamic content changes
  const observer = new MutationObserver(function(mutations) {
    let shouldReinit = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && (node.hasAttribute('data-lucide') || node.querySelector('[data-lucide]'))) {
            shouldReinit = true;
          }
        });
      }
    });
    if (shouldReinit) {
      setTimeout(initLucideIcons, 10);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Export for manual re-initialization
  window.reinitLucideIcons = initLucideIcons;
})();
