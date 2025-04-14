
// --- START OF (REVISED & COMPLETED) FILE script.js ---

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // Configuration & Constants
    // =========================================================================
    const API_BASE_URL = '/api/admin'; // Placeholder: Replace with your actual API endpoint
    const TOAST_DEFAULT_DURATION = 3000; // Milliseconds for toast notifications
    const DEBOUNCE_DELAY = 400; // Milliseconds for debouncing inputs (like search)
    const ITEMS_PER_PAGE = 10; // Default items per page for tables
    const defaultSeoTitle = 'TechShop'; // Default site title for SEO preview

    // =========================================================================
    // DOM Element References (Grouped for clarity)
    // =========================================================================

    // --- Layout & Core UI ---
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.admin-sidebar .sidebar-link');
    const adminSections = document.querySelectorAll('.admin-section');
    const mainContent = document.getElementById('adminMainContent');
    const adminContainer = document.querySelector('.admin-container');

    // --- Header ---
    const notificationBell = document.getElementById('adminNotificationBell');
    const notificationPanel = document.getElementById('adminNotificationPanel');
    const notificationList = document.getElementById('adminNotificationList');
    const clearAdminNotificationsBtn = document.getElementById('clearAdminNotifications');
    const userMenuToggle = document.getElementById('adminUserMenuToggle');
    const userDropdown = document.getElementById('adminUserDropdown');
    const notificationCountBadge = document.getElementById('adminNotificationCount');
    const adminSearchInput = document.querySelector('.admin-header .search-bar input[type="search"]');
    const adminSearchButton = document.querySelector('.admin-header .search-bar button');

    // --- Logout Links ---
    const logoutLinkSidebar = document.getElementById('adminLogoutLink');
    const logoutLinkDropdown = document.getElementById('adminLogoutLinkDropdown');

    // --- Dashboard ---
    const dashboardSection = document.getElementById('dashboard-section');
    const revenueChartCtx = document.getElementById('revenueChart')?.getContext('2d');
    const orderStatusChartCtx = document.getElementById('orderStatusChart')?.getContext('2d');
    const topProductsChartCtx = document.getElementById('topProductsChart')?.getContext('2d');
    const kpiRevenueToday = document.getElementById('kpiRevenueToday');
    const kpiRevenueChange = document.getElementById('kpiRevenueChange');
    const kpiNewOrders = document.getElementById('kpiNewOrders');
    const kpiNewOrdersStatus = document.getElementById('kpiNewOrdersStatus');
    const kpiNewServices = document.getElementById('kpiNewServices');
    const kpiNewServicesStatus = document.getElementById('kpiNewServicesStatus');
    const kpiLowStock = document.getElementById('kpiLowStock');
    const kpiLowStockStatus = document.getElementById('kpiLowStockStatus');
    const quickListRecentOrders = document.getElementById('quickListRecentOrders');
    const quickListRecentServices = document.getElementById('quickListRecentServices');
    const quickListLowStockProducts = document.getElementById('quickListLowStockProducts');
    const quickListActivityLog = document.getElementById('quickListActivityLog');

    // --- Reports ---
    const reportsSection = document.getElementById('reports-section');
    const reportRevenueChartCtx = document.getElementById('reportRevenueChart')?.getContext('2d');
    const reportTopProductsChartCtx = document.getElementById('reportTopProductsChart')?.getContext('2d');
    const reportFiltersContainer = reportsSection?.querySelector('.filters-container');
    const viewReportBtn = reportsSection?.querySelector('.btn-view-report');
    const exportReportBtn = reportsSection?.querySelector('.btn-export-report');
    const reportLowStockCount = document.getElementById('reportLowStockCount');
    const reportOutOfStockCount = document.getElementById('reportOutOfStockCount');
    const reportInventoryValue = document.getElementById('reportInventoryValue');
    const reportNewCustomers = document.getElementById('reportNewCustomers');
    const reportReturningRate = document.getElementById('reportReturningRate');
    const reportTopCustomers = document.getElementById('reportTopCustomers');
    const reportTotalServices = document.getElementById('reportTotalServices');
    const reportServicesByType = document.getElementById('reportServicesByType');
    const reportAvgServiceTime = document.getElementById('reportAvgServiceTime');

    // --- Products ---
    const productsSection = document.getElementById('products-section');
    const addProductBtn = productsSection?.querySelector('.btn-add-product');
    const productFormContainer = document.getElementById('product-form-container');
    const productForm = document.getElementById('productForm');
    const productFormHeading = document.getElementById('productFormHeading');
    const cancelProductBtn = productFormContainer?.querySelector('.btn-cancel-product');
    const productFormTabs = productFormContainer?.querySelectorAll('.product-form-tabs .tab-link');
    const productFormTabContents = productFormContainer?.querySelectorAll('#product-form-container > .tab-content');
    const manageStockCheckbox = document.getElementById('manageStock');
    const stockFieldsContainer = productForm?.querySelector('#product-price-stock .stock-fields');
    const productListView = productsSection?.querySelector('.table-responsive');
    const productTableBody = document.getElementById('productTableBody');
    const productPagination = productsSection?.querySelector('.pagination-container');
    const productFiltersContainer = productsSection?.querySelector('.filters-container');
    const productBulkActionsContainer = productsSection?.querySelector('.bulk-actions-container');
    const selectAllProductsCheckbox = document.getElementById('selectAllProducts');
    const productTable = productsSection?.querySelector('.admin-table');
    const productBulkActionSelect = document.getElementById('productBulkAction');
    const applyProductBulkActionBtn = document.getElementById('applyProductBulkAction');
    const productNameInput = document.getElementById('productName');
    const productSlugInput = document.getElementById('productSlug');
    const productDescriptionTextarea = document.getElementById('productDescription');
    const productCategorySelect = document.getElementById('productCategory');
    const featuredImageInput = document.getElementById('featuredImageInput');
    const featuredImagePreview = document.getElementById('featuredImagePreview');
    const featuredImageUploadArea = document.getElementById('featuredImageUpload');
    const galleryImageInput = document.getElementById('galleryImageInput');
    const galleryImagePreview = document.getElementById('galleryImagePreview');
    const galleryImageUploadArea = document.getElementById('galleryImageUpload');
    const seoTitleInput = document.getElementById('seoTitle');
    const seoDescriptionInput = document.getElementById('seoDescription');
    const seoPreviewEl = document.querySelector('#product-seo .seo-preview');
    const seoPreviewTitle = seoPreviewEl?.querySelector('.seo-preview-title');
    const seoPreviewUrl = seoPreviewEl?.querySelector('.seo-preview-url');
    const seoPreviewDesc = seoPreviewEl?.querySelector('.seo-preview-desc');

    // --- Orders ---
    const ordersSection = document.getElementById('orders-section');
    const orderListView = ordersSection?.querySelector('.table-responsive');
    const orderTableBody = document.getElementById('orderTableBody');
    const orderPagination = ordersSection?.querySelector('.pagination-container');
    const orderFiltersContainer = ordersSection?.querySelector('.filters-container');
    const orderBulkActionsContainer = ordersSection?.querySelector('.bulk-actions-container');
    const selectAllOrdersCheckbox = document.getElementById('selectAllOrders');
    const orderTable = ordersSection?.querySelector('.admin-table');
    const orderBulkActionSelect = document.getElementById('orderBulkAction');
    const applyOrderBulkActionBtn = document.getElementById('applyOrderBulkAction');
    const orderDetailView = document.getElementById('order-detail-view');
    const orderDetailContent = document.getElementById('orderDetailContentPlaceholder');
    const orderDetailIdSpan = document.getElementById('detailOrderId');
    const saveOrderDetailBtn = document.getElementById('saveOrderDetailBtn');
    const printInvoiceDetailBtn = orderDetailView?.querySelector('.btn-print-invoice-detail');
    const refundOrderBtn = orderDetailView?.querySelector('.btn-refund-order');
    const closeOrderDetailBtn = orderDetailView?.querySelector('.btn-close-detail');

    // --- Services ---
    const servicesSection = document.getElementById('services-section');
    const serviceTable = servicesSection?.querySelector('.admin-table');
    const serviceTableBody = document.getElementById('serviceTableBody');
    const servicePagination = servicesSection?.querySelector('.pagination-container');
    const serviceFiltersContainer = servicesSection?.querySelector('.filters-container');
    const serviceDetailView = document.getElementById('service-detail-view');
    const serviceDetailContent = document.getElementById('serviceDetailContentPlaceholder');
    const serviceDetailIdSpan = document.getElementById('detailServiceId');
    const saveServiceDetailBtn = document.getElementById('saveServiceDetailBtn');
    const addServiceNoteBtn = serviceDetailView?.querySelector('.btn-add-service-note');
    let serviceInternalNoteTextarea = document.getElementById('serviceInternalNote'); // Use let for re-assignment
    let serviceNoteHistoryUl = document.getElementById('serviceNoteHistory'); // Use let for re-assignment
    const closeServiceDetailBtn = serviceDetailView?.querySelector('.btn-close-detail');

    // --- Customers ---
    const customersSection = document.getElementById('customers-section');
    const customerTable = customersSection?.querySelector('.admin-table');
    const customerTableBody = document.getElementById('customerTableBody');
    const customerPagination = customersSection?.querySelector('.pagination-container');
    const customerFiltersContainer = customersSection?.querySelector('.filters-container');
    const customerDetailView = document.getElementById('customer-detail-view');
    const customerDetailContent = document.getElementById('customerDetailContentPlaceholder');
    const customerDetailNameSpan = document.getElementById('detailCustomerName');
    const customerDetailTabs = customerDetailView?.querySelectorAll('.customer-detail-tabs .tab-link');
    const customerDetailTabContents = customerDetailView?.querySelectorAll('#customerDetailContentPlaceholder > .tab-content');
    let customerAdminNoteTextarea = document.getElementById('customerAdminNote'); // Use let
    let saveCustomerNoteBtn = document.getElementById('saveCustomerNoteBtn'); // Use let
    let customerNotesHistoryUl = customerDetailView?.querySelector('#customer-notes .activity-log'); // Use let
    const closeCustomerDetailBtn = customerDetailView?.querySelector('.btn-close-detail');

    // --- Content ---
    const contentSection = document.getElementById('content-section');
    const contentTabs = contentSection?.querySelectorAll('.content-tabs .tab-link');
    const contentTabContents = contentSection?.querySelectorAll('#content-section > .tab-content');
    // TODO: Add specific refs for content elements (page list, banner list, etc.)

    // --- Settings ---
    const settingsSection = document.getElementById('settings-section');
    const settingsTabs = settingsSection?.querySelectorAll('.settings-tabs .tab-link');
    const settingsTabContents = settingsSection?.querySelectorAll('#settings-section > .tab-content');
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    const paymentSettingsContainer = document.getElementById('settings-payments');
    const savePaymentSettingsBtn = document.getElementById('savePaymentSettingsBtn');
    const shippingSettingsContainer = document.getElementById('settings-shipping');
    const saveShippingSettingsBtn = document.getElementById('saveShippingSettingsBtn');
    const emailSettingsContainer = document.getElementById('settings-emails');
    const saveEmailSettingsBtn = document.getElementById('saveEmailSettingsBtn');
    const seoSettingsForm = document.getElementById('seoSettingsForm');
    const vnpayEnabledCheckbox = document.getElementById('vnpayEnabled');
    const vnpayDetailsDiv = vnpayEnabledCheckbox?.closest('.payment-gateway-setting')?.querySelector('.gateway-details');

    // --- Admins ---
    const adminsSection = document.getElementById('admins-section');
    const addAdminBtn = adminsSection?.querySelector('.btn-add-admin');
    const adminAccountsTableBody = document.getElementById('adminAccountsTableBody');
    // TODO: Add refs for admin form/detail view if created

    // --- Modals ---
    const modalOverlay = document.getElementById('adminModalOverlay');
    const confirmModal = document.getElementById('adminConfirmModal');
    const confirmModalTitle = document.getElementById('confirmModalTitle');
    const confirmModalMessage = confirmModal?.querySelector('.modal-message');
    const confirmModalConfirmBtn = confirmModal?.querySelector('.btn-confirm');
    const confirmModalCancelBtn = confirmModal?.querySelector('.btn-cancel');

    // --- Generic / Other ---
    const allDatePickerElements = document.querySelectorAll('.date-picker');
    const allWysiwygEditorElements = document.querySelectorAll('.wysiwyg-editor');
    const allSearchableSelectElements = document.querySelectorAll('.select2-searchable');
    const allFilterButtons = document.querySelectorAll('.btn-apply-filters');
    const allClearFilterButtons = document.querySelectorAll('.btn-clear-filters');
    const allTablesWithSort = document.querySelectorAll('.admin-table thead');

    // =========================================================================
    // State Variables
    // =========================================================================
    let activeAdminSectionId = null; // Start null, set during init
    let charts = {}; // Store chart instances
    let isLoading = false; // Global loading flag
    let currentTableSort = { // Store sort state per section
        products: { key: 'name', direction: 'asc' }, // Default sort products by name
        orders: { key: 'date', direction: 'desc' },
        services: { key: 'date', direction: 'desc' },
        customers: { key: 'id', direction: 'desc' },
        admins: { key: 'name', direction: 'asc' }
    };
    let currentConfirmCallback = null; // Store callback for custom modal
    let currentCancelCallback = null; // Store cancel callback for custom modal
    let searchDebounceTimer = null; // Timer for search input debouncing
    let currentFilters = {}; // Store current filter values per section { products: { status: 'published' }, orders: { ... } }

    // =========================================================================
    // Utility Functions
    // =========================================================================

    /**
     * Basic debounce function.
     * @param {function} func - The function to debounce.
     * @param {number} delay - The debounce delay in milliseconds.
     * @returns {function} - The debounced function.
     */
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    /**
     * Generates a URL-friendly slug from a string.
     * @param {string} text - The input string.
     * @returns {string} - The generated slug.
     */
    function generateSlug(text) {
        if (!text) return '';
        // Vietnamese character normalization and slug generation
        return text
            .toString()
            .normalize('NFD') // Split accented characters into base characters and diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/đ/g, 'd') // Replace đ with d
            .replace(/[^\w-]+/g, '') // Remove all non-word chars except -
            .replace(/--+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }


    /**
     * Formats a number as Vietnamese currency (VND).
     * @param {number|string} amount - The amount to format.
     * @returns {string} Formatted currency string.
     */
    function formatAdminCurrency(amount) {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            return '0đ';
        }
        // Use Intl for better localization and currency handling
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericAmount);
    }

    /**
     * Formats a date object or string into a readable format.
     * @param {Date|string} dateInput - The date to format.
     * @param {object} [options] - Intl.DateTimeFormat options.
     * @returns {string} Formatted date string.
     */
    function formatAdminDateTime(dateInput, options = { dateStyle: 'medium', timeStyle: 'short', hour12: false }) {
        try {
            const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
            if (isNaN(date.getTime())) { // Check if date is valid
                return 'N/A';
            }
            return new Intl.DateTimeFormat('vi-VN', options).format(date);
        } catch (e) {
            console.error("Error formatting date:", dateInput, e);
            return 'Invalid Date';
        }
    }

    /**
     * Shows an element by setting its display style. Handles transitions better.
     * @param {HTMLElement} element - The element to show.
     * @param {string} [displayType='block'] - The display style (e.g., 'block', 'flex', 'grid').
     */
    function showElement(element, displayType = 'block') {
        if (element) {
            element.style.display = displayType;
            // Trigger reflow to ensure display is applied before opacity/transform transition
            // Using requestAnimationFrame for smoother rendering start
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            });
        }
    }

    /**
     * Hides an element using opacity and visibility for transitions.
     * @param {HTMLElement} element - The element to hide.
     */
    function hideElement(element) {
        if (element) {
            element.style.opacity = '0';
            element.style.visibility = 'hidden';
            // Set display to none after transition duration (match CSS)
            // Get duration from computed style for accuracy
            const durationString = getComputedStyle(element).transitionDuration || '0.25s';
            const durationMs = parseFloat(durationString) * (durationString.includes('ms') ? 1 : 1000);
            setTimeout(() => {
                // Check if it's still hidden before setting display:none
                // This check prevents issues if showElement is called quickly after hideElement
                if (element.style.opacity === '0') {
                    element.style.display = 'none';
                }
            }, durationMs);
        }
    }

    /** Shows an element using 'display: flex'. */
    function flexElement(element) {
        showElement(element, 'flex');
    }

    /**
     * Shows a toast notification (placeholder for library integration).
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'warning'|'info'} [type='info'] - The type of toast.
     * @param {number} [duration=TOAST_DEFAULT_DURATION] - How long the toast stays visible.
     */
    function showToast(message, type = 'info', duration = TOAST_DEFAULT_DURATION) {
        console.log(`[Toast - ${type.toUpperCase()}] ${message}`); // Basic console log fallback

        // --- Toast Library Integration Placeholder (e.g., Notyf) ---
        if (typeof Notyf !== 'undefined') {
            const notyf = new Notyf({
                duration: duration,
                position: { x: 'right', y: 'top' },
                dismissible: true,
                types: [
                    { type: 'info', background: '#0984e3', icon: { className: 'fas fa-info-circle', tagName: 'i', color: '#fff'} },
                    { type: 'warning', background: '#fdcb6e', icon: { className: 'fas fa-exclamation-triangle', tagName: 'i', color: '#fff'} },
                    { type: 'success', background: '#00b894', icon: { className: 'fas fa-check-circle', tagName: 'i', color: '#fff'} },
                    { type: 'error', background: '#d63031', icon: { className: 'fas fa-times-circle', tagName: 'i', color: '#fff'} }
                ]
            });
            notyf.open({ type: type, message: message });
        } else {
            // Simple fallback alert if no library is present
            // Avoid using alert in final product
             console.warn("Notyf library not found, using console for toast.");
            // alert(`[${type.toUpperCase()}] ${message}`);
        }
        // --- End Placeholder ---
    }

    /** Opens the specified custom modal. */
    function openModal(modalElement = confirmModal) {
        if (modalElement && modalOverlay) {
            modalOverlay.classList.add('active');
            modalElement.style.display = 'block'; // Set display before transition
            requestAnimationFrame(() => { // Ensure display is set before starting transition
                modalElement.classList.add('active');
            });
        }
    }

    /** Closes the currently active custom modal. */
    function closeModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal && modalOverlay) {
            activeModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            // Hide after transition
            const durationString = getComputedStyle(activeModal).transitionDuration || '0.3s';
            const durationMs = parseFloat(durationString) * (durationString.includes('ms') ? 1 : 1000);
            setTimeout(() => {
                activeModal.style.display = 'none';
                // Clear callbacks after closing
                currentConfirmCallback = null;
                currentCancelCallback = null;
            }, durationMs);
        }
    }

    /** Shows the custom confirmation modal. */
    function showConfirmationModal(message, confirmCallback, cancelCallback = null, options = {}) {
         const { title = 'Xác nhận hành động', confirmText = 'Xác nhận', cancelText = 'Hủy bỏ', confirmClass = 'btn-danger' } = options;

         if (!confirmModal || !confirmModalMessage || !confirmModalConfirmBtn || !confirmModalCancelBtn || !confirmModalTitle) {
             console.warn("Custom confirmation modal elements not found, using browser confirm.");
             if (window.confirm(message)) {
                 if (confirmCallback) confirmCallback();
             } else {
                 if (cancelCallback) cancelCallback();
             }
             return;
         }

         confirmModalTitle.textContent = title;
         confirmModalMessage.textContent = message;
         confirmModalConfirmBtn.textContent = confirmText;
         confirmModalCancelBtn.textContent = cancelText;
         confirmModalConfirmBtn.className = `btn ${confirmClass} btn-confirm`;

         currentConfirmCallback = confirmCallback;
         currentCancelCallback = cancelCallback;

         openModal(confirmModal);
    }

    /** Handler for the custom modal's confirm button. */
    function handleModalConfirm() {
        if (currentConfirmCallback) {
            currentConfirmCallback();
        }
        closeModal();
    }

    /** Handler for the custom modal's cancel button. */
    function handleModalCancel() {
        if (currentCancelCallback) {
            currentCancelCallback();
        }
        closeModal();
    }

    /** Displays a loading indicator on an element. */
    function showLoading(element = adminContainer) {
        if (element && !element.classList.contains('is-loading')) { // Prevent adding multiple times
            element.classList.add('is-loading');
            // console.log(`Loading started on ${element.id || element.tagName}...`);
        }
    }

    /** Hides the loading indicator. */
    function hideLoading(element = adminContainer) {
        if (element) {
            element.classList.remove('is-loading');
            // console.log(`Loading finished on ${element.id || element.tagName}.`);
        }
    }

    /** Adds a loading state specifically to a button. */
    function setButtonLoading(button, loadingText = 'Processing...') {
        if (!button || button.disabled) return; // Don't process if already loading/disabled
        button.disabled = true;
        button.dataset.originalContent = button.innerHTML; // Store original HTML
        // Use the CSS-based spinner
        button.innerHTML = ''; // Clear content for CSS spinner
        button.classList.add('is-loading'); // Add class for CSS spinner animation
    }

    /** Removes the loading state from a button. */
    function resetButtonLoading(button) {
        if (!button) return;
        button.disabled = false;
        button.classList.remove('is-loading'); // Remove CSS spinner class
        // Restore original content if stored
        if (button.dataset.originalContent) {
            button.innerHTML = button.dataset.originalContent;
            delete button.dataset.originalContent;
        }
    }

    /** Displays an empty state message within a container (e.g., tbody, div). */
    function displayEmptyState(container, message, colspan = 1) {
        if (!container) return;
        const isEmptyTableBody = container.tagName === 'TBODY';
        let emptyElementHTML;

        if (isEmptyTableBody) {
            // Use a specific class for styling the empty row/cell
            emptyElementHTML = `<tr class="empty-state-row"><td colspan="${colspan}" class="empty-state-cell">${message}</td></tr>`;
        } else {
            // Use a wrapper div for non-table containers
            emptyElementHTML = `<div class="empty-state"><p><i class="fas fa-info-circle fa-2x mb-2"></i><br>${message}</p></div>`;
}
container.innerHTML = emptyElementHTML; // Replace content with empty state
}

/** Clears validation errors from a form. */
function clearFormValidation(form) {
    if (!form) return;
    // Remove invalid classes and aria attributes
    form.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
    });
    // Remove error message elements
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
}

