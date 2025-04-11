


document.addEventListener('DOMContentLoaded', () => {

// =========================================================================
// DOM Element References
// =========================================================================
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const modalOverlay = document.getElementById('modalOverlay');

    const notificationBell = document.getElementById('notificationBell');
    const notificationPanel = document.getElementById('notificationPanel');
    const notificationList = document.getElementById('notificationList');
    const notificationCountBadge = document.getElementById('notificationCount');
    const clearNotificationsBtn = document.getElementById('clearNotifications');
    const overviewNotificationCount = document.getElementById('overviewNotificationCount');
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');
    const cartIcon = document.getElementById('cartIcon');
    const cartItemCountBadge = document.getElementById('cartItemCount');

    const cartModal = document.getElementById('cartModal');
    const closeCartModalBtn = document.getElementById('closeCartModal');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const checkoutButton = document.getElementById('checkoutButton');
    const detailModal = document.getElementById('detailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModal');
    const detailModalContent = document.getElementById('detailModalContent');

// Cart Checkout Options Elements
    const cartAddressSelect = document.getElementById('cartAddressSelect');
    const cartPhoneNumber = document.getElementById('cartPhoneNumber');
    const cartVoucherInput = document.getElementById('cartVoucherInput');
    const applyVoucherButton = document.getElementById('applyVoucherButton');
    const voucherMessage = document.getElementById('voucherMessage');
    const applyPointsCheckbox = document.getElementById('applyPointsCheckbox');
    const availablePointsSpan = document.getElementById('availablePoints');
    const pointsDiscountValueSpan = document.getElementById('pointsDiscountValue');
    const pointsMessage = document.getElementById('pointsMessage');
    const cartSubtotalAmount = document.getElementById('cartSubtotalAmount');
    const cartVoucherDiscount = document.getElementById('cartVoucherDiscount');
    const cartPointsDiscount = document.getElementById('cartPointsDiscount');
    const voucherDiscountRow = document.getElementById('voucherDiscountRow');
    const pointsDiscountRow = document.getElementById('pointsDiscountRow');


    const storeSection = document.getElementById('store-section');
    let filterLinks, priceRange, priceRangeValue, applyFilterBtn, clearFiltersBtn, sortBySelect, viewToggleButtons, productGrid, productList, paginationLinks, storeLoadingOverlay, storeSearchInput, storeSearchButton;

    if (storeSection) {
        filterLinks = document.querySelectorAll('.store-filters .filter-link');
        priceRange = document.getElementById('priceRange');
        priceRangeValue = document.getElementById('priceRangeValue');
        applyFilterBtn = document.querySelector('.btn-apply-filter');
        clearFiltersBtn = document.querySelector('.btn-clear-filters');
        sortBySelect = document.getElementById('sortBy');
        viewToggleButtons = document.querySelectorAll('.btn-view-mode');
        productGrid = document.getElementById('productGrid');
        productList = document.getElementById('productList');
        paginationLinks = document.querySelectorAll('.pagination .page-link'); // Might need delegation if pagination is dynamic
        storeLoadingOverlay = document.getElementById('storeLoadingOverlay');
// Store Search Elements
        storeSearchInput = document.getElementById('storeSearchInput');
        storeSearchButton = document.getElementById('storeSearchButton');
    }

    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlistMessage = document.getElementById('emptyWishlistMessage');

    const serviceRequestForm = document.getElementById('serviceRequestForm');
    const personalInfoForm = document.getElementById('personalInfoForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    const supportForm = document.getElementById('supportForm');

    const logoutLinkSidebar = document.getElementById('logoutLinkSidebar');
    const logoutLinkDropdown = document.getElementById('logoutLinkDropdown');

// Chatbox Elements
    const chatboxWidget = document.getElementById('chatboxWidget');
    const chatboxToggle = document.getElementById('chatboxToggle');
    const chatboxContent = document.getElementById('chatboxContent');
    const chatInput = chatboxContent?.querySelector('.chatbox-input input');
    const chatSendButton = chatboxContent?.querySelector('.chatbox-input button');
    const messagesContainer = chatboxContent?.querySelector('.chatbox-messages');

// =========================================================================
// State Variables
// =========================================================================
    let currentFilters = {
        category: 'all',
        brand: 'all',
        maxPrice: 50000000,
        rating: null,
        sortBy: 'newest',
        view: 'grid',
        searchTerm: '', // Added for store search
        page: 1
    };
    let cartItems = []; // { id, name, price, quantity, imageSrc }
    let wishlistItems = []; // { id, name, price, imageSrc }
    let notifications = []; // { id, text, timestamp, read, type }
    let activeModal = null; // Track currently open modal

// Cart Checkout State
    let userPoints = 1250; // Demo user points
    let appliedVoucher = null; // { code: 'SALE10', discountType: 'percentage', value: 0.1 } or { code: 'SHIPFREE', discountType: 'fixed', value: 30000 }
    let pointsUsed = 0;
    let pointsValue = 0; // Value of points used in currency
    const POINT_CONVERSION_RATE = 1; // 1 point = 1 VND (adjust as needed)


// =========================================================================
// Utility Functions
// =========================================================================
    function formatCurrency(amount) {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            console.warn("Invalid amount for formatting:", amount);
            return '0đ';
        }
        return numericAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    function getProductDataFromElement(element) {
        if (!element) return null;

        const productId = element.dataset.productId || `MOCK-${Date.now()}${Math.random().toString(16).slice(2)}`;

        const name = element.querySelector('h4 a')?.textContent
            || element.querySelector('h4')?.textContent
            || 'Sản phẩm không tên';

        const priceMatch = element.querySelector('.price')?.textContent.match(/[\d.,]+/);
        const priceText = priceMatch ? priceMatch[0] : '0';
        const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''));

        const imgSrc = element.querySelector('.product-image img, .product-list-image img, .main-image img, .wishlist-item img')?.src
            || `https://via.placeholder.com/100x100.png/eee/aaa?text=N/A`;

        const category = element.querySelector('.product-category-link')?.textContent
            || element.dataset.category
            || null;

        const brand = element.dataset.brand || null;

        return {
            id: productId,
            name,
            price: isNaN(priceValue) ? 0 : priceValue,
            imageSrc: imgSrc,
            category,
            brand,
            ratingHTML: element.querySelector('.rating')?.innerHTML
        };
    }

// =========================================================================
// Loading Overlay
// =========================================================================
    function showLoading() {
        if (storeLoadingOverlay) storeLoadingOverlay.classList.add('active');
    }

    function hideLoading() {
        if (storeLoadingOverlay) storeLoadingOverlay.classList.remove('active');
    }

// =========================================================================
// Modal Management
// =========================================================================
    function openModal(modalElement) {
        if (!modalElement || activeModal) return;

        if (modalOverlay) modalOverlay.classList.add('active');
        modalElement.classList.add('active');
        activeModal = modalElement;
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalElement) {
        const targetModal = modalElement || activeModal;
        if (!targetModal) return;

        if (modalOverlay) modalOverlay.classList.remove('active');
        targetModal.classList.remove('active');
        activeModal = null;

        if (targetModal === detailModal && detailModalContent) {
// Clear content after transition for smoother closing
            setTimeout(() => {
                detailModalContent.innerHTML = '<p>Đang tải chi tiết...</p>';
            }, 300);
        }
        document.body.style.overflow = '';
    }

// =========================================================================
// Sidebar Navigation & Section Switching
// =========================================================================
    function setActiveSection(sectionId) {
        if (!sectionId) return;

// Deactivate all links and sections
        sidebarLinks.forEach(link => link.classList.remove('active'));
        dashboardSections.forEach(section => section.classList.remove('active'));

// Activate the target link and section
        const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
        const activeSection = document.getElementById(`${sectionId}-section`);

        if (activeLink) activeLink.classList.add('active');
        if (activeSection) activeSection.classList.add('active');

// Close sidebar on mobile after navigation
        if (window.innerWidth <= 992 && sidebar?.classList.contains('active')) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open-overlay');
        }

// Scroll to top of main content area
        const mainContent = document.querySelector('.dashboard-main');
        if (mainContent) mainContent.scrollTop = 0;
        else window.scrollTo(0, 0);
    }

    sidebarLinks.forEach(link => {
// Exclude logout links from section switching logic
        if (!link.id || (!link.id.includes('logout'))) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                setActiveSection(link.dataset.section);
            });
        }
    });

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open-overlay', sidebar.classList.contains('active'));
        });
    }

// =========================================================================
// Header Dropdowns
// =========================================================================
    function toggleDropdown(panel, button) {
        if (!panel || !button) return;

        const isActive = panel.classList.contains('active');
// Close all other dropdowns first
        closeAllDropdowns();
// Toggle the current one
        if (!isActive) panel.classList.add('active');
    }

    function closeAllDropdowns() {
        if (notificationPanel?.classList.contains('active')) notificationPanel.classList.remove('active');
        if (userDropdown?.classList.contains('active')) userDropdown.classList.remove('active');
    }

    if (notificationBell) {
        notificationBell.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click listener from closing immediately
            toggleDropdown(notificationPanel, notificationBell);
        });
    }

    if (userMenuToggle) {
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(userDropdown, userMenuToggle);
        });
    }

