import config from '../../js/config.js';

class AdminDashboard {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.checkAdminAuth();
        this.startAutoRefresh();
    }

    initializeElements() {
        // Statistics elements
        this.todayOrders = document.getElementById('todayOrders');
        this.todayRevenue = document.getElementById('todayRevenue');
        this.activeUsers = document.getElementById('activeUsers');
        this.avgDeliveryTime = document.getElementById('avgDeliveryTime');
        this.pendingOrdersBadge = document.getElementById('pendingOrdersBadge');
        
        // Recent orders elements
        this.recentOrdersTable = document.getElementById('recentOrdersTable');
        this.recentOrdersBody = this.recentOrdersTable.querySelector('tbody');
        
        // Popular items elements
        this.popularItemsContainer = document.getElementById('popularItems');
        
        // Customer activity elements
        this.activityTimeframe = document.getElementById('activityTimeframe');
        this.customerActivity = document.getElementById('customerActivity');
        
        // Other elements
        this.refreshBtn = document.getElementById('refreshStats');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.currentDate = document.getElementById('currentDate');
        
        // Set current date
        const today = new Date();
        this.currentDate.textContent = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setupEventListeners() {
        this.refreshBtn.addEventListener('click', () => this.refreshDashboard());
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.activityTimeframe.addEventListener('change', () => this.loadCustomerActivity());
    }

    checkAdminAuth() {
        const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
        if (!token) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    async refreshDashboard() {
        await Promise.all([
            this.loadDashboardData(),
            this.loadRecentOrders(),
            this.loadPopularItems(),
            this.loadCustomerActivity()
        ]);
        this.showToast('Dashboard refreshed successfully', 'success');
    }

    startAutoRefresh() {
        setInterval(() => {
            this.loadDashboardData(true);
            this.loadRecentOrders(true);
        }, config.UI.REFRESH_INTERVAL);
    }

    async loadDashboardData(silent = false) {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(`${config.API_URL}${config.ENDPOINTS.ADMIN.ANALYTICS.OVERVIEW}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load dashboard data');
            }

            const data = await response.json();
            this.updateDashboardStats(data);

            if (!silent) {
                this.showToast('Dashboard data updated successfully', 'success');
            }
        } catch (error) {
            if (!silent) {
                this.showToast('Failed to load dashboard data', 'error');
            }
            console.error('Error loading dashboard data:', error);
        }
    }

    updateDashboardStats(data) {
        this.todayOrders.textContent = data.todayOrders || '0';
        this.todayRevenue.textContent = `$${(data.todayRevenue || 0).toFixed(2)}`;
        this.activeUsers.textContent = data.activeUsers || '0';
        this.avgDeliveryTime.textContent = `${data.avgDeliveryTime || 0} min`;
        
        // Update pending orders badge
        const pendingCount = data.pendingOrders || 0;
        this.pendingOrdersBadge.textContent = pendingCount;
        this.pendingOrdersBadge.style.display = pendingCount > 0 ? 'inline' : 'none';
    }

    async loadRecentOrders(silent = false) {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(`${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.LIST}?limit=${config.UI.MAX_RECENT_ORDERS}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load recent orders');
            }

            const orders = await response.json();
            this.displayRecentOrders(orders);
        } catch (error) {
            if (!silent) {
                this.showToast('Failed to load recent orders', 'error');
            }
            console.error('Error loading recent orders:', error);
        }
    }

    displayRecentOrders(orders) {
        this.recentOrdersBody.innerHTML = '';
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.items.length} items</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                <td>${new Date(order.createdAt).toLocaleTimeString()}</td>
                <td>
                    <button class="btn btn-icon" onclick="window.location.href='orders.html?id=${order.id}'">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            this.recentOrdersBody.appendChild(row);
        });
    }

    async loadPopularItems(silent = false) {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(`${config.API_URL}${config.ENDPOINTS.ADMIN.ANALYTICS.POPULAR_ITEMS}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load popular items');
            }

            const items = await response.json();
            this.displayPopularItems(items);
        } catch (error) {
            if (!silent) {
                this.showToast('Failed to load popular items', 'error');
            }
            console.error('Error loading popular items:', error);
        }
    }

    displayPopularItems(items) {
        this.popularItemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'popular-item-card';
            itemCard.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <p class="item-orders">${item.orderCount} orders</p>
                </div>
            `;
            this.popularItemsContainer.appendChild(itemCard);
        });
    }

    async loadCustomerActivity() {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const timeframe = this.activityTimeframe.value;
            const response = await fetch(`${config.API_URL}${config.ENDPOINTS.ADMIN.ANALYTICS.CUSTOMERS}?timeframe=${timeframe}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load customer activity');
            }

            const data = await response.json();
            this.displayCustomerActivity(data);
        } catch (error) {
            this.showToast('Failed to load customer activity', 'error');
            console.error('Error loading customer activity:', error);
        }
    }

    displayCustomerActivity(data) {
        // Implement chart visualization using a charting library
        // For now, we'll just show a placeholder
        this.customerActivity.innerHTML = `
            <div class="activity-placeholder">
                <p>Customer activity data loaded for ${this.activityTimeframe.value}</p>
                <p>Active customers: ${data.activeCustomers}</p>
                <p>New registrations: ${data.newRegistrations}</p>
                <p>Repeat customers: ${data.repeatCustomers}</p>
            </div>
        `;
    }

    handleLogout() {
        localStorage.removeItem(config.ADMIN_TOKEN_KEY);
        window.location.href = 'login.html';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        const container = document.querySelector('.toast-container');
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, config.UI.TOAST_DURATION);
    }
}

// Initialize the dashboard
const dashboard = new AdminDashboard(); 