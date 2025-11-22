import express from "express";
import { AuthenticateJWT } from "../middleware/AuthValidation";
import TaxEstimationController from "../controller/TaxEstimationController";


const router = express.Router();


router.post("/create/new/user-taxestimator-remainder", AuthenticateJWT, TaxEstimationController.CreateTaxEstimationRemainder);
router.get("/fetch/current/user-taxestimator-calender-records", AuthenticateJWT, TaxEstimationController.GetTaxEstimationCalender);
router.put("/update/user-current-TaxRemainder-data", AuthenticateJWT, TaxEstimationController.UpdateTaxEstimationCalender);
router.delete("/delete/current/user-selected-TaxRemainder", AuthenticateJWT, TaxEstimationController.DeleteTaxEstimationCalender);
router.post("/check/current-tax-remainder/duedate-exceed", AuthenticateJWT, TaxEstimationController.CheckAndUpdateOverdueReminders);


export default router;