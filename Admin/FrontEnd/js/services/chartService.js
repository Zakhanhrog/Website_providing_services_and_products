
// js/services/chartService.js
// Make sure Chart.js is loaded globally or import it if using a bundler
// import Chart from 'chart.js/auto'; // Example if using npm package

let charts = {}; // Store chart instances internally

/** Destroys all existing Chart.js instances. */
function destroyCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
    // console.log("Charts destroyed.");
}

/** Resizes all active Chart.js instances. */
export function resizeAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            // Check if canvas parent is visible before resizing
            if (chart.canvas.offsetParent !== null) {
                chart.resize();
            }
        }
    });
    // console.log("Charts resized.");
}

/**
 * Initializes charts for a specific section using provided data.
 * @param {string} sectionId - 'dashboard' or 'reports'.
 * @param {object} sectionData - Data object containing chart data for the section (e.g., { charts: { revenue: ..., orderStatus: ... } }).
 * @param {object} contexts - Object containing canvas contexts (e.g., { revenueChartCtx, orderStatusChartCtx }).
 */
export function initChartsForSection(sectionId, sectionData, contexts) {
    if (!window.Chart) {
        console.error("Chart.js is not loaded.");
        return;
    }

    destroyCharts(); // Clear existing charts first
    console.log(`Initializing charts for section: ${sectionId}`);

    const commonOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: { color: 'rgba(245, 246, 250, 0.8)', padding: 15 },
                position: 'bottom',
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 4,
            }
        },
        scales: {
            x: {
                ticks: { color: 'rgba(245, 246, 250, 0.7)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false }
            },
            y: {
                ticks: { color: 'rgba(245, 246, 250, 0.7)', beginAtZero: true },
                grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false }
            }
        },
        animation: {
            duration: 800,
            easing: 'easeInOutQuart'
        }
    };

    const lineOptions = { ...commonOptions };
    const barOptions = { ...commonOptions };
    const doughnutOptions = {
        ...commonOptions,
        scales: {}, // No scales needed
        cutout: '60%',
    };

    try {
        // --- Dashboard Charts ---
        if (sectionId === 'dashboard' && sectionData?.charts) {
            const data = sectionData.charts;
            if (contexts.revenueChartCtx && data.revenue) {
                charts.revenue = new Chart(contexts.revenueChartCtx, {
                    type: 'line',
                    data: { labels: data.revenue.labels, datasets: [{ label: 'Doanh thu', data: data.revenue.data, borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#6c5ce7', pointHoverRadius: 6 }] },
                    options: lineOptions
                });
            }
            if (contexts.orderStatusChartCtx && data.orderStatus) {
                charts.orderStatus = new Chart(contexts.orderStatusChartCtx, {
                    type: 'doughnut',
                    data: { labels: data.orderStatus.labels, datasets: [{ data: data.orderStatus.data, backgroundColor: ['#fdcb6e', '#0984e3', '#00b894', '#d63031'], hoverOffset: 8, borderColor: '#3b4446', borderWidth: 2 }] },
                    options: doughnutOptions
                });
            }
            if (contexts.topProductsChartCtx && data.topProducts) {
                charts.topProducts = new Chart(contexts.topProductsChartCtx, {
                    type: 'bar',
                    data: { labels: data.topProducts.labels, datasets: [{ label: 'Số lượng bán', data: data.topProducts.data, backgroundColor: 'rgba(162, 155, 254, 0.7)', borderColor: '#a29bfe', borderWidth: 1, borderRadius: 4 }] },
                    options: barOptions
                });
            }
        }
        // --- Reports Charts ---
        else if (sectionId === 'reports' && sectionData?.charts) {
            const data = sectionData.charts;
            if (contexts.reportRevenueChartCtx && data.reportRevenue) {
                charts.reportRevenue = new Chart(contexts.reportRevenueChartCtx, {
                    type: 'line',
                    data: { labels: data.reportRevenue.labels, datasets: [{ label: 'Doanh thu theo kỳ', data: data.reportRevenue.data, borderColor: '#6c5ce7', backgroundColor: 'rgba(108, 92, 231, 0.1)', fill: true, tension: 0.1 }] },
                    options: lineOptions
                });
            }
            if (contexts.reportTopProductsChartCtx && data.reportProducts) {
                charts.reportTopProducts = new Chart(contexts.reportTopProductsChartCtx, {
                    type: 'bar',
                    data: { labels: data.reportProducts.labels, datasets: [{ label: 'Doanh thu SP', data: data.reportProducts.data, backgroundColor: 'rgba(162, 155, 254, 0.7)', borderColor: '#a29bfe', borderWidth: 1 }] },
                    options: barOptions
                });
            }
            // Add more report charts as needed
        }

        // Resize after a short delay to ensure container dimensions are stable
        setTimeout(resizeAllCharts, 150); // Slightly longer delay

    } catch (error) {
        console.error("Error initializing charts:", error);
        // Consider using the imported showToast function if UI module is also imported here
        // showToast("Could not load charts.", "error");
    }
}


console.log("Chart Service loaded"); // Debug log