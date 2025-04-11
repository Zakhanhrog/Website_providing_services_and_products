document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // DOM Element References
    // =========================================================================
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.admin-sidebar .sidebar-link');
    const adminSections = document.querySelectorAll('.admin-section');
    const mainContent = document.getElementById('adminMainContent');

    // Header elements
    const notificationBell = document.getElementById('adminNotificationBell');
    const notificationPanel = document.getElementById('adminNotificationPanel');
    const notificationList = document.getElementById('adminNotificationList');
    const clearAdminNotificationsBtn = document.getElementById('clearAdminNotifications');
    const userMenuToggle = document.getElementById('adminUserMenuToggle');
    const userDropdown = document.getElementById('adminUserDropdown');

    // Logout Links
    const logoutLinkSidebar = document.getElementById('adminLogoutLink');
    const logoutLinkDropdown = document.getElementById('adminLogoutLinkDropdown');

    // Dashboard elements
    const revenueChartCtx = document.getElementById('revenueChart')?.getContext('2d');
    const orderStatusChartCtx = document.getElementById('orderStatusChart')?.getContext('2d');
    const topProductsChartCtx = document.getElementById('topProductsChart')?.getContext('2d');
    const reportRevenueChartCtx = document.getElementById('reportRevenueChart')?.getContext('2d');
    const reportTopProductsChartCtx = document.getElementById('reportTopProductsChart')?.getContext('2d');
    const dashboardSection = document.getElementById('dashboard-section');

    // Product elements
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
    const productPagination = productsSection?.querySelector('.pagination-container');
    const productFilters = productsSection?.querySelector('.filters-container');
    const productBulkActions = productsSection?.querySelector('.bulk-actions-container');
    const selectAllProductsCheckbox = document.getElementById('selectAllProducts');
    const productTable = productsSection?.querySelector('.admin-table');
    const productBulkActionSelect = document.getElementById('productBulkAction');
    const applyProductBulkActionBtn = document.getElementById('applyProductBulkAction');

    // Order elements
    const ordersSection = document.getElementById('orders-section');
    const orderListView = ordersSection?.querySelector('.table-responsive');
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

    // Service elements
    const servicesSection = document.getElementById('services-section');
    const serviceTable = servicesSection?.querySelector('.admin-table');
    const serviceDetailView = document.getElementById('service-detail-view');
    const serviceDetailContent = document.getElementById('serviceDetailContentPlaceholder');
    const serviceDetailIdSpan = document.getElementById('detailServiceId');

    // Customer elements
    const customersSection = document.getElementById('customers-section');
    const customerTable = customersSection?.querySelector('.admin-table');
    const customerDetailView = document.getElementById('customer-detail-view');
    const customerDetailContent = document.getElementById('customerDetailContentPlaceholder');
    const customerDetailNameSpan = document.getElementById('detailCustomerName');
    const customerDetailTabs = customerDetailView?.querySelectorAll('.customer-detail-tabs .tab-link');
    const customerDetailTabContents = customerDetailView?.querySelectorAll('#customerDetailContentPlaceholder > .tab-content'); // Direct children

    // Content elements
    const contentSection = document.getElementById('content-section');
    const contentTabs = contentSection?.querySelectorAll('.content-tabs .tab-link');
    const contentTabContents = contentSection?.querySelectorAll('#content-section > .tab-content'); // Direct children

    // Settings elements
    const settingsSection = document.getElementById('settings-section');
    const settingsTabs = settingsSection?.querySelectorAll('.settings-tabs .tab-link');
    const settingsTabContents = settingsSection?.querySelectorAll('#settings-section > .tab-content'); // Direct children
    const vnpayEnabledCheckbox = document.getElementById('vnpayEnabled');
    const vnpayDetailsDiv = vnpayEnabledCheckbox?.closest('.payment-gateway-setting')?.querySelector('.gateway-details');


    // Generic detail view close buttons
    const closeDetailButtons = document.querySelectorAll('.btn-close-detail');

    // =========================================================================
    // State Variables
    // =========================================================================
    let activeAdminSectionId = 'dashboard';
    let charts = {}; // Store chart instances

    // =========================================================================
    // Utility Functions
    // =========================================================================
    function formatAdminCurrency(amount) {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) return '0đ';
        return numericAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    function showElement(element, displayType = 'block') { // Default to block
        if (element) element.style.display = displayType;
    }
    function hideElement(element) {
        if (element) element.style.display = 'none';
    }
    function flexElement(element) {
        showElement(element, 'flex');
    }

    // =========================================================================
    // Core UI Functions
    // =========================================================================

    function handleSidebarToggle() {
        if (!sidebar || !mainContent) return;
        if (window.innerWidth <= 992) {
            const isActive = sidebar.classList.toggle('active');
            toggleMobileSidebarOverlay(isActive);
        } else {
            const isCollapsed = sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
            setTimeout(() => { resizeAllCharts(); }, 350);
        }
    }

    function toggleMobileSidebarOverlay(isActive) {
        if (window.innerWidth <= 992) {
            document.body.classList.toggle('sidebar-open-overlay', isActive);
            document.body.classList.toggle('sidebar-active', isActive);
        }
    }

    function toggleDropdown(panel, button) {
        if (!panel || !button) return;
        const isActive = panel.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) panel.classList.add('active');
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.notification-panel.active, .user-dropdown.active').forEach(panel => {
            panel.classList.remove('active');
        });
    }

    function setActiveSection(sectionId) {
        if (!sectionId || activeAdminSectionId === sectionId) return; // No change if already active
        const previousSectionId = activeAdminSectionId;
        activeAdminSectionId = sectionId;

        sidebarLinks.forEach(link => link.classList.toggle('active', link.dataset.section === sectionId));
        adminSections.forEach(section => section.classList.toggle('active', section.id === `${sectionId}-section`));

        if (window.innerWidth <= 992 && sidebar?.classList.contains('active')) {
            sidebar.classList.remove('active');
            toggleMobileSidebarOverlay(false);
        }

        hideAllDetailViews(previousSectionId); // Hide details before switching
        restoreListView(sectionId); // Restore list view for the new section
        mainContent?.scrollTo(0, 0);
        console.log(`Switched to section: ${sectionId}`);

        if (sectionId === 'dashboard' || sectionId === 'reports') {
            initChartsForSection(sectionId); // Initialize relevant charts
        } else {
            destroyCharts(); // Destroy charts when leaving dashboard/reports
        }
        // Setup tabs for the newly activated section if they exist
        setupSectionTabs(sectionId);
    }

    // Setup tabs based on the active section
    function setupSectionTabs(sectionId) {
        switch(sectionId) {
            case 'content':
                setupTabs(contentTabs, contentTabContents);
                break;
            case 'settings':
                setupTabs(settingsTabs, settingsTabContents);
                break;
            // Product form and Customer detail tabs are handled when shown
        }
    }

    function setupTabs(tabLinks, tabContents) {
        if (!tabLinks || tabLinks.length === 0 || !tabContents || tabContents.length === 0) {
            // console.log("Skipping tab setup: No links or content found.");
            return;
        }

        tabLinks.forEach(link => {
            link.removeEventListener('click', handleTabClick); // Remove old listener first
            link.addEventListener('click', handleTabClick);
        });

        // Ensure the first tab is active if none are
        const activeLink = Array.from(tabLinks).find(l => l.classList.contains('active'));
        if (!activeLink && tabLinks.length > 0) {
            // console.log("Activating first tab by default");
            tabLinks[0].click(); // Simulate click to trigger activation logic
        } else if (activeLink) {
            // Ensure corresponding content is active if link is already active
            const targetId = activeLink.dataset.tab;
            const targetContent = document.getElementById(targetId);
            if (targetContent && !targetContent.classList.contains('active')) {
                // console.log(`Manually activating content for already active tab: ${targetId}`);
                tabContents.forEach(c => c.classList.remove('active'));
                targetContent.classList.add('active');
            }
        }
    }

    function handleTabClick(event) {
        event.preventDefault();
        const clickedLink = event.currentTarget;
        const tabId = clickedLink.dataset.tab;
        if (!tabId) return;

        const parentNav = clickedLink.closest('.tabs');
        if (!parentNav) return;

        const siblingLinks = parentNav.querySelectorAll('.tab-link');
        const siblingContents = parentNav.parentElement.querySelectorAll(':scope > .tab-content'); // Direct children content

        siblingLinks.forEach(l => l.classList.remove('active'));
        siblingContents.forEach(c => c.classList.remove('active'));

        clickedLink.classList.add('active');
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        } else {
            console.warn(`Tab content with id "${tabId}" not found.`);
        }
    }


    function hideAllDetailViews(sectionIdToRestoreList = null) {
        hideElement(productFormContainer);
        hideElement(orderDetailView);
        hideElement(serviceDetailView);
        hideElement(customerDetailView);
        if(sectionIdToRestoreList) {
            restoreListView(sectionIdToRestoreList);
        }
    }

    function restoreListView(sectionId) {
        // Only restore if the specified section is currently active
        if (sectionId !== activeAdminSectionId) return;

        switch(sectionId) {
            case 'products':
                showElement(productListView, 'block'); // Table is block
                showElement(productPagination, 'block'); // Pagination container
                flexElement(productFilters);
                flexElement(productBulkActions);
                break;
            case 'orders':
                showElement(orderListView, 'block');
                showElement(orderPagination, 'block');
                flexElement(orderFilters);
                flexElement(orderBulkActions);
                break;
            case 'services':
                showElement(servicesSection?.querySelector('.table-responsive'), 'block');
                showElement(servicesSection?.querySelector('.pagination-container'), 'block');
                flexElement(servicesSection?.querySelector('.filters-container'));
                break;
            case 'customers':
                showElement(customersSection?.querySelector('.table-responsive'), 'block');
                showElement(customersSection?.querySelector('.pagination-container'), 'block');
                flexElement(customersSection?.querySelector('.filters-container'));
                break;
        }
    }

    // =========================================================================
    // Charting Functions
    // =========================================================================
    function destroyCharts() {
        Object.values(charts).forEach(chart => chart?.destroy());
        charts = {};
    }

    function resizeAllCharts() {
        Object.values(charts).forEach(chart => chart?.resize());
    }

    function initChartsForSection(sectionId) {
        destroyCharts(); // Clear existing charts
        console.log(`Initializing charts for section: ${sectionId}`);

        const commonOptions = {
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: 'rgba(245, 246, 250, 0.8)' } } },
            scales: {
                x: { ticks: { color: 'rgba(245, 246, 250, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: 'rgba(245, 246, 250, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' }, beginAtZero: true }
            }
        };
        const doughnutOptions = { ...commonOptions, scales: {} }; // No scales needed

        try {
            if (sectionId === 'dashboard') {
                // Mock Data
                const revenueData = { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Doanh thu', data: [12, 19, 10, 25, 18, 30, 15.5].map(v => v*1000000), borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.4 }] };
                const orderStatusData = { labels: ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'], datasets: [{ data: [8, 15, 55, 5], backgroundColor: ['#fdcb6e', '#0984e3', '#00b894', '#d63031'], hoverOffset: 4 }] };
                const topProductsData = { labels: ['Laptop ABC', 'Phone XYZ', 'Mouse Pro', 'SSD 1TB', 'Keyboard G'], datasets: [{ label: 'Số lượng bán', data: [50, 85, 120, 60, 90], backgroundColor: '#a29bfe', borderColor: '#a29bfe', borderWidth: 1 }] };

                if (revenueChartCtx) charts.revenue = new Chart(revenueChartCtx, { type: 'line', data: revenueData, options: commonOptions });
                if (orderStatusChartCtx) charts.orderStatus = new Chart(orderStatusChartCtx, { type: 'doughnut', data: orderStatusData, options: doughnutOptions });
                if (topProductsChartCtx) charts.topProducts = new Chart(topProductsChartCtx, { type: 'bar', data: topProductsData, options: commonOptions });

            } else if (sectionId === 'reports') {
                // Mock Report Data (similar structure, maybe different values)
                const reportRevenueData = { labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4'], datasets: [{ label: 'Doanh thu tháng', data: [50, 75, 60, 90].map(v => v*1000000), borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.1 }] };
                const reportProductsData = { labels: ['Laptop ABC', 'Phone XYZ', 'Mouse Pro'], datasets: [{ label: 'Doanh thu SP', data: [300, 250, 150].map(v => v*100000), backgroundColor: '#a29bfe', borderColor: '#a29bfe', borderWidth: 1 }] };

                if (reportRevenueChartCtx) charts.reportRevenue = new Chart(reportRevenueChartCtx, { type: 'line', data: reportRevenueData, options: commonOptions });
                if (reportTopProductsChartCtx) charts.reportTopProducts = new Chart(reportTopProductsChartCtx, { type: 'bar', data: reportProductsData, options: commonOptions });
            }
        } catch (error) {
            console.error("Error initializing charts:", error);
        }
    }

    // =========================================================================
    // Specific Section Logic
    // =========================================================================

    // --- Product Form ---
    function showProductForm(productId = null) {
        if (!productFormContainer || !productsSection) return;
        hideElement(productListView); hideElement(productPagination); hideElement(productFilters); hideElement(productBulkActions);
        showElement(productFormContainer);
        mainContent?.scrollTo(0, 0);

        const formTitle = productFormContainer.querySelector('h3');
        if (productForm) productForm.reset();
        handleStockCheckboxChange(); // Reset stock field visibility
        // TODO: Reset WYSIWYG, image previews, select2/choices fields

        if (productId) {
            if (formTitle) formTitle.textContent = `Sửa Sản Phẩm #${productId}`;
            console.log(`Populating form for editing product ${productId} (Simulation)`);
            // --- Simulation ---
            document.getElementById('productName')?.setAttribute('value', `Sản phẩm ${productId} Đã sửa`);
            document.getElementById('productPrice')?.setAttribute('value', '999000');
            document.getElementById('productStock')?.setAttribute('value', '8');
            // --- End Simulation ---
            // TODO: API call to get data and populate ALL form fields
        } else {
            if (formTitle) formTitle.textContent = 'Thêm Sản Phẩm Mới';
        }
        // Ensure first tab is active after potential reset/population
        setupTabs(productFormTabs, productFormTabContents);
    }

    function hideProductForm() {
        hideElement(productFormContainer);
        if(activeAdminSectionId === 'products') restoreListView('products');
    }

    function handleStockCheckboxChange() {
        if (manageStockCheckbox && stockFields?.length > 0) {
            const displayType = manageStockCheckbox.checked ? 'block' : 'none';
            stockFields.forEach(fieldGroup => { fieldGroup.style.display = displayType; });
        }
    }

    // --- Order Detail ---
    function showOrderDetail(orderId) {
        if (!orderDetailView || !orderDetailContent || !orderDetailIdSpan || !ordersSection) return;
        console.log(`Showing details for order ${orderId}`);
        hideElement(orderListView); hideElement(orderPagination); hideElement(orderFilters); hideElement(orderBulkActions);
        orderDetailIdSpan.textContent = orderId;
        // --- Simulation ---
        orderDetailContent.innerHTML = `
            <p>Đang tải chi tiết đơn hàng #${orderId}...</p>
            <div class="order-detail-grid">
                <div class="order-detail-col"><h4>Thông tin chung</h4>...</div>
                <div class="order-detail-col"><h4>Sản phẩm & Tổng cộng</h4>...</div>
                <div class="order-detail-col"><h4>Vận chuyển & Ghi chú</h4>...</div>
            </div>
            <div class="order-history-log"><h4>Lịch sử đơn hàng</h4><ul><li>...</li></ul></div>
            <div class="form-actions">...</div>`; // More detailed placeholder
        // --- End Simulation ---
        // TODO: API call + Render detailed HTML into orderDetailContent
        showElement(orderDetailView);
        mainContent?.scrollTo(0, 0);
    }

    // --- Service Detail ---
    function showServiceDetail(serviceId) {
        if (!serviceDetailView || !serviceDetailContent || !serviceDetailIdSpan || !servicesSection) return;
        console.log(`Showing details for service request ${serviceId}`);
        hideElement(servicesSection?.querySelector('.table-responsive'));
        hideElement(servicesSection?.querySelector('.pagination-container'));
        hideElement(servicesSection?.querySelector('.filters-container'));

        serviceDetailIdSpan.textContent = serviceId;
        // --- Simulation ---
        serviceDetailContent.innerHTML = `
            <div class="service-detail-grid">
                <div class="service-detail-col"><h4>Thông tin Yêu cầu & KH</h4>...</div>
                <div class="service-detail-col"><h4>Mô tả & Phân công</h4>...</div>
            </div>
            <div class="internal-notes-section"><h4>Ghi chú / Trao đổi</h4>...</div>
            <div class="form-actions">...</div>`;
        // --- End Simulation ---
        // TODO: API call + Render details
        showElement(serviceDetailView);
        mainContent?.scrollTo(0, 0);
    }

    // --- Customer Detail ---
    function showCustomerDetail(customerId) {
        if (!customerDetailView || !customerDetailContent || !customerDetailNameSpan || !customersSection) return;
        console.log(`Showing details for customer ${customerId}`);
        hideElement(customersSection?.querySelector('.table-responsive'));
        hideElement(customersSection?.querySelector('.pagination-container'));
        hideElement(customersSection?.querySelector('.filters-container'));

        // --- Simulation ---
        customerDetailNameSpan.textContent = `Khách hàng Demo ${customerId}`;
        customerDetailContent.innerHTML = `<!-- Remember to keep the tab content divs -->
            <div id="customer-info" class="tab-content active"><p><strong>Email:</strong> demo${customerId}@email.com</p><p><strong>SĐT:</strong> 090xxxx${customerId}${customerId}${customerId}</p>...</div>
            <div id="customer-addresses" class="tab-content"><div class="address-list"><div class="address-item">Địa chỉ demo...</div></div>...</div>
            <div id="customer-order-history" class="tab-content table-responsive"><table class="admin-table mini-table">...</table></div>
            <div id="customer-service-history" class="tab-content table-responsive"><table class="admin-table mini-table">...</table></div>
            <div id="customer-notes" class="tab-content"><textarea class="form-control" rows="5"></textarea>...</div>`;
        // --- End Simulation ---
        // TODO: API call + Render details into the correct tab divs

        showElement(customerDetailView);
        // Setup tabs AFTER content might be potentially loaded/structured
        setupTabs(customerDetailTabs, customerDetailView.querySelectorAll('#customerDetailContentPlaceholder > .tab-content'));
        mainContent?.scrollTo(0, 0);
    }


    // --- Table Selection Helper ---
    function handleTableSelection(selectAllCheckbox, itemCheckboxesSelector, parentElement = document) {
        const checkboxes = parentElement.querySelectorAll(itemCheckboxesSelector);
        if (!selectAllCheckbox || checkboxes.length === 0) return;

        selectAllCheckbox.removeEventListener('change', handleSelectAllChange); // Remove previous listener
        selectAllCheckbox.addEventListener('change', handleSelectAllChange);

        checkboxes.forEach(checkbox => {
            checkbox.removeEventListener('change', handleItemCheckboxChange); // Remove previous
            checkbox.addEventListener('change', handleItemCheckboxChange);
        });

        function handleSelectAllChange() {
            checkboxes.forEach(checkbox => { checkbox.checked = selectAllCheckbox.checked; });
            updateBulkActionState(checkboxes); // Update button state
        }

        function handleItemCheckboxChange() {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const noneChecked = Array.from(checkboxes).every(cb => !cb.checked);
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
            updateBulkActionState(checkboxes); // Update button state
        }
        // Initial check in case checkboxes are pre-selected (e.g., navigating back)
        handleItemCheckboxChange();
    }

    // Helper to enable/disable bulk action button (example)
    function updateBulkActionState(checkboxes) {
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        const bulkButton = checkboxes[0]?.closest('section')?.querySelector('.bulk-actions-container button'); // Find related button
        if(bulkButton) {
            bulkButton.disabled = !anyChecked;
        }
    }


    // =========================================================================
    // Event Listeners Setup
    // =========================================================================

    // --- Sidebar Links ---
    sidebarLinks.forEach(link => {
        if (link.dataset.section) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                setActiveSection(link.dataset.section);
            });
        }
    });

    // --- Sidebar Toggle ---
    if (sidebarToggle) sidebarToggle.addEventListener('click', handleSidebarToggle);

    // --- Header Dropdowns ---
    if (notificationBell) notificationBell.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(notificationPanel, notificationBell); });
    if (userMenuToggle) userMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(userDropdown, userMenuToggle); });
    document.addEventListener('click', (e) => {
        const clickedOutsideDropdowns = ![notificationBell, notificationPanel, userMenuToggle, userDropdown].some(el => el?.contains(e.target));
        const clickedOutsideSidebar = window.innerWidth <= 992 && sidebar?.classList.contains('active') && !sidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle.contains(e.target);

        if (clickedOutsideDropdowns) closeAllDropdowns();
        if (clickedOutsideSidebar) {
            sidebar.classList.remove('active');
            toggleMobileSidebarOverlay(false);
        }
    });

    // --- Logout ---
    if (logoutLinkSidebar) logoutLinkSidebar.addEventListener('click', handleAdminLogout);
    if (logoutLinkDropdown) logoutLinkDropdown.addEventListener('click', handleAdminLogout);

    // --- Notifications ---
    if(clearAdminNotificationsBtn && notificationList){
        clearAdminNotificationsBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            console.log("Marking all admin notifications as read (Simulation)");
            notificationList.querySelectorAll('li.unread').forEach(li => li.classList.remove('unread'));
            document.getElementById('adminNotificationCount').textContent = '0'; // Update badge
            // TODO: API call
        });
        notificationList.addEventListener('click', (e)=>{
            const item = e.target.closest('li[data-notif-id]');
            if(item){
                console.log(`Marking notification ${item.dataset.notifId} as read (Simulation)`);
                item.classList.remove('unread');
                // Update badge count (simple decrement for demo)
                const badge = document.getElementById('adminNotificationCount');
                let count = parseInt(badge.textContent);
                if(count > 0) badge.textContent = count - 1;
                // TODO: API call
            }
        })
    }

    // --- Dashboard Section Actions ---
    if (dashboardSection) {
        dashboardSection.addEventListener('click', handleDashboardClick);
    }

    // --- Product Section Actions ---
    if (productsSection) {
        if (addProductBtn) addProductBtn.addEventListener('click', () => showProductForm());
        if (cancelProductBtn) cancelProductBtn.addEventListener('click', hideProductForm);
        if (manageStockCheckbox) manageStockCheckbox.addEventListener('change', handleStockCheckboxChange);
        if (productTable) productTable.addEventListener('click', handleProductTableClick);
        handleTableSelection(selectAllProductsCheckbox, '.product-checkbox', productsSection);
        if(applyProductBulkActionBtn) applyProductBulkActionBtn.addEventListener('click', handleProductBulkAction);
        setupTabs(productFormTabs, productFormTabContents); // Setup form tabs initially
    }

    // --- Order Section Actions ---
    if(ordersSection) {
        if (orderTable) orderTable.addEventListener('click', handleOrderTableClick);
        handleTableSelection(selectAllOrdersCheckbox, '.order-checkbox', ordersSection);
        if(applyOrderBulkActionBtn) applyOrderBulkActionBtn.addEventListener('click', handleOrderBulkAction);
    }

    // --- Service Section Actions ---
    if (servicesSection) {
        if (serviceTable) serviceTable.addEventListener('click', handleServiceTableClick);
        if (serviceTable) serviceTable.addEventListener('change', handleServiceInlineChange); // For dropdowns
    }

    // --- Customer Section Actions ---
    if (customersSection) {
        if (customerTable) customerTable.addEventListener('click', handleCustomerTableClick);
        // Tabs are setup inside showCustomerDetail
    }

    // --- Settings Section Actions ---
    if (settingsSection) {
        setupTabs(settingsTabs, settingsTabContents); // Setup main settings tabs
        // Listener for VNPAY toggle
        if(vnpayEnabledCheckbox && vnpayDetailsDiv) {
            vnpayEnabledCheckbox.addEventListener('change', () => {
                vnpayDetailsDiv.style.display = vnpayEnabledCheckbox.checked ? 'block' : 'none';
            });
            // Initial check
            vnpayDetailsDiv.style.display = vnpayEnabledCheckbox.checked ? 'block' : 'none';
        }
        // Add form submission handlers for settings tabs if needed
        // Example: document.getElementById('generalSettingsForm')?.addEventListener('submit', handleGeneralSettingsSubmit);
    }

    // --- Content Section Actions ---
    if (contentSection) {
        setupTabs(contentTabs, contentTabContents);
        // Add listeners for Add/Edit/Delete buttons within content tabs
    }


    // --- Generic Close Detail Button ---
    closeDetailButtons.forEach(button => {
        button.addEventListener('click', () => hideAllDetailViews(activeAdminSectionId)); // Pass current section to restore its list
    });

    // =========================================================================
    // Action Handler Functions (Delegated Clicks, Changes, etc.)
    // =========================================================================

    function handleDashboardClick(event) {
        const kpiCard = event.target.closest('.kpi-card.clickable');
        const viewOrderBtn = event.target.closest('.btn-view-order');
        const viewServiceBtn = event.target.closest('.btn-view-service');
        const editProductBtn = event.target.closest('.btn-edit-product');
        const viewCustomerLink = event.target.closest('.activity-log .link-view-customer'); // Example from activity log

        if (kpiCard) {
            const targetSection = kpiCard.dataset.targetSection;
            const filterStatus = kpiCard.dataset.filterStatus;
            if (targetSection) {
                setActiveSection(targetSection);
                // TODO: Apply filter later
                console.log(`KPI Click: Navigate to ${targetSection}` + (filterStatus ? ` & filter by ${filterStatus}` : ''));
            }
        } else if (viewOrderBtn) {
            const orderId = viewOrderBtn.dataset.orderId;
            setActiveSection('orders');
            setTimeout(() => showOrderDetail(orderId), 50);
        } else if (viewServiceBtn) {
            const serviceId = viewServiceBtn.dataset.serviceId;
            setActiveSection('services');
            setTimeout(() => showServiceDetail(serviceId), 50);
        } else if (editProductBtn) {
            const productId = editProductBtn.dataset.productId;
            setActiveSection('products');
            setTimeout(() => showProductForm(productId), 50);
        } else if (viewCustomerLink){
            event.preventDefault();
            const customerId = viewCustomerLink.dataset.customerId;
            setActiveSection('customers');
            setTimeout(() => showCustomerDetail(customerId), 50);
        }
        // Handle other dashboard interactions
    }

    function handleProductTableClick(event) {
        const editButton = event.target.closest('.btn-edit-product, .link-edit-product');
        const deleteButton = event.target.closest('.btn-delete-product');
        // Add handlers for View on Web, Duplicate buttons if needed

        if (editButton) {
            event.preventDefault();
            const productId = editButton.dataset.productId;
            showProductForm(productId);
        } else if (deleteButton) {
            const productId = deleteButton.dataset.productId;
            const productName = deleteButton.closest('tr')?.querySelector('td:nth-child(3) a')?.textContent || `ID ${productId}`;
            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
                console.log(`Deleting product ${productId} (Simulation)`);
                deleteButton.closest('tr')?.remove();
                alert(`Đã xóa sản phẩm "${productName}" (Simulation).`);
                // TODO: API call
            }
        }
    }

    function handleProductBulkAction() {
        const selectedAction = productBulkActionSelect?.value;
        const selectedCheckboxes = productsSection?.querySelectorAll('.product-checkbox:checked');
        if (!selectedAction || !selectedCheckboxes || selectedCheckboxes.length === 0) {
            alert('Vui lòng chọn hành động và ít nhất một sản phẩm.'); return;
        }
        const selectedProductIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        console.log(`Applying action "${selectedAction}" to products:`, selectedProductIds);
        alert(`Đã áp dụng "${selectedAction}" cho ${selectedProductIds.length} sản phẩm (Simulation).`);
        // TODO: API call + update table UI or reload
        productBulkActionSelect.value = '';
        if (selectAllProductsCheckbox) selectAllProductsCheckbox.checked = false;
        selectedCheckboxes.forEach(cb => { cb.checked = false; });
        updateBulkActionState(selectedCheckboxes); // Disable button
    }

    function handleOrderTableClick(event) {
        const viewButton = event.target.closest('.link-view-order, .btn-view-order');
        const printButton = event.target.closest('.btn-print-invoice');
        const viewCustomerLink = event.target.closest('.link-view-customer');

        if (viewButton) {
            event.preventDefault();
            showOrderDetail(viewButton.dataset.orderId);
        } else if (printButton) {
            console.log(`Printing invoice for order ${printButton.dataset.orderId} (Simulation)`);
            alert(`In hóa đơn ${printButton.dataset.orderId} (Simulation)`);
        } else if(viewCustomerLink){
            event.preventDefault();
            const customerId = viewCustomerLink.dataset.customerId;
            setActiveSection('customers');
            setTimeout(() => showCustomerDetail(customerId), 50);
        }
    }

    function handleOrderBulkAction() {
        const selectedAction = orderBulkActionSelect?.value;
        const selectedCheckboxes = ordersSection?.querySelectorAll('.order-checkbox:checked');
        if (!selectedAction || !selectedCheckboxes || selectedCheckboxes.length === 0) {
            alert('Vui lòng chọn hành động và ít nhất một đơn hàng.'); return;
        }
        const selectedOrderIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        console.log(`Applying action "${selectedAction}" to orders:`, selectedOrderIds);
        alert(`Đã áp dụng "${selectedAction}" cho ${selectedOrderIds.length} đơn hàng (Simulation).`);
        // TODO: API call + update table UI or reload
        orderBulkActionSelect.value = '';
        if (selectAllOrdersCheckbox) selectAllOrdersCheckbox.checked = false;
        selectedCheckboxes.forEach(cb => { cb.checked = false; });
        updateBulkActionState(selectedCheckboxes);
    }

    function handleServiceTableClick(event) {
        const viewButton = event.target.closest('.link-view-service, .btn-view-service');
        const viewCustomerLink = event.target.closest('.link-view-customer');

        if (viewButton) {
            event.preventDefault();
            showServiceDetail(viewButton.dataset.serviceId);
        } else if (viewCustomerLink){
            event.preventDefault();
            const customerId = viewCustomerLink.dataset.customerId;
            setActiveSection('customers');
            setTimeout(() => showCustomerDetail(customerId), 50);
        }
    }

    function handleServiceInlineChange(event){
        const statusDropdown = event.target.closest('.status-dropdown');
        const assigneeDropdown = event.target.closest('.assignee-dropdown');
        if(statusDropdown){
            const serviceId = statusDropdown.dataset.serviceId;
            const newStatus = statusDropdown.value;
            console.log(`Service ${serviceId} status changed to ${newStatus} (Simulation)`);
            // TODO: API call
        } else if(assigneeDropdown){
            const serviceId = assigneeDropdown.dataset.serviceId;
            const newAssignee = assigneeDropdown.value;
            console.log(`Service ${serviceId} assigned to ${newAssignee} (Simulation)`);
            // TODO: API call
        }
    }

    function handleCustomerTableClick(event) {
        const viewButton = event.target.closest('.link-view-customer, .btn-view-customer');
        const emailButton = event.target.closest('.btn-email-customer');
        const deleteButton = event.target.closest('.text-danger[title="Xóa Khách hàng"]'); // More specific selector

        if (viewButton) {
            event.preventDefault();
            showCustomerDetail(viewButton.dataset.customerId);
        } else if (emailButton) {
            const customerId = emailButton.dataset.customerId;
            const customerEmail = emailButton.closest('tr')?.querySelector('td:nth-child(2)')?.textContent;
            console.log(`Opening email client for customer ${customerId} (Simulation)`);
            if(customerEmail) window.location.href = `mailto:${customerEmail}`;
            else alert(`Gửi email cho khách hàng ${customerId} (Simulation)`);
        } else if (deleteButton) {
            const customerId = deleteButton.dataset.customerId;
            const customerName = deleteButton.closest('tr')?.querySelector('td:nth-child(1) a')?.textContent || `ID ${customerId}`;
            if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"? Hành động này không thể hoàn tác.`)) {
                console.log(`Deleting customer ${customerId} (Simulation)`);
                deleteButton.closest('tr')?.remove();
                alert(`Đã xóa khách hàng "${customerName}" (Simulation).`);
                // TODO: API call
            }
        }
    }

    function handleAdminLogout(event) {
        event.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang Admin?')) {
            console.log('Admin Logout (simulation)');
            alert('Đăng xuất thành công! (Simulation)');
            // window.location.href = '/admin/login.html'; // Redirect
        }
    }


    // =========================================================================
    // Initialization
    // =========================================================================
    setActiveSection('dashboard'); // Load dashboard first
    // Charts initialized by setActiveSection

    console.log("Admin Dashboard Script Initialized.");

}); // End DOMContentLoaded