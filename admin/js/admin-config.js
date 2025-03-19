// Default admin credentials
const defaultAdmin = {
    username: "admin",
    password: "admin123" // This should be changed after first login
};

// Admin configuration
const adminConfig = {
    defaultAdmin: defaultAdmin,
    tokenExpiry: "15m", // 15 minutes
    refreshTokenExpiry: "7d", // 7 days
    minPasswordLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15 // 15 minutes
};

export default adminConfig; 