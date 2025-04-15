// --- START OF REFACTORED script.js (OOP MVC) ---

/**
 * ============================================================
 * --- MODEL ---
 * Manages application state and data.
 * Does not interact with the DOM.
 * ============================================================
 */
class Model {
    #isLoggedIn = false; // Private field for encapsulation
    #username = null;
    #scrollThresholds = {
        header: 50,
        backToTop: 300
    };

    login(userIdentifier) {
        this.#isLoggedIn = true;
        // Simulate deriving username (e.g., from email or provided name)
        this.#username = userIdentifier ? (userIdentifier.includes('@') ? userIdentifier.split('@')[0] : userIdentifier) : 'User';
        console.log("Model: State updated to Logged In. User:", this.#username);
    }

    logout() {
        this.#isLoggedIn = false;
        this.#username = null;
        console.log("Model: State updated to Logged Out.");
    }

    isUserLoggedIn() {
        return this.#isLoggedIn;
    }

    getUsername() {
        return this.#username;
    }

    getScrollThreshold(key) {
        return this.#scrollThresholds[key];
    }
}

/**
 * ============================================================
 * --- VIEW ---
 * Handles all DOM interactions and UI updates.
 * Is instructed by the Controller.
 * ============================================================
 */
class View {
    // --- Element Selectors (Cached in Constructor) ---
    elements = {};

    constructor() {
        this._cacheDOMElements();
    }

    _cacheDOMElements() {
        this.elements = {
            // Mobile Menu
            menuToggle: document.getElementById('menuToggle'),
            navLinks: document.getElementById('navLinks'),
            closeMenu: document.getElementById('closeMenu'),
            navLinkItems: document.querySelectorAll('.nav-links a'),
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
            // Contact Form
            contactForm: document.getElementById('contactForm'),
            contactName: document.getElementById('name'),
            contactEmail: document.getElementById('email'),
            contactSubject: document.getElementById('subject'),
            contactMessage: document.getElementById('message'),
            // Modals & Overlays
            modalOverlay: document.getElementById('modalOverlay'),
            loginModal: document.getElementById('loginModal'),
            registerModal: document.getElementById('registerModal'),
            // Header Auth/User Info
            loginBtnHeader: document.getElementById('loginBtnHeader'),
            signupBtnHeader: document.getElementById('signupBtnHeader'),
            authButtonsContainer: document.getElementById('authButtons'),
            userInfoContainer: document.getElementById('userInfo'),
            usernameDisplay: document.getElementById('usernameDisplay'),
            logoutBtn: document.getElementById('logoutBtn'),
            // Modal Internals
            closeLoginModalBtn: document.getElementById('closeLoginModal'),
            closeRegisterModalBtn: document.getElementById('closeRegisterModal'),
            switchToRegisterLink: document.getElementById('switchToRegister'),
            switchToLoginLink: document.getElementById('switchToLogin'),
            // Forms
            loginForm: document.getElementById('loginForm'),
            loginEmailInput: document.getElementById('loginEmail'), // Specific input needed
            loginPasswordInput: document.getElementById('loginPassword'), // Specific input needed
            registerForm: document.getElementById('registerForm'),
            forgotPasswordForm: document.getElementById('forgotPasswordForm'),
            forgotPasswordLink: document.getElementById('forgotPasswordLink'),
            backToLoginLink: document.getElementById('backToLoginLink'),
            sendResetLinkBtn: document.getElementById('sendResetLinkBtn'),
            resetEmailInput: document.getElementById('resetEmailInput'),
            // Register Form Inputs
            registerUsername: document.getElementById('registerUsername'),
            registerEmail: document.getElementById('registerEmail'),
            registerPhone: document.getElementById('registerPhone'),
            registerPassword: document.getElementById('registerPassword'),
            registerConfirmPassword: document.getElementById('registerConfirmPassword'),
            passwordMatchError: document.getElementById('passwordMatchError'),
            // Social Login Buttons
            loginGoogleBtn: document.getElementById('loginGoogleBtn'),
            loginFacebookBtn: document.getElementById('loginFacebookBtn'),
            // Cloned Mobile Elements (will be populated if needed)
            authButtonsMobile: null,
            userInfoMobile: null,
            usernameDisplayMobile: null,
            logoutBtnMobile: null
        };
        // Add a check for critical elements
        if (!this.elements.navLinks || !this.elements.modalOverlay) {
            console.warn("View: Core elements like navLinks or modalOverlay not found!");
        }
    }

