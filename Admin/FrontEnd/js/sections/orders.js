// js/sections/orders.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import {
    showToast, formatAdminCurrency, showConfirmationModal,
    setButtonLoading, resetButtonLoading, displayTableEmptyState,
    showLoading, hideLoading, showElement, hideElement
} from '../utils.js';
import { renderPagination, setupTableSelection, getSelectedTableIds, resetTableSelection, hideListView, restoreListView, setupTabs } from '../ui.js';
import { ITEMS_PER_PAGE } from '../config.js';

let currentOrderParams = {}; // Store current filter/sort/page state
let isLoadingOrderAction = false; // Flag for specific order actions

// --- Order List Logic ---

/**
 * Loads order list data based on current parameters.
 * @param {object} params - Filter, sort, pagination parameters.
 * @param {Function} navigateCallback - Callback for pagination/navigation clicks.
 */
export async function loadOrderListData(params = {}, navigateCallback) {
    currentOrderParams = { limit: ITEMS_PER_PAGE, ...params };
    console.log("Loading order list data with params:", currentOrderParams);

    if (!DOM.orderListView || !DOM.orderTableBody) return;
    showLoading(DOM.orderListView);
    hideElement(DOM.orderDetailView); // Ensure detail view is hidden when loading list

    try {
        const response = await apiService.getOrders(currentOrderParams);
        renderOrderTable(response.data);
        renderPagination(DOM.orderPagination, response.pagination, 'orders', navigateCallback, currentOrderParams);

        // Re-initialize table selection
        setupTableSelection(
            DOM.selectAllOrdersCheckbox,
            '.order-checkbox',
            DOM.ordersSection,
            DOM.applyOrderBulkActionBtn,
            DOM.orderBulkActionSelect
        );
        if (DOM.orderBulkActionSelect) DOM.orderBulkActionSelect.value = '';

    } catch (error) {
        showToast(`Lỗi tải danh sách đơn hàng: ${error.message}`, 'error');
        displayTableEmptyState(DOM.orderTableBody, 'Không thể tải danh sách đơn hàng.', 8); // 8 columns
        if (DOM.orderPagination) DOM.orderPagination.innerHTML = '';
    } finally {
        hideLoading(DOM.orderListView);
    }
}

/** Renders rows for the order table. */
function renderOrderTable(orders) {
    if (!DOM.orderTableBody) return;
    if (!orders || orders.length === 0) {
        displayTableEmptyState(DOM.orderTableBody, 'Không tìm thấy đơn hàng nào.', 8);
        return;
    }

    DOM.orderTableBody.innerHTML = orders.map(order => {
        const paymentStatusText = getPaymentStatusText(order.paymentStatus);
        const paymentStatusClass = getPaymentStatusClass(order.paymentStatus);
        const paymentTitle = getPaymentStatusTitle(order.paymentStatus, order.paymentMethod);

        return `
            <tr class="${order.orderStatus === 'pending' ? 'order-new' : ''}" data-order-row-id="${order.id}">
                <td><input type="checkbox" class="order-checkbox" value="${order.id}" aria-label="Chọn đơn hàng ${order.id}"></td>
                <td><a href="#orders?view=${order.id}" class="link-view-order" data-order-id="${order.id}">#${order.id}</a></td>
                <td><a href="#customers?view=${order.customerId}" class="link-view-customer" data-customer-id="${order.customerId}">${order.customerName || 'N/A'}</a></td>
                <td>${new Date(order.date).toLocaleString('vi-VN')}</td>
                <td>${formatAdminCurrency(order.total)}</td>
                <td><span class="status status-${paymentStatusClass}" title="${paymentTitle}">${paymentStatusText}</span></td>
                <td>
                     <label for="status-${order.id}" class="sr-only">Trạng thái đơn hàng ${order.id}</label>
                     <select id="status-${order.id}" class="form-control-sm status-dropdown order-status-dropdown" data-order-id="${order.id}" aria-label="Trạng thái đơn hàng ${order.id}">
                        ${getOrderStatusOptions(order.orderStatus)}
                     </select>
                </td>
                <td>
                    <button type="button" class="btn-icon btn-view-order" title="Xem chi tiết" data-order-id="${order.id}" aria-label="Xem chi tiết đơn hàng ${order.id}"><i class="fas fa-eye"></i></button>
                    <button type="button" class="btn-icon btn-print-invoice" title="In hóa đơn" data-order-id="${order.id}" aria-label="In hóa đơn ${order.id}"><i class="fas fa-print"></i></button>
                 </td>
            </tr>
        `;
    }).join('');
}

