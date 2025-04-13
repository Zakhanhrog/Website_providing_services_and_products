// js/sections/services.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import {
    showToast, formatAdminCurrency, showConfirmationModal,
    setButtonLoading, resetButtonLoading, displayTableEmptyState,
    showLoading, hideLoading, showElement, hideElement
} from '../utils.js';
import { renderPagination, setupTableSelection, getSelectedTableIds, resetTableSelection, hideListView, restoreListView } from '../ui.js';
import { ITEMS_PER_PAGE } from '../config.js';

let currentServiceParams = {}; // Store current filter/sort/page state
let isLoadingServiceAction = false; // Flag for specific service actions

// --- Service List Logic ---

/**
 * Loads service list data based on current parameters.
 * @param {object} params - Filter, sort, pagination parameters.
 * @param {Function} navigateCallback - Callback for pagination/navigation clicks.
 */
export async function loadServiceListData(params = {}, navigateCallback) {
    currentServiceParams = { limit: ITEMS_PER_PAGE, ...params };
    console.log("Loading service list data with params:", currentServiceParams);

    if (!DOM.serviceTableBody) { // Check for table body
        console.error("Service table body not found.");
        return;
    }
    const serviceListContainer = DOM.servicesSection?.querySelector('.table-responsive');
    if (serviceListContainer) showLoading(serviceListContainer);
    hideElement(DOM.serviceDetailView); // Ensure detail view is hidden

    try {
        const response = await apiService.getServices(currentServiceParams);
        renderServiceTable(response.data);
        renderPagination(DOM.servicePagination, response.pagination, 'services', navigateCallback, currentServiceParams);

        // No bulk actions for services in this example yet
        // setupTableSelection(...)

    } catch (error) {
        showToast(`Lỗi tải danh sách yêu cầu dịch vụ: ${error.message}`, 'error');
        displayTableEmptyState(DOM.serviceTableBody, 'Không thể tải danh sách yêu cầu dịch vụ.', 8); // 8 columns
        if (DOM.servicePagination) DOM.servicePagination.innerHTML = '';
    } finally {
        if (serviceListContainer) hideLoading(serviceListContainer);
    }
}

/** Renders rows for the service request table. */
function renderServiceTable(services) {
    if (!DOM.serviceTableBody) return;
    if (!services || services.length === 0) {
        displayTableEmptyState(DOM.serviceTableBody, 'Không tìm thấy yêu cầu dịch vụ nào.', 8);
        return;
    }

    DOM.serviceTableBody.innerHTML = services.map(service => `
        <tr data-service-row-id="${service.id}">
            <td><a href="#services?view=${service.id}" class="link-view-service" data-service-id="${service.id}">#${service.id}</a></td>
            <td><a href="#customers?view=${service.customerId}" class="link-view-customer" data-customer-id="${service.customerId}">${service.customerName || 'N/A'}</a></td>
            <td>${service.type || 'N/A'}</td>
            <td>${service.subject || 'N/A'}</td>
            <td>${new Date(service.date).toLocaleString('vi-VN')}</td>
            <td>
                 <label for="service-status-${service.id}" class="sr-only">Trạng thái dịch vụ ${service.id}</label>
                 <select id="service-status-${service.id}" class="form-control-sm status-dropdown service-status-dropdown" data-service-id="${service.id}" aria-label="Trạng thái dịch vụ ${service.id}">
                     ${getServiceStatusOptions(service.status)}
                 </select>
            </td>
            <td>
                 <label for="service-assignee-${service.id}" class="sr-only">Người phụ trách dịch vụ ${service.id}</label>
                 <select id="service-assignee-${service.id}" class="form-control-sm assignee-dropdown service-assignee-dropdown" data-service-id="${service.id}" aria-label="Người phụ trách dịch vụ ${service.id}">
                     ${getAssigneeOptions(service.assignee)}
                 </select>
            </td>
            <td>
                <button type="button" class="btn-icon btn-view-service" title="Xem chi tiết" data-service-id="${service.id}" aria-label="Xem chi tiết yêu cầu ${service.id}"><i class="fas fa-eye"></i></button>
                <!-- Add delete button if needed -->
                <!-- <button type="button" class="btn-icon btn-delete-service text-danger" title="Xóa YC" data-service-id="${service.id}"><i class="fas fa-trash-alt"></i></button> -->
            </td>
        </tr>
    `).join('');
}

/** Generates HTML options for the service status dropdown. */
function getServiceStatusOptions(currentStatus) {
    const statuses = {
        new: 'Mới',
        assigned: 'Đã tiếp nhận',
        processing: 'Đang xử lý',
        waiting: 'Chờ phản hồi', // Waiting for customer/parts etc.
        completed: 'Hoàn thành',
        closed: 'Đóng'
    };
    return Object.entries(statuses).map(([value, text]) =>
        `<option value="${value}" ${value === currentStatus ? 'selected' : ''}>${text}</option>`
    ).join('');
}