// Close dropdowns and sidebar if clicking outside
    document.addEventListener('click', (e) => {
        const isOutsideNotification = notificationPanel && !notificationPanel.contains(e.target) && notificationBell && !notificationBell.contains(e.target);
        const isOutsideUserMenu = userDropdown && !userDropdown.contains(e.target) && userMenuToggle && !userMenuToggle.contains(e.target);
        const isOutsideSidebar = sidebar && !sidebar.contains(e.target) && sidebarToggle && !sidebarToggle.contains(e.target);

// Close dropdowns if click is outside both
        if (isOutsideNotification && isOutsideUserMenu) {
            closeAllDropdowns();
        }

// Close mobile sidebar if click is outside
        if (window.innerWidth <= 992 && sidebar?.classList.contains('active') && isOutsideSidebar) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open-overlay');
        }

// Close chatbox if clicking outside
        if (chatboxWidget && chatboxWidget.classList.contains('active') &&
            !chatboxWidget.contains(e.target) &&
            !chatboxToggle.contains(e.target)) {
            chatboxWidget.classList.remove('active');
        }
    });

// =========================================================================
// Notification System
// =========================================================================
    function addNotification(message, type = 'info') {
        console.log(`Adding Notification (${type}): ${message}`);
        const newNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            text: message,
            timestamp: new Date(),
            read: false,
            type
        };
        notifications.unshift(newNotification); // Add to the beginning
        updateNotificationUI();

// Visual feedback: Shake the bell
        if (notificationBell) {
            notificationBell.classList.remove('shake');
            void notificationBell.offsetWidth; // Trigger reflow
            notificationBell.classList.add('shake');
            setTimeout(() => notificationBell.classList.remove('shake'), 500);
        }
    }

    function updateNotificationUI() {
        const unreadCount = notifications.filter(n => !n.read).length;

// Update header badge
        if (notificationCountBadge) {
            notificationCountBadge.textContent = unreadCount;
            notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }

// Update overview count
        if (overviewNotificationCount) {
            overviewNotificationCount.textContent = unreadCount;
        }

// Update notification panel list
        if (notificationList) {
            notificationList.innerHTML = ''; // Clear previous items

            if (notifications.length === 0) {
                notificationList.innerHTML = '<li class="no-notifications">Chưa có thông báo mới.</li>';
            } else {
// Show max 10 notifications
                notifications.slice(0, 10).forEach(n => {
                    const li = document.createElement('li');
                    li.className = `notification-item notification-${n.type} ${n.read ? '' : 'unread'}`;
                    li.dataset.notificationId = n.id;
                    li.innerHTML = `
<span>${n.text}</span>
<span class="timestamp">${n.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
`;
                    li.addEventListener('click', () => markNotificationAsRead(n.id));
                    notificationList.appendChild(li);
                });
            }
        }
    }

    function markNotificationAsRead(notificationId) {
        const index = notifications.findIndex(n => n.id === notificationId);
        if (index > -1 && !notifications[index].read) {
            notifications[index].read = true;
            console.log(`Notification ${notificationId} marked as read.`);
            updateNotificationUI(); // Update UI after marking as read
        }
    }

    function markAllNotificationsAsRead() {
        let changed = false;
        notifications.forEach(n => {
            if (!n.read) {
                n.read = true;
                changed = true;
            }
        });
        if (changed) {
            console.log("All notifications marked as read.");
            updateNotificationUI(); // Update UI if any notification was marked
        }
    }

    if (clearNotificationsBtn) {
        clearNotificationsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            markAllNotificationsAsRead();
        });
    }

// =========================================================================
// Tab Switching (Generic Setup)
// =========================================================================
    function setupTabs(containerSelector) {
        const containers = document.querySelectorAll(containerSelector);

        containers.forEach(container => {
            const links = container.querySelectorAll('.tab-link, .account-tab-link');
            const contents = container.querySelectorAll('.tab-content, .account-tab-content');

            if (links.length === 0 || contents.length === 0) return; // No tabs/content found

            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tabId = link.dataset.tab || link.dataset.accountTab;

// Deactivate all links and content within this container
                    links.forEach(l => l.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));

// Activate the clicked link and corresponding content
                    link.classList.add('active');
                    const activeContent = container.querySelector(`#${tabId}`);
                    if (activeContent) activeContent.classList.add('active');
                });
            });

// Activate the first tab by default if none are active initially
            if (!container.querySelector('.active[data-tab], .active[data-account-tab]') && links.length > 0) {
                links[0].click();
            }
        });
    }

// Apply tab setup to specific sections
    setupTabs('#order-history-section');
    setupTabs('#account-section');

// =========================================================================
// Cart Functionality
// =========================================================================
    function updateCartBadge() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        if (cartItemCountBadge) {
            cartItemCountBadge.textContent = totalItems;
            cartItemCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
// Enable/disable checkout button based on cart content
        if (checkoutButton) {
            checkoutButton.disabled = totalItems === 0;
        }
    }

    function renderCartModal() {
// Ensure all necessary elements are available
        if (!cartItemsContainer || !cartTotalAmount || !cartSubtotalAmount || !cartVoucherDiscount || !cartPointsDiscount || !voucherDiscountRow || !pointsDiscountRow) {
            console.error("One or more cart modal elements not found!");
            return;
        }

        cartItemsContainer.innerHTML = ''; // Clear previous content
        let subtotal = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Giỏ hàng của bạn đang trống.</p>';
// Reset totals and discounts
            subtotal = 0;
            appliedVoucher = null; // Clear voucher when cart is empty
            pointsUsed = 0;        // Clear points used
            pointsValue = 0;
            if (applyPointsCheckbox) applyPointsCheckbox.checked = false; // Uncheck points
            updateCheckoutOptionsUI(); // Update options UI (e.g., disable points)
        } else {
            cartItems.forEach(item => {
                const itemPrice = Number(item.price) || 0;
                subtotal += itemPrice * item.quantity;

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.dataset.cartItemId = item.id;
                itemElement.innerHTML = `
<div class="cart-item-image">
  <img src="${item.imageSrc || 'https://via.placeholder.com/60x60.png?text=N/A'}" alt="${item.name || ''}">
</div>
<div class="cart-item-details">
  <h5>${item.name || 'Sản phẩm'}</h5>
  <p class="cart-item-price">${formatCurrency(itemPrice)}</p>
</div>
<div class="cart-item-quantity">
  <button class="quantity-decrease" aria-label="Giảm">-</button>
  <input type="number" class="quantity-input" value="${item.quantity}" min="1" aria-label="Số lượng">
  <button class="quantity-increase" aria-label="Tăng">+</button>
</div>
<div class="cart-item-remove">
  <button class="remove-item-btn" aria-label="Xóa">
    <i class="fas fa-trash-alt"></i>
  </button>
</div>
`;
                cartItemsContainer.appendChild(itemElement);
            });
        }

// --- Recalculate Discounts and Total ---
        let voucherDiscount = 0;
        if (appliedVoucher) {
            if (appliedVoucher.discountType === 'percentage') {
                voucherDiscount = subtotal * appliedVoucher.value;
            } else if (appliedVoucher.discountType === 'fixed') {
                voucherDiscount = appliedVoucher.value;
            }
// Ensure discount doesn't exceed subtotal
            voucherDiscount = Math.min(voucherDiscount, subtotal);
        }

// Calculate points value if checkbox is checked
        pointsValue = 0;
        if (applyPointsCheckbox && applyPointsCheckbox.checked) {
// Max points value cannot exceed remaining total after voucher
            const maxPointsValue = subtotal - voucherDiscount;
// Max points user can actually use based on conversion rate and available points
            const maxUsablePointsValue = Math.min(userPoints * POINT_CONVERSION_RATE, maxPointsValue);
            pointsValue = Math.max(0, maxUsablePointsValue); // Ensure non-negative
            pointsUsed = Math.floor(pointsValue / POINT_CONVERSION_RATE); // Points actually deducted
        } else {
            pointsUsed = 0; // Reset points if checkbox unchecked
        }

        const total = Math.max(0, subtotal - voucherDiscount - pointsValue); // Ensure total isn't negative

// --- Update UI Elements ---
        cartSubtotalAmount.textContent = formatCurrency(subtotal);
        cartTotalAmount.textContent = formatCurrency(total);

// Update and show/hide discount rows
        if (voucherDiscount > 0) {
            cartVoucherDiscount.textContent = `-${formatCurrency(voucherDiscount)}`;
            voucherDiscountRow.style.display = 'flex'; // Use flex for space-between
        } else {
            voucherDiscountRow.style.display = 'none';
        }

        if (pointsValue > 0) {
            cartPointsDiscount.textContent = `-${formatCurrency(pointsValue)}`;
            pointsDiscountRow.style.display = 'flex';
        } else {
            pointsDiscountRow.style.display = 'none';
        }

