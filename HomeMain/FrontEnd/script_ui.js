// --- script-ui.js ---

/**
 * ============================================================
 * --- VIEW ---
 * Handles all DOM interactions and UI updates.
 * Is instructed by the Controller.
 * Contains NO backend simulation logic.
 * ============================================================
 */
class View {
    // --- Element Selectors (Cached in Constructor) ---
    elements = {};
    #toastTimeout = null; // Store timeout ID for toast

    constructor() {
        this._cacheDOMElements();
        this._createToastContainer(); // Ensure toast container exists
        console.log("View: Initialized and DOM elements cached.");
    }

    _cacheDOMElements() {
        this.elements = {
            // General
            body: document.body,
            // Mobile Menu
            menuToggle: document.getElementById('menuToggle'),
            navLinks: document.getElementById('navLinks'),
            closeMenu: document.getElementById('closeMenu'),
            navLinkItems: document.querySelectorAll('#navLinks a'), // More specific selector
            // Header
            header: document.getElementById('header'),
            // Back to Top
            backToTopButton: document.getElementById('backToTop'),
            // Scroll Indicator
            scrollIndicator: document.getElementById('scrollIndicator'),
            // Fade In Elements
            fadeInElements: document.querySelectorAll('.fade-in'),
            // Particles Container
            particlesJsContainer: document.getElementById('particles-js'),

            // --- Modals & Overlay ---
            modalOverlay: document.getElementById('modalOverlay'),
            loginModal: document.getElementById('loginModal'), // Add role="dialog", aria-modal="true", aria-labelledby="loginModalTitle" in HTML
            registerModal: document.getElementById('registerModal'), // Add role="dialog", aria-modal="true", aria-labelledby="registerModalTitle" in HTML
            closeLoginModalBtn: document.getElementById('closeLoginModal'),
            closeRegisterModalBtn: document.getElementById('closeRegisterModal'),
            // Modal Switching Links
            switchToRegisterLink: document.getElementById('switchToRegister'),
            switchToLoginLink: document.getElementById('switchToLogin'),
            // Forgot Password Flow
            forgotPasswordLink: document.getElementById('forgotPasswordLink'),
            backToLoginLink: document.getElementById('backToLoginLink'),

            // --- Forms ---
            // Contact Form
            contactForm: document.getElementById('contactForm'),
            contactName: document.getElementById('name'),
            contactEmail: document.getElementById('email'),
            contactSubject: document.getElementById('subject'),
            contactMessage: document.getElementById('message'),
            contactSubmitBtn: document.getElementById('contactSubmitBtn'), // Assuming submit button has an ID
            // Login Form
            loginForm: document.getElementById('loginForm'),
            loginEmailInput: document.getElementById('loginEmail'),
            loginPasswordInput: document.getElementById('loginPassword'),
            loginSubmitBtn: document.getElementById('loginSubmitBtn'), // Assuming submit button has an ID
            // Register Form
            registerForm: document.getElementById('registerForm'),
            registerUsername: document.getElementById('registerUsername'),
            registerEmail: document.getElementById('registerEmail'),
            registerPhone: document.getElementById('registerPhone'),
            registerPassword: document.getElementById('registerPassword'),
            registerConfirmPassword: document.getElementById('registerConfirmPassword'),
            registerSubmitBtn: document.getElementById('registerSubmitBtn'), // Assuming submit button has an ID
            // Forgot Password Form
            forgotPasswordForm: document.getElementById('forgotPasswordForm'),
            resetEmailInput: document.getElementById('resetEmailInput'),
            sendResetLinkBtn: document.getElementById('sendResetLinkBtn'), // Assuming submit button has an ID

            // --- Auth/User Info (Header - Assumed IDs) ---
            authButtonsHeader: document.getElementById('authButtonsHeader'), // Container for header login/signup
            loginBtnHeader: document.getElementById('loginBtnHeader'),
            signupBtnHeader: document.getElementById('signupBtnHeader'),
            userInfoHeader: document.getElementById('userInfoHeader'),     // Container for header welcome/logout
            usernameDisplayHeader: document.getElementById('usernameDisplayHeader'),
            logoutBtnHeader: document.getElementById('logoutBtnHeader'),

            // --- Auth/User Info (Mobile - Assumed IDs, MUST exist in HTML #navLinks) ---
            authButtonsMobile: document.getElementById('authButtonsMobile'), // Container for mobile login/signup
            loginBtnMobile: document.getElementById('loginBtnMobile'),     // Specific mobile login button
            signupBtnMobile: document.getElementById('signupBtnMobile'),    // Specific mobile signup button
            userInfoMobile: document.getElementById('userInfoMobile'),     // Container for mobile welcome/logout
            usernameDisplayMobile: document.getElementById('usernameDisplayMobile'),
            logoutBtnMobile: document.getElementById('logoutBtnMobile'),     // Specific mobile logout button

            // --- Form Error Message Placeholders (Assumed IDs/Classes) ---
            loginEmailError: document.getElementById('loginEmailError'),
            loginPasswordError: document.getElementById('loginPasswordError'),
            registerUsernameError: document.getElementById('registerUsernameError'),
            registerEmailError: document.getElementById('registerEmailError'),
            registerPasswordError: document.getElementById('registerPasswordError'),
            registerConfirmPasswordError: document.getElementById('registerConfirmPasswordError'),
            resetEmailError: document.getElementById('resetEmailError'),
            contactNameError: document.getElementById('contactNameError'),
            contactEmailError: document.getElementById('contactEmailError'),
            contactMessageError: document.getElementById('contactMessageError'),

            // Toast Container (Created dynamically)
            toastContainer: null
        };

        // Add a check for critical elements
        if (!this.elements.navLinks || !this.elements.modalOverlay) {
            console.warn("View: Core elements like navLinks or modalOverlay not found!");
        }
        if (!this.elements.authButtonsMobile || !this.elements.userInfoMobile) {
            console.warn("View: Dedicated mobile auth elements (#authButtonsMobile, #userInfoMobile) not found in HTML within #navLinks. Mobile auth switching will fail.");
        }
    }

