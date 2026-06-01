(() => {
  const root = document.documentElement;
  if (!root) return;

  // Login/Register form enhancements
  const isLoginPage = document.body.classList.contains('ap-login');
  const isRegisterPage = document.body.classList.contains('ap-register');

  if (isLoginPage || isRegisterPage) {
    // Add smooth focus animations
    const inputs = document.querySelectorAll('.ap-input');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('is-focused');
      });
      
      input.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement.classList.remove('is-focused');
        }
      });

      // Check if input has value on load
      if (input.value) {
        input.parentElement.classList.add('is-focused');
      }
    });

    // Password confirmation validation (register page)
    if (isRegisterPage) {
      const passwordInput = document.getElementById('reg-pass');
      const confirmPasswordInput = document.getElementById('reg-pass2');
      
      if (passwordInput && confirmPasswordInput) {
        const validatePasswordMatch = () => {
          if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
            confirmPasswordInput.style.borderColor = '#ef4444';
          } else {
            confirmPasswordInput.setCustomValidity('');
            confirmPasswordInput.style.borderColor = '';
          }
        };

        passwordInput.addEventListener('input', validatePasswordMatch);
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
      }
    }

    // Form submission enhancement
    const forms = document.querySelectorAll('.ap-form');
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('.ap-btn--primary');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = submitBtn.textContent.includes('Log in') ? 'Logging in...' : 'Creating account...';
          
          // Re-enable after 2 seconds (in case of error)
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.textContent.includes('Logging') ? 'Log in' : 'Create account';
          }, 2000);
        }
      });
    });
  }

  // Verify page theme toggle (light/dark)
  const body = document.body;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const THEME_KEY = 'verify-theme';
  if (body && body.classList.contains('ap-verify') && themeBtn) {
    const stored = window.localStorage ? window.localStorage.getItem(THEME_KEY) : null;
    const initial = stored === 'dark' ? 'dark' : 'light';
    body.dataset.theme = initial;

    themeBtn.addEventListener('click', () => {
      const next = body.dataset.theme === 'dark' ? 'light' : 'dark';
      body.dataset.theme = next;
      try {
        window.localStorage && window.localStorage.setItem(THEME_KEY, next);
      } catch (_) {}
    });
  }

  // OTP UX (verify page only)
  const otpBoxes = Array.from(document.querySelectorAll('[data-otp-box]'));
  const otpHidden = document.querySelector('[data-otp-hidden]');
  const resendBtn = document.querySelector('[data-resend]');
  const resendText = document.querySelector('[data-resend-text]');

  const setHidden = () => {
    if (!otpHidden) return;
    otpHidden.value = otpBoxes.map((b) => (b.value || '').trim()).join('');
  };

  const focusAt = (idx) => otpBoxes[idx] && otpBoxes[idx].focus();

  const normalizeDigit = (v) => (v || '').replace(/\D/g, '').slice(0, 1);

  const fillFrom = (startIdx, digits) => {
    let i = startIdx;
    for (const d of digits) {
      if (i >= otpBoxes.length) break;
      otpBoxes[i].value = d;
      i += 1;
    }
    setHidden();
    focusAt(Math.min(i, otpBoxes.length - 1));
  };

  otpBoxes.forEach((box, idx) => {
    box.addEventListener('input', () => {
      const v = normalizeDigit(box.value);
      box.value = v;
      setHidden();
      if (v && idx < otpBoxes.length - 1) focusAt(idx + 1);
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (box.value) {
          box.value = '';
          setHidden();
          return;
        }
        if (idx > 0) {
          otpBoxes[idx - 1].value = '';
          setHidden();
          focusAt(idx - 1);
        }
      }

      if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        focusAt(idx - 1);
      }
      if (e.key === 'ArrowRight' && idx < otpBoxes.length - 1) {
        e.preventDefault();
        focusAt(idx + 1);
      }
    });

    box.addEventListener('paste', (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text') || '';
      const digits = text.replace(/\D/g, '').slice(0, otpBoxes.length - idx).split('');
      if (digits.length <= 1) return;
      e.preventDefault();
      fillFrom(idx, digits);
    });
  });

  // Resend timer (UX only)
  const startResendCooldown = (seconds) => {
    if (!resendBtn || !resendText) return;
    let left = seconds;
    resendBtn.disabled = true;
    const tick = () => {
      if (left <= 0) {
        resendBtn.disabled = false;
        resendText.textContent = 'Resend code';
        return;
      }
      resendText.textContent = `Resend in ${left}s`;
      left -= 1;
      window.setTimeout(tick, 1000);
    };
    tick();
  };

  if (resendBtn) {
    startResendCooldown(30);
    resendBtn.addEventListener('click', () => startResendCooldown(30));
  }
})();