// Also update points UI in checkout options
        updateCheckoutOptionsUI(subtotal - voucherDiscount); // Pass remaining amount for points calculation limit

        updateCartBadge(); // Ensure badge is consistent after render
    }


    function updateCartItemQuantity(itemId, newQuantity) {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);

        if (itemIndex > -1) {
            if (newQuantity < 1) {
// Remove item if quantity is less than 1
                const removedItemName = cartItems[itemIndex].name;
                cartItems.splice(itemIndex, 1);
                console.log(`Item ${itemId} removed.`);
                addNotification(`Đã xóa "${removedItemName || 'sản phẩm'}" khỏi giỏ.`); // Add notification on remove
            } else {
                cartItems[itemIndex].quantity = newQuantity;
                console.log(`Item ${itemId} qty updated to ${newQuantity}.`);
            }
            renderCartModal(); // Re-render the cart to reflect changes
        }
    }

    function removeCartItem(itemId) {
        const initialLength = cartItems.length;
        const itemRemoved = cartItems.find(item => item.id === itemId);
        cartItems = cartItems.filter(item => item.id !== itemId);

        if (cartItems.length < initialLength) {
            console.log(`Item ${itemId} removed.`);
            addNotification(`Đã xóa "${itemRemoved?.name || 'sản phẩm'}" khỏi giỏ.`);
        }
        renderCartModal(); // Re-render the cart
    }

// Updates UI elements within the cart's checkout options section
    function updateCheckoutOptionsUI(amountAvailableForPoints = 0) {
// Update available points display
        if (availablePointsSpan) {
            availablePointsSpan.textContent = userPoints.toLocaleString('vi-VN');
        }

// Update points discount value display and checkbox state
        if (pointsDiscountValueSpan && applyPointsCheckbox) {
// Calculate potential discount value, limited by available points and the amount remaining after other discounts
            const potentialDiscount = Math.min(userPoints * POINT_CONVERSION_RATE, Math.max(0, amountAvailableForPoints));
            pointsDiscountValueSpan.textContent = formatCurrency(potentialDiscount);
// Disable checkbox if user has no points or there's no amount left to apply points to
            applyPointsCheckbox.disabled = (userPoints <= 0 || potentialDiscount <= 0);
            if(applyPointsCheckbox.disabled && applyPointsCheckbox.checked) {
                applyPointsCheckbox.checked = false; // Uncheck if disabled but was checked
// Need to re-render if state changes due to disable
// setTimeout(renderCartModal, 0); // Re-render in next tick to avoid issues
            }
        }

// Update voucher message if a voucher is applied
        if(voucherMessage) {
            if (appliedVoucher) {
                voucherMessage.textContent = `Đã áp dụng mã "${appliedVoucher.code}".`;
                voucherMessage.className = 'voucher-message success';
            } else if (voucherMessage.textContent.startsWith("Đã áp dụng")) { // Clear message only if it was a success message
                voucherMessage.textContent = '';
                voucherMessage.className = 'voucher-message';
            }
        }
// Add logic here to update address options, prefill phone etc. if needed
    }


// --- Attach Cart Listeners using EVENT DELEGATION ---
    function attachCartActionListeners() {
        if (cartItemsContainer) {

// Use event delegation for clicks on buttons inside the container
            cartItemsContainer.addEventListener('click', (event) => {
                const target = event.target;
                const cartItemElement = target.closest('.cart-item');

                if (!cartItemElement) return; // Click not within a cart item

                const itemId = cartItemElement.dataset.cartItemId;
                const input = cartItemElement.querySelector('.quantity-input');

                if (!input) return; // Quantity input not found
                const currentQuantity = parseInt(input.value);

                if (target.closest('.quantity-decrease')) {
                    updateCartItemQuantity(itemId, currentQuantity - 1);
                } else if (target.closest('.quantity-increase')) {
                    updateCartItemQuantity(itemId, currentQuantity + 1);
                } else if (target.closest('.remove-item-btn')) {
                    removeCartItem(itemId);
                }
            });

// Handle direct input changes (e.g., typing quantity)
            cartItemsContainer.addEventListener('change', (event) => {
                if (event.target.classList.contains('quantity-input')) {
                    const cartItemElement = event.target.closest('.cart-item');
                    if (!cartItemElement) return;

                    const itemId = cartItemElement.dataset.cartItemId;
                    let newQuantity = parseInt(event.target.value);

// Ensure quantity is at least 1, default to 1 if invalid
                    updateCartItemQuantity(itemId, (isNaN(newQuantity) || newQuantity < 1) ? 1 : newQuantity);
                }
            });

// Handle blur event to reset invalid quantities (e.g., empty input)
            cartItemsContainer.addEventListener('blur', (event) => {
                if (event.target.classList.contains('quantity-input')) {
                    if (event.target.value === '' || parseInt(event.target.value) < 1) {
                        const cartItemElement = event.target.closest('.cart-item');
                        if (!cartItemElement) return;

                        const itemId = cartItemElement.dataset.cartItemId;
                        updateCartItemQuantity(itemId, 1); // Reset to 1
                    }
                }
            }, true); // Use capture phase for blur to catch it before other handlers potentially remove the element
        }

// --- Cart Voucher Logic ---
        if (applyVoucherButton && cartVoucherInput && voucherMessage) {
            applyVoucherButton.addEventListener('click', () => {
                const code = cartVoucherInput.value.trim().toUpperCase();
                voucherMessage.textContent = ''; // Clear previous message
                voucherMessage.className = 'voucher-message';
                appliedVoucher = null; // Reset applied voucher

                if (!code) {
                    voucherMessage.textContent = 'Vui lòng nhập mã voucher.';
                    voucherMessage.className = 'voucher-message error';
                    renderCartModal(); // Re-render to recalculate total without voucher
                    return;
                }

// --- Simulate Voucher Check ---
                let validVoucher = null;
                if (code === 'SALE10') {
                    validVoucher = { code: code, discountType: 'percentage', value: 0.1 }; // 10% off
                } else if (code === 'GIAM20K') {
                    validVoucher = { code: code, discountType: 'fixed', value: 20000 }; // 20k off
                } else if (code === 'FREESHIP') {
// Example: Need shipping cost logic to implement freeship properly
// For demo, let's make it a fixed discount
                    validVoucher = { code: code, discountType: 'fixed', value: 15000 }; // Simulate 15k shipping fee discount
                }
// --- End Simulation ---

                if (validVoucher) {
                    appliedVoucher = validVoucher;
                    voucherMessage.textContent = `Áp dụng voucher "${code}" thành công!`;
                    voucherMessage.className = 'voucher-message success';
                    cartVoucherInput.value = ''; // Clear input on success
                } else {
                    voucherMessage.textContent = 'Mã voucher không hợp lệ hoặc đã hết hạn.';
                    voucherMessage.className = 'voucher-message error';
                }
                renderCartModal(); // Re-render cart with updated total
            });
        }

// --- Cart Points Logic ---
        if (applyPointsCheckbox) {
            applyPointsCheckbox.addEventListener('change', () => {
// The points calculation is now handled within renderCartModal
// when the checkbox state changes. Just need to re-render.
                renderCartModal();
            });
        }

// --- Navigate to address management ---
        const addAddressBtn = cartModal?.querySelector('.add-address-btn');
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(cartModal); // Close cart modal first
                setActiveSection('account'); // Go to account section
// Optional: Directly open the address tab in account section
                setTimeout(() => {
                    const addressTabLink = document.querySelector('.account-tab-link[data-account-tab="addresses"]');
                    if (addressTabLink) addressTabLink.click();
                }, 100); // Small delay for section transition
            });
        }

    }

// Open cart modal
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            renderCartModal(); // Ensure cart is up-to-date when opened
            openModal(cartModal);
        });
    }

// Close cart modal
    if (closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', () => closeModal(cartModal));
    }

// Checkout button simulation
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
// --- Basic Validation ---
            let isValid = true;
            let errorMsg = "";
            if(cartItems.length === 0) {
                isValid = false; // Should be disabled anyway, but double check
                errorMsg = "Giỏ hàng đang trống.";
            } else if (cartAddressSelect && !cartAddressSelect.value) {
                isValid = false;
                errorMsg = "Vui lòng chọn địa chỉ nhận hàng.";
                cartAddressSelect.focus();
            } else if (cartPhoneNumber && !cartPhoneNumber.value.trim()) {
                isValid = false;
                errorMsg = "Vui lòng nhập số điện thoại nhận hàng.";
                cartPhoneNumber.focus();
            }
// Add validation for payment method if needed

            if (!isValid) {
                alert(errorMsg);
                return;
            }
// --- End Validation ---

            const orderId = `ORDER-${Date.now()}`;
            const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'N/A';
            const currentSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);

// Recalculate discounts based on final state (important!)
            let finalVoucherDiscount = 0;
            if (appliedVoucher) {
                if (appliedVoucher.discountType === 'percentage') {
                    finalVoucherDiscount = currentSubtotal * appliedVoucher.value;
                } else if (appliedVoucher.discountType === 'fixed') {
                    finalVoucherDiscount = appliedVoucher.value;
                }
                finalVoucherDiscount = Math.min(finalVoucherDiscount, currentSubtotal);
            }

            let finalPointsValue = 0;
            let finalPointsUsed = 0;
            if (applyPointsCheckbox && applyPointsCheckbox.checked) {
                const amountAfterVoucher = currentSubtotal - finalVoucherDiscount;
                const maxPointsValue = Math.min(userPoints * POINT_CONVERSION_RATE, Math.max(0, amountAfterVoucher));
                finalPointsValue = maxPointsValue;
                finalPointsUsed = Math.floor(finalPointsValue / POINT_CONVERSION_RATE);
            }

            const finalTotal = Math.max(0, currentSubtotal - finalVoucherDiscount - finalPointsValue);


