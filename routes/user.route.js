import express from "express";
import { registerUser, registerOfficial, Logout, verifyAccount, loginAdmin, loginOfficial, grievanceforofficial, getAllGrievances} from "../controllers/user.controller.js";
import { isAuthenticated, isAuthenticatedForGrievance } from "../middlewares/isAuthenticated.js";
import { updateGrievanceStatus } from "../controllers/grievance.controller.js";

const router = express.Router();

//register part
router.route("/registeradmin").post(registerUser);
router.route("/registeradmin/verify").post(isAuthenticated,verifyAccount);
router.route("/registerofficial").post(registerOfficial);
router.route("/registerofficial/verify").post(isAuthenticated,verifyAccount);

//admin route
router.route("/loginadmin").post(loginAdmin);
router.route("/loginadmin/verify").post(isAuthenticated,verifyAccount);
router.route("/loginadmin/verify/getadmingrievances").get(isAuthenticatedForGrievance, getAllGrievances);

//official route
router.route("/loginofficial").post(loginOfficial);
router.route("/loginofficial/verify").post(isAuthenticated,verifyAccount);
router.route("/loginofficial/verify/getgrievances").get(isAuthenticatedForGrievance, grievanceforofficial);
router.route("/loginofficial/verify/status/:id/update").post(isAuthenticatedForGrievance, updateGrievanceStatus);


//logout part
router.route("/logout").get(Logout)

// router.route("/profile/update").post(isAuthenticated, updateProfile);

//get all grievances assigned to official based on their department and district


export default router;