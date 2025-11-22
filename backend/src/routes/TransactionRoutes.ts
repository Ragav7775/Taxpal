import express from "express";
import TransactionController from "../controller/TransactionController";
import { AuthenticateJWT } from "../middleware/AuthValidation";


const router = express.Router();


router.post("/create/new/user-income-or-expense-data", AuthenticateJWT, TransactionController.Create_Income_Expense_Record);
router.get("/fetch/recent-transactions", AuthenticateJWT, TransactionController.Get_Recent_Transactions);
router.get("/fetch/all-transactions", AuthenticateJWT, TransactionController.Get_All_Transactions);
router.put("/update/user-income-or-expense-by-id/:id", AuthenticateJWT, TransactionController.Update_Income_Expense_Record);
router.delete("/delete/user-income-or-expense-record-by-id/:id", AuthenticateJWT, TransactionController.Delete_Income_Expense_Record);


export default router;