// --- Gather Order Data ---
            const orderData = {
                orderId: orderId,
                items: JSON.parse(JSON.stringify(cartItems)), // Deep copy items
                addressId: cartAddressSelect?.value,
                phoneNumber: cartPhoneNumber?.value,
                paymentMethod: selectedPaymentMethod,
                voucherCode: appliedVoucher ? appliedVoucher.code : null,
                pointsUsed: finalPointsUsed,
                subtotal: currentSubtotal,
                voucherDiscount: finalVoucherDiscount,
                pointsDiscount: finalPointsValue,
                total: finalTotal,
            };

            console.log(`Placing order ${orderId} (Simulation):`, JSON.stringify(orderData, null, 2));
            addNotification(`Đặt hàng #${orderId} thành công!`, 'success');

// Simulate points deduction
            if (finalPointsUsed > 0) {
                userPoints -= finalPointsUsed;
                console.log(`Deduced ${finalPointsUsed} points. Remaining: ${userPoints}`);
// updateAccountPointsDisplay(userPoints); // Function to update points elsewhere
            }

// Clear cart state after successful checkout
            cartItems = [];
            appliedVoucher = null;
            pointsUsed = 0;
            pointsValue = 0;
            if(applyPointsCheckbox) applyPointsCheckbox.checked = false;
// Clear input fields
            if(cartAddressSelect) cartAddressSelect.value = '';
            if(cartPhoneNumber) cartPhoneNumber.value = '';
            if(cartVoucherInput) cartVoucherInput.value = '';
            if(voucherMessage) voucherMessage.textContent = '';
// Reset payment method to default (e.g., COD)
            const codRadio = document.getElementById('paymentCOD');
            if(codRadio) codRadio.checked = true;


// Close modal and navigate
            closeModal(cartModal);
// Call renderCartModal one last time to update UI before potential reopen
// This seems redundant as state is cleared, but ensures UI reflects cleared state if modal is immediately reopened.
            renderCartModal(); // Ensure UI reflects cleared state
            updateCartBadge(); // Update badge to 0
            setActiveSection('order-history');
        });
    }


// =========================================================================
// Wishlist Functionality
// =========================================================================
    function renderWishlist() {
        if (!wishlistGrid || !emptyWishlistMessage) return;

        wishlistGrid.innerHTML = ''; // Clear previous items

        if (wishlistItems.length === 0) {
            emptyWishlistMessage.style.display = 'block';
            wishlistGrid.style.display = 'none'; // Hide grid if empty
        } else {
            emptyWishlistMessage.style.display = 'none';
            wishlistGrid.style.display = 'grid'; // Show grid

            wishlistItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'wishlist-item';
                itemElement.dataset.productId = item.id;
// Ensure data attributes for price/image are included if needed by getProductDataFromElement
                itemElement.dataset.price = item.price;
                itemElement.innerHTML = `
<img src="${item.imageSrc || 'https://via.placeholder.com/120x120.png?text=N/A'}" alt="${item.name || ''}">
<h4>${item.name || 'Sản phẩm'}</h4>
<p class="price">${formatCurrency(item.price)}</p>
<div class="wishlist-item-actions">
  <button class="btn btn-primary btn-sm btn-add-cart">
    <i class="fas fa-cart-plus"></i> Thêm giỏ
  </button>
  <button class="btn btn-danger btn-sm wishlist-remove-btn">
    <i class="fas fa-trash"></i> Xóa
  </button>
</div>
`;
                wishlistGrid.appendChild(itemElement);
            });
        }
    }

    function addToWishlist(itemData) {
        if (!itemData || !itemData.id) return;

// Add only if not already in wishlist
        if (!wishlistItems.some(item => item.id === itemData.id)) {
            wishlistItems.push({
                id: itemData.id,
                name: itemData.name,
                price: itemData.price,
                imageSrc: itemData.imageSrc
            });
            renderWishlist(); // Update the wishlist UI
            updateWishlistButtonState(itemData.id, true); // Update buttons elsewhere
            addNotification(`Đã thêm "${itemData.name}" vào Yêu thích.`, 'info');
        }
    }

    function removeFromWishlist(productId) {
        const initialLength = wishlistItems.length;
        const itemToRemove = wishlistItems.find(item => item.id === productId);
        wishlistItems = wishlistItems.filter(item => item.id !== productId);

        if (wishlistItems.length < initialLength) {
            renderWishlist(); // Update the wishlist UI
            updateWishlistButtonState(productId, false); // Update buttons elsewhere
            if (itemToRemove) addNotification(`Đã xóa "${itemToRemove.name}" khỏi Yêu thích.`);
        }
    }

// Update the appearance of wishlist buttons (store grid/list, detail modal)
    function updateWishlistButtonState(productId, isWishlisted) {
// Update buttons in the store section
        const storeButtons = document.querySelectorAll(`.store-products-area [data-product-id="${productId}"] .wishlist-btn`);
        storeButtons.forEach(button => {
            button.classList.toggle('active', isWishlisted);
            button.innerHTML = isWishlisted ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            button.title = isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích";
        });

// Update button in the detail modal if it's open and showing this product
        const detailButton = detailModalContent.querySelector(`.wishlist-btn-detail`);
        const detailProductElement = detailModalContent.querySelector('[data-product-id]');
        if (detailButton && detailProductElement && detailProductElement.dataset.productId === productId) {
            detailButton.classList.toggle('active', isWishlisted);
            detailButton.innerHTML = isWishlisted ? '<i class="fas fa-heart"></i> Đã thích' : '<i class="far fa-heart"></i> Yêu thích';
        }
    }