/** Displays validation errors on a form, linking errors to inputs for accessibility. */
function displayFormValidationErrors(form, errors) {
    if (!form || !errors) return;
    clearFormValidation(form); // Clear previous errors first

    let firstErrorElement = null;

    for (const fieldName in errors) {
        // Try finding by name, then ID
        const input = form.querySelector(`[name="${fieldName}"]`) || form.querySelector(`#${fieldName}`);
        if (input) {
            input.classList.add('is-invalid');
            input.setAttribute('aria-invalid', 'true'); // Accessibility

            const errorMsg = Array.isArray(errors[fieldName]) ? errors[fieldName].join(', ') : errors[fieldName];
            const errorId = `${input.id || fieldName}-error`; // Use input ID if available for uniqueness

            // Remove existing error message for this field if any
            const existingError = input.parentNode.querySelector(`#${errorId}`);
            if (existingError) {
                existingError.remove();
            }

            // Create and insert new error message
            const errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            errorElement.id = errorId; // Assign the unique ID
            errorElement.setAttribute('role', 'alert'); // Announce error
            errorElement.textContent = errorMsg;
            // Set aria-describedby on the input to link it to the error message
            input.setAttribute('aria-describedby', errorId);

            // Insert after the input or its wrapper (e.g., if input is inside an input-group)
            const parent = input.closest('.form-group') || input.parentNode; // Find a suitable parent
            parent.insertBefore(errorElement, input.nextSibling);

            // Track the first error element to focus later
            if (!firstErrorElement) {
                firstErrorElement = input;
            }

        } else {
            console.warn(`Validation Error: Could not find form field for "${fieldName}"`);
            // Display general errors not tied to a specific field using a toast
            showToast(`Error: ${errors[fieldName]}`, 'warning');
        }
    }

    // Focus and scroll to the first invalid field for better UX
    if (firstErrorElement) {
        firstErrorElement.focus();
        // Scrolling into view might be jarring sometimes, consider only focusing.
        // firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/** Basic client-side form validation using HTML5 constraints. */
function validateFormClientSide(form) {
    if (!form) return false;
    clearFormValidation(form); // Clear previous errors
    let isValid = true;

    // Check overall validity first using the browser's built-in checker
    if (!form.checkValidity()) {
        isValid = false;
        // Find all invalid elements and display their messages
        form.querySelectorAll(':invalid').forEach((element, index) => {
            element.classList.add('is-invalid');
            element.setAttribute('aria-invalid', 'true');
            const errorId = `${element.id || element.name}-error`;
            element.setAttribute('aria-describedby', errorId);

            // Remove existing error first
            const existingError = element.parentNode.querySelector(`#${errorId}`);
            if (existingError) {
                existingError.remove();
            }

            // Add new error message using browser's validation message
            const errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            errorElement.id = errorId;
            errorElement.setAttribute('role', 'alert');
            errorElement.textContent = element.validationMessage; // Get browser's message
            const parent = element.closest('.form-group') || element.parentNode;
            parent.insertBefore(errorElement, element.nextSibling);

            // Focus the first invalid element found
            if (index === 0) {
                element.focus();
                // element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Add any custom validation logic here if needed (e.g., password match)
    // Example:
    // const password = form.querySelector('#password');
    // const confirmPassword = form.querySelector('#confirmPassword');
    // if (password && confirmPassword && password.value !== confirmPassword.value) {
    //     isValid = false;
    //     // Display error for confirmPassword field
    //     displayFormValidationErrors(form, { confirmPassword: ["Passwords do not match."] });
    // }

    if (!isValid) {
        showToast("Please fix the errors highlighted in the form.", "warning");
    }

    return isValid;
}

/** Collects filter values from a filter container. */
function collectFilters(container) {
    const filters = {};
    if (!container) return filters;

    // Text, search, date, datetime-local inputs
    container.querySelectorAll('input[type="text"], input[type="search"], input[type="date"], input[type="datetime-local"]').forEach(input => {
        const key = input.id || input.name;
        if (key && input.value) {
            filters[key] = input.value;
        }
    });

    // Select dropdowns
    container.querySelectorAll('select').forEach(select => {
        const key = select.id || select.name;
        if (key && select.value) { // Only include if a value is selected
            filters[key] = select.value;
        }
    });

    // Checkboxes (if used for filtering)
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const key = checkbox.id || checkbox.name;
        if (key && checkbox.checked) {
            filters[key] = checkbox.value || 'true'; // Use value or 'true'
        }
    });
    console.log("Collected Filters:", filters);
    return filters;
}

/** Clears all filter inputs in a container and optionally reloads the section. */
function clearFilters(container, triggerReload = true) {
    if (!container) return;
    // Reset text, search, date inputs
    container.querySelectorAll('input[type="text"], input[type="search"], input[type="date"], input[type="datetime-local"]').forEach(el => {
        el.value = '';
        // If using Flatpickr, clear its instance too
        if (el._flatpickr) {
            el._flatpickr.clear();
        }
    });
    // Reset selects to their default (usually the first option with value="")
    container.querySelectorAll('select').forEach(el => {
        el.selectedIndex = 0;
    });
    // Reset checkboxes
    container.querySelectorAll('input[type="checkbox"]').forEach(el => {
        el.checked = false;
    });
    console.log("Filters Cleared.");

    // Trigger the filter action again to show all results
    const section = container.closest('.admin-section')?.id.replace('-section', '');
    if (section && triggerReload) {
        currentFilters[section] = {}; // Clear stored filters for the section
        setActiveSection(section, { page: 1 }, true); // Reload page 1, forcing reload
    }
}

// =========================================================================
// API Service (Simulated - Keep as is for now)
// =========================================================================
const apiService = {
    /** Generic fetch wrapper */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // 'Authorization': `Bearer ${getAuthToken()}` // Uncomment if using token auth
        };
        const config = { ...options, headers: { ...defaultHeaders, ...options.headers, } };

        // Handle FormData correctly: Do not stringify, remove Content-Type
        if (config.body instanceof FormData) {
            delete config.headers['Content-Type']; // Browser sets this with boundary
        } else if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body); // Stringify JSON body
        }

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                let errorData = { message: `Request failed with status ${response.status}` };
                try { errorData = await response.json(); } catch (e) { /* Ignore parsing error */ }
                const error = new Error(errorData.message || response.statusText);
                error.status = response.status;
                error.data = errorData; // Attach full error response
                console.error(`API Error (${response.status}) on ${url}:`, errorData);
                throw error; // Re-throw for handling in calling function
            }
            if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                return null; // Handle No Content response
            }
            return await response.json();
        } catch (error) {
            // Catch fetch errors (network issues) and re-throw or handle
            console.error('API Request Failed:', error);
            // Provide a user-friendly network error message
            if (error.message === 'Failed to fetch') {
                throw new Error('Network error. Please check your connection.');
            }
            throw error;
        }
    },
    // --- Dashboard (Simulation) ---
    async getDashboardData() {
        console.log("API (Simulated): Fetching dashboard data...");
        await new Promise(resolve => setTimeout(resolve, 400));
        return {
            kpis: {
                revenueToday: 17850000, revenueChange: 0.15, // Positive change
                newOrders: 12, newOrdersStatus: 'pending',
                newServices: 2, newServicesStatus: 'new',
                lowStock: 4, lowStockStatus: 'low_stock'
            },
            charts: {
                revenue: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [14, 21, 12, 28, 20, 35, 17.85].map(v => v * 1000000) },
                orderStatus: { labels: ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'], data: [12, 18, 65, 7] },
                topProducts: { labels: ['Laptop ABC', 'Phone XYZ', 'Mouse Pro', 'SSD 1TB', 'Keyboard G'], data: [60, 95, 130, 70, 100] }
            },
            recentOrders: [
                { id: 'P1001', customerId: 5, customer: 'Hoàng Văn E', total: 750000 },
                { id: 'P1000', customerId: 1, customer: 'Nguyễn Văn A', total: 12500000 },
                { id: 'P999', customerId: 2, customer: 'Trần Thị B', total: 18990000 }
            ],
            recentServices: [
                { id: 'S778', customerId: 6, customer: 'Lý Thị F', type: 'Lắp đặt' },
                { id: 'S777', customerId: 1, customer: 'Nguyễn Văn A', type: 'Sửa chữa' }
            ],
            lowStockProducts: [
                { id: 'NT-PH-01', name: 'NovaTech Phone X', stock: 3, image: 'https://via.placeholder.com/40x40/a29bfe/ffffff?text=P' },
                { id: 'GP-AC-01', name: 'Chuột GadgetPro Z1', stock: 2, image: 'https://via.placeholder.com/40x40/fdcb6e/2d3436?text=M' }
            ],
            activityLog: [
                { user: 'Admin Demo', action: 'đã cập nhật trạng thái đơn hàng #P1000 thành Đang chuẩn bị', timestamp: '2 phút trước' },
                { user: 'Nhân viên A', action: 'đã thêm ghi chú vào yêu cầu dịch vụ #S777', timestamp: '15 phút trước' },
                { user: 'Hệ thống', action: 'đã phát hiện sản phẩm sắp hết hàng: NovaTech Phone X', timestamp: '1 giờ trước' }
            ]
        };
    },

    // --- Products (Simulation) ---
    async getProducts(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API (Simulated): Fetching products with params: ${query}`);
        await new Promise(resolve => setTimeout(resolve, 600));
        const allProducts = [
            { id: 'TB-LP-01', image: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=L', name: 'Laptop TechBrand Pro 14', sku: 'TB-LP-01', price: 32500000, stock: 15, status: 'published', slug: 'laptop-techbrand-pro-14' },
            { id: 'NT-PH-01', image: 'https://via.placeholder.com/50x50/a29bfe/ffffff?text=P', name: 'NovaTech Phone X', sku: 'NT-PH-01', price: 18990000, stock: 3, status: 'published', slug: 'novatech-phone-x' },
            { id: 'GP-AC-01', image: 'https://via.placeholder.com/50x50/fdcb6e/2d3436?text=M', name: 'Chuột không dây GadgetPro Z1', sku: 'GP-AC-01', price: 1100000, salePrice: 950000, stock: 2, status: 'published', slug: 'chuot-khong-day-gadgetpro-z1' }, // Changed status to published, low stock
            { id: 'ZS-MN-01', image: 'https://via.placeholder.com/50x50/d63031/ffffff?text=S', name: 'Màn hình ZyStore 27" QHD', sku: 'ZS-MN-01', price: 7200000, stock: 25, status: 'published', slug: 'man-hinh-zystore-27-qhd' },
            { id: 'TB-KB-01', image: 'https://via.placeholder.com/50x50/00b894/ffffff?text=K', name: 'Bàn phím cơ TechBrand K1', sku: 'TB-KB-01', price: 1500000, stock: 0, status: 'draft', slug: 'ban-phim-co-techbrand-k1' }, // Out of stock, draft
            { id: 'NT-SSD-01', image: 'https://via.placeholder.com/50x50/e17055/ffffff?text=D', name: 'SSD NovaTech 1TB NVMe', sku: 'NT-SSD-01', price: 2800000, stock: 50, status: 'published', slug: 'ssd-novatech-1tb-nvme' },
        ];
        let filteredProducts = allProducts;
        if (params.productFilterStatus) filteredProducts = allProducts.filter(p => p.status === params.productFilterStatus);
        if (params.productFilterCategory) filteredProducts = allProducts.filter(p => p.sku.toLowerCase().includes(params.productFilterCategory.slice(0, 2))); // Basic category sim
        if (params.productFilterBrand) filteredProducts = allProducts.filter(p => p.sku.toLowerCase().startsWith(params.productFilterBrand.slice(0, 2).toLowerCase())); // Basic brand sim
        if (params.productFilterName) {
            const searchTerm = params.productFilterName.toLowerCase();
            filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm) || p.sku.toLowerCase().includes(searchTerm));
        }
        if (params.sortKey) {
            const sortKey = params.sortKey;
            const sortDir = params.sortDir === 'desc' ? -1 : 1;
            filteredProducts.sort((a, b) => {
                const valA = a[sortKey]; const valB = b[sortKey];
                // Basic comparison, needs refinement for numbers/dates
                if (valA < valB) return -1 * sortDir;
                if (valA > valB) return 1 * sortDir;
                return 0;
            });
        }
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || ITEMS_PER_PAGE;
        const totalItems = filteredProducts.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
        return { data: paginatedProducts, pagination: { totalItems, currentPage: page, itemsPerPage: limit, totalPages } };
    },
    async getProductDetails(productId) {
        console.log(`API (Simulated): Fetching product details for ID: ${productId}`);
        await new Promise(resolve => setTimeout(resolve, 350));
        const allProductsResponse = await this.getProducts({ limit: 100 }); // Fetch all for find
        const product = allProductsResponse.data.find(p => p.id === productId);
        if (product) {
            return {
                id: product.id, name: product.name, slug: product.slug || generateSlug(product.name),
                shortDescription: `Mô tả ngắn gọn và hấp dẫn cho ${product.name}.`,
                description: `<p>Đây là mô tả <strong>chi tiết</strong> hơn về sản phẩm ${product.name}.</p><p>Bao gồm các thông số kỹ thuật:</p><ul><li>CPU: Core i7</li><li>RAM: 16GB</li><li>SSD: 512GB</li></ul><p>Tính năng nổi bật và hình ảnh chất lượng cao.</p>`,
                categoryIds: ['laptops', 'accessories'], // Example
                brand: 'TechBrand', // Example
                status: product.status,
                price: product.price, salePrice: product.salePrice || null,
                saleStartDate: null, saleEndDate: null,
                manageStock: true, sku: product.sku, stock: product.stock,
                lowStockThreshold: 5, allowBackorder: false,
                featuredImage: product.image,
                galleryImages: [ /* ... gallery image URLs ... */ ],
                variants: [],
                seoTitle: `${product.name} - Chính hãng | ${defaultSeoTitle}`,
                seoDescription: `Mua ${product.name} giá tốt nhất tại ${defaultSeoTitle}. ${`Mô tả ngắn gọn và hấp dẫn cho ${product.name}.`}`
            };
        } else {
            const error = new Error("Product not found"); error.status = 404; throw error;
        }
    },
    async saveProduct(productData) {
        const productId = productData.id;
        const method = productId ? 'PUT' : 'POST';
        const endpoint = productId ? `/products/${productId}` : '/products';
        console.log(`API (Simulated): Saving product (ID: ${productId || 'New'}) with method ${method}. Data:`, productData);
        await new Promise(resolve => setTimeout(resolve, 700));
        if (!productData.name || productData.name.length < 3) {
            const error = new Error("Validation Failed"); error.status = 422;
            error.data = { message: "Validation Failed", errors: { productName: ["Tên sản phẩm phải có ít nhất 3 ký tự."] } };
            throw error;
        }
        if (productData.manageStock && (isNaN(Number(productData.stock)) || Number(productData.stock) < 0)) {
            const error = new Error("Validation Failed"); error.status = 422;
            error.data = { message: "Validation Failed", errors: { productStock: ["Số lượng tồn kho không hợp lệ."] } };
            throw error;
        }
        const savedProduct = { ...productData, id: productId || `NEW-${Date.now().toString().slice(-5)}`, slug: productData.slug || generateSlug(productData.name) };
        console.log("Saved Product Data (Simulated):", savedProduct);
        return savedProduct;
    },
    async deleteProduct(productId) {
        console.log(`API (Simulated): Deleting product ID: ${productId}`);
        await new Promise(resolve => setTimeout(resolve, 450));
        return null; // Simulate 204 No Content
    },
    async applyProductBulkAction(action, productIds) {
        console.log(`API (Simulated): Applying bulk action "${action}" to product IDs:`, productIds);
        await new Promise(resolve => setTimeout(resolve, 550));
        return { message: `Action "${action}" applied successfully to ${productIds.length} products.` };
    },

    // --- Orders (Simulation) ---
    async getOrders(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API (Simulated): Fetching orders with params: ${query}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const allOrders = [
            { id: 'P1001', customerId: 5, customerName: 'Hoàng Văn E', date: '2023-12-26T14:05:00', total: 750000, paymentStatus: 'paid', paymentMethod: 'COD', orderStatus: 'completed' },
            { id: 'P1000', customerId: 1, customerName: 'Nguyễn Văn A', date: '2023-12-26T11:30:00', total: 12500000, paymentStatus: 'pending', paymentMethod: 'Bank Transfer', orderStatus: 'processing' },
            { id: 'P999', customerId: 2, customerName: 'Trần Thị B', date: '2023-12-25T15:00:00', total: 18990000, paymentStatus: 'paid', paymentMethod: 'VNPAY', orderStatus: 'shipped' },
            { id: 'P998', customerId: 3, customerName: 'Lê Văn C', date: '2023-12-25T09:10:00', total: 950000, paymentStatus: 'paid', paymentMethod: 'COD', orderStatus: 'completed' },
            { id: 'P997', customerId: 4, customerName: 'Phạm Thị D', date: '2023-12-24T16:20:00', total: 2800000, paymentStatus: 'pending', paymentMethod: 'COD', orderStatus: 'pending' },
            { id: 'P996', customerId: 1, customerName: 'Nguyễn Văn A', date: '2023-12-23T10:00:00', total: 32500000, paymentStatus: 'paid', paymentMethod: 'Bank Transfer', orderStatus: 'completed' },
        ];
        let filteredOrders = allOrders;
        if (params.orderFilterStatus) filteredOrders = allOrders.filter(o => o.orderStatus === params.orderFilterStatus);
        if (params.orderFilterPayment) filteredOrders = allOrders.filter(o => o.paymentStatus === params.orderFilterPayment);
        if (params.orderFilterSearch) {
            const searchTerm = params.orderFilterSearch.toLowerCase();
            filteredOrders = allOrders.filter(o => o.id.toLowerCase().includes(searchTerm) || o.customerName.toLowerCase().includes(searchTerm));
        }
        if (params.orderDateFrom) filteredOrders = filteredOrders.filter(o => new Date(o.date) >= new Date(params.orderDateFrom));
        if (params.orderDateTo) filteredOrders = filteredOrders.filter(o => new Date(o.date) <= new Date(params.orderDateTo + 'T23:59:59'));
        if (params.sortKey) {
            const sortKey = params.sortKey; const sortDir = params.sortDir === 'desc' ? -1 : 1;
            filteredOrders.sort((a, b) => {
                const valA = sortKey === 'date' ? new Date(a[sortKey]) : a[sortKey];
                const valB = sortKey === 'date' ? new Date(b[sortKey]) : b[sortKey];
                if (valA < valB) return -1 * sortDir; if (valA > valB) return 1 * sortDir; return 0;
            });
        } else { filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date)); }
        const page = parseInt(params.page) || 1; const limit = parseInt(params.limit) || ITEMS_PER_PAGE;
        const totalItems = filteredOrders.length; const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit; const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);
        return { data: paginatedOrders, pagination: { totalItems, currentPage: page, itemsPerPage: limit, totalPages } };
    },
    async getOrderDetail(orderId) {
        console.log(`API (Simulated): Fetching order details for ID: ${orderId}`);
        await new Promise(resolve => setTimeout(resolve, 400));
        const allOrdersResponse = await this.getOrders({ limit: 100 });
        const order = allOrdersResponse.data.find(o => o.id === orderId);
        if (!order) { const error = new Error("Order not found"); error.status = 404; throw error; }
        // Simulate richer detail data
        const items = [
            { productId: 'TB-LP-01', name: 'Laptop TechBrand Pro 14', quantity: 1, price: 32500000, image: 'https://via.placeholder.com/40x40/6c5ce7/ffffff?text=L' },
            { productId: 'GP-AC-01', name: 'Chuột không dây GadgetPro Z1', quantity: 1, price: 950000, image: 'https://via.placeholder.com/40x40/fdcb6e/2d3436?text=M' },
            { productId: 'NT-SSD-01', name: 'SSD NovaTech 1TB NVMe', quantity: 2, price: 2800000, image: 'https://via.placeholder.com/40x40/e17055/ffffff?text=D' }
        ].slice(0, Math.max(1, parseInt(orderId.slice(-1)) % 4)); // Simulate 1-3 items
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = subtotal > 1000000 ? 0 : 30000;
        const discount = subtotal > 20000000 ? 500000 : 0;
        const grandTotal = subtotal + shippingCost - discount;

        return {
            ...order, // Include base data like id, date, status etc.
            customer: { id: order.customerId, name: order.customerName, email: `customer${order.customerId}@example.com`, phone: `090xxxx${order.customerId}` },
            items: items,
            billingAddress: { name: order.customerName, street: '123 Đường ABC', city: 'TP. Hồ Chí Minh', country: 'VN', phone: `090xxxx${order.customerId}`},
            shippingAddress: { name: order.customerName, street: '456 Đường XYZ, Quận 7', city: 'TP. Hồ Chí Minh', country: 'VN', phone: `090xxxx${order.customerId}`},
            shippingMethod: 'Giao hàng Tiêu chuẩn',
            subtotal: subtotal,
            shippingCost: shippingCost,
            discount: discount,
            grandTotal: grandTotal,
            customerNote: order.id === 'P997' ? 'Giao hàng vào buổi chiều.' : '',
            internalNotes: [ /* ... simulated notes ... */ ],
            history: [ /* ... simulated history ... */ ],
            trackingCode: order.orderStatus === 'shipped' ? `GHN${order.id}XYZ` : null,
            canRefund: order.orderStatus === 'completed' && order.paymentStatus === 'paid' && grandTotal > 0
        };
    },
    async updateOrderStatus(orderId, status) {
        console.log(`API (Simulated): Updating order ${orderId} status to ${status}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { message: `Order ${orderId} status updated to ${status}.` };
    },
    async saveOrderDetail(orderId, data) {
        console.log(`API (Simulated): Saving order details for ${orderId}. Data:`, data);
        await new Promise(resolve => setTimeout(resolve, 600));
        return { message: `Order ${orderId} details saved successfully.` };
    },
    async applyOrderBulkAction(action, orderIds) {
        console.log(`API (Simulated): Applying bulk action "${action}" to order IDs:`, orderIds);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simulate adding tracking for shipped orders
        if(action === 'mark_shipped'){
            // In real scenario, might return tracking codes or prompt for them
            console.log("Simulating adding tracking for shipped orders");
        }
        return { message: `Action "${action}" applied successfully to ${orderIds.length} orders.` };
    },
    async addTrackingCode(orderId, trackingCode) {
        console.log(`API (Simulated): Adding tracking code ${trackingCode} to order ${orderId}`);
        await new Promise(resolve => setTimeout(resolve, 400));
        // Simulate validation error
        if (!trackingCode) {
            const error = new Error("Validation Failed"); error.status = 422;
            error.data = { message: "Validation Failed", errors: { trackingCode: ["Mã vận đơn không được để trống."] } };
            throw error;
        }
        return { message: `Tracking code added to order ${orderId}.` };
    },
    async initiateRefund(orderId, amount, reason) {
        console.log(`API (Simulated): Initiating refund for order ${orderId}, Amount: ${amount}, Reason: ${reason}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        if (amount <= 0) {
            const error = new Error("Invalid refund amount."); error.status = 400; throw error;
        }
        return { message: `Refund initiated for order ${orderId}.` };
    },


    // --- Services (Simulation) ---
    async getServices(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API (Simulated): Fetching services with params: ${query}`);
        await new Promise(resolve => setTimeout(resolve, 550));
        const allServices = [
            { id: 'S778', customerId: 6, customerName: 'Lý Thị F', type: 'Lắp đặt', subject: 'Lắp đặt PC mới mua', date: '2023-12-26T09:00:00', status: 'assigned', assignee: 'Nhân viên A' },
            { id: 'S777', customerId: 1, customerName: 'Nguyễn Văn A', type: 'Sửa chữa', subject: 'Laptop không lên nguồn', date: '2023-12-25T10:15:00', status: 'processing', assignee: 'Admin Demo' },
            { id: 'S776', customerId: 4, customerName: 'Phạm Thị D', type: 'Tư vấn', subject: 'Tư vấn cấu hình PC Gaming', date: '2023-12-24T09:00:00', status: 'completed', assignee: 'Admin Demo' },
            { id: 'S775', customerId: 5, customerName: 'Hoàng Văn E', type: 'Lắp đặt', subject: 'Lắp đặt mạng LAN văn phòng', date: '2023-12-23T14:30:00', status: 'closed', assignee: 'Nhân viên A' },
        ];
        let filteredServices = allServices;
        if (params.serviceFilterStatus) filteredServices = allServices.filter(s => s.status === params.serviceFilterStatus);
        if (params.serviceFilterType) filteredServices = allServices.filter(s => s.type.toLowerCase() === params.serviceFilterType.toLowerCase());
        if (params.serviceFilterSearch) {
            const searchTerm = params.serviceFilterSearch.toLowerCase();
            filteredServices = allServices.filter(s => s.id.toLowerCase().includes(searchTerm) || s.customerName.toLowerCase().includes(searchTerm) || s.subject.toLowerCase().includes(searchTerm));
        }
        if (params.serviceFilterAssignee) {
            filteredServices = allServices.filter(s => (params.serviceFilterAssignee === 'unassigned' && !s.assignee) || (s.assignee === params.serviceFilterAssignee)); // Handle unassigned case if needed
        }
        if (params.sortKey) {
            const sortKey = params.sortKey; const sortDir = params.sortDir === 'desc' ? -1 : 1;
            filteredServices.sort((a, b) => { const valA = sortKey === 'date' ? new Date(a[sortKey]) : a[sortKey]; const valB = sortKey === 'date' ? new Date(b[sortKey]) : b[sortKey]; if (valA < valB) return -1 * sortDir; if (valA > valB) return 1 * sortDir; return 0; });
        } else { filteredServices.sort((a, b) => new Date(b.date) - new Date(a.date)); }
        const page = parseInt(params.page) || 1; const limit = parseInt(params.limit) || ITEMS_PER_PAGE;
        const totalItems = filteredServices.length; const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit; const paginatedServices = filteredServices.slice(startIndex, startIndex + limit);
        return { data: paginatedServices, pagination: { totalItems, currentPage: page, itemsPerPage: limit, totalPages } };
    },
    async getServiceDetail(serviceId) {
        console.log(`API (Simulated): Fetching service details for ID: ${serviceId}`);
        await new Promise(resolve => setTimeout(resolve, 380));
        const allServicesResponse = await this.getServices({ limit: 100 });
        const service = allServicesResponse.data.find(s => s.id === serviceId);
        if (!service) { const error = new Error("Service Request not found"); error.status = 404; throw error; }
        return {
            ...service,
            customer: { id: service.customerId, name: service.customerName, email: `customer${service.customerId}@example.com` },
            description: `Chi tiết yêu cầu ${service.type} cho sản phẩm/vấn đề: ${service.subject}.\n\nKhách hàng mô tả thêm:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
            attachments: service.id === 'S777' ? [{ name: 'laptop_error.jpg', url: '#' }] : [],
            notes: [
                { user: 'Admin Demo', note: 'Đã tiếp nhận, chuyển cho Nhân viên A xử lý.', timestamp: new Date(service.date).getTime() + 1800000 },
                { user: 'Nhân viên A', note: 'Đã liên hệ khách hàng hẹn lịch kiểm tra vào ngày mai.', timestamp: new Date(service.date).getTime() + 9000000 }
            ].filter((_, i) => i < parseInt(service.id.slice(-1)) % 3) // Simulate 0-2 notes
        };
    },
    async updateService(serviceId, data) {
        console.log(`API (Simulated): Updating service ${serviceId} with data:`, data);
        await new Promise(resolve => setTimeout(resolve, 480));
        if (data.newNote && data.newNote.length < 5) {
            const error = new Error("Validation Failed"); error.status = 422;
            error.data = { message: "Validation Failed", errors: { serviceInternalNote: ["Ghi chú phải có ít nhất 5 ký tự."] } };
            throw error;
        }
        return { message: `Service Request #${serviceId} updated successfully.` };
    },

    // --- Customers (Simulation) ---
    async getCustomers(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API (Simulated): Fetching customers with params: ${query}`);
        await new Promise(resolve => setTimeout(resolve, 650));
        const allCustomers = [
            { id: 1, name: 'Nguyễn Văn A', email: 'a.nguyen@example.com', phone: '0901112233', registeredDate: '2023-10-15', orderCount: 5, totalSpent: 12500000 },
            { id: 2, name: 'Trần Thị B', email: 'b.tran@example.com', phone: '0912223344', registeredDate: '2023-11-01', orderCount: 1, totalSpent: 18990000 },
            { id: 3, name: 'Lê Văn C', email: 'c.le@example.com', phone: '0983334455', registeredDate: '2023-11-20', orderCount: 2, totalSpent: 1900000 },
            { id: 4, name: 'Phạm Thị D', email: 'd.pham@example.com', phone: '0974445566', registeredDate: '2023-12-05', orderCount: 1, totalSpent: 2800000 },
            { id: 5, name: 'Hoàng Văn E', email: 'e.hoang@example.com', phone: '0965556677', registeredDate: '2023-12-10', orderCount: 2, totalSpent: 8250000 },
            { id: 6, name: 'Lý Thị F', email: 'f.ly@example.com', phone: '0946667788', registeredDate: '2023-12-20', orderCount: 0, totalSpent: 0 },
        ];
        let filteredCustomers = allCustomers;
        if (params.customerFilterSearch) {
            const searchTerm = params.customerFilterSearch.toLowerCase();
            filteredCustomers = allCustomers.filter(c => c.name.toLowerCase().includes(searchTerm) || c.email.toLowerCase().includes(searchTerm) || c.phone.includes(searchTerm));
        }
        if (params.sortKey) {
            const sortKey = params.sortKey; const sortDir = params.sortDir === 'desc' ? -1 : 1;
            filteredCustomers.sort((a, b) => {
                const valA = sortKey === 'registered_date' ? new Date(a.registeredDate) : a[sortKey];
                const valB = sortKey === 'registered_date' ? new Date(b.registeredDate) : b[sortKey];
                if (valA < valB) return -1 * sortDir; if (valA > valB) return 1 * sortDir; return 0;
            });
        } else { filteredCustomers.sort((a,b) => b.id - a.id); }
        const page = parseInt(params.page) || 1; const limit = parseInt(params.limit) || ITEMS_PER_PAGE;
        const totalItems = filteredCustomers.length; const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit; const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + limit);
        return { data: paginatedCustomers, pagination: { totalItems, currentPage: page, itemsPerPage: limit, totalPages } };
    },
    async getCustomerDetail(customerId) {
        console.log(`API (Simulated): Fetching customer details for ID: ${customerId}`);
        await new Promise(resolve => setTimeout(resolve, 420));
        const allCustomersResponse = await this.getCustomers({ limit: 100 });
        const customer = allCustomersResponse.data.find(c => c.id == customerId);
        if (!customer) { const error = new Error("Customer not found"); error.status = 404; throw error; }
        const customerOrders = (await this.getOrders({ limit: 100 })).data.filter(o => o.customerId == customerId);
        const customerServices = (await this.getServices({ limit: 100 })).data.filter(s => s.customerId == customerId);
        return {
            ...customer,
            addresses: [ /* ... simulated addresses ... */ ],
            orderHistory: customerOrders,
            serviceHistory: customerServices,
            adminNotes: [ /* ... simulated admin notes ... */ ]
        };
    },
    async saveCustomerDetail(customerId, data) {
        console.log(`API (Simulated): Saving customer detail ${customerId}. Data:`, data);
        await new Promise(resolve => setTimeout(resolve, 580));
        if (data.newAdminNote && data.newAdminNote.length < 10) {
            const error = new Error("Validation Failed"); error.status = 422;
            error.data = { message: "Validation Failed", errors: { customerAdminNote: ["Ghi chú admin phải có ít nhất 10 ký tự."] } };
            throw error;
        }
        return { message: `Customer ${customerId} details saved.` };
    },
    async deleteCustomer(customerId) {
        console.log(`API (Simulated): Deleting customer ID: ${customerId}`);
        await new Promise(resolve => setTimeout(resolve, 480));
        return null; // Simulate 204 No Content
    },

    // --- Reports (Simulation) ---
    async getReportData(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API (Simulated): Fetching report data with params: ${query}`);
        await new Promise(resolve => setTimeout(resolve, 700));
        const factor = params.reportStartDate ? 0.8 : 1.0;
        return {
            charts: {
                reportRevenue: { labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4'], data: [55, 80, 65, 95].map(v => v * 1000000 * factor) },
                reportProducts: { labels: ['Laptop ABC', 'Phone XYZ', 'Mouse Pro', 'SSD 1TB'], data: [350, 280, 160, 100].map(v => v * 100000 * factor) }
            },
            summary: {
                lowStockCount: 4, outOfStockCount: 1, totalInventoryValue: 185000000 * factor,
                newCustomers: Math.round(50 * factor), returningCustomerRate: 0.28,
                totalServices: Math.round(20 * factor), avgServiceTime: 8500
            }
        };
    },
    async exportReport(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API (Simulated): Exporting report with params: ${query}`);
        await new Promise(resolve => setTimeout(resolve, 1200));
        return { message: `Report exported successfully.`, downloadUrl: `/api/admin/reports/export?${query}` }; // Example download URL
    },

    // --- Settings (Simulation) ---
    async getSettings(tabName) {
        console.log(`API (Simulated): Fetching settings for tab: ${tabName}`);
        await new Promise(resolve => setTimeout(resolve, 250));
        switch(tabName) {
            case 'general': return { storeName: 'TechShop', storeAddress: '123 ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh', storeEmail: 'support@techshop.example.com', storePhone: '1900 1234', storeLogo: 'https://via.placeholder.com/150x50/a29bfe/ffffff?text=TechShopLogo' };
            case 'payments': return { codEnabled: true, codTitle: 'Thanh toán khi nhận hàng', codInstructions: '', bankTransferEnabled: true, bankTransferTitle: 'Chuyển khoản ngân hàng', bankTransferDetails: 'Số TK: 123456789\nNgân hàng: Vietcombank CN HCM\nChủ TK: CTY TNHH TECHSHOP\nNội dung: Thanh toan don hang [order_id]', vnpayEnabled: false, vnpayTmnCode: '', vnpayHashSecret: '', vnpayTestMode: false };
            case 'shipping': return { zones: [ { id: 1, name: 'Nội thành TP.HCM', regions: ['Quận 1', 'Quận 3'], methods: [{ id: 10, name: 'Giao nhanh', cost: 35000, freeShippingOver: null }, {id: 11, name: 'Tiêu chuẩn', cost: 20000, freeShippingOver: 500000}] } ] }; // Example structure
            case 'emails': return { senderName: 'TechShop', senderEmail: 'noreply@techshop.example.com', templates: [{id: 'new_order', enabled: true}, {id: 'shipped_order', enabled: true}] }; // Example structure
            case 'seo': return { defaultSeoTitle: 'TechShop - Cửa hàng Công nghệ Uy tín Chính hãng', defaultSeoDescription: 'Mua sắm các sản phẩm công nghệ mới nhất: Laptop, Điện thoại, Phụ kiện chính hãng, giá tốt nhất thị trường tại TechShop. Bảo hành uy tín, giao hàng toàn quốc.', seoSeparator: '|' };
            default: return {};
        }
    },
    async saveSettings(tabName, settingsData) {
        console.log(`API (Simulated): Saving settings for tab "${tabName}". Data:`, settingsData);
        await new Promise(resolve => setTimeout(resolve, 650));
        if (tabName === 'general' && (!settingsData.storeName || !settingsData.storeEmail)) {
            const errors = {};
            if (!settingsData.storeName) errors.storeName = ["Tên cửa hàng không được để trống."];
            if (!settingsData.storeEmail) errors.storeEmail = ["Email liên hệ không được để trống."];
            const error = new Error("Validation Failed"); error.status = 422; error.data = { message: "Validation Failed", errors }; throw error;
        }
        if (tabName === 'seo' && (!settingsData.defaultSeoTitle || !settingsData.defaultSeoDescription)) {
            const errors = {};
            if (!settingsData.defaultSeoTitle) errors.defaultSeoTitle = ["Tiêu đề trang chủ không được để trống."];
            if (!settingsData.defaultSeoDescription) errors.defaultSeoDescription = ["Mô tả trang chủ không được để trống."];
            const error = new Error("Validation Failed"); error.status = 422; error.data = { message: "Validation Failed", errors }; throw error;
        }
        return { message: `Settings for "${tabName}" saved successfully.` };
    },

    // --- Notifications (Simulation) ---
    async getNotifications() {
        console.log("API (Simulated): Fetching notifications...");
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            { id: 'n5', message: 'Đơn hàng #P1001 đã hoàn thành.', timestamp: '14:10 PM', read: false, link: { type: 'order', id: 'P1001' } },
            { id: 'n1', message: 'Đơn hàng mới #P1000 cần xử lý.', timestamp: '11:30 AM', read: false, link: { type: 'order', id: 'P1000' } },
            { id: 'n2', message: 'Yêu cầu dịch vụ #S778 mới.', timestamp: '09:00 AM', read: false, link: { type: 'service', id: 'S778' } },
            { id: 'n3', message: 'Sản phẩm \'NovaTech Phone X\' sắp hết hàng (còn 3).', timestamp: 'Hôm qua', read: true, link: { type: 'product', id: 'NT-PH-01' } },
            { id: 'n4', message: 'Cập nhật thành công cài đặt SEO.', timestamp: 'Hôm qua', read: true, link: null },
        ];
    },
    async markNotificationRead(notificationId) {
        console.log(`API (Simulated): Marking notification ${notificationId} as read.`);
        await new Promise(resolve => setTimeout(resolve, 50));
        return { success: true };
    },
    async markAllNotificationsRead() {
        console.log("API (Simulated): Marking all notifications as read.");
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true };
    },

    // --- Auth (Simulation) ---
    async logout() {
        console.log("API (Simulated): Logging out.");
        await new Promise(resolve => setTimeout(resolve, 350));
        return { message: "Logout successful." };
    },

    // --- Search (Simulation) ---
    async searchAdmin(term) {
        console.log(`API (Simulated): Searching for term: "${term}"`);
        await new Promise(resolve => setTimeout(resolve, 400));
        const products = (await this.getProducts({ productFilterName: term })).data; // Use specific filter name
        const orders = (await this.getOrders({ orderFilterSearch: term })).data;
        const customers = (await this.getCustomers({ customerFilterSearch: term })).data;
        return [
            ...products.map(p => ({ type: 'Product', id: p.id, name: p.name, link: `#products?edit=${p.id}` })),
            ...orders.map(o => ({ type: 'Order', id: o.id, name: `#${o.id} - ${o.customerName}`, link: `#orders?view=${o.id}` })),
            ...customers.map(c => ({ type: 'Customer', id: c.id, name: c.name, link: `#customers?view=${c.id}` })),
        ].slice(0, 10); // Limit results
    }
};

