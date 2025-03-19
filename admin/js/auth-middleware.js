import config from '../../js/config.js';

class AuthMiddleware {
    constructor() {
        this.init();
    }

    async init() {
        // Skip auth check for login page
        if (window.location.pathname.includes('login.html')) {
            return;
        }

        const isAuthenticated = await this.checkAuthentication();
        if (!isAuthenticated) {
            this.redirectToLogin();
        }

        // Setup refresh token interval
        this.setupTokenRefresh();
        
        // Setup logout button
        this.setupLogout();
    }

    async checkAuthentication() {
        const token = localStorage.getItem('adminToken');
        if (!token) return false;

        try {
            const response = await fetch(`${config.API_URL}/admin/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }

    redirectToLogin() {
        // Store the current URL to redirect back after login
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes('login.html')) {
            sessionStorage.setItem('adminRedirectUrl', currentPath);
        }
        window.location.href = 'login.html';
    }

    setupTokenRefresh() {
        // Refresh token every 14 minutes (assuming 15-minute token expiry)
        setInterval(async () => {
            const token = localStorage.getItem('adminToken');
            const refreshToken = localStorage.getItem('adminRefreshToken');
            
            if (!token || !refreshToken) return;

            try {
                const response = await fetch(`${config.API_URL}/admin/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refreshToken })
                });

                if (!response.ok) throw new Error('Token refresh failed');

                const data = await response.json();
                localStorage.setItem('adminToken', data.token);
                
                if (data.refreshToken) {
                    localStorage.setItem('adminRefreshToken', data.refreshToken);
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                this.handleAuthError();
            }
        }, 14 * 60 * 1000); // 14 minutes
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogout() {
        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                // Invalidate token on server
                await fetch(`${config.API_URL}/admin/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear tokens and redirect
            this.clearAuthData();
            this.redirectToLogin();
        }
    }

    handleAuthError() {
        this.clearAuthData();
        this.redirectToLogin();
    }

    clearAuthData() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
    }
}

// Initialize auth middleware
document.addEventListener('DOMContentLoaded', () => {
    window.authMiddleware = new AuthMiddleware();
}); 