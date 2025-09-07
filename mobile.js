// Mobile App Features and Interactions
class MobileApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileNavigation();
    this.setupTouchInteractions();
    this.setupPullToRefresh();
    this.setupBottomNavigation();
    this.setupMobileModals();
    this.setupToastNotifications();
    this.detectMobile();
  }

  // Mobile Navigation
  setupMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
        }
      });
    }
  }

  // Touch Interactions
  setupTouchInteractions() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .mobile-btn, .card');
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', () => {
        btn.style.transform = 'scale(0.98)';
      });

      btn.addEventListener('touchend', () => {
        setTimeout(() => {
          btn.style.transform = '';
        }, 100);
      });
    });

    // Swipe gestures for cards
    this.setupSwipeGestures();
  }

  // Swipe Gestures
  setupSwipeGestures() {
    const swipeItems = document.querySelectorAll('.mobile-swipe-item');
    
    swipeItems.forEach(item => {
      let startX = 0;
      let currentX = 0;
      let isSwipping = false;

      item.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwipping = true;
      });

      item.addEventListener('touchmove', (e) => {
        if (!isSwipping) return;
        currentX = e.touches[0].clientX;
        const diffX = startX - currentX;

        if (diffX > 50) {
          item.classList.add('swiped');
        } else {
          item.classList.remove('swiped');
        }
      });

      item.addEventListener('touchend', () => {
        isSwipping = false;
      });
    });
  }

  // Pull to Refresh
  setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    const refreshIndicator = document.querySelector('.mobile-refresh-indicator');
    const pullContainer = document.querySelector('.mobile-pull-refresh');

    if (!pullContainer) return;

    pullContainer.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });

    pullContainer.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      if (pullDistance > 0 && pullDistance < 100) {
        e.preventDefault();
        if (refreshIndicator) {
          refreshIndicator.style.opacity = pullDistance / 100;
          refreshIndicator.style.top = `${pullDistance - 40}px`;
        }
      }

      if (pullDistance >= 100) {
        if (refreshIndicator) {
          refreshIndicator.classList.add('active');
        }
        this.triggerRefresh();
      }
    });

    pullContainer.addEventListener('touchend', () => {
      isPulling = false;
      if (refreshIndicator) {
        refreshIndicator.style.opacity = 0;
        refreshIndicator.style.top = '-50px';
        refreshIndicator.classList.remove('active');
      }
    });
  }

  // Trigger Refresh
  triggerRefresh() {
    // Simulate refresh
    setTimeout(() => {
      if (typeof loadData === 'function') {
        loadData();
      }
      this.showToast('Data refreshed!', 'success');
    }, 1000);
  }

  // Bottom Navigation
  setupBottomNavigation() {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const currentPage = window.location.pathname.split('/').pop();

    bottomNavItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && href.includes(currentPage)) {
        item.classList.add('active');
      }

      item.addEventListener('click', (e) => {
        bottomNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  // Mobile Modals
  setupMobileModals() {
    const modalTriggers = document.querySelectorAll('[data-mobile-modal]');
    const modals = document.querySelectorAll('.mobile-modal');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-mobile-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          this.openMobileModal(modal);
        }
      });
    });

    modals.forEach(modal => {
      const closeBtn = modal.querySelector('.mobile-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeMobileModal(modal);
        });
      }

      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeMobileModal(modal);
        }
      });
    });
  }

  openMobileModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMobileModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toast Notifications
  setupToastNotifications() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'mobile-toast-container';
    document.body.appendChild(this.toastContainer);
  }

  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `mobile-toast mobile-toast-${type}`;
    toast.textContent = message;

    this.toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    // Remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // Detect Mobile Device
  detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;

    if (isMobile || isTouch) {
      document.body.classList.add('mobile-device');
      this.enableMobileFeatures();
    }
  }

  // Enable Mobile Features
  enableMobileFeatures() {
    // Add mobile-specific classes
    document.body.classList.add('mobile-optimized');

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Add haptic feedback simulation
    this.addHapticFeedback();
  }

  // Haptic Feedback Simulation
  addHapticFeedback() {
    const hapticElements = document.querySelectorAll('.btn, .mobile-btn, .bottom-nav-item');
    
    hapticElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        // Simulate haptic feedback with vibration API
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      });
    });
  }

  // Loading States
  showLoading(element) {
    const loader = document.createElement('div');
    loader.className = 'mobile-loading';
    loader.innerHTML = '<div class="mobile-spinner"></div>';
    
    element.appendChild(loader);
    return loader;
  }

  hideLoading(loader) {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  // Smooth Scrolling
  smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Status Bar
  updateStatusBar(progress) {
    let statusBar = document.querySelector('.mobile-status-bar');
    if (!statusBar) {
      statusBar = document.createElement('div');
      statusBar.className = 'mobile-status-bar';
      document.body.appendChild(statusBar);
    }
    
    statusBar.style.width = `${progress}%`;
    
    if (progress >= 100) {
      setTimeout(() => {
        statusBar.style.width = '0%';
      }, 500);
    }
  }

  // Network Status
  checkNetworkStatus() {
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        this.showToast('Back online!', 'success');
      } else {
        this.showToast('No internet connection', 'error');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  // App Install Prompt
  setupInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button
      const installBtn = document.createElement('button');
      installBtn.className = 'mobile-install-btn';
      installBtn.textContent = 'Install App';
      installBtn.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.showToast('App installed!', 'success');
          }
          deferredPrompt = null;
        });
      });
      
      document.body.appendChild(installBtn);
    });
  }
}

// Initialize Mobile App
const mobileApp = new MobileApp();

// Export for global use
window.mobileApp = mobileApp;