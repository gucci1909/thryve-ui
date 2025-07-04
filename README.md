# Thryve - Leadership Development Platform

<div align="center">
  <img src="frontend/public/logo-thryve.png" alt="Thryve Logo" width="200"/>
  <h3>Elevate Your Leadership Journey</h3>
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Thryve is a comprehensive leadership development platform designed to help organizations and individuals enhance their leadership capabilities through personalized assessments, learning plans, and interactive features. The platform provides AI-powered insights, skill assessments, and collaborative tools for leadership growth.

### Key Capabilities

- **Leadership Assessment**: Comprehensive evaluation of leadership skills and competencies
- **Personalized Learning Plans**: AI-generated customized development roadmaps
- **Team Management**: Tools for managing team members and tracking progress
- **Interactive Chat**: AI-powered coaching and guidance
- **Progress Tracking**: Monitor development milestones and achievements
- **Multi-tenant Architecture**: Support for multiple organizations with role-based access

## ✨ Features

### For Individual Users
- 📊 Leadership skill assessments with detailed feedback
- 🎯 Personalized learning plans and recommendations
- 💬 AI-powered coaching and guidance
- 📈 Progress tracking and milestone achievements
- 🔐 Secure authentication and profile management

### For Company Administrators
- 👥 Team member management and invitations
- 📊 Company-wide analytics and insights
- 🎯 Organizational goal setting and tracking
- 🔧 User role management and permissions
- 📈 Performance monitoring and reporting

### For Founder/System Administrators
- 🏢 Multi-company management
- 👥 Manager and company administration
- 📊 System-wide analytics and insights
- 🔧 Platform configuration and settings
- 📈 Advanced reporting and monitoring

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS v4 with Flowbite React
- **UI Components**: Custom components with Framer Motion animations
- **Build Tool**: Vite
- **Package Manager**: npm

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer with Cloudinary
- **Email**: SendInBlue API
- **Validation**: Zod and Validator.js
- **Logging**: Winston
- **Testing**: Jest with Supertest

### DevOps & Tools
- **Containerization**: Docker (configured)
- **Process Management**: PM2 with ecosystem config
- **Code Quality**: ESLint, Prettier
- **API Documentation**: Swagger/OpenAPI
- **Version Control**: Git

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Panel   │    │   External      │    │   File Storage  │
│   (React)       │    │   APIs          │    │   (Cloudinary)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### System Architecture

The application follows a **three-tier architecture**:

1. **Presentation Layer**: React frontend with responsive design
2. **Application Layer**: Express.js backend with RESTful APIs
3. **Data Layer**: MongoDB for data persistence

### Authentication Flow

```
User Login → JWT Token Generation → Token Storage (Cookies) → Protected Routes
```

### Role-Based Access Control

- **Individual Users**: Access to personal dashboard and features
- **Company Admins**: Manage team members and company settings
- **Founder/System Admins**: Full system access and multi-company management

## 📁 Project Structure

```
thryve-ui/
├── frontend/                 # Main user-facing application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store configuration
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── admin-frontend/          # Admin panel application
│   ├── src/
│   │   ├── components/      # Admin-specific components
│   │   ├── pages/          # Admin pages
│   │   └── store/          # Admin Redux store
│   └── package.json        # Admin dependencies
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── api/            # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   └── utils/          # Backend utilities
│   ├── docs/               # API documentation
│   └── package.json        # Backend dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)
- **Git**

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thryve-ui
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install admin frontend dependencies
   cd ../admin-frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Configuration**

   Create environment files for each component:

   **Frontend (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_NAME=Thryve
   ```

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/thryve
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   SENDINBLUE_API_KEY=your-sendinblue-key
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if using local installation)
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in backend .env file
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start Admin Frontend** (optional)
   ```bash
   cd admin-frontend
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Admin Panel: http://localhost:5174
   - Backend API: http://localhost:5000

## 🛠 Development

### Available Scripts

**Frontend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

**Backend**
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type safety (frontend)
- **Jest**: Unit testing (backend)

### Git Workflow

1. Create feature branch from `main`
2. Make changes and commit with descriptive messages
3. Push branch and create pull request
4. Code review and merge to `main`

## 🚀 Deployment

### Production Build

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build Admin Frontend**
   ```bash
   cd admin-frontend
   npm run build
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   npm run start
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Variables

Ensure all production environment variables are properly configured:
- Database connection strings
- API keys and secrets
- CORS origins
- SSL certificates

## 📚 API Documentation

The API documentation is available at `/api-docs` when the backend server is running.

### Key Endpoints

- **Authentication**: `/users/login`, `/users/signup`
- **User Management**: `/users/profile`, `/users/update`
- **Leadership Assessment**: `/leadership-report/generate`
- **Learning Plans**: `/learning-plan/generate`
- **Team Management**: `/invite-team/send-invitation`
- **Company Management**: `/companies/verify-key`

### Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

<div align="center">
  <p>Built with ❤️ by the Thryve Team</p>
  <p>Elevate Your Leadership Journey</p>
</div>