/** Generates HTML options for the order status dropdown. */
export function getOrderStatusOptions(currentStatus) {
    const statuses = {
        pending: 'Chờ xử lý',
        processing: 'Đang chuẩn bị',
        shipped: 'Đang giao',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy',
        // Add other potential statuses like 'refunded', 'on-hold' if needed
    };
    return Object.entries(statuses).map(([value, text]) =>
        `<option value="${value}" ${value === currentStatus ? 'selected' : ''}>${text}</option>`
    ).join('');
}

/** Gets display text for payment status */
function getPaymentStatusText(status) {
    const statuses = { paid: 'Đã TT', pending: 'Chưa TT', failed: 'Lỗi', refunded: 'Hoàn tiền', partially_refunded: 'Hoàn tiền 1 phần' };
    return statuses[status] || status;
}
/** Gets CSS class for payment status */
function getPaymentStatusClass(status) {
    const classes = { paid: 'paid', pending: 'unpaid', failed: 'failed', refunded: 'archived', partially_refunded: 'warning' };
    return classes[status] || 'pending';
}
/** Gets title attribute text for payment status */
function getPaymentStatusTitle(status, method) {
    let title = getPaymentStatusText(status);
    if (status === 'paid' && method) {
        title += ` (${method})`;
    } else if (status === 'pending' && method === 'COD') {
        title += ' (COD)';
    }
    return title;
}

/** Handles changes to inline status dropdowns in the Order Table. */
export async function handleOrderInlineStatusChange(event) {
    const dropdown = event.target;
    if (!dropdown.classList.contains('order-status-dropdown') || isLoadingOrderAction) {
        return;
    }

    const orderId = dropdown.dataset.orderId;
    const newStatus = dropdown.value;
    // Find the previously selected option to revert on error
    const originalOption = Array.from(dropdown.options).find(opt => opt.defaultSelected);
    const originalStatus = originalOption ? originalOption.value : dropdown.querySelector('option[selected]')?.value; // Fallback

    if (!orderId || !newStatus || newStatus === originalStatus) {
        return; // No change or invalid data
    }

    isLoadingOrderAction = true;
    dropdown.disabled = true; // Disable dropdown during update

    try {
        await apiService.updateOrderStatus(orderId, newStatus);
        showToast(`Trạng thái đơn hàng #${orderId} đã được cập nhật.`, 'success');

        // Update the selected and defaultSelected attributes for future checks
        if (originalOption) originalOption.defaultSelected = false;
        const newSelectedOption = dropdown.querySelector(`option[value="${newStatus}"]`);
        if(newSelectedOption) newSelectedOption.selected = true;
        // Update defaultSelected state after successful API call
        const currentSelectedOption = dropdown.options[dropdown.selectedIndex];
        if (currentSelectedOption) currentSelectedOption.defaultSelected = true;


    } catch (error) {
        showToast(`Lỗi cập nhật trạng thái đơn hàng #${orderId}: ${error.message}`, 'error');
        // Revert dropdown selection on error
        dropdown.value = originalStatus || '';
        const revertOption = dropdown.querySelector(`option[value="${originalStatus}"]`);
        if(revertOption) revertOption.selected = true;

    } finally {
        dropdown.disabled = false;
        isLoadingOrderAction = false;
    }
}

// --- Order Detail Logic ---

/**
 * Shows the Order Detail view.
 * @param {string} orderId - ID of the order to display.
 */
