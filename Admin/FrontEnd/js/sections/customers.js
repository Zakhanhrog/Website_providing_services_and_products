// js/sections/customers.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import {
    showToast, formatAdminCurrency, showConfirmationModal,
    setButtonLoading, resetButtonLoading, displayTableEmptyState,
    showLoading, hideLoading, showElement, hideElement
} from '../utils.js';
import { renderPagination, setupTabs, hideListView, restoreListView } from '../ui.js'; // No table selection needed here yet
import { ITEMS_PER_PAGE } from '../config.js';

let currentCustomerParams = {}; // Store current filter/sort/page state
let isLoadingCustomerAction = false; // Flag for specific customer actions

// --- Customer List Logic ---

/**
 * Loads customer list data based on current parameters.
 * @param {object} params - Filter, sort, pagination parameters.
 * @param {Function} navigateCallback - Callback for pagination/navigation clicks.
 */
export async function loadCustomerListData(params = {}, navigateCallback) {
    currentCustomerParams = { limit: ITEMS_PER_PAGE, ...params };
    console.log("Loading customer list data with params:", currentCustomerParams);

    if (!DOM.customerTableBody) return;
    const customerListContainer = DOM.customersSection?.querySelector('.table-responsive');
    if (customerListContainer) showLoading(customerListContainer);
    hideElement(DOM.customerDetailView); // Ensure detail view is hidden

    try {
        const response = await apiService.getCustomers(currentCustomerParams);
        renderCustomerTable(response.data);
        renderPagination(DOM.customerPagination, response.pagination, 'customers', navigateCallback, currentCustomerParams);

    } catch (error) {
        showToast(`Lỗi tải danh sách khách hàng: ${error.message}`, 'error');
        displayTableEmptyState(DOM.customerTableBody, 'Không thể tải danh sách khách hàng.', 7); // 7 columns
        if (DOM.customerPagination) DOM.customerPagination.innerHTML = '';
    } finally {
        if (customerListContainer) hideLoading(customerListContainer);
    }
}

/** Renders rows for the customer table. */
function renderCustomerTable(customers) {
    if (!DOM.customerTableBody) return;
    if (!customers || customers.length === 0) {
        displayTableEmptyState(DOM.customerTableBody, 'Không tìm thấy khách hàng nào.', 7);
        return;
    }

    DOM.customerTableBody.innerHTML = customers.map(customer => `
        <tr data-customer-row-id="${customer.id}">
            <td><a href="#customers?view=${customer.id}" class="link-view-customer" data-customer-id="${customer.id}">${customer.name || 'N/A'}</a></td>
            <td>${customer.email || 'N/A'}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>${customer.registeredDate ? new Date(customer.registeredDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
            <td>${customer.orderCount ?? 0}</td>
            <td>${formatAdminCurrency(customer.totalSpent || 0)}</td>
            <td>
                <button type="button" class="btn-icon btn-view-customer" title="Xem chi tiết" data-customer-id="${customer.id}" aria-label="Xem chi tiết khách hàng ${customer.name || customer.id}"><i class="fas fa-eye"></i></button>
                <button type="button" class="btn-icon btn-email-customer" title="Gửi Email" data-customer-id="${customer.id}" data-customer-email="${customer.email || ''}" aria-label="Gửi email cho ${customer.name || customer.id}"><i class="fas fa-envelope"></i></button>
                <button type="button" class="btn-icon text-danger btn-delete-customer" title="Xóa Khách hàng" data-customer-id="${customer.id}" data-customer-name="${customer.name || customer.id}" aria-label="Xóa khách hàng ${customer.name || customer.id}"><i class="fas fa-user-times"></i></button>
            </td>
        </tr>
    `).join('');
}

/** Handles clicks within the Customer Table. */
export function handleCustomerTableClick(event, navigateCallback) {
    const viewButton = event.target.closest('.link-view-customer, .btn-view-customer');
    const emailButton = event.target.closest('.btn-email-customer');
    const deleteButton = event.target.closest('.btn-delete-customer');

    if (viewButton) {
        event.preventDefault();
        const customerId = viewButton.dataset.customerId;
        if (customerId && navigateCallback) {
            // Navigate using the callback
            navigateCallback('customers', { view: customerId }, customerId);
        }
    } else if (emailButton) {
        event.preventDefault();
        const customerEmail = emailButton.dataset.customerEmail;
        if (customerEmail) {
            window.location.href = `mailto:${customerEmail}`;
        } else {
            showToast("Không tìm thấy địa chỉ email cho khách hàng này.", "warning");
        }
    } else if (deleteButton) {
        event.preventDefault();
        const customerId = deleteButton.dataset.customerId;
        const customerName = deleteButton.dataset.customerName || `ID ${customerId}`;
        if (!customerId) return;
        handleDeleteCustomer(customerId, customerName, deleteButton, navigateCallback); // Call delete handler
    }
}

