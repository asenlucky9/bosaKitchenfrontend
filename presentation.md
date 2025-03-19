# Bosa Kitchen Website Development
## Technical Documentation & Implementation

## Project Overview
Bosa Kitchen is a modern restaurant website that allows customers to browse menus, place orders, track deliveries, and manage their accounts. The website features a responsive design, user authentication, real-time order tracking, and an interactive menu system.

**Website URL**: [https://bosa.food](https://bosa.food)

**Contact Information**:
- Phone: (438) 778-2127
- Email: info@bosakitchen.com
- Address: 855 Av. Galt, Verdun, QC H4G 3G3

**Business Hours**:
- Monday - Friday: 11:00 AM - 10:00 PM
- Saturday - Sunday: 12:00 PM - 11:00 PM

## Development Team

## Team Structure & Collaboration
```plaintext
┌─────────────────────────────────────┐
│        Bosa Kitchen Project         │
│           Development Team          │
├─────────────┬─────────┬────────────┤
│  Frontend   │ Backend │  Database  │
│  (Theresa)  │ (Lucky) │(Kiran &   │
│             │         │  Moses)    │
├─────────────┴─────────┴────────────┤
│          DevOps & Hosting          │
│              (Aria)                │
└─────────────────────────────────────┘
```

## Team Members & Roles

### Frontend Development
- **Theresa**
  - Responsive UI implementation
  - User interface design
  - Client-side functionality

### Backend Development
- **Lucky**
  - Spring Boot implementation
  - API development
  - Server architecture

### Database Management
- **Kiran & Moses**
  - PostgreSQL database design
  - Data security implementation
  - Database optimization

### Deployment & DevOps
- **Aria**
  - OVHcloud deployment
  - System maintenance
  - Infrastructure management

## Team Workflow
```plaintext
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Design    │     │Development  │     │  Testing &  │
│   Phase     │ ──> │   Phase    │ ──> │ Deployment  │
└─────────────┘     └─────────────┘     └─────────────┘
     Theresa           All Team            Aria
                       Members
```

---

# System Overview

## Application Flow
```plaintext
┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│   Frontend   │    │    Backend    │    │   Database   │
│  (Theresa)   │───>│    (Lucky)    │───>│(Kiran/Moses) │
└──────────────┘    └───────────────┘    └──────────────┘
      │                     │                    │
      │                     │                    │
      └─────────────────────┼────────────────────┘
                           │
                    ┌──────────────┐
                    │   DevOps     │
                    │    (Aria)    │
                    └──────────────┘
```

## Database Schema Overview
```plaintext
┌─────────────────┐
│     Users       │
├─────────────────┤      ┌─────────────────┐
│ - user_id       │      │     Orders      │
│ - first_name    │      ├─────────────────┤
│ - last_name     │◄─────│ - order_id      │
│ - email         │      │ - user_id       │
│ - phone         │      │ - status        │
└─────────────────┘      │ - total_amount  │
                         └─────────────────┘
                                 │
┌─────────────────┐            │
│   Menu Items    │            │
├─────────────────┤     ┌──────────────────┐
│ - item_id       │     │   Order Items    │
│ - name          │◄────├──────────────────┤
│ - price         │     │ - order_item_id  │
│ - category      │     │ - order_id       │
└─────────────────┘     │ - item_id        │
                        └──────────────────┘
```

## Deployment Pipeline
```plaintext
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│    Code     │   │    Build    │   │   Deploy    │
│  Repository │──>│   Process   │──>│    to       │
│   (GitHub)  │   │   (Maven)   │   │  OVHcloud   │
└─────────────┘   └─────────────┘   └─────────────┘
       ▲                 ▲                ▲
       │                 │                │
    Theresa           Lucky             Aria
    (Frontend)       (Backend)         (DevOps)
```

---

# Complete Technology Stack

## Frontend Layer
```plaintext
├── HTML5 & CSS3
│   ├── Semantic Elements
│   ├── Flexbox/Grid
│   └── Custom Variables
├── JavaScript (ES6+)
│   ├── DOM Manipulation
│   └── Local Storage
└── External APIs
    ├── Google Maps
    └── Font Awesome
```

## Backend Layer
```plaintext
├── Spring Boot Framework
│   ├── Java 17
│   ├── RESTful APIs
│   └── Spring Security
├── Database
│   ├── PostgreSQL
│   ├── pgAdmin4
│   └── JPA/Hibernate
└── Deployment
    ├── OVHcloud Hosting
    ├── SSL/TLS
    └── Load Balancing
```

---

# System Architecture

## Three-Tier Architecture
```plaintext
┌─────────────────┐
│   Client Layer  │
│  HTML/CSS/JS    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Spring Boot    │
│  REST API Layer │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│  Data Layer     │
└─────────────────┘
```

## Deployment Architecture
```plaintext
┌─────────────────┐
│   OVHcloud      │
│   Infrastructure│
├─────────────────┤
│ ┌─────────────┐ │
│ │ Load        │ │
│ │ Balancer    │ │
│ └──────┬──────┘ │
│        │        │
│ ┌──────┴──────┐ │
│ │  Spring Boot │ │
│ │  Server      │ │
│ └──────┬──────┘ │
│        │        │
│ ┌──────┴──────┐ │
│ │  PostgreSQL  │ │
│ │  Database    │ │
│ └─────────────┘ │
└─────────────────┘
```

## Security Implementation
- SSL/TLS Encryption
- Spring Security Authentication
- Database Access Control
- XSS & CSRF Protection

---

# Project Scope
## Restaurant Management System

### Business Requirements
- Online Food Ordering
- Menu Management
- User Account System
- Order Processing
- Delivery Management

### Technical Goals
- Responsive Design
- Secure Authentication
- Real-time Updates
- Performance Optimization

---

# Technology Stack Details

## Frontend Technologies
```plaintext
├── HTML5
│   ├── Semantic Elements
│   ├── Form Validation
│   └── Local Storage API
├── CSS3
│   ├── Custom Variables
│   ├── Flexbox Layout
│   ├── Media Queries
│   └── Animations
└── JavaScript (ES6+)
    ├── DOM Manipulation
    ├── Event Handling
    ├── Form Validation
    └── Local Storage Management
```

## External Dependencies
- Font Awesome 6.0.0 (Icons)
- Google Fonts (Typography)
- Custom CSS Variables

---

# Design System Implementation

## Color Palette
```css
:root {
    /* Primary Colors */
    --primary-color: #264653;    /* Deep Blue */
    --secondary-color: #f4a261;  /* Soft Orange */
    --accent-color: #e9c46a;     /* Warm Yellow */
    
    /* UI Colors */
    --text-color: #2a2a2a;       /* Dark Gray */
    --light-bg: #f9f9f9;         /* Light Gray */
    --white: #ffffff;            /* White */
    
    /* Status Colors */
    --success: #28a745;          /* Green */
    --error: #dc3545;           /* Red */
}
```

## Typography
```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
}

h1, h2, h3 {
    font-weight: 600;
    color: var(--primary-color);
}
```

---

# Core Components

## 1. Navigation System
```html
<header class="main-header">
    <nav class="nav-container">
        <div class="logo">
            <img src="menu/Bosa Logo.jpeg" alt="Bosa Kitchen">
        </div>
        <div class="nav-links">
            <a href="#menu">Menu</a>
            <a href="#cart">Cart</a>
            <a href="login.html">Login</a>
        </div>
    </nav>
</header>
```

## 2. Menu Display
```html
<section class="menu-section">
    <div class="menu-grid">
        <!-- Dynamic Menu Items -->
        <div class="menu-item">
            <img src="menu/item.jpg">
            <h3>Item Name</h3>
            <p>$XX.XX</p>
            <button>Add to Cart</button>
        </div>
    </div>
</section>
```

---

# Authentication Implementation

## Registration System
```javascript
// Form Validation
const validateForm = (formData) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!passwordRegex.test(formData.password)) {
        throw new Error('Invalid password format');
    }
    // Additional validation...
};

// User Registration
const registerUser = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
};
```

## Login System
```javascript
// User Authentication
const authenticateUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
        u.email === email && 
        u.password === password
    );
    
    if (user) {
        const userInfo = { ...user };
        delete userInfo.password;
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        return true;
    }
    return false;
};
```

---

# Data Management System

## Local Storage Schema
```javascript
// User Data Structure
const userSchema = {
    users: [
        {
            first_name: "string",
            last_name: "string",
            email: "string",
            phone_number: "string",
            address: "string",
            password: "string"
        }
    ],
    currentUser: {
        first_name: "string",
        last_name: "string",
        email: "string",
        phone_number: "string",
        address: "string"
    },
    cart: [
        {
            id: "number",
            name: "string",
            price: "number",
            quantity: "number"
        }
    ]
};
```

## Data Operations
```javascript
// Cart Management
const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
};

const updateQuantity = (itemId, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};
```

---

# Security Implementation

## Input Validation
```javascript
// Password Validation
const validatePassword = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*]/.test(password)
    };
    
    return Object.values(requirements).every(Boolean);
};

// Email Validation
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Phone Validation
const validatePhone = (phone) => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
};
```

## Form Security
```javascript
// XSS Prevention
const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '');
};

// CSRF Protection
const generateCSRFToken = () => {
    return Math.random().toString(36).substring(2);
};
```

---

# Responsive Design Implementation

## CSS Media Queries
```css
/* Mobile First Approach */
.container {
    width: 100%;
    padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 960px;
    }
}
```

## Flexbox Layout
```css
.menu-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.menu-item {
    flex: 1 1 300px;
    max-width: 100%;
}

@media (min-width: 768px) {
    .menu-item {
        max-width: calc(50% - 1rem);
    }
}
```

---

# Performance Optimization

## Image Optimization
```javascript
// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});
```

## DOM Optimization
```javascript
// Efficient DOM Updates
const updateMenuItems = (items) => {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const element = createMenuElement(item);
        fragment.appendChild(element);
    });
    
    const container = document.querySelector('.menu-grid');
    container.innerHTML = '';
    container.appendChild(fragment);
};
```

---

# Testing Strategy

## Unit Testing
```javascript
// Example Test Cases
describe('User Validation', () => {
    test('Password Validation', () => {
        expect(validatePassword('Abc123!@#')).toBe(true);
        expect(validatePassword('abc123')).toBe(false);
    });
    
    test('Email Validation', () => {
        expect(validateEmail('user@example.com')).toBe(true);
        expect(validateEmail('invalid-email')).toBe(false);
    });
});
```

## Browser Testing
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

---

# Project Structure
```plaintext
bosaKitchenfrontend/
├── index.html              # Main landing page
├── login.html             # User authentication
├── register.html          # User registration
├── assets/
│   ├── css/
│   │   ├── style.css     # Main styles
│   │   └── responsive.css # Media queries
│   ├── js/
│   │   ├── auth.js       # Authentication
│   │   ├── cart.js       # Shopping cart
│   │   └── menu.js       # Menu management
│   └── images/
│       └── menu/         # Food images
├── README.md             # Documentation
└── presentation.md       # This presentation
```

---

# Future Roadmap

## Phase 1: Backend Integration
- Node.js/Express Backend
- MongoDB Database
- RESTful API
- JWT Authentication

## Phase 2: Enhanced Features
- Payment Gateway
- Real-time Order Tracking
- Email Notifications
- Admin Dashboard

## Phase 3: Optimization
- PWA Implementation
- Image CDN
- Caching Strategy
- Performance Monitoring

---

# Contact & Support

## Website Information
- **Main Website**: [https://bosa.food](https://bosa.food)
- **Location**: 855 Av. Galt, Verdun, QC H4G 3G3
- **Phone**: (438) 778-2127
- **General Inquiries**: info@bosakitchen.com

## Development Team Support
- Technical Support: support@bosakitchen.com
- Feature Requests: features@bosakitchen.com
- Bug Reports: bugs@bosakitchen.com

## Business Hours
- Monday - Friday: 11:00 AM - 10:00 PM
- Saturday - Sunday: 12:00 PM - 11:00 PM

## Documentation
- API Documentation
- User Guides
- Contributing Guidelines
- Change Log

# Real-Time Delivery Tracking

## Location Tracking Implementation
```javascript
// Rider Location Tracking
class DeliveryTracker {
    constructor() {
        this.map = null;
        this.riderMarker = null;
        this.customerMarker = null;
        this.watchId = null;
    }

    // Initialize Google Maps
    initMap(deliveryId) {
        this.map = new google.maps.Map(document.getElementById('delivery-map'), {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // Initialize rider and customer markers
        this.riderMarker = new google.maps.Marker({
            map: this.map,
            icon: 'assets/images/rider-icon.png',
            title: 'Delivery Rider'
        });

        this.customerMarker = new google.maps.Marker({
            map: this.map,
            icon: 'assets/images/customer-icon.png',
            title: 'Delivery Location'
        });

        // Start tracking
        this.startTracking(deliveryId);
    }

    // Start real-time location tracking
    startTracking(deliveryId) {
        // Watch rider's position
        this.watchId = navigator.geolocation.watchPosition(
            position => this.updateLocation(position, deliveryId),
            error => console.error('Error:', error),
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            }
        );
    }

    // Update rider's location
    async updateLocation(position, deliveryId) {
        const { latitude, longitude } = position.coords;
        
        // Update rider marker position
        const riderPosition = new google.maps.LatLng(latitude, longitude);
        this.riderMarker.setPosition(riderPosition);

        // Center map on rider
        this.map.setCenter(riderPosition);

        // Update location in database
        await this.updateLocationInDB(deliveryId, latitude, longitude);

        // Calculate and display ETA
        this.updateETA(riderPosition);
    }

    // Update location in database
    async updateLocationInDB(deliveryId, latitude, longitude) {
        const locationData = {
            deliveryId,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage for demo (replace with actual API call)
        localStorage.setItem(`delivery_${deliveryId}`, JSON.stringify(locationData));
    }

    // Calculate and update ETA
    updateETA(riderPosition) {
        const customerPosition = this.customerMarker.getPosition();
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [riderPosition],
            destinations: [customerPosition],
            travelMode: 'DRIVING',
        }, (response, status) => {
            if (status === 'OK') {
                const duration = response.rows[0].elements[0].duration.text;
                document.getElementById('eta-display').textContent = 
                    `Estimated arrival in: ${duration}`;
            }
        });
    }

    // Stop tracking
    stopTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}
```

## HTML Implementation
```html
<!-- Delivery Tracking Section -->
<div class="delivery-tracking">
    <div id="delivery-map"></div>
    <div class="tracking-info">
        <div id="eta-display" class="eta"></div>
        <div class="rider-info">
            <img src="rider-photo.jpg" alt="Rider Photo" class="rider-photo">
            <div class="rider-details">
                <h3>Your Rider</h3>
                <p id="rider-name">John Doe</p>
                <p id="rider-phone">+1234567890</p>
            </div>
        </div>
        <button id="contact-rider" class="contact-btn">
            Contact Rider
        </button>
    </div>
</div>
```

## CSS Styling
```css
.delivery-tracking {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: var(--white);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#delivery-map {
    height: 300px;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
}

.tracking-info {
    padding: 1rem;
    background: var(--light-bg);
    border-radius: 8px;
}

.eta {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.rider-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.rider-photo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
}

.contact-btn {
    width: 100%;
    padding: 0.8rem;
    background: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.contact-btn:hover {
    background: var(--secondary-color);
}

@media (min-width: 768px) {
    .delivery-tracking {
        flex-direction: row;
    }

    #delivery-map {
        flex: 2;
        height: 400px;
    }

    .tracking-info {
        flex: 1;
    }
}
```

## Integration Steps
1. Add Google Maps API:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

2. Initialize Tracking:
```javascript
// When order status changes to "out for delivery"
const tracker = new DeliveryTracker();
tracker.initMap(orderId);

// Clean up when delivery is completed
window.addEventListener('deliveryComplete', () => {
    tracker.stopTracking();
});
```

## Security Considerations
- Secure API key usage
- User authentication for tracking access
- Rate limiting for location updates
- Data encryption for location transmission
- Privacy policy compliance
- Location data retention policies

## Features
- Real-time rider location updates
- Accurate ETA calculations
- Interactive map interface
- Rider contact information
- Push notifications for status updates
- Location history tracking
- Delivery route optimization

## Mobile Optimization
- Geolocation API usage
- Battery-efficient tracking
- Offline support
- Background location updates
- Cross-platform compatibility

--- 