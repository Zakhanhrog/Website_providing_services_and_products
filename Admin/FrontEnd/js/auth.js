
// js/auth.js
import apiService from './api.js';
import { showLoading, hideLoading, showToast, showConfirmationModal } from './utils.js';
import { adminContainer } from './domElements.js';

/**
 * Handles the admin logout process.
 * @param {Event} event - The click event.
 */
export async function handleAdminLogout(event) {
    event.preventDefault();
    // Use the improved confirmation modal
    const confirmed = await showConfirmationModal('Bạn có chắc chắn muốn đăng xuất khỏi trang Admin?');

    if (confirmed) {
        console.log("Logout confirmed.");
        showLoading(adminContainer, "Logging out..."); // Show full page loading

        try {
            await apiService.logout();
            showToast('Đăng xuất thành công!', 'success');

            // Redirect to login page after a short delay
            setTimeout(() => {
                // Adjust redirect URL as needed
                window.location.href = '/admin/login';
                // Don't hide loading as the page will redirect
            }, 1000);

        } catch (error) {
            // Error is likely already logged by apiService
            showToast(`Lỗi đăng xuất: ${error.message || 'Unknown error'}`, 'error');
            hideLoading(adminContainer); // Hide loading only on error
        }
    } else {
        console.log("Logout cancelled.");
    }
}

console.log("Auth Service loaded"); // Debug log