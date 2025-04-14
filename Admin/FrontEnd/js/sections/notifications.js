
// js/sections/notifications.js
import apiService from '../api.js';
import { showToast } from '../utils.js';
import * as DOM from '../domElements.js';
// Import setActiveSection indirectly via a callback or central dispatcher if needed for navigation
// import { setActiveSection } from '../main.js'; // Avoid direct circular dependency

let isNotificationLoading = false; // Prevent concurrent loads/actions

/**
 * Fetches and renders notifications into the panel.
 * Updates the unread count badge.
 * @param {Function} navigateCallback - Function to call for navigation (e.g., setActiveSection).
 */
export async function loadNotifications(navigateCallback) {
    if (!DOM.notificationList || !DOM.notificationCountBadge || isNotificationLoading) {
        return;
    }

    isNotificationLoading = true;
    // Show simple loading state inside list
    DOM.notificationList.innerHTML = '<li><span class="text-muted p-3 text-center">Loading...</span></li>';
    DOM.notificationCountBadge.style.display = 'none'; // Hide badge while loading

    try {
        const notifications = await apiService.getNotifications();
        let unreadCount = 0;

        if (notifications && notifications.length > 0) {
            DOM.notificationList.innerHTML = notifications.map(notif => {
                if (!notif.read) unreadCount++;
                // Store link data in data attributes for navigation
                const linkDataAttrs = notif.link
                    ? `data-link-type="${notif.link.type}" data-link-id="${notif.link.id}"`
                    : '';
                // Format timestamp (example)
                const timestamp = new Date(notif.timestamp).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short'});

                return `
                    <li data-notif-id="${notif.id}" class="${!notif.read ? 'unread' : ''}" ${linkDataAttrs} role="link" tabindex="0" aria-label="Thông báo: ${notif.message}">
                        <span>${notif.message}</span>
                        <span class="timestamp">${timestamp}</span>
                    </li>`;
            }).join('');

            // Add click listener after rendering items
            addNotificationItemListeners(navigateCallback);

        } else {
            DOM.notificationList.innerHTML = '<li><span class="text-muted p-3 text-center">Không có thông báo nào.</span></li>';
        }

        // Update badge
        DOM.notificationCountBadge.textContent = unreadCount;
        DOM.notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none';

    } catch (error) {
        showToast("Không thể tải thông báo.", "error");
        DOM.notificationList.innerHTML = '<li><span class="text-danger p-3 text-center">Lỗi khi tải thông báo.</span></li>';
        DOM.notificationCountBadge.style.display = 'none';
    } finally {
        isNotificationLoading = false;
    }
}

/**
 * Adds event listeners to individual notification items.
 * @param {Function} navigateCallback - Function to call for navigation.
 */
function addNotificationItemListeners(navigateCallback) {
    DOM.notificationList.querySelectorAll('li[data-notif-id]').forEach(item => {
        // Use keydown for keyboard accessibility (Enter/Space)
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent default space scroll
                handleNotificationClick(event, navigateCallback);
            }
        });
        // Use click for mouse interaction
        item.addEventListener('click', (event) => handleNotificationClick(event, navigateCallback));
    });
}


/**
 * Handles clicks on individual notification items.
 * Marks as read and potentially navigates.
 * @param {Event} event - The click or keydown event.
 * @param {Function} navigateCallback - Function to call for navigation.
 */
async function handleNotificationClick(event, navigateCallback) {
    const item = event.currentTarget; // Use currentTarget as listener is on the item
    if (!item || isNotificationLoading) return;

    const notificationId = item.dataset.notifId;
    const isUnread = item.classList.contains('unread');

    // Mark as read API call only if it's unread
    if (isUnread) {
        isNotificationLoading = true; // Prevent other actions while marking
        item.style.opacity = '0.5'; // Visual feedback

        try {
            await apiService.markNotificationRead(notificationId);
            item.classList.remove('unread');
            item.style.opacity = '1'; // Restore opacity

            // Update badge count
            if (DOM.notificationCountBadge) {
                let count = parseInt(DOM.notificationCountBadge.textContent) || 0;
                if (count > 0) {
                    count--;
                    DOM.notificationCountBadge.textContent = count;
                    if (count === 0) DOM.notificationCountBadge.style.display = 'none';
                }
            }
        } catch (error) {
            showToast(`Lỗi khi đánh dấu thông báo đã đọc: ${error.message}`, 'error');
            item.style.opacity = '1'; // Restore opacity on error too
        } finally {
            isNotificationLoading = false;
        }
    }

    // Handle navigation (if link data exists) *after* marking as read completes or if already read
    const linkType = item.dataset.linkType;
    const linkId = item.dataset.linkId;

    if (linkType && linkId && typeof navigateCallback === 'function') {
        // Close the notification panel before navigating
        import('../ui.js').then(uiModule => uiModule.closeAllDropdowns());

        console.log(`Notification Click: Navigating to ${linkType} with ID ${linkId}`);

        // Prepare params for navigation (especially for detail views)
        const params = {};
        if (linkType === 'product') params.edit = linkId; // Use 'edit' param for product form
        else params.view = linkId; // Use 'view' param for details

        // Use timeout to ensure dropdown closes visually before navigation potentially changes DOM
        setTimeout(() => {
            navigateCallback(linkType, params, linkId); // Pass sectionId, params, viewId
        }, 50);
    }
}

/**
 * Handles clicks on the "Clear Notifications" button.
 */
export async function handleClearNotifications(event) {
    event.preventDefault();
    if (isNotificationLoading) return;
    isNotificationLoading = true;
    // Optionally add loading state to the button/panel
    // showLoading(DOM.notificationPanel); // Avoid full overlay if possible

    try {
        await apiService.markAllNotificationsRead();
        showToast("Tất cả thông báo đã được đánh dấu đã đọc.", "success");

        // Update UI: remove 'unread' class, set badge to 0
        DOM.notificationList?.querySelectorAll('li.unread').forEach(li => li.classList.remove('unread'));
        if (DOM.notificationCountBadge) {
            DOM.notificationCountBadge.textContent = '0';
            DOM.notificationCountBadge.style.display = 'none'; // Hide badge
        }

        // Close panel after clearing
        import('../ui.js').then(uiModule => uiModule.closeAllDropdowns());

    } catch (error) {
        showToast(`Lỗi khi xóa thông báo: ${error.message}`, 'error');
    } finally {
        // hideLoading(DOM.notificationPanel);
        isNotificationLoading = false;
    }
}


console.log("Notifications Service loaded"); // Debug log