// =========================================================================
// Detail Modal Functionality
// =========================================================================
    function showProductDetailModal(productId, productElement) {
        if (!detailModal || !detailModalContent || !productElement) return;

        const productData = getProductDataFromElement(productElement);
        if (!productData) return;

// --- Mock Data for Details ---
        const description = `Mô tả chi tiết cho ${productData.name}. Bao gồm các tính năng nổi bật như A, B, C. Mang lại lợi ích X, Y, Z cho người dùng. Sản phẩm được bảo hành chính hãng 12 tháng. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
        const specs = [
            { key: 'Thương hiệu', value: productData.brand || 'Chưa rõ' },
            { key: 'Màu sắc', value: 'Đen / Bạc (Tùy chọn)' },
            { key: 'Hệ điều hành', value: 'Windows 11 / Android 13 (Tùy loại)' },
            { key: 'Kết nối', value: 'Wifi 6, Bluetooth 5.2, USB-C' }
        ];
// --- End Mock Data ---

        const isCurrentlyWishlisted = wishlistItems.some(item => item.id === productId);

        detailModalContent.innerHTML = `
<h3 data-product-id="${productId}">${productData.name}</h3>
<div class="product-detail-layout">
  <div class="product-detail-gallery">
    <div class="main-image">
      <img src="${productData.imageSrc}" alt="${productData.name}">
    </div>
    <!-- Add thumbnail images here if needed -->
  </div>
  <div class="product-detail-info">
    <a href="#" class="product-category-link">${productData.category || 'Chưa phân loại'}</a>
    <div class="rating">
      ${productData.ratingHTML || '<span class="text-muted">Chưa có đánh giá</span>'}
    </div>
    <p class="price">${formatCurrency(productData.price)}</p>
    <p class="product-detail-description">${description}</p>
    <div class="product-detail-actions">
      <button class="btn btn-primary btn-add-cart-detail">
        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
      </button>
      <button class="btn btn-outline wishlist-btn-detail ${isCurrentlyWishlisted ? 'active' : ''}">
        ${isCurrentlyWishlisted
            ? '<i class="fas fa-heart"></i> Đã thích'
            : '<i class="far fa-heart"></i> Yêu thích'
        }
      </button>
    </div>
  </div>
</div>
<div class="product-detail-specs">
  <h4>Thông số kỹ thuật</h4>
  <ul>
    ${specs.map(s => `<li><strong>${s.key}:</strong> <span>${s.value}</span></li>`).join('')}
  </ul>
</div>
<!-- Add sections for Reviews, Related Products etc. here -->
`;
        openModal(detailModal);
    }

    function showOrderDetailModal(orderId, orderType) {
        if (!detailModal || !detailModalContent) return;

        let detailHTML = `<p>Lỗi: Không thể tải chi tiết đơn hàng #${orderId}.</p>`;
        const orderDate = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');

// Mock status data
        const statuses = { P789: "Đang giao", P123: "Đã giao", P098: "Đã hủy", S456: "Đang xử lý", S112: "Hoàn thành" };
        const statusClasses = { P789: "status-shipped", P123: "status-delivered", P098: "status-cancelled", S456: "status-processing", S112: "status-completed" };
        const orderStatus = statuses[orderId] || "Không rõ";
        const statusClass = statusClasses[orderId] || "status-pending";

        if (orderType === 'product') {
// --- Mock Product Order Data ---
            let items = [], shippingAddress = "N/A", subtotal = 0, shippingFee = 0, total=0, trackingCode=null, paymentMethod = "COD";
            if (orderId === 'P789') {
                items = [{ name: 'Laptop Gaming ABC Model X', quantity: 1, price: 25500000, imageSrc: 'https://via.placeholder.com/60x60.png/6c5ce7/ffffff?text=LAP' }];
                shippingAddress = "456 Đường DEF, Phường An Phú, Quận 2, TP. Hồ Chí Minh";
                shippingFee = 35000;
                trackingCode='GHN987XYZ';
                paymentMethod = "Chuyển khoản";
            }
            else if (orderId === 'P123') {
                items = [{ name: 'Điện thoại XYZ Pro 256GB', quantity: 1, price: 18000000, imageSrc: 'https://via.placeholder.com/60x60.png/a29bfe/ffffff?text=PHN' }];
                shippingAddress = "789 Đường GHI, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh";
                shippingFee = 25000;
                paymentMethod = "Thanh toán VNPAY";
            }
            else if (orderId === 'P098') {
                items = [{ name: 'Tai nghe Bluetooth Z Gaming Edition', quantity: 1, price: 1200000, imageSrc: 'https://via.placeholder.com/60x60.png/fdcb6e/2d3436?text=HDP' }];
                shippingAddress = "101 Đường KLM, Phường 10, Quận Gò Vấp, TP. Hồ Chí Minh";
                shippingFee = 0; // Free ship
            }
// --- End Mock Data ---

            subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);
            total = subtotal + shippingFee;

            detailHTML = `
<h3>Chi tiết Đơn hàng #${orderId}</h3>
<div class="order-detail-modal-section order-detail-header-info">
  <p><strong>Ngày đặt:</strong> ${orderDate}</p>
  <p><strong>Trạng thái:</strong> <span class="status ${statusClass}">${orderStatus}</span></p>
  <p><strong>Tổng tiền:</strong> ${formatCurrency(total)}</p>
</div>
<div class="order-detail-modal-section order-detail-item-list">
  <h4>Sản phẩm đã đặt</h4>
  ${items.length > 0
                ? items.map(i => `
  <div class="cart-item">
    <div class="cart-item-image">
      <img src="${i.imageSrc}" alt="${i.name}">
    </div>
    <div class="cart-item-details">
      <h5>${i.name}</h5>
      <p class="cart-item-price">${formatCurrency(i.price)} x ${i.quantity}</p>
    </div>
  </div>`).join('')
                : '<p>Không có sản phẩm nào trong đơn hàng này.</p>'
            }
</div>
<div class="order-detail-modal-section order-detail-shipping">
  <h4>Thông tin giao hàng & Thanh toán</h4>
  <p><strong>Địa chỉ:</strong> ${shippingAddress}</p>
  <p><strong>Phí vận chuyển:</strong> ${formatCurrency(shippingFee)}</p>
  <p><strong>Thanh toán:</strong> ${paymentMethod}</p>
  ${trackingCode ? `<p><strong>Mã vận đơn:</strong> <a href="#" target="_blank">${trackingCode} (Nhấn để theo dõi - Demo)</a></p>` : ''}
</div>
<div class="order-detail-modal-section order-detail-totals">
  <h4>Tổng cộng</h4>
  <p>Tạm tính: ${formatCurrency(subtotal)}</p>
  <p>Phí vận chuyển: ${formatCurrency(shippingFee)}</p>
  <p><strong>Tổng thanh toán: <strong>${formatCurrency(total)}</strong></strong></p>
  <div class="order-detail-actions">
    ${orderStatus !== 'Đã hủy' && orderStatus !== 'Đang giao' ? '<button class="btn btn-primary btn-sm">Mua lại</button>' : ''}
    <button class="btn btn-outline btn-sm">Yêu cầu hỗ trợ</button>
  </div>
</div>
`;
        } else { // Service Order
// --- Mock Service Order Data ---
            let serviceType = "N/A", serviceTitle = "N/A", serviceDesc = "N/A", progressSteps = [], chatLog = [], attachedFiles = [];
            if(orderId === 'S456'){
                serviceType = "Tư vấn";
                serviceTitle = "Tư vấn cấu hình mạng gia đình";
                serviceDesc = "Nhà tôi 3 tầng, diện tích sàn khoảng 80m2, cần tư vấn giải pháp phủ sóng wifi ổn định cho toàn bộ nhà để học tập và làm việc online.";
                progressSteps = [
                    { name: 'Đã gửi', status: 'completed' },
                    { name: 'Tiếp nhận', status: 'completed' },
                    { name: 'Đang xử lý', status: 'active' },
                    { name: 'Hoàn thành', status: '' }
                ];
                chatLog = [
                    { sender: 'Hệ thống', message: 'Đã nhận được yêu cầu của bạn.' },
                    { sender: 'Nhân viên hỗ trợ', message: 'Chào bạn, chúng tôi sẽ liên hệ tư vấn trong vòng 24h.' },
                    { sender: 'Bạn', message: 'Cảm ơn, tôi chờ.' }
                ];
                attachedFiles = ['so_do_nha.jpg'];
            }
            else if (orderId === 'S112') {
                serviceType = "Sửa chữa";
                serviceTitle = "Sửa laptop không lên nguồn";
                serviceDesc = "Laptop Dell Inspiron của tôi đột nhiên không bật được nguồn, đèn sạc vẫn sáng.";
                progressSteps = [
                    { name: 'Đã gửi', status: 'completed' },
                    { name: 'Đã nhận máy', status: 'completed' },
                    { name: 'Đang sửa', status: 'completed' },
                    { name: 'Hoàn thành', status: 'completed' }
                ];
                chatLog = [
                    { sender: 'Kỹ thuật viên', message: 'Đã kiểm tra, lỗi mainboard, chi phí dự kiến 1.5tr. Bạn xác nhận?' },
                    { sender: 'Bạn', message: 'OK, tiến hành sửa giúp tôi.' },
                    { sender: 'Kỹ thuật viên', message: 'Đã sửa xong, mời bạn đến nhận máy.' }
                ];
            }
// --- End Mock Data ---
            detailHTML = `
<h3>Chi tiết Yêu cầu Dịch vụ #${orderId}</h3>
<div class="order-detail-modal-section order-detail-header-info">
  <p><strong>Ngày gửi:</strong> ${orderDate}</p>
  <p><strong>Loại dịch vụ:</strong> ${serviceType}</p>
  <p><strong>Trạng thái:</strong> <span class="status ${statusClass}">${orderStatus}</span></p>
</div>
<div class="order-detail-modal-section">
  <h4>Chi tiết yêu cầu</h4>
  <p><strong>Tiêu đề:</strong> ${serviceTitle}</p>
  <p><strong>Mô tả:</strong> ${serviceDesc}</p>
  ${attachedFiles.length > 0 ? `<p><strong>Tệp đính kèm:</strong> ${attachedFiles.map(f => `<a href="#">${f}</a>`).join(', ')}</p>` : ''}
</div>
<div class="order-detail-modal-section">
  <h4>Tiến trình xử lý</h4>
  <ul class="progress-tracker">
    ${progressSteps.map(p => `<li class="${p.status}">${p.name}</li>`).join('')}
  </ul>
</div>
<div class="order-detail-modal-section">
  <h4>Trao đổi với hỗ trợ (Demo)</h4>
  <div class="chat-mockup">
    ${chatLog.map(c => `<p><strong>${c.sender}:</strong> ${c.message}</p>`).join('')}
    <textarea placeholder="Nhập nội dung trả lời..." rows="2"></textarea>
    <button class="btn btn-sm btn-primary">Gửi tin nhắn</button>
  </div>
</div>
`;
        }
        detailModalContent.innerHTML = detailHTML;
        openModal(detailModal);
    }

// Close detail modal
    if (closeDetailModalBtn) {
        closeDetailModalBtn.addEventListener('click', () => closeModal(detailModal));
    }