    // Helper to check if an element exists before trying to use it
    _elementExists(elementRef) {
        return elementRef !== null && typeof elementRef !== 'undefined';
    }

    // --- UI Update Methods ---
    toggleMobileMenu(show) {
        if (this._elementExists(this.elements.navLinks)) {
            this.elements.navLinks.classList.toggle('active', show);
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
            const headerOffset = this._elementExists(this.elements.header) ? this.elements.header.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset - 20; // Adjust as needed

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            console.warn(`View: Element with selector "${selector}" not found for smooth scrolling.`);
        }
    }

    initFadeInObserver(callback) {
        if (this.elements.fadeInElements && this.elements.fadeInElements.length > 0 && typeof IntersectionObserver !== 'undefined') {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            const scrollObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback(entry.target); // Notify controller
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            this.elements.fadeInElements.forEach(el => scrollObserver.observe(el));
        }
    }

    activateFadeInElement(element) {
        element.classList.add('active');
    }

    initParticles() {
        if (typeof particlesJS === 'function' && this._elementExists(this.elements.particlesJsContainer)) {
            particlesJS('particles-js', { /* --- Paste original particlesJS config here --- */
                "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true
            });
        } else if (!this._elementExists(this.elements.particlesJsContainer)) {
            console.warn("View: 'particles-js' element not found.");
        } else {
            console.warn("View: particles.js library not loaded.");
        }
    }

    resetForm(formElement) {
        if (this._elementExists(formElement)) formElement.reset();
    }

    getFormValues(formId) {
        const values = {};
        const formElement = this.elements[formId];
        if (!this._elementExists(formElement)) {
            console.error(`View: Cannot get values, form with ID "${formId}" not found in cached elements.`);
            return values;
        }

        switch(formId) {
            case 'contactForm':
                if(this._elementExists(this.elements.contactName)) values.name = this.elements.contactName.value;
                if(this._elementExists(this.elements.contactEmail)) values.email = this.elements.contactEmail.value;
                if(this._elementExists(this.elements.contactSubject)) values.subject = this.elements.contactSubject.value;
                if(this._elementExists(this.elements.contactMessage)) values.message = this.elements.contactMessage.value;
                break;
            case 'loginForm':
                // Use the specifically cached inputs
                if(this._elementExists(this.elements.loginEmailInput)) values.emailOrUsername = this.elements.loginEmailInput.value;
                if(this._elementExists(this.elements.loginPasswordInput)) values.password = this.elements.loginPasswordInput.value;
                break;
            case 'registerForm':
                if(this._elementExists(this.elements.registerUsername)) values.username = this.elements.registerUsername.value;
                if(this._elementExists(this.elements.registerEmail)) values.email = this.elements.registerEmail.value;
                if(this._elementExists(this.elements.registerPhone)) values.phone = this.elements.registerPhone.value;
                if(this._elementExists(this.elements.registerPassword)) values.password = this.elements.registerPassword.value;
                if(this._elementExists(this.elements.registerConfirmPassword)) values.confirmPassword = this.elements.registerConfirmPassword.value;
                break;
            case 'forgotPasswordForm':
                if(this._elementExists(this.elements.resetEmailInput)) values.email = this.elements.resetEmailInput.value;
                break;
            default:
                console.warn(`View: getFormValues called for unknown form ID "${formId}"`);
        }
        return values;
    }

    showAlert(message) {
        alert(message); // Keep original alert behavior
    }

    // --- Modal Management ---
    openModal(modalElement) {
        if (!this._elementExists(modalElement) || !this._elementExists(this.elements.modalOverlay)) return;
        this.elements.modalOverlay.classList.add('active');
        modalElement.classList.add('active');
        // Reset internal form states if opening login modal
        if (modalElement === this.elements.loginModal) {
            this.showLoginForm(true); // Ensure login form is default
        }
    }

    closeModal() {
        if (!this._elementExists(this.elements.modalOverlay)) return;
        this.elements.modalOverlay.classList.remove('active');
        if (this._elementExists(this.elements.loginModal)) this.elements.loginModal.classList.remove('active');
        if (this._elementExists(this.elements.registerModal)) this.elements.registerModal.classList.remove('active');
        this.showPasswordMatchError(false); // Hide error on close
        this.showLoginForm(true); // Ensure login form is visible next time login modal opens
    }

