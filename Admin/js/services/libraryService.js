
// js/services/libraryService.js
import { showToast } from '../utils.js';

/**
 * Initializes WYSIWYG editors.
 * Placeholder: Implement using TinyMCE, CKEditor, etc.
 * @param {string} selector - CSS selector for the textarea(s).
 */
export function initWysiwyg(selector = 'textarea.wysiwyg-editor') {
    console.log(`Placeholder: Initializing WYSIWYG for selector: ${selector}`);
    /*
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: selector,
            plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
            toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            height: 300,
            skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
            content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'),
            // Add other configuration
            setup: (editor) => {
                editor.on('init', () => console.log(`TinyMCE initialized for #${editor.id}`));
            }
        });
    } else {
        console.warn("TinyMCE not loaded. WYSIWYG editor cannot be initialized.");
    }
    */
}

/**
 * Destroys WYSIWYG editor instances.
 * @param {string} selector - CSS selector for the textarea(s).
 */
export function destroyWysiwyg(selector = 'textarea.wysiwyg-editor') {
    console.log(`Placeholder: Destroying WYSIWYG for selector: ${selector}`);
    /*
    if (typeof tinymce !== 'undefined') {
        const editors = tinymce.get(selector); // Might return array or single instance
        if (editors) {
            (Array.isArray(editors) ? editors : [editors]).forEach(editor => {
                console.log(`Removing TinyMCE instance for #${editor.id}`);
                editor.remove();
            });
        }
    }
    */
}

/**
 * Gets content from a WYSIWYG editor instance.
 * @param {string} editorId - The ID of the textarea associated with the editor.
 * @returns {string} The editor content (HTML).
 */
export function getWysiwygContent(editorId) {
    console.log(`Placeholder: Getting WYSIWYG content for editor ID: ${editorId}`);
    /*
    if (typeof tinymce !== 'undefined') {
        const editor = tinymce.get(editorId);
        if (editor) {
            return editor.getContent();
        }
    }
    */
    // Fallback to textarea value if editor not found/loaded
    const textarea = document.getElementById(editorId);
    return textarea ? textarea.value : '';
}

/**
 * Sets content for a WYSIWYG editor instance.
 * @param {string} editorId - The ID of the textarea associated with the editor.
 * @param {string} content - The HTML content to set.
 */
export function setWysiwygContent(editorId, content) {
    console.log(`Placeholder: Setting WYSIWYG content for editor ID: ${editorId}`);
    /*
    if (typeof tinymce !== 'undefined') {
        const editor = tinymce.get(editorId);
        if (editor) {
            editor.setContent(content || '');
            return;
        }
    }
    */
    // Fallback to textarea value if editor not found/loaded
    const textarea = document.getElementById(editorId);
    if (textarea) {
        textarea.value = content || '';
    }
}

/**
 * Initializes Select2/Choices.js components.
 * Placeholder: Implement using the chosen library.
 * @param {string} selector - CSS selector for the select element(s).
 * @param {object} options - Configuration options for the library.
 */
export function initSelectComponents(selector = 'select.select2-searchable', options = {}) {
    console.log(`Placeholder: Initializing Select2/Choices for selector: ${selector}`);
    /*
    // Example using Select2 (requires jQuery)
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 === 'function') {
        $(selector).select2({
            width: '100%', // Ensure it takes full width
            theme: 'bootstrap-5', // Example theme if using Bootstrap 5 adapter
            dropdownParent: $(selector).closest('.modal, .content-block'), // Adjust dropdown parent if needed
            ...options // Spread additional options
        }).on('select2:open', () => {
             // Fix search box focus issue if inside modal
             document.querySelector('.select2-search__field')?.focus();
        });
        console.log('Select2 initialized.');
    } else {
        console.warn("jQuery or Select2 not loaded. Select components cannot be initialized.");
    }

    // Example using Choices.js (no jQuery needed)
    if (typeof Choices !== 'undefined') {
        document.querySelectorAll(selector).forEach(el => {
            new Choices(el, {
                removeItemButton: true, // Example option
                searchEnabled: true,
                itemSelectText: '',
                ...options
            });
        });
         console.log('Choices.js initialized.');
    } else {
         console.warn("Choices.js not loaded. Select components cannot be initialized.");
    }
    */
}

