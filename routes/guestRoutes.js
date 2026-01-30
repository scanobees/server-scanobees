import e from "express";
import { getSerialDetails } from "../controlers/guest/guestScan.js";
import { maskedCall } from "../utils/maskedCall.js";
import { sendCarAlert } from "../controlers/guest/guestWhatsapp.js";





const router= e.Router();


router.get('/scan/:serialNumber',getSerialDetails);
router.post('/masked-call',maskedCall)
router.post('/whatsapp/car-alert',sendCarAlert)


export {router as guestRouter}