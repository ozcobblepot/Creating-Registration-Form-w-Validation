// Get all elements
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const registerPanel = document.getElementById('register-panel');
const loginPanel = document.getElementById('login-panel');
const closeBtns = document.querySelectorAll('.close-btn');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const dobInput = document.getElementById('dob');
const switchToLogin = document.querySelector('.switch-to-login');
const switchToRegister = document.querySelector('.switch-to-register');

// Store registered user data in memory
let registeredUser = null;

// Open register panel
registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerPanel.style.display = 'flex';
});

// Open login panel
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginPanel.style.display = 'flex';
});

// Switch from register to login
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerPanel.style.display = 'none';
    loginPanel.style.display = 'flex';
});

// Switch from login to register
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginPanel.style.display = 'none';
    registerPanel.style.display = 'flex';
});

// Close panels
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        registerPanel.style.display = 'none';
        loginPanel.style.display = 'none';
    });
});

// Close panels when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === registerPanel) {
        registerPanel.style.display = 'none';
    }
    if (e.target === loginPanel) {
        loginPanel.style.display = 'none';
    }
});

// Floating label behavior for all inputs
const inputContainers = document.querySelectorAll('.input-container');

inputContainers.forEach(container => {
    const input = container.querySelector('input, textarea');
    const label = container.querySelector('label');
    
    if (input && label) {
        // Handle input event (when user types)
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                label.classList.add('active');
            }
        });
        
        // Handle focus (when user clicks on input)
        input.addEventListener('focus', () => {
            label.classList.add('active');
        });
        
        // Handle blur (when user leaves the input)
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                label.classList.remove('active');
            } else {
                label.classList.add('active');
            }
        });
        
        // Check if input has value on page load
        if (input.value.trim() !== '') {
            label.classList.add('active');
        }
    }
});

// Date of Birth formatting and validation
dobInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
        value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    
    e.target.value = value;
    
    // Auto-move label when typing
    const label = dobInput.nextElementSibling;
    if (value.length > 0) {
        label.classList.add('active');
    } else {
        label.classList.remove('active');
    }
});

// Focus behavior for date input
dobInput.addEventListener('focus', () => {
    const label = dobInput.nextElementSibling;
    label.classList.add('active');
});

dobInput.addEventListener('blur', () => {
    const label = dobInput.nextElementSibling;
    if (dobInput.value === '') {
        label.classList.remove('active');
    }
});

// Validate date format
function isValidDate(dateString) {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    
    const parts = dateString.split('/');
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month - 1, day);
    
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
}

// Handle registration form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate date of birth
    const dobValue = dobInput.value;
    if (!isValidDate(dobValue)) {
        alert('Please enter a valid date in MM/DD/YYYY format');
        return;
    }
    
    // Validate password match
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    // Store user data
    const formData = new FormData(registerForm);
    registeredUser = {
        firstName: formData.get('first-name'),
        lastName: formData.get('last-name'),
        username: formData.get('username'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        gender: formData.get('gender'),
        dob: formData.get('dob'),
        country: formData.get('country'),
        homeAddress: formData.get('home-address'),
        officeAddress: formData.get('office-address'),
        password: password
    };
    
    alert('Registration successful! You can now login with your credentials.');
    registerPanel.style.display = 'none';
    registerForm.reset();
    
    // Reset all labels
    document.querySelectorAll('.input-container label').forEach(label => {
        label.classList.remove('active');
    });
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Check if user has registered
    if (!registeredUser) {
        alert('No account found! Please register first.');
        loginPanel.style.display = 'none';
        registerPanel.style.display = 'flex';
        return;
    }
    
    // Validate credentials
    if (registeredUser.email === email && registeredUser.password === password) {
        alert(`Login successful! Welcome back, ${registeredUser.firstName} ${registeredUser.lastName}!`);
        loginPanel.style.display = 'none';
        loginForm.reset();
        
        // Reset login form labels
        document.querySelectorAll('#login-panel .input-container label').forEach(label => {
            label.classList.remove('active');
        });
        
        // You can redirect or show dashboard here
        console.log('User logged in:', registeredUser);
    } else {
        // Show specific error message
        if (registeredUser.email !== email) {
            alert('Invalid email address! Please check your email and try again.');
        } else {
            alert('Invalid password! Please check your password and try again.');
        }
    }
});