    _elementExists(elementRef) {
        return elementRef !== null && typeof elementRef !== 'undefined';
    }

    // --- UI Update Methods ---
    toggleMobileMenu(show) {
        if (this._elementExists(this.elements.navLinks)) {
            this.elements.navLinks.classList.toggle('active', show);
            if(this._elementExists(this.elements.menuToggle)) {
                this.elements.menuToggle.setAttribute('aria-expanded', show ? 'true' : 'false');
            }
        }
        if (this._elementExists(this.elements.body)) {
            this.elements.body.classList.toggle('no-scroll', show);
        }
    }

    isMobileMenuOpen() {
        return this._elementExists(this.elements.navLinks) && this.elements.navLinks.classList.contains('active');
    }

    updateHeaderScroll(scrolled) {
        if (this._elementExists(this.elements.header)) {
            this.elements.header.classList.toggle('scrolled', scrolled);
        }
    }

    updateBackToTopButton(show) {
        if (this._elementExists(this.elements.backToTopButton)) {
            this.elements.backToTopButton.classList.toggle('active', show);
        }
    }

    updateScrollIndicator(percentage) {
        if (this._elementExists(this.elements.scrollIndicator)) {
            this.elements.scrollIndicator.style.width = `${percentage}%`;
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    smoothScrollTo(selector) {
        const targetElement = document.querySelector(selector);
        if (targetElement) {
            const headerOffset = this._elementExists(this.elements.header) && getComputedStyle(this.elements.header).position === 'fixed'
                ? this.elements.header.offsetHeight
                : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset - 20;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
            console.warn(`View: Element with selector "${selector}" not found for smooth scrolling.`);
        }
    }

    initFadeInObserver(callback) {
        if (this.elements.fadeInElements && this.elements.fadeInElements.length > 0 && 'IntersectionObserver' in window) {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            const scrollObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            this.elements.fadeInElements.forEach(el => scrollObserver.observe(el));
        } else if (!('IntersectionObserver' in window)) {
            console.warn("View: IntersectionObserver not supported. Fade-in effect disabled.");
            // Fallback: Make elements visible immediately if needed
            // this.elements.fadeInElements.forEach(el => callback(el));
        }
    }

    activateFadeInElement(element) {
        if (this._elementExists(element)) {
            element.classList.add('active');
        }
    }

    initParticles() {
        if (typeof particlesJS === 'function' && this._elementExists(this.elements.particlesJsContainer)) {
            const particlesConfig = { /* ... (Your particles config) ... */
                "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true
            };
            particlesJS('particles-js', particlesConfig);
        } else if (!this._elementExists(this.elements.particlesJsContainer)) {
            console.warn("View: 'particles-js' element not found.");
        } else {
            console.warn("View: particles.js library not loaded or typeof particlesJS is not 'function'.");
        }
    }

    resetForm(formElement) {
        if (this._elementExists(formElement)) {
            formElement.reset();
            this.clearFormErrors(formElement);
        }
    }

    getFormValues(formId) {
        const values = {};
        const formElement = this.elements[formId];
        if (!this._elementExists(formElement)) {
            console.error(`View: Cannot get values, form element not found for ID "${formId}".`);
            return values;
        }
        try {
            const formData = new FormData(formElement);
            for (const [key, value] of formData.entries()) {
                values[key] = value;
            }
        } catch (error) {
            console.error(`View: Error getting FormData for ${formId}.`, error);
        }
        return values;
    }

    // --- Toast Notifications ---
    _createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            this.elements.body.appendChild(container);
            this.elements.toastContainer = container;
        } else {
            this.elements.toastContainer = document.getElementById('toast-container');
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        if (!this._elementExists(this.elements.toastContainer)) {
            console.error("View: Toast container not found. Message:", message);
            return;
        }
        if (this.#toastTimeout) {
            clearTimeout(this.#toastTimeout);
        }
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        this.elements.toastContainer.appendChild(toast);
        this.#toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if(toast.parentNode === this.elements.toastContainer) {
                    this.elements.toastContainer.removeChild(toast);
                }
                this.#toastTimeout = null;
            }, 300);
        }, duration);
    }

    // --- Modal Management ---
    openModal(modalElement) {
        if (!this._elementExists(modalElement) || !this._elementExists(this.elements.modalOverlay)) return;
        this.elements.modalOverlay.classList.add('active');
        modalElement.classList.add('active');
        if(this._elementExists(this.elements.body)) this.elements.body.classList.add('no-scroll');

        const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if(focusableElements.length > 0) {
            setTimeout(() => focusableElements[0].focus(), 100);
        }

        if (modalElement === this.elements.loginModal) {
            this._showSpecificModalForm(this.elements.loginForm);
        }
        this.clearFormErrors(modalElement);
        const formsInside = modalElement.querySelectorAll('form');
        formsInside.forEach(form => form.reset());
    }

    closeModal() {
        if (!this._elementExists(this.elements.modalOverlay)) return;
        this.elements.modalOverlay.classList.remove('active');
        if (this._elementExists(this.elements.loginModal)) this.elements.loginModal.classList.remove('active');
        if (this._elementExists(this.elements.registerModal)) this.elements.registerModal.classList.remove('active');
        if(this._elementExists(this.elements.body)) this.elements.body.classList.remove('no-scroll');
        // Optionally clear errors on close or leave them
    }

    _showSpecificModalForm(formToShow) {
        if (this._elementExists(this.elements.loginForm)) {
            this.elements.loginForm.style.display = (formToShow === this.elements.loginForm) ? 'block' : 'none';
        }
        if (this._elementExists(this.elements.forgotPasswordForm)) {
            this.elements.forgotPasswordForm.style.display = (formToShow === this.elements.forgotPasswordForm) ? 'block' : 'none';
        }
    }

    showLoginFormView() {
        if(this._elementExists(this.elements.loginModal)) {
            this._showSpecificModalForm(this.elements.loginForm);
        }
    }

    showForgotPasswordView() {
        if(this._elementExists(this.elements.loginModal)) {
            this._showSpecificModalForm(this.elements.forgotPasswordForm);
            this.focusElement(this.elements.resetEmailInput);
        }
    }

    focusElement(element) {
        if(this._elementExists(element)) {
            setTimeout(() => element.focus(), 50);
        }
    }

    // --- Form Validation Feedback ---
    showFieldError(inputElement, message) {
        if (!this._elementExists(inputElement)) return;
        const errorElementId = inputElement.id + 'Error';
        const errorElement = this.elements[errorElementId] || document.getElementById(errorElementId);

        if (this._elementExists(errorElement)) {
            errorElement.textContent = message || '';
            errorElement.style.display = message ? 'block' : 'none';
            // Add CSS: .error-message { color: red; font-size: 0.8em; margin-top: 4px; display: none; } /* Hide by default */
        }
        inputElement.classList.toggle('is-invalid', !!message);
        // Add CSS: input.is-invalid { border-color: red; }
    }

    clearFormErrors(containerElement) {
        if (!this._elementExists(containerElement)) return;
        // Use specific error element IDs if available, otherwise querySelectorAll
        const errorElements = containerElement.querySelectorAll('[id$="Error"], .error-message'); // Find elements ending in "Error" or with class
        errorElements.forEach(el => {
            if(el.id && this.elements[el.id]) { // If it's a cached error element
                this.elements[el.id].textContent = '';
                this.elements[el.id].style.display = 'none';
            } else if (el.classList.contains('error-message')) { // Fallback for generic error message class
                el.textContent = '';
                el.style.display = 'none';
            }
        });

        const invalidInputs = containerElement.querySelectorAll('.is-invalid');
        invalidInputs.forEach(el => el.classList.remove('is-invalid'));
    }


    // --- Button Loading State ---
    setButtonLoading(buttonElement, isLoading) {
        if (!this._elementExists(buttonElement)) return;
        // Add CSS: button.is-loading { cursor: not-allowed; opacity: 0.7; position: relative; }
        //          button.is-loading::after { content: '...'; display: inline-block; margin-left: 5px; /* More advanced: use a spinner */ }
        if (isLoading) {
            buttonElement.disabled = true;
            buttonElement.classList.add('is-loading');
            if (!buttonElement.dataset.originalText) {
                buttonElement.dataset.originalText = buttonElement.textContent;
            }
            // Optionally change text (e.g., "Submitting...") - consider i18n if changing text
            // buttonElement.textContent = 'Processing...';
        } else {
            buttonElement.disabled = false;
            buttonElement.classList.remove('is-loading');
            if (buttonElement.dataset.originalText) {
                buttonElement.textContent = buttonElement.dataset.originalText;
                // delete buttonElement.dataset.originalText; // Clean up dataset
            }
        }
    }

    // --- Auth UI State ---
    displayAuthState(isLoggedIn, username) {
        const displayHeader = (showUser) => {
            if (this._elementExists(this.elements.authButtonsHeader)) this.elements.authButtonsHeader.style.display = showUser ? 'none' : 'flex';
            if (this._elementExists(this.elements.userInfoHeader)) {
                this.elements.userInfoHeader.style.display = showUser ? 'flex' : 'none';
                if (showUser && this._elementExists(this.elements.usernameDisplayHeader)) {
                    this.elements.usernameDisplayHeader.textContent = `Welcome, ${username || 'User'}!`;
                }
            }
        };

        const displayMobile = (showUser) => {
            if (this._elementExists(this.elements.authButtonsMobile)) this.elements.authButtonsMobile.style.display = showUser ? 'none' : 'flex';
            if (this._elementExists(this.elements.userInfoMobile)) {
                this.elements.userInfoMobile.style.display = showUser ? 'flex' : 'none';
                if (showUser && this._elementExists(this.elements.usernameDisplayMobile)) {
                    this.elements.usernameDisplayMobile.textContent = `Welcome, ${username || 'User'}!`;
                }
            }
        };

        if (isLoggedIn) {
            displayHeader(true);
            displayMobile(true);
        } else {
            displayHeader(false);
            displayMobile(false);
        }
    }

    // --- Binding for Internal View Logic (called by Controller during init) ---
    bindRegisterPasswordMatch(handler) {
        if (this._elementExists(this.elements.registerPassword)) {
            this.elements.registerPassword.addEventListener('input', handler);
        }
        if (this._elementExists(this.elements.registerConfirmPassword)) {
            this.elements.registerConfirmPassword.addEventListener('input', handler);
        }
    }

    bindModalCloseEvents(handler) {
        if (this._elementExists(this.elements.closeLoginModalBtn)) {
            this.elements.closeLoginModalBtn.addEventListener('click', handler);
        }
        if (this._elementExists(this.elements.closeRegisterModalBtn)) {
            this.elements.closeRegisterModalBtn.addEventListener('click', handler);
        }
        if (this._elementExists(this.elements.modalOverlay)) {
            this.elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.modalOverlay) {
                    handler();
                }
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._elementExists(this.elements.modalOverlay) && this.elements.modalOverlay.classList.contains('active')) {
                handler();
            }
        });
    }
}


