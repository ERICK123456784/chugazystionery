// Advanced Notification System
class NotificationManager {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    this.init();
  }

  init() {
    this.createNotificationContainer();
    this.setupNotificationBell();
    this.checkLowStock();
    this.checkPendingRequests();
  }

  createNotificationContainer() {
    if (!document.getElementById('notificationContainer')) {
      const container = document.createElement('div');
      container.id = 'notificationContainer';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  }

  setupNotificationBell() {
    const bell = document.querySelector('[data-notification-bell]');
    if (bell) {
      const unreadCount = this.notifications.filter(n => !n.read).length;
      if (unreadCount > 0) {
        bell.innerHTML = `🔔 <span class="notification-badge">${unreadCount}</span>`;
      }
      
      bell.addEventListener('click', () => this.showNotificationPanel());
    }
  }

  showNotificationPanel() {
    const panel = document.createElement('div');
    panel.className = 'notification-panel';
    panel.innerHTML = `
      <div class="notification-header">
        <h3>Notifications</h3>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="notification-list">
        ${this.notifications.slice(-10).reverse().map(n => `
          <div class="notification-item ${n.read ? '' : 'unread'}" onclick="notificationManager.markAsRead('${n.id}')">
            <div class="notification-icon ${n.type}">${this.getNotificationIcon(n.type)}</div>
            <div class="notification-content">
              <div class="notification-title">${n.title}</div>
              <div class="notification-message">${n.message}</div>
              <div class="notification-time">${this.formatTime(n.timestamp)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="notification-footer">
        <button onclick="notificationManager.markAllAsRead()" class="btn btn-sm btn-outline">Mark All Read</button>
        <button onclick="notificationManager.clearAll()" class="btn btn-sm btn-error">Clear All</button>
      </div>
    `;
    
    document.body.appendChild(panel);
    setTimeout(() => panel.classList.add('active'), 10);
  }

  addNotification(title, message, type = 'info', actionUrl = null) {
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      actionUrl,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    
    this.showToastNotification(notification);
    this.setupNotificationBell();
    
    // Send email notification if enabled
    this.sendEmailNotification(notification);
  }

  showToastNotification(notification) {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${notification.type}`;
    toast.innerHTML = `
      <div class="toast-icon">${this.getNotificationIcon(notification.type)}</div>
      <div class="toast-content">
        <div class="toast-title">${notification.title}</div>
        <div class="toast-message">${notification.message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    const container = document.getElementById('notificationContainer');
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      inventory: '📦',
      request: '📋',
      approval: '✔️',
      system: '⚙️'
    };
    return icons[type] || icons.info;
  }

  formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return time.toLocaleDateString();
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
      this.setupNotificationBell();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    this.setupNotificationBell();
    document.querySelector('.notification-panel')?.remove();
  }

  clearAll() {
    this.notifications = [];
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    this.setupNotificationBell();
    document.querySelector('.notification-panel')?.remove();
  }

  checkLowStock() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const lowStockItems = inventory.filter(item => item.stock <= item.minStock);
    
    lowStockItems.forEach(item => {
      const existingNotification = this.notifications.find(n => 
        n.type === 'inventory' && n.message.includes(item.name) && !n.read
      );
      
      if (!existingNotification) {
        this.addNotification(
          'Low Stock Alert',
          `${item.name} is running low (${item.stock} remaining)`,
          'warning'
        );
      }
    });
  }

  checkPendingRequests() {
    if (!auth.isAdmin()) return;
    
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const pendingRequests = requests.filter(r => r.status === 'pending');
    
    if (pendingRequests.length > 0) {
      const existingNotification = this.notifications.find(n => 
        n.type === 'request' && n.title === 'Pending Requests' && !n.read
      );
      
      if (!existingNotification) {
        this.addNotification(
          'Pending Requests',
          `You have ${pendingRequests.length} pending requests to review`,
          'info',
          'requests.html'
        );
      }
    }
  }

  sendEmailNotification(notification) {
    // Simulate email sending (in real app, this would call an API)
    if (this.isEmailEnabled()) {
      console.log(`Email sent: ${notification.title} - ${notification.message}`);
    }
  }

  isEmailEnabled() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    return settings.emailNotifications !== false;
  }

  // Real-time notifications via WebSocket (simulation)
  setupRealTimeNotifications() {
    // Simulate real-time updates
    setInterval(() => {
      this.checkLowStock();
      this.checkPendingRequests();
    }, 30000); // Check every 30 seconds
  }
}

// CSS for notifications
const notificationCSS = `
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-notification {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 300px;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  pointer-events: all;
  border-left: 4px solid var(--primary);
}

.toast-notification.show {
  transform: translateX(0);
}

.toast-notification.toast-success { border-left-color: var(--success); }
.toast-notification.toast-warning { border-left-color: var(--warning); }
.toast-notification.toast-error { border-left-color: var(--error); }

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.toast-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.notification-panel {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  z-index: 9999;
  transform: translateY(-10px);
  opacity: 0;
  transition: all 0.3s ease;
}

.notification-panel.active {
  transform: translateY(0);
  opacity: 1;
}

.notification-header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-item {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: var(--space-sm);
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: var(--bg-secondary);
}

.notification-item.unread {
  background: rgba(99, 102, 241, 0.05);
  border-left: 3px solid var(--primary);
}

.notification-icon {
  font-size: 1.25rem;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.notification-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.notification-footer {
  padding: var(--space-md);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--space-sm);
}

.notification-badge {
  background: var(--error);
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  position: absolute;
  top: -5px;
  right: -5px;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Initialize notification manager
const notificationManager = new NotificationManager();