/** Handles deleting a customer. */
async function handleDeleteCustomer(customerId, customerName, deleteButtonElement, navigateCallback) {
    if (isLoadingCustomerAction) return;

    const confirmed = await showConfirmationModal(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"? Tất cả đơn hàng và dữ liệu liên quan có thể bị ảnh hưởng. Hành động này không thể hoàn tác.`);

    if (confirmed) {
        isLoadingCustomerAction = true;
        setButtonLoading(deleteButtonElement);
        try {
            await apiService.deleteCustomer(customerId);
            showToast(`Đã xóa khách hàng "${customerName}".`, 'success');
            // Remove row visually
            const row = DOM.customerTableBody.querySelector(`tr[data-customer-row-id="${customerId}"]`);
            row?.remove();
            // Optional: Reload list data if needed
            // loadCustomerListData(currentCustomerParams, navigateCallback);
        } catch (error) {
            showToast(`Lỗi khi xóa khách hàng: ${error.message}`, 'error');
        } finally {
            resetButtonLoading(deleteButtonElement);
            isLoadingCustomerAction = false;
        }
    }
}


// --- Customer Detail Logic ---

/**
 * Shows the Customer Detail view.
 * @param {string} customerId - ID of the customer to display.
 */
export async function showCustomerDetail(customerId) {
    if (!DOM.customerDetailView || !DOM.customerDetailContent || !DOM.customerDetailNameSpan || !DOM.customersSection) return;
    console.log(`Showing details for customer ${customerId}`);

    hideListView('customers');
    // Store customer ID on the view container for reference (e.g., saving notes)
    DOM.customerDetailView.dataset.customerId = customerId;
    showElement(DOM.customerDetailView);
    DOM.mainContent?.scrollTo(0, 0);
    showLoading(DOM.customerDetailContent);

    try {
        const customerData = await apiService.getCustomerDetail(customerId);
        renderCustomerDetail(customerData);
        // Setup tabs AFTER content structure is rendered
        setupTabs(DOM.customerDetailTabs, DOM.customerDetailTabContents);
    } catch (error) {
        showToast(`Lỗi tải chi tiết khách hàng: ${error.message}`, 'error');
        DOM.customerDetailContent.innerHTML = `<div class="empty-state p-4 text-danger">Không thể tải chi tiết cho khách hàng ID ${customerId}.<br>${error.message}</div>`;
    } finally {
        hideLoading(DOM.customerDetailContent);
    }
}

/** Renders the fetched customer data into the detail view tabs. */
function renderCustomerDetail(data) {
    if (!DOM.customerDetailContent || !data) return;

    DOM.customerDetailNameSpan.textContent = data.name || 'N/A';

    // --- Info Tab ---
    const infoTab = DOM.customerDetailContent.querySelector('#customer-info');
    if (infoTab) {
        infoTab.innerHTML = `
            <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
            <p><strong>Số điện thoại:</strong> ${data.phone || 'N/A'}</p>
            <p><strong>Ngày đăng ký:</strong> ${data.registeredDate ? new Date(data.registeredDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
            <hr>
            <p><strong>Tổng số đơn hàng:</strong> ${data.orderCount ?? 0}</p>
            <p><strong>Tổng chi tiêu:</strong> ${formatAdminCurrency(data.totalSpent || 0)}</p>
            <!-- Add more fields (customer group, tags, etc.) if needed -->
        `;
    }

    // --- Addresses Tab ---
    const addressesTab = DOM.customerDetailContent.querySelector('#customer-addresses');
    if (addressesTab) {
        let addressesHTML = '<p class="text-muted">Chưa có địa chỉ nào.</p>';
        if (data.addresses && data.addresses.length > 0) {
            addressesHTML = data.addresses.map(addr => `
                <div class="address-item">
                     <p><strong>${addr.street || ''}</strong></p>
                     <p>${addr.city || ''}, ${addr.country || ''}</p>
                     <div class="address-tags">
                         ${addr.isDefaultBilling ? '<span class="badge status-info">Thanh toán</span>' : ''}
                         ${addr.isDefaultShipping ? '<span class="badge status-success">Giao hàng</span>' : ''}
                     </div>
                     <div class="address-actions">
                         <button type="button" class="btn btn-xs btn-outline btn-edit-address" data-address-id="${addr.id}"><i class="fas fa-edit"></i> Sửa</button>
                         <button type="button" class="btn btn-xs btn-danger btn-delete-address" data-address-id="${addr.id}"><i class="fas fa-trash-alt"></i> Xóa</button>
                     </div>
                </div>
            `).join('');
        }
        addressesTab.innerHTML = `
              <div class="address-list">${addressesHTML}</div>
              <button type="button" class="btn btn-sm btn-secondary mt-3 btn-add-address">
                   <i class="fas fa-plus"></i> Thêm địa chỉ mới
              </button>
         `;
        // TODO: Add handlers for edit/delete/add address buttons
    }

    // --- Order History Tab ---
    const orderHistoryTab = DOM.customerDetailContent.querySelector('#customer-order-history');
    if (orderHistoryTab) {
        if (data.orderHistory && data.orderHistory.length > 0) {
            orderHistoryTab.innerHTML = `
                <div class="table-responsive">
                <table class="admin-table mini-table">
                    <thead><tr><th>Mã ĐH</th><th>Ngày</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead>
                    <tbody>
                        ${data.orderHistory.map(order => `
                            <tr>
                                <td><a href="#orders?view=${order.id}" class="link-view-order" data-order-id="${order.id}">#${order.id}</a></td>
                                <td>${new Date(order.date).toLocaleDateString('vi-VN')}</td>
                                <td>${formatAdminCurrency(order.total)}</td>
                                <td><span class="status status-${order.orderStatus}">${order.orderStatus}</span></td>
                                <td><a href="#orders?view=${order.id}" class="btn-icon btn-view-order" title="Xem" data-order-id="${order.id}" aria-label="Xem đơn hàng ${order.id}"><i class="fas fa-eye"></i></a></td>
                            </tr>`).join('')}
                    </tbody>
                </table>
                </div>`;
        } else {
            orderHistoryTab.innerHTML = '<p class="text-muted p-3">Chưa có lịch sử đơn hàng.</p>';
        }
    }

    // --- Service History Tab ---
    const serviceHistoryTab = DOM.customerDetailContent.querySelector('#customer-service-history');
    if (serviceHistoryTab) {
        if (data.serviceHistory && data.serviceHistory.length > 0) {
            serviceHistoryTab.innerHTML = `
                  <div class="table-responsive">
                  <table class="admin-table mini-table">
                      <thead><tr><th>Mã YC</th><th>Ngày</th><th>Loại</th><th>Trạng thái</th><th></th></tr></thead>
                      <tbody>
                          ${data.serviceHistory.map(service => `
                             <tr>
                                 <td><a href="#services?view=${service.id}" class="link-view-service" data-service-id="${service.id}">#${service.id}</a></td>
                                 <td>${new Date(service.date).toLocaleDateString('vi-VN')}</td>
                                 <td>${service.type}</td>
                                  <td><span class="status status-${service.status}">${service.status}</span></td>
                                  <td><a href="#services?view=${service.id}" class="btn-icon btn-view-service" title="Xem" data-service-id="${service.id}" aria-label="Xem yêu cầu ${service.id}"><i class="fas fa-eye"></i></a></td>
                             </tr>`).join('')}
                      </tbody>
                  </table>
                  </div>`;
        } else {
            serviceHistoryTab.innerHTML = '<p class="text-muted p-3">Chưa có lịch sử yêu cầu dịch vụ.</p>';
        }
    }

    // --- Admin Notes Tab ---
    const notesTab = DOM.customerDetailContent.querySelector('#customer-notes');
    if (notesTab) {
        let notesHTML = '<li>Chưa có ghi chú nào.</li>';
        if (data.adminNotes && data.adminNotes.length > 0) {
            notesHTML = data.adminNotes.map(note => `
                 <li>
                      <span class="history-timestamp">[${new Date(note.timestamp).toLocaleString('vi-VN')}]</span>
                      <strong class="history-user">${note.user}:</strong>
                      <span class="history-note">${note.note}</span>
                 </li>
             `).join('');
        }
        notesTab.innerHTML = `
              <div class="form-group">
                 <label for="customerAdminNote">Thêm ghi chú Admin</label>
                 <textarea id="customerAdminNote" class="form-control" rows="4" placeholder="Thêm ghi chú về khách hàng này..."></textarea>
              </div>
              <button type="button" class="btn btn-sm btn-secondary" id="saveCustomerNoteBtn"><i class="fas fa-save"></i> Lưu ghi chú</button>
              <h5 class="mt-3">Lịch sử ghi chú</h5>
              <ul class="activity-log mt-2">${notesHTML}</ul>
         `;
        // Add listener specifically for the newly rendered button
        notesTab.querySelector('#saveCustomerNoteBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            const customerId = DOM.customerDetailView?.dataset.customerId;
            if (customerId) handleSaveCustomerNote(customerId);
        });
    }
}