    showLoginForm(show) {
        if (this._elementExists(this.elements.loginForm)) this.elements.loginForm.style.display = show ? 'block' : 'none';
        if (this._elementExists(this.elements.forgotPasswordForm)) this.elements.forgotPasswordForm.style.display = show ? 'none' : 'block';
    }

    showPasswordMatchError(show) {
        if (this._elementExists(this.elements.passwordMatchError)) {
            this.elements.passwordMatchError.style.display = show ? 'block' : 'none';
        }
    }

    focusElement(element) {
        if(this._elementExists(element)) element.focus();
    }

    // --- Auth UI State ---
    displayLoggedInState(username) {
        if (this._elementExists(this.elements.authButtonsContainer)) this.elements.authButtonsContainer.style.display = 'none';
        if (this._elementExists(this.elements.userInfoContainer)) {
            this.elements.userInfoContainer.style.display = 'flex';
            if (this._elementExists(this.elements.usernameDisplay)) this.elements.usernameDisplay.textContent = `Welcome, ${username}!`;
        }
        // Mobile menu update will be triggered by Controller if menu is open
    }

    displayLoggedOutState() {
        if (this._elementExists(this.elements.userInfoContainer)) this.elements.userInfoContainer.style.display = 'none';
        if (this._elementExists(this.elements.authButtonsContainer)) this.elements.authButtonsContainer.style.display = 'flex';
        // Mobile menu update will be triggered by Controller if menu is open
    }

    // --- Mobile Menu Auth Elements Handling ---
    // This method ensures the elements are created/cloned if needed
    // It requires the CONTROLLER'S event handlers to attach to the new buttons
    _ensureMobileAuthElements(handlers) {
        if (!this._elementExists(this.elements.navLinks)) return; // Need navLinks to append to

        // --- Clone Auth Buttons (Login/Signup) ---
        if (!this.elements.authButtonsMobile && this._elementExists(this.elements.authButtonsContainer)) {
            this.elements.authButtonsMobile = this.elements.authButtonsContainer.cloneNode(true);
            this.elements.authButtonsMobile.id = ''; // Avoid duplicate IDs
            this.elements.authButtonsMobile.className = 'auth-buttons-mobile'; // Use class for styling
            // Apply mobile styles
            Object.assign(this.elements.authButtonsMobile.style, {
                display: 'flex', flexDirection: 'column', marginTop: '2rem',
                width: '80%', alignItems: 'center'
            });

            const mobileLoginBtn = this.elements.authButtonsMobile.querySelector('button[id^="loginBtnHeader"]');
            const mobileSignupBtn = this.elements.authButtonsMobile.querySelector('button[id^="signupBtnHeader"]');

            if(mobileLoginBtn) {
                mobileLoginBtn.id = 'loginBtnHeaderMobile'; // Unique ID for mobile
                mobileLoginBtn.style.marginBottom = '1rem';
                // Attach Controller's handler
                if (handlers.openLoginModal) {
                    mobileLoginBtn.addEventListener('click', handlers.openLoginModal);
                } else { console.warn("View: Missing openLoginModal handler for mobile button.");}
            }
            if(mobileSignupBtn) {
                mobileSignupBtn.id = 'signupBtnHeaderMobile'; // Unique ID for mobile
                mobileSignupBtn.style.marginBottom = '1rem';
                // Attach Controller's handler
                if (handlers.openRegisterModal) {
                    mobileSignupBtn.addEventListener('click', handlers.openRegisterModal);
                } else { console.warn("View: Missing openRegisterModal handler for mobile button.");}
            }
            this.elements.navLinks.appendChild(this.elements.authButtonsMobile);
        }

        // --- Clone User Info (Welcome/Logout) ---
        if (!this.elements.userInfoMobile && this._elementExists(this.elements.userInfoContainer)) {
            this.elements.userInfoMobile = this.elements.userInfoContainer.cloneNode(true);
            this.elements.userInfoMobile.id = ''; // Avoid duplicate IDs
            this.elements.userInfoMobile.className = 'user-info-mobile'; // Use class for styling
            // Apply mobile styles
            Object.assign(this.elements.userInfoMobile.style, {
                display: 'flex', flexDirection: 'column', marginTop: '2rem',
                width: '80%', alignItems: 'center'
            });

            this.elements.usernameDisplayMobile = this.elements.userInfoMobile.querySelector('span');
            if(this._elementExists(this.elements.usernameDisplayMobile)) {
                this.elements.usernameDisplayMobile.id = 'usernameDisplayMobile'; // Unique ID
                Object.assign(this.elements.usernameDisplayMobile.style, {
                    marginBottom: '1rem', display: 'block', textAlign: 'center'
                });
            }

            this.elements.logoutBtnMobile = this.elements.userInfoMobile.querySelector('button');
            if(this._elementExists(this.elements.logoutBtnMobile)) {
                this.elements.logoutBtnMobile.id = 'logoutBtnMobile'; // Unique ID
                this.elements.logoutBtnMobile.style.width = '100%';
                // Attach Controller's handler
                if (handlers.logout) {
                    this.elements.logoutBtnMobile.addEventListener('click', handlers.logout);
                } else { console.warn("View: Missing logout handler for mobile button."); }
            }
            this.elements.navLinks.appendChild(this.elements.userInfoMobile);
        }
    }

