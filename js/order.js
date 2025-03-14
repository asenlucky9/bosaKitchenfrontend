class OrderManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
    }

    generateOrderNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `BO${timestamp.slice(-6)}${random}`;
    }

    async placeOrder(orderData) {
        try {
            const orderNumber = this.generateOrderNumber();
            const order = {
                orderNumber,
                ...orderData,
                status: 'confirmed',
                timestamp: new Date().toISOString(),
                items: orderData.items.map(item => ({
                    ...item,
                    total: item.price * item.quantity
                })),
                total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

            // Save order
            this.orders.push(order);
            localStorage.setItem('orders', JSON.stringify(this.orders));

            // Create notification
            const notificationHandler = new NotificationHandler();
            await notificationHandler.notifyOrderStatus('confirmed');

            return {
                success: true,
                orderNumber,
                message: 'Order placed successfully!',
                trackingUrl: `/track-order.html?order=${orderNumber}`
            };

        } catch (error) {
            console.error('Error placing order:', error);
            return {
                success: false,
                message: 'Failed to place order. Please try again.'
            };
        }
    }

    getOrder(orderNumber, lastName) {
        return this.orders.find(order => 
            order.orderNumber === orderNumber && 
            order.lastName.toLowerCase() === lastName.toLowerCase()
        );
    }

    updateOrderStatus(orderNumber, status) {
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        if (order) {
            order.status = status;
            localStorage.setItem('orders', JSON.stringify(this.orders));
            return true;
        }
        return false;
    }

    assignRider(orderNumber, riderInfo) {
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        if (order) {
            order.rider = riderInfo;
            localStorage.setItem('orders', JSON.stringify(this.orders));
            return true;
        }
        return false;
    }
}

// Handle order form submission
document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(orderForm);
            const orderData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                items: JSON.parse(localStorage.getItem('cart') || '[]'),
                specialInstructions: formData.get('specialInstructions')
            };

            const orderManager = new OrderManager();
            const result = await orderManager.placeOrder(orderData);

            if (result.success) {
                // Show success message
                const successMessage = `
                    <div class="order-success">
                        <h2>Order Placed Successfully!</h2>
                        <p>Your order number is: <strong>${result.orderNumber}</strong></p>
                        <p>You can track your order using this number and your last name.</p>
                        <a href="${result.trackingUrl}" class="btn-track">Track Order</a>
                    </div>
                `;
                orderForm.innerHTML = successMessage;

                // Clear cart
                localStorage.removeItem('cart');
            } else {
                // Show error message
                alert(result.message);
            }
        });
    }
}); 