export async function showOrderDetail(orderId) {
    if (!DOM.orderDetailView || !DOM.orderDetailContent || !DOM.orderDetailIdSpan || !DOM.ordersSection) return;
    console.log(`Showing details for order ${orderId}`);

    hideListView('orders'); // Hide list view elements
    showElement(DOM.orderDetailView);
    DOM.orderDetailIdSpan.textContent = orderId;
    DOM.mainContent?.scrollTo(0, 0);
    showLoading(DOM.orderDetailContent); // Show loading within the detail content area

    try {
        const orderData = await apiService.getOrderDetail(orderId);
        renderOrderDetail(orderData);
    } catch (error) {
        showToast(`Lỗi tải chi tiết đơn hàng: ${error.message}`, 'error');
        // Display error directly in the content area
        DOM.orderDetailContent.innerHTML = `<div class="empty-state p-4 text-danger">Không thể tải chi tiết cho đơn hàng #${orderId}.<br>${error.message}</div>`;
    } finally {
        hideLoading(DOM.orderDetailContent);
    }
}

/** Renders the fetched order data into the detail view placeholder. */
function renderOrderDetail(data) {
    if (!DOM.orderDetailContent || !data) return;

    const customerName = data.customer?.name || 'N/A';
    const customerEmail = data.customer?.email || 'N/A';
    const customerPhone = data.customer?.phone || 'N/A';
    const customerLink = data.customer?.id ? `href="#customers?view=${data.customer.id}"` : 'href="#"';

    const shippingAddr = data.shippingAddress ? `${data.shippingAddress.street}, ${data.shippingAddress.city}, ${data.shippingAddress.country}` : 'N/A';
    // Add billing address if available and different
    const billingAddr = data.billingAddress ? `${data.billingAddress.street}, ${data.billingAddress.city}, ${data.billingAddress.country}` : shippingAddr; // Default to shipping if missing

    const paymentStatusText = getPaymentStatusText(data.paymentStatus);
    const paymentMethodText = data.paymentMethod ? `(${data.paymentMethod})` : '';

    // Render order items
    let itemsHTML = '<li>Không có sản phẩm.</li>';
    if (data.items && data.items.length > 0) {
        itemsHTML = data.items.map(item => `
            <li>
                (${item.quantity}x)
                <a href="#products?edit=${item.productId}" target="_blank" class="product-link" title="Xem sản phẩm ${item.name}">${item.name}</a>
                <span>${formatAdminCurrency(item.price * item.quantity)}</span>
            </li>
        `).join('');
    }

    // Render order history
    let historyHTML = '<li>Không có lịch sử.</li>';
    if (data.history && data.history.length > 0) {
        historyHTML = data.history.map(h => `
            <li>
                <span class="history-timestamp">[${new Date(h.timestamp).toLocaleString('vi-VN')}]</span>
                <span class="history-status">Trạng thái: <strong>${h.status}</strong></span>
                ${h.user ? `<span class="history-user">(bởi ${h.user})</span>` : ''}
            </li>`).join('');
    }

    // Render internal notes history
    let internalNotesHTML = '<li>Chưa có ghi chú nội bộ.</li>';
    if (data.internalNotes && data.internalNotes.length > 0) {
        internalNotesHTML = data.internalNotes.map(n => `
             <li>
                 <span class="history-timestamp">[${new Date(n.timestamp).toLocaleString('vi-VN')}]</span>
                 <strong class="history-user">${n.user}:</strong>
                 <span class="history-note">${n.note}</span>
             </li>`).join('');
    }


    // Construct the full detail view HTML
    DOM.orderDetailContent.innerHTML = `
        <div class="order-detail-grid">
            <div class="order-detail-col">
                <h4>Thông tin chung</h4>
                <p><strong>Ngày đặt:</strong> <span id="detailOrderDate">${new Date(data.date).toLocaleString('vi-VN')}</span></p>
                <div class="form-group inline-update">
                    <label for="detailOrderStatus"><strong>Trạng thái:</strong></label>
                    <select class="form-control-sm" id="detailOrderStatus" name="status">
                         ${getOrderStatusOptions(data.orderStatus)}
                    </select>
                </div>
                <h4>Khách hàng</h4>
                <p><a ${customerLink} id="detailCustomerLink" class="link-view-customer" data-customer-id="${data.customer?.id}">${customerName}</a></p>
                <p><i class="fas fa-envelope fa-fw text-muted"></i> <span id="detailCustomerEmail">${customerEmail}</span></p>
                <p><i class="fas fa-phone fa-fw text-muted"></i> <span id="detailCustomerPhone">${customerPhone}</span></p>
            </div>
            <div class="order-detail-col">
                <h4>Sản phẩm (<span id="totalItemCount">${data.items?.length || 0}</span>)</h4>
                <ul id="detailProductList" class="detail-item-list">${itemsHTML}</ul>
                <h4>Tổng cộng</h4>
                <table class="totals-table">
                    <tbody>
                        <tr><td>Tạm tính:</td><td id="detailSubtotal">${formatAdminCurrency(data.subtotal)}</td></tr>
                        <tr><td>Phí vận chuyển:</td><td id="detailShipping">${formatAdminCurrency(data.shippingCost)}</td></tr>
                        <tr><td><strong>Tổng cộng:</strong></td><td id="detailGrandTotal">${formatAdminCurrency(data.grandTotal)}</td></tr>
                    </tbody>
                </table>
                <p><strong>Thanh toán:</strong> <span id="detailPaymentMethod" class="status status-${getPaymentStatusClass(data.paymentStatus)}">${paymentStatusText} ${paymentMethodText}</span></p>
            </div>
            <div class="order-detail-col">
                <h4>Vận chuyển & Ghi chú</h4>
                <p><strong>Địa chỉ GH:</strong> <span id="detailShippingAddress">${shippingAddr}</span></p>
                ${billingAddr !== shippingAddr ? `<p><strong>Địa chỉ TT:</strong> <span id="detailBillingAddress">${billingAddr}</span></p>` : ''}
                <p><strong>Phương thức:</strong> <span id="detailShippingMethod">${data.shippingMethod || 'N/A'}</span></p>
                <div class="form-group inline-update">
                    <label for="trackingCode"><strong>Mã vận đơn:</strong></label>
                    <input type="text" id="trackingCode" name="trackingCode" class="form-control-sm" value="${data.trackingCode || ''}" placeholder="Nhập mã vận đơn">
                </div>
                <h4>Ghi chú Khách hàng</h4>
                <p id="detailCustomerNote" class="note-box">${data.customerNote || 'Không có'}</p>
            </div>
        </div>

        <div class="internal-notes-section">
             <h4>Ghi chú & Lịch sử</h4>
             <div class="tabs note-history-tabs" role="tablist">
                  <button type="button" class="tab-link active" data-tab="internal-notes-panel" role="tab" aria-controls="internal-notes-panel" aria-selected="true">Ghi chú nội bộ</button>
                  <button type="button" class="tab-link" data-tab="order-history-panel" role="tab" aria-controls="order-history-panel" aria-selected="false">Lịch sử đơn hàng</button>
             </div>
             <div id="internal-notes-panel" class="tab-content active" role="tabpanel" aria-labelledby="internal-notes-tab">
                  <div class="form-group mt-2">
                      <label for="internalNote" class="sr-only">Thêm ghi chú nội bộ</label>
                      <textarea id="internalNote" name="internalNote" class="form-control" rows="3" placeholder="Thêm ghi chú mới..."></textarea>
                      <button type="button" class="btn btn-sm btn-secondary btn-add-note mt-2"><i class="fas fa-plus"></i> Thêm ghi chú</button>
                  </div>
                  <ul id="internalNotesHistory" class="activity-log mt-2">${internalNotesHTML}</ul>
             </div>
             <div id="order-history-panel" class="tab-content" role="tabpanel" aria-labelledby="order-history-tab">
                  <ul id="detailOrderHistory" class="activity-log mt-2">${historyHTML}</ul>
             </div>
        </div>
    `;

    // Setup tabs for notes/history
    const noteTabs = DOM.orderDetailContent.querySelector('.note-history-tabs .tab-link');
    const noteTabContents = DOM.orderDetailContent.querySelectorAll('.internal-notes-section > .tab-content');
    if (noteTabs && noteTabContents) {
        setupTabs(noteTabs, noteTabContents);
    }
}