// =========================================================================
// External Library Initializers (Placeholders)
// =========================================================================

function initWysiwygEditor(selector = '.wysiwyg-editor') {
    if (typeof tinymce !== 'undefined') {
        // Destroy existing instance first, if any
        const existingEditor = tinymce.get(selector.substring(1));
        if (existingEditor) {
            existingEditor.destroy();
        }
        console.log("Initializing TinyMCE on:", selector);
        tinymce.init({
            selector: selector,
            height: 350, // Increased height
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image media | code | help',
            content_style: 'body { font-family:Poppins,sans-serif; font-size:15px; background:#3b4446; color:#f5f6fa; line-height: 1.6; }',
            skin: 'oxide-dark', // Use dark skin
            content_css: 'dark', // Use dark content theme
            setup: function (editor) {
                editor.on('change', function () {
                    tinymce.triggerSave(); // Update underlying textarea on change
                    // Optionally update SEO preview if description changes
                    // updateSeoPreview();
                });
            }
        });
    } else {
        console.warn("TinyMCE library not found. WYSIWYG editor disabled.");
    }
}

function destroyWysiwygEditor(selector = '.wysiwyg-editor') {
    if (typeof tinymce !== 'undefined') {
        const editor = tinymce.get(selector.substring(1)); // Get editor by ID (remove .)
        if (editor) {
            console.log("Destroying TinyMCE instance:", selector);
            editor.destroy();
        }
    }
}


function initSearchableSelect(selector = '.select2-searchable') {
    document.querySelectorAll(selector).forEach(el => {
        // Destroy previous instance if exists
        if (el.choicesInstance) {
            el.choicesInstance.destroy();
            el.choicesInstance = null;
        }
        // Initialize new instance
        if (typeof Choices !== 'undefined') {
            console.log("Initializing Choices.js on:", el);
            el.choicesInstance = new Choices(el, { // Store instance on the element
                removeItemButton: true,
                searchResultLimit: 10,
                itemSelectText: '',
                allowHTML: false, // Prevent HTML injection
                classNames: { containerOuter: 'choices choices-outer', containerInner: 'choices-inner form-control', input: 'choices-input' },
            });
        } else {
            console.warn("Choices.js library not found. Searchable select disabled.");
            el.setAttribute('multiple', ''); // Ensure multiple attribute
        }
    });
}

function destroySearchableSelect(selector = '.select2-searchable') {
    if (typeof Choices !== 'undefined') {
        document.querySelectorAll(selector).forEach(el => {
            if (el.choicesInstance) {
                console.log("Destroying Choices.js instance:", el);
                el.choicesInstance.destroy();
                el.choicesInstance = null; // Clear reference
            }
        });
    }
}


function initDatePickers(selector = '.date-picker') {
    if (typeof flatpickr !== 'undefined') {
        console.log("Initializing Flatpickr on elements matching:", selector);
        document.querySelectorAll(selector).forEach(el => {
            // Destroy previous instance if exists
            if (el._flatpickr) {
                el._flatpickr.destroy();
            }
            // Initialize new instance
            const isDateTime = el.type === 'datetime-local' || el.classList.contains('datetime-picker'); // Check type or class
            flatpickr(el, {
                enableTime: isDateTime,
                dateFormat: isDateTime ? "Y-m-d H:i" : "Y-m-d",
                altInput: true,
                altFormat: isDateTime ? "d/m/Y H:i" : "d/m/Y",
                theme: "dark",
                // locale: "vn", // Requires importing the locale file
            });
        });
    } else {
        console.warn("Flatpickr library not found. Using native date pickers.");
    }
}

function destroyDatePickers(selector = '.date-picker') {
    if (typeof flatpickr !== 'undefined') {
        document.querySelectorAll(selector).forEach(el => {
            if (el._flatpickr) { // Check if flatpickr instance exists
                console.log("Destroying Flatpickr instance:", el);
                el._flatpickr.destroy();
            }
        });
    }
}


// =========================================================================
// Core UI Functions
// =========================================================================

/** Handles sidebar toggling for both desktop and mobile. */
function handleSidebarToggle() {
    if (!sidebar || !mainContent) return;
    const isMobile = window.innerWidth <= 992;
    if (isMobile) {
        const isActive = sidebar.classList.toggle('active');
        toggleMobileSidebarOverlay(isActive);
    } else {
        const isCollapsed = document.body.classList.toggle('admin-sidebar-collapsed');
        sidebar.classList.toggle('collapsed', isCollapsed);
        mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
        setTimeout(resizeAllCharts, 350); // Match CSS transition duration
    }
}

/** Toggles the body overlay for mobile sidebar. */
function toggleMobileSidebarOverlay(isActive) {
    document.body.classList.toggle('sidebar-open-overlay', isActive);
    document.body.classList.toggle('sidebar-active', isActive);
}

/** Toggles header dropdown panels (Notifications, User Menu). */
function toggleDropdown(panel, button) {
    if (!panel || !button) return;
    const isActive = panel.classList.contains('active');
    // Close others first *before* toggling the target
    closeAllDropdowns(panel); // Pass the target panel to exclude it from closing initially
    if (!isActive) {
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        requestAnimationFrame(() => { // Use rAF for smoother transition start
            panel.classList.add('active');
            button.classList.add('active');
        });
        if (panel === notificationPanel) {
            loadNotifications();
        }
    } else {
        // If already active, just close it (closeAllDropdowns handles the visual closing)
        panel.classList.remove('active');
        button.classList.remove('active');
    }
}

/** Closes all active header dropdowns, optionally excluding one. */
function closeAllDropdowns(excludePanel = null) {
    const activeDropdowns = document.querySelectorAll('.notification-panel.active, .user-dropdown.active');
    activeDropdowns.forEach(panel => {
        if (panel === excludePanel) return; // Skip the panel that was just clicked/toggled

        const associatedButton = panel.classList.contains('notification-panel') ? notificationBell : userMenuToggle;
        panel.classList.remove('active');
        associatedButton?.classList.remove('active');
        panel.style.visibility = 'hidden';
        // Get duration from computed style for accuracy
        const durationString = getComputedStyle(panel).transitionDuration || '0.3s';
        const durationMs = parseFloat(durationString) * (durationString.includes('ms') ? 1 : 1000);
        setTimeout(() => {
            if (!panel.classList.contains('active')) { // Double check if it wasn't immediately reopened
                panel.style.display = 'none';
            }
        }, durationMs);
    });
}

/** Activates the specified admin section, updates UI, and fetches data. */
async function setActiveSection(sectionId = null, params = {}, forceReload = false) {
    if (!sectionId) {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const [hashSection, hashParams] = hash.split('?');
            sectionId = hashSection || 'dashboard';
            if (hashParams) {
                params = { ...params, ...Object.fromEntries(new URLSearchParams(hashParams)) }; // Merge params
            }
        } else {
            sectionId = 'dashboard';
        }
        console.log(`Initial/Hash Load. Section: ${sectionId}, Params:`, params);
    }

    if (isLoading && !forceReload) {
        showToast("Please wait, previous action is still processing.", "warning");
        return;
    }
    const isSameSection = activeAdminSectionId === sectionId;
    // Compare stringified objects for parameter changes, ensuring order doesn't matter
    const sortObjectKeys = (obj) => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
    const currentParamsString = JSON.stringify(sortObjectKeys(currentFilters[sectionId] || {}));
    const newParamsString = JSON.stringify(sortObjectKeys(params));

    if (isSameSection && currentParamsString === newParamsString && !forceReload) {
        // console.log(`Section ${sectionId} already active with same params.`);
        return;
    }

    console.log(`Switching to section: ${sectionId} with params:`, params);
    isLoading = true;
    const previousSectionId = activeAdminSectionId;
    activeAdminSectionId = sectionId;
    currentFilters[sectionId] = { ...params }; // Store new params

    const targetSectionElement = document.getElementById(`${sectionId}-section`);
    if (!targetSectionElement) {
        console.error(`Section element not found for ID: ${sectionId}-section`);
        isLoading = false;
        return;
    }

    showLoading(targetSectionElement);

    // Update Sidebar Links and URL Hash
    sidebarLinks.forEach(link => link.classList.toggle('active', link.dataset.section === sectionId));
    const queryString = new URLSearchParams(params).toString();
    const newUrl = `#${sectionId}${queryString ? '?' + queryString : ''}`;
    if (history.pushState && window.location.hash !== newUrl) {
        history.pushState({ sectionId, params }, '', newUrl);
    } else if (!history.pushState) {
        window.location.hash = newUrl;
    }


    // Deactivate previous section & cleanup
    if (previousSectionId && previousSectionId !== sectionId) {
        const previousSectionElement = document.getElementById(`${previousSectionId}-section`);
        if (previousSectionElement) {
            previousSectionElement.classList.remove('active');
            hideAllDetailViews(previousSectionId);
            destroySectionLibraries(previousSectionId);
        }
        if (previousSectionId === 'dashboard' || previousSectionId === 'reports') {
            destroyCharts();
        }
    } else if (!previousSectionId) {
        adminSections.forEach(section => section.classList.remove('active'));
    }

    // Activate new section
    targetSectionElement.classList.add('active');

    if (window.innerWidth <= 992 && sidebar?.classList.contains('active')) {
        handleSidebarToggle();
    }

    mainContent?.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top

    try {
        await loadSectionData(sectionId, params);
        initSectionLibraries(sectionId);
        setupSectionTabs(sectionId);
        restoreListView(sectionId);
    } catch (error) {
        showToast(`Error loading section ${sectionId}: ${error.message}`, 'error');
        displayEmptyState(targetSectionElement, `Could not load data for ${sectionId}. Please try again.`);
    } finally {
        hideLoading(targetSectionElement);
        isLoading = false;
    }
}

/** Loads data for the specified section */
async function loadSectionData(sectionId, params) {
    // Include default items per page in requests
    const requestParams = { limit: ITEMS_PER_PAGE, ...params };
    switch (sectionId) {
        case 'dashboard': await loadDashboardData(); break; // Dashboard might not need pagination params
        case 'products': await loadProductListData(requestParams); break;
        case 'orders': await loadOrderListData(requestParams); break;
        case 'services': await loadServiceListData(requestParams); break;
        case 'customers': await loadCustomerListData(requestParams); break;
        case 'reports': await loadReportData(params); break; // Reports might use different params
        case 'content':
        case 'settings':
        case 'admins':
            await loadSettingsOrContentData(sectionId, params);
            break;
        default: console.warn(`No specific load function defined for section: ${sectionId}`);
    }
}

/** Initializes libraries specific to a section */
function initSectionLibraries(sectionId) {
    // Initialize date pickers in filter areas when the section becomes active
    const sectionElement = document.getElementById(`${sectionId}-section`);
    if (sectionElement) {
        const pickers = sectionElement.querySelectorAll('.filters-container .date-picker');
        if (pickers.length > 0) {
            initDatePickers(`#${sectionId}-section .filters-container .date-picker`);
        }
    }
    // Note: Form-specific libraries (WYSIWYG, Choices) are initialized when the form (e.g., product form) is shown.
}

/** Destroys libraries specific to a section when navigating away */
function destroySectionLibraries(sectionId) {
    const sectionElement = document.getElementById(`${sectionId}-section`);
    if (sectionElement) {
        // Destroy date pickers in filter areas
        const pickers = sectionElement.querySelectorAll('.filters-container .date-picker');
        if (pickers.length > 0) {
            destroyDatePickers(`#${sectionId}-section .filters-container .date-picker`);
        }
        // Destroy any other section-specific libraries if needed
    }
}

/** Sets up tabs for the currently active section. */
function setupSectionTabs(sectionId) {
    let tabLinks, tabContents;
    switch(sectionId) {
        case 'content': tabLinks = contentTabs; tabContents = contentTabContents; break;
        case 'settings': tabLinks = settingsTabs; tabContents = settingsTabContents; break;
        default: return; // Product/Customer tabs handled separately
    }
    setupTabs(tabLinks, tabContents);
}

/** Generic tab setup logic. */
function setupTabs(tabLinks, tabContents) {
    if (!tabLinks || tabLinks.length === 0 || !tabContents || tabContents.length === 0) { return; }
    tabLinks.forEach(link => {
        link.removeEventListener('click', handleTabClick); // Prevent duplicates
        link.addEventListener('click', handleTabClick);
    });
    let activeLink = Array.from(tabLinks).find(l => l.classList.contains('active'));
    if (!activeLink && tabLinks.length > 0) {
        activeLink = tabLinks[0];
        // Ensure only the first tab is marked active initially if none are specified
        tabLinks.forEach((link, index) => {
            link.classList.toggle('active', index === 0);
            link.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        });
    }
    if (activeLink) {
        activateTab(activeLink, tabContents, tabLinks); // Activate content for the initially active tab
    }
}

