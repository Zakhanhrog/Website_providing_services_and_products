// // --- START OF REFACTORED script_before.js (OOP MVC - Enhanced) ---
//
// /**
//  * ============================================================
//  * --- MODEL ---
//  * Manages application state and data.
//  * Does not interact with the DOM.
//  * ============================================================
//  */
// class Model {
//     #isLoggedIn = false; // Private field for encapsulation
//     #username = null;
//     #scrollThresholds = {
//         header: 50,
//         backToTop: 300
//     };
//     #authStateChecked = false; // Flag to check if initial auth state was checked (e.g., from localStorage/session)
//
//     constructor() {
//         // TODO: Check initial login state from localStorage/sessionStorage or a token
//         // Example:
//         // const storedUser = localStorage.getItem('loggedInUser');
//         // if (storedUser) {
//         //     this.login(storedUser);
//         // }
//         // this.#authStateChecked = true;
//     }
//
//
//     login(userIdentifier) {
//         this.#isLoggedIn = true;
//         this.#username = userIdentifier ? (userIdentifier.includes('@') ? userIdentifier.split('@')[0] : userIdentifier) : 'User';
//         console.log("Model: State updated to Logged In. User:", this.#username);
//         // TODO: Store login state (e.g., localStorage.setItem('loggedInUser', this.#username))
//     }
//
//     logout() {
//         this.#isLoggedIn = false;
//         this.#username = null;
//         console.log("Model: State updated to Logged Out.");
//         // TODO: Remove stored login state (e.g., localStorage.removeItem('loggedInUser'))
//     }
//
//     isUserLoggedIn() {
//         return this.#isLoggedIn;
//     }
//
//     getUsername() {
//         return this.#username;
//     }
//
//     getScrollThreshold(key) {
//         return this.#scrollThresholds[key];
//     }
//
//     hasCheckedInitialAuthState() {
//         return this.#authStateChecked;
//     }
// }
//
// /**
//  * ============================================================
//  * --- VIEW ---
//  * Handles all DOM interactions and UI updates.
//  * Is instructed by the Controller.
//  * ============================================================
//  */
// class View {
//     // --- Element Selectors (Cached in Constructor) ---
//     elements = {};
//     #toastTimeout = null; // Store timeout ID for toast
//
//     constructor() {
//         this._cacheDOMElements();
//         this._createToastContainer(); // Ensure toast container exists
//     }
//
//     _cacheDOMElements() {
//         this.elements = {
//             // General
//             body: document.body,
//             // Mobile Menu
//             menuToggle: document.getElementById('menuToggle'),
//             navLinks: document.getElementById('navLinks'),
//             closeMenu: document.getElementById('closeMenu'),
//             navLinkItems: document.querySelectorAll('#navLinks a'), // More specific selector
//             // Header
//             header: document.getElementById('header'),
//             // Back to Top
//             backToTopButton: document.getElementById('backToTop'),
//             // Scroll Indicator
//             scrollIndicator: document.getElementById('scrollIndicator'),
//             // Fade In Elements
//             fadeInElements: document.querySelectorAll('.fade-in'),
//             // Particles Container
//             particlesJsContainer: document.getElementById('particles-js'),
//
//             // --- Modals & Overlay ---
//             modalOverlay: document.getElementById('modalOverlay'),
//             loginModal: document.getElementById('loginModal'), // Add role="dialog", aria-modal="true", aria-labelledby="loginModalTitle" in HTML
//             registerModal: document.getElementById('registerModal'), // Add role="dialog", aria-modal="true", aria-labelledby="registerModalTitle" in HTML
//             closeLoginModalBtn: document.getElementById('closeLoginModal'),
//             closeRegisterModalBtn: document.getElementById('closeRegisterModal'),
//             // Modal Switching Links
//             switchToRegisterLink: document.getElementById('switchToRegister'),
//             switchToLoginLink: document.getElementById('switchToLogin'),
//             // Forgot Password Flow
//             forgotPasswordLink: document.getElementById('forgotPasswordLink'),
//             backToLoginLink: document.getElementById('backToLoginLink'),
//
//             // --- Forms ---
//             // Contact Form
//             contactForm: document.getElementById('contactForm'),
//             contactName: document.getElementById('name'),
//             contactEmail: document.getElementById('email'),
//             contactSubject: document.getElementById('subject'),
//             contactMessage: document.getElementById('message'),
//             contactSubmitBtn: document.getElementById('contactSubmitBtn'), // Assuming submit button has an ID
//             // Login Form
//             loginForm: document.getElementById('loginForm'),
//             loginEmailInput: document.getElementById('loginEmail'),
//             loginPasswordInput: document.getElementById('loginPassword'),
//             loginSubmitBtn: document.getElementById('loginSubmitBtn'), // Assuming submit button has an ID
//             // Register Form
//             registerForm: document.getElementById('registerForm'),
//             registerUsername: document.getElementById('registerUsername'),
//             registerEmail: document.getElementById('registerEmail'),
//             registerPhone: document.getElementById('registerPhone'),
//             registerPassword: document.getElementById('registerPassword'),
//             registerConfirmPassword: document.getElementById('registerConfirmPassword'),
//             registerSubmitBtn: document.getElementById('registerSubmitBtn'), // Assuming submit button has an ID
//             // Forgot Password Form
//             forgotPasswordForm: document.getElementById('forgotPasswordForm'),
//             resetEmailInput: document.getElementById('resetEmailInput'),
//             sendResetLinkBtn: document.getElementById('sendResetLinkBtn'), // Assuming submit button has an ID
//
//             // --- Auth/User Info (Header - Assumed IDs) ---
//             authButtonsHeader: document.getElementById('authButtonsHeader'), // Container for header login/signup
//             loginBtnHeader: document.getElementById('loginBtnHeader'),
//             signupBtnHeader: document.getElementById('signupBtnHeader'),
//             userInfoHeader: document.getElementById('userInfoHeader'),     // Container for header welcome/logout
//             usernameDisplayHeader: document.getElementById('usernameDisplayHeader'),
//             logoutBtnHeader: document.getElementById('logoutBtnHeader'),
//
//             // --- Auth/User Info (Mobile - Assumed IDs, MUST exist in HTML #navLinks) ---
//             authButtonsMobile: document.getElementById('authButtonsMobile'), // Container for mobile login/signup
//             loginBtnMobile: document.getElementById('loginBtnMobile'),     // Specific mobile login button
//             signupBtnMobile: document.getElementById('signupBtnMobile'),    // Specific mobile signup button
//             userInfoMobile: document.getElementById('userInfoMobile'),     // Container for mobile welcome/logout
//             usernameDisplayMobile: document.getElementById('usernameDisplayMobile'),
//             logoutBtnMobile: document.getElementById('logoutBtnMobile'),     // Specific mobile logout button
//
//             // --- Form Error Message Placeholders (Assumed IDs/Classes) ---
//             // Add similar entries for all validated fields
//             loginEmailError: document.getElementById('loginEmailError'),
//             loginPasswordError: document.getElementById('loginPasswordError'),
//             registerUsernameError: document.getElementById('registerUsernameError'),
//             registerEmailError: document.getElementById('registerEmailError'),
//             registerPasswordError: document.getElementById('registerPasswordError'),
//             registerConfirmPasswordError: document.getElementById('registerConfirmPasswordError'), // Changed ID from passwordMatchError
//             resetEmailError: document.getElementById('resetEmailError'),
//             contactNameError: document.getElementById('contactNameError'),
//             contactEmailError: document.getElementById('contactEmailError'),
//             contactMessageError: document.getElementById('contactMessageError'),
//
//             // Toast Container (Created dynamically)
//             toastContainer: null
//         };
//
//         // Add a check for critical elements
//         if (!this.elements.navLinks || !this.elements.modalOverlay) {
//             console.warn("View: Core elements like navLinks or modalOverlay not found!");
//         }
//         // Check for mobile auth elements existence
//         if (!this.elements.authButtonsMobile || !this.elements.userInfoMobile) {
//             console.warn("View: Dedicated mobile auth elements (#authButtonsMobile, #userInfoMobile) not found in HTML within #navLinks. Mobile auth switching will fail.");
//         }
//     }
//
//     // Helper to check if an element exists before trying to use it
//     _elementExists(elementRef) {
//         // Check for null or undefined
//         return elementRef !== null && typeof elementRef !== 'undefined';
//     }
//
//     // --- UI Update Methods ---
//     toggleMobileMenu(show) {
//         if (this._elementExists(this.elements.navLinks)) {
//             // Use classList.toggle with force argument
//             this.elements.navLinks.classList.toggle('active', show);
//             // Consider ARIA attribute for accessibility
//             if(this._elementExists(this.elements.menuToggle)) {
//                 this.elements.menuToggle.setAttribute('aria-expanded', show ? 'true' : 'false');
//             }
//         }
//         if (this._elementExists(this.elements.body)) {
//             this.elements.body.classList.toggle('no-scroll', show); // Prevent body scroll when menu open
//         }
//     }
//
//     isMobileMenuOpen() {
//         return this._elementExists(this.elements.navLinks) && this.elements.navLinks.classList.contains('active');
//     }
//
//     updateHeaderScroll(scrolled) {
//         if (this._elementExists(this.elements.header)) {
//             // Add CSS: #header { transition: background-color 0.3s ease; }
//             this.elements.header.classList.toggle('scrolled', scrolled);
//         }
//     }
//
//     updateBackToTopButton(show) {
//         if (this._elementExists(this.elements.backToTopButton)) {
//             // Add CSS: #backToTop { transition: opacity 0.3s ease, visibility 0.3s ease; opacity: 0; visibility: hidden; }
//             //          #backToTop.active { opacity: 1; visibility: visible; }
//             this.elements.backToTopButton.classList.toggle('active', show);
//         }
//     }
//
//     updateScrollIndicator(percentage) {
//         if (this._elementExists(this.elements.scrollIndicator)) {
//             this.elements.scrollIndicator.style.width = `${percentage}%`;
//         }
//     }
//
//     scrollToTop() {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//
//     smoothScrollTo(selector) {
//         const targetElement = document.querySelector(selector);
//         if (targetElement) {
//             // Calculate offset considering potential fixed header height
//             const headerOffset = this._elementExists(this.elements.header) && getComputedStyle(this.elements.header).position === 'fixed'
//                 ? this.elements.header.offsetHeight
//                 : 0;
//             const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
//             const offsetPosition = elementPosition - headerOffset - 20; // Adjust extra offset (20px) as needed
//
//             window.scrollTo({
//                 top: offsetPosition,
//                 behavior: 'smooth'
//             });
//         } else {
//             console.warn(`View: Element with selector "${selector}" not found for smooth scrolling.`);
//         }
//     }
//
//     initFadeInObserver(callback) {
//         if (this.elements.fadeInElements && this.elements.fadeInElements.length > 0 && 'IntersectionObserver' in window) {
//             const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
//             const scrollObserver = new IntersectionObserver((entries, observer) => {
//                 entries.forEach(entry => {
//                     if (entry.isIntersecting) {
//                         // Add CSS: .fade-in { opacity: 0; transition: opacity 0.6s ease-out; transform: translateY(20px); }
//                         //          .fade-in.active { opacity: 1; transform: translateY(0); }
//                         callback(entry.target); // Notify controller to add 'active' class
//                         observer.unobserve(entry.target); // Stop observing once visible
//                     }
//                 });
//             }, observerOptions);
//             this.elements.fadeInElements.forEach(el => scrollObserver.observe(el));
//         } else if (!('IntersectionObserver' in window)) {
//             console.warn("View: IntersectionObserver not supported. Fade-in effect disabled.");
//             // Fallback: Optionally, just make elements visible immediately
//             // this.elements.fadeInElements.forEach(el => callback(el));
//         }
//     }
//
//     activateFadeInElement(element) {
//         if (this._elementExists(element)) {
//             element.classList.add('active');
//         }
//     }
//
//     initParticles() {
//         if (typeof particlesJS === 'function' && this._elementExists(this.elements.particlesJsContainer)) {
//             // TODO: Consider loading config from external JSON for better management
//             // fetch('particles-config.json')
//             //   .then(response => response.json())
//             //   .then(config => particlesJS('particles-js', config))
//             //   .catch(error => console.error('Error loading particles config:', error));
//
//             // Using hardcoded config as fallback/example:
//             const particlesConfig = { /* --- Paste original particlesJS config here --- */
//                 "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true
//             };
//             particlesJS('particles-js', particlesConfig);
//
//         } else if (!this._elementExists(this.elements.particlesJsContainer)) {
//             console.warn("View: 'particles-js' element not found.");
//         } else {
//             console.warn("View: particles.js library not loaded or typeof particlesJS is not 'function'.");
//         }
//     }
//
//     resetForm(formElement) {
//         if (this._elementExists(formElement)) {
//             formElement.reset();
//             // Also clear any validation errors associated with this form
//             this.clearFormErrors(formElement);
//         }
//     }
//
//     getFormValues(formId) {
//         const values = {};
//         const formElement = this.elements[formId]; // e.g., this.elements.loginForm
//         if (!this._elementExists(formElement)) {
//             console.error(`View: Cannot get values, form element not found for ID "${formId}" in cached elements.`);
//             return values;
//         }
//
//         // Use FormData for easier retrieval, fallback to specific caching if needed
//         try {
//             const formData = new FormData(formElement);
//             for (const [key, value] of formData.entries()) {
//                 values[key] = value; // Assumes input names match desired keys
//             }
//         } catch (error) {
//             console.error(`View: Error getting form data for ${formId}. Falling back to specific inputs.`, error);
//             // Fallback (keep your original logic if FormData causes issues or names mismatch)
//             switch(formId) {
//                 case 'contactForm':
//                     if(this._elementExists(this.elements.contactName)) values.name = this.elements.contactName.value;
//                     if(this._elementExists(this.elements.contactEmail)) values.email = this.elements.contactEmail.value;
//                     if(this._elementExists(this.elements.contactSubject)) values.subject = this.elements.contactSubject.value;
//                     if(this._elementExists(this.elements.contactMessage)) values.message = this.elements.contactMessage.value;
//                     break;
//                 case 'loginForm':
//                     if(this._elementExists(this.elements.loginEmailInput)) values.email = this.elements.loginEmailInput.value; // Assume input name="email"
//                     if(this._elementExists(this.elements.loginPasswordInput)) values.password = this.elements.loginPasswordInput.value; // Assume input name="password"
//                     break;
//                 case 'registerForm':
//                     if(this._elementExists(this.elements.registerUsername)) values.username = this.elements.registerUsername.value;
//                     if(this._elementExists(this.elements.registerEmail)) values.email = this.elements.registerEmail.value;
//                     if(this._elementExists(this.elements.registerPhone)) values.phone = this.elements.registerPhone.value;
//                     if(this._elementExists(this.elements.registerPassword)) values.password = this.elements.registerPassword.value;
//                     if(this._elementExists(this.elements.registerConfirmPassword)) values.confirmPassword = this.elements.registerConfirmPassword.value;
//                     break;
//                 case 'forgotPasswordForm':
//                     if(this._elementExists(this.elements.resetEmailInput)) values.email = this.elements.resetEmailInput.value;
//                     break;
//                 default:
//                     console.warn(`View: getFormValues fallback used for unknown form ID "${formId}"`);
//             }
//         }
//         return values;
//     }
//
//     // --- Toast Notifications ---
//     _createToastContainer() {
//         if (!this._elementExists(document.getElementById('toast-container'))) {
//             const container = document.createElement('div');
//             container.id = 'toast-container';
//             // Add CSS: #toast-container { position: fixed; top: 20px; right: 20px; z-index: 1000; }
//             this.elements.body.appendChild(container);
//             this.elements.toastContainer = container;
//         } else {
//             this.elements.toastContainer = document.getElementById('toast-container');
//         }
//     }
//
//     showToast(message, type = 'info', duration = 3000) {
//         if (!this._elementExists(this.elements.toastContainer)) {
//             console.error("View: Toast container not found.");
//             // Fallback to console
//             console.log(`Toast [${type}]: ${message}`);
//             return;
//         }
//
//         // Clear existing timeout if a new toast is shown quickly
//         if (this.#toastTimeout) {
//             clearTimeout(this.#toastTimeout);
//         }
//
//         const toast = document.createElement('div');
//         toast.className = `toast-notification toast-${type}`; // e.g., toast-success, toast-error
//         toast.textContent = message;
//
//         // Add CSS: .toast-notification { background: #333; color: white; padding: 10px 20px; margin-bottom: 10px; border-radius: 4px; opacity: 0.9; transition: opacity 0.3s ease; }
//         //          .toast-success { background: #28a745; }
//         //          .toast-error { background: #dc3545; }
//         //          .toast-info { background: #17a2b8; }
//         //          .toast-warning { background: #ffc107; color: #333; }
//
//         this.elements.toastContainer.appendChild(toast);
//
//         // Auto-hide
//         this.#toastTimeout = setTimeout(() => {
//             toast.style.opacity = '0'; // Fade out
//             setTimeout(() => {
//                 if(toast.parentNode === this.elements.toastContainer) { // Check if it hasn't been removed already
//                     this.elements.toastContainer.removeChild(toast);
//                 }
//                 this.#toastTimeout = null; // Reset timeout ID
//             }, 300); // Wait for fade out transition
//         }, duration);
//     }
//
//
//     // --- Modal Management ---
//     openModal(modalElement) {
//         if (!this._elementExists(modalElement) || !this._elementExists(this.elements.modalOverlay)) return;
//
//         // Add CSS: #modalOverlay { transition: opacity 0.3s ease; }
//         //          .modal { transition: opacity 0.3s ease, transform 0.3s ease; transform: scale(0.9); }
//         //          #modalOverlay.active { opacity: 1; visibility: visible; }
//         //          .modal.active { opacity: 1; transform: scale(1); }
//
//         this.elements.modalOverlay.classList.add('active');
//         modalElement.classList.add('active');
//         if(this._elementExists(this.elements.body)) this.elements.body.classList.add('no-scroll'); // Prevent body scroll
//
//         // Focus management for accessibility
//         const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
//         if(focusableElements.length > 0) {
//             setTimeout(() => focusableElements[0].focus(), 100); // Focus first element after opening
//         }
//
//
//         // Reset internal form states if opening login modal
//         if (modalElement === this.elements.loginModal) {
//             this._showSpecificModalForm(this.elements.loginForm); // Ensure login form is default
//         }
//         // Reset forms inside the modal when opened
//         this.clearFormErrors(modalElement);
//         const formsInside = modalElement.querySelectorAll('form');
//         formsInside.forEach(form => form.reset());
//     }
//
//     closeModal() {
//         if (!this._elementExists(this.elements.modalOverlay)) return;
//
//         this.elements.modalOverlay.classList.remove('active');
//         if (this._elementExists(this.elements.loginModal)) this.elements.loginModal.classList.remove('active');
//         if (this._elementExists(this.elements.registerModal)) this.elements.registerModal.classList.remove('active');
//         if(this._elementExists(this.elements.body)) this.elements.body.classList.remove('no-scroll'); // Allow body scroll
//
//         // Clear errors on close (optional, maybe keep them if needed)
//         // this.clearFormErrors(this.elements.loginModal);
//         // this.clearFormErrors(this.elements.registerModal);
//
//         // Reset specific states if needed (e.g., password match error)
//         this.showFieldError(this.elements.registerConfirmPassword, null); // Hide error specifically
//     }
//
//     // Helper to show only one form within the login modal
//     _showSpecificModalForm(formToShow) {
//         if (this._elementExists(this.elements.loginForm)) {
//             this.elements.loginForm.style.display = (formToShow === this.elements.loginForm) ? 'block' : 'none';
//         }
//         if (this._elementExists(this.elements.forgotPasswordForm)) {
//             this.elements.forgotPasswordForm.style.display = (formToShow === this.elements.forgotPasswordForm) ? 'block' : 'none';
//         }
//     }
//
//     showLoginFormView() {
//         if(this._elementExists(this.elements.loginModal)) {
//             this._showSpecificModalForm(this.elements.loginForm);
//         }
//     }
//
//     showForgotPasswordView() {
//         if(this._elementExists(this.elements.loginModal)) {
//             this._showSpecificModalForm(this.elements.forgotPasswordForm);
//             // Focus the email input in forgot password form
//             this.focusElement(this.elements.resetEmailInput);
//         }
//     }
//
//     focusElement(element) {
//         // Add a small delay to ensure element is visible/focusable, especially after UI changes
//         if(this._elementExists(element)) {
//             setTimeout(() => element.focus(), 50);
//         }
//     }
//
//     // --- Form Validation Feedback ---
//     showFieldError(inputElement, message) {
//         if (!this._elementExists(inputElement)) return;
//         // Find the associated error message element (assuming convention like inputID + "Error")
//         const errorElementId = inputElement.id + 'Error'; // e.g., "loginEmail" -> "loginEmailError"
//         const errorElement = this.elements[errorElementId] || document.getElementById(errorElementId); // Check cache first
//
//         if (this._elementExists(errorElement)) {
//             errorElement.textContent = message || ''; // Set message or clear it if null/empty
//             errorElement.style.display = message ? 'block' : 'none';
//             // Add CSS: .error-message { color: red; font-size: 0.8em; margin-top: 4px; }
//         }
//
//         // Add/remove invalid class to the input itself for styling
//         // Add CSS: input.is-invalid { border-color: red; }
//         inputElement.classList.toggle('is-invalid', !!message); // Add if message exists, remove otherwise
//     }
//
//     // Clear all errors within a specific form or container
//     clearFormErrors(containerElement) {
//         if (!this._elementExists(containerElement)) return;
//         const errorMessages = containerElement.querySelectorAll('.error-message'); // Assumes errors have this class
//         errorMessages.forEach(el => {
//             el.textContent = '';
//             el.style.display = 'none';
//         });
//         const invalidInputs = containerElement.querySelectorAll('.is-invalid');
//         invalidInputs.forEach(el => el.classList.remove('is-invalid'));
//     }
//
//
//     // --- Button Loading State ---
//     setButtonLoading(buttonElement, isLoading) {
//         if (!this._elementExists(buttonElement)) return;
//         // Add CSS: button.is-loading { cursor: not-allowed; opacity: 0.7; }
//         //          button.is-loading::after { content: '...'; display: inline-block; margin-left: 5px; } /* Basic spinner example */
//         if (isLoading) {
//             buttonElement.disabled = true;
//             buttonElement.classList.add('is-loading');
//             // Store original text if needed
//             if (!buttonElement.dataset.originalText) {
//                 buttonElement.dataset.originalText = buttonElement.textContent;
//             }
//             // Optionally change text (e.g., "Submitting...") - Be careful with i18n
//             // buttonElement.textContent = 'Processing...';
//         } else {
//             buttonElement.disabled = false;
//             buttonElement.classList.remove('is-loading');
//             // Restore original text
//             if (buttonElement.dataset.originalText) {
//                 buttonElement.textContent = buttonElement.dataset.originalText;
//                 // delete buttonElement.dataset.originalText; // Clean up
//             }
//         }
//     }
//
//     // --- Auth UI State ---
//     displayAuthState(isLoggedIn, username) {
//         const displayHeader = (showUser) => {
//             if (this._elementExists(this.elements.authButtonsHeader)) this.elements.authButtonsHeader.style.display = showUser ? 'none' : 'flex'; // Or 'block' depending on layout
//             if (this._elementExists(this.elements.userInfoHeader)) {
//                 this.elements.userInfoHeader.style.display = showUser ? 'flex' : 'none'; // Or 'block'
//                 if (showUser && this._elementExists(this.elements.usernameDisplayHeader)) {
//                     this.elements.usernameDisplayHeader.textContent = `Welcome, ${username}!`;
//                 }
//             }
//         };
//
//         const displayMobile = (showUser) => {
//             if (this._elementExists(this.elements.authButtonsMobile)) this.elements.authButtonsMobile.style.display = showUser ? 'none' : 'flex'; // Use flex based on prev code
//             if (this._elementExists(this.elements.userInfoMobile)) {
//                 this.elements.userInfoMobile.style.display = showUser ? 'flex' : 'none'; // Use flex based on prev code
//                 if (showUser && this._elementExists(this.elements.usernameDisplayMobile)) {
//                     this.elements.usernameDisplayMobile.textContent = `Welcome, ${username}!`;
//                 }
//             }
//         };
//
//         if (isLoggedIn) {
//             displayHeader(true);
//             displayMobile(true);
//         } else {
//             displayHeader(false);
//             displayMobile(false);
//         }
//     }
//
//     // --- Binding for Internal View Logic (called by Controller during init) ---
//     bindRegisterPasswordMatch(handler) {
//         // Check on both fields to provide immediate feedback
//         if (this._elementExists(this.elements.registerPassword)) {
//             this.elements.registerPassword.addEventListener('input', handler);
//         }
//         if (this._elementExists(this.elements.registerConfirmPassword)) {
//             this.elements.registerConfirmPassword.addEventListener('input', handler);
//         }
//     }
//
//     // Bind handlers for modal close buttons and overlay click
//     bindModalCloseEvents(handler) {
//         if (this._elementExists(this.elements.closeLoginModalBtn)) {
//             this.elements.closeLoginModalBtn.addEventListener('click', handler);
//         }
//         if (this._elementExists(this.elements.closeRegisterModalBtn)) {
//             this.elements.closeRegisterModalBtn.addEventListener('click', handler);
//         }
//         if (this._elementExists(this.elements.modalOverlay)) {
//             this.elements.modalOverlay.addEventListener('click', (e) => {
//                 // Only close if clicking the overlay itself, not content inside
//                 if (e.target === this.elements.modalOverlay) {
//                     handler();
//                 }
//             });
//         }
//         // Add Escape key listener to close modal
//         document.addEventListener('keydown', (e) => {
//             if (e.key === 'Escape' && this.elements.modalOverlay.classList.contains('active')) {
//                 handler();
//             }
//         });
//     }
// }
//
//
// /**
//  * ============================================================
//  * --- CONTROLLER ---
//  * Handles events, updates Model, tells View what to display.
//  * Connects Model and View.
//  * ============================================================
//  */
// class Controller {
//     constructor(model, view) {
//         this.model = model;
//         this.view = view;
//
//         // Pre-bind 'this' for event handlers to ensure correct context
//         // (Reduces need for .bind(this) inside addEventListener)
//         this._bindHandlerMethods();
//     }
//
//     // Helper to bind all handler methods
//     _bindHandlerMethods() {
//         const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
//             .filter(prop => prop.startsWith('handle') && typeof this[prop] === 'function');
//         methods.forEach(method => {
//             this[method] = this[method].bind(this);
//         });
//     }
//
//     init() {
//         console.log("Controller: Initializing...");
//         this.bindEvents();
//
//         // Set initial UI state based on Model (could be pre-filled in Model constructor)
//         this.view.displayAuthState(this.model.isUserLoggedIn(), this.model.getUsername());
//
//         // Initialize other view features
//         this.view.initParticles();
//         this.view.initFadeInObserver(this.handleFadeInElement); // Pass handler directly
//         console.log("Controller: Initialization complete.");
//     }
//
//     bindEvents() {
//         // --- Window Scroll Events ---
//         window.addEventListener('scroll', this.handleScroll, { passive: true }); // Use passive listener for scroll performance
//
//         // --- Mobile Menu ---
//         if (this.view._elementExists(this.view.elements.menuToggle)) {
//             this.view.elements.menuToggle.addEventListener('click', this.handleMenuToggle);
//         }
//         if (this.view._elementExists(this.view.elements.closeMenu)) {
//             this.view.elements.closeMenu.addEventListener('click', this.handleMenuClose);
//         }
//         // Close menu when clicking a nav link inside it
//         if (this.view.elements.navLinkItems && this.view.elements.navLinkItems.length > 0) {
//             this.view.elements.navLinkItems.forEach(link => {
//                 link.addEventListener('click', (e) => this.handleNavLinkClick(e, link)); // Use a general handler
//             });
//         }
//
//         // --- Back to Top ---
//         if (this.view._elementExists(this.view.elements.backToTopButton)) {
//             this.view.elements.backToTopButton.addEventListener('click', this.handleBackToTopClick);
//         }
//
//         // --- Smooth Scrolling for any relevant # link (can be refined) ---
//         // Consider if this overlaps too much with handleNavLinkClick
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             const href = anchor.getAttribute('href');
//             if (href && href !== '#' && href.length > 1) {
//                 // Avoid double-binding if it's already handled by navLinkItems
//                 if(!anchor.closest('#navLinks')) { // Example check: don't bind if it's inside mobile nav
//                     anchor.addEventListener('click', (e) => this.handleSmoothScrollLinkClick(e, anchor));
//                 }
//             }
//         });
//
//
//         // --- Contact Form ---
//         if (this.view._elementExists(this.view.elements.contactForm)) {
//             this.view.elements.contactForm.addEventListener('submit', this.handleContactSubmit);
//         }
//
//         // --- Modal Opening ---
//         // Header Buttons
//         if (this.view._elementExists(this.view.elements.loginBtnHeader)) {
//             this.view.elements.loginBtnHeader.addEventListener('click', this.handleOpenLoginModal);
//         }
//         if (this.view._elementExists(this.view.elements.signupBtnHeader)) {
//             this.view.elements.signupBtnHeader.addEventListener('click', this.handleOpenRegisterModal);
//         }
//         // Mobile Buttons (Using specific mobile IDs)
//         if (this.view._elementExists(this.view.elements.loginBtnMobile)) {
//             this.view.elements.loginBtnMobile.addEventListener('click', this.handleOpenLoginModal);
//         }
//         if (this.view._elementExists(this.view.elements.signupBtnMobile)) {
//             this.view.elements.signupBtnMobile.addEventListener('click', this.handleOpenRegisterModal);
//         }
//
//
//         // --- Modal Closing (Using View's internal binding) ---
//         this.view.bindModalCloseEvents(this.handleCloseModal);
//
//         // --- Modal Switching ---
//         if (this.view._elementExists(this.view.elements.switchToRegisterLink)) {
//             this.view.elements.switchToRegisterLink.addEventListener('click', this.handleSwitchToRegister);
//         }
//         if (this.view._elementExists(this.view.elements.switchToLoginLink)) {
//             this.view.elements.switchToLoginLink.addEventListener('click', this.handleSwitchToLogin);
//         }
//
//         // --- Forgot Password Flow ---
//         if (this.view._elementExists(this.view.elements.forgotPasswordLink)) {
//             this.view.elements.forgotPasswordLink.addEventListener('click', this.handleShowForgotPassword);
//         }
//         if (this.view._elementExists(this.view.elements.backToLoginLink)) {
//             this.view.elements.backToLoginLink.addEventListener('click', this.handleShowLoginFromForgot);
//         }
//         if (this.view._elementExists(this.view.elements.forgotPasswordForm)) {
//             this.view.elements.forgotPasswordForm.addEventListener('submit', this.handleForgotPasswordSubmit);
//         }
//
//         // --- Form Submissions ---
//         if (this.view._elementExists(this.view.elements.loginForm)) {
//             this.view.elements.loginForm.addEventListener('submit', this.handleLoginSubmit);
//         }
//         if (this.view._elementExists(this.view.elements.registerForm)) {
//             this.view.elements.registerForm.addEventListener('submit', this.handleRegisterSubmit);
//         }
//
//         // --- Register Form Password Match Check (Using View's internal binding) ---
//         this.view.bindRegisterPasswordMatch(this.handlePasswordMatchInput);
//
//         // --- Social Login (Assuming buttons exist in both login/register modals or elsewhere) ---
//         document.querySelectorAll('.login-google-btn').forEach(btn => { // Use class for potentially multiple buttons
//             btn.addEventListener('click', () => this.handleSocialLogin('Google'));
//         });
//         document.querySelectorAll('.login-facebook-btn').forEach(btn => {
//             btn.addEventListener('click', () => this.handleSocialLogin('Facebook'));
//         });
//
//         // --- Logout ---
//         // Header Button
//         if (this.view._elementExists(this.view.elements.logoutBtnHeader)) {
//             this.view.elements.logoutBtnHeader.addEventListener('click', this.handleLogout);
//         }
//         // Mobile Button
//         if (this.view._elementExists(this.view.elements.logoutBtnMobile)) {
//             this.view.elements.logoutBtnMobile.addEventListener('click', this.handleLogout);
//         }
//     }
//
//     // --- Event Handlers ---
//
//     handleScroll() {
//         const scrollY = window.scrollY;
//         const docElement = document.documentElement;
//         const scrollHeight = docElement.scrollHeight - docElement.clientHeight;
//         const scrollPercentage = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
//
//         // Header Styling
//         this.view.updateHeaderScroll(scrollY > this.model.getScrollThreshold('header'));
//         // Back to Top Button Visibility
//         this.view.updateBackToTopButton(scrollY > this.model.getScrollThreshold('backToTop'));
//         // Scroll Indicator Progress
//         this.view.updateScrollIndicator(scrollPercentage);
//     }
//
//     handleMenuToggle() {
//         // Toggle menu visibility (View handles the class and body scroll)
//         this.view.toggleMobileMenu(!this.view.isMobileMenuOpen());
//         // Auth state is already handled by the initial display and logout/login updates
//     }
//
//     handleMenuClose() {
//         this.view.toggleMobileMenu(false);
//     }
//
//     // Handles clicks on ANY link within the nav menu
//     handleNavLinkClick(event, linkElement) {
//         const href = linkElement.getAttribute('href');
//
//         // Check if it's an internal section link (starts with #, not just #)
//         if (href && href.startsWith('#') && href.length > 1) {
//             event.preventDefault(); // Prevent default jump
//             this.view.toggleMobileMenu(false); // Close menu first
//             // Use setTimeout to allow menu closing animation before scrolling
//             setTimeout(() => this.view.smoothScrollTo(href), 50); // Adjust delay if needed
//         } else {
//             // For external links or non-section links, just close the menu
//             // Default browser behavior will handle navigation
//             this.view.toggleMobileMenu(false);
//         }
//     }
//
//     // Handles clicks specifically on links intended for smooth scrolling outside the nav menu
//     handleSmoothScrollLinkClick(event, linkElement) {
//         const href = linkElement.getAttribute('href');
//         // Double check it's a valid internal link (excluding plain '#')
//         if (href && href !== '#' && href.length > 1) {
//             event.preventDefault(); // Prevent default jump
//             this.view.smoothScrollTo(href);
//         }
//     }
//
//
//     handleBackToTopClick(e) {
//         e.preventDefault();
//         this.view.scrollToTop();
//     }
//
//     handleFadeInElement(element) {
//         // Controller instructs View to add the 'active' class
//         this.view.activateFadeInElement(element);
//     }
//
//     // --- Form Submission Handlers with Validation & Loading State ---
//
//     async handleContactSubmit(e) {
//         e.preventDefault();
//         const form = this.view.elements.contactForm;
//         const button = this.view.elements.contactSubmitBtn || form.querySelector('[type="submit"]'); // Find submit button
//         this.view.clearFormErrors(form); // Clear previous errors
//         this.view.setButtonLoading(button, true);
//
//         try {
//             const formData = this.view.getFormValues('contactForm');
//             let isValid = true;
//
//             // --- Basic Validation ---
//             if (!formData.name?.trim()) {
//                 this.view.showFieldError(this.view.elements.contactName, 'Name is required.');
//                 isValid = false;
//             }
//             if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { // Basic email format check
//                 this.view.showFieldError(this.view.elements.contactEmail, 'A valid email is required.');
//                 isValid = false;
//             }
//             if (!formData.message?.trim()) {
//                 this.view.showFieldError(this.view.elements.contactMessage, 'Message cannot be empty.');
//                 isValid = false;
//             }
//
//             if (!isValid) {
//                 this.view.showToast('Please correct the errors in the form.', 'error');
//                 // Focus the first invalid field for better UX
//                 const firstInvalid = form.querySelector('.is-invalid');
//                 if (firstInvalid) this.view.focusElement(firstInvalid);
//                 return; // Stop submission
//             }
//
//             console.log('Contact Form Data:', formData);
//             // --- !!! Simulate Backend Submission !!! ---
//             await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
//             // --- !!! Replace above with actual fetch() to your backend API ---
//             // Example:
//             // const response = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData), headers: {'Content-Type': 'application/json'} });
//             // if (!response.ok) throw new Error('Failed to send message');
//
//             this.view.showToast('Thank you! Your message has been sent.', 'success');
//             this.view.resetForm(form); // Reset form on success
//
//         } catch (error) {
//             console.error("Contact form submission error:", error);
//             this.view.showToast('Failed to send message. Please try again.', 'error');
//         } finally {
//             // Always remove loading state
//             this.view.setButtonLoading(button, false);
//         }
//     }
//
//     handleOpenLoginModal() {
//         this.view.openModal(this.view.elements.loginModal);
//     }
//
//     handleOpenRegisterModal() {
//         this.view.openModal(this.view.elements.registerModal);
//     }
//
//     handleCloseModal() {
//         this.view.closeModal();
//     }
//
//     // Helper for modal switching with smooth transition feel
//     _switchModal(targetModalElement) {
//         this.view.closeModal();
//         // Use a short delay to allow the close transition to start before opening the next
//         setTimeout(() => {
//             if (targetModalElement === this.view.elements.registerModal) {
//                 this.handleOpenRegisterModal();
//             } else if (targetModalElement === this.view.elements.loginModal) {
//                 this.handleOpenLoginModal();
//             }
//         }, 150); // Adjust delay based on CSS transition duration
//     }
//
//
//     handleSwitchToRegister(e) {
//         e.preventDefault();
//         this._switchModal(this.view.elements.registerModal);
//     }
//
//     handleSwitchToLogin(e) {
//         e.preventDefault();
//         this._switchModal(this.view.elements.loginModal);
//     }
//
//     handleShowForgotPassword(e) {
//         e.preventDefault();
//         this.view.showForgotPasswordView(); // View handles showing/hiding forms within the modal
//     }
//
//     handleShowLoginFromForgot(e) {
//         e.preventDefault();
//         this.view.showLoginFormView(); // View handles showing/hiding forms
//     }
//
//     async handleForgotPasswordSubmit(e) {
//         e.preventDefault();
//         const form = this.view.elements.forgotPasswordForm;
//         const button = this.view.elements.sendResetLinkBtn || form.querySelector('[type="submit"]');
//         this.view.clearFormErrors(form);
//         this.view.setButtonLoading(button, true);
//
//         try {
//             const formData = this.view.getFormValues('forgotPasswordForm');
//             if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
//                 this.view.showFieldError(this.view.elements.resetEmailInput, 'Please enter a valid email address.');
//                 this.view.focusElement(this.view.elements.resetEmailInput);
//                 return;
//             }
//
//             console.log('Simulating sending password reset link to:', formData.email);
//             // --- !!! Simulate Backend Interaction !!! ---
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             // --- !!! Replace with actual fetch() to backend API ---
//
//             this.view.showToast(`Password reset simulation: If an account exists for ${formData.email}, an email has been sent.`, 'info');
//             this.view.closeModal(); // Close modal on success/simulation
//             // No need to reset form here usually, modal close handles it if desired
//
//         } catch (error) {
//             console.error("Forgot password error:", error);
//             this.view.showToast('Failed to send reset link. Please try again.', 'error');
//         } finally {
//             this.view.setButtonLoading(button, false);
//         }
//     }
//
//     async handleLoginSubmit(e) {
//         e.preventDefault();
//         const form = this.view.elements.loginForm;
//         const button = this.view.elements.loginSubmitBtn || form.querySelector('[type="submit"]');
//         this.view.clearFormErrors(form);
//         this.view.setButtonLoading(button, true);
//
//         try {
//             const formData = this.view.getFormValues('loginForm');
//             let isValid = true;
//
//             // Use 'email' from FormData, assuming input name="email"
//             if (!formData.email?.trim()) { // Basic check, could add email format check too
//                 this.view.showFieldError(this.view.elements.loginEmailInput, 'Email or Username is required.');
//                 isValid = false;
//             }
//             if (!formData.password) {
//                 this.view.showFieldError(this.view.elements.loginPasswordInput, 'Password is required.');
//                 isValid = false;
//             }
//
//             if (!isValid) {
//                 const firstInvalid = form.querySelector('.is-invalid');
//                 if (firstInvalid) this.view.focusElement(firstInvalid);
//                 return; // Stop if basic validation fails
//             }
//
//             console.log('Simulating login attempt for:', formData.email);
//             // --- !!! Simulate Backend Authentication !!! ---
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             // --- !!! Replace with actual fetch() to backend API for validation ---
//             // Example: const response = await fetch('/api/login', {...});
//             // if (!response.ok) { throw new Error('Invalid credentials'); } // Or specific error from backend
//             // const userData = await response.json();
//
//             // --- On Successful Authentication (Simulation) ---
//             this.view.showToast('Login successful (simulation)!', 'success');
//             this.model.login(formData.email); // Update model state (use actual username/data from backend response)
//             this.view.closeModal();
//             this.view.displayAuthState(true, this.model.getUsername()); // Update UI
//             // Form reset is handled by modal open/close
//
//         } catch (error) {
//             console.error("Login error:", error);
//             // Show generic error, or specific one based on backend response
//             this.view.showFieldError(this.view.elements.loginPasswordInput, 'Invalid username/email or password.'); // Example error on a field
//             this.view.showToast('Login failed. Please check your credentials.', 'error');
//         } finally {
//             this.view.setButtonLoading(button, false);
//         }
//     }
//
//
//     async handleRegisterSubmit(e) {
//         e.preventDefault();
//         const form = this.view.elements.registerForm;
//         const button = this.view.elements.registerSubmitBtn || form.querySelector('[type="submit"]');
//         this.view.clearFormErrors(form);
//         this.view.setButtonLoading(button, true);
//
//         try {
//             const formData = this.view.getFormValues('registerForm');
//             let isValid = true;
//
//             // --- Detailed Validation ---
//             if (!formData.username?.trim()) {
//                 this.view.showFieldError(this.view.elements.registerUsername, 'Username is required.'); isValid = false;
//             }
//             if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
//                 this.view.showFieldError(this.view.elements.registerEmail, 'A valid email is required.'); isValid = false;
//             }
//             // Add phone validation if needed (e.g., regex for format)
//             if (!formData.password || formData.password.length < 6) { // Example: Minimum length
//                 this.view.showFieldError(this.view.elements.registerPassword, 'Password must be at least 6 characters.'); isValid = false;
//             }
//             if (formData.password !== formData.confirmPassword) {
//                 this.view.showFieldError(this.view.elements.registerConfirmPassword, 'Passwords do not match.'); isValid = false;
//                 // Also mark the original password field potentially
//                 // this.view.showFieldError(this.view.elements.registerPassword, 'Passwords do not match.');
//             } else {
//                 // Explicitly clear the confirm password error if they now match
//                 this.view.showFieldError(this.view.elements.registerConfirmPassword, null);
//             }
//
//             if (!isValid) {
//                 this.view.showToast('Please correct the errors in the form.', 'error');
//                 const firstInvalid = form.querySelector('.is-invalid');
//                 if (firstInvalid) this.view.focusElement(firstInvalid);
//                 return; // Stop submission
//             }
//
//             // --- Passed Client Validation ---
//             console.log('Simulating registration for:', { username: formData.username, email: formData.email });
//             // --- !!! Simulate Backend Registration !!! ---
//             await new Promise(resolve => setTimeout(resolve, 1500));
//             // --- !!! Replace with actual fetch() to backend API ---
//             // Example: const response = await fetch('/api/register', {...});
//             // if (!response.ok) { /* Handle backend errors, e.g., email already exists */ throw new Error('Registration failed'); }
//             // const userData = await response.json(); // Get user data if needed
//
//             // --- On Successful Registration (Simulation) ---
//             this.view.showToast('Registration successful! You are now logged in.', 'success');
//             this.model.login(formData.username); // Login with new username (use data from backend if available)
//             this.view.closeModal();
//             this.view.displayAuthState(true, this.model.getUsername()); // Update UI
//
//         } catch (error) {
//             console.error("Registration error:", error);
//             // Check for specific backend errors if possible (e.g., email taken)
//             // if (error.message === 'Email already exists') { ... }
//             this.view.showToast('Registration failed. Please try again later.', 'error');
//             // Optionally show error on a specific field if known (e.g., email exists)
//             // this.view.showFieldError(this.view.elements.registerEmail, 'This email is already registered.');
//         } finally {
//             this.view.setButtonLoading(button, false);
//         }
//     }
//
//     // Handler passed to the view for real-time password match check
//     handlePasswordMatchInput() {
//         const password = this.view.elements.registerPassword ? this.view.elements.registerPassword.value : '';
//         const confirmPassword = this.view.elements.registerConfirmPassword ? this.view.elements.registerConfirmPassword.value : '';
//
//         // Only show error if confirm password field has been touched and passwords don't match
//         if (confirmPassword !== '') { // Check only if user started typing in confirm field
//             if (password !== confirmPassword) {
//                 this.view.showFieldError(this.view.elements.registerConfirmPassword, 'Passwords do not match.');
//             } else {
//                 this.view.showFieldError(this.view.elements.registerConfirmPassword, null); // Clear error if they match
//             }
//         } else {
//             // Clear error if confirm field is empty
//             this.view.showFieldError(this.view.elements.registerConfirmPassword, null);
//         }
//     }
//
//
//     async handleSocialLogin(provider) {
//         console.log(`Simulating Login with ${provider}...`);
//         // --- !!! BACKEND & OAuth/SDK REQUIRED HERE !!! ---
//         // This part is complex and involves redirects or popups handled by SDKs (Google Sign-In, Facebook Login)
//         // The result (token/user info) would typically be sent to your backend for verification/session creation.
//         this.view.showToast(`Simulating ${provider} Login... requires backend integration.`, 'info');
//
//         // --- Simulate success after a delay ---
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         try {
//             // --- Simulate getting user info ---
//             const simulatedUsername = `${provider}User`;
//             this.model.login(simulatedUsername); // Update model
//             this.view.closeModal(); // Close any open modal
//             this.view.displayAuthState(true, this.model.getUsername()); // Update UI
//             this.view.showToast(`Successfully logged in as ${simulatedUsername} (Simulation).`, 'success');
//
//         } catch (error) {
//             console.error(`${provider} login simulation error:`, error);
//             this.view.showToast(`Simulated ${provider} login failed.`, 'error');
//         }
//     }
//
//     handleLogout() {
//         console.log('Simulating logout...');
//         // --- !!! BACKEND REQUIRED HERE to invalidate session/token !!! ---
//         // Example: await fetch('/api/logout', { method: 'POST' });
//
//         // --- Update Client State ---
//         this.model.logout(); // Update model state
//         this.view.displayAuthState(false, null); // Update UI everywhere (header + mobile if open)
//         this.view.closeModal(); // Close any open auth modal just in case
//         // Ensure mobile menu closes if the logout was triggered from there (optional, depends on UX choice)
//         // if (this.view.isMobileMenuOpen()) {
//         //     this.view.toggleMobileMenu(false);
//         // }
//         this.view.showToast('You have been logged out (simulation).', 'info');
//     }
// }
//
//
// // --- Application Initialization ---
// document.addEventListener('DOMContentLoaded', () => {
//     // Ensure the DOM is fully loaded before initializing
//     const appModel = new Model();
//     const appView = new View();
//     const appController = new Controller(appModel, appView);
//
//     try {
//         appController.init(); // Start the application
//     } catch (error) {
//         console.error("Application initialization failed:", error);
//         // Optionally display a user-friendly error message on the page
//         document.body.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">An error occurred while loading the application. Please try refreshing the page.</p>';
//     }
// });
//
// // --- END OF REFACTORED script_before.js (OOP MVC - Enhanced) ---