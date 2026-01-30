import e from "express";
import { getSerialDetails } from "../controlers/guest/guestScan.js";
import { maskedCall } from "../utils/maskedCall.js";
import { sendCarAlert, testApi } from "../controlers/guest/guestWhatsapp.js";





const router= e.Router();


router.get('/scan/:serialNumber',getSerialDetails);
router.post('/masked-call',maskedCall);
router.post('/whatsapp/car-alert',sendCarAlert);
router.get('/test',testApi);


export {router as guestRouter}