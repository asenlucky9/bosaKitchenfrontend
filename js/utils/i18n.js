// Language translations
const translations = {
    en: {
        // Navigation
        loginTitle: "Login - Bosa Kitchen",
        home: "Home",
        menu: "Menu",
        specialOffers: "Special Offers",
        contact: "Contact",
        login: "Login",
        register: "Register",
        trackOrder: "Track Order",

        // Header
        restaurantName: "Bosa Kitchen",
        tagline: "Authentic Ethiopian Cuisine",

        // Login Page
        welcomeBack: "Welcome Back",
        email: "Email",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot Password?",
        loginButton: "Login",
        noAccount: "Don't have an account?",
        registerHere: "Register here",
        error: "Invalid email or password",
        success: "Login successful! Redirecting...",
        emailRequired: "Please enter your email address first",
        passwordResetSent: "Password reset instructions have been sent to your email",
        passwordResetError: "Failed to process password reset request",

        // Register Page
        createAccount: "Create Account",
        joinBosa: "Join Bosa Kitchen today",
        firstName: "First Name",
        lastName: "Last Name",
        phoneNumber: "Phone Number",
        address: "Delivery Address",
        confirmPassword: "Confirm Password",
        createAccountButton: "Create Account",
        haveAccount: "Already have an account?",
        signIn: "Sign In",

        // Menu Page
        menuTitle: "Our Menu",
        categories: "Categories",
        addToCart: "Add to Cart",
        price: "Price",
        description: "Description",

        // Cart
        cart: "Cart",
        checkout: "Checkout",
        total: "Total",
        emptyCart: "Your cart is empty",
        
        // Order Tracking
        trackYourOrder: "Track Your Order",
        orderNumber: "Order Number",
        orderStatus: "Order Status",
        orderDetails: "Order Details",

        // Footer
        contactInfo: "Contact Info",
        openingHours: "Opening Hours",
        followUs: "Follow Us",
        
        // Common
        loading: "Loading...",
        error: "An error occurred",
        success: "Success",
        submit: "Submit",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",

        // Social Login
        orLoginWith: "or login with",
        loginWithGoogle: "Login with Google",
        loginWithFacebook: "Login with Facebook",
        
        // Enhanced Messages
        loggingIn: "Logging in...",
        invalidEmail: "Please enter a valid email address",
        passwordRequired: "Password is required",
        passwordMinLength: "Password must be at least 8 characters",
        sessionExpired: "Your session has expired. Please log in again.",
        networkError: "Network error. Please check your connection.",
        
        // Security
        twoFactorTitle: "Two-Factor Authentication",
        twoFactorMessage: "Please enter the code sent to your device",
        resendCode: "Resend Code",
        verifyCode: "Verify Code",
        
        // Password Visibility
        showPassword: "Show password",
        hidePassword: "Hide password",
        
        // Enhanced Errors
        accountLocked: "Account locked. Please try again later.",
        tooManyAttempts: "Too many login attempts. Please try again in {minutes} minutes.",
        maintenanceMode: "System is under maintenance. Please try again later.",

        // Login messages
        loginError: 'An error occurred during login. Please try again.',
        invalidCredentials: 'Invalid email or password.',
        accountLocked: 'Your account has been locked. Please contact support.',
        accountNotVerified: 'Please verify your email address before logging in.',
        twoFactorMessage: 'Please enter the verification code sent to your device:',
        networkError: 'Please check your internet connection and try again.',
        loggingIn: 'Logging in...',
        loginButton: 'Log In',
        loginSuccess: 'Login successful! Redirecting...',
        
        // Social login
        continueWithGoogle: 'Continue with Google',
        continueWithFacebook: 'Continue with Facebook',
        socialLoginError: 'Could not complete social login. Please try again.',
    },
    am: {
        // Navigation
        loginTitle: "ግባ - ቦሳ ኪችን",
        home: "ቤት",
        menu: "ምናሌ",
        specialOffers: "ልዩ ቅናሾች",
        contact: "አግኙን",
        login: "ግባ",
        register: "ተመዝገብ",
        trackOrder: "ትዕዛዝ ክተትል",

        // Header
        restaurantName: "ቦሳ ኪችን",
        tagline: "ዋና የኢትዮጵያ ምግብ",

        // Login Page
        welcomeBack: "እንኳን ደህና መጡ",
        email: "ኢሜይል",
        password: "የይለፍ ቃል",
        rememberMe: "አስታውሰኝ",
        forgotPassword: "የይለፍ ቃል ረሳህ?",
        loginButton: "ግባ",
        noAccount: "አካውንት የለህም?",
        registerHere: "እዚህ ተመዝገብ",
        error: "ትክክል ያልሆነ ኢሜይል ወይም የይለፍ ቃል",
        success: "በተሳካ ሁኔታ ገብተዋል! በመውሰድ ላይ...",
        emailRequired: "እባክዎ የኢሜይል አድራሻዎን ያስገቡ",
        passwordResetSent: "የይለፍ ቃል እንደገና የማስጀመሪያ መመሪያዎች ወደ ኢሜይልዎ ተልከዋል",
        passwordResetError: "የይለፍ ቃል እንደገና የማስጀመር ጥያቄውን ማስኬድ አልተቻለም",

        // Register Page
        createAccount: "አካውንት ፍጠር",
        joinBosa: "ዛሬ ቦሳ ኪችንን ተቀላቀል",
        firstName: "የመጀመሪያ ስም",
        lastName: "የአባት ስም",
        phoneNumber: "ስልክ ቁጥር",
        address: "የመድረሻ አድራሻ",
        confirmPassword: "የይለፍ ቃል አረጋግጥ",
        createAccountButton: "አካውንት ፍጠር",
        haveAccount: "አካውንት አለህ?",
        signIn: "ግባ",

        // Menu Page
        menuTitle: "የእኛ ምናሌ",
        categories: "ምድቦች",
        addToCart: "ወደ ዘንቢል ጨምር",
        price: "ዋጋ",
        description: "መግለጫ",

        // Cart
        cart: "ዘንቢል",
        checkout: "ክፍያ",
        total: "ጠቅላላ",
        emptyCart: "ዘንቢልዎ ባዶ ነው",

        // Order Tracking
        trackYourOrder: "ትዕዛዝዎን ይከታተሉ",
        orderNumber: "የትዕዛዝ ቁጥር",
        orderStatus: "የትዕዛዝ ሁኔታ",
        orderDetails: "የትዕዛዝ ዝርዝሮች",

        // Footer
        contactInfo: "የመገኛ መረጃ",
        openingHours: "የስራ ሰዓታት",
        followUs: "ተከተሉን",

        // Common
        loading: "በመጫን ላይ...",
        error: "ስህተት ተከስቷል",
        success: "ተሳክቷል",
        submit: "አስገባ",
        cancel: "ሰርዝ",
        save: "አስቀምጥ",
        delete: "ሰርዝ",
        edit: "አስተካክል",

        // Social Login
        orLoginWith: "ወይም በሚከተለው ይግቡ",
        loginWithGoogle: "በGoogle ይግቡ",
        loginWithFacebook: "በFacebook ይግቡ",
        
        // Enhanced Messages
        loggingIn: "በመግባት ላይ...",
        invalidEmail: "እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ",
        passwordRequired: "የይለፍ ቃል ያስፈልጋል",
        passwordMinLength: "የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት",
        sessionExpired: "የእርስዎ ክፍለ-ጊዜ አልቋል። እባክዎ እንደገና ይግቡ።",
        networkError: "የአውታረ መረብ ስህተት። እባክዎ ግንኙነትዎን ያረጋግጡ።",
        
        // Security
        twoFactorTitle: "ሁለት-ደረጃ ማረጋገጫ",
        twoFactorMessage: "እባክዎ ወደ መሳሪያዎ የተላከውን ኮድ ያስገቡ",
        resendCode: "ኮድ እንደገና ላክ",
        verifyCode: "ኮድ አረጋግጥ",
        
        // Password Visibility
        showPassword: "የይለፍ ቃል አሳይ",
        hidePassword: "የይለፍ ቃል ደብቅ",
        
        // Enhanced Errors
        accountLocked: "መለያው ተዘግቷል። እባክዎ ቆይተው ይሞክሩ።",
        tooManyAttempts: "በጣም ብዙ የመግቢያ ሙከራዎች። እባክዎ በ{minutes} ደቂቃዎች ውስጥ እንደገና ይሞክሩ።",
        maintenanceMode: "ሲስተሙ በጥገና ላይ ነው። እባክዎ ቆይተው ይሞክሩ።",

        // Login messages
        loginError: 'በመግቢያው ላይ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
        invalidCredentials: 'ልክ ያልሆነ ኢሜይል ወይም የይለፍ ቃል።',
        accountLocked: 'መለያዎ ተቆልፏል። እባክዎ ድጋፍን ያግኙ።',
        accountNotVerified: 'እባክዎ ከመግባትዎ በፊት የኢሜይል አድራሻዎን ያረጋግጡ።',
        twoFactorMessage: 'እባክዎ ወደ መሳሪያዎ የተላከውን የማረጋገጫ ኮድ ያስገቡ፡',
        networkError: 'እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ እና እንደገና ይሞክሩ።',
        loggingIn: 'በመግባት ላይ...',
        loginButton: 'ግባ',
        loginSuccess: 'በተሳካ ሁኔታ ገብተዋል! በማዘዋወር ላይ...',
        
        // Social login
        continueWithGoogle: 'በGoogle ይቀጥሉ',
        continueWithFacebook: 'በFacebook ይቀጥሉ',
        socialLoginError: 'በማህበራዊ መለያ መግባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
    }
};

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = translations;
    }

    // Initialize language
    init() {
        this.setLanguage(this.currentLanguage);
        this.addLanguageSelector();
        
        // Initial content update
        this.updateContent();
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Set language
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            document.documentElement.setAttribute('lang', lang);
            document.documentElement.setAttribute('dir', lang === 'am' ? 'rtl' : 'ltr');
            this.updateContent();
            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    // Get translation
    t(key) {
        const translation = this.translations[this.currentLanguage];
        return translation[key] || this.translations['en'][key] || key;
    }

    // Update all content with data-i18n attributes
    updateContent() {
        // Update regular content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', this.t(key));
                } else {
                    element.value = this.t(key);
                }
            } else if (element.tagName === 'TITLE') {
                document.title = this.t(key);
            } else {
                element.textContent = this.t(key);
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.setAttribute('placeholder', this.t(key));
        });
    }

    // Add language selector to the page
    addLanguageSelector() {
        const existingSelector = document.getElementById('language-selector');
        if (existingSelector) return;

        const selector = document.createElement('div');
        selector.id = 'language-selector';
        selector.innerHTML = `
            <select class="language-select">
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="am" ${this.currentLanguage === 'am' ? 'selected' : ''}>አማርኛ</option>
            </select>
        `;

        // Style the selector
        const style = document.createElement('style');
        style.textContent = `
            #language-selector {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            .language-select {
                padding: 8px 12px;
                border-radius: 5px;
                border: 2px solid #264653;
                background-color: white;
                cursor: pointer;
                font-size: 14px;
                color: #264653;
                transition: all 0.3s ease;
            }
            .language-select:hover {
                background-color: #264653;
                color: white;
            }
            .language-select:focus {
                outline: none;
                box-shadow: 0 0 0 2px rgba(38, 70, 83, 0.2);
            }
            [dir="rtl"] #language-selector {
                left: 20px;
                right: auto;
            }
        `;
        document.head.appendChild(style);

        // Add event listener
        selector.querySelector('select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        document.body.appendChild(selector);
    }
}

// Create and export a single instance
const i18n = new I18n();

// Export the instance
export default i18n; 