import config from '../../js/config.js';

class WebSocketManager {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.connect();
    }

    connect() {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) return;

        // Convert HTTP/HTTPS to WS/WSS
        const wsUrl = config.API_URL.replace('http', 'ws');
        this.socket = new WebSocket(`${wsUrl}/admin/ws?token=${adminToken}`);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.showNotification('Connected to real-time updates', 'success');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.reconnect();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.showNotification('Lost connection to server. Please refresh the page.', 'error');
            return;
        }

        this.reconnectAttempts++;
        setTimeout(() => this.connect(), this.reconnectDelay);
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'NEW_ORDER':
                this.handleNewOrder(data.order);
                break;
            case 'ORDER_STATUS_CHANGE':
                this.handleOrderStatusChange(data.order);
                break;
            case 'NEW_CUSTOMER':
                this.handleNewCustomer(data.customer);
                break;
            case 'CUSTOMER_ACTIVITY':
                this.handleCustomerActivity(data.activity);
                break;
        }
    }

    handleNewOrder(order) {
        // Play notification sound
        const audio = new Audio('/admin/assets/notification.mp3');
        audio.play();

        // Show notification
        this.showNotification(
            `New Order #${order.id}`,
            'info',
            `${order.customerName} placed an order for $${order.total.toFixed(2)}`
        );

        // Update dashboard if it exists
        const dashboard = window.adminDashboard;
        if (dashboard) {
            dashboard.loadRecentOrders();
            dashboard.updateOrderCount(1);
        }
    }

    handleOrderStatusChange(order) {
        this.showNotification(
            `Order Status Updated`,
            'info',
            `Order #${order.id} status changed to ${order.status}`
        );

        // Update dashboard if the order is visible
        const orderRow = document.querySelector(`tr[data-order-id="${order.id}"]`);
        if (orderRow) {
            const statusCell = orderRow.querySelector('.status-badge');
            if (statusCell) {
                statusCell.className = `status-badge status-${order.status.toLowerCase()}`;
                statusCell.textContent = order.status;
            }
        }
    }

    handleNewCustomer(customer) {
        this.showNotification(
            'New Customer Registration',
            'success',
            `${customer.name} just registered`
        );

        // Update customer stats if on dashboard
        const dashboard = window.adminDashboard;
        if (dashboard) {
            dashboard.loadCustomerActivity();
        }
    }

    handleCustomerActivity(activity) {
        // Update real-time customer activity indicators
        const activeUsersElement = document.getElementById('activeUsers');
        if (activeUsersElement) {
            activeUsersElement.textContent = activity.currentActive;
        }
    }

    showNotification(title, type = 'info', message = '') {
        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;
        toast.innerHTML = `
            <div class="notification-header">
                <i class="fas ${this.getIconForType(type)}"></i>
                <span class="notification-title">${title}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            ${message ? `<div class="notification-body">${message}</div>` : ''}
        `;

        const container = document.querySelector('.notification-container') || this.createNotificationContainer();
        container.appendChild(toast);

        setTimeout(() => toast.remove(), 5000);
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    getIconForType(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
}

export default WebSocketManager; 