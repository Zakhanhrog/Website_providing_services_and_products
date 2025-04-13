
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Elements
    const themeToggle = document.getElementById('themeToggleCheckbox');

    // =========================================================================
    // DOM Element References
    // =========================================================================
    // --- Sidebar & Navigation ---
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const sidebarCartItemCount = document.getElementById('sidebarCartItemCount');

    // --- Header ---
    const notificationBell = document.getElementById('notificationBell');
    const notificationPanel = document.getElementById('notificationPanel');
    const notificationList = document.getElementById('notificationList');
    const notificationCountBadge = document.getElementById('notificationCount');
    const clearNotificationsBtn = document.getElementById('clearNotifications');
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');

    // --- Modals & Overlays ---
    const modalOverlay = document.getElementById('modalOverlay');
    const detailModal = document.getElementById('detailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModal');
    const detailModalContent = document.getElementById('detailModalContent');

    // --- Main Content Sections ---
    const overviewSection = document.getElementById('overview-section');
    const overviewNotificationCount = document.getElementById('overviewNotificationCount');
    const storeSection = document.getElementById('store-section');
    const cartSection = document.getElementById('cart-section');
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlistMessage = document.getElementById('emptyWishlistMessage');
    const orderHistorySection = document.getElementById('order-history-section');
    const contactFeedbackSection = document.getElementById('contact-feedback-section');
    const shopFeedbackListContainer = document.getElementById('shopFeedbackList');

    // --- Store Specific Elements ---
    let filterLinks, priceRange, priceRangeValue, applyFilterBtn, clearFiltersBtn, sortBySelect, viewToggleButtons, productGrid, productList, paginationContainer, storeLoadingOverlay, storeSearchInput, storeSearchButton, storeResultsCount;
    if (storeSection) {
        filterLinks = storeSection.querySelectorAll('.store-filters .filter-link');
        priceRange = storeSection.querySelector('#priceRange');
        priceRangeValue = storeSection.querySelector('#priceRangeValue');
        applyFilterBtn = storeSection.querySelector('.btn-apply-filter');
        clearFiltersBtn = storeSection.querySelector('.btn-clear-filters');
        sortBySelect = storeSection.querySelector('#sortBy');
        viewToggleButtons = storeSection.querySelectorAll('.btn-view-mode');
        productGrid = storeSection.querySelector('#productGrid');
        productList = storeSection.querySelector('#productList');
        paginationContainer = storeSection.querySelector('.pagination-container .pagination');
        storeLoadingOverlay = storeSection.querySelector('#storeLoadingOverlay');
        storeSearchInput = storeSection.querySelector('#storeSearchInput');
        storeSearchButton = storeSection.querySelector('#storeSearchButton');
        storeResultsCount = storeSection.querySelector('.store-top-controls .results-count');
    }

    // --- Cart Section Specific Elements ---
    let cartItemsContainer, cartTotalAmount, checkoutButton, cartAddressSelect, cartPhoneNumber, cartVoucherInput, applyVoucherButton, voucherMessage, applyPointsCheckbox, availablePointsSpan, pointsToUseSpan, pointsDiscountValueSpan, pointsMessage, cartSubtotalAmount, cartVoucherDiscount, cartPointsDiscount, voucherDiscountRow, pointsDiscountRow, addAddressBtn;
    if (cartSection) {
        cartItemsContainer = cartSection.querySelector('#cartItemsContainer');
        cartTotalAmount = cartSection.querySelector('#cartTotalAmount');
        checkoutButton = cartSection.querySelector('#checkoutButton');
        cartAddressSelect = cartSection.querySelector('#cartAddressSelect');
        cartPhoneNumber = cartSection.querySelector('#cartPhoneNumber');
        cartVoucherInput = cartSection.querySelector('#cartVoucherInput');
        applyVoucherButton = cartSection.querySelector('#applyVoucherButton');
        voucherMessage = cartSection.querySelector('#voucherMessage');
        applyPointsCheckbox = cartSection.querySelector('#applyPointsCheckbox');
        availablePointsSpan = cartSection.querySelector('#availablePoints');
        pointsToUseSpan = cartSection.querySelector('#pointsToUse');
        pointsDiscountValueSpan = cartSection.querySelector('#pointsDiscountValue');
        pointsMessage = cartSection.querySelector('#pointsMessage');
        cartSubtotalAmount = cartSection.querySelector('#cartSubtotalAmount');
        cartVoucherDiscount = cartSection.querySelector('#cartVoucherDiscount');
        cartPointsDiscount = cartSection.querySelector('#cartPointsDiscount');
        voucherDiscountRow = cartSection.querySelector('#voucherDiscountRow');
        pointsDiscountRow = cartSection.querySelector('#pointsDiscountRow');
        addAddressBtn = cartSection.querySelector('.add-address-btn');
    }

    // --- Form Elements ---
    const serviceRequestForm = document.getElementById('serviceRequestForm');
    const personalInfoForm = document.getElementById('personalInfoForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const passwordMatchErrorAcc = document.getElementById('passwordMatchErrorAcc');
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    const supportForm = document.getElementById('supportForm');

    // --- Logout ---
    const logoutLinkSidebar = document.getElementById('logoutLinkSidebar');
    const logoutLinkDropdown = document.getElementById('logoutLinkDropdown');

    // --- Chatbox ---
    const chatboxWidget = document.getElementById('chatboxWidget');
    const chatboxToggle = document.getElementById('chatboxToggle');
    const chatboxContent = document.getElementById('chatboxContent');
    const chatInput = chatboxContent?.querySelector('.chatbox-input input');
    const chatSendButton = chatboxContent?.querySelector('.chatbox-input button');
    const messagesContainer = chatboxContent?.querySelector('.chatbox-messages');

    // =========================================================================
    // State Variables
    // --- NOTE: Many of these will be fetched/managed via API later ---
    // =========================================================================
    let productOrders = [ // --- BACKEND INTEGRATION: Dữ liệu này sẽ fetch từ API ---
        // Dữ liệu mẫu ban đầu nếu có
        { id: 'P789', date: '20/10/2023', mainProduct: 'Laptop Gaming ABC', total: 25500000, status: 'shipped', statusClass: 'status-shipped' },
        { id: 'P123', date: '15/10/2023', mainProduct: 'Điện thoại XYZ Pro', total: 18000000, status: 'delivered', statusClass: 'status-delivered' },
        { id: 'P098', date: '01/10/2023', mainProduct: 'Tai nghe Z', total: 1200000, status: 'cancelled', statusClass: 'status-cancelled' },
    ];
    let serviceRequests = [ // --- BACKEND INTEGRATION: Dữ liệu này sẽ fetch từ API ---
        // Dữ liệu mẫu ban đầu nếu có
        { id: 'S456', date: '19/10/2023', type: 'Tư vấn', title: 'Tư vấn mạng', status: 'processing', statusClass: 'status-processing' },
        { id: 'S112', date: '05/10/2023', type: 'Sửa chữa', title: 'Sửa laptop', status: 'completed', statusClass: 'status-completed' },
    ];
    let currentFilters = { category: 'all', brand: 'all', maxPrice: 50000000, rating: null, sortBy: 'newest', view: 'grid', searchTerm: '', page: 1 };
    let cartItems = []; // --- BACKEND INTEGRATION: Fetch initial cart state on load, update via API calls ---
    let wishlistItems = []; // --- BACKEND INTEGRATION: Fetch initial wishlist on load, update via API calls ---
    let notifications = []; // --- BACKEND INTEGRATION: Fetch notifications from server ---
    let userPoints = 1250; // --- BACKEND INTEGRATION: Fetch user points from server ---
    let userAddresses = [ // --- BACKEND INTEGRATION: Fetch addresses from server --- (Used for cart select options)
        { id: 'addr1', text: '123 ABC, XYZ, LMN, HCM (Mặc định)', phone: '0912345678' },
        { id: 'addr2', text: 'Tòa DEF, GHI, LMN, HCM (Công ty)', phone: '0987654321' }
    ];
    let appliedVoucher = null; // State for currently applied voucher (validated by backend)
    let pointsUsed = 0;
    let pointsValue = 0; // Value of points used in currency
    const POINT_CONVERSION_RATE = 1000; // Configuration, might come from backend later
    let activeModal = null; // For detail modal

    // =========================================================================
    // Utility Functions (Mostly Front-end)
    // =========================================================================
    function formatCurrency(amount) {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) return '0đ';
        return numericAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    // --- NOTE: This function reads from existing HTML. If rendering becomes purely JS-driven
    // --- based on API data, this function might become less necessary or change significantly.
    function getProductDataFromElement(element) {
        if (!element) return null;
        const productId = element.dataset.productId || `MOCK-${Date.now()}${Math.random().toString(16).slice(2)}`;
        const name = element.querySelector('h4 a')?.textContent || element.querySelector('h4')?.textContent || 'Sản phẩm không tên';
        const priceMatch = element.querySelector('.price')?.textContent.match(/[\d.,]+/);
        const priceText = priceMatch ? priceMatch[0] : '0';
        const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''));
        const imgSrc = element.querySelector('.product-image img, .product-list-image img, .main-image img, .wishlist-item img')?.src || `https://via.placeholder.com/100x100.png/eee/aaa?text=N/A`;
        // --- BACKEND INTEGRATION: Ideally, API provides image URL directly.
        const category = element.querySelector('.product-category-link')?.textContent || element.dataset.category || null;
        const brand = element.dataset.brand || null;
        return { id: productId, name, price: isNaN(priceValue) ? 0 : priceValue, imageSrc: imgSrc, category, brand, ratingHTML: element.querySelector('.rating')?.innerHTML };
    }

    // =========================================================================
    // Loading Overlay (Front-end)
    // =========================================================================
    function showLoading() { if (storeLoadingOverlay) storeLoadingOverlay.classList.add('active'); }
    function hideLoading() { if (storeLoadingOverlay) storeLoadingOverlay.classList.remove('active'); }

    // =========================================================================
    // Modal Management (Front-end, mostly for Detail Modal now)
    // =========================================================================
    function openModal(modalElement) { /* ... unchanged, ignores cartModal ... */
        if (!modalElement || activeModal || modalElement.id === 'cartModal') return; // Ignore cart modal
        if (modalOverlay) modalOverlay.classList.add('active');
        modalElement.classList.add('active');
        activeModal = modalElement;
        document.body.style.overflow = 'hidden';
    }
    function closeModal(modalElement) { /* ... unchanged, ignores cartModal ... */
        const targetModal = modalElement || activeModal;
        if (!targetModal || targetModal.id === 'cartModal') return; // Ignore cart modal
        if (modalOverlay) modalOverlay.classList.remove('active');
        targetModal.classList.remove('active');
        activeModal = null;
        if (targetModal === detailModal && detailModalContent) {
             setTimeout(() => { detailModalContent.innerHTML = '<p>Đang tải chi tiết...</p>'; }, 300);
        }
        document.body.style.overflow = '';
    }
    if (closeDetailModalBtn) { closeDetailModalBtn.addEventListener('click', () => closeModal(detailModal)); }


    // =========================================================================
    // Sidebar Navigation & Section Switching (Front-end)
    // =========================================================================
    function setActiveSection(sectionId) {
        if (!sectionId) return;
        sidebarLinks.forEach(link => link.classList.remove('active'));
        dashboardSections.forEach(section => section.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
        const activeSection = document.getElementById(`${sectionId}-section`);
        if (activeLink) activeLink.classList.add('active');
        if (activeSection) activeSection.classList.add('active');

        // Actions specific to section activation
        if (sectionId === 'contact-feedback') {
            renderShopFeedback(); // --- NOTE: Needs fetchFeedbackAPI() call inside ---
        } else if (sectionId === 'cart') {
            renderCartSection(); // Renders based on current `cartItems` state
            // --- BACKEND INTEGRATION: Optionally, call fetchCartAPI() here to ensure data is fresh ---
        } else if (sectionId === 'wishlist') {
            renderWishlist(); // Renders based on current `wishlistItems` state
             // --- BACKEND INTEGRATION: Optionally, call fetchWishlistAPI() here ---
        } else if (sectionId === 'store') {
            // Trigger initial filter/load only if product grid is empty? Avoids reloading every time.
             if (productGrid && productGrid.innerHTML.trim() === '') {
                applyFilters(); // --- NOTE: Needs fetchProducts() inside ---
             }
        } else if (sectionId === 'order-history') { // THÊM: Render bảng khi vào mục lịch sử
            renderOrderHistoryTables();
        } else if (sectionId === 'account') {
             // --- BACKEND INTEGRATION: Fetch user info, addresses etc. if needed ---
             populateAddressOptions(); // Example: Update address dropdowns if needed
             renderAddressList(); // THÊM: Render danh sách địa chỉ khi vào mục tài khoản
        }

        // Close mobile sidebar
        if (window.innerWidth <= 992 && sidebar?.classList.contains('active')) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open-overlay');
        }
        // Scroll top
        document.querySelector('.dashboard-main')?.scrollTo(0, 0);
    }

    sidebarLinks.forEach(link => {
        if (!link.id || (!link.id.includes('logout'))) {
            link.addEventListener('click', (event) => { event.preventDefault(); setActiveSection(link.dataset.section); });
        }
    });
    if (sidebarToggle && sidebar) { sidebarToggle.addEventListener('click', () => { sidebar.classList.toggle('active'); document.body.classList.toggle('sidebar-open-overlay', sidebar.classList.contains('active')); }); }

    // =========================================================================
    // Header Dropdowns (Front-end)
    // =========================================================================
    function toggleDropdown(panel, button) { /* ... unchanged ... */
       if (!panel || !button) return;
        const isActive = panel.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) panel.classList.add('active');
    }
    function closeAllDropdowns() { /* ... unchanged ... */
       if (notificationPanel?.classList.contains('active')) notificationPanel.classList.remove('active');
        if (userDropdown?.classList.contains('active')) userDropdown.classList.remove('active');
    }
    if (notificationBell) notificationBell.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(notificationPanel, notificationBell); });
    if (userMenuToggle) userMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(userDropdown, userMenuToggle); });
    document.addEventListener('click', (e) => { /* ... unchanged close logic ... */
        const isOutsideNotification = notificationPanel && !notificationPanel.contains(e.target) && notificationBell && !notificationBell.contains(e.target);
        const isOutsideUserMenu = userDropdown && !userDropdown.contains(e.target) && userMenuToggle && !userMenuToggle.contains(e.target);
        const isOutsideSidebar = sidebar && !sidebar.contains(e.target) && sidebarToggle && !sidebarToggle.contains(e.target);
        if (isOutsideNotification && isOutsideUserMenu) closeAllDropdowns();
        if (window.innerWidth <= 992 && sidebar?.classList.contains('active') && isOutsideSidebar) { sidebar.classList.remove('active'); document.body.classList.remove('sidebar-open-overlay'); }
        if (chatboxWidget && chatboxWidget.classList.contains('active') && !chatboxWidget.contains(e.target) && !chatboxToggle.contains(e.target)) { chatboxWidget.classList.remove('active'); }
    });

    // =========================================================================
    // Notification System (Partially Backend)
    // =========================================================================
    // --- BACKEND INTEGRATION: Call this on load or periodically ---
    async function fetchNotificationsAPI() {
        console.log("API CALL (SIMULATED): Fetching notifications...");
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // --- TODO: Replace with actual fetch() to your notification endpoint ---
        // Example response structure: [{ id, text, timestamp, read, type, link? }, ...]
        const mockNotifications = [
            { id: `notif-${Date.now()}-1`, text: 'Đơn hàng #P789 đã được giao thành công.', timestamp: new Date(Date.now() - 3600000), read: false, type: 'success', link: { section: 'order-history', detailId: 'P789' } },
            { id: `notif-${Date.now()}-2`, text: 'Yêu cầu dịch vụ #S456 đang được xử lý.', timestamp: new Date(Date.now() - 86400000), read: true, type: 'info', link: { section: 'order-history', detailId: 'S456' } },
            { id: `notif-${Date.now()}-3`, text: 'Chào mừng bạn đến với TechShop!', timestamp: new Date(Date.now() - 172800000), read: true, type: 'info' },
        ];
        console.log("API RESPONSE (SIMULATED): Received notifications.");
        return mockNotifications;
    }

    // --- BACKEND INTEGRATION: Call this when a notification is clicked or 'Mark all read' ---
    async function markNotificationReadAPI(notificationId = null) { // null means mark all
        console.log(`API CALL (SIMULATED): Marking notification(s) as read ${notificationId ? `(ID: ${notificationId})` : '(All)'}...`);
        // --- TODO: Replace with actual fetch() to your 'mark read' endpoint ---
        // Send notificationId (or indicate all) in the request body/params
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("API RESPONSE (SIMULATED): Notification(s) marked as read on server.");
        return true; // Indicate success
    }

    function addNotification(message, type = 'info', link = null) { // Still useful for client-side feedback
        const newNotification = { id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`, text: message, timestamp: new Date(), read: false, type, link };
        notifications.unshift(newNotification);
        updateNotificationUI();
        // Shake bell (Front-end effect)
        if (notificationBell) { notificationBell.classList.remove('shake'); void notificationBell.offsetWidth; notificationBell.classList.add('shake'); setTimeout(() => notificationBell.classList.remove('shake'), 500); }
    }

    function updateNotificationUI() { // Renders based on local `notifications` array
        const unreadCount = notifications.filter(n => !n.read).length;
        if (notificationCountBadge) { notificationCountBadge.textContent = unreadCount; notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none'; }
        if (overviewNotificationCount) overviewNotificationCount.textContent = unreadCount;

        if (notificationList) {
            notificationList.innerHTML = '';
            if (notifications.length === 0) {
                notificationList.innerHTML = '<li class="no-notifications">Chưa có thông báo mới.</li>';
            } else {
                notifications.slice(0, 10).forEach(n => {
                    const li = document.createElement('li');
                    li.className = `notification-item notification-${n.type} ${n.read ? '' : 'unread'}`;
                    li.dataset.notificationId = n.id;
                    li.innerHTML = `<span>${n.text}</span><span class="timestamp">${n.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>`;
                    li.addEventListener('click', () => handleNotificationClick(n.id, n.link)); // Pass link info
                    notificationList.appendChild(li);
                });
            }
        }
    }

    async function handleNotificationClick(notificationId, link) {
        const index = notifications.findIndex(n => n.id === notificationId);
        if (index > -1 && !notifications[index].read) {
            notifications[index].read = true; // Optimistic UI update
            updateNotificationUI();
            try {
                await markNotificationReadAPI(notificationId); // --- BACKEND CALL ---
                 console.log(`Notification ${notificationId} successfully marked read on server.`);
            } catch (error) {
                console.error("Failed to mark notification read on server:", error);
                // Optional: revert UI change or show error
                 notifications[index].read = false; // Revert optimistic update on error
                 updateNotificationUI();
                 addNotification("Lỗi: Không thể đánh dấu đã đọc.", "error");
            }
        }
        // Navigate if link exists
        if (link && link.section) {
            closeAllDropdowns(); // Close panel before navigating
            setActiveSection(link.section);
            if (link.detailId) {
                // Delay modal opening slightly for section transition
                setTimeout(() => {
                     if (link.section === 'order-history') {
                        const orderType = link.detailId.startsWith('S') ? 'service' : 'product';
                        showOrderDetailModal(link.detailId, orderType); // --- NOTE: Needs fetchOrderDetails() inside ---
                     }
                    // Add other detail types if needed
                }, 350);
            }
        }
    }

    async function handleClearAllNotifications(e) {
        e.preventDefault();
        let changed = false;
        notifications.forEach(n => { if (!n.read) { n.read = true; changed = true; } });
        if (changed) {
            updateNotificationUI(); // Optimistic UI update
            try {
                await markNotificationReadAPI(null); // Mark all on server --- BACKEND CALL ---
                 console.log("All notifications marked read on server.");
            } catch (error) {
                console.error("Failed to mark all notifications read on server:", error);
                // Optional: revert UI or show error
                addNotification("Lỗi: Không thể đánh dấu tất cả đã đọc.", "error");
                // Consider fetching fresh notification state here to be sure
                // await loadInitialNotifications();
            }
        }
    }

    if (clearNotificationsBtn) { clearNotificationsBtn.addEventListener('click', handleClearAllNotifications); }

    // =========================================================================
    // Tab Switching (Front-end)
    // =========================================================================
    function setupTabs(containerSelector) { /* ... unchanged ... */
       const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            const links = container.querySelectorAll('.tab-link, .account-tab-link');
            const contents = container.querySelectorAll('.tab-content, .account-tab-content');
            if (links.length === 0 || contents.length === 0) return;
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tabId = link.dataset.tab || link.dataset.accountTab;
                    links.forEach(l => l.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    link.classList.add('active');
                    const activeContent = container.querySelector(`#${tabId}`);
                    if (activeContent) activeContent.classList.add('active');
                });
            });
            if (!container.querySelector('.active[data-tab], .active[data-account-tab]') && links.length > 0) { links[0].click(); }
        });
    }
    setupTabs('#order-history-section');
    setupTabs('#account-section');

    // =========================================================================
    // Cart Functionality (Heavy Backend Interaction)
    // =========================================================================

    // --- BACKEND INTEGRATION: Call on load to get initial cart ---
    async function fetchCartAPI() {
        console.log("API CALL (SIMULATED): Fetching cart items...");
        // --- TODO: Replace with actual fetch() to your cart endpoint ---
        await new Promise(resolve => setTimeout(resolve, 400));
        // Example response: [{ id, name, price, quantity, imageSrc }, ...]
        const mockCart = [
             // { id: 'TB-LP-01', name: 'Laptop TechBrand Pro 14', price: 32500000, quantity: 1, imageSrc: 'https://via.placeholder.com/80x80.png/6c5ce7/ffffff?text=Laptop+TB+1' }
        ]; // Start with empty cart for demo
        console.log("API RESPONSE (SIMULATED): Received cart items.");
        return mockCart;
    }

    // --- BACKEND INTEGRATION: Call when adding, updating quantity, or removing ---
    async function updateServerCartAPI(productId, quantity) { // quantity=0 means remove
        console.log(`API CALL (SIMULATED): Updating cart - Product ID: ${productId}, Quantity: ${quantity}`);
        // --- TODO: Replace with actual fetch() to your cart update endpoint ---
        // Send productId and new quantity in the request body.
        // Backend should handle adding, updating, or removing based on quantity.
        await new Promise(resolve => setTimeout(resolve, 500));
        // Example Success Response: { success: true, updatedCart: [...] } // Return the updated cart state
        // Example Error Response: { success: false, message: "Item out of stock" }
        console.log("API RESPONSE (SIMULATED): Cart updated on server.");
        // Simulate returning the potentially modified local cart for now
        // A real API should return the authoritative cart state.
        const updatedCart = cartItems.map(item => // Create a copy reflecting the change
            item.id === productId ? { ...item, quantity: quantity } : item
        ).filter(item => item.quantity > 0); // Filter out removed items
        return { success: true, updatedCart: updatedCart };
    }

    // --- BACKEND INTEGRATION: Call when applying voucher ---
    async function validateVoucherAPI(voucherCode) {
        console.log(`API CALL (SIMULATED): Validating voucher code: ${voucherCode}...`);
        // --- TODO: Replace with actual fetch() to your voucher validation endpoint ---
        await new Promise(resolve => setTimeout(resolve, 300));
        let response = { valid: false, message: 'Mã voucher không hợp lệ hoặc đã hết hạn.', voucherData: null };
        const upperCode = voucherCode.toUpperCase();
        if (upperCode === 'SALE10') {
            response = { valid: true, message: 'Áp dụng thành công!', voucherData: { code: upperCode, discountType: 'percentage', value: 0.1 } };
        } else if (upperCode === 'GIAM20K') {
            response = { valid: true, message: 'Áp dụng thành công!', voucherData: { code: upperCode, discountType: 'fixed', value: 20000 } };
        } else if (upperCode === 'FREESHIP') {
             response = { valid: true, message: 'Áp dụng thành công!', voucherData: { code: upperCode, discountType: 'fixed', value: 15000 } }; // Simulate 15k shipping discount
        }
        console.log("API RESPONSE (SIMULATED): Voucher validation result:", response);
        return response;
    }

    // --- BACKEND INTEGRATION: Call this when placing the order ---
    async function submitOrderAPI(orderData) {
        console.log("API CALL (SIMULATED): Submitting order...", orderData);
        // --- TODO: Replace with actual fetch() to your order creation endpoint ---
        // Send the complete orderData object in the request body.
        // Backend handles payment processing (if not COD), inventory update, saving order, etc.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate longer processing time
        // Example Success Response: { success: true, orderId: orderData.orderId, message: "Đặt hàng thành công!" }
        // Example Error Response: { success: false, message: "Lỗi xử lý thanh toán." }
        console.log("API RESPONSE (SIMULATED): Order submission successful.");
        return { success: true, orderId: orderData.orderId, message: "Đặt hàng thành công!" };
    }


    function updateCartBadge() { // Front-end UI update
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (sidebarCartItemCount) {
            sidebarCartItemCount.textContent = totalItems;
            sidebarCartItemCount.classList.toggle('visible', totalItems > 0);
        }
        const sectionCheckoutButton = cartSection?.querySelector('#checkoutButton');
        if (sectionCheckoutButton) { sectionCheckoutButton.disabled = totalItems === 0; }
    }

    function renderCartSection() { // Renders UI based on the *local* `cartItems` state
        // Ensure elements within #cart-section are available
        if (!cartSection || !cartItemsContainer || !cartTotalAmount || !cartSubtotalAmount /*... etc ...*/) {
            if(cartSection?.classList.contains('active')) console.error("Cart section elements not found for rendering!");
            return;
        }

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Giỏ hàng của bạn đang trống.</p>';
            subtotal = 0;
            appliedVoucher = null; // Reset voucher state
            pointsUsed = 0; // Reset points state
            pointsValue = 0;
            if (applyPointsCheckbox) { applyPointsCheckbox.checked = false; applyPointsCheckbox.disabled = true; }
            if (cartVoucherInput) cartVoucherInput.value = '';
            if (voucherMessage) voucherMessage.textContent = '';
            updateCheckoutOptionsUI(0); // Update related UI like points display
        } else {
            cartItems.forEach(item => {
                const itemPrice = Number(item.price) || 0;
                subtotal += itemPrice * item.quantity;
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.dataset.cartItemId = item.id;
                itemElement.innerHTML = `
                    <div class="cart-item-image"><img src="${item.imageSrc || 'https://via.placeholder.com/80x80.png?text=N/A'}" alt="${item.name || ''}"></div>
                    <div class="cart-item-details"><h5>${item.name || 'Sản phẩm'}</h5><p class="cart-item-price">${formatCurrency(itemPrice)}</p></div>
                    <div class="cart-item-quantity"><button class="quantity-decrease" aria-label="Giảm">-</button><input type="number" class="quantity-input" value="${item.quantity}" min="1" aria-label="Số lượng"><button class="quantity-increase" aria-label="Tăng">+</button></div>
                    <div class="cart-item-remove"><button class="remove-item-btn" aria-label="Xóa"><i class="fas fa-trash-alt"></i></button></div>`;
                cartItemsContainer.appendChild(itemElement);
            });
             if (applyPointsCheckbox) applyPointsCheckbox.disabled = (userPoints <= 0 || subtotal <= 0);
        }

        // --- Recalculate Discounts and Total locally based on current state ---
        let voucherDiscount = 0;
        if (appliedVoucher) {
             if (appliedVoucher.discountType === 'percentage') voucherDiscount = subtotal * appliedVoucher.value;
             else if (appliedVoucher.discountType === 'fixed') voucherDiscount = appliedVoucher.value;
             voucherDiscount = Math.min(voucherDiscount, subtotal);
         }

        pointsValue = 0;
        pointsUsed = 0;
        const amountAvailableForPoints = Math.max(0, subtotal - voucherDiscount);

        if (applyPointsCheckbox && applyPointsCheckbox.checked && !applyPointsCheckbox.disabled) {
             const maxPossiblePointsValue = Math.min(userPoints * POINT_CONVERSION_RATE, amountAvailableForPoints);
             pointsValue = maxPossiblePointsValue;
             pointsUsed = Math.floor(pointsValue / POINT_CONVERSION_RATE);
              if (pointsUsed > userPoints) { pointsUsed = userPoints; pointsValue = pointsUsed * POINT_CONVERSION_RATE; }
         } else {
              if (applyPointsCheckbox && applyPointsCheckbox.checked && applyPointsCheckbox.disabled) { applyPointsCheckbox.checked = false; }
         }
        const total = Math.max(0, subtotal - voucherDiscount - pointsValue);

        // --- Update UI Elements ---
        if (cartSubtotalAmount) cartSubtotalAmount.textContent = formatCurrency(subtotal);
        if (cartTotalAmount) cartTotalAmount.textContent = formatCurrency(total);
        if (voucherDiscountRow && cartVoucherDiscount) { voucherDiscountRow.style.display = voucherDiscount > 0 ? 'flex' : 'none'; cartVoucherDiscount.textContent = `-${formatCurrency(voucherDiscount)}`; }
        if (pointsDiscountRow && cartPointsDiscount) { pointsDiscountRow.style.display = pointsValue > 0 ? 'flex' : 'none'; cartPointsDiscount.textContent = `-${formatCurrency(pointsValue)}`; }
        if (pointsToUseSpan) pointsToUseSpan.textContent = pointsUsed.toLocaleString('vi-VN');

        updateCheckoutOptionsUI(amountAvailableForPoints); // Update points/voucher messages
        updateCartBadge(); // Ensure sidebar badge is consistent
    }

    async function handleUpdateCartQuantity(itemId, newQuantity) {
        const currentItem = cartItems.find(item => item.id === itemId);
        if (!currentItem) return;

        const clampedQuantity = Math.max(0, newQuantity); // Ensure quantity is not negative

        // --- Optimistic UI Update (Optional but good UX) ---
        const originalQuantity = currentItem.quantity;
        if (clampedQuantity === 0) {
            cartItems = cartItems.filter(item => item.id !== itemId); // Remove locally
        } else {
            currentItem.quantity = clampedQuantity; // Update locally
        }
        renderCartSection(); // Update UI immediately
        // --- End Optimistic Update ---

        try {
            showLoading(); // Show loading indicator during API call
            const response = await updateServerCartAPI(itemId, clampedQuantity); // --- BACKEND CALL ---
            if (response.success) {
                // Replace local cart with authoritative state from server
                cartItems = response.updatedCart;
                console.log("Cart updated successfully on server.");
                // Re-render with server state (might be redundant if optimistic UI was correct, but safer)
                renderCartSection();
                 // Add notification only if quantity actually changed successfully
                 if (clampedQuantity === 0 && originalQuantity > 0) {
                    addNotification(`Đã xóa "${currentItem.name || 'sản phẩm'}" khỏi giỏ.`);
                 } else if (clampedQuantity > 0 && clampedQuantity !== originalQuantity){
                     // Optional: Add notification for quantity update? Might be too noisy.
                 }
            } else {
                throw new Error(response.message || "Failed to update cart on server.");
            }
        } catch (error) {
            console.error("Error updating cart quantity:", error);
            addNotification(`Lỗi cập nhật giỏ hàng: ${error.message}`, 'error');
            // --- Revert Optimistic Update ---
            if (clampedQuantity === 0) { // If item was removed locally, add it back
                cartItems.push({...currentItem, quantity: originalQuantity }); // Assuming currentItem still holds old data
            } else { // If quantity was changed, revert it
                const revertedItem = cartItems.find(item => item.id === itemId);
                if (revertedItem) revertedItem.quantity = originalQuantity;
            }
            renderCartSection(); // Re-render to show reverted state
            // --- End Revert ---
        } finally {
             hideLoading();
        }
    }


    async function handleRemoveCartItem(itemId) {
        await handleUpdateCartQuantity(itemId, 0); // Use the update function with quantity 0
    }

    async function handleAddToCart(itemData) { // Needs to interact with backend
        if (!itemData || !itemData.id || isNaN(itemData.price)) { console.error("Invalid item data for add to cart:", itemData); return; }

        const existingItem = cartItems.find(item => item.id === itemData.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

        // --- Optimistic UI Update ---
         if (existingItem) {
             existingItem.quantity = newQuantity;
         } else {
             cartItems.push({ ...itemData, quantity: 1 });
         }
         renderCartSection(); // Update UI immediately if cart section is active
         updateCartBadge();
         // Shake effect (optional)
         const cartSidebarLink = document.querySelector('.sidebar-link[data-section="cart"]');
         if (cartSidebarLink) { cartSidebarLink.classList.remove('shake'); void cartSidebarLink.offsetWidth; cartSidebarLink.classList.add('shake'); setTimeout(() => cartSidebarLink.classList.remove('shake'), 400); }
        // --- End Optimistic ---

        try {
            // Don't usually show loading for simple add-to-cart, but could.
            const response = await updateServerCartAPI(itemData.id, newQuantity); // --- BACKEND CALL ---
            if (response.success) {
                cartItems = response.updatedCart; // Sync with server state
                console.log(`Item ${itemData.id} added/updated on server.`);
                 addNotification(`Đã thêm "${itemData.name}" vào giỏ.`, 'success'); // Notify after success
                 // Re-render might be needed if response differs significantly
                 renderCartSection(); // Ensure UI matches server state
            } else {
                throw new Error(response.message || "Failed to add item to cart on server.");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            addNotification(`Lỗi thêm vào giỏ: ${error.message}`, 'error');
             // --- Revert Optimistic Update ---
             if (existingItem) { // If quantity was increased
                 existingItem.quantity = newQuantity - 1; // Decrease it back
             } else { // If item was newly added
                 cartItems = cartItems.filter(item => item.id !== itemData.id); // Remove it
             }
             renderCartSection(); // Re-render to show reverted state
             updateCartBadge();
             // --- End Revert ---
        }
    }

    function updateCheckoutOptionsUI(amountAvailableForPoints = 0) { // Mostly front-end UI update
        // Target elements within the cart section
        const sectionAvailablePoints = cartSection?.querySelector('#availablePoints');
        const sectionPointsCheckbox = cartSection?.querySelector('#applyPointsCheckbox');
        const sectionPointsDiscountValue = cartSection?.querySelector('#pointsDiscountValue');
        const sectionPointsToUse = cartSection?.querySelector('#pointsToUse');
        const sectionVoucherMsg = cartSection?.querySelector('#voucherMessage');
        const sectionPointsMsg = cartSection?.querySelector('#pointsMessage');

        if (sectionAvailablePoints) sectionAvailablePoints.textContent = userPoints.toLocaleString('vi-VN');

        if (sectionPointsDiscountValue && sectionPointsCheckbox) {
             const potentialDiscount = Math.min(userPoints * POINT_CONVERSION_RATE, Math.max(0, amountAvailableForPoints));
             const potentialPointsUsed = Math.floor(potentialDiscount / POINT_CONVERSION_RATE);
             sectionPointsDiscountValue.textContent = formatCurrency(potentialDiscount);
             if (sectionPointsToUse && !sectionPointsCheckbox.checked) { sectionPointsToUse.textContent = potentialPointsUsed.toLocaleString('vi-VN'); }
             else if (sectionPointsToUse && sectionPointsCheckbox.checked) { sectionPointsToUse.textContent = pointsUsed.toLocaleString('vi-VN'); }
             const canUsePoints = userPoints > 0 && potentialDiscount > 0;
             sectionPointsCheckbox.disabled = !canUsePoints;
             if (!canUsePoints && sectionPointsCheckbox.checked) { sectionPointsCheckbox.checked = false; /* Re-render might be needed */ }
        }
        if(sectionVoucherMsg) {
             if (appliedVoucher) { sectionVoucherMsg.textContent = `Đã áp dụng mã "${appliedVoucher.code}".`; sectionVoucherMsg.className = 'voucher-message success'; }
             else if (sectionVoucherMsg.textContent.startsWith("Đã áp dụng")) { sectionVoucherMsg.textContent = ''; sectionVoucherMsg.className = 'voucher-message'; }
        }
         if (sectionPointsMsg && sectionPointsCheckbox) {
             if (sectionPointsCheckbox.disabled && userPoints > 0 && amountAvailableForPoints <= 0 && cartItems.length > 0) { sectionPointsMsg.textContent = "Tổng tiền sau giảm giá đã bằng 0."; sectionPointsMsg.className = 'points-message error'; }
             else if (sectionPointsCheckbox.disabled && userPoints <= 0) { sectionPointsMsg.textContent = "Bạn không có điểm thưởng để sử dụng."; sectionPointsMsg.className = 'points-message error'; }
             else { sectionPointsMsg.textContent = `(Tỷ lệ: ${POINT_CONVERSION_RATE.toLocaleString('vi-VN')} điểm = ${formatCurrency(POINT_CONVERSION_RATE)})`; sectionPointsMsg.className = 'points-message'; }
         }
         // --- BACKEND INTEGRATION: Populate address options dynamically ---
         populateAddressOptions();
    }

    // --- BACKEND INTEGRATION: Fetch addresses and update select options ---
    function populateAddressOptions() {
         if (!cartAddressSelect) return; // Only run if element exists
         // --- TODO: Fetch addresses via API instead of using local userAddresses ---
         // Example: const fetchedAddresses = await fetchAddressesAPI();
         const addressesToUse = userAddresses; // Use local for now

         // Remember selected value if any
         const selectedValue = cartAddressSelect.value;
         cartAddressSelect.innerHTML = '<option value="">-- Chọn địa chỉ --</option>'; // Clear existing
         addressesToUse.forEach(addr => {
             const option = document.createElement('option');
             option.value = addr.id;
             option.textContent = addr.text;
             option.dataset.phone = addr.phone || ''; // Store phone number if available
             cartAddressSelect.appendChild(option);
         });
         // Restore selected value if it still exists
         if (cartAddressSelect.querySelector(`option[value="${selectedValue}"]`)) {
            cartAddressSelect.value = selectedValue;
         } else {
            // If previous selection is gone, try to select default or first
            const defaultOption = cartAddressSelect.querySelector('option[value$="(Mặc định)"]'); // Crude check
            if (defaultOption) defaultOption.selected = true;
            else if (cartAddressSelect.options.length > 1) cartAddressSelect.selectedIndex = 1;
         }
         // Update phone number based on selection (add listener)
         updatePhoneNumberFromAddress();
    }
     // Add event listener for address selection change
     if (cartAddressSelect) {
         cartAddressSelect.addEventListener('change', updatePhoneNumberFromAddress);
     }
     // Function to update phone number based on selected address
     function updatePhoneNumberFromAddress() {
         if (cartAddressSelect && cartPhoneNumber) {
             const selectedOption = cartAddressSelect.options[cartAddressSelect.selectedIndex];
             const phone = selectedOption?.dataset.phone;
             if (phone) {
                 cartPhoneNumber.value = phone;
             } // Optionally clear if no phone: else { cartPhoneNumber.value = ''; }
         }
     }


    function attachCartActionListeners() { // Attaches listeners to the static #cart-section
        if (!cartSection) return;

        // Use event delegation for dynamic items
        cartSection.addEventListener('click', (event) => {
            const target = event.target;
            const cartItemElement = target.closest('.cart-item');

            if (cartItemElement) { // Actions within a cart item
                const itemId = cartItemElement.dataset.cartItemId;
                const input = cartItemElement.querySelector('.quantity-input');
                const currentQuantity = input ? parseInt(input.value) : 0;

                if (target.closest('.quantity-decrease')) {
                    handleUpdateCartQuantity(itemId, currentQuantity - 1); // Async function
                } else if (target.closest('.quantity-increase')) {
                    handleUpdateCartQuantity(itemId, currentQuantity + 1); // Async function
                } else if (target.closest('.remove-item-btn')) {
                    handleRemoveCartItem(itemId); // Async function
                }
            } else if (target.matches('#applyVoucherButton')) { // Voucher button
                handleApplyVoucher(); // Async function
            } else if (target.matches('#checkoutButton')) { // Checkout button
                handleCheckout(); // Async function
            } else if (target.matches('.add-address-btn')) { // Add address button
                 event.preventDefault();
                 setActiveSection('account');
                 setTimeout(() => { document.querySelector('.account-tab-link[data-account-tab="addresses"]')?.click(); }, 100);
            }
        });

        // Listener for quantity input change
        cartSection.addEventListener('change', (event) => {
            if (event.target.classList.contains('quantity-input')) {
                const cartItemElement = event.target.closest('.cart-item');
                if (cartItemElement) {
                    const itemId = cartItemElement.dataset.cartItemId;
                    let newQuantity = parseInt(event.target.value);
                    handleUpdateCartQuantity(itemId, (isNaN(newQuantity) || newQuantity < 1) ? 1 : newQuantity); // Async
                }
            } else if (event.target.matches('#applyPointsCheckbox')) { // Points checkbox change
                 renderCartSection(); // Points calculation happens in render
            }
        });

        // Listener for quantity input blur (reset invalid)
         cartSection.addEventListener('blur', (event) => {
             if (event.target.classList.contains('quantity-input')) {
                 if (event.target.value === '' || parseInt(event.target.value) < 1) {
                     const cartItemElement = event.target.closest('.cart-item');
                     if (cartItemElement) {
                         const itemId = cartItemElement.dataset.cartItemId;
                         handleUpdateCartQuantity(itemId, 1); // Reset to 1 via API potentially
                     }
                 }
             }
         }, true);
    }

    async function handleApplyVoucher() {
        if (!cartVoucherInput || !voucherMessage) return;
        const code = cartVoucherInput.value.trim();
        voucherMessage.textContent = '';
        voucherMessage.className = 'voucher-message';
        appliedVoucher = null; // Reset before validation

        if (!code) {
             voucherMessage.textContent = 'Vui lòng nhập mã voucher.';
             voucherMessage.className = 'voucher-message error';
             renderCartSection(); // Re-render to remove previous voucher effect if any
             return;
         }

        showLoading(); // Show loading while validating
        try {
            const response = await validateVoucherAPI(code); // --- BACKEND CALL ---
            if (response.valid) {
                appliedVoucher = response.voucherData; // Store validated voucher data
                voucherMessage.textContent = response.message;
                voucherMessage.className = 'voucher-message success';
                cartVoucherInput.value = ''; // Clear input on success
            } else {
                voucherMessage.textContent = response.message;
                voucherMessage.className = 'voucher-message error';
            }
        } catch (error) {
            console.error("Error validating voucher:", error);
            voucherMessage.textContent = 'Lỗi hệ thống, không thể kiểm tra voucher.';
            voucherMessage.className = 'voucher-message error';
        } finally {
            hideLoading();
            renderCartSection(); // Re-render cart with updated total/messages
        }
    }

     async function handleCheckout() {
         if (!cartSection || !checkoutButton) return;

         // Re-query elements inside the handler to ensure they exist
         const sectionAddressSelect = cartSection.querySelector('#cartAddressSelect');
         const sectionPhoneNumber = cartSection.querySelector('#cartPhoneNumber');
         const sectionPointsCheckbox = cartSection.querySelector('#applyPointsCheckbox');
         const sectionPaymentMethod = cartSection.querySelector('input[name="paymentMethod"]:checked');
         const sectionVoucherInput = cartSection.querySelector('#cartVoucherInput'); // For reset
         const sectionVoucherMessage = cartSection.querySelector('#voucherMessage'); // For reset
         const sectionCodRadio = cartSection.querySelector('#paymentCOD'); // For reset

         // --- Basic Client-Side Validation ---
          let isValid = true;
          let errorMsg = "";
          if (cartItems.length === 0) { isValid = false; errorMsg = "Giỏ hàng đang trống."; }
          else if (sectionAddressSelect && !sectionAddressSelect.value) { isValid = false; errorMsg = "Vui lòng chọn địa chỉ nhận hàng."; sectionAddressSelect.focus(); }
          else if (sectionPhoneNumber && !sectionPhoneNumber.value.trim()) { isValid = false; errorMsg = "Vui lòng nhập số điện thoại nhận hàng."; sectionPhoneNumber.focus(); }
          else if (!sectionPaymentMethod) { isValid = false; errorMsg = "Vui lòng chọn phương thức thanh toán."; }
          if (!isValid) { alert(errorMsg); return; }
         // --- End Validation ---

         checkoutButton.disabled = true; // Prevent double-clicks
         checkoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'; // Loading state
         showLoading();

         // --- Recalculate totals/discounts *just before* submitting ---
         const currentSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
         let finalVoucherDiscount = 0;
         if (appliedVoucher) { /* ... calculate voucher discount ... */
            if (appliedVoucher.discountType === 'percentage') finalVoucherDiscount = currentSubtotal * appliedVoucher.value;
            else if (appliedVoucher.discountType === 'fixed') finalVoucherDiscount = appliedVoucher.value;
            finalVoucherDiscount = Math.min(finalVoucherDiscount, currentSubtotal);
         }
          let finalPointsValue = 0;
          let finalPointsUsed = 0;
          const finalAmountAvailableForPoints = Math.max(0, currentSubtotal - finalVoucherDiscount);
          if (sectionPointsCheckbox && sectionPointsCheckbox.checked && !sectionPointsCheckbox.disabled) { /* ... calculate points ... */
             const maxPossiblePointsValue = Math.min(userPoints * POINT_CONVERSION_RATE, finalAmountAvailableForPoints);
             finalPointsValue = maxPossiblePointsValue;
             finalPointsUsed = Math.floor(finalPointsValue / POINT_CONVERSION_RATE);
              if (finalPointsUsed > userPoints) { finalPointsUsed = userPoints; finalPointsValue = finalPointsUsed * POINT_CONVERSION_RATE; }
          }
         const finalTotal = Math.max(0, currentSubtotal - finalVoucherDiscount - finalPointsValue);
         // --- End Recalculation ---

         // --- Gather Order Data for API ---
         const orderData = {
             // orderId will be generated by backend
             items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })), // Send essential data
             addressId: sectionAddressSelect?.value,
             phoneNumber: sectionPhoneNumber?.value,
             paymentMethod: sectionPaymentMethod?.value,
             voucherCode: appliedVoucher ? appliedVoucher.code : null,
             pointsUsed: finalPointsUsed,
             // Totals are calculated backend-side for verification, but can send client-side calc for reference
             // clientSubtotal: currentSubtotal, clientVoucherDiscount: finalVoucherDiscount, clientPointsDiscount: finalPointsValue, clientTotal: finalTotal
         };

         try {
             const response = await submitOrderAPI(orderData); // --- BACKEND CALL ---
             if (response.success) {
                 addNotification(`Đặt hàng #${response.orderId} thành công!`, 'success');
                 alert(response.message || "Đặt hàng thành công!"); // Show success message

                 const newOrderEntry = {
                    id: response.orderId, // Sử dụng ID từ response của API
                    date: new Date().toLocaleDateString('vi-VN'), // Ngày hiện tại
                    mainProduct: orderData.items[0]?.name + (orderData.items.length > 1 ? '...' : ''), // Lấy tên SP đầu tiên
                    total: finalTotal, // Sử dụng total đã tính toán
                    status: 'processing', // Trạng thái ban đầu
                    statusClass: 'status-processing' // Class CSS tương ứng
                };
                productOrders.unshift(newOrderEntry); // Thêm vào đầu mảng

                 // --- Clear Local Cart State AFTER successful order ---
                 cartItems = [];
                 appliedVoucher = null;
                 pointsUsed = 0;
                 pointsValue = 0;
                 if (sectionPointsCheckbox) sectionPointsCheckbox.checked = false;
                 if (sectionAddressSelect) sectionAddressSelect.value = '';
                 if (sectionPhoneNumber) sectionPhoneNumber.value = '';
                 if (sectionVoucherInput) sectionVoucherInput.value = '';
                 if (sectionVoucherMessage) sectionVoucherMessage.textContent = '';
                 if (sectionCodRadio) sectionCodRadio.checked = true;

                 // --- BACKEND INTEGRATION: Fetch updated user points if they were used ---
                 if (finalPointsUsed > 0) {
                     // Example: userPoints = await fetchUserPointsAPI();
                     userPoints -= finalPointsUsed; // Simulate update for now
                 }

                 renderCartSection(); // Update UI to show empty cart
                 updateCartBadge(); // Update badge to 0
                 setActiveSection('order-history'); // Navigate to order history
             } else {
                 throw new Error(response.message || "Đặt hàng không thành công.");
             }
         } catch (error) {
             console.error("Error submitting order:", error);
             addNotification(`Lỗi đặt hàng: ${error.message}`, 'error');
             alert(`Đã xảy ra lỗi khi đặt hàng: ${error.message}`);
         } finally {
             hideLoading();
             // Reset checkout button state
             checkoutButton.disabled = (cartItems.length === 0); // Re-enable only if cart still has items (e.g., error occurred)
             checkoutButton.innerHTML = '<i class="fas fa-check-circle"></i> Đặt hàng';
         }
     }

     // =========================================================================