// =========================================================================
// Store Functionality (Filtering/Sorting/Pagination/View/Search)
// =========================================================================
    function applyFilters() {
        if (!storeSection) return;

        console.log('Applying Filters (Simulation):', currentFilters);
        showLoading(); // Show loading indicator

// Simulate API call delay
        setTimeout(() => {
            console.log("Simulating receiving filtered data...");

            let dummyGridHTML = '', dummyListHTML = '';
            const productsToShowPerPage = 8;
            let productCount = 0;
            const searchTerm = currentFilters.searchTerm.toLowerCase().trim(); // Get search term

// Simulate filtering a larger dataset (e.g., 25 potential products)
// In a real app, this loop would process actual data from an API response
            for(let i = 0; i < 25; i++){
// Mock product data generation
                const pId = `P-${i + (currentFilters.page - 1) * 15}`; // Unique ID based on page
                const pCatVal = ['laptops', 'phones', 'accessories', 'monitors', 'desktops', 'components'][i % 6];
                const pBrandVal = ['TechBrand', 'NovaTech', 'GadgetPro', 'ZyStore'][i % 4];
                const pPrice = Math.floor(Math.random() * 49000000) + 1000000; // Random price
                const pName = `${pBrandVal} ${pCatVal.charAt(0).toUpperCase() + pCatVal.slice(1)} Gen ${i+1}`;
                const pImg = `https://via.placeholder.com/300x200.png/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(pName.slice(0,10))}`;
                const pImgThumb = `https://via.placeholder.com/200x200.png/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(pName.slice(0,8))}`;
                const isFav = wishlistItems.some(w => w.id === pId);
                const ratingStars = Math.floor(Math.random() * 3) + 3; // 3-5 stars
                const ratingHTML = Array(5).fill(0).map((_, k) => `<i class="${k < ratingStars ? 'fas' : 'far'} fa-star"></i>`).join('');
                const ratingCount = Math.floor(Math.random()*200)+10;

// Check if product matches current filters
                const categoryMatch = currentFilters.category === 'all' || currentFilters.category === pCatVal;
                const brandMatch = currentFilters.brand === 'all' || currentFilters.brand === pBrandVal;
                const priceMatch = pPrice <= currentFilters.maxPrice;
                const nameMatch = searchTerm === '' || pName.toLowerCase().includes(searchTerm);
// Add rating filter check if needed: const ratingMatch = !currentFilters.rating || ratingStars >= currentFilters.rating;

// If matches and we haven't reached the limit per page
                if (categoryMatch && brandMatch && priceMatch && nameMatch /*&& ratingMatch*/ && productCount < productsToShowPerPage) {
                    productCount++;

// --- Generate Grid View HTML ---
                    dummyGridHTML += `
<div class="product-card" data-product-id="${pId}" data-category="${pCatVal}" data-brand="${pBrandVal}">
  <div class="product-image">
    <img src="${pImg}" alt="${pName}">
    <button class="wishlist-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}">
      <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
    </button>
  </div>
  <div class="product-content">
    <a href="#" class="product-category-link">${pCatVal}</a>
    <h4><a href="#">${pName}</a></h4>
    <div class="rating">${ratingHTML}<span class="rating-count">(${ratingCount})</span></div>
    <p class="price">${formatCurrency(pPrice)}</p>
  </div>
  <div class="product-actions">
    <button class="btn btn-primary btn-sm btn-add-cart">Thêm</button>
    <button class="btn btn-outline btn-sm btn-view-detail">Chi tiết</button>
  </div>
</div>
`;

// --- Generate List View HTML ---
                    dummyListHTML += `
<div class="product-list-item" data-product-id="${pId}" data-category="${pCatVal}" data-brand="${pBrandVal}">
  <div class="product-list-image">
    <img src="${pImgThumb}" alt="${pName}">
    <button class="wishlist-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}">
      <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
    </button>
  </div>
  <div class="product-list-content">
    <h4><a href="#">${pName}</a></h4>
    <div class="rating">${ratingHTML}<span class="rating-count">(${ratingCount})</span></div>
    <p class="description">Mô tả ngắn gọn cho sản phẩm ${pName} sẽ hiển thị ở đây...</p>
  </div>
  <div class="product-list-actions">
    <p class="price">${formatCurrency(pPrice)}</p>
    <button class="btn btn-primary btn-sm btn-add-cart">Thêm</button>
    <button class="btn btn-outline btn-sm btn-view-detail">Chi tiết</button>
  </div>
</div>
`;
                }
            } // End simulation loop

// Update the DOM
            if(productGrid) {
                productGrid.innerHTML = productCount > 0 ? dummyGridHTML : '<p class="empty-section-msg">Không tìm thấy sản phẩm phù hợp với lựa chọn của bạn.</p>';
            }
            if(productList) {
                productList.innerHTML = productCount > 0 ? dummyListHTML : '<p class="empty-section-msg">Không tìm thấy sản phẩm phù hợp với lựa chọn của bạn.</p>';
            }

// Update result count text (replace with actual total count from API)
            const resultsCountElement = document.querySelector('.store-top-controls .results-count');
            if(resultsCountElement) {
                const startItem = (currentFilters.page - 1) * productsToShowPerPage + 1;
                const endItem = startItem + productCount - 1;
                const totalMockItems = 50; // Placeholder for total items matching filters
                resultsCountElement.textContent = `Hiển thị ${startItem}-${endItem} / ${totalMockItems} SP`;
            }

// Note: Pagination UI update needs real total count from backend to be accurate
            updatePaginationUI(50); // Pass mock total items

            hideLoading(); // Hide loading indicator
        }, 800); // Simulate 800ms delay
    }

    function updatePaginationUI(totalItems) {
        const paginationContainer = document.querySelector('.pagination-container .pagination');
        if (!paginationContainer) return;

        const itemsPerPage = 8; // Should match productsToShowPerPage in applyFilters
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const currentPage = currentFilters.page;

// Simple pagination example (can be made more complex with ellipses)
        let paginationHTML = `
<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
  <a class="page-link" href="#" aria-label="Previous">«</a>
</li>
`;

        for (let i = 1; i <= totalPages; i++) {
// Add logic here to limit visible page numbers if needed (e.g., show 1, 2, ..., 5, 6, 7, ..., 10)
            paginationHTML += `
<li class="page-item ${currentPage === i ? 'active' : ''}">
  <a class="page-link" href="#">${i}</a>
</li>
`;
        }

        paginationHTML += `
<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
  <a class="page-link" href="#" aria-label="Next">»</a>
</li>
`;
        paginationContainer.innerHTML = paginationHTML;
    }


    if (storeSection) { // Attach store listeners only if section exists

// Filter links (Category, Brand, Rating)
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = link.dataset.filterType;
                const value = link.dataset.filterValue;
                const rating = link.dataset.rating;

// Update active class within its group
                link.closest('.filter-list')?.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

// Update currentFilters state
                if(type) {
                    currentFilters[type] = value;
                } else if(rating) {
// Toggle rating filter: click again to disable
                    if (link.classList.contains('active') && currentFilters.rating === parseInt(rating)) {
                        link.classList.remove('active');
                        currentFilters.rating = null;
                    } else {
// Remove active from other rating links if any
                        link.closest('.rating-filter')?.querySelectorAll('.filter-link').forEach(l => { if(l !== link) l.classList.remove('active'); });
                        link.classList.add('active');
                        currentFilters.rating = parseInt(rating);
                    }
                } else {
// Handle click on 'All' or other non-rating/type filters if needed
// For now, only update type and rating
                }


                currentFilters.page = 1; // Reset to page 1 when filters change
                applyFilters();
            });
        });


// Price Range Slider Input
        if (priceRange && priceRangeValue) {
            priceRange.addEventListener('input', () => {
                priceRangeValue.textContent = parseInt(priceRange.value).toLocaleString('vi-VN');
            });
// Apply filter when user stops sliding (mouseup/touchend) for better experience than 'change'
            priceRange.addEventListener('mouseup', () => {
                currentFilters.maxPrice = parseInt(priceRange.value);
                currentFilters.page = 1;
                applyFilters();
            });
            priceRange.addEventListener('touchend', () => { // For touch devices
                currentFilters.maxPrice = parseInt(priceRange.value);
                currentFilters.page = 1;
                applyFilters();
            });
        }

// Apply Price Filter Button (Kept as fallback/alternative)
        if (applyFilterBtn && priceRange) {
            applyFilterBtn.addEventListener('click', () => {
                currentFilters.maxPrice = parseInt(priceRange.value);
                currentFilters.page = 1;
                applyFilters();
            });
        }

// Clear Filters Button
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
// Reset state object
                currentFilters = {
                    category: 'all',
                    brand: 'all',
                    maxPrice: 50000000,
                    rating: null,
                    sortBy: 'newest',
                    view: currentFilters.view, // Keep current view mode
                    searchTerm: '', // Clear search term
                    page: 1
                };

// Reset UI elements
                document.querySelectorAll('.store-filters .filter-link').forEach(l => l.classList.remove('active'));
                document.querySelector('.category-filter a[data-filter-value="all"]')?.classList.add('active');
                document.querySelector('.brand-filter a[data-filter-value="all"]')?.classList.add('active');
                document.querySelectorAll('.rating-filter .filter-link').forEach(l => l.classList.remove('active')); // Clear rating selection

                if(priceRange) priceRange.value = 50000000;
                if(priceRangeValue) priceRangeValue.textContent = (50000000).toLocaleString('vi-VN');
                if(sortBySelect) sortBySelect.value = 'newest';
                if(storeSearchInput) storeSearchInput.value = ''; // Clear search input field


                applyFilters();
            });
        }

// Sort By Select Dropdown
        if (sortBySelect) {
            sortBySelect.addEventListener('change', () => {
                currentFilters.sortBy = sortBySelect.value;
                currentFilters.page = 1;
                applyFilters();
            });
        }

// View Toggle Buttons (Grid/List)
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                if (view === currentFilters.view || !productGrid || !productList) return; // No change or elements missing

                currentFilters.view = view;

// Update button active states
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

// Show/hide the correct container
                productGrid.style.display = (view === 'grid') ? 'grid' : 'none';
                productList.style.display = (view === 'list') ? 'block' : 'none';

// Note: applyFilters() is NOT called here, just switching view of current results.
            });
        });

