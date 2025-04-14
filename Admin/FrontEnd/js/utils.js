// js/utils.js
import { TOAST_DEFAULT_DURATION } from './config.js';
import {
    confirmModal,
    confirmModalMessage,
    confirmModalConfirmBtn,
    confirmModalCancelBtn,
    modalOverlay
} from './domElements.js';

/**
 * Formats a number as Vietnamese currency (VND).
 * @param {number|string} amount - The amount to format.
 * @returns {string} Formatted currency string.
 */
export function formatAdminCurrency(amount) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
        return '0 ₫'; // Consistent format
    }
    // Use Intl for better localization and performance
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericAmount);
}

/**
 * Shows an element by setting its display style.
 * @param {HTMLElement} element - The element to show.
 * @param {string} [displayType='block'] - The display style (e.g., 'block', 'flex', 'grid').
 */
export function showElement(element, displayType = 'block') {
    if (element && element.style.display !== displayType) {
        element.style.display = displayType;
    }
}

/**
 * Hides an element by setting its display style to 'none'.
 * @param {HTMLElement} element - The element to hide.
 */
export function hideElement(element) {
    if (element && element.style.display !== 'none') {
        element.style.display = 'none';
    }
}

/**
 * Shows an element using 'display: flex'.
 * @param {HTMLElement} element - The element to show.
 */
export function flexElement(element) {
    showElement(element, 'flex');
}

/**
 * Shows a toast notification.
 * Placeholder: Replace with a proper toast library (e.g., Notyf, Toastify).
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'warning'|'info'} [type='info'] - The type of toast.
 * @param {number} [duration=TOAST_DEFAULT_DURATION] - How long the toast stays visible.
 */
export function showToast(message, type = 'info', duration = TOAST_DEFAULT_DURATION) {
    console.log(`[Toast - ${type.toUpperCase()}] (${duration}ms): ${message}`);

    // --- Toast Library Integration Placeholder ---
    /*
    if (typeof Notyf !== 'undefined') {
        const notyf = new Notyf({
            duration,
            dismissible: true,
            position: { x: 'right', y: 'top' } // Example position
        });
        switch (type) {
            case 'success': notyf.success(message); break;
            case 'error': notyf.error(message); break;
            case 'warning': notyf.open({ type: 'warning', message, backgroundColor: '#fdcb6e', icon: false }); break; // Example custom warning
            default: notyf.open({ type: 'info', message, backgroundColor: '#0984e3', icon: false }); break; // Example custom info
        }
    } else {
        // Fallback alert only if necessary for debugging, avoid in production
        // alert(`[${type.toUpperCase()}] ${message}`);
    }
    */
    // --- End Placeholder ---
}

/**
 * Shows a confirmation modal.
 * Placeholder: Replace with a proper modal implementation.
 * @param {string} message - The confirmation question.
 * @returns {Promise<boolean>} - Resolves true if confirmed, false if cancelled.
 */
export function showConfirmationModal(message) {
    return new Promise((resolve) => {
        if (!confirmModal || !confirmModalMessage || !confirmModalConfirmBtn || !confirmModalCancelBtn || !modalOverlay) {
            console.error("Confirmation modal elements not found!");
            // Fallback to browser confirm if modal elements missing
            resolve(window.confirm(message));
            return;
        }

        confirmModalMessage.textContent = message;

        // --- Proper Modal Implementation ---
        const confirmHandler = () => {
            closeModal();
            resolve(true); // Resolve promise with true on confirm
        };

        const cancelHandler = () => {
            closeModal();
            resolve(false); // Resolve promise with false on cancel/close
        };

        const closeModal = () => {
            confirmModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            confirmModal.style.display = 'none';
            confirmModal.setAttribute('aria-hidden', 'true');
            modalOverlay.setAttribute('aria-hidden', 'true');

            // Use { once: true } for automatic removal after one execution
            confirmModalConfirmBtn.removeEventListener('click', confirmHandler);
            confirmModalCancelBtn.removeEventListener('click', cancelHandler);
            modalOverlay.removeEventListener('click', cancelHandler); // Close on overlay click
            document.removeEventListener('keydown', escapeHandler); // Close on Esc key
        };

        // Function to handle Escape key press
        const escapeHandler = (event) => {
            if (event.key === 'Escape') {
                cancelHandler();
            }
        };

        // Remove potentially lingering listeners before adding new ones
        confirmModalConfirmBtn.replaceWith(confirmModalConfirmBtn.cloneNode(true));
        confirmModalCancelBtn.replaceWith(confirmModalCancelBtn.cloneNode(true));
        // Re-select buttons after cloning
        const newConfirmBtn = confirmModal.querySelector('.btn-confirm');
        const newCancelBtn = confirmModal.querySelector('.btn-cancel');

        // Add new listeners
        newConfirmBtn.addEventListener('click', confirmHandler, { once: true });
        newCancelBtn.addEventListener('click', cancelHandler, { once: true });
        modalOverlay.addEventListener('click', cancelHandler, { once: true });
        document.addEventListener('keydown', escapeHandler); // Add escape key listener

        // Show modal
        modalOverlay.classList.add('active');
        confirmModal.style.display = 'block'; // Ensure display is block before adding class
        confirmModal.setAttribute('aria-hidden', 'false');
        modalOverlay.setAttribute('aria-hidden', 'false');
        // Use setTimeout to allow display:block to apply before transition starts
        setTimeout(() => {
            confirmModal.classList.add('active');
        }, 10); // Small delay

        newConfirmBtn.focus(); // Focus the confirm button

        // --- End Proper Modal Implementation ---
    });
}