// Account Section Functionality (Mới và Cập nhật)
// =========================================================================

// --- BACKEND INTEGRATION: Thêm địa chỉ mới ---
async function addAddressAPI(addressData) {
    console.log("API CALL (SIMULATED): Adding new address...", addressData);
    // --- TODO: Replace with actual fetch() POST to address endpoint ---
    await new Promise(resolve => setTimeout(resolve, 600));
    // Example response: { success: true, newAddress: { id: `addr-${Date.now()}`, ...addressData, isDefault: false } }
    const response = { success: true, newAddress: { id: `addr-${Date.now()}`, ...addressData, isDefault: false } };
    console.log("API RESPONSE (SIMULATED): Address added.", response);
    return response;
}

// --- BACKEND INTEGRATION: Đặt địa chỉ mặc định ---
async function setDefaultAddressAPI(addressId) {
    console.log(`API CALL (SIMULATED): Setting address ${addressId} as default...`);
    // --- TODO: Replace with actual fetch() PUT/POST to set default address endpoint ---
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`API RESPONSE (SIMULATED): Address ${addressId} set as default.`);
    return { success: true };
}

// --- BACKEND INTEGRATION: Xóa địa chỉ ---
async function deleteAddressAPI(addressId) {
    console.log(`API CALL (SIMULATED): Deleting address ${addressId}...`);
    // --- TODO: Replace with actual fetch() DELETE to address endpoint ---
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`API RESPONSE (SIMULATED): Address ${addressId} deleted.`);
    return { success: true };
}


