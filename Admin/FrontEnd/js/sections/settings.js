// js/sections/settings.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import {
    showToast, showConfirmationModal,
    setButtonLoading, resetButtonLoading,
    showLoading, hideLoading, displayFormValidationErrors, clearFormValidation, validateFormClientSide
} from '../utils.js';
import { setupTabs } from '../ui.js'; // Import setupTabs if needed internally

let isLoadingSettingsAction = false; // Flag for settings actions

/**
 * Loads data for a specific settings tab.
 * @param {string} tabName - The name of the tab (e.g., 'general', 'payments').
 */
export async function loadSettingsTabData(tabName) {
    console.log(`Loading settings data for tab: ${tabName}`);
    const tabContentElement = document.getElementById(`settings-${tabName}`);
    if (!tabContentElement) {
        console.warn(`Settings tab content element not found for: settings-${tabName}`);
        return;
    }

    showLoading(tabContentElement);
    let form = tabContentElement.querySelector('form'); // Try to find a form within the tab

    try {
        const settings = await apiService.getSettings(tabName);

        // Populate form fields if a form exists
        if (form) {
            populateSettingsForm(form, settings);
        } else {
            // Handle tabs without a single form (like payments, shipping)
            populateComplexSettingsTab(tabName, tabContentElement, settings);
        }

        // Special handling after population if needed (e.g., VNPAY toggle)
        if (tabName === 'payments') {
            handleVnpayToggle(tabContentElement); // Ensure visibility matches loaded state
        }

    } catch (error) {
        showToast(`Lỗi tải cài đặt ${tabName}: ${error.message}`, 'error');
        // Optionally display an error message within the tab content
        tabContentElement.innerHTML = `<p class="text-danger">Không thể tải cài đặt.</p>`;
    } finally {
        hideLoading(tabContentElement);
    }
}

/** Populates a standard settings form */
function populateSettingsForm(form, settings) {
    clearFormValidation(form); // Clear any previous validation errors
    for (const key in settings) {
        // Find by name first, then fallback to ID
        const input = form.querySelector(`[name="${key}"]`) || form.querySelector(`#${key}`);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = !!settings[key]; // Ensure boolean conversion
            } else if (input.type === 'file') {
                // Handle file input - maybe show current file name or preview
                // For logo, show preview
                if (key === 'storeLogo' && settings[key]) {
                    const previewContainer = form.querySelector('#storeLogoPreview'); // Assumes specific ID
                    if (previewContainer) {
                        previewContainer.innerHTML = `<img src="${settings[key]}" alt="Current Logo" style="max-height: 50px; width:auto;">`;
                    }
                } else {
                    // Display current file name? (Input type=file value cannot be set programmatically for security)
                }
            } else if (input.tagName === 'TEXTAREA') {
                input.value = settings[key] || '';
                // TODO: Update WYSIWYG editor content if applicable
            } else {
                input.value = settings[key] || '';
            }
        }
    }
}

