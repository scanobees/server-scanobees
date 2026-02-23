import e from "express";
import { createNew, getAllLogs, getLogByBatchName, getLogsByPeriod, syncVerifiedSerials } from "../controlers/admin/adminTagController.js";
import { sendTestMail } from "../controlers/admin/testMailAdmin.js";





const router= e.Router();


router.post('/create-new',createNew);
router.get('/get-all-logs',getAllLogs);
router.get('/get-log/period',getLogsByPeriod);
router.get('/get-log/:batch',getLogByBatchName);
router.post('/sync-verified',syncVerifiedSerials);
router.get("/test-mail", sendTestMail);


export {router as adminRouter}