// Pagination Links (using Event Delegation)
        const paginationContainer = document.querySelector('.pagination-container .pagination');
        if (paginationContainer) {
            paginationContainer.addEventListener('click', (e) => {
                e.preventDefault();
                const link = e.target.closest('.page-link');
                const parentLi = link?.parentElement;

// Ignore clicks on disabled links, active link, or outside links/spans
                if (!link || parentLi.classList.contains('disabled') || parentLi.classList.contains('active') || link.tagName === 'SPAN') {
                    return;
                }

                let newPage = currentFilters.page;
                const label = link.getAttribute('aria-label');
                const pageNumText = link.textContent;
                const totalPages = Math.ceil(50 / 8); // Needs dynamic total items later

                if (label === 'Previous') {
                    newPage = Math.max(1, currentFilters.page - 1);
                } else if (label === 'Next') {
                    newPage = Math.min(totalPages, currentFilters.page + 1);
                } else if (!isNaN(parseInt(pageNumText))) {
                    newPage = parseInt(pageNumText);
                } else {
                    return; // Clicked on '...' or something else, ignore
                }

                if(newPage !== currentFilters.page){
                    currentFilters.page = newPage;
                    applyFilters(); // Fetch data for the new page
                }
            });
        }

// Store Search Input/Button Listeners
        if (storeSearchInput && storeSearchButton) {
            const triggerSearch = () => {
                currentFilters.searchTerm = storeSearchInput.value;
                currentFilters.page = 1; // Reset page when searching
                applyFilters();
            };

// Search on button click
            storeSearchButton.addEventListener('click', triggerSearch);

// Search on pressing Enter in input
            storeSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent potential form submission
                    triggerSearch();
                }
            });

// Optional: Clear search on Escape key or empty input
            storeSearchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Escape') {
                    storeSearchInput.value = '';
                    triggerSearch(); // Apply empty search
                }
            });
// Optional: Search when input is cleared manually
            storeSearchInput.addEventListener('search', () => { // "search" event triggers when clear button (x) is clicked
                if (storeSearchInput.value === '') {
                    triggerSearch();
                }
            });

// Optional: Real-time search on input (consider debouncing for performance)
            /*
            let searchTimeout;
            storeSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(triggerSearch, 500); // Wait 500ms after typing stops
            });
            */
        }


    } // End if (storeSection)

// =========================================================================
// Event Handlers (Delegation Setup)
// =========================================================================

// Generic function to attach all delegated listeners
    function attachActionListeners() {

// --- Store Product Actions (Grid/List) ---
        const productsArea = document.querySelector('.store-products-area');
        if (productsArea) {
            productsArea.addEventListener('click', handleStoreActionClick);
        }

// --- Wishlist Actions ---
        if (wishlistGrid) {
            wishlistGrid.addEventListener('click', handleWishlistActionClick);
        }

// --- Detail Modal Actions ---
        if (detailModalContent) {
            detailModalContent.addEventListener('click', handleDetailModalActionClick);
        }

// --- Order History Actions ---
        const orderHistorySection = document.getElementById('order-history-section');
        if (orderHistorySection) {
            orderHistorySection.addEventListener('click', handleOrderHistoryActionClick);
        }

// --- Overview Actions ---
        const overviewSection = document.getElementById('overview-section');
        if (overviewSection) {
            overviewSection.addEventListener('click', handleOverviewActionClick);
        }
    }


// --- Specific Handler Functions ---

    function handleStoreActionClick(event) {
        const target = event.target;
// Find the closest product container (card or list item)
        const productElement = target.closest('.product-card, .product-list-item');
        if (!productElement) return; // Click wasn't inside a product element

        const productData = getProductDataFromElement(productElement);
        if (!productData) return; // Failed to get data

// Check which button was clicked using closest()
        if (target.closest('.btn-add-cart')) {
            event.stopPropagation(); // Prevent potential parent handlers
            handleAddToCart(productData);
            addNotification(`Đã thêm "${productData.name}" vào giỏ.`, 'success');
        }
        else if (target.closest('.wishlist-btn')) {
            event.stopPropagation();
            const button = target.closest('.wishlist-btn');
            const isAdding = !button.classList.contains('active');
            if (isAdding) {
                addToWishlist(productData);
            } else {
                removeFromWishlist(productData.id);
            }
        }
        else if (target.closest('.btn-view-detail')) {
            event.stopPropagation();
            showProductDetailModal(productData.id, productElement);
        }
// Add more actions here if needed (e.g., quick view)
    }

    function handleWishlistActionClick(event){
        const target = event.target;
        const wishlistItem = target.closest('.wishlist-item');
        if (!wishlistItem) return;

// Wishlist items might not have all data attributes, get what's available
// Need price from the DOM inside wishlist item now
        const productData = {
            id: wishlistItem.dataset.productId,
            name: wishlistItem.querySelector('h4')?.textContent || 'Sản phẩm',
            price: parseInt(wishlistItem.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '0'),
            imageSrc: wishlistItem.querySelector('img')?.src || ''
        };

        if (!productData || !productData.id) return;

        if (target.closest('.wishlist-remove-btn')) {
            event.stopPropagation();
            removeFromWishlist(productData.id);
        }
        else if (target.closest('.btn-add-cart')) {
            event.stopPropagation();
            handleAddToCart(productData); // Use same add to cart logic
            addNotification(`Đã thêm "${productData.name}" từ yêu thích vào giỏ.`);
        }
    }

    function handleDetailModalActionClick(event) {
        const target = event.target;
// The product ID is stored on the h3 tag in showProductDetailModal
        const productElement = detailModalContent.querySelector('[data-product-id]');
// Ensure we are in the product detail view, not order detail view
        if (!productElement || !productElement.matches('h3')) return;

// We need to reconstruct productData as it's not passed directly
// This might be limited if not all data is in the modal DOM
        const productId = productElement.dataset.productId;
        const name = productElement.textContent;
        const priceMatch = detailModalContent.querySelector('.price')?.textContent.match(/[\d.,]+/);
        const priceText = priceMatch ? priceMatch[0] : '0';
        const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''));
        const imgSrc = detailModalContent.querySelector('.main-image img')?.src;
// Category/Brand might need to be fetched again or stored differently
        const productData = { id: productId, name, price: priceValue, imageSrc: imgSrc };

        if (!productData || !productData.id) return;

        if (target.closest('.btn-add-cart-detail')) {
            event.stopPropagation();
            handleAddToCart(productData);
            addNotification(`Đã thêm "${productData.name}" vào giỏ.`, 'success');
        }
        else if (target.closest('.wishlist-btn-detail')) {
            event.stopPropagation();
            const button = target.closest('.wishlist-btn-detail');
            const isAdding = !button.classList.contains('active');
            if (isAdding) {
                addToWishlist(productData);
            } else {
                removeFromWishlist(productData.id);
            }
// State is updated inside addTo/removeFromWishlist which calls updateWishlistButtonState
        }
// Add handlers for other modal actions (e.g., close, image click) if needed
    }

    function handleOrderHistoryActionClick(event) {
        const target = event.target;
// Check if the click was on a 'View Details' button
        if (target.closest('.btn-view-details')) {
            event.preventDefault(); // Prevent default if it's a link/button
            const button = target.closest('.btn-view-details');
            const orderId = button.dataset.orderId;

// Determine if it's a product or service order based on the table context
            const orderType = button.closest('#product-orders') ? 'product' : 'service';

            showOrderDetailModal(orderId, orderType);
        }
// Add handlers for other actions in history (e.g., reorder, track)
    }

    function handleOverviewActionClick(event) {
        const target = event.target;

// Handle 'View Details' click in Recent Activity table
        if (target.closest('.recent-activity-table .btn-view-details')) {
            event.preventDefault();
            const button = target.closest('.btn-view-details');
            const orderId = button.dataset.orderId;
            const orderType = orderId.startsWith('P') ? 'product' : 'service'; // Infer type from ID prefix

// Navigate to Order History and show the specific order detail
            setActiveSection('order-history');

// Delay showing modal slightly to allow section transition
            setTimeout(() => {
// Ensure the correct tab (Product/Service) is active in Order History
                const pTab = document.querySelector('#order-history-section .tab-link[data-tab="product-orders"]');
                const sTab = document.querySelector('#order-history-section .tab-link[data-tab="service-orders"]');
                const pCont = document.getElementById('product-orders');
                const sCont = document.getElementById('service-orders');

                if(pTab && sTab && pCont && sCont){
                    const isProductOrder = orderType === 'product';
                    pTab.classList.toggle('active', isProductOrder);
                    sTab.classList.toggle('active', !isProductOrder);
                    pCont.classList.toggle('active', isProductOrder);
                    sCont.classList.toggle('active', !isProductOrder);
                }

// Now show the modal
                showOrderDetailModal(orderId, orderType);
            }, 350); // Adjust delay as needed
        }
// Handle clicks on suggestion items
        else if (target.closest('.suggestion-item .btn-outline')) {
            event.preventDefault();
// Add specific logic based on the suggestion (e.g., navigate to product/service page)
            addNotification("Xem gợi ý sản phẩm/dịch vụ (Demo).");
// Example: Navigate to store if it's a product suggestion
            const isProductSuggestion = target.closest('.suggestion-item').querySelector('img[alt="Phụ kiện"]');
            if (isProductSuggestion) {
                setActiveSection('store');
            }
        }
// Add handlers for Quick Actions if needed (they already have sidebar-link class)
    }