/** Handles saving changes made in the order detail view */
export async function handleSaveOrderDetail(orderId) {
    if (!DOM.orderDetailView || isLoadingOrderAction) return;

    const saveButton = DOM.orderDetailView.querySelector('#saveOrderDetailBtn'); // Find the specific save button
    isLoadingOrderAction = true;
    if(saveButton) setButtonLoading(saveButton);

    try {
        // Gather data from the detail view form elements
        const newStatus = DOM.orderDetailView.querySelector('#detailOrderStatus')?.value;
        const newTrackingCode = DOM.orderDetailView.querySelector('#trackingCode')?.value;
        const newInternalNote = DOM.orderDetailView.querySelector('#internalNote')?.value.trim();

        const updatedData = {
            status: newStatus,
            trackingCode: newTrackingCode,
            // Add other editable fields if any
        };
        // Add new internal note only if it's not empty
        if (newInternalNote) {
            updatedData.newInternalNote = newInternalNote;
        }

        await apiService.saveOrderDetail(orderId, updatedData);
        showToast(`Đơn hàng #${orderId} đã được cập nhật.`, 'success');

        // Reload the detail view to show updated history/notes
        // Pass the current orderId again
        await showOrderDetail(orderId);

        // Clear the new note textarea after successful save (if it was added)
        // const noteTextarea = DOM.orderDetailView.querySelector('#internalNote');
        // if (newInternalNote && noteTextarea) {
        //    noteTextarea.value = ''; // Cleared by reload now
        // }

    } catch (error) {
        showToast(`Lỗi lưu chi tiết đơn hàng: ${error.message}`, 'error');
        // Potentially display specific field errors if API returns them
    } finally {
        if(saveButton) resetButtonLoading(saveButton);
        isLoadingOrderAction = false;
    }
}