/**
 * ============================================================
 * --- CONTROLLER ---
 * Handles events, updates Model, tells View what to display.
 * Connects Model and View. Calls API simulation functions.
 * ============================================================
 */
class Controller {
    // No direct reference to ApiSimulator needed if called globally,
    // but could be passed in constructor for dependency injection:
    // constructor(model, view, api) {
    //   this.model = model;
    //   this.view = view;
    //   this.api = api; // e.g., ApiSimulator object
    //   ...
    // }
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this._bindHandlerMethods();
    }

    _bindHandlerMethods() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(prop => prop.startsWith('handle') && typeof this[prop] === 'function');
        methods.forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    init() {
        console.log("Controller: Initializing...");
        this.bindEvents();
        // Set initial UI state based on Model
        this.view.displayAuthState(this.model.isUserLoggedIn(), this.model.getUsername());
        this.view.initParticles();
        this.view.initFadeInObserver(this.handleFadeInElement);
        console.log("Controller: Initialization complete.");
    }

    bindEvents() {
        // Window Scroll
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        // Mobile Menu
        if (this.view._elementExists(this.view.elements.menuToggle)) {
            this.view.elements.menuToggle.addEventListener('click', this.handleMenuToggle);
        }
        if (this.view._elementExists(this.view.elements.closeMenu)) {
            this.view.elements.closeMenu.addEventListener('click', this.handleMenuClose);
        }
        if (this.view.elements.navLinkItems) {
            this.view.elements.navLinkItems.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavLinkClick(e, link));
            });
        }

        // Back to Top
        if (this.view._elementExists(this.view.elements.backToTopButton)) {
            this.view.elements.backToTopButton.addEventListener('click', this.handleBackToTopClick);
        }

        // Smooth Scrolling (General)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href && href !== '#' && href.length > 1 && !anchor.closest('#navLinks')) { // Avoid double binding nav links
                anchor.addEventListener('click', (e) => this.handleSmoothScrollLinkClick(e, anchor));
            }
        });

        // Contact Form
        if (this.view._elementExists(this.view.elements.contactForm)) {
            this.view.elements.contactForm.addEventListener('submit', this.handleContactSubmit);
        }

        // Modal Opening
        if (this.view._elementExists(this.view.elements.loginBtnHeader)) this.view.elements.loginBtnHeader.addEventListener('click', this.handleOpenLoginModal);
        if (this.view._elementExists(this.view.elements.signupBtnHeader)) this.view.elements.signupBtnHeader.addEventListener('click', this.handleOpenRegisterModal);
        if (this.view._elementExists(this.view.elements.loginBtnMobile)) this.view.elements.loginBtnMobile.addEventListener('click', this.handleOpenLoginModal);
        if (this.view._elementExists(this.view.elements.signupBtnMobile)) this.view.elements.signupBtnMobile.addEventListener('click', this.handleOpenRegisterModal);

        // Modal Closing & Switching
        this.view.bindModalCloseEvents(this.handleCloseModal);
        if (this.view._elementExists(this.view.elements.switchToRegisterLink)) this.view.elements.switchToRegisterLink.addEventListener('click', this.handleSwitchToRegister);
        if (this.view._elementExists(this.view.elements.switchToLoginLink)) this.view.elements.switchToLoginLink.addEventListener('click', this.handleSwitchToLogin);

        // Forgot Password Flow
        if (this.view._elementExists(this.view.elements.forgotPasswordLink)) this.view.elements.forgotPasswordLink.addEventListener('click', this.handleShowForgotPassword);
        if (this.view._elementExists(this.view.elements.backToLoginLink)) this.view.elements.backToLoginLink.addEventListener('click', this.handleShowLoginFromForgot);
        if (this.view._elementExists(this.view.elements.forgotPasswordForm)) this.view.elements.forgotPasswordForm.addEventListener('submit', this.handleForgotPasswordSubmit);

        // Form Submissions
        if (this.view._elementExists(this.view.elements.loginForm)) this.view.elements.loginForm.addEventListener('submit', this.handleLoginSubmit);
        if (this.view._elementExists(this.view.elements.registerForm)) this.view.elements.registerForm.addEventListener('submit', this.handleRegisterSubmit);

        // Register Form Password Match Check
        this.view.bindRegisterPasswordMatch(this.handlePasswordMatchInput);

        // Social Login
        document.querySelectorAll('.login-google-btn').forEach(btn => btn.addEventListener('click', () => this.handleSocialLogin('Google')));
        document.querySelectorAll('.login-facebook-btn').forEach(btn => btn.addEventListener('click', () => this.handleSocialLogin('Facebook')));
        // Add more social providers as needed

        // Logout
        if (this.view._elementExists(this.view.elements.logoutBtnHeader)) this.view.elements.logoutBtnHeader.addEventListener('click', this.handleLogout);
        if (this.view._elementExists(this.view.elements.logoutBtnMobile)) this.view.elements.logoutBtnMobile.addEventListener('click', this.handleLogout);
    }

    // --- Event Handlers ---

    handleScroll() {
        const scrollY = window.scrollY;
        const docElement = document.documentElement;
        const scrollHeight = docElement.scrollHeight - docElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;

        this.view.updateHeaderScroll(scrollY > this.model.getScrollThreshold('header'));
        this.view.updateBackToTopButton(scrollY > this.model.getScrollThreshold('backToTop'));
        this.view.updateScrollIndicator(scrollPercentage);
    }

    handleMenuToggle() {
        this.view.toggleMobileMenu(!this.view.isMobileMenuOpen());
    }

    handleMenuClose() {
        this.view.toggleMobileMenu(false);
    }

    handleNavLinkClick(event, linkElement) {
        const href = linkElement.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            event.preventDefault();
            this.view.toggleMobileMenu(false);
            setTimeout(() => this.view.smoothScrollTo(href), 50);
        } else {
            this.view.toggleMobileMenu(false); // Close menu for external/page links
        }
    }

    handleSmoothScrollLinkClick(event, linkElement) {
        const href = linkElement.getAttribute('href');
        if (href && href !== '#' && href.length > 1) {
            event.preventDefault();
            this.view.smoothScrollTo(href);
        }
    }

    handleBackToTopClick(e) {
        e.preventDefault();
        this.view.scrollToTop();
    }

    handleFadeInElement(element) {
        this.view.activateFadeInElement(element);
    }

    // --- Form Submissions calling API ---

    async handleContactSubmit(e) {
        e.preventDefault();
        const form = this.view.elements.contactForm;
        const button = this.view.elements.contactSubmitBtn || form.querySelector('[type="submit"]');
        this.view.clearFormErrors(form);

        const formData = this.view.getFormValues('contactForm');
        let isValid = true;
        // Client-side validation
        if (!formData.name?.trim()) { this.view.showFieldError(this.view.elements.contactName, 'Name is required.'); isValid = false; }
        if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { this.view.showFieldError(this.view.elements.contactEmail, 'A valid email is required.'); isValid = false; }
        if (!formData.message?.trim()) { this.view.showFieldError(this.view.elements.contactMessage, 'Message cannot be empty.'); isValid = false; }

        if (!isValid) {
            this.view.showToast('Please correct the errors in the form.', 'error');
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) this.view.focusElement(firstInvalid);
            return;
        }

        this.view.setButtonLoading(button, true);
        try {
            // Call the API simulation function
            const result = await ApiSimulator.sendContactMessage(formData.name, formData.email, formData.subject, formData.message);

            if (result.success) {
                this.view.showToast('Thank you! Your message has been sent.', 'success');
                this.view.resetForm(form);
            } else {
                // Show backend error message if available
                this.view.showToast(result.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Contact form submission error (controller catch):", error);
            this.view.showToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            this.view.setButtonLoading(button, false);
        }
    }

    async handleLoginSubmit(e) {
        e.preventDefault();
        const form = this.view.elements.loginForm;
        const button = this.view.elements.loginSubmitBtn || form.querySelector('[type="submit"]');
        this.view.clearFormErrors(form);

        const formData = this.view.getFormValues('loginForm');
        let isValid = true;
        // Client-side validation
        if (!formData.email?.trim()) { this.view.showFieldError(this.view.elements.loginEmailInput, 'Email or Username is required.'); isValid = false; }
        if (!formData.password) { this.view.showFieldError(this.view.elements.loginPasswordInput, 'Password is required.'); isValid = false; }

        if (!isValid) {
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) this.view.focusElement(firstInvalid);
            return;
        }

        this.view.setButtonLoading(button, true);
        try {
            // Call the API simulation function
            const result = await ApiSimulator.login(formData.email, formData.password);

            if (result.success) {
                this.model.login(result.data.username); // Update model with username from API response
                this.view.displayAuthState(true, this.model.getUsername()); // Update UI
                this.view.closeModal();
                this.view.showToast('Login successful!', 'success');
            } else {
                // Show backend error (potentially on a specific field or as a toast)
                this.view.showFieldError(this.view.elements.loginPasswordInput, result.error || 'Login failed.');
                this.view.showToast(result.error || 'Login failed. Please check your credentials.', 'error');
                this.view.focusElement(this.view.elements.loginPasswordInput); // Focus password on error
            }
        } catch (error) {
            console.error("Login submission error (controller catch):", error);
            this.view.showToast('An unexpected error occurred during login.', 'error');
        } finally {
            this.view.setButtonLoading(button, false);
        }
    }

    async handleRegisterSubmit(e) {
        e.preventDefault();
        const form = this.view.elements.registerForm;
        const button = this.view.elements.registerSubmitBtn || form.querySelector('[type="submit"]');
        this.view.clearFormErrors(form);

        const formData = this.view.getFormValues('registerForm');
        let isValid = true;
        // Client-side validation
        if (!formData.username?.trim()) { this.view.showFieldError(this.view.elements.registerUsername, 'Username is required.'); isValid = false; }
        if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { this.view.showFieldError(this.view.elements.registerEmail, 'A valid email is required.'); isValid = false; }
        if (!formData.password || formData.password.length < 6) { this.view.showFieldError(this.view.elements.registerPassword, 'Password must be at least 6 characters.'); isValid = false; }
        if (formData.password !== formData.confirmPassword) { this.view.showFieldError(this.view.elements.registerConfirmPassword, 'Passwords do not match.'); isValid = false; }
        else { this.view.showFieldError(this.view.elements.registerConfirmPassword, null); } // Clear if they match now

        if (!isValid) {
            this.view.showToast('Please correct the errors in the form.', 'error');
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) this.view.focusElement(firstInvalid);
            return;
        }

        this.view.setButtonLoading(button, true);
        try {
            // Call the API simulation function
            const result = await ApiSimulator.register(formData.username, formData.email, formData.phone, formData.password);

            if (result.success) {
                this.model.login(result.data.username); // Login the user after successful registration
                this.view.displayAuthState(true, this.model.getUsername());
                this.view.closeModal();
                this.view.showToast('Registration successful! You are now logged in.', 'success');
            } else {
                // Show backend error (e.g., email taken)
                if (result.error && result.error.toLowerCase().includes('email')) {
                    this.view.showFieldError(this.view.elements.registerEmail, result.error);
                    this.view.focusElement(this.view.elements.registerEmail);
                } else {
                    // Generic error toast
                    this.view.showToast(result.error || 'Registration failed. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error("Register submission error (controller catch):", error);
            this.view.showToast('An unexpected error occurred during registration.', 'error');
        } finally {
            this.view.setButtonLoading(button, false);
        }
    }

    async handleForgotPasswordSubmit(e) {
        e.preventDefault();
        const form = this.view.elements.forgotPasswordForm;
        const button = this.view.elements.sendResetLinkBtn || form.querySelector('[type="submit"]');
        this.view.clearFormErrors(form);

        const formData = this.view.getFormValues('forgotPasswordForm');
        if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            this.view.showFieldError(this.view.elements.resetEmailInput, 'Please enter a valid email address.');
            this.view.focusElement(this.view.elements.resetEmailInput);
            return;
        }

        this.view.setButtonLoading(button, true);
        try {
            // Call the API simulation function
            const result = await ApiSimulator.requestPasswordReset(formData.email);

            if (result.success) {
                this.view.showToast(result.message || 'Password reset request sent.', 'info'); // Use message from API
                this.view.closeModal();
            } else {
                // Although simulation always succeeds, handle potential future failure
                this.view.showToast(result.error || 'Failed to send reset link. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Forgot password submission error (controller catch):", error);
            this.view.showToast('An unexpected error occurred.', 'error');
        } finally {
            this.view.setButtonLoading(button, false);
        }
    }

    async handleSocialLogin(provider) {
        // Optionally show a general loading state or disable buttons
        console.log(`Controller: Initiating ${provider} login flow...`);
        // In a real app, this might trigger an SDK popup/redirect.
        // We'll just directly call the API simulation here.

        try {
            // Call the API simulation function
            const result = await ApiSimulator.socialLogin(provider);

            if (result.success) {
                this.model.login(result.data.username);
                this.view.displayAuthState(true, this.model.getUsername());
                this.view.closeModal(); // Close any modal that might be open
                this.view.showToast(`Successfully logged in with ${provider}!`, 'success');
            } else {
                this.view.showToast(result.error || `Failed to log in with ${provider}.`, 'error');
            }
        } catch (error) {
            console.error(`${provider} login error (controller catch):`, error);
            this.view.showToast(`An unexpected error occurred during ${provider} login.`, 'error');
        } finally {
            // Hide general loading state if implemented
        }
    }

    async handleLogout() {
        console.log('Controller: Initiating logout...');
        // Optionally show some loading state? Usually not needed for logout.

        try {
            // Call the API simulation function (even if it does little, represents server interaction)
            const result = await ApiSimulator.logout();

            if (result.success) {
                this.model.logout(); // Update client-side state
                this.view.displayAuthState(false, null); // Update UI
                // this.view.closeModal(); // Close modals just in case
                // this.view.toggleMobileMenu(false); // Close menu if open
                this.view.showToast('You have been logged out.', 'info');
            } else {
                // Handle unlikely logout failure from backend
                this.view.showToast('Logout failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Logout error (controller catch):", error);
            this.view.showToast('An error occurred during logout.', 'error');
        } finally {
            // Hide loading state if any
        }
    }


    // --- Modal Management Handlers ---
    handleOpenLoginModal() { this.view.openModal(this.view.elements.loginModal); }
    handleOpenRegisterModal() { this.view.openModal(this.view.elements.registerModal); }
    handleCloseModal() { this.view.closeModal(); }

    _switchModal(targetModalElement) {
        this.view.closeModal();
        setTimeout(() => {
            if (targetModalElement === this.view.elements.registerModal) this.handleOpenRegisterModal();
            else if (targetModalElement === this.view.elements.loginModal) this.handleOpenLoginModal();
        }, 150); // Allow close transition
    }

    handleSwitchToRegister(e) { e.preventDefault(); this._switchModal(this.view.elements.registerModal); }
    handleSwitchToLogin(e) { e.preventDefault(); this._switchModal(this.view.elements.loginModal); }
    handleShowForgotPassword(e) { e.preventDefault(); this.view.showForgotPasswordView(); }
    handleShowLoginFromForgot(e) { e.preventDefault(); this.view.showLoginFormView(); }

    // --- Real-time Validation Handler ---
    handlePasswordMatchInput() {
        const password = this.view.elements.registerPassword?.value ?? '';
        const confirmPassword = this.view.elements.registerConfirmPassword?.value ?? '';

        if (confirmPassword !== '') { // Only validate if confirm field has input
            if (password !== confirmPassword) {
                this.view.showFieldError(this.view.elements.registerConfirmPassword, 'Passwords do not match.');
            } else {
                this.view.showFieldError(this.view.elements.registerConfirmPassword, null); // Clear error
            }
        } else {
            this.view.showFieldError(this.view.elements.registerConfirmPassword, null); // Clear error if empty
        }
    }
}


// --- Application Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded. Initializing Application...");
    // Ensure API simulator is available (it's defined globally in script-api.js)
    if (typeof ApiSimulator === 'undefined') {
        console.error("API Simulator script not loaded or failed!");
        document.body.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Error: Failed to load API simulation module.</p>';
        return;
    }

    try {
        const appModel = new Model();
        const appView = new View();
        const appController = new Controller(appModel, appView); // Pass ApiSimulator here if using dependency injection
        appController.init(); // Start the application
        console.log("Application Initialized Successfully.");
    } catch (error) {
        console.error("Application initialization failed:", error);
        document.body.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">An error occurred while loading the application. Please try refreshing the page.</p>';
    }
});

// --- END OF script-ui.js ---