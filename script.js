// Mock Data
const mockCourses = [
    {
        id: 1,
        title: "Web Development Fundamentals",
        instructor: "Dr. Sarah Johnson",
        description: "Learn HTML, CSS, and JavaScript basics",
        price: "$99",
        duration: "8 weeks",
        level: "Beginner",
        image: "./assets/web-development.jpg"
    },
    {
        id: 2,
        title: "Data Science with Python",
        instructor: "Prof. Michael Chen",
        description: "Master data analysis and machine learning",
        price: "$149",
        duration: "12 weeks",
        level: "Intermediate",
        image: "./assets/DS_Python.jpg"
    },
    {
        id: 3,
        title: "Digital Marketing Strategy",
        instructor: "Ms. Emily Davis",
        description: "Learn modern marketing techniques",
        price: "$79",
        duration: "6 weeks",
        level: "Beginner",
        image: "./assets/digital-marketing.png"
    },
    {
        id: 4,
        title: "Mobile App Development",
        instructor: "Dr. James Wilson",
        description: "Build iOS and Android applications",
        price: "$199",
        duration: "16 weeks",
        level: "Advanced",
        image: "./assets/app-development-min.jpg"
    }
];

let currentUser = null;
let selectedCourse = null;
let cart = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    loadCart();
    checkLoginState();
});

// Check login state on page load
function checkLoginState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavigation();
        // Don't change page, stay on current page
    } else {
        showPage('home');
    }
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'courses') {
        loadCourses();
    } else if (pageId === 'cart') {
        displayCart();
    } else if (pageId === 'my-courses') {
        loadMyCourses();
    } else if (pageId === 'profile') {
        loadProfile();
    }
}

// Load courses
function loadCourses() {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    
    mockCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="course-card-content">
                <h3>${course.title}</h3>
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                <p>${course.description}</p>
                <p><strong>Duration:</strong> ${course.duration} | <strong>Level:</strong> ${course.level}</p>
                <div class="course-price">${course.price}</div>
                <button onclick="viewCourse(${course.id})" class="cta-btn" style="margin-top: 1rem; width: 100%;">View Details</button>
            </div>
        `;
        courseList.appendChild(courseCard);
    });
}

// View course details
function viewCourse(courseId) {
    const course = mockCourses.find(c => c.id === courseId);
    selectedCourse = course;
    
    const courseInfo = document.getElementById('course-info');
    courseInfo.innerHTML = `
        <div class="course-details">
            <img src="${course.image}" alt="${course.title}" style="width: 100%; max-width: 500px; margin-bottom: 2rem;">
            <h2>${course.title}</h2>
            <p><strong>Instructor:</strong> ${course.instructor}</p>
            <p><strong>Description:</strong> ${course.description}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p><strong>Level:</strong> ${course.level}</p>
            <p><strong>Price:</strong> ${course.price}</p>
            <div style="margin-top: 2rem;">
                <button onclick="addToCart(${course.id})" class="add-to-cart-btn">Add to Cart</button>
                <button onclick="showPage('courses')" class="secondary-btn">Back to Courses</button>
            </div>
        </div>
    `;
    
    showPage('course-details');
}

// Enroll in course
function enrollInCourse() {
    if (!currentUser) {
        showMessage('Please login first to enroll in courses', 'error');
        showPage('login');
        return;
    }
     
    const enrollmentInfo = document.getElementById('enrollment-info');
    enrollmentInfo.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h3>${selectedCourse.title}</h3>
            <p><strong>Instructor:</strong> ${selectedCourse.instructor}</p>
            <p><strong>Price:</strong> ${selectedCourse.price}</p>
            <p><strong>Duration:</strong> ${selectedCourse.duration}</p>
        </div>
    `;
    
    showPage('enrollment');
}

