// Replace SVG sprite icons with Lucide icons in editor.html
// This script runs after DOM is loaded and replaces all <use href="#pf-i-..."> with Lucide icons

(function() {
  'use strict';

  // Icon mapping: SVG sprite ID -> Lucide icon name
  const iconMap = {
    'pf-i-chevron': 'chevron-right',
    'pf-i-add': 'plus',
    'pf-i-panel': 'panel-left',
    'pf-i-home': 'home',
    'pf-i-text': 'type',
    'pf-i-shapes': 'shapes',
    'pf-i-images': 'image',
    'pf-i-upload': 'upload',
    'pf-i-layers': 'layers',
    'pf-i-help': 'help-circle',
    'pf-i-save': 'save',
    'pf-i-file-plus': 'file-plus',
    'pf-i-import': 'download',
    'pf-i-share': 'share-2',
    'pf-i-download': 'download',
    'pf-i-lock': 'lock',
    'pf-i-arrange': 'move',
    'pf-i-style': 'palette',
    'pf-i-circle': 'circle',
    'pf-i-triangle': 'triangle',
    'pf-i-crown': 'crown',
    'pf-i-crown-solid': 'crown',
    'pf-i-user': 'user',
  };

  // Replace SVG sprite icons with Lucide icons
  function replaceSpriteIcons() {
    if (typeof lucide === 'undefined') {
      console.warn('Lucide icons not loaded yet');
      return;
    }

    // Find all SVG elements with <use href="#pf-i-...">
    const svgElements = document.querySelectorAll('svg.pf-i use[href^="#pf-i-"]');
    
    svgElements.forEach(function(svgUse) {
      const href = svgUse.getAttribute('href');
      if (!href) return;
      
      // Extract icon ID from href (e.g., "#pf-i-home" -> "pf-i-home")
      const iconId = href.substring(1);
      const lucideIconName = iconMap[iconId];
      
      if (!lucideIconName) {
        console.warn('No Lucide icon mapping for:', iconId);
        return;
      }

      // Get parent SVG element
      const svgParent = svgUse.closest('svg');
      if (!svgParent) return;

      // Preserve classes and attributes
      const classes = svgParent.className.baseVal || svgParent.className;
      const ariaHidden = svgParent.getAttribute('aria-hidden');
      const ariaLabel = svgParent.getAttribute('aria-label');
      
      // Create new i element with Lucide icon
      const iconElement = document.createElement('i');
      iconElement.setAttribute('data-lucide', lucideIconName);
      iconElement.className = 'lucide-icon ' + (classes || '');
      if (ariaHidden) iconElement.setAttribute('aria-hidden', ariaHidden);
      if (ariaLabel) iconElement.setAttribute('aria-label', ariaLabel);
      
      // Replace SVG with icon element
      svgParent.parentNode.replaceChild(iconElement, svgParent);
    });

    // Also replace inline SVG icons in topbar (undo, redo, etc.)
    const topbarSvgs = document.querySelectorAll('.pf-topbar-btn svg, .pf-icon svg');
    topbarSvgs.forEach(function(svg) {
      // Check if this is a simple icon that can be replaced
      const paths = svg.querySelectorAll('path');
      if (paths.length === 0) return;

      // Try to identify icon by path structure
      const pathData = Array.from(paths).map(p => p.getAttribute('d')).join(' ');
      
      // Map common patterns to Lucide icons
      let iconName = null;
      if (pathData.includes('M9 14 4 9l5-5') || pathData.includes('undo')) {
        iconName = 'undo';
      } else if (pathData.includes('M15 14l5-5-5-5') || pathData.includes('redo')) {
        iconName = 'redo';
      } else if (pathData.includes('M5 4l7 16')) {
        iconName = 'mouse-pointer-2';
      } else if (pathData.includes('M18 11V6a2')) {
        iconName = 'hand';
      } else if (pathData.includes('M5 5v14') && pathData.includes('M7 8h11')) {
        iconName = 'align-left';
      } else if (pathData.includes('M12 5v14') && pathData.includes('M5 8h14')) {
        iconName = 'align-center';
      } else if (pathData.includes('M19 5v14') && pathData.includes('M6 8h11')) {
        iconName = 'align-right';
      } else if (pathData.includes('M5 6h14') && pathData.includes('M8 8v10')) {
        iconName = 'align-top';
      } else if (pathData.includes('M5 12h14') && pathData.includes('M8 6v12')) {
        iconName = 'align-middle';
      } else if (pathData.includes('M5 18h14') && pathData.includes('M8 6v10')) {
        iconName = 'align-bottom';
      } else if (pathData.includes('circle') && pathData.includes('M8 11h6')) {
        iconName = 'zoom-out';
      } else if (pathData.includes('circle') && pathData.includes('M11 8v6') && pathData.includes('M8 11h6')) {
        iconName = 'zoom-in';
      } else if (pathData.includes('M12 5v14') && pathData.includes('M5 12h14')) {
        iconName = 'plus';
      } else if (pathData.includes('M5 12h14')) {
        iconName = 'minus';
      }

      if (iconName) {
        const iconElement = document.createElement('i');
        iconElement.setAttribute('data-lucide', iconName);
        iconElement.className = 'lucide-icon';
        const ariaHidden = svg.getAttribute('aria-hidden');
        const ariaLabel = svg.getAttribute('aria-label');
        if (ariaHidden) iconElement.setAttribute('aria-hidden', ariaHidden);
        if (ariaLabel) iconElement.setAttribute('aria-label', ariaLabel);
        
        svg.parentNode.replaceChild(iconElement, svg);
      }
    });

    // Initialize Lucide icons
    lucide.createIcons();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(replaceSpriteIcons, 100);
    });
  } else {
    setTimeout(replaceSpriteIcons, 100);
  }

  // Also run after editor.js loads (if needed)
  window.addEventListener('load', function() {
    setTimeout(replaceSpriteIcons, 200);
  });
})();
