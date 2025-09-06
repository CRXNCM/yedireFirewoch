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

## 🗄️ Database Setup

### Database Requirements
- **MySQL** 8.0 or higher (or MariaDB 10.4+)
- **Database Name**: `yedire_frewoch`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_general_ci`

### Quick Database Setup

#### Option 1: XAMPP Setup (Recommended for Windows)
1. **Install XAMPP**
   - Download from [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - Install and start Apache and MySQL services

2. **Access phpMyAdmin**
   - Open browser and go to `http://localhost/phpmyadmin`
   - Click "New" to create a new database

3. **Create Database**
   ```sql
   -- Database name: yedire_frewoch
   -- Collation: utf8mb4_general_ci
   ```

4. **Import SQL File**
   - Select the `yedire_frewoch` database
   - Click "Import" tab
   - Choose file: `yedire_frewoch.sql`
   - Click "Go" to import

5. **Verify Import**
   - Check that all tables are created
   - Verify sample data is loaded

#### Option 2: Command Line (MySQL/MariaDB)
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE yedire_frewoch CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Import the complete database structure and data
mysql -u root -p yedire_frewoch < yedire_frewoch.sql
```

#### Option 3: Manual SQL Setup
```sql
-- Create database
CREATE DATABASE yedire_frewoch CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE yedire_frewoch;

-- Import the provided SQL file
SOURCE yedire_frewoch.sql;
```

### Database Schema Overview

The application uses MySQL with the following main entities:

#### Core Tables
- **`admins`** - System administrators with role-based access
- **`schools`** - Educational institutions and their details
- **`school_images`** - Image galleries for each school
- **`volunteers`** - Individual volunteer information
- **`sponsors`** - Partner organizations and companies
- **`communities`** - Community programs and locations
- **`testimonials`** - Success stories and feedback
- **`urgent_messages`** - Alert system for urgent communications

#### Supporting Tables
- **`bank_info`** - Banking information for donations
- **`social_links`** - Social media platform links
- **`footer_links`** - Navigation links for website footer
- **`donations`** - Donation tracking (structure ready)
- **`test_crud`** - Testing table for CRUD operations

### Database Configuration

#### Environment Variables
Update your `.env` file with the correct database credentials:

**For XAMPP (Default Configuration):**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=yedire_frewoch
DB_PORT=3306
```

**For Custom MySQL Installation:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=yedire_frewoch
DB_PORT=3306
```

#### Default Admin Account
The database comes with a default admin account:
- **Username**: `admin`
- **Email**: `admin@gmail.com`
- **Password**: Use the setup script to create a secure password

### Database Features

#### Data Integrity
- **Foreign Key Constraints** - Ensures data consistency
- **Unique Constraints** - Prevents duplicate entries
- **Auto-increment IDs** - Automatic primary key generation
- **Cascade Deletes** - Maintains referential integrity

#### Sample Data
The database includes:
- **18 Schools** across Dire Dawa region
- **4 Communities** (Somali, Oromo, Amhara, Harari)
- **4 Volunteers** including MM Hotel and Watch & Pray
- **2 Sponsors** with logos and website links
- **3 Testimonials** from beneficiaries
- **4 Social Media Links** (Facebook, Telegram, TikTok, YouTube)
- **3 Bank Accounts** (eBirr, Berhan Bank, CBE)

#### Image Management
- **School Images** - Multiple images per school with metadata
- **Bank Logos** - Visual representation of banking partners
- **Testimonial Photos** - User profile images
- **Urgent Message Images** - Visual alerts and announcements

### Database Maintenance

#### Backup
```bash
# Create database backup
mysqldump -u root -p yedire_frewoch > yedire_frewoch_backup_$(date +%Y%m%d).sql
```

#### Restore
```bash
# Restore from backup
mysql -u root -p yedire_frewoch < yedire_frewoch_backup_20250106.sql
```

#### Performance Optimization
- **Indexes** - Optimized for common queries
- **Character Set** - UTF8MB4 for full Unicode support
- **Engine** - InnoDB for ACID compliance and foreign keys

### XAMPP Troubleshooting

#### Common Issues and Solutions

**1. MySQL Service Won't Start**
- Check if port 3306 is already in use
- Run XAMPP as Administrator
- Check Windows Firewall settings

**2. phpMyAdmin Access Denied**
- Default XAMPP MySQL has no password
- Use `root` as username with empty password
- If you set a password, update your `.env` file accordingly

**3. Import File Too Large**
- Increase `upload_max_filesize` in `php.ini`
- Increase `post_max_size` in `php.ini`
- Restart Apache after changes

**4. Character Set Issues**
- Ensure database uses `utf8mb4` collation
- Check table collation in phpMyAdmin
- Verify connection charset in application

**5. Permission Errors**
- Ensure MySQL user has proper privileges
- Grant all privileges: `GRANT ALL PRIVILEGES ON yedire_frewoch.* TO 'root'@'localhost';`
- Flush privileges: `FLUSH PRIVILEGES;`

#### XAMPP File Locations
- **MySQL Data**: `C:\xampp\mysql\data\`
- **phpMyAdmin**: `C:\xampp\phpMyAdmin\`
- **MySQL Config**: `C:\xampp\mysql\bin\my.ini`
- **PHP Config**: `C:\xampp\php\php.ini`

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