// Handle enrollment
function handleEnrollment() {
    // Simulate enrollment process
    const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    const enrollment = {
        userId: currentUser.email,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        enrolledAt: new Date().toISOString()
    };
    
    // Check if already enrolled
    const alreadyEnrolled = enrollments.some(e => 
        e.userId === currentUser.email && e.courseId === selectedCourse.id
    );
    
    if (alreadyEnrolled) {
        showMessage('You are already enrolled in this course!', 'error');
        return;
    }
    
    enrollments.push(enrollment);
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
    
    showMessage('Successfully enrolled in the course!', 'success');
    showPage('courses');
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    const role = event.target.querySelector('select').value;
    
    // Simulate login validation
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage(`Welcome back, ${user.name}!`, 'success');
        updateNavigation();
        showPage('home');
    } else {
        showMessage('Invalid credentials. Please try again.', 'error');
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    const name = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    const role = event.target.querySelector('select').value;
    
    // Simulate registration
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showMessage('User already exists with this email!', 'error');
        return;
    }
    
    const newUser = { name, email, password, role, registeredAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('Registration successful! Please login.', 'success');
    showPage('login');
}

// Update navigation based on login status
function updateNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navProfile = document.getElementById('nav-profile');
    
    if (currentUser) {
        // Desktop: Show full navigation, Mobile: Show hamburger only
        navMenu.innerHTML = `
            <li><a href="#home" onclick="showPage('home')">Home</a></li>
            <li><a href="#courses" onclick="showPage('courses')">Courses</a></li>
            <li><a href="#cart" onclick="showPage('cart')">Cart</a></li>
            <li><a href="#my-courses" onclick="showPage('my-courses')">My Courses</a></li>
            <li><a href="#profile" onclick="showPage('profile')">Profile</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
        sidebarToggle.style.display = 'block';
        
        // Update nav profile with user's first letter
        navProfile.textContent = currentUser.name.charAt(0).toUpperCase();
        navProfile.style.display = 'flex';
        
        // Update sidebar user info
        updateSidebarUser();
    } else {
        navMenu.innerHTML = `
            <li><a href="#home" onclick="showPage('home')">Home</a></li>
            <li><a href="#courses" onclick="showPage('courses')">Courses</a></li>
            <li><a href="#login" onclick="showPage('login')">Login</a></li>
            <li><a href="#register" onclick="showPage('register')">Register</a></li>
        `;
        sidebarToggle.style.display = 'none';
        navProfile.style.display = 'none';
        closeSidebar();
    }
}

// Toggle profile dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

// Load profile
function loadProfile() {
    if (!currentUser) return;
    
    const profileInfo = document.getElementById('profile-info');
    const user = currentUser;
    
    profileInfo.innerHTML = `
        <div class="profile-edit">
            <div class="profile-photo">
                <div class="profile-pic" style="background-image: url('${user.photo || ''}'); background-size: cover; background-position: center;">
                    ${user.photo ? '' : user.name.charAt(0).toUpperCase()}
                </div>
                <button class="edit-photo-btn" onclick="document.getElementById('photo-upload').click()">Edit Photo</button>
                <input type="file" id="photo-upload" class="photo-upload" accept="image/*" onchange="handlePhotoUpload(event)">
            </div>
            
            <form class="profile-form" onsubmit="updateProfile(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value="${user.firstName || user.name.split(' ')[0] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value="${user.lastName || user.name.split(' ')[1] || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${user.email}" required>
                </div>
                
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value="${user.phone || ''}">
                </div>
                
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" value="${user.dob || ''}">
                </div>
                
                <div class="form-group">
                    <label>Address</label>
                    <textarea name="address" placeholder="Enter your address">${user.address || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Bio</label>
                    <textarea name="bio" placeholder="Tell us about yourself">${user.bio || ''}</textarea>
                </div>
                
                <button type="submit" class="cta-btn">Update Profile</button>
            </form>
        </div>
    `;
}

// Show profile (legacy function)
function showProfile() {
    showPage('profile');
}

// Handle photo upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.photo = e.target.result;
            updateUserInStorage();
            showProfile(); // Refresh profile page
            updateNavigation(); // Update nav avatar
        };
        reader.readAsDataURL(file);
    }
}

// Update profile
function updateProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    currentUser.firstName = formData.get('firstName');
    currentUser.lastName = formData.get('lastName');
    currentUser.name = `${currentUser.firstName} ${currentUser.lastName}`.trim();
    currentUser.email = formData.get('email');
    currentUser.phone = formData.get('phone');
    currentUser.dob = formData.get('dob');
    currentUser.address = formData.get('address');
    currentUser.bio = formData.get('bio');
    
    updateUserInStorage();
    updateNavigation();
    showMessage('Profile updated successfully!', 'success');
}

// Update user in localStorage
function updateUserInStorage() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Load my courses
function loadMyCourses() {
    if (!currentUser) return;
    
    const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    const userEnrollments = enrollments.filter(e => e.userId === currentUser.email);
    const myCourseList = document.getElementById('my-course-list');
    
    if (userEnrollments.length === 0) {
        myCourseList.innerHTML = '<p style="text-align: center; color: #666;">No courses enrolled yet.</p>';
    } else {
        myCourseList.innerHTML = '';
        userEnrollments.forEach(enrollment => {
            const course = mockCourses.find(c => c.id === enrollment.courseId);
            if (course) {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';
                courseCard.innerHTML = `
                    <img src="${course.image}" alt="${course.title}">
                    <div class="course-card-content">
                        <h3>${course.title}</h3>
                        <p><strong>Instructor:</strong> ${course.instructor}</p>
                        <p>${course.description}</p>
                        <p><strong>Enrolled:</strong> ${new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                        <button onclick="startLearning(${course.id})" class="cta-btn" style="margin-top: 1rem; width: 100%;">Continue Learning</button>
                    </div>
                `;
                myCourseList.appendChild(courseCard);
            }
        });
    }
}

// Show my courses (legacy function)
function showMyCourses() {
    showPage('my-courses');
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavigation();
    showMessage('Logged out successfully!', 'success');
    showPage('home');
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type} show`;
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profilePic = document.querySelector('.profile-pic');
    
    if (dropdown && !profilePic?.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Cart functions
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateNavigation();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(courseId) {
    if (!currentUser) {
        showMessage('Please login to add courses to cart!', 'error');
        showPage('login');
        return;
    }
    
    const course = mockCourses.find(c => c.id === courseId);
    const existingItem = cart.find(item => item.id === courseId);
    
    if (existingItem) {
        showMessage('Course already in cart!', 'error');
        return;
    }
    
    cart.push(course);
    saveCart();
    updateNavigation();
    showMessage('Course added to cart!', 'success');
}

function removeFromCart(courseId) {
    cart = cart.filter(item => item.id !== courseId);
    saveCart();
    updateNavigation();
    displayCart();
    showMessage('Course removed from cart!', 'success');
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty.</p>';
        cartTotal.textContent = '$0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(course => {
        const price = parseFloat(course.price.replace('$', ''));
        total += price;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="cart-item-info">
                <h4>${course.title}</h4>
                <p>Instructor: ${course.instructor}</p>
                <p>Duration: ${course.duration}</p>
            </div>
            <div class="cart-item-price">${course.price}</div>
            <button onclick="removeFromCart(${course.id})" class="remove-btn">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `$${total}`;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, course) => sum + parseFloat(course.price.replace('$', '')), 0);
    document.getElementById('checkout-total').textContent = `$${total}`;
    showPage('checkout');
}

function handlePayment(event) {
    event.preventDefault();
    
    // Simulate payment processing
    setTimeout(() => {
        // Add courses to user's enrolled courses
        const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        
        cart.forEach(course => {
            const enrollment = {
                userId: currentUser?.email || 'guest',
                courseId: course.id,
                courseTitle: course.title,
                enrolledAt: new Date().toISOString(),
                paymentStatus: 'completed'
            };
            enrollments.push(enrollment);
        });
        
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        
        // Clear cart
        cart = [];
        saveCart();
        updateNavigation();
        
        showMessage('Payment successful! Courses added to your library.', 'success');
        showPage('home');
    }, 2000);
    
    showMessage('Processing payment...', 'success');
}

// AI Chatbot Functions
const aiResponses = {
    courses: {
        keywords: ['course', 'courses', 'class', 'learn', 'study', 'available'],
        responses: [
            "We offer courses in Web Development, Data Science, Digital Marketing, and Mobile App Development. Which domain interests you?",
            "Our courses range from beginner to advanced levels. Would you like to know about a specific course?",
            "All courses include expert instruction, hands-on projects, and certification upon completion."
        ]
    },
    webdev: {
        keywords: ['web', 'html', 'css', 'javascript', 'frontend', 'backend', 'development'],
        responses: [
            "Our Web Development course covers HTML, CSS, JavaScript, and modern frameworks. It's perfect for beginners!",
            "The Web Development course is 8 weeks long and costs $99. You'll build real projects and get certified.",
            "Web development is in high demand. This course will teach you to build responsive websites and web applications."
        ]
    },
    datascience: {
        keywords: ['data', 'python', 'machine learning', 'analytics', 'science'],
        responses: [
            "Data Science with Python covers data analysis, visualization, and machine learning. It's a 12-week intermediate course.",
            "You'll learn pandas, numpy, matplotlib, and scikit-learn. Perfect for career transition into data science!",
            "Data Science is one of the fastest-growing fields. Our course prepares you for real-world data challenges."
        ]
    },
    marketing: {
        keywords: ['marketing', 'digital', 'social media', 'seo', 'advertising'],
        responses: [
            "Digital Marketing covers SEO, social media, content marketing, and paid advertising strategies.",
            "This 6-week course costs $79 and is perfect for entrepreneurs and marketing professionals.",
            "Learn to create effective marketing campaigns and grow businesses online."
        ]
    },
    mobile: {
        keywords: ['mobile', 'app', 'android', 'ios', 'development'],
        responses: [
            "Mobile App Development teaches you to build iOS and Android apps. It's our most comprehensive 16-week course.",
            "You'll learn React Native, Flutter, and native development. Great for advanced learners!",
            "Mobile apps are essential for businesses. This course prepares you for high-paying app developer roles."
        ]
    },
    pricing: {
        keywords: ['price', 'cost', 'fee', 'payment', 'money', 'affordable'],
        responses: [
            "Our courses range from $79 to $199. We offer flexible payment options and great value for money.",
            "All courses include lifetime access, certification, and career support. Very affordable compared to bootcamps!",
            "We believe in accessible education. Our pricing is designed to be affordable for everyone."
        ]
    },
    career: {
        keywords: ['career', 'job', 'salary', 'employment', 'future', 'opportunity'],
        responses: [
            "Our courses are designed for career growth. Many students get promotions or new jobs after completion.",
            "We provide career guidance, resume help, and interview preparation along with technical skills.",
            "The tech industry offers excellent career opportunities. Our courses prepare you for in-demand roles."
        ]
    },
    general: {
        keywords: ['help', 'info', 'about', 'kalvi360', 'platform'],
        responses: [
            "I'm Kalvi360 AI Assistant! I can help you with course information, career guidance, and learning paths.",
            "Kalvi360 offers expert-led online courses for skill development. What would you like to know?",
            "We're here to help you learn smarter and achieve your career goals. Ask me anything about our courses!"
        ]
    }
};

let chatOpen = false;

function toggleChatbot() {
    const container = document.getElementById('chat-container');
    const toggle = document.getElementById('chat-toggle');
    
    chatOpen = !chatOpen;
    container.classList.toggle('open', chatOpen);
    toggle.textContent = chatOpen ? '✕' : '💬';
    
    if (chatOpen && !document.querySelector('.bot-message')) {
        addBotMessage("Hi! I'm your Kalvi360 AI Assistant. Ask me about courses, career paths, or anything related to learning!");
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    setTimeout(() => {
        const response = generateAIResponse(message);
        addBotMessage(response);
    }, 500);
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addBotMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    for (const [category, data] of Object.entries(aiResponses)) {
        if (data.keywords.some(keyword => message.includes(keyword))) {
            return data.responses[Math.floor(Math.random() * data.responses.length)];
        }
    }
    
    // Default responses
    const defaultResponses = [
        "That's an interesting question! Could you be more specific about which course or topic you're interested in?",
        "I'd be happy to help! Try asking about our courses, pricing, or career opportunities.",
        "Let me help you find the right information. What specific aspect of learning are you curious about?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Course Learning Functions
function startLearning(courseId) {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
        document.getElementById('learning-course-title').textContent = course.title;
        closeSidebar();
        showPage('course-learning');
    }
}

// Sidebar Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

function updateSidebarUser() {
    if (currentUser) {
        const sidebarUsername = document.getElementById('sidebar-username');
        const sidebarRole = document.getElementById('sidebar-role');
        const sidebarAvatar = document.querySelector('.sidebar-avatar');
        
        sidebarUsername.textContent = currentUser.name;
        sidebarRole.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        
        if (currentUser.photo) {
            sidebarAvatar.style.backgroundImage = `url('${currentUser.photo}')`;
            sidebarAvatar.style.backgroundSize = 'cover';
            sidebarAvatar.textContent = '';
        } else {
            sidebarAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
    }
}