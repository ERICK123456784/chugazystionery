// Authentication and Session Management
class AuthManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  init() {
    // Check authentication on page load
    this.checkAuth();
    
    // Set up logout handlers
    document.addEventListener('DOMContentLoaded', () => {
      const logoutBtns = document.querySelectorAll('[data-logout]');
      logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      });
    });
  }

  // Login user
  login(email, password, userType = 'user') {
    // Simulate authentication (replace with actual API call)
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password && u.type === userType);
    
    if (user) {
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(sessionData));
      this.currentUser = sessionData;
      
      // Redirect based on user type
      if (user.type === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
      
      return { success: true, user: sessionData };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  }

  // Register new user
  register(userData) {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, hash this
      type: 'user',
      department: userData.department || '',
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Registration successful' };
  }

  // Logout user
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    window.location.href = 'index.html';
  }

  // Get current user
  getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Check if user is admin
  isAdmin() {
    return this.currentUser && this.currentUser.type === 'admin';
  }

  // Check authentication and redirect if needed
  checkAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['index.html', 'login.html', 'register.html', 'forgot-password.html', '404.html', ''];
    const adminPages = ['admin-dashboard.html', 'inventory.html', 'user-management.html', 'requests.html'];
    const userPages = ['user-dashboard.html', 'catalog.html', 'profile.html'];

    if (!publicPages.includes(currentPage)) {
      if (!this.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
      }

      if (adminPages.includes(currentPage) && !this.isAdmin()) {
        window.location.href = 'user-dashboard.html';
        return;
      }

      if (userPages.includes(currentPage) && this.isAdmin()) {
        window.location.href = 'admin-dashboard.html';
        return;
      }
    }
  }

  // Get all users (for demo purposes)
  getUsers() {
    const defaultUsers = [
      {
        id: '1',
        name: 'ORRESY THE DESIGNER',
        email: 'admin@chugazystationery.com',
        password: 'admin123',
        type: 'admin',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: '2',
        name: 'John Doe',
        email: 'john@company.com',
        password: 'user123',
        type: 'user',
        department: 'IT',
        phone: '+1234567890',
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    const users = localStorage.getItem('users');
    if (!users) {
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(users);
  }

  // Reset password (demo implementation)
  resetPassword(email) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      // In real app, send email with reset link
      console.log(`Password reset link sent to ${email}`);
      return { success: true, message: 'Password reset link sent to your email' };
    } else {
      return { success: false, message: 'Email not found' };
    }
  }

  // Update user profile
  updateProfile(userData) {
    if (!this.isAuthenticated()) return { success: false, message: 'Not authenticated' };

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current session
      this.currentUser = { ...this.currentUser, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      return { success: true, message: 'Profile updated successfully' };
    }
    
    return { success: false, message: 'User not found' };
  }
}

// Initialize auth manager
const auth = new AuthManager();