/** Handles printing the invoice (placeholder). */
export function handlePrintInvoice(orderId) {
    if (!orderId) return;
    console.log(`Placeholder: Printing invoice for order ${orderId}`);
    showToast(`Chức năng in hóa đơn ${orderId} chưa được cài đặt.`, 'info');
    // TODO: Implement print logic
    // Option 1: Open a new window/tab with a print-friendly view
    // window.open(`/admin/orders/${orderId}/print-invoice`, '_blank');
    // Option 2: Use browser's print API on a specific element (less ideal for complex invoices)
    // const printableArea = document.getElementById('orderDetailContentPlaceholder'); // Or a specific sub-element
    // if(printableArea) window.print(); // Needs print-specific CSS (@media print)
}

/** Handles applying bulk actions for orders. */
export async function handleOrderBulkAction(navigateCallback) {
    if (isLoadingOrderAction) return;
    const selectedAction = DOM.orderBulkActionSelect?.value;
    const selectedOrderIds = getSelectedTableIds('.order-checkbox', DOM.ordersSection);

    if (!selectedAction || selectedOrderIds.length === 0) {
        showToast('Vui lòng chọn hành động và ít nhất một đơn hàng.', 'warning');
        return;
    }

    const actionText = DOM.orderBulkActionSelect.options[DOM.orderBulkActionSelect.selectedIndex].text;

    // Special handling for print actions
    if (selectedAction.startsWith('print_')) {
        console.log(`Placeholder: Bulk printing (${actionText}) for ${selectedOrderIds.length} orders.`);
        showToast(`Chức năng in hàng loạt (${actionText}) chưa được cài đặt.`, 'info');
        // TODO: Implement bulk print logic (e.g., generate combined PDF or open multiple print dialogs)
        return;
    }

    // Confirmation for other actions
    const confirmed = await showConfirmationModal(`Bạn có chắc chắn muốn "${actionText}" cho ${selectedOrderIds.length} đơn hàng đã chọn?`);

    if (confirmed) {
        isLoadingOrderAction = true;
        setButtonLoading(DOM.applyOrderBulkActionBtn);
        try {
            const result = await apiService.applyOrderBulkAction(selectedAction, selectedOrderIds);
            showToast(result.message || `Đã áp dụng "${actionText}" thành công.`, 'success');

            // Reset selection and reload list
            resetTableSelection(
                DOM.selectAllOrdersCheckbox,
                '.order-checkbox',
                DOM.ordersSection,
                DOM.applyOrderBulkActionBtn,
                DOM.orderBulkActionSelect
            );
            loadOrderListData(currentOrderParams, navigateCallback); // Refresh list

        } catch (error) {
            showToast(`Lỗi khi áp dụng hành động hàng loạt: ${error.message}`, 'error');
        } finally {
            resetButtonLoading(DOM.applyOrderBulkActionBtn);
            isLoadingOrderAction = false;
        }
    }
}


console.log("Orders Section module loaded"); // Debug log