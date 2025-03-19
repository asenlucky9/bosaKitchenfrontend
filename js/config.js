const config = {
    // Environment detection
    isDevelopment: window.location.hostname === 'localhost',

    // API Configuration
    API_URL: 'http://localhost:8081/api',
    API_VERSION: 'v1',
    API_TIMEOUT: 15000,
    API_DEBUG: true, // Enable debug logging
    API_RETRY_ATTEMPTS: 3, // Number of retry attempts for failed requests

    // Authentication Configuration
    AUTH_TOKEN_KEY: 'auth_token',
    ADMIN_TOKEN_KEY: 'admin_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    USER_KEY: 'user_data',
    TOKEN_EXPIRY: '24h',
    REFRESH_TOKEN_EXPIRY: '7d',

    // Frontend URLs
    FRONTEND_URL: 'http://localhost:3000',
    ADMIN_URL: 'http://localhost:3000/admin',
    FRONTEND_URLS: {
        development: ['http://localhost:3000', 'http://localhost:8000'],
        production: 'https://bosa.food'
    },

    // API Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            VERIFY: '/auth/verify',
            ADMIN_LOGIN: '/auth/admin/login'
        },
        ADMIN: {
            ANALYTICS: {
                OVERVIEW: '/admin/analytics/overview',
                ORDERS: '/admin/analytics/orders',
                CUSTOMERS: '/admin/analytics/customers',
                REVENUE: '/admin/analytics/revenue',
                POPULAR_ITEMS: '/admin/analytics/popular-items'
            },
            ORDERS: {
                LIST: '/admin/orders',
                UPDATE: '/admin/orders/update',
                DELETE: '/admin/orders/delete'
            },
            MENU: {
                LIST: '/admin/menu',
                CREATE: '/admin/menu/create',
                UPDATE: '/admin/menu/update',
                DELETE: '/admin/menu/delete',
                CATEGORIES: '/admin/menu/categories'
            },
            CUSTOMERS: {
                LIST: '/admin/customers',
                DETAILS: '/admin/customers/details',
                UPDATE: '/admin/customers/update',
                DELETE: '/admin/customers/delete'
            }
        },
        USER: {
            PROFILE: '/user/profile',
            ORDERS: '/user/orders',
            FAVORITES: '/user/favorites'
        },
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        LOGOUT: '/users/logout',
        REFRESH_TOKEN: '/users/refresh-token',
        CATEGORIES: '/categories',
        MENU_ITEMS: '/menu-items',
        MENU_ITEMS_BY_CATEGORY: (categoryId) => `/menu-items/category/${categoryId}`,
        ORDERS: '/orders',
        ORDER_BY_ID: (orderId) => `/orders/${orderId}`,
        ORDER_TRACKING: (orderId) => `/orders/${orderId}/track`,
        USER_PROFILE: '/users/profile',
        USER_ORDERS: '/users/orders',
        CHAT_MESSAGES: (orderId) => `/chat/${orderId}/messages`,
        CHAT_SEND: (orderId) => `/chat/${orderId}/send`,
        SPECIAL_OFFERS: '/special-offers'
    },

    // Feature Flags
    FEATURES: {
        ENABLE_ANALYTICS: true,
        ENABLE_NOTIFICATIONS: true,
        ENABLE_CUSTOMER_FEEDBACK: true
    },

    // Security Configuration
    SECURITY: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15, // minutes
        REQUIRE_TWO_FACTOR: false,
    },

    // UI Configuration
    UI: {
        ITEMS_PER_PAGE: 10,
        MAX_RECENT_ORDERS: 5,
        TOAST_DURATION: 3000,
        REFRESH_INTERVAL: 30000, // 30 seconds
        ANIMATION_DURATION: 300, // 0.3 seconds
        LOADING_TIMEOUT: 30000, // 30 seconds
    }
};

// Validate frontend URL in development
if (config.isDevelopment) {
    const currentUrl = window.location.origin;
    if (!config.FRONTEND_URLS.development.includes(currentUrl)) {
        console.warn(`Warning: Application is running on ${currentUrl}. Allowed development URLs are: ${config.FRONTEND_URLS.development.join(', ')}`);
    }
}

// Prevent modifications to the config object and its nested objects
Object.freeze(config);
Object.freeze(config.ENDPOINTS);
Object.freeze(config.FEATURES);
Object.freeze(config.FRONTEND_URLS);
Object.freeze(config.SECURITY);
Object.freeze(config.UI);

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
} 