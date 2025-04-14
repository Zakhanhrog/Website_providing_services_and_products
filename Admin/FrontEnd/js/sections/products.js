
// js/sections/products.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import {
    showToast, formatAdminCurrency, showConfirmationModal,
    setButtonLoading, resetButtonLoading, displayTableEmptyState,
    clearFormValidation, displayFormValidationErrors, validateFormClientSide,
    showLoading, hideLoading, showElement, hideElement
} from '../utils.js';
import { renderPagination, setupTableSelection, getSelectedTableIds, resetTableSelection, hideListView, restoreListView } from '../ui.js';
import { initWysiwyg, destroyWysiwyg, getWysiwygContent, setWysiwygContent,
    initSelectComponents, destroySelectComponents, getSelectComponentValue, setSelectComponentValue,
    initImageUpload, clearImagePreviews } from '../services/libraryService.js';
import { ITEMS_PER_PAGE } from '../config.js';

let currentProductParams = {}; // Store current filter/sort/page state
let isLoadingProductAction = false; // Flag for specific product actions

// --- Product List Logic ---

/**
 * Loads product list data based on current parameters.
 * @param {object} params - Filter, sort, pagination parameters.
 * @param {Function} navigateCallback - Callback for pagination clicks.
 */
export async function loadProductListData(params = {}, navigateCallback) {
    currentProductParams = { limit: ITEMS_PER_PAGE, ...params }; // Merge default limit
    console.log("Loading product list data with params:", currentProductParams);

    if (!DOM.productListView || !DOM.productTableBody) return;
    showLoading(DOM.productListView); // Show loading specific to the list view

    try {
        const response = await apiService.getProducts(currentProductParams);
        renderProductTable(response.data);
        renderPagination(DOM.productPagination, response.pagination, 'products', navigateCallback, currentProductParams);

        // Re-initialize table selection logic every time list reloads
        setupTableSelection(
            DOM.selectAllProductsCheckbox,
            '.product-checkbox',
            DOM.productsSection, // Parent scope for checkboxes
            DOM.applyProductBulkActionBtn,
            DOM.productBulkActionSelect
        );

        // Reset bulk action state
        if (DOM.productBulkActionSelect) DOM.productBulkActionSelect.value = '';

    } catch (error) {
        showToast(`Lỗi tải danh sách sản phẩm: ${error.message}`, 'error');
        displayTableEmptyState(DOM.productTableBody, 'Không thể tải danh sách sản phẩm.', 8); // 8 columns
        // Clear pagination on error
        if (DOM.productPagination) DOM.productPagination.innerHTML = '';
    } finally {
        hideLoading(DOM.productListView);
    }
}

