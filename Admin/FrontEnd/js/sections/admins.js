// js/sections/admins.js

import apiService from '../api.js';
import * as DOM from '../domElements.js';
import {
    showToast, showConfirmationModal, setButtonLoading, resetButtonLoading,
    showLoading, hideLoading, displayTableEmptyState
} from '../utils.js';
import { renderPagination } from '../ui.js'; // No table selection planned here yet
import { ITEMS_PER_PAGE } from '../config.js';

let currentAdminParams = {};
let isLoadingAdminAction = false;

/**
 * Loads admin account list data.
 * @param {object} params - Filter, sort, pagination parameters.
 * @param {Function} navigateCallback - Callback for pagination/navigation clicks.
 */
export async function loadAdminListData(params = {}, navigateCallback) {
    currentAdminParams = { limit: ITEMS_PER_PAGE, ...params };
    console.log("Loading admin list data with params:", currentAdminParams);

    if (!DOM.adminAccountsTableBody) return;
    const adminListContainer = DOM.adminsSection?.querySelector('.table-responsive');
    if (adminListContainer) showLoading(adminListContainer);
    // Hide admin form if it exists
    // hideElement(DOM.adminFormContainer);

    try {
        // const response = await apiService.getAdminAccounts(currentAdminParams);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 400));
        const response = {
            data: [ // Sample static data
                { id: 1, name: 'Admin Demo', email: 'admin.demo@techshop.example', role: 'Super Admin', status: 'active', lastLogin: '2023-12-25T11:00:00' },
                { id: 2, name: 'Nhân viên A', email: 'nhanvien.a@techshop.example', role: 'Quản lý Đơn hàng', status: 'active', lastLogin: '2023-12-24T16:30:00' },
                { id: 3, name: 'Nhân viên B', email: 'nhanvien.b@techshop.example', role: 'Biên tập viên', status: 'inactive', lastLogin: '2023-12-10T08:00:00' },
            ],
            pagination: { totalItems: 3, currentPage: 1, itemsPerPage: 10, totalPages: 1 }
        };
        // --- End Simulation ---

        renderAdminTable(response.data);
        // renderPagination(DOM.adminPagination, response.pagination, 'admins', navigateCallback, currentAdminParams); // Needs pagination container

    } catch (error) {
        showToast(`Lỗi tải danh sách admin: ${error.message}`, 'error');
        displayTableEmptyState(DOM.adminAccountsTableBody, 'Không thể tải danh sách tài khoản admin.', 6); // 6 columns
        // if (DOM.adminPagination) DOM.adminPagination.innerHTML = '';
    } finally {
        if (adminListContainer) hideLoading(adminListContainer);
    }
}

