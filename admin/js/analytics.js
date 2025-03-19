import config from '../../js/config.js';

class Analytics {
    constructor() {
        this.timeframeSelect = document.getElementById('timeframeSelect');
        this.salesChart = document.getElementById('salesChart');
        this.itemsChart = document.getElementById('itemsChart');
        this.customerChart = document.getElementById('customerChart');
        this.setupEventListeners();
        this.loadAnalytics();
    }

    setupEventListeners() {
        this.timeframeSelect.addEventListener('change', () => this.loadAnalytics());
        
        // Export buttons
        document.getElementById('exportSalesReport').addEventListener('click', () => this.exportReport('sales'));
        document.getElementById('exportItemsReport').addEventListener('click', () => this.exportReport('items'));
        document.getElementById('exportCustomerReport').addEventListener('click', () => this.exportReport('customers'));
    }

    async loadAnalytics() {
        const timeframe = this.timeframeSelect.value;
        await Promise.all([
            this.loadSalesAnalytics(timeframe),
            this.loadPopularItems(timeframe),
            this.loadCustomerAnalytics(timeframe)
        ]);
    }

    async loadSalesAnalytics(timeframe) {
        try {
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ANALYTICS.SALES}?timeframe=${timeframe}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load sales analytics');
            
            const data = await response.json();
            this.displaySalesChart(data);
            this.updateSalesMetrics(data);
        } catch (error) {
            console.error('Error loading sales analytics:', error);
            showToast('Failed to load sales analytics', 'error');
        }
    }

    displaySalesChart(data) {
        const ctx = this.salesChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.revenue,
                    borderColor: '#4CAF50',
                    tension: 0.1
                }, {
                    label: 'Orders',
                    data: data.orders,
                    borderColor: '#2196F3',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateSalesMetrics(data) {
        document.getElementById('totalRevenue').textContent = `$${data.totalRevenue.toFixed(2)}`;
        document.getElementById('totalOrders').textContent = data.totalOrders;
        document.getElementById('averageOrderValue').textContent = `$${data.averageOrderValue.toFixed(2)}`;
        document.getElementById('salesGrowth').textContent = `${data.growthRate}%`;
        
        // Update growth indicators
        const growthElement = document.getElementById('salesGrowth');
        growthElement.className = `metric ${data.growthRate >= 0 ? 'positive' : 'negative'}`;
        growthElement.innerHTML = `
            <i class="fas fa-${data.growthRate >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
            ${Math.abs(data.growthRate)}%
        `;
    }

    async loadPopularItems(timeframe) {
        try {
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ANALYTICS.POPULAR_ITEMS}?timeframe=${timeframe}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load popular items');
            
            const data = await response.json();
            this.displayItemsChart(data);
            this.updateItemsTable(data);
        } catch (error) {
            console.error('Error loading popular items:', error);
            showToast('Failed to load popular items', 'error');
        }
    }

    displayItemsChart(data) {
        const ctx = this.itemsChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.items.map(item => item.name),
                datasets: [{
                    label: 'Orders',
                    data: data.items.map(item => item.orderCount),
                    backgroundColor: '#4CAF50'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateItemsTable(data) {
        const tableBody = document.getElementById('popularItemsTable');
        tableBody.innerHTML = data.items.map(item => `
            <tr>
                <td>
                    <div class="item-info">
                        <img src="${this.escapeHtml(item.imageUrl)}" alt="${this.escapeHtml(item.name)}">
                        <span>${this.escapeHtml(item.name)}</span>
                    </div>
                </td>
                <td>${item.orderCount}</td>
                <td>$${item.revenue.toFixed(2)}</td>
                <td>
                    <div class="trend ${item.trend >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-${item.trend >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                        ${Math.abs(item.trend)}%
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadCustomerAnalytics(timeframe) {
        try {
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ANALYTICS.CUSTOMER_ACTIVITY}?timeframe=${timeframe}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load customer analytics');
            
            const data = await response.json();
            this.displayCustomerChart(data);
            this.updateCustomerMetrics(data);
        } catch (error) {
            console.error('Error loading customer analytics:', error);
            showToast('Failed to load customer analytics', 'error');
        }
    }

    displayCustomerChart(data) {
        const ctx = this.customerChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'New Customers',
                    data: data.newCustomers,
                    borderColor: '#4CAF50',
                    tension: 0.1
                }, {
                    label: 'Returning Customers',
                    data: data.returningCustomers,
                    borderColor: '#2196F3',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateCustomerMetrics(data) {
        document.getElementById('totalCustomers').textContent = data.totalCustomers;
        document.getElementById('newCustomers').textContent = data.newCustomersCount;
        document.getElementById('returningCustomers').textContent = data.returningCustomersCount;
        document.getElementById('customerRetentionRate').textContent = `${data.retentionRate}%`;
    }

    async exportReport(type) {
        try {
            const timeframe = this.timeframeSelect.value;
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ANALYTICS[type.toUpperCase()]}/export?timeframe=${timeframe}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error(`Failed to export ${type} report`);
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            
            showToast(`${type} report exported successfully`, 'success');
        } catch (error) {
            console.error(`Error exporting ${type} report:`, error);
            showToast(`Failed to export ${type} report`, 'error');
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new Analytics();
}); 