/** Generates HTML options for the assignee dropdown (placeholder). */
function getAssigneeOptions(currentAssignee) {
    // TODO: Fetch list of admins/staff from API instead of hardcoding
    const assignees = [
        { value: '', text: '-- Chưa gán --' }, // Unassigned represented by empty value
        { value: 'admin1', text: 'Admin Demo' },
        { value: 'staffA', text: 'Nhân viên A' },
        { value: 'staffB', text: 'Nhân viên B' }
    ];
    return assignees.map(assignee =>
        // Compare based on text name for simulation, API should use ID (value)
        `<option value="${assignee.value}" ${assignee.text === currentAssignee ? 'selected' : ''}>${assignee.text}</option>`
    ).join('');
}

/** Handles changes to inline dropdowns in the Service Table. */
export async function handleServiceInlineChange(event) {
    if (isLoadingServiceAction) return;
    const dropdown = event.target;
    const isStatusDropdown = dropdown.classList.contains('service-status-dropdown');
    const isAssigneeDropdown = dropdown.classList.contains('service-assignee-dropdown');

    if (!isStatusDropdown && !isAssigneeDropdown) return;

    const serviceId = dropdown.dataset.serviceId;
    const newValue = dropdown.value;
    const originalOption = Array.from(dropdown.options).find(opt => opt.defaultSelected);
    const originalValue = originalOption ? originalOption.value : dropdown.querySelector('option[selected]')?.value;


    if (!serviceId || newValue === originalValue) return;

    isLoadingServiceAction = true;
    dropdown.disabled = true;

    const updateData = {};
    let updateType = '';
    if (isStatusDropdown) {
        updateData.status = newValue;
        updateType = 'trạng thái';
    } else {
        // Send assignee ID or potentially clear if '-- Chưa gán --' is selected
        updateData.assignee = newValue || null; // Send null if empty value selected
        updateType = 'người phụ trách';
    }

    try {
        await apiService.updateService(serviceId, updateData);
        showToast(`Yêu cầu #${serviceId} đã cập nhật ${updateType}.`, 'success');

        // Update defaultSelected state after successful API call
        if (originalOption) originalOption.defaultSelected = false;
        const currentSelectedOption = dropdown.options[dropdown.selectedIndex];
        if (currentSelectedOption) currentSelectedOption.defaultSelected = true;

    } catch (error) {
        showToast(`Lỗi cập nhật yêu cầu #${serviceId}: ${error.message}`, 'error');
        // Revert dropdown selection on error
        dropdown.value = originalValue || '';
        const revertOption = dropdown.querySelector(`option[value="${originalValue}"]`);
        if(revertOption) revertOption.selected = true;
    } finally {
        dropdown.disabled = false;
        isLoadingServiceAction = false;
    }
}

// --- Service Detail Logic ---

/**
 * Shows the Service Detail view.
 * @param {string} serviceId - ID of the service request to display.
 */
export async function showServiceDetail(serviceId) {
    if (!DOM.serviceDetailView || !DOM.serviceDetailContent || !DOM.serviceDetailIdSpan || !DOM.servicesSection) return;
    console.log(`Showing details for service request ${serviceId}`);

    hideListView('services');
    showElement(DOM.serviceDetailView);
    DOM.serviceDetailIdSpan.textContent = serviceId;
    DOM.mainContent?.scrollTo(0, 0);
    showLoading(DOM.serviceDetailContent);

    try {
        const serviceData = await apiService.getServiceDetail(serviceId);
        renderServiceDetail(serviceData);
    } catch (error) {
        showToast(`Lỗi tải chi tiết yêu cầu dịch vụ: ${error.message}`, 'error');
        DOM.serviceDetailContent.innerHTML = `<div class="empty-state p-4 text-danger">Không thể tải chi tiết cho yêu cầu #${serviceId}.<br>${error.message}</div>`;
    } finally {
        hideLoading(DOM.serviceDetailContent);
    }
}