/** Renders rows for the admin accounts table. */
function renderAdminTable(admins) {
    if (!DOM.adminAccountsTableBody) return;
    if (!admins || admins.length === 0) {
        displayTableEmptyState(DOM.adminAccountsTableBody, 'Không tìm thấy tài khoản admin nào.', 6);
        return;
    }

    DOM.adminAccountsTableBody.innerHTML = admins.map(admin => {
        const statusText = admin.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa';
        const statusClass = admin.status === 'active' ? 'active' : 'inactive';
        const lastLogin = admin.lastLogin ? new Date(admin.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập';

        return `
            <tr data-admin-id="${admin.id}">
                <td>${admin.name || 'N/A'}</td>
                <td>${admin.email || 'N/A'}</td>
                <td>${admin.role || 'N/A'}</td>
                <td><span class="status status-${statusClass}">${statusText}</span></td>
                <td>${lastLogin}</td>
                <td>
                    <button type="button" class="btn-icon btn-edit-admin" title="Sửa" data-admin-id="${admin.id}" aria-label="Sửa tài khoản ${admin.name}"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn-icon btn-change-password-admin" title="Đổi mật khẩu" data-admin-id="${admin.id}" aria-label="Đổi mật khẩu ${admin.name}"><i class="fas fa-key"></i></button>
                    ${admin.status === 'active'
            ? `<button type="button" class="btn-icon text-danger btn-disable-admin" title="Vô hiệu hóa" data-admin-id="${admin.id}" data-admin-name="${admin.name}" aria-label="Vô hiệu hóa ${admin.name}"><i class="fas fa-user-slash"></i></button>`
            : `<button type="button" class="btn-icon text-success btn-enable-admin" title="Kích hoạt" data-admin-id="${admin.id}" data-admin-name="${admin.name}" aria-label="Kích hoạt ${admin.name}"><i class="fas fa-user-check"></i></button>`
        }
                    <!-- Maybe a delete button if super admin? -->
                    <!-- <button type="button" class="btn-icon text-danger btn-delete-admin" title="Xóa vĩnh viễn" data-admin-id="${admin.id}"><i class="fas fa-trash-alt"></i></button> -->
                </td>
            </tr>
        `;
    }).join('');
}

// --- Placeholder functions for showing form, handling actions ---

export function showAdminForm(adminId = null) {
    console.log(`Placeholder: Show Admin Form for ID: ${adminId || 'New'}`);
    // 1. Hide list view
    // 2. Show form container
    // 3. Reset form
    // 4. If adminId, fetch details using apiService.getAdminDetail(adminId)
    // 5. Populate form with data (handle roles, status)
    // 6. Initialize any necessary form components (e.g., role select)
    showToast("Chức năng Thêm/Sửa Admin chưa được cài đặt.", "info");
}

export function hideAdminForm() {
    console.log("Placeholder: Hide Admin Form");
    // 1. Hide form container
    // 2. Restore list view
}

export async function handleAdminFormSubmit(event) {
    event.preventDefault();
    if (isLoadingAdminAction) return;
    console.log("Placeholder: Submitting Admin Form...");
    // 1. Validate form
    // 2. Set loading state
    // 3. Gather form data (including permissions/roles if applicable)
    // 4. Get adminId from form dataset if editing
    // 5. Call apiService.saveAdminAccount(formData, adminId)
    // 6. Handle success (show toast, hide form, reload list)
    // 7. Handle error (show toast, display validation errors)
    // 8. Reset loading state
}

export async function handleAdminActionClick(event) {
    if (isLoadingAdminAction) return;
    const editBtn = event.target.closest('.btn-edit-admin');
    const changePwdBtn = event.target.closest('.btn-change-password-admin');
    const disableBtn = event.target.closest('.btn-disable-admin');
    const enableBtn = event.target.closest('.btn-enable-admin');
    const deleteBtn = event.target.closest('.btn-delete-admin'); // If implemented

    if (editBtn) {
        const adminId = editBtn.dataset.adminId;
        showAdminForm(adminId);
    } else if (changePwdBtn) {
        const adminId = changePwdBtn.dataset.adminId;
        console.log(`Placeholder: Show Change Password Modal for Admin ID: ${adminId}`);
        showToast("Chức năng đổi mật khẩu chưa được cài đặt.", "info");
    } else if (disableBtn) {
        const adminId = disableBtn.dataset.adminId;
        const adminName = disableBtn.dataset.adminName || `ID ${adminId}`;
        console.log(`Placeholder: Disable Admin ID: ${adminId}`);
        const confirmed = await showConfirmationModal(`Bạn có chắc muốn vô hiệu hóa tài khoản "${adminName}"?`);
        if (confirmed) { /* Call API to disable */ }
        showToast("Chức năng vô hiệu hóa Admin chưa được cài đặt.", "info");
    } else if (enableBtn) {
        const adminId = enableBtn.dataset.adminId;
        const adminName = enableBtn.dataset.adminName || `ID ${adminId}`;
        console.log(`Placeholder: Enable Admin ID: ${adminId}`);
        const confirmed = await showConfirmationModal(`Bạn có chắc muốn kích hoạt lại tài khoản "${adminName}"?`);
        if (confirmed) { /* Call API to enable */ }
        showToast("Chức năng kích hoạt Admin chưa được cài đặt.", "info");
    } else if (deleteBtn) {
        const adminId = deleteBtn.dataset.adminId;
        const adminName = deleteBtn.dataset.adminName || `ID ${adminId}`;
        console.log(`Placeholder: Delete Admin ID: ${adminId}`);
        const confirmed = await showConfirmationModal(`XÓA VĨNH VIỄN tài khoản "${adminName}"? Hành động này không thể hoàn tác.`);
        if (confirmed) { /* Call API to delete */ }
        showToast("Chức năng xóa Admin chưa được cài đặt.", "info");
    }
}

export function handleAddAdminClick() {
    showAdminForm(); // Show form for adding new admin
}


console.log("Admins Section module loaded"); // Debug log