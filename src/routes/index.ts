import { Router } from "express";
import { scheduleRouter } from "./schedule";
import { tagRouter } from "./tag";
import { taskRouter } from "./task";
import { userRouter } from "./user";

const router = Router();

// Add new routes here
router.use("/task", taskRouter);
router.use("/schedule", scheduleRouter);
router.use("/user", userRouter)
router.use("/tag", tagRouter)


export { router };
