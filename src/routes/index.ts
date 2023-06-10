import { Router } from "express";
import { scheduleRouter } from "./schedule";
import { tagRouter } from "./tag";
import { taskRouter } from "./task";
import { userRouter } from "./user";
import { eventRouter } from "./event";

const router = Router();

// Add new routes here
router.use("/task", taskRouter);
router.use("/event", eventRouter);
router.use("/schedule", scheduleRouter);
router.use("/user", userRouter);
router.use("/tag", tagRouter);

export { router };