/** Renders rows for the product table. */
function renderProductTable(products) {
    if (!DOM.productTableBody) return;
    if (!products || products.length === 0) {
        displayTableEmptyState(DOM.productTableBody, 'Không tìm thấy sản phẩm nào.', 8);
        return;
    }

    DOM.productTableBody.innerHTML = products.map(product => {
        const statusText = getProductStatusText(product.status);
        const statusClass = product.status || 'draft';
        let priceHTML = formatAdminCurrency(product.price || 0);
        if (product.salePrice && product.salePrice < product.price) {
            priceHTML = `${formatAdminCurrency(product.salePrice)} <span class="old-price-inline">${formatAdminCurrency(product.price)}</span>`;
        }

        let stockHTML = '-';
        let stockClass = '';
        if (product.manageStock !== false) {
            stockHTML = product.stock ?? 'N/A';
            const lowStockThreshold = product.lowStockThreshold ?? 5; // Default threshold
            if (product.stock === 0) {
                stockClass = 'stock-out';
            } else if (product.stock > 0 && product.stock <= lowStockThreshold) {
                stockClass = 'stock-low';
            }
        }


        return `
            <tr data-product-row-id="${product.id}">
                <td><input type="checkbox" class="product-checkbox" value="${product.id}" aria-label="Chọn sản phẩm ${product.name || product.id}"></td>
                <td><img src="${product.image || 'https://via.placeholder.com/50x50/cccccc/ffffff?text=N/A'}" alt="${product.name || 'Product Image'}"></td>
                <td><a href="#products?edit=${product.id}" class="link-edit-product" data-product-id="${product.id}">${product.name || 'N/A'}</a></td>
                <td>${product.sku || 'N/A'}</td>
                <td>${priceHTML}</td>
                <td class="${stockClass}">${stockHTML}</td>
                <td><span class="status status-${statusClass}">${statusText}</span></td>
                <td>
                    <button type="button" class="btn-icon btn-edit-product" title="Sửa" data-product-id="${product.id}" aria-label="Sửa sản phẩm ${product.name || product.id}"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn-icon btn-delete-product text-danger" title="Xóa" data-product-id="${product.id}" data-product-name="${product.name || product.id}" aria-label="Xóa sản phẩm ${product.name || product.id}"><i class="fas fa-trash-alt"></i></button>
                    <a href="/product/${product.slug || product.id}" target="_blank" class="btn-icon" title="Xem trên web" aria-label="Xem sản phẩm ${product.name || product.id} trên web"><i class="fas fa-eye"></i></a>
                    <button type="button" class="btn-icon btn-duplicate-product" title="Nhân bản" data-product-id="${product.id}" aria-label="Nhân bản sản phẩm ${product.name || product.id}"><i class="fas fa-copy"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

/** Gets display text for product status */
function getProductStatusText(status) {
    const statuses = { published: 'Đang bán', draft: 'Nháp', archived: 'Lưu trữ' };
    return statuses[status] || status;
}

/** Handles clicks within the Product Table (Edit, Delete, Duplicate, etc.). */
export async function handleProductTableClick(event, navigateCallback) {
    const editButton = event.target.closest('.btn-edit-product, .link-edit-product');
    const deleteButton = event.target.closest('.btn-delete-product');
    const duplicateButton = event.target.closest('.btn-duplicate-product');

    if (editButton) {
        event.preventDefault();
        const productId = editButton.dataset.productId;
        if (productId && navigateCallback) {
            // Navigate using the callback, which should handle showing the form
            navigateCallback('products', { edit: productId }, productId);
        }
    } else if (deleteButton) {
        event.preventDefault();
        if (isLoadingProductAction) return;
        const productId = deleteButton.dataset.productId;
        const productName = deleteButton.dataset.productName || `ID ${productId}`;

        if (!productId) return;

        const confirmed = await showConfirmationModal(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"? Hành động này không thể hoàn tác.`);

        if (confirmed) {
            isLoadingProductAction = true;
            setButtonLoading(deleteButton);
            try {
                await apiService.deleteProduct(productId);
                showToast(`Đã xóa sản phẩm "${productName}".`, 'success');
                // Remove row from table visually more reliably
                const row = DOM.productTableBody.querySelector(`tr[data-product-row-id="${productId}"]`);
                row?.remove();
                // Optional: Reload list data if total count/pagination needs update after delete
                // loadProductListData(currentProductParams, navigateCallback);
                // Decrement total count if displayed somewhere
            } catch (error) {
                showToast(`Lỗi khi xóa sản phẩm: ${error.message}`, 'error');
            } finally {
                resetButtonLoading(deleteButton);
                isLoadingProductAction = false;
            }
        }
    } else if (duplicateButton) {
        event.preventDefault();
        const productId = duplicateButton.dataset.productId;
        showToast(`Chức năng nhân bản sản phẩm ${productId} chưa được cài đặt.`, 'info');
        // TODO: Implement duplication logic
        // 1. Fetch product details using apiService.getProductDetails(productId)
        // 2. Clear/modify necessary fields (id, sku, slug?)
        // 3. Call showProductForm(null, duplicatedData); // Pass data to prefill new form
    }
}

/** Handles applying bulk actions for products. */
export async function handleProductBulkAction(navigateCallback) {
    if (isLoadingProductAction) return;

    const selectedAction = DOM.productBulkActionSelect?.value;
    const selectedProductIds = getSelectedTableIds('.product-checkbox', DOM.productsSection);

    if (!selectedAction || selectedProductIds.length === 0) {
        showToast('Vui lòng chọn hành động và ít nhất một sản phẩm.', 'warning');
        return;
    }

    const actionText = DOM.productBulkActionSelect.options[DOM.productBulkActionSelect.selectedIndex].text;

    const confirmed = await showConfirmationModal(`Bạn có chắc chắn muốn "${actionText}" ${selectedProductIds.length} sản phẩm đã chọn?`);

    if (confirmed) {
        isLoadingProductAction = true;
        setButtonLoading(DOM.applyProductBulkActionBtn);
        try {
            const result = await apiService.applyProductBulkAction(selectedAction, selectedProductIds);
            showToast(result.message || `Đã áp dụng "${actionText}" thành công.`, 'success');

            // Reset selection and reload list
            resetTableSelection(
                DOM.selectAllProductsCheckbox,
                '.product-checkbox',
                DOM.productsSection,
                DOM.applyProductBulkActionBtn,
                DOM.productBulkActionSelect
            );
            loadProductListData(currentProductParams, navigateCallback); // Refresh list

        } catch (error) {
            showToast(`Lỗi khi áp dụng hành động hàng loạt: ${error.message}`, 'error');
        } finally {
            resetButtonLoading(DOM.applyProductBulkActionBtn);
            isLoadingProductAction = false;
        }
    }
}