    // Updates the visibility of auth elements within the mobile menu
    updateMobileMenuAuthState(isLoggedIn, username, handlers) {
        // Ensure elements exist first, passing handlers needed for potential cloning
        this._ensureMobileAuthElements(handlers);

        // Now update visibility based on login state
        if (this._elementExists(this.elements.authButtonsMobile)) {
            this.elements.authButtonsMobile.style.display = isLoggedIn ? 'none' : 'flex';
        }
        if (this._elementExists(this.elements.userInfoMobile)) {
            this.elements.userInfoMobile.style.display = isLoggedIn ? 'flex' : 'none';
            if (isLoggedIn && this._elementExists(this.elements.usernameDisplayMobile)) {
                // Use the provided username for display
                this.elements.usernameDisplayMobile.textContent = `Welcome, ${username}!`;
            }
        }
    }


    // --- Binding for Internal View Logic (called by Controller during init) ---
    // Binds events that primarily affect the view itself, like password matching feedback
    bindRegisterPasswordMatch(handler) {
        if (this._elementExists(this.elements.registerConfirmPassword)) {
            this.elements.registerConfirmPassword.addEventListener('input', handler);
        }
        if (this._elementExists(this.elements.registerPassword)) {
            this.elements.registerPassword.addEventListener('input', handler); // Check on original password change too
        }
    }

    // Bind handlers for modal close buttons and overlay click
    bindModalCloseEvents(handler) {
        if (this._elementExists(this.elements.closeLoginModalBtn)) {
            this.elements.closeLoginModalBtn.addEventListener('click', handler);
        }
        if (this._elementExists(this.elements.closeRegisterModalBtn)) {
            this.elements.closeRegisterModalBtn.addEventListener('click', handler);
        }
        if (this._elementExists(this.elements.modalOverlay)) {
            this.elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.modalOverlay) { // Only close if clicking overlay itself
                    handler();
                }
            });
        }
    }
}


