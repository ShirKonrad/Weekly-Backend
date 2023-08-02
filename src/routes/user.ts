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

/** 
* @swagger
* tags:
*   name: User
*   description: Weekly's user
*/

/**
* @swagger 
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - id
*         - firstName
*         - lastName
*         - email
*         - password
*         - beginDayHour
*         - endDayHour
*         - tags
*       properties:
*         id:
*           type: number
*           description: The user's id
*         firstName:
*           type: string
*           description: The user's first name
*         lastName:
*           type: string
*           description: The user's last name
*         email:
*           type: string
*           description: The user's sign-in email
*         password:
*           type: string
*           description: The user's sign-in password
*         beginDayHour:
*           type: number
*           description: The time of day that the user starts working at (full number)
*         endDayHour:
*           type: number
*           description: The time of day that the user ends working at (full number)
*         tags:
*           type: array
*           items:
*             $ref: '#/components/schemas/Tag'
*       example: 
*         id: 0
*         firstName: 'Tiki'
*         lastName: 'Pur'
*         email: 'tikiPur@gmail.com'
*         password: '123'
*         beginDayHour: 9
*         endDayHour: 22
*         tags:
*           - id: 0
*             name: 'Work'
*             color: '#33d7cd'
*           - id: 1
*             name: 'School'
*             color: '#313131'
*/

/**
* @swagger
* /user/register:
*   post:
*     summary: create a new user
*     tags: [User]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 user:
*                   $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: the new user and its token
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: The JWT access token
*                   example: 123cd123x1xx1
*                 user:
*                   $ref: '#/components/schemas/User'
*       400:
*         $ref: '#/responses/BadRequest'
*/
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

/**
* @swagger
* /user/logIn:
*   post:
*     summary: login to Weekly
*     tags: [User]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 params:
*                   type: object
*                   properties:
*                     email:
*                       type: string
*                       description: The user email
*                     password:
*                       type: string
*                       description: The user password
*     responses:
*       200:
*         description: The access & refresh tokens
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: The JWT access token
*                   example: 123cd123x1xx1
*                 user:
*                   $ref: '#/components/schemas/User'
*       400:
*         $ref: '#/responses/BadRequest'
*/
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

/**
* @swagger
* /user:
*   put:
*     summary: updating user data
*     tags: [User]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 user:
*                   $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The data was updated successfully
*       400:
*         $ref: '#/responses/BadRequest'
*       401:
*         $ref: '#/responses/Unauthorized'
*/
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

/**
* @swagger
* /user/resetPassword:
*   post:
*     summary: Generating a new password
*     tags: [User]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 params:
*                   type: object
*                   properties:
*                     email:
*                       type: string
*                       description: The user's email
*     responses:
*       200:
*         description: The data was updated successfully
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 user:
*                   type: object
*                   properties:
*                     id:
*                       type: number
*                       description: The user's id
*       400:
*         $ref: '#/responses/BadRequest'
*/
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

/**
* @swagger
* /user/validateToken:
*   post:
*     summary: Generating a new password
*     tags: [User]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 params:
*                   type: object
*                   properties:
*                     resetToken:
*                       type: string
*                       description: The reset token of the user
*     responses:
*       200:
*         description: The data was updated successfully
*       400:
*         $ref: '#/responses/BadRequest'
*       401:
*         $ref: '#/responses/Unauthorized'
*/
router.post('/validateToken', async (req: Request, res: Response) => {
  const { resetToken, id } = req.body.params;

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

/**
* @swagger
* /user/updatePassword:
*   put:
*     summary: Generating a new password
*     tags: [User]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 params:
*                   type: object
*                   properties:
*                     password:
*                       type: string
*                       description: The wanted new password
*     responses:
*       200:
*         description: The data was updated successfully
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: The JWT access token
*                   example: 123cd123x1xx1
*                 user:
*                   $ref: '#/components/schemas/User'
*       400:
*         $ref: '#/responses/BadRequest'
*       401:
*         $ref: '#/responses/Unauthorized'
*/
router.put('/updatePassword', async (req: Request, res: Response) => {
  const { password, id } = req.body.params;

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

/**
* @swagger
* /user/logInGoogle:
*   post:
*     summary: Login to weekly with your Google account
*     tags: [User]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 user:
*                   type: object
*                   properties:
*                     email:
*                       type: string
*                       description: The Google account email
*                     firstName:
*                       type: string
*                       description: The user's first name (from Google)
*                     lastName:
*                       type: string
*                       description: The user's last name (from Google)
*     responses:
*       200:
*         description: the new user and its token
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: The JWT access token
*                   example: 123cd123x1xx1
*                 user:
*                   $ref: '#/components/schemas/User'
*       400:
*         $ref: '#/responses/BadRequest'
*/
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

