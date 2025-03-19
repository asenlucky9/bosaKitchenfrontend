import config from '../../js/config.js';

class OrdersManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadOrders();
        this.startAutoRefresh();
        
        // Debug info
        console.log('OrdersManager initialized');
        console.log('Config:', config);
        console.log('Admin token:', localStorage.getItem(config.ADMIN_TOKEN_KEY));
    }

    initializeElements() {
        // Table elements
        this.ordersTable = document.getElementById('ordersTable');
        this.searchInput = document.getElementById('searchOrders');
        this.statusFilter = document.getElementById('orderStatus');
        this.exportButton = document.getElementById('exportOrders');
        this.pendingOrdersBadge = document.getElementById('pendingOrdersBadge');

        // Modal elements
        this.modal = document.getElementById('orderModal');
        this.closeBtn = this.modal.querySelector('.close-btn');
        this.orderID = document.getElementById('orderID');
        this.orderDate = document.getElementById('orderDate');
        this.orderStatusUpdate = document.getElementById('orderStatusUpdate');
        this.customerName = document.getElementById('customerName');
        this.customerPhone = document.getElementById('customerPhone');
        this.customerEmail = document.getElementById('customerEmail');
        this.customerAddress = document.getElementById('customerAddress');
        this.orderItems = document.getElementById('orderItems');
        this.subtotal = document.getElementById('subtotal');
        this.tax = document.getElementById('tax');
        this.total = document.getElementById('total');
        this.printButton = document.getElementById('printOrder');
        this.updateButton = document.getElementById('updateOrder');

        // Logout button
        this.logoutBtn = document.getElementById('logoutBtn');

        // Make methods available globally
        window.ordersManager = this;
    }

    setupEventListeners() {
        // Search and filter
        this.searchInput.addEventListener('input', () => this.loadOrders());
        this.statusFilter.addEventListener('change', () => this.loadOrders());
        
        // Modal events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.updateButton.addEventListener('click', () => this.updateOrder());
        this.printButton.addEventListener('click', () => this.printOrder());
        
        // Export
        this.exportButton.addEventListener('click', () => this.exportOrders());
        
        // Logout
        this.logoutBtn.addEventListener('click', () => this.handleLogout());

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    startAutoRefresh() {
        // Refresh orders every 30 seconds
        setInterval(() => this.loadOrders(true), config.UI.REFRESH_INTERVAL);
    }

    async loadOrders(silent = false) {
        try {
            const searchTerm = this.searchInput.value;
            const status = this.statusFilter.value;
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            
            // Debug info
            console.log('Loading orders with params:', {
                searchTerm,
                status,
                hasToken: !!token
            });
            
            const url = `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.LIST}?search=${searchTerm}&status=${status}`;
            console.log('Request URL:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to load orders');
            }
            
            const data = await response.json();
            console.log('Orders data:', data);
            
            this.displayOrders(data.orders);
            this.updatePendingOrdersBadge(data.pendingCount);

            if (!silent) {
                this.showToast('Orders loaded successfully', 'success');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            if (!silent) {
                this.showToast('Failed to load orders', 'error');
            }
        }
    }

    displayOrders(orders) {
        const tbody = this.ordersTable.querySelector('tbody');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${this.escapeHtml(order.customer_name)}</td>
                <td>${order.items.length} items</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>
                    <button class="btn btn-icon" onclick="ordersManager.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updatePendingOrdersBadge(count) {
        this.pendingOrdersBadge.textContent = count;
        this.pendingOrdersBadge.style.display = count > 0 ? 'inline' : 'none';
    }

    async viewOrder(orderId) {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.LIST}/${orderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load order details');
            
            const order = await response.json();
            this.displayOrderDetails(order);
            this.openModal();
        } catch (error) {
            console.error('Error loading order details:', error);
            this.showToast('Failed to load order details', 'error');
        }
    }

    displayOrderDetails(order) {
        this.orderID.textContent = `#${order.id}`;
        this.orderDate.textContent = new Date(order.created_at).toLocaleString();
        this.orderStatusUpdate.value = order.status.toLowerCase();
        
        // Customer details
        this.customerName.textContent = this.escapeHtml(order.customer_name);
        this.customerPhone.textContent = this.escapeHtml(order.phone);
        this.customerEmail.textContent = this.escapeHtml(order.email);
        this.customerAddress.textContent = this.escapeHtml(order.address);

        // Order items
        this.orderItems.innerHTML = order.items.map(item => `
            <tr>
                <td>${this.escapeHtml(item.name)}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        // Order totals
        this.subtotal.textContent = `$${order.subtotal.toFixed(2)}`;
        this.tax.textContent = `$${order.tax.toFixed(2)}`;
        this.total.textContent = `$${order.total.toFixed(2)}`;

        // Store order ID for update
        this.currentOrderId = order.id;
    }

    async updateOrder() {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.UPDATE}/${this.currentOrderId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: this.orderStatusUpdate.value
                    })
                }
            );

            if (!response.ok) throw new Error('Failed to update order');

            this.showToast('Order updated successfully', 'success');
            this.closeModal();
            this.loadOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            this.showToast('Failed to update order', 'error');
        }
    }

    printOrder() {
        const printWindow = window.open('', '_blank');
        const orderDetails = this.modal.querySelector('.modal-body').cloneNode(true);
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order ${this.orderID.textContent}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .info-grid { margin-bottom: 20px; }
                    .items-table { width: 100%; border-collapse: collapse; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; }
                    .order-summary { margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>Order ${this.orderID.textContent}</h1>
                ${orderDetails.innerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    async exportOrders() {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.LIST}/export`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to export orders');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            this.showToast('Orders exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting orders:', error);
            this.showToast('Failed to export orders', 'error');
        }
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
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

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the orders manager
const ordersManager = new OrdersManager(); 