/**
 * Destroys Select2/Choices.js instances.
 * @param {string} selector - CSS selector for the select element(s).
 */
export function destroySelectComponents(selector = 'select.select2-searchable') {
    console.log(`Placeholder: Destroying Select2/Choices for selector: ${selector}`);
    /*
    // Example using Select2 (requires jQuery)
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 === 'function') {
        $(selector).each(function() {
            if ($(this).data('select2')) { // Check if initialized
                $(this).select2('destroy');
            }
        });
        console.log('Select2 instances destroyed.');
    }

    // Example using Choices.js
    // Choices instances might be stored globally or need specific tracking to destroy
    // const choicesInstances = window.myChoicesInstances || []; // Example tracking
    // choicesInstances.forEach(instance => instance.destroy());
    // window.myChoicesInstances = []; // Clear tracked instances
    console.log('Choices.js instances need manual tracking/destruction.');
    */
}

/**
 * Gets selected values from a Select2/Choices component.
 * @param {string} elementId - The ID of the select element.
 * @returns {string|string[]} - Selected value(s).
 */
export function getSelectComponentValue(elementId) {
    console.log(`Placeholder: Getting Select2/Choices value for ID: ${elementId}`);
    const element = document.getElementById(elementId);
    if (!element) return null;

    /*
    // Example using Select2 (requires jQuery)
     if (typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 === 'function' && $(element).data('select2')) {
        return $(element).val(); // Returns value or array of values for multi-select
     }
     */

    // Example using Choices.js (assuming instance is tracked or accessible)
    // const choicesInstance = findChoicesInstanceById(elementId); // Needs helper function
    // if (choicesInstance) {
    //     return choicesInstance.getValue(true); // Returns value or array of values
    // }

    // Fallback to standard select value
    if (element.multiple) {
        return Array.from(element.selectedOptions).map(option => option.value);
    } else {
        return element.value;
    }
}

/**
 * Sets selected values for a Select2/Choices component.
 * @param {string} elementId - The ID of the select element.
 * @param {string|string[]} value - Value(s) to set.
 */
export function setSelectComponentValue(elementId, value) {
    console.log(`Placeholder: Setting Select2/Choices value for ID: ${elementId}`, value);
    const element = document.getElementById(elementId);
    if (!element) return;

    /*
    // Example using Select2 (requires jQuery)
     if (typeof jQuery !== 'undefined' && typeof jQuery.fn.select2 === 'function' && $(element).data('select2')) {
        $(element).val(value).trigger('change.select2'); // Set value and trigger change event
        return;
     }
     */

    // Example using Choices.js
    // const choicesInstance = findChoicesInstanceById(elementId); // Needs helper function
    // if (choicesInstance) {
    //      // Ensure value is array for setValue with multiple=true
    //      const valuesToSet = Array.isArray(value) ? value : [value];
    //      choicesInstance.setValue(valuesToSet);
    //      return;
    // }


    // Fallback to standard select value
    if (element.multiple && Array.isArray(value)) {
        Array.from(element.options).forEach(option => {
            option.selected = value.includes(option.value);
        });
    } else if (!element.multiple) {
        element.value = value || '';
    }
}

/**
 * Initializes Date/DateTime pickers.
 * Placeholder: Implement using Flatpickr, etc.
 * @param {string} selector - CSS selector for the input element(s).
 */
