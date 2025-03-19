import config from '../../js/config.js';

class CustomerManager {
    constructor() {
        this.customersTable = document.getElementById('customersTable');
        this.customerDetails = document.getElementById('customerDetails');
        this.searchInput = document.getElementById('customerSearch');
        this.filterSelect = document.getElementById('customerFilter');
        this.setupEventListeners();
        this.loadCustomers();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', debounce(() => this.loadCustomers(), 300));
        this.filterSelect.addEventListener('change', () => this.loadCustomers());
        
        // Export customers button
        document.getElementById('exportCustomers').addEventListener('click', () => this.exportCustomerData());
    }

    async loadCustomers() {
        try {
            const searchTerm = this.searchInput.value;
            const filter = this.filterSelect.value;
            
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.CUSTOMERS.ALL}?search=${searchTerm}&filter=${filter}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load customers');
            
            const customers = await response.json();
            this.displayCustomers(customers);
        } catch (error) {
            console.error('Error loading customers:', error);
            showToast('Failed to load customers', 'error');
        }
    }

    displayCustomers(customers) {
        this.customersTable.innerHTML = customers.map(customer => `
            <tr data-customer-id="${customer.id}">
                <td>
                    <div class="customer-info">
                        <img src="${this.getCustomerAvatar(customer)}" alt="Avatar" class="customer-avatar">
                        <div>
                            <strong>${this.escapeHtml(customer.name)}</strong>
                            <small>${this.escapeHtml(customer.email)}</small>
                        </div>
                    </div>
                </td>
                <td>${this.formatDate(customer.registeredDate)}</td>
                <td>${customer.totalOrders}</td>
                <td>$${customer.totalSpent.toFixed(2)}</td>
                <td>
                    <span class="status-badge ${customer.isActive ? 'active' : 'inactive'}">
                        ${customer.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="viewCustomerDetails('${customer.id}')" class="btn-icon">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="viewCustomerOrders('${customer.id}')" class="btn-icon">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                        <button onclick="editCustomer('${customer.id}')" class="btn-icon">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async viewCustomerDetails(customerId) {
        try {
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.CUSTOMERS.DETAILS(customerId)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load customer details');
            
            const customer = await response.json();
            this.showCustomerDetailsModal(customer);
        } catch (error) {
            console.error('Error loading customer details:', error);
            showToast('Failed to load customer details', 'error');
        }
    }

    showCustomerDetailsModal(customer) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Customer Details</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="customer-profile">
                        <img src="${this.getCustomerAvatar(customer)}" alt="Customer Avatar" class="large-avatar">
                        <div class="customer-stats">
                            <h3>${this.escapeHtml(customer.name)}</h3>
                            <p>${this.escapeHtml(customer.email)}</p>
                            <p>Member since: ${this.formatDate(customer.registeredDate)}</p>
                        </div>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h4>Total Orders</h4>
                            <p>${customer.totalOrders}</p>
                        </div>
                        <div class="stat-card">
                            <h4>Total Spent</h4>
                            <p>$${customer.totalSpent.toFixed(2)}</p>
                        </div>
                        <div class="stat-card">
                            <h4>Average Order Value</h4>
                            <p>$${(customer.totalSpent / customer.totalOrders || 0).toFixed(2)}</p>
                        </div>
                        <div class="stat-card">
                            <h4>Last Order</h4>
                            <p>${this.formatDate(customer.lastOrderDate)}</p>
                        </div>
                    </div>
                    <div class="customer-preferences">
                        <h3>Preferences</h3>
                        <div class="preferences-grid">
                            ${this.renderPreferences(customer.preferences)}
                        </div>
                    </div>
                    <div class="order-history-preview">
                        <h3>Recent Orders</h3>
                        ${this.renderRecentOrders(customer.recentOrders)}
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="editCustomer('${customer.id}')" class="btn btn-primary">
                        <i class="fas fa-edit"></i> Edit Customer
                    </button>
                    <button onclick="viewCustomerOrders('${customer.id}')" class="btn btn-secondary">
                        <i class="fas fa-shopping-bag"></i> View All Orders
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.querySelector('.close-btn').onclick = () => modal.remove();
    }

    renderPreferences(preferences) {
        return `
            <div class="preference-item">
                <i class="fas fa-utensils"></i>
                <span>Favorite Items:</span>
                <p>${preferences.favoriteItems.join(', ') || 'No favorites yet'}</p>
            </div>
            <div class="preference-item">
                <i class="fas fa-clock"></i>
                <span>Preferred Order Time:</span>
                <p>${preferences.preferredOrderTime || 'No preference'}</p>
            </div>
            <div class="preference-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>Delivery Address:</span>
                <p>${preferences.deliveryAddress || 'No address saved'}</p>
            </div>
            <div class="preference-item">
                <i class="fas fa-comment"></i>
                <span>Special Instructions:</span>
                <p>${preferences.specialInstructions || 'None'}</p>
            </div>
        `;
    }

    renderRecentOrders(orders) {
        if (!orders || orders.length === 0) {
            return '<p class="no-orders">No orders yet</p>';
        }

        return `
            <table class="recent-orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${this.formatDate(order.date)}</td>
                            <td>${order.items.length} items</td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td>
                                <span class="status-badge status-${order.status.toLowerCase()}">
                                    ${order.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async exportCustomerData() {
        try {
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.CUSTOMERS.EXPORT}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to export customer data');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            
            showToast('Customer data exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting customer data:', error);
            showToast('Failed to export customer data', 'error');
        }
    }

    getCustomerAvatar(customer) {
        return customer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random`;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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
    window.customerManager = new CustomerManager();
}); 