# Bosa Kitchen Website Documentation

## Project Overview
Bosa Kitchen is a modern restaurant website that allows customers to browse menus, place orders, and manage their accounts. The website features a responsive design, user authentication, and an interactive menu system.

## Technology Stack
- **Frontend**:
  - HTML5
  - CSS3 (Custom variables, Flexbox)
  - Vanilla JavaScript (ES6+)
  - Font Awesome 6.0.0 for icons

## Features

### 1. User Interface
- Responsive design that works on all device sizes
- Modern and clean layout
- Consistent color scheme using CSS variables:
  ```css
  :root {
      --primary-color: #264653;
      --secondary-color: #f4a261;
      --accent-color: #e9c46a;
      --text-color: #2a2a2a;
      --light-bg: #f9f9f9;
      --white: #ffffff;
  }
  ```

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
- Interactive menu display
- Categories:
  - Main Course
  - Beverages
- Each menu item includes:
  - Name
  - Price
  - Image
  - Description
  - Add to Order button

### 4. Shopping Cart
- Add/remove items
- Quantity adjustment
- Price calculation
- Order summary
- Local storage persistence

### 5. Animations and Effects
- Hover effects on buttons and links
- Smooth transitions
- Loading states
- Success/Error message animations

## File Structure
```
bosaKitchenfrontend/
├── index.html          # Main landing page
├── login.html          # User login page
├── register.html       # User registration page
├── README.md          # Project documentation
└── menu/              # Directory containing menu images
    └── Bosa Logo.jpeg # Restaurant logo
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
1. Password Requirements:
   ```javascript
   const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
   ```
2. Email Validation:
   ```javascript
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   ```
3. Phone Number Validation:
   ```javascript
   const phoneRegex = /^\+?[\d\s-]{10,}$/;
   ```

## Future Improvements
1. Backend Integration:
   - Replace localStorage with proper database storage
   - Implement secure API endpoints
   - Add proper session management

2. Enhanced Security:
   - Password hashing
   - JWT authentication
   - HTTPS implementation
   - CSRF protection

3. Additional Features:
   - Email verification
   - Password reset functionality
   - Order history
   - User profile management
   - Payment integration
   - Real-time order tracking

## Development Setup
1. Clone the repository
2. No build process required - static HTML/CSS/JS
3. Open `index.html` in a modern web browser

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations
- Minified CSS and JavaScript files
- Optimized images
- Local storage for data persistence
- Efficient DOM manipulation

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
For support or inquiries, please contact the development team. 