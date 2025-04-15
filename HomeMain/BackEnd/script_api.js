// --- script-api.js ---

/**
 * ============================================================
 * --- API SIMULATION ---
 * Contains functions simulating backend API calls.
 * Includes delays and returns simulated responses.
 * Does not interact with the DOM.
 * ============================================================
 */
const ApiSimulator = {

    /**
     * Simulates a network delay.
     * @param {number} duration Delay in milliseconds.
     * @returns {Promise<void>}
     */
    _simulateDelay: (duration = 1000) => {
        console.log(`API Sim: Waiting for ${duration}ms...`);
        return new Promise(resolve => setTimeout(resolve, duration));
    },

    /**
     * Simulates user login.
     * @param {string} emailOrUsername
     * @param {string} password
     * @returns {Promise<{success: boolean, data?: {username: string}, error?: string}>}
     */
    login: async (emailOrUsername, password) => {
        await ApiSimulator._simulateDelay(1000);
        console.log(`API Sim: Attempting login for ${emailOrUsername}`);

        // --- SIMULATION LOGIC ---
        // Basic check: fail if password is "wrong" or email is specific test case
        if (password === 'wrongpassword' || emailOrUsername === 'fail@example.com') {
            console.log("API Sim: Login failed (simulated).");
            return { success: false, error: 'Invalid username/email or password.' };
        }

        // Simulate success
        const username = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
        console.log(`API Sim: Login successful for ${username}.`);
        return { success: true, data: { username: username } };
        // --- END SIMULATION LOGIC ---
    },

    /**
     * Simulates user registration.
     * @param {string} username
     * @param {string} email
     * @param {string} phone (Optional)
     * @param {string} password
     * @returns {Promise<{success: boolean, data?: {username: string}, error?: string}>}
     */
    register: async (username, email, phone, password) => {
        await ApiSimulator._simulateDelay(1500);
        console.log(`API Sim: Attempting registration for ${username} (${email})`);

        // --- SIMULATION LOGIC ---
        // Simulate email already exists error
        if (email === 'taken@example.com') {
            console.log("API Sim: Registration failed - email taken (simulated).");
            return { success: false, error: 'This email is already registered.' };
        }

        // Simulate generic failure
        if (username === 'failReg') {
            console.log("API Sim: Registration failed - generic error (simulated).");
            return { success: false, error: 'Registration failed due to a server error.' };
        }

        // Simulate success
        console.log(`API Sim: Registration successful for ${username}.`);
        return { success: true, data: { username: username } };
        // --- END SIMULATION LOGIC ---
    },

    /**
     * Simulates sending a contact form message.
     * @param {string} name
     * @param {string} email
     * @param {string} subject (Optional)
     * @param {string} message
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    sendContactMessage: async (name, email, subject, message) => {
        await ApiSimulator._simulateDelay(1000);
        console.log(`API Sim: Sending contact message from ${name} (${email})`);

        // --- SIMULATION LOGIC ---
        // Simulate a random failure occasionally
        if (Math.random() < 0.1) { // 10% chance of failure
            console.log("API Sim: Contact message failed to send (simulated).");
            return { success: false, error: 'Failed to send message due to a temporary issue.' };
        }

        console.log("API Sim: Contact message sent successfully.");
        return { success: true };
        // --- END SIMULATION LOGIC ---
    },

    /**
     * Simulates requesting a password reset link.
     * @param {string} email
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    requestPasswordReset: async (email) => {
        await ApiSimulator._simulateDelay(1000);
        console.log(`API Sim: Requesting password reset for ${email}`);

        // --- SIMULATION LOGIC ---
        // Always simulate success, but message implies it only works if account exists
        console.log("API Sim: Password reset link request processed.");
        return { success: true, message: `If an account exists for ${email}, a password reset link has been sent.` };
        // --- END SIMULATION LOGIC ---
    },

    /**
     * Simulates logging in via a social provider.
     * @param {string} provider ('Google', 'Facebook', etc.)
     * @returns {Promise<{success: boolean, data?: {username: string}, error?: string}>}
     */
    socialLogin: async (provider) => {
        await ApiSimulator._simulateDelay(1500);
        console.log(`API Sim: Attempting login via ${provider}`);

        // --- SIMULATION LOGIC ---
        // Simulate failure for a specific provider for testing
        if (provider === 'Failbook') {
            console.log(`API Sim: ${provider} login failed (simulated).`);
            return { success: false, error: `Failed to log in with ${provider}.` };
        }

        // Simulate success
        const username = `${provider}User_${Math.random().toString(36).substring(7)}`; // Generate pseudo-random username
        console.log(`API Sim: ${provider} login successful for ${username}.`);
        return { success: true, data: { username: username } };
        // --- END SIMULATION LOGIC ---
    },

    /**
     * Simulates logging out (e.g., invalidating a server session/token).
     * @returns {Promise<{success: boolean}>}
     */
    logout: async () => {
        await ApiSimulator._simulateDelay(500);
        console.log("API Sim: Processing logout.");
        // --- SIMULATION LOGIC ---
        // Logout simulation usually just succeeds on the client unless there's a specific server cleanup error
        console.log("API Sim: Logout successful.");
        return { success: true };
        // --- END SIMULATION LOGIC ---
    }
};

// --- END OF script-api.js ---