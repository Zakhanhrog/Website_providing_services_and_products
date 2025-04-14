// js/sections/reports.js
import apiService from '../api.js';
import * as DOM from '../domElements.js';
import { showToast, formatAdminCurrency, showLoading, hideLoading, displayEmptyState } from '../utils.js';
import { initChartsForSection } from '../services/chartService.js';
// import { initDatePickers } from '../services/libraryService.js'; // If using date pickers

let isLoadingReportAction = false;

/**
 * Loads and renders data for the Reports section.
 * @param {object} params - Filter parameters (e.g., date range, report type).
 */
export async function loadReportData(params = {}) {
    console.log("Loading report data with params:", params);
    if (!DOM.reportsSection) return;
    showLoading(DOM.reportsSection);

    try {
        // TODO: Define API call for report data based on params
        // const reportData = await apiService.getReportData(params);
        // --- Simulation ---
        await new Promise(resolve => setTimeout(resolve, 600));
        const reportData = {
            charts: {
                // Simulate different data based on params (e.g., date range)
                reportRevenue: { labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4'], data: [50, 75, 60, 90].map(v => v * 1000000) },
                reportProducts: { labels: ['Laptop ABC', 'Phone XYZ', 'Mouse Pro'], data: [300, 250, 150].map(v => v * 100000) }
            },
            summary: {
                lowStockCount: 5, outOfStockCount: 2, totalInventoryValue: 150000000,
                newCustomers: 50, returningCustomerRate: 0.25,
                totalServices: 15, avgServiceTime: 9000 // seconds (2.5 hours)
            }
        };
        // --- End Simulation ---

        // Render report summaries
        renderReportSummary(reportData.summary);

        // Initialize charts for reports
        const chartContexts = {
            reportRevenueChartCtx: DOM.reportRevenueChartCtx,
            reportTopProductsChartCtx: DOM.reportTopProductsChartCtx
        };
        initChartsForSection('reports', reportData, chartContexts);

        // Initialize date pickers if they exist
        // initDatePickers('#reportStartDate, #reportEndDate');

    } catch (error) {
        showToast(`Lỗi tải báo cáo: ${error.message}`, 'error');
        displayEmptyState(DOM.reportsSection.querySelector('.report-grid') || DOM.reportsSection, 'Không thể tải dữ liệu báo cáo.', 1);
    } finally {
        hideLoading(DOM.reportsSection);
    }
}

/** Renders the summary data into the report blocks */
function renderReportSummary(summary) {
    if (!summary) return;

    if (DOM.reportLowStockCount) DOM.reportLowStockCount.textContent = summary.lowStockCount ?? 'N/A';
    if (DOM.reportOutOfStockCount) DOM.reportOutOfStockCount.textContent = summary.outOfStockCount ?? 'N/A';
    if (DOM.reportInventoryValue) DOM.reportInventoryValue.textContent = formatAdminCurrency(summary.totalInventoryValue || 0);

    if (DOM.reportNewCustomers) DOM.reportNewCustomers.textContent = summary.newCustomers ?? 'N/A';
    if (DOM.reportReturningRate) DOM.reportReturningRate.textContent = summary.returningCustomerRate ? `${(summary.returningCustomerRate * 100).toFixed(1)}%` : 'N/A';
    // TODO: Render Top Customers (might need more complex HTML)
    const topCustomersEl = document.getElementById('reportTopCustomers');
    if (topCustomersEl) topCustomersEl.textContent = '...'; // Placeholder

    if (DOM.reportTotalServices) DOM.reportTotalServices.textContent = summary.totalServices ?? 'N/A';
    // TODO: Render Services by Type (might need chart or list)
    const servicesByTypeEl = document.getElementById('reportServicesByType');
    if (servicesByTypeEl) servicesByTypeEl.textContent = '...'; // Placeholder
    if (DOM.reportAvgServiceTime) {
        const avgMinutes = summary.avgServiceTime ? Math.round(summary.avgServiceTime / 60) : 0;
        DOM.reportAvgServiceTime.textContent = avgMinutes > 0 ? `${avgMinutes} phút` : 'N/A';
    }
}

/** Handles clicking the "View Report" button */
export function handleViewReport() {
    if (isLoadingReportAction) return;
    console.log("Viewing Report...");
    // Gather filter parameters
    const params = {
        startDate: document.getElementById('reportStartDate')?.value,
        endDate: document.getElementById('reportEndDate')?.value,
        type: document.getElementById('reportType')?.value,
    };
    // Remove empty params
    Object.keys(params).forEach(key => !params[key] && delete params[key]);

    // Reload data with new params
    loadReportData(params);
}

/** Handles clicking the "Export Report" button (Placeholder) */
export async function handleExportReport() {
    if (isLoadingReportAction) return;
    const reportType = document.getElementById('reportType')?.value || 'revenue';
    const actionText = `Xuất báo cáo ${reportType}`;

    const confirmed = await showConfirmationModal(`Bạn có muốn ${actionText}? Quá trình này có thể mất vài phút.`);

    if (confirmed) {
        isLoadingReportAction = true;
        const exportButton = DOM.reportsSection?.querySelector('.btn-export-report');
        if (exportButton) setButtonLoading(exportButton, 'Đang xuất...');

        console.log(`Placeholder: Exporting ${reportType} report...`);
        showToast(`Đang chuẩn bị ${actionText}...`, 'info');

        // TODO: Implement actual export logic
        // 1. Gather current filter parameters
        // 2. Call an API endpoint like `/api/admin/reports/export?type=${reportType}&startDate=...&endDate=...`
        // 3. Handle the file download response (e.g., Blob)
        try {
            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate delay
            // --- End Simulation ---
            // Example: Assume API returns a download URL or triggers download
            // const result = await apiService.exportReport(params); // Needs API implementation
            // window.location.href = result.downloadUrl; // Example redirect for download
            showToast(`${actionText} thành công! Kiểm tra thư mục tải xuống.`, 'success');
        } catch (error) {
            showToast(`Lỗi ${actionText}: ${error.message}`, 'error');
        } finally {
            if (exportButton) resetButtonLoading(exportButton);
            isLoadingReportAction = false;
        }
    }
}


console.log("Reports Section module loaded"); // Debug log