/** Renders the fetched service data into the detail view placeholder. */
function renderServiceDetail(data) {
    if (!DOM.serviceDetailContent || !data) return;

    const customerName = data.customer?.name || 'N/A';
    const customerEmail = data.customer?.email || 'N/A';
    const customerLink = data.customer?.id ? `href="#customers?view=${data.customer.id}"` : 'href="#"';

    // Render attachments
    let attachmentsHTML = '<li>Không có file đính kèm.</li>';
    if (data.attachments && data.attachments.length > 0) {
        attachmentsHTML = data.attachments.map(att => `
            <li><a href="${att.url}" target="_blank" download="${att.name}"><i class="fas fa-paperclip"></i> ${att.name}</a></li>
        `).join('');
    }

    // Render notes history
    let notesHTML = '<li>Chưa có ghi chú.</li>';
    if (data.notes && data.notes.length > 0) {
        notesHTML = data.notes.map(n => `
            <li>
                 <span class="history-timestamp">[${new Date(n.timestamp).toLocaleString('vi-VN')}]</span>
                 <strong class="history-user">${n.user}:</strong>
                 <span class="history-note">${n.note}</span>
            </li>`).join('');
    }

    DOM.serviceDetailContent.innerHTML = `
        <div class="service-detail-grid">
             <div class="service-detail-col">
                 <h4>Thông tin Yêu cầu</h4>
                 <p><strong>Loại:</strong> <span id="detailServiceType">${data.type || 'N/A'}</span></p>
                 <p><strong>Chủ đề:</strong> <span id="detailServiceSubject">${data.subject || 'N/A'}</span></p>
                 <p><strong>Ngày gửi:</strong> <span id="detailServiceDate">${new Date(data.date).toLocaleString('vi-VN')}</span></p>
                 <div class="form-group inline-update">
                     <label for="detailServiceStatus"><strong>Trạng thái:</strong></label>
                     <select id="detailServiceStatus" name="status" class="form-control-sm">
                         ${getServiceStatusOptions(data.status)}
                     </select>
                 </div>
                 <div class="form-group inline-update">
                     <label for="detailServiceAssignee"><strong>Phụ trách:</strong></label>
                     <select id="detailServiceAssignee" name="assignee" class="form-control-sm">
                         ${getAssigneeOptions(data.assignee)}
                     </select>
                 </div>
             </div>
             <div class="service-detail-col">
                 <h4>Khách hàng</h4>
                 <p><a ${customerLink} id="detailServiceCustomerLink" class="link-view-customer" data-customer-id="${data.customer?.id}">${customerName}</a></p>
                 <p><i class="fas fa-envelope fa-fw text-muted"></i> <span id="detailServiceCustomerEmail">${customerEmail}</span></p>
                 <h4>Mô tả chi tiết</h4>
                 <p id="detailServiceDescription" class="note-box">${data.description || 'Không có mô tả.'}</p>
                 <h4>File đính kèm</h4>
                 <ul id="detailServiceAttachments" class="attachment-list">${attachmentsHTML}</ul>
             </div>
        </div>
        <div class="internal-notes-section">
            <h4>Ghi chú / Trao đổi nội bộ</h4>
            <div class="form-group">
               <label for="serviceInternalNote" class="sr-only">Thêm ghi chú nội bộ</label>
               <textarea id="serviceInternalNote" name="serviceInternalNote" class="form-control" rows="3" placeholder="Thêm ghi chú mới..."></textarea>
            </div>
            <button type="button" class="btn btn-sm btn-secondary btn-add-service-note"><i class="fas fa-plus"></i> Thêm ghi chú</button>
            <ul id="serviceNoteHistory" class="activity-log mt-2">${notesHTML}</ul>
        </div>
    `;
}

/** Handles saving changes made in the service detail view */
export async function handleSaveServiceDetail(serviceId) {
    if (!DOM.serviceDetailView || isLoadingServiceAction) return;

    const saveButton = DOM.serviceDetailView.querySelector('#saveServiceDetailBtn');
    isLoadingServiceAction = true;
    if(saveButton) setButtonLoading(saveButton);

    try {
        const newStatus = DOM.serviceDetailView.querySelector('#detailServiceStatus')?.value;
        const newAssignee = DOM.serviceDetailView.querySelector('#detailServiceAssignee')?.value;
        const newNote = DOM.serviceDetailView.querySelector('#serviceInternalNote')?.value.trim();

        const updatedData = {
            status: newStatus,
            assignee: newAssignee || null, // Send null if unassigned
        };
        if (newNote) {
            updatedData.newNote = newNote;
        }

        await apiService.updateService(serviceId, updatedData);
        showToast(`Yêu cầu #${serviceId} đã được cập nhật.`, 'success');

        // Reload detail view to show updated notes/history
        await showServiceDetail(serviceId);

    } catch (error) {
        showToast(`Lỗi lưu chi tiết yêu cầu dịch vụ: ${error.message}`, 'error');
    } finally {
        if(saveButton) resetButtonLoading(saveButton);
        isLoadingServiceAction = false;
    }
}

console.log("Services Section module loaded"); // Debug log