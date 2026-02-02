import e from "express";
import { getSerialDetails } from "../controlers/guest/guestScan.js";
import { maskedCall } from "../utils/maskedCall.js";
import {  sendWhatsappTestMessage, testApi } from "../controlers/guest/guestWhatsapp.js";
import { callStatus, connectCall, initiateMaskedCall } from "../controlers/guest/guestCall.js";






const router= e.Router();


router.get('/scan/:serialNumber',getSerialDetails);
// router.post('/masked-call',maskedCall);
router.post('/whatsapp/car-alert',sendWhatsappTestMessage);
router.get('/test',testApi);
router.post("/initiate-call", initiateMaskedCall);
router.get("/connect-call", connectCall);
router.post("/status", callStatus);


export {router as guestRouter}