export function initDatePickers(selector = '.date-picker') {
    console.log(`Placeholder: Initializing Date Pickers for selector: ${selector}`);
    /*
    if (typeof flatpickr !== 'undefined') {
        document.querySelectorAll(selector).forEach(el => {
            const isDateTime = el.type === 'datetime-local';
            flatpickr(el, {
                enableTime: isDateTime,
                dateFormat: isDateTime ? "Y-m-d H:i" : "Y-m-d", // Format for submission
                altInput: true, // Show user-friendly format
                altFormat: isDateTime ? "d/m/Y H:i" : "d/m/Y",
                time_24hr: true,
                // locale: "vn" // If Vietnamese locale is loaded
            });
        });
        console.log("Flatpickr initialized.");
    } else {
        console.warn("Flatpickr not loaded. Date pickers cannot be initialized.");
    }
    */
}

/**
 * Initializes image upload previews and interactions.
 * Placeholder: Implement file handling, preview generation, and removal logic.
 * @param {object} options - Configuration { uploadInputId, previewContainerId, isMultiple }.
 */
export function initImageUpload(options) {
    const { uploadInputId, previewContainerId, isMultiple = false } = options;
    console.log(`Placeholder: Initializing Image Upload for input #${uploadInputId} and preview #${previewContainerId}`);

    const inputElement = document.getElementById(uploadInputId);
    const previewContainer = document.getElementById(previewContainerId);
    const uploadPlaceholder = document.querySelector(`[aria-labelledby="${uploadInputId}Label"]`); // Assuming label exists

    if (!inputElement || !previewContainer) {
        console.error("Image upload input or preview container not found.");
        return;
    }

    // Trigger file input click when placeholder is clicked
    uploadPlaceholder?.addEventListener('click', () => inputElement.click());

    inputElement.addEventListener('change', (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Clear previous previews if not multiple
        if (!isMultiple) {
            previewContainer.innerHTML = '';
        }

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                showToast(`File "${file.name}" is not a valid image.`, 'warning');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const previewHTML = `
                    <div class="gallery-item" data-filename="${file.name}">
                        <img src="${e.target.result}" alt="Preview of ${file.name}">
                        <button type="button" class="btn-icon btn-remove-image" title="Remove image" aria-label="Remove ${file.name}">
                            &times;
                        </button>
                    </div>
                `;
                previewContainer.insertAdjacentHTML('beforeend', previewHTML);
            };
            reader.readAsDataURL(file);
        });

        // Clear the input value to allow selecting the same file again if needed
        // inputElement.value = ''; // Be careful, this prevents direct form submission of the file list
    });

    // Add event listener for removing images (delegated)
    previewContainer.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.btn-remove-image');
        if (removeButton) {
            const itemToRemove = removeButton.closest('.gallery-item');
            const filename = itemToRemove?.dataset.filename;
            console.log(`Placeholder: Removing image preview for "${filename}"`);
            itemToRemove?.remove();
            // TODO: Add logic here to also remove the corresponding file from the
            // inputElement.files list or manage uploaded files separately if needed for submission.
            // This is tricky as the FileList object is read-only.
            // Often requires storing selected files in a separate array.
            showToast(`Image "${filename}" removed from preview.`, 'info');
        }
    });

    // TODO: Implement Drag & Drop functionality for upload placeholders.
    // TODO: Implement Drag & Drop sorting for gallery previews.
    // TODO: Implement actual file upload logic via API when form is submitted.
}

/**
 * Clears image previews for a specific upload component.
 * @param {string} previewContainerId - ID of the preview container.
 * @param {string} [uploadInputId] - Optional ID of the file input to reset.
 */
export function clearImagePreviews(previewContainerId, uploadInputId) {
    console.log(`Placeholder: Clearing image previews for #${previewContainerId}`);
    const previewContainer = document.getElementById(previewContainerId);
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }
    if (uploadInputId) {
        const inputElement = document.getElementById(uploadInputId);
        if (inputElement) {
            inputElement.value = ''; // Clear selected files from input
        }
    }
}

console.log("Library Service loaded"); // Debug log