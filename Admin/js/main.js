// js/main.js

// --- Imports ---
import * as Config from './config.js';
import * as DOM from './domElements.js';
import apiService from './api.js';
import * as Utils from './utils.js';
import * as UI from './ui.js';
import * as ChartService from './services/chartService.js';
import * as LibraryService from './services/libraryService.js'; // Placeholder imports
import * as Router from './services/routingService.js';
import * as Auth from './auth.js';
import * as Notifications from './sections/notifications.js';

// Import section modules
import * as Dashboard from './sections/dashboard.js';
import * as Products from './sections/products.js';
import * as Orders from './sections/orders.js';
import * as Services from './sections/services.js';
import * as Customers from './sections/customers.js';
import * as Reports from './sections/reports.js';
import * as Settings from './sections/settings.js';
// import * as Content from './sections/content.js'; // Placeholder
// import * as Admins from './sections/admins.js'; // Placeholder

// --- Global State ---
let activeAdminSectionId = null; // Start null, set during navigation
let isLoadingSection = false; // Global loading flag for section switching/major actions

// --- Navigation ---

/**
 * Central navigation function. Activates the specified section, updates UI, fetches data.
 * Called by sidebar links, routing changes, etc.
 * @param {string} sectionId - The ID of the section to activate (e.g., 'dashboard', 'products').
 * @param {object} [params={}] - Optional parameters for data fetching or view state (filters, page, view/edit ID).
 * @param {string|null} [viewOrEditId=null] - Specific ID for detail/edit view if provided separately.
 */
