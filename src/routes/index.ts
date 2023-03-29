import { Router } from "express";
import { scheduleRouter } from "./schedule";
import { taskRouter } from "./task";

const router = Router();

// Add new routes here
router.use("/task", taskRouter);
router.use("/schedule", scheduleRouter);


export { router };
