import { Router } from "express";
import { scheduleRouter } from "./schedule";
import { tagRouter } from "./tag";
import { taskRouter } from "./task";
import { userRouter } from "./user";
import { eventRouter } from "./event";

const router = Router();

/**
* @swagger 
* definitions:
*   Error:
*       type: object
*       required:
*         - errors
*       properties:
*         errors:
*           description: an array of all the errors
*           type: array
*           items:
*             properties:
*               message:
*                 type: object
*                 example: error text
* responses:
*   BadRequest:
*     description: 'Error: Bad Request'
*     content:
*       application/json:
*         schema:
*           $ref: '#/definitions/Error'
*   Unauthorized:
*     description: 'Error: Unauthorized'
*     content:
*       application/json:
*         schema:
*           $ref: '#/definitions/Error'
*   NotFound:
*     description: 'Error: Not Found'
*     content:
*       application/json:
*         schema:
*           $ref: '#/definitions/Error'
*/

// Add new routes here
router.use("/task", taskRouter);
router.use("/event", eventRouter);
router.use("/schedule", scheduleRouter);
router.use("/user", userRouter);
router.use("/tag", tagRouter);

export { router };
