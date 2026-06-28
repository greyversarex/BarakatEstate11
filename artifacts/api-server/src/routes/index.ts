import { Router, type IRouter } from "express";
import healthRouter from "./health";
<<<<<<< HEAD
import sellersRouter from "./sellers";
import serviceRequestRouter from "./service-request";
import adminRouter from "./admin/index";
import publicRouter from "./public";
=======
>>>>>>> 191d4c0 (Task start baseline checkpoint for code review)

const router: IRouter = Router();

router.use(healthRouter);
<<<<<<< HEAD
router.use(sellersRouter);
router.use(serviceRequestRouter);
router.use("/admin", adminRouter);
router.use(publicRouter);
=======
>>>>>>> 191d4c0 (Task start baseline checkpoint for code review)

export default router;
