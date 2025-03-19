import axios from 'axios';
import config from './config.js';
import ErrorHandler from './utils/error-handler.js';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: config.API_URL,
            timeout: config.API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                // Add auth token if available
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add CORS headers in development
                if (this.isDevelopment) {
                    config.headers['Access-Control-Allow-Origin'] = this.allowedOrigins;
                    config.headers['Access-Control-Allow-Credentials'] = 'true';
                    config.withCredentials = true;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response.data,
            (error) => {
                if (error.response) {
                    // Handle specific HTTP errors
                    switch (error.response.status) {
                        case 401:
                            // Unauthorized - clear token and redirect to login
                            localStorage.removeItem(config.AUTH_TOKEN_KEY);
                            localStorage.removeItem(config.REFRESH_TOKEN_KEY);
                            window.location.href = '/login';
                            break;
                        case 403:
                            // Forbidden - attempt to refresh token
                            return this.handleTokenRefresh(error);
                        case 404:
                            ErrorHandler.handle(new Error('Resource not found'), 'API Request');
                            break;
                        case 500:
                            ErrorHandler.handle(new Error('Server error'), 'API Request');
                            break;
                        default:
                            ErrorHandler.handle(new Error(error.response.data.message || 'An error occurred'), 'API Request');
                    }
                } else if (error.code === 'ECONNABORTED') {
                    // Timeout error
                    ErrorHandler.handle(new Error('Request timeout'), 'API Request');
                } else {
                    // Network error or other issues
                    ErrorHandler.handle(new Error('Network error'), 'API Request');
                }
                return Promise.reject(error);
            }
        );
    }

    get isDevelopment() {
        return config.isDevelopment;
    }

    get allowedOrigins() {
        return config.FRONTEND_URLS.development.join(', ');
    }

    getAuthToken() {
        return localStorage.getItem(config.AUTH_TOKEN_KEY);
    }

    async handleTokenRefresh(error) {
        try {
            const refreshToken = localStorage.getItem(config.REFRESH_TOKEN_KEY);
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // Attempt to refresh the token
            const response = await this.api.post(config.ENDPOINTS.REFRESH_TOKEN, {
                refreshToken
            });

            // Update tokens
            localStorage.setItem(config.AUTH_TOKEN_KEY, response.data.token);
            localStorage.setItem(config.REFRESH_TOKEN_KEY, response.data.refreshToken);

            // Retry the original request
            error.config.headers.Authorization = `Bearer ${response.data.token}`;
            return this.api(error.config);
        } catch (refreshError) {
            // If refresh fails, logout user
            localStorage.removeItem(config.AUTH_TOKEN_KEY);
            localStorage.removeItem(config.REFRESH_TOKEN_KEY);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    // Authentication Methods
    async login(credentials) {
        return this.api.post(config.ENDPOINTS.LOGIN, credentials);
    }

    async register(userData) {
        return this.api.post(config.ENDPOINTS.REGISTER, userData);
    }

    async logout() {
        return this.api.post(config.ENDPOINTS.LOGOUT);
    }

    // Menu Methods
    async getCategories() {
        return this.api.get(config.ENDPOINTS.CATEGORIES);
    }

    async getMenuItems() {
        return this.api.get(config.ENDPOINTS.MENU_ITEMS);
    }

    async getMenuItemsByCategory(categoryId) {
        return this.api.get(config.ENDPOINTS.MENU_ITEMS_BY_CATEGORY(categoryId));
    }

    // Order Methods
    async createOrder(orderData) {
        return this.api.post(config.ENDPOINTS.ORDERS, orderData);
    }

    async getOrder(orderId) {
        return this.api.get(config.ENDPOINTS.ORDER_BY_ID(orderId));
    }

    async getOrderTracking(orderId) {
        return this.api.get(config.ENDPOINTS.ORDER_TRACKING(orderId));
    }

    // User Methods
    async getUserProfile() {
        return this.api.get(config.ENDPOINTS.USER_PROFILE);
    }

    async getUserOrders() {
        return this.api.get(config.ENDPOINTS.USER_ORDERS);
    }

    // Chat Methods
    async getChatMessages(orderId) {
        return this.api.get(config.ENDPOINTS.CHAT_MESSAGES(orderId));
    }

    async sendChatMessage(orderId, message) {
        return this.api.post(config.ENDPOINTS.CHAT_SEND(orderId), { message });
    }

    // Special Offers
    async getSpecialOffers() {
        return this.api.get(config.ENDPOINTS.SPECIAL_OFFERS);
    }
}

// Create and export a single instance
const api = new ApiService();

// Log API configuration in development
if (config.isDevelopment) {
    console.log('API Configuration:', {
        baseURL: api.api.defaults.baseURL,
        timeout: api.api.defaults.timeout,
        allowedOrigins: config.FRONTEND_URLS.development
    });
}

export default api; 