/**
 * Displays a loading indicator (e.g., spinner or overlay).
 * @param {HTMLElement} [element=document.body] - The element to show loading state on. Defaults to the body for full page.
 * @param {string} [message='Loading...'] - Optional message (currently unused in this implementation).
 */
export function showLoading(element = document.body, message = 'Loading...') {
    // Use class for overlay+spinner defined in CSS
    if (element) {
        element.classList.add('is-loading');
        // Optionally set aria-busy attribute
        element.setAttribute('aria-busy', 'true');
        // console.log(`Loading started on ${element.id || element.tagName}...`);
    }
}

/**
 * Hides the loading indicator.
 * @param {HTMLElement} [element=document.body] - The element loading state was shown on.
 */
export function hideLoading(element = document.body) {
    if (element) {
        element.classList.remove('is-loading');
        element.removeAttribute('aria-busy');
        // console.log(`Loading finished on ${element.id || element.tagName}.`);
    }
}

/**
 * Adds a loading state specifically to a button.
 * @param {HTMLButtonElement} button - The button element.
 * @param {string} [loadingText='Processing...'] - Text to show while loading (optional, currently uses CSS spinner).
 */
export function setButtonLoading(button, loadingText = 'Processing...') {
    if (!button) return;
    button.disabled = true;
    button.dataset.originalText = button.innerHTML; // Store original content
    // Add a class to trigger the CSS spinner, hide existing content
    button.classList.add('is-loading');
    // Optional: Set aria-label for accessibility
    button.setAttribute('aria-label', loadingText);
    // Hide text visually if spinner is purely CSS background/pseudo-element
    // button.innerHTML = `<span class="sr-only">${loadingText}</span>`; // Keep text for screen readers only
}

/**
 * Removes the loading state from a button.
 * @param {HTMLButtonElement} button - The button element.
 */
export function resetButtonLoading(button) {
    if (!button) return;
    button.disabled = false;
    button.classList.remove('is-loading');
    button.removeAttribute('aria-label');
    // Restore original content if it was stored
    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
        delete button.dataset.originalText;
    }
}

/**
 * Displays an empty state message within a container (e.g., table body).
 * @param {HTMLElement} container - The container element (e.g., tbody).
 * @param {string} message - The message to display.
 * @param {number} [colspan=1] - Colspan for table cells.
 */
export function displayEmptyState(container, message, colspan = 1) {
    if (!container) return;
    const isEmptyTableBody = container.tagName === 'TBODY';
    let emptyElementHTML = '';

    if (isEmptyTableBody) {
        emptyElementHTML = `
<tr class="empty-state-row">
    <td colspan="${colspan}" class="empty-state-cell">
    <i class="fas fa-info-circle fa-lg text-muted mb-2"></i><br>
${message}
</td>
</tr>`;
    } else {
        // Clear previous content before adding class for non-tbody
        container.innerHTML = '';
        container.classList.add('empty-state'); // Add class for styling
        emptyElementHTML = `
<div class="empty-state-content">
    <i class="fas fa-info-circle fa-2x text-muted mb-2"></i>
<p>${message}</p>
</div>`;
    }
    container.innerHTML = emptyElementHTML;
}

/**
 * Clears validation errors from a form.
 * @param {HTMLFormElement} form - The form element.
 */
export function clearFormValidation(form) {
    if (!form) return;
    // Remove invalid classes from inputs/selects/textareas
    form.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby'); // Remove link to error message
    });
    // Remove error message elements
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
}

