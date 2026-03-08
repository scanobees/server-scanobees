import e from "express";
import { getBusinessCardGuest, getReviewCardGuest, getSerialDetails } from "../controlers/guest/guestScan.js";
import { maskedCall } from "../utils/maskedCall.js";
import { sendBikeWhatsappAlert, sendCarWhatsappAlert, sendTagWhatsappAlert, sendWhatsappMessage, testApi } from "../controlers/guest/guestWhatsapp.js";
import { callStatus, connectCall, initiateMaskedCall } from "../controlers/guest/guestCall.js";





const router= e.Router();


router.get('/scan/:serialNumber',getSerialDetails);
router.get("/card/:serialNumber", getBusinessCardGuest);
router.get("/review/:serialNumber", getReviewCardGuest);

// call routes
router.post("/initiate-call", initiateMaskedCall);
router.get("/connect-call", connectCall);
router.post("/status", callStatus);
//whatsapp routes
router.get('/test',testApi);
router.post("/vehicle-alert", sendWhatsappMessage);
router.post("/whatsapp/car-alert", sendCarWhatsappAlert);
router.post("/whatsapp/bike-alert", sendBikeWhatsappAlert);
router.post("/whatsapp/tag-alert", sendTagWhatsappAlert);

export {router as guestRouter}