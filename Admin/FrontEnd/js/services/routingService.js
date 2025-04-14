
// js/services/routingService.js
// Placeholder for SPA routing logic

/**
 * Initializes the router, listens for hash changes or popstate events.
 * @param {Function} navigateCallback - Function to call when navigation occurs (e.g., setActiveSection).
 */
export function initRouter(navigateCallback) {
    console.log("Placeholder: Initializing Router...");

    // --- Hash-based Routing (Simple) ---
    const handleHashChange = () => {
        const hash = window.location.hash.substring(1); // Remove #
        const [sectionId, paramString] = hash.split('?');
        const params = new URLSearchParams(paramString); // Parse params like ?view=123&page=2

        console.log(`Hash changed: section=${sectionId}, params=`, Object.fromEntries(params));

        // Extract specific params if needed, e.g., viewId
        const viewId = params.get('view') || params.get('edit'); // Check for view or edit param

        navigateCallback(sectionId || 'dashboard', Object.fromEntries(params), viewId);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial load based on hash
    handleHashChange(); // Call once on load

    // --- History API Routing (More Advanced - Requires Server Config) ---
    /*
    const handlePopState = (event) => {
        console.log("Popstate event:", event.state); // State object pushed with pushState
        // Get path and params from window.location
        const path = window.location.pathname.replace('/admin/', ''); // Assuming base path /admin/
        const params = new URLSearchParams(window.location.search);
        const sectionId = path.split('/')[0] || 'dashboard'; // Extract section from path
        const viewId = path.split('/')[1]; // Example: /admin/products/edit/123 -> viewId = edit

        console.log(`Popstate: path=${path}, section=${sectionId}, viewId=${viewId}, params=`, Object.fromEntries(params));
        // Pass relevant info to the callback
        navigateCallback(sectionId, Object.fromEntries(params), viewId);
    };

    window.addEventListener('popstate', handlePopState);

    // Initial load based on path
    handlePopState({ state: null }); // Call once on load

    // Function to navigate programmatically using History API
    window.navigateTo = (path, title = '', state = {}) => {
        const fullPath = `/admin${path.startsWith('/') ? '' : '/'}${path}`; // Ensure leading slash
        console.log(`Navigating (pushState) to: ${fullPath}`);
        window.history.pushState(state, title, fullPath);
        // Manually trigger the handler after pushState as popstate doesn't fire
        handlePopState({ state: state });
    };
    */

    console.log("Router initialized (using Hash routing by default).");
}

/**
 * Updates the URL hash without triggering a full navigation (useful for filters/pagination).
 * @param {object} params - Parameters to set in the hash query string.
 * @param {string} sectionId - The current section ID.
 */
export function updateUrlHashParams(params, sectionId) {
    const currentHash = window.location.hash.substring(1);
    const currentBase = currentHash.split('?')[0] || sectionId; // Keep current section base
    const newParams = new URLSearchParams(params);
    const newHash = `${currentBase}?${newParams.toString()}`;

    // Update hash without triggering hashchange immediately (or use replaceState for History API)
    // This might still trigger hashchange depending on browser, handle potential loops in handler.
    // A more robust solution might involve temporarily removing/re-adding the listener or using flags.
    // console.log(`Updating hash to: #${newHash}`);
    if (`#${newHash}` !== window.location.hash) {
        // Only update if different to avoid unnecessary history entries
        window.location.hash = newHash;
    }
}


console.log("Routing Service loaded"); // Debug log