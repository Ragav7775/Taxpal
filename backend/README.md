# ⚡ TaxPal Backend - Node.js API Server

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-black)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.18.0-green)](https://www.mongodb.com/)

The backend API server for TaxPal - a robust Node.js application providing RESTful APIs for personal finance and tax management with TypeScript, MongoDB, and comprehensive report generation capabilities.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation & Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend directory:

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

4. **Start development server**

```bash
npm run dev
```

The API server will be available at `http://localhost:8080`

## 🛠️ Technology Stack

### **Core Technologies**

- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server-side development
- **MongoDB** - NoSQL database with Mongoose ODM

### **Authentication & Security**

- **JWT (jsonwebtoken)** - Secure token-based authentication
- **bcrypt** - Password hashing and validation
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Parse and handle cookies

### **File & Report Generation**

- **@turbodocx/html-to-docx** - Generate DOCX documents
- **Puppeteer** - PDF generation and web scraping
- **ExcelJS** - Excel file generation and manipulation
- **CSV-Stringify** - CSV file generation
- **Handlebars** - Template engine for dynamic content

### **Email & Notifications**

- **Nodemailer** - Email sending capabilities
- **Custom OTP Generator** - Secure OTP generation

### **Utilities & Helpers**

- **Country-State-City** - Geographic data handling
- **Currency-Symbol-Map** - Currency formatting utilities
- **Cloudinary** - Cloud-based media management

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── BudgetController.ts      # Budget management
│   │   ├── DashboardController.ts   # Dashboard data
│   │   ├── ReportController.ts      # Report generation
│   │   ├── SettingsController.ts    # User settings
│   │   ├── TaxEstimationController.ts # Tax calculations
│   │   ├── TransactionController.ts # Transaction management
│   │   └── UserController.ts        # User authentication
│   │
│   ├── models/               # Database models (Mongoose)
│   │   ├── Budgets.ts        # Budget schema
│   │   ├── Report.ts         # Report schema
│   │   ├── TaxEstimation.ts  # Tax estimation schema
│   │   ├── Transactions.ts   # Transaction schema
│   │   └── user.ts           # User schema
│   │
│   ├── routes/               # API route definitions
│   │   ├── BudgetRoutes.ts   # Budget endpoints
│   │   ├── DashboardRoutes.ts # Dashboard endpoints
│   │   ├── ReportRoutes.ts   # Report endpoints
│   │   ├── SettingsRoutes.ts # Settings endpoints
│   │   ├── TaxEstimationRoutes.ts # Tax endpoints
│   │   ├── TransactionRoutes.ts # Transaction endpoints
│   │   └── UserRoutes.ts     # User authentication endpoints
│   │
│   ├── services/             # Business logic services
│   │   ├── CsvGenerator.ts   # CSV report generation
│   │   ├── DocxGenerator.ts  # DOCX report generation
│   │   ├── ExcelGenerator.ts # Excel report generation
│   │   ├── Mailer.ts         # Email service
│   │   └── PdfGenerator.ts   # PDF report generation
│   │
│   ├── middleware/           # Custom middleware
│   │   └── AuthValidation.ts # JWT authentication middleware
│   │
│   ├── utils/                # Utility functions
│   │   ├── cloudinaryUtils.ts      # Cloudinary helpers
│   │   ├── FormatCountryCurrency.ts # Currency formatting
│   │   ├── GenerateOTP.ts          # OTP generation
│   │   ├── GetCurrencySymbol.ts    # Currency symbols
│   │   ├── Month&PercentageCalculator.ts # Financial calculations
│   │   └── ReportUtils.ts          # Report utilities
│   │
│   ├── mongodb/              # Database connection
│   │   └── DBConnection.ts   # MongoDB connection setup
│   │
│   ├── hbs/                  # Handlebars templates
│   │   ├── ForgotPasswordOtpTemplet.hbs    # OTP email template
│   │   ├── TaxEstimationReportTemplate.hbs # Tax report template
│   │   └── TransactionReportTemplete.hbs   # Transaction report template
│   │
│   └── index.ts              # Application entry point
│
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## 🔧 Available Scripts

### Development

```bash
# Start development server with nodemon
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Database

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/taxpal
```

## 🔐 Authentication Flow

### **Registration Process**

1. User provides email and password
2. System validates and hashes password
3. OTP sent to email for verification
4. User verifies OTP to activate account

### **Login Process**

1. User provides credentials
2. System validates password
3. JWT token generated and returned
4. Token used for subsequent requests

### **Password Reset**

1. User requests password reset
2. OTP sent to registered email
3. User provides OTP and new password
4. Password updated and tokens invalidated

## 🛡️ Security Features

### **Input Validation**

- Request body validation using custom middleware
- SQL injection prevention
- XSS protection

## 🧪 Testing

### **Test Structure**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### **Testing Stack**

- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory database for testing

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

### **Environment Configuration**

Production environment variables should include:

- Database connection strings
- JWT secrets (strong, randomly generated)
- Email service credentials
- Cloudinary configuration

### **Deployment Platforms**

- **Railway** (Recommended)
- **Heroku**
- **AWS EC2**
- **DigitalOcean**
- **Google Cloud Platform**

### **Health Check Endpoint**

```typescript
GET /status
Response: {
  status: 'ok',
  timestamp: Date,
  uptime: number,
  database: 'connected'
}
```

## 🔍 Troubleshooting

### **Common Issues**

1. **Database Connection Failed**

```bash
# Check MongoDB service
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

2. **Port Already in Use**

```bash
# Find process using port 8080
lsof -ti:5000

# Kill the process
kill -9 <PID>
```

3. **Email Not Sending**

- Verify SMTP credentials
- Check app-specific password for Gmail
- Ensure less secure app access (if using Gmail)

## 🤝 Contributing

### **Development Workflow**

1. Create feature branch from `develop`
2. Implement changes with proper TypeScript types
3. Write/update tests
4. Submit pull request

### **Code Standards**

- Use TypeScript for all new code
- Follow ESLint configuration
- Write comprehensive error handling
- Add proper logging

### **API Documentation**

- Document all new endpoints
- Include request/response examples
- Update Postman collection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Backend Team - TaxPal**
