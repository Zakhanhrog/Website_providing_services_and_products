
// js/ui.js
import * as DOM from './domElements.js';
import { showElement, hideElement, flexElement, displayEmptyState as utilDisplayEmptyState } from './utils.js';
import { resizeAllCharts } from './services/chartService.js';
import { updateUrlHashParams } from './services/routingService.js';

// --- State (Keep UI-related state here if simple) ---
let activeDropdown = null; // Track currently open dropdown

// --- Sidebar ---
/** Handles sidebar toggling for both desktop and mobile. */
export function handleSidebarToggle() {
    if (!DOM.sidebar || !DOM.mainContent) return;

    const isMobile = window.innerWidth <= 992;

    if (isMobile) {
        const isActive = DOM.sidebar.classList.toggle('active');
        toggleMobileSidebarOverlay(isActive);
        // Add/remove body class for overflow handling if needed
        document.body.classList.toggle('mobile-sidebar-open', isActive);
    } else {
        const isCollapsed = document.body.classList.toggle('admin-sidebar-collapsed');
        DOM.sidebar.classList.toggle('collapsed', isCollapsed);
        DOM.mainContent.classList.toggle('sidebar-collapsed', isCollapsed);

        // Resize charts after the transition completes
        // Use requestAnimationFrame for smoother resize after layout changes
        setTimeout(() => {
            requestAnimationFrame(resizeAllCharts);
        }, 300); // Match CSS transition duration + buffer
    }
}

/** Toggles the body overlay for mobile sidebar. */
function toggleMobileSidebarOverlay(isActive) {
    if (window.innerWidth <= 992) {
        document.body.classList.toggle('sidebar-open-overlay', isActive);
    } else {
        // Ensure overlay is removed if window resized larger while mobile open
        document.body.classList.remove('sidebar-open-overlay');
    }
}

/** Updates the active state of sidebar links */
export function updateSidebarLinks(activeSectionId) {
    DOM.sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === activeSectionId);
        // Update aria-current
        if (link.dataset.section === activeSectionId) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// --- Header Dropdowns ---
/** Toggles header dropdown panels (Notifications, User Menu). */
export function toggleDropdown(panel, button) {
    if (!panel || !button) return;

    const isActive = panel.classList.contains('active');

    // Close any other active dropdown first
    closeAllDropdowns();

    if (!isActive) {
        panel.classList.add('active');
        button.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        panel.style.visibility = 'visible'; // Ensure visibility is set before animation
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
        activeDropdown = { panel, button }; // Track the open dropdown

        // Specific action when opening notifications
        if (panel === DOM.notificationPanel) {
            // Dynamically import and call loadNotifications to avoid circular dependency issues
            // if ui.js imports notifications.js and notifications.js imports ui.js
            import('../sections/notifications.js').then(module => {
                module.loadNotifications();
            }).catch(err => console.error("Error loading notification module:", err));
        }
    }
}

/** Closes all active header dropdowns. */
export function closeAllDropdowns() {
    if (activeDropdown) {
        activeDropdown.panel.classList.remove('active');
        activeDropdown.button.classList.remove('active');
        activeDropdown.panel.setAttribute('aria-hidden', 'true');
        activeDropdown.button.setAttribute('aria-expanded', 'false');
        activeDropdown.panel.style.opacity = '0';
        activeDropdown.panel.style.transform = 'translateY(10px)';
        // Reset visibility after transition (match transition duration)
        setTimeout(() => {
            // Check if it's still closed before hiding visibility
            if (!activeDropdown?.panel.classList.contains('active')) {
                activeDropdown.panel.style.visibility = 'hidden';
            }
        }, 300); // Match CSS transition
        activeDropdown = null; // Clear tracked dropdown
    }
    // Ensure all are visually closed even if state was inconsistent
    document.querySelectorAll('.notification-panel.active, .user-dropdown.active').forEach(p => {
        p.classList.remove('active');
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
        p.setAttribute('aria-hidden', 'true');
        setTimeout(() => { p.style.visibility = 'hidden'; }, 300);
    });
    document.querySelectorAll('#adminNotificationBell.active, #adminUserMenuToggle.active').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-expanded', 'false');
    });
}

// --- Global Click Listener Logic (to be added in main.js) ---
export function handleGlobalClick(event) {
    // Close dropdowns if click is outside
    const clickedOutsideDropdowns = !activeDropdown ||
        ![activeDropdown.panel, activeDropdown.button].some(el => el?.contains(event.target));

    if (clickedOutsideDropdowns) {
        closeAllDropdowns();
    }

    // Close mobile sidebar if click is outside
    const isMobile = window.innerWidth <= 992;
    const sidebarIsOpen = DOM.sidebar?.classList.contains('active');
    const clickedOutsideSidebar = isMobile && sidebarIsOpen &&
        !DOM.sidebar.contains(event.target) &&
        event.target !== DOM.sidebarToggle &&
        !DOM.sidebarToggle?.contains(event.target);

    if (clickedOutsideSidebar) {
        DOM.sidebar.classList.remove('active');
        toggleMobileSidebarOverlay(false);
        document.body.classList.remove('mobile-sidebar-open');
    }
}