// --- Cập nhật tên hiển thị ---
function updateUserNameDisplay(newName) {
    const userNameElements = document.querySelectorAll('.user-name'); // Header và có thể cả welcome msg
    userNameElements.forEach(el => {
        el.textContent = newName;
    });
    // Cập nhật cả welcome message nếu có
    const welcomeMsg = document.querySelector('#overview-section .welcome-message');
    if (welcomeMsg) {
        welcomeMsg.textContent = `Chào mừng trở lại, ${newName}!`;
    }
     // Cập nhật cả tên trong form tài khoản (mặc dù người dùng vừa nhập)
     const accNameInput = document.getElementById('accName');
     if (accNameInput) {
         accNameInput.value = newName;
     }
}

// --- Render danh sách địa chỉ trong mục Tài khoản ---
function renderAddressList() {
    const addressListContainer = document.querySelector('#addresses .address-list');
    if (!addressListContainer) return;

    addressListContainer.innerHTML = ''; // Xóa list cũ
     // --- BACKEND INTEGRATION: Nên lấy userAddresses từ state đã fetch ---
     if (userAddresses.length === 0) {
         addressListContainer.innerHTML = '<p>Bạn chưa có địa chỉ nào được lưu.</p>';
         return;
     }

    userAddresses.forEach(addr => {
        const item = document.createElement('div');
        item.className = `address-item ${addr.isDefault ? 'default' : ''}`;
        item.dataset.addressId = addr.id;
        item.innerHTML = `
            <p>
                <strong>${addr.name || 'Không tên'}</strong><br>
                ${addr.phone || 'Không có SĐT'}<br>
                ${addr.street || ''}, ${addr.ward || ''}, ${addr.district || ''}, ${addr.city || ''}<br>
                ${addr.isDefault ? '<span class="badge badge-success">Mặc định</span>' : ''}
            </p>
            <div class="address-actions">
                <button class="btn btn-sm btn-outline btn-edit-address">Sửa</button>
                <button class="btn btn-sm btn-danger btn-delete-address">Xóa</button>
                ${!addr.isDefault ? '<button class="btn btn-sm btn-secondary btn-set-default-address">Đặt mặc định</button>' : ''}
            </div>
        `;
        addressListContainer.appendChild(item);
    });
}

