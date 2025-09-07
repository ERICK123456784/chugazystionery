// Admin-specific functionality
class AdminManager {
  constructor() {
    this.init();
  }

  init() {
    if (!auth.isAdmin()) {
      window.location.href = 'login.html';
      return;
    }
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.updateStats();
    this.loadRecentRequests();
    this.loadLowStockAlerts();
  }

  updateStats() {
    const users = auth.getUsers().filter(u => u.type === 'user');
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('pendingRequests').textContent = requests.filter(r => r.status === 'pending').length;
    document.getElementById('totalItems').textContent = inventory.length;
    document.getElementById('lowStock').textContent = inventory.filter(i => i.stock <= i.minStock).length;
  }

  loadRecentRequests() {
    const container = document.getElementById('recentRequests');
    if (!container) return;

    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const recent = requests.slice(-5).reverse();

    if (recent.length === 0) {
      container.innerHTML = '<p class="text-muted">No recent requests</p>';
      return;
    }

    container.innerHTML = recent.map(request => `
      <div class="flex-between" style="padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
        <div>
          <div style="font-weight: 500;">${request.itemName}</div>
          <div class="text-muted" style="font-size: 0.875rem;">${request.userName} • Qty: ${request.quantity}</div>
        </div>
        <span class="badge badge-${this.getStatusColor(request.status)}">${request.status}</span>
      </div>
    `).join('');
  }

  loadLowStockAlerts() {
    const container = document.getElementById('lowStockItems');
    if (!container) return;

    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const lowStock = inventory.filter(item => item.stock <= item.minStock);

    if (lowStock.length === 0) {
      container.innerHTML = '<p class="text-success">All items well stocked!</p>';
      return;
    }

    container.innerHTML = lowStock.map(item => `
      <div class="flex-between" style="padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
        <div>
          <div style="font-weight: 500;">${item.name}</div>
          <div class="text-muted" style="font-size: 0.875rem;">Stock: ${item.stock} | Min: ${item.minStock}</div>
        </div>
        <span class="badge badge-error">Low</span>
      </div>
    `).join('');
  }

  getStatusColor(status) {
    const colors = {
      'approved': 'success',
      'rejected': 'error',
      'pending': 'warning'
    };
    return colors[status] || 'info';
  }

  // Bulk operations
  bulkApproveRequests(requestIds) {
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    
    requestIds.forEach(id => {
      const index = requests.findIndex(r => r.id === id);
      if (index !== -1) {
        requests[index].status = 'approved';
        requests[index].updatedAt = new Date().toISOString();
      }
    });

    localStorage.setItem('requests', JSON.stringify(requests));
    this.loadDashboardData();
  }

  generateReport(type, dateRange) {
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const users = auth.getUsers().filter(u => u.type === 'user');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

    let reportData = {};

    switch (type) {
      case 'requests':
        reportData = this.generateRequestsReport(requests, dateRange);
        break;
      case 'inventory':
        reportData = this.generateInventoryReport(inventory);
        break;
      case 'users':
        reportData = this.generateUsersReport(users, requests);
        break;
    }

    return reportData;
  }

  generateRequestsReport(requests, dateRange) {
    const filtered = requests.filter(r => {
      const requestDate = new Date(r.requestDate);
      return requestDate >= dateRange.start && requestDate <= dateRange.end;
    });

    return {
      total: filtered.length,
      approved: filtered.filter(r => r.status === 'approved').length,
      pending: filtered.filter(r => r.status === 'pending').length,
      rejected: filtered.filter(r => r.status === 'rejected').length,
      byCategory: this.groupBy(filtered, 'category'),
      byUrgency: this.groupBy(filtered, 'urgency')
    };
  }

  generateInventoryReport(inventory) {
    return {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + (item.stock * item.price), 0),
      lowStockItems: inventory.filter(i => i.stock <= i.minStock).length,
      byCategory: this.groupBy(inventory, 'category'),
      averagePrice: inventory.reduce((sum, item) => sum + item.price, 0) / inventory.length
    };
  }

  generateUsersReport(users, requests) {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      byDepartment: this.groupBy(users, 'department'),
      requestsPerUser: requests.reduce((acc, req) => {
        acc[req.userId] = (acc[req.userId] || 0) + 1;
        return acc;
      }, {})
    };
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'Unknown';
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }
}

// Initialize admin manager if on admin pages
document.addEventListener('DOMContentLoaded', () => {
  const isAdminPage = window.location.pathname.includes('admin') || 
                     window.location.pathname.includes('inventory') ||
                     window.location.pathname.includes('requests') ||
                     window.location.pathname.includes('user-management');
  
  if (isAdminPage && auth.isAuthenticated() && auth.isAdmin()) {
    new AdminManager();
  }
});