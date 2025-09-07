// Main Application JavaScript
class StationeryApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupModals();
    this.setupForms();
    this.setupNotifications();
    this.loadUserData();
  }

  // Theme Management
  setupThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }
  }

  // Modal Management
  setupModals() {
    // Open modals
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-target]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-target');
        this.openModal(modalId);
      }
    });

    // Close modals
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
        this.closeModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Form Management
  setupForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(e.target);
      });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister(e.target);
      });
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleForgotPassword(e.target);
      });
    }

    // Request form
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
      requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleItemRequest(e.target);
      });
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProfileUpdate(e.target);
      });
    }
  }

  // Handle login
  handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const userType = formData.get('userType') || 'user';

    const result = auth.login(email, password, userType);
    
    if (result.success) {
      this.showNotification('Login successful!', 'success');
    } else {
      this.showNotification(result.message, 'error');
    }
  }

  // Handle registration
  handleRegister(form) {
    const formData = new FormData(form);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      department: formData.get('department'),
      phone: formData.get('phone')
    };

    // Validate password confirmation
    const confirmPassword = formData.get('confirmPassword');
    if (userData.password !== confirmPassword) {
      this.showNotification('Passwords do not match', 'error');
      return;
    }

    const result = auth.register(userData);
    
    if (result.success) {
      this.showNotification('Registration successful! Please login.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      this.showNotification(result.message, 'error');
    }
  }

  // Handle forgot password
  handleForgotPassword(form) {
    const formData = new FormData(form);
    const email = formData.get('email');

    const result = auth.resetPassword(email);
    this.showNotification(result.message, result.success ? 'success' : 'error');
  }

  // Handle item request
  handleItemRequest(form) {
    if (!auth.isAuthenticated()) {
      this.showNotification('Please login to make requests', 'error');
      return;
    }

    const formData = new FormData(form);
    const requestData = {
      id: Date.now().toString(),
      userId: auth.currentUser.id,
      userName: auth.currentUser.name,
      itemName: formData.get('itemName'),
      category: formData.get('category'),
      quantity: parseInt(formData.get('quantity')),
      urgency: formData.get('urgency'),
      description: formData.get('description'),
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    // Save request
    const requests = this.getRequests();
    requests.push(requestData);
    localStorage.setItem('requests', JSON.stringify(requests));

    this.showNotification('Request submitted successfully!', 'success');
    form.reset();
    this.closeModal();
    
    // Refresh requests if on dashboard
    this.loadUserRequests();
  }

  // Handle profile update
  handleProfileUpdate(form) {
    const formData = new FormData(form);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      department: formData.get('department'),
      phone: formData.get('phone')
    };

    const result = auth.updateProfile(userData);
    this.showNotification(result.message, result.success ? 'success' : 'error');
    
    if (result.success) {
      this.loadUserData();
    }
  }

  // Notification system
  setupNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notifications')) {
      const container = document.createElement('div');
      container.id = 'notifications';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    
    notification.className = `alert alert-${type} fade-in`;
    notification.style.cssText = `
      margin-bottom: 10px;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Load user data into UI
  loadUserData() {
    if (!auth.isAuthenticated()) return;

    const user = auth.currentUser;
    
    // Update user name displays
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
      el.textContent = user.name;
    });

    // Update user email displays
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(el => {
      el.textContent = user.email;
    });

    // Load profile form data
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.querySelector('[name="name"]').value = user.name || '';
      profileForm.querySelector('[name="email"]').value = user.email || '';
      profileForm.querySelector('[name="department"]').value = user.department || '';
      profileForm.querySelector('[name="phone"]').value = user.phone || '';
    }

    // Load dashboard data
    this.loadDashboardStats();
    this.loadUserRequests();
  }

  // Load dashboard statistics
  loadDashboardStats() {
    if (auth.isAdmin()) {
      this.loadAdminStats();
    } else {
      this.loadUserStats();
    }
  }

  loadAdminStats() {
    const users = auth.getUsers().filter(u => u.type === 'user');
    const requests = this.getRequests();
    const inventory = this.getInventory();

    // Update stat cards
    this.updateStatCard('totalUsers', users.length);
    this.updateStatCard('pendingRequests', requests.filter(r => r.status === 'pending').length);
    this.updateStatCard('totalItems', inventory.length);
    this.updateStatCard('lowStock', inventory.filter(i => i.stock <= i.minStock).length);
  }

  loadUserStats() {
    const requests = this.getRequests().filter(r => r.userId === auth.currentUser.id);
    
    this.updateStatCard('totalRequests', requests.length);
    this.updateStatCard('pendingRequests', requests.filter(r => r.status === 'pending').length);
    this.updateStatCard('approvedRequests', requests.filter(r => r.status === 'approved').length);
    this.updateStatCard('rejectedRequests', requests.filter(r => r.status === 'rejected').length);
  }

  updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  // Load user requests
  loadUserRequests() {
    const requestsContainer = document.getElementById('userRequests');
    if (!requestsContainer) return;

    const requests = this.getRequests().filter(r => r.userId === auth.currentUser.id);
    
    if (requests.length === 0) {
      requestsContainer.innerHTML = '<p class="text-muted">No requests found.</p>';
      return;
    }

    const html = requests.map(request => `
      <div class="card">
        <div class="flex-between">
          <div>
            <h4>${request.itemName}</h4>
            <p class="text-muted mb-sm">Quantity: ${request.quantity} | Category: ${request.category}</p>
            <p class="text-muted mb-0">Requested: ${new Date(request.requestDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span class="badge badge-${this.getStatusColor(request.status)}">${request.status}</span>
          </div>
        </div>
      </div>
    `).join('');

    requestsContainer.innerHTML = html;
  }

  getStatusColor(status) {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'info';
    }
  }

  // Data management
  getRequests() {
    const requests = localStorage.getItem('requests');
    return requests ? JSON.parse(requests) : [];
  }

  getInventory() {
    const defaultInventory = [
      { id: '1', name: 'A4 Paper', category: 'Paper', stock: 50, minStock: 20, price: 15000 },
      { id: '2', name: 'Blue Pens', category: 'Writing', stock: 15, minStock: 25, price: 5000 },
      { id: '3', name: 'Stapler', category: 'Office Tools', stock: 8, minStock: 5, price: 32000 },
      { id: '4', name: 'Notebooks', category: 'Paper', stock: 30, minStock: 15, price: 10000 },
      { id: '5', name: 'Markers', category: 'Writing', stock: 22, minStock: 10, price: 22000 }
    ];

    const inventory = localStorage.getItem('inventory');
    if (!inventory) {
      localStorage.setItem('inventory', JSON.stringify(defaultInventory));
      return defaultInventory;
    }
    return JSON.parse(inventory);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new StationeryApp();
});