
// js/sections/dashboard.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import { showToast, formatAdminCurrency } from '../utils.js';
import { initChartsForSection } from '../services/chartService.js';
// Import navigate function indirectly if needed
// import { navigateToSection } from '../main.js';

/**
 * Loads and renders data for the Dashboard section.
 * @param {Function} navigateCallback - Function to call for navigation.
 */
export async function loadDashboardData(navigateCallback) {
    console.log("Loading dashboard data...");
    try {
        const data = await apiService.getDashboardData();

        // Update KPIs
        if (data.kpis) {
            updateKpis(data.kpis);
        }

        // Render Quick Lists
        if (DOM.quickListRecentOrders && data.recentOrders) {
            renderQuickList(DOM.quickListRecentOrders, data.recentOrders, renderRecentOrderItem, 'Chưa có đơn hàng mới.');
        }
        if (DOM.quickListRecentServices && data.recentServices) {
            renderQuickList(DOM.quickListRecentServices, data.recentServices, renderRecentServiceItem, 'Chưa có yêu cầu DV mới.');
        }
        if (DOM.quickListLowStockProducts && data.lowStockProducts) {
            renderQuickList(DOM.quickListLowStockProducts, data.lowStockProducts, renderLowStockProductItem, 'Không có sản phẩm sắp hết hàng.');
        }
        if (DOM.quickListActivityLog && data.activityLog) {
            renderQuickList(DOM.quickListActivityLog, data.activityLog, renderActivityLogItem, 'Chưa có hoạt động gần đây.');
        }

        // Init charts with fetched data
        if (data.charts) {
            const chartContexts = {
                revenueChartCtx: DOM.revenueChartCtx,
                orderStatusChartCtx: DOM.orderStatusChartCtx,
                topProductsChartCtx: DOM.topProductsChartCtx
            };
            initChartsForSection('dashboard', data, chartContexts);
        }

        // Add event listeners specific to dashboard quick list items after rendering
        addDashboardActionListeners(navigateCallback);

    } catch (error) {
        showToast(`Lỗi tải dữ liệu Tổng Quan: ${error.message}`, 'error');
        // Display error message in the dashboard section using imported displayEmptyState
        // displayEmptyState(DOM.dashboardSection.querySelector('.kpi-grid'), 'Không thể tải dữ liệu Tổng Quan. Vui lòng thử lại.', 4); // Example target
        console.error("Failed to load dashboard data:", error);
    }
}

/** Updates KPI card values */
function updateKpis(kpis) {
    if (DOM.kpiRevenueToday) DOM.kpiRevenueToday.textContent = formatAdminCurrency(kpis.revenueToday);
    if (DOM.kpiRevenueChange) {
        DOM.kpiRevenueChange.textContent = `${kpis.revenueChange > 0 ? '+' : ''}${Math.round(kpis.revenueChange * 100)}% vs hôm qua`;
        DOM.kpiRevenueChange.className = `kpi-change ${kpis.revenueChange >= 0 ? 'positive' : 'negative'}`;
        DOM.kpiRevenueChange.querySelector('i')?.className `fas ${kpis.revenueChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`;
    }
    if (DOM.kpiNewOrders) DOM.kpiNewOrders.textContent = kpis.newOrders;
    if (DOM.kpiNewOrdersStatus) DOM.kpiNewOrdersStatus.textContent = 'Chờ xử lý'; // Or map kpis.newOrdersStatus

    if (DOM.kpiNewServices) DOM.kpiNewServices.textContent = kpis.newServices;
    if (DOM.kpiNewServicesStatus) DOM.kpiNewServicesStatus.textContent = 'Cần xem xét'; // Or map kpis.newServicesStatus

    if (DOM.kpiLowStock) DOM.kpiLowStock.textContent = kpis.lowStock;
    if (DOM.kpiLowStockStatus) DOM.kpiLowStockStatus.textContent = 'Dưới 5 sản phẩm'; // Or map kpis.lowStockStatus
}

/**
 * Renders a generic list with a custom item renderer.
 * @param {HTMLElement} listElement - The UL element.
 * @param {Array} items - Array of data items.
 * @param {function} renderItemFunction - Function that takes an item and returns its HTML string.
 * @param {string} [emptyMessage='No items to display.'] - Message for empty list.
 */