/** Handles clicks on tab links. */
function handleTabClick(event) {
    event.preventDefault();
    const clickedLink = event.currentTarget;
    const parentNav = clickedLink.closest('.tabs');
    if (!parentNav || clickedLink.classList.contains('active')) return; // Do nothing if already active

    const siblingLinks = parentNav.querySelectorAll('.tab-link');
    let contentContainer;
    if(parentNav.classList.contains('product-form-tabs')) contentContainer = productFormContainer;
    else if (parentNav.classList.contains('customer-detail-tabs')) contentContainer = customerDetailContent;
    else contentContainer = parentNav.parentElement; // General case (Settings, Content)

    const siblingContents = contentContainer?.querySelectorAll(':scope > .tab-content');

    if (siblingContents && siblingContents.length > 0) {
        activateTab(clickedLink, siblingContents, siblingLinks);
        // Load data for newly activated settings tab
        if (parentNav.classList.contains('settings-tabs')) {
            loadSettingsTabData(clickedLink.dataset.tab.replace('settings-', ''));
        }
        // Add similar logic for Content tabs if content needs dynamic loading
    } else {
        console.warn("Could not find sibling tab content panels for", clickedLink);
    }
}

/** Activates a specific tab and its content panel. */
function activateTab(linkToActivate, contentPanels, tabLinks = null) {
    const tabId = linkToActivate.dataset.tab;
    if (!tabId) return;
    if (!tabLinks) {
        const parentNav = linkToActivate.closest('.tabs');
        if (!parentNav) return;
        tabLinks = parentNav.querySelectorAll('.tab-link');
    }
    // Deactivate others
    tabLinks.forEach(l => { l.classList.remove('active'); l.setAttribute('aria-selected', 'false'); });
    contentPanels.forEach(c => c.classList.remove('active'));
    // Activate target
    linkToActivate.classList.add('active');
    linkToActivate.setAttribute('aria-selected', 'true');
    const activeContent = document.getElementById(tabId);
    if (activeContent) {
        activeContent.classList.add('active'); // Show content
        // Initialize libraries within the newly activated tab content if needed
        // e.g., initDatePickers(`#${tabId} .date-picker`);
    } else {
        console.warn(`Tab content with id "${tabId}" not found.`);
    }
}

/** Hides all detail/form views and destroys associated libraries */
function hideAllDetailViews(sectionIdToRestoreList = null) {
    hideElement(productFormContainer);
    hideElement(orderDetailView);
    hideElement(serviceDetailView);
    hideElement(customerDetailView);

    // Destroy libraries associated with forms/details when they are hidden
    destroyWysiwygEditor('#productDescription');
    destroySearchableSelect('#productCategory');
    destroyDatePickers('#productForm .date-picker'); // Destroy pickers within the product form
    // Add destroy calls for other libraries if used in detail views

    // Restore list view only if the section being restored is the currently active one
    if (sectionIdToRestoreList && sectionIdToRestoreList === activeAdminSectionId) {
        restoreListView(sectionIdToRestoreList);
    }
}

/** Restores the list view elements for a given section. */
function restoreListView(sectionId) {
    if (sectionId !== activeAdminSectionId) return; // Only restore if currently active
    console.log(`Restoring list view for section: ${sectionId}`);
    switch(sectionId) {
        case 'products':
            showElement(productListView); showElement(productPagination);
            flexElement(productFiltersContainer); flexElement(productBulkActionsContainer);
            hideElement(productFormContainer);
            break;
        case 'orders':
            showElement(orderListView); showElement(orderPagination);
            flexElement(orderFiltersContainer); flexElement(orderBulkActionsContainer);
            hideElement(orderDetailView);
            break;
        case 'services':
            showElement(servicesSection?.querySelector('.table-responsive')); showElement(servicePagination);
            flexElement(serviceFiltersContainer);
            hideElement(serviceDetailView);
            break;
        case 'customers':
            showElement(customersSection?.querySelector('.table-responsive')); showElement(customerPagination);
            flexElement(customerFiltersContainer);
            hideElement(customerDetailView);
            break;
        // Add cases for reports, settings, content, admins if they have list/detail toggles
    }
}

// =========================================================================
// Charting Functions
// =========================================================================

/** Destroys all existing Chart.js instances. */
function destroyCharts() {
    Object.keys(charts).forEach(key => {
        if (charts[key] && typeof charts[key].destroy === 'function') {
            charts[key].destroy();
        }
        delete charts[key];
    });
    // console.log("Charts destroyed.");
}

/** Resizes all active Chart.js instances. */
function resizeAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            // Use timeout to ensure container is rendered before resizing
            // setTimeout(() => chart.resize(), 0); // May not be needed with current setup
            chart.resize();
        }
    });
    // console.log("Charts resized.");
}

