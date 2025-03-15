document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.display = 'none';
    loginForm.insertBefore(errorMessage, loginForm.firstChild);

    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.display = 'none';
    loginForm.insertBefore(successMessage, loginForm.firstChild);

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Reset messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        try {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

            if (user) {
                // Store user info in localStorage (except password)
                const userInfo = { ...user };
                delete userInfo.password;
                localStorage.setItem('currentUser', JSON.stringify(userInfo));

                // Show success message
                successMessage.textContent = 'Login successful! Redirecting...';
                successMessage.style.display = 'block';

                // Redirect to home page after 1 second
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });

    // Handle forgot password
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            if (!email) {
                errorMessage.textContent = 'Please enter your email address first';
                errorMessage.style.display = 'block';
                return;
            }

            // In a real application, this would trigger a password reset email
            alert('In a real application, a password reset link would be sent to your email.');
        });
    }
}); 