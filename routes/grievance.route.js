import express from 'express';
import { getCitizenContact, submitGrievance, updateGrievanceStatus, verifyCitizenOTP, verifyOTP } from '../controllers/grievance.controller.js';
import {isAuthenticateCitizen, isAuthenticatePhone} from '../middlewares/isAuthenticatePhone.js';
import { isAuthenticatedForGrievance } from '../middlewares/isAuthenticated.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.route("/grievancesubmission").post(upload, submitGrievance);
router.route("/grievancesubmission/verifyotp").post(isAuthenticatePhone,verifyOTP);
router.route("/getcitizengrievances").post(getCitizenContact);
router.route("/getcitizengrievances/verifyOTP").post(isAuthenticateCitizen, verifyCitizenOTP);
// router.post("/status/:id/update", isAuthenticatedForGrievance, updateGrievanceStatus);


export default router;