// --- Xử lý sự kiện click trong danh sách địa chỉ (Delegation) ---
const addressListContainer = document.querySelector('#addresses .address-list');
if (addressListContainer) {
    addressListContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const addressItem = target.closest('.address-item');
        if (!addressItem) return;
        const addressId = addressItem.dataset.addressId;

        if (target.matches('.btn-edit-address')) {
            event.preventDefault();
            // --- TODO: Implement Edit Address Modal/Form ---
            console.log(`Edit address: ${addressId} (Chức năng chưa hoàn thiện)`);
             alert("Chức năng sửa địa chỉ chưa được hoàn thiện.");
        } else if (target.matches('.btn-delete-address')) {
            event.preventDefault();
            if (confirm(`Bạn có chắc chắn muốn xóa địa chỉ này không?`)) {
                 // --- BACKEND CALL ---
                 target.disabled = true; target.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
                 try {
                     await deleteAddressAPI(addressId);
                     // Cập nhật state cục bộ
                     userAddresses = userAddresses.filter(addr => addr.id !== addressId);
                     renderAddressList(); // Vẽ lại danh sách
                     populateAddressOptions(); // Cập nhật dropdown giỏ hàng
                     addNotification("Đã xóa địa chỉ.", "success");
                 } catch(error) {
                      addNotification(`Lỗi xóa địa chỉ: ${error.message}`, "error");
                      target.disabled = false; target.innerHTML = `Xóa`;
                 }
            }
        } else if (target.matches('.btn-set-default-address')) {
            event.preventDefault();
            // --- BACKEND CALL ---
             target.disabled = true; target.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
             try {
                 await setDefaultAddressAPI(addressId);
                 // Cập nhật state cục bộ
                 userAddresses.forEach(addr => {
                     addr.isDefault = (addr.id === addressId);
                 });
                 renderAddressList(); // Vẽ lại danh sách
                 populateAddressOptions(); // Cập nhật dropdown giỏ hàng
                 addNotification("Đã đặt địa chỉ làm mặc định.", "success");
             } catch (error) {
                  addNotification(`Lỗi đặt mặc định: ${error.message}`, "error");
                  target.disabled = false; target.innerHTML = `Đặt mặc định`;
             }
        }
    });
}

// --- Xử lý Thêm địa chỉ mới ---
const addAddressButton = document.querySelector('#addresses .btn-primary'); // Nút "Thêm địa chỉ"
const addAddressModal = document.createElement('div'); // Tạo modal bằng JS
addAddressModal.id = 'addAddressModal';
addAddressModal.className = 'modal modal-add-address'; // Thêm class để style
addAddressModal.style.display = 'none'; // Ẩn ban đầu
addAddressModal.innerHTML = `
    <button class="close-modal" id="closeAddAddressModal">×</button>
    <h2>Thêm địa chỉ mới</h2>
    <form id="addAddressForm">
        <div class="form-group">
            <label for="newAddrName">Họ tên người nhận *</label>
            <input type="text" id="newAddrName" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="newAddrPhone">Số điện thoại *</label>
            <input type="tel" id="newAddrPhone" class="form-control" required>
        </div>
         <div class="form-group">
            <label for="newAddrStreet">Số nhà, tên đường *</label>
            <input type="text" id="newAddrStreet" class="form-control" required>
        </div>
         <div class="form-group">
             <label for="newAddrCity">Tỉnh/Thành phố *</label>
             <input type="text" id="newAddrCity" class="form-control" required> {/* TODO: Chuyển thành Select */}
         </div>
         <div class="form-group">
             <label for="newAddrDistrict">Quận/Huyện *</label>
             <input type="text" id="newAddrDistrict" class="form-control" required>{/* TODO: Chuyển thành Select */}
         </div>
         <div class="form-group">
             <label for="newAddrWard">Phường/Xã *</label>
             <input type="text" id="newAddrWard" class="form-control" required> {/* TODO: Chuyển thành Select */}
         </div>
         <div class="form-group form-check">
             <input type="checkbox" id="newAddrIsDefault">
             <label for="newAddrIsDefault">Đặt làm địa chỉ mặc định</label>
         </div>
        <button type="submit" class="btn btn-primary">Lưu địa chỉ</button>
    </form>
`;
document.body.appendChild(addAddressModal); // Thêm modal vào body

// Lấy tham chiếu đến các element trong modal vừa tạo
const closeAddAddressModalBtn = document.getElementById('closeAddAddressModal');
const addAddressForm = document.getElementById('addAddressForm');

// Mở modal khi nhấn nút "Thêm địa chỉ"
addAddressButton?.addEventListener('click', () => {
    addAddressForm.reset(); // Xóa dữ liệu form cũ
    openModal(addAddressModal); // Sử dụng hàm openModal hiện có
});

// Đóng modal
closeAddAddressModalBtn?.addEventListener('click', () => closeModal(addAddressModal));

