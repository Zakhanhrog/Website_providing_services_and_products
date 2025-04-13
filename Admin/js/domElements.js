// js/domElements.js

// --- Layout & Core UI ---
export const sidebar = document.getElementById('adminSidebar');
export const sidebarToggle = document.getElementById('sidebarToggle');
export const sidebarLinks = document.querySelectorAll('.admin-sidebar .sidebar-link');
export const adminSections = document.querySelectorAll('.admin-section');
export const mainContent = document.getElementById('adminMainContent');
export const adminContainer = document.querySelector('.admin-container'); // For loading overlay

// --- Header ---
export const notificationBell = document.getElementById('adminNotificationBell');
export const notificationPanel = document.getElementById('adminNotificationPanel');
export const notificationList = document.getElementById('adminNotificationList');
export const clearAdminNotificationsBtn = document.getElementById('clearAdminNotifications');
export const userMenuToggle = document.getElementById('adminUserMenuToggle');
export const userDropdown = document.getElementById('adminUserDropdown');
export const notificationCountBadge = document.getElementById('adminNotificationCount');

// --- Logout Links ---
export const logoutLinkSidebar = document.getElementById('adminLogoutLink');
export const logoutLinkDropdown = document.getElementById('adminLogoutLinkDropdown');

// --- Dashboard ---
export const dashboardSection = document.getElementById('dashboard-section');
export const revenueChartCtx = document.getElementById('revenueChart')?.getContext('2d');
export const orderStatusChartCtx = document.getElementById('orderStatusChart')?.getContext('2d');
export const topProductsChartCtx = document.getElementById('topProductsChart')?.getContext('2d');
// KPI Elements (Example - add more if needed)
export const kpiRevenueToday = document.getElementById('kpiRevenueToday');
export const kpiRevenueChange = document.getElementById('kpiRevenueChange');
export const kpiNewOrders = document.getElementById('kpiNewOrders');
export const kpiNewOrdersStatus = document.getElementById('kpiNewOrdersStatus');
export const kpiNewServices = document.getElementById('kpiNewServices');
export const kpiNewServicesStatus = document.getElementById('kpiNewServicesStatus');
export const kpiLowStock = document.getElementById('kpiLowStock');
export const kpiLowStockStatus = document.getElementById('kpiLowStockStatus');
// Quick Lists (Example - add more if needed)
export const quickListRecentOrders = document.getElementById('quickListRecentOrders');
export const quickListRecentServices = document.getElementById('quickListRecentServices');
export const quickListLowStockProducts = document.getElementById('quickListLowStockProducts');
export const quickListActivityLog = document.getElementById('quickListActivityLog');


// --- Reports ---
export const reportsSection = document.getElementById('reports-section');
export const reportRevenueChartCtx = document.getElementById('reportRevenueChart')?.getContext('2d');
export const reportTopProductsChartCtx = document.getElementById('reportTopProductsChart')?.getContext('2d');
// Report Summary Elements (Example - add more)
export const reportLowStockCount = document.getElementById('reportLowStockCount');
export const reportOutOfStockCount = document.getElementById('reportOutOfStockCount');
export const reportInventoryValue = document.getElementById('reportInventoryValue');
export const reportNewCustomers = document.getElementById('reportNewCustomers');
export const reportReturningRate = document.getElementById('reportReturningRate');
export const reportTotalServices = document.getElementById('reportTotalServices');
export const reportAvgServiceTime = document.getElementById('reportAvgServiceTime');


// --- Products ---
export const productsSection = document.getElementById('products-section');
export const addProductBtn = productsSection?.querySelector('.btn-add-product');
export const productFormContainer = document.getElementById('product-form-container');
export const productForm = document.getElementById('productForm');
export const cancelProductBtn = productFormContainer?.querySelector('.btn-cancel-product');
export const productFormTabs = productFormContainer?.querySelectorAll('.product-form-tabs .tab-link');
export const productFormTabContents = productFormContainer?.querySelectorAll('#product-form-container > .tab-content');
export const manageStockCheckbox = document.getElementById('manageStock');
export const stockFields = productFormContainer?.querySelectorAll('.stock-fields');
export const productListView = productsSection?.querySelector('.table-responsive');
export const productTableBody = productsSection?.querySelector('.admin-table tbody');
export const productPagination = productsSection?.querySelector('.pagination-container');
export const productFiltersContainer = productsSection?.querySelector('.filters-container'); // Renamed for clarity
export const productBulkActionsContainer = productsSection?.querySelector('.bulk-actions-container'); // Renamed
export const selectAllProductsCheckbox = document.getElementById('selectAllProducts');
export const productTable = productsSection?.querySelector('.admin-table');
export const productBulkActionSelect = document.getElementById('productBulkAction');
export const applyProductBulkActionBtn = document.getElementById('applyProductBulkAction');
// Product Form Fields (Example - Add specific fields if needed often)
export const productNameInput = document.getElementById('productName');
export const productDescriptionTextarea = document.getElementById('productDescription');
export const productCategorySelect = document.getElementById('productCategory');