function renderQuickList(listElement, items, renderItemFunction, emptyMessage = 'Không có mục nào.') {
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
            <span><a href="#orders?view=${order.id}" class="quick-link link-view-order" data-order-id="${order.id}">#${order.id}</a> - ${order.customer} - ${formatAdminCurrency(order.total)}</span>
            <button class="btn btn-xs btn-outline btn-view-order" data-order-id="${order.id}">Xử lý</button>
        </li>`;
}
function renderRecentServiceItem(service) {
    return `
        <li>
            <span><a href="#services?view=${service.id}" class="quick-link link-view-service" data-service-id="${service.id}">#${service.id}</a> - ${service.customer} - ${service.type}</span>
            <button class="btn btn-xs btn-outline btn-view-service" data-service-id="${service.id}">Xem</button>
        </li>`;
}
function renderLowStockProductItem(product) {
    return `
        <li>
            <img src="${product.image || 'https://via.placeholder.com/40x40/cccccc/ffffff?text=N/A'}" alt="${product.name}">
            <span><a href="#products?edit=${product.id}" class="quick-link link-edit-product" data-product-id="${product.id}">${product.name}</a> (Còn ${product.stock})</span>
            <button class="btn btn-xs btn-outline btn-edit-product" data-product-id="${product.id}">Nhập kho</button>
        </li>`;
}
function renderActivityLogItem(log) {
    // Format timestamp (relative time would be better here using a library like dayjs)
    const timestamp = log.timestamp; // Keep simple for now
    return `
        <li>
            <span>${log.user ? `<strong>${log.user}</strong> ` : ''}${log.action}</span>
            <span class="timestamp">${timestamp}</span>
        </li>`;
}

/** Adds event listeners for action buttons within the dashboard quick lists */
function addDashboardActionListeners(navigateCallback) {
    DOM.dashboardSection?.querySelectorAll('.btn-view-order, .link-view-order').forEach(btn => {
        // Prevent multiple listeners if re-rendering
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = DOM.dashboardSection.querySelector(`[data-order-id="${btn.dataset.orderId}"]`); // Re-select new node
        newBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const orderId = newBtn.dataset.orderId;
            if (orderId && navigateCallback) {
                navigateCallback('orders', { view: orderId }, orderId);
            }
        });
    });
    DOM.dashboardSection?.querySelectorAll('.btn-view-service, .link-view-service').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = DOM.dashboardSection.querySelector(`[data-service-id="${btn.dataset.serviceId}"]`);
        newBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = newBtn.dataset.serviceId;
            if (serviceId && navigateCallback) {
                navigateCallback('services', { view: serviceId }, serviceId);
            }
        });
    });
    DOM.dashboardSection?.querySelectorAll('.btn-edit-product, .link-edit-product').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = DOM.dashboardSection.querySelector(`[data-product-id="${btn.dataset.productId}"]`);
        newBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = newBtn.dataset.productId;
            if (productId && navigateCallback) {
                navigateCallback('products', { edit: productId }, productId);
            }
        });
    });
    // Add listener for clickable KPI cards if using navigateCallback
    DOM.dashboardSection?.querySelectorAll('.kpi-card.clickable').forEach(card => {
        card.replaceWith(card.cloneNode(true));
        const newCard = DOM.dashboardSection.querySelector(`.kpi-card[data-target-section="${card.dataset.targetSection}"]`); // Re-select
        newCard?.addEventListener('click', () => {
            const targetSection = newCard.dataset.targetSection;
            const filterStatus = newCard.dataset.filterStatus;
            if (targetSection && navigateCallback) {
                const params = filterStatus ? { status: filterStatus } : {};
                navigateCallback(targetSection, params);
            }
        });
    });
    DOM.dashboardSection?.querySelectorAll('.view-all-link[data-section]').forEach(link => {
        link.replaceWith(link.cloneNode(true));
        const newLink = DOM.dashboardSection.querySelector(`.view-all-link[data-section="${link.dataset.section}"]`);
        newLink?.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = newLink.dataset.section;
            if (targetSection && navigateCallback) {
                navigateCallback(targetSection, {});
            }
        });
    });
}

console.log("Dashboard Section module loaded"); // Debug log