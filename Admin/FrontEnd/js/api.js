// js/api.js
import { API_BASE_URL } from './config.js';

// Placeholder for getting authentication token
// Replace this with your actual function to retrieve the token (from localStorage, sessionStorage, etc.)
function getAuthToken() {
    // Example: return localStorage.getItem('authToken');
    return null; // Return null if no token logic implemented yet
}

const apiService = {
    /**
     * Generic fetch wrapper for API requests.
     * Handles JSON parsing, error handling, and auth headers.
     * @param {string} endpoint - API endpoint (relative to API_BASE_URL).
     * @param {object} [options={}] - Fetch options (method, headers, body, etc.).
     * @returns {Promise<any>} - The JSON response data.
     * @throws {Error} - Throws an error with status and potential server message if the fetch fails or response is not ok.
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        // Default headers
        const defaultHeaders = {
            'Accept': 'application/json',
            // Only add Content-Type if there's a body that is JSON
        };
        if (options.body && typeof options.body !== 'undefined' && !(options.body instanceof FormData)) {
            defaultHeaders['Content-Type'] = 'application/json';
        }


        // Add Authorization header if a token exists
        const token = getAuthToken();
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        // Merge options and headers
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers, // Allow overriding defaults
            },
        };

        // Stringify body if it's a plain object and not FormData
        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body);
        }

        console.log(`API Request: ${config.method || 'GET'} ${url}`, config.body ? `Body: ${config.body.substring(0, 100)}...` : ''); // Log request details (limit body length)

        try {
            const response = await fetch(url, config);

            // Handle successful responses first
            if (response.ok) {
                // Handle 204 No Content or empty body
                if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                    console.log(`API Response (${response.status}): No Content`);
                    return null; // Or return a specific success indicator if needed
                }
                // Parse JSON response
                const data = await response.json();
                console.log(`API Response (${response.status}):`, data);
                return data;
            } else {
                // Handle non-OK responses (4xx, 5xx)
                let errorData = { message: `Request failed with status ${response.status}` };
                try {
                    // Try to parse specific error details from the server response body
                    const responseBody = await response.json();
                    errorData = { ...responseBody, message: responseBody.message || errorData.message };
                } catch (e) {
                    // If parsing fails, use the status text
                    errorData.message = response.statusText || errorData.message;
                    console.warn("Could not parse error response body as JSON.");
                }

                // Construct and throw a detailed error object
                const error = new Error(errorData.message);
                error.status = response.status;
                error.data = errorData; // Attach full error data
                console.error(`API Error (${response.status}): ${error.message}`, errorData);
                throw error; // Throw the error to be caught by the caller
            }

        } catch (error) {
            // Handle network errors or errors thrown above
            console.error('API Request Failed:', error.message, error.data || error);
            // Optionally: show a generic network error toast here
            // showToast('Network error. Please check your connection.', 'error');
            // Re-throw the error so the calling function knows the request failed
            throw error;
        }
    },

    // --- Dashboard ---
    async getDashboardData() {
        console.log("API: Fetching dashboard data...");
        // --- Real API Call Placeholder ---
        // return await this.request('/dashboard');
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 500));
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
        // --- Real API Call Placeholder ---
        // return await this.request(`/products?${query}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 700));
        const allProducts = [ /* ... (same data as before) ... */
            { id: 'TB-LP-01', image: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=L', name: 'Laptop TechBrand Pro 14', sku: 'TB-LP-01', price: 32500000, stock: 15, status: 'published', slug: 'laptop-techbrand-pro-14' },
            { id: 'NT-PH-01', image: 'https://via.placeholder.com/50x50/a29bfe/ffffff?text=P', name: 'NovaTech Phone X', sku: 'NT-PH-01', price: 18990000, stock: 3, status: 'published', slug: 'novatech-phone-x' },
            { id: 'GP-AC-01', image: 'https://via.placeholder.com/50x50/fdcb6e/2d3436?text=M', name: 'Chuột không dây GadgetPro Z1', sku: 'GP-AC-01', price: 1100000, salePrice: 950000, stock: 0, status: 'draft', slug: 'chuot-khong-day-gadgetpro-z1' }, // Corrected sale price
            { id: 'ZS-MN-01', image: 'https://via.placeholder.com/50x50/d63031/ffffff?text=S', name: 'Màn hình ZyStore 27" QHD', sku: 'ZS-MN-01', price: 7200000, stock: 25, status: 'published', slug: 'man-hinh-zystore-27-qhd' },
        ];
        let filteredProducts = allProducts;
        if (params.status) { filteredProducts = allProducts.filter(p => p.status === params.status); }
        // Simulate search (simple)
        if (params.search) {
            const searchTerm = params.search.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm) || p.sku.toLowerCase().includes(searchTerm));
        }
        // Simulate sorting (simple by name)
        if (params.sortBy === 'name') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name) * (params.sortDir === 'desc' ? -1 : 1));
        }
        // Pagination
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        return {
            data: paginatedProducts,
            pagination: { totalItems: filteredProducts.length, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(filteredProducts.length / limit) }
        };
        // --- End Simulation ---
    },
    async getProductDetails(productId) {
        console.log(`API: Fetching product details for ID: ${productId}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/products/${productId}`);
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
            return { /* ... (default data) ... */
                id: productId, name: `Sản phẩm ${productId}`, slug: `san-pham-${productId}`,
                shortDescription: '', description: '', categoryIds: [], brand: '', status: 'draft',
                price: 999000, salePrice: null, saleStartDate: null, saleEndDate: null,
                manageStock: true, sku: `SKU-${productId}`, stock: 8, lowStockThreshold: 5, allowBackorder: false,
                featuredImage: null, galleryImages: [], variants: [], seoTitle: '', seoDescription: ''
            };
        }
        // --- End Simulation ---
    },
    /**
     * Saves product data (Create or Update).
     * Handles FormData for potential file uploads.
     * @param {FormData|object} productData - Product data (use FormData if including files).
     * @param {string|null} productId - ID of the product to update, or null for create.
     */
    async saveProduct(productData, productId = null) {
        const method = productId ? 'PUT' : 'POST';
        // Adjust endpoint for PUT, potentially need to handle FormData differently
        // Note: PUT/POST with FormData doesn't typically use Content-Type: application/json
        let endpoint = '/products';
        let options = { method: method, body: productData };

        if (productId) {
            endpoint = `/products/${productId}`;
            // FormData with PUT might need special handling on backend or using POST with _method field
            // Example using POST override:
            // if (productData instanceof FormData) {
            //     options.method = 'POST';
            //     productData.append('_method', 'PUT');
            // }
        }

        console.log(`API: Saving product (ID: ${productId || 'New'}) with method ${options.method}`);

        // --- Real API Call Placeholder ---
        // return await this.request(endpoint, options);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 800));
        // Convert FormData to object for simulation logging (won't have file data)
        let dataToLog = productData;
        if (productData instanceof FormData) {
            dataToLog = Object.fromEntries(productData.entries());
        }
        if (dataToLog.name === 'ErrorTest') {
            const error = new Error("Validation Failed");
            error.status = 422;
            error.data = { message: "Validation Failed", errors: { name: ["Tên sản phẩm không hợp lệ."] } };
            throw error;
        }
        const savedProduct = { ...dataToLog, id: productId || `NEW-${Date.now()}` };
        console.log("Saved Product Data (Simulated):", savedProduct);
        return savedProduct;
        // --- End Simulation ---
    },
    async deleteProduct(productId) {
        console.log(`API: Deleting product ID: ${productId}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/products/${productId}`, { method: 'DELETE' });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 500));
        return { message: `Product ${productId} deleted successfully.` };
        // --- End Simulation ---
    },
    async applyProductBulkAction(action, productIds) {
        console.log(`API: Applying bulk action "${action}" to product IDs:`, productIds);
        // --- Real API Call Placeholder ---
        // return await this.request('/products/bulk-actions', { method: 'POST', body: { action, productIds } });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 600));
        return { message: `Action "${action}" applied to ${productIds.length} products.` };
        // --- End Simulation ---
    },

    // --- Orders ---
    async getOrders(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API: Fetching orders with params: ${query}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/orders?${query}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 600));
        const allOrders = [
            { id: 'P999', customerId: 1, customerName: 'Nguyễn Văn A', date: '2023-12-25T10:30:00', total: 2500000, paymentStatus: 'pending', orderStatus: 'pending' },
            { id: 'P998', customerId: 2, customerName: 'Trần Thị B', date: '2023-12-24T15:00:00', total: 18990000, paymentStatus: 'paid', paymentMethod: 'VNPAY', orderStatus: 'shipped' },
            { id: 'P997', customerId: 3, customerName: 'Lê Văn C', date: '2023-12-24T09:10:00', total: 950000, paymentStatus: 'paid', paymentMethod: 'COD', orderStatus: 'completed' },
            { id: 'P996', customerId: 1, customerName: 'Nguyễn Văn A', date: '2023-12-20T11:00:00', total: 1200000, paymentStatus: 'paid', paymentMethod: 'COD', orderStatus: 'completed' },
            { id: 'P995', customerId: 4, customerName: 'Phạm Thị D', date: '2023-12-19T16:00:00', total: 5500000, paymentStatus: 'pending', orderStatus: 'cancelled' },
        ];
        // Simple filter simulation
        let filteredOrders = allOrders;
        if (params.status) { filteredOrders = filteredOrders.filter(o => o.orderStatus === params.status); }
        if (params.paymentStatus) { filteredOrders = filteredOrders.filter(o => o.paymentStatus === params.paymentStatus); }
        // Pagination
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
        return {
            data: paginatedOrders,
            pagination: { totalItems: filteredOrders.length, currentPage: page, itemsPerPage: limit, totalPages: Math.ceil(filteredOrders.length / limit) }
        };
        // --- End Simulation ---
    },
    async getOrderDetail(orderId) {
        console.log(`API: Fetching order details for ID: ${orderId}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/orders/${orderId}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 450));
        const order = (await this.getOrders({limit: 100})).data.find(o => o.id === orderId) || { id: orderId, customerId: '?', customerName: 'Khách Hàng Demo', date: new Date().toISOString(), total: 100000, paymentStatus: 'pending', orderStatus: 'pending' };
        return {
            ...order,
            customer: { id: order.customerId, name: order.customerName, email: `demo${order.customerId}@email.com`, phone: `090xxxx${order.customerId}` },
            items: [ { productId: 'PROD1', name: 'Sản phẩm mẫu 1', quantity: 1, price: 50000 }, { productId: 'PROD2', name: 'Sản phẩm mẫu 2', quantity: 1, price: 50000 } ],
            shippingAddress: { street: '123 Đường ABC', city: 'TP. HCM', country: 'VN' },
            billingAddress: { street: '123 Đường ABC', city: 'TP. HCM', country: 'VN' }, // Add billing address example
            shippingMethod: 'Giao hàng tiêu chuẩn',
            subtotal: 100000, shippingCost: 0, grandTotal: order.total,
            customerNote: 'Giao hàng giờ hành chính.',
            internalNotes: [{ user: 'Admin', note: 'Đã xác nhận thông tin.', timestamp: '2023-12-25T11:00:00' }],
            history: [ { status: 'pending', timestamp: order.date, user: 'System' }, { status: order.orderStatus, timestamp: new Date().toISOString(), user: 'Admin Demo' } ],
            trackingCode: order.orderStatus === 'shipped' ? 'VN123456789' : null
        };
        // --- End Simulation ---
    },
    async updateOrderStatus(orderId, status) {
        console.log(`API: Updating order ${orderId} status to ${status}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/orders/${orderId}/status`, { method: 'PUT', body: { status } });
// --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 300));
        return { message: `Order ${orderId} status updated to ${status}.` };
// --- End Simulation ---
    },
    async saveOrderDetail(orderId, data) {
        console.log(`API: Saving order details for ${orderId}:`, data);
        // --- Real API Call Placeholder ---
        // return await this.request(`/orders/${orderId}`, { method: 'PUT', body: data });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 700));
        // Simulate adding note - backend would handle this
        if (data.newInternalNote) {
            console.log(`Simulating adding internal note for order ${orderId}: "${data.newInternalNote}"`);
            // In a real scenario, the backend would add the note and return the updated order or just success
        }
        return { message: `Order ${orderId} details saved.` };
        // --- End Simulation ---
    },
    async applyOrderBulkAction(action, orderIds) {
        console.log(`API: Applying bulk action "${action}" to order IDs:`, orderIds);
        // --- Real API Call Placeholder ---
        // return await this.request('/orders/bulk-actions', { method: 'POST', body: { action, orderIds } });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 600));
        return { message: `Action "${action}" applied to ${orderIds.length} orders.` };
        // --- End Simulation ---
    },

// --- Services ---
    async getServices(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API: Fetching services with params: ${query}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/services?${query}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 550));
        const allServices = [
            { id: 'S777', customerId: 1, customerName: 'Nguyễn Văn A', type: 'Sửa chữa', subject: 'Laptop không lên nguồn', date: '2023-12-25T10:15:00', status: 'new', assignee: null },
            { id: 'S776', customerId: 4, customerName: 'Phạm Thị D', type: 'Tư vấn', subject: 'Tư vấn cấu hình PC Gaming', date: '2023-12-24T09:00:00', status: 'processing', assignee: 'Admin Demo' },
            { id: 'S775', customerId: 5, customerName: 'Hoàng Văn E', type: 'Lắp đặt', subject: 'Lắp đặt mạng LAN văn phòng', date: '2023-12-23T14:30:00', status: 'completed', assignee: 'Nhân viên A' },
        ];
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
        // --- Real API Call Placeholder ---
        // return await this.request(`/services/${serviceId}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 400));
        const service = (await this.getServices({limit: 100})).data.find(s => s.id === serviceId) || { id: serviceId, customerId: '?', customerName: 'Khách Hàng Demo', type: 'Khác', subject: 'Yêu cầu mẫu', date: new Date().toISOString(), status: 'new', assignee: null };
        return {
            ...service,
            customer: { id: service.customerId, name: service.customerName, email: `demo${service.customerId}@email.com` },
            description: 'Mô tả chi tiết yêu cầu dịch vụ của khách hàng...\n\n- Vấn đề A\n- Vấn đề B',
            attachments: [ { name: 'error_screenshot.png', url: '#' }, { name: 'system_info.txt', url: '#' } ], // Example attachments
            notes: [ { user: 'Admin Demo', note: 'Đã tiếp nhận yêu cầu.', timestamp: new Date(service.date).toISOString() } ]
        };
        // --- End Simulation ---
    },
    async updateService(serviceId, data) {
        console.log(`API: Updating service ${serviceId} with data:`, data);
        // --- Real API Call Placeholder ---
        // return await this.request(`/services/${serviceId}`, { method: 'PUT', body: data });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 500));
        return { message: `Service ${serviceId} updated successfully.` };
        // --- End Simulation ---
    },

