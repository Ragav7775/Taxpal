import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn';
import Register from './Components/Register';
import ForgotPassword from './Components/Forgotpassword';
import EnterOTP from './Components/EnterOTP';
import ResetPassword from './Components/Resetpassword';
import DashboardLayout from './layouts/DashboardLayout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SettingsPage from './pages/SettingsPage';
import BudgetsPage from './pages/BudgetsPage';
import DashboardHome from './Components/dashboard/DashboardHome';
import WelcomePage from './pages/WelcomePage';
import TaxEstimatorPage from './pages/TaxEstimatorPage';
import TaxCalendarPage from './pages/TaxCalendarPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportPage';



function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Forgot-Password" element={<ForgotPassword />} />
          <Route path="/OTP-Verification" element={<EnterOTP />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />

          <Route path="/Dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="Settings" element={<SettingsPage />} />
            <Route path="Budgets" element={<BudgetsPage />} />
            <Route path="TaxEstimator" element={<TaxEstimatorPage />} />
            <Route path="TaxEstimator/TaxCalendar" element={<TaxCalendarPage />} />
            <Route path="Transactions" element={<TransactionsPage />} />
            <Route path="Reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;