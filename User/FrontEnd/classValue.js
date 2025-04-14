
// --- START OF REFACTORED FILE classValue.js ---

class DashboardApp {
    constructor() {
        // =========================================================================
        // State Variables (Instance Properties)
        // =========================================================================
        this.productOrders = [ // --- BACKEND INTEGRATION: Fetch from API ---
            { id: 'P789', date: '20/10/2023', mainProduct: 'Laptop Gaming ABC', total: 25500000, status: 'shipped', statusClass: 'status-shipped' },
            { id: 'P123', date: '15/10/2023', mainProduct: 'Điện thoại XYZ Pro', total: 18000000, status: 'delivered', statusClass: 'status-delivered' },
            { id: 'P098', date: '01/10/2023', mainProduct: 'Tai nghe Z', total: 1200000, status: 'cancelled', statusClass: 'status-cancelled' },
        ];
        this.serviceRequests = [ // --- BACKEND INTEGRATION: Fetch from API ---
            { id: 'S456', date: '19/10/2023', type: 'Tư vấn', title: 'Tư vấn mạng', status: 'processing', statusClass: 'status-processing' },
            { id: 'S112', date: '05/10/2023', type: 'Sửa chữa', title: 'Sửa laptop', status: 'completed', statusClass: 'status-completed' },
        ];
        this.currentFilters = { category: 'all', brand: 'all', maxPrice: 50000000, rating: null, sortBy: 'newest', view: 'grid', searchTerm: '', page: 1 };
        this.cartItems = []; // --- BACKEND INTEGRATION: Fetch initial state ---
        this.wishlistItems = []; // --- BACKEND INTEGRATION: Fetch initial state ---
        this.notifications = []; // --- BACKEND INTEGRATION: Fetch from server ---
        this.userPoints = 1250; // --- BACKEND INTEGRATION: Fetch from server ---
        this.userAddresses = [ // --- BACKEND INTEGRATION: Fetch from server ---
            { id: 'addr1', name: 'Người dùng A', phone: '0912345678', street: '123 ABC', ward: 'XYZ', district: 'LMN', city: 'HCM', text: '123 ABC, XYZ, LMN, HCM (Mặc định)', isDefault: true },
            { id: 'addr2', name: 'VP Công ty', phone: '0987654321', street: 'Tòa DEF', ward: 'GHI', district: 'LMN', city: 'HCM', text: 'Tòa DEF, GHI, LMN, HCM (Công ty)', isDefault: false }
        ];
        this.appliedVoucher = null;
        this.pointsUsed = 0;
        this.pointsValue = 0;
        this.POINT_CONVERSION_RATE = 1000; // Configuration
        this.activeModal = null;

        // =========================================================================
        // DOM Element References (Instance Properties)
        // =========================================================================
        // --- Theme ---
        this.themeToggle = document.getElementById('themeToggleCheckbox');

        // --- Sidebar & Navigation ---
        this.sidebar = document.querySelector('.dashboard-sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebarLinks = document.querySelectorAll('.sidebar-link');
        this.dashboardSections = document.querySelectorAll('.dashboard-section');
        this.sidebarCartItemCount = document.getElementById('sidebarCartItemCount');

        // --- Header ---
        this.notificationBell = document.getElementById('notificationBell');
        this.notificationPanel = document.getElementById('notificationPanel');
        this.notificationList = document.getElementById('notificationList');
        this.notificationCountBadge = document.getElementById('notificationCount');
        this.clearNotificationsBtn = document.getElementById('clearNotifications');
        this.userMenuToggle = document.getElementById('userMenuToggle');
        this.userDropdown = document.getElementById('userDropdown');

        // --- Modals & Overlays ---
        this.modalOverlay = document.getElementById('modalOverlay');
        this.detailModal = document.getElementById('detailModal');
        this.closeDetailModalBtn = document.getElementById('closeDetailModal');
        this.detailModalContent = document.getElementById('detailModalContent');
        this.addAddressModal = null; // Will be created later
        this.closeAddAddressModalBtn = null; // Will be referenced later

        // --- Main Content Sections ---
        this.overviewSection = document.getElementById('overview-section');
        this.overviewNotificationCount = document.getElementById('overviewNotificationCount');
        this.storeSection = document.getElementById('store-section');
        this.cartSection = document.getElementById('cart-section');
        this.wishlistGrid = document.getElementById('wishlistGrid');
        this.emptyWishlistMessage = document.getElementById('emptyWishlistMessage');
        this.orderHistorySection = document.getElementById('order-history-section');
        this.contactFeedbackSection = document.getElementById('contact-feedback-section');
        this.shopFeedbackListContainer = document.getElementById('shopFeedbackList');
        this.accountSection = document.getElementById('account-section'); // Added reference

        // --- Store Specific Elements ---
        this.filterLinks = null;
        this.priceRange = null;
        this.priceRangeValue = null;
        this.applyFilterBtn = null;
        this.clearFiltersBtn = null;
        this.sortBySelect = null;
        this.viewToggleButtons = null;
        this.productGrid = null;
        this.productList = null;
        this.paginationContainer = null;
        this.storeLoadingOverlay = null;
        this.storeSearchInput = null;
        this.storeSearchButton = null;
        this.storeResultsCount = null;
        if (this.storeSection) {
            this.filterLinks = this.storeSection.querySelectorAll('.store-filters .filter-link');
            this.priceRange = this.storeSection.querySelector('#priceRange');
            this.priceRangeValue = this.storeSection.querySelector('#priceRangeValue');
            this.applyFilterBtn = this.storeSection.querySelector('.btn-apply-filter');
            this.clearFiltersBtn = this.storeSection.querySelector('.btn-clear-filters');
            this.sortBySelect = this.storeSection.querySelector('#sortBy');
            this.viewToggleButtons = this.storeSection.querySelectorAll('.btn-view-mode');
            this.productGrid = this.storeSection.querySelector('#productGrid');
            this.productList = this.storeSection.querySelector('#productList');
            this.paginationContainer = this.storeSection.querySelector('.pagination-container .pagination');
            this.storeLoadingOverlay = this.storeSection.querySelector('#storeLoadingOverlay');
            this.storeSearchInput = this.storeSection.querySelector('#storeSearchInput');
            this.storeSearchButton = this.storeSection.querySelector('#storeSearchButton');
            this.storeResultsCount = this.storeSection.querySelector('.store-top-controls .results-count');
        }

        // --- Cart Section Specific Elements ---
        this.cartItemsContainer = null;
        this.cartTotalAmount = null;
        this.checkoutButton = null;
        this.cartAddressSelect = null;
        this.cartPhoneNumber = null;
        this.cartVoucherInput = null;
        this.applyVoucherButton = null;
        this.voucherMessage = null;
        this.applyPointsCheckbox = null;
        this.availablePointsSpan = null;
        this.pointsToUseSpan = null;
        this.pointsDiscountValueSpan = null;
        this.pointsMessage = null;
        this.cartSubtotalAmount = null;
        this.cartVoucherDiscount = null;
        this.cartPointsDiscount = null;
        this.voucherDiscountRow = null;
        this.pointsDiscountRow = null;
        this.addAddressBtnCart = null; // Renamed to avoid conflict
        if (this.cartSection) {
            this.cartItemsContainer = this.cartSection.querySelector('#cartItemsContainer');
            this.cartTotalAmount = this.cartSection.querySelector('#cartTotalAmount');
            this.checkoutButton = this.cartSection.querySelector('#checkoutButton');
            this.cartAddressSelect = this.cartSection.querySelector('#cartAddressSelect');
            this.cartPhoneNumber = this.cartSection.querySelector('#cartPhoneNumber');
            this.cartVoucherInput = this.cartSection.querySelector('#cartVoucherInput');
            this.applyVoucherButton = this.cartSection.querySelector('#applyVoucherButton');
            this.voucherMessage = this.cartSection.querySelector('#voucherMessage');
            this.applyPointsCheckbox = this.cartSection.querySelector('#applyPointsCheckbox');
            this.availablePointsSpan = this.cartSection.querySelector('#availablePoints');
            this.pointsToUseSpan = this.cartSection.querySelector('#pointsToUse');
            this.pointsDiscountValueSpan = this.cartSection.querySelector('#pointsDiscountValue');
            this.pointsMessage = this.cartSection.querySelector('#pointsMessage');
            this.cartSubtotalAmount = this.cartSection.querySelector('#cartSubtotalAmount');
            this.cartVoucherDiscount = this.cartSection.querySelector('#cartVoucherDiscount');
            this.cartPointsDiscount = this.cartSection.querySelector('#cartPointsDiscount');
            this.voucherDiscountRow = this.cartSection.querySelector('#voucherDiscountRow');
            this.pointsDiscountRow = this.cartSection.querySelector('#pointsDiscountRow');
            this.addAddressBtnCart = this.cartSection.querySelector('.add-address-btn'); // Renamed
        }

        // --- Form Elements ---
        this.serviceRequestForm = document.getElementById('serviceRequestForm');
        this.personalInfoForm = document.getElementById('personalInfoForm');
        this.changePasswordForm = document.getElementById('changePasswordForm');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmNewPasswordInput = document.getElementById('confirmNewPassword');
        this.passwordMatchErrorAcc = document.getElementById('passwordMatchErrorAcc');
        this.notificationSettingsForm = document.getElementById('notificationSettingsForm');
        this.supportForm = document.getElementById('supportForm');
        this.addAddressForm = null; // Will be referenced later
        this.addAddressButtonAcc = null; // Button in Account section
        this.addressListContainer = null; // Container in Account section

        if (this.accountSection) {
            this.addAddressButtonAcc = this.accountSection.querySelector('#addresses .btn-primary');
            this.addressListContainer = this.accountSection.querySelector('#addresses .address-list');
        }


        // --- Logout ---
        this.logoutLinkSidebar = document.getElementById('logoutLinkSidebar');
        this.logoutLinkDropdown = document.getElementById('logoutLinkDropdown');

        // --- Chatbox ---
        this.chatboxWidget = document.getElementById('chatboxWidget');
        this.chatboxToggle = document.getElementById('chatboxToggle');
        this.chatboxContent = document.getElementById('chatboxContent');
        this.chatInput = this.chatboxContent?.querySelector('.chatbox-input input');
        this.chatSendButton = this.chatboxContent?.querySelector('.chatbox-input button');
        this.messagesContainer = this.chatboxContent?.querySelector('.chatbox-messages');

        // --- Bind `this` for methods used as event handlers ---
        // This is done in _setupEventListeners
    }

    // =========================================================================
    // Initialization
    // =========================================================================
    async initialize() {
        console.log("Initializing dashboard...");
        this._showLoading(); // Show loading indicator during initial data fetch

        this._setupTheme();
        this._createAddAddressModal(); // Create modal structure early
        this._setupEventListeners();
        this._setupTabs('#order-history-section');
        this._setupTabs('#account-section');

        try {
            await this._loadInitialData(); // Fetch cart, wishlist, notifications etc.

            // Initial UI rendering based on fetched data
            this._updateCartBadge();
            this._updateNotificationUI();
            this._renderWishlist();
            this._populateAddressOptions(); // For cart dropdown

            // Set the starting section (e.g., overview)
            this._setActiveSection('overview');

            console.log("Dashboard initialized successfully.");

        } catch (error) {
            console.error("Error initializing dashboard:", error);
            const contentArea = document.querySelector('.dashboard-content');
            if (contentArea) {
                contentArea.innerHTML = '<p class="error-message">Lỗi tải dữ liệu người dùng. Vui lòng tải lại trang.</p>';
            }
        } finally {
            this._hideLoading(); // Hide loading indicator once done or on error
        }
    }

    async _loadInitialData() {
        // --- Parallel fetching of initial data ---
        const fetchPromises = [
            this._fetchCartAPI(),       // --- BACKEND CALL ---
            this._fetchWishlistAPI(),   // --- BACKEND CALL ---
            this._fetchNotificationsAPI(), // --- BACKEND CALL ---
            // --- BACKEND CALL: Fetch user points ---
            // this._fetchUserPointsAPI(),
            // --- BACKEND CALL: Fetch addresses ---
            // this._fetchAddressesAPI(),
        ];

        const [cartData, wishlistData, notificationData /*, userPointsData, addressData */] = await Promise.all(fetchPromises);

        // Update instance state with fetched data
        this.cartItems = cartData || [];
        this.wishlistItems = wishlistData || [];
        this.notifications = notificationData || [];
        // this.userPoints = userPointsData?.points || 1250;
        // this.userAddresses = addressData || [];

        // --- BACKEND INTEGRATION: Fetch initial orders/requests if needed immediately ---
        // E.g., if Overview shows recent orders, fetch them here or delay until needed.
    }

    // =========================================================================
    // Event Listener Setup
    // =========================================================================
    _setupEventListeners() {
        // Theme Toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', this._handleThemeChange.bind(this));
        }

        // Sidebar Toggle
        if (this.sidebarToggle && this.sidebar) {
            this.sidebarToggle.addEventListener('click', this._toggleSidebar.bind(this));
        }

        // Sidebar Links (excluding logout)
        this.sidebarLinks.forEach(link => {
            if (!link.id || !link.id.includes('logout')) {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    this._setActiveSection(link.dataset.section);
                });
            }
        });

        // Header Dropdowns
        if (this.notificationBell) {
            this.notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleDropdown(this.notificationPanel, this.notificationBell);
            });
        }
        if (this.userMenuToggle) {
            this.userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleDropdown(this.userDropdown, this.userMenuToggle);
            });
        }
        document.addEventListener('click', this._handleDocumentClickForDropdowns.bind(this));

        // Notification Panel Actions
        if (this.clearNotificationsBtn) {
            this.clearNotificationsBtn.addEventListener('click', this._handleClearAllNotifications.bind(this));
        }
        if (this.notificationList) {
            this.notificationList.addEventListener('click', this._handleNotificationItemClick.bind(this));
        }

        // Modals
        if (this.closeDetailModalBtn) {
            this.closeDetailModalBtn.addEventListener('click', () => this._closeModal(this.detailModal));
        }
        if (this.closeAddAddressModalBtn) {
            this.closeAddAddressModalBtn.addEventListener('click', () => this._closeModal(this.addAddressModal));
        }
         // --- Modal Overlay Click to Close ---
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                // Close active modal if click is directly on overlay
                if (e.target === this.modalOverlay && this.activeModal) {
                    this._closeModal(this.activeModal);
                }
            });
        }


        // Store Section Listeners
        if (this.storeSection) {
            this._setupStoreEventListeners();
        }

        // Cart Section Listeners
        if (this.cartSection) {
            this._setupCartEventListeners();
        }

        // Account Section Listeners
        if (this.accountSection) {
            this._setupAccountEventListeners();
        }


        // Form Submissions
        this._setupFormSubmission(this.serviceRequestForm, 'Yêu cầu dịch vụ', '/api/service-requests');
        this._setupFormSubmission(this.personalInfoForm, 'Cập nhật thông tin cá nhân', '/api/user/profile');
        this._setupFormSubmission(this.changePasswordForm, 'Đổi mật khẩu', '/api/user/password');
        this._setupFormSubmission(this.notificationSettingsForm, 'Cập nhật cài đặt thông báo', '/api/user/notifications/settings');
        this._setupFormSubmission(this.supportForm, 'Yêu cầu hỗ trợ', '/api/support-requests');
        this._setupFormSubmission(this.addAddressForm, 'Thêm địa chỉ', '/api/addresses'); // For the modal form

        // Password Confirmation Input Validation
        if (this.confirmNewPasswordInput) {
            this.confirmNewPasswordInput.addEventListener('input', this._validatePasswordConfirmation.bind(this));
        }
        if (this.newPasswordInput) {
            this.newPasswordInput.addEventListener('input', this._validatePasswordConfirmation.bind(this)); // Also check when new pwd changes
        }

        // Logout Links
        if (this.logoutLinkSidebar) {
            this.logoutLinkSidebar.addEventListener('click', this._handleLogout.bind(this));
        }
        if (this.logoutLinkDropdown) {
            this.logoutLinkDropdown.addEventListener('click', this._handleLogout.bind(this));
        }

        // Chatbox Listeners
        if (this.chatboxWidget && this.chatboxToggle) {
            this.chatboxToggle.addEventListener('click', this._toggleChatbox.bind(this));
        }
        if (this.chatSendButton) {
            this.chatSendButton.addEventListener('click', this._handleChatSendMessage.bind(this));
        }
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this._handleChatSendMessage();
                }
            });
        }

        // General Action Listeners (Delegated)
        this._attachActionListeners();
    }

    _setupStoreEventListeners() {
        // Filter links (Category, Brand, Rating)
        this.filterLinks.forEach(link => {
            link.addEventListener('click', this._handleFilterLinkClick.bind(this));
        });

        // Price Range
        if (this.priceRange && this.priceRangeValue) {
            this.priceRange.addEventListener('input', () => {
                this.priceRangeValue.textContent = parseInt(this.priceRange.value).toLocaleString('vi-VN');
            });
            const applyPriceFilter = () => {
                this.currentFilters.maxPrice = parseInt(this.priceRange.value);
                this.currentFilters.page = 1;
                this._applyFilters(); // Trigger API call
            };
            this.priceRange.addEventListener('mouseup', applyPriceFilter);
            this.priceRange.addEventListener('touchend', applyPriceFilter);
        }
         // Price Button (Alternative)
         if (this.applyFilterBtn) {
             this.applyFilterBtn.addEventListener('click', () => {
                 this.currentFilters.maxPrice = parseInt(this.priceRange.value);
                 this.currentFilters.page = 1;
                 this._applyFilters();
             });
         }

        // Clear Filters Button
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', this._handleClearFilters.bind(this));
        }

        // Sort By Select
        if (this.sortBySelect) {
            this.sortBySelect.addEventListener('change', () => {
                this.currentFilters.sortBy = this.sortBySelect.value;
                this.currentFilters.page = 1;
                this._applyFilters();
            });
        }

        // View Toggle Buttons
        this.viewToggleButtons.forEach(button => {
            button.addEventListener('click', this._handleViewToggleClick.bind(this));
        });

        // Pagination Links (Delegation)
        if (this.paginationContainer) {
            this.paginationContainer.addEventListener('click', this._handlePaginationClick.bind(this));
        }

        // Store Search
        if (this.storeSearchInput && this.storeSearchButton) {
            const triggerSearch = () => {
                this.currentFilters.searchTerm = this.storeSearchInput.value;
                this.currentFilters.page = 1;
                this._applyFilters();
            };
            this.storeSearchButton.addEventListener('click', triggerSearch);
            this.storeSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); triggerSearch(); }
            });
            this.storeSearchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Escape') { this.storeSearchInput.value = ''; triggerSearch(); }
            });
             // Handle clear 'x' click in search input type="search"
             this.storeSearchInput.addEventListener('search', () => {
                 if (this.storeSearchInput.value === '') triggerSearch();
             });
        }
    }

    _setupCartEventListeners() {
         // Use event delegation for dynamic items within the container
         this.cartSection.addEventListener('click', this._handleCartActionClick.bind(this));

         // Listener for quantity input change (direct change/typing)
         this.cartSection.addEventListener('change', this._handleCartInputChange.bind(this));

         // Listener for quantity input blur (to reset invalid values like empty or < 1)
          this.cartSection.addEventListener('blur', this._handleCartInputBlur.bind(this), true); // Use capture phase

         // Listener for address selection change
         if (this.cartAddressSelect) {
             this.cartAddressSelect.addEventListener('change', this._updatePhoneNumberFromAddress.bind(this));
         }
    }

    _setupAccountEventListeners() {
        // Button to open "Add Address" modal
        if (this.addAddressButtonAcc) {
            this.addAddressButtonAcc.addEventListener('click', () => {
                if(this.addAddressForm) this.addAddressForm.reset();
                this._openModal(this.addAddressModal);
            });
        }

        // Actions within the address list (Edit, Delete, Set Default) using delegation
        if (this.addressListContainer) {
            this.addressListContainer.addEventListener('click', this._handleAddressListActionClick.bind(this));
        }
    }

    _attachActionListeners() {
        const productsArea = document.querySelector('.store-products-area'); // Includes grid and list
        if (productsArea) {
            productsArea.addEventListener('click', this._handleStoreActionClick.bind(this));
        }
        if (this.wishlistGrid) {
            this.wishlistGrid.addEventListener('click', this._handleWishlistActionClick.bind(this));
        }
        if (this.detailModalContent) {
            this.detailModalContent.addEventListener('click', this._handleDetailModalActionClick.bind(this));
        }
        if (this.orderHistorySection) {
            this.orderHistorySection.addEventListener('click', this._handleOrderHistoryActionClick.bind(this));
        }
        if (this.overviewSection) {
            this.overviewSection.addEventListener('click', this._handleOverviewActionClick.bind(this));
        }
        // Feedback section listener (specific setup needed due to async render)
        if (this.shopFeedbackListContainer && !this.shopFeedbackListContainer.dataset.listenerAttached) {
             this.shopFeedbackListContainer.addEventListener('click', this._handleFeedbackActionClick.bind(this));
             this.shopFeedbackListContainer.dataset.listenerAttached = 'true';
        }
    }

    _setupFormSubmission(formElement, successMessage, apiEndpoint) {
        if (!formElement) return;

        formElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            let isValid = true;

            // Basic required field validation
            formElement.querySelectorAll('[required]').forEach(input => {
                input.style.borderColor = ''; // Reset border
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--danger-color)';
                }
            });

            // Specific validation for password form
            if (formElement === this.changePasswordForm) {
                if (this.newPasswordInput.value !== this.confirmNewPasswordInput.value) {
                    isValid = false;
                    if (this.passwordMatchErrorAcc) this.passwordMatchErrorAcc.style.display = 'block';
                    if(this.newPasswordInput) this.newPasswordInput.style.borderColor = 'var(--danger-color)';
                    if(this.confirmNewPasswordInput) this.confirmNewPasswordInput.style.borderColor = 'var(--danger-color)';
                } else {
                    if (this.passwordMatchErrorAcc) this.passwordMatchErrorAcc.style.display = 'none';
                }
            }

            if (!isValid) {
                alert("Vui lòng kiểm tra lại các trường được đánh dấu.");
                return;
            }

            const submitButton = formElement.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.innerHTML : 'Gửi';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
            }
            this._showLoading();

            try {
                // --- BACKEND CALL ---
                const result = await this._submitFormDataAPI(formElement, apiEndpoint);

                if (result.success) {
                    this._addNotification(`${successMessage} đã được gửi/lưu!`, 'success');
                    alert(`${successMessage} thành công!`); // Simple feedback

                    // --- Post-submission actions ---
                    if (formElement === this.serviceRequestForm) {
                        this._addServiceRequestToHistory(formElement);
                    } else if (formElement === this.personalInfoForm) {
                        this._updateUserProfileDisplay(formElement);
                    } else if (formElement === this.addAddressForm) {
                        // Address API response should contain the new address data
                        if (result.newAddress) {
                           this._handleNewAddressAdded(result.newAddress);
                        }
                         this._closeModal(this.addAddressModal); // Close modal on success
                    }

                    formElement.reset();
                    if (formElement === this.changePasswordForm && this.passwordMatchErrorAcc) {
                        this.passwordMatchErrorAcc.style.display = 'none'; // Hide pwd error on success
                    }

                } else {
                    throw new Error(result.message || "Có lỗi xảy ra.");
                }
            } catch (error) {
                console.error(`Error submitting ${successMessage} form:`, error);
                this._addNotification(`Lỗi ${successMessage}: ${error.message}`, 'error');
                alert(`Lỗi ${successMessage}: ${error.message}`);
            } finally {
                this._hideLoading();
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
                // Reset borders
                formElement.querySelectorAll('[style*="border-color"]').forEach(el => el.style.borderColor = '');
            }
        });
    }

    // =========================================================================
    // Utility Functions (Private Methods)
    // =========================================================================
    _formatCurrency(amount) {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) return '0đ';
        return numericAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    _getProductDataFromElement(element) {
        if (!element) return null;
        const productId = element.dataset.productId || `MOCK-${Date.now()}${Math.random().toString(16).slice(2)}`;
        const name = element.querySelector('h4 a')?.textContent || element.querySelector('h4')?.textContent || 'Sản phẩm không tên';
        const priceMatch = element.querySelector('.price')?.textContent.match(/[\d.,]+/);
        const priceText = priceMatch ? priceMatch[0] : '0';
        const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''));
        const imgSrc = element.querySelector('.product-image img, .product-list-image img, .main-image img, .wishlist-item img')?.src || `https://via.placeholder.com/100x100.png/eee/aaa?text=N/A`;
        const category = element.querySelector('.product-category-link')?.textContent || element.dataset.category || null;
        const brand = element.dataset.brand || null;
        return {
            id: productId,
            name: name,
            price: isNaN(priceValue) ? 0 : priceValue,
            imageSrc: imgSrc,
            category: category,
            brand: brand,
            ratingHTML: element.querySelector('.rating')?.innerHTML // Capture existing rating HTML
        };
    }

    // =========================================================================
    // Loading Overlay (Private Methods)
    // =========================================================================
    _showLoading() {
        if (this.storeLoadingOverlay) this.storeLoadingOverlay.classList.add('active');
        // Optionally add a general overlay for non-store operations
        // document.body.classList.add('global-loading');
    }

    _hideLoading() {
        if (this.storeLoadingOverlay) this.storeLoadingOverlay.classList.remove('active');
        // document.body.classList.remove('global-loading');
    }

    // =========================================================================
    // Modal Management (Private Methods)
    // =========================================================================
    _openModal(modalElement) {
        if (!modalElement || this.activeModal) return; // Prevent opening multiple modals or non-existent ones
        // Special handling maybe needed if cart becomes a modal again, but currently it's a section

        if (this.modalOverlay) this.modalOverlay.classList.add('active');
        modalElement.classList.add('active');
        modalElement.style.display = 'block'; // Ensure it's visible
        this.activeModal = modalElement;
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    _closeModal(modalElement) {
        const targetModal = modalElement || this.activeModal;
        if (!targetModal) return;

        if (this.modalOverlay) this.modalOverlay.classList.remove('active');
        targetModal.classList.remove('active');
        targetModal.style.display = 'none'; // Hide it
        this.activeModal = null;

        // Clear detail modal content after closing transition
        if (targetModal === this.detailModal && this.detailModalContent) {
             setTimeout(() => { this.detailModalContent.innerHTML = '<p>Đang tải chi tiết...</p>'; }, 300);
        }
        document.body.style.overflow = ''; // Restore background scroll
    }

     _createAddAddressModal() {
        this.addAddressModal = document.createElement('div');
        this.addAddressModal.id = 'addAddressModal';
        this.addAddressModal.className = 'modal modal-add-address'; // Add class for styling
        this.addAddressModal.style.display = 'none'; // Hidden initially
        this.addAddressModal.innerHTML = `
            <button class="close-modal" id="closeAddAddressModal">×</button>
            <h2>Thêm địa chỉ mới</h2>
            <form id="addAddressForm">
                <div class="form-group">
                    <label for="newAddrName">Họ tên người nhận *</label>
                    <input type="text" id="newAddrName" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="newAddrPhone">Số điện thoại *</label>
                    <input type="tel" id="newAddrPhone" name="phone" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="newAddrStreet">Số nhà, tên đường *</label>
                    <input type="text" id="newAddrStreet" name="street" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="newAddrCity">Tỉnh/Thành phố *</label>
                    <input type="text" id="newAddrCity" name="city" class="form-control" required> {/* TODO: Convert to Select */}
                </div>
                <div class="form-group">
                    <label for="newAddrDistrict">Quận/Huyện *</label>
                    <input type="text" id="newAddrDistrict" name="district" class="form-control" required>{/* TODO: Convert to Select */}
                </div>
                <div class="form-group">
                    <label for="newAddrWard">Phường/Xã *</label>
                    <input type="text" id="newAddrWard" name="ward" class="form-control" required> {/* TODO: Convert to Select */}
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" id="newAddrIsDefault" name="isDefault" value="true">
                    <label for="newAddrIsDefault">Đặt làm địa chỉ mặc định</label>
                </div>
                <button type="submit" class="btn btn-primary">Lưu địa chỉ</button>
            </form>`;
        document.body.appendChild(this.addAddressModal);

        // Get references to elements inside the newly created modal
        this.closeAddAddressModalBtn = document.getElementById('closeAddAddressModal');
        this.addAddressForm = document.getElementById('addAddressForm');
     }

    // =========================================================================
    // Sidebar Navigation & Section Switching (Private Methods)
    // =========================================================================
    _setActiveSection(sectionId) {
        if (!sectionId) return;

        // Update sidebar links and dashboard sections visibility
        this.sidebarLinks.forEach(link => link.classList.remove('active'));
        this.dashboardSections.forEach(section => section.classList.remove('active'));

        const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
        const activeSection = document.getElementById(`${sectionId}-section`);

        if (activeLink) activeLink.classList.add('active');
        if (activeSection) activeSection.classList.add('active');

        // --- Actions specific to section activation ---
        switch (sectionId) {
            case 'contact-feedback':
                this._renderShopFeedback(); // --- NOTE: Needs fetchFeedbackAPI() call inside ---
                break;
            case 'cart':
                this._renderCartSection(); // Renders based on current state
                // --- BACKEND INTEGRATION: Optionally call _fetchCartAPI() here ---
                break;
            case 'wishlist':
                this._renderWishlist(); // Renders based on current state
                // --- BACKEND INTEGRATION: Optionally call _fetchWishlistAPI() here ---
                break;
            case 'store':
                // Trigger initial load only if product grid is empty
                if (this.productGrid && this.productGrid.innerHTML.trim() === '') {
                    this._applyFilters(); // --- NOTE: Needs _fetchProductsAPI() inside ---
                }
                break;
            case 'order-history':
                this._renderOrderHistoryTables(); // Render tables when entering history
                break;
            case 'account':
                // --- BACKEND INTEGRATION: Fetch user info if needed ---
                this._populateAddressOptions(); // Ensure dropdowns are up-to-date
                this._renderAddressList(); // Render address list in account tab
                break;
        }

        // Close mobile sidebar if open
        if (window.innerWidth <= 992 && this.sidebar?.classList.contains('active')) {
            this._closeSidebar();
        }

        // Scroll to top of main content area
        document.querySelector('.dashboard-main')?.scrollTo(0, 0);
    }

    _toggleSidebar() {
        if(this.sidebar) {
            this.sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open-overlay', this.sidebar.classList.contains('active'));
        }
    }

    _closeSidebar() {
        if(this.sidebar) {
            this.sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open-overlay');
        }
    }

    // =========================================================================
    // Header Dropdowns (Private Methods)
    // =========================================================================
    _toggleDropdown(panel, button) {
        if (!panel || !button) return;

        const isActive = panel.classList.contains('active');
        this._closeAllDropdowns(); // Close any other open dropdowns first

        if (!isActive) {
            panel.classList.add('active');
        }
    }

    _closeAllDropdowns() {
        if (this.notificationPanel?.classList.contains('active')) {
            this.notificationPanel.classList.remove('active');
        }
        if (this.userDropdown?.classList.contains('active')) {
            this.userDropdown.classList.remove('active');
        }
    }

    _handleDocumentClickForDropdowns(event) {
        // Close dropdowns if click is outside relevant areas
        const isOutsideNotification = this.notificationPanel && !this.notificationPanel.contains(event.target) && this.notificationBell && !this.notificationBell.contains(event.target);
        const isOutsideUserMenu = this.userDropdown && !this.userDropdown.contains(event.target) && this.userMenuToggle && !this.userMenuToggle.contains(event.target);

        if (isOutsideNotification && isOutsideUserMenu) {
            this._closeAllDropdowns();
        }

        // Close mobile sidebar if click is outside
        const isOutsideSidebar = this.sidebar && !this.sidebar.contains(event.target) && this.sidebarToggle && !this.sidebarToggle.contains(event.target);
        if (window.innerWidth <= 992 && this.sidebar?.classList.contains('active') && isOutsideSidebar) {
            this._closeSidebar();
        }

        // Close chatbox if click is outside
         if (this.chatboxWidget && this.chatboxWidget.classList.contains('active') && !this.chatboxWidget.contains(event.target) && !this.chatboxToggle.contains(event.target)) {
            this._closeChatbox();
         }
    }

    // =========================================================================
    // Notification System (Partially Backend)
    // =========================================================================
    async _fetchNotificationsAPI() {
        console.log("API CALL (SIMULATED): Fetching notifications...");
        await new Promise(resolve => setTimeout(resolve, 500));
        // --- TODO: Replace with actual fetch() ---
        const mockNotifications = [
            { id: `notif-${Date.now()}-1`, text: 'Đơn hàng #P789 đã được giao thành công.', timestamp: new Date(Date.now() - 3600000), read: false, type: 'success', link: { section: 'order-history', detailId: 'P789' } },
            { id: `notif-${Date.now()}-2`, text: 'Yêu cầu dịch vụ #S456 đang được xử lý.', timestamp: new Date(Date.now() - 86400000), read: true, type: 'info', link: { section: 'order-history', detailId: 'S456' } },
            { id: `notif-${Date.now()}-3`, text: 'Chào mừng bạn đến với TechShop!', timestamp: new Date(Date.now() - 172800000), read: true, type: 'info' },
        ];
        console.log("API RESPONSE (SIMULATED): Received notifications.");
        return mockNotifications;
    }

    async _markNotificationReadAPI(notificationId = null) { // null means mark all
        console.log(`API CALL (SIMULATED): Marking notification(s) as read ${notificationId ? `(ID: ${notificationId})` : '(All)'}...`);
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("API RESPONSE (SIMULATED): Notification(s) marked as read on server.");
        return true; // Indicate success
    }

    _addNotification(message, type = 'info', link = null) { // For client-side feedback
        const newNotification = {
            id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            text: message,
            timestamp: new Date(),
            read: false,
            type,
            link
        };
        this.notifications.unshift(newNotification); // Add to the beginning
        this._updateNotificationUI();

        // Shake bell effect
        if (this.notificationBell) {
            this.notificationBell.classList.remove('shake');
            void this.notificationBell.offsetWidth; // Trigger reflow
            this.notificationBell.classList.add('shake');
            setTimeout(() => this.notificationBell.classList.remove('shake'), 500);
        }
    }

    _updateNotificationUI() {
        const unreadCount = this.notifications.filter(n => !n.read).length;

        // Update badges
        if (this.notificationCountBadge) {
            this.notificationCountBadge.textContent = unreadCount;
            this.notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        if (this.overviewNotificationCount) {
            this.overviewNotificationCount.textContent = unreadCount;
        }

        // Update notification list dropdown
        if (this.notificationList) {
            this.notificationList.innerHTML = ''; // Clear current list
            if (this.notifications.length === 0) {
                this.notificationList.innerHTML = '<li class="no-notifications">Chưa có thông báo mới.</li>';
            } else {
                // Show latest N notifications
                this.notifications.slice(0, 10).forEach(n => {
                    const li = document.createElement('li');
                    li.className = `notification-item notification-${n.type} ${n.read ? '' : 'unread'}`;
                    li.dataset.notificationId = n.id; // Store ID for click handling
                    li.innerHTML = `
                        <span>${n.text}</span>
                        <span class="timestamp">${n.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>`;
                     // Add data attributes for link info if present
                     if (n.link) {
                         li.dataset.linkSection = n.link.section;
                         if (n.link.detailId) li.dataset.linkDetailId = n.link.detailId;
                     }
                    this.notificationList.appendChild(li);
                });
            }
        }
    }

     _handleNotificationItemClick(event) {
        const listItem = event.target.closest('.notification-item');
        if (!listItem) return;

        const notificationId = listItem.dataset.notificationId;
        const linkSection = listItem.dataset.linkSection;
        const linkDetailId = listItem.dataset.linkDetailId;

        this._processNotificationClick(notificationId, { section: linkSection, detailId: linkDetailId });
     }


    async _processNotificationClick(notificationId, link) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        let markedRead = false;

        if (index > -1 && !this.notifications[index].read) {
            this.notifications[index].read = true; // Optimistic UI update
            this._updateNotificationUI();
            markedRead = true;

            try {
                await this._markNotificationReadAPI(notificationId); // --- BACKEND CALL ---
                console.log(`Notification ${notificationId} successfully marked read on server.`);
            } catch (error) {
                console.error("Failed to mark notification read on server:", error);
                // Revert optimistic update on error
                this.notifications[index].read = false;
                this._updateNotificationUI();
                this._addNotification("Lỗi: Không thể đánh dấu đã đọc.", "error");
                markedRead = false; // Revert flag
            }
        }

        // Navigate if link exists, even if already read
        if (link && link.section) {
            this._closeAllDropdowns(); // Close panel before navigating
            this._setActiveSection(link.section);

            if (link.detailId) {
                // Delay modal opening slightly for section transition
                setTimeout(() => {
                    if (link.section === 'order-history') {
                        const orderType = link.detailId.startsWith('S') ? 'service' : 'product';
                        this._showOrderDetailModal(link.detailId, orderType); // Needs fetch
                    }
                    // Add other detail types if needed (e.g., product details)
                     else if (link.section === 'store' || link.section === 'product-detail'){ // Example link to product
                         this._showProductDetailModal(link.detailId); // Needs fetch
                     }
                }, 350);
            }
        }
    }

    async _handleClearAllNotifications(event) {
        event.preventDefault();
        let changed = false;
        this.notifications.forEach(n => {
            if (!n.read) {
                n.read = true;
                changed = true;
            }
        });

        if (changed) {
            this._updateNotificationUI(); // Optimistic UI update
            try {
                await this._markNotificationReadAPI(null); // Mark all on server --- BACKEND CALL ---
                console.log("All notifications marked read on server.");
            } catch (error) {
                console.error("Failed to mark all notifications read on server:", error);
                this._addNotification("Lỗi: Không thể đánh dấu tất cả đã đọc.", "error");
                // Consider re-fetching notifications to sync state after error
                // this.notifications = await this._fetchNotificationsAPI();
                // this._updateNotificationUI();
            }
        }
    }

    // =========================================================================
    // Tab Switching (Private Method)
    // =========================================================================
    _setupTabs(containerSelector) {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            const links = container.querySelectorAll('.tab-link, .account-tab-link');
            const contents = container.querySelectorAll('.tab-content, .account-tab-content');

            if (links.length === 0 || contents.length === 0) return;

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
                    if (activeContent) {
                        activeContent.classList.add('active');
                    }
                });
            });

            // Activate the first tab by default if none are active initially
            const hasActiveLink = container.querySelector('.tab-link.active, .account-tab-link.active');
            if (!hasActiveLink && links.length > 0) {
                links[0].click(); // Simulate a click on the first link
            }
        });
    }

     _activateOrderHistoryTab(orderType = 'product') {
        const pTab = this.orderHistorySection?.querySelector('.tab-link[data-tab="product-orders"]');
        const sTab = this.orderHistorySection?.querySelector('.tab-link[data-tab="service-orders"]');
        const pCont = this.orderHistorySection?.querySelector('#product-orders');
        const sCont = this.orderHistorySection?.querySelector('#service-orders');

        if (!pTab || !sTab || !pCont || !sCont) return;

        const isProduct = orderType === 'product';
        const targetTab = isProduct ? pTab : sTab;

        // Click the tab only if it's not already active
        if (!targetTab.classList.contains('active')) {
            targetTab.click();
        }
     }


    // =========================================================================
    // Cart Functionality (Heavy Backend Interaction)
    // =========================================================================

    async _fetchCartAPI() {
        console.log("API CALL (SIMULATED): Fetching cart items...");
        await new Promise(resolve => setTimeout(resolve, 400));
        // --- TODO: Replace with actual fetch() ---
        const mockCart = [
            // { id: 'TB-LP-01', name: 'Laptop TechBrand Pro 14', price: 32500000, quantity: 1, imageSrc: '...' }
        ]; // Start empty for demo
        console.log("API RESPONSE (SIMULATED): Received cart items.");
        return mockCart;
    }

    async _updateServerCartAPI(productId, quantity) { // quantity=0 means remove
        console.log(`API CALL (SIMULATED): Updating cart - Product ID: ${productId}, Quantity: ${quantity}`);
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate backend logic: find item, update qty, or remove if qty is 0
        let updatedCart = [...this.cartItems]; // Start with a copy of current state
        const itemIndex = updatedCart.findIndex(item => item.id === productId);

        if (quantity <= 0) { // Remove item
            if (itemIndex > -1) {
                updatedCart.splice(itemIndex, 1);
            }
        } else { // Add or Update item
            if (itemIndex > -1) { // Update existing item
                updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity: quantity };
            } else {
                 // Need product details to add - this simulation assumes details are known
                 // A real API would handle adding based on productId, maybe fetching details server-side
                 // Let's assume _handleAddToCart provides necessary details for the optimistic update
                 console.warn("Simulated _updateServerCartAPI cannot add new item without details. Assuming optimistic update handled it.");
                 // For simulation, let's just return the cart state *after* optimistic update
            }
        }

        console.log("API RESPONSE (SIMULATED): Cart updated on server.");
        // Return the *authoritative* cart state from the server (simulated here)
        return { success: true, updatedCart: updatedCart };
    }

    async _validateVoucherAPI(voucherCode) {
        console.log(`API CALL (SIMULATED): Validating voucher code: ${voucherCode}...`);
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 300));
        let response = { valid: false, message: 'Mã voucher không hợp lệ hoặc đã hết hạn.', voucherData: null };
        const upperCode = voucherCode.toUpperCase();

        // --- Simulate different voucher codes ---
        if (upperCode === 'SALE10') { // 10% off
            response = { valid: true, message: 'Áp dụng thành công!', voucherData: { code: upperCode, discountType: 'percentage', value: 0.1 } };
        } else if (upperCode === 'GIAM20K') { // 20,000 VND off
            response = { valid: true, message: 'Áp dụng thành công!', voucherData: { code: upperCode, discountType: 'fixed', value: 20000 } };
        } else if (upperCode === 'FREESHIP') { // 15,000 VND off (simulated shipping)
             response = { valid: true, message: 'Áp dụng thành công!', voucherData: { code: upperCode, discountType: 'fixed', value: 15000 } };
        }
        console.log("API RESPONSE (SIMULATED): Voucher validation result:", response);
        return response;
    }

    async _submitOrderAPI(orderData) {
        console.log("API CALL (SIMULATED): Submitting order...", orderData);
        // --- TODO: Replace with actual fetch() to order creation endpoint ---
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

        // Simulate backend generating order ID and success response
        const orderId = `PO-${Date.now()}`; // Generate a mock order ID
        console.log("API RESPONSE (SIMULATED): Order submission successful.");
        return { success: true, orderId: orderId, message: "Đặt hàng thành công!" };
    }


    _updateCartBadge() {
        if (!this.sidebarCartItemCount) return;
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.sidebarCartItemCount.textContent = totalItems;
        this.sidebarCartItemCount.classList.toggle('visible', totalItems > 0);

        // Also update checkout button state
        if (this.checkoutButton) {
            this.checkoutButton.disabled = totalItems === 0;
        }
    }

    _renderCartSection() {
        if (!this.cartSection || !this.cartItemsContainer || !this.cartTotalAmount || !this.cartSubtotalAmount /* etc */) {
            // Avoid errors if cart elements aren't present or section isn't active
            if (this.cartSection?.classList.contains('active')) {
                console.error("Cart section elements not found for rendering!");
            }
            return;
        }

        this.cartItemsContainer.innerHTML = ''; // Clear existing items
        let subtotal = 0;

        if (this.cartItems.length === 0) {
            this.cartItemsContainer.innerHTML = '<p class="empty-cart-message">Giỏ hàng của bạn đang trống.</p>';
            subtotal = 0;
            this.appliedVoucher = null; // Reset voucher
            this.pointsUsed = 0; // Reset points
            this.pointsValue = 0;
            if (this.applyPointsCheckbox) {
                this.applyPointsCheckbox.checked = false;
                this.applyPointsCheckbox.disabled = true;
            }
            if (this.cartVoucherInput) this.cartVoucherInput.value = '';
            if (this.voucherMessage) this.voucherMessage.textContent = '';
            this._updateCheckoutOptionsUI(0); // Update points display etc.
        } else {
            this.cartItems.forEach(item => {
                const itemPrice = Number(item.price) || 0;
                subtotal += itemPrice * item.quantity;
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.dataset.cartItemId = item.id; // Use data attribute to identify item
                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.imageSrc || 'https://via.placeholder.com/80x80.png?text=N/A'}" alt="${item.name || ''}">
                    </div>
                    <div class="cart-item-details">
                        <h5>${item.name || 'Sản phẩm'}</h5>
                        <p class="cart-item-price">${this._formatCurrency(itemPrice)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-decrease" aria-label="Giảm">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" aria-label="Số lượng">
                        <button class="quantity-increase" aria-label="Tăng">+</button>
                    </div>
                    <div class="cart-item-remove">
                        <button class="remove-item-btn" aria-label="Xóa"><i class="fas fa-trash-alt"></i></button>
                    </div>`;
                this.cartItemsContainer.appendChild(itemElement);
            });
             if (this.applyPointsCheckbox) {
                 this.applyPointsCheckbox.disabled = (this.userPoints <= 0 || subtotal <= 0);
             }
        }

        // --- Recalculate Discounts and Total (based on current state) ---
        let voucherDiscount = 0;
        if (this.appliedVoucher) {
            if (this.appliedVoucher.discountType === 'percentage') {
                voucherDiscount = subtotal * this.appliedVoucher.value;
            } else if (this.appliedVoucher.discountType === 'fixed') {
                voucherDiscount = this.appliedVoucher.value;
            }
            voucherDiscount = Math.min(voucherDiscount, subtotal); // Cannot discount more than subtotal
        }

        this.pointsValue = 0;
        this.pointsUsed = 0;
        const amountAvailableForPoints = Math.max(0, subtotal - voucherDiscount);

        // Calculate points discount if checkbox is checked and enabled
        if (this.applyPointsCheckbox && this.applyPointsCheckbox.checked && !this.applyPointsCheckbox.disabled) {
             // Calculate max possible points value (either all points or the remaining total, whichever is smaller)
             const maxPossiblePointsValue = Math.min(this.userPoints * this.POINT_CONVERSION_RATE, amountAvailableForPoints);
             this.pointsValue = maxPossiblePointsValue;
             // Calculate points needed for this value
             this.pointsUsed = Math.floor(this.pointsValue / this.POINT_CONVERSION_RATE);
             // Ensure we don't use more points than available (edge case for rounding)
             if (this.pointsUsed > this.userPoints) {
                 this.pointsUsed = this.userPoints;
                 this.pointsValue = this.pointsUsed * this.POINT_CONVERSION_RATE;
             }
         } else {
              // Uncheck the box if it was checked but became disabled
              if (this.applyPointsCheckbox && this.applyPointsCheckbox.checked && this.applyPointsCheckbox.disabled) {
                  this.applyPointsCheckbox.checked = false;
              }
         }

        const total = Math.max(0, subtotal - voucherDiscount - this.pointsValue);

        // --- Update UI Elements ---
        if (this.cartSubtotalAmount) this.cartSubtotalAmount.textContent = this._formatCurrency(subtotal);
        if (this.cartTotalAmount) this.cartTotalAmount.textContent = this._formatCurrency(total);

        // Show/hide discount rows and update values
        if (this.voucherDiscountRow && this.cartVoucherDiscount) {
            this.voucherDiscountRow.style.display = voucherDiscount > 0 ? 'flex' : 'none';
            this.cartVoucherDiscount.textContent = `-${this._formatCurrency(voucherDiscount)}`;
        }
        if (this.pointsDiscountRow && this.cartPointsDiscount) {
            this.pointsDiscountRow.style.display = this.pointsValue > 0 ? 'flex' : 'none';
            this.cartPointsDiscount.textContent = `-${this._formatCurrency(this.pointsValue)}`;
        }

        if (this.pointsToUseSpan) this.pointsToUseSpan.textContent = this.pointsUsed.toLocaleString('vi-VN');

        this._updateCheckoutOptionsUI(amountAvailableForPoints); // Update points/voucher messages/state
        this._updateCartBadge(); // Ensure sidebar badge is consistent
    }

    async _handleUpdateCartQuantity(itemId, newQuantity) {
        const currentItem = this.cartItems.find(item => item.id === itemId);
        if (!currentItem) return;

        const clampedQuantity = Math.max(0, newQuantity); // Ensure quantity is not negative (0 means remove)

        // --- Optimistic UI Update (Optional but improves UX) ---
        const originalQuantity = currentItem.quantity;
        const originalCartItems = [...this.cartItems]; // Backup for potential revert

        if (clampedQuantity === 0) {
            this.cartItems = this.cartItems.filter(item => item.id !== itemId); // Remove locally
        } else {
             const itemToUpdate = this.cartItems.find(item => item.id === itemId);
             if (itemToUpdate) { // Check again in case it was removed in parallel? (unlikely here)
                 itemToUpdate.quantity = clampedQuantity; // Update locally
             }
        }
        this._renderCartSection(); // Update UI immediately
        // --- End Optimistic Update ---

        try {
            this._showLoading(); // Indicate background activity
            const response = await this._updateServerCartAPI(itemId, clampedQuantity); // --- BACKEND CALL ---

            if (response.success) {
                // Replace local cart with the authoritative state from the server response
                this.cartItems = response.updatedCart;
                console.log("Cart updated successfully on server.");
                // Re-render with server state (might be redundant if optimistic was correct, but safer)
                this._renderCartSection();

                // Add notification only if quantity *successfully* changed
                if (clampedQuantity === 0 && originalQuantity > 0) {
                    this._addNotification(`Đã xóa "${currentItem.name || 'sản phẩm'}" khỏi giỏ.`);
                } else if (clampedQuantity > 0 && clampedQuantity !== originalQuantity) {
                    // Optional: Notify quantity update? Could be noisy.
                    // this._addNotification(`Cập nhật số lượng "${currentItem.name}" thành ${clampedQuantity}.`);
                }
            } else {
                // If API call failed, revert the optimistic update
                throw new Error(response.message || "Failed to update cart on server.");
            }
        } catch (error) {
            console.error("Error updating cart quantity:", error);
            this._addNotification(`Lỗi cập nhật giỏ hàng: ${error.message}`, 'error');

            // --- Revert Optimistic Update ---
            this.cartItems = originalCartItems; // Restore previous cart state
            this._renderCartSection(); // Re-render to show the reverted state
            // --- End Revert ---
        } finally {
            this._hideLoading();
        }
    }

    async _handleRemoveCartItem(itemId) {
        // Removing is just updating quantity to 0
        await this._handleUpdateCartQuantity(itemId, 0);
    }

    async _handleAddToCart(itemData) {
        if (!itemData || !itemData.id || isNaN(itemData.price)) {
            console.error("Invalid item data for add to cart:", itemData);
            this._addNotification("Lỗi: Không thể thêm sản phẩm không hợp lệ vào giỏ.", "error");
            return;
        }

        const existingItem = this.cartItems.find(item => item.id === itemData.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        const originalCartItems = [...this.cartItems]; // Backup for revert

        // --- Optimistic UI Update ---
        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            // Ensure only necessary data is added
            this.cartItems.push({
                id: itemData.id,
                name: itemData.name,
                price: itemData.price,
                imageSrc: itemData.imageSrc,
                quantity: 1
            });
        }
        // Update UI immediately if cart section is active, otherwise just badge/shake
        if(this.cartSection?.classList.contains('active')) {
            this._renderCartSection();
        }
        this._updateCartBadge();

        // Shake effect on sidebar cart link (visual feedback)
        const cartSidebarLink = document.querySelector('.sidebar-link[data-section="cart"]');
        if (cartSidebarLink) {
            cartSidebarLink.classList.remove('shake');
            void cartSidebarLink.offsetWidth; // Trigger reflow
            cartSidebarLink.classList.add('shake');
            setTimeout(() => cartSidebarLink.classList.remove('shake'), 400);
        }
        // --- End Optimistic Update ---

        try {
            // Call API to update the cart on the server
            const response = await this._updateServerCartAPI(itemData.id, newQuantity); // --- BACKEND CALL ---

            if (response.success) {
                // Sync local cart with server's response
                this.cartItems = response.updatedCart;
                console.log(`Item ${itemData.id} added/updated on server.`);
                this._addNotification(`Đã thêm "${itemData.name}" vào giỏ.`, 'success');
                // Re-render cart section *only if it's active* to reflect server state (might be same as optimistic)
                if(this.cartSection?.classList.contains('active')) {
                    this._renderCartSection();
                 }
                 this._updateCartBadge(); // Ensure badge is correct
            } else {
                throw new Error(response.message || "Failed to add item to cart on server.");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            this._addNotification(`Lỗi thêm vào giỏ: ${error.message}`, 'error');

            // --- Revert Optimistic Update ---
            this.cartItems = originalCartItems; // Restore previous state
            if(this.cartSection?.classList.contains('active')) {
               this._renderCartSection(); // Re-render to show reverted state
            }
            this._updateCartBadge(); // Revert badge if necessary
            // --- End Revert ---
        }
    }

    _updateCheckoutOptionsUI(amountAvailableForPoints = 0) {
        // Update available points display
        if (this.availablePointsSpan) {
            this.availablePointsSpan.textContent = this.userPoints.toLocaleString('vi-VN');
        }

        // Update points usage calculation and display
        if (this.pointsDiscountValueSpan && this.applyPointsCheckbox) {
            // Calculate potential discount value from points, capped by available amount
            const potentialDiscount = Math.min(this.userPoints * this.POINT_CONVERSION_RATE, Math.max(0, amountAvailableForPoints));
            const potentialPointsUsed = Math.floor(potentialDiscount / this.POINT_CONVERSION_RATE);

            // Display the potential discount value
            this.pointsDiscountValueSpan.textContent = this._formatCurrency(potentialDiscount);

            // Display how many points *would be* used or *are* used
            if (this.pointsToUseSpan) {
                this.pointsToUseSpan.textContent = (this.applyPointsCheckbox.checked ? this.pointsUsed : potentialPointsUsed).toLocaleString('vi-VN');
            }

            // Enable/disable the checkbox based on usability
            const canUsePoints = this.userPoints > 0 && potentialDiscount > 0;
            this.applyPointsCheckbox.disabled = !canUsePoints;

            // Automatically uncheck if it becomes disabled while checked
            if (!canUsePoints && this.applyPointsCheckbox.checked) {
                this.applyPointsCheckbox.checked = false;
                // Trigger re-render if needed, though renderCartSection usually follows
                // this._renderCartSection();
            }
        }

        // Update voucher message display
        if (this.voucherMessage) {
            if (this.appliedVoucher) {
                this.voucherMessage.textContent = `Đã áp dụng mã "${this.appliedVoucher.code}".`;
                this.voucherMessage.className = 'voucher-message success';
            } else if (this.voucherMessage.textContent.startsWith("Đã áp dụng")) {
                // Clear message if voucher was removed
                this.voucherMessage.textContent = '';
                this.voucherMessage.className = 'voucher-message';
            }
        }

        // Update points message (hints/errors)
        if (this.pointsMessage && this.applyPointsCheckbox) {
            if (this.applyPointsCheckbox.disabled) {
                if (this.userPoints > 0 && amountAvailableForPoints <= 0 && this.cartItems.length > 0) {
                    this.pointsMessage.textContent = "Tổng tiền sau giảm giá đã bằng 0.";
                    this.pointsMessage.className = 'points-message error';
                } else if (this.userPoints <= 0) {
                    this.pointsMessage.textContent = "Bạn không có điểm thưởng để sử dụng.";
                    this.pointsMessage.className = 'points-message error';
                } else { // Catch other disabled cases if any
                     this.pointsMessage.textContent = '';
                     this.pointsMessage.className = 'points-message';
                }
            } else { // Points can be used
                this.pointsMessage.textContent = `(Tỷ lệ: ${this.POINT_CONVERSION_RATE.toLocaleString('vi-VN')} điểm = ${this._formatCurrency(this.POINT_CONVERSION_RATE)})`;
                this.pointsMessage.className = 'points-message';
            }
        }

        // Ensure address options are populated/updated
        this._populateAddressOptions();
    }

     async _fetchAddressesAPI() { // --- BACKEND INTEGRATION: Fetch addresses ---
        console.log("API CALL (SIMULATED): Fetching user addresses...");
        await new Promise(resolve => setTimeout(resolve, 400));
        // --- TODO: Replace with actual fetch() ---
        console.log("API RESPONSE (SIMULATED): Received addresses (using local mock).");
        // Return the local mock data for now
        return this.userAddresses;
     }


    _populateAddressOptions() {
        if (!this.cartAddressSelect) return; // Only run if the select element exists

        // --- BACKEND INTEGRATION: In a real app, fetch addresses if needed ---
        // Example: if (this.userAddresses.length === 0) { this.userAddresses = await this._fetchAddressesAPI(); }
        const addressesToUse = this.userAddresses;

        // Remember the currently selected value to restore it if possible
        const selectedValue = this.cartAddressSelect.value;
        this.cartAddressSelect.innerHTML = '<option value="">-- Chọn địa chỉ --</option>'; // Clear existing options

        addressesToUse.forEach(addr => {
            const option = document.createElement('option');
            option.value = addr.id;
            // Construct the display text (handle potentially missing fields)
            option.textContent = `${addr.name || ''} - ${addr.street || ''}, ${addr.ward || ''}, ${addr.district || ''}, ${addr.city || ''} ${addr.isDefault ? '(Mặc định)' : ''}`;
            option.dataset.phone = addr.phone || ''; // Store phone number
            if (addr.isDefault) { option.dataset.isDefault = 'true'; } // Mark default option
            this.cartAddressSelect.appendChild(option);
        });

        // Restore selected value if it still exists in the new list
        if (this.cartAddressSelect.querySelector(`option[value="${selectedValue}"]`)) {
            this.cartAddressSelect.value = selectedValue;
        } else {
            // If previous selection is gone, try to select the default address
            const defaultOption = this.cartAddressSelect.querySelector('option[data-is-default="true"]');
            if (defaultOption) {
                defaultOption.selected = true;
            } else if (this.cartAddressSelect.options.length > 1) {
                // If no default, select the first actual address option
                this.cartAddressSelect.selectedIndex = 1;
            }
        }

        // Update the phone number field based on the (potentially new) selection
        this._updatePhoneNumberFromAddress();
    }

    _updatePhoneNumberFromAddress() {
        if (this.cartAddressSelect && this.cartPhoneNumber) {
            const selectedOption = this.cartAddressSelect.options[this.cartAddressSelect.selectedIndex];
            const phone = selectedOption?.dataset.phone; // Get phone from data attribute
            if (phone) {
                this.cartPhoneNumber.value = phone;
            }
            // Optional: Clear phone number if the selected option has no phone
            // else {
            //    this.cartPhoneNumber.value = '';
            // }
        }
    }

    // --- Event Handlers for Cart Actions ---
    _handleCartActionClick(event) {
        const target = event.target;
        const cartItemElement = target.closest('.cart-item');

        if (cartItemElement) { // Actions within a specific cart item
            const itemId = cartItemElement.dataset.cartItemId;
            const input = cartItemElement.querySelector('.quantity-input');
            const currentQuantity = input ? parseInt(input.value) : 0;

            if (target.closest('.quantity-decrease')) {
                // Call async handler for quantity update
                this._handleUpdateCartQuantity(itemId, currentQuantity - 1);
            } else if (target.closest('.quantity-increase')) {
                // Call async handler for quantity update
                this._handleUpdateCartQuantity(itemId, currentQuantity + 1);
            } else if (target.closest('.remove-item-btn')) {
                // Call async handler for item removal
                this._handleRemoveCartItem(itemId);
            }
        } else if (target === this.applyVoucherButton) { // Check for specific button IDs
            this._handleApplyVoucher(); // Async handler
        } else if (target === this.checkoutButton) {
            this._handleCheckout(); // Async handler
        } else if (target === this.addAddressBtnCart) { // Button in Cart section
            event.preventDefault();
            this._setActiveSection('account');
            // Navigate to the addresses tab within the account section
            setTimeout(() => {
                const addressTabLink = this.accountSection?.querySelector('.account-tab-link[data-account-tab="addresses"]');
                addressTabLink?.click();
            }, 100); // Short delay for section transition
        }
    }

    _handleCartInputChange(event) {
        // Handle direct input changes in quantity fields
        if (event.target.classList.contains('quantity-input')) {
            const cartItemElement = event.target.closest('.cart-item');
            if (cartItemElement) {
                const itemId = cartItemElement.dataset.cartItemId;
                let newQuantity = parseInt(event.target.value);
                // Validate and update quantity (use 1 if invalid/NaN/less than 1)
                this._handleUpdateCartQuantity(itemId, (isNaN(newQuantity) || newQuantity < 1) ? 1 : newQuantity); // Async
            }
        }
        // Handle change event for the points checkbox
        else if (event.target === this.applyPointsCheckbox) {
             this._renderCartSection(); // Re-render to recalculate totals with/without points
        }
    }

    _handleCartInputBlur(event) {
        // Reset quantity to 1 if input is blurred while empty or invalid (<1)
        if (event.target.classList.contains('quantity-input')) {
             const input = event.target;
             if (input.value === '' || parseInt(input.value) < 1) {
                 const cartItemElement = input.closest('.cart-item');
                 if (cartItemElement) {
                     const itemId = cartItemElement.dataset.cartItemId;
                     // Don't call API directly here, let the 'change' handler or re-render fix it.
                     // Just set value to 1 visually for immediate feedback, API call happened on change/valid input
                     input.value = 1;
                     // Optional: Could trigger _handleUpdateCartQuantity(itemId, 1) if strict sync on blur is needed
                 }
             }
         }
    }


    async _handleApplyVoucher() {
        if (!this.cartVoucherInput || !this.voucherMessage) return;

        const code = this.cartVoucherInput.value.trim();
        this.voucherMessage.textContent = ''; // Clear previous message
        this.voucherMessage.className = 'voucher-message'; // Reset class
        this.appliedVoucher = null; // Reset applied voucher state *before* validation

        if (!code) {
            this.voucherMessage.textContent = 'Vui lòng nhập mã voucher.';
            this.voucherMessage.className = 'voucher-message error';
            this._renderCartSection(); // Re-render to ensure any previous voucher effect is removed
            return;
        }

        this._showLoading(); // Indicate activity
        try {
            const response = await this._validateVoucherAPI(code); // --- BACKEND CALL ---

            if (response.valid && response.voucherData) {
                this.appliedVoucher = response.voucherData; // Store validated voucher details
                this.voucherMessage.textContent = response.message;
                this.voucherMessage.className = 'voucher-message success';
                this.cartVoucherInput.value = ''; // Clear input field on success
            } else {
                // Keep appliedVoucher as null
                this.voucherMessage.textContent = response.message;
                this.voucherMessage.className = 'voucher-message error';
            }
        } catch (error) {
            console.error("Error validating voucher:", error);
            this.voucherMessage.textContent = 'Lỗi hệ thống, không thể kiểm tra voucher.';
            this.voucherMessage.className = 'voucher-message error';
        } finally {
            this._hideLoading();
            // Re-render the cart section to reflect the new voucher status and recalculate total
            this._renderCartSection();
        }
    }

    async _handleCheckout() {
        if (!this.cartSection || !this.checkoutButton) return;

        // --- Client-Side Validation ---
        let isValid = true;
        let errorMsg = "";

        if (this.cartItems.length === 0) {
            isValid = false; errorMsg = "Giỏ hàng đang trống.";
        } else if (this.cartAddressSelect && !this.cartAddressSelect.value) {
            isValid = false; errorMsg = "Vui lòng chọn địa chỉ nhận hàng."; this.cartAddressSelect.focus();
        } else if (this.cartPhoneNumber && !this.cartPhoneNumber.value.trim()) {
            isValid = false; errorMsg = "Vui lòng nhập số điện thoại nhận hàng."; this.cartPhoneNumber.focus();
        }
        const selectedPaymentMethod = this.cartSection.querySelector('input[name="paymentMethod"]:checked');
         if (!selectedPaymentMethod) {
             isValid = false; errorMsg = "Vui lòng chọn phương thức thanh toán.";
             // Focus the first payment radio or its label if possible
             this.cartSection.querySelector('input[name="paymentMethod"]')?.focus();
         }

        if (!isValid) {
            alert(errorMsg); // Show validation error
            return; // Stop checkout process
        }
        // --- End Validation ---

        // Disable button and show loading state
        this.checkoutButton.disabled = true;
        this.checkoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        this._showLoading();

        // --- Recalculate Totals/Discounts *Just Before* Submitting ---
        // This ensures the latest cart state, voucher, and points are used
        const currentSubtotal = this.cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
        let finalVoucherDiscount = 0;
        if (this.appliedVoucher) {
            if (this.appliedVoucher.discountType === 'percentage') {
                finalVoucherDiscount = currentSubtotal * this.appliedVoucher.value;
            } else if (this.appliedVoucher.discountType === 'fixed') {
                finalVoucherDiscount = this.appliedVoucher.value;
            }
            finalVoucherDiscount = Math.min(finalVoucherDiscount, currentSubtotal);
        }

        let finalPointsValue = 0;
        let finalPointsUsed = 0;
        const finalAmountAvailableForPoints = Math.max(0, currentSubtotal - finalVoucherDiscount);
        if (this.applyPointsCheckbox && this.applyPointsCheckbox.checked && !this.applyPointsCheckbox.disabled) {
            const maxPossiblePointsValue = Math.min(this.userPoints * this.POINT_CONVERSION_RATE, finalAmountAvailableForPoints);
            finalPointsValue = maxPossiblePointsValue;
            finalPointsUsed = Math.floor(finalPointsValue / this.POINT_CONVERSION_RATE);
            if (finalPointsUsed > this.userPoints) { // Double check points usage doesn't exceed available
                finalPointsUsed = this.userPoints;
                finalPointsValue = finalPointsUsed * this.POINT_CONVERSION_RATE;
            }
        }
        const finalTotal = Math.max(0, currentSubtotal - finalVoucherDiscount - finalPointsValue);
        // --- End Recalculation ---


        // --- Gather Order Data for API ---
        const orderData = {
            // orderId will be generated by backend
            items: this.cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price // Send price paid for verification
            })),
            addressId: this.cartAddressSelect?.value,
            phoneNumber: this.cartPhoneNumber?.value.trim(), // Send trimmed phone
            paymentMethod: selectedPaymentMethod?.value,
            voucherCode: this.appliedVoucher ? this.appliedVoucher.code : null,
            pointsUsed: finalPointsUsed,
            // Optional: Send client-calculated totals for cross-checking by backend
            // clientSubtotal: currentSubtotal,
            // clientVoucherDiscount: finalVoucherDiscount,
            // clientPointsDiscount: finalPointsValue,
            // clientTotal: finalTotal
        };

        try {
            const response = await this._submitOrderAPI(orderData); // --- BACKEND CALL ---

            if (response.success && response.orderId) {
                this._addNotification(`Đặt hàng #${response.orderId} thành công!`, 'success');
                alert(response.message || "Đặt hàng thành công!");

                // Add the new order to the local history (for immediate display)
                const newOrderEntry = {
                   id: response.orderId, // Use the ID from the API response
                   date: new Date().toLocaleDateString('vi-VN'), // Current date
                   // Get first product name, add ellipsis if multiple items
                   mainProduct: this.cartItems[0]?.name + (this.cartItems.length > 1 ? '...' : ''),
                   total: finalTotal, // Use the final calculated total
                   status: 'processing', // Initial status
                   statusClass: 'status-processing' // CSS class for status
                };
                this.productOrders.unshift(newOrderEntry); // Add to the beginning of the array


                // --- Clear Local Cart State AFTER successful order ---
                this.cartItems = [];
                this.appliedVoucher = null;
                this.pointsUsed = 0;
                this.pointsValue = 0;
                if (this.applyPointsCheckbox) this.applyPointsCheckbox.checked = false;
                if (this.cartAddressSelect) this.cartAddressSelect.value = ''; // Reset address selection
                if (this.cartPhoneNumber) this.cartPhoneNumber.value = ''; // Clear phone number
                if (this.cartVoucherInput) this.cartVoucherInput.value = ''; // Clear voucher input
                if (this.voucherMessage) this.voucherMessage.textContent = ''; // Clear voucher message
                const codRadio = this.cartSection?.querySelector('#paymentCOD');
                if (codRadio) codRadio.checked = true; // Default payment back to COD

                // --- BACKEND INTEGRATION: Update user points locally if used, or refetch ---
                if (finalPointsUsed > 0) {
                    this.userPoints -= finalPointsUsed; // Simulate update
                    // Optionally: this.userPoints = await this._fetchUserPointsAPI();
                }

                this._renderCartSection(); // Update UI to show empty cart
                this._updateCartBadge(); // Update badge to 0
                this._setActiveSection('order-history'); // Navigate to order history

            } else {
                // Throw error if success is false or orderId is missing
                throw new Error(response.message || "Đặt hàng không thành công. Thiếu ID đơn hàng.");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            this._addNotification(`Lỗi đặt hàng: ${error.message}`, 'error');
            alert(`Đã xảy ra lỗi khi đặt hàng: ${error.message}`);
            // Don't clear cart on error
        } finally {
            this._hideLoading();
            // Reset checkout button state - re-enable only if cart *still* has items (e.g., error occurred)
            this.checkoutButton.disabled = (this.cartItems.length === 0);
            this.checkoutButton.innerHTML = '<i class="fas fa-check-circle"></i> Đặt hàng';
        }
    }


    // =========================================================================
    // Account Section Functionality
    // =========================================================================

    async _addAddressAPI(addressData) {
        console.log("API CALL (SIMULATED): Adding new address...", addressData);
        // --- TODO: Replace with actual fetch() POST ---
        await new Promise(resolve => setTimeout(resolve, 600));
        // Simulate backend generating ID and adding data
        const newId = `addr-${Date.now()}`;
        const fullAddressText = `${addressData.street}, ${addressData.ward}, ${addressData.district}, ${addressData.city}`;
        const response = {
            success: true,
            newAddress: {
                id: newId,
                ...addressData, // name, phone, street, ward, district, city
                text: `${fullAddressText} ${addressData.isDefault ? '(Mặc định)' : ''}`, // Generate display text
                isDefault: !!addressData.isDefault // Ensure boolean
            }
        };
        console.log("API RESPONSE (SIMULATED): Address added.", response);
        return response;
    }

    async _setDefaultAddressAPI(addressId) {
        console.log(`API CALL (SIMULATED): Setting address ${addressId} as default...`);
        // --- TODO: Replace with actual fetch() PUT/POST ---
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`API RESPONSE (SIMULATED): Address ${addressId} set as default.`);
        return { success: true };
    }

    async _deleteAddressAPI(addressId) {
        console.log(`API CALL (SIMULATED): Deleting address ${addressId}...`);
        // --- TODO: Replace with actual fetch() DELETE ---
        await new Promise(resolve => setTimeout(resolve, 400));
        console.log(`API RESPONSE (SIMULATED): Address ${addressId} deleted.`);
        return { success: true };
    }


    _updateUserNameDisplay(newName) {
        // Update header dropdown name
        const userMenuName = this.userDropdown?.querySelector('.user-name');
        if (userMenuName) {
            userMenuName.textContent = newName;
        }
        // Update overview welcome message
        const welcomeMsg = this.overviewSection?.querySelector('.welcome-message');
        if (welcomeMsg) {
            // Extract the greeting part if needed, or replace whole string
            welcomeMsg.textContent = `Chào mừng trở lại, ${newName}!`;
        }
         // Update name input in the profile form itself
         const accNameInput = this.personalInfoForm?.querySelector('#accName');
         if (accNameInput) {
             accNameInput.value = newName;
         }
    }

    _renderAddressList() {
        if (!this.addressListContainer) return;

        this.addressListContainer.innerHTML = ''; // Clear existing list

        // --- BACKEND INTEGRATION: Use this.userAddresses fetched from API ---
        if (this.userAddresses.length === 0) {
            this.addressListContainer.innerHTML = '<p>Bạn chưa có địa chỉ nào được lưu.</p>';
            return;
        }

        this.userAddresses.forEach(addr => {
            const item = document.createElement('div');
            item.className = `address-item ${addr.isDefault ? 'default' : ''}`;
            item.dataset.addressId = addr.id; // Set ID for actions
            item.innerHTML = `
                <p>
                    <strong>${addr.name || 'Không tên'}</strong> ${addr.isDefault ? '<span class="badge badge-success">Mặc định</span>' : ''}<br>
                    ${addr.phone || 'Không có SĐT'}<br>
                    ${addr.street || ''}, ${addr.ward || ''}, ${addr.district || ''}, ${addr.city || ''}
                </p>
                <div class="address-actions">
                    <button class="btn btn-sm btn-outline btn-edit-address" title="Sửa địa chỉ này">Sửa</button>
                    <button class="btn btn-sm btn-danger btn-delete-address" title="Xóa địa chỉ này">Xóa</button>
                    ${!addr.isDefault ? `<button class="btn btn-sm btn-secondary btn-set-default-address" title="Đặt địa chỉ này làm mặc định">Đặt mặc định</button>` : ''}
                </div>
            `;
            this.addressListContainer.appendChild(item);
        });
    }

    async _handleAddressListActionClick(event) {
        const target = event.target;
        const addressItem = target.closest('.address-item');
        if (!addressItem) return; // Click wasn't inside an address item

        const addressId = addressItem.dataset.addressId;

        if (target.matches('.btn-edit-address')) {
            event.preventDefault();
            // --- TODO: Implement Edit Address Modal/Form ---
            console.log(`Edit address: ${addressId} (Functionality not implemented)`);
            alert("Chức năng sửa địa chỉ chưa được hoàn thiện.");
            // 1. Get address data (find in this.userAddresses by ID)
            // 2. Populate the edit modal/form with this data
            // 3. Open the edit modal

        } else if (target.matches('.btn-delete-address')) {
            event.preventDefault();
            if (confirm(`Bạn có chắc chắn muốn xóa địa chỉ này không?`)) {
                target.disabled = true;
                target.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
                try {
                    await this._deleteAddressAPI(addressId); // --- BACKEND CALL ---
                    // Update local state on success
                    this.userAddresses = this.userAddresses.filter(addr => addr.id !== addressId);
                    this._renderAddressList(); // Re-render the list in Account
                    this._populateAddressOptions(); // Update the dropdown in Cart
                    this._addNotification("Đã xóa địa chỉ.", "success");
                } catch (error) {
                    this._addNotification(`Lỗi xóa địa chỉ: ${error.message}`, "error");
                    target.disabled = false;
                    target.innerHTML = `Xóa`; // Restore button text
                }
            }
        } else if (target.matches('.btn-set-default-address')) {
            event.preventDefault();
            target.disabled = true;
            target.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            try {
                await this._setDefaultAddressAPI(addressId); // --- BACKEND CALL ---
                // Update local state on success
                this.userAddresses.forEach(addr => {
                    addr.isDefault = (addr.id === addressId);
                    // Update the 'text' property if it includes '(Mặc định)' - slightly complex
                    // This might be better handled by re-fetching addresses or having API return updated list
                });
                this._renderAddressList(); // Re-render Account list
                this._populateAddressOptions(); // Update Cart dropdown
                this._addNotification("Đã đặt địa chỉ làm mặc định.", "success");
            } catch (error) {
                this._addNotification(`Lỗi đặt mặc định: ${error.message}`, "error");
                target.disabled = false;
                target.innerHTML = `Đặt mặc định`; // Restore button text
            }
        }
    }

    // --- Post-submission helpers ---
     _addServiceRequestToHistory(formElement) {
        const formData = new FormData(formElement);
        const newRequestEntry = {
            id: `S-${Date.now()}`, // --- BACKEND INTEGRATION: Use real ID from API response ---
            date: new Date().toLocaleDateString('vi-VN'),
            type: formData.get('serviceType') || 'Khác',
            title: formData.get('requestTitle') || 'Không có tiêu đề',
            status: 'processing', // Initial status
            statusClass: 'status-processing'
        };
        this.serviceRequests.unshift(newRequestEntry); // Add to local state
        // Optionally refresh the order history view if it's active
        if (this.orderHistorySection?.classList.contains('active')) {
             this._renderOrderHistoryTables();
        }
     }

    _updateUserProfileDisplay(formElement) {
        const formData = new FormData(formElement);
        const newName = formData.get('accName');
        if (newName) {
            this._updateUserNameDisplay(newName); // Update header/welcome message
        }
        // Update other displayed info if necessary (e.g., email, phone in header?)
    }

     _handleNewAddressAdded(newAddressData) {
         // If the new address is set as default, unset the default flag on all other addresses
         if (newAddressData.isDefault) {
             this.userAddresses.forEach(addr => { addr.isDefault = false; });
         }
         // Add the new address to the local state
         this.userAddresses.push(newAddressData);
         // Re-render the address list in the Account section
         this._renderAddressList();
         // Update the address dropdown options in the Cart section
         this._populateAddressOptions();
         // (Modal closing is handled in _setupFormSubmission)
     }

    _validatePasswordConfirmation() {
         if (this.passwordMatchErrorAcc && this.newPasswordInput && this.confirmNewPasswordInput) {
             const newPassword = this.newPasswordInput.value;
             const confirmPassword = this.confirmNewPasswordInput.value;
             const match = (newPassword === confirmPassword);
             const confirmIsNotEmpty = confirmPassword !== '';

             // Show error only if confirm input is not empty and passwords don't match
             this.passwordMatchErrorAcc.style.display = (confirmIsNotEmpty && !match) ? 'block' : 'none';

             // Apply red border based on mismatch when confirm input is not empty
             this.confirmNewPasswordInput.style.borderColor = (confirmIsNotEmpty && !match) ? 'var(--danger-color)' : '';
             // Apply red border to new password input *only* if confirm is also filled and mismatching
             this.newPasswordInput.style.borderColor = (confirmIsNotEmpty && !match) ? 'var(--danger-color)' : '';
         }
     }

    // =========================================================================
    // Wishlist Functionality (Backend Interaction)
    // =========================================================================

    async _fetchWishlistAPI() {
        console.log("API CALL (SIMULATED): Fetching wishlist...");
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 400));
        const mockWishlist = [ // Simulate initial items
            { id: 'GP-AC-01', name: 'Chuột không dây GadgetPro Z1 Silent', price: 950000, imageSrc: 'https://via.placeholder.com/120x120.png/fdcb6e/2d3436?text=Mouse+GP' },
            { id: 'NT-CP-01', name: 'SSD NovaTech Speedster 2TB NVMe', price: 4800000, imageSrc: 'https://via.placeholder.com/120x120.png/a29bfe/ffffff?text=SSD+NT' }
        ];
        console.log("API RESPONSE (SIMULATED): Received wishlist.");
        return mockWishlist;
    }

    async _updateServerWishlistAPI(productId, add = true) {
        const action = add ? 'Adding' : 'Removing';
        console.log(`API CALL (SIMULATED): ${action} product ${productId} ${add ? 'to' : 'from'} wishlist...`);
        // --- TODO: Replace with actual fetch() (POST for add, DELETE for remove?) ---
        await new Promise(resolve => setTimeout(resolve, 400));
        console.log(`API RESPONSE (SIMULATED): Wishlist updated on server for product ${productId}.`);
        return { success: true }; // Simulate success
    }

    _renderWishlist() {
        if (!this.wishlistGrid || !this.emptyWishlistMessage) return;

        this.wishlistGrid.innerHTML = ''; // Clear previous items

        if (this.wishlistItems.length === 0) {
            this.emptyWishlistMessage.style.display = 'block';
            this.wishlistGrid.style.display = 'none';
        } else {
            this.emptyWishlistMessage.style.display = 'none';
            this.wishlistGrid.style.display = 'grid'; // Ensure grid display

            this.wishlistItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'wishlist-item';
                itemElement.dataset.productId = item.id;
                itemElement.dataset.price = item.price; // For _getProductDataFromElement
                itemElement.innerHTML = `
                    <img src="${item.imageSrc || 'https://via.placeholder.com/120x120.png?text=N/A'}" alt="${item.name || ''}">
                    <h4>${item.name || 'Sản phẩm'}</h4>
                    <p class="price">${this._formatCurrency(item.price)}</p>
                    <div class="wishlist-item-actions">
                      <button class="btn btn-primary btn-sm btn-add-cart" title="Thêm vào giỏ hàng"><i class="fas fa-cart-plus"></i> Thêm giỏ</button>
                      <button class="btn btn-danger btn-sm wishlist-remove-btn" title="Xóa khỏi danh sách yêu thích"><i class="fas fa-trash"></i> Xóa</button>
                    </div>`;
                this.wishlistGrid.appendChild(itemElement);
            });
        }

        // --- Update Wishlist Buttons Everywhere After Rendering ---
        // Find all wishlist buttons on the page and update their state based on the current wishlistItems
         document.querySelectorAll('.wishlist-btn, .wishlist-btn-detail').forEach(button => {
             const productId = button.dataset.productId;
             if (productId) {
                 const isInWishlist = this.wishlistItems.some(wItem => wItem.id === productId);
                 this._updateWishlistButtonState(productId, isInWishlist);
             }
         });
    }

    async _addToWishlist(itemData) {
        if (!itemData || !itemData.id) {
            console.error("Invalid item data for add to wishlist:", itemData);
            return;
        }
        // Prevent adding if already exists locally
        if (this.wishlistItems.some(item => item.id === itemData.id)) {
             console.log(`Item ${itemData.id} already in wishlist.`);
             return;
        }

        // --- Optimistic UI Update ---
        this.wishlistItems.push({ ...itemData }); // Add locally
        if (this.wishlistGrid?.closest('.dashboard-section')?.classList.contains('active')) {
            this._renderWishlist(); // Re-render if wishlist section is active
        }
        this._updateWishlistButtonState(itemData.id, true); // Update buttons everywhere
        // --- End Optimistic ---

        try {
            const response = await this._updateServerWishlistAPI(itemData.id, true); // --- BACKEND CALL ---
            if (!response.success) {
                throw new Error("Failed to add item to wishlist on server.");
            }
            console.log(`Item ${itemData.id} added to wishlist on server.`);
            this._addNotification(`Đã thêm "${itemData.name}" vào Yêu thích.`, 'info');
            // --- Optional: Re-fetch wishlist to ensure sync after success ---
            // this.wishlistItems = await this._fetchWishlistAPI();
            // this._renderWishlist(); // Render again if fetched
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            this._addNotification(`Lỗi thêm vào Yêu thích: ${error.message}`, 'error');
            // --- Revert Optimistic Update ---
            this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemData.id);
            if (this.wishlistGrid?.closest('.dashboard-section')?.classList.contains('active')) {
               this._renderWishlist(); // Re-render if needed
            }
            this._updateWishlistButtonState(itemData.id, false); // Revert button state
            // --- End Revert ---
        }
    }

    async _removeFromWishlist(productId) {
        const itemToRemove = this.wishlistItems.find(item => item.id === productId);
        if (!itemToRemove) {
            console.log(`Item ${productId} not found in local wishlist.`);
            return; // Not in local list
        }

        // --- Optimistic UI Update ---
        const originalWishlist = [...this.wishlistItems]; // Backup for revert
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
        if (this.wishlistGrid?.closest('.dashboard-section')?.classList.contains('active')) {
            this._renderWishlist(); // Re-render if active
        }
        this._updateWishlistButtonState(productId, false); // Update buttons
        // --- End Optimistic ---

        try {
            const response = await this._updateServerWishlistAPI(productId, false); // --- BACKEND CALL ---
            if (!response.success) {
                throw new Error("Failed to remove item from wishlist on server.");
            }
            console.log(`Item ${productId} removed from wishlist on server.`);
            this._addNotification(`Đã xóa "${itemToRemove.name}" khỏi Yêu thích.`);
            // --- Optional: Re-fetch wishlist ---
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            this._addNotification(`Lỗi xóa khỏi Yêu thích: ${error.message}`, 'error');
            // --- Revert Optimistic Update ---
            this.wishlistItems = originalWishlist; // Restore original list
            if (this.wishlistGrid?.closest('.dashboard-section')?.classList.contains('active')) {
               this._renderWishlist(); // Re-render if needed
            }
            this._updateWishlistButtonState(productId, true); // Revert button state
            // --- End Revert ---
        }
    }

    _updateWishlistButtonState(productId, isWishlisted) {
        // Update all buttons matching the product ID (in store, detail modal, etc.)
        const allWishlistButtons = document.querySelectorAll(`.wishlist-btn[data-product-id="${productId}"], .wishlist-btn-detail[data-product-id="${productId}"]`);

        allWishlistButtons.forEach(button => {
            button.classList.toggle('active', isWishlisted);
            const iconClass = isWishlisted ? 'fas fa-heart' : 'far fa-heart'; // Solid vs Regular heart

            if (button.classList.contains('wishlist-btn-detail')) { // Detail modal button has text
                button.innerHTML = `<i class="${iconClass}"></i> ${isWishlisted ? 'Đã thích' : 'Yêu thích'}`;
            } else { // Grid/list buttons usually only have icon
                button.innerHTML = `<i class="${iconClass}"></i>`;
                button.title = isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích";
            }
        });
    }


    // =========================================================================
    // Contact & Feedback Section (Backend Interaction)
    // =========================================================================

    async _fetchFeedbackAPI() {
        console.log("API CALL (SIMULATED): Fetching shop feedback...");
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 600));
        const mockFeedback = [
            { reqId: 'S456', reqTitle: 'Tư vấn lắp đặt mạng', response: 'Chào bạn, bộ phận kỹ thuật đã tiếp nhận yêu cầu #S456...', date: '21/10/2023', status: 'replied', isRead: false },
            { reqId: 'Hỗ trợ SP #P789', reqTitle: 'Hỏi về tình trạng đơn hàng', response: 'Đơn hàng #P789 của bạn hiện đang trên đường vận chuyển...', date: '20/10/2023', status: 'replied', isRead: true},
            { reqId: 'S112', reqTitle: 'Sửa laptop không lên nguồn', response: 'Yêu cầu #S112 đã hoàn thành...', date: '10/10/2023', status: 'completed_replied', isRead: true}
        ];
        console.log("API RESPONSE (SIMULATED): Received feedback.");
        return mockFeedback;
    }

    async _markFeedbackReadAPI(feedbackOrReqId) {
        console.log(`API CALL (SIMULATED): Marking feedback as read for ID: ${feedbackOrReqId}...`);
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("API RESPONSE (SIMULATED): Feedback marked as read on server.");
        return true; // Simulate success
    }

    async _renderShopFeedback() {
        if (!this.shopFeedbackListContainer) return;

        this.shopFeedbackListContainer.innerHTML = '<p>Đang tải phản hồi...</p>'; // Loading state

        try {
            const feedbackData = await this._fetchFeedbackAPI(); // --- BACKEND CALL ---

            if (!feedbackData || feedbackData.length === 0) {
                this.shopFeedbackListContainer.innerHTML = '<p class="empty-feedback">Chưa có phản hồi mới từ cửa hàng.</p>';
            } else {
                this.shopFeedbackListContainer.innerHTML = ''; // Clear loading/previous
                feedbackData.forEach(fb => {
                    const feedbackItem = document.createElement('div');
                    // Add class based on read status
                    feedbackItem.className = `feedback-item ${fb.isRead ? 'read' : 'unread'}`;
                    // Store ID for actions
                    feedbackItem.dataset.feedbackId = fb.reqId; // Assuming reqId is unique identifier
                    feedbackItem.innerHTML = `
                        <div class="feedback-header">
                          <span class="feedback-req">Về yêu cầu: <strong>${fb.reqTitle} (${fb.reqId})</strong></span>
                          <span class="feedback-date"><i class="far fa-clock"></i> ${fb.date}</span>
                        </div>
                        <p class="feedback-content">${fb.response}</p>
                        <div class="feedback-actions">
                          <button class="btn btn-sm btn-link-style view-request-details" data-request-id="${fb.reqId}">Xem chi tiết yêu cầu</button>
                          <button class="btn btn-sm btn-outline mark-feedback-read" ${fb.isRead ? 'disabled' : ''}>
                            ${fb.isRead ? 'Đã đọc' : 'Đánh dấu đã đọc'}
                          </button>
                        </div>`;
                    this.shopFeedbackListContainer.appendChild(feedbackItem);
                });
                 // Ensure event listener is attached (only once)
                 this._attachActionListeners(); // This now includes the feedback listener check
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
            this.shopFeedbackListContainer.innerHTML = '<p class="empty-feedback error">Lỗi tải phản hồi từ cửa hàng.</p>';
        }
    }

    async _handleFeedbackActionClick(event) {
        const target = event.target;
        const feedbackItem = target.closest('.feedback-item');
        if (!feedbackItem) return;

        const feedbackId = feedbackItem.dataset.feedbackId; // ID of the feedback/request

        if (target.matches('.view-request-details')) {
            event.preventDefault();
            const requestId = target.dataset.requestId;
            console.log(`Navigate to details for request: ${requestId}`);
            const orderType = requestId.startsWith('S') ? 'service' : 'product';

            // Navigate to order history section
            this._setActiveSection('order-history');

            // Delay showing modal slightly to allow section switch
            setTimeout(() => {
                this._activateOrderHistoryTab(orderType); // Ensure correct tab is active
                this._showOrderDetailModal(requestId, orderType); // Fetch and show details
            }, 350);

        } else if (target.matches('.mark-feedback-read') && !target.disabled) {
            event.preventDefault();
            console.log(`Marking feedback ${feedbackId} as read`);
            target.disabled = true;
            target.textContent = 'Đang xử lý...';

            try {
                await this._markFeedbackReadAPI(feedbackId); // --- BACKEND CALL ---
                // Update UI on success
                feedbackItem.classList.remove('unread');
                feedbackItem.classList.add('read');
                target.textContent = 'Đã đọc';
                this._addNotification(`Đã đánh dấu phản hồi cho "${feedbackId}" là đã đọc.`);
                // Optionally update a global notification state if feedback counts towards it
            } catch (error) {
                console.error("Failed to mark feedback read:", error);
                this._addNotification("Lỗi: Không thể đánh dấu đã đọc.", "error");
                target.disabled = false; // Re-enable button on error
                target.textContent = 'Đánh dấu đã đọc';
            }
        }
    }


    // =========================================================================
    // Detail Modal Functionality (Backend Interaction)
    // =========================================================================

    async _fetchProductDetailsAPI(productId) {
        console.log(`API CALL (SIMULATED): Fetching details for product ID: ${productId}...`);
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 600));

        // Try to get base data from existing elements first (like original logic)
        const baseProductData = this._getProductDataFromElement(
            document.querySelector(`.product-card[data-product-id="${productId}"], .product-list-item[data-product-id="${productId}"]`)
        ) || { id: productId, name: 'Sản phẩm không tìm thấy', price: 0, imageSrc: null };

        // Simulate enriching data from API
        if (baseProductData.name !== 'Sản phẩm không tìm thấy') {
            baseProductData.description = `Đây là mô tả chi tiết (lấy từ API) cho ${baseProductData.name}. Sản phẩm này có những đặc tính tuyệt vời... Lorem ipsum dolor sit amet.`;
            baseProductData.specs = [
                { key: 'CPU', value: 'Core i9 Gen 13th (API)' },
                { key: 'RAM', value: '32GB DDR5 (API)' },
                { key: 'Ổ cứng', value: '1TB PCIe Gen4 NVMe SSD (API)' },
                { key: 'Màn hình', value: '16 inch QHD+ 165Hz (API)' }
            ];
            baseProductData.images = [
                baseProductData.imageSrc || 'https://via.placeholder.com/400x300.png?text=Image+1',
                'https://via.placeholder.com/400x300.png?text=Image+2',
                'https://via.placeholder.com/400x300.png?text=Image+3'
            ];
            // Keep existing ratingHTML if found by _getProductDataFromElement
             if (!baseProductData.ratingHTML) {
                 baseProductData.ratingHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i>'; // Default if none
             }
        }

        console.log(`API RESPONSE (SIMULATED): Received details for product ${productId}.`);
        return baseProductData;
    }

    async _fetchOrderDetailsAPI(orderId, orderType) {
        console.log(`API CALL (SIMULATED): Fetching details for ${orderType} order ID: ${orderId}...`);
        // --- TODO: Replace with actual fetch() ---
        await new Promise(resolve => setTimeout(resolve, 700));

        // --- Simulate API Response based on orderId and type ---
         const baseOrder = (orderType === 'product' ? this.productOrders : this.serviceRequests).find(o => o.id === orderId);
         let mockData = {
             orderId: orderId,
             date: baseOrder?.date || new Date().toLocaleDateString('vi-VN'),
             status: baseOrder?.status || "Không rõ",
             statusClass: baseOrder?.statusClass || "status-pending",
         };

         if (orderType === 'product' && baseOrder) {
             let items = [], shippingAddress = "123 Đường ABC, Phường XYZ, Quận LMN, TP. HCM (API)", shippingFee = 0, total=baseOrder.total, trackingCode=null, paymentMethod = "Thanh toán khi nhận hàng (COD)";
             // Simulate items based on order ID
             if (orderId === 'P789') {
                 items = [{ id: 'LP-ABC-X', name: 'Laptop Gaming ABC Model X (Chi tiết API)', quantity: 1, price: 25500000, imageSrc: 'https://via.placeholder.com/80x80.png?text=Laptop' }];
                 shippingFee = 35000;
                 trackingCode = 'GHNXYZ12345';
                 paymentMethod = "Chuyển khoản ngân hàng";
             } else if (orderId === 'P123') {
                 items = [{ id: 'DT-XYZ-PRO', name: 'Điện thoại XYZ Pro 256GB (Chi tiết API)', quantity: 1, price: 18000000, imageSrc: 'https://via.placeholder.com/80x80.png?text=Phone' }];
                 shippingFee = 0; // Freeship maybe
             } else if (orderId === 'P098') {
                 items = [{ id: 'TN-Z-GAM', name: 'Tai nghe Bluetooth Z Gaming (Chi tiết API)', quantity: 1, price: 1200000, imageSrc: 'https://via.placeholder.com/80x80.png?text=Headset' }];
             }
             const subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);
             // Recalculate total based on fetched items/fees (backend should provide definitive total)
             total = subtotal + shippingFee;
             mockData = { ...mockData, items, shippingAddress, shippingFee, paymentMethod, trackingCode, subtotal, total };

         } else if (orderType === 'service' && baseOrder) {
             let serviceType = baseOrder.type, title = baseOrder.title, description = "Mô tả chi tiết yêu cầu dịch vụ lấy từ API...", progressSteps = [], chatLog = [], attachedFiles = [];
             if(orderId === 'S456'){
                 description = "Cần tư vấn giải pháp mạng wifi cho văn phòng 3 tầng, diện tích mỗi tầng 100m2. Ưu tiên ổn định và bảo mật.";
                 progressSteps = [ { name: 'Tiếp nhận', status: 'completed'}, { name: 'Liên hệ tư vấn', status: 'completed'}, { name: 'Chờ phản hồi KH', status: 'active'}, { name: 'Lên giải pháp', status: ''}, { name: 'Hoàn thành', status: ''} ];
                 chatLog = [{ sender: 'Hỗ trợ viên', message: 'Đã tiếp nhận, sẽ liên hệ sớm.' }, { sender: 'Bạn', message: 'Ok cảm ơn.'} ];
                 attachedFiles = ['so_do_van_phong.pdf'];
             }
             else if (orderId === 'S112') {
                 description = "Laptop Dell XPS 13 không lên nguồn sau khi cắm sạc qua đêm.";
                 progressSteps = [ { name: 'Tiếp nhận', status: 'completed'}, { name: 'Kiểm tra', status: 'completed'}, { name: 'Báo giá', status: 'completed'}, { name: 'Sửa chữa', status: 'completed'}, { name: 'Hoàn thành', status: 'completed'} ];
                 chatLog = [{ sender: 'Kỹ thuật viên', message: 'Đã sửa xong, mời bạn qua nhận.' }];
             }
             mockData = { ...mockData, serviceType, title, description, attachedFiles, progressSteps, chatLog };
         } else {
            // Handle case where baseOrder is not found
            mockData.status = "Không tìm thấy";
            mockData.statusClass = "status-cancelled";
         }

        console.log(`API RESPONSE (SIMULATED): Received details for order ${orderId}.`);
        return mockData;
    }

    async _showProductDetailModal(productId) {
        if (!this.detailModal || !this.detailModalContent) return;

        this.detailModalContent.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Đang tải chi tiết sản phẩm...</p>';
        this._openModal(this.detailModal); // Open modal first

        try {
            // Don't necessarily need global loading indicator here, modal has its own
            const productData = await this._fetchProductDetailsAPI(productId); // --- BACKEND CALL ---

            if (!productData || productData.name === 'Sản phẩm không tìm thấy') {
                this.detailModalContent.innerHTML = `
                    <h3>Sản phẩm không tồn tại</h3>
                    <p>Không tìm thấy thông tin chi tiết cho sản phẩm với ID: ${productId}</p>`;
                return;
            }

            // Check wishlist status *after* fetching data
            const isCurrentlyWishlisted = this.wishlistItems.some(item => item.id === productId);

            // --- Build Modal Content ---
            // Gallery (simple for now, could be a carousel)
            let galleryHTML = `<div class="main-image"><img src="${productData.images?.[0] || productData.imageSrc || 'https://via.placeholder.com/400x300.png?text=N/A'}" alt="${productData.name}"></div>`;
            if (productData.images && productData.images.length > 1) {
                 galleryHTML += `<div class="thumbnail-images">${productData.images.map((imgSrc, index) => `<img src="${imgSrc}" alt="Thumbnail ${index+1}" class="${index === 0 ? 'active' : ''}">`).join('')}</div>`;
            }

            // Specs list
            let specsHTML = (productData.specs && productData.specs.length > 0)
                ? `<ul>${productData.specs.map(s => `<li><strong>${s.key}:</strong> <span>${s.value}</span></li>`).join('')}</ul>`
                : '<li>Không có thông số kỹ thuật chi tiết.</li>';

            // Assemble final modal HTML
            this.detailModalContent.innerHTML = `
                <h3 data-product-id="${productId}">${productData.name}</h3>
                <div class="product-detail-layout">
                  <div class="product-detail-gallery">
                     ${galleryHTML}
                  </div>
                  <div class="product-detail-info">
                    <a href="#" class="product-category-link">${productData.category || 'Chưa phân loại'}</a>
                    <div class="rating">${productData.ratingHTML || '<span class="text-muted">Chưa có đánh giá</span>'}</div>
                    <p class="price">${this._formatCurrency(productData.price)}</p>
                    <p class="product-detail-description">${productData.description || 'Không có mô tả.'}</p>
                    <div class="product-detail-actions">
                      <button class="btn btn-primary btn-add-cart-detail" data-product-id="${productId}">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                      </button>
                      <button class="btn btn-outline wishlist-btn-detail ${isCurrentlyWishlisted ? 'active' : ''}" data-product-id="${productId}">
                        <i class="${isCurrentlyWishlisted ? 'fas' : 'far'} fa-heart"></i> ${isCurrentlyWishlisted ? 'Đã thích' : 'Yêu thích'}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="product-detail-specs">
                  <h4>Thông số kỹ thuật</h4>
                  ${specsHTML}
                </div>`;

            // --- Add event listener for thumbnail clicks (if gallery exists) ---
            const gallery = this.detailModalContent.querySelector('.product-detail-gallery');
            if (gallery) {
                 gallery.addEventListener('click', (e) => {
                     if (e.target.matches('.thumbnail-images img')) {
                         const mainImage = gallery.querySelector('.main-image img');
                         const thumbnails = gallery.querySelectorAll('.thumbnail-images img');
                         if(mainImage) mainImage.src = e.target.src;
                         thumbnails.forEach(thumb => thumb.classList.remove('active'));
                         e.target.classList.add('active');
                     }
                 });
            }

        } catch (error) {
            console.error("Error fetching product details:", error);
            this.detailModalContent.innerHTML = `
                <h3>Lỗi</h3>
                <p>Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.</p>
                <p><i>${error.message}</i></p>`;
        } finally {
            // Optional: this._hideLoading(); if global loading was used
        }
    }

    async _showOrderDetailModal(orderId, orderType) {
        if (!this.detailModal || !this.detailModalContent) return;

        this.detailModalContent.innerHTML = `<p><i class="fas fa-spinner fa-spin"></i> Đang tải chi tiết ${orderType === 'product' ? 'đơn hàng' : 'yêu cầu'}...</p>`;
        this._openModal(this.detailModal);

        try {
            // this._showLoading(); // Optional global loading
            const orderData = await this._fetchOrderDetailsAPI(orderId, orderType); // --- BACKEND CALL ---

            let detailHTML = `<p>Lỗi: Không thể tải chi tiết ${orderType === 'product' ? 'đơn hàng' : 'yêu cầu'} #${orderId}.</p>`; // Default error

            if (!orderData || orderData.status === "Không tìm thấy") {
                 detailHTML = `<h3>Không tìm thấy</h3><p>Không tìm thấy thông tin cho ${orderType === 'product' ? 'đơn hàng' : 'yêu cầu'} #${orderId}.</p>`;
            }
             else if (orderType === 'product' && orderData.items) { // Product Order Details
                detailHTML = `
                    <h3>Chi tiết Đơn hàng #${orderData.orderId}</h3>
                    <div class="order-detail-modal-grid">
                        <div class="order-detail-modal-section order-detail-header-info">
                           <h4>Thông tin chung</h4>
                           <p><strong>Ngày đặt:</strong> ${orderData.date}</p>
                           <p><strong>Trạng thái:</strong> <span class="status ${orderData.statusClass}">${orderData.status}</span></p>
                           <p><strong>Tổng tiền:</strong> ${this._formatCurrency(orderData.total)}</p>
                           ${orderData.trackingCode ? `<p><strong>Mã vận đơn:</strong> ${orderData.trackingCode} <a href="#" class="track-link">(Theo dõi)</a></p>` : ''}
                        </div>

                        <div class="order-detail-modal-section order-detail-shipping">
                           <h4>Thông tin nhận hàng</h4>
                           <p><strong>Địa chỉ:</strong> ${orderData.shippingAddress}</p>
                           <p><strong>Phương thức TT:</strong> ${orderData.paymentMethod}</p>
                        </div>

                        <div class="order-detail-modal-section order-detail-item-list">
                           <h4>Sản phẩm (${orderData.items.length})</h4>
                           ${orderData.items.length > 0
                               ? orderData.items.map(i => `
                                    <div class="order-detail-item">
                                        <img src="${i.imageSrc || 'https://via.placeholder.com/60x60.png?text=N/A'}" alt="${i.name || ''}">
                                        <div class="item-info">
                                            <span>${i.name || 'Sản phẩm'} (x${i.quantity})</span>
                                            <span>${this._formatCurrency(i.price)}</span>
                                        </div>
                                    </div>`).join('')
                               : '<p>Không có thông tin sản phẩm.</p>'
                           }
                        </div>

                        <div class="order-detail-modal-section order-detail-totals">
                           <h4>Tổng cộng</h4>
                           <p><span>Tạm tính:</span> <span>${this._formatCurrency(orderData.subtotal)}</span></p>
                           <p><span>Phí vận chuyển:</span> <span>${this._formatCurrency(orderData.shippingFee)}</span></p>
                           <p><strong><span>Tổng thanh toán:</span> <strong>${this._formatCurrency(orderData.total)}</strong></strong></p>
                           <div class="order-detail-actions">
                             ${orderData.status !== 'cancelled' && orderData.status !== 'delivered' && orderData.status !== 'shipped' ? `<button class="btn btn-danger btn-sm btn-cancel-order" data-order-id="${orderData.orderId}">Hủy đơn</button>` : ''}
                             <button class="btn btn-primary btn-sm btn-buy-again" data-order-id="${orderData.orderId}">Mua lại</button>
                             <button class="btn btn-outline btn-sm btn-request-support" data-order-id="${orderData.orderId}">Yêu cầu hỗ trợ</button>
                           </div>
                        </div>
                    </div>`; // End grid
            } else if (orderType === 'service' && orderData.title) { // Service Request Details
                detailHTML = `
                    <h3>Chi tiết Yêu cầu Dịch vụ #${orderData.orderId}</h3>
                     <div class="order-detail-modal-grid service">
                        <div class="order-detail-modal-section order-detail-header-info">
                           <h4>Thông tin chung</h4>
                           <p><strong>Ngày gửi:</strong> ${orderData.date}</p>
                           <p><strong>Loại dịch vụ:</strong> ${orderData.serviceType}</p>
                           <p><strong>Trạng thái:</strong> <span class="status ${orderData.statusClass}">${orderData.status}</span></p>
                        </div>

                         <div class="order-detail-modal-section">
                           <h4>Chi tiết yêu cầu</h4>
                           <p><strong>Tiêu đề:</strong> ${orderData.title}</p>
                           <p><strong>Mô tả:</strong> ${orderData.description || '(Không có mô tả)'}</p>
                           ${orderData.attachedFiles?.length > 0 ? `<p><strong>Tệp đính kèm:</strong> ${orderData.attachedFiles.map(f => `<a href="#" title="Tải xuống ${f}">${f}</a>`).join(', ')}</p>` : ''}
                         </div>

                        <div class="order-detail-modal-section">
                           <h4>Tiến trình xử lý</h4>
                           ${(orderData.progressSteps && orderData.progressSteps.length > 0)
                                ? `<ul class="progress-tracker">${orderData.progressSteps.map(p => `<li class="${p.status || ''}" title="${p.timestamp || ''}">${p.name}</li>`).join('')}</ul>`
                                : '<p>Chưa có cập nhật tiến trình.</p>'
                           }
                        </div>

                         <div class="order-detail-modal-section">
                           <h4>Trao đổi với hỗ trợ</h4>
                           <div class="chat-mockup">
                             ${(orderData.chatLog && orderData.chatLog.length > 0)
                                 ? orderData.chatLog.map(c => `<p class="chat-message ${c.sender === 'Bạn' ? 'user' : 'agent'}"><strong>${c.sender}:</strong> ${c.message} <span class="chat-ts">${c.timestamp || ''}</span></p>`).join('')
                                 : '<p>Chưa có trao đổi.</p>'
                             }
                             <textarea placeholder="Nhập nội dung trả lời..." rows="2" class="chat-reply-input"></textarea>
                             <button class="btn btn-sm btn-primary chat-reply-send" data-request-id="${orderData.orderId}">Gửi tin nhắn</button>
                           </div>
                         </div>
                     </div>`; // End grid service
            }

            this.detailModalContent.innerHTML = detailHTML;

        } catch (error) {
            console.error("Error fetching order details:", error);
            this.detailModalContent.innerHTML = `
                <h3>Lỗi</h3>
                <p>Không thể tải chi tiết ${orderType === 'product' ? 'đơn hàng' : 'yêu cầu'}. Vui lòng thử lại sau.</p>
                <p><i>${error.message}</i></p>`;
        } finally {
            // this._hideLoading(); // Optional global loading
        }
    }

    // =========================================================================
    // Store Functionality (Filtering/Sorting/Pagination/Search - Backend Heavy)
    // =========================================================================

    async _fetchProductsAPI(filters) {
        console.log("API CALL (SIMULATED): Fetching products with filters:", filters);
        // --- TODO: Replace with actual fetch() ---
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
        let mockProducts = [];
        const itemsPerPage = 8; // Should match backend config
        // Simulate filtering based on some criteria for more realistic results
        const allPossibleProducts = 150; // Total potential products if no filters
        let filteredCount = 0;
        const potentialMatches = [];

        for(let i = 0; i< allPossibleProducts; i++){
            const price = Math.floor(Math.random() * 50000000);
             const rating = Math.floor(Math.random() * 5) + 1;
             const category = ['Laptop','Phone','Accessory','Component'][Math.floor(Math.random() * 4)];
             const brand = ['TechBrand', 'GadgetPro', 'NovaTech', 'ElecCore'][Math.floor(Math.random()*4)];
             const name = `${brand} ${category} Model ${String.fromCharCode(65+i%26)}${Math.floor(i/26)+1}`;

             // Apply mock filters
             let match = true;
             if (filters.category && filters.category !== 'all' && category.toLowerCase() !== filters.category.toLowerCase()) match = false;
             if (filters.brand && filters.brand !== 'all' && brand !== filters.brand) match = false;
             if (filters.maxPrice && price > filters.maxPrice) match = false;
             if (filters.rating && rating < filters.rating) match = false;
             if (filters.searchTerm && !name.toLowerCase().includes(filters.searchTerm.toLowerCase())) match = false;

             if(match){
                 potentialMatches.push({
                     id: `MOCK-P-${i}`, name, price, category, brand, rating,
                     imageSrc: `https://via.placeholder.com/300x200.png/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(name.slice(0,10))}`
                 });
             }
        }

        // Apply sorting (simple simulation)
        if (filters.sortBy === 'price-asc') potentialMatches.sort((a, b) => a.price - b.price);
        else if (filters.sortBy === 'price-desc') potentialMatches.sort((a, b) => b.price - a.price);
        else if (filters.sortBy === 'rating') potentialMatches.sort((a, b) => b.rating - a.rating);
        // 'newest' (default) doesn't need specific sorting in this mock

        const totalMockMatchingItems = potentialMatches.length;
        const totalPages = Math.ceil(totalMockMatchingItems / itemsPerPage);
        const startIndex = (filters.page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalMockMatchingItems);

        mockProducts = potentialMatches.slice(startIndex, endIndex).map(p => {
            const ratingStars = p.rating;
            const ratingHTML = Array(5).fill(0).map((_, k) => `<i class="${k < ratingStars ? 'fas' : 'far'} fa-star"></i>`).join('');
            const ratingCount = Math.floor(Math.random()*200)+10;
            return {
                id: p.id,
                name: p.name,
                price: p.price,
                imageSrc: p.imageSrc,
                imageThumb: p.imageSrc.replace('300x200', '200x200'), // Simple thumb simulation
                category: p.category,
                brand: p.brand,
                ratingHTML: ratingHTML,
                ratingCount: ratingCount,
                description: `Mô tả ngắn gọn lấy từ API cho ${p.name}. Phù hợp nhu cầu ${filters.searchTerm || 'chung'}.`
            };
        });


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

    _renderProductGrid(products) {
        if (!this.productGrid) return;
        this.productGrid.innerHTML = ''; // Clear previous

        if (!products || products.length === 0) {
            this.productGrid.innerHTML = '<p class="empty-section-msg">Không tìm thấy sản phẩm phù hợp.</p>';
            return;
        }

        let gridHTML = '';
        products.forEach(p => {
            const isFav = this.wishlistItems.some(w => w.id === p.id);
            gridHTML += `
                <div class="product-card" data-product-id="${p.id}" data-category="${p.category}" data-brand="${p.brand}">
                  <div class="product-image">
                    <img src="${p.imageSrc}" alt="${p.name}" loading="lazy">
                    <button class="wishlist-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}" data-product-id="${p.id}">
                      <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                  </div>
                  <div class="product-content">
                    <a href="#" class="product-category-link">${p.category}</a>
                    <h4><a href="#" class="product-name-link" data-product-id="${p.id}">${p.name}</a></h4>
                    <div class="rating">
                        ${p.ratingHTML || ''}<span class="rating-count">(${p.ratingCount || 0})</span>
                    </div>
                    <p class="price">${this._formatCurrency(p.price)}</p>
                  </div>
                  <div class="product-actions">
                    <button class="btn btn-primary btn-sm btn-add-cart" data-product-id="${p.id}">Thêm</button>
                    <button class="btn btn-outline btn-sm btn-view-detail" data-product-id="${p.id}">Chi tiết</button>
                  </div>
                </div>`;
        });
        this.productGrid.innerHTML = gridHTML;
    }

    _renderProductList(products) {
        if (!this.productList) return;
        this.productList.innerHTML = ''; // Clear previous

        if (!products || products.length === 0) {
            this.productList.innerHTML = '<p class="empty-section-msg">Không tìm thấy sản phẩm phù hợp.</p>';
            return;
        }

        let listHTML = '';
        products.forEach(p => {
            const isFav = this.wishlistItems.some(w => w.id === p.id);
            listHTML += `
                 <div class="product-list-item" data-product-id="${p.id}" data-category="${p.category}" data-brand="${p.brand}">
                   <div class="product-list-image">
                     <img src="${p.imageThumb || p.imageSrc}" alt="${p.name}" loading="lazy">
                      <button class="wishlist-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}" data-product-id="${p.id}">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                      </button>
                   </div>
                   <div class="product-list-content">
                     <h4><a href="#" class="product-name-link" data-product-id="${p.id}">${p.name}</a></h4>
                     <div class="rating">
                        ${p.ratingHTML || ''}<span class="rating-count">(${p.ratingCount || 0})</span>
                     </div>
                     <p class="description">${p.description || ''}</p>
                   </div>
                   <div class="product-list-actions">
                     <p class="price">${this._formatCurrency(p.price)}</p>
                     <button class="btn btn-primary btn-sm btn-add-cart" data-product-id="${p.id}">Thêm</button>
                     <button class="btn btn-outline btn-sm btn-view-detail" data-product-id="${p.id}">Chi tiết</button>
                   </div>
                 </div>`;
        });
        this.productList.innerHTML = listHTML;
    }

    async _applyFilters() {
        if (!this.storeSection) return;
        console.log('Applying Filters/Search:', this.currentFilters);
        this._showLoading(); // Show loading overlay for store

        try {
            // Fetch products from backend based on current filter state
            const response = await this._fetchProductsAPI(this.currentFilters); // --- BACKEND CALL ---
            const { products, pagination } = response;

            // Render products based on the current view mode
            if (this.currentFilters.view === 'grid') {
                this._renderProductGrid(products);
            } else {
                this._renderProductList(products);
            }

            // Update UI elements like pagination and results count
            this._updatePaginationUI(pagination);
            this._updateStoreResultsCount(pagination, products.length);

        } catch (error) {
            console.error("Error fetching products:", error);
            // Display error message in the product area
            const errorHTML = `<p class="empty-section-msg error">Lỗi tải sản phẩm. Vui lòng thử lại sau. <br><i>${error.message}</i></p>`;
            if (this.productGrid) this.productGrid.innerHTML = errorHTML;
            if (this.productList) this.productList.innerHTML = errorHTML;
            // Reset pagination/results count on error
            this._updatePaginationUI({ currentPage: 1, totalPages: 0, totalItems: 0 });
            this._updateStoreResultsCount({ totalItems: 0, itemsPerPage: 8, currentPage: 1 }, 0);
        } finally {
            this._hideLoading();
        }
    }

    _updatePaginationUI(paginationData) {
        if (!this.paginationContainer || !paginationData) {
             if (this.paginationContainer) this.paginationContainer.innerHTML = ''; // Clear if no data
             return;
         }
        const { currentPage, totalPages } = paginationData;

         if (totalPages <= 1) { // Hide pagination if 0 or 1 page
            this.paginationContainer.innerHTML = '';
            return;
         }

        let paginationHTML = '';

        // Previous Button
        paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                             <a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">«</a>
                           </li>`;

        // Page Number Logic (Simple version: show all pages)
        // TODO: Implement ellipsis (...) logic for large number of pages
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                                <a class="page-link" href="#" data-page="${i}">${i}</a>
                               </li>`;
        }

        // Next Button
        paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                             <a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">»</a>
                           </li>`;

        this.paginationContainer.innerHTML = paginationHTML;
    }

    _updateStoreResultsCount(paginationData, itemsOnCurrentPage) {
        if (!this.storeResultsCount || !paginationData) return;

        const { currentPage, itemsPerPage, totalItems } = paginationData;

        if (totalItems === 0) {
            this.storeResultsCount.textContent = 'Không có sản phẩm nào';
        } else {
            const startItem = (currentPage - 1) * itemsPerPage + 1;
            // Use actual number of items rendered, as last page might have fewer than itemsPerPage
            const endItem = startItem + itemsOnCurrentPage - 1;
            this.storeResultsCount.textContent = `Hiển thị ${startItem}-${endItem} / ${totalItems} SP`;
        }
    }

    // --- Event Handlers for Store Controls ---
    _handleFilterLinkClick(event) {
        event.preventDefault();
        const link = event.target.closest('.filter-link');
        if (!link) return;

        const type = link.dataset.filterType; // 'category' or 'brand'
        const value = link.dataset.filterValue;
        const rating = link.dataset.rating; // Rating value (if it's a rating link)
        const list = link.closest('.filter-list');

        // Deactivate other links within the same filter group (category or brand)
        if (list) {
             list.querySelectorAll('.filter-link').forEach(l => {
                 // For rating, only remove active if *another* rating is clicked or the same one is clicked again
                 if(!rating || l === link || !l.dataset.rating) {
                     l.classList.remove('active');
                 }
             });
        }

        if (type) { // Category or Brand filter
            this.currentFilters[type] = value;
            link.classList.add('active');
        } else if (rating) { // Rating filter
             const ratingValue = parseInt(rating);
             // Toggle rating filter: if clicked again, disable; otherwise enable
            if (this.currentFilters.rating === ratingValue) {
                this.currentFilters.rating = null; // Disable rating filter
                // Link remains inactive (already removed by general deactivation)
            } else {
                this.currentFilters.rating = ratingValue;
                link.classList.add('active'); // Activate clicked rating
            }
        }

        this.currentFilters.page = 1; // Reset to first page on filter change
        this._applyFilters(); // Trigger API call and re-render
    }

    _handleClearFilters() {
        // Reset filter state object
        this.currentFilters = {
             ...this.currentFilters, // Keep current view mode
             category: 'all',
             brand: 'all',
             maxPrice: 50000000, // Reset to initial max
             rating: null,
             sortBy: 'newest', // Reset sort
             searchTerm: '',
             page: 1
        };

        // Reset UI elements
        document.querySelectorAll('.store-filters .filter-link.active').forEach(l => l.classList.remove('active'));
        document.querySelector('.category-filter a[data-filter-value="all"]')?.classList.add('active');
        document.querySelector('.brand-filter a[data-filter-value="all"]')?.classList.add('active');

        if (this.priceRange) this.priceRange.value = 50000000;
        if (this.priceRangeValue) this.priceRangeValue.textContent = (50000000).toLocaleString('vi-VN');
        if (this.sortBySelect) this.sortBySelect.value = 'newest';
        if (this.storeSearchInput) this.storeSearchInput.value = '';

        // Apply default filters
        this._applyFilters();
    }

    _handleViewToggleClick(event) {
        const button = event.target.closest('.btn-view-mode');
        if (!button) return;

        const view = button.dataset.view; // 'grid' or 'list'
        if (view === this.currentFilters.view || !this.productGrid || !this.productList) {
            return; // No change or elements missing
        }

        this.currentFilters.view = view; // Update state

        // Update button active state
        this.viewToggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Toggle visibility of grid and list containers
        this.productGrid.style.display = (view === 'grid') ? 'grid' : 'none';
        this.productList.style.display = (view === 'list') ? 'block' : 'none';

        // No API call needed, just switching the display of already fetched data
    }

    _handlePaginationClick(event) {
        event.preventDefault();
        const link = event.target.closest('.page-link');
        // Ensure click is on a valid, enabled page link
        if (!link || link.closest('.page-item.disabled') || link.closest('.page-item.active')) {
            return;
        }

        const newPage = parseInt(link.dataset.page);
        if (!isNaN(newPage) && newPage !== this.currentFilters.page) {
            this.currentFilters.page = newPage;
            this._applyFilters(); // Fetch and render the new page
        }
    }

    // =========================================================================
    // Event Handlers (Delegated Actions)
    // =========================================================================

    _handleStoreActionClick(event) {
        const target = event.target;
        const productElement = target.closest('.product-card, .product-list-item');
        const productId = target.closest('[data-product-id]')?.dataset.productId;

        if (!productId) return; // Exit if no product ID found

        // Handle "Add to Cart" button click
        if (target.closest('.btn-add-cart')) {
            event.stopPropagation();
            const productData = this._getProductDataFromElement(productElement);
            if (productData) {
                this._handleAddToCart(productData); // Async method
            } else {
                console.warn("Could not get product data from element for add to cart.");
                this._addNotification("Lỗi: Không thể lấy thông tin sản phẩm.", "error");
            }
        }
        // Handle "Wishlist" button click
        else if (target.closest('.wishlist-btn')) {
            event.stopPropagation();
            const button = target.closest('.wishlist-btn');
            const isAdding = !button.classList.contains('active');
            const productDataForWishlist = this._getProductDataFromElement(productElement); // Get data for context

            if (productDataForWishlist) {
                if (isAdding) {
                    this._addToWishlist(productDataForWishlist); // Async method
                } else {
                    this._removeFromWishlist(productId); // Async method
                }
            } else {
                 console.warn("Could not get product data from element for wishlist action.");
                 this._addNotification("Lỗi: Không thể lấy thông tin sản phẩm cho Yêu thích.", "error");
            }
        }
        // Handle "View Detail" button or Product Name link click
        else if (target.closest('.btn-view-detail') || target.matches('.product-name-link')) {
            event.preventDefault(); // Prevent link navigation if it's an <a> tag
            event.stopPropagation();
            this._showProductDetailModal(productId); // Async method
        }
    }

    _handleWishlistActionClick(event) {
        const target = event.target;
        const wishlistItem = target.closest('.wishlist-item');
        const productId = wishlistItem?.dataset.productId;

        if (!productId) return;

        // Handle "Remove from Wishlist" button click
        if (target.closest('.wishlist-remove-btn')) {
            event.stopPropagation();
            this._removeFromWishlist(productId); // Async method
        }
        // Handle "Add to Cart" button click from wishlist
        else if (target.closest('.btn-add-cart')) {
            event.stopPropagation();
            const productData = this._getProductDataFromElement(wishlistItem); // Get data from the wishlist item
            if (productData) {
                this._handleAddToCart(productData); // Async method
            } else {
                this._addNotification("Lỗi: Không thể lấy thông tin sản phẩm từ mục yêu thích.", "error");
            }
        }
    }

    _handleDetailModalActionClick(event) {
        const target = event.target;
        // Find the closest element with product ID (could be h3 or a button)
        const productElement = target.closest('[data-product-id]');
        const productId = productElement?.dataset.productId;

        if (!productId) return;

        // Handle "Add to Cart" button in modal
        if (target.closest('.btn-add-cart-detail')) {
            event.stopPropagation();
            // Reconstruct minimal data needed from modal content
            const name = this.detailModalContent.querySelector('h3[data-product-id]')?.textContent || 'Sản phẩm';
            const priceMatch = this.detailModalContent.querySelector('.price')?.textContent.match(/[\d.,]+/);
            const priceValue = parseInt((priceMatch ? priceMatch[0] : '0').replace(/[^0-9]/g, ''));
            const imageSrc = this.detailModalContent.querySelector('.main-image img')?.src;
            this._handleAddToCart({
                id: productId,
                name: name,
                price: isNaN(priceValue) ? 0 : priceValue,
                imageSrc: imageSrc
            }); // Async method
        }
        // Handle "Wishlist" button in modal
        else if (target.closest('.wishlist-btn-detail')) {
            event.stopPropagation();
            const button = target.closest('.wishlist-btn-detail');
            const isAdding = !button.classList.contains('active');
            // Reconstruct data for wishlist context
            const name = this.detailModalContent.querySelector('h3[data-product-id]')?.textContent || 'Sản phẩm';
             const priceMatch = this.detailModalContent.querySelector('.price')?.textContent.match(/[\d.,]+/);
             const priceValue = parseInt((priceMatch ? priceMatch[0] : '0').replace(/[^0-9]/g, ''));
             const imageSrc = this.detailModalContent.querySelector('.main-image img')?.src;
             const productDataForWishlist = { id: productId, name, price: isNaN(priceValue) ? 0 : priceValue, imageSrc };

            if (isAdding) {
                this._addToWishlist(productDataForWishlist); // Async method
            } else {
                this._removeFromWishlist(productId); // Async method
            }
        }
         // Handle clicks on order detail modal buttons (if details are shown in the same modal)
         else if (target.closest('.btn-cancel-order')) {
             event.preventDefault();
             const orderId = target.closest('.btn-cancel-order').dataset.orderId;
             alert(`Hủy đơn hàng ${orderId} (Chức năng chưa thực hiện)`);
             // --- TODO: Call API to cancel order ---
         }
         else if (target.closest('.btn-buy-again')) {
             event.preventDefault();
             const orderId = target.closest('.btn-buy-again').dataset.orderId;
             alert(`Mua lại đơn hàng ${orderId} (Chức năng chưa thực hiện)`);
             // --- TODO: Fetch order items, add them to cart via API ---
             // 1. Fetch order details again if needed (or use existing orderData if still available)
             // 2. Loop through items: await this._handleAddToCart(item);
             // 3. Navigate to cart: this._setActiveSection('cart');
             this._closeModal(this.detailModal);
         }
         else if (target.closest('.btn-request-support')) {
             event.preventDefault();
             const orderId = target.closest('.btn-request-support').dataset.orderId;
             alert(`Yêu cầu hỗ trợ cho ${orderId} (Chức năng chưa thực hiện)`);
             // --- TODO: Navigate to support form/section, potentially pre-filling order ID ---
             this._setActiveSection('support');
             this._closeModal(this.detailModal);
             // Optionally pre-fill the support form:
             // const supportSubject = document.getElementById('supportSubject');
             // if(supportSubject) supportSubject.value = `Hỗ trợ đơn hàng #${orderId}`;
         }
          else if (target.matches('.chat-reply-send')) {
             event.preventDefault();
             const input = this.detailModalContent.querySelector('.chat-reply-input');
             const message = input?.value.trim();
             const requestId = target.dataset.requestId;
             if (message && requestId) {
                 alert(`Gửi tin nhắn cho YC #${requestId}: "${message}" (Chức năng chưa thực hiện)`);
                 // --- TODO: Send message via API/WebSocket ---
                 // Optimistically add to chat log in modal?
                 if(input) input.value = '';
             }
         }
    }

    _handleOrderHistoryActionClick(event) {
        const target = event.target;
        // Handle "View Details" button click in history tables
        if (target.closest('.btn-view-details')) {
            event.preventDefault();
            const button = target.closest('.btn-view-details');
            const orderId = button.dataset.orderId;
            // Determine if it's a product or service order based on table ancestor
            const orderType = button.closest('#product-orders') ? 'product' : 'service';
            if (orderId) {
                this._showOrderDetailModal(orderId, orderType); // Async method
            }
        }
    }

    _handleOverviewActionClick(event) {
        const target = event.target;
        // Handle "View Details" in recent activity table
        if (target.closest('.recent-activity-table .btn-view-details')) {
            event.preventDefault();
            const button = target.closest('.btn-view-details');
            const orderId = button.dataset.orderId;
            if (orderId) {
                const orderType = orderId.startsWith('P') ? 'product' : 'service';
                // Navigate to order history section first
                this._setActiveSection('order-history');
                // Delay showing modal to allow section transition
                setTimeout(() => {
                    this._activateOrderHistoryTab(orderType); // Activate correct tab
                    this._showOrderDetailModal(orderId, orderType); // Fetch and show details
                }, 350);
            }
        }
        // Handle "View Suggestion" button click
        else if (target.closest('.suggestion-item .btn-outline')) {
            event.preventDefault();
            const suggestionItem = target.closest('.suggestion-item');
            // Determine action based on suggestion content (example)
            const suggestionTitle = suggestionItem.querySelector('h5')?.textContent.toLowerCase();
            this._addNotification(`Xem gợi ý: ${suggestionTitle} (Demo)`);

            if (suggestionTitle?.includes('phụ kiện') || suggestionTitle?.includes('sản phẩm')) {
                 // --- BACKEND INTEGRATION: Navigate to store with specific filters maybe ---
                this._setActiveSection('store');
                // Optionally apply filters based on suggestion:
                // this.currentFilters.category = 'Accessory';
                // this.currentFilters.page = 1;
                // this._applyFilters();
            } else if (suggestionTitle?.includes('dịch vụ')) {
                 this._setActiveSection('services'); // Assuming a services section exists
            }
        }
    }


    // =========================================================================
    // Form Submission Simulation (Needs Backend Calls)
    // =========================================================================
    async _submitFormDataAPI(formElement, endpoint) {
        const formData = new FormData(formElement);
        // Convert FormData to a plain object for JSON APIs
        const data = {};
        formData.forEach((value, key) => {
            // Handle checkboxes potentially not being sent if unchecked
             if (formElement.querySelector(`[name="${key}"]`)?.type === 'checkbox') {
                 data[key] = formElement.querySelector(`[name="${key}"]`).checked;
             } else {
                 data[key] = value;
             }
        });

        console.log(`API CALL (SIMULATED): Submitting form data to ${endpoint}...`, data);

        // --- TODO: Replace with actual fetch() using POST/PUT ---
        /*
        try {
            const response = await fetch(endpoint, {
                method: 'POST', // or 'PUT' depending on API design
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${your_auth_token}` // Add authentication if needed
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                // Try to get error message from response body
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) { /* Ignore JSON parsing error * / }
                throw new Error(errorMsg);
            }

            const result = await response.json(); // Assuming API returns JSON
            console.log("API RESPONSE: Form submission result:", result);
            return result; // Should contain { success: true/false, message: "...", data: {...} }

        } catch (error) {
            console.error("API submission error:", error);
            // Return a standard error structure
            return { success: false, message: error.message || "Lỗi kết nối máy chủ." };
        }
        */

        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 800));
        let result = { success: true, message: "Dữ liệu đã được lưu." };
        // Simulate specific API responses if needed for testing
         if (endpoint === '/api/addresses' && data.name) { // Simulate returning new address data
             result.newAddress = { id: `addr-${Date.now()}`, ...data, text: `${data.street}, ...`, isDefault: !!data.isDefault };
         } else if (endpoint === '/api/service-requests' && data.requestTitle){
             result.newRequestId = `S-${Date.now()}`;
         }

        console.log("API RESPONSE (SIMULATED): Form submission result:", result);
        return result;
        // --- End Simulation ---
    }

    // =========================================================================
    // Order History Rendering
    // =========================================================================
    _renderOrderHistoryTables() {
        const productTbody = this.orderHistorySection?.querySelector('#product-orders tbody');
        const serviceTbody = this.orderHistorySection?.querySelector('#service-orders tbody');

        // Render Product Orders
        if (productTbody) {
            productTbody.innerHTML = ''; // Clear previous rows
            if (this.productOrders.length === 0) {
                productTbody.innerHTML = '<tr><td colspan="6" class="empty-table-msg">Chưa có đơn hàng sản phẩm nào.</td></tr>';
            } else {
                this.productOrders.forEach(order => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>#${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.mainProduct || 'Nhiều sản phẩm'}</td>
                        <td>${this._formatCurrency(order.total)}</td>
                        <td><span class="status ${order.statusClass}">${order.status}</span></td>
                        <td><button class="btn btn-sm btn-outline btn-view-details" data-order-id="${order.id}">Chi tiết</button></td>
                    `;
                    productTbody.appendChild(tr);
                });
            }
        }

        // Render Service Requests
        if (serviceTbody) {
            serviceTbody.innerHTML = ''; // Clear previous rows
            if (this.serviceRequests.length === 0) {
                serviceTbody.innerHTML = '<tr><td colspan="6" class="empty-table-msg">Chưa có yêu cầu dịch vụ nào.</td></tr>';
            } else {
                this.serviceRequests.forEach(req => {
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
    async _logoutAPI() {
        console.log("API CALL (SIMULATED): Logging out...");
        // --- TODO: Replace with actual fetch() to logout endpoint (usually POST) ---
        // Server should invalidate session/token
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("API RESPONSE (SIMULATED): Logout successful on server.");
        return { success: true };
    }

    async _handleLogout(event) {
        event.preventDefault();
        console.log('Logout initiated...');
        this._addNotification('Đang đăng xuất...'); // User feedback

        try {
            const response = await this._logoutAPI(); // --- BACKEND CALL ---

            if (response.success) {
                // Clear local storage/session storage
                localStorage.removeItem('authToken'); // Example
                sessionStorage.clear();             // Example
                // Clear sensitive instance variables if necessary
                this.cartItems = [];
                this.wishlistItems = [];
                this.notifications = [];
                // ... etc.

                // Redirect to login page
                // --- TODO: Update with your actual login page URL ---
                window.location.href = '/login.html';
            } else {
                 throw new Error(response.message || "Logout failed on server.");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            this._addNotification(`Đăng xuất thất bại: ${error.message}`, "error");
        }
    }

    // =========================================================================
    // Chatbox Functionality (Simulated - Needs Backend/WebSocket)
    // =========================================================================
     _toggleChatbox() {
         if (!this.chatboxWidget) return;
         this.chatboxWidget.classList.toggle('active');
         if (this.chatboxWidget.classList.contains('active')) {
             this.chatInput?.focus();
             this._scrollChatToBottom();
             // --- BACKEND INTEGRATION: Connect WebSocket, fetch history ---
             console.log("CHAT (SIMULATED): Opened. Connect WebSocket / Fetch History.");
              // Add initial greeting if empty
             if (this.messagesContainer && this.messagesContainer.children.length === 0) {
                 setTimeout(() => { this._addChatMessage('Chào bạn, chúng tôi có thể giúp gì?', 'agent'); }, 500);
             }
         } else {
             // --- BACKEND INTEGRATION: Disconnect WebSocket ---
              console.log("CHAT (SIMULATED): Closed. Disconnect WebSocket.");
         }
     }

     _closeChatbox() {
          if (this.chatboxWidget && this.chatboxWidget.classList.contains('active')) {
             this.chatboxWidget.classList.remove('active');
             // --- BACKEND INTEGRATION: Disconnect WebSocket ---
              console.log("CHAT (SIMULATED): Closed by clicking outside. Disconnect WebSocket.");
          }
     }

    _addChatMessage(text, type) { // type is 'user' or 'agent'
        if (!this.messagesContainer || !text) return;
        const p = document.createElement('p');
        p.classList.add('message', type);
        p.textContent = text; // Use textContent to prevent XSS
        this.messagesContainer.appendChild(p);
        this._scrollChatToBottom();
    }

     _scrollChatToBottom() {
         if (this.messagesContainer) {
             this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
         }
     }

    _handleChatSendMessage() {
        const messageText = this.chatInput?.value.trim();
        if (messageText && this.chatInput) {
            this._addChatMessage(messageText, 'user'); // Display user message optimistically
            this.chatInput.value = ''; // Clear input

            // --- BACKEND INTEGRATION: Send message via API or WebSocket ---
            console.log("CHAT (SIMULATED): Sending message to backend:", messageText);
            // Simulate agent reply after a delay
            setTimeout(() => {
                const reply = `Phản hồi tự động cho: "${messageText.substring(0, 20)}...". Chúng tôi sẽ kết nối bạn với nhân viên hỗ trợ.`;
                this._addChatMessage(reply, 'agent');
            }, 1200);
        }
    }

    // =========================================================================
    // Theme Switching (Front-end)
    // =========================================================================
    _setupTheme() {
        const currentTheme = localStorage.getItem('theme');
        // Check for system preference if no theme is saved
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (currentTheme) {
            this._setTheme(currentTheme);
        } else {
            this._setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    _setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            if (this.themeToggle) this.themeToggle.checked = false;
            localStorage.setItem('theme', 'light');
        } else { // Default to dark
            document.body.classList.remove('light-mode');
            if (this.themeToggle) this.themeToggle.checked = true;
            localStorage.setItem('theme', 'dark');
        }
    }

    _handleThemeChange() {
        if (this.themeToggle) {
            this._setTheme(this.themeToggle.checked ? 'dark' : 'light');
        }
    }

} // End of DashboardApp class

// =========================================================================
// Instantiate and Initialize the Application
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new DashboardApp();
    app.initialize(); // Start the application
});

// --- END OF REFACTORED FILE ---
