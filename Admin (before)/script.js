
// --- START OF FILE script.js ---

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // Configuration & Constants
    // =========================================================================
    const API_BASE_URL = '/api/admin'; // Placeholder: Replace with your actual API endpoint
    const TOAST_DEFAULT_DURATION = 3000; // Milliseconds for toast notifications

    // =========================================================================
    // DOM Element References (Grouped for clarity)
    // =========================================================================

    // --- Layout & Core UI ---
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.admin-sidebar .sidebar-link');
    const adminSections = document.querySelectorAll('.admin-section');
    const mainContent = document.getElementById('adminMainContent');
    const adminContainer = document.querySelector('.admin-container'); // For loading overlay

    // --- Header ---
    const notificationBell = document.getElementById('adminNotificationBell');
    const notificationPanel = document.getElementById('adminNotificationPanel');
    const notificationList = document.getElementById('adminNotificationList');
    const clearAdminNotificationsBtn = document.getElementById('clearAdminNotifications');
    const userMenuToggle = document.getElementById('adminUserMenuToggle');
    const userDropdown = document.getElementById('adminUserDropdown');
    const notificationCountBadge = document.getElementById('adminNotificationCount');

    // --- Logout Links ---
    const logoutLinkSidebar = document.getElementById('adminLogoutLink');
    const logoutLinkDropdown = document.getElementById('adminLogoutLinkDropdown');

    // --- Dashboard ---
    const dashboardSection = document.getElementById('dashboard-section');
    const revenueChartCtx = document.getElementById('revenueChart')?.getContext('2d');
    const orderStatusChartCtx = document.getElementById('orderStatusChart')?.getContext('2d');
    const topProductsChartCtx = document.getElementById('topProductsChart')?.getContext('2d');

    // --- Reports ---
    const reportsSection = document.getElementById('reports-section'); // Assume you have a reference if needed
    const reportRevenueChartCtx = document.getElementById('reportRevenueChart')?.getContext('2d');
    const reportTopProductsChartCtx = document.getElementById('reportTopProductsChart')?.getContext('2d');

    // --- Products ---
    const productsSection = document.getElementById('products-section');
    const addProductBtn = productsSection?.querySelector('.btn-add-product');
    const productFormContainer = document.getElementById('product-form-container');
    const productForm = document.getElementById('productForm');
    const cancelProductBtn = productFormContainer?.querySelector('.btn-cancel-product');
    const productFormTabs = productFormContainer?.querySelectorAll('.product-form-tabs .tab-link');
    const productFormTabContents = productFormContainer?.querySelectorAll('#product-form-container > .tab-content'); // Direct children
    const manageStockCheckbox = document.getElementById('manageStock');
    const stockFields = productFormContainer?.querySelectorAll('.stock-fields');
    const productListView = productsSection?.querySelector('.table-responsive');
    const productTableBody = productsSection?.querySelector('.admin-table tbody');
    const productPagination = productsSection?.querySelector('.pagination-container');
    const productFilters = productsSection?.querySelector('.filters-container');
    const productBulkActions = productsSection?.querySelector('.bulk-actions-container');
    const selectAllProductsCheckbox = document.getElementById('selectAllProducts');
    const productTable = productsSection?.querySelector('.admin-table');
    const productBulkActionSelect = document.getElementById('productBulkAction');
    const applyProductBulkActionBtn = document.getElementById('applyProductBulkAction');

    // --- Orders ---
    const ordersSection = document.getElementById('orders-section');
    const orderListView = ordersSection?.querySelector('.table-responsive');
    const orderTableBody = ordersSection?.querySelector('.admin-table tbody');
    const orderPagination = ordersSection?.querySelector('.pagination-container');
    const orderFilters = ordersSection?.querySelector('.filters-container');
    const orderBulkActions = ordersSection?.querySelector('.bulk-actions-container');
    const selectAllOrdersCheckbox = document.getElementById('selectAllOrders');
    const orderTable = ordersSection?.querySelector('.admin-table');
    const orderBulkActionSelect = document.getElementById('orderBulkAction');
    const applyOrderBulkActionBtn = document.getElementById('applyOrderBulkAction');
    const orderDetailView = document.getElementById('order-detail-view');
    const orderDetailContent = document.getElementById('orderDetailContentPlaceholder');
    const orderDetailIdSpan = document.getElementById('detailOrderId');

    // --- Services ---
    const servicesSection = document.getElementById('services-section');
    const serviceTable = servicesSection?.querySelector('.admin-table');
    const serviceTableBody = servicesSection?.querySelector('.admin-table tbody');
    const servicePagination = servicesSection?.querySelector('.pagination-container');
    const serviceFilters = servicesSection?.querySelector('.filters-container');
    const serviceDetailView = document.getElementById('service-detail-view');
    const serviceDetailContent = document.getElementById('serviceDetailContentPlaceholder');
    const serviceDetailIdSpan = document.getElementById('detailServiceId');

    // --- Customers ---
    const customersSection = document.getElementById('customers-section');
    const customerTable = customersSection?.querySelector('.admin-table');
    const customerTableBody = customersSection?.querySelector('.admin-table tbody');
    const customerPagination = customersSection?.querySelector('.pagination-container');
    const customerFilters = customersSection?.querySelector('.filters-container');
    const customerDetailView = document.getElementById('customer-detail-view');
    const customerDetailContent = document.getElementById('customerDetailContentPlaceholder');
    const customerDetailNameSpan = document.getElementById('detailCustomerName');
    const customerDetailTabs = customerDetailView?.querySelectorAll('.customer-detail-tabs .tab-link');
    const customerDetailTabContents = customerDetailView?.querySelectorAll('#customerDetailContentPlaceholder > .tab-content'); // Direct children

    // --- Content ---
    const contentSection = document.getElementById('content-section');
    const contentTabs = contentSection?.querySelectorAll('.content-tabs .tab-link');
    const contentTabContents = contentSection?.querySelectorAll('#content-section > .tab-content'); // Direct children

    // --- Settings ---
    const settingsSection = document.getElementById('settings-section');
    const settingsTabs = settingsSection?.querySelectorAll('.settings-tabs .tab-link');
    const settingsTabContents = settingsSection?.querySelectorAll('#settings-section > .tab-content'); // Direct children
    const vnpayEnabledCheckbox = document.getElementById('vnpayEnabled');
    const vnpayDetailsDiv = vnpayEnabledCheckbox?.closest('.payment-gateway-setting')?.querySelector('.gateway-details');

    // --- Generic / Modals ---
    const closeDetailButtons = document.querySelectorAll('.btn-close-detail');
    // TODO: Add references for Modal elements if implementing custom modals

    // =========================================================================
    // State Variables
    // =========================================================================
    let activeAdminSectionId = null; // Start null, set during init
    let charts = {}; // Store chart instances
    let isLoading = false; // Global loading flag to prevent duplicate actions

    // =========================================================================
    // Utility Functions
    // =========================================================================

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
        return numericAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    /**
     * Shows an element by setting its display style.
     * @param {HTMLElement} element - The element to show.
     * @param {string} [displayType='block'] - The display style (e.g., 'block', 'flex', 'grid').
     */
    function showElement(element, displayType = 'block') {
        if (element) {
            element.style.display = displayType;
        }
    }

    /**
     * Hides an element by setting its display style to 'none'.
     * @param {HTMLElement} element - The element to hide.
     */
    function hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    /**
     * Shows an element using 'display: flex'.
     * @param {HTMLElement} element - The element to show.
     */
    function flexElement(element) {
        showElement(element, 'flex');
    }

    /**
     * Shows a toast notification.
     * TODO: Replace with a proper toast library (e.g., Toastify, Notyf).
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'warning'|'info'} [type='info'] - The type of toast.
     * @param {number} [duration=TOAST_DEFAULT_DURATION] - How long the toast stays visible.
     */
    function showToast(message, type = 'info', duration = TOAST_DEFAULT_DURATION) {
        console.log(`[Toast - ${type.toUpperCase()}] ${message}`); // Basic console log fallback
        // --- Toast Library Integration Placeholder ---
        // if (typeof Notyf !== 'undefined') {
        //     const notyf = new Notyf({ duration, dismissible: true });
        //     switch (type) {
        //         case 'success': notyf.success(message); break;
        //         case 'error': notyf.error(message); break;
        //         case 'warning': notyf.open({ type: 'warning', message }); break; // Adjust if library uses different names
        //         default: notyf.open({ type: 'info', message }); break; // Adjust if library uses different names
        //     }
        // } else {
            // Simple fallback alert for demonstration if no library is present
            alert(`[${type.toUpperCase()}] ${message}`);
        // }
        // --- End Placeholder ---
    }

    /**
     * Shows a confirmation modal.
     * TODO: Replace with a proper modal implementation (e.g., Bootstrap Modal, Micromodal, custom).
     * @param {string} message - The confirmation question.
     * @param {function} confirmCallback - Function to execute if confirmed.
     * @param {function} [cancelCallback] - Optional function if cancelled.
     */
    function showConfirmationModal(message, confirmCallback, cancelCallback) {
        console.log(`[Confirm] ${message}`); // Basic console log fallback
        // --- Modal Library Integration Placeholder ---
        // Example using basic browser confirm:
        if (window.confirm(message)) {
            if (confirmCallback) {
                confirmCallback();
            }
        } else {
            if (cancelCallback) {
                cancelCallback();
            }
        }
        // --- End Placeholder ---
        // --- Proper Modal Example (Conceptual) ---
        // const modal = document.getElementById('adminConfirmModal');
        // const modalMessage = modal.querySelector('.modal-message');
        // const confirmBtn = modal.querySelector('.btn-confirm');
        // const cancelBtn = modal.querySelector('.btn-cancel');
        // const overlay = document.getElementById('adminModalOverlay');

        // modalMessage.textContent = message;

        // const confirmHandler = () => {
        //     closeModal();
        //     if (confirmCallback) confirmCallback();
        // };
        // const cancelHandler = () => {
        //     closeModal();
        //     if (cancelCallback) cancelCallback();
        // };

        // const closeModal = () => {
        //     modal.classList.remove('active');
        //     overlay.classList.remove('active');
        //     confirmBtn.removeEventListener('click', confirmHandler);
        //     cancelBtn.removeEventListener('click', cancelHandler);
        //     overlay.removeEventListener('click', cancelHandler);
        // };

        // // Remove previous listeners before adding new ones
        // confirmBtn.removeEventListener('click', confirmHandler);
        // cancelBtn.removeEventListener('click', cancelHandler);
        // overlay.removeEventListener('click', cancelHandler);

        // confirmBtn.addEventListener('click', confirmHandler);
        // cancelBtn.addEventListener('click', cancelHandler);
        // overlay.addEventListener('click', cancelHandler);

        // modal.classList.add('active');
        // overlay.classList.add('active');
        // --- End Conceptual Modal Example ---
    }

    /**
     * Displays a loading indicator (e.g., spinner or overlay).
     * @param {HTMLElement} [element=adminContainer] - The element to show loading state on. Defaults to the main container.
     * @param {string} [message='Loading...'] - Optional message.
     */
    function showLoading(element = adminContainer, message = 'Loading...') {
        // Simple approach: add a class for a full-page overlay+spinner defined in CSS
        element.classList.add('is-loading');
        // You could also dynamically create and append a spinner element
        // Example:
        // const spinner = document.createElement('div');
        // spinner.className = 'loading-spinner'; // Style this class in CSS
        // spinner.textContent = message;
        // element.appendChild(spinner);
        // element.dataset.loading = 'true';
        console.log(`Loading started on ${element.id || 'container'}...`);
    }

    /**
     * Hides the loading indicator.
     * @param {HTMLElement} [element=adminContainer] - The element loading state was shown on.
     */
    function hideLoading(element = adminContainer) {
        element.classList.remove('is-loading');
        // Example: remove dynamically created spinner
        // const spinner = element.querySelector('.loading-spinner');
        // if (spinner) {
        //     spinner.remove();
        // }
        // delete element.dataset.loading;
        console.log(`Loading finished on ${element.id || 'container'}.`);
    }

    /**
     * Adds a loading state specifically to a button.
     * @param {HTMLButtonElement} button - The button element.
     * @param {string} [loadingText='Processing...'] - Text to show while loading (optional).
     */
    function setButtonLoading(button, loadingText = 'Processing...') {
        if (!button) return;
        button.disabled = true;
        button.dataset.originalText = button.innerHTML; // Store original content
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
    }

    /**
     * Removes the loading state from a button.
     * @param {HTMLButtonElement} button - The button element.
     */
    function resetButtonLoading(button) {
        if (!button || !button.dataset.originalText) return;
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
        delete button.dataset.originalText;
    }

    /**
     * Displays an empty state message within a container (e.g., table body).
     * @param {HTMLElement} container - The container element (e.g., tbody).
     * @param {string} message - The message to display.
     * @param {number} [colspan=1] - Colspan for table cells.
     */
    function displayEmptyState(container, message, colspan = 1) {
        if (!container) return;
        const isEmptyTableBody = container.tagName === 'TBODY';
        let emptyElement;

        if (isEmptyTableBody) {
            emptyElement = document.createElement('tr');
            emptyElement.innerHTML = `<td colspan="${colspan}" class="text-center text-muted p-4">${message}</td>`;
        } else {
            emptyElement = document.createElement('div');
            emptyElement.className = 'empty-state text-center text-muted p-4'; // Style this class
            emptyElement.innerHTML = `<p><i class="fas fa-info-circle fa-2x mb-2"></i><br>${message}</p>`;
        }
        container.innerHTML = ''; // Clear previous content
        container.appendChild(emptyElement);
    }

    /**
     * Clears validation errors from a form.
     * @param {HTMLFormElement} form - The form element.
     */
    function clearFormValidation(form) {
        if (!form) return;
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    }

    /**
     * Displays validation errors on a form.
     * @param {HTMLFormElement} form - The form element.
     * @param {object} errors - An object where keys are input names and values are error messages.
     */
    function displayFormValidationErrors(form, errors) {
        if (!form || !errors) return;
        clearFormValidation(form); // Clear previous errors first

        for (const fieldName in errors) {
            const input = form.querySelector(`[name="${fieldName}"], #${fieldName}`); // Find by name or ID
            if (input) {
                input.classList.add('is-invalid');
                const errorMsg = errors[fieldName];
                const errorElement = document.createElement('div');
                errorElement.className = 'invalid-feedback'; // Use Bootstrap class or custom style
                errorElement.textContent = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;

                // Insert error message after the input or its parent if it's complex (e.g., checkbox)
                input.parentNode.insertBefore(errorElement, input.nextSibling);
            } else {
                console.warn(`Validation Error: Could not find form field for "${fieldName}"`);
            }
        }
        // Optionally scroll to the first error
        const firstError = form.querySelector('.is-invalid');
        firstError?.focus();
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Basic client-side form validation (complements server-side validation).
     * @param {HTMLFormElement} form - The form to validate.
     * @returns {boolean} - True if the form is valid according to HTML5 constraints.
     */
     function validateFormClientSide(form) {
        if (!form) return false;
        clearFormValidation(form); // Clear previous errors
        let isValid = true;

        // Use built-in checkValidity and reportValidity for basic HTML5 validation feedback
        if (!form.checkValidity()) {
             isValid = false;
             // Find the first invalid element and display its message (browsers often handle this)
             const firstInvalid = form.querySelector(':invalid');
             if(firstInvalid){
                 // Manually add error class and display message if browser doesn't show it well
                 firstInvalid.classList.add('is-invalid');
                 const errorElement = document.createElement('div');
                 errorElement.className = 'invalid-feedback';
                 errorElement.textContent = firstInvalid.validationMessage; // Get browser's message
                 firstInvalid.parentNode.insertBefore(errorElement, firstInvalid.nextSibling);
                 firstInvalid.focus();
                 firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
             } else {
                 // If checkValidity is false but no specific element found, maybe a general issue
                 console.warn("Form validation failed, but no specific invalid element found by querySelector(':invalid').");
             }
         }

        // Add custom validation logic here if needed (e.g., password match)

        return isValid;
    }


    // =========================================================================
    // API Service (Placeholder Functions)
    // =========================================================================
    const apiService = {
        /**
         * Generic fetch wrapper.
         * @param {string} endpoint - API endpoint (relative to API_BASE_URL).
         * @param {object} [options={}] - Fetch options (method, headers, body, etc.).
         * @returns {Promise<any>} - The JSON response data.
         * @throws {Error} - Throws an error if the fetch fails or response is not ok.
         */
        async request(endpoint, options = {}) {
            const url = `${API_BASE_URL}${endpoint}`;
            const defaultHeaders = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Add authorization headers if needed:
                // 'Authorization': `Bearer ${getAuthToken()}`
            };

            const config = {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers,
                },
            };

            // Stringify body if it's an object and method requires it
            if (config.body && typeof config.body === 'object' && (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH')) {
                config.body = JSON.stringify(config.body);
            }

            try {
                const response = await fetch(url, config);

                if (!response.ok) {
                    let errorData;
                    try {
                        // Try to parse error response from server
                        errorData = await response.json();
                    } catch (e) {
                        // If no JSON body, use status text
                        errorData = { message: response.statusText };
                    }
                    // Construct a meaningful error message
                    const errorMessage = errorData?.message || `Request failed with status ${response.status}`;
                    const error = new Error(errorMessage);
                    error.status = response.status;
                    error.data = errorData; // Attach full error data if available
                    console.error(`API Error (${response.status}): ${errorMessage}`, errorData);
                    throw error;
                }

                // Handle empty response body (e.g., 204 No Content)
                if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                    return null; // Or return an empty object/array as appropriate
                }

                return await response.json(); // Parse JSON response

            } catch (error) {
                console.error('API Request Failed:', error);
                // Re-throw the error so it can be caught by the caller
                // Or handle specific network errors differently here
                throw error;
            }
        },

        // --- Dashboard ---
        async getDashboardData() {
            console.log("API: Fetching dashboard data..."); // Keep console log for API calls
            // return await this.request('/dashboard'); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            return {
                kpis: {
                    revenueToday: 15500000, revenueChange: 0.12,
                    newOrders: 8, newOrdersStatus: 'pending',
                    newServices: 3, newServicesStatus: 'new',
                    lowStock: 5, lowStockStatus: 'low_stock'
                },
                charts: {
                    revenue: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [12, 19, 10, 25, 18, 30, 15.5].map(v => v * 1000000) },
                    orderStatus: { labels: ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'], data: [8, 15, 55, 5] },
                    topProducts: { labels: ['Laptop ABC', 'Phone XYZ', 'Mouse Pro', 'SSD 1TB', 'Keyboard G'], data: [50, 85, 120, 60, 90] }
                },
                recentOrders: [ { id: 'P999', customer: 'Nguyễn Văn A', total: 2500000 }, { id: 'P998', customer: 'Trần Thị B', total: 18990000 } ],
                recentServices: [ { id: 'S777', customer: 'Nguyễn Văn A', type: 'Sửa chữa' }, { id: 'S776', customer: 'Phạm Thị D', type: 'Tư vấn' } ],
                lowStockProducts: [ { id: 'GP-AC-01', name: 'Chuột GadgetPro Z1', stock: 2, image: 'https://via.placeholder.com/40x40/fdcb6e/2d3436?text=M' } ],
                activityLog: [ { user: 'Admin Demo', action: 'đã cập nhật trạng thái đơn hàng #P998', timestamp: '5 phút trước' } ]
            };
            // --- End Simulation ---
        },

        // --- Products ---
        async getProducts(params = {}) {
            const query = new URLSearchParams(params).toString();
            console.log(`API: Fetching products with params: ${query}`);
            // return await this.request(`/products?${query}`); // Example
             // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 700));
             // Simulate filtering/pagination based on params
             const allProducts = [
                { id: 'TB-LP-01', image: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=L', name: 'Laptop TechBrand Pro 14', sku: 'TB-LP-01', price: 32500000, stock: 15, status: 'published' },
                { id: 'NT-PH-01', image: 'https://via.placeholder.com/50x50/a29bfe/ffffff?text=P', name: 'NovaTech Phone X', sku: 'NT-PH-01', price: 18990000, stock: 3, status: 'published' },
                { id: 'GP-AC-01', image: 'https://via.placeholder.com/50x50/fdcb6e/2d3436?text=M', name: 'Chuột không dây GadgetPro Z1', sku: 'GP-AC-01', price: 950000, salePrice: 1100000, stock: 0, status: 'draft' },
                { id: 'ZS-MN-01', image: 'https://via.placeholder.com/50x50/d63031/ffffff?text=S', name: 'Màn hình ZyStore 27" QHD', sku: 'ZS-MN-01', price: 7200000, stock: 25, status: 'published' },
                // Add more dummy products for pagination/filtering demo
             ];
             // Basic filter simulation (by status for example)
             let filteredProducts = allProducts;
             if (params.status) {
                filteredProducts = allProducts.filter(p => p.status === params.status);
             }
             // Basic pagination simulation
             const page = parseInt(params.page) || 1;
             const limit = parseInt(params.limit) || 10;
             const startIndex = (page - 1) * limit;
             const endIndex = page * limit;
             const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

             return {
                 data: paginatedProducts,
                 pagination: {
                     totalItems: filteredProducts.length,
                     currentPage: page,
                     itemsPerPage: limit,
                     totalPages: Math.ceil(filteredProducts.length / limit)
                 }
             };
             // --- End Simulation ---
        },
        async getProductDetails(productId) {
            console.log(`API: Fetching product details for ID: ${productId}`);
            // return await this.request(`/products/${productId}`); // Example
            // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 400));
             if (productId === 'TB-LP-01') {
                 return {
                     id: 'TB-LP-01', name: 'Laptop TechBrand Pro 14', slug: 'laptop-techbrand-pro-14',
                     shortDescription: 'Laptop mạnh mẽ cho công việc.', description: '<p>Mô tả <strong>chi tiết</strong> về laptop.</p>',
                     categoryIds: ['laptops', 'components'], brand: 'TechBrand', status: 'published',
                     price: 32500000, salePrice: null, saleStartDate: null, saleEndDate: null,
                     manageStock: true, sku: 'TB-LP-01', stock: 15, lowStockThreshold: 5, allowBackorder: false,
                     featuredImage: 'https://via.placeholder.com/200x200/6c5ce7/ffffff?text=L',
                     galleryImages: ['https://via.placeholder.com/100x100/6c5ce7/ffffff?text=L1', 'https://via.placeholder.com/100x100/6c5ce7/ffffff?text=L2'],
                     variants: [], // Add variant data if needed
                     seoTitle: 'Laptop TechBrand Pro 14 Chính hãng | TechShop', seoDescription: 'Mua Laptop TechBrand Pro 14 giá tốt, cấu hình mạnh, bảo hành 12 tháng.'
                 };
             } else {
                 // Simulate not found or default for others
                 return {
                     id: productId, name: `Sản phẩm ${productId}`, slug: `san-pham-${productId}`,
                     shortDescription: '', description: '', categoryIds: [], brand: '', status: 'draft',
                     price: 999000, salePrice: null, saleStartDate: null, saleEndDate: null,
                     manageStock: true, sku: `SKU-${productId}`, stock: 8, lowStockThreshold: 5, allowBackorder: false,
                     featuredImage: null, galleryImages: [], variants: [], seoTitle: '', seoDescription: ''
                 }
             }
             // --- End Simulation ---
        },
        async saveProduct(productData) {
            const productId = productData.id; // Assuming ID exists for updates
            const method = productId ? 'PUT' : 'POST';
            const endpoint = productId ? `/products/${productId}` : '/products';
            console.log(`API: Saving product (ID: ${productId || 'New'}) with method ${method}`);
            // return await this.request(endpoint, { method: method, body: productData }); // Example
            // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 800));
             // Simulate potential validation errors from server
             if (productData.name === 'ErrorTest') {
                 const error = new Error("Validation Failed");
                 error.status = 422;
                 error.data = { message: "Validation Failed", errors: { name: ["Tên sản phẩm không hợp lệ."] } };
                 throw error;
             }
             const savedProduct = { ...productData, id: productId || `NEW-${Date.now()}` };
             console.log("Saved Product Data (Simulated):", savedProduct);
             return savedProduct;
             // --- End Simulation ---
        },
        async deleteProduct(productId) {
            console.log(`API: Deleting product ID: ${productId}`);
            // return await this.request(`/products/${productId}`, { method: 'DELETE' }); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 500));
            return { message: `Product ${productId} deleted successfully.` }; // Or null on 204
            // --- End Simulation ---
        },
        async applyProductBulkAction(action, productIds) {
            console.log(`API: Applying bulk action "${action}" to product IDs:`, productIds);
            // return await this.request('/products/bulk-actions', { method: 'POST', body: { action, productIds } }); // Example
            // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 600));
             return { message: `Action "${action}" applied to ${productIds.length} products.` };
             // --- End Simulation ---
        },

        // --- Orders ---
        async getOrders(params = {}) {
            const query = new URLSearchParams(params).toString();
            console.log(`API: Fetching orders with params: ${query}`);
            // return await this.request(`/orders?${query}`); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 600));
            const allOrders = [
                 { id: 'P999', customerId: 1, customerName: 'Nguyễn Văn A', date: '2023-12-25T10:30:00', total: 2500000, paymentStatus: 'pending', orderStatus: 'pending' },
                 { id: 'P998', customerId: 2, customerName: 'Trần Thị B', date: '2023-12-24T15:00:00', total: 18990000, paymentStatus: 'paid', paymentMethod: 'VNPAY', orderStatus: 'shipped' },
                 { id: 'P997', customerId: 3, customerName: 'Lê Văn C', date: '2023-12-24T09:10:00', total: 950000, paymentStatus: 'paid', paymentMethod: 'COD', orderStatus: 'completed' },
                 // Add more dummy orders
            ];
            // Simulate filters/pagination similar to products
             const page = parseInt(params.page) || 1;
             const limit = parseInt(params.limit) || 10;
             const startIndex = (page - 1) * limit;
             const endIndex = page * limit;
             const paginatedOrders = allOrders.slice(startIndex, endIndex);
             return {
                 data: paginatedOrders,
                 pagination: { totalItems: allOrders.length, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(allOrders.length / limit) }
             };
            // --- End Simulation ---
        },
        async getOrderDetail(orderId) {
             console.log(`API: Fetching order details for ID: ${orderId}`);
            // return await this.request(`/orders/${orderId}`); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 450));
            // Find the order or return a default mock
            const order = (await this.getOrders()).data.find(o => o.id === orderId) || { id: orderId, customerId: '?', customerName: 'Khách Hàng Demo', date: new Date().toISOString(), total: 100000, paymentStatus: 'pending', orderStatus: 'pending' };
            return {
                ...order,
                customer: { id: order.customerId, name: order.customerName, email: `demo${order.customerId}@email.com`, phone: `090xxxx${order.customerId}` },
                items: [ { productId: 'PROD1', name: 'Sản phẩm mẫu 1', quantity: 1, price: 50000 }, { productId: 'PROD2', name: 'Sản phẩm mẫu 2', quantity: 1, price: 50000 } ],
                shippingAddress: { street: '123 Đường ABC', city: 'TP. HCM', country: 'VN' },
                shippingMethod: 'Giao hàng tiêu chuẩn',
                subtotal: 100000, shippingCost: 0, grandTotal: order.total,
                customerNote: 'Giao hàng giờ hành chính.',
                internalNotes: [{ user: 'Admin', note: 'Đã xác nhận thông tin.', timestamp: '2023-12-25T11:00:00' }],
                history: [ { status: 'pending', timestamp: order.date }, { status: order.orderStatus, timestamp: new Date().toISOString() } ],
                trackingCode: order.orderStatus === 'shipped' ? 'VN123456789' : null
            };
             // --- End Simulation ---
        },
        async updateOrderStatus(orderId, status) {
            console.log(`API: Updating order ${orderId} status to ${status}`);
            // return await this.request(`/orders/${orderId}/status`, { method: 'PUT', body: { status } }); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 300));
            return { message: `Order ${orderId} status updated to ${status}.` };
            // --- End Simulation ---
        },
         async saveOrderDetail(orderId, data) {
            console.log(`API: Saving order details for ${orderId}`);
            // return await this.request(`/orders/${orderId}`, { method: 'PUT', body: data }); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 700));
            return { message: `Order ${orderId} details saved.` };
            // --- End Simulation ---
        },
        async applyOrderBulkAction(action, orderIds) {
            console.log(`API: Applying bulk action "${action}" to order IDs:`, orderIds);
            // return await this.request('/orders/bulk-actions', { method: 'POST', body: { action, orderIds } }); // Example
            // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 600));
             return { message: `Action "${action}" applied to ${orderIds.length} orders.` };
             // --- End Simulation ---
        },

        // --- Services ---
        async getServices(params = {}) {
            const query = new URLSearchParams(params).toString();
            console.log(`API: Fetching services with params: ${query}`);
            // return await this.request(`/services?${query}`); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 550));
            const allServices = [
                { id: 'S777', customerId: 1, customerName: 'Nguyễn Văn A', type: 'Sửa chữa', subject: 'Laptop không lên nguồn', date: '2023-12-25T10:15:00', status: 'new', assignee: null },
                { id: 'S776', customerId: 4, customerName: 'Phạm Thị D', type: 'Tư vấn', subject: 'Tư vấn cấu hình PC Gaming', date: '2023-12-24T09:00:00', status: 'processing', assignee: 'Admin Demo' },
                { id: 'S775', customerId: 5, customerName: 'Hoàng Văn E', type: 'Lắp đặt', subject: 'Lắp đặt mạng LAN văn phòng', date: '2023-12-23T14:30:00', status: 'completed', assignee: 'Nhân viên A' },
            ];
            // Simulate filters/pagination
             const page = parseInt(params.page) || 1;
             const limit = parseInt(params.limit) || 10;
             const startIndex = (page - 1) * limit;
             const endIndex = page * limit;
             const paginatedServices = allServices.slice(startIndex, endIndex);
             return {
                 data: paginatedServices,
                 pagination: { totalItems: allServices.length, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(allServices.length / limit) }
             };
            // --- End Simulation ---
        },
        async getServiceDetail(serviceId) {
             console.log(`API: Fetching service details for ID: ${serviceId}`);
            // return await this.request(`/services/${serviceId}`); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 400));
             const service = (await this.getServices()).data.find(s => s.id === serviceId) || { id: serviceId, customerId: '?', customerName: 'Khách Hàng Demo', type: 'Khác', subject: 'Yêu cầu mẫu', date: new Date().toISOString(), status: 'new', assignee: null };
             return {
                ...service,
                customer: { id: service.customerId, name: service.customerName, email: `demo${service.customerId}@email.com` },
                description: 'Mô tả chi tiết yêu cầu dịch vụ của khách hàng...',
                attachments: [], // Example: [{ name: 'error_screenshot.png', url: '/path/to/file' }]
                notes: [ { user: 'Admin', note: 'Đã tiếp nhận.', timestamp: new Date().toISOString() } ]
            };
            // --- End Simulation ---
        },
         async updateService(serviceId, data) {
             console.log(`API: Updating service ${serviceId} with data:`, data);
            // return await this.request(`/services/${serviceId}`, { method: 'PUT', body: data }); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 500));
             return { message: `Service ${serviceId} updated successfully.` };
             // --- End Simulation ---
         },

        // --- Customers ---
        async getCustomers(params = {}) {
            const query = new URLSearchParams(params).toString();
            console.log(`API: Fetching customers with params: ${query}`);
            // return await this.request(`/customers?${query}`); // Example
            // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 650));
             const allCustomers = [
                { id: 1, name: 'Nguyễn Văn A', email: 'a.nguyen@email.com', phone: '090xxxx123', registeredDate: '2023-10-15', orderCount: 5, totalSpent: 12500000 },
                { id: 2, name: 'Trần Thị B', email: 'b.tran@email.com', phone: '091xxxx456', registeredDate: '2023-11-01', orderCount: 1, totalSpent: 18990000 },
                { id: 3, name: 'Lê Văn C', email: 'c.le@email.com', phone: '098xxxx789', registeredDate: '2023-11-20', orderCount: 2, totalSpent: 1900000 },
             ];
            // Simulate filters/pagination
             const page = parseInt(params.page) || 1;
             const limit = parseInt(params.limit) || 10;
             const startIndex = (page - 1) * limit;
             const endIndex = page * limit;
             const paginatedCustomers = allCustomers.slice(startIndex, endIndex);
             return {
                 data: paginatedCustomers,
                 pagination: { totalItems: allCustomers.length, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(allCustomers.length / limit) }
             };
            // --- End Simulation ---
        },
        async getCustomerDetail(customerId) {
            console.log(`API: Fetching customer details for ID: ${customerId}`);
            // return await this.request(`/customers/${customerId}`); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 500));
            const customer = (await this.getCustomers()).data.find(c => c.id == customerId) || { id: customerId, name: `Khách hàng Demo ${customerId}`, email: `demo${customerId}@email.com`, phone: `090xxxx${customerId}`, registeredDate: new Date().toISOString(), orderCount: 0, totalSpent: 0 };
            return {
                ...customer,
                addresses: [
                    { id: 1, street: '123 Đường ABC', city: 'TP. HCM', country: 'VN', isDefaultBilling: true, isDefaultShipping: true },
                    { id: 2, street: '456 Đường XYZ', city: 'Hà Nội', country: 'VN', isDefaultBilling: false, isDefaultShipping: false }
                ],
                orderHistory: (await this.getOrders()).data.filter(o => o.customerId == customerId),
                serviceHistory: (await this.getServices()).data.filter(s => s.customerId == customerId),
                adminNotes: [ { user: 'Admin Demo', note: 'Khách hàng tiềm năng.', timestamp: '2023-11-01' } ]
            };
            // --- End Simulation ---
        },
         async deleteCustomer(customerId) {
            console.log(`API: Deleting customer ID: ${customerId}`);
            // return await this.request(`/customers/${customerId}`, { method: 'DELETE' }); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 500));
            return { message: `Customer ${customerId} deleted successfully.` };
            // --- End Simulation ---
        },
        async saveCustomerDetail(customerId, data) {
            console.log(`API: Saving customer detail ${customerId}`);
            // return await this.request(`/customers/${customerId}`, { method: 'PUT', body: data });
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 600));
            return { message: `Customer ${customerId} detail saved.` };
            // --- End Simulation ---
        },

        // --- Settings ---
        async getSettings(tabName) {
            console.log(`API: Fetching settings for tab: ${tabName}`);
            // return await this.request(`/settings/${tabName}`); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 300));
            switch(tabName) {
                case 'general': return { storeName: 'TechShop', storeAddress: '123 ABC...', storeEmail: 'support@techshop.example', storePhone: '19001234', storeLogo: 'https://via.placeholder.com/150x50/a29bfe/ffffff?text=TechShopLogo' };
                case 'payments': return { codEnabled: true, bankTransferEnabled: true, vnpayEnabled: false, /* ...other payment settings */ };
                // Add other tabs
                default: return {};
            }
            // --- End Simulation ---
        },
        async saveSettings(tabName, settingsData) {
            console.log(`API: Saving settings for tab "${tabName}"`);
            // return await this.request(`/settings/${tabName}`, { method: 'POST', body: settingsData }); // Example
            // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 700));
             // Simulate validation error
             if (tabName === 'general' && settingsData.storeName === '') {
                 const error = new Error("Validation Failed");
                 error.status = 422;
                 error.data = { message: "Validation Failed", errors: { storeName: ["Tên cửa hàng không được để trống."] } };
                 throw error;
             }
             return { message: `Settings for ${tabName} saved successfully.` };
             // --- End Simulation ---
        },

        // --- Notifications ---
        async getNotifications() {
            console.log("API: Fetching notifications...");
            // return await this.request('/notifications'); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 200));
            return [
                { id: 'n1', message: 'Đơn hàng mới #P999 cần xử lý.', timestamp: '10:30 AM', read: false, link: { type: 'order', id: 'P999' } },
                { id: 'n2', message: 'Yêu cầu dịch vụ #S777 mới.', timestamp: '10:15 AM', read: false, link: { type: 'service', id: 'S777' } },
                { id: 'n3', message: 'Sản phẩm \'Laptop X\' sắp hết hàng (còn 2).', timestamp: '09:00 AM', read: true, link: { type: 'product', id: 'TB-LP-01' } }, // Example: read=true
                { id: 'n4', message: 'Cập nhật thành công cài đặt thanh toán.', timestamp: 'Hôm qua', read: true, link: null },
            ];
            // --- End Simulation ---
        },
        async markNotificationRead(notificationId) {
            console.log(`API: Marking notification ${notificationId} as read.`);
            // return await this.request(`/notifications/${notificationId}/read`, { method: 'POST' }); // Example
             // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 100));
             return { success: true };
             // --- End Simulation ---
        },
        async markAllNotificationsRead() {
            console.log("API: Marking all notifications as read.");
            // return await this.request('/notifications/read-all', { method: 'POST' }); // Example
             // --- Simulation ---
             await new Promise(resolve => setTimeout(resolve, 300));
             return { success: true };
             // --- End Simulation ---
        },

        // --- Auth ---
        async logout() {
            console.log("API: Logging out.");
            // return await this.request('/auth/logout', { method: 'POST' }); // Example
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 400));
            return { message: "Logout successful." };
            // --- End Simulation ---
        }
    };

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
            const isCollapsed = sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
            document.body.classList.toggle('admin-sidebar-collapsed', isCollapsed); // Add body class too

            // Resize charts after the transition completes
            setTimeout(() => {
                resizeAllCharts();
            }, 350); // Match CSS transition duration
        }
    }

    /** Toggles the body overlay for mobile sidebar. */
    function toggleMobileSidebarOverlay(isActive) {
        if (window.innerWidth <= 992) {
            document.body.classList.toggle('sidebar-open-overlay', isActive);
            document.body.classList.toggle('sidebar-active', isActive);
        }
    }

    /** Toggles header dropdown panels (Notifications, User Menu). */
    function toggleDropdown(panel, button) {
        if (!panel || !button) return;
        const isActive = panel.classList.contains('active');
        closeAllDropdowns(); // Close others first
        if (!isActive) {
            panel.classList.add('active');
            button.classList.add('active'); // Add active class to button too
            panel.style.visibility = 'visible'; // Ensure visibility is set before animation
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
            // Fetch notifications when panel opens
            if(panel === notificationPanel) {
                loadNotifications();
            }
        }
    }

    /** Closes all active header dropdowns. */
    function closeAllDropdowns() {
        document.querySelectorAll('.notification-panel.active, .user-dropdown.active').forEach(panel => {
            panel.classList.remove('active');
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(10px)';
            // Reset visibility after transition (match transition duration)
            setTimeout(() => { panel.style.visibility = 'hidden'; }, 300);
        });
         document.querySelectorAll('#adminNotificationBell.active, #adminUserMenuToggle.active').forEach(button => {
            button.classList.remove('active');
        });
    }

    /**
     * Activates the specified admin section, updates UI, and fetches data.
     * @param {string} sectionId - The ID of the section to activate (e.g., 'dashboard', 'products').
     * @param {object} [params={}] - Optional parameters for data fetching (e.g., filters, page).
     */
    async function setActiveSection(sectionId, params = {}) {
        if (!sectionId || (activeAdminSectionId === sectionId && !Object.keys(params).length)) {
            // console.log(`Section ${sectionId} already active or no change needed.`);
            return; // No change if already active or no new params
        }
        if (isLoading) {
            showToast("Please wait, previous action is still processing.", "warning");
            return;
        }

        console.log(`Switching to section: ${sectionId} with params:`, params);
        isLoading = true;
        const previousSectionId = activeAdminSectionId;
        activeAdminSectionId = sectionId;

        const targetSectionElement = document.getElementById(`${sectionId}-section`);
        if (!targetSectionElement) {
             console.error(`Section element not found for ID: ${sectionId}-section`);
             isLoading = false;
             return;
        }

        showLoading(targetSectionElement); // Show loading specific to the section

        // Update Sidebar Links
        sidebarLinks.forEach(link => link.classList.toggle('active', link.dataset.section === sectionId));

        // Deactivate previous section first
        if (previousSectionId) {
            const previousSectionElement = document.getElementById(`${previousSectionId}-section`);
            previousSectionElement?.classList.remove('active');
            hideAllDetailViews(previousSectionId); // Hide details specific to the previous section
        } else {
            // Hide all initially if no previous section
             adminSections.forEach(section => section.classList.remove('active'));
        }

        // Activate new section
        targetSectionElement.classList.add('active');


        // Close mobile sidebar if open
        if (window.innerWidth <= 992 && sidebar?.classList.contains('active')) {
            sidebar.classList.remove('active');
            toggleMobileSidebarOverlay(false);
        }

        // Scroll to top
        mainContent?.scrollTo(0, 0);

        // Destroy charts from previous section (if applicable) before loading new ones
        if (previousSectionId && (previousSectionId === 'dashboard' || previousSectionId === 'reports')) {
            destroyCharts();
        }

        try {
            // Fetch and Render Data based on Section
            switch (sectionId) {
                case 'dashboard':
                    await loadDashboardData();
                    break;
                case 'products':
                    await loadProductListData(params);
                    // Reset form state if navigating to product list view
                    hideElement(productFormContainer);
                    restoreListView('products');
                    break;
                case 'orders':
                    await loadOrderListData(params);
                    hideElement(orderDetailView);
                    restoreListView('orders');
                    break;
                case 'services':
                     await loadServiceListData(params);
                     hideElement(serviceDetailView);
                     restoreListView('services');
                    break;
                 case 'customers':
                     await loadCustomerListData(params);
                     hideElement(customerDetailView);
                     restoreListView('customers');
                    break;
                 case 'reports':
                     await loadReportData(params); // Pass params if reports allow filtering
                     break;
                case 'content':
                case 'settings':
                case 'admins':
                     // Load settings/content data if needed, setup tabs
                     await loadSettingsOrContentData(sectionId, params);
                     setupSectionTabs(sectionId);
                     break;
                default:
                    console.warn(`No specific load function defined for section: ${sectionId}`);
            }

            // Restore list view elements (might be redundant but safe)
            restoreListView(sectionId);
             // Setup tabs if they exist in the newly activated section (moved here after data load)
             setupSectionTabs(sectionId);

        } catch (error) {
            showToast(`Error loading section ${sectionId}: ${error.message}`, 'error');
            displayEmptyState(targetSectionElement, `Could not load data for ${sectionId}. Please try again.`);
        } finally {
            hideLoading(targetSectionElement);
            isLoading = false;
        }
    }

    /** Sets up tabs for the currently active section. */
    function setupSectionTabs(sectionId) {
        let tabs, contents;
        switch(sectionId) {
            case 'content':
                tabs = contentTabs;
                contents = contentTabContents;
                break;
            case 'settings':
                tabs = settingsTabs;
                contents = settingsTabContents;
                break;
            // Product form and Customer detail tabs are handled when shown/populated
            default:
                return; // No tabs for this section or handled elsewhere
        }
        setupTabs(tabs, contents);
    }

     /**
      * Generic tab setup logic.
      * @param {NodeListOf<Element>} tabLinks - The tab link elements.
      * @param {NodeListOf<Element>} tabContents - The corresponding tab content elements.
      * @param {string} [contentScopeSelector=null] - Optional: A selector relative to the tab link's parentElement to find content panes. If null, uses direct children '.tab-content'.
      */
     function setupTabs(tabLinks, tabContents, contentScopeSelector = null) {
        if (!tabLinks || tabLinks.length === 0) {
            // console.log("Skipping tab setup: No links found.");
            return;
        }
        // Fallback if tabContents is not provided directly
        if (!tabContents || tabContents.length === 0) {
             const firstLinkParent = tabLinks[0]?.closest('.tabs')?.parentElement;
             if(firstLinkParent) {
                 tabContents = firstLinkParent.querySelectorAll(contentScopeSelector || ':scope > .tab-content');
             }
             if(!tabContents || tabContents.length === 0){
                // console.log("Skipping tab setup: No content panes found.");
                return;
             }
        }

        tabLinks.forEach(link => {
            link.removeEventListener('click', handleTabClick); // Prevent multiple listeners
            link.addEventListener('click', handleTabClick);
        });

        // Activate the first tab if none are explicitly active
        const activeLink = Array.from(tabLinks).find(l => l.classList.contains('active'));
        if (!activeLink && tabLinks.length > 0) {
            // console.log("Activating first tab by default");
            activateTab(tabLinks[0], tabContents); // Activate directly
        } else if (activeLink) {
            // Ensure corresponding content is shown if a link is already active
            activateTab(activeLink, tabContents);
        }
    }

     /**
      * Handles clicks on tab links.
      * @param {Event} event - The click event.
      */
     function handleTabClick(event) {
        event.preventDefault();
        const clickedLink = event.currentTarget;
        const parentNav = clickedLink.closest('.tabs');
        if (!parentNav) return;

        const siblingLinks = parentNav.querySelectorAll('.tab-link');
         // Find content panes relative to the tab navigation's parent
         const contentContainer = parentNav.parentElement;
         const siblingContents = contentContainer.querySelectorAll(':scope > .tab-content'); // Assume direct children

        activateTab(clickedLink, siblingContents, siblingLinks);
    }

    /**
     * Activates a specific tab and its content panel.
     * @param {Element} linkToActivate - The tab link element to activate.
     * @param {NodeListOf<Element>} contentPanels - All content panels associated with the tabs.
     * @param {NodeListOf<Element>} [tabLinks=null] - All tab links (optional, inferred if null).
     */
    function activateTab(linkToActivate, contentPanels, tabLinks = null) {
        const tabId = linkToActivate.dataset.tab;
        if (!tabId) {
             console.warn("Tab link missing 'data-tab' attribute.");
             return;
        }

        if (!tabLinks) {
            const parentNav = linkToActivate.closest('.tabs');
            if (!parentNav) return;
            tabLinks = parentNav.querySelectorAll('.tab-link');
        }

        // Deactivate all other links and content panels
        tabLinks.forEach(l => l.classList.remove('active'));
        contentPanels.forEach(c => c.classList.remove('active'));

        // Activate the clicked link and corresponding content
        linkToActivate.classList.add('active');
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        } else {
            console.warn(`Tab content with id "${tabId}" not found.`);
        }
    }

    /** Hides all detail/form views and optionally restores the list view for a section. */
    function hideAllDetailViews(sectionIdToRestoreList = null) {
        hideElement(productFormContainer);
        hideElement(orderDetailView);
        hideElement(serviceDetailView);
        hideElement(customerDetailView);

        if (sectionIdToRestoreList && sectionIdToRestoreList === activeAdminSectionId) {
             restoreListView(sectionIdToRestoreList);
        }
    }

    /** Restores the list view elements (table, pagination, filters) for a given section. */
    function restoreListView(sectionId) {
         // Only restore if the specified section is currently active
         if (sectionId !== activeAdminSectionId) return;

        console.log(`Restoring list view for section: ${sectionId}`);
        switch(sectionId) {
            case 'products':
                showElement(productListView, 'block');
                showElement(productPagination, 'block');
                flexElement(productFilters);
                flexElement(productBulkActions);
                 // Ensure form is hidden
                hideElement(productFormContainer);
                break;
            case 'orders':
                showElement(orderListView, 'block');
                showElement(orderPagination, 'block');
                flexElement(orderFilters);
                flexElement(orderBulkActions);
                hideElement(orderDetailView);
                break;
            case 'services':
                showElement(servicesSection?.querySelector('.table-responsive'), 'block');
                showElement(servicePagination, 'block');
                flexElement(serviceFilters);
                hideElement(serviceDetailView);
                break;
            case 'customers':
                showElement(customersSection?.querySelector('.table-responsive'), 'block');
                showElement(customerPagination, 'block');
                flexElement(customerFilters);
                hideElement(customerDetailView);
                break;
            // Add cases for other sections if they have list/detail views
        }
    }

    // =========================================================================
    // Charting Functions
    // =========================================================================

    /** Destroys all existing Chart.js instances. */
    function destroyCharts() {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        charts = {};
        // console.log("Charts destroyed.");
    }

    /** Resizes all active Chart.js instances. */
    function resizeAllCharts() {
        Object.values(charts).forEach(chart => {
             if (chart && typeof chart.resize === 'function') {
                chart.resize();
             }
        });
        // console.log("Charts resized.");
    }

    /**
     * Initializes charts for a specific section using provided data.
     * @param {string} sectionId - 'dashboard' or 'reports'.
     * @param {object} chartData - Data fetched from the API.
     */
    function initChartsForSection(sectionId, chartData) {
        destroyCharts(); // Clear existing charts first
        console.log(`Initializing charts for section: ${sectionId}`);

        const commonOptions = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: 'rgba(245, 246, 250, 0.8)', padding: 15 }, // Adjusted padding
                    position: 'bottom', // Better position for responsiveness
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 4,
                }
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(245, 246, 250, 0.7)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false } // Hide axis border
                },
                y: {
                    ticks: { color: 'rgba(245, 246, 250, 0.7)', beginAtZero: true },
                    grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false } // Hide axis border
                }
            },
             animation: {
                duration: 800, // Add subtle animation
                easing: 'easeInOutQuart'
            }
        };

        // Specific options for different chart types
        const lineOptions = { ...commonOptions };
        const barOptions = { ...commonOptions };
        const doughnutOptions = {
            ...commonOptions,
            scales: {}, // Doughnut charts don't need scales
             cutout: '60%', // Make doughnut thinner
        };

        try {
            if (sectionId === 'dashboard' && chartData?.dashboard?.charts) {
                const data = chartData.dashboard.charts;
                if (revenueChartCtx && data.revenue) {
                    charts.revenue = new Chart(revenueChartCtx, {
                        type: 'line',
                        data: { labels: data.revenue.labels, datasets: [{ label: 'Doanh thu', data: data.revenue.data, borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#6c5ce7', pointHoverRadius: 6 }] },
                        options: lineOptions
                    });
                }
                if (orderStatusChartCtx && data.orderStatus) {
                    charts.orderStatus = new Chart(orderStatusChartCtx, {
                        type: 'doughnut',
                        data: { labels: data.orderStatus.labels, datasets: [{ data: data.orderStatus.data, backgroundColor: ['#fdcb6e', '#0984e3', '#00b894', '#d63031'], hoverOffset: 8, borderColor: '#3b4446', borderWidth: 2 }] }, // Added border
                        options: doughnutOptions
                    });
                }
                if (topProductsChartCtx && data.topProducts) {
                    charts.topProducts = new Chart(topProductsChartCtx, {
                        type: 'bar',
                        data: { labels: data.topProducts.labels, datasets: [{ label: 'Số lượng bán', data: data.topProducts.data, backgroundColor: 'rgba(162, 155, 254, 0.7)', borderColor: '#a29bfe', borderWidth: 1, borderRadius: 4 }] }, // Rounded bars
                        options: barOptions
                    });
                }
            } else if (sectionId === 'reports' && chartData?.reports?.charts) {
                const data = chartData.reports.charts; // Assuming reports have a similar structure
                 // Example: Use different data or chart types for reports
                if (reportRevenueChartCtx && data.reportRevenue) { // Assuming different data keys for reports
                    charts.reportRevenue = new Chart(reportRevenueChartCtx, {
                        type: 'line',
                        data: { labels: data.reportRevenue.labels, datasets: [{ label: 'Doanh thu tháng', data: data.reportRevenue.data, borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.1 }] },
                        options: lineOptions
                    });
                }
                if (reportTopProductsChartCtx && data.reportProducts) {
                     charts.reportTopProducts = new Chart(reportTopProductsChartCtx, {
                        type: 'bar',
                        data: { labels: data.reportProducts.labels, datasets: [{ label: 'Doanh thu SP', data: data.reportProducts.data, backgroundColor: 'rgba(162, 155, 254, 0.7)', borderColor: '#a29bfe', borderWidth: 1 }] },
                        options: barOptions
                    });
                 }
                 // Add more report charts as needed
            }
            // Resize after a short delay to ensure container dimensions are stable
            setTimeout(resizeAllCharts, 100);
        } catch (error) {
            console.error("Error initializing charts:", error);
            showToast("Could not load charts.", "error");
        }
    }

    // =========================================================================
    // Data Loading and Rendering Functions
    // =========================================================================

    async function loadDashboardData() {
        try {
            const data = await apiService.getDashboardData();

            // Update KPIs (replace placeholders in HTML or update dynamically)
            // Example: document.getElementById('kpiRevenueToday').textContent = formatAdminCurrency(data.kpis.revenueToday);
            // ... update other KPIs ...

             // Render Quick Lists
             renderQuickList(dashboardSection?.querySelector('.quick-list:has(.btn-view-order)'), data.recentOrders, renderRecentOrderItem);
             renderQuickList(dashboardSection?.querySelector('.quick-list:has(.btn-view-service)'), data.recentServices, renderRecentServiceItem);
             renderQuickList(dashboardSection?.querySelector('.quick-list.product-list'), data.lowStockProducts, renderLowStockProductItem);
             renderQuickList(dashboardSection?.querySelector('.activity-log'), data.activityLog, renderActivityLogItem);


            // Init charts with fetched data
            initChartsForSection('dashboard', { dashboard: data }); // Pass nested data

        } catch (error) {
            showToast(`Error loading dashboard data: ${error.message}`, 'error');
            // Display error message in the dashboard section
            displayEmptyState(dashboardSection, 'Could not load dashboard data. Please refresh.', 1);
        }
    }

    async function loadProductListData(params = {}) {
        const container = productListView;
        const tableBody = productTableBody;
        if (!container || !tableBody) return;
        showLoading(container);
        try {
            const response = await apiService.getProducts(params);
            renderProductTable(response.data);
            renderPagination(productPagination, response.pagination, 'products', params);
            // Re-initialize table selection logic
            handleTableSelection(selectAllProductsCheckbox, '.product-checkbox', productsSection);
             // Update bulk action state (disable button initially)
            if (applyProductBulkActionBtn) applyProductBulkActionBtn.disabled = true;
            if (selectAllProductsCheckbox) selectAllProductsCheckbox.checked = false;
            if (selectAllProductsCheckbox) selectAllProductsCheckbox.indeterminate = false;

        } catch (error) {
            showToast(`Error loading products: ${error.message}`, 'error');
            displayEmptyState(tableBody, 'Could not load products.', 8); // 8 columns in product table
        } finally {
            hideLoading(container);
        }
    }

    async function loadOrderListData(params = {}) {
        const container = orderListView;
        const tableBody = orderTableBody;
         if (!container || !tableBody) return;
         showLoading(container);
        try {
            const response = await apiService.getOrders(params);
            renderOrderTable(response.data);
            renderPagination(orderPagination, response.pagination, 'orders', params);
            handleTableSelection(selectAllOrdersCheckbox, '.order-checkbox', ordersSection);
             // Update bulk action state
            if (applyOrderBulkActionBtn) applyOrderBulkActionBtn.disabled = true;
            if (selectAllOrdersCheckbox) selectAllOrdersCheckbox.checked = false;
            if (selectAllOrdersCheckbox) selectAllOrdersCheckbox.indeterminate = false;

        } catch (error) {
            showToast(`Error loading orders: ${error.message}`, 'error');
            displayEmptyState(tableBody, 'Could not load orders.', 8); // 8 columns
        } finally {
             hideLoading(container);
        }
    }

    async function loadServiceListData(params = {}) {
        const container = servicesSection?.querySelector('.table-responsive');
        const tableBody = serviceTableBody;
        if (!container || !tableBody) return;
        showLoading(container);
        try {
            const response = await apiService.getServices(params);
            renderServiceTable(response.data);
            renderPagination(servicePagination, response.pagination, 'services', params);
            // No bulk actions/selection for services in this example yet
        } catch (error) {
            showToast(`Error loading services: ${error.message}`, 'error');
            displayEmptyState(tableBody, 'Could not load service requests.', 8); // 8 columns
        } finally {
            hideLoading(container);
        }
    }

     async function loadCustomerListData(params = {}) {
        const container = customersSection?.querySelector('.table-responsive');
        const tableBody = customerTableBody;
        if (!container || !tableBody) return;
        showLoading(container);
        try {
            const response = await apiService.getCustomers(params);
            renderCustomerTable(response.data);
            renderPagination(customerPagination, response.pagination, 'customers', params);
             // No bulk actions/selection for customers
        } catch (error) {
            showToast(`Error loading customers: ${error.message}`, 'error');
            displayEmptyState(tableBody, 'Could not load customers.', 7); // 7 columns
        } finally {
            hideLoading(container);
        }
    }

    async function loadReportData(params = {}) {
        const container = reportsSection; // Assuming reportsSection is the main container
        if(!container) return;
        showLoading(container);
        try {
            // TODO: Define API call for report data
            // const reportData = await apiService.getReportData(params);
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 600));
            const reportData = {
                 charts: {
                    reportRevenue: { labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4'], data: [50, 75, 60, 90].map(v => v * 1000000) },
                    reportProducts: { labels: ['Laptop ABC', 'Phone XYZ', 'Mouse Pro'], data: [300, 250, 150].map(v => v * 100000) }
                 },
                 summary: {
                    lowStockCount: 5, outOfStockCount: 2, totalInventoryValue: 150000000,
                    newCustomers: 50, returningCustomerRate: 0.25,
                    totalServices: 15, avgServiceTime: 9000 // seconds (2.5 hours)
                 }
             };
             // --- End Simulation ---

            // Render report summaries (replace placeholders or update elements)
            // e.g., container.querySelector('#reportLowStockCount').textContent = reportData.summary.lowStockCount;

            // Initialize charts for reports
            initChartsForSection('reports', { reports: reportData });

        } catch (error) {
            showToast(`Error loading reports: ${error.message}`, 'error');
            displayEmptyState(container, 'Could not load report data.', 1);
        } finally {
             hideLoading(container);
        }
    }

     async function loadSettingsOrContentData(sectionId, params = {}) {
         // Placeholder for loading data specific to Settings or Content tabs if needed
         console.log(`Loading data for ${sectionId} - further implementation needed.`);
         // Example: Fetch general settings data when settings tab is active
         if (sectionId === 'settings') {
             const activeTabLink = settingsTabs?.querySelector('.tab-link.active');
             const activeTabId = activeTabLink?.dataset.tab || 'settings-general'; // Default to general
             await loadSettingsTabData(activeTabId.replace('settings-', ''));
         }
         // Similarly for content tabs
    }

     async function loadSettingsTabData(tabName) {
         const form = document.getElementById(`${tabName}SettingsForm`); // Assuming form IDs follow a pattern
         if (!form && tabName !== 'payments' && tabName !== 'shipping' && tabName !== 'emails' && tabName !== 'seo') { // Handle tabs without forms differently
             console.log(`No form found for settings tab: ${tabName}`);
             return;
         }

         // Special handling for tabs without a single form (e.g., payments, shipping, emails)
         if (tabName === 'payments' || tabName === 'shipping' || tabName === 'emails') {
              console.log(`Loading complex settings for ${tabName} tab...`);
              // TODO: Fetch and populate individual components within these tabs
              // Example for VNPAY toggle based on fetched data:
              // const paymentSettings = await apiService.getSettings('payments');
              // if(vnpayEnabledCheckbox) vnpayEnabledCheckbox.checked = paymentSettings.vnpayEnabled;
              // handleVnpayToggle(); // Update UI based on fetched state
              return;
         }

         // Handle tabs with forms
         const container = document.getElementById(`settings-${tabName}`);
         if(!container) return;
         showLoading(container);
         try {
             const settings = await apiService.getSettings(tabName);
             // Populate the form
             for (const key in settings) {
                 const input = form.querySelector(`[name="${key}"], #${key}`);
                 if (input) {
                     if (input.type === 'checkbox') {
                         input.checked = settings[key];
                     } else if (input.tagName === 'TEXTAREA') {
                         input.value = settings[key];
                         // TODO: Update WYSIWYG editor content if applicable
                     } else {
                         input.value = settings[key];
                     }
                 } else if (key === 'storeLogo' && settings[key]) {
                     // Handle logo preview update
                     const previewContainer = form.querySelector('.image-preview-container');
                     if (previewContainer) {
                         previewContainer.innerHTML = `<img src="${settings[key]}" alt="Current Logo" style="max-height: 50px; width:auto;">`;
                     }
                 }
             }
         } catch (error) {
             showToast(`Error loading ${tabName} settings: ${error.message}`, 'error');
         } finally {
             hideLoading(container);
         }
     }


    // --- Rendering Helpers ---

     /** Renders rows for the product table. */
     function renderProductTable(products) {
        if (!productTableBody) return;
        if (!products || products.length === 0) {
            displayEmptyState(productTableBody, 'No products found matching your criteria.', 8);
            return;
        }
        productTableBody.innerHTML = products.map(product => `
            <tr data-product-row-id="${product.id}">
                <td><input type="checkbox" class="product-checkbox" value="${product.id}" aria-label="Select product ${product.name || product.id}"></td>
                <td><img src="${product.image || 'https://via.placeholder.com/50x50/cccccc/ffffff?text=N/A'}" alt="${product.name || 'Product Image'}"></td>
                <td><a href="#" class="link-edit-product" data-product-id="${product.id}">${product.name || 'N/A'}</a></td>
                <td>${product.sku || 'N/A'}</td>
                <td>
                     ${product.salePrice && product.salePrice < product.price ?
                        `${formatAdminCurrency(product.salePrice)} <span class="old-price-inline">${formatAdminCurrency(product.price)}</span>` :
                        formatAdminCurrency(product.price || 0)
                     }
                </td>
                <td class="${product.stock <= 0 ? 'stock-out' : (product.stock <= (product.lowStockThreshold || 5) ? 'stock-low' : '')}">
                    ${product.manageStock === false ? '-' : (product.stock ?? 'N/A')}
                 </td>
                <td><span class="status status-${product.status || 'draft'}">${getProductStatusText(product.status)}</span></td>
                <td>
                    <button class="btn-icon btn-edit-product" title="Sửa" data-product-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete-product" title="Xóa" data-product-id="${product.id}" data-product-name="${product.name || product.id}"><i class="fas fa-trash-alt"></i></button>
                    <a href="/product/${product.slug || product.id}" target="_blank" class="btn-icon" title="Xem trên web"><i class="fas fa-eye"></i></a>
                    <button class="btn-icon" title="Nhân bản" data-product-id="${product.id}"><i class="fas fa-copy"></i></button>
                </td>
            </tr>
        `).join('');
    }

    /** Renders rows for the order table. */
    function renderOrderTable(orders) {
         if (!orderTableBody) return;
         if (!orders || orders.length === 0) {
            displayEmptyState(orderTableBody, 'No orders found matching your criteria.', 8);
            return;
         }
         orderTableBody.innerHTML = orders.map(order => `
            <tr class="${order.orderStatus === 'pending' ? 'order-new' : ''}" data-order-row-id="${order.id}">
                <td><input type="checkbox" class="order-checkbox" value="${order.id}" aria-label="Select order ${order.id}"></td>
                <td><a href="#" class="link-view-order" data-order-id="${order.id}">#${order.id}</a></td>
                <td><a href="#" class="link-view-customer" data-customer-id="${order.customerId}">${order.customerName || 'N/A'}</a></td>
                <td>${new Date(order.date).toLocaleString('vi-VN')}</td>
                <td>${formatAdminCurrency(order.total)}</td>
                <td><span class="status status-${getPaymentStatusClass(order.paymentStatus)}" title="${getPaymentStatusTitle(order.paymentStatus, order.paymentMethod)}">${getPaymentStatusText(order.paymentStatus)}</span></td>
                <td>
                     <select class="form-control-sm status-dropdown order-status-dropdown" data-order-id="${order.id}" aria-label="Order Status for ${order.id}">
                        ${getOrderStatusOptions(order.orderStatus)}
                     </select>
                </td>
                <td>
                    <button class="btn-icon btn-view-order" title="Xem chi tiết" data-order-id="${order.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon btn-print-invoice" title="In hóa đơn" data-order-id="${order.id}"><i class="fas fa-print"></i></button>
                 </td>
            </tr>
        `).join('');
    }

     /** Renders rows for the service request table. */
    function renderServiceTable(services) {
         if (!serviceTableBody) return;
         if (!services || services.length === 0) {
            displayEmptyState(serviceTableBody, 'No service requests found.', 8);
            return;
         }
         serviceTableBody.innerHTML = services.map(service => `
            <tr data-service-row-id="${service.id}">
                <td><a href="#" class="link-view-service" data-service-id="${service.id}">#${service.id}</a></td>
                <td><a href="#" class="link-view-customer" data-customer-id="${service.customerId}">${service.customerName || 'N/A'}</a></td>
                <td>${service.type || 'N/A'}</td>
                <td>${service.subject || 'N/A'}</td>
                <td>${new Date(service.date).toLocaleString('vi-VN')}</td>
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
                    <button class="btn-icon btn-view-service" title="Xem chi tiết" data-service-id="${service.id}"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `).join('');
    }

     /** Renders rows for the customer table. */
     function renderCustomerTable(customers) {
        if (!customerTableBody) return;
        if (!customers || customers.length === 0) {
            displayEmptyState(customerTableBody, 'No customers found.', 7);
            return;
        }
        customerTableBody.innerHTML = customers.map(customer => `
            <tr data-customer-row-id="${customer.id}">
                <td><a href="#" class="link-view-customer" data-customer-id="${customer.id}">${customer.name || 'N/A'}</a></td>
                <td>${customer.email || 'N/A'}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.registeredDate ? new Date(customer.registeredDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                <td>${customer.orderCount ?? 0}</td>
                <td>${formatAdminCurrency(customer.totalSpent || 0)}</td>
                <td>
                    <button class="btn-icon btn-view-customer" title="Xem chi tiết" data-customer-id="${customer.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon btn-email-customer" title="Gửi Email" data-customer-id="${customer.id}" data-customer-email="${customer.email}"><i class="fas fa-envelope"></i></button>
                    <button class="btn-icon text-danger btn-delete-customer" title="Xóa Khách hàng" data-customer-id="${customer.id}" data-customer-name="${customer.name || customer.id}"><i class="fas fa-user-times"></i></button>
                </td>
            </tr>
        `).join('');
    }

     /**
      * Renders a generic list with a custom item renderer.
      * @param {HTMLElement} listElement - The UL element.
      * @param {Array} items - Array of data items.
      * @param {function} renderItemFunction - Function that takes an item and returns its HTML string.
      * @param {string} [emptyMessage='No items to display.'] - Message for empty list.
      */
     function renderQuickList(listElement, items, renderItemFunction, emptyMessage = 'No items to display.') {
         if (!listElement) return;
         if (!items || items.length === 0) {
             listElement.innerHTML = `<li class="text-muted p-2 text-center">${emptyMessage}</li>`;
             return;
         }
         listElement.innerHTML = items.map(renderItemFunction).join('');
     }

     // --- Specific Item Renderers for Quick Lists ---
     function renderRecentOrderItem(order) {
         return `
             <li>
                 <span>#${order.id} - ${order.customer} - ${formatAdminCurrency(order.total)}</span>
                 <button class="btn btn-sm btn-outline btn-view-order" data-order-id="${order.id}">Xử lý</button>
             </li>`;
     }
     function renderRecentServiceItem(service) {
         return `
             <li>
                 <span>#${service.id} - ${service.customer} - ${service.type}</span>
                 <button class="btn btn-sm btn-outline btn-view-service" data-service-id="${service.id}">Xem</button>
             </li>`;
     }
     function renderLowStockProductItem(product) {
         return `
             <li>
                 <img src="${product.image || 'https://via.placeholder.com/40x40/cccccc/ffffff?text=N/A'}" alt="${product.name}">
                 <span>${product.name} (Còn ${product.stock})</span>
                 <button class="btn btn-sm btn-outline btn-edit-product" data-product-id="${product.id}">Nhập kho</button>
             </li>`;
     }
     function renderActivityLogItem(log) {
         return `
             <li>
                 <span>${log.user ? `<strong>${log.user}</strong> ` : ''}${log.action}</span>
                 <span class="timestamp">${log.timestamp}</span>
             </li>`;
     }


    /**
     * Renders pagination controls.
     * @param {HTMLElement} container - The container for pagination links.
     * @param {object} paginationData - Pagination data from API ({ currentPage, totalPages, ... }).
     * @param {string} sectionId - The section the pagination belongs to.
     * @param {object} currentParams - Current filter/sort parameters for the section.
     */
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

        // Page Number Buttons (simplified example, could add ellipsis for many pages)
        // Calculate start and end pages to display (e.g., show 5 pages around current)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
             paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1" data-section="${sectionId}">1</a></li>`;
             if (startPage > 2) {
                  paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
             }
        }


        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}" data-section="${sectionId}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</a>
                </li>`;
        }

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

        // Add event listeners to the new links
        container.querySelectorAll('.page-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                const targetSection = link.dataset.section;
                 if (!isNaN(page) && targetSection === activeAdminSectionId && !link.closest('.page-item').classList.contains('disabled')) {
                     const newParams = { ...currentParams, page: page }; // Merge current filters with new page
                     setActiveSection(targetSection, newParams);
                 }
            });
        });
    }

    // --- Status/Option Helpers ---
    function getProductStatusText(status) {
        const statuses = { published: 'Đang bán', draft: 'Nháp', archived: 'Lưu trữ' };
        return statuses[status] || status;
    }
    function getPaymentStatusText(status) {
         const statuses = { paid: 'Đã TT', pending: 'Chưa TT', failed: 'Lỗi', refunded: 'Hoàn tiền' };
         return statuses[status] || status;
    }
     function getPaymentStatusClass(status) {
        const classes = { paid: 'paid', pending: 'unpaid', failed: 'failed', refunded: 'archived' }; // Map to CSS classes
         return classes[status] || 'pending';
     }
     function getPaymentStatusTitle(status, method) {
        let title = getPaymentStatusText(status);
        if (status === 'paid' && method) {
            title += ` (${method})`;
        }
         return title;
     }

    function getOrderStatusOptions(currentStatus) {
        const statuses = {
            pending: 'Chờ xử lý',
            processing: 'Đang chuẩn bị',
            shipped: 'Đang giao',
            completed: 'Hoàn thành',
            cancelled: 'Hủy'
        };
        return Object.entries(statuses).map(([value, text]) =>
            `<option value="${value}" ${value === currentStatus ? 'selected' : ''}>${text}</option>`
        ).join('');
    }
     function getServiceStatusOptions(currentStatus) {
         const statuses = {
             new: 'Mới',
             assigned: 'Đã tiếp nhận',
             processing: 'Đang xử lý',
             waiting: 'Chờ phản hồi',
             completed: 'Hoàn thành',
             closed: 'Đóng'
         };
        return Object.entries(statuses).map(([value, text]) =>
            `<option value="${value}" ${value === currentStatus ? 'selected' : ''}>${text}</option>`
        ).join('');
    }
     function getAssigneeOptions(currentAssignee) {
        // TODO: Fetch list of admins/staff from API instead of hardcoding
         const assignees = [
             { value: '', text: '-- Gán --' },
             { value: 'admin1', text: 'Admin Demo' },
             { value: 'admin2', text: 'Nhân viên A' },
             { value: 'unassigned', text: 'Chưa gán' } // Representing unassigned state
         ];
        return assignees.map(assignee =>
             `<option value="${assignee.value}" ${assignee.text === currentAssignee ? 'selected' : ''}>${assignee.text}</option>`
        ).join('');
    }


    // =========================================================================
    // Specific Section Logic (Forms, Details)
    // =========================================================================

    // --- Product Form ---
    async function showProductForm(productId = null) {
        if (!productFormContainer || !productsSection || !productForm) return;
        console.log(`Showing product form for ID: ${productId || 'New'}`);

        // Hide list view elements
        hideElement(productListView);
        hideElement(productPagination);
        hideElement(productFilters);
        hideElement(productBulkActions);

        showElement(productFormContainer);
        mainContent?.scrollTo(0, 0); // Scroll to top of form

        const formTitle = productFormContainer.querySelector('h3');
        const submitButton = productForm.querySelector('button[type="submit"]'); // Assuming one submit button

        // Reset form state before populating
        productForm.reset();
        clearFormValidation(productForm);
        handleStockCheckboxChange(); // Reset stock field visibility based on default checkbox state
        if (submitButton) submitButton.textContent = 'Lưu Sản Phẩm'; // Reset button text

        // --- Library Reset Placeholders ---
        // TODO: Reset WYSIWYG editor content
        // if (window.tinymce?.get('productDescription')) { window.tinymce.get('productDescription').setContent(''); }
        // TODO: Clear Select2/Choices selections
        // $('#productCategory').val(null).trigger('change'); // Example for Select2
        // TODO: Clear image previews and file inputs
        //  document.getElementById('featuredImagePreview')?.innerHTML = "";
        //  document.getElementById('galleryImagePreview')?.innerHTML = "";
        // TODO: Clear any dynamically generated variant rows
        // --- End Library Reset ---

        productForm.dataset.productId = ''; // Clear any previous ID

        if (productId) {
            // --- Editing Existing Product ---
            if (formTitle) formTitle.textContent = `Sửa Sản Phẩm #${productId}`;
            if (submitButton) submitButton.textContent = 'Cập Nhật Sản Phẩm';
            productForm.dataset.productId = productId; // Store ID for submission

            showLoading(productFormContainer); // Show loading overlay on the form
            try {
                const productData = await apiService.getProductDetails(productId);
                populateProductForm(productData);
                // Initialize/Update libraries AFTER populating
                // TODO: Initialize WYSIWYG with productData.description
                // TODO: Initialize Select2/Choices with productData.categoryIds
                // TODO: Render image previews for productData.featuredImage, productData.galleryImages
                // TODO: Render variant UI based on productData.variants
            } catch (error) {
                showToast(`Error loading product details: ${error.message}`, 'error');
                hideProductForm(); // Hide form on error loading details
            } finally {
                hideLoading(productFormContainer);
            }
        } else {
            // --- Adding New Product ---
            if (formTitle) formTitle.textContent = 'Thêm Sản Phẩm Mới';
            // Initialize libraries for a new form
            // TODO: Initialize empty WYSIWYG editor
            // TODO: Initialize empty Select2/Choices
        }

        // Setup tabs for the form (ensure first tab is active)
        setupTabs(productFormTabs, productFormTabContents, '#product-form-container > .tab-content');
    }

    /** Populates the product form fields with data. */
    function populateProductForm(data) {
        if (!productForm || !data) return;
        // Simple fields
        productForm.querySelector('#productName').value = data.name || '';
        productForm.querySelector('#productSlug').value = data.slug || '';
        productForm.querySelector('#productShortDescription').value = data.shortDescription || '';
        // WYSIWYG needs special handling (set content via its API)
         productForm.querySelector('#productDescription').value = data.description || ''; // Set underlying textarea
         // Example: if (window.tinymce?.get('productDescription')) { window.tinymce.get('productDescription').setContent(data.description || ''); }
        productForm.querySelector('#productStatusForm').value = data.status || 'draft';
        productForm.querySelector('#productPrice').value = data.price || '';
        productForm.querySelector('#productSalePrice').value = data.salePrice || '';
        productForm.querySelector('#saleStartDate').value = data.saleStartDate ? data.saleStartDate.slice(0, 16) : ''; // Format for datetime-local
        productForm.querySelector('#saleEndDate').value = data.saleEndDate ? data.saleEndDate.slice(0, 16) : '';
        // Stock fields
        if (manageStockCheckbox) manageStockCheckbox.checked = data.manageStock !== false; // Default to true if undefined
        handleStockCheckboxChange(); // Update visibility
        productForm.querySelector('#productSku').value = data.sku || '';
        productForm.querySelector('#productStock').value = data.stock ?? ''; // Handle null/undefined stock
        productForm.querySelector('#lowStockThreshold').value = data.lowStockThreshold ?? '5';
        productForm.querySelector('#allowBackorder').checked = data.allowBackorder || false;
        // SEO fields
        productForm.querySelector('#seoTitle').value = data.seoTitle || '';
        productForm.querySelector('#seoDescription').value = data.seoDescription || '';

        // Complex fields (Categories, Brand, Images, Variants) require library-specific updates
        // TODO: Update Select2/Choices for Categories: $('#productCategory').val(data.categoryIds).trigger('change');
        // TODO: Update Brand dropdown: productForm.querySelector('#productBrand').value = data.brand || '';
        // TODO: Render image previews
        // TODO: Render variants UI
    }


    /** Hides the product form and restores the list view. */
    function hideProductForm() {
        hideElement(productFormContainer);
        if (activeAdminSectionId === 'products') {
            restoreListView('products');
        }
    }

    /** Handles the change event for the 'Manage Stock' checkbox. */
    function handleStockCheckboxChange() {
        if (manageStockCheckbox && stockFields?.length > 0) {
            const displayType = manageStockCheckbox.checked ? 'block' : 'none';
            // Show/hide relevant stock fields based on checkbox state
            stockFields.forEach(fieldGroup => {
                // Use 'flex' for form-row containers if needed, otherwise 'block'
                const desiredDisplay = fieldGroup.classList.contains('form-row') ? 'flex' : 'block';
                fieldGroup.style.display = manageStockCheckbox.checked ? desiredDisplay : 'none';
            });
        }
    }

     /** Handles the product form submission. */
     async function handleProductFormSubmit(event) {
        event.preventDefault();
        if (!productForm) return;
        if (isLoading) return; // Prevent double submit

        // Client-side validation
        if (!validateFormClientSide(productForm)) {
            showToast("Please fix the errors in the form.", "warning");
            return;
        }

        const submitButton = productForm.querySelector('button[type="submit"]');
        isLoading = true;
        setButtonLoading(submitButton, 'Saving...');

        try {
            // Gather form data
            const formData = new FormData(productForm); // Use FormData for easier collection
            const productData = Object.fromEntries(formData.entries()); // Convert FormData to plain object

            // --- Manual/Library-Specific Data Gathering ---
             productData.id = productForm.dataset.productId || null; // Get ID stored on the form
             productData.manageStock = manageStockCheckbox?.checked || false;
             productData.allowBackorder = productForm.querySelector('#allowBackorder')?.checked || false;
            // TODO: Get content from WYSIWYG editor: productData.description = tinymce.get('productDescription').getContent();
             productData.description = productForm.querySelector('#productDescription').value; // Fallback textarea value
            // TODO: Get values from Select2/Choices: productData.categoryIds = $('#productCategory').val();
             productData.categoryIds = Array.from(productForm.querySelector('#productCategory').selectedOptions).map(opt => opt.value); // Basic multi-select fallback
            // TODO: Get image data (IDs, URLs, or new files) - Requires complex logic based on upload implementation
            // TODO: Get variant data - Requires complex logic
            // --- End Manual Gathering ---

             // Convert checkbox values explicitly if FormData doesn't handle them as boolean
             productData.manageStock = !!productData.manageStock;
             productData.allowBackorder = !!productData.allowBackorder;


            console.log("Submitting Product Data:", productData); // Log data before sending

            const savedProduct = await apiService.saveProduct(productData);

            showToast(`Product "${savedProduct.name}" saved successfully!`, 'success');
            hideProductForm(); // Hide form on success
            await loadProductListData(); // Refresh the product list

        } catch (error) {
            showToast(`Error saving product: ${error.message || 'Unknown error'}`, 'error');
            // Display validation errors from server response if available (e.g., 422 status)
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

        // Hide list view
        hideElement(orderListView);
        hideElement(orderPagination);
        hideElement(orderFilters);
        hideElement(orderBulkActions);

        orderDetailIdSpan.textContent = orderId;
        showElement(orderDetailView);
        mainContent?.scrollTo(0, 0);
        showLoading(orderDetailContent); // Show loading within the detail content area

        try {
            const orderData = await apiService.getOrderDetail(orderId);
            renderOrderDetail(orderData);
        } catch (error) {
            showToast(`Error loading order details: ${error.message}`, 'error');
            displayEmptyState(orderDetailContent, `Could not load details for order #${orderId}.`);
        } finally {
            hideLoading(orderDetailContent);
        }
    }

     /** Renders the fetched order data into the detail view. */
    function renderOrderDetail(data) {
        if (!orderDetailContent || !data) return;

        // --- Basic Info & Customer ---
        orderDetailContent.querySelector('#detailOrderDate').textContent = new Date(data.date).toLocaleString('vi-VN');
        const statusDropdown = orderDetailContent.querySelector('#detailOrderStatus');
        if (statusDropdown) statusDropdown.innerHTML = getOrderStatusOptions(data.orderStatus); // Populate status dropdown
        orderDetailContent.querySelector('#detailCustomerLink').textContent = data.customer.name;
        orderDetailContent.querySelector('#detailCustomerLink').href = `#customers?view=${data.customer.id}`; // Example link
         orderDetailContent.querySelector('#detailCustomerEmail').textContent = data.customer.email || 'N/A';
         orderDetailContent.querySelector('#detailCustomerPhone').textContent = data.customer.phone || 'N/A';

        // --- Products ---
         const productListUl = orderDetailContent.querySelector('#detailProductList');
         if(data.items && data.items.length > 0){
              productListUl.innerHTML = data.items.map(item => `
                  <li>
                      (${item.quantity}x) <a href="#products?edit=${item.productId}" target="_blank">${item.name}</a> - ${formatAdminCurrency(item.price * item.quantity)}
                  </li>
              `).join('');
         } else {
             productListUl.innerHTML = '<li>No items found in this order.</li>';
         }


        // --- Totals & Payment ---
        orderDetailContent.querySelector('#detailSubtotal').textContent = formatAdminCurrency(data.subtotal);
        orderDetailContent.querySelector('#detailShipping').textContent = formatAdminCurrency(data.shippingCost);
        orderDetailContent.querySelector('#detailGrandTotal').textContent = formatAdminCurrency(data.grandTotal);
        orderDetailContent.querySelector('#detailPaymentMethod').textContent = `${getPaymentStatusText(data.paymentStatus)} ${data.paymentMethod ? `(${data.paymentMethod})` : ''}`;

        // --- Shipping & Notes ---
        const addr = data.shippingAddress;
        orderDetailContent.querySelector('#detailShippingAddress').textContent = addr ? `${addr.street}, ${addr.city}, ${addr.country}` : 'N/A';
        // TODO: Add map link if needed
        orderDetailContent.querySelector('#detailShippingMethod').textContent = data.shippingMethod || 'N/A';
        orderDetailContent.querySelector('#trackingCode').value = data.trackingCode || '';
        orderDetailContent.querySelector('#detailCustomerNote').textContent = data.customerNote || 'None';
        // Internal notes textarea - leave empty for adding new notes
        orderDetailContent.querySelector('#internalNote').value = '';
        // Order history
        const historyUl = orderDetailContent.querySelector('#detailOrderHistory');
        if (data.history && data.history.length > 0) {
             historyUl.innerHTML = data.history.map(h => `<li>[${new Date(h.timestamp).toLocaleString('vi-VN')}] Status changed to: ${h.status}</li>`).join('');
        } else {
             historyUl.innerHTML = '<li>No history recorded.</li>';
        }
        // Internal notes history (if separate from main history)
         const notesHistoryUl = orderDetailContent.querySelector('#internalNotesHistory'); // Assume a UL exists
         if (notesHistoryUl && data.internalNotes && data.internalNotes.length > 0) {
            notesHistoryUl.innerHTML = data.internalNotes.map(n => `<li>[${new Date(n.timestamp).toLocaleString('vi-VN')}] <strong>${n.user}:</strong> ${n.note}</li>`).join('');
         } else if(notesHistoryUl) {
            notesHistoryUl.innerHTML = '<li>No internal notes.</li>';
         }

         // TODO: Add logic for refund button visibility/state
    }

    async function handleSaveOrderDetail(orderId) {
         if (!orderDetailView || isLoading) return;

         const saveButton = orderDetailView.querySelector('.btn-primary'); // Assuming the main save button
         isLoading = true;
         setButtonLoading(saveButton);

         try {
             // Gather data from the detail view form elements
             const updatedData = {
                 status: orderDetailView.querySelector('#detailOrderStatus')?.value,
                 trackingCode: orderDetailView.querySelector('#trackingCode')?.value,
                 // Add other editable fields if any
             };
             // Handle adding new internal note separately if needed
             const newInternalNote = orderDetailView.querySelector('#internalNote')?.value.trim();
             if (newInternalNote) {
                 updatedData.newInternalNote = newInternalNote; // Send to API
             }

             await apiService.saveOrderDetail(orderId, updatedData);
             showToast(`Order #${orderId} updated successfully.`, 'success');

             // Optionally reload the detail view to show updated history/notes
             await showOrderDetail(orderId);
             // Or just clear the new note textarea
             if (newInternalNote && orderDetailView.querySelector('#internalNote')) {
                orderDetailView.querySelector('#internalNote').value = '';
             }

         } catch (error) {
             showToast(`Error saving order details: ${error.message}`, 'error');
         } finally {
             resetButtonLoading(saveButton);
             isLoading = false;
         }
     }

    // --- Service Detail ---
    async function showServiceDetail(serviceId) {
        if (!serviceDetailView || !serviceDetailContent || !serviceDetailIdSpan || !servicesSection) return;
        console.log(`Showing details for service request ${serviceId}`);

        // Hide list view
        hideElement(servicesSection?.querySelector('.table-responsive'));
        hideElement(servicePagination);
        hideElement(serviceFilters);

        serviceDetailIdSpan.textContent = serviceId;
        showElement(serviceDetailView);
        mainContent?.scrollTo(0, 0);
        showLoading(serviceDetailContent);

        try {
            const serviceData = await apiService.getServiceDetail(serviceId);
            renderServiceDetail(serviceData);
        } catch (error) {
            showToast(`Error loading service details: ${error.message}`, 'error');
            displayEmptyState(serviceDetailContent, `Could not load details for service request #${serviceId}.`);
        } finally {
            hideLoading(serviceDetailContent);
        }
    }

     /** Renders the fetched service data into the detail view. */
     function renderServiceDetail(data) {
         if (!serviceDetailContent || !data) return;

         serviceDetailContent.querySelector('#detailServiceType').textContent = data.type || 'N/A';
         serviceDetailContent.querySelector('#detailServiceSubject').textContent = data.subject || 'N/A';
         serviceDetailContent.querySelector('#detailServiceDate').textContent = new Date(data.date).toLocaleString('vi-VN');
         serviceDetailContent.querySelector('#detailServiceDescription').textContent = data.description || 'No description provided.';

         const statusDropdown = serviceDetailContent.querySelector('#detailServiceStatus');
         if (statusDropdown) statusDropdown.innerHTML = getServiceStatusOptions(data.status);

         const assigneeDropdown = serviceDetailContent.querySelector('#detailServiceAssignee');
         if (assigneeDropdown) assigneeDropdown.innerHTML = getAssigneeOptions(data.assignee);

          serviceDetailContent.querySelector('#detailServiceCustomerLink').textContent = data.customer.name;
          serviceDetailContent.querySelector('#detailServiceCustomerLink').href = `#customers?view=${data.customer.id}`; // Example link
          serviceDetailContent.querySelector('#detailServiceCustomerEmail').textContent = data.customer.email || 'N/A';

          // Attachments
         const attachmentsUl = serviceDetailContent.querySelector('#detailServiceAttachments');
         if (data.attachments && data.attachments.length > 0) {
             attachmentsUl.innerHTML = data.attachments.map(att => `<li><a href="${att.url}" target="_blank">${att.name}</a></li>`).join('');
         } else {
             attachmentsUl.innerHTML = '<li>No attachments.</li>';
         }

         // Notes History
         const notesHistoryUl = serviceDetailContent.querySelector('#serviceNoteHistory');
         if (data.notes && data.notes.length > 0) {
             notesHistoryUl.innerHTML = data.notes.map(n => `<li>[${new Date(n.timestamp).toLocaleString('vi-VN')}] <strong>${n.user}:</strong> ${n.note}</li>`).join('');
         } else {
             notesHistoryUl.innerHTML = '<li>No notes recorded.</li>';
         }
          // Clear the "add note" textarea
          serviceDetailContent.querySelector('#serviceInternalNote').value = '';
     }

    async function handleSaveServiceDetail(serviceId) {
        if (!serviceDetailView || isLoading) return;

        const saveButton = serviceDetailView.querySelector('.btn-primary');
        isLoading = true;
        setButtonLoading(saveButton);

        try {
            const updatedData = {
                status: serviceDetailView.querySelector('#detailServiceStatus')?.value,
                assignee: serviceDetailView.querySelector('#detailServiceAssignee')?.value,
            };
             const newNote = serviceDetailView.querySelector('#serviceInternalNote')?.value.trim();
             if (newNote) {
                 updatedData.newNote = newNote;
             }

            await apiService.updateService(serviceId, updatedData);
            showToast(`Service Request #${serviceId} updated successfully.`, 'success');
            // Reload detail view to show updated notes/history
             await showServiceDetail(serviceId);

        } catch (error) {
            showToast(`Error saving service details: ${error.message}`, 'error');
        } finally {
            resetButtonLoading(saveButton);
            isLoading = false;
        }
    }


    // --- Customer Detail ---
    async function showCustomerDetail(customerId) {
        if (!customerDetailView || !customerDetailContent || !customerDetailNameSpan || !customersSection) return;
        console.log(`Showing details for customer ${customerId}`);

        // Hide list view
        hideElement(customersSection?.querySelector('.table-responsive'));
        hideElement(customerPagination);
        hideElement(customerFilters);

        showElement(customerDetailView);
        mainContent?.scrollTo(0, 0);
        showLoading(customerDetailContent); // Show loading specific to content area

        try {
            const customerData = await apiService.getCustomerDetail(customerId);
            renderCustomerDetail(customerData);
             // Setup tabs AFTER content structure is potentially rendered
             setupTabs(customerDetailTabs, customerDetailTabContents, '#customerDetailContentPlaceholder > .tab-content');
        } catch (error) {
            showToast(`Error loading customer details: ${error.message}`, 'error');
            displayEmptyState(customerDetailContent, `Could not load details for customer ID ${customerId}.`);
        } finally {
             hideLoading(customerDetailContent);
        }
    }

    /** Renders the fetched customer data into the detail view tabs. */
    function renderCustomerDetail(data) {
        if (!customerDetailContent || !data) return;

        customerDetailNameSpan.textContent = data.name || 'N/A';

        // --- Info Tab ---
        const infoTab = customerDetailContent.querySelector('#customer-info');
        if (infoTab) {
            infoTab.innerHTML = `
                <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
                <p><strong>SĐT:</strong> ${data.phone || 'N/A'}</p>
                <p><strong>Ngày ĐK:</strong> ${data.registeredDate ? new Date(data.registeredDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                <p><strong>Tổng số đơn:</strong> ${data.orderCount ?? 0}</p>
                <p><strong>Tổng chi tiêu:</strong> ${formatAdminCurrency(data.totalSpent || 0)}</p>
                <!-- Add more fields as needed -->
            `;
        }

        // --- Addresses Tab ---
        const addressesTab = customerDetailContent.querySelector('#customer-addresses');
        const addressListDiv = addressesTab?.querySelector('.address-list');
        if (addressListDiv) {
            if (data.addresses && data.addresses.length > 0) {
                addressListDiv.innerHTML = data.addresses.map(addr => `
                    <div class="address-item">
                         <p><strong>${addr.street}</strong></p>
                         <p>${addr.city}, ${addr.country}</p>
                         ${addr.isDefaultBilling ? '<span class="badge status-info">Thanh toán</span>' : ''}
                         ${addr.isDefaultShipping ? '<span class="badge status-success">Giao hàng</span>' : ''}
                         <div class="address-actions">
                             <button class="btn btn-xs btn-outline" data-address-id="${addr.id}"><i class="fas fa-edit"></i> Sửa</button>
                             <button class="btn btn-xs btn-danger" data-address-id="${addr.id}"><i class="fas fa-trash-alt"></i> Xóa</button>
                         </div>
                    </div>
                `).join('');
            } else {
                addressListDiv.innerHTML = '<p class="text-muted">No addresses found.</p>';
            }
        }

        // --- Order History Tab ---
        const orderHistoryTab = customerDetailContent.querySelector('#customer-order-history');
        if (orderHistoryTab) {
            if (data.orderHistory && data.orderHistory.length > 0) {
                orderHistoryTab.innerHTML = `
                    <table class="admin-table mini-table">
                        <thead><tr><th>Mã ĐH</th><th>Ngày</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead>
                        <tbody>
                            ${data.orderHistory.map(order => `
                                <tr>
                                    <td><a href="#" class="link-view-order" data-order-id="${order.id}">#${order.id}</a></td>
                                    <td>${new Date(order.date).toLocaleDateString('vi-VN')}</td>
                                    <td>${formatAdminCurrency(order.total)}</td>
                                    <td><span class="status status-${order.orderStatus}">${order.orderStatus}</span></td>
                                    <td><button class="btn-icon btn-view-order" title="Xem" data-order-id="${order.id}"><i class="fas fa-eye"></i></button></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>`;
            } else {
                 displayEmptyState(orderHistoryTab, 'No order history found.', 5);
            }
        }

        // --- Service History Tab ---
        const serviceHistoryTab = customerDetailContent.querySelector('#customer-service-history');
        if (serviceHistoryTab) {
            if (data.serviceHistory && data.serviceHistory.length > 0) {
                serviceHistoryTab.innerHTML = `
                     <table class="admin-table mini-table">
                         <thead><tr><th>Mã YC</th><th>Ngày</th><th>Loại</th><th>Trạng thái</th><th></th></tr></thead>
                         <tbody>
                             ${data.serviceHistory.map(service => `
                                <tr>
                                    <td><a href="#" class="link-view-service" data-service-id="${service.id}">#${service.id}</a></td>
                                    <td>${new Date(service.date).toLocaleDateString('vi-VN')}</td>
                                    <td>${service.type}</td>
                                     <td><span class="status status-${service.status}">${service.status}</span></td>
                                     <td><button class="btn-icon btn-view-service" title="Xem" data-service-id="${service.id}"><i class="fas fa-eye"></i></button></td>
                                </tr>`).join('')}
                         </tbody>
                     </table>`;
            } else {
                 displayEmptyState(serviceHistoryTab, 'No service history found.', 5);
            }
        }

        // --- Admin Notes Tab ---
        const notesTab = customerDetailContent.querySelector('#customer-notes');
        const notesHistoryUl = notesTab?.querySelector('.activity-log');
        const notesTextarea = notesTab?.querySelector('textarea');
        if (notesTextarea) notesTextarea.value = ''; // Clear textarea for new note
        if (notesHistoryUl) {
            if (data.adminNotes && data.adminNotes.length > 0) {
                notesHistoryUl.innerHTML = data.adminNotes.map(note =>
                    `<li>[${new Date(note.timestamp).toLocaleString('vi-VN')}] <strong>${note.user}:</strong> ${note.note}</li>`
                ).join('');
            } else {
                notesHistoryUl.innerHTML = '<li>No admin notes recorded.</li>';
            }
        }
    }

     async function handleSaveCustomerNote(customerId) {
         const notesTextarea = customerDetailView?.querySelector('#customer-notes textarea');
         const saveButton = customerDetailView?.querySelector('#customer-notes button');
         if (!notesTextarea || !saveButton || isLoading) return;

         const noteContent = notesTextarea.value.trim();
         if (!noteContent) {
             showToast("Note content cannot be empty.", "warning");
             return;
         }

         isLoading = true;
         setButtonLoading(saveButton, 'Saving...');

         try {
             // Assuming the API handles adding the note based on customer ID and note content
             await apiService.saveCustomerDetail(customerId, { newAdminNote: noteContent });
             showToast("Note saved successfully.", "success");
             // Reload the customer detail view to show the new note in history
             await showCustomerDetail(customerId);
         } catch (error) {
             showToast(`Error saving note: ${error.message}`, 'error');
         } finally {
             resetButtonLoading(saveButton);
             isLoading = false;
         }
     }


    // =========================================================================
    // Table Interaction Helpers
    // =========================================================================

    /** Sets up 'Select All' and individual checkbox logic for a table. */
    function handleTableSelection(selectAllCheckbox, itemCheckboxesSelector, parentElement = document) {
        if (!selectAllCheckbox) return;
        const itemCheckboxes = parentElement.querySelectorAll(itemCheckboxesSelector);
         const bulkActionButton = parentElement.querySelector('.bulk-actions-container button'); // Find related button

        const handleSelectAllChange = () => {
            itemCheckboxes.forEach(checkbox => { checkbox.checked = selectAllCheckbox.checked; });
            updateBulkActionState(itemCheckboxes, bulkActionButton);
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
                selectAllCheckbox.indeterminate = true;
            }
            updateBulkActionState(itemCheckboxes, bulkActionButton);
        };

        // Remove old listeners before adding new ones
        selectAllCheckbox.removeEventListener('change', handleSelectAllChange);
        selectAllCheckbox.addEventListener('change', handleSelectAllChange);

        itemCheckboxes.forEach(checkbox => {
            checkbox.removeEventListener('change', handleItemCheckboxChange);
            checkbox.addEventListener('change', handleItemCheckboxChange);
        });

        // Initial state check
        handleItemCheckboxChange();
    }

    /** Enables/disables the bulk action button based on checkbox selection. */
    function updateBulkActionState(checkboxes, bulkButton) {
        if (!bulkButton) return;
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        bulkButton.disabled = !anyChecked;
    }

    // =========================================================================
    // Event Handlers (Delegated Clicks, Changes, etc.)
    // =========================================================================

    /** Handles clicks within the Dashboard section. */
    function handleDashboardClick(event) {
        const kpiCard = event.target.closest('.kpi-card.clickable');
        const viewOrderBtn = event.target.closest('.btn-view-order');
        const viewServiceBtn = event.target.closest('.btn-view-service');
        const editProductBtn = event.target.closest('.btn-edit-product');
        const viewCustomerLink = event.target.closest('.activity-log .link-view-customer'); // Example from activity log
        const viewAllLink = event.target.closest('.view-all-link[data-section]');

        if (kpiCard) {
            const targetSection = kpiCard.dataset.targetSection;
            const filterStatus = kpiCard.dataset.filterStatus;
            if (targetSection) {
                const params = filterStatus ? { status: filterStatus } : {}; // Prepare params for filtering
                setActiveSection(targetSection, params);
                console.log(`KPI Click: Navigate to ${targetSection}` + (filterStatus ? ` & filter by ${filterStatus}` : ''));
            }
        } else if (viewOrderBtn) {
             const orderId = viewOrderBtn.dataset.orderId;
             if (orderId) {
                 setActiveSection('orders'); // Switch section first
                 // Use setTimeout to ensure the section is active before showing detail
                 setTimeout(() => showOrderDetail(orderId), 50);
             }
        } else if (viewServiceBtn) {
            const serviceId = viewServiceBtn.dataset.serviceId;
            if (serviceId) {
                setActiveSection('services');
                setTimeout(() => showServiceDetail(serviceId), 50);
            }
        } else if (editProductBtn) {
             const productId = editProductBtn.dataset.productId;
             if (productId) {
                 setActiveSection('products');
                 setTimeout(() => showProductForm(productId), 50);
             }
        } else if (viewCustomerLink) {
            event.preventDefault();
             const customerId = viewCustomerLink.dataset.customerId;
             if (customerId) {
                setActiveSection('customers');
                setTimeout(() => showCustomerDetail(customerId), 50);
             }
        } else if (viewAllLink) {
            event.preventDefault();
            const targetSection = viewAllLink.dataset.section;
             if (targetSection) {
                setActiveSection(targetSection);
             }
        }
    }

    /** Handles clicks within the Product Table (Edit, Delete, etc.). */
    async function handleProductTableClick(event) {
        const editButton = event.target.closest('.btn-edit-product, .link-edit-product');
        const deleteButton = event.target.closest('.btn-delete-product');
        const duplicateButton = event.target.closest('[title="Nhân bản"]');

        if (editButton) {
            event.preventDefault();
            const productId = editButton.dataset.productId;
            if (productId) {
                await showProductForm(productId);
            }
        } else if (deleteButton) {
            event.preventDefault();
            const productId = deleteButton.dataset.productId;
            const productName = deleteButton.dataset.productName || `ID ${productId}`; // Get name from data attribute
            if (!productId) return;

             showConfirmationModal(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"? Hành động này không thể hoàn tác.`, async () => {
                if (isLoading) return;
                isLoading = true;
                setButtonLoading(deleteButton); // Show loading on the icon button itself
                 try {
                     await apiService.deleteProduct(productId);
                     showToast(`Đã xóa sản phẩm "${productName}".`, 'success');
                     // Remove row from table visually
                     deleteButton.closest('tr')?.remove();
                     // Optional: Reload the list if pagination/total counts need updating
                     // await loadProductListData();
                 } catch (error) {
                     showToast(`Lỗi khi xóa sản phẩm: ${error.message}`, 'error');
                 } finally {
                     resetButtonLoading(deleteButton);
                     isLoading = false;
                 }
            });

        } else if (duplicateButton) {
             event.preventDefault();
             const productId = duplicateButton.dataset.productId;
             showToast(`Chức năng nhân bản sản phẩm ${productId} chưa được cài đặt.`, 'info');
             // TODO: Implement duplication logic (fetch details, clear ID, show form)
        }
    }

    /** Handles applying bulk actions for products. */
    async function handleProductBulkAction() {
        if (isLoading) return;
        const selectedAction = productBulkActionSelect?.value;
        const selectedCheckboxes = productsSection?.querySelectorAll('.product-checkbox:checked');

        if (!selectedAction || !selectedCheckboxes || selectedCheckboxes.length === 0) {
            showToast('Vui lòng chọn hành động và ít nhất một sản phẩm.', 'warning');
            return;
        }

        const selectedProductIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        const actionText = productBulkActionSelect.options[productBulkActionSelect.selectedIndex].text;

        showConfirmationModal(`Bạn có chắc chắn muốn "${actionText}" ${selectedProductIds.length} sản phẩm đã chọn?`, async () => {
             isLoading = true;
             setButtonLoading(applyProductBulkActionBtn);
             try {
                 const result = await apiService.applyProductBulkAction(selectedAction, selectedProductIds);
                 showToast(result.message || `Đã áp dụng "${actionText}" thành công.`, 'success');
                 // Reset selection and reload list
                 if (productBulkActionSelect) productBulkActionSelect.value = '';
                 if (selectAllProductsCheckbox) selectAllProductsCheckbox.checked = false;
                 selectedCheckboxes.forEach(cb => { cb.checked = false; });
                 updateBulkActionState(selectedCheckboxes, applyProductBulkActionBtn); // Disable button after action
                 await loadProductListData(); // Refresh list to show changes
             } catch (error) {
                 showToast(`Lỗi khi áp dụng hành động hàng loạt: ${error.message}`, 'error');
             } finally {
                 resetButtonLoading(applyProductBulkActionBtn);
                 isLoading = false;
             }
        });
    }

    /** Handles clicks within the Order Table. */
    function handleOrderTableClick(event) {
        const viewButton = event.target.closest('.link-view-order, .btn-view-order');
        const printButton = event.target.closest('.btn-print-invoice');
        const viewCustomerLink = event.target.closest('.link-view-customer');
        const statusDropdown = event.target.closest('.order-status-dropdown');

        if (viewButton) {
            event.preventDefault();
            const orderId = viewButton.dataset.orderId;
            if(orderId) showOrderDetail(orderId);
        } else if (printButton) {
            event.preventDefault();
             const orderId = printButton.dataset.orderId;
            console.log(`Printing invoice for order ${orderId} (Not Implemented)`);
            showToast(`Chức năng in hóa đơn ${orderId} chưa được cài đặt.`, 'info');
            // TODO: Open print view or generate PDF
        } else if (viewCustomerLink) {
            event.preventDefault();
             const customerId = viewCustomerLink.dataset.customerId;
             if (customerId) {
                setActiveSection('customers');
                setTimeout(() => showCustomerDetail(customerId), 50);
             }
        } else if (statusDropdown) {
             // Let the 'change' event handler handle this
             return;
        }
    }

     /** Handles changes to inline status dropdowns in the Order Table. */
     async function handleOrderInlineStatusChange(event) {
         const dropdown = event.target;
         if (!dropdown.classList.contains('order-status-dropdown') || isLoading) {
             return;
         }

         const orderId = dropdown.dataset.orderId;
         const newStatus = dropdown.value;
         const originalStatus = dropdown.querySelector('option[selected]')?.value; // Get originally selected value

         if (!orderId || !newStatus || newStatus === originalStatus) {
             return; // No change or invalid data
         }

         isLoading = true;
         dropdown.disabled = true; // Disable dropdown during update

         try {
             await apiService.updateOrderStatus(orderId, newStatus);
             showToast(`Trạng thái đơn hàng #${orderId} đã được cập nhật thành "${newStatus}".`, 'success');
             // Update the selected attribute for future checks
             dropdown.querySelector(`option[value="${originalStatus}"]`)?.removeAttribute('selected');
             dropdown.querySelector(`option[value="${newStatus}"]`)?.setAttribute('selected', 'selected');
         } catch (error) {
             showToast(`Lỗi cập nhật trạng thái đơn hàng #${orderId}: ${error.message}`, 'error');
             // Revert dropdown selection on error
             dropdown.value = originalStatus || '';
         } finally {
             dropdown.disabled = false;
             isLoading = false;
         }
     }


    /** Handles applying bulk actions for orders. */
    async function handleOrderBulkAction() {
        if (isLoading) return;
        const selectedAction = orderBulkActionSelect?.value;
        const selectedCheckboxes = ordersSection?.querySelectorAll('.order-checkbox:checked');

        if (!selectedAction || !selectedCheckboxes || selectedCheckboxes.length === 0) {
            showToast('Vui lòng chọn hành động và ít nhất một đơn hàng.', 'warning');
            return;
        }

        const selectedOrderIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        const actionText = orderBulkActionSelect.options[orderBulkActionSelect.selectedIndex].text;

        // Special handling for actions needing input (e.g., print requires confirmation/options maybe)
        if (selectedAction.startsWith('print_')) {
             console.log(`Bulk printing for ${selectedOrderIds.length} orders (Not Implemented)`);
             showToast(`Chức năng in hàng loạt (${actionText}) chưa được cài đặt.`, 'info');
             return;
        }

        showConfirmationModal(`Bạn có chắc chắn muốn "${actionText}" cho ${selectedOrderIds.length} đơn hàng đã chọn?`, async () => {
            isLoading = true;
            setButtonLoading(applyOrderBulkActionBtn);
             try {
                 const result = await apiService.applyOrderBulkAction(selectedAction, selectedOrderIds);
                 showToast(result.message || `Đã áp dụng "${actionText}" thành công.`, 'success');
                 // Reset selection and reload list
                 if (orderBulkActionSelect) orderBulkActionSelect.value = '';
                 if (selectAllOrdersCheckbox) selectAllOrdersCheckbox.checked = false;
                 selectedCheckboxes.forEach(cb => { cb.checked = false; });
                 updateBulkActionState(selectedCheckboxes, applyOrderBulkActionBtn);
                 await loadOrderListData(); // Refresh list
             } catch (error) {
                 showToast(`Lỗi khi áp dụng hành động hàng loạt: ${error.message}`, 'error');
             } finally {
                 resetButtonLoading(applyOrderBulkActionBtn);
                 isLoading = false;
             }
        });
    }

    /** Handles clicks within the Service Table. */
    function handleServiceTableClick(event) {
        const viewButton = event.target.closest('.link-view-service, .btn-view-service');
        const viewCustomerLink = event.target.closest('.link-view-customer');
        const statusDropdown = event.target.closest('.service-status-dropdown');
        const assigneeDropdown = event.target.closest('.service-assignee-dropdown');

        if (viewButton) {
            event.preventDefault();
            const serviceId = viewButton.dataset.serviceId;
            if(serviceId) showServiceDetail(serviceId);
        } else if (viewCustomerLink) {
            event.preventDefault();
             const customerId = viewCustomerLink.dataset.customerId;
             if (customerId) {
                setActiveSection('customers');
                setTimeout(() => showCustomerDetail(customerId), 50);
             }
        } else if (statusDropdown || assigneeDropdown) {
             // Let the 'change' event handler handle this
             return;
        }
    }

    /** Handles changes to inline dropdowns in the Service Table. */
    async function handleServiceInlineChange(event) {
         if (isLoading) return;
        const dropdown = event.target;
        const isStatusDropdown = dropdown.classList.contains('service-status-dropdown');
        const isAssigneeDropdown = dropdown.classList.contains('service-assignee-dropdown');

        if (!isStatusDropdown && !isAssigneeDropdown) return;

        const serviceId = dropdown.dataset.serviceId;
        const newValue = dropdown.value;
        const originalValue = dropdown.querySelector('option[selected]')?.value;

        if (!serviceId || newValue === originalValue) return;

        isLoading = true;
        dropdown.disabled = true;

        const updateData = {};
        let updateType = '';
        if (isStatusDropdown) {
            updateData.status = newValue;
            updateType = 'status';
        } else {
            updateData.assignee = newValue; // Send assignee ID or name based on API requirement
            updateType = 'assignee';
        }

        try {
            await apiService.updateService(serviceId, updateData); // Use a generic update endpoint or specific ones
            showToast(`Service #${serviceId} ${updateType} updated successfully.`, 'success');
             // Update selected attribute
             dropdown.querySelector(`option[value="${originalValue}"]`)?.removeAttribute('selected');
             dropdown.querySelector(`option[value="${newValue}"]`)?.setAttribute('selected', 'selected');
        } catch (error) {
            showToast(`Error updating service #${serviceId}: ${error.message}`, 'error');
            dropdown.value = originalValue || ''; // Revert on error
        } finally {
            dropdown.disabled = false;
            isLoading = false;
        }
    }

    /** Handles clicks within the Customer Table. */
    function handleCustomerTableClick(event) {
        const viewButton = event.target.closest('.link-view-customer, .btn-view-customer');
        const emailButton = event.target.closest('.btn-email-customer');
        const deleteButton = event.target.closest('.btn-delete-customer'); // Use specific class

        if (viewButton) {
            event.preventDefault();
            const customerId = viewButton.dataset.customerId;
            if(customerId) showCustomerDetail(customerId);
        } else if (emailButton) {
            event.preventDefault();
            const customerEmail = emailButton.dataset.customerEmail;
             if (customerEmail) {
                 window.location.href = `mailto:${customerEmail}`;
             } else {
                 showToast("No email address found for this customer.", "warning");
             }
        } else if (deleteButton) {
            event.preventDefault();
            const customerId = deleteButton.dataset.customerId;
            const customerName = deleteButton.dataset.customerName || `ID ${customerId}`;
            if (!customerId) return;

             showConfirmationModal(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"? Tất cả đơn hàng và dữ liệu liên quan có thể bị ảnh hưởng. Hành động này không thể hoàn tác.`, async () => {
                if (isLoading) return;
                isLoading = true;
                setButtonLoading(deleteButton);
                 try {
                     await apiService.deleteCustomer(customerId);
                     showToast(`Đã xóa khách hàng "${customerName}".`, 'success');
                     deleteButton.closest('tr')?.remove();
                     // Optional: Reload list
                     // await loadCustomerListData();
                 } catch (error) {
                     showToast(`Lỗi khi xóa khách hàng: ${error.message}`, 'error');
                 } finally {
                     resetButtonLoading(deleteButton);
                     isLoading = false;
                 }
            });
        }
    }

     /** Handles saving general settings form. */
     async function handleGeneralSettingsSubmit(event) {
         event.preventDefault();
         const form = event.target;
         if (!form || isLoading) return;

         if (!validateFormClientSide(form)) {
             showToast("Please check the form for errors.", "warning");
             return;
         }

         const submitButton = form.querySelector('button[type="submit"]');
         isLoading = true;
         setButtonLoading(submitButton);

         try {
             const formData = new FormData(form);
             const settingsData = Object.fromEntries(formData.entries());
             // Handle file input separately if needed (e.g., logo upload)
             // const logoFile = form.querySelector('#storeLogo').files[0];
             // if (logoFile) { /* ... upload logic ... */ }

             await apiService.saveSettings('general', settingsData);
             showToast("General settings saved successfully.", 'success');
             clearFormValidation(form);
         } catch (error) {
             showToast(`Error saving general settings: ${error.message}`, 'error');
             if (error.status === 422 && error.data?.errors) {
                 displayFormValidationErrors(form, error.data.errors);
             }
         } finally {
             resetButtonLoading(submitButton);
             isLoading = false;
         }
     }

      /** Handles saving payment settings. */
     async function handlePaymentSettingsSubmit(event) {
         event.preventDefault();
         const container = document.getElementById('settings-payments');
         const form = event.target.closest('form'); // If wrapped in form, else gather data manually
         const submitButton = container?.querySelector('button.btn-primary'); // Find save button
         if (isLoading || !container) return;

         isLoading = true;
         if (submitButton) setButtonLoading(submitButton);

         try {
             // Gather data from individual controls within the payment settings tab
             const settingsData = {
                 codEnabled: container.querySelector('#codEnabled')?.checked,
                 codTitle: container.querySelector('#codTitle')?.value, // Assume inputs have IDs
                 // ... gather other payment settings ...
                 bankTransferEnabled: container.querySelector('#bankTransferEnabled')?.checked,
                 bankTransferDetails: container.querySelector('#bankTransferDetails')?.value,
                 vnpayEnabled: container.querySelector('#vnpayEnabled')?.checked,
                 vnpayTmnCode: container.querySelector('#vnpayTmnCode')?.value,
                 vnpayHashSecret: container.querySelector('#vnpayHashSecret')?.value,
                 vnpayTestMode: container.querySelector('#vnpayTestMode')?.checked,
             };

             await apiService.saveSettings('payments', settingsData);
             showToast("Payment settings saved successfully.", 'success');
             if (form) clearFormValidation(form); // Clear validation if it was a form
         } catch (error) {
             showToast(`Error saving payment settings: ${error.message}`, 'error');
             // Handle potential validation errors if API returns them for specific fields
              if (error.status === 422 && error.data?.errors && form) {
                 displayFormValidationErrors(form, error.data.errors);
             }
         } finally {
             if (submitButton) resetButtonLoading(submitButton);
             isLoading = false;
         }
     }
     // TODO: Add similar handlers for Shipping, Emails, SEO settings forms/tabs


    /** Handles clicks on the "Clear Notifications" button. */
    async function handleClearNotifications(event) {
        event.preventDefault();
        if (isLoading) return;
        isLoading = true;
        // Optionally add loading state to the button/panel
         showLoading(notificationPanel);
        try {
            await apiService.markAllNotificationsRead();
            showToast("All notifications marked as read.", "success");
            // Update UI: remove 'unread' class, set badge to 0
            notificationList?.querySelectorAll('li.unread').forEach(li => li.classList.remove('unread'));
            if (notificationCountBadge) notificationCountBadge.textContent = '0';
            if (notificationCountBadge) notificationCountBadge.style.display = 'none'; // Hide badge
            closeAllDropdowns(); // Close panel after clearing
        } catch (error) {
            showToast(`Error clearing notifications: ${error.message}`, 'error');
        } finally {
            hideLoading(notificationPanel);
            isLoading = false;
        }
    }

    /** Handles clicks on individual notification items. */
    async function handleNotificationClick(event) {
        const item = event.target.closest('li[data-notif-id]');
        if (!item || isLoading) return;

        const notificationId = item.dataset.notifId;
        const isUnread = item.classList.contains('unread');

        // Mark as read API call only if it's unread
        if (isUnread) {
             isLoading = true;
             item.style.opacity = '0.5'; // Visual feedback
             try {
                 await apiService.markNotificationRead(notificationId);
                 item.classList.remove('unread');
                 // Update badge count
                 if (notificationCountBadge) {
                     let count = parseInt(notificationCountBadge.textContent) || 0;
                     if (count > 0) {
                          count--;
                          notificationCountBadge.textContent = count;
                          if (count === 0) notificationCountBadge.style.display = 'none';
                     }
                 }
             } catch (error) {
                 showToast(`Error marking notification as read: ${error.message}`, 'error');
             } finally {
                 item.style.opacity = '1';
                 isLoading = false;
             }
        }

        // Handle navigation based on notification link data (if exists)
        const linkType = item.dataset.linkType;
        const linkId = item.dataset.linkId;

        if (linkType && linkId) {
            closeAllDropdowns(); // Close panel before navigating
            switch (linkType) {
                case 'order':
                    setActiveSection('orders');
                    setTimeout(() => showOrderDetail(linkId), 50);
                    break;
                case 'product':
                     setActiveSection('products');
                     setTimeout(() => showProductForm(linkId), 50);
                    break;
                case 'service':
                     setActiveSection('services');
                     setTimeout(() => showServiceDetail(linkId), 50);
                    break;
                case 'customer':
                     setActiveSection('customers');
                     setTimeout(() => showCustomerDetail(linkId), 50);
                     break;
                 default:
                     console.warn(`Unhandled notification link type: ${linkType}`);
            }
        }
    }

    /** Fetches and renders notifications into the panel. */
    async function loadNotifications() {
        if (!notificationList || !notificationCountBadge) return;
         // Show simple loading state inside list
        notificationList.innerHTML = '<li><span class="text-muted p-3 text-center">Loading...</span></li>';
        try {
            const notifications = await apiService.getNotifications();
            let unreadCount = 0;
            if (notifications && notifications.length > 0) {
                notificationList.innerHTML = notifications.map(notif => {
                    if (!notif.read) unreadCount++;
                    // Store link data in data attributes for navigation
                    const linkDataAttrs = notif.link ? `data-link-type="${notif.link.type}" data-link-id="${notif.link.id}"` : '';
                    return `
                        <li data-notif-id="${notif.id}" class="${!notif.read ? 'unread' : ''}" ${linkDataAttrs}>
                            <span>${notif.message}</span>
                            <span class="timestamp">${notif.timestamp}</span>
                        </li>`;
                }).join('');
            } else {
                notificationList.innerHTML = '<li><span class="text-muted p-3 text-center">No notifications.</span></li>';
            }
            // Update badge
            notificationCountBadge.textContent = unreadCount;
             notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        } catch (error) {
            showToast("Could not load notifications.", "error");
            notificationList.innerHTML = '<li><span class="text-danger p-3 text-center">Error loading notifications.</span></li>';
        }
    }


    /** Handles admin logout action. */
    function handleAdminLogout(event) {
        event.preventDefault();
         showConfirmationModal('Bạn có chắc chắn muốn đăng xuất khỏi trang Admin?', async () => {
            if (isLoading) return;
            isLoading = true;
            // Optionally show full page loading
            showLoading(adminContainer, "Logging out...");
             try {
                 await apiService.logout();
                 showToast('Đăng xuất thành công!', 'success');
                 // Redirect to login page after a short delay
                 setTimeout(() => {
                    window.location.href = '/admin/login'; // Adjust redirect URL as needed
                 }, 1000);
             } catch (error) {
                 showToast(`Lỗi đăng xuất: ${error.message}`, 'error');
                 hideLoading(adminContainer); // Hide loading on error
                  isLoading = false;
             }
             // No need for finally block here as redirect happens on success
        });
    }

    // =========================================================================
    // Event Listeners Setup
    // =========================================================================

    function setupEventListeners() {
        console.log("Setting up event listeners...");

        // --- Sidebar Links ---
        sidebarLinks.forEach(link => {
            const section = link.dataset.section;
            if (section && section !== '#') { // Ensure it's a section link
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    setActiveSection(section);
                });
            } else if (!link.id?.includes('Logout')) {
                 // Handle non-section links if needed, ignore logout
                 link.addEventListener('click', (e) => {
                    e.preventDefault();
                     showToast(`Navigation for "${link.textContent.trim()}" is not implemented yet.`, 'info');
                 });
            }
        });

        // --- Sidebar Toggle ---
        sidebarToggle?.addEventListener('click', handleSidebarToggle);

        // --- Header Dropdowns ---
        notificationBell?.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(notificationPanel, notificationBell); });
        userMenuToggle?.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(userDropdown, userMenuToggle); });

        // --- Global Click Listener (for closing dropdowns/mobile sidebar) ---
        document.addEventListener('click', (e) => {
            // Close dropdowns if click is outside
            const clickedOutsideDropdowns = ![notificationBell, notificationPanel, userMenuToggle, userDropdown].some(el => el?.contains(e.target));
            if (clickedOutsideDropdowns) {
                closeAllDropdowns();
            }

            // Close mobile sidebar if click is outside
            const isMobile = window.innerWidth <= 992;
            const clickedOutsideSidebar = isMobile && sidebar?.classList.contains('active') && !sidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle?.contains(e.target);
            if (clickedOutsideSidebar) {
                sidebar.classList.remove('active');
                toggleMobileSidebarOverlay(false);
            }
        });

        // --- Logout ---
        logoutLinkSidebar?.addEventListener('click', handleAdminLogout);
        logoutLinkDropdown?.addEventListener('click', handleAdminLogout);

        // --- Notifications ---
        clearAdminNotificationsBtn?.addEventListener('click', handleClearNotifications);
        notificationList?.addEventListener('click', handleNotificationClick);

        // --- Dashboard Section Actions ---
        dashboardSection?.addEventListener('click', handleDashboardClick);

        // --- Product Section Actions ---
        addProductBtn?.addEventListener('click', () => showProductForm());
        cancelProductBtn?.addEventListener('click', hideProductForm);
        manageStockCheckbox?.addEventListener('change', handleStockCheckboxChange);
        productTable?.addEventListener('click', handleProductTableClick); // Delegated click
        applyProductBulkActionBtn?.addEventListener('click', handleProductBulkAction);
        productForm?.addEventListener('submit', handleProductFormSubmit);

        // --- Order Section Actions ---
        orderTable?.addEventListener('click', handleOrderTableClick); // Delegated click
        orderTable?.addEventListener('change', handleOrderInlineStatusChange); // Delegated change for dropdowns
        applyOrderBulkActionBtn?.addEventListener('click', handleOrderBulkAction);
        orderDetailView?.querySelector('.btn-primary')?.addEventListener('click', (e) => { // Save detail button
             e.preventDefault();
             const orderId = orderDetailIdSpan?.textContent;
             if(orderId) handleSaveOrderDetail(orderId);
        });
         orderDetailView?.querySelector('.btn-add-note')?.addEventListener('click', (e) => { // Add note button
             e.preventDefault();
             const orderId = orderDetailIdSpan?.textContent;
             if(orderId) handleSaveOrderDetail(orderId); // Save function handles note add
         });


        // --- Service Section Actions ---
        serviceTable?.addEventListener('click', handleServiceTableClick); // Delegated click
        serviceTable?.addEventListener('change', handleServiceInlineChange); // Delegated change
        serviceDetailView?.querySelector('.btn-primary')?.addEventListener('click', (e) => { // Save detail button
             e.preventDefault();
             const serviceId = serviceDetailIdSpan?.textContent;
             if(serviceId) handleSaveServiceDetail(serviceId);
        });
        serviceDetailView?.querySelector('.btn-add-service-note')?.addEventListener('click', (e) => { // Add note button
             e.preventDefault();
             const serviceId = serviceDetailIdSpan?.textContent;
             if(serviceId) handleSaveServiceDetail(serviceId); // Save function handles note add
        });

        // --- Customer Section Actions ---
        customerTable?.addEventListener('click', handleCustomerTableClick); // Delegated click
         customerDetailView?.querySelector('#customer-notes button')?.addEventListener('click', (e) => { // Save note button
             e.preventDefault();
             const customerId = customerDetailView?.dataset.customerId; // Assuming ID is stored on the view container
             if (customerId) handleSaveCustomerNote(customerId);
         });
        // Customer detail tabs are setup inside showCustomerDetail after rendering

        // --- Settings Section Actions ---
        // VNPAY toggle specific listener
        if (vnpayEnabledCheckbox && vnpayDetailsDiv) {
            const handleVnpayToggle = () => { vnpayDetailsDiv.style.display = vnpayEnabledCheckbox.checked ? 'block' : 'none'; };
            vnpayEnabledCheckbox.addEventListener('change', handleVnpayToggle);
            handleVnpayToggle(); // Initial check
        }
        // Add form submission handlers for settings tabs
         document.getElementById('generalSettingsForm')?.addEventListener('submit', handleGeneralSettingsSubmit);
         document.getElementById('settings-payments')?.querySelector('button.btn-primary')?.addEventListener('click', handlePaymentSettingsSubmit); // Listen on button if not a form
         // TODO: Add listeners for save buttons in Shipping, Emails, SEO tabs


        // --- Content Section Actions ---
        // Add listeners for Add/Edit/Delete buttons within content tabs if needed

        // --- Generic Close Detail Button ---
        closeDetailButtons.forEach(button => {
            button.addEventListener('click', () => hideAllDetailViews(activeAdminSectionId));
        });

        // --- Window Resize Listener ---
        window.addEventListener('resize', () => {
             // Close mobile overlay if window becomes large while mobile sidebar is open
             if (window.innerWidth > 992 && document.body.classList.contains('sidebar-open-overlay')) {
                 toggleMobileSidebarOverlay(false);
                 sidebar?.classList.remove('active'); // Ensure sidebar is not stuck in active state
             }
             // Adjust sidebar state based on new width if needed (e.g., force collapse/expand)
             resizeAllCharts(); // Resize charts on window resize
        });

        console.log("Event listeners setup complete.");
    }


    // =========================================================================
    // Initialization
    // =========================================================================
    function initializeAdminDashboard() {
        console.log("Initializing Admin Dashboard...");
        setupEventListeners();
        setActiveSection('dashboard'); // Load dashboard section by default
         // Initial load of notifications for the badge count
         loadNotifications();
        console.log("Admin Dashboard Initialized.");
    }

    initializeAdminDashboard(); // Start the application

}); // End DOMContentLoaded

