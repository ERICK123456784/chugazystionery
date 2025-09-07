# CHUGAZY STATIONERY Management System

A modern, responsive web application for managing stationery requests and inventory in organizations.

## 🚀 Features

### User Features
- **User Registration & Authentication** - Secure account creation and login
- **Stationery Catalog** - Browse available items with search and filters
- **Request Management** - Submit and track stationery requests
- **Profile Management** - Update personal information and view activity
- **Dashboard** - Overview of requests and statistics

### Admin Features
- **Admin Dashboard** - Comprehensive overview with statistics
- **Inventory Management** - Add, edit, delete, and track stock levels
- **Request Processing** - Approve/reject user requests
- **User Management** - View and manage user accounts
- **Export Functionality** - Export data to CSV files

### Technical Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Theme toggle for user preference
- **Modern UI/UX** - Clean, professional interface with animations
- **Local Storage** - Client-side data persistence
- **Role-based Access** - Separate interfaces for users and admins

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Storage**: LocalStorage for demo purposes
- **Icons**: Unicode emojis for lightweight design
- **Fonts**: Inter font family

## 📁 Project Structure

```
stationary/
├── assets/
│   ├── css/
│   │   └── main.css          # Main stylesheet
│   ├── js/
│   │   ├── auth.js           # Authentication management
│   │   ├── app.js            # Main application logic
│   │   └── admin.js          # Admin-specific functionality
│   └── img/                  # Images directory
├── index.html                # Landing page
├── login.html                # Login page
├── register.html             # Registration page
├── forgot-password.html      # Password reset page
├── user-dashboard.html       # User dashboard
├── admin-dashboard.html      # Admin dashboard
├── catalog.html              # Stationery catalog
├── inventory.html            # Inventory management
├── requests.html             # Request management
├── user-management.html      # User management
├── profile.html              # User profile
├── 404.html                  # Error page
└── README.md                 # This file
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in a web browser
3. **Demo Credentials**:
   - **Admin**: admin@company.com / admin123
   - **User**: john@company.com / user123

## 👤 User Guide

### For Regular Users:
1. **Register** a new account or login with existing credentials
2. **Browse** the stationery catalog
3. **Submit** requests for needed items
4. **Track** request status in your dashboard
5. **Manage** your profile and view activity

### For Administrators:
1. **Login** with admin credentials
2. **Monitor** system overview in the dashboard
3. **Manage** inventory items and stock levels
4. **Process** user requests (approve/reject)
5. **Manage** user accounts and permissions
6. **Export** data for reporting

## 🎨 Design Features

- **Modern Color Palette** - Professional blue and gray tones
- **Responsive Grid System** - Adapts to all screen sizes
- **Card-based Layout** - Clean, organized content presentation
- **Smooth Animations** - Hover effects and transitions
- **Consistent Typography** - Inter font for readability
- **Accessible Design** - High contrast and clear navigation

## 🔧 Customization

### Colors
Edit CSS variables in `assets/css/main.css`:
```css
:root {
  --primary: #6366f1;
  --secondary: #f1f5f9;
  --accent: #06b6d4;
  /* ... more variables */
}
```

### Branding
- Update the brand name in navigation bars
- Replace favicon in HTML head sections
- Modify hero section content

### Features
- Add new inventory categories in form selects
- Customize user departments
- Extend request urgency levels

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔒 Security Notes

This is a demo application using client-side storage. For production use:
- Implement server-side authentication
- Use secure password hashing
- Add input validation and sanitization
- Implement proper session management
- Use HTTPS for all communications

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Developer

**ORRESY THE DESIGNER**
- Modern web application design and development
- Responsive UI/UX implementation
- Full-stack development capabilities

---

© 2025 CHUGAZY STATIONERY Management System. Built with modern web technologies.