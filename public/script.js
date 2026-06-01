// ================== SITE-ONLY SCRIPTS ==================
// Keep this file lightweight — the editor has its own `editor.js`.

// ================== HERO NAME TYPING ANIMATION ==================
(function () {
  const nameEl =
    document.querySelector(".js-hero-name") ||
    document.querySelector(".hero-preview .cert-name");
  if (!nameEl) return;

  const names = [
    "Nurlan Rahmonqulov",
    "Ruslan Ermuhammedov",
    "XusanDev",
    "Akbarali Pro",
  ];

  let nameIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const current = names[nameIndex];

    if (!isDeleting) {
      nameEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        setTimeout(() => (isDeleting = true), 1000);
      }
    } else {
      nameEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        nameIndex = (nameIndex + 1) % names.length;
      }
    }

    const typingSpeed = isDeleting ? 60 : 80;
    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();
})();
