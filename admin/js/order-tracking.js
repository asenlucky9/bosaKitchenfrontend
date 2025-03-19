import config from '../../js/config.js';

class OrderTracker {
    constructor() {
        this.ordersContainer = document.getElementById('ordersContainer');
        this.orderDetailsModal = document.getElementById('orderDetailsModal');
        this.orderFilters = document.getElementById('orderFilters');
        this.searchInput = document.getElementById('orderSearch');
        this.setupEventListeners();
        this.loadOrders();
        this.initializeWebSocket();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', debounce(() => this.loadOrders(), 300));
        this.orderFilters.addEventListener('change', () => this.loadOrders());
        
        // Bulk actions
        document.getElementById('bulkUpdateStatus').addEventListener('click', () => this.handleBulkStatusUpdate());
        document.getElementById('exportOrders').addEventListener('click', () => this.exportOrders());
    }

    initializeWebSocket() {
        const wsUrl = config.API_URL.replace('http', 'ws');
        this.socket = new WebSocket(`${wsUrl}/admin/ws?token=${localStorage.getItem('adminToken')}`);
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ORDER_UPDATE') {
                this.handleOrderUpdate(data.order);
            }
        };
    }

    async loadOrders() {
        try {
            const searchTerm = this.searchInput.value;
            const filters = this.getSelectedFilters();
            
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.ALL}?search=${searchTerm}&${new URLSearchParams(filters)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load orders');
            
            const orders = await response.json();
            this.displayOrders(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
            showToast('Failed to load orders', 'error');
        }
    }

    getSelectedFilters() {
        const filters = {};
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        if (statusFilter) filters.status = statusFilter;
        if (dateFilter) filters.date = dateFilter;
        if (sortBy) filters.sort = sortBy;

        return filters;
    }

    displayOrders(orders) {
        this.ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card ${order.status.toLowerCase()}" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-id">
                        <h3>Order #${order.id}</h3>
                        <span class="status-badge status-${order.status.toLowerCase()}">
                            ${order.status}
                        </span>
                    </div>
                    <div class="order-time">
                        ${this.formatDate(order.createdAt)}
                    </div>
                </div>
                <div class="order-customer">
                    <img src="${this.getCustomerAvatar(order.customer)}" alt="Customer Avatar">
                    <div class="customer-info">
                        <strong>${this.escapeHtml(order.customer.name)}</strong>
                        <small>${this.escapeHtml(order.customer.email)}</small>
                    </div>
                </div>
                <div class="order-summary">
                    <div class="order-items">
                        ${this.renderOrderItems(order.items)}
                    </div>
                    <div class="order-total">
                        <strong>Total:</strong>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="order-timeline">
                    ${this.renderOrderTimeline(order.timeline)}
                </div>
                <div class="order-actions">
                    <button onclick="viewOrderDetails('${order.id}')" class="btn-icon">
                        <i class="fas fa-eye"></i> Details
                    </button>
                    <button onclick="updateOrderStatus('${order.id}')" class="btn-icon">
                        <i class="fas fa-edit"></i> Update Status
                    </button>
                    <button onclick="printOrderReceipt('${order.id}')" class="btn-icon">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderOrderItems(items) {
        return `
            <div class="items-list">
                ${items.map(item => `
                    <div class="order-item">
                        <span class="item-quantity">${item.quantity}x</span>
                        <span class="item-name">${this.escapeHtml(item.name)}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderOrderTimeline(timeline) {
        return `
            <div class="timeline">
                ${timeline.map((event, index) => `
                    <div class="timeline-item ${index === timeline.length - 1 ? 'current' : ''}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>${event.status}</h4>
                            <p>${this.formatDate(event.timestamp)}</p>
                            ${event.note ? `<small>${this.escapeHtml(event.note)}</small>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async updateOrderStatus(orderId, newStatus, note = '') {
        try {
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.UPDATE_STATUS(orderId)}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        note: note
                    })
                }
            );

            if (!response.ok) throw new Error('Failed to update order status');
            
            const updatedOrder = await response.json();
            this.handleOrderUpdate(updatedOrder);
            showToast('Order status updated successfully', 'success');
        } catch (error) {
            console.error('Error updating order status:', error);
            showToast('Failed to update order status', 'error');
        }
    }

    handleOrderUpdate(order) {
        const orderElement = document.querySelector(`[data-order-id="${order.id}"]`);
        if (orderElement) {
            // Update the order card with new information
            const newOrderCard = this.createOrderCard(order);
            orderElement.outerHTML = newOrderCard;
            
            // Highlight the updated order
            const updatedElement = document.querySelector(`[data-order-id="${order.id}"]`);
            updatedElement.classList.add('highlight');
            setTimeout(() => updatedElement.classList.remove('highlight'), 2000);
        } else {
            // If order not in view, show notification
            showToast(`Order #${order.id} updated to ${order.status}`, 'info');
        }
    }

    async handleBulkStatusUpdate() {
        const selectedOrders = Array.from(document.querySelectorAll('.order-checkbox:checked'))
            .map(checkbox => checkbox.value);
        
        if (selectedOrders.length === 0) {
            showToast('Please select orders to update', 'warning');
            return;
        }

        const newStatus = document.getElementById('bulkStatus').value;
        if (!newStatus) {
            showToast('Please select a status', 'warning');
            return;
        }

        try {
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.BULK_UPDATE}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        orderIds: selectedOrders,
                        status: newStatus
                    })
                }
            );

            if (!response.ok) throw new Error('Failed to update orders');
            
            await this.loadOrders();
            showToast('Orders updated successfully', 'success');
        } catch (error) {
            console.error('Error updating orders:', error);
            showToast('Failed to update orders', 'error');
        }
    }

    async exportOrders() {
        try {
            const filters = this.getSelectedFilters();
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.ORDERS.EXPORT}?${new URLSearchParams(filters)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to export orders');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            
            showToast('Orders exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting orders:', error);
            showToast('Failed to export orders', 'error');
        }
    }

    getCustomerAvatar(customer) {
        return customer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random`;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
    window.orderTracker = new OrderTracker();
}); 