/** Populates complex tabs like Payments, Shipping */
function populateComplexSettingsTab(tabName, container, settings) {
    console.log(`Populating complex tab ${tabName}`, settings);
    if (tabName === 'payments') {
        // Populate individual payment gateway settings
        for (const key in settings) {
            const input = container.querySelector(`#${key}, [name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = !!settings[key];
                } else {
                    input.value = settings[key] || '';
                }
            }
        }
    } else if (tabName === 'shipping') {
        // TODO: Implement rendering logic for shipping zones and methods based on settings data
        console.warn("Shipping tab population logic not implemented.");
        container.querySelector('.shipping-zones-container').innerHTML = '<p>Shipping zone data population needed.</p>';
    } else if (tabName === 'emails') {
        // TODO: Implement rendering/population for email template list/settings
        console.warn("Emails tab population logic not implemented.");
    }
    // Add other complex tabs as needed
}

/** Handles the VNPAY enabled checkbox toggle */
export function handleVnpayToggle(parentElement = document) {
    const checkbox = parentElement.querySelector('#vnpayEnabled');
    const detailsDiv = checkbox?.closest('.payment-gateway-setting')?.querySelector('.gateway-details');
    if (checkbox && detailsDiv) {
        detailsDiv.style.display = checkbox.checked ? 'block' : 'none';
        // Animate max-height for smoother transition if CSS is set up for it
        if (checkbox.checked) {
            // Ensure it's visible before calculating height
            detailsDiv.style.display = 'block';
            // Set max-height for animation (adjust value as needed)
            detailsDiv.style.maxHeight = detailsDiv.scrollHeight + "px";
            detailsDiv.style.opacity = '1';
        } else {
            detailsDiv.style.maxHeight = '0';
            detailsDiv.style.opacity = '0';
            // Optionally set display:none after transition ends
            // setTimeout(() => { if (!checkbox.checked) detailsDiv.style.display = 'none'; }, 400); // Match CSS transition duration
        }
    }
}

/** Handles saving general settings form. */
export async function handleGeneralSettingsSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form || isLoadingSettingsAction) return;

    if (!validateFormClientSide(form)) {
        // Error message shown by validator
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    isLoadingSettingsAction = true;
    setButtonLoading(submitButton);

    try {
        const formData = new FormData(form);
        // Convert FormData to plain object for API (unless backend handles FormData)
        // Note: File input ('storeLogoFile') won't be included in objectFromEntries
        const settingsData = Object.fromEntries(formData.entries());

        // --- Handle file upload separately if needed ---
        const logoInput = form.querySelector('#storeLogoInput');
        const logoFile = logoInput?.files[0];
        if (logoFile) {
            // If backend expects multipart/form-data, send the *original* formData
            // await apiService.saveSettings('general', formData);
            // If backend expects JSON + separate file upload endpoint:
            // 1. Call saveSettings with settingsData (without file)
            // 2. Call a separate uploadLogo API with logoFile
            console.warn("Logo file upload logic needs specific implementation based on backend.");
            // For simulation, we proceed with object data
            await apiService.saveSettings('general', settingsData);
        } else {
            // Send only the object data if no file selected
            await apiService.saveSettings('general', settingsData);
        }

        showToast("Cài đặt chung đã được lưu.", 'success');
        clearFormValidation(form); // Clear validation on success
    } catch (error) {
        showToast(`Lỗi lưu cài đặt chung: ${error.message}`, 'error');
        if (error.status === 422 && error.data?.errors) {
            displayFormValidationErrors(form, error.data.errors);
        }
    } finally {
        resetButtonLoading(submitButton);
        isLoadingSettingsAction = false;
    }
}

/** Handles saving payment settings. */
export async function handlePaymentSettingsSubmit(event) {
    event.preventDefault(); // Prevent default if it's somehow triggered by form
    const container = document.getElementById('settings-payments');
    const saveButton = DOM.paymentSettingsSaveBtn;
    if (isLoadingSettingsAction || !container || !saveButton) return;

    isLoadingSettingsAction = true;
    setButtonLoading(saveButton);

    try {
        // Gather data from individual controls within the payment settings tab
        const settingsData = {
            codEnabled: container.querySelector('#codEnabled')?.checked,
            codTitle: container.querySelector('#codTitle')?.value,
            codInstructions: container.querySelector('#codInstructions')?.value,

            bankTransferEnabled: container.querySelector('#bankTransferEnabled')?.checked,
            bankTransferTitle: container.querySelector('#bankTransferTitle')?.value,
            bankTransferDetails: container.querySelector('#bankTransferDetails')?.value,

            vnpayEnabled: container.querySelector('#vnpayEnabled')?.checked,
            vnpayTmnCode: container.querySelector('#vnpayTmnCode')?.value,
            vnpayHashSecret: container.querySelector('#vnpayHashSecret')?.value, // Be careful sending secrets like this
            vnpayTestMode: container.querySelector('#vnpayTestMode')?.checked,
            // ... gather other payment settings ...
        };

        // Convert boolean checkbox values explicitly if needed by backend
        Object.keys(settingsData).forEach(key => {
            if (typeof settingsData[key] === 'boolean') {
                // settingsData[key] = settingsData[key] ? 1 : 0; // Example conversion
            }
        });


        await apiService.saveSettings('payments', settingsData);
        showToast("Cài đặt thanh toán đã được lưu.", 'success');
        // No form to clear validation from, maybe clear individual fields if needed?

    } catch (error) {
        showToast(`Lỗi lưu cài đặt thanh toán: ${error.message}`, 'error');
        // Handle potential validation errors if API returns them for specific fields
        // This is harder without a form structure, might need manual error display
        if (error.status === 422 && error.data?.errors) {
            console.error("Payment validation errors:", error.data.errors);
            // Example: Manually highlight a field
            // const tmnCodeInput = container.querySelector('#vnpayTmnCode');
            // if (tmnCodeInput && error.data.errors.vnpayTmnCode) {
            //      tmnCodeInput.classList.add('is-invalid');
            //      // Add error message display logic here
            // }
        }
    } finally {
        resetButtonLoading(saveButton);
        isLoadingSettingsAction = false;
    }
}

// --- Placeholder Handlers for other Settings Tabs ---

export async function handleShippingSettingsSubmit(event) {
    event.preventDefault();
    if (isLoadingSettingsAction) return;
    const saveButton = DOM.shippingSettingsSaveBtn;
    isLoadingSettingsAction = true;
    setButtonLoading(saveButton);
    console.log("Placeholder: Saving Shipping Settings...");
    // TODO: Gather data from shipping zones/methods UI
    const shippingData = { zones: [ /* ... collected data ... */ ] };
    try {
        await apiService.saveSettings('shipping', shippingData);
        showToast("Cài đặt vận chuyển đã được lưu.", 'success');
    } catch(error) {
        showToast(`Lỗi lưu cài đặt vận chuyển: ${error.message}`, 'error');
    } finally {
        resetButtonLoading(saveButton);
        isLoadingSettingsAction = false;
    }
}

export async function handleEmailSettingsSubmit(event) {
    event.preventDefault();
    if (isLoadingSettingsAction) return;
    const saveButton = DOM.emailSettingsSaveBtn;
    isLoadingSettingsAction = true;
    setButtonLoading(saveButton);
    console.log("Placeholder: Saving Email Settings...");
    // TODO: Gather data from email template settings UI
    const emailData = { /* ... collected data ... */ };
    try {
        await apiService.saveSettings('emails', emailData);
        showToast("Cài đặt Email đã được lưu.", 'success');
    } catch(error) {
        showToast(`Lỗi lưu cài đặt Email: ${error.message}`, 'error');
    } finally {
        resetButtonLoading(saveButton);
        isLoadingSettingsAction = false;
    }
}

export async function handleSeoSettingsSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form || isLoadingSettingsAction) return;
    if (!validateFormClientSide(form)) return;

    const submitButton = form.querySelector('button[type="submit"]');
    isLoadingSettingsAction = true;
    setButtonLoading(submitButton);
    try {
        const formData = new FormData(form);
        const seoData = Object.fromEntries(formData.entries());
        await apiService.saveSettings('seo', seoData);
        showToast("Cài đặt SEO đã được lưu.", 'success');
        clearFormValidation(form);
    } catch(error) {
        showToast(`Lỗi lưu cài đặt SEO: ${error.message}`, 'error');
        if (error.status === 422 && error.data?.errors) {
            displayFormValidationErrors(form, error.data.errors);
        }
    } finally {
        resetButtonLoading(submitButton);
        isLoadingSettingsAction = false;
    }
}

console.log("Settings Section module loaded"); // Debug log