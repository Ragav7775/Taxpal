import express from "express";
import { AuthenticateJWT } from "../middleware/AuthValidation";
import DashboardController from "../controller/DashboardController";


const router = express.Router();


router.get("/fetch/user-income-vs-expense-records", AuthenticateJWT, DashboardController.GetIncomeVsExpenseRecords);
router.get("/fetch/user-expense-breakdown-records", AuthenticateJWT, DashboardController.GetExpenseBreakdown);
router.get("/fetch/user-total-summary-records", AuthenticateJWT, DashboardController.getSummaryRecords);


export default router;