// --- Product Form Logic ---

/**
 * Shows the Add/Edit Product form.
 * @param {string|null} productId - ID of the product to edit, or null to add new.
 * @param {object|null} [initialData=null] - Optional pre-filled data (e.g., for duplication).
 */
export async function showProductForm(productId = null, initialData = null) {
    if (!DOM.productFormContainer || !DOM.productsSection || !DOM.productForm) return;
    console.log(`Showing product form for ID: ${productId || 'New'}`);

    hideListView('products'); // Hide list view elements first
    showElement(DOM.productFormContainer);
    DOM.mainContent?.scrollTo(0, 0); // Scroll to top of form

    const formTitle = DOM.productFormContainer.querySelector('h3'); // Assuming h3 exists
    const submitButton = DOM.productForm.querySelector('button[type="submit"]');

    // --- Reset Form State ---
    DOM.productForm.reset();
    clearFormValidation(DOM.productForm);
    DOM.productForm.dataset.productId = ''; // Clear previous ID
    // Reset stock field visibility based on default checkbox state
    if (DOM.manageStockCheckbox) DOM.manageStockCheckbox.checked = true; // Default assumption
    handleStockCheckboxChange();
    if (submitButton) submitButton.textContent = 'Lưu Sản Phẩm'; // Reset button text
    // Clear image previews
    clearImagePreviews('featuredImagePreview', 'featuredImageInput');
    clearImagePreviews('galleryImagePreview', 'galleryImageInput');
    // TODO: Clear/reset variant UI if implemented
    // document.getElementById('variantRowsContainer').innerHTML = ''; // Example

    // --- Library Reset Placeholders ---
    // Destroy existing instances before re-initializing or setting content
    destroyWysiwyg('#productDescription');
    destroySelectComponents('#productCategory');
    // Add resets for other libraries if used (e.g., brand select, tags input)
    setSelectComponentValue('productCategory', []); // Reset select component value
    setSelectComponentValue('productBrand', '');

    // --- Populate Form ---
    let productData = initialData; // Use initial data if provided (for duplication)

    if (productId && !initialData) {
        // --- Editing Existing Product ---
        if (formTitle) formTitle.textContent = `Sửa Sản Phẩm #${productId}`;
        if (submitButton) submitButton.textContent = 'Cập Nhật Sản Phẩm';
        DOM.productForm.dataset.productId = productId; // Store ID for submission

        showLoading(DOM.productFormContainer); // Show loading overlay on the form
        try {
            productData = await apiService.getProductDetails(productId);
        } catch (error) {
            showToast(`Lỗi tải chi tiết sản phẩm: ${error.message}`, 'error');
            hideProductForm(); // Hide form on error
            restoreListView('products'); // Ensure list is shown again
            hideLoading(DOM.productFormContainer);
            return; // Stop execution
        } finally {
            hideLoading(DOM.productFormContainer);
        }
    } else if (!initialData) {
        // --- Adding New Product ---
        if (formTitle) formTitle.textContent = 'Thêm Sản Phẩm Mới';
    } else {
        // --- Duplicating Product ---
        if (formTitle) formTitle.textContent = 'Nhân Bản Sản Phẩm';
        // Modify duplicated data as needed (e.g., clear SKU, add "(Copy)" to name)
        productData.sku = '';
        productData.name = productData.name ? `${productData.name} (Bản sao)` : 'Sản phẩm mới (Bản sao)';
        productData.slug = ''; // Let slug regenerate
        productData.status = 'draft'; // Default to draft for duplicates
        // Don't set product ID on form for duplicates
    }

    // Populate form fields if data is available
    if (productData) {
        populateProductForm(productData);
    }

    // --- Initialize Libraries AFTER populating ---
    initWysiwyg('#productDescription'); // Initialize editor for the description field
    initSelectComponents('#productCategory'); // Initialize category select
    initSelectComponents('#productBrand'); // Initialize brand select (if using library)
    initImageUpload({ uploadInputId: 'featuredImageInput', previewContainerId: 'featuredImagePreview', isMultiple: false });
    initImageUpload({ uploadInputId: 'galleryImageInput', previewContainerId: 'galleryImagePreview', isMultiple: true });
    initDatePickers('.date-picker'); // Initialize date pickers
    // TODO: Initialize variant UI components if needed

    // Setup tabs for the form (ensure first tab is active)
    setupTabs(DOM.productFormTabs, DOM.productFormTabContents);
}

