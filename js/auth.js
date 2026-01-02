document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const formTitle = document.getElementById('form-title');
    const toggleText = document.getElementById('toggle-text');
    let toggleBtn = document.getElementById('toggle-btn');

    let isLoginView = true;
    function bindToggle() {
        if(toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isLoginView = !isLoginView;
                updateView();
            });
        }
    }
    bindToggle();

    function updateView() {
        if (isLoginView) {
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            formTitle.textContent = 'Sign In';
            toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-btn">Create account</a>';
        } else {
            signinForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            formTitle.textContent = 'Create Account';
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-btn">Sign in</a>';
        }
        toggleBtn = document.getElementById('toggle-btn');
        bindToggle();
        document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'signup') {
        isLoginView = false;
        updateView();
    }

    function bindPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = newBtn.parentElement.querySelector('input');
                if (input) {
                    const isPassword = input.getAttribute('type') === 'password';
                    input.setAttribute('type', isPassword ? 'text' : 'password');
                    
                    const iconSpan = newBtn.querySelector('.material-icons-round');
                    if (iconSpan) {
                        iconSpan.textContent = isPassword ? 'visibility_off' : 'visibility';
                    }
                }
            });
        });
    }
    bindPasswordToggles();

    document.querySelectorAll('.no-space').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === ' ') e.preventDefault();
        });
        input.addEventListener('input', (e) => {
            if (e.target.value.includes(' ')) {
                e.target.value = e.target.value.replace(/\s/g, '');
            }
        });
    });

    function showError(input, msg, customMsgEl = null) {
        input.classList.add('invalid');
        const msgEl = customMsgEl || input.parentElement.querySelector('.error-msg');
        if (msgEl) {
            msgEl.textContent = msg;
            msgEl.classList.add('visible');
        }
    }

    function clearError(input, customMsgEl = null) {
        input.classList.remove('invalid');
        const msgEl = customMsgEl || input.parentElement.querySelector('.error-msg');
        if (msgEl) {
            msgEl.classList.remove('visible');
        }
    }

    function setLoading(form, isLoading) {
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;

        if (isLoading) {
            btn.dataset.originalText = btn.textContent;
            btn.disabled = true;
            btn.classList.add('btn-loading');
            btn.innerHTML = `<span class="spinner"></span>`;
        } else {
            btn.disabled = false;
            btn.classList.remove('btn-loading');
            btn.textContent = btn.dataset.originalText || 'Submit';
        }
    }

    const emailInput = document.getElementById('signup-email');
    emailInput.addEventListener('input', () => {
        const val = emailInput.value; 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!val) {
            clearError(emailInput);
        } else if (!emailRegex.test(val)) {
            showError(emailInput, "Please enter a valid email address.");
        } else {
            clearError(emailInput);
        }
    });

    const countryCodeInput = document.getElementById('signup-country-code');
    const phoneInput = document.getElementById('signup-phone');
    const phoneContainer = document.querySelector('.phone-input-container');
    const phoneError = document.getElementById('phone-error');

    if (countryCodeInput) countryCodeInput.value = '+';

    if (countryCodeInput) {
        countryCodeInput.addEventListener('keydown', (e) => {
            if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key)) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });
        countryCodeInput.addEventListener('input', (e) => {
            let val = e.target.value;
            if (!val.startsWith('+')) {
                val = '+' + val.replace(/[^0-9]/g, '');
            } else {
                val = '+' + val.substring(1).replace(/[^0-9]/g, '');
            }
            e.target.value = val;
            if (val.length < 2) {
                showError(phoneContainer, "Country code required.", phoneError);
            } else {
                clearError(phoneContainer, phoneError);
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('keydown', (e) => {
            if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key)) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length < 5) {
                showError(phoneContainer, "Phone number too short.", phoneError);
            } else {
                clearError(phoneContainer, phoneError);
            }
        });
    }

    const passInput = document.getElementById('signup-pass');
    const confirmInput = document.getElementById('signup-confirm');

    passInput.addEventListener('input', () => {
        const val = passInput.value;
        if (!val) {
            clearError(passInput); 
            return;
        }
        if (val.length < 6) {
            showError(passInput, "Must be at least 6 characters.");
            return;
        }
        const hasUpper = /[A-Z]/.test(val);
        const hasNumber = /\d/.test(val);
        if (!hasUpper || !hasNumber) {
            showError(passInput, "Must contain 1 uppercase letter & 1 number.");
        } else {
            clearError(passInput);
            if (confirmInput.value) confirmInput.dispatchEvent(new Event('input'));
        }
    });

    confirmInput.addEventListener('input', () => {
        if (!confirmInput.value) {
            clearError(confirmInput);
            return;
        }
        if (confirmInput.value !== passInput.value) {
            showError(confirmInput, "Passwords do not match.");
        } else {
            clearError(confirmInput);
        }
    });

    const yobInput = document.getElementById('signup-yob');
    yobInput.addEventListener('input', () => {
        const val = parseInt(yobInput.value);
        const currentYear = new Date().getFullYear();
        if (!yobInput.value) return;
        if (val < 1900 || val > currentYear) {
            showError(yobInput, "Please enter a valid year (1900-" + currentYear + ").");
        } else {
            clearError(yobInput);
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        emailInput.dispatchEvent(new Event('input'));
        countryCodeInput.dispatchEvent(new Event('input'));
        phoneInput.dispatchEvent(new Event('input'));
        passInput.dispatchEvent(new Event('input'));
        confirmInput.dispatchEvent(new Event('input'));
        yobInput.dispatchEvent(new Event('input'));

        const hasErrors = document.querySelectorAll('.error-msg.visible').length > 0;
        
        if (!hasErrors) {
            setLoading(signupForm, true);
            setTimeout(() => {
                alert("Account created successfully.");
                setLoading(signupForm, false);
            }, 1500);
        }
    });

    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        setLoading(signinForm, true);
        setTimeout(() => {
            alert("Signed in successfully.");
            setLoading(signinForm, false);
        }, 1500);
    });
});