/**
 * Displays validation errors on a form based on server response or client-side checks.
 * @param {HTMLFormElement} form - The form element.
 * @param {object} errors - An object where keys are input names/ids and values are error messages (string or array).
 */
export function displayFormValidationErrors(form, errors) {
    if (!form || !errors) return;
    clearFormValidation(form); // Clear previous errors first

    let firstErrorElement = null;

    for (const fieldName in errors) {
        // Try finding by name, then ID
        const input = form.querySelector(`[name="${fieldName}"]`) || form.querySelector(`#${fieldName}`);
        if (input) {
            input.classList.add('is-invalid');
            input.setAttribute('aria-invalid', 'true'); // Mark as invalid for accessibility

            const errorMsg = Array.isArray(errors[fieldName]) ? errors[fieldName].join(', ') : errors[fieldName];
            const errorId = `${fieldName}-error`; // Create a unique ID for the error message

            // Remove existing error message for this field before adding new one
            const existingError = input.parentNode.querySelector(`#${errorId}`);
            if (existingError) {
                existingError.remove();
            }

            // Create and insert the new error message element
            const errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            errorElement.id = errorId; // Assign the unique ID
            errorElement.textContent = errorMsg;
            errorElement.setAttribute('role', 'alert'); // Announce error

            // Insert after the input or its container if it's complex (like checkbox/radio group)
            const parentContainer = input.closest('.form-group') || input.parentNode; // Find appropriate parent
            parentContainer.appendChild(errorElement); // Append at the end of the group usually works well

            // Link the input to the error message for accessibility
            input.setAttribute('aria-describedby', errorId);

            // Track the first error element to focus later
            if (!firstErrorElement) {
                firstErrorElement = input;
            }

        } else {
            console.warn(`Validation Error: Could not find form field for "${fieldName}" in form#${form.id}`);
            // Optionally display general errors not linked to a specific field somewhere else
        }
    }

    // Scroll to and focus the first element with an error
    if (firstErrorElement) {
        firstErrorElement.focus({ preventScroll: true }); // Focus without default scroll
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll smoothly
        showToast("Please review the errors in the form.", "error");
    }
}


/**
 * Basic client-side form validation using HTML5 Constraint Validation API.
 * Complements server-side validation.
 * @param {HTMLFormElement} form - The form to validate.
 * @returns {boolean} - True if the form is valid according to HTML5 constraints.
 */
export function validateFormClientSide(form) {
    if (!form) return false;
    clearFormValidation(form); // Clear previous visual errors

    let isValid = true;

    // Check overall form validity first
    if (!form.checkValidity()) {
        isValid = false;

        // Find all invalid elements and mark them visually
        // querySelectorAll(':invalid') works on most modern browsers for form elements
        const invalidElements = form.querySelectorAll(':invalid');

        invalidElements.forEach((element, index) => {
            element.classList.add('is-invalid');
            element.setAttribute('aria-invalid', 'true');
            const errorId = `${element.id || element.name}-error`;
            const errorMsg = element.validationMessage; // Get built-in message

            // Remove existing before adding
            const existingError = element.parentNode.querySelector(`#${errorId}`);
            if (existingError) existingError.remove();

            // Create and add error message
            const errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            errorElement.id = errorId;
            errorElement.textContent = errorMsg;
            errorElement.setAttribute('role', 'alert');
            const parentContainer = element.closest('.form-group') || element.parentNode;
            parentContainer.appendChild(errorElement);
            element.setAttribute('aria-describedby', errorId);

            // Focus and scroll to the first invalid element found
            if (index === 0) {
                element.focus({ preventScroll: true });
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        showToast("Please correct the errors highlighted in the form.", "warning");

    }

    // Add custom validation logic here if needed (e.g., password match)
    // Example:
    // const password = form.querySelector('#password');
    // const confirmPassword = form.querySelector('#confirmPassword');
    // if (password && confirmPassword && password.value !== confirmPassword.value) {
    //     isValid = false;
    //     // Manually display error for confirmPassword using displayFormValidationErrors
    //     displayFormValidationErrors(form, { confirmPassword: ["Passwords do not match."] });
    // }

    return isValid;
}

/**
 * Debounces a function, delaying its execution until after a certain time has passed
 * without the function being called again.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Throttles a function, ensuring it's called at most once within a specified time interval.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {Function} - The throttled function.
 */
export function throttle(func, limit) {
    let inThrottle;
    let lastResult;
    return function(...args) {
        if (!inThrottle) {
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
            lastResult = func.apply(this, args);
        }
        return lastResult;
    };
}


// Add other general utility functions here

console.log("Utils loaded"); // Debug log