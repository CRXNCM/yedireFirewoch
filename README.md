# YeDire Firewoch Charity Organization

## Overview
YeDire Firewoch is a charitable development organization dedicated to making a positive impact in the lives of children and communities across Ethiopia. This repository contains the full-stack application including the frontend React app and backend API server.

---

## About YeDire Firewoch

YeDire Firewoch (meaning "One for Another" in Amharic) is a nonprofit organization focused on improving the lives of children, families, and communities in Ethiopia through education, health, and social development programs. The organization partners with local schools, volunteers, and sponsors to create sustainable impact.

---

## Project Structure

- **frontend/**: React frontend application built with Vite.
- **backend/**: Express.js backend API server with MySQL database integration.

---

## Frontend

### Technologies
- React
- Vite
- React Router
- CountUp.js for animated stats
- React Icons for UI icons

### Setup & Run
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000` (or the port Vite specifies).

---

## Backend

### Technologies
- Node.js with Express.js
- MySQL database
- Sequelize ORM
- JWT for authentication
- Multer for file uploads

### Setup & Run
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create `.env` file) with your database credentials and JWT secret.
4. Run database migrations and seed default admin:
   ```bash
   npm run setup-admin
   npm run create-default-admin
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
6. The API server will run on `http://localhost:5000` by default.

---

## Features

- Dynamic homepage with hero section, gallery, impact stats, testimonials, and sponsors carousel.
- Admin-protected endpoints for managing schools, communities, volunteers, sponsors, testimonials, and images.
- Responsive design for mobile and desktop.
- Image upload and management.
- Sponsor carousel with auto-scroll and pause on hover.
- Animated count-up stats for impact numbers.

---

## Testing

- No automated tests are currently included.
- Manual testing is recommended for:
  - Homepage UI and responsiveness.
  - API endpoints for CRUD operations.
  - Authentication and authorization flows.
  - File uploads and image rendering.

---

## Contribution

Contributions are welcome! Please fork the repository and submit pull requests for bug fixes, features, or improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact the YeDire Firewoch team.