// Xử lý submit form thêm địa chỉ
addAddressForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newAddressData = {
        name: document.getElementById('newAddrName').value,
        phone: document.getElementById('newAddrPhone').value,
        street: document.getElementById('newAddrStreet').value,
        city: document.getElementById('newAddrCity').value,
        district: document.getElementById('newAddrDistrict').value,
        ward: document.getElementById('newAddrWard').value,
        isDefault: document.getElementById('newAddrIsDefault').checked
    };

     const submitBtn = addAddressForm.querySelector('button[type="submit"]');
     submitBtn.disabled = true; submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang lưu...`;
     showLoading();

    try {
        const response = await addAddressAPI(newAddressData); // --- BACKEND CALL ---
        if (response.success && response.newAddress) {
            // Cập nhật state cục bộ
            // Nếu đặt làm mặc định, bỏ mặc định cũ
            if (response.newAddress.isDefault) {
                userAddresses.forEach(addr => { addr.isDefault = false; });
            }
            userAddresses.push(response.newAddress);
            renderAddressList(); // Vẽ lại danh sách trong Account
            populateAddressOptions(); // Cập nhật dropdown trong Cart
            closeModal(addAddressModal); // Đóng modal
            addNotification("Đã thêm địa chỉ mới.", "success");
        } else {
            throw new Error(response.message || "Không thể thêm địa chỉ.");
        }
    } catch (error) {
        addNotification(`Lỗi thêm địa chỉ: ${error.message}`, "error");
    } finally {
         hideLoading();
         submitBtn.disabled = false; submitBtn.innerHTML = `Lưu địa chỉ`;
    }
});
    // =========================================================================
    // Wishlist Functionality (Backend Interaction)
    // =========================================================================

     // --- BACKEND INTEGRATION: Fetch initial wishlist ---
     async function fetchWishlistAPI() {
         console.log("API CALL (SIMULATED): Fetching wishlist...");
         // --- TODO: Replace with actual fetch() to wishlist endpoint ---
         await new Promise(resolve => setTimeout(resolve, 400));
         // Example response: [{ id, name, price, imageSrc }, ...]
         const mockWishlist = [ // Simulate initial items
             { id: 'GP-AC-01', name: 'Chuột không dây GadgetPro Z1 Silent', price: 950000, imageSrc: 'https://via.placeholder.com/120x120.png/fdcb6e/2d3436?text=Mouse+GP' },
             { id: 'NT-CP-01', name: 'SSD NovaTech Speedster 2TB NVMe', price: 4800000, imageSrc: 'https://via.placeholder.com/120x120.png/a29bfe/ffffff?text=SSD+NT' }
         ];
         console.log("API RESPONSE (SIMULATED): Received wishlist.");
         return mockWishlist;
     }

    // --- BACKEND INTEGRATION: Add/Remove from server ---
     async function updateServerWishlistAPI(productId, add = true) {
         console.log(`API CALL (SIMULATED): ${add ? 'Adding' : 'Removing'} product ${productId} ${add ? 'to' : 'from'} wishlist...`);
         // --- TODO: Replace with actual fetch() to add/remove wishlist endpoint ---
         // Use POST for add, DELETE for remove, or a single endpoint with an action flag. Send productId.
         await new Promise(resolve => setTimeout(resolve, 400));
         console.log(`API RESPONSE (SIMULATED): Wishlist updated on server for product ${productId}.`);
         // Example response: { success: true }
         return { success: true };
     }

    function renderWishlist() { // Renders UI based on local `wishlistItems`
        if (!wishlistGrid || !emptyWishlistMessage) return;
        wishlistGrid.innerHTML = '';
        if (wishlistItems.length === 0) {
            emptyWishlistMessage.style.display = 'block';
            wishlistGrid.style.display = 'none';
        } else {
            emptyWishlistMessage.style.display = 'none';
            wishlistGrid.style.display = 'grid';
            wishlistItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'wishlist-item';
                itemElement.dataset.productId = item.id;
                 itemElement.dataset.price = item.price; // Include for getProductDataFromElement if needed
                 itemElement.innerHTML = `
                    <img src="${item.imageSrc || 'https://via.placeholder.com/120x120.png?text=N/A'}" alt="${item.name || ''}">
                    <h4>${item.name || 'Sản phẩm'}</h4>
                    <p class="price">${formatCurrency(item.price)}</p>
                    <div class="wishlist-item-actions">
                      <button class="btn btn-primary btn-sm btn-add-cart"><i class="fas fa-cart-plus"></i> Thêm giỏ</button>
                      <button class="btn btn-danger btn-sm wishlist-remove-btn"><i class="fas fa-trash"></i> Xóa</button>
                    </div>`;
                wishlistGrid.appendChild(itemElement);
            });
        }
        // --- Update Wishlist Buttons Everywhere ---
        // After rendering, ensure buttons in store/detail view reflect the current state
         wishlistItems.forEach(item => updateWishlistButtonState(item.id, true));
         // Also need to potentially mark items NOT in the list as inactive
         // This might be inefficient; better to update only the specific item's buttons when adding/removing.
    }

    async function addToWishlist(itemData) {
        if (!itemData || !itemData.id) return;
        if (wishlistItems.some(item => item.id === itemData.id)) return; // Already exists locally

        // --- Optimistic UI Update ---
        wishlistItems.push({ ...itemData }); // Add locally
        renderWishlist(); // Re-render if wishlist section is active
        updateWishlistButtonState(itemData.id, true); // Update buttons in store/detail
        // --- End Optimistic ---

        try {
            const response = await updateServerWishlistAPI(itemData.id, true); // --- BACKEND CALL ---
            if (!response.success) throw new Error("Failed to add item to wishlist on server.");
            console.log(`Item ${itemData.id} added to wishlist on server.`);
            addNotification(`Đã thêm "${itemData.name}" vào Yêu thích.`, 'info');
             // --- BACKEND INTEGRATION: Optionally re-fetch wishlist to ensure sync ---
             // wishlistItems = await fetchWishlistAPI(); renderWishlist();
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            addNotification(`Lỗi thêm vào Yêu thích: ${error.message}`, 'error');
             // --- Revert Optimistic Update ---
             wishlistItems = wishlistItems.filter(item => item.id !== itemData.id);
             renderWishlist(); // Re-render if needed
             updateWishlistButtonState(itemData.id, false); // Revert button state
             // --- End Revert ---
        }
    }

    async function removeFromWishlist(productId) {
        const itemToRemove = wishlistItems.find(item => item.id === productId);
        if (!itemToRemove) return; // Not in local list

        // --- Optimistic UI Update ---
        const originalWishlist = [...wishlistItems]; // Store original state for potential revert
        wishlistItems = wishlistItems.filter(item => item.id !== productId);
        renderWishlist(); // Re-render if active
        updateWishlistButtonState(productId, false); // Update buttons
        // --- End Optimistic ---

        try {
            const response = await updateServerWishlistAPI(productId, false); // --- BACKEND CALL ---
            if (!response.success) throw new Error("Failed to remove item from wishlist on server.");
            console.log(`Item ${productId} removed from wishlist on server.`);
            addNotification(`Đã xóa "${itemToRemove.name}" khỏi Yêu thích.`);
             // --- BACKEND INTEGRATION: Optionally re-fetch wishlist ---
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            addNotification(`Lỗi xóa khỏi Yêu thích: ${error.message}`, 'error');
             // --- Revert Optimistic Update ---
             wishlistItems = originalWishlist; // Restore original list
             renderWishlist(); // Re-render if needed
             updateWishlistButtonState(productId, true); // Revert button state
             // --- End Revert ---
        }
    }

    function updateWishlistButtonState(productId, isWishlisted) { // Front-end UI update
        const allWishlistButtons = document.querySelectorAll(`.wishlist-btn[data-product-id="${productId}"], .wishlist-btn-detail[data-product-id="${productId}"]`);
        allWishlistButtons.forEach(button => {
            button.classList.toggle('active', isWishlisted);
            if (button.classList.contains('wishlist-btn-detail')) { // Detail modal button has text
                 button.innerHTML = isWishlisted ? '<i class="fas fa-heart"></i> Đã thích' : '<i class="far fa-heart"></i> Yêu thích';
            } else { // Grid/list buttons only have icon
                 button.innerHTML = isWishlisted ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
                 button.title = isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích";
            }
        });
        // Update the button specifically on the product card if it exists
        const productCardButton = document.querySelector(`.product-card[data-product-id="${productId}"] .wishlist-btn, .product-list-item[data-product-id="${productId}"] .wishlist-btn`);
        if (productCardButton) {
             productCardButton.classList.toggle('active', isWishlisted);
             productCardButton.innerHTML = isWishlisted ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
             productCardButton.title = isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích";
        }
         // Update button in the detail modal (ensure correct selector)
        const detailButton = detailModalContent?.querySelector(`.wishlist-btn-detail`);
        // Also check if the modal is showing the correct product
        const detailProductH3 = detailModalContent?.querySelector('h3[data-product-id]');
        if (detailButton && detailProductH3 && detailProductH3.dataset.productId === productId) {
             detailButton.classList.toggle('active', isWishlisted);
             detailButton.innerHTML = isWishlisted ? '<i class="fas fa-heart"></i> Đã thích' : '<i class="far fa-heart"></i> Yêu thích';
         }
    }


    // =========================================================================
    // Contact & Feedback Section (Backend Interaction)
    // =========================================================================

    // --- BACKEND INTEGRATION: Fetch feedback messages ---
    async function fetchFeedbackAPI() {
        console.log("API CALL (SIMULATED): Fetching shop feedback...");
        // --- TODO: Replace with actual fetch() to feedback endpoint ---
        await new Promise(resolve => setTimeout(resolve, 600));
        // Example Response: [{ reqId, reqTitle, response, date, status, isRead? }, ...]
        const mockFeedback = [
             { reqId: 'S456', reqTitle: 'Tư vấn lắp đặt mạng', response: 'Chào bạn, bộ phận kỹ thuật đã tiếp nhận yêu cầu #S456. Chúng tôi sẽ liên hệ lại bạn trong vòng 24h làm việc qua SĐT 09xxxxxxxx để tư vấn chi tiết. Xin cảm ơn!', date: '21/10/2023', status: 'replied', isRead: false },
             { reqId: 'Hỗ trợ SP #P789', reqTitle: 'Hỏi về tình trạng đơn hàng', response: 'Đơn hàng #P789 (Laptop Gaming ABC) của bạn hiện đang trên đường vận chuyển, dự kiến giao hàng vào ngày mai. Mã vận đơn: GHN123XYZ. Bạn có thể theo dõi chi tiết hơn tại trang Lịch sử đơn hàng.', date: '20/10/2023', status: 'replied', isRead: true},
             { reqId: 'S112', reqTitle: 'Sửa laptop không lên nguồn', response: 'Yêu cầu #S112 đã hoàn thành. Thiết bị đã được sửa chữa và sẵn sàng để bạn nhận lại tại cửa hàng. Chi phí sửa chữa là 1.500.000đ. Cảm ơn bạn đã sử dụng dịch vụ!', date: '10/10/2023', status: 'completed_replied', isRead: true}
        ];
        console.log("API RESPONSE (SIMULATED): Received feedback.");
        return mockFeedback;
    }

     // --- BACKEND INTEGRATION: Mark feedback as read ---
     async function markFeedbackReadAPI(feedbackOrReqId) {
         console.log(`API CALL (SIMULATED): Marking feedback as read for ID: ${feedbackOrReqId}...`);
         // --- TODO: Replace with actual fetch() to mark feedback read endpoint ---
         await new Promise(resolve => setTimeout(resolve, 300));
         console.log("API RESPONSE (SIMULATED): Feedback marked as read on server.");
         return true;
     }

    async function renderShopFeedback() {
        if (!shopFeedbackListContainer) return;
        shopFeedbackListContainer.innerHTML = '<p>Đang tải phản hồi...</p>'; // Loading state

        try {
            const feedbackData = await fetchFeedbackAPI(); // --- BACKEND CALL ---

            if (!feedbackData || feedbackData.length === 0) {
                shopFeedbackListContainer.innerHTML = '<p class="empty-feedback">Chưa có phản hồi mới từ cửa hàng.</p>';
            } else {
                shopFeedbackListContainer.innerHTML = '';
                feedbackData.forEach(fb => {
                    const feedbackItem = document.createElement('div');
                    feedbackItem.className = `feedback-item ${fb.isRead ? 'read' : 'unread'}`; // Add class for read status
                    feedbackItem.dataset.feedbackId = fb.reqId; // Use reqId or a specific feedback ID if available
                    feedbackItem.innerHTML = `
                        <div class="feedback-header">
                          <span class="feedback-req">Về yêu cầu: <strong>${fb.reqTitle} (${fb.reqId})</strong></span>
                          <span class="feedback-date"><i class="far fa-clock"></i> ${fb.date}</span>
                        </div>
                        <p class="feedback-content">${fb.response}</p>
                        <div class="feedback-actions">
                          <button class="btn btn-sm btn-link-style view-request-details" data-request-id="${fb.reqId}">Xem chi tiết yêu cầu</button>
                          <button class="btn btn-sm btn-outline mark-feedback-read" ${fb.isRead ? 'disabled' : ''}>${fb.isRead ? 'Đã đọc' : 'Đánh dấu đã đọc'}</button>
                        </div>`;
                    shopFeedbackListContainer.appendChild(feedbackItem);
                });
                // Add event listener for feedback actions (delegated)
                 if (!shopFeedbackListContainer.dataset.listenerAttached) { // Prevent attaching multiple times
                    shopFeedbackListContainer.addEventListener('click', handleFeedbackActionClick);
                    shopFeedbackListContainer.dataset.listenerAttached = 'true';
                 }
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
            shopFeedbackListContainer.innerHTML = '<p class="empty-feedback error">Lỗi tải phản hồi từ cửa hàng.</p>';
        }
    }

    async function handleFeedbackActionClick(event) { // Event handler for feedback items
        const target = event.target;
        const feedbackItem = target.closest('.feedback-item');
        if (!feedbackItem) return;
        const feedbackId = feedbackItem.dataset.feedbackId; // Use the ID from the item

        if (target.matches('.view-request-details')) {
             const requestId = target.dataset.requestId;
             console.log(`Navigate to details for request: ${requestId}`);
             const orderType = requestId.startsWith('S') ? 'service' : 'product';
             setActiveSection('order-history');
             setTimeout(() => {
                  // Activate correct tab (assuming helper function or direct manipulation)
                  activateOrderHistoryTab(orderType);
                  showOrderDetailModal(requestId, orderType); // Needs fetch
             }, 350);
        } else if (target.matches('.mark-feedback-read') && !target.disabled) {
             console.log(`Marking feedback ${feedbackId} as read`);
             target.disabled = true;
             target.textContent = 'Đang xử lý...';
             try {
                 await markFeedbackReadAPI(feedbackId); // --- BACKEND CALL ---
                 feedbackItem.classList.remove('unread');
                 feedbackItem.classList.add('read');
                 target.textContent = 'Đã đọc';
                 addNotification(`Đã đánh dấu phản hồi cho "${feedbackId}" là đã đọc.`);
             } catch (error) {
                 console.error("Failed to mark feedback read:", error);
                 addNotification("Lỗi: Không thể đánh dấu đã đọc.", "error");
                 target.disabled = false; // Re-enable button on error
                 target.textContent = 'Đánh dấu đã đọc';
             }
        }
    }
     // Helper to activate order history tab
     function activateOrderHistoryTab(orderType = 'product') {
        const pTab = orderHistorySection?.querySelector('.tab-link[data-tab="product-orders"]');
        const sTab = orderHistorySection?.querySelector('.tab-link[data-tab="service-orders"]');
        const pCont = orderHistorySection?.querySelector('#product-orders');
        const sCont = orderHistorySection?.querySelector('#service-orders');
        if (!pTab || !sTab || !pCont || !sCont) return;
        const isProduct = orderType === 'product';
        if (pTab.classList.contains('active') !== isProduct) {
            (isProduct ? pTab : sTab).click(); // Click to activate correct tab
        }
     }


    // =========================================================================
    // Detail Modal Functionality (Backend Interaction)
    // =========================================================================

    // --- BACKEND INTEGRATION: Fetch detailed product data ---
    async function fetchProductDetailsAPI(productId) {
        console.log(`API CALL (SIMULATED): Fetching details for product ID: ${productId}...`);
        // --- TODO: Replace with actual fetch() to your product detail endpoint ---
        // Pass productId in the URL path or query params
        await new Promise(resolve => setTimeout(resolve, 600));
        // Example Response: { id, name, price, description, imageSrc, category: {...}, brand: {...}, ratingHTML?, specs: [{key, value}, ...], stock?, images: [...] }
        const mockProductData = getProductDataFromElement(document.querySelector(`.product-card[data-product-id="${productId}"], .product-list-item[data-product-id="${productId}"]`)) || { id: productId, name: 'Sản phẩm không tìm thấy', price: 0 }; // Fallback
        mockProductData.description = `Đây là mô tả chi tiết (lấy từ API) cho ${mockProductData.name}. Sản phẩm này có những đặc tính tuyệt vời... Lorem ipsum dolor sit.`;
        mockProductData.specs = [ { key: 'CPU', value: 'Core i9 (API)' }, { key: 'RAM', value: '32GB (API)' }, { key: 'Ổ cứng', value: '1TB SSD NVMe (API)' } ];
        mockProductData.images = [mockProductData.imageSrc]; // Add more images if API provides
        console.log(`API RESPONSE (SIMULATED): Received details for product ${productId}.`);
        return mockProductData;
    }

    // --- BACKEND INTEGRATION: Fetch detailed order data ---
     async function fetchOrderDetailsAPI(orderId, orderType) {
         console.log(`API CALL (SIMULATED): Fetching details for ${orderType} order ID: ${orderId}...`);
         // --- TODO: Replace with actual fetch() to your order detail endpoint ---
         await new Promise(resolve => setTimeout(resolve, 700));
         // Example response structure should match what showOrderDetailModal needs
         // For Product: { orderId, date, status, statusClass, items: [{name, qty, price, imageSrc}], shippingAddress, shippingFee, paymentMethod, trackingCode?, subtotal, total }
         // For Service: { orderId, date, status, statusClass, serviceType, title, description, attachedFiles:[], progressSteps:[{name, status}], chatLog:[{sender, message}] }

         // --- Reusing Mock data from previous implementation for simulation ---
         const orderDate = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');
         const statuses = { P789: "Đang giao", P123: "Đã giao", P098: "Đã hủy", S456: "Đang xử lý", S112: "Hoàn thành" };
         const statusClasses = { P789: "status-shipped", P123: "status-delivered", P098: "status-cancelled", S456: "status-processing", S112: "status-completed" };
         let mockData = { orderId, date: orderDate, status: statuses[orderId] || "Không rõ", statusClass: statusClasses[orderId] || "status-pending" };

         if (orderType === 'product') {
             let items = [], shippingAddress = "N/A", subtotal = 0, shippingFee = 0, total=0, trackingCode=null, paymentMethod = "COD";
              if (orderId === 'P789') { items = [{ name: 'Laptop Gaming ABC Model X (API)', quantity: 1, price: 25500000, imageSrc: '...' }]; shippingAddress = "..."; shippingFee = 35000; trackingCode='...'; paymentMethod = "..."; }
              else if (orderId === 'P123') { items = [{ name: 'Điện thoại XYZ Pro 256GB (API)', quantity: 1, price: 18000000, imageSrc: '...' }]; shippingAddress = "..."; shippingFee = 25000; paymentMethod = "..."; }
              else if (orderId === 'P098') { items = [{ name: 'Tai nghe Bluetooth Z Gaming (API)', quantity: 1, price: 1200000, imageSrc: '...' }]; shippingAddress = "..."; shippingFee = 0; }
              subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);
              total = subtotal + shippingFee;
              mockData = { ...mockData, items, shippingAddress, shippingFee, paymentMethod, trackingCode, subtotal, total };
         } else { // Service
              let serviceType = "N/A", title = "N/A", description = "N/A", progressSteps = [], chatLog = [], attachedFiles = [];
             if(orderId === 'S456'){ serviceType = "Tư vấn"; title = "Tư vấn mạng (API)"; description = "..."; progressSteps = [/*...*/]; chatLog = [/*...*/]; attachedFiles = ['...']; }
             else if (orderId === 'S112') { serviceType = "Sửa chữa"; title = "Sửa laptop (API)"; description = "..."; progressSteps = [/*...*/]; chatLog = [/*...*/]; }
             mockData = { ...mockData, serviceType, title, description, attachedFiles, progressSteps, chatLog };
         }
         console.log(`API RESPONSE (SIMULATED): Received details for order ${orderId}.`);
         return mockData;
     }

    async function showProductDetailModal(productId) { // Removed productElement param
        if (!detailModal || !detailModalContent) return;
        detailModalContent.innerHTML = '<p>Đang tải chi tiết sản phẩm...</p>'; // Loading state
        openModal(detailModal); // Open modal first

        try {
            showLoading(); // Optional: Show main loading indicator too
            const productData = await fetchProductDetailsAPI(productId); // --- BACKEND CALL ---
            if (!productData || productData.name === 'Sản phẩm không tìm thấy') { // Handle not found case
                 detailModalContent.innerHTML = `<h3>Sản phẩm không tồn tại</h3><p>Không tìm thấy thông tin cho sản phẩm với ID: ${productId}</p>`;
                 return;
            }

            const isCurrentlyWishlisted = wishlistItems.some(item => item.id === productId); // Check against local wishlist state
            detailModalContent.innerHTML = `
                <h3 data-product-id="${productId}">${productData.name}</h3>
                <div class="product-detail-layout">
                  <div class="product-detail-gallery"><div class="main-image"><img src="${productData.imageSrc || productData.images?.[0] || ''}" alt="${productData.name}"></div></div>
                  <div class="product-detail-info">
                    <a href="#" class="product-category-link">${productData.category?.name || productData.category || 'Chưa phân loại'}</a>
                    <div class="rating">${productData.ratingHTML || '<span class="text-muted">Chưa có đánh giá</span>'}</div>
                    <p class="price">${formatCurrency(productData.price)}</p>
                    <p class="product-detail-description">${productData.description || 'Không có mô tả.'}</p>
                    <div class="product-detail-actions">
                      <button class="btn btn-primary btn-add-cart-detail" data-product-id="${productId}"><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
                      <button class="btn btn-outline wishlist-btn-detail ${isCurrentlyWishlisted ? 'active' : ''}" data-product-id="${productId}">
                        ${isCurrentlyWishlisted ? '<i class="fas fa-heart"></i> Đã thích' : '<i class="far fa-heart"></i> Yêu thích'}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="product-detail-specs">
                  <h4>Thông số kỹ thuật</h4>
                  <ul>${(productData.specs || []).map(s => `<li><strong>${s.key}:</strong> <span>${s.value}</span></li>`).join('') || '<li>Không có thông số.</li>'}</ul>
                </div>`;
        } catch (error) {
            console.error("Error fetching product details:", error);
            detailModalContent.innerHTML = `<h3>Lỗi</h3><p>Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.</p>`;
        } finally {
             hideLoading();
        }
    }

    async function showOrderDetailModal(orderId, orderType) {
        if (!detailModal || !detailModalContent) return;
        detailModalContent.innerHTML = '<p>Đang tải chi tiết đơn hàng...</p>';
        openModal(detailModal);

        try {
             showLoading();
             const orderData = await fetchOrderDetailsAPI(orderId, orderType); // --- BACKEND CALL ---

             let detailHTML = `<p>Lỗi: Không thể tải chi tiết đơn hàng #${orderId}.</p>`; // Default error

             if (orderType === 'product' && orderData.items) { // Check if data looks correct
                 detailHTML = `
                     <h3>Chi tiết Đơn hàng #${orderData.orderId}</h3>
                     <div class="order-detail-modal-section order-detail-header-info">
                       <p><strong>Ngày đặt:</strong> ${orderData.date}</p>
                       <p><strong>Trạng thái:</strong> <span class="status ${orderData.statusClass}">${orderData.status}</span></p>
                       <p><strong>Tổng tiền:</strong> ${formatCurrency(orderData.total)}</p>
                     </div>
                     <div class="order-detail-modal-section order-detail-item-list">
                       <h4>Sản phẩm đã đặt</h4>
                       ${orderData.items.length > 0 ? orderData.items.map(i => `...`).join('') : '<p>...</p>'}
                     </div>
                     <div class="order-detail-modal-section order-detail-shipping">
                       <h4>Thông tin giao hàng & Thanh toán</h4>
                       <p><strong>Địa chỉ:</strong> ${orderData.shippingAddress}</p>
                       <p><strong>Phí vận chuyển:</strong> ${formatCurrency(orderData.shippingFee)}</p>
                       <p><strong>Thanh toán:</strong> ${orderData.paymentMethod}</p>
                       ${orderData.trackingCode ? `<p><strong>Mã vận đơn:</strong> ...</p>` : ''}
                     </div>
                     <div class="order-detail-modal-section order-detail-totals">
                       <h4>Tổng cộng</h4>
                       <p>Tạm tính: ${formatCurrency(orderData.subtotal)}</p>
                       <p>Phí vận chuyển: ${formatCurrency(orderData.shippingFee)}</p>
                       <p><strong>Tổng thanh toán: <strong>${formatCurrency(orderData.total)}</strong></strong></p>
                       <div class="order-detail-actions">
                         ${orderData.status !== 'Đã hủy' && orderData.status !== 'Đang giao' ? '<button class="btn btn-primary btn-sm">Mua lại</button>' : ''}
                         <button class="btn btn-outline btn-sm">Yêu cầu hỗ trợ</button>
                       </div>
                     </div>`;
             } else if (orderType === 'service' && orderData.title) { // Check if data looks correct
                 detailHTML = `
                     <h3>Chi tiết Yêu cầu Dịch vụ #${orderData.orderId}</h3>
                     <div class="order-detail-modal-section order-detail-header-info">
                       <p><strong>Ngày gửi:</strong> ${orderData.date}</p>
                       <p><strong>Loại dịch vụ:</strong> ${orderData.serviceType}</p>
                       <p><strong>Trạng thái:</strong> <span class="status ${orderData.statusClass}">${orderData.status}</span></p>
                     </div>
                     <div class="order-detail-modal-section">
                       <h4>Chi tiết yêu cầu</h4>
                       <p><strong>Tiêu đề:</strong> ${orderData.title}</p>
                       <p><strong>Mô tả:</strong> ${orderData.description}</p>
                       ${orderData.attachedFiles?.length > 0 ? `<p><strong>Tệp đính kèm:</strong> ...</p>` : ''}
                     </div>
                     <div class="order-detail-modal-section">
                       <h4>Tiến trình xử lý</h4>
                       <ul class="progress-tracker">${(orderData.progressSteps || []).map(p => `<li class="${p.status}">${p.name}</li>`).join('')}</ul>
                     </div>
                     <div class="order-detail-modal-section">
                       <h4>Trao đổi với hỗ trợ (Demo)</h4>
                       <div class="chat-mockup">
                         ${(orderData.chatLog || []).map(c => `<p><strong>${c.sender}:</strong> ${c.message}</p>`).join('')}
                         <textarea placeholder="Nhập nội dung trả lời..." rows="2"></textarea>
                         <button class="btn btn-sm btn-primary">Gửi tin nhắn</button>
                       </div>
                     </div>`;
             }
            detailModalContent.innerHTML = detailHTML;
        } catch (error) {
             console.error("Error fetching order details:", error);
             detailModalContent.innerHTML = `<h3>Lỗi</h3><p>Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.</p>`;
        } finally {
             hideLoading();
        }
    }


    // =========================================================================
    // Store Functionality (Filtering/Sorting/Pagination/Search - Backend Heavy)
    // =========================================================================

     // --- BACKEND INTEGRATION: This is the core function to fetch products based on filters ---
     async function fetchProductsAPI(filters) {
         console.log("API CALL (SIMULATED): Fetching products with filters:", filters);
         // --- TODO: Replace with actual fetch() to your product search/filter endpoint ---
         // Construct query parameters from the filters object (category, brand, maxPrice, sortBy, page, searchTerm)
         // Example: /api/products?category=laptops&brand=TechBrand&sortBy=price-asc&page=2&search=pro
         const params = new URLSearchParams();
         if (filters.category && filters.category !== 'all') params.append('category', filters.category);
         if (filters.brand && filters.brand !== 'all') params.append('brand', filters.brand);
         if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
         if (filters.rating) params.append('minRating', filters.rating);
         if (filters.sortBy) params.append('sortBy', filters.sortBy);
         if (filters.page) params.append('page', filters.page);
         if (filters.searchTerm) params.append('search', filters.searchTerm);

         console.log("API Query Params (Simulated):", params.toString());
         await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

         // --- Simulate API Response ---
         // Backend should perform filtering based on params and return matching products for the current page
         // Also return pagination info (total items matching filters, current page, total pages)
         let mockProducts = [];
         const itemsPerPage = 8;
         const totalMockMatchingItems = 35; // Simulate total items matching filters (e.g., 35 laptops from TechBrand under 30M)
         const totalPages = Math.ceil(totalMockMatchingItems / itemsPerPage);
         const startIndex = (filters.page - 1) * itemsPerPage;
         const endIndex = Math.min(startIndex + itemsPerPage, totalMockMatchingItems);

         for (let i = startIndex; i < endIndex; i++) {
             // Generate mock data - ENSURE it somewhat respects the filters for realistic testing
             const pId = `API-P-${i}`;
             const pPrice = Math.floor(Math.random() * (filters.maxPrice || 50000000)); // Price respecting maxPrice
             const pName = `${filters.brand !== 'all' ? filters.brand : 'SomeBrand'} ${filters.category !== 'all' ? filters.category : 'Product'} ${filters.searchTerm || ''} Model ${i + 1}`;
             const pImg = `https://via.placeholder.com/300x200.png/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(pName.slice(0,10))}`;
              const ratingStars = Math.max(filters.rating || 0, Math.floor(Math.random() * 3) + 3); // Respect minRating
              const ratingHTML = Array(5).fill(0).map((_, k) => `<i class="${k < ratingStars ? 'fas' : 'far'} fa-star"></i>`).join('');
              const ratingCount = Math.floor(Math.random()*200)+10;

             mockProducts.push({
                 id: pId,
                 name: pName,
                 price: pPrice,
                 imageSrc: pImg,
                 imageThumb: pImg.replace('300x200', '200x200'), // Simple thumb simulation
                 category: filters.category !== 'all' ? filters.category : 'various',
                 brand: filters.brand !== 'all' ? filters.brand : 'various',
                 ratingHTML: ratingHTML,
                 ratingCount: ratingCount,
                 description: `Mô tả ngắn lấy từ API cho ${pName}`
             });
         }

         const response = {
             products: mockProducts,
             pagination: {
                 currentPage: filters.page,
                 totalPages: totalPages,
                 totalItems: totalMockMatchingItems,
                 itemsPerPage: itemsPerPage
             }
         };
         console.log("API RESPONSE (SIMULATED): Received filtered products and pagination.");
         return response;
     }

    // --- Renders the product grid using data from API ---
    function renderProductGrid(products) {
        if (!productGrid) return;
        productGrid.innerHTML = ''; // Clear previous
        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p class="empty-section-msg">Không tìm thấy sản phẩm phù hợp.</p>';
            return;
        }
        let gridHTML = '';
        products.forEach(p => {
             const isFav = wishlistItems.some(w => w.id === p.id); // Check local wishlist state
             gridHTML += `
                <div class="product-card" data-product-id="${p.id}" data-category="${p.category}" data-brand="${p.brand}">
                  <div class="product-image">
                    <img src="${p.imageSrc}" alt="${p.name}">
                    <button class="wishlist-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}" data-product-id="${p.id}"> <i class="${isFav ? 'fas' : 'far'} fa-heart"></i></button>
                  </div>
                  <div class="product-content">
                    <a href="#" class="product-category-link">${p.category}</a>
                    <h4><a href="#">${p.name}</a></h4>
                    <div class="rating">${p.ratingHTML || ''}<span class="rating-count">(${p.ratingCount || 0})</span></div>
                    <p class="price">${formatCurrency(p.price)}</p>
                  </div>
                  <div class="product-actions">
                    <button class="btn btn-primary btn-sm btn-add-cart" data-product-id="${p.id}">Thêm</button>
                    <button class="btn btn-outline btn-sm btn-view-detail" data-product-id="${p.id}">Chi tiết</button>
                  </div>
                </div>`;
        });
        productGrid.innerHTML = gridHTML;
    }

    // --- Renders the product list view using data from API ---
    function renderProductList(products) {
        if (!productList) return;
        productList.innerHTML = ''; // Clear previous
        if (!products || products.length === 0) {
            productList.innerHTML = '<p class="empty-section-msg">Không tìm thấy sản phẩm phù hợp.</p>';
            return;
        }
        let listHTML = '';
        products.forEach(p => {
             const isFav = wishlistItems.some(w => w.id === p.id); // Check local wishlist state
             listHTML += `
                 <div class="product-list-item" data-product-id="${p.id}" data-category="${p.category}" data-brand="${p.brand}">
                   <div class="product-list-image">
                     <img src="${p.imageThumb || p.imageSrc}" alt="${p.name}">
                     <button class="wishlist-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}" data-product-id="${p.id}"><i class="${isFav ? 'fas' : 'far'} fa-heart"></i></button>
                   </div>
                   <div class="product-list-content">
                     <h4><a href="#">${p.name}</a></h4>
                     <div class="rating">${p.ratingHTML || ''}<span class="rating-count">(${p.ratingCount || 0})</span></div>
                     <p class="description">${p.description || ''}</p>
                   </div>
                   <div class="product-list-actions">
                     <p class="price">${formatCurrency(p.price)}</p>
                     <button class="btn btn-primary btn-sm btn-add-cart" data-product-id="${p.id}">Thêm</button>
                     <button class="btn btn-outline btn-sm btn-view-detail" data-product-id="${p.id}">Chi tiết</button>
                   </div>
                 </div>`;
        });
        productList.innerHTML = listHTML;
    }

    // --- This function now orchestrates fetching and rendering ---
    async function applyFilters() {
        if (!storeSection) return;
        console.log('Applying Filters/Search:', currentFilters);
        showLoading();

        try {
            const response = await fetchProductsAPI(currentFilters); // --- BACKEND CALL ---
            const { products, pagination } = response;

            // Render based on current view mode
            if (currentFilters.view === 'grid') {
                renderProductGrid(products);
            } else {
                renderProductList(products);
            }

            // Update pagination UI using data from API response
            updatePaginationUI(pagination);
            updateStoreResultsCount(pagination);

        } catch (error) {
            console.error("Error fetching products:", error);
            // Display error message to the user
            if (productGrid) productGrid.innerHTML = '<p class="empty-section-msg error">Lỗi tải sản phẩm. Vui lòng thử lại.</p>';
            if (productList) productList.innerHTML = '<p class="empty-section-msg error">Lỗi tải sản phẩm. Vui lòng thử lại.</p>';
            // Reset pagination/results count on error?
             updatePaginationUI({ currentPage: 1, totalPages: 0, totalItems: 0 });
             updateStoreResultsCount({ totalItems: 0, itemsPerPage: 8, currentPage: 1 });
        } finally {
            hideLoading();
        }
    }

    // --- Updates pagination links based on API response ---
     function updatePaginationUI(paginationData) {
         if (!paginationContainer || !paginationData) return;
         const { currentPage, totalPages } = paginationData;

         let paginationHTML = `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">«</a></li>`;

         // Basic pagination - show all pages (add ellipsis logic later if needed)
         for (let i = 1; i <= totalPages; i++) {
             paginationHTML += `<li class="page-item ${currentPage === i ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
         }

         paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">»</a></li>`;
         paginationContainer.innerHTML = paginationHTML;
     }

     // --- Updates the "Showing X-Y of Z" text ---
     function updateStoreResultsCount(paginationData) {
         if (!storeResultsCount || !paginationData) return;
         const { currentPage, itemsPerPage, totalItems } = paginationData;
          const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
          // Calculate actual number of items shown on current page
          const itemsOnThisPage = (productGrid?.children.length > 0 ? productGrid.children.length : productList?.children.length) || 0;
          const endItem = totalItems === 0 ? 0 : startItem + itemsOnThisPage - 1;


         storeResultsCount.textContent = totalItems > 0
             ? `Hiển thị ${startItem}-${endItem} / ${totalItems} SP`
             : 'Không có sản phẩm nào';
     }


    // --- Event Listeners for Store Controls (Front-end triggers for API calls) ---
    if (storeSection) {
        // Filter links (Category, Brand, Rating)
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = link.dataset.filterType;
                const value = link.dataset.filterValue;
                const rating = link.dataset.rating;
                const list = link.closest('.filter-list');
                list?.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active')); // Deactivate others in group

                if (type) { currentFilters[type] = value; link.classList.add('active'); }
                else if (rating) {
                    if (currentFilters.rating === parseInt(rating)) { // Clicked active rating again
                        currentFilters.rating = null; // Disable rating filter
                    } else {
                        currentFilters.rating = parseInt(rating);
                        link.classList.add('active'); // Activate clicked rating
                    }
                }
                currentFilters.page = 1; // Reset page on filter change
                applyFilters(); // Trigger API call
            });
        });

        // Price Range (Apply on mouseup/touchend)
        if (priceRange && priceRangeValue) {
            priceRange.addEventListener('input', () => { priceRangeValue.textContent = parseInt(priceRange.value).toLocaleString('vi-VN'); });
            const applyPriceFilter = () => { currentFilters.maxPrice = parseInt(priceRange.value); currentFilters.page = 1; applyFilters(); };
            priceRange.addEventListener('mouseup', applyPriceFilter);
            priceRange.addEventListener('touchend', applyPriceFilter);
        }
         // Price Button (Alternative)
         if (applyFilterBtn) applyFilterBtn.addEventListener('click', () => { currentFilters.maxPrice = parseInt(priceRange.value); currentFilters.page = 1; applyFilters(); });

        // Clear Filters Button
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                currentFilters = { category: 'all', brand: 'all', maxPrice: 50000000, rating: null, sortBy: 'newest', view: currentFilters.view, searchTerm: '', page: 1 };
                // Reset UI
                document.querySelectorAll('.store-filters .filter-link.active').forEach(l => l.classList.remove('active'));
                document.querySelector('.category-filter a[data-filter-value="all"]')?.classList.add('active');
                document.querySelector('.brand-filter a[data-filter-value="all"]')?.classList.add('active');
                if(priceRange) priceRange.value = 50000000;
                if(priceRangeValue) priceRangeValue.textContent = (50000000).toLocaleString('vi-VN');
                if(sortBySelect) sortBySelect.value = 'newest';
                if(storeSearchInput) storeSearchInput.value = '';
                applyFilters(); // Trigger API call with default filters
            });
        }

        // Sort By Select
        if (sortBySelect) { sortBySelect.addEventListener('change', () => { currentFilters.sortBy = sortBySelect.value; currentFilters.page = 1; applyFilters(); }); }

        // View Toggle Buttons (Purely Front-end view switch)
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                if (view === currentFilters.view || !productGrid || !productList) return;
                currentFilters.view = view;
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                productGrid.style.display = (view === 'grid') ? 'grid' : 'none';
                productList.style.display = (view === 'list') ? 'block' : 'none';
                // No API call needed here, just switching view
            });
        });

        // Pagination Links (Event Delegation)
        if (paginationContainer) {
            paginationContainer.addEventListener('click', (e) => {
                e.preventDefault();
                const link = e.target.closest('.page-link');
                const parentLi = link?.parentElement;
                if (!link || parentLi.classList.contains('disabled') || parentLi.classList.contains('active') || link.tagName === 'SPAN') return;
                const newPage = parseInt(link.dataset.page); // Get page number from data attribute
                if (!isNaN(newPage) && newPage !== currentFilters.page) {
                    currentFilters.page = newPage;
                    applyFilters(); // Trigger API call for the new page
                }
            });
        }

        // Store Search
        if (storeSearchInput && storeSearchButton) {
            const triggerSearch = () => { currentFilters.searchTerm = storeSearchInput.value; currentFilters.page = 1; applyFilters(); };
            storeSearchButton.addEventListener('click', triggerSearch);
            storeSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); triggerSearch(); } });
            storeSearchInput.addEventListener('keyup', (e) => { if (e.key === 'Escape') { storeSearchInput.value = ''; triggerSearch(); } });
            storeSearchInput.addEventListener('search', () => { if (storeSearchInput.value === '') triggerSearch(); });
        }
    } // End if (storeSection)

    // =========================================================================
    // Event Handlers (Delegation Setup - Mostly Front-end triggers)
    // =========================================================================
    function attachActionListeners() { // Setup listeners on static parent elements
        const productsArea = document.querySelector('.store-products-area'); // Includes grid and list
        if (productsArea) productsArea.addEventListener('click', handleStoreActionClick);
        if (wishlistGrid) wishlistGrid.addEventListener('click', handleWishlistActionClick);
        if (detailModalContent) detailModalContent.addEventListener('click', handleDetailModalActionClick);
        if (orderHistorySection) orderHistorySection.addEventListener('click', handleOrderHistoryActionClick);
        if (overviewSection) overviewSection.addEventListener('click', handleOverviewActionClick);
        // Cart listeners are attached separately in attachCartActionListeners
    }

    // --- Specific Click Handler Functions ---
    // These functions decide *what action* to take based on the click, often calling async functions

    function handleStoreActionClick(event) { // Handles clicks within store product list/grid
        const target = event.target;
        const productElement = target.closest('.product-card, .product-list-item');
        const productId = target.closest('[data-product-id]')?.dataset.productId;
        if (!productId) return; // Exit if no product ID found on clicked element or parents

        if (target.closest('.btn-add-cart')) {
             event.stopPropagation();
             // Need product data to add to cart. Try getting it from the element first.
             const productData = getProductDataFromElement(productElement);
             if (productData) {
                 handleAddToCart(productData); // Calls async updateServerCartAPI inside
             } else { // Fallback: fetch details if needed (less ideal)
                 console.warn("Could not get product data from element, need to fetch for add to cart.");
                 // You might need a function here like `fetchAndAddToCart(productId)`
                 addNotification("Lỗi: Không thể lấy thông tin sản phẩm.", "error");
             }
        } else if (target.closest('.wishlist-btn')) {
             event.stopPropagation();
             const button = target.closest('.wishlist-btn');
             const isAdding = !button.classList.contains('active');
              // Need product data to add to wishlist for notification/local state.
             const productDataForWishlist = getProductDataFromElement(productElement); // Get data for context
             if (isAdding) {
                 addToWishlist(productDataForWishlist); // Calls async updateServerWishlistAPI inside
             } else {
                 removeFromWishlist(productId); // Calls async updateServerWishlistAPI inside
             }
        } else if (target.closest('.btn-view-detail')) {
             event.stopPropagation();
             showProductDetailModal(productId); // Calls async fetchProductDetailsAPI inside
        }
    }

    function handleWishlistActionClick(event){ // Handles clicks within wishlist grid
        const target = event.target;
        const wishlistItem = target.closest('.wishlist-item');
        const productId = wishlistItem?.dataset.productId;
        if (!productId) return;

        if (target.closest('.wishlist-remove-btn')) {
             event.stopPropagation();
             removeFromWishlist(productId); // Calls async updateServerWishlistAPI inside
        } else if (target.closest('.btn-add-cart')) {
             event.stopPropagation();
             const productData = getProductDataFromElement(wishlistItem); // Get data from wishlist item
             if (productData) {
                 handleAddToCart(productData); // Calls async updateServerCartAPI inside
             } else {
                  addNotification("Lỗi: Không thể lấy thông tin sản phẩm từ mục yêu thích.", "error");
             }
        }
    }

    function handleDetailModalActionClick(event) { // Handles clicks inside detail modal
        const target = event.target;
        const productId = target.closest('[data-product-id]')?.dataset.productId;
         if (!productId) return; // Only act if we have a product ID

        if (target.closest('.btn-add-cart-detail')) {
             event.stopPropagation();
             // Reconstruct minimal data needed for addToCart (name/price might be inaccurate if fetched async)
             // Best practice: Store fetched productData globally or pass it around.
             const name = detailModalContent.querySelector('h3[data-product-id]')?.textContent || 'Sản phẩm';
             const priceMatch = detailModalContent.querySelector('.price')?.textContent.match(/[\d.,]+/);
             const priceValue = parseInt((priceMatch ? priceMatch[0] : '0').replace(/[^0-9]/g, ''));
             handleAddToCart({ id: productId, name: name, price: priceValue, imageSrc: detailModalContent.querySelector('.main-image img')?.src });
        } else if (target.closest('.wishlist-btn-detail')) {
             event.stopPropagation();
             const button = target.closest('.wishlist-btn-detail');
             const isAdding = !button.classList.contains('active');
             const name = detailModalContent.querySelector('h3[data-product-id]')?.textContent || 'Sản phẩm';
             const priceMatch = detailModalContent.querySelector('.price')?.textContent.match(/[\d.,]+/);
             const priceValue = parseInt((priceMatch ? priceMatch[0] : '0').replace(/[^0-9]/g, ''));
              const productDataForWishlist = { id: productId, name: name, price: priceValue, imageSrc: detailModalContent.querySelector('.main-image img')?.src }; // Reconstruct data

             if (isAdding) {
                 addToWishlist(productDataForWishlist); // Calls async updateServerWishlistAPI inside
             } else {
                 removeFromWishlist(productId); // Calls async updateServerWishlistAPI inside
             }
        }
    }

    function handleOrderHistoryActionClick(event) { // Handles clicks in order history tables
        const target = event.target;
        if (target.closest('.btn-view-details')) {
             event.preventDefault();
             const button = target.closest('.btn-view-details');
             const orderId = button.dataset.orderId;
             const orderType = button.closest('#product-orders') ? 'product' : 'service';
             showOrderDetailModal(orderId, orderType); // Calls async fetchOrderDetailsAPI inside
        }
    }

    function handleOverviewActionClick(event) { // Handles clicks in overview section
        const target = event.target;
        if (target.closest('.recent-activity-table .btn-view-details')) {
            event.preventDefault();
            const button = target.closest('.btn-view-details');
            const orderId = button.dataset.orderId;
            const orderType = orderId.startsWith('P') ? 'product' : 'service';
            setActiveSection('order-history');
            setTimeout(() => {
                 activateOrderHistoryTab(orderType);
                 showOrderDetailModal(orderId, orderType); // Calls async fetchOrderDetailsAPI inside
            }, 350);
        } else if (target.closest('.suggestion-item .btn-outline')) {
             event.preventDefault();
             addNotification("Xem gợi ý (Demo) - Sẽ điều hướng hoặc mở chi tiết.");
             // --- BACKEND INTEGRATION: Navigate based on suggestion type/id ---
             const isProductSuggestion = target.closest('.suggestion-item').querySelector('img[alt="Phụ kiện"]');
             if (isProductSuggestion) setActiveSection('store');
        }
    }

    // =========================================================================
    // Form Submission Simulation (Needs Backend Calls)
    // =========================================================================

    // --- BACKEND INTEGRATION: Generic function to submit form data ---
    async function submitFormDataAPI(formElement, endpoint) {
        const formData = new FormData(formElement);
        // Convert FormData to a plain object if your API expects JSON
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        console.log(`API CALL (SIMULATED): Submitting form data to ${endpoint}...`, data);
        // --- TODO: Replace with actual fetch() using POST/PUT ---
        // const response = await fetch(endpoint, {
        //     method: 'POST', // or 'PUT'
        //     headers: { 'Content-Type': 'application/json', /* Add auth headers */ },
        //     body: JSON.stringify(data)
        // });
        // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        // const result = await response.json();
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        const result = { success: true, message: "Dữ liệu đã được lưu." }; // Simulate success
        console.log("API RESPONSE (SIMULATED): Form submission result:", result);
        return result;
    }

    function handleFormSubmit(form, successMessage, apiEndpoint) { // Added apiEndpoint param
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                let isValid = true;
                form.querySelectorAll('[required]').forEach(input => {
                    input.style.borderColor = ''; // Reset border
                    if (!input.value.trim()) { isValid = false; input.style.borderColor = 'var(--danger-color)'; }
                });
                // Password confirmation check for changePasswordForm
                if (form === changePasswordForm) {
                    if (newPasswordInput.value !== confirmNewPasswordInput.value) {
                         isValid = false;
                         if (passwordMatchErrorAcc) passwordMatchErrorAcc.style.display = 'block';
                         newPasswordInput.style.borderColor = 'var(--danger-color)';
                         confirmNewPasswordInput.style.borderColor = 'var(--danger-color)';
                    } else {
                         if (passwordMatchErrorAcc) passwordMatchErrorAcc.style.display = 'none';
                    }
                }

                if (!isValid) { alert("Vui lòng kiểm tra lại các trường được đánh dấu."); return; }

                const submitButton = form.querySelector('button[type="submit"]');
                const originalButtonText = submitButton ? submitButton.innerHTML : 'Gửi';
                if (submitButton) { submitButton.disabled = true; submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...'; }
                 showLoading(); // Show general loading maybe?

                try {
                     // --- BACKEND CALL ---
                     const result = await submitFormDataAPI(form, apiEndpoint);
                     if (result.success) {
                         addNotification(`${successMessage} đã được gửi/lưu!`, 'success');
                         alert(`${successMessage} thành công!`); // Simple feedback

                         // --- THÊM YÊU CẦU VÀO LỊCH SỬ (Nếu là form Yêu cầu Dịch vụ) ---
                    if (form === serviceRequestForm) {
                        const formData = new FormData(form);
                        const newRequestEntry = {
                            id: `S-${Date.now()}`, // --- BACKEND INTEGRATION: API nên trả về ID thật ---
                            date: new Date().toLocaleDateString('vi-VN'),
                            type: formData.get('serviceType') || 'Khác', // Lấy giá trị từ select
                            title: formData.get('requestTitle') || 'Không có tiêu đề', // Lấy giá trị từ input
                            status: 'processing', // Trạng thái ban đầu
                            statusClass: 'status-processing'
                        };
                        serviceRequests.unshift(newRequestEntry); // Thêm vào đầu mảng
                         // Tùy chọn: Chuyển đến trang lịch sử sau khi gửi
                         // setActiveSection('order-history');
                         // renderOrderHistoryTables(); // Render lại nếu cần
                    }
                   
                    // / --- CẬP NHẬT TÊN NGƯỜI DÙNG (Nếu là form Thông tin cá nhân) ---
                     if (form === personalInfoForm) {
                         const newName = document.getElementById('accName')?.value;
                         if (newName) {
                             updateUserNameDisplay(newName);
                         }
                     }

                         form.reset();
                         if (passwordMatchErrorAcc) passwordMatchErrorAcc.style.display = 'none'; // Hide pwd error on success
                     } else {
                         throw new Error(result.message || "Có lỗi xảy ra.");
                     }
                } catch (error) {
                     console.error(`Error submitting ${successMessage} form:`, error);
                     addNotification(`Lỗi: ${error.message}`, 'error');
                     alert(`Lỗi: ${error.message}`);
                } finally {
                      hideLoading();
                     if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = originalButtonText; }
                     form.querySelectorAll('[style*="border-color"]').forEach(el => el.style.borderColor = ''); // Reset borders anyway
                }
            });
        }
    }

    // --- TODO: Define actual API endpoints ---
    handleFormSubmit(serviceRequestForm, 'Yêu cầu dịch vụ', '/api/service-requests');
    handleFormSubmit(personalInfoForm, 'Cập nhật thông tin cá nhân', '/api/user/profile');
    handleFormSubmit(changePasswordForm, 'Đổi mật khẩu', '/api/user/password');
    handleFormSubmit(notificationSettingsForm, 'Cập nhật cài đặt thông báo', '/api/user/notifications/settings');
    handleFormSubmit(supportForm, 'Yêu cầu hỗ trợ', '/api/support-requests');

    // Special listeners for password confirmation visual feedback (Front-end)
    confirmNewPasswordInput?.addEventListener('input', () => {
         if (passwordMatchErrorAcc) {
             const match = (newPasswordInput.value === confirmNewPasswordInput.value);
             passwordMatchErrorAcc.style.display = (!match && confirmNewPasswordInput.value !== '') ? 'block' : 'none';
              confirmNewPasswordInput.style.borderColor = (!match && confirmNewPasswordInput.value !== '') ? 'var(--danger-color)' : '';
              // Only mark new password input red if confirm is also filled and mismatching
              newPasswordInput.style.borderColor = (!match && confirmNewPasswordInput.value !== '') ? 'var(--danger-color)' : '';
         }
     });
     newPasswordInput?.addEventListener('input', () => { // Also check when new pwd changes
         if (passwordMatchErrorAcc && confirmNewPasswordInput.value !== '') {
             const match = (newPasswordInput.value === confirmNewPasswordInput.value);
             passwordMatchErrorAcc.style.display = match ? 'none' : 'block';
             confirmNewPasswordInput.style.borderColor = match ? '' : 'var(--danger-color)';
             newPasswordInput.style.borderColor = match ? '' : 'var(--danger-color)';
         } else if (passwordMatchErrorAcc) { // Hide error if confirm is empty
              passwordMatchErrorAcc.style.display = 'none';
              confirmNewPasswordInput.style.borderColor = '';
              newPasswordInput.style.borderColor = '';
         }
     });
     
