import config from '../../js/config.js';

class AdminLogin {
    constructor() {
        this.form = document.getElementById('adminLoginForm');
        this.username = document.getElementById('username');
        this.password = document.getElementById('password');
        this.errorMessage = document.querySelector('.error-message');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.loginBtn = document.querySelector('.login-btn span');

        this.setupEventListeners();
        this.checkAdminAuth();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    async checkAdminAuth() {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            this.showLoading(true);
            try {
                const response = await fetch(`${config.API_URL}${config.ENDPOINTS.ADMIN.VERIFY}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.isAdmin) {
                        window.location.href = 'dashboard.html';
                        return;
                    }
                }
                // If we get here, token is invalid
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            } catch (error) {
                console.error('Token verification failed:', error);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            } finally {
                this.showLoading(false);
            }
        }
    }

    showLoading(show = true) {
        this.loadingSpinner.style.display = show ? 'block' : 'none';
        this.loginBtn.style.display = show ? 'none' : 'block';
        this.form.querySelector('button').disabled = show;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        setTimeout(() => {
            this.errorMessage.style.display = 'none';
        }, 5000);
    }

    async handleLogin(e) {
        e.preventDefault();
        this.showLoading(true);

        try {
            const username = this.username.value.trim();
            const password = this.password.value;

            if (!username || !password) {
                throw new Error('Please fill in all fields');
            }

            const response = await fetch(`${config.API_URL}${config.ENDPOINTS.ADMIN.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }

            if (!data.isAdmin) {
                throw new Error('This account does not have admin privileges');
            }

            // Store admin data
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify({
                id: data.id,
                username: data.username,
                name: data.name,
                role: data.role,
                permissions: data.permissions
            }));

            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            this.showError(error.message || 'An error occurred during login');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminLogin();
}); 