// --- Customers ---
    async getCustomers(params = {}) {
        const query = new URLSearchParams(params).toString();
        console.log(`API: Fetching customers with params: ${query}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/customers?${query}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 650));
        const allCustomers = [
            { id: 1, name: 'Nguyễn Văn A', email: 'a.nguyen@email.com', phone: '090xxxx123', registeredDate: '2023-10-15', orderCount: 5, totalSpent: 12500000 },
            { id: 2, name: 'Trần Thị B', email: 'b.tran@email.com', phone: '091xxxx456', registeredDate: '2023-11-01', orderCount: 1, totalSpent: 18990000 },
            { id: 3, name: 'Lê Văn C', email: 'c.le@email.com', phone: '098xxxx789', registeredDate: '2023-11-20', orderCount: 2, totalSpent: 1900000 },
            { id: 4, name: 'Phạm Thị D', email: 'd.pham@email.com', phone: '097xxxx321', registeredDate: '2023-12-05', orderCount: 1, totalSpent: 5500000 },
            { id: 5, name: 'Hoàng Văn E', email: 'e.hoang@email.com', phone: '093xxxx654', registeredDate: '2023-12-10', orderCount: 0, totalSpent: 0 },
        ];
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
        // --- Real API Call Placeholder ---
        // return await this.request(`/customers/${customerId}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 500));
        // Ensure customerId is compared as number if your IDs are numbers
        const customer = (await this.getCustomers({limit: 100})).data.find(c => c.id == customerId) || { id: customerId, name: `Khách hàng Demo ${customerId}`, email: `demo${customerId}@email.com`, phone: `090xxxx${customerId}`, registeredDate: new Date().toISOString(), orderCount: 0, totalSpent: 0 };
        // Fetch related orders/services
        const orders = (await this.getOrders({limit: 100})).data.filter(o => o.customerId == customerId);
        const services = (await this.getServices({limit: 100})).data.filter(s => s.customerId == customerId);

        return {
            ...customer,
            addresses: [
                { id: 1, street: '123 Đường ABC', city: 'TP. HCM', country: 'VN', isDefaultBilling: true, isDefaultShipping: true },
                { id: 2, street: '456 Đường XYZ', city: 'Hà Nội', country: 'VN', isDefaultBilling: false, isDefaultShipping: false }
            ],
            orderHistory: orders,
            serviceHistory: services,
            adminNotes: [ { user: 'Admin Demo', note: 'Khách hàng tiềm năng, thường mua phụ kiện.', timestamp: '2023-11-01T10:00:00' } ]
        };
        // --- End Simulation ---
    },
    async deleteCustomer(customerId) {
        console.log(`API: Deleting customer ID: ${customerId}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/customers/${customerId}`, { method: 'DELETE' });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 500));
        return { message: `Customer ${customerId} deleted successfully.` };
        // --- End Simulation ---
    },
    async saveCustomerDetail(customerId, data) {
        console.log(`API: Saving customer detail ${customerId}:`, data);
        // --- Real API Call Placeholder ---
        // return await this.request(`/customers/${customerId}`, { method: 'PUT', body: data });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 600));
        if (data.newAdminNote) {
            console.log(`Simulating adding admin note for customer ${customerId}: "${data.newAdminNote}"`);
        }
        return { message: `Customer ${customerId} detail saved.` };
        // --- End Simulation ---
    },