/** Handles saving a new admin note for the customer */
export async function handleSaveCustomerNote(customerId) {
    const notesTextarea = DOM.customerDetailView?.querySelector('#customerAdminNote');
    const saveButton = DOM.customerDetailView?.querySelector('#saveCustomerNoteBtn');

    if (!notesTextarea || !saveButton || isLoadingCustomerAction || !customerId) return;

    const noteContent = notesTextarea.value.trim();
    if (!noteContent) {
        showToast("Nội dung ghi chú không được để trống.", "warning");
        notesTextarea.focus();
        return;
    }

    isLoadingCustomerAction = true;
    setButtonLoading(saveButton, 'Đang lưu...');

    try {
        // Assuming the API handles adding the note based on customer ID and note content
        await apiService.saveCustomerDetail(customerId, { newAdminNote: noteContent });
        showToast("Ghi chú đã được lưu.", "success");

        // Reload the customer detail view to show the new note in history
        // This will re-render everything, including clearing the textarea
        await showCustomerDetail(customerId);

    } catch (error) {
        showToast(`Lỗi lưu ghi chú: ${error.message}`, 'error');
    } finally {
        // Button is re-rendered, so no need to reset loading state here
        // resetButtonLoading(saveButton);
        isLoadingCustomerAction = false;
    }
}

console.log("Customers Section module loaded"); // Debug log