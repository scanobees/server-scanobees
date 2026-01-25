import e from "express";
import { getSerialDetails } from "../controlers/guest/guestScan.js";
import { maskedCall } from "../utils/maskedCall.js";





const router= e.Router();


router.get('/scan/:serialNumber',getSerialDetails);
router.post('/masked-call',maskedCall)


export {router as guestRouter}