// --- Add to Cart Core Logic ---
    function handleAddToCart(itemData) {
        if (!itemData || !itemData.id || isNaN(itemData.price)) { // Added price check
            console.error("Invalid item data passed to handleAddToCart:", itemData);
            return;
        }

        const existingItemIndex = cartItems.findIndex(item => item.id === itemData.id);

        if (existingItemIndex > -1) {
// Item already exists, increase quantity
            cartItems[existingItemIndex].quantity += 1;
            console.log(`Increased quantity for item ${itemData.id}`);
        } else {
// Item is new, add it to cart with quantity 1
// Use spread syntax to avoid modifying original itemData if it's reused
// Ensure price is a number before adding
            const price = Number(itemData.price);
            if (isNaN(price)) {
                console.error(`Invalid price for item ${itemData.id}:`, itemData.price);
                return; // Don't add item with invalid price
            }
            cartItems.push({ ...itemData, price: price, quantity: 1 });
            console.log(`Added new item ${itemData.id} to cart`);
        }

        updateCartBadge(); // Update the visual badge count
        renderCartModal(); // Update cart modal display immediately if open

// Optional: Add visual feedback (e.g., shake cart icon)
        if (cartIcon) {
            cartIcon.classList.remove('shake');
            void cartIcon.offsetWidth; // Trigger reflow
            cartIcon.classList.add('shake');
            setTimeout(() => cartIcon.classList.remove('shake'), 400);
        }
    }

// =========================================================================
// Form Submission Simulation
// =========================================================================
    function handleFormSubmit(form, successMessage) {
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent actual form submission

// Basic validation check (can be enhanced)
                let isValid = true;
                form.querySelectorAll('[required]').forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
// Add some visual indication of error if needed
                        input.style.borderColor = 'var(--danger-color)'; // Example error style
                        console.warn(`Required field is empty:`, input);
                    } else {
                        input.style.borderColor = ''; // Reset border color
                    }
                });

                if (!isValid) {
                    alert("Vui lòng điền đầy đủ các trường bắt buộc.");
                    return;
                }

// Simulate submission
                console.log(`${successMessage} form submitted (Simulation). Data:`, new FormData(form));
                addNotification(`${successMessage} đã được gửi/lưu!`, 'success');
                alert(`${successMessage} đã được gửi/lưu thành công! (Đây là bản demo)`);

// Optionally reset the form
                form.reset();
                form.querySelectorAll('[style*="border-color"]').forEach(el => el.style.borderColor = ''); // Reset borders
            });
        }
    }

// Setup form handlers
    handleFormSubmit(serviceRequestForm, 'Yêu cầu dịch vụ');
    handleFormSubmit(personalInfoForm, 'Cập nhật thông tin cá nhân');
    handleFormSubmit(notificationSettingsForm, 'Cập nhật cài đặt thông báo');
    handleFormSubmit(supportForm, 'Yêu cầu hỗ trợ');

// Special handling for Change Password form with confirmation
    if (changePasswordForm) {
        const newPassword = document.getElementById('newPassword');
        const confirmNewPassword = document.getElementById('confirmNewPassword');
        const passwordMatchErrorAcc = document.getElementById('passwordMatchErrorAcc');

        changePasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();

// Reset borders
            newPassword.style.borderColor = '';
            confirmNewPassword.style.borderColor = '';
            document.getElementById('currentPassword').style.borderColor = '';
            if (passwordMatchErrorAcc) passwordMatchErrorAcc.style.display = 'none';

// Check if passwords match
            if (newPassword.value !== confirmNewPassword.value) {
                if (passwordMatchErrorAcc) passwordMatchErrorAcc.style.display = 'block'; // Show error
                newPassword.style.borderColor = 'var(--danger-color)';
                confirmNewPassword.style.borderColor = 'var(--danger-color)';
                confirmNewPassword.focus(); // Focus the confirmation field
                return; // Stop submission
            }

// Basic check: Ensure new password is not empty and current password is not empty
            if (!newPassword.value || !document.getElementById('currentPassword').value) {
                alert("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.");
                if (!newPassword.value) newPassword.style.borderColor = 'var(--danger-color)';
                if (!document.getElementById('currentPassword').value) document.getElementById('currentPassword').style.borderColor = 'var(--danger-color)';
                return;
            }

// Simulate password change submission
            console.log('Password Change form submitted (Simulation)');
            addNotification('Mật khẩu của bạn đã được thay đổi thành công.', 'success');
            alert('Mật khẩu đã được thay đổi! (Đây là bản demo)');
            changePasswordForm.reset(); // Clear form after successful change
            if (passwordMatchErrorAcc) passwordMatchErrorAcc.style.display = 'none'; // Hide error after reset
        });

// Real-time feedback for password confirmation
        confirmNewPassword?.addEventListener('input', () => {
            if (passwordMatchErrorAcc) {
                const doPasswordsMatch = (newPassword.value === confirmNewPassword.value);
// Show error only if confirmation field is not empty and passwords don't match
                passwordMatchErrorAcc.style.display = (!doPasswordsMatch && confirmNewPassword.value !== '') ? 'block' : 'none';
                confirmNewPassword.style.borderColor = (!doPasswordsMatch && confirmNewPassword.value !== '') ? 'var(--danger-color)' : '';
                newPassword.style.borderColor = (!doPasswordsMatch && confirmNewPassword.value !== '') ? 'var(--danger-color)' : '';
            }
        });

// Also check when the *new* password changes, if confirmation has text
        newPassword?.addEventListener('input', () => {
            if (passwordMatchErrorAcc && confirmNewPassword.value !== '') {
                const doPasswordsMatch = (newPassword.value === confirmNewPassword.value);
                passwordMatchErrorAcc.style.display = doPasswordsMatch ? 'none' : 'block';
                confirmNewPassword.style.borderColor = doPasswordsMatch ? '' : 'var(--danger-color)';
                newPassword.style.borderColor = doPasswordsMatch ? '' : 'var(--danger-color)';
            } else if (passwordMatchErrorAcc) {
                passwordMatchErrorAcc.style.display = 'none'; // Hide error if confirm is empty
                confirmNewPassword.style.borderColor = '';
                newPassword.style.borderColor = '';
            }
        });
    }

// =========================================================================
// Logout Simulation
// =========================================================================
    function handleLogout(event) {
        event.preventDefault();
        console.log('Logout initiated (simulation)');
        addNotification('Bạn đã đăng xuất khỏi hệ thống.');
        alert('Đăng xuất thành công! (Đây là bản demo)');

// In a real application, you would clear session/token and redirect:
// sessionStorage.clear();
// localStorage.removeItem('authToken');
// window.location.href = '/login.html'; // Or your login page URL
    }

// Attach logout handler to both links
    logoutLinkSidebar?.addEventListener('click', handleLogout);
    logoutLinkDropdown?.addEventListener('click', handleLogout);

// =========================================================================
// Chatbox Functionality
// =========================================================================
// --- Chatbox Toggle Logic ---
    if (chatboxWidget && chatboxToggle) {
        chatboxToggle.addEventListener('click', () => {
            chatboxWidget.classList.toggle('active');

// Optional: Focus input when opening chat
            if (chatboxWidget.classList.contains('active')) {
                chatInput?.focus();
// Scroll to bottom when opening
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }
        });
    }

// --- Simulate sending message (basic) ---
    const addChatMessage = (text, type) => {
        if (!messagesContainer || !text) return;
        const p = document.createElement('p');
        p.classList.add('message', type);
        p.textContent = text;
        messagesContainer.appendChild(p);
// Scroll to the bottom after adding message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const handleSendMessage = () => {
        const messageText = chatInput?.value.trim();
        if (messageText) {
            addChatMessage(messageText, 'user'); // Add user message
            chatInput.value = ''; // Clear input

// Simulate agent reply after a delay
            setTimeout(() => {
                addChatMessage('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.', 'agent');
            }, 1000);
        }
    };

    chatSendButton?.addEventListener('click', handleSendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default newline in input
            handleSendMessage();
        }
    });

// =========================================================================
// Initial Setup Calls
// =========================================================================
    setActiveSection('overview'); // Start on the overview page
    updateCartBadge();           // Initialize cart badge count
    updateNotificationUI();      // Initialize notification UI
    renderWishlist();            // Render initial wishlist items
    attachActionListeners();     // Setup all delegated event listeners
    attachCartActionListeners(); // Setup delegated listeners specific to cart modal items

// --- Example Usage / Initial State Simulation ---
    setTimeout(() => addNotification("Chào mừng bạn trở lại Bảng điều khiển!", "info"), 500);

// Add an example item to the wishlist initially for demo purposes
    addToWishlist({
        id: 'GP-AC-01',
        name: 'Chuột không dây GadgetPro Z1 Silent',
        price: 950000,
        imageSrc: 'https://via.placeholder.com/120x120.png/fdcb6e/2d3436?text=Mouse+GP'
    });
// Add another example
    addToWishlist({
        id: 'NT-CP-01',
        name: 'SSD NovaTech Speedster 2TB NVMe',
        price: 4800000,
        imageSrc: 'https://via.placeholder.com/120x120.png/a29bfe/ffffff?text=SSD+NT'
    });

// Simulate applying initial filters on store page load if needed
// applyFilters(); // Uncomment if you want the store filtered on initial load

// Initial call to update cart checkout options UI (e.g., display points)
    updateCheckoutOptionsUI();


}); // End DOMContentLoaded
