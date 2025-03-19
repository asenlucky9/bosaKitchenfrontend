class ErrorHandler {
    static handle(error, context = '') {
        // Log the error
        console.error(`Error in ${context}:`, error);

        // Determine error type and message
        let userMessage = 'An unexpected error occurred. Please try again.';
        
        if (error.name === 'AbortError') {
            userMessage = 'The request timed out. Please check your connection and try again.';
        } else if (error.message) {
            userMessage = error.message;
        }

        // Show error to user
        this.showErrorMessage(userMessage);

        // Return formatted error object
        return {
            success: false,
            message: userMessage,
            error: error
        };
    }

    static showErrorMessage(message) {
        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error">×</button>
            </div>
        `;

        // Add styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #dc3545;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        // Add close button functionality
        const closeButton = errorDiv.querySelector('.close-error');
        closeButton.addEventListener('click', () => {
            errorDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                errorDiv.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);

        // Add to document
        document.body.appendChild(errorDiv);
    }
}

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .error-message .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .error-message .close-error {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0 0.5rem;
        margin-left: 1rem;
    }

    .error-message .close-error:hover {
        opacity: 0.8;
    }
`;

document.head.appendChild(style);

export default ErrorHandler; 