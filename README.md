# Bosa Kitchen Website Documentation

## Project Overview
Bosa Kitchen is a modern restaurant website that allows customers to browse menus, place orders, track deliveries, and manage their accounts. The website features a responsive design, user authentication, real-time order tracking, and an interactive menu system.

## Development Team
This project was developed by a team of five individuals who collaborated to create this comprehensive restaurant management system. Each team member brought their unique expertise to deliver a robust and user-friendly application.

### Team Members and Roles
- **Theresa** - Frontend Development
  - Implemented responsive UI components
  - Created interactive user interfaces
  - Developed client-side functionality

- **Lucky** - Backend Development
  - Designed and implemented server architecture
  - Created API endpoints
  - Managed server-side logic

- **Kiran** - Database Management
  - Designed database schema
  - Implemented data models
  - Optimized database performance

- **Moses** - Database Management
  - Managed data relationships
  - Implemented data security measures
  - Handled data migration and backup

- **Aria** - Deployment and Hosting
  - Managed deployment pipeline
  - Configured hosting environment
  - Handled system maintenance and updates

## Technology Stack
- **Frontend**:
  - HTML5 (Semantic Elements, Form Validation)
  - CSS3 (Custom variables, Flexbox, Grid, Animations)
  - Vanilla JavaScript (ES6+)
  - Font Awesome 6.0.0 for icons
  - Google Maps API for delivery tracking

- **Backend**:
  - Spring Boot Framework
  - RESTful API architecture
  - Java 17
  - Maven for dependency management
  - Spring Security for authentication

- **Database**:
  - PostgreSQL
  - pgAdmin4 for database management
  - JPA/Hibernate for ORM
  - Database migration and version control

- **Hosting & Deployment**:
  - OVHcloud for cloud hosting
  - CI/CD pipeline
  - SSL/TLS encryption
  - Load balancing and scaling

## Features

### 1. User Interface
- Responsive design optimized for all device sizes
- Modern and clean layout with smooth animations
- Multilingual support (English, French, Spanish)
- Consistent color scheme using CSS variables
- Mobile-first approach with hamburger menu
- Back to Top button for easy navigation
- Loading animations and transitions
- Page loader for better user experience

### 2. Authentication System
#### Registration (`register.html`)
- User registration form with the following fields:
  - First Name
  - Last Name
  - Email Address
  - Phone Number
  - Delivery Address
  - Password
- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character
- Real-time password validation
- Form validation for email and phone number
- Duplicate email checking

#### Login (`login.html`)
- User login with email and password
- "Remember Me" functionality
- Password reset option
- Session management using localStorage
- Redirect handling after successful login

### 3. Menu System
- Interactive menu display with categories:
  - Main Course
  - Beverages (Soft Drinks, African Drinks, Other Beverages)
- Each menu item includes:
  - High-quality image with loading state
  - Detailed description
  - Price
  - Add to Cart functionality
  - Hover effects and animations

### 4. Shopping Cart
- Real-time cart preview
- Add/remove items with quantity adjustment
- Auto-hide preview after adding items
- Persistent cart state
- Quick checkout access
- Total price calculation
- Mobile-responsive design

### 5. Order Tracking
- Real-time order status updates
- Progress bar visualization
- Estimated delivery time
- Quick tracking form in hero section
- Detailed tracking page with map integration
- Order status notifications

### 6. Special Features
- Chef's Recommendations section
- Special offers and promotions
- Customer reviews system
- Location information with map
- Multi-language support
- Privacy policy and terms of service modals
- Contact information and business hours

### 7. Performance Optimizations
- Lazy loading for images
- Smooth scrolling behavior
- Intersection Observer for animations
- Efficient DOM updates
- Loading states for better UX
- Optimized mobile menu

### 8. Form Handling
- Real-time validation
- Error messaging
- Success feedback
- Required field handling
- Payment method selection
- Delivery/Pickup options

## File Structure
```
bosaKitchenfrontend/
├── index.html          # Main landing page
├── login.html          # User login page
├── register.html       # User registration page
├── track-order.html    # Order tracking page
├── rider.html          # Rider dashboard
├── README.md          # Project documentation
└── menu/              # Directory containing menu images
    ├── Bosa Logo.jpeg # Restaurant logo
    └── beverages/     # Beverage images
```

## Local Storage Structure
The website uses localStorage for data persistence:

1. **Users**:
```javascript
{
    "users": [
        {
            "first_name": "string",
            "last_name": "string",
            "email": "string",
            "phone_number": "string",
            "address": "string",
            "password": "string"
        }
    ]
}
```

2. **Current User**:
```javascript
{
    "currentUser": {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone_number": "string",
        "address": "string"
    }
}
```

## Security Features
1. Form Validation:
   - Password strength requirements
   - Email format validation
   - Phone number validation
   - CSRF protection
   - XSS prevention

2. External Links:
   - rel="noopener noreferrer" for security
   - target="_blank" handling
   - Secure payment processing

## Performance Considerations
- Minified CSS and JavaScript
- Optimized images with lazy loading
- Efficient DOM manipulation
- Local storage for data persistence
- Loading states and animations
- Mobile-first responsive design

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Improvements
1. Backend Integration:
   - RESTful API implementation
   - Database integration
   - User authentication system
   - Order management system

2. Enhanced Features:
   - Online payment integration
   - User profiles
   - Order history
   - Loyalty program
   - Email notifications
   - Push notifications

3. Additional Optimizations:
   - Image CDN integration
   - Service Worker implementation
   - Offline support
   - Cache management
   - Performance monitoring

## Development Setup
1. Clone the repository

2. Frontend Setup:
   - No build process required - static HTML/CSS/JS
   - Open `index.html` in a modern web browser

3. Backend Setup:
   - Install Java 17 or later
   - Install Maven
   - Configure application.properties with database credentials
   - Run `mvn spring-boot:run` to start the server

4. Database Setup:
   - Install PostgreSQL
   - Install pgAdmin4
   - Create a new database
   - Run database migrations
   - Configure connection settings in Spring Boot

5. Environment Configuration:
   - Set up environment variables for sensitive data
   - Configure OVHcloud credentials
   - Set up SSL certificates
   - Configure domain settings

## Maintenance
- Regular updates to dependencies
- Security patches
- Browser compatibility testing
- Performance monitoring

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For support or inquiries:
- Technical Support: support@bosakitchen.com
- Feature Requests: features@bosakitchen.com
- Bug Reports: bugs@bosakitchen.com 