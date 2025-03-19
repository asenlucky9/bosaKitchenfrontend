import config from '../../js/config.js';

class MenuManager {
    constructor() {
        this.menuContainer = document.getElementById('menuContainer');
        this.categorySelect = document.getElementById('categoryFilter');
        this.searchInput = document.getElementById('menuSearch');
        this.setupEventListeners();
        this.loadMenu();
        this.loadCategories();
        
        // Make methods available globally
        window.editMenuItem = this.editMenuItem.bind(this);
        window.toggleItemAvailability = this.toggleItemAvailability.bind(this);
        window.deleteMenuItem = this.deleteMenuItem.bind(this);
        window.closeModal = this.closeModal.bind(this);
        window.saveNewItem = this.saveNewItem.bind(this);
    }

    setupEventListeners() {
        // Search and filter
        this.searchInput.addEventListener('input', this.debounce(() => this.loadMenu(), 300));
        this.categorySelect.addEventListener('change', () => this.loadMenu());

        // Add new item button
        document.getElementById('addMenuItem').addEventListener('click', () => this.showAddItemModal());
        
        // Add new category button
        document.getElementById('addCategory').addEventListener('click', () => this.showAddCategoryModal());
        
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    }

    async loadMenu() {
        try {
            const searchTerm = this.searchInput.value;
            const categoryId = this.categorySelect.value;
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.MENU.LIST}?search=${searchTerm}&category=${categoryId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load menu items');
            
            const items = await response.json();
            this.displayMenu(items);
        } catch (error) {
            console.error('Error loading menu:', error);
            this.showToast('Failed to load menu items', 'error');
        }
    }

    async loadCategories() {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.MENU.CATEGORIES}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load categories');
            
            const categories = await response.json();
            this.updateCategorySelect(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showToast('Failed to load categories', 'error');
        }
    }

    updateCategorySelect(categories) {
        this.categorySelect.innerHTML = `
            <option value="">All Categories</option>
            ${categories.map(category => `
                <option value="${category.id}">${this.escapeHtml(category.name)}</option>
            `).join('')}
        `;
    }

    displayMenu(items) {
        this.menuContainer.innerHTML = items.map(item => `
            <div class="menu-item-card" data-item-id="${item.id}">
                <div class="item-image">
                    <img src="${this.escapeHtml(item.imageUrl)}" alt="${this.escapeHtml(item.name)}">
                </div>
                <div class="item-details">
                    <h3>${this.escapeHtml(item.name)}</h3>
                    <p class="item-description">${this.escapeHtml(item.description)}</p>
                    <div class="item-meta">
                        <span class="price">$${item.price.toFixed(2)}</span>
                        <span class="category">${this.escapeHtml(item.category)}</span>
                    </div>
                    <div class="item-stats">
                        <span class="orders" title="Total Orders">
                            <i class="fas fa-shopping-bag"></i> ${item.orderCount || 0}
                        </span>
                        <span class="rating" title="Average Rating">
                            <i class="fas fa-star"></i> ${(item.rating || 0).toFixed(1)}
                        </span>
                    </div>
                </div>
                <div class="item-actions">
                    <button onclick="editMenuItem('${item.id}')" class="btn-icon">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="toggleItemAvailability('${item.id}')" 
                            class="btn-icon ${item.isAvailable ? 'active' : ''}">
                        <i class="fas fa-${item.isAvailable ? 'check' : 'times'}"></i>
                        ${item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <button onclick="deleteMenuItem('${item.id}')" class="btn-icon danger">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    showAddItemModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Menu Item</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addItemForm">
                        <div class="form-group">
                            <label for="itemName">Name</label>
                            <input type="text" id="itemName" required>
                        </div>
                        <div class="form-group">
                            <label for="itemDescription">Description</label>
                            <textarea id="itemDescription" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="itemPrice">Price ($)</label>
                            <input type="number" id="itemPrice" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="itemCategory">Category</label>
                            <select id="itemCategory" required>
                                ${this.categorySelect.innerHTML}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="itemImage">Image</label>
                            <input type="file" id="itemImage" accept="image/*" required>
                            <div class="image-preview"></div>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="itemAvailable" checked>
                                Available for Order
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveNewItem()">Add Item</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Image preview
        const imageInput = modal.querySelector('#itemImage');
        const preview = modal.querySelector('.image-preview');
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    async saveNewItem() {
        try {
            const form = document.getElementById('addItemForm');
            const formData = new FormData(form);
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.MENU.CREATE}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (!response.ok) throw new Error('Failed to add menu item');
            
            await this.loadMenu();
            this.showToast('Menu item added successfully', 'success');
            this.closeModal();
        } catch (error) {
            console.error('Error adding menu item:', error);
            this.showToast('Failed to add menu item', 'error');
        }
    }

    async editMenuItem(itemId) {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.MENU.LIST}/${itemId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load item details');
            
            const item = await response.json();
            this.showEditItemModal(item);
        } catch (error) {
            console.error('Error loading item details:', error);
            this.showToast('Failed to load item details', 'error');
        }
    }

    async toggleItemAvailability(itemId) {
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.MENU.UPDATE}/${itemId}/availability`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to update item availability');
            
            await this.loadMenu();
            this.showToast('Item availability updated', 'success');
        } catch (error) {
            console.error('Error updating item availability:', error);
            this.showToast('Failed to update item availability', 'error');
        }
    }

    async deleteMenuItem(itemId) {
        if (!confirm('Are you sure you want to delete this menu item?')) return;
        
        try {
            const token = localStorage.getItem(config.ADMIN_TOKEN_KEY);
            const response = await fetch(
                `${config.API_URL}${config.ENDPOINTS.ADMIN.MENU.DELETE}/${itemId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to delete menu item');
            
            await this.loadMenu();
            this.showToast('Menu item deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting menu item:', error);
            this.showToast('Failed to delete menu item', 'error');
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
    }

    handleLogout() {
        localStorage.removeItem(config.ADMIN_TOKEN_KEY);
        window.location.href = 'login.html';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        const container = document.querySelector('.toast-container');
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, config.UI.TOAST_DURATION);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the menu manager
const menuManager = new MenuManager(); 