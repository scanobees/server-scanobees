import e from "express";
import { checkUser, forgotPassword, googleAuth, resendOtp, resetPassword, userLogin, userLogout, userSignup, verifyOtp } from "../controlers/user/userAuthController.js";
import { protect } from "../middlewares/userAuth.js";
import { linkBySerialNumber, unlinkBySerialNumber } from "../controlers/user/linkingController.js";
import { getUserDetails, updateUserProfile } from "../controlers/user/userController.js";
import { getBikeBySnUser, getBusinessCardBySnUser, getCarBySnUser, getKeyBySnUser, getPetTagBySnUser, getTagBySnUser, getUserLinkedAssets } from "../controlers/user/userScanController.js";
import { updateBikeBySnUser, updateBusinessCardBySnUser, updateCarBySnUser, updateKeyBySnUser, updatePetTagBySnUser, updateTagBySnUser } from "../controlers/user/userScanUpdateController.js";






const router= e.Router();


router.post('/signup',userSignup)
router.post('/login',userLogin)
router.post('/logout',userLogout)
router.get('/check',protect,checkUser)
router.post('/link',protect,linkBySerialNumber)
router.post('/unlink',protect,unlinkBySerialNumber)
router.post('/profile-update',protect,updateUserProfile)
router.get('/get-user',protect,getUserDetails)
router.get('/get-user-assets',protect,getUserLinkedAssets)
//get scan
router.get("/car/:serialNumber", getCarBySnUser);
router.get("/bike/:serialNumber", getBikeBySnUser);
router.get("/key/:serialNumber", getKeyBySnUser);
router.get("/tag/:serialNumber", getTagBySnUser);
router.get("/business-card/:serialNumber", getBusinessCardBySnUser);
router.get("/pet-tag/:serialNumber", getPetTagBySnUser);
//update scan
router.put("/update-car/:serialNumber", updateCarBySnUser);
router.put("/update-bike/:serialNumber", updateBikeBySnUser);
router.put("/update-key/:serialNumber", updateKeyBySnUser);
router.put("/update-tag/:serialNumber", updateTagBySnUser);
router.put("/update-pet-tag/:serialNumber", updatePetTagBySnUser);
router.put("/update-business-card/:serialNumber", updateBusinessCardBySnUser);
//google-auth
router.post('/google-auth',googleAuth)
// otp and reset pass
router.post("/forgot-password", forgotPassword);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
export {router as userRouter}