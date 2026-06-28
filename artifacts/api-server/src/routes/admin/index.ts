import { Router } from "express";
import authRouter from "./auth";
import listingsRouter from "./listings";
import applicationsRouter from "./applications";
import viewingsRouter from "./viewings";
import reviewsRouter from "./reviews";
import usersRouter from "./users";
import settingsRouter from "./settings";
import uploadRouter from "./upload";

const router = Router();

router.use(authRouter);
router.use(listingsRouter);
router.use(applicationsRouter);
router.use(viewingsRouter);
router.use(reviewsRouter);
router.use(usersRouter);
router.use(settingsRouter);
router.use(uploadRouter);

export default router;