// =========================================================================
// Order History Rendering 
// =========================================================================
function renderOrderHistoryTables() {
    const productTbody = document.querySelector('#product-orders tbody');
    const serviceTbody = document.querySelector('#service-orders tbody');

    if (productTbody) {
        productTbody.innerHTML = ''; // Xóa nội dung cũ
        if (productOrders.length === 0) {
            productTbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 1rem;">Chưa có đơn hàng sản phẩm nào.</td></tr>';
        } else {
            productOrders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${order.id}</td>
                    <td>${order.date}</td>
                    <td>${order.mainProduct}</td>
                    <td>${formatCurrency(order.total)}</td>
                    <td><span class="status ${order.statusClass}">${order.status}</span></td>
                    <td><button class="btn btn-sm btn-outline btn-view-details" data-order-id="${order.id}">Chi tiết</button></td>
                `;
                productTbody.appendChild(tr);
            });
        }
    }

    if (serviceTbody) {
        serviceTbody.innerHTML = ''; // Xóa nội dung cũ
         if (serviceRequests.length === 0) {
            serviceTbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 1rem;">Chưa có yêu cầu dịch vụ nào.</td></tr>';
        } else {
            serviceRequests.forEach(req => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${req.id}</td>
                    <td>${req.date}</td>
                    <td>${req.type}</td>
                    <td>${req.title}</td>
                    <td><span class="status ${req.statusClass}">${req.status}</span></td>
                    <td><button class="btn btn-sm btn-outline btn-view-details" data-order-id="${req.id}">Chi tiết</button></td>
                `;
                serviceTbody.appendChild(tr);
            });
        }
    }
}

    // =========================================================================
    // Logout Simulation (Needs Backend Call)
    // =========================================================================

    // --- BACKEND INTEGRATION: Call logout endpoint ---
    async function logoutAPI() {
        console.log("API CALL (SIMULATED): Logging out...");
        // --- TODO: Replace with actual fetch() to your logout endpoint (usually POST) ---
        // Server should invalidate the user's session/token.
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("API RESPONSE (SIMULATED): Logout successful on server.");
        return { success: true };
    }

    async function handleLogout(event) {
        event.preventDefault();
        console.log('Logout initiated...');
        addNotification('Đang đăng xuất...'); // Provide feedback

        try {
            await logoutAPI(); // --- BACKEND CALL ---
            // --- Clear local user data/tokens ---
            localStorage.removeItem('authToken'); // Example using localStorage
            sessionStorage.clear(); // Example clearing session storage
            // Redirect to login page
            window.location.href = '/login.html'; // --- TODO: Update with your actual login page URL ---
        } catch (error) {
            console.error("Logout failed:", error);
            addNotification("Đăng xuất thất bại. Vui lòng thử lại.", "error");
        }
    }

    logoutLinkSidebar?.addEventListener('click', handleLogout);
    logoutLinkDropdown?.addEventListener('click', handleLogout);

    // =========================================================================
    // Chatbox Functionality (Needs Full Backend/WebSocket)
    // =========================================================================
    // --- NOTE: Current implementation is pure simulation. Real chat needs backend. ---

    if (chatboxWidget && chatboxToggle) { /* ... toggle logic ... */
       chatboxToggle.addEventListener('click', () => {
            chatboxWidget.classList.toggle('active');
            if (chatboxWidget.classList.contains('active')) {
                chatInput?.focus();
                if (messagesContainer) { messagesContainer.scrollTop = messagesContainer.scrollHeight; }
                // --- BACKEND INTEGRATION: Connect to WebSocket/fetch history here? ---
            } else {
                 // --- BACKEND INTEGRATION: Disconnect WebSocket here? ---
            }
        });
    }
    const addChatMessage = (text, type) => { /* ... unchanged UI update ... */
        if (!messagesContainer || !text) return;
        const p = document.createElement('p');
        p.classList.add('message', type);
        p.textContent = text;
        messagesContainer.appendChild(p);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const handleSendMessage = () => { // --- BACKEND INTEGRATION: Send message via API/WebSocket ---
        const messageText = chatInput?.value.trim();
        if (messageText) {
            addChatMessage(messageText, 'user'); // Display user message immediately
            chatInput.value = '';
            // --- TODO: Send messageText to backend via API or WebSocket ---
            console.log("CHAT (SIMULATED): Sending message to backend:", messageText);
            // Simulate agent reply (replace with receiving message from backend)
            setTimeout(() => { addChatMessage('Phản hồi tự động: Đã nhận tin nhắn của bạn.', 'agent'); }, 1000);
        }
    };
    chatSendButton?.addEventListener('click', handleSendMessage);
    chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } });

    // =========================================================================
    // Theme Switching (Front-end - Unchanged)
    // =========================================================================
    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    function setTheme(theme) { /* ... unchanged ... */
       if (theme === 'light') { document.body.classList.add('light-mode'); if(themeToggle) themeToggle.checked = false; localStorage.setItem('theme', 'light'); }
       else { document.body.classList.remove('light-mode'); if(themeToggle) themeToggle.checked = true; localStorage.setItem('theme', 'dark'); }
    }
    if (currentTheme) setTheme(currentTheme); else setTheme(prefersDark ? 'dark' : 'light');
    if (themeToggle) themeToggle.addEventListener('change', () => { setTheme(themeToggle.checked ? 'dark' : 'light'); });

    // =========================================================================
    // Initial Setup Calls (Load initial data from backend)
    // =========================================================================
    async function initializeDashboard() {
        console.log("Initializing dashboard...");
        showLoading(); // Show loading indicator during initial data fetch

        // --- Parallel fetching of initial data ---
        const fetchPromises = [
            fetchCartAPI(),       // --- BACKEND CALL ---
            fetchWishlistAPI(),   // --- BACKEND CALL ---
            fetchNotificationsAPI(), // --- BACKEND CALL ---
            // --- BACKEND CALL: Fetch user points if needed here ---
            // fetchUserPointsAPI(),
             // --- BACKEND CALL: Fetch addresses if needed for account section/cart ---
             // fetchAddressesAPI(),
        ];

        try {
            const [cartData, wishlistData, notificationData /*, userPointsData, addressData */] = await Promise.all(fetchPromises);

            // Update local state with fetched data
            cartItems = cartData || [];
            wishlistItems = wishlistData || [];
            notifications = notificationData || [];
            // userPoints = userPointsData?.points || 1250; // Update user points
             // userAddresses = addressData || []; // Update addresses

            // Initial UI rendering based on fetched data
            updateCartBadge();
            updateNotificationUI();
            renderWishlist(); // Render wishlist based on fetched data
            // populateAddressOptions(); // Populate address dropdowns based on fetched data

            // Set the starting section (e.g., overview)
            setActiveSection('overview');

            // Attach event listeners AFTER initial setup
            attachActionListeners();
            attachCartActionListeners();

             console.log("Dashboard initialized successfully.");

        } catch (error) {
            console.error("Error initializing dashboard:", error);
            // Show error message to the user
            const contentArea = document.querySelector('.dashboard-content');
            if (contentArea) contentArea.innerHTML = '<p class="error-message">Lỗi tải dữ liệu người dùng. Vui lòng tải lại trang.</p>';
            // Optionally provide a retry button
        } finally {
             hideLoading(); // Hide loading indicator once done or on error
        }
    }

    // Start the initialization process
    initializeDashboard();

}); // End DOMContentLoaded
