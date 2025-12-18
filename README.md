# 🌟 YeDire Firewoch Charity Organization

<div align="center">

![YeDire Firewoch Logo](frontend/src/assets/images/lg.png)

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

## 🏗️ Project Structure

```
yedireFirewoch/
├── 🎨 frontend/                # Main React + TypeScript frontend
│   ├── public/                # Static assets
│   └── src/                   # Source code
│       ├── assets/            # Images, fonts, etc.
│       ├── components/        # Reusable UI components
│       ├── context/           # React context providers
│       └── pages/             # Application pages
│
├── 👨‍💼 frontend_admin/         # Admin dashboard frontend
│   ├── public/                # Static assets
│   └── src/                   # Admin panel source code
│       ├── assets/            # Admin-specific assets
│       ├── components/        # Admin UI components
│       └── context/           # Admin context providers
│
├── ⚙️ backend/                 # Express.js + MySQL backend
│   ├── config/               # Configuration files
│   ├── controllers/          # API route handlers
│   ├── imports/              # Data import scripts
│   ├── middleware/           # Authentication & validation
│   ├── models/               # Database models
│   ├── routes/               # API endpoints
│   ├── scripts/              # Utility scripts
│   ├── uploads/              # File storage
│   ├── utils/                # Helper functions
│   ├── .env                  # Environment variables
│   ├── server.js             # Main server file
│   └── test-image-system.js  # Image system testing
│
├── 📚 docs/                   # Documentation
│   ├── IMAGE_SYSTEM_GUIDE.md # Image handling documentation
│   └── MIGRATION_GUIDE.md    # Database migration guide
│
├── 📊 database/               # Database related files
│   └── yedire_frewoch.sql   # Database schema and seed data
│
├── 📝 admindesign.txt         # Admin design specifications
├── package.json              # Project dependencies
└── README.md                 # This file
```

---

## 🛠️ Technology Stack

### Frontend Technologies (Main Application)
- **React 19.0.0** - Modern UI library
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Vite 6.2.0** - Fast build tool and dev server
- **React Router 7.5.0** - Client-side routing
- **Bootstrap 5.3.5** - CSS framework
- **React CountUp 6.5.3** - Animated number counters
- **FontAwesome 6.7.2** - Icon library
- **Axios 1.11.0** - HTTP client

### Admin Dashboard Technologies
- **React** - Frontend library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Custom Hooks** - Reusable logic

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

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager
- **Git** (for version control)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/CRXNCM/yedireFirewoch.git
   cd yedireFirewoch
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.template .env  # Update with your configuration
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Admin Dashboard Setup**
   ```bash
   is just testing the design of the admin dashboard it is not complete still in development.
   ```

5. **Start Development Servers**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

---

## 📚 Documentation

### Available Documentation
- [Image System Guide](./IMAGE_SYSTEM_GUIDE.md) - Comprehensive guide to the image handling system
- [Migration Guide](./MIGRATION_GUIDE.md) - Instructions for database migrations
- [Admin Design Specifications](./admindesign.txt) - Detailed admin interface specifications

### Database
- The database schema and initial data can be found in `yedire_frewoch.sql`
- Database models are defined in `backend/models/`
- Data import scripts are located in `backend/imports/`

### API
- API endpoints are defined in `backend/routes/`
- Controllers are in `backend/controllers/`
- Test the API using the provided Postman collection: `backend/postman_collection.json`

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
- **Email**: yedirefrewoch@gmail.com
- **Phone**: +251-925-254-765
- **Address**: Dire Dawa, Ethiopia

### Support the Cause
- 💰 **Donate** to support our programs
- 🤝 **Volunteer** your time and skills
- 📢 **Share** our mission with others
- 🌟 **Partner** with us for greater impact

---

<div align="center">

**Made with ❤️ for the children and communities of Ethiopia**
- **Devloped by DDAC - DDU SOFTWARE ENINGEERING INTERN TEAM**
*YeDire Firewoch - One for Another*

</div>