import api from './api.js';
import config from './config.js';

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.errorMessage = document.querySelector('.error-message');
        this.successMessage = document.querySelector('.success-message');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.submitButton = document.querySelector('.submit-btn');

        this.setupEventListeners();
        this.setupPasswordToggle();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Password toggle
        const passwordToggleBtn = document.querySelector('.password-toggle-btn');
        if (passwordToggleBtn) {
            passwordToggleBtn.addEventListener('click', () => {
                const type = this.passwordInput.type === 'password' ? 'text' : 'password';
                this.passwordInput.type = type;
                passwordToggleBtn.querySelector('i').className = 
                    type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            });
        }
    }

    setupPasswordToggle() {
        const toggleBtn = document.querySelector('.password-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = this.passwordInput.type === 'password';
                this.passwordInput.type = isPassword ? 'text' : 'password';
                toggleBtn.querySelector('i').className = 
                    isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            });
        }
    }

    checkAuthStatus() {
        const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
        const user = localStorage.getItem(config.USER_KEY);
        
        if (token && user) {
            // User is already logged in, redirect to profile
            window.location.href = 'profile.html';
        }
    }

    showLoading(show = true) {
        if (this.submitButton) {
            this.submitButton.disabled = show;
            if (this.loadingSpinner) {
                this.loadingSpinner.style.display = show ? 'block' : 'none';
            }
        }
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
            this.successMessage.style.display = 'none';
        }
    }

    showSuccess(message) {
        if (this.successMessage) {
            this.successMessage.textContent = message;
            this.successMessage.style.display = 'block';
            this.errorMessage.style.display = 'none';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.showLoading(true);

        try {
            const email = this.emailInput.value;
            const password = this.passwordInput.value;

            // Validate inputs
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            // Call the login API endpoint using our API service
            const response = await api.login({ email, password });

            // Store auth data
            localStorage.setItem(config.AUTH_TOKEN_KEY, response.token);
            localStorage.setItem(config.USER_KEY, JSON.stringify(response.user));

            this.showSuccess('Login successful!');
            
            // Redirect to profile page
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);

        } catch (error) {
            this.showError(error.response?.data?.message || error.message || 'An error occurred during login');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
}); 