/** Populates the product form fields with data. */
function populateProductForm(data) {
    if (!DOM.productForm || !data) return;

    // Simple fields
    DOM.productForm.querySelector('#productName').value = data.name || '';
    DOM.productForm.querySelector('#productSlug').value = data.slug || '';
    DOM.productForm.querySelector('#productShortDescription').value = data.shortDescription || '';
    // Set WYSIWYG content using the library service function
    setWysiwygContent('productDescription', data.description || '');
    DOM.productForm.querySelector('#productStatusForm').value = data.status || 'draft';
    DOM.productForm.querySelector('#productPrice').value = data.price || '';
    DOM.productForm.querySelector('#productSalePrice').value = data.salePrice || '';
    // Format date/time for datetime-local input
    DOM.productForm.querySelector('#saleStartDate').value = data.saleStartDate ? data.saleStartDate.slice(0, 16) : '';
    DOM.productForm.querySelector('#saleEndDate').value = data.saleEndDate ? data.saleEndDate.slice(0, 16) : '';

    // Stock fields
    if (DOM.manageStockCheckbox) DOM.manageStockCheckbox.checked = data.manageStock !== false;
    handleStockCheckboxChange(); // Update visibility based on populated data
    DOM.productForm.querySelector('#productSku').value = data.sku || '';
    DOM.productForm.querySelector('#productStock').value = data.stock ?? '';
    DOM.productForm.querySelector('#lowStockThreshold').value = data.lowStockThreshold ?? '5';
    DOM.productForm.querySelector('#allowBackorder').checked = data.allowBackorder || false;

    // SEO fields
    DOM.productForm.querySelector('#seoTitle').value = data.seoTitle || '';
    DOM.productForm.querySelector('#seoDescription').value = data.seoDescription || '';

    // Complex fields - Use library service functions
    setSelectComponentValue('productCategory', data.categoryIds || []);
    setSelectComponentValue('productBrand', data.brand || '');

    // Image Previews (More complex: need to fetch/display URLs)
    if (data.featuredImage) {
        // Assuming data.featuredImage is a URL
        DOM.productForm.querySelector('#featuredImagePreview').innerHTML = `
             <div class="gallery-item">
                 <img src="${data.featuredImage}" alt="Current Featured Image">
                 <button type="button" class="btn-icon btn-remove-image" title="Remove image">&times;</button>
             </div>`;
    }
    if (data.galleryImages && data.galleryImages.length > 0) {
        DOM.productForm.querySelector('#galleryImagePreview').innerHTML = data.galleryImages.map(imgUrl => `
             <div class="gallery-item">
                 <img src="${imgUrl}" alt="Gallery Image">
                 <button type="button" class="btn-icon btn-remove-image" title="Remove image">&times;</button>
             </div>`).join('');
    }

    // TODO: Render variants UI based on data.variants
}


/** Hides the product form and restores the list view. */
export function hideProductForm() {
    hideElement(DOM.productFormContainer);
    // Destroy libraries associated with the form to prevent memory leaks
    destroyWysiwyg('#productDescription');
    destroySelectComponents('#productCategory');
    destroySelectComponents('#productBrand');
    // Add destroy calls for other libraries if used
    // Restore list view only if the products section is still the active one
    // This check might be better handled in the main navigation logic
    // restoreListView('products'); // Removed - let main navigation handle restore
}

/** Handles the change event for the 'Manage Stock' checkbox. */
function handleStockCheckboxChange() {
    if (!DOM.manageStockCheckbox || !DOM.stockFields || DOM.stockFields.length === 0) return;

    const isChecked = DOM.manageStockCheckbox.checked;
    const displayType = isChecked ? 'block' : 'none'; // Default display

    DOM.stockFields.forEach(fieldGroup => {
        // Use 'flex' for form-row containers if needed, otherwise 'block'
        const desiredDisplay = fieldGroup.classList.contains('form-row') ? 'flex' : (isChecked ? 'block' : 'none');
        fieldGroup.style.display = desiredDisplay;
        // Toggle 'required' attribute on stock quantity if needed
        const stockInput = fieldGroup.querySelector('#productStock');
        if (stockInput) {
            stockInput.required = isChecked;
            if (!isChecked) {
                stockInput.classList.remove('is-invalid'); // Remove validation state if hidden
                const errorMsg = stockInput.parentNode.querySelector('.invalid-feedback');
                if(errorMsg) errorMsg.remove();
            }
        }
    });
}