// --- Settings ---
    async getSettings(tabName) {
        console.log(`API: Fetching settings for tab: ${tabName}`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/settings/${tabName}`);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 300));
        switch(tabName) {
            case 'general': return { storeName: 'TechShop', storeAddress: '123 ABC...', storeEmail: 'support@techshop.example', storePhone: '19001234', storeLogo: 'https://via.placeholder.com/150x50/a29bfe/ffffff?text=TechShopLogo' };
            case 'payments': return {
                codEnabled: true, codTitle: 'Thanh toán khi nhận hàng', codInstructions: '',
                bankTransferEnabled: true, bankTransferTitle: 'Chuyển khoản Ngân hàng', bankTransferDetails: 'VCB 123...',
                vnpayEnabled: false, vnpayTmnCode: '', vnpayHashSecret: '', vnpayTestMode: true
            };
            case 'shipping': return { /* ... shipping zone data ... */ };
            case 'emails': return { /* ... email config data ... */ };
            case 'seo': return { defaultSeoTitle: 'TechShop Default', defaultSeoDescription: 'Default Desc', seoSeparator: '|' };
            default: return {};
        }
        // --- End Simulation ---
    },
    async saveSettings(tabName, settingsData) {
        console.log(`API: Saving settings for tab "${tabName}":`, settingsData);
        // --- Real API Call Placeholder ---
        // Use POST or PUT depending on backend design
        // return await this.request(`/settings/${tabName}`, { method: 'POST', body: settingsData });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 700));
        if (tabName === 'general' && !settingsData.storeName) { // Check for empty storeName
            const error = new Error("Validation Failed");
            error.status = 422;
            error.data = { message: "Validation Failed", errors: { storeName: ["Tên cửa hàng không được để trống."] } };
            throw error;
        }
        console.log(`Simulated save successful for ${tabName} settings.`);
        return { message: `Settings for ${tabName} saved successfully.` };
        // --- End Simulation ---
    },

// --- Notifications ---
    async getNotifications() {
        console.log("API: Fetching notifications...");
        // --- Real API Call Placeholder ---
        // return await this.request('/notifications');
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 200));
        // Return more realistic notifications
        return [
            { id: 'n1', message: 'Đơn hàng mới #P999 của Nguyễn Văn A cần xử lý.', timestamp: '2023-12-25T10:31:00', read: false, link: { type: 'order', id: 'P999' } },
            { id: 'n2', message: 'Yêu cầu dịch vụ #S777 (Sửa chữa) mới từ Nguyễn Văn A.', timestamp: '2023-12-25T10:16:00', read: false, link: { type: 'service', id: 'S777' } },
            { id: 'n3', message: 'Sản phẩm \'Chuột không dây GadgetPro Z1\' (GP-AC-01) đã hết hàng.', timestamp: '2023-12-25T09:00:00', read: true, link: { type: 'product', id: 'GP-AC-01' } },
            { id: 'n4', message: 'Cập nhật thành công cài đặt thanh toán.', timestamp: '2023-12-24T18:00:00', read: true, link: null },
            { id: 'n5', message: 'Đơn hàng #P998 đã được giao thành công.', timestamp: '2023-12-24T17:00:00', read: true, link: { type: 'order', id: 'P998' } },
        ];
        // --- End Simulation ---
    },
    async markNotificationRead(notificationId) {
        console.log(`API: Marking notification ${notificationId} as read.`);
        // --- Real API Call Placeholder ---
        // return await this.request(`/notifications/${notificationId}/read`, { method: 'POST' });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 100));
        return { success: true };
        // --- End Simulation ---
    },
    async markAllNotificationsRead() {
        console.log("API: Marking all notifications as read.");
        // --- Real API Call Placeholder ---
        // return await this.request('/notifications/read-all', { method: 'POST' });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
        // --- End Simulation ---
    },

// --- Auth ---
    async logout() {
        console.log("API: Logging out.");
        // --- Real API Call Placeholder ---
        // return await this.request('/auth/logout', { method: 'POST' });
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 400));
        // Clear token placeholder if using one
        // localStorage.removeItem('authToken');
        return { message: "Logout successful." };
        // --- End Simulation ---
    },

// --- Add other API calls as needed ---
// Example: Get admin accounts, roles, content pages, banners etc.
    async getAdminAccounts(params = {}) { /* ... */ return { data: [], pagination: {} }; },
    async saveAdminAccount(data, adminId = null) { /* ... */ return {}; },
    async deleteAdminAccount(adminId) { /* ... */ return {}; },
// ... and so on for Content management ...

};

export default apiService;

console.log("API Service loaded"); // Debug log