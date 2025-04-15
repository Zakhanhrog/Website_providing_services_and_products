// --- script-model.js ---

/**
 * ============================================================
 * --- MODEL ---
 * Manages application state and data.
 * Does not interact with the DOM or backend directly.
 * ============================================================
 */
class Model {
    #isLoggedIn = false; // Private field for encapsulation
    #username = null;
    #scrollThresholds = {
        header: 50,
        backToTop: 300
    };
    #authStateChecked = false; // Flag to check if initial auth state was checked

    constructor() {
        // TODO: Check initial login state from localStorage/sessionStorage or a token
        // Example:
        // const storedUser = localStorage.getItem('loggedInUser');
        // if (storedUser) {
        //     this.#isLoggedIn = true;
        //     this.#username = storedUser; // Assume stored user is just the username
        // }
        // this.#authStateChecked = true;
        console.log("Model: Initialized.");
    }

    login(userIdentifier) {
        this.#isLoggedIn = true;
        // Basic username extraction (adjust as needed based on actual data)
        this.#username = userIdentifier ? (userIdentifier.includes('@') ? userIdentifier.split('@')[0] : userIdentifier) : 'User';
        console.log("Model: State updated to Logged In. User:", this.#username);
        // TODO: Store login state (e.g., localStorage.setItem('loggedInUser', this.#username))
    }

    logout() {
        this.#isLoggedIn = false;
        this.#username = null;
        console.log("Model: State updated to Logged Out.");
        // TODO: Remove stored login state (e.g., localStorage.removeItem('loggedInUser'))
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

    hasCheckedInitialAuthState() {
        return this.#authStateChecked;
    }
}
// --- END OF script-model.js ---