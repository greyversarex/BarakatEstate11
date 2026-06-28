import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sellersRouter from "./sellers";
import serviceRequestRouter from "./service-request";
import viewingRequestRouter from "./viewing-request";
import adminRouter from "./admin/index";
import publicRouter from "./public";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sellersRouter);
router.use(serviceRequestRouter);
router.use(viewingRequestRouter);
router.use("/admin", adminRouter);
router.use(publicRouter);

export default router;
