import express from "express";
import { AuthenticateJWT } from "../middleware/AuthValidation";
import ReportController from "../controller/ReportController";


const router = express.Router();

router.post("/create/new/user-report-document", AuthenticateJWT, ReportController.CreateUserReport);
router.get("/fetch/user-reports-data", AuthenticateJWT, ReportController.FetchUserReports);
router.delete("/delete/user-report-from-records", AuthenticateJWT, ReportController.DeleteUserReport);


export default router;