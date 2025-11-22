# 🎨 TaxPal Frontend - React Application

[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-teal)](https://tailwindcss.com/)

The frontend application for TaxPal - a modern, responsive React-based user interface for personal finance and tax management.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation & Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the frontend directory:

```env
VITE_SERVER_URL=http://localhost:8080
```

4. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Technology Stack

### **Core Technologies**

- **React 19.1.1** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework

### **UI Libraries & Components**

- **Material-UI (MUI)** - Comprehensive React component library
- **Ant Design** - Enterprise-class UI design language
- **Lucide React** - Beautiful & consistent icons
- **React Icons** - Popular icon libraries

### **State Management & Data Fetching**

- **Zustand** - Lightweight state management
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### **Charts & Visualization**

- **Chart.js** - Simple yet flexible JavaScript charting
- **React-Chartjs-2** - React wrapper for Chart.js
- **Recharts** - Redefined chart library built with React

### **Date & Time Handling**

- **Day.js** - Lightweight date library
- **React DatePicker** - Flexible date picker component
- **React Calendar** - Ultimate calendar for React

### **Routing & Navigation**

- **React Router DOM** - Declarative routing for React

### **Form & Input Libraries**

- **React Select** - Flexible select input control
- **React Select Country List** - Country selection component

### **Notifications & UI Feedback**

- **React Hot Toast** - Smoking hot React notifications
- **Sonner** - Opinionated toast component

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   └── Taxpal-Logo.png        # Application logo
│
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Generic UI components
│   │   │   ├── transactions/ # Transaction-specific UI
│   │   │   ├── tax-estimator/# Tax estimator UI
│   │   │   ├── dialog-box/   # Modal dialogs
│   │   │   └── budget/       # Budget-specific UI
│   │   ├── dashboard/        # Dashboard components
│   │   ├── report/           # Report components
│   │   ├── settings/         # Settings components
│   │   ├── tax-estimator/    # Tax estimation components
│   │   └── transactions/     # Transaction components
│   │
│   ├── pages/                # Application pages
│   │   ├── WelcomePage.jsx   # Landing/welcome page
│   │   ├── TransactionsPage.jsx # Transaction management
│   │   ├── BudgetsPage.jsx   # Budget management
│   │   ├── TaxEstimatorPage.jsx # Tax calculations
│   │   ├── TaxCalendarPage.jsx # Tax calendar
│   │   ├── ReportPage.jsx    # Report generation
│   │   └── SettingsPage.jsx  # User settings
│   │
│   ├── layouts/              # Layout components
│   │   └── DashboardLayout.jsx # Main dashboard layout
│   │
│   ├── api/                  # API service functions
│   │   ├── BudgetApi.js      # Budget-related APIs
│   │   ├── DashboardApi.js   # Dashboard APIs
│   │   ├── ReportApi.js      # Report APIs
│   │   ├── SettingsApi.js    # Settings APIs
│   │   ├── TaxEstimationApi.js # Tax estimation APIs
│   │   ├── TransactionApi.js # Transaction APIs
│   │   └── UserApi.js        # User management APIs
│   │
│   ├── store/                # State management
│   │   └── index.js          # Zustand store configuration
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useUserData.ts    # User data hook
│   │
│   ├── utils/                # Utility functions
│   │   ├── CountryCurrency.js # Currency utilities
│   │   └── FormatAmount.js   # Amount formatting
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── country-currency-map.d.ts # Currency types
│   │
│   ├── json/                 # Static JSON data
│   │   └── CountriesTaxSlabs.json # Tax slab data
│   │
│   ├── assets/               # Static assets
│   │   ├── Taxpal-Logo.png   # Logo
│   │   ├── vector.png        # Vector graphics
│   │   ├── visible.png       # Visibility icon
│   │   └── welcomeimage.png  # Welcome page image
│   │
│   ├── App.jsx               # Main App component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
│
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🎯 Key Features

### **Authentication System**

- User registration and login
- OTP verification
- Password recovery
- Secure session management

### **Dashboard**

- Financial overview widgets
- Interactive charts and analytics
- Recent transaction summaries
- Quick action buttons

### **Transaction Management**

- Add, edit, delete transactions
- Category-based organization
- Advanced filtering and search
- Bulk operations

### **Budget Planning**

- Create custom budget categories
- Set spending limits
- Track budget performance
- Visual progress indicators

### **Tax Estimation**

- Calculate estimated taxes
- Support for different tax regimes
- Tax-saving recommendations
- Deadline reminders

### **Report Generation**

- Generate comprehensive reports
- Multiple export formats
- Customizable templates
- Preview before download

### **Settings & Customization**

- User profile management
- Security settings
- Notification preferences
- Category customization

## 🔧 Available Scripts

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Design System

- **Primary Colors**: Blue, Green, Purple
- **Typography**: Inter font family
- **Spacing**: Tailwind's spacing scale
- **Components**: Consistent design patterns

## 📊 Performance Optimization

### **Code Splitting**

```javascript
// Lazy loading for better performance
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));
```

### **Bundle Analysis**

```bash
# Analyze bundle size
npm run build -- --analyze
```

## 🧪 Testing

### **Testing Stack**

- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **MSW** - API mocking

### **Running Tests**

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

### **Environment Configuration**

Production environment variables:

```env
VITE_SERVER_URL=http://localhost:8080
```

### **Deployment Platforms**

- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **Firebase Hosting**

## 🔍 Troubleshooting

### **Common Issues**

1. **Port already in use**

```bash
# Kill process on port 5173
npx kill-port 5173
```

2. **Module not found errors**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

3. **Build fails**

```bash
# Clear Vite cache
npm run build -- --force
```

## 🤝 Contributing

### **Development Workflow**

1. Create a feature branch
2. Make changes
3. Run tests
4. Submit pull request

### **Code Standards**

- Use TypeScript for new components
- Follow ESLint rules
- Write meaningful component names
- Add proper TypeScript types

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Frontend Team - TaxPal**
