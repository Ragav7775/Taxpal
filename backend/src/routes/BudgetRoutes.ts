import express from "express";
import BudgetController from "../controller/BudgetController";
import { AuthenticateJWT } from "../middleware/AuthValidation";


const router = express.Router();


router.post("/create/new/user-budget-data", AuthenticateJWT, BudgetController.CreateUserBudget);
router.get("/fetch/user-budgets-records", AuthenticateJWT, BudgetController.FetchUserBudgetRecords);
router.put("/update/previous/user-budget-data-by-id/:id", AuthenticateJWT, BudgetController.UpdateUserBudget);
router.delete("/delete/user-budget-data-by-id/:id", AuthenticateJWT, BudgetController.DeleteUserBudget);


export default router;