// --- Section Management ---

/** Hides all detail/form views within potentially active sections */
export function hideAllDetailViews() {
    hideElement(DOM.productFormContainer);
    hideElement(DOM.orderDetailView);
    hideElement(DOM.serviceDetailView);
    hideElement(DOM.customerDetailView);
    // Add others if needed
}

/** Restores the list view elements (table, pagination, filters) for a given section ID */
export function restoreListView(sectionId) {
    console.log(`Restoring list view elements for section: ${sectionId}`);
    switch(sectionId) {
        case 'products':
            showElement(DOM.productListView, 'block');
            showElement(DOM.productPagination, 'block');
            flexElement(DOM.productFiltersContainer); // Use flexElement if styled with display:flex
            flexElement(DOM.productBulkActionsContainer);
            hideElement(DOM.productFormContainer); // Ensure form is hidden
            break;
        case 'orders':
            showElement(DOM.orderListView, 'block');
            showElement(DOM.orderPagination, 'block');
            flexElement(DOM.orderFiltersContainer);
            flexElement(DOM.orderBulkActionsContainer);
            hideElement(DOM.orderDetailView);
            break;
        case 'services':
            showElement(DOM.servicesSection?.querySelector('.table-responsive'), 'block');
            showElement(DOM.servicePagination, 'block');
            flexElement(DOM.serviceFiltersContainer);
            hideElement(DOM.serviceDetailView);
            break;
        case 'customers':
            showElement(DOM.customersSection?.querySelector('.table-responsive'), 'block');
            showElement(DOM.customerPagination, 'block');
            flexElement(DOM.customerFiltersContainer);
            hideElement(DOM.customerDetailView);
            break;
        // Add cases for other sections like 'admins' if they have list views
        case 'admins':
            showElement(DOM.adminsSection?.querySelector('.table-responsive'), 'block');
            // Hide admin form if it exists
            // hideElement(DOM.adminFormContainer);
            break;
    }
}

/** Hides list view elements for a given section ID, preparing for detail/form view */
export function hideListView(sectionId) {
    console.log(`Hiding list view elements for section: ${sectionId}`);
    switch(sectionId) {
        case 'products':
            hideElement(DOM.productListView);
            hideElement(DOM.productPagination);
            hideElement(DOM.productFiltersContainer);
            hideElement(DOM.productBulkActionsContainer);
            break;
        case 'orders':
            hideElement(DOM.orderListView);
            hideElement(DOM.orderPagination);
            hideElement(DOM.orderFiltersContainer);
            hideElement(DOM.orderBulkActionsContainer);
            break;
        case 'services':
            hideElement(DOM.servicesSection?.querySelector('.table-responsive'));
            hideElement(DOM.servicePagination);
            hideElement(DOM.serviceFiltersContainer);
            break;
        case 'customers':
            hideElement(DOM.customersSection?.querySelector('.table-responsive'));
            hideElement(DOM.customerPagination);
            hideElement(DOM.customerFiltersContainer);
            break;
        case 'admins':
            hideElement(DOM.adminsSection?.querySelector('.table-responsive'));
            break;
    }
}

// --- Tabs ---
/**
 * Generic tab setup logic.
 * @param {NodeListOf<Element>} tabLinks - The tab link elements.
 * @param {NodeListOf<Element>} tabContents - The corresponding tab content elements.
 * @param {string} [activeTabIdFromUrl] - Optional: ID of the tab to activate based on URL param.
 */
export function setupTabs(tabLinks, tabContents, activeTabIdFromUrl = null) {
    if (!tabLinks || tabLinks.length === 0 || !tabContents || tabContents.length === 0) {
        return; // No tabs or content to set up
    }

    // Reset previous listeners if any (safer)
    tabLinks.forEach(link => {
        // Clone and replace to remove listeners effectively
        link.replaceWith(link.cloneNode(true));
    });
    // Re-select the links after cloning
    const newTabLinks = tabLinks[0]?.closest('.tabs')?.querySelectorAll('.tab-link');
    if (!newTabLinks) return;

    newTabLinks.forEach(link => {
        link.addEventListener('click', handleTabClick);
    });

    let tabToActivate = null;

    // 1. Check if a specific tab needs activation from URL
    if (activeTabIdFromUrl) {
        tabToActivate = Array.from(newTabLinks).find(l => l.dataset.tab === activeTabIdFromUrl);
    }

    // 2. If not from URL, check if any tab already has 'active' class in HTML
    if (!tabToActivate) {
        tabToActivate = Array.from(newTabLinks).find(l => l.classList.contains('active'));
    }

    // 3. If still none, activate the first tab
    if (!tabToActivate && newTabLinks.length > 0) {
        tabToActivate = newTabLinks[0];
    }

    // Activate the determined tab
    if (tabToActivate) {
        activateTab(tabToActivate, tabContents, newTabLinks);
    }
}

