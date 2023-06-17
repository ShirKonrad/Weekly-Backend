import { NextFunction, Request, Response, Router } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserPassword,
  updateUserResetToken,
} from "../services/user";
import { UserError } from "../errors/userError";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";
import { InternalServerError } from "../errors/internalServerError";
import { getUserId } from "../helpers/currentUser";
import { getAllTasksByUserId, updateAssignments } from "../services/task";
import { getAllEventsByUserId } from "../services/event";
import { generateSchedule } from "../services/schedule";
import { TaskAssignment } from "../helpers/types";
import { ClientMessageError } from "../errors/clientMessageError";
import { clientErrors } from "../helpers/constants";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randToken = require('rand-token');
import { emailHandler } from "../helpers/emailHandler";

const router = wrapAsyncRouter();

router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, beginDayHour, endDayHour } =
    req.body.user;

  let dbUser = await getUserByEmail(email);

  if (dbUser) {
    throw new UserError("An account with this email already exists");
  } else {
    let hashedPassword = bcrypt.hashSync(password, 10);

    await createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      beginDayHour,
      endDayHour
    ).then((addedNewUser) => {
      const token = jwt.sign(addedNewUser.id, process.env.SECRET_KEY);
      return res.status(200).send({ token, user: addedNewUser });
    });
  }
});

router.post(
  "/logIn",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body.params;
    let dbUser = await getUserByEmail(email);

    if (dbUser) {
      bcrypt.compare(password, dbUser.password, (err: any, result: any) => {
        //Comparing the hashed password
        if (err) {
          next(new InternalServerError());
        } else if (result === true) {
          //Checking if credentials match
          const token = jwt.sign(dbUser?.id, process.env.SECRET_KEY);
          const retUser = {
            id: dbUser?.id,
            firstName: dbUser?.firstName,
            lastName: dbUser?.lastName,
            email: dbUser?.email,
            beginDayHour: dbUser?.beginDayHour,
            endDayHour: dbUser?.endDayHour,
          };
          return res.status(200).send({ token, user: retUser });
        } else {
          //Declaring the errors
          next(new UserError("Please enter the correct password"));
        }
      });
    } else {
      throw new UserError("User is not registered, Sign Up first");
    }
  }
);

router.put("/", async (req: Request, res: Response) => {
  const { id, firstName, lastName, beginDayHour, endDayHour } = req.body.user;
  const generateAlgo = req.body.generateAlgo;
  const dbUserId = getUserId(req);

  if (parseInt(dbUserId) !== id) {
    throw new UserError("You can only update your own user!");
  }

  // get all the user's tasks and events that their due date has not passed
  const tasks = await getAllTasksByUserId(dbUserId, false, false, true);
  const events = await getAllEventsByUserId(dbUserId);
  
  if(!generateAlgo) {
    if (tasks.find(task => task.assignment && 
                          (task.assignment.getHours() + task.estTime > endDayHour ||
                           task.assignment?.getHours() < beginDayHour))) {
      throw new UserError("Your tasks assignment doesn't match your new hours");
    }
  }

  const user = await updateUser(
    id,
    firstName,
    lastName,
    beginDayHour,
    endDayHour
  ).then(async (user) => {
    if(generateAlgo) {
      if (tasks?.length > 0) {
        try {
          const schedule = (await generateSchedule(
            tasks,
            events,
            beginDayHour,
            endDayHour
          )) as TaskAssignment[];
          
          if (schedule?.length > 0) {
            await updateAssignments(tasks.map((task) => task.id), schedule, dbUserId);
            return res.status(200).send(user);
          }
        } catch (err) {
          console.error(err);
          throw new ClientMessageError(clientErrors.GENERATE_SCHEDULE_FAILED);
        }
      } else {
        return res.status(200).send("no tasks to schedule");
      }
    } else {
      return res.status(200).send(user);
    }
  })
});

router.post('/resetPassword', async (req: Request, res: Response) => {
  const { email } = req.body.params;

  let dbUser = await getUserByEmail(email);

  if (!dbUser) {
    throw new UserError("Check again the email, seems like it doesn't exist in Weekly");
  } else {
    const resetToken = randToken.generate(20);
    const sent = await emailHandler(email, resetToken);
    if (sent === 1) {
      await updateUserResetToken(dbUser.id, resetToken)
      const retUser = {
        id: dbUser.id
      }
      return res.status(200).send({ user: retUser });
    } else {
      throw new UserError("Could not send a reset email");
    }
  }
});

router.post('/validateToken', async (req: Request, res: Response) => {
    const { id, resetToken } = req.body.params;

    const dbUser = await getUserById(id);

    if (dbUser) {
        if (dbUser.resetToken === resetToken) {
          return res.sendStatus(200);
        } else {
          throw new UnauthorizedError("token is incorrect")
        }
    } else {
      throw new UserError("User is not registered, Sign Up first");
    }
});

router.put('/updatePassword', async (req: Request, res: Response, next: NextFunction) => {
  const { id, password } = req.body.params;

  let dbUser = await getUserById(id);

  if (dbUser) {
    let hashedPassword = bcrypt.hashSync(password, 10);
    await updateUserPassword(dbUser.id, hashedPassword)
      .then(() => {
        const token = jwt.sign(dbUser!.id, process.env.SECRET_KEY);
        return res.status(200).send({ token, user: dbUser });
      });
  } else {
    throw new UserError("User is not registered, Sign Up first");
  }
});


export { router as userRouter };