/**
 * ============================================================
 * --- CONTROLLER ---
 * Handles events, updates Model, tells View what to display.
 * Connects Model and View.
 * ============================================================
 */
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Pre-bind 'this' for event handlers to ensure correct context
        this.handleScroll = this.handleScroll.bind(this);
        this.handleMenuToggle = this.handleMenuToggle.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleMobileNavClick = this.handleMobileNavClick.bind(this);
        this.handleBackToTopClick = this.handleBackToTopClick.bind(this);
        this.handleSmoothScrollClick = this.handleSmoothScrollClick.bind(this);
        this.handleFadeInElement = this.handleFadeInElement.bind(this);
        this.handleContactSubmit = this.handleContactSubmit.bind(this);
        this.handleOpenLoginModal = this.handleOpenLoginModal.bind(this);
        this.handleOpenRegisterModal = this.handleOpenRegisterModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSwitchToRegister = this.handleSwitchToRegister.bind(this);
        this.handleSwitchToLogin = this.handleSwitchToLogin.bind(this);
        this.handleShowForgotPassword = this.handleShowForgotPassword.bind(this);
        this.handleShowLoginFromForgot = this.handleShowLoginFromForgot.bind(this);
        this.handleForgotPasswordSubmit = this.handleForgotPasswordSubmit.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
        this.handlePasswordMatchInput = this.handlePasswordMatchInput.bind(this);
        this.handleSocialLogin = this.handleSocialLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        // Store handlers needed for mobile element cloning/binding
        this.mobileAuthEventHandlers = {
            openLoginModal: this.handleOpenLoginModal,
            openRegisterModal: this.handleOpenRegisterModal,
            logout: this.handleLogout
        };
    }

    init() {
        console.log("Controller: Initializing...");
        this.bindEvents();

        // Set initial UI state based on Model
        this._updateAuthStateUI(); // Use helper to update both header and potentially mobile menu

        // Initialize other view features
        this.view.initParticles();
        this.view.initFadeInObserver(this.handleFadeInElement);
        console.log("Controller: Initialization complete.");
    }

    // Helper to update auth UI in both header and mobile menu (if open)
    _updateAuthStateUI() {
        if (this.model.isUserLoggedIn()) {
            this.view.displayLoggedInState(this.model.getUsername());
            if (this.view.isMobileMenuOpen()) {
                this.view.updateMobileMenuAuthState(true, this.model.getUsername(), this.mobileAuthEventHandlers);
            }
        } else {
            this.view.displayLoggedOutState();
            if (this.view.isMobileMenuOpen()) {
                this.view.updateMobileMenuAuthState(false, null, this.mobileAuthEventHandlers);
            }
        }
    }


    bindEvents() {
        // --- Window Scroll Events ---
        window.addEventListener('scroll', this.handleScroll);

        // --- Mobile Menu ---
        if (this.view._elementExists(this.view.elements.menuToggle)) {
            this.view.elements.menuToggle.addEventListener('click', this.handleMenuToggle);
        }
        if (this.view._elementExists(this.view.elements.closeMenu)) {
            this.view.elements.closeMenu.addEventListener('click', this.handleMenuClose);
        }
        if (this.view.elements.navLinkItems && this.view.elements.navLinkItems.length > 0) {
            this.view.elements.navLinkItems.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#') && href.length > 1) { // Internal nav links
                    link.addEventListener('click', (e) => this.handleMobileNavClick(e, link)); // Pass event and link
                }
            });
        }

        // --- Back to Top ---
        if (this.view._elementExists(this.view.elements.backToTopButton)) {
            this.view.elements.backToTopButton.addEventListener('click', this.handleBackToTopClick);
        }

        // --- Smooth Scrolling for any relevant # link ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            // Ensure it's not just "#" and not handled by mobile nav click already (though harmless redundancy is okay here)
            if (href && href !== '#' && href.length > 1) {
                anchor.addEventListener('click', (e) => this.handleSmoothScrollClick(e, anchor));
            }
        });


        // --- Contact Form ---
        if (this.view._elementExists(this.view.elements.contactForm)) {
            this.view.elements.contactForm.addEventListener('submit', this.handleContactSubmit);
        }

        // --- Modal Opening (Header Buttons) ---
        if (this.view._elementExists(this.view.elements.loginBtnHeader)) {
            this.view.elements.loginBtnHeader.addEventListener('click', this.handleOpenLoginModal);
        }
        if (this.view._elementExists(this.view.elements.signupBtnHeader)) {
            this.view.elements.signupBtnHeader.addEventListener('click', this.handleOpenRegisterModal);
        }

        // --- Modal Closing (Using View's internal binding) ---
        this.view.bindModalCloseEvents(this.handleCloseModal);

        // --- Modal Switching ---
        if (this.view._elementExists(this.view.elements.switchToRegisterLink)) {
            this.view.elements.switchToRegisterLink.addEventListener('click', this.handleSwitchToRegister);
        }
        if (this.view._elementExists(this.view.elements.switchToLoginLink)) {
            this.view.elements.switchToLoginLink.addEventListener('click', this.handleSwitchToLogin);
        }

        // --- Forgot Password Flow ---
        if (this.view._elementExists(this.view.elements.forgotPasswordLink)) {
            this.view.elements.forgotPasswordLink.addEventListener('click', this.handleShowForgotPassword);
        }
        if (this.view._elementExists(this.view.elements.backToLoginLink)) {
            this.view.elements.backToLoginLink.addEventListener('click', this.handleShowLoginFromForgot);
        }
        if (this.view._elementExists(this.view.elements.forgotPasswordForm)) {
            this.view.elements.forgotPasswordForm.addEventListener('submit', this.handleForgotPasswordSubmit);
        }

        // --- Form Submissions ---
        if (this.view._elementExists(this.view.elements.loginForm)) {
            this.view.elements.loginForm.addEventListener('submit', this.handleLoginSubmit);
        }
        if (this.view._elementExists(this.view.elements.registerForm)) {
            this.view.elements.registerForm.addEventListener('submit', this.handleRegisterSubmit);
        }

        // --- Register Form Password Match Check (Using View's internal binding) ---
        this.view.bindRegisterPasswordMatch(this.handlePasswordMatchInput);

        // --- Social Login ---
        if (this.view._elementExists(this.view.elements.loginGoogleBtn)) {
            this.view.elements.loginGoogleBtn.addEventListener('click', () => this.handleSocialLogin('Google'));
        }
        if (this.view._elementExists(this.view.elements.loginFacebookBtn)) {
            this.view.elements.loginFacebookBtn.addEventListener('click', () => this.handleSocialLogin('Facebook'));
        }

        // --- Logout ---
        if (this.view._elementExists(this.view.elements.logoutBtn)) {
            this.view.elements.logoutBtn.addEventListener('click', this.handleLogout);
        }
        // Note: Logout handler for mobile button is attached dynamically by View._ensureMobileAuthElements
    }

    // --- Event Handlers ---

    handleScroll() {
        const scrollY = window.scrollY;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        // Header
        this.view.updateHeaderScroll(scrollY > this.model.getScrollThreshold('header'));
        // Back to Top
        this.view.updateBackToTopButton(scrollY > this.model.getScrollThreshold('backToTop'));
        // Scroll Indicator
        this.view.updateScrollIndicator(scrollPercentage);
    }

    handleMenuToggle() {
        this.view.toggleMobileMenu(true);
        // Crucial: Update mobile auth state *after* menu is shown
        this.view.updateMobileMenuAuthState(this.model.isUserLoggedIn(), this.model.getUsername(), this.mobileAuthEventHandlers);
    }

    handleMenuClose() {
        this.view.toggleMobileMenu(false);
    }

    handleMobileNavClick(event, linkElement) {
        const href = linkElement.getAttribute('href');
        // Only prevent default and scroll smoothly for internal section links
        if (href && href.startsWith('#') && href.length > 1) {
            event.preventDefault(); // Prevent default jump for section links
            this.view.toggleMobileMenu(false); // Close menu first
            // Use setTimeout to allow menu closing animation before scrolling
            setTimeout(() => this.view.smoothScrollTo(href), 50);
        } else {
            // Allow default behavior for external links, but still close menu
            this.view.toggleMobileMenu(false);
        }
    }

    handleBackToTopClick(e) {
        e.preventDefault();
        this.view.scrollToTop();
    }

    handleSmoothScrollClick(e, anchorElement) {
        const href = anchorElement.getAttribute('href');
        // Double check it's a valid internal link (excluding plain '#')
        if (href && href !== '#' && href.length > 1) {
            e.preventDefault(); // Prevent default jump
            // Check if mobile menu is open, close it if needed before scrolling
            if(this.view.isMobileMenuOpen()) {
                this.view.toggleMobileMenu(false);
                setTimeout(() => this.view.smoothScrollTo(href), 50); // Delay scroll slightly
            } else {
                this.view.smoothScrollTo(href);
            }
        }
    }

    handleFadeInElement(element) {
        this.view.activateFadeInElement(element);
    }

    handleContactSubmit(e) {
        e.preventDefault();
        const formData = this.view.getFormValues('contactForm');
        // Basic check if needed
        if (!formData.name || !formData.email || !formData.message) {
            this.view.showAlert('Please fill in Name, Email, and Message.');
            return;
        }
        console.log('Contact Form Data:', formData);
        this.view.showAlert('Thank you for your message! We will get back to you soon.');
        this.view.resetForm(this.view.elements.contactForm);
        // TODO: Add actual backend submission logic here
    }

    handleOpenLoginModal() {
        this.view.openModal(this.view.elements.loginModal);
    }

    handleOpenRegisterModal() {
        this.view.openModal(this.view.elements.registerModal);
    }

    handleCloseModal() {
        this.view.closeModal();
    }

    _switchModal(targetModalElement) {
        this.view.closeModal();
        setTimeout(() => this.view.openModal(targetModalElement), 150); // Delay for transition
    }

    handleSwitchToRegister(e) {
        e.preventDefault();
        this._switchModal(this.view.elements.registerModal);
    }

    handleSwitchToLogin(e) {
        e.preventDefault();
        this._switchModal(this.view.elements.loginModal);
    }

    handleShowForgotPassword(e) {
        e.preventDefault();
        this.view.showLoginForm(false); // Hide login, show forgot
    }

    handleShowLoginFromForgot(e) {
        e.preventDefault();
        this.view.showLoginForm(true); // Hide forgot, show login
    }

    handleForgotPasswordSubmit(e) {
        e.preventDefault();
        const formData = this.view.getFormValues('forgotPasswordForm');
        if (!formData.email) {
            this.view.showAlert('Please enter your email address.');
            this.view.focusElement(this.view.elements.resetEmailInput);
            return;
        }
        console.log('Simulating sending password reset link to:', formData.email);
        // --- !!! BACKEND REQUIRED HERE !!! ---
        this.view.showAlert(`Password reset link simulation: An email has been sent to ${formData.email} with instructions.`);
        this.view.closeModal();
        this.view.resetForm(this.view.elements.forgotPasswordForm);
    }

    handleLoginSubmit(e) {
        e.preventDefault();
        const formData = this.view.getFormValues('loginForm');
        if (!formData.emailOrUsername || !formData.password) {
            this.view.showAlert('Please enter both email/username and password.');
            return;
        }
        console.log('Simulating login attempt for:', formData.emailOrUsername);
        // --- !!! BACKEND REQUIRED HERE for actual validation !!! ---
        // Simulate success
        this.view.showAlert('Login successful (simulation)!');
        this.model.login(formData.emailOrUsername); // Update model state
        this.view.closeModal();
        this._updateAuthStateUI(); // Update UI everywhere
        this.view.resetForm(this.view.elements.loginForm);
    }

    handleRegisterSubmit(e) {
        e.preventDefault();
        const formData = this.view.getFormValues('registerForm');

        // Basic validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            this.view.showAlert('Please fill in all required fields.');
            return;
        }

        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            this.view.showPasswordMatchError(true);
            this.view.focusElement(this.view.elements.registerConfirmPassword);
            return; // Stop submission
        }
        // Ensure error is hidden if they match (might have been shown before)
        this.view.showPasswordMatchError(false);


        console.log('Simulating registration for:', { username: formData.username, email: formData.email, phone: formData.phone });
        // --- !!! BACKEND REQUIRED HERE for actual registration !!! ---
        // Simulate success and immediate login
        this.view.showAlert('Registration successful (simulation)! You are now logged in.');
        this.model.login(formData.username); // Update model state
        this.view.closeModal();
        this._updateAuthStateUI(); // Update UI everywhere
        this.view.resetForm(this.view.elements.registerForm);
    }

    // Handler passed to the view for password input events
    handlePasswordMatchInput() {
        // Get current values directly from view elements for real-time check
        const password = this.view.elements.registerPassword ? this.view.elements.registerPassword.value : '';
        const confirmPassword = this.view.elements.registerConfirmPassword ? this.view.elements.registerConfirmPassword.value : '';

        // Only show error if confirm password field is not empty and passwords don't match
        const showError = confirmPassword !== '' && password !== confirmPassword;
        this.view.showPasswordMatchError(showError);
    }

    handleSocialLogin(provider) {
        console.log(`Simulating Login with ${provider}...`);
        // --- !!! BACKEND & OAuth/SDK REQUIRED HERE !!! ---
        this.view.showAlert(`Simulating ${provider} Login. This requires server-side integration.`);
        // Simulate success
        this.model.login(`${provider} User`);
        this.view.closeModal();
        this._updateAuthStateUI(); // Update UI everywhere
    }

    handleLogout() {
        console.log('Simulating logout...');
        // --- !!! BACKEND REQUIRED HERE to invalidate session/token !!! ---
        this.view.showAlert('Logged out (simulation)!');
        this.model.logout(); // Update model state
        this._updateAuthStateUI(); // Update UI everywhere
        this.view.closeModal(); // Close any open auth modal
        // Ensure mobile menu closes if the logout was triggered from there
        if(this.view.isMobileMenuOpen()) {
            this.view.toggleMobileMenu(false);
        }
    }
}


// --- Application Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const appModel = new Model();
    const appView = new View();
    const appController = new Controller(appModel, appView);

    appController.init(); // Start the application
});

// --- END OF REFACTORED script.js (OOP MVC) ---