/** Handles clicks on tab links. */
function handleTabClick(event) {
    event.preventDefault();
    const clickedLink = event.currentTarget;
    const parentNav = clickedLink.closest('.tabs');
    if (!parentNav) return;

    // Find sibling links and content panels relative to the tab navigation's parent
    const siblingLinks = parentNav.querySelectorAll('.tab-link');
    // Find content panes relative to the parent of the tab navigation
    // Assumes content panes are direct children siblings of the .tabs element
    const contentContainer = parentNav.parentElement;
    const siblingContents = contentContainer.querySelectorAll(':scope > .tab-content');

    activateTab(clickedLink, siblingContents, siblingLinks);

    // Optional: Update URL hash to reflect the active tab
    // const tabId = clickedLink.dataset.tab;
    // if (tabId) {
    //      // Be careful with replacing vs adding params
    //      // updateUrlHashParams({ tab: tabId }, currentSectionId); // Needs currentSectionId
    // }
}

/** Activates a specific tab and its content panel. */
function activateTab(linkToActivate, contentPanels, tabLinks) {
    const tabId = linkToActivate.dataset.tab;
    if (!tabId) {
        console.warn("Tab link missing 'data-tab' attribute:", linkToActivate);
        return;
    }

    // Deactivate all other links and content panels
    tabLinks.forEach(l => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
        l.setAttribute('tabindex', '-1'); // Not focusable when inactive
    });
    contentPanels.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('hidden', ''); // Hide inactive content
    });

    // Activate the clicked link and corresponding content
    linkToActivate.classList.add('active');
    linkToActivate.setAttribute('aria-selected', 'true');
    linkToActivate.setAttribute('tabindex', '0'); // Focusable when active

    const activeContent = Array.from(contentPanels).find(c => c.id === tabId);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.removeAttribute('hidden'); // Show active content
    } else {
        console.warn(`Tab content with id "${tabId}" not found.`);
    }
}

// --- Table Interaction ---

/**
 * Sets up 'Select All' and individual checkbox logic for a table.
 * Enables/disables the associated bulk action button.
 * @param {HTMLInputElement} selectAllCheckbox - The 'select all' checkbox element.
 * @param {string} itemCheckboxesSelector - CSS selector for individual item checkboxes within the parent.
 * @param {HTMLElement} parentElement - The parent element containing the table and bulk actions.
 * @param {HTMLButtonElement} bulkActionButton - The button to enable/disable.
 * @param {HTMLSelectElement} bulkActionSelect - The select dropdown for bulk actions.
 */
export function setupTableSelection(selectAllCheckbox, itemCheckboxesSelector, parentElement, bulkActionButton, bulkActionSelect) {
    if (!selectAllCheckbox || !parentElement || !bulkActionButton) {
        // console.warn("Missing elements for table selection setup.");
        return;
    }

    const itemCheckboxes = parentElement.querySelectorAll(itemCheckboxesSelector);

    const updateButtonState = () => {
        const checkedCount = parentElement.querySelectorAll(`${itemCheckboxesSelector}:checked`).length;
        bulkActionButton.disabled = (checkedCount === 0);
        // Optional: Reset select dropdown if nothing is selected
        // if (checkedCount === 0 && bulkActionSelect) {
        //    bulkActionSelect.value = '';
        // }
    };

    const handleSelectAllChange = () => {
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        selectAllCheckbox.indeterminate = false; // Reset indeterminate state
        updateButtonState();
    };

    const handleItemCheckboxChange = () => {
        const totalItems = itemCheckboxes.length;
        const checkedItems = parentElement.querySelectorAll(`${itemCheckboxesSelector}:checked`).length;

        if (totalItems === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedItems === totalItems) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedItems === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true; // Set indeterminate state
        }
        updateButtonState();
    };

    // Remove old listeners before adding new ones (using replaceWith to be sure)
    const newSelectAllCheckbox = selectAllCheckbox.cloneNode(true);
    selectAllCheckbox.parentNode.replaceChild(newSelectAllCheckbox, selectAllCheckbox);
    newSelectAllCheckbox.addEventListener('change', handleSelectAllChange);

    itemCheckboxes.forEach(checkbox => {
        const newCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
        newCheckbox.addEventListener('change', handleItemCheckboxChange);
    });

    // Initial state check
    handleItemCheckboxChange(); // Update based on current checkboxes
}

