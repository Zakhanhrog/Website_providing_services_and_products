// js/sections/content.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import { showToast, showConfirmationModal, showLoading, hideLoading, displayTableEmptyState } from '../utils.js';
import { setupTabs } from '../ui.js';
// Import WYSIWYG service if needed for editing pages
// import { initWysiwyg, destroyWysiwyg } from '../services/libraryService.js';

let isLoadingContentAction = false;

/**
 * Initializes the Content section, sets up tabs.
 * Maybe loads initial data for the default tab.
 */
export async function loadContentSection(params = {}) {
    console.log("Initializing Content Section...");
    if (!DOM.contentSection) return;

    // Setup tabs first
    const activeTabId = params.tab ? `content-${params.tab}` : null;
    setupTabs(DOM.contentTabs, DOM.contentTabContents, activeTabId);

    // Load data for the active tab (or default)
    const activeTabLink = DOM.contentSection.querySelector('.content-tabs .tab-link.active');
    const tabNameToLoad = activeTabLink?.dataset?.tab || 'content-pages'; // Default to pages

    await loadContentTabData(tabNameToLoad.replace('content-', ''));
}

/**
 * Loads data for a specific content tab (Pages, Banners, FAQ).
 * @param {string} tabName - 'pages', 'banners', 'faq'.
 */
async function loadContentTabData(tabName) {
    console.log(`Loading content data for tab: ${tabName}`);
    const tabContentElement = document.getElementById(`content-${tabName}`);
    if (!tabContentElement) return;

    showLoading(tabContentElement);
    try {
        switch (tabName) {
            case 'pages':
                // await loadPagesData(tabContentElement);
                console.warn("Load Pages Data logic not implemented.");
                displayTableEmptyState(DOM.contentSection.querySelector('#contentPagesTableBody'), 'Chức năng quản lý trang tĩnh chưa được cài đặt.', 4);
                break;
            case 'banners':
                // await loadBannersData(tabContentElement);
                console.warn("Load Banners Data logic not implemented.");
                tabContentElement.querySelector('.banner-list-placeholder').innerHTML = '<p class="text-muted p-3">Chức năng quản lý banner chưa được cài đặt.</p>';
                break;
            case 'faq':
                // await loadFaqData(tabContentElement);
                console.warn("Load FAQ Data logic not implemented.");
                displayTableEmptyState(DOM.contentSection.querySelector('#contentFaqTableBody'), 'Chức năng quản lý FAQ chưa được cài đặt.', 3);
                break;
            default:
                console.warn(`Unknown content tab: ${tabName}`);
        }
    } catch (error) {
        showToast(`Lỗi tải dữ liệu ${tabName}: ${error.message}`, 'error');
        tabContentElement.innerHTML = `<p class="text-danger">Không thể tải dữ liệu.</p>`;
    } finally {
        hideLoading(tabContentElement);
    }
}

// --- Placeholder functions for specific content types ---

async function loadPagesData(container) {
    // const pages = await apiService.getContentPages();
    // renderPagesTable(pages);
}

function renderPagesTable(pages) {
    // const tableBody = container.querySelector('#contentPagesTableBody');
    // ... rendering logic ...
}

async function loadBannersData(container) {
    // const banners = await apiService.getBanners();
    // renderBannersList(banners);
}

function renderBannersList(banners) {
    // const listContainer = container.querySelector('.banner-list-placeholder');
    // ... rendering logic ...
    // TODO: Implement drag & drop sorting using SortableJS or similar
}

async function loadFaqData(container) {
    // const faqs = await apiService.getFaqs();
    // renderFaqTable(faqs);
}

function renderFaqTable(faqs) {
    // const tableBody = container.querySelector('#contentFaqTableBody');
    // ... rendering logic ...
}

// --- Event Handlers (Placeholders) ---

export function handleContentPagesClick(event) {
    if (isLoadingContentAction) return;
    const addBtn = event.target.closest('.btn-add-page'); // Assuming button class
    const editBtn = event.target.closest('.btn-edit-page');
    const deleteBtn = event.target.closest('.btn-delete-page');

    if (addBtn) {
        console.log("Placeholder: Show Add Page Form");
        // showPageForm(); // Needs implementation
    } else if (editBtn) {
        const pageId = editBtn.dataset.pageId;
        console.log(`Placeholder: Show Edit Page Form for ID: ${pageId}`);
        // showPageForm(pageId); // Needs implementation
    } else if (deleteBtn) {
        const pageId = deleteBtn.dataset.pageId;
        const pageName = deleteBtn.dataset.pageName || `ID ${pageId}`;
        console.log(`Placeholder: Delete Page ID: ${pageId}`);
        // handleDeletePage(pageId, pageName, deleteBtn); // Needs implementation
    }
}

export function handleBannersClick(event) {
    // Handle add, edit, delete banner clicks
    console.log("Placeholder: Handle Banner actions");
}

export function handleFaqClick(event) {
    // Handle add, edit, delete FAQ clicks
    console.log("Placeholder: Handle FAQ actions");
}


console.log("Content Section module loaded"); // Debug log