/** Initializes charts for a specific section using provided data. */
function initChartsForSection(sectionId, chartData) {
    // Define contexts here to avoid issues if called before DOM fully ready
    const dashRevenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    const dashOrderStatusCtx = document.getElementById('orderStatusChart')?.getContext('2d');
    const dashTopProductsCtx = document.getElementById('topProductsChart')?.getContext('2d');
    const reportRevenueCtx = document.getElementById('reportRevenueChart')?.getContext('2d');
    const reportTopProductsCtx = document.getElementById('reportTopProductsChart')?.getContext('2d');

    // Common Chart.js options
    const commonOptions = {
        maintainAspectRatio: false, responsive: true,
        plugins: { legend: { labels: { color: 'rgba(245, 246, 250, 0.8)', padding: 15 }, position: 'bottom' }, tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#fff', bodyColor: '#fff', padding: 12, cornerRadius: 4 } },
        scales: { x: { ticks: { color: 'rgba(245, 246, 250, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false } }, y: { ticks: { color: 'rgba(245, 246, 250, 0.7)', beginAtZero: true }, grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false } } },
        animation: { duration: 800, easing: 'easeInOutQuart' }
    };
    const lineOptions = { ...commonOptions };
    const barOptions = { ...commonOptions };
    const doughnutOptions = { ...commonOptions, scales: {}, cutout: '60%' };

    try {
        // Destroy previous charts for the *specific* section being loaded
        if (sectionId === 'dashboard') {
            if(charts.revenue) charts.revenue.destroy(); delete charts.revenue;
            if(charts.orderStatus) charts.orderStatus.destroy(); delete charts.orderStatus;
            if(charts.topProducts) charts.topProducts.destroy(); delete charts.topProducts;
        } else if (sectionId === 'reports') {
            if(charts.reportRevenue) charts.reportRevenue.destroy(); delete charts.reportRevenue;
            if(charts.reportTopProducts) charts.reportTopProducts.destroy(); delete charts.reportTopProducts;
            // Destroy other report charts if added
        }

        console.log(`Initializing charts for section: ${sectionId}`);

        // Dashboard Charts
        if (sectionId === 'dashboard' && chartData?.dashboard?.charts) {
            const data = chartData.dashboard.charts;
            if (dashRevenueCtx && data.revenue) {
                charts.revenue = new Chart(dashRevenueCtx, { type: 'line', data: { labels: data.revenue.labels, datasets: [{ label: 'Doanh thu', data: data.revenue.data, borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#6c5ce7', pointHoverRadius: 6 }] }, options: lineOptions });
            }
            if (dashOrderStatusCtx && data.orderStatus) {
                charts.orderStatus = new Chart(dashOrderStatusCtx, { type: 'doughnut', data: { labels: data.orderStatus.labels, datasets: [{ data: data.orderStatus.data, backgroundColor: ['#fdcb6e', '#0984e3', '#00b894', '#d63031'], hoverOffset: 8, borderColor: '#3b4446', borderWidth: 2 }] }, options: doughnutOptions });
            }
            if (dashTopProductsCtx && data.topProducts) {
                charts.topProducts = new Chart(dashTopProductsCtx, { type: 'bar', data: { labels: data.topProducts.labels, datasets: [{ label: 'Số lượng bán', data: data.topProducts.data, backgroundColor: 'rgba(162, 155, 254, 0.7)', borderColor: '#a29bfe', borderWidth: 1, borderRadius: 4 }] }, options: barOptions });
            }
        }
        // Report Charts
        else if (sectionId === 'reports' && chartData?.reports?.charts) {
            const data = chartData.reports.charts;
            if (reportRevenueCtx && data.reportRevenue) {
                charts.reportRevenue = new Chart(reportRevenueCtx, { type: 'line', data: { labels: data.reportRevenue.labels, datasets: [{ label: 'Doanh thu', data: data.reportRevenue.data, borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.1 }] }, options: lineOptions });
            }
            if (reportTopProductsCtx && data.reportProducts) {
                charts.reportTopProducts = new Chart(reportTopProductsCtx, { type: 'bar', data: { labels: data.reportProducts.labels, datasets: [{ label: 'Doanh thu SP', data: data.reportProducts.data, backgroundColor: 'rgba(162, 155, 254, 0.7)', borderColor: '#a29bfe', borderWidth: 1 }] }, options: barOptions });
            }
            // Add more report charts
        }
        // Resize after a short delay to ensure container dimensions are stable
        setTimeout(resizeAllCharts, 150); // Increased delay slightly
    } catch (error) {
        console.error("Error initializing charts:", error);
        showToast("Could not load charts.", "error");
    }
}

// =========================================================================
// Data Loading and Rendering Functions
// =========================================================================

async function loadDashboardData() {
    showLoading(dashboardSection);
    try {
        const data = await apiService.getDashboardData();

        // Update KPIs
        if (kpiRevenueToday) kpiRevenueToday.textContent = formatAdminCurrency(data.kpis.revenueToday);
        if (kpiRevenueChange) {
            const changePercent = (data.kpis.revenueChange * 100).toFixed(1);
            const changeClass = data.kpis.revenueChange >= 0 ? 'positive' : 'negative';
            const changeIcon = data.kpis.revenueChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            kpiRevenueChange.className = `kpi-change ${changeClass}`;
            kpiRevenueChange.innerHTML = `<i class="fas ${changeIcon}"></i> ${Math.abs(changePercent)}% vs hôm qua`;
        }
        if (kpiNewOrders) kpiNewOrders.textContent = data.kpis.newOrders;
        if (kpiNewOrdersStatus) kpiNewOrdersStatus.textContent = data.kpis.newOrdersStatus === 'pending' ? 'Chờ xử lý' : data.kpis.newOrdersStatus;
        if (kpiNewServices) kpiNewServices.textContent = data.kpis.newServices;
        if (kpiNewServicesStatus) kpiNewServicesStatus.textContent = data.kpis.newServicesStatus === 'new' ? 'Cần xem xét' : data.kpis.newServicesStatus;
        if (kpiLowStock) kpiLowStock.textContent = data.kpis.lowStock;
        if (kpiLowStockStatus) kpiLowStockStatus.textContent = data.kpis.lowStockStatus === 'low_stock' ? `Dưới 5 SP` : data.kpis.lowStockStatus;

        // Render Quick Lists
        renderQuickList(quickListRecentOrders, data.recentOrders, renderRecentOrderItem, 'Không có đơn hàng mới.');
        renderQuickList(quickListRecentServices, data.recentServices, renderRecentServiceItem, 'Không có yêu cầu DV mới.');
        renderQuickList(quickListLowStockProducts, data.lowStockProducts, renderLowStockProductItem, 'Không có SP sắp hết hàng.');
        renderQuickList(quickListActivityLog, data.activityLog, renderActivityLogItem, 'Không có hoạt động gần đây.');

        initChartsForSection('dashboard', { dashboard: data });

    } catch (error) {
        showToast(`Error loading dashboard data: ${error.message}`, 'error');
        displayEmptyState(dashboardSection || mainContent, 'Could not load dashboard data. Please refresh.'); // Display error in main area
    } finally {
        hideLoading(dashboardSection);
    }
}

async function loadProductListData(params = {}) {
    const container = productListView;
    const tableBody = productTableBody;
    if (!container || !tableBody) return;
    showLoading(container);
    try {
        const sortParams = currentTableSort.products.key ? { sortKey: currentTableSort.products.key, sortDir: currentTableSort.products.direction } : {};
        const requestParams = { page: 1, limit: ITEMS_PER_PAGE, ...currentFilters.products, ...params, ...sortParams }; // Merge stored filters, new params, sort

        const response = await apiService.getProducts(requestParams);
        renderProductTable(response.data);
        renderPagination(productPagination, response.pagination, 'products', requestParams); // Pass merged params for pagination links
        updateTableSortUI('products');
        handleTableSelection(selectAllProductsCheckbox, '.product-checkbox', productsSection);
        if (applyProductBulkActionBtn) applyProductBulkActionBtn.disabled = true;
        if (selectAllProductsCheckbox) { selectAllProductsCheckbox.checked = false; selectAllProductsCheckbox.indeterminate = false; }
    } catch (error) {
        showToast(`Error loading products: ${error.message}`, 'error');
        displayEmptyState(tableBody, 'Could not load products.', 8);
    } finally { hideLoading(container); }
}

async function loadOrderListData(params = {}) {
    const container = orderListView;
    const tableBody = orderTableBody;
    if (!container || !tableBody) return;
    showLoading(container);
    try {
        const sortParams = currentTableSort.orders.key ? { sortKey: currentTableSort.orders.key, sortDir: currentTableSort.orders.direction } : {};
        const requestParams = { page: 1, limit: ITEMS_PER_PAGE, ...currentFilters.orders, ...params, ...sortParams };

        const response = await apiService.getOrders(requestParams);
        renderOrderTable(response.data);
        renderPagination(orderPagination, response.pagination, 'orders', requestParams);
        updateTableSortUI('orders');
        handleTableSelection(selectAllOrdersCheckbox, '.order-checkbox', ordersSection);
        if (applyOrderBulkActionBtn) applyOrderBulkActionBtn.disabled = true;
        if (selectAllOrdersCheckbox) { selectAllOrdersCheckbox.checked = false; selectAllOrdersCheckbox.indeterminate = false; }
    } catch (error) {
        showToast(`Error loading orders: ${error.message}`, 'error');
        displayEmptyState(tableBody, 'Could not load orders.', 8);
    } finally { hideLoading(container); }
}

async function loadServiceListData(params = {}) {
    const container = servicesSection?.querySelector('.table-responsive');
    const tableBody = serviceTableBody;
    if (!container || !tableBody) return;
    showLoading(container);
    try {
        const sortParams = currentTableSort.services.key ? { sortKey: currentTableSort.services.key, sortDir: currentTableSort.services.direction } : {};
        const requestParams = { page: 1, limit: ITEMS_PER_PAGE, ...currentFilters.services, ...params, ...sortParams };
        const response = await apiService.getServices(requestParams);
        renderServiceTable(response.data);
        renderPagination(servicePagination, response.pagination, 'services', requestParams);
        updateTableSortUI('services');
    } catch (error) {
        showToast(`Error loading services: ${error.message}`, 'error');
        displayEmptyState(tableBody, 'Could not load service requests.', 8);
    } finally { hideLoading(container); }
}

async function loadCustomerListData(params = {}) {
    const container = customersSection?.querySelector('.table-responsive');
    const tableBody = customerTableBody;
    if (!container || !tableBody) return;
    showLoading(container);
    try {
        const sortParams = currentTableSort.customers.key ? { sortKey: currentTableSort.customers.key, sortDir: currentTableSort.customers.direction } : {};
        const requestParams = { page: 1, limit: ITEMS_PER_PAGE, ...currentFilters.customers, ...params, ...sortParams };
        const response = await apiService.getCustomers(requestParams);
        renderCustomerTable(response.data);
        renderPagination(customerPagination, response.pagination, 'customers', requestParams);
        updateTableSortUI('customers');
    } catch (error) {
        showToast(`Error loading customers: ${error.message}`, 'error');
        displayEmptyState(tableBody, 'Could not load customers.', 7);
    } finally { hideLoading(container); }
}

async function loadReportData(params = {}) {
    const container = reportsSection;
    if(!container) return;
    showLoading(container);
    try {
        const requestParams = { ...params }; // Pass filters to API
        const reportData = await apiService.getReportData(requestParams);

        // Render report summaries
        if(reportLowStockCount) reportLowStockCount.textContent = reportData.summary.lowStockCount;
        if(reportOutOfStockCount) reportOutOfStockCount.textContent = reportData.summary.outOfStockCount;
        if(reportInventoryValue) reportInventoryValue.textContent = formatAdminCurrency(reportData.summary.totalInventoryValue);
        if(reportNewCustomers) reportNewCustomers.textContent = reportData.summary.newCustomers;
        if(reportReturningRate) reportReturningRate.textContent = `${(reportData.summary.returningCustomerRate * 100).toFixed(1)}%`;
        if(reportTopCustomers) reportTopCustomers.textContent = 'Customer A, Customer B'; // Placeholder
        if(reportTotalServices) reportTotalServices.textContent = reportData.summary.totalServices;
        if(reportServicesByType) reportServicesByType.textContent = 'Sửa chữa: 10, Lắp đặt: 5, Tư vấn: 5'; // Placeholder
        if(reportAvgServiceTime) {
            const hours = Math.floor(reportData.summary.avgServiceTime / 3600);
            const minutes = Math.floor((reportData.summary.avgServiceTime % 3600) / 60);
            reportAvgServiceTime.textContent = `${hours}h ${minutes}m`;
        }
        initChartsForSection('reports', { reports: reportData });
    } catch (error) {
        showToast(`Error loading reports: ${error.message}`, 'error');
        displayEmptyState(container.querySelector('.report-grid') || container, 'Could not load report data.'); // Display in grid or main container
    } finally { hideLoading(container); }
}

async function loadSettingsOrContentData(sectionId, params = {}) {
    console.log(`Loading data for section: ${sectionId}`);
    // Determine the active tab within Settings or Content if applicable
    let activeTabId = null;
    if (sectionId === 'settings') {
        const activeTabLink = settingsTabs?.querySelector('.tab-link.active');
        activeTabId = activeTabLink?.dataset.tab || 'settings-general';
        await loadSettingsTabData(activeTabId.replace('settings-', ''));
    } else if (sectionId === 'content') {
        const activeTabLink = contentTabs?.querySelector('.tab-link.active');
        activeTabId = activeTabLink?.dataset.tab || 'content-pages';
        await loadContentTabData(activeTabId.replace('content-', ''));
    }
    // Add logic for loading Admins list if needed
    else if (sectionId === 'admins') {
        // await loadAdminAccountsList(params); // Example
    }
}

async function loadSettingsTabData(tabName) {
    const container = document.getElementById(`settings-${tabName}`);
    if (!container) {
        console.warn(`Settings tab container not found: settings-${tabName}`);
        return;
    }
    const form = container.querySelector('form');
    showLoading(container);
    try {
        const settings = await apiService.getSettings(tabName);
        if (form) {
            clearFormValidation(form);
            for (const key in settings) {
                const input = form.querySelector(`[name="${key}"], #${key}`);
                if (input) {
                    if (input.type === 'checkbox') input.checked = settings[key];
                    else if (input.tagName === 'TEXTAREA') input.value = settings[key];
                    else input.value = settings[key];
                } else if (key === 'storeLogo' && form.querySelector('#storeLogoPreview')) {
                    const preview = form.querySelector('#storeLogoPreview');
                    preview.innerHTML = settings[key] ? `<img src="${settings[key]}" alt="Current Logo" style="max-height: 50px; width:auto;">` : '';
                }
            }
        } else if (tabName === 'payments') {
            // Populate individual payment gateway controls
            container.querySelectorAll('.payment-gateway-setting').forEach(gw => {
                const codEnabled = gw.querySelector('#codEnabled');
                if(codEnabled) codEnabled.checked = settings.codEnabled ?? false;
                if(gw.querySelector('#codTitle')) gw.querySelector('#codTitle').value = settings.codTitle || '';
                if(gw.querySelector('#codInstructions')) gw.querySelector('#codInstructions').value = settings.codInstructions || '';

                const bankTransferEnabled = gw.querySelector('#bankTransferEnabled');
                if(bankTransferEnabled) bankTransferEnabled.checked = settings.bankTransferEnabled ?? false;
                if(gw.querySelector('#bankTransferTitle')) gw.querySelector('#bankTransferTitle').value = settings.bankTransferTitle || '';
                if(gw.querySelector('#bankTransferDetails')) gw.querySelector('#bankTransferDetails').value = settings.bankTransferDetails || '';

                const vnpayEnabled = gw.querySelector('#vnpayEnabled');
                if(vnpayEnabled) vnpayEnabled.checked = settings.vnpayEnabled ?? false;
                if(gw.querySelector('#vnpayTmnCode')) gw.querySelector('#vnpayTmnCode').value = settings.vnpayTmnCode || '';
                if(gw.querySelector('#vnpayHashSecret')) gw.querySelector('#vnpayHashSecret').value = settings.vnpayHashSecret || '';
                if(gw.querySelector('#vnpayTestMode')) gw.querySelector('#vnpayTestMode').checked = settings.vnpayTestMode ?? false;

                // Trigger display update for detail sections based on checkbox state
                gw.querySelectorAll('.form-check-input[type="checkbox"]').forEach(checkbox => {
                    const detailsDiv = checkbox.closest('.payment-gateway-setting')?.querySelector('.gateway-details');
                    if (detailsDiv) detailsDiv.style.display = checkbox.checked ? 'block' : 'none';
                });
            });
        } else if (tabName === 'shipping') {
            // TODO: Render shipping zones and methods from settings data
            console.log("Populating Shipping Settings UI...");
            shippingSettingsContainer.querySelector('.shipping-zones-container').innerHTML = '<p>Shipping zone rendering logic needed here.</p>'; // Placeholder
        } else if (tabName === 'emails') {
            // TODO: Populate email settings (sender info, template toggles)
            console.log("Populating Email Settings UI...");
            emailSettingsContainer.querySelector('.email-template-list').innerHTML = '<p>Email template list rendering logic needed here.</p>'; // Placeholder
        }
    } catch (error) {
        showToast(`Error loading ${tabName} settings: ${error.message}`, 'error');
        displayEmptyState(container, `Could not load ${tabName} settings.`);
    } finally { hideLoading(container); }
}

async function loadContentTabData(tabName) {
    const container = document.getElementById(`content-${tabName}`);
    if (!container) {
        console.warn(`Content tab container not found: content-${tabName}`);
        return;
    }
    showLoading(container);
    try {
        // TODO: Implement API calls and rendering for Pages, Banners, FAQ etc.
        console.log(`Loading content for tab: ${tabName}...`);
        await new Promise(resolve => setTimeout(resolve, 400)); // Simulate load
        // Example: Populate table for Pages
        if (tabName === 'pages') {
            const tableBody = container.querySelector('#contentPagesTableBody');
            if (tableBody) {
                // Replace static content with dynamic rendering
                // const pages = await apiService.getPages();
                // tableBody.innerHTML = pages.map(page => `<tr>...</tr>`).join('');
                console.log("Page list rendering logic needed.");
            }
        } else if (tabName === 'banners') {
            console.log("Banner list rendering logic needed.");
        } else if (tabName === 'faq') {
            console.log("FAQ list rendering logic needed.");
        }
        // displayEmptyState(container, `Content for "${tabName}" loaded (placeholder).`);
    } catch (error) {
        showToast(`Error loading ${tabName} content: ${error.message}`, 'error');
        displayEmptyState(container, `Could not load ${tabName} content.`);
    } finally { hideLoading(container); }
}

// --- Rendering Helpers ---

/** Renders rows for the product table. */
function renderProductTable(products) {
    if (!productTableBody) return;
    if (!products || products.length === 0) {
        displayEmptyState(productTableBody, 'Không tìm thấy sản phẩm nào.', 8);
        return;
    }
    productTableBody.innerHTML = products.map(product => {
        const priceHTML = product.salePrice && product.salePrice < product.price
            ? `${formatAdminCurrency(product.salePrice)} <span class="old-price-inline">${formatAdminCurrency(product.price)}</span>`
            : formatAdminCurrency(product.price || 0);
        const stockLevel = product.stock ?? 'N/A';
        let stockClass = '';
        if (product.manageStock !== false) {
            if (stockLevel <= 0) stockClass = 'stock-out';
            else if (stockLevel <= (product.lowStockThreshold || 5)) stockClass = 'stock-low';
        }
        const stockDisplay = product.manageStock === false ? '-' : stockLevel;

        // Ensure product name is escaped to prevent XSS if names can contain HTML
        const escapedProductName = product.name ? product.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'N/A';

        return `
                 <tr data-product-row-id="${product.id}">
                     <td><input type="checkbox" class="product-checkbox" value="${product.id}" aria-label="Select product ${escapedProductName}"></td>
                     <td><img src="${product.image || 'https://via.placeholder.com/50x50/cccccc/ffffff?text=N/A'}" alt="${escapedProductName}"></td>
                     <td><a href="#" class="link-edit-product" data-product-id="${product.id}">${escapedProductName}</a></td>
                     <td>${product.sku || 'N/A'}</td>
                     <td>${priceHTML}</td>
                     <td class="${stockClass}">${stockDisplay}</td>
                     <td><span class="status status-${product.status || 'draft'}">${getProductStatusText(product.status)}</span></td>
                     <td>
                         <button class="btn-icon btn-edit-product" title="Sửa" data-product-id="${product.id}"><i class="fas fa-edit" aria-hidden="true"></i></button>
                         <button class="btn-icon btn-delete-product" title="Xóa" data-product-id="${product.id}" data-product-name="${escapedProductName}"><i class="fas fa-trash-alt" aria-hidden="true"></i></button>
                         <a href="/product/${product.slug || product.id}" target="_blank" class="btn-icon" title="Xem trên web" aria-label="Xem ${escapedProductName} trên web"><i class="fas fa-eye" aria-hidden="true"></i></a>
                         <button class="btn-icon btn-duplicate-product" title="Nhân bản" data-product-id="${product.id}"><i class="fas fa-copy" aria-hidden="true"></i></button>
                     </td>
                 </tr>`;
    }).join('');
}

/** Renders rows for the order table. */
function renderOrderTable(orders) {
    if (!orderTableBody) return;
    if (!orders || orders.length === 0) {
        displayEmptyState(orderTableBody, 'Không tìm thấy đơn hàng nào.', 8);
        return;
    }
    orderTableBody.innerHTML = orders.map(order => `
             <tr class="${order.orderStatus === 'pending' ? 'order-new' : ''}" data-order-row-id="${order.id}">
                 <td><input type="checkbox" class="order-checkbox" value="${order.id}" aria-label="Select order ${order.id}"></td>
                 <td><a href="#" class="link-view-order" data-order-id="${order.id}">#${order.id}</a></td>
                 <td><a href="#" class="link-view-customer" data-customer-id="${order.customerId}">${order.customerName || 'N/A'}</a></td>
                 <td>${formatAdminDateTime(order.date)}</td>
                 <td>${formatAdminCurrency(order.total)}</td>
                 <td><span class="status status-${getPaymentStatusClass(order.paymentStatus)}" title="${getPaymentStatusTitle(order.paymentStatus, order.paymentMethod)}">${getPaymentStatusText(order.paymentStatus)}</span></td>
                 <td>
                      <select class="form-control-sm status-dropdown order-status-dropdown" data-order-id="${order.id}" aria-label="Order Status for ${order.id}">
                         ${getOrderStatusOptions(order.orderStatus)}
                      </select>
                 </td>
                 <td>
                     <button class="btn-icon btn-view-order" title="Xem chi tiết" data-order-id="${order.id}"><i class="fas fa-eye" aria-hidden="true"></i></button>
                     <button class="btn-icon btn-print-invoice" title="In hóa đơn" data-order-id="${order.id}"><i class="fas fa-print" aria-hidden="true"></i></button>
                  </td>
             </tr>
         `).join('');
}

/** Renders rows for the service request table. */
function renderServiceTable(services) {
    if (!serviceTableBody) return;
    if (!services || services.length === 0) {
        displayEmptyState(serviceTableBody, 'Không tìm thấy yêu cầu dịch vụ nào.', 8);
        return;
    }
    serviceTableBody.innerHTML = services.map(service => `
            <tr data-service-row-id="${service.id}">
                <td><a href="#" class="link-view-service" data-service-id="${service.id}">#${service.id}</a></td>
                <td><a href="#" class="link-view-customer" data-customer-id="${service.customerId}">${service.customerName || 'N/A'}</a></td>
                <td>${service.type || 'N/A'}</td>
                <td>${service.subject || 'N/A'}</td>
                 <td>${formatAdminDateTime(service.date)}</td>
                <td>
                     <select class="form-control-sm status-dropdown service-status-dropdown" data-service-id="${service.id}" aria-label="Service status for ${service.id}">
                         ${getServiceStatusOptions(service.status)}
                     </select>
                </td>
                <td>
                     <select class="form-control-sm assignee-dropdown service-assignee-dropdown" data-service-id="${service.id}" aria-label="Assignee for ${service.id}">
                         ${getAssigneeOptions(service.assignee)}
                     </select>
                </td>
                <td>
                    <button class="btn-icon btn-view-service" title="Xem chi tiết" data-service-id="${service.id}"><i class="fas fa-eye" aria-hidden="true"></i></button>
                </td>
            </tr>
        `).join('');
}

/** Renders rows for the customer table. */
function renderCustomerTable(customers) {
    if (!customerTableBody) return;
    if (!customers || customers.length === 0) {
        displayEmptyState(customerTableBody, 'Không tìm thấy khách hàng nào.', 7);
        return;
    }
    customerTableBody.innerHTML = customers.map(customer => `
            <tr data-customer-row-id="${customer.id}">
                <td><a href="#" class="link-view-customer" data-customer-id="${customer.id}">${customer.name || 'N/A'}</a></td>
                <td>${customer.email || 'N/A'}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.registeredDate ? formatAdminDateTime(customer.registeredDate, { dateStyle: 'short' }) : 'N/A'}</td>
                <td>${customer.orderCount ?? 0}</td>
                <td>${formatAdminCurrency(customer.totalSpent || 0)}</td>
                <td>
                    <button class="btn-icon btn-view-customer" title="Xem chi tiết" data-customer-id="${customer.id}"><i class="fas fa-eye" aria-hidden="true"></i></button>
                    <button class="btn-icon btn-email-customer" title="Gửi Email" data-customer-id="${customer.id}" data-customer-email="${customer.email}"><i class="fas fa-envelope" aria-hidden="true"></i></button>
                    <button class="btn-icon text-danger btn-delete-customer" title="Xóa Khách hàng" data-customer-id="${customer.id}" data-customer-name="${customer.name || customer.id}"><i class="fas fa-user-times" aria-hidden="true"></i></button>
                </td>
            </tr>
        `).join('');
}

/** Renders a generic list with a custom item renderer. */
function renderQuickList(listElement, items, renderItemFunction, emptyMessage = 'Không có mục nào.') {
    if (!listElement) return;
    if (!items || items.length === 0) {
        listElement.innerHTML = `<li class="text-muted p-2 text-center">${emptyMessage}</li>`;
        return;
    }
    listElement.innerHTML = items.map(renderItemFunction).join('');
}
function renderRecentOrderItem(order) {
    return `
             <li>
                 <span>#${order.id} - ${order.customer} - ${formatAdminCurrency(order.total)}</span>
                 <button class="btn btn-xs btn-outline btn-view-order" data-order-id="${order.id}">Xử lý</button>
             </li>`;
}
function renderRecentServiceItem(service) {
    return `
             <li>
                 <span>#${service.id} - ${service.customer} - ${service.type}</span>
                 <button class="btn btn-xs btn-outline btn-view-service" data-service-id="${service.id}">Xem</button>
             </li>`;
}
function renderLowStockProductItem(product) {
    return `
             <li class="product-list-item">
                 <img src="${product.image || 'https://via.placeholder.com/40x40/cccccc/ffffff?text=N/A'}" alt="${product.name}">
                 <span>${product.name} (Còn ${product.stock})</span>
                 <button class="btn btn-xs btn-outline btn-edit-product" data-product-id="${product.id}">Nhập kho</button>
             </li>`;
}
function renderActivityLogItem(log) {
    // Basic escaping for action text
    const escapedAction = log.action.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
             <li>
                 <span>${log.user ? `<strong>${log.user}</strong> ` : ''}${escapedAction}</span>
                 <span class="timestamp">${log.timestamp}</span>
             </li>`;
}


/** Renders pagination controls. */
function renderPagination(container, paginationData, sectionId, currentParams = {}) {
    if (!container || !paginationData || paginationData.totalPages <= 1) {
        if (container) container.innerHTML = ''; // Clear if no pagination needed
        return;
    }

    const { currentPage, totalPages } = paginationData;
    let paginationHTML = '<ul class="pagination">';

    // Previous Button
    paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" data-section="${sectionId}" aria-label="Previous page">«</a>
            </li>`;

    // Page Number Buttons (with ellipsis logic)
    const maxPagesToShow = 5; // Max number of direct page links
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        // Show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // Calculate start/end with ellipsis
        const maxPagesBeforeCurrent = Math.floor((maxPagesToShow - 1) / 2);
        const maxPagesAfterCurrent = Math.ceil((maxPagesToShow - 1) / 2);

        if (currentPage <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = maxPagesToShow - 1; // Show first pages and ellipsis at end
        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - maxPagesToShow + 2; // Show last pages and ellipsis at start
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrent + 1; // Show pages around current
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }

    // Ellipsis at the beginning?
    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1" data-section="${sectionId}">1</a></li>`;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Render page links
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}" data-section="${sectionId}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</a>
                </li>`;
    }

    // Ellipsis at the end?
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}" data-section="${sectionId}">${totalPages}</a></li>`;
    }


    // Next Button
    paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" data-section="${sectionId}" aria-label="Next page">»</a>
            </li>`;

    paginationHTML += '</ul>';
    container.innerHTML = paginationHTML;

    // No need to add listeners here, handled by global delegated click handler
}

// --- Status/Option Helpers ---
function getProductStatusText(status) {
    const statuses = { published: 'Đang bán', draft: 'Nháp', archived: 'Lưu trữ', low_stock: 'Sắp hết', out_of_stock: 'Hết hàng' };
    return statuses[status] || status?.replace(/_/g, ' ')?.replace(/^\w/, c => c.toUpperCase()) || 'N/A'; // Format fallback
}
function getPaymentStatusText(status) {
    const statuses = { paid: 'Đã TT', pending: 'Chờ TT', failed: 'Thất bại', refunded: 'Đã hoàn tiền' };
    return statuses[status] || status?.replace(/^\w/, c => c.toUpperCase()) || 'N/A';
}
function getPaymentStatusClass(status) {
    const classes = { paid: 'paid', pending: 'unpaid', failed: 'failed', refunded: 'archived' };
    return classes[status] || 'pending';
}
function getPaymentStatusTitle(status, method) {
    let title = getPaymentStatusText(status);
    if (method) title += ` (${method})`;
    return title;
}
function getOrderStatusOptions(currentStatus) {
    const statuses = { pending: 'Chờ xử lý', processing: 'Đang chuẩn bị', shipped: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Đã hủy' };
    return Object.entries(statuses).map(([value, text]) => `<option value="${value}" ${value === currentStatus ? 'selected' : ''}>${text}</option>`).join('');
}
function getServiceStatusOptions(currentStatus) {
    const statuses = { new: 'Mới', assigned: 'Đã tiếp nhận', processing: 'Đang xử lý', waiting: 'Chờ phản hồi', completed: 'Hoàn thành', closed: 'Đã đóng' };
    return Object.entries(statuses).map(([value, text]) => `<option value="${value}" ${value === currentStatus ? 'selected' : ''}>${text}</option>`).join('');
}
function getAssigneeOptions(currentAssignee) {
    // In real app, fetch admins from API
    const assignees = [
        { value: '', text: '-- Chưa gán --' }, // Default empty value
        { value: 'Admin Demo', text: 'Admin Demo' }, // Assuming value is the name here
        { value: 'Nhân viên A', text: 'Nhân viên A' },
        { value: 'Nhân viên B', text: 'Nhân viên B' }
    ];
    return assignees.map(assignee => `<option value="${assignee.value}" ${assignee.value === currentAssignee ? 'selected' : ''}>${assignee.text}</option>`).join('');
}

// =========================================================================
// Specific Section Logic (Forms, Details)
// =========================================================================

// --- Product Form ---
async function showProductForm(productId = null) {
    if (!productFormContainer || !productsSection || !productForm) return;
    console.log(`Showing product form for ID: ${productId || 'New'}`);
    hideElement(productListView); hideElement(productPagination);
    hideElement(productFiltersContainer); hideElement(productBulkActionsContainer);

    // Reset before showing/populating
    productForm.reset();
    clearFormValidation(productForm);
    if (productSlugInput) productSlugInput.readOnly = false;
    if (featuredImagePreview) featuredImagePreview.innerHTML = '';
    if (galleryImagePreview) galleryImagePreview.innerHTML = '';
    productForm.dataset.productId = '';
    // Ensure libraries are destroyed before potential re-initialization
    destroyWysiwygEditor('#productDescription');
    destroySearchableSelect('#productCategory');
    destroyDatePickers('#productForm .date-picker');

    showElement(productFormContainer);
    mainContent?.scrollTo(0, 0);

    const formTitle = productFormHeading;
    const submitButton = productForm.querySelector('button[type="submit"]');
    const submitBtnText = submitButton?.querySelector('.btn-text');

    if (productId) {
        if (formTitle) formTitle.textContent = `Sửa Sản Phẩm #${productId}`;
        if (submitBtnText) submitBtnText.textContent = 'Cập Nhật Sản Phẩm';
        productForm.dataset.productId = productId;
        showLoading(productFormContainer);
        try {
            const productData = await apiService.getProductDetails(productId);
            populateProductForm(productData); // Populate first
            // Then initialize libraries
            initWysiwygEditor('#productDescription');
            initSearchableSelect('#productCategory');
            initDatePickers('#productForm .date-picker');
            // TODO: Render variant UI
        } catch (error) {
            showToast(`Error loading product details: ${error.message}`, 'error');
            hideProductForm(); // Hide form on error
        } finally { hideLoading(productFormContainer); }
    } else {
        if (formTitle) formTitle.textContent = 'Thêm Sản Phẩm Mới';
        if (submitBtnText) submitBtnText.textContent = 'Lưu Sản Phẩm';
        // Initialize libraries for a new form
        initWysiwygEditor('#productDescription');
        initSearchableSelect('#productCategory');
        initDatePickers('#productForm .date-picker');
        handleStockCheckboxChange();
        updateSeoPreview(); // Update with defaults/empty
    }
    setupTabs(productFormTabs, productFormTabContents);
}

/** Populates the product form fields with data. */
function populateProductForm(data) {
    if (!productForm || !data) return;
    // Populate simple fields first
    if (productNameInput) productNameInput.value = data.name || '';
    if (productSlugInput) { productSlugInput.value = data.slug || ''; productSlugInput.readOnly = true; } // Lock slug on edit
    if (productForm.querySelector('#productShortDescription')) productForm.querySelector('#productShortDescription').value = data.shortDescription || '';
    if (productForm.querySelector('#productStatusForm')) productForm.querySelector('#productStatusForm').value = data.status || 'draft';
    if (productForm.querySelector('#productPrice')) productForm.querySelector('#productPrice').value = data.price || '';
    if (productForm.querySelector('#productSalePrice')) productForm.querySelector('#productSalePrice').value = data.salePrice || '';
    // Date pickers require specific format or library update
    const saleStartInput = productForm.querySelector('#saleStartDate');
    const saleEndInput = productForm.querySelector('#saleEndDate');
    if (saleStartInput?._flatpickr) saleStartInput._flatpickr.setDate(data.saleStartDate, false); else if(saleStartInput) saleStartInput.value = data.saleStartDate ? data.saleStartDate.slice(0, 16) : '';
    if (saleEndInput?._flatpickr) saleEndInput._flatpickr.setDate(data.saleEndDate, false); else if(saleEndInput) saleEndInput.value = data.saleEndDate ? data.saleEndDate.slice(0, 16) : '';
    // Stock fields
    if (manageStockCheckbox) manageStockCheckbox.checked = data.manageStock !== false;
    handleStockCheckboxChange();
    if (productForm.querySelector('#productSku')) productForm.querySelector('#productSku').value = data.sku || '';
    if (productForm.querySelector('#productStock')) productForm.querySelector('#productStock').value = data.stock ?? '';
    if (productForm.querySelector('#lowStockThreshold')) productForm.querySelector('#lowStockThreshold').value = data.lowStockThreshold ?? '5';
    if (productForm.querySelector('#allowBackorder')) productForm.querySelector('#allowBackorder').checked = data.allowBackorder || false;
    // SEO fields
    if (seoTitleInput) seoTitleInput.value = data.seoTitle || '';
    if (seoDescriptionInput) seoDescriptionInput.value = data.seoDescription || '';
    updateSeoPreview(data.name, data.slug, data.seoTitle, data.seoDescription);
    // Brand
    if (productForm.querySelector('#productBrand')) productForm.querySelector('#productBrand').value = data.brand || '';
    // Set complex fields AFTER libraries are initialized (handled in showProductForm)
    if (productDescriptionTextarea) productDescriptionTextarea.value = data.description || ''; // Set textarea value
    if (productCategorySelect && data.categoryIds) { // Set select value(s)
        if (productCategorySelect.choicesInstance) { productCategorySelect.choicesInstance.setValue(data.categoryIds); }
        else { Array.from(productCategorySelect.options).forEach(opt => { opt.selected = data.categoryIds.includes(opt.value); }); }
    }
    // Render previews
    if (featuredImagePreview) featuredImagePreview.innerHTML = ''; // Clear first
    if (featuredImagePreview && data.featuredImage) renderImagePreview(featuredImagePreview, data.featuredImage, null, false);
    if (galleryImagePreview) galleryImagePreview.innerHTML = ''; // Clear first
    if (galleryImagePreview && data.galleryImages) data.galleryImages.forEach(imgUrl => renderImagePreview(galleryImagePreview, imgUrl, null, true));
}

/** Hides the product form, destroys its libraries, and restores the list view. */
function hideProductForm() {
    hideElement(productFormContainer);
    destroyWysiwygEditor('#productDescription');
    destroySearchableSelect('#productCategory');
    destroyDatePickers('#productForm .date-picker');
    if (featuredImagePreview) featuredImagePreview.innerHTML = '';
    if (galleryImagePreview) galleryImagePreview.innerHTML = '';
    if (activeAdminSectionId === 'products') {
        restoreListView('products');
    }
}

/** Handles the change event for the 'Manage Stock' checkbox. */
function handleStockCheckboxChange() {
    if (!manageStockCheckbox || !stockFieldsContainer) return;
    const shouldShow = manageStockCheckbox.checked;
    stockFieldsContainer.style.display = shouldShow ? 'block' : 'none';
    const stockInput = stockFieldsContainer.querySelector('#productStock');
    if (stockInput) { stockInput.required = shouldShow; } // Make required if managing stock
}

/** Handles automatic slug generation based on product name. */
function handleProductNameInput() {
    if (productNameInput && productSlugInput && !productSlugInput.readOnly) {
        productSlugInput.value = generateSlug(productNameInput.value);
        updateSeoPreview(); // Update SEO preview when name changes
    } else if (productNameInput) {
        updateSeoPreview(); // Update preview even if slug is read-only
    }
}

/** Updates the SEO preview section based on form inputs. */
function updateSeoPreview(name = null, slug = null, title = null, description = null) {
    if (!seoPreviewEl) return;
    const currentName = name ?? productNameInput?.value ?? '';
    const currentSlug = slug ?? productSlugInput?.value ?? generateSlug(currentName);
    const currentTitle = title ?? seoTitleInput?.value ?? '';
    const currentDescription = description ?? seoDescriptionInput?.value ?? '';
    const separator = document.getElementById('seoSeparator')?.value || '|'; // Get separator from settings form or default

    // Final Title Logic: Use SEO Title if present, otherwise generate from product name and site title
    const finalTitle = (currentTitle || `${currentName} ${separator} ${defaultSeoTitle}`).trim();
    if (seoPreviewTitle) seoPreviewTitle.textContent = finalTitle.slice(0, 70) + (finalTitle.length > 70 ? '...' : ''); // Truncate

    // Final URL Logic
    if (seoPreviewUrl) seoPreviewUrl.textContent = `https://techshop.example/san-pham/${currentSlug || 'url-san-pham'}`;

    // Final Description Logic: Use SEO Description, fallback to Short Description, fallback to beginning of main description
    const shortDesc = productForm?.querySelector('#productShortDescription')?.value || '';
    let finalDescription = currentDescription || shortDesc;
    if (!finalDescription) {
        // Basic extraction from WYSIWYG (needs improvement for HTML stripping)
        const mainDescText = productDescriptionTextarea?.value.replace(/<[^>]*>?/gm, '').substring(0, 180) || ''; // Strip basic HTML tags
        finalDescription = mainDescText;
    }
    if (seoPreviewDesc) seoPreviewDesc.textContent = finalDescription.slice(0, 160) + (finalDescription.length > 160 ? '...' : ''); // Truncate
}


/** Renders a preview for a selected image file or URL. */
function renderImagePreview(container, fileOrUrl, fileObject, isGallery = false) {
    if (!container) return;
    const previewWrapper = document.createElement('div');
    previewWrapper.className = isGallery ? 'gallery-item' : 'image-preview-item';
    const img = document.createElement('img');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-icon btn-remove-image';
    removeBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    removeBtn.title = 'Gỡ ảnh';
    removeBtn.setAttribute('aria-label', 'Gỡ ảnh này');
    removeBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent triggering other clicks
        previewWrapper.remove();
        // If removing featured image, reset the file input
        if (!isGallery && featuredImageInput) {
            featuredImageInput.value = ''; // Clear the file input value
        }
        // TODO: If editing an existing product, mark this image ID for removal on server
    };

    if (fileObject instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.readAsDataURL(fileObject);
        img.alt = fileObject.name;
        previewWrapper.dataset.fileName = fileObject.name; // Store file name if needed
    } else if (typeof fileOrUrl === 'string') {
        img.src = fileOrUrl;
        img.alt = 'Xem trước ảnh';
        previewWrapper.dataset.imageUrl = fileOrUrl; // Store URL if needed
    } else { return; }

    previewWrapper.appendChild(img);
    previewWrapper.appendChild(removeBtn);

    if (!isGallery && container.id === 'featuredImagePreview') {
        container.innerHTML = '';
        container.appendChild(previewWrapper);
    } else {
        container.appendChild(previewWrapper); // Append for gallery
    }
}

/** Handles file selection for image inputs. */
function handleImageFileChange(event) {
    const input = event.target;
    const files = input.files;
    const isFeatured = input.id === 'featuredImageInput';
    const previewContainer = isFeatured ? featuredImagePreview : galleryImagePreview;

    if (!files || files.length === 0 || !previewContainer) return;

    if (isFeatured) {
        previewContainer.innerHTML = ''; // Clear existing preview
        renderImagePreview(previewContainer, files[0], files[0], false);
    } else {
        // For gallery, you might want to append or replace depending on UX preference
        // This example appends:
        Array.from(files).forEach(file => {
            renderImagePreview(previewContainer, file, file, true);
        });
    }
    // Important: File objects themselves aren't automatically submitted with the form
    // unless the input element name matches what the server expects for upload.
    // Using FormData in handleProductFormSubmit is the standard way to include files.
}

/** Handles the product form submission. */
async function handleProductFormSubmit(event) {
    event.preventDefault();
    if (!productForm || isLoading) return;
    if (typeof tinymce !== 'undefined') tinymce.triggerSave(); // Save WYSIWYG content

    if (!validateFormClientSide(productForm)) return;

    const submitButton = productForm.querySelector('button[type="submit"]');
    isLoading = true;
    setButtonLoading(submitButton);
    clearFormValidation(productForm);

    try {
        const formData = new FormData(productForm);
        const productId = productForm.dataset.productId;

        // Clean up FormData before sending if needed
        formData.delete('featuredImageFile'); // Remove placeholder input name if handling files manually
        formData.delete('galleryImageFiles[]');

        // Append files manually if necessary (depends on how you structure backend)
        if (featuredImageInput.files.length > 0) {
            formData.append('featured_image', featuredImageInput.files[0], featuredImageInput.files[0].name);
        }
        Array.from(galleryImageInput.files).forEach((file, index) => {
            formData.append(`gallery_images[${index}]`, file, file.name);
        });

        // Append category IDs correctly for array submission
        formData.delete('categoryIds'); // Remove single values if any
        const selectedCategories = Array.from(productCategorySelect.selectedOptions).map(opt => opt.value);
        selectedCategories.forEach(catId => formData.append('categoryIds[]', catId));

        // Append WYSIWYG content (already saved to textarea by triggerSave)
        // formData.set('description', productDescriptionTextarea.value);

        // Method spoofing for PUT request if needed by backend framework
        if (productId) { formData.append('_method', 'PUT'); }

        // Log FormData contents for debugging (remove sensitive data in production)
        // console.log("Submitting Product FormData Entries:");
        // for (let [key, value] of formData.entries()) { console.log(`${key}:`, value); }

        // --- Actual API Call ---
        const method = productId ? 'PUT' : 'POST'; // Use PUT for update
        // Adjust endpoint if PUT needs ID in URL
        const endpoint = productId ? `/products/${productId}` : '/products';
        // When sending FormData, let the browser set the Content-Type
        const savedProduct = await apiService.request(endpoint, { method: method, body: formData, headers: { 'Content-Type': null } }); // Let browser set Content-Type for FormData

        showToast(`Product "${savedProduct.name || 'ID: '+savedProduct.id}" saved successfully!`, 'success');
        hideProductForm(); // Hides form, destroys libraries
        const currentPage = currentFilters.products?.page || 1;
        await loadProductListData({ page: currentPage }); // Reload list

    } catch (error) {
        showToast(`Error saving product: ${error.message || 'Unknown error'}`, 'error');
        if (error.status === 422 && error.data?.errors) {
            displayFormValidationErrors(productForm, error.data.errors);
        }
    } finally {
        resetButtonLoading(submitButton);
        isLoading = false;
    }
}


// --- Order Detail ---
async function showOrderDetail(orderId) {
    if (!orderDetailView || !orderDetailContent || !orderDetailIdSpan || !ordersSection) return;
    console.log(`Showing details for order ${orderId}`);
    hideElement(orderListView); hideElement(orderPagination);
    hideElement(orderFiltersContainer); hideElement(orderBulkActionsContainer);

    orderDetailIdSpan.textContent = orderId;
    orderDetailView.dataset.orderId = orderId;
    orderDetailContent.innerHTML = `<div class="loading-placeholder text-center p-4"><i class="fas fa-spinner fa-spin fa-2x text-muted"></i><p class="text-muted mt-2">Loading order details...</p></div>`;
    showElement(orderDetailView, 'block');
    mainContent?.scrollTo(0, 0);

    try {
        const orderData = await apiService.getOrderDetail(orderId);
        renderOrderDetail(orderData);
    } catch (error) {
        showToast(`Error loading order details: ${error.message}`, 'error');
        displayEmptyState(orderDetailContent, `Could not load details for order #${orderId}.`);
    }
    // Loading implicitly hidden by renderOrderDetail replacing content
}

/** Renders the fetched order data into the detail view. */
function renderOrderDetail(data) {
    if (!orderDetailContent || !data) return;
    const detailHTML = `
             <div class="order-detail-grid">
                 <div class="order-detail-col">
                     <h4>Thông tin chung</h4>
                     <p><strong>Ngày đặt:</strong> <span id="detailOrderDate">${formatAdminDateTime(data.date)}</span></p>
                     <div class="form-group">
                         <label for="detailOrderStatus">Trạng thái:</label>
                         <select class="form-control-sm status-dropdown" id="detailOrderStatus" name="status" aria-label="Cập nhật trạng thái đơn hàng">
                             ${getOrderStatusOptions(data.orderStatus)}
                         </select>
                     </div>
                     <h4>Khách hàng</h4>
                     <p><a href="#customers?view=${data.customer.id}" class="link-view-customer" data-customer-id="${data.customer.id}" id="detailCustomerLink">${data.customer.name}</a></p>
                     <p><i class="fas fa-envelope fa-fw" aria-hidden="true"></i> <span id="detailCustomerEmail">${data.customer.email || 'N/A'}</span></p>
                     <p><i class="fas fa-phone fa-fw" aria-hidden="true"></i> <span id="detailCustomerPhone">${data.customer.phone || 'N/A'}</span></p>
                 </div>
                 <div class="order-detail-col">
                     <h4>Sản phẩm (${data.items?.length || 0})</h4>
                     <ul id="detailProductList" class="detail-item-list">
                         ${data.items && data.items.length > 0
        ? data.items.map(item => `<li><img src="${item.image || 'https://via.placeholder.com/40x40/cccccc/ffffff?text=N/A'}" alt="${item.name}" style="width:35px; height:35px; margin-right: 8px; object-fit:contain; border-radius:3px;">(${item.quantity}x) <a href="#products?edit=${item.productId}" target="_blank">${item.name}</a> - ${formatAdminCurrency(item.price * item.quantity)}</li>`).join('')
        : '<li>Không có sản phẩm.</li>'
    }
                     </ul>
                     <h4>Tổng cộng</h4>
                     <table class="totals-table">
                         <tr><td>Tạm tính:</td><td id="detailSubtotal">${formatAdminCurrency(data.subtotal)}</td></tr>
                         <tr><td>Vận chuyển:</td><td id="detailShipping">${formatAdminCurrency(data.shippingCost)} (${data.shippingMethod || 'N/A'})</td></tr>
                         ${data.discount > 0 ? `<tr><td>Giảm giá:</td><td id="detailDiscount">-${formatAdminCurrency(data.discount)}</td></tr>` : ''}
                         <tr><td><strong>Tổng cộng:</strong></td><td id="detailGrandTotal">${formatAdminCurrency(data.grandTotal)}</td></tr>
                     </table>
                     <p><strong>Thanh toán:</strong> <span id="detailPaymentMethod" class="status status-${getPaymentStatusClass(data.paymentStatus)}">${getPaymentStatusText(data.paymentStatus)} ${data.paymentMethod ? `(${data.paymentMethod})` : ''}</span></p>
                 </div>
                 <div class="order-detail-col">
                     <h4>Vận chuyển & Ghi chú</h4>
                      <p><strong>Địa chỉ giao hàng:</strong>
                         <span id="detailShippingAddress">${data.shippingAddress ? `${data.shippingAddress.name}, ${data.shippingAddress.street}, ${data.shippingAddress.city}` : 'N/A'}</span>
                         ${data.shippingAddress ? `<a href="https://maps.google.com/?q=${encodeURIComponent(data.shippingAddress.street + ', ' + data.shippingAddress.city)}" target="_blank" title="Xem bản đồ"><i class="fas fa-map-marker-alt ml-1"></i></a>` : ''}
                     </p>
                     <div class="form-group">
                          <label for="trackingCode">Mã vận đơn:</label>
                          <div class="input-group">
                               <input type="text" id="trackingCode" name="trackingCode" class="form-control-sm" value="${data.trackingCode || ''}" aria-label="Mã vận đơn">
                               <button type="button" class="btn btn-xs btn-outline btn-add-tracking" title="Lưu mã vận đơn"><i class="fas fa-save" aria-hidden="true"></i></button>
                          </div>
                     </div>
                     <hr style="border-color: var(--border-color); margin: 1rem 0;">
                     <p><strong>Ghi chú khách hàng:</strong> <span id="detailCustomerNote">${data.customerNote || 'Không có'}</span></p>
                     <div class="form-group">
                         <label for="internalNote">Ghi chú nội bộ mới:</label>
                         <textarea id="internalNote" name="internalNote" class="form-control" rows="3" aria-label="Thêm ghi chú nội bộ"></textarea>
                         <button type="button" class="btn btn-xs btn-secondary btn-add-note mt-1"><i class="fas fa-plus" aria-hidden="true"></i> Thêm ghi chú</button>
                     </div>
                 </div>
             </div>
             <div class="order-history-log">
                 <h4>Lịch sử đơn hàng & Ghi chú nội bộ</h4>
                 <ul id="detailOrderHistory" class="activity-log" aria-live="polite">
                     <!-- Combine and sort history and notes by timestamp -->
                     ${[...(data.history || []), ...(data.internalNotes || [])]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map(item => {
            if (item.status) { // History item
                return `<li>[${formatAdminDateTime(item.timestamp)}] <span class="status status-${item.status}">${item.status.toUpperCase()}</span></li>`;
            } else if (item.note) { // Note item
                return `<li class="internal-note">[${formatAdminDateTime(item.timestamp)}] <strong>${item.user}:</strong> ${item.note.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`; // Escape note content
            }
            return '';
        }).join('')
    }
                     ${(!data.history || data.history.length === 0) && (!data.internalNotes || data.internalNotes.length === 0) ? '<li>Chưa có lịch sử hoặc ghi chú.</li>' : ''}
                 </ul>
             </div>
         `;
    orderDetailContent.innerHTML = detailHTML;
    if (refundOrderBtn) refundOrderBtn.style.display = data.canRefund ? 'inline-flex' : 'none';
}

/** Saves changes made in the order detail view */
async function handleSaveOrderDetail() {
    const orderId = orderDetailView?.dataset.orderId;
    if (!orderDetailView || !orderId || isLoading) return;

    const statusDropdown = orderDetailView.querySelector('#detailOrderStatus');
    const internalNoteTextarea = orderDetailView.querySelector('#internalNote');
    const newInternalNote = internalNoteTextarea?.value.trim();

    // Basic validation for note if added
    if (newInternalNote && newInternalNote.length < 5) {
        showToast("Ghi chú nội bộ phải có ít nhất 5 ký tự.", "warning");
        if(internalNoteTextarea) displayFormValidationErrors(internalNoteTextarea.closest('.form-group') || internalNoteTextarea.parentElement, { internalNote: "Ghi chú phải có ít nhất 5 ký tự."});
        return;
    }
    clearFormValidation(internalNoteTextarea?.closest('.form-group') || orderDetailView);

    isLoading = true;
    setButtonLoading(saveOrderDetailBtn);
    const addNoteButton = orderDetailView.querySelector('.btn-add-note'); // Find add note button
    if(addNoteButton) setButtonLoading(addNoteButton); // Disable add note too

    try {
        const updatedData = {
            status: statusDropdown?.value,
        };
        if (newInternalNote) {
            updatedData.newInternalNote = newInternalNote;
        }

        await apiService.saveOrderDetail(orderId, updatedData);
        showToast(`Đơn hàng #${orderId} đã được cập nhật.`, 'success');
        await showOrderDetail(orderId); // Reload details to show changes

    } catch (error) {
        showToast(`Lỗi khi lưu đơn hàng: ${error.message}`, 'error');
        if (error.status === 422 && error.data?.errors) {
            displayFormValidationErrors(orderDetailView, error.data.errors);
        }
        // Only reset buttons on error, success handles it via reload
        resetButtonLoading(saveOrderDetailBtn);
        if(addNoteButton) resetButtonLoading(addNoteButton);
        isLoading = false; // Reset loading on error
    }
    // isLoading is reset implicitly by showOrderDetail on success
}

/** Handles saving just the tracking code */
async function handleSaveTrackingCode(button) {
    const orderId = orderDetailView?.dataset.orderId;
    const trackingInput = orderDetailView?.querySelector('#trackingCode');
    if (!orderId || !trackingInput || isLoading) return;
    const trackingCode = trackingInput.value.trim();

    // Clear previous validation
    clearFormValidation(trackingInput.closest('.input-group') || trackingInput.parentElement);

    if (!trackingCode) {
        showToast("Vui lòng nhập mã vận đơn.", "warning");
        displayFormValidationErrors(trackingInput.closest('.input-group') || trackingInput.parentElement, { trackingCode: "Mã vận đơn không được để trống."});
        return;
    }

    isLoading = true;
    setButtonLoading(button);

    try {
        await apiService.addTrackingCode(orderId, trackingCode);
        showToast(`Đã lưu mã vận đơn cho đơn hàng #${orderId}.`, 'success');
        // Optionally change status to shipped if not already
        const statusDropdown = orderDetailView.querySelector('#detailOrderStatus');
        if(statusDropdown && statusDropdown.value !== 'shipped') {
            statusDropdown.value = 'shipped';
            await handleSaveOrderDetail(); // Trigger save to update status too
        }
    } catch (error) {
        showToast(`Lỗi khi lưu mã vận đơn: ${error.message}`, 'error');
        if (error.status === 422 && error.data?.errors) {
            displayFormValidationErrors(trackingInput.closest('.input-group') || trackingInput.parentElement, error.data.errors);
        }
    } finally {
        resetButtonLoading(button);
        isLoading = false;
    }
}

/** Handles initiating refund process */
function handleInitiateRefund() {
    const orderId = orderDetailView?.dataset.orderId;
    if (!orderId || !refundOrderBtn || refundOrderBtn.style.display === 'none') return;

    // TODO: Show a dedicated refund modal instead of simple confirm
    // For now, use confirmation modal
    const orderTotal = parseFloat(orderDetailContent?.querySelector('#detailGrandTotal')?.textContent?.replace(/[^0-9]/g, '') || '0'); // Get total amount

    showConfirmationModal(
        `Xác nhận hoàn tiền toàn bộ (${formatAdminCurrency(orderTotal)}) cho đơn hàng #${orderId}? Nhập lý do (tùy chọn) vào ghi chú nội bộ trước nếu cần.`,
        async () => {
            if (isLoading) return;
            isLoading = true;
            setButtonLoading(refundOrderBtn);
            try {
                await apiService.initiateRefund(orderId, orderTotal, "Admin initiated refund"); // Use full amount for now
                showToast(`Đã yêu cầu hoàn tiền cho đơn hàng #${orderId}.`, 'success');
                await showOrderDetail(orderId); // Reload to update status/buttons
            } catch (error) {
                showToast(`Lỗi khi hoàn tiền: ${error.message}`, 'error');
            } finally {
                // Reset button happens implicitly on reload
                isLoading = false; // Ensure loading is reset on error
            }
        },
        null,
        { title: 'Xác nhận Hoàn tiền', confirmText: 'Hoàn tiền', confirmClass: 'btn-warning' }
    );
}

/** Placeholder for printing invoice */
function handlePrintInvoice(orderId) {
    if(!orderId) return;
    console.log(`Printing invoice for order ${orderId}...`);
    // In a real app, open a new tab/window pointing to a printable invoice route
    const printUrl = `/admin/orders/${orderId}/print-invoice`; // Example URL
    window.open(printUrl, '_blank');
    showToast(`Đang chuẩn bị hóa đơn #${orderId} để in...`, 'info');
}


// --- Service Detail ---
async function showServiceDetail(serviceId) {
    if (!serviceDetailView || !serviceDetailContent || !serviceDetailIdSpan || !servicesSection) return;
    console.log(`Showing details for service request ${serviceId}`);
    hideElement(servicesSection?.querySelector('.table-responsive'));
    hideElement(servicePagination);
    hideElement(serviceFiltersContainer);

    serviceDetailIdSpan.textContent = serviceId;
    serviceDetailView.dataset.serviceId = serviceId;
    serviceDetailContent.innerHTML = `<div class="loading-placeholder text-center p-4"><i class="fas fa-spinner fa-spin fa-2x text-muted"></i><p class="text-muted mt-2">Loading service details...</p></div>`;
    showElement(serviceDetailView, 'block');
    mainContent?.scrollTo(0, 0);

    try {
        const serviceData = await apiService.getServiceDetail(serviceId);
        renderServiceDetail(serviceData);
    } catch (error) {
        showToast(`Error loading service details: ${error.message}`, 'error');
        displayEmptyState(serviceDetailContent, `Could not load details for service request #${serviceId}.`);
    }
    // Loading hidden by renderServiceDetail
}

/** Renders the fetched service data into the detail view. */
function renderServiceDetail(data) {
    if (!serviceDetailContent || !data) return;
    const detailHTML = `
             <div class="service-detail-grid">
                 <div class="service-detail-col">
                     <h4>Thông tin Yêu cầu</h4>
                     <p><strong>Loại:</strong> <span id="detailServiceType">${data.type || 'N/A'}</span></p>
                     <p><strong>Chủ đề:</strong> <span id="detailServiceSubject">${data.subject || 'N/A'}</span></p>
                     <p><strong>Ngày gửi:</strong> <span id="detailServiceDate">${formatAdminDateTime(data.date)}</span></p>
                     <div class="form-group">
                         <label for="detailServiceStatus">Trạng thái:</label>
                         <select id="detailServiceStatus" name="status" class="form-control-sm status-dropdown" aria-label="Cập nhật trạng thái yêu cầu">
                             ${getServiceStatusOptions(data.status)}
                         </select>
                     </div>
                     <h4>Khách hàng</h4>
                     <p><a href="#customers?view=${data.customer.id}" class="link-view-customer" data-customer-id="${data.customer.id}" id="detailServiceCustomerLink">${data.customer.name}</a></p>
                     <p><i class="fas fa-envelope fa-fw" aria-hidden="true"></i> <span id="detailServiceCustomerEmail">${data.customer.email || 'N/A'}</span></p>
                 </div>
                 <div class="service-detail-col">
                     <h4>Mô tả chi tiết</h4>
                     <p id="detailServiceDescription" style="white-space: pre-wrap; max-height: 200px; overflow-y: auto; background: var(--dark-bg); padding: 8px; border-radius: 4px; border: 1px solid var(--border-color);">${data.description || 'Không có mô tả.'}</p>
                     <h4>File đính kèm</h4>
                     <ul id="detailServiceAttachments">
                         ${data.attachments && data.attachments.length > 0
        ? data.attachments.map(att => `<li><a href="${att.url}" target="_blank"><i class="fas fa-paperclip"></i> ${att.name}</a></li>`).join('')
        : '<li>Không có file đính kèm.</li>'
    }
                     </ul>
                     <h4>Phân công</h4>
                      <div class="form-group">
                          <label for="detailServiceAssignee" class="sr-only">Phân công cho</label>
                          <select id="detailServiceAssignee" name="assignee" class="form-control-sm assignee-dropdown" aria-label="Phân công yêu cầu">
                              ${getAssigneeOptions(data.assignee)}
                          </select>
                      </div>
                 </div>
             </div>
             <div class="internal-notes-section">
                 <h4>Ghi chú / Trao đổi nội bộ</h4>
                 <div class="form-group">
                    <label for="serviceInternalNote" class="sr-only">Thêm ghi chú nội bộ</label>
                    <textarea id="serviceInternalNote" name="serviceInternalNote" class="form-control" rows="4" placeholder="Thêm ghi chú mới..."></textarea>
                    <div class="invalid-feedback"></div>
                 </div>
                 <button type="button" class="btn btn-sm btn-secondary btn-add-service-note"><i class="fas fa-plus" aria-hidden="true"></i> Thêm ghi chú</button>
                 <ul id="serviceNoteHistory" class="activity-log mt-3" aria-live="polite">
                    ${data.notes && data.notes.length > 0
        ? data.notes.map(n => `<li>[${formatAdminDateTime(n.timestamp)}] <strong>${n.user}:</strong> ${n.note.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`).join('')
        : '<li>Chưa có ghi chú.</li>'}
                 </ul>
             </div>
        `;
    serviceDetailContent.innerHTML = detailHTML;
    // Re-assign potentially destroyed references after innerHTML update
    serviceInternalNoteTextarea = document.getElementById('serviceInternalNote');
    serviceNoteHistoryUl = document.getElementById('serviceNoteHistory');
    // Re-add listener to the new button instance
    serviceDetailView?.querySelector('.btn-add-service-note')?.addEventListener('click', handleSaveServiceDetail);

}

/** Saves changes made in the service detail view (including new notes) */
async function handleSaveServiceDetail() {
    const serviceId = serviceDetailView?.dataset.serviceId;
    if (!serviceDetailView || !serviceId || isLoading) return;

    const status = serviceDetailView.querySelector('#detailServiceStatus')?.value;
    const assignee = serviceDetailView.querySelector('#detailServiceAssignee')?.value;
    const newNote = serviceInternalNoteTextarea?.value.trim();

    const updatedData = { status, assignee };
    if (newNote) {
        updatedData.newNote = newNote;
    }

    const noteFormGroup = serviceInternalNoteTextarea?.closest('.form-group');
    if (newNote && newNote.length < 5) {
        showToast("Ghi chú phải có ít nhất 5 ký tự.", "warning");
        if(noteFormGroup) displayFormValidationErrors(noteFormGroup, { serviceInternalNote: "Ghi chú phải có ít nhất 5 ký tự." });
        return;
    }
    if (noteFormGroup) clearFormValidation(noteFormGroup);

    isLoading = true;
    setButtonLoading(saveServiceDetailBtn);
    const noteBtn = serviceDetailView.querySelector('.btn-add-service-note'); // Re-find button
    if (noteBtn) setButtonLoading(noteBtn);

    try {
        await apiService.updateService(serviceId, updatedData);
        showToast(`Yêu cầu dịch vụ #${serviceId} đã được cập nhật.`, 'success');
        await showServiceDetail(serviceId); // Reload details
    } catch (error) {
        showToast(`Lỗi khi lưu yêu cầu dịch vụ: ${error.message}`, 'error');
        if (error.status === 422 && error.data?.errors) {
            displayFormValidationErrors(serviceDetailView, error.data.errors); // Display on main view or note group
        }
        // Reset buttons only on error
        resetButtonLoading(saveServiceDetailBtn);
        if (noteBtn) resetButtonLoading(noteBtn);
        isLoading = false; // Reset loading on error
    }
    // isLoading is reset implicitly by showServiceDetail on success
}


// --- Customer Detail ---
async function showCustomerDetail(customerId) {
    if (!customerDetailView || !customerDetailContent || !customerDetailNameSpan || !customersSection) return;
    console.log(`Showing details for customer ${customerId}`);
    hideElement(customersSection?.querySelector('.table-responsive'));
    hideElement(customerPagination);
    hideElement(customerFiltersContainer);

    customerDetailView.dataset.customerId = customerId;
    customerDetailNameSpan.textContent = '...';
    customerDetailContent.innerHTML = `<div class="loading-placeholder text-center p-4"><i class="fas fa-spinner fa-spin fa-2x text-muted"></i><p class="text-muted mt-2">Loading customer details...</p></div>`;
    showElement(customerDetailView, 'block');
    mainContent?.scrollTo(0, 0);

    try {
        const customerData = await apiService.getCustomerDetail(customerId);
        renderCustomerDetail(customerData); // Render first
        setupTabs(customerDetailTabs, customerDetailTabContents); // Then setup tabs
    } catch (error) {
        showToast(`Error loading customer details: ${error.message}`, 'error');
        displayEmptyState(customerDetailContent, `Could not load details for customer ID ${customerId}.`);
    }
    // Loading hidden by renderCustomerDetail
}

/** Renders the fetched customer data into the detail view tabs. */
function renderCustomerDetail(data) {
    if (!customerDetailContent || !data) return;
    customerDetailNameSpan.textContent = data.name || 'N/A';

    // Pre-render all tab content structures
    customerDetailContent.innerHTML = `
             <div id="customer-info" class="tab-content" role="tabpanel" aria-labelledby="customer-info-tab"></div>
             <div id="customer-addresses" class="tab-content" role="tabpanel" aria-labelledby="customer-addresses-tab"></div>
             <div id="customer-order-history" class="tab-content" role="tabpanel" aria-labelledby="customer-order-history-tab"></div>
             <div id="customer-service-history" class="tab-content" role="tabpanel" aria-labelledby="customer-service-history-tab"></div>
             <div id="customer-notes" class="tab-content" role="tabpanel" aria-labelledby="customer-notes-tab"></div>
        `;
    // Re-assign references to newly created tab content elements
    // customerDetailTabContents = customerDetailView?.querySelectorAll('#customerDetailContentPlaceholder > .tab-content');

    // --- Info Tab ---
    const infoTab = customerDetailContent.querySelector('#customer-info');
    if (infoTab) {
        infoTab.innerHTML = `
                 <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
                 <p><strong>SĐT:</strong> ${data.phone || 'N/A'}</p>
                 <p><strong>Ngày ĐK:</strong> ${data.registeredDate ? formatAdminDateTime(data.registeredDate, { dateStyle: 'long' }) : 'N/A'}</p>
                 <hr>
                 <p><strong>Tổng số đơn hàng:</strong> ${data.orderCount ?? 0}</p>
                 <p><strong>Tổng chi tiêu:</strong> ${formatAdminCurrency(data.totalSpent || 0)}</p>
            `;
    }

    // --- Addresses Tab ---
    const addressesTab = customerDetailContent.querySelector('#customer-addresses');
    if (addressesTab) {
        addressesTab.innerHTML = `
                 <div class="address-list">
                     ${data.addresses && data.addresses.length > 0
            ? data.addresses.map(addr => `
                              <div class="address-item">
                                   <p><strong>${addr.name || data.name}</strong></p>
                                   <p>${addr.street || ''}</p>
                                   <p>${addr.city || ''}, ${addr.country || ''}</p>
                                   <p>${addr.phone || data.phone || ''}</p>
                                   <div class="address-tags">
                                     ${addr.isDefaultBilling ? '<span class="badge status-info">Thanh toán</span>' : ''}
                                     ${addr.isDefaultShipping ? '<span class="badge status-success">Giao hàng</span>' : ''}
                                   </div>
                                   <div class="address-actions">
                                       <button class="btn btn-xs btn-outline btn-edit-address" data-address-id="${addr.id}"><i class="fas fa-edit"></i> Sửa</button>
                                       <button class="btn btn-xs btn-danger btn-delete-address" data-address-id="${addr.id}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                   </div>
                              </div>
                          `).join('')
            : '<p class="text-muted">Chưa có địa chỉ nào được lưu.</p>'
        }
                 </div>
                 <button type="button" class="btn btn-sm btn-secondary mt-3 btn-add-address"><i class="fas fa-plus"></i> Thêm địa chỉ</button>
            `;
    }

    // --- Order History Tab ---
    const orderHistoryTab = customerDetailContent.querySelector('#customer-order-history');
    if (orderHistoryTab) {
        if (data.orderHistory && data.orderHistory.length > 0) {
            orderHistoryTab.innerHTML = `
                     <div class="table-responsive">
                         <table class="admin-table mini-table">
                             <thead><tr><th>Mã ĐH</th><th>Ngày</th><th>Tổng tiền</th><th>Trạng thái TT</th><th>Trạng thái ĐH</th><th></th></tr></thead>
                             <tbody>
                                 ${data.orderHistory.map(order => `
                                     <tr>
                                         <td><a href="#" class="link-view-order" data-order-id="${order.id}">#${order.id}</a></td>
                                         <td>${formatAdminDateTime(order.date, { dateStyle: 'short' })}</td>
                                         <td>${formatAdminCurrency(order.total)}</td>
                                         <td><span class="status status-${getPaymentStatusClass(order.paymentStatus)}">${getPaymentStatusText(order.paymentStatus)}</span></td>
                                         <td><span class="status status-${order.orderStatus}">${order.orderStatus}</span></td>
                                         <td><button class="btn-icon btn-view-order" title="Xem" data-order-id="${order.id}"><i class="fas fa-eye"></i></button></td>
                                     </tr>`).join('')}
                             </tbody>
                         </table>
                     </div>`;
        } else {
            orderHistoryTab.innerHTML = `<div class="empty-state"><p>Chưa có lịch sử đơn hàng.</p></div>`;
        }
    }

    // --- Service History Tab ---
    const serviceHistoryTab = customerDetailContent.querySelector('#customer-service-history');
    if (serviceHistoryTab) {
        if (data.serviceHistory && data.serviceHistory.length > 0) {
            serviceHistoryTab.innerHTML = `
                      <div class="table-responsive">
                          <table class="admin-table mini-table">
                              <thead><tr><th>Mã YC</th><th>Ngày</th><th>Loại</th><th>Trạng thái</th><th></th></tr></thead>
                              <tbody>
                                  ${data.serviceHistory.map(service => `
                                      <tr>
                                          <td><a href="#" class="link-view-service" data-service-id="${service.id}">#${service.id}</a></td>
                                          <td>${formatAdminDateTime(service.date, { dateStyle: 'short' })}</td>
                                          <td>${service.type}</td>
                                          <td><span class="status status-${service.status}">${service.status}</span></td>
                                          <td><button class="btn-icon btn-view-service" title="Xem" data-service-id="${service.id}"><i class="fas fa-eye"></i></button></td>
                                      </tr>`).join('')}
                              </tbody>
                          </table>
                      </div>`;
        } else {
            serviceHistoryTab.innerHTML = `<div class="empty-state"><p>Chưa có lịch sử yêu cầu dịch vụ.</p></div>`;
        }
    }

    // --- Admin Notes Tab ---
    const notesTab = customerDetailContent.querySelector('#customer-notes');
    if (notesTab) {
        notesTab.innerHTML = `
                 <div class="form-group">
                     <label for="customerAdminNote">Thêm ghi chú Admin</label>
                     <textarea id="customerAdminNote" name="customerAdminNote" class="form-control" rows="4" placeholder="Thêm ghi chú về khách hàng này..."></textarea>
                     <div class="invalid-feedback"></div>
                 </div>
                 <button type="button" class="btn btn-sm btn-secondary" id="saveCustomerNoteBtn">Lưu ghi chú</button>
                 <ul class="activity-log mt-3" aria-live="polite">
                     ${data.adminNotes && data.adminNotes.length > 0
            ? data.adminNotes
                .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort notes newest first
                .map(note => `<li>[${formatAdminDateTime(note.timestamp)}] <strong>${note.user}:</strong> ${note.note.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`).join('')
            : '<li>Chưa có ghi chú.</li>'}
                 </ul>
            `;
        // Re-assign references
        customerAdminNoteTextarea = notesTab.querySelector('#customerAdminNote');
        saveCustomerNoteBtn = notesTab.querySelector('#saveCustomerNoteBtn');
        customerNotesHistoryUl = notesTab.querySelector('.activity-log');
        // Re-add listener
        saveCustomerNoteBtn?.addEventListener('click', () => {
            const customerId = customerDetailView?.dataset.customerId;
            if (customerId) handleSaveCustomerNote(customerId);
        });
    }
}

/** Saves a new admin note for a customer. */
async function handleSaveCustomerNote(customerId) {
    if (!customerAdminNoteTextarea || !saveCustomerNoteBtn || isLoading) return;
    const noteContent = customerAdminNoteTextarea.value.trim();
    const noteFormGroup = customerAdminNoteTextarea.closest('.form-group');

    if (!noteContent || noteContent.length < 10) {
        showToast("Ghi chú phải có ít nhất 10 ký tự.", "warning");
        if(noteFormGroup) displayFormValidationErrors(noteFormGroup, { customerAdminNote: "Ghi chú phải có ít nhất 10 ký tự." });
        return;
    }
    if (noteFormGroup) clearFormValidation(noteFormGroup);

    isLoading = true;
    setButtonLoading(saveCustomerNoteBtn);

    try {
        await apiService.saveCustomerDetail(customerId, { newAdminNote: noteContent });
        showToast("Ghi chú đã được lưu.", 'success');
        // Reload only the notes tab content for better UX? Or reload all?
        // For simplicity, reloading all details for now:
        await showCustomerDetail(customerId);
    } catch (error) {
        showToast(`Lỗi khi lưu ghi chú: ${error.message}`, 'error');
        if (error.status === 422 && error.data?.errors && noteFormGroup) {
            displayFormValidationErrors(noteFormGroup, error.data.errors);
        }
        resetButtonLoading(saveCustomerNoteBtn); // Reset button only on error
        isLoading = false; // Reset loading on error
    }
    // isLoading is reset implicitly by showCustomerDetail on success
}

// =========================================================================
// Table Interaction Helpers
// =========================================================================

/** Sets up 'Select All' and individual checkbox logic for a table. */
function handleTableSelection(selectAllCheckbox, itemCheckboxesSelector, parentElement = document) {
    if (!selectAllCheckbox) return;
    const itemCheckboxes = parentElement.querySelectorAll(itemCheckboxesSelector);
    const bulkActionButton = parentElement.querySelector('.bulk-actions-container button');

    // Initial state check
    updateSelectAllCheckboxState(selectAllCheckbox, itemCheckboxes);
    updateBulkActionState(itemCheckboxes, bulkActionButton);

    // No need to re-add listeners if using event delegation properly
}

/** Updates the state of the 'Select All' checkbox based on item checkboxes */
function updateSelectAllCheckboxState(selectAllCheckbox, itemCheckboxes) {
    if (!selectAllCheckbox) return;
    const totalItems = itemCheckboxes.length;
    if (totalItems === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        return;
    }
    const checkedItems = Array.from(itemCheckboxes).filter(cb => cb.checked).length;

    if (checkedItems === totalItems) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedItems === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

/** Enables/disables the bulk action button based on checkbox selection. */
function updateBulkActionState(checkboxes, bulkButton) {
    if (!bulkButton) return;
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    bulkButton.disabled = !anyChecked;
}

/** Handles click on a sortable table header. */
function handleTableSort(event) {
    const th = event.target.closest('th.sortable');
    if (!th || isLoading) return;

    const sortKey = th.dataset.sortKey;
    const section = th.closest('.admin-section')?.id.replace('-section', '');
    if (!sortKey || !section || !currentTableSort[section]) return;

    let newDirection = 'asc';
    // If clicking the same key, toggle direction; otherwise default to 'asc'
    if (currentTableSort[section].key === sortKey && currentTableSort[section].direction === 'asc') {
        newDirection = 'desc';
    }

    currentTableSort[section] = { key: sortKey, direction: newDirection };
    console.log(`Sorting section ${section} by ${sortKey} ${newDirection}`);

    // Reload data with new sort parameters, keeping existing filters
    const currentSectionFilters = currentFilters[section] || {};
    const params = { ...currentSectionFilters, sortKey: sortKey, sortDir: newDirection, page: 1 }; // Reset to page 1

    setActiveSection(section, params, true); // Force reload
}

/** Updates the sort icons in the table header based on current state */
function updateTableSortUI(sectionId) {
    const tableHead = document.querySelector(`#${sectionId}-section .admin-table thead`);
    if (!tableHead || !currentTableSort[sectionId]) return;
    const currentSort = currentTableSort[sectionId];

    tableHead.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
        th.setAttribute('aria-sort', 'none');
        if (th.dataset.sortKey === currentSort.key) {
            th.classList.add(currentSort.direction);
            th.setAttribute('aria-sort', currentSort.direction === 'asc' ? 'ascending' : 'descending');
        }
    });
}

// =========================================================================
// Event Handlers (Delegated Clicks, Changes, Submits etc.)
// =========================================================================

/** Main event delegator setup */
function setupMainEventListeners() {
    console.log("Setting up main event listeners...");
    document.body.addEventListener('click', handleGlobalClick);
    document.body.addEventListener('change', handleGlobalChange);
    document.body.addEventListener('submit', handleGlobalSubmit);
    // Use keyup for search input for better responsiveness with Enter key
    adminSearchInput?.addEventListener('keyup', debounce((event) => {
        if (event.key === 'Enter') {
            handleHeaderSearchSubmit();
        } else {
            handleHeaderSearchInput();
        }
    }, DEBOUNCE_DELAY));

    // Close dropdowns on outside click
    document.addEventListener('click', handleGlobalClickOutside); // Separate listener for outside clicks

    // Window resize listener
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 992 && document.body.classList.contains('sidebar-open-overlay')) {
            toggleMobileSidebarOverlay(false);
            sidebar?.classList.remove('active');
        }
        resizeAllCharts();
    }, 200));
}

/** Handles delegated clicks */
function handleGlobalClick(event) {
    const target = event.target;
    const targetClosest = (selector) => target.closest(selector); // Helper

    // --- Sidebar ---
    const sidebarLink = targetClosest('.admin-sidebar .sidebar-link');
    if (sidebarLink && sidebarLink.dataset.section && sidebarLink.dataset.section !== '#') {
        event.preventDefault(); setActiveSection(sidebarLink.dataset.section); return; }
    if (target === sidebarToggle || targetClosest('#sidebarToggle')) { handleSidebarToggle(); return; }
    if (target === logoutLinkSidebar || target === logoutLinkDropdown || targetClosest('#adminLogoutLink') || targetClosest('#adminLogoutLinkDropdown')) {
        handleAdminLogout(event); return; }

    // --- Header ---
    if (target === notificationBell || targetClosest('#adminNotificationBell')) {
        event.stopPropagation(); toggleDropdown(notificationPanel, notificationBell); return; }
    if (target === userMenuToggle || targetClosest('#adminUserMenuToggle')) {
        event.stopPropagation(); toggleDropdown(userDropdown, userMenuToggle); return; }
    if (target === clearAdminNotificationsBtn || targetClosest('#clearAdminNotifications')) { handleClearNotifications(event); return; }
    if (target === adminSearchButton || targetClosest('.admin-header .search-bar button')) { handleHeaderSearchSubmit(); return; }
    const notificationItem = targetClosest('#adminNotificationList li[data-notif-id]');
    if (notificationItem) { handleNotificationClick(event); return; }

    // --- Modals ---
    if (target === confirmModalConfirmBtn || targetClosest('#adminConfirmModal .btn-confirm')) { handleModalConfirm(); return; }
    if (target === confirmModalCancelBtn || targetClosest('#adminConfirmModal .btn-cancel')) { handleModalCancel(); return; }
    // Note: Modal overlay click handled by handleGlobalClickOutside

    // --- Generic Detail Close ---
    if (target.classList.contains('btn-close-detail') || targetClosest('.btn-close-detail')) {
        hideAllDetailViews(activeAdminSectionId); return; }

    // --- Section Specific Click Handlers ---
    const currentSection = targetClosest('.admin-section');
    if (!currentSection) return; // Click is outside any admin section
    const sectionId = currentSection.id.replace('-section', '');

    switch (sectionId) {
        case 'dashboard': handleDashboardClick(event); break;
        case 'products': handleProductSectionClick(event); break;
        case 'orders': handleOrderSectionClick(event); break;
        case 'services': handleServiceSectionClick(event); break;
        case 'customers': handleCustomerSectionClick(event); break;
        case 'reports': handleReportSectionClick(event); break;
        case 'settings': handleSettingsSectionClick(event); break;
        case 'content': handleContentSectionClick(event); break;
        case 'admins': handleAdminSectionClick(event); break;
    }

    // --- Table Sorting ---
    const sortableTh = targetClosest('.admin-table th.sortable');
    if (sortableTh) { handleTableSort(event); return; }

    // --- Pagination ---
    const pageLink = targetClosest('.pagination-container .page-link[data-page]');
    if (pageLink && !pageLink.closest('.page-item.disabled')) {
        event.preventDefault();
        const page = parseInt(pageLink.dataset.page);
        const targetSection = pageLink.dataset.section;
        if (!isNaN(page) && targetSection === activeAdminSectionId) {
            const currentSectionFilters = currentFilters[targetSection] || {};
            setActiveSection(targetSection, { ...currentSectionFilters, page: page }, true);
        }
        return;
    }

    // --- Filter Buttons ---
    const applyFilterBtn = targetClosest('.btn-apply-filters');
    if (applyFilterBtn) {
        const filterContainer = applyFilterBtn.closest('.filters-container');
        const targetSection = applyFilterBtn.closest('.admin-section')?.id.replace('-section', '');
        if (filterContainer && targetSection) {
            const filters = collectFilters(filterContainer);
            currentFilters[targetSection] = filters;
            setActiveSection(targetSection, { ...filters, page: 1 }, true);
        }
        return;
    }
    const clearFilterBtn = targetClosest('.btn-clear-filters');
    if (clearFilterBtn) {
        const filterContainer = clearFilterBtn.closest('.filters-container');
        if (filterContainer) { clearFilters(filterContainer, true); } // Clear and reload
        return;
    }
}

/** Handles delegated change events */
function handleGlobalChange(event) {
    const target = event.target;

    // --- Inline Status/Assignee Dropdowns ---
    if (target.matches('.order-status-dropdown')) { handleOrderInlineStatusChange(event); return; }
    if (target.matches('.service-status-dropdown') || target.matches('.service-assignee-dropdown')) { handleServiceInlineChange(event); return; }

    // --- Checkboxes ---
    if (target === manageStockCheckbox) { handleStockCheckboxChange(); return; }
    // Update table selection state on individual checkbox change
    const productCheckbox = target.closest('.product-checkbox');
    if(productCheckbox) { handleTableSelection(selectAllProductsCheckbox, '.product-checkbox', productsSection); return; }
    const orderCheckbox = target.closest('.order-checkbox');
    if(orderCheckbox) { handleTableSelection(selectAllOrdersCheckbox, '.order-checkbox', ordersSection); return; }
    if (target === selectAllProductsCheckbox) { // Handle select all change explicitly
        const itemCheckboxes = productsSection?.querySelectorAll('.product-checkbox');
        itemCheckboxes?.forEach(checkbox => { checkbox.checked = selectAllProductsCheckbox.checked; });
        handleTableSelection(selectAllProductsCheckbox, '.product-checkbox', productsSection);
        return;
    }
    if (target === selectAllOrdersCheckbox) { // Handle select all change explicitly
        const itemCheckboxes = ordersSection?.querySelectorAll('.order-checkbox');
        itemCheckboxes?.forEach(checkbox => { checkbox.checked = selectAllOrdersCheckbox.checked; });
        handleTableSelection(selectAllOrdersCheckbox, '.order-checkbox', ordersSection);
        return;
    }


    // --- File Inputs ---
    if (target === featuredImageInput || target === galleryImageInput) { handleImageFileChange(event); return; }

    // --- Settings Toggles ---
    if (target === vnpayEnabledCheckbox) { handleVnpayToggle(); return; }
    // Handle other payment gateway toggles if added similarly
    const paymentToggle = target.closest('.payment-gateway-setting .form-check-input');
    if(paymentToggle){
        const detailsDiv = paymentToggle.closest('.payment-gateway-setting')?.querySelector('.gateway-details');
        if(detailsDiv) detailsDiv.style.display = paymentToggle.checked ? 'block' : 'none';
        return;
    }


    // --- Product Form Auto Updates ---
    if (target === productNameInput) { handleProductNameInput(); return; }
    if (target === seoTitleInput || target === seoDescriptionInput || target === productSlugInput) { updateSeoPreview(); return; }
}

/** Handles delegated submit events */
function handleGlobalSubmit(event) {
    const target = event.target;
    // Prevent default form submission for all handled forms
    if (target === productForm || target === generalSettingsForm || target === seoSettingsForm) {
        event.preventDefault();
    }

    if (target === productForm) { handleProductFormSubmit(event); return; }
    if (target === generalSettingsForm) { handleGeneralSettingsSubmit(event); return; }
    if (target === seoSettingsForm) { handleSeoSettingsSubmit(event); return; }
    // Add other forms if needed
}

/** Close dropdowns/mobile sidebar on global click */
function handleGlobalClickOutside(event) {
    // Close dropdowns if click is outside relevant areas
    const isClickInsideNotification = event.target.closest('#adminNotificationBell, #adminNotificationPanel');
    const isClickInsideUserMenu = event.target.closest('#adminUserMenuToggle, #adminUserDropdown');
    if (!isClickInsideNotification && !isClickInsideUserMenu) {
        closeAllDropdowns();
    }

    // Close mobile sidebar if click is outside sidebar/toggle
    const isMobile = window.innerWidth <= 992;
    if (isMobile && sidebar?.classList.contains('active')) {
        if (!sidebar.contains(event.target) && event.target !== sidebarToggle && !sidebarToggle?.contains(event.target)) {
            handleSidebarToggle(); // Closes sidebar and overlay
        }
    }
}


// --- Specific Event Handlers ---
function handleDashboardClick(event) {
    const kpiCard = event.target.closest('.kpi-card.clickable');
    const viewOrderBtn = event.target.closest('.btn-view-order');
    const viewServiceBtn = event.target.closest('.btn-view-service');
    const editProductBtn = event.target.closest('.btn-edit-product'); // For low stock list
    const viewAllLink = event.target.closest('.view-all-link[data-section]');
    const activityCustomerLink = event.target.closest('.activity-log a.link-view-customer');

    if (kpiCard) {
        const targetSection = kpiCard.dataset.targetSection;
        const filter = kpiCard.dataset.filterStatus ? { status: kpiCard.dataset.filterStatus } : {};
        if (targetSection) setActiveSection(targetSection, filter);
    } else if (viewOrderBtn) {
        setActiveSection('orders', { view: viewOrderBtn.dataset.orderId });
    } else if (viewServiceBtn) {
        setActiveSection('services', { view: viewServiceBtn.dataset.serviceId });
    } else if (editProductBtn) {
        setActiveSection('products', { edit: editProductBtn.dataset.productId });
    } else if (viewAllLink) {
        event.preventDefault(); setActiveSection(viewAllLink.dataset.section);
    } else if (activityCustomerLink) {
        event.preventDefault(); setActiveSection('customers', { view: activityCustomerLink.dataset.customerId });
    }
}
function handleProductSectionClick(event) {
    const target = event.target;
    const targetClosest = (selector) => target.closest(selector);

    if (target === addProductBtn || targetClosest('.btn-add-product')) { showProductForm(); return; }
    if (target.classList.contains('btn-cancel-product') || targetClosest('.btn-cancel-product')) { hideProductForm(); return; }
    const editBtn = targetClosest('.btn-edit-product, .link-edit-product');
    if (editBtn) { event.preventDefault(); showProductForm(editBtn.dataset.productId); return; }
    const deleteBtn = targetClosest('.btn-delete-product');
    if (deleteBtn) { event.preventDefault(); handleDeleteProduct(deleteBtn); return; }
    const duplicateBtn = targetClosest('.btn-duplicate-product');
    if (duplicateBtn) { event.preventDefault(); handleDuplicateProduct(duplicateBtn.dataset.productId); return; }
    const removeImageBtn = targetClosest('.btn-remove-image');
    if (removeImageBtn) { removeImageBtn.parentElement.remove(); return; }
    if (target === featuredImageUploadArea || targetClosest('#featuredImageUpload')) { featuredImageInput?.click(); return; }
    if (target === galleryImageUploadArea || targetClosest('#galleryImageUpload')) { galleryImageInput?.click(); return; }
    // Handle Bulk Action Apply Button
    if(target === applyProductBulkActionBtn || targetClosest('#applyProductBulkAction')) { handleProductBulkAction(); return; }
}
function handleOrderSectionClick(event) {
    const target = event.target;
    const targetClosest = (selector) => target.closest(selector);

    const viewBtn = targetClosest('.link-view-order, .btn-view-order');
    if (viewBtn) { event.preventDefault(); showOrderDetail(viewBtn.dataset.orderId); return; }
    const customerLink = targetClosest('.link-view-customer');
    if (customerLink) { event.preventDefault(); setActiveSection('customers', { view: customerLink.dataset.customerId }); return; }
    const printBtn = targetClosest('.btn-print-invoice, .btn-print-invoice-detail');
    if (printBtn) { event.preventDefault(); handlePrintInvoice(printBtn.dataset.orderId || orderDetailView?.dataset.orderId); return; }
    if (target === saveOrderDetailBtn || targetClosest('#saveOrderDetailBtn')) { handleSaveOrderDetail(); return; }
    const addTrackingBtn = targetClosest('.btn-add-tracking');
    if (addTrackingBtn) { handleSaveTrackingCode(addTrackingBtn); return; }
    const addNoteBtn = targetClosest('.btn-add-note');
    if (addNoteBtn) { handleSaveOrderDetail(); return; } // Uses main save for note too
    if (target === refundOrderBtn || targetClosest('.btn-refund-order')) { handleInitiateRefund(); return; }
    // Handle Bulk Action Apply Button
    if(target === applyOrderBulkActionBtn || targetClosest('#applyOrderBulkAction')) { handleOrderBulkAction(); return; }
}
function handleServiceSectionClick(event) {
    const target = event.target;
    const targetClosest = (selector) => target.closest(selector);

    const viewBtn = targetClosest('.link-view-service, .btn-view-service');
    if (viewBtn) { event.preventDefault(); showServiceDetail(viewBtn.dataset.serviceId); return; }
    const customerLink = targetClosest('.link-view-customer');
    if (customerLink) { event.preventDefault(); setActiveSection('customers', { view: customerLink.dataset.customerId }); return; }
    // Use specific IDs for save/add note buttons inside the detail view
    if (target === saveServiceDetailBtn || targetClosest('#saveServiceDetailBtn') || target === addServiceNoteBtn || targetClosest('.btn-add-service-note')) {
        handleSaveServiceDetail(); return;
    }
}
function handleCustomerSectionClick(event) {
    const target = event.target;
    const targetClosest = (selector) => target.closest(selector);

    const viewBtn = targetClosest('.link-view-customer, .btn-view-customer');
    if (viewBtn) { event.preventDefault(); showCustomerDetail(viewBtn.dataset.customerId); return; }
    const emailBtn = targetClosest('.btn-email-customer');
    if (emailBtn && emailBtn.dataset.customerEmail) { event.preventDefault(); window.location.href = `mailto:${emailBtn.dataset.customerEmail}`; return; }
    const deleteBtn = targetClosest('.btn-delete-customer');
    if (deleteBtn) { event.preventDefault(); handleDeleteCustomer(deleteBtn); return; }
    // Handle clicks on buttons inside the customer detail view (add/edit/delete address)
    const addAddressBtn = targetClosest('.btn-add-address');
    if(addAddressBtn) { showToast("Add Address functionality not implemented.", "info"); return; }
    const editAddressBtn = targetClosest('.btn-edit-address');
    if(editAddressBtn) { showToast(`Edit Address ${editAddressBtn.dataset.addressId} not implemented.`, "info"); return; }
    const deleteAddressBtn = targetClosest('.btn-delete-address');
    if(deleteAddressBtn) { showToast(`Delete Address ${deleteAddressBtn.dataset.addressId} not implemented.`, "info"); return; }
    // Save Note button listener is added dynamically in renderCustomerDetail
}
function handleReportSectionClick(event) {
    const target = event.target;
    const targetClosest = (selector) => target.closest(selector);

    if (target === viewReportBtn || targetClosest('.btn-view-report')) {
        const filters = collectFilters(reportFiltersContainer);
        currentFilters.reports = filters;
        loadReportData(filters); return;
    }
    if (target === exportReportBtn || targetClosest('.btn-export-report')) {
        handleExportReport(); return;
    }
    const viewDetailLink = targetClosest('.report-summary a[data-section]');
    if(viewDetailLink){
        event.preventDefault();
        const targetSection = viewDetailLink.dataset.section;
        const filter = new URLSearchParams(viewDetailLink.href.split('?')[1] || '');
        setActiveSection(targetSection, Object.fromEntries(filter.entries())); return;
    }
}
function handleSettingsSectionClick(event) {
    const target = event.target;
    // Handle specific save buttons
    if (target === savePaymentSettingsBtn || target.closest('#savePaymentSettingsBtn')) { handlePaymentSettingsSubmit(event); return; }
    if (target === saveShippingSettingsBtn || target.closest('#saveShippingSettingsBtn')) { handleShippingSettingsSubmit(event); return; }
    if (target === saveEmailSettingsBtn || target.closest('#saveEmailSettingsBtn')) { handleEmailSettingsSubmit(event); return; }
    // Handle other actions like add/edit shipping zone/method, edit email template
    const addShippingZoneBtn = target.closest('.btn-secondary[title*="Vùng giao hàng"]'); // Assuming a title or specific class
    if(addShippingZoneBtn){ showToast("Add Shipping Zone not implemented.", "info"); return; }
    const editEmailTemplateBtn = target.closest('.btn-edit-template');
    if(editEmailTemplateBtn){ showToast("Edit Email Template not implemented.", "info"); return; }
}
function handleContentSectionClick(event) {
    // Handle add/edit/delete for Pages, Banners, FAQs
    const addPageBtn = event.target.closest('#content-pages .btn-primary');
    if(addPageBtn) { showToast("Add New Page not implemented.", "info"); return; }
    const addBannerBtn = event.target.closest('#content-banners .btn-primary');
    if(addBannerBtn) { showToast("Add New Banner not implemented.", "info"); return; }
    const addFaqBtn = event.target.closest('#content-faq .btn-primary');
    if(addFaqBtn) { showToast("Add New FAQ not implemented.", "info"); return; }
}
function handleAdminSectionClick(event) {
    // Handle add/edit/delete/disable/enable admins
    const addAdminBtnEl = event.target.closest('.btn-add-admin');
    if (addAdminBtnEl) { showToast("Add Admin functionality not implemented yet.", "info"); return; }
    const editAdminBtn = event.target.closest('.admin-table .btn-icon[title="Sửa"]');
    if(editAdminBtn) { showToast("Edit Admin not implemented.", "info"); return; }
    const changePassBtn = event.target.closest('.admin-table .btn-icon[title*="mật khẩu"]');
    if(changePassBtn) { showToast("Change Admin Password not implemented.", "info"); return; }
    const disableAdminBtn = event.target.closest('.admin-table .btn-icon[title*="Vô hiệu hóa"]');
    if(disableAdminBtn) { showToast("Disable Admin not implemented.", "info"); return; }
    const enableAdminBtn = event.target.closest('.admin-table .btn-icon[title*="Kích hoạt"]');
    if(enableAdminBtn) { showToast("Enable Admin not implemented.", "info"); return; }
}


// --- Action Handlers ---
function handleAdminLogout(event) {
    event.preventDefault();
    showConfirmationModal('Bạn có chắc chắn muốn đăng xuất?', async () => {
        if (isLoading) return; isLoading = true;
        showLoading(adminContainer, "Logging out...");
        try {
            await apiService.logout();
            showToast('Đăng xuất thành công!', 'success');
            setTimeout(() => { window.location.href = '/admin/login'; }, 1000); // Adjust URL
        } catch (error) {
            showToast(`Lỗi đăng xuất: ${error.message}`, 'error');
            hideLoading(adminContainer); isLoading = false;
        }
    }, null, { title: 'Xác nhận Đăng xuất', confirmText: 'Đăng xuất', confirmClass: 'btn-primary' });
}
async function handleClearNotifications(event) {
    event.preventDefault();
    if (isLoading || !notificationList) return;
    isLoading = true; showLoading(notificationPanel);
    try {
        await apiService.markAllNotificationsRead();
        showToast("Đã đánh dấu tất cả thông báo là đã đọc.", 'success');
        notificationList.querySelectorAll('li.unread').forEach(li => li.classList.remove('unread'));
        if (notificationCountBadge) { notificationCountBadge.textContent = '0'; notificationCountBadge.style.display = 'none'; }
        closeAllDropdowns();
    } catch (error) { showToast(`Lỗi khi xóa thông báo: ${error.message}`, 'error'); }
    finally { hideLoading(notificationPanel); isLoading = false; }
}
async function handleNotificationClick(event) {
    const item = event.target.closest('li[data-notif-id]');
    if (!item || isLoading) return;
    const notificationId = item.dataset.notifId;
    const isUnread = item.classList.contains('unread');
    const linkType = item.dataset.linkType;
    const linkId = item.dataset.linkId;

    // Mark as read if unread
    if (isUnread) {
        isLoading = true; item.style.opacity = '0.5';
        try {
            await apiService.markNotificationRead(notificationId);
            item.classList.remove('unread'); item.style.opacity = '1';
            if (notificationCountBadge) {
                let count = Math.max(0, (parseInt(notificationCountBadge.textContent) || 0) - 1);
                notificationCountBadge.textContent = count;
                notificationCountBadge.style.display = count > 0 ? 'flex' : 'none';
            }
        } catch (error) {
            showToast(`Lỗi đánh dấu thông báo: ${error.message}`, 'error');
            item.style.opacity = '1'; // Restore opacity on error
        } finally { isLoading = false; }
    }
    // Navigate if link exists
    if (linkType && linkId) {
        closeAllDropdowns();
        // Use setActiveSection with appropriate params for navigation
        const params = {};
        if (linkType === 'order' || linkType === 'service' || linkType === 'customer') {
            params.view = linkId; // Parameter for viewing detail
        } else if (linkType === 'product') {
            params.edit = linkId; // Parameter for editing product
        }
        setActiveSection(linkType + 's', params); // Assumes section name is plural
    }
}
async function handleDeleteProduct(button) {
    const productId = button.dataset.productId;
    const productName = button.dataset.productName || `ID ${productId}`;
    if (!productId) return;
    showConfirmationModal(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"? Hành động này không thể hoàn tác.`, async () => {
        if (isLoading) return; isLoading = true; setButtonLoading(button);
        try {
            await apiService.deleteProduct(productId);
            showToast(`Đã xóa sản phẩm "${productName}".`, 'success');
            button.closest('tr')?.remove();
            // Optionally reload list data to update pagination count
            // await loadProductListData(currentFilters.products);
        } catch (error) { showToast(`Lỗi khi xóa sản phẩm: ${error.message}`, 'error'); resetButtonLoading(button); }
        finally { isLoading = false; /* Button reset is conditional on success */ }
    });
}
async function handleDuplicateProduct(productId) {
    if (isLoading || !productId) return;
    const duplicateButton = document.querySelector(`.btn-duplicate-product[data-product-id="${productId}"]`);
    showToast(`Đang chuẩn bị nhân bản sản phẩm ${productId}...`, 'info');
    isLoading = true; if(duplicateButton) setButtonLoading(duplicateButton);
    try {
        const productData = await apiService.getProductDetails(productId);
        productData.id = null; productData.name = `${productData.name} (Copy)`;
        productData.slug = ''; productData.status = 'draft';
        // productData.sku = `${productData.sku}-COPY`; // Optional: Modify SKU
        // productData.stock = 0; // Optional: Reset stock

        await showProductForm(); // Show empty form, initializes libraries
        populateProductForm(productData); // Populate with modified data
        if (productFormHeading) productFormHeading.textContent = 'Thêm Sản Phẩm (Nhân bản)';

    } catch (error) { showToast(`Lỗi khi nhân bản sản phẩm: ${error.message}`, 'error'); }
    finally { isLoading = false; if(duplicateButton) resetButtonLoading(duplicateButton); }
}
async function handleProductBulkAction() {
    if (isLoading) return;
    const selectedAction = productBulkActionSelect?.value;
    const selectedCheckboxes = productsSection?.querySelectorAll('.product-checkbox:checked');
    if (!selectedAction || !selectedCheckboxes || selectedCheckboxes.length === 0) {
        showToast('Vui lòng chọn hành động và ít nhất một sản phẩm.', 'warning'); return; }

    const selectedProductIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    const actionText = productBulkActionSelect.options[productBulkActionSelect.selectedIndex].text;

    showConfirmationModal(`Bạn có chắc chắn muốn "${actionText}" ${selectedProductIds.length} sản phẩm đã chọn?`, async () => {
        isLoading = true; setButtonLoading(applyProductBulkActionBtn);
        try {
            const result = await apiService.applyProductBulkAction(selectedAction, selectedProductIds);
            showToast(result.message || `Đã áp dụng "${actionText}" thành công.`, 'success');
            if (productBulkActionSelect) productBulkActionSelect.value = ''; // Reset dropdown
            await loadProductListData(currentFilters.products); // Reload list
        } catch (error) { showToast(`Lỗi khi áp dụng hành động hàng loạt: ${error.message}`, 'error'); }
        finally { resetButtonLoading(applyProductBulkActionBtn); isLoading = false; }
    }, null, { confirmText: 'Áp dụng' }); // Custom confirm button text
}
async function handleOrderInlineStatusChange(event) {
    const dropdown = event.target;
    if (!dropdown.classList.contains('order-status-dropdown') || isLoading) return;
    const orderId = dropdown.dataset.orderId;
    const newStatus = dropdown.value;
    const originalStatus = dropdown.querySelector('option[selected]')?.value || dropdown.options[dropdown.selectedIndex - 1]?.value; // Try to find original

    if (!orderId || !newStatus || newStatus === originalStatus) return;

    // Find original status more reliably before disabling
    let previousStatus = null;
    for(let i=0; i<dropdown.options.length; i++){
        if(dropdown.options[i].defaultSelected) {
            previousStatus = dropdown.options[i].value;
            break;
        }
    }

    isLoading = true; dropdown.disabled = true; // Disable during update

    try {
        await apiService.updateOrderStatus(orderId, newStatus);
        showToast(`Trạng thái đơn hàng #${orderId} đã được cập nhật.`, 'success');
        // Update defaultSelected attribute for future reference
        dropdown.querySelectorAll('option').forEach(opt => opt.defaultSelected = (opt.value === newStatus));
    } catch (error) {
        showToast(`Lỗi cập nhật trạng thái đơn hàng #${orderId}: ${error.message}`, 'error');
        dropdown.value = previousStatus || ''; // Revert dropdown selection on error
    } finally {
        dropdown.disabled = false; isLoading = false;
    }
}
async function handleOrderBulkAction() {
    if (isLoading) return;
    const selectedAction = orderBulkActionSelect?.value;
    const selectedCheckboxes = ordersSection?.querySelectorAll('.order-checkbox:checked');
    if (!selectedAction || !selectedCheckboxes || selectedCheckboxes.length === 0) {
        showToast('Vui lòng chọn hành động và ít nhất một đơn hàng.', 'warning'); return; }

    const selectedOrderIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    const actionText = orderBulkActionSelect.options[orderBulkActionSelect.selectedIndex].text;

    if (selectedAction.startsWith('print_')) {
        console.log(`Bulk printing (${actionText}) for ${selectedOrderIds.length} orders...`);
        // In reality, might open a single print preview for all selected, or generate separate PDFs
        selectedOrderIds.forEach(id => handlePrintInvoice(id)); // Example: Open multiple print views
        showToast(`Đã gửi lệnh in cho ${selectedOrderIds.length} đơn hàng.`, 'info');
        return;
    }

    // Add prompt for tracking codes if marking as shipped
    if (selectedAction === 'mark_shipped') {
        // For simplicity, we'll just confirm for now. A real app might show a modal.
        showConfirmationModal(`Đánh dấu ${selectedOrderIds.length} đơn hàng là "Đang giao"? Bạn sẽ cần thêm mã vận đơn thủ công sau.`, confirmBulkAction, null, {confirmText: 'Xác nhận Đang giao'});
    } else {
        showConfirmationModal(`Bạn có chắc chắn muốn "${actionText}" cho ${selectedOrderIds.length} đơn hàng đã chọn?`, confirmBulkAction, null, {confirmText: 'Áp dụng'});
    }

    // Function to execute after confirmation
    async function confirmBulkAction() {
        isLoading = true; setButtonLoading(applyOrderBulkActionBtn);
        try {
            const result = await apiService.applyOrderBulkAction(selectedAction, selectedOrderIds);
            showToast(result.message || `Đã áp dụng "${actionText}" thành công.`, 'success');
            if (orderBulkActionSelect) orderBulkActionSelect.value = '';
            await loadOrderListData(currentFilters.orders); // Reload list
        } catch (error) { showToast(`Lỗi khi áp dụng hành động hàng loạt: ${error.message}`, 'error'); }
        finally { resetButtonLoading(applyOrderBulkActionBtn); isLoading = false; }
    }
}
async function handleServiceInlineChange(event) {
    if (isLoading) return;
    const dropdown = event.target;
    const isStatusDropdown = dropdown.classList.contains('service-status-dropdown');
    const isAssigneeDropdown = dropdown.classList.contains('service-assignee-dropdown');
    if (!isStatusDropdown && !isAssigneeDropdown) return;

    const serviceId = dropdown.dataset.serviceId;
    const newValue = dropdown.value;
    let originalValue = null;
    for(let i=0; i<dropdown.options.length; i++){
        if(dropdown.options[i].defaultSelected) { originalValue = dropdown.options[i].value; break; }
    }

    if (!serviceId || newValue === originalValue) return;

    isLoading = true; dropdown.disabled = true;
    const updateData = {}; let updateType = '';
    if (isStatusDropdown) { updateData.status = newValue; updateType = 'status'; }
    else { updateData.assignee = newValue; updateType = 'assignee'; }

    try {
        await apiService.updateService(serviceId, updateData);
        showToast(`Yêu cầu #${serviceId} ${updateType} đã được cập nhật.`, 'success');
        dropdown.querySelectorAll('option').forEach(opt => opt.defaultSelected = (opt.value === newValue));
    } catch (error) {
        showToast(`Lỗi cập nhật yêu cầu #${serviceId}: ${error.message}`, 'error');
        dropdown.value = originalValue || ''; // Revert on error
    } finally { dropdown.disabled = false; isLoading = false; }
}
async function handleDeleteCustomer(button) {
    const customerId = button.dataset.customerId;
    const customerName = button.dataset.customerName || `ID ${customerId}`;
    if (!customerId) return;
    showConfirmationModal(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"? Dữ liệu liên quan (đơn hàng, yêu cầu DV) có thể bị ảnh hưởng.`, async () => {
        if (isLoading) return; isLoading = true; setButtonLoading(button);
        try {
            await apiService.deleteCustomer(customerId);
            showToast(`Đã xóa khách hàng "${customerName}".`, 'success');
            button.closest('tr')?.remove();
            // Reload customer list is optional, depends if pagination count matters
            // await loadCustomerListData(currentFilters.customers);
        } catch (error) { showToast(`Lỗi khi xóa khách hàng: ${error.message}`, 'error'); resetButtonLoading(button); }
        finally { isLoading = false; }
    });
}
async function handleGeneralSettingsSubmit(event) {
    event.preventDefault();
    const form = generalSettingsForm;
    if (!form || isLoading || !validateFormClientSide(form)) return;
    const submitButton = form.querySelector('button[type="submit"]');
    isLoading = true; setButtonLoading(submitButton); clearFormValidation(form);
    try {
        const formData = new FormData(form);
        // Handle file upload if included
        // const logoFile = formData.get('storeLogoFile'); // Get file
        // if (logoFile && logoFile.size === 0) formData.delete('storeLogoFile'); // Remove if no file selected

        // If sending JSON, convert FormData
        // const settingsData = Object.fromEntries(formData.entries());
        // await apiService.saveSettings('general', settingsData);

        // If sending FormData directly for upload:
        const settings = await apiService.request('/settings/general', { method: 'POST', body: formData, headers: {'Content-Type': null} });

        showToast("Cài đặt chung đã được lưu.", 'success');
        // Update logo preview if API returns new URL
        if(settings?.storeLogo && form.querySelector('#storeLogoPreview')){
            form.querySelector('#storeLogoPreview').innerHTML = `<img src="${settings.storeLogo}" alt="Current Logo" style="max-height: 50px; width:auto;">`;
        }

    } catch (error) {
        showToast(`Lỗi khi lưu cài đặt chung: ${error.message}`, 'error');
        if (error.status === 422 && error.data?.errors) { displayFormValidationErrors(form, error.data.errors); }
    } finally { resetButtonLoading(submitButton); isLoading = false; }
}
async function handlePaymentSettingsSubmit(event) {
    event.preventDefault();
    const container = paymentSettingsContainer;
    const submitButton = container?.querySelector('button.btn-primary');
    if (isLoading || !container) return;
    isLoading = true; if (submitButton) setButtonLoading(submitButton);
    try {
        const settingsData = { // Gather data from controls
            codEnabled: container.querySelector('#codEnabled')?.checked,
            codTitle: container.querySelector('#codTitle')?.value,
            codInstructions: container.querySelector('#codInstructions')?.value,
            bankTransferEnabled: container.querySelector('#bankTransferEnabled')?.checked,
            bankTransferTitle: container.querySelector('#bankTransferTitle')?.value,
            bankTransferDetails: container.querySelector('#bankTransferDetails')?.value,
            vnpayEnabled: container.querySelector('#vnpayEnabled')?.checked,
            vnpayTmnCode: container.querySelector('#vnpayTmnCode')?.value,
            vnpayHashSecret: container.querySelector('#vnpayHashSecret')?.value,
            vnpayTestMode: container.querySelector('#vnpayTestMode')?.checked,
            // Add other gateways
        };
        await apiService.saveSettings('payments', settingsData);
        showToast("Cài đặt thanh toán đã được lưu.", 'success');
    } catch (error) { showToast(`Lỗi khi lưu cài đặt thanh toán: ${error.message}`, 'error'); }
    finally { if (submitButton) resetButtonLoading(submitButton); isLoading = false; }
}
async function handleShippingSettingsSubmit(event) {
    event.preventDefault();
    const container = shippingSettingsContainer;
    const submitButton = container?.querySelector('button.btn-primary');
    if (isLoading || !container) return;
    isLoading = true; if (submitButton) setButtonLoading(submitButton);
    try {
        // TODO: Implement logic to gather complex shipping zone data from the UI
        const settingsData = { zones: [ /* Extracted zone data */ ] };
        console.log("Saving Shipping Data:", settingsData);
        await apiService.saveSettings('shipping', settingsData);
        showToast("Cài đặt vận chuyển đã được lưu.", 'success');
    } catch (error) { showToast(`Lỗi khi lưu cài đặt vận chuyển: ${error.message}`, 'error'); }
    finally { if (submitButton) resetButtonLoading(submitButton); isLoading = false; }
}
async function handleEmailSettingsSubmit(event) {
    event.preventDefault();
    const container = emailSettingsContainer;
    const submitButton = container?.querySelector('button.btn-primary');
    if (isLoading || !container) return;
    isLoading = true; if (submitButton) setButtonLoading(submitButton);
    try {
        // TODO: Gather email settings data (sender, template enables/disables)
        const settingsData = { /* Extracted email settings */ };
        console.log("Saving Email Data:", settingsData);
        await apiService.saveSettings('emails', settingsData);
        showToast("Cài đặt email đã được lưu.", 'success');
    } catch (error) { showToast(`Lỗi khi lưu cài đặt email: ${error.message}`, 'error'); }
    finally { if (submitButton) resetButtonLoading(submitButton); isLoading = false; }
}
async function handleSeoSettingsSubmit(event) {
    event.preventDefault();
    const form = seoSettingsForm;
    if (!form || isLoading || !validateFormClientSide(form)) return;
    const submitButton = form.querySelector('button[type="submit"]');
    isLoading = true; setButtonLoading(submitButton); clearFormValidation(form);
    try {
        const formData = new FormData(form);
        const settingsData = Object.fromEntries(formData.entries());
        await apiService.saveSettings('seo', settingsData);
        showToast("Cài đặt SEO mặc định đã được lưu.", 'success');
    } catch (error) {
        showToast(`Lỗi khi lưu cài đặt SEO: ${        error.message}`, 'error');
        if (error.status === 422 && error.data?.errors) { displayFormValidationErrors(form, error.data.errors); }
    } finally { resetButtonLoading(submitButton); isLoading = false; }
}

    /** Toggles visibility of VNPAY details based on checkbox */
    function handleVnpayToggle() {
        if (vnpayEnabledCheckbox && vnpayDetailsDiv) {
            vnpayDetailsDiv.style.display = vnpayEnabledCheckbox.checked ? 'block' : 'none';
        }
    }

    /** Handles input in the header search bar (debounced) */
    function handleHeaderSearchInput() {
        const searchTerm = adminSearchInput.value.trim();
        console.log(`Header search input changed: "${searchTerm}"`);
        // Could trigger live search suggestions here if implemented
    }

    /** Handles submission of the header search */
    async function handleHeaderSearchSubmit() {
        const searchTerm = adminSearchInput.value.trim();
        if (!searchTerm) {
            showToast("Vui lòng nhập nội dung tìm kiếm.", "warning");
            return;
        }
        console.log(`Submitting header search for: "${searchTerm}"`);
        showLoading(adminContainer); // Show global loading

        try {
            // Example: Redirect to product search results page
            setActiveSection('products', { productFilterName: searchTerm }, true);
            // Clear the input after initiating search
            adminSearchInput.value = '';

            // Alternative: Show results in a modal or dropdown (more complex)
            // const results = await apiService.searchAdmin(searchTerm);
            // displaySearchResults(results); // Function to show results

        } catch (error) {
            showToast(`Search failed: ${error.message}`, 'error');
        } finally {
            hideLoading(adminContainer); // Hide loading after search attempt
        }
    }

    /** Handles click on the export report button */
    async function handleExportReport() {
        if (isLoading || !exportReportBtn) return;
        const filters = collectFilters(reportFiltersContainer);
        const reportType = reportFiltersContainer?.querySelector('#reportType')?.value || 'revenue';
        const params = { ...filters, type: reportType };

        console.log("Requesting report export with params:", params);
        showToast(`Đang chuẩn bị xuất báo cáo ${reportType}...`, 'info');
        setButtonLoading(exportReportBtn);
        isLoading = true;

        try {
            const result = await apiService.exportReport(params); // API should initiate download
            showToast(result.message || 'Báo cáo đang được xuất.', 'success');
            // If API returns a direct download URL:
            if (result.downloadUrl) {
                // Create a temporary link to trigger download
                const link = document.createElement('a');
                link.href = result.downloadUrl;
                link.setAttribute('download', `report-${reportType}-${Date.now()}.xlsx`); // Suggest filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            // If API returns blob data, create object URL for download (more complex)

        } catch (error) {
            showToast(`Lỗi xuất báo cáo: ${error.message}`, 'error');
        } finally {
            resetButtonLoading(exportReportBtn);
            isLoading = false;
        }
    }

    // --- Fetch and Render Notifications ---
    async function loadNotifications() {
        if (!notificationList || !notificationCountBadge) return;
        notificationList.innerHTML = '<li><span class="text-muted p-3 text-center">Đang tải...</span></li>'; // Show loading inside
        try {
            const notifications = await apiService.getNotifications();
            let unreadCount = 0;
            if (notifications && notifications.length > 0) {
                notificationList.innerHTML = notifications.map(notif => {
                    if (!notif.read) unreadCount++;
                    const linkDataAttrs = notif.link ? `data-link-type="${notif.link.type}" data-link-id="${notif.link.id}"` : '';
                    const escapedMessage = notif.message.replace(/</g, "<").replace(/>/g, ">"); // Escape message
                    return `
                         <li data-notif-id="${notif.id}" class="${!notif.read ? 'unread' : ''}" ${linkDataAttrs} role="link" tabindex="0">
                             <span>${escapedMessage}</span>
                             <span class="timestamp">${notif.timestamp}</span>
                         </li>`;
                }).join('');
            } else {
                notificationList.innerHTML = '<li><span class="text-muted p-3 text-center">Không có thông báo nào.</span></li>';
            }
            notificationCountBadge.textContent = unreadCount;
            notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        } catch (error) {
            console.error("Error loading notifications:", error);
            showToast("Không thể tải thông báo.", "error");
            notificationList.innerHTML = '<li><span class="text-danger p-3 text-center">Lỗi tải thông báo.</span></li>';
        }
    }

    // =========================================================================
    // Initialization
    // =========================================================================
    function initializeAdminDashboard() {
        console.log("Initializing Admin Dashboard...");
        setupMainEventListeners(); // Setup delegated listeners

        // Attach non-delegated listeners (modals, etc.)
        confirmModalConfirmBtn?.addEventListener('click', handleModalConfirm);
        confirmModalCancelBtn?.addEventListener('click', handleModalCancel);
        modalOverlay?.addEventListener('click', closeModal); // Allow closing modal via overlay click

        // Listen for hash changes (browser back/forward button)
        window.addEventListener('hashchange', () => {
            console.log("Hash changed:", window.location.hash);
            // Avoid infinite loops if already loading
            if (!isLoading) {
                setActiveSection(); // Reload section based on new hash
            }
        });

        // Initial load based on current URL hash or default
        setActiveSection();

        // Initial load of notifications for badge count
        loadNotifications();

        // Initial UI state setup
        handleVnpayToggle(); // Set VNPAY details visibility

        console.log("Admin Dashboard Initialized.");
    }

    // --- Start the application ---
    initializeAdminDashboard();

}); // End DOMContentLoaded