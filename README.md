# 🏦 TaxPal - Personal Finance & Tax Management System

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-brightgreen)](https://www.mongodb.com/mern-stack)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white)](https://expressjs.com/)

A comprehensive personal finance and tax management application built with the MERN stack, featuring real-time expense tracking, budget management, tax estimation, and automated report generation.

## 🌟 Features

### 💰 **Financial Management**

- **Real-time Transaction Tracking** - Monitor income and expenses with automatic categorization
- **Budget Planning & Management** - Create and track budgets across multiple categories
- **Multi-format Report Generation** - Export financial reports in PDF, DOCX, Excel, and CSV formats
- **Interactive Dashboards** - Visualize financial data with dynamic charts and analytics

### 📊 **Tax Management**

- **Tax Estimation & Calculation** - Calculate taxes based on current slabs and regulations
- **Tax Calendar & Reminders** - Never miss important tax deadlines
- **Compliance Tracking** - Keep track of tax obligations and payments
- **Document Management** - Organize tax-related documents and receipts

### 🔐 **Security & Authentication**

- **Multi-factor Authentication** - Secure login with OTP verification
- **JWT-based Authorization** - Secure API endpoints with token-based authentication
- **Password Recovery** - Secure password reset via email verification
- **Role-based Access Control** - Different access levels for various user types

### 📱 **User Experience**

- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Dark/Light Mode** - Customizable interface themes
- **Real-time Notifications** - Instant alerts for transactions and reminders
- **Multi-currency Support** - Handle transactions in different currencies

## 🛠️ Technology Stack

### **Frontend**

- **React 19** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Material-UI & Ant Design** - Professional UI component libraries
- **Chart.js & Recharts** - Data visualization and charting
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing

### **Backend**

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server-side development
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token for authentication

### **Additional Services**

- **Nodemailer** - Email service for notifications
- **Cloudinary** - Media management and storage
- **Puppeteer** - PDF generation and web scraping
- **Handlebars** - Template engine for dynamic content
- **ExcelJS** - Excel file generation and manipulation

## 📁 Project Structure

```
Taxpal/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages/screens
│   │   ├── layouts/         # Layout components
│   │   ├── api/             # API service functions
│   │   ├── store/           # State management
│   │   ├── utils/           # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── hbs/             # Handlebars templates
│   └── package.json         # Backend dependencies
│
├── README.md               # Project documentation
└── LICENSE                 # License file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Ragav7775/Taxpal.git
cd taxpal
```

2. **Setup Backend**

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
# Server Configuration
PORT=8080
CLIENT_URL=http://localhost:5173

# Database
MONGODB_TAXPAL_STRING=mongodb://localhost:27017/taxpal

# JWT config
JWT_SECRET=your_jwt_secret_here
SECURE_COOKIES_NODE_ENV=your_cookies_secret

# Email Configuration
TAXPAL_TEAM3_GMAIL=your_email@gmail.com
TAXPAL_TEAM3_GMAIL_APP_PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Setup Frontend**

```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_SERVER_URL=http://localhost:8080
```

4. **Start Development Servers**

Backend (Terminal 1):

```bash
cd backend
npm run dev
```

Frontend (Terminal 2):

```bash
cd frontend
npm run dev
```

5. **Access the Application**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`

## 📊 Core Modules

### 🏠 **Dashboard**

- Real-time financial overview
- Interactive charts and analytics
- Quick access to key features
- Recent transaction summary

### 💸 **Transaction Management**

- Add, edit, and delete transactions
- Automatic categorization
- Receipt upload and storage
- Advanced filtering and search

### 💰 **Budget Management**

- Create custom budget categories
- Set spending limits and goals
- Track budget performance
- Automated alerts and notifications

### 📈 **Tax Estimation**

- Calculate estimated taxes
- Support for multiple tax regimes
- Tax saving suggestions
- Deadline reminders

### 📋 **Report Generation**

- Comprehensive financial reports
- Multiple export formats (PDF, DOCX, Excel, CSV)
- Customizable report templates
- Scheduled report generation

### ⚙️ **Settings & Configuration**

- User profile management
- Security settings
- Notification preferences
- Category customization

## 📱 Screenshots

*Dashboard Overview*
![Dashboard](https://res.cloudinary.com/drigmwnmd/image/upload/v1759770866/Screenshot_171_crokqb.png)

*Transaction Management*
![Transactions](https://res.cloudinary.com/drigmwnmd/image/upload/v1759770866/Screenshot_167_k6nppu.png)

*Budget Planning*
![Budget](https://res.cloudinary.com/drigmwnmd/image/upload/v1759771083/6b9ece8e-34f4-4077-bcd0-6c675d6bdcd3.png)

*Tax Estimation*
![Tax Estimation](https://res.cloudinary.com/drigmwnmd/image/upload/v1759770866/Screenshot_168_nayd3u.png)

*Report Generation*
![Report](https://res.cloudinary.com/drigmwnmd/image/upload/v1759770866/Screenshot_172_mslyks.png)

## 🎥 Demo Video Available

> ▶️ **Click to watch:**  
> **[Open Demo Video](https://res.cloudinary.com/drigmwnmd/video/upload/v1763800709/Taxpal_Video_Presentation_dqabyh.mp4)**  

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

### Backend Testing

```bash
cd backend
npm run test
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend Deployment (Heroku/Railway)

```bash
cd backend
npm run build
# Deploy to your preferred platform
```

### Environment Variables for Production

Ensure all environment variables are properly configured in your deployment platform.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use consistent code formatting (ESLint/Prettier)
- Write comprehensive tests
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