/**
 * Collects selected item IDs from a table.
 * @param {string} itemCheckboxesSelector - CSS selector for individual item checkboxes.
 * @param {HTMLElement} parentElement - The parent element containing the table.
 * @returns {string[]} - Array of selected item IDs (values of checked checkboxes).
 */
export function getSelectedTableIds(itemCheckboxesSelector, parentElement) {
    if (!parentElement) return [];
    const selectedCheckboxes = parentElement.querySelectorAll(`${itemCheckboxesSelector}:checked`);
    return Array.from(selectedCheckboxes).map(cb => cb.value);
}

/**
 * Resets table selection state.
 * @param {HTMLInputElement} selectAllCheckbox - The 'select all' checkbox element.
 * @param {string} itemCheckboxesSelector - CSS selector for individual item checkboxes.
 * @param {HTMLElement} parentElement - The parent element containing the table.
 * @param {HTMLButtonElement} bulkActionButton - The button to disable.
 * @param {HTMLSelectElement} [bulkActionSelect] - Optional: The select dropdown to reset.
 */
export function resetTableSelection(selectAllCheckbox, itemCheckboxesSelector, parentElement, bulkActionButton, bulkActionSelect) {
    if (!selectAllCheckbox || !parentElement || !bulkActionButton) return;
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    parentElement.querySelectorAll(itemCheckboxesSelector).forEach(cb => { cb.checked = false; });
    bulkActionButton.disabled = true;
    if (bulkActionSelect) {
        bulkActionSelect.value = '';
    }
}

// --- Pagination Rendering ---
/**
 * Renders pagination controls.
 * @param {HTMLElement} container - The container for pagination links.
 * @param {object} paginationData - Pagination data from API ({ currentPage, totalPages, totalItems, itemsPerPage }).
 * @param {string} sectionId - The section the pagination belongs to.
 * @param {Function} navigateCallback - The function to call when a page link is clicked (e.g., main setActiveSection).
 * @param {object} currentParams - Current filter/sort parameters for the section.
 */
export function renderPagination(container, paginationData, sectionId, navigateCallback, currentParams = {}) {
    if (!container || !paginationData || !paginationData.totalPages || paginationData.totalPages <= 1) {
        if (container) container.innerHTML = ''; // Clear if no pagination needed
        return;
    }

    const { currentPage, totalPages } = paginationData;
    let paginationHTML = '<ul class="pagination">';

    // Previous Button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" data-section="${sectionId}" aria-label="Trang trước">«</a>
        </li>`;

    // Page Number Buttons (with ellipsis)
    const maxPagesToShow = 5; // Max number of page links shown around current page
    let startPage, endPage;

    if (totalPages <= maxPagesToShow + 2) { // Show all if few pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // Calculate start and end pages with ellipsis logic
        const maxPagesBeforeCurrent = Math.floor((maxPagesToShow - 1) / 2);
        const maxPagesAfterCurrent = Math.ceil((maxPagesToShow - 1) / 2);

        if (currentPage <= maxPagesBeforeCurrent + 1) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }

    // Ellipsis and first page link
    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1" data-section="${sectionId}">1</a></li>`;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Numbered page links
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}" data-section="${sectionId}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</a>
            </li>`;
    }

    // Ellipsis and last page link
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}" data-section="${sectionId}">${totalPages}</a></li>`;
    }

    // Next Button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" data-section="${sectionId}" aria-label="Trang sau">»</a>
        </li>`;

    paginationHTML += '</ul>';
    container.innerHTML = paginationHTML;

    // Add event listeners to the new links (must be done after setting innerHTML)
    container.querySelectorAll('.page-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(link.dataset.page);
            const targetSection = link.dataset.section;
            // Ensure it's a valid page, belongs to the *currently* active section (or navigate if different?)
            // And not disabled
            if (!isNaN(page) && !link.closest('.page-item').classList.contains('disabled')) {
                const newParams = { ...currentParams, page: page }; // Merge current filters with new page
                console.log(`Pagination click: Navigating section ${targetSection} with params`, newParams);
                // Update URL hash before calling navigateCallback
                updateUrlHashParams(newParams, targetSection);
                // Call the main navigation function
                // navigateCallback(targetSection, newParams);
            }
        });
    });
}

/**
 * Displays an empty state specifically for tables.
 * @param {HTMLElement} tableBody - The tbody element.
 * @param {string} message - The message to display.
 * @param {number} [colspan=1] - Colspan for the cell.
 */
export function displayTableEmptyState(tableBody, message, colspan = 1) {
    utilDisplayEmptyState(tableBody, message, colspan);
}


console.log("UI Service loaded"); // Debug log

