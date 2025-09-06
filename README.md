# 🌟 YeDire Firewoch Charity Organization

<div align="center">

![YeDire Firewoch Logo](frontend/src/assets/images/logo.png)

**"One for Another" - Making a Difference in Ethiopia**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-orange.svg)](https://mysql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)

</div>

---

## 📖 About YeDire Firewoch

**YeDire Firewoch** (የድሬ ፋይርዎች) is a nonprofit charitable development organization dedicated to transforming the lives of children, families, and communities across Ethiopia. The name translates to **"One for Another"** in Amharic, reflecting our core mission of mutual support and community development.

### 🎯 Our Mission
- **Education**: Providing access to quality education and school infrastructure
- **Health**: Supporting health initiatives and community wellness programs  
- **Social Development**: Building sustainable communities through volunteer networks
- **Partnership**: Collaborating with local schools, volunteers, and sponsors for maximum impact

---

## 🚀 Project Overview

This repository contains a comprehensive full-stack web application designed to showcase YeDire Firewoch's impact and manage organizational operations. The platform features a modern, responsive frontend and a robust backend API system.

### ✨ Key Features

- 🏠 **Dynamic Homepage** with animated statistics and interactive galleries
- 👥 **Admin Dashboard** for comprehensive content management
- 🏫 **School Management** system with image galleries
- 🤝 **Volunteer & Sponsor** management platforms
- 📸 **Image Upload & Management** with optimization
- 📱 **Fully Responsive** design for all devices
- 🔐 **Secure Authentication** with JWT tokens
- 📊 **Real-time Statistics** with animated counters

---

## 🏗️ Architecture

```
yedireFirewoch/
├── 🎨 frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── styles/       # CSS styling
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── ⚙️ backend/           # Express.js + MySQL backend
│   ├── controllers/      # API route handlers
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication & validation
│   └── uploads/         # File storage
└── 📚 docs/             # Documentation
```

---

## 🛠️ Technology Stack

### Frontend Technologies
- **React 19.0.0** - Modern UI library
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Vite 6.2.0** - Fast build tool and dev server
- **React Router 7.5.0** - Client-side routing
- **Bootstrap 5.3.5** - CSS framework
- **React CountUp 6.5.3** - Animated number counters
- **FontAwesome 6.7.2** - Icon library
- **Axios 1.11.0** - HTTP client

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **MySQL 3.6.5** - Relational database
- **Sequelize 6.35.0** - ORM for database operations
- **JWT 9.0.2** - Authentication tokens
- **Multer 1.4.5** - File upload handling
- **Sharp 0.32.6** - Image processing
- **bcryptjs 2.4.3** - Password hashing

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/yedire-firewoch.git
cd yedire-firewoch
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.template .env

# Configure your .env file with:
# - Database credentials
# - JWT secret key
# - Server port

# Setup database and create admin user
npm run setup-admin
npm run create-default-admin

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

---

## 📋 Environment Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=yedire_firewoch

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

---

## 🎯 Features & Functionality

### 🏠 Public Website
- **Hero Section** with compelling call-to-action
- **Impact Statistics** with animated counters
- **Image Gallery** showcasing organization activities
- **Testimonials** from beneficiaries and partners
- **Sponsor Carousel** with auto-scroll functionality
- **Contact Information** and donation links

### 🔐 Admin Dashboard
- **Dashboard Overview** with key metrics
- **School Management** - Add, edit, and manage schools
- **Volunteer Management** - Track volunteer information
- **Sponsor Management** - Manage partner organizations
- **Gallery Management** - Upload and organize images
- **Testimonial Management** - Manage success stories
- **Alert System** - Send urgent messages
- **Community Management** - Track community programs

### 📊 Data Management
- **MySQL Database** with structured schemas
- **Image Optimization** with Sharp processing
- **File Upload** with validation and security
- **Data Import/Export** capabilities
- **Backup and Recovery** scripts

---

## 🗄️ Database Schema

The application uses MySQL with the following main entities:

- **Schools** - Educational institutions and their details
- **Volunteers** - Individual volunteer information
- **Sponsors** - Partner organizations and companies
- **Communities** - Community programs and locations
- **Testimonials** - Success stories and feedback
- **Images** - Gallery and school images
- **Admins** - System administrators
- **Urgent Messages** - Alert system

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads correctly with all sections
- [ ] Responsive design works on mobile and desktop
- [ ] Admin authentication and authorization
- [ ] CRUD operations for all entities
- [ ] Image upload and display functionality
- [ ] API endpoints return correct responses
- [ ] Error handling and validation

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

---

## 📦 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

### Environment Setup
1. Configure production database
2. Set up file storage (AWS S3, etc.)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure monitoring and logging

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 **Bug Reports** - Report issues and bugs
- 💡 **Feature Requests** - Suggest new features
- 🔧 **Code Contributions** - Submit pull requests
- 📖 **Documentation** - Improve documentation
- 🧪 **Testing** - Help with testing and QA

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow existing code style and patterns
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Volunteers** who dedicate their time and energy
- **Sponsors** who provide financial and material support
- **Communities** who trust us with their development
- **Open Source Community** for the amazing tools and libraries

---

## 📞 Contact & Support

### Get in Touch
- **Website**: [www.yedirefirewoch.org](https://www.yedirefirewoch.org)
- **Email**: info@yedirefirewoch.org
- **Phone**: +251-XX-XXX-XXXX
- **Address**: Dire Dawa, Ethiopia

### Support the Cause
- 💰 **Donate** to support our programs
- 🤝 **Volunteer** your time and skills
- 📢 **Share** our mission with others
- 🌟 **Partner** with us for greater impact

---

<div align="center">

**Made with ❤️ for the children and communities of Ethiopia**

*YeDire Firewoch - One for Another*

</div>