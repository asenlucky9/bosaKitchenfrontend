import { config } from '../config.js';

class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:8080/api';
        this.timeout = 15000;
    }

    // Generic request method with timeout and error handling
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        if (this.debug) {
            console.log(`API Request to: ${endpoint}`, {
                url: `${this.baseUrl}${endpoint}`,
                options: options
            });
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader(),
                    ...options.headers
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                if (this.debug) {
                    console.error('API Error Response:', {
                        status: response.status,
                        statusText: response.statusText,
                        data: data
                    });
                }
                throw new Error(data.message || 'API request failed');
            }

            if (this.debug) {
                console.log('API Success Response:', data);
            }

            return data;
        } catch (error) {
            if (this.debug) {
                console.error('API Request Failed:', {
                    endpoint: endpoint,
                    error: error
                });
            }

            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    getAuthHeader() {
        const token = localStorage.getItem(config.auth.tokenKey);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Authentication methods
    async login(credentials) {
        if (this.debug) {
            console.log('Login attempt for:', credentials.email);
        }
        
        try {
            const response = await this.request(this.endpoints.auth.login, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (this.debug) {
                console.log('Login successful:', response);
            }

            return response;
        } catch (error) {
            if (this.debug) {
                console.error('Login failed:', error);
            }
            throw error;
        }
    }

    async socialLogin(provider, token) {
        return this.request(this.endpoints.auth[provider], {
            method: 'POST',
            body: JSON.stringify({ token })
        });
    }

    async register(userData) {
        return this.request(this.endpoints.auth.register, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async forgotPassword(email) {
        return this.request(this.endpoints.auth.forgotPassword, {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async resetPassword(token, newPassword) {
        return this.request(this.endpoints.auth.resetPassword, {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
    }

    async verify2FA(code) {
        return this.request(this.endpoints.auth.verify2FA, {
            method: 'POST',
            body: JSON.stringify({ code })
        });
    }

    async refreshToken(refreshToken) {
        return this.request(this.endpoints.auth.refreshToken, {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        });
    }

    // User methods
    async getUserProfile() {
        return this.request(this.endpoints.user.profile);
    }

    async updateUserProfile(profileData) {
        return this.request(this.endpoints.user.updateProfile, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(passwords) {
        return this.request(this.endpoints.user.changePassword, {
            method: 'POST',
            body: JSON.stringify(passwords)
        });
    }

    // Order methods
    async createOrder(orderData) {
        try {
            // For now, just simulate a successful API call
            return {
                success: true,
                order: orderData
            };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getOrders() {
        return this.request(this.endpoints.orders.list);
    }

    async getOrderDetails(orderId) {
        return this.request(`${this.endpoints.orders.details}/${orderId}`);
    }

    async trackOrder(orderNumber) {
        // Simulate order tracking
        return {
            status: 'pending',
            estimatedTime: '30-45 minutes',
            lastUpdate: new Date().toISOString()
        };
    }

    async sendEmail(emailData) {
        // Simulate email sending
        console.log('Sending email:', emailData);
        return { success: true };
    }

    async sendSMS(smsData) {
        // Simulate SMS sending
        console.log('Sending SMS:', smsData);
        return { success: true };
    }

    // Error handling
    handleApiError(error) {
        switch (error.code) {
            case 'AUTH_REQUIRED':
                this.handleAuthError();
                break;
            case 'TOKEN_EXPIRED':
                this.handleTokenExpiry();
                break;
            case 'MAINTENANCE':
                // Handle maintenance mode
                break;
            default:
                // Handle other errors
                break;
        }
        return error;
    }

    handleAuthError() {
        localStorage.removeItem(config.auth.tokenKey);
        localStorage.removeItem(config.auth.refreshTokenKey);
        window.location.href = '/login.html';
    }

    async handleTokenExpiry() {
        const refreshToken = localStorage.getItem(config.auth.refreshTokenKey);
        if (refreshToken) {
            try {
                const response = await this.refreshToken(refreshToken);
                localStorage.setItem(config.auth.tokenKey, response.token);
                return true;
            } catch (error) {
                this.handleAuthError();
                return false;
            }
        } else {
            this.handleAuthError();
            return false;
        }
    }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService; 