/** Handles the product form submission. */
export async function handleProductFormSubmit(event, navigateCallback) {
    event.preventDefault();
    if (!DOM.productForm || isLoadingProductAction) return;

    // Client-side validation first
    if (!validateFormClientSide(DOM.productForm)) {
        // showToast is called inside validateFormClientSide on error
        return;
    }

    const submitButton = DOM.productForm.querySelector('button[type="submit"]');
    isLoadingProductAction = true;
    setButtonLoading(submitButton, 'Đang lưu...');

    try {
        // Use FormData to handle file uploads easily
        const formData = new FormData(DOM.productForm);

        // Get WYSIWYG content and append/set it manually
        const descriptionContent = getWysiwygContent('productDescription');
        formData.set('description', descriptionContent); // Use set to overwrite textarea value

        // Get multi-select values and append them correctly for backend
        const categoryIds = getSelectComponentValue('productCategory'); // Assuming this returns an array
        formData.delete('categoryIds'); // Remove original single value if any
        if (categoryIds && Array.isArray(categoryIds)) {
            categoryIds.forEach(id => formData.append('categoryIds[]', id)); // Append as array
        }

        // Get checkbox values correctly (FormData includes them if checked)
        // Ensure correct boolean representation if needed by backend (e.g., 'true'/'false' or 1/0)
        formData.set('manageStock', DOM.manageStockCheckbox?.checked ? 'true' : 'false');
        formData.set('allowBackorder', DOM.productForm.querySelector('#allowBackorder')?.checked ? 'true' : 'false');

        // --- Image Handling Placeholder ---
        // If new images were selected, they are already in formData via the input names.
        // Logic is needed here or on the backend to handle:
        // 1. Uploading new files (FormData sends them).
        // 2. Keeping existing images (send their IDs/URLs, maybe in a separate field like 'existing_images').
        // 3. Removing images (send IDs of images to remove, maybe in 'removed_images').
        // This usually requires more complex JS to track changes in the preview containers.
        // Example: Track removed image URLs/IDs
        // const removedFeaturedImage = DOM.productForm.querySelector('#featuredImagePreview').innerHTML === ''; // Simple check
        // const removedGalleryImages = getRemovedGalleryImageIds(); // Needs helper function
        // if (removedFeaturedImage) formData.append('remove_featured_image', 'true');
        // removedGalleryImages.forEach(id => formData.append('remove_gallery_images[]', id));

        // --- Variant Handling Placeholder ---
        // Gather data from variant rows and append to formData. Example:
        // DOM.productForm.querySelectorAll('.variant-row').forEach((row, index) => {
        //     formData.append(`variants[${index}][attribute]`, row.querySelector('.variant-attr').value);
        //     formData.append(`variants[${index}][price]`, row.querySelector('.variant-price').value);
        //     // ... etc.
        // });

        // Get product ID for update
        const productId = DOM.productForm.dataset.productId || null;

        // Log FormData entries (for debugging - files won't show content)
        console.log("Submitting Product FormData:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const savedProduct = await apiService.saveProduct(formData, productId);

        showToast(`Sản phẩm "${savedProduct.name}" đã được lưu thành công!`, 'success');
        hideProductForm(); // Hide form first
        // Navigate back to the product list (or updated detail view if desired)
        // This assumes navigateCallback handles restoring the list view
        if (navigateCallback) {
            navigateCallback('products', currentProductParams); // Go back to list with previous params
        } else {
            // Fallback if no callback provided
            restoreListView('products');
            loadProductListData(currentProductParams, null); // Reload list data
        }


    } catch (error) {
        showToast(`Lỗi lưu sản phẩm: ${error.message || 'Unknown error'}`, 'error');
        if (error.status === 422 && error.data?.errors) {
            displayFormValidationErrors(DOM.productForm, error.data.errors);
        } else {
            // Display a generic error message near the submit button?
            console.error("Product save error:", error);
        }
    } finally {
        resetButtonLoading(submitButton);
        isLoadingProductAction = false;
    }
}


console.log("Products Section module loaded"); // Debug log