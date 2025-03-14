// Push Notifications Handler
class NotificationHandler {
    constructor() {
        this.permission = false;
        this.init();
    }

    async init() {
        try {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                this.permission = permission === 'granted';
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    }

    async sendNotification(title, options = {}) {
        if (!this.permission) return;

        const defaultOptions = {
            icon: '/assets/images/logo.png',
            badge: '/assets/images/badge.png',
            vibrate: [200, 100, 200],
            tag: 'delivery-update',
            renotify: true,
            requireInteraction: true
        };

        try {
            const notification = new Notification(title, { ...defaultOptions, ...options });
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    // Delivery status notifications
    async notifyOrderStatus(status, details) {
        const statusMessages = {
            confirmed: {
                title: 'Order Confirmed!',
                body: 'Your order has been confirmed and is being prepared.'
            },
            preparing: {
                title: 'Order Being Prepared',
                body: 'Our chefs are preparing your delicious meal.'
            },
            ready: {
                title: 'Order Ready for Delivery',
                body: 'Your order is ready and will be picked up by the rider soon.'
            },
            pickup: {
                title: 'Rider Picked Up Order',
                body: 'Your order is on its way!'
            },
            nearby: {
                title: 'Rider Nearby',
                body: 'Your rider is almost at your location!'
            },
            delivered: {
                title: 'Order Delivered',
                body: 'Enjoy your meal! Don\'t forget to rate your experience.'
            }
        };

        const message = statusMessages[status];
        if (message) {
            await this.sendNotification(message.title, {
                body: message.body,
                data: { status, details }
            });
        }
    }

    // Location-based notifications
    async notifyRiderDistance(distance) {
        if (distance <= 1) { // 1 km
            await this.notifyOrderStatus('nearby');
        }
    }

    // ETA update notifications
    async notifyETAChange(newETA) {
        await this.sendNotification('Delivery Time Updated', {
            body: `New estimated delivery time: ${newETA}`
        });
    }
} 