async function navigateToSection(sectionId, params = {}, viewOrEditId = null) {
    const targetSectionId = sectionId || 'dashboard'; // Default to dashboard

    // Check if already loading or trying to navigate to the same section+params (basic check)
    if (isLoadingSection) {
        Utils.showToast("Vui lòng đợi, thao tác trước đang được xử lý.", "warning");
        return;
    }
    // More robust check: compare targetSectionId and serialized params
    const targetParamsString = new URLSearchParams(params).toString();
    const currentParamsString = new URLSearchParams(Router.getCurrentParams ? Router.getCurrentParams() : {}).toString(); // Assumes router provides current params
    // if (targetSectionId === activeAdminSectionId && targetParamsString === currentParamsString) {
    //    console.log(`Section ${targetSectionId} with same params already active.`);
    //    return;
    // }

    console.log(`Navigating to section: ${targetSectionId} with params:`, params, `View/Edit ID: ${viewOrEditId}`);
    isLoadingSection = true;
    const previousSectionId = activeAdminSectionId;
    activeAdminSectionId = targetSectionId; // Set active section ID immediately

    const targetSectionElement = document.getElementById(`${targetSectionId}-section`);
    if (!targetSectionElement) {
        console.error(`Section element not found for ID: ${targetSectionId}-section`);
        Utils.showToast(`Lỗi: Không tìm thấy khu vực '${targetSectionId}'.`, 'error');
        isLoadingSection = false;
        activeAdminSectionId = previousSectionId; // Revert active section ID
        // Optionally navigate back to dashboard or previous section
        // window.location.hash = '#dashboard';
        return;
    }

    // --- UI Updates ---
    UI.closeAllDropdowns();
    Utils.showLoading(targetSectionElement); // Show loading specific to the target section
    UI.updateSidebarLinks(targetSectionId); // Update sidebar highlights

    // Deactivate previous section and hide its specific detail views
    if (previousSectionId && previousSectionId !== targetSectionId) {
        const previousSectionElement = document.getElementById(`${previousSectionId}-section`);
        previousSectionElement?.classList.remove('active');
        // Potentially destroy components from previous section (charts, editors)
        if (previousSectionId === 'dashboard' || previousSectionId === 'reports') {
            // ChartService.destroyCharts(); // destroyCharts is called within initChartsForSection
        }
        if (previousSectionId === 'products') {
            // LibraryService.destroyWysiwyg('#productDescription'); // Destroy form elements when leaving section
            // LibraryService.destroySelectComponents('#productCategory');
        }
        // Add similar cleanup for other sections if needed
    } else if (!previousSectionId) {
        // Hide all sections initially if no previous section
        DOM.adminSections.forEach(section => section.classList.remove('active'));
    }

    // Activate new section element
    targetSectionElement.classList.add('active');

    // Close mobile sidebar if open
    if (window.innerWidth <= 992 && DOM.sidebar?.classList.contains('active')) {
        DOM.sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open-overlay');
        document.body.classList.remove('mobile-sidebar-open');
    }

    // Scroll to top of main content area
    DOM.mainContent?.scrollTo(0, 0);

    // --- Data Loading & Rendering ---
    try {
        // Determine if we need to show a detail/edit view or the list view
        const idToShow = viewOrEditId || params.view || params.edit;
        let loadListView = true;

        // Load data based on section
        switch (targetSectionId) {
            case 'dashboard':
                await Dashboard.loadDashboardData(navigateToSection); // Pass navigator for internal links
                loadListView = false; // Dashboard is not a list/detail pattern
                break;
            case 'products':
                if (idToShow) {
                    await Products.showProductForm(idToShow); // Show form handles its own data loading
                    loadListView = false;
                } else {
                    // Ensure form is hidden if navigating back to list view explicitly
                    Products.hideProductForm();
                    await Products.loadProductListData(params, navigateToSection);
                }
                break;
            case 'orders':
                if (idToShow) {
                    await Orders.showOrderDetail(idToShow); // Show detail handles its own data loading
                    loadListView = false;
                } else {
                    UI.hideAllDetailViews(); // Ensure detail view is hidden
                    await Orders.loadOrderListData(params, navigateToSection);
                }
                break;
            case 'services':
                if (idToShow) {
                    await Services.showServiceDetail(idToShow);
                    loadListView = false;
                } else {
                    UI.hideAllDetailViews();
                    await Services.loadServiceListData(params, navigateToSection);
                }
                break;
            case 'customers':
                if (idToShow) {
                    await Customers.showCustomerDetail(idToShow);
                    loadListView = false;
                } else {
                    UI.hideAllDetailViews();
                    await Customers.loadCustomerListData(params, navigateToSection);
                }
                break;
            case 'reports':
                await Reports.loadReportData(params);
                loadListView = false; // Reports don't have list/detail
                break;
            case 'settings':
                // Load data for the initially active or specified tab
                const activeTabId = params.tab ? `settings-${params.tab}` : null;
                UI.setupTabs(DOM.settingsTabs, DOM.settingsTabContents, activeTabId);
                const activeTabLink = DOM.settingsSection.querySelector('.settings-tabs .tab-link.active');
                const tabNameToLoad = activeTabLink?.dataset?.tab?.replace('settings-', '') || 'general';
                await Settings.loadSettingsTabData(tabNameToLoad);
                loadListView = false;
                break;
            case 'content':
                // Placeholder: Load initial content data/setup tabs
                UI.setupTabs(DOM.contentTabs, DOM.contentTabContents);
                console.warn(`Content section loading logic not fully implemented.`);
                loadListView = false;
                break;
            case 'admins':
                // Placeholder: Load admin accounts list
                // UI.hideAllDetailViews(); // Hide admin form if implemented
                // await Admins.loadAdminListData(params, navigateToSection);
                console.warn(`Admins section loading logic not fully implemented.`);
                break;
            default:
                console.warn(`No specific load function defined for section: ${targetSectionId}`);
                Utils.displayEmptyState(targetSectionElement, `Khu vực '${targetSectionId}' chưa được cài đặt.`, 1);
                loadListView = false;
        }

        // Restore list view elements if appropriate
        if (loadListView) {
            UI.restoreListView(targetSectionId);
        }

    } catch (error) {
        // Error should have been shown by the specific load function
        console.error(`Error loading section ${targetSectionId}:`, error);
        Utils.displayEmptyState(targetSectionElement, `Không thể tải dữ liệu cho khu vực ${targetSectionId}. Vui lòng thử lại.`, 1);
    } finally {
        Utils.hideLoading(targetSectionElement);
        isLoadingSection = false;
    }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    console.log("Setting up event listeners...");

    // --- Sidebar Links & Toggle ---
    DOM.sidebarLinks.forEach(link => {
        const section = link.dataset.section;
        if (section && section !== '#' && !link.id?.includes('Logout')) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                // Use Router to navigate, which will call navigateToSection
                Router.updateUrlHashParams({}, section); // Basic hash update
                // For History API: window.navigateTo(`/${section}`);
            });
        } else if (!section && !link.id?.includes('Logout')) {
            // Handle non-section links if any
            link.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.showToast(`Navigation for "${link.textContent.trim()}" is not implemented yet.`, 'info');
            });
        }
    });
    DOM.sidebarToggle?.addEventListener('click', UI.handleSidebarToggle);

    // --- Header ---
    DOM.notificationBell?.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent global click closing it immediately
        UI.toggleDropdown(DOM.notificationPanel, DOM.notificationBell);
    });
    DOM.userMenuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        UI.toggleDropdown(DOM.userDropdown, DOM.userMenuToggle);
    });
    DOM.clearAdminNotificationsBtn?.addEventListener('click', Notifications.handleClearNotifications);
    // Notification item clicks are handled within Notifications.loadNotifications

    // --- Logout ---
    DOM.logoutLinkSidebar?.addEventListener('click', Auth.handleAdminLogout);
    DOM.logoutLinkDropdown?.addEventListener('click', Auth.handleAdminLogout);

    // --- Global Click Listener ---
    document.addEventListener('click', UI.handleGlobalClick);

    // --- Section Specific Event Delegation ---

    // Products
    DOM.productsSection?.addEventListener('click', (event) => {
        if (event.target.closest('.btn-add-product')) {
            // Use router to navigate to the add form state
            Router.updateUrlHashParams({ edit: 'new' }, 'products'); // Or just { add: true }
            // navigateToSection('products', { edit: 'new' }, 'new'); // Direct call if not using router fully
        } else if (event.target.closest('.btn-cancel-product')) {
            Products.hideProductForm();
            // Navigate back to list view using router or direct call
            Router.updateUrlHashParams({}, 'products');
            // navigateToSection('products', currentProductParams);
        } else if (event.target.closest('.btn-edit-product, .link-edit-product, .btn-delete-product, .btn-duplicate-product')) {
            Products.handleProductTableClick(event, navigateToSection); // Pass navigator
        } else if (event.target.closest('#applyProductBulkAction')) {
            Products.handleProductBulkAction(navigateToSection);
        }
        // Add listener for filter buttons if needed
        else if (event.target.closest('.btn-apply-filters')) {
            // Gather filter values
            const params = {
                search: DOM.productsSection.querySelector('#productFilterName')?.value,
                category: DOM.productsSection.querySelector('#productFilterCategory')?.value,
                // ... other filters
                page: 1 // Reset to page 1 when applying filters
            };
            // Remove empty params
            Object.keys(params).forEach(key => !params[key] && delete params[key]);
            Router.updateUrlHashParams(params, 'products');
            // navigateToSection('products', params);
        }
    });
    DOM.productForm?.addEventListener('submit', (e) => Products.handleProductFormSubmit(e, navigateToSection));
    DOM.manageStockCheckbox?.addEventListener('change', Products.handleStockCheckboxChange); // Direct listener might be ok here

    // Orders
    DOM.ordersSection?.addEventListener('click', (event) => {
        if (event.target.closest('.link-view-order, .btn-view-order')) {
            event.preventDefault();
            const orderId = event.target.closest('[data-order-id]')?.dataset.orderId;
            if (orderId) {
                Router.updateUrlHashParams({ view: orderId }, 'orders');
                // navigateToSection('orders', { view: orderId }, orderId);
            }
        } else if (event.target.closest('.link-view-customer')) {
            event.preventDefault();
            const customerId = event.target.closest('[data-customer-id]')?.dataset.customerId;
            if (customerId) {
                Router.updateUrlHashParams({ view: customerId }, 'customers');
                // navigateToSection('customers', { view: customerId }, customerId);
            }
        } else if (event.target.closest('#applyOrderBulkAction')) {
            Orders.handleOrderBulkAction(navigateToSection);
        } else if (event.target.closest('.btn-print-invoice')) {
            event.preventDefault();
            const orderId = event.target.closest('[data-order-id]')?.dataset.orderId;
            Orders.handlePrintInvoice(orderId); // Needs implementation in orders.js
        }
        // Add listener for filter buttons
    });
    DOM.ordersSection?.addEventListener('change', (event) => { // Delegated change for status dropdown
        if (event.target.classList.contains('order-status-dropdown')) {
            Orders.handleOrderInlineStatusChange(event);
        }
    });
    // Order Detail Actions (specific buttons if needed)
    DOM.orderDetailView?.addEventListener('click', (event) => {
        if (event.target.closest('#saveOrderDetailBtn') || event.target.closest('.btn-add-note')) {
            event.preventDefault();
            const orderId = DOM.orderDetailIdSpan?.textContent;
            if (orderId) Orders.handleSaveOrderDetail(orderId);
        }
        // Add handler for refund button, print detail etc.
        else if (event.target.closest('.btn-close-detail')) {
            UI.hideAllDetailViews();
            Router.updateUrlHashParams({}, 'orders');
            // navigateToSection('orders', currentOrderParams);
        }
    });


    // Services (Similar structure to Orders)
    DOM.servicesSection?.addEventListener('click', (event) => {
        if (event.target.closest('.link-view-service, .btn-view-service')) {
            event.preventDefault();
            const serviceId = event.target.closest('[data-service-id]')?.dataset.serviceId;
            if (serviceId) Router.updateUrlHashParams({ view: serviceId }, 'services');
        }
        // ... other listeners (customer link, filters) ...
    });
    DOM.servicesSection?.addEventListener('change', (event) => {
        if (event.target.classList.contains('service-status-dropdown') || event.target.classList.contains('service-assignee-dropdown')) {
            Services.handleServiceInlineChange(event);
        }
    });
    DOM.serviceDetailView?.addEventListener('click', (event) => {
        if (event.target.closest('#saveServiceDetailBtn') || event.target.closest('.btn-add-service-note')) {
            event.preventDefault();
            const serviceId = DOM.serviceDetailIdSpan?.textContent;
            if (serviceId) Services.handleSaveServiceDetail(serviceId);
        } else if (event.target.closest('.btn-close-detail')) {
            UI.hideAllDetailViews();
            Router.updateUrlHashParams({}, 'services');
        }
    });

    // Customers (Similar structure)
    DOM.customersSection?.addEventListener('click', (event) => {
        if (event.target.closest('.link-view-customer, .btn-view-customer')) {
            event.preventDefault();
            const customerId = event.target.closest('[data-customer-id]')?.dataset.customerId;
            if (customerId) Router.updateUrlHashParams({ view: customerId }, 'customers');
        } else if (event.target.closest('.btn-delete-customer')) {
            Customers.handleDeleteCustomer(event, navigateToSection); // Pass navigator if needed after delete
        } else if (event.target.closest('.btn-email-customer')) {
            event.preventDefault();
            const email = event.target.closest('[data-customer-email]')?.dataset.customerEmail;
            if(email) window.location.href = `mailto:${email}`;
            else Utils.showToast("Không tìm thấy địa chỉ email.", "warning");
        }
        // ... other listeners (filters) ...
    });
    DOM.customerDetailView?.addEventListener('click', (event) => {
        if (event.target.closest('#saveCustomerNoteBtn')) {
            event.preventDefault();
            // Assuming customer ID is stored or accessible
            const customerId = DOM.customerDetailView?.dataset.customerId; // Example storage
            if (customerId) Customers.handleSaveCustomerNote(customerId);
        } else if (event.target.closest('.btn-close-detail')) {
            UI.hideAllDetailViews();
            Router.updateUrlHashParams({}, 'customers');
        }
        // Add listeners for address edit/delete if needed
    });

    // Settings
    DOM.settingsSection?.addEventListener('submit', (event) => {
        if (event.target.matches('#generalSettingsForm')) {
            Settings.handleGeneralSettingsSubmit(event);
        } else if (event.target.matches('#seoSettingsForm')) {
            Settings.handleSeoSettingsSubmit(event); // Needs implementation
        }
        // Add submit handlers for other forms if they exist
    });
    DOM.settingsSection?.addEventListener('click', (event) => {
        if (event.target.matches('#savePaymentSettingsBtn')) {
            Settings.handlePaymentSettingsSubmit(event); // Assuming it gathers data without form submit
        } else if (event.target.matches('#saveShippingSettingsBtn')) {
            Settings.handleShippingSettingsSubmit(event); // Needs implementation
        } else if (event.target.matches('#saveEmailSettingsBtn')) {
            Settings.handleEmailSettingsSubmit(event); // Needs implementation
        }
    });
    // VNPAY toggle listener (direct is fine here)
    if (DOM.vnpayEnabledCheckbox) {
        const toggleVnpayDetails = () => {
            if (DOM.vnpayDetailsDiv) {
                DOM.vnpayDetailsDiv.style.display = DOM.vnpayEnabledCheckbox.checked ? 'block' : 'none';
            }
        };
        DOM.vnpayEnabledCheckbox.addEventListener('change', toggleVnpayDetails);
        // toggleVnpayDetails(); // Initial state handled by loadSettingsTabData
    }

    // Admins (Placeholder Listeners)
    DOM.adminsSection?.addEventListener('click', (event) => {
        if (event.target.closest('.btn-add-admin')) {
            console.log("Placeholder: Show Add Admin Form");
            // Admins.showAdminForm();
        } else if (event.target.closest('.btn-edit-admin')) {
            const adminId = event.target.closest('tr').dataset.adminId; // Example
            console.log(`Placeholder: Show Edit Admin Form for ID: ${adminId}`);
            // Admins.showAdminForm(adminId);
        } else if (event.target.closest('.btn-delete-admin')) {
            const adminId = event.target.closest('tr').dataset.adminId;
            console.log(`Placeholder: Delete Admin ID: ${adminId}`);
            // Admins.handleDeleteAdmin(adminId);
        }
    });

    // --- Window Resize Listener ---
    // Debounce resize handler for performance
    window.addEventListener('resize', Utils.debounce(() => {
        console.log("Window resized");
        // Close mobile overlay if window becomes large
        if (window.innerWidth > 992 && document.body.classList.contains('sidebar-open-overlay')) {
            document.body.classList.remove('sidebar-open-overlay');
            document.body.classList.remove('mobile-sidebar-open');
            DOM.sidebar?.classList.remove('active');
        }
        // Adjust sidebar collapse state based on width if needed (e.g., force collapse on very small screens)
        ChartService.resizeAllCharts(); // Resize charts on debounced resize
    }, 250)); // Debounce delay

    console.log("Event listeners setup complete.");
}

// =========================================================================
// Initialization
// =========================================================================
function initializeAdminDashboard() {
    console.log("Initializing Admin Dashboard...");

    if (!DOM.adminContainer) {
        console.error("FATAL: Admin container not found. Stopping initialization.");
        return;
    }

    setupEventListeners();

    // Initialize router - pass navigateToSection as the callback
    Router.initRouter(navigateToSection);

    // Initial load of notifications for the badge count
    // Pass null as navigator initially, it will be passed later when user clicks
    Notifications.loadNotifications(null);

    console.log("Admin Dashboard Initialized.");
}

// --- Start the application ---
// Ensure the DOM is fully loaded before running initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminDashboard);
} else {
    // DOMContentLoaded has already fired
    initializeAdminDashboard();
}