// --- Orders ---
export const ordersSection = document.getElementById('orders-section');
export const orderListView = ordersSection?.querySelector('.table-responsive');
export const orderTableBody = ordersSection?.querySelector('.admin-table tbody');
export const orderPagination = ordersSection?.querySelector('.pagination-container');
export const orderFiltersContainer = ordersSection?.querySelector('.filters-container');
export const orderBulkActionsContainer = ordersSection?.querySelector('.bulk-actions-container');
export const selectAllOrdersCheckbox = document.getElementById('selectAllOrders');
export const orderTable = ordersSection?.querySelector('.admin-table');
export const orderBulkActionSelect = document.getElementById('orderBulkAction');
export const applyOrderBulkActionBtn = document.getElementById('applyOrderBulkAction');
export const orderDetailView = document.getElementById('order-detail-view');
export const orderDetailContent = document.getElementById('orderDetailContentPlaceholder');
export const orderDetailIdSpan = document.getElementById('detailOrderId');
// Order Detail Fields (Example)
export const detailOrderStatusSelect = document.getElementById('detailOrderStatus');
export const trackingCodeInput = document.getElementById('trackingCode');
export const internalNoteTextarea = document.getElementById('internalNote');


// --- Services ---
export const servicesSection = document.getElementById('services-section');
export const serviceTable = servicesSection?.querySelector('.admin-table');
export const serviceTableBody = servicesSection?.querySelector('.admin-table tbody');
export const servicePagination = servicesSection?.querySelector('.pagination-container');
export const serviceFiltersContainer = servicesSection?.querySelector('.filters-container');
export const serviceDetailView = document.getElementById('service-detail-view');
export const serviceDetailContent = document.getElementById('serviceDetailContentPlaceholder');
export const serviceDetailIdSpan = document.getElementById('detailServiceId');
// Service Detail Fields (Example)
export const detailServiceStatusSelect = document.getElementById('detailServiceStatus');
export const detailServiceAssigneeSelect = document.getElementById('detailServiceAssignee');
export const serviceInternalNoteTextarea = document.getElementById('serviceInternalNote');

// --- Customers ---
export const customersSection = document.getElementById('customers-section');
export const customerTable = customersSection?.querySelector('.admin-table');
export const customerTableBody = customersSection?.querySelector('.admin-table tbody');
export const customerPagination = customersSection?.querySelector('.pagination-container');
export const customerFiltersContainer = customersSection?.querySelector('.filters-container');
export const customerDetailView = document.getElementById('customer-detail-view');
export const customerDetailContent = document.getElementById('customerDetailContentPlaceholder');
export const customerDetailNameSpan = document.getElementById('detailCustomerName');
export const customerDetailTabs = customerDetailView?.querySelectorAll('.customer-detail-tabs .tab-link');
export const customerDetailTabContents = customerDetailView?.querySelectorAll('#customerDetailContentPlaceholder > .tab-content');
// Customer Detail Fields (Example)
export const customerAdminNoteTextarea = document.getElementById('customerAdminNote');
export const saveCustomerNoteBtn = document.getElementById('saveCustomerNoteBtn');

// --- Content ---
export const contentSection = document.getElementById('content-section');
export const contentTabs = contentSection?.querySelectorAll('.content-tabs .tab-link');
export const contentTabContents = contentSection?.querySelectorAll('#content-section > .tab-content');

// --- Settings ---
export const settingsSection = document.getElementById('settings-section');
export const settingsTabs = settingsSection?.querySelectorAll('.settings-tabs .tab-link');
export const settingsTabContents = settingsSection?.querySelectorAll('#settings-section > .tab-content');
export const vnpayEnabledCheckbox = document.getElementById('vnpayEnabled');
export const vnpayDetailsDiv = vnpayEnabledCheckbox?.closest('.payment-gateway-setting')?.querySelector('.gateway-details');
// Settings Forms (Example)
export const generalSettingsForm = document.getElementById('generalSettingsForm');
export const paymentSettingsSaveBtn = document.getElementById('savePaymentSettingsBtn');
export const shippingSettingsSaveBtn = document.getElementById('saveShippingSettingsBtn');
export const emailSettingsSaveBtn = document.getElementById('saveEmailSettingsBtn');
export const seoSettingsForm = document.getElementById('seoSettingsForm');


// --- Admins ---
export const adminsSection = document.getElementById('admins-section');
export const adminAccountsTableBody = document.getElementById('adminAccountsTableBody');
export const addAdminBtn = adminsSection?.querySelector('.btn-add-admin');


// --- Generic / Modals ---
export const closeDetailButtons = document.querySelectorAll('.btn-close-detail');
export const modalOverlay = document.getElementById('adminModalOverlay');
export const confirmModal = document.getElementById('adminConfirmModal');
export const confirmModalMessage = confirmModal?.querySelector('.modal-message');
export const confirmModalConfirmBtn = confirmModal?.querySelector('.btn-confirm');
export const confirmModalCancelBtn = confirmModal?.querySelector('.btn-cancel');

console.log("DOM Elements mapped"); // Debug log