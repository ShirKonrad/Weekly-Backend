import { NextFunction, Request, Response, Router } from "express";
import {
  UserService,
} from "../services/user";
import { UserError } from "../errors/userError";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";
import { InternalServerError } from "../errors/internalServerError";
import { getUserId } from "../helpers/currentUser";
import { emailHandler } from "../helpers/emailHandler";
import { BadRequestError } from "../errors/badRequestError";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randToken = require('rand-token');

const router = wrapAsyncRouter();

router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, beginDayHour, endDayHour } =
    req.body.user;

  let dbUser = await UserService.getUserByEmail(email);

  if (dbUser) {
    throw new UserError("An account with this email already exists");
  } else {
    let hashedPassword = bcrypt.hashSync(password, 10);

    await UserService.createUser(
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
    let dbUser = await UserService.getUserByEmail(email);

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
  const currUserId = getUserId(req);

  if (parseInt(currUserId) !== id) {
    throw new UserError("You can only update your own user!");
  }

  try {
    const user = await UserService.updateUser(
      id,
      firstName,
      lastName,
      beginDayHour,
      endDayHour
    )

    return res.status(200).send(user);
  } catch (error) {
    throw new BadRequestError("Something went wrong when updating the user");
  }
});

router.post('/resetPassword', async (req: Request, res: Response) => {
  const { email } = req.body.params;

  let dbUser = await UserService.getUserByEmail(email);

  if (!dbUser) {
    throw new UserError("Check again the email, seems like it doesn't exist in Weekly");
  } else {
    const resetToken = randToken.generate(20);
    const sent = await emailHandler(email, resetToken);
    if (sent === 1) {
      await UserService.updateUserResetToken(dbUser.id, resetToken)
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

  const dbUser = await UserService.getUserById(id);

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

router.put('/updatePassword', async (req: Request, res: Response) => {
  const { id, password } = req.body.params;

  let dbUser = await UserService.getUserById(id);

  if (dbUser) {
    let hashedPassword = bcrypt.hashSync(password, 10);
    await UserService.updateUserPassword(dbUser.id, hashedPassword)
      .then(() => {
        const token = jwt.sign(dbUser!.id, process.env.SECRET_KEY);
        return res.status(200).send({ token, user: dbUser });
      });
  } else {
    throw new UserError("User is not registered, Sign Up first");
  }
});

router.post('/logInGoogle', async (req: Request, res: Response) => {
  let dbUser = await UserService.getUserByEmail(req.body.user.email);

  if (dbUser) {
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
    const { firstName, lastName, email } = req.body.user;
    await UserService.createUser(
      firstName, lastName, email
    ).then((addedNewUser) => {
      const token = jwt.sign(addedNewUser.id, process.env.SECRET_KEY);
      return res.status(200).send({ token, user: addedNewUser });
    });
  }
})

export { router as userRouter };

