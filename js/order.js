import apiService from './services/api.service';
import { 
    OrderStatus, 
    OrderDTO, 
    ApiResponse,
    OrderItemDTO 
} from './types';

interface OrderFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    items: OrderItemDTO[];
    specialInstructions?: string;
}

class OrderManager {
    private orders: OrderDTO[] = [];

    constructor() {
        this.loadOrders();
    }

    private loadOrders(): void {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        }
    }

    generateOrderNumber(): string {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `BK${year}${month}${day}-${random}`;
    }

    async placeOrder(orderData: OrderFormData): Promise<ApiResponse<OrderDTO>> {
        try {
            // Transform order data to match backend DTO
            const orderDTO: OrderDTO = {
                userId: 0, // Will be set by backend from token
                orderDate: new Date().toISOString(),
                items: orderData.items.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    subtotal: item.price * item.quantity,
                    specialRequests: item.specialInstructions
                })),
                totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: OrderStatus.PENDING,
                paymentStatus: 'PENDING',
                paymentMethod: 'CREDIT_CARD',
                deliveryMethod: 'DELIVERY',
                deliveryAddress: orderData.address,
                specialInstructions: orderData.specialInstructions,
                customerName: `${orderData.firstName} ${orderData.lastName}`,
                customerEmail: orderData.email,
                customerPhone: orderData.phone
            };

            const result = await apiService.createOrder(orderDTO);

            if (result.data) {
                // Save order locally
                const order = {
                    ...result.data,
                    status: OrderStatus.PENDING,
                };

                this.orders.push(order);
                localStorage.setItem('orders', JSON.stringify(this.orders));

                // Save last order for confirmation page
                localStorage.setItem('lastOrder', JSON.stringify({
                    orderNumber: order.orderId.toString(),
                    customerName: order.customerName,
                    total: order.totalAmount,
                    status: OrderStatus.PENDING
                }));

                return {
                    data: order,
                    success: true
                };
            }

            throw new Error(result.error?.message || 'Failed to create order');
        } catch (error) {
            console.error('Error placing order:', error);
            return {
                error: {
                    message: 'Failed to place order. Please try again.',
                    type: 'OrderError'
                }
            };
        }
    }

    async getOrder(orderNumber: string): Promise<OrderDTO | null> {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token');

            const response = await apiService.getOrder(parseInt(orderNumber));
            return response.data || null;
        } catch (error) {
            console.error('Error getting order:', error);
            // Fallback to local storage
            return this.orders.find(order => order.orderId.toString() === orderNumber) || null;
        }
    }

    async updateOrderStatus(orderNumber: string, status: OrderStatus): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token');

            const response = await apiService.updateOrderStatus(parseInt(orderNumber), status);
            
            if (response.data) {
                const order = this.orders.find(o => o.orderId.toString() === orderNumber);
                if (order) {
                    order.status = status;
                    localStorage.setItem('orders', JSON.stringify(this.orders));
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating order status:', error);
            return false;
        }
    }

    async trackOrder(orderNumber: string): Promise<ApiResponse<{
        status: OrderStatus;
        estimatedTime: string;
        lastUpdate: string;
    }>> {
        try {
            const response = await apiService.trackOrder(orderNumber);
            
            if (response.data) {
                return {
                    data: {
                        status: response.data.status,
                        estimatedTime: response.data.estimatedTime || '30-45 minutes',
                        lastUpdate: response.data.lastUpdate
                    }
                };
            }
            
            // Fallback to local storage if backend fails
            const order = await this.getOrder(orderNumber);
            if (order) {
                return {
                    data: {
                        status: order.status,
                        estimatedTime: '30-45 minutes',
                        lastUpdate: order.orderDate
                    }
                };
            }
            
            throw new Error('Order not found');
        } catch (error) {
            console.error('Error tracking order:', error);
            return {
                error: {
                    message: 'Order not found',
                    type: 'OrderError'
                }
            };
        }
    }
}

// Initialize order form
function initOrderForm(): void {
    const orderForm = document.getElementById('order-form') as HTMLFormElement;
    if (!orderForm) return;

    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = orderForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalButtonText = submitButton.textContent || '';
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            const formData = new FormData(orderForm);
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
            
            const orderData: OrderFormData = {
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                address: formData.get('address') as string,
                items: cartItems,
                specialInstructions: formData.get('specialInstructions') as string
            };

            const orderManager = new OrderManager();
            const result = await orderManager.placeOrder(orderData);

            if (result.data) {
                // Clear cart
                localStorage.removeItem('cart');
                
                // Redirect to confirmation page
                const confirmationUrl = `confirmation.html?order=${result.data.orderId}`;
                window.location.href = confirmationUrl;
            } else {
                alert(result.error?.message || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            alert('An error occurred while placing your order. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrderForm);
} else {
    initOrderForm();
}

export default OrderManager; 