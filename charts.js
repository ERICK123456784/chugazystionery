// Chart.js Integration for Dashboard Analytics
class ChartManager {
  constructor() {
    this.charts = {};
    this.init();
  }

  init() {
    this.loadChartLibrary();
  }

  loadChartLibrary() {
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.initializeCharts();
      document.head.appendChild(script);
    } else {
      this.initializeCharts();
    }
  }

  initializeCharts() {
    this.createInventoryChart();
    this.createRequestsChart();
    this.createCategoryChart();
    this.createTrendChart();
  }

  createInventoryChart() {
    const ctx = document.getElementById('inventoryChart');
    if (!ctx) return;

    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const lowStock = inventory.filter(i => i.stock <= i.minStock).length;
    const normalStock = inventory.filter(i => i.stock > i.minStock && i.stock <= i.minStock * 2).length;
    const highStock = inventory.filter(i => i.stock > i.minStock * 2).length;

    this.charts.inventory = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Low Stock', 'Normal Stock', 'High Stock'],
        datasets: [{
          data: [lowStock, normalStock, highStock],
          backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  createRequestsChart() {
    const ctx = document.getElementById('requestsChart');
    if (!ctx) return;

    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyRequests = last7Days.map(date => 
      requests.filter(r => r.requestDate.split('T')[0] === date).length
    );

    this.charts.requests = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(date => new Date(date).toLocaleDateString()),
        datasets: [{
          label: 'Daily Requests',
          data: dailyRequests,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  createCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const categories = {};
    requests.forEach(r => {
      categories[r.category] = (categories[r.category] || 0) + 1;
    });

    this.charts.category = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(categories),
        datasets: [{
          label: 'Requests by Category',
          data: Object.values(categories),
          backgroundColor: '#06b6d4',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  createTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const months = Array.from({length: 6}, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7);
    }).reverse();

    const monthlyData = months.map(month => ({
      month,
      approved: requests.filter(r => r.requestDate.slice(0, 7) === month && r.status === 'approved').length,
      pending: requests.filter(r => r.requestDate.slice(0, 7) === month && r.status === 'pending').length,
      rejected: requests.filter(r => r.requestDate.slice(0, 7) === month && r.status === 'rejected').length
    }));

    this.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months.map(m => new Date(m).toLocaleDateString('en', {month: 'short', year: '2-digit'})),
        datasets: [
          {
            label: 'Approved',
            data: monthlyData.map(d => d.approved),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          },
          {
            label: 'Pending',
            data: monthlyData.map(d => d.pending),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)'
          },
          {
            label: 'Rejected',
            data: monthlyData.map(d => d.rejected),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { intersect: false },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  updateCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.initializeCharts();
  }
}

const chartManager = new ChartManager();