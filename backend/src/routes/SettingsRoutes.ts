import express from "express";
import { AuthenticateJWT } from "../middleware/AuthValidation";
import SettingsController from "../controller/SettingsController";



const router = express.Router();


router.post("/create/new/user-category-data", AuthenticateJWT, SettingsController.CreateNewUserCategory);
router.get("/fetch/user-category-data", AuthenticateJWT, SettingsController.FetchUserCategories);
router.put("/update/user-current-category-data", AuthenticateJWT, SettingsController.UpdateUserCurrentCategory);
router.delete("/delete/current/user-selected-category", AuthenticateJWT, SettingsController.DeleteUserSelectedCategory);
router.put("/update/current-user-password", AuthenticateJWT, SettingsController.ChangeUserPassword);
router.put("/update/current-user-profile-data", AuthenticateJWT, SettingsController.UpdateUserProfile);


export default router;