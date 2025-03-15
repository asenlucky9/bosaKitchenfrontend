// API Configuration
const API_URL = 'http://localhost:8080/api'; // Spring Boot default port is 8080

// Mock data for testing
const mockData = {
    categories: [
        { id: 1, name: 'Main Course' },
        { id: 2, name: 'Soft Drinks' },
        { id: 3, name: 'African Drinks' },
        { id: 4, name: 'Other Beverages' },
        { id: 5, name: 'Appetizers' },
        { id: 6, name: 'Desserts' }
    ],
    menuItems: [
        // Main Courses
        {
            item_id: 1,
            name: 'Jollof Rice & Chicken',
            category_name: 'Main Course',
            description: 'Our signature dish - perfectly spiced rice cooked in rich tomato sauce, served with tender grilled chicken.',
            price: 15.00,
            image_url: 'menu/menu13.jpg'
        },
        {
            item_id: 2,
            name: 'Fried Rice and Turkey',
            category_name: 'Main Course',
            description: 'Savory fried rice with perfectly seasoned turkey, mixed vegetables, and our special spice blend.',
            price: 15.00,
            image_url: 'menu/menu16.jpg'
        },
        {
            item_id: 3,
            name: 'Boiled Rice and Turkey Stew',
            category_name: 'Main Course',
            description: 'Tender turkey in a rich, flavorful stew served with perfectly cooked rice.',
            price: 12.00,
            image_url: 'menu/menu5.jpg'
        },
        {
            item_id: 4,
            name: 'Plantain and Beans',
            category_name: 'Main Course',
            description: 'Sweet fried plantains served with seasoned beans, a classic African combination.',
            price: 10.00,
            image_url: 'menu/menu8.jpg'
        },
        {
            item_id: 5,
            name: 'Sea Food Okro',
            category_name: 'Main Course',
            description: 'Fresh seafood medley in a traditional okro soup, perfectly seasoned with African spices.',
            price: 20.00,
            image_url: 'menu/menu7.jpg'
        },
        // Appetizers
        {
            item_id: 6,
            name: 'Meat Pies (5 pieces)',
            category_name: 'Appetizers',
            description: 'Flaky pastry filled with seasoned minced meat, onions, and African spices. Served hot and fresh.',
            price: 20.00,
            image_url: 'menu/Meat Pies.jpg'
        },
        // Soft Drinks
        {
            item_id: 7,
            name: 'Coca-Cola',
            category_name: 'Soft Drinks',
            description: 'Classic Coca-Cola',
            price: 2.50,
            image_url: 'menu/beverages/coca-cola.jpg'
        },
        {
            item_id: 8,
            name: 'Sprite',
            category_name: 'Soft Drinks',
            description: 'Refreshing Sprite',
            price: 2.50,
            image_url: 'menu/beverages/sprite.jpg'
        },
        {
            item_id: 9,
            name: 'Fanta',
            category_name: 'Soft Drinks',
            description: 'Orange Fanta',
            price: 2.50,
            image_url: 'menu/beverages/fanta.jpg'
        },
        // African Drinks
        {
            item_id: 10,
            name: 'Bissap',
            category_name: 'African Drinks',
            description: 'Traditional hibiscus drink with ginger and mint',
            price: 3.50,
            image_url: 'menu/beverages/bissap.jpg'
        },
        {
            item_id: 11,
            name: 'Ginger Beer',
            category_name: 'African Drinks',
            description: 'Spicy ginger beer made with fresh ginger',
            price: 3.50,
            image_url: 'menu/beverages/ginger-beer.jpg'
        },
        // Other Beverages
        {
            item_id: 12,
            name: 'Water',
            category_name: 'Other Beverages',
            description: 'Pure water',
            price: 1.50,
            image_url: 'menu/beverages/water.jpg'
        },
        {
            item_id: 13,
            name: 'Sparkling Water',
            category_name: 'Other Beverages',
            description: 'Carbonated water',
            price: 2.00,
            image_url: 'menu/beverages/sparkling-water.jpg'
        },
        // Main Courses (continued)
        {
            item_id: 14,
            name: 'Pounded Yam & Egusi',
            category_name: 'Main Course',
            description: 'Smooth, pounded yam served with rich egusi soup made with ground melon seeds and choice meat.',
            price: 20.00,
            image_url: 'menu/padyam&egusi.jpg'
        },
        {
            item_id: 15,
            name: 'Grilled Fish',
            category_name: 'Main Course',
            description: 'Fresh fish seasoned and grilled to perfection with our signature spice blend.',
            price: 20.00,
            image_url: 'menu/fish.png'
        }
    ],
    specialOffers: [
        {
            id: 1,
            title: 'Weekend Special',
            description: 'Get 20% off on all main courses every weekend',
            discount_percentage: 20,
            valid_until: '2024-12-31'
        },
        {
            id: 2,
            title: 'Free Delivery',
            description: 'On orders above $50',
            discount_percentage: 0,
            valid_until: '2024-12-31'
        },
        {
            id: 3,
            title: 'Happy Hour',
            description: '15% off on all beverages from 2 PM to 5 PM',
            discount_percentage: 15,
            valid_until: '2024-12-31'
        },
        {
            id: 4,
            title: 'Family Bundle',
            description: 'Order 4 main courses and get 1 free',
            discount_percentage: 25,
            valid_until: '2024-12-31'
        }
    ]
};

// Error Handler
const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// API Service for Bosa Kitchen
const api = {
    // Fetch all categories
    async getCategories() {
        try {
            console.log('Fetching categories...');
            const response = await fetch(`${API_URL}/categories`);
            if (!response.ok) {
                console.log('Using mock data for categories');
                return mockData.categories;
            }
            const data = await response.json();
            console.log('Categories fetched successfully:', data);
            return data;
        } catch (error) {
            console.log('Using mock data for categories due to error:', error);
            return mockData.categories;
        }
    },

    // Fetch all menu items
    async getAllMenuItems() {
        try {
            console.log('Fetching all menu items...');
            const response = await fetch(`${API_URL}/menu-items`);
            if (!response.ok) {
                console.log('Using mock data for menu items');
                return mockData.menuItems;
            }
            const data = await response.json();
            console.log('Menu items fetched successfully:', data);
            return data;
        } catch (error) {
            console.log('Using mock data for menu items due to error:', error);
            return mockData.menuItems;
        }
    },

    // Fetch menu items by category
    async getMenuItemsByCategory(categoryId) {
        try {
            console.log(`Fetching menu items for category ${categoryId}...`);
            const response = await fetch(`${API_URL}/menu-items/category/${categoryId}`);
            if (!response.ok) {
                console.log('Using mock data for menu items by category');
                return mockData.menuItems.filter(item => item.category_name === categoryId);
            }
            const data = await response.json();
            console.log('Category menu items fetched successfully:', data);
            return data;
        } catch (error) {
            console.log('Using mock data for menu items by category due to error:', error);
            return mockData.menuItems.filter(item => item.category_name === categoryId);
        }
    },

    // Fetch special offers
    async getSpecialOffers() {
        try {
            console.log('Fetching special offers...');
            const response = await fetch(`${API_URL}/special-offers`);
            if (!response.ok) {
                console.log('Using mock data for special offers');
                return mockData.specialOffers;
            }
            const data = await response.json();
            console.log('Special offers fetched successfully:', data);
            return data;
        } catch (error) {
            console.log('Using mock data for special offers due to error:', error);
            return mockData.specialOffers;
        }
    },

    // Create a new order
    async createOrder(orderData) {
        try {
            console.log('Creating new order:', orderData);
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json();
            console.log('Order created successfully:', data);
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
};

// User Authentication API
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) throw new Error('Login failed');
        return await response.json();
    } catch (error) {
        handleError(error);
    }
};

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Registration failed');
        return await response.json();
    } catch (error) {
        handleError(error);
    }
};

// Test API connection when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Testing API connection...');
        // Test categories endpoint
        const categories = await api.getCategories();
        console.log('Categories loaded:', categories);

        // Test menu items endpoint
        const menuItems = await api.getAllMenuItems();
        console.log('Menu items loaded:', menuItems);

        // Test special offers endpoint
        const specialOffers = await api.getSpecialOffers();
        console.log('Special offers loaded:', specialOffers);
    } catch (error) {
        console.error('Error testing API connection:', error);
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Unable to connect to the server. Using mock data for testing.';
        document.body.insertBefore(errorMessage, document.body.firstChild);
    }
}); 