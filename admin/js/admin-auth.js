import adminConfig from './admin-config.js';

class AdminAuth {
    constructor() {
        this.form = document.getElementById('adminLoginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.loginError = document.getElementById('loginError');
        this.loginButton = this.form.querySelector('.btn-login');
        this.loginButtonText = this.loginButton.querySelector('.btn-text');
        this.loginButtonLoader = this.loginButton.querySelector('.btn-loader');

        this.setupEventListeners();
        this.checkAdminAuth();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Password visibility toggle
        const togglePassword = document.querySelector('.toggle-password');
        togglePassword.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            togglePassword.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
        });

        // Clear error on input
        this.usernameInput.addEventListener('input', () => this.clearError());
        this.passwordInput.addEventListener('input', () => this.clearError());
    }

    checkAdminAuth() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            window.location.href = 'dashboard.html';
        }
    }

    showLoading(loading = true) {
        this.loginButton.disabled = loading;
        this.loginButtonText.style.display = loading ? 'none' : 'block';
        this.loginButtonLoader.style.display = loading ? 'block' : 'none';
    }

    showError(message) {
        this.loginError.textContent = message;
        this.loginError.style.display = 'block';
    }

    clearError() {
        this.loginError.textContent = '';
        this.loginError.style.display = 'none';
    }

    validateInputs() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (!username) {
            this.showError('Please enter your username');
            return false;
        }

        if (!password) {
            this.showError('Please enter your password');
            return false;
        }

        return true;
    }

    handleLogin() {
        if (!this.validateInputs()) return;

        this.showLoading(true);
        this.clearError();

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        // Check against default admin credentials
        if (username === adminConfig.defaultAdmin.username && 
            password === adminConfig.defaultAdmin.password) {
            
            // Create a simple token (in real app, this should be JWT from server)
            const token = btoa(username + ':' + new Date().getTime());
            localStorage.setItem('adminToken', token);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            this.showError('Invalid username or password');
            this.showLoading(false);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
}); 