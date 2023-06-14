import { NextFunction, Request, Response, Router } from "express";
import { createUser, getUserByEmail, getUserById, updateUser } from "../services/user";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { DatabaseConnectionError } from "../errors/databaseConnectionError";
import { UserError } from "../errors/userError";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";
import { InternalServerError } from "../errors/internalServerError";
import { getUserId } from "../helpers/currentUser";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = wrapAsyncRouter();
const router = wrapAsyncRouter();

// const cleanUserObject = (user) => {
//     delete user.password;
//     delete user.card_number;
//     delete user.token;
//     delete user.card_expiration_year;
//     delete user.card_expiration_month;
//     return user;
// };

router.get('/:id(\\d+)', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await getUserById(parseInt(id));

        if (user) {
            return res.status(200).send(user);
        } else {
            throw new DataNotFoundError("User not found")
        }
    } catch (err) {
        throw new DatabaseConnectionError()
    }

});

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, beginDayHour, endDayHour } = req.body.user;

        let dbUser = await getUserByEmail(email)

        if (dbUser) {
            throw new UserError("An account with this email already exists")
        } else {
            let hashedPassword = bcrypt.hashSync(password, 10);

            await createUser(firstName, lastName, email, hashedPassword, beginDayHour, endDayHour)
                .then((addedNewUser) => {
                    const token = jwt.sign(addedNewUser.id, process.env.SECRET_KEY);
                    return res.status(200).send({ token, user: addedNewUser });
                })
                .catch((error) => {
                    throw new DatabaseConnectionError()
                });
        }
    } catch (err) {
        throw new DatabaseConnectionError()
    }
});

router.post('/logIn', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body.params;
    let dbUser = await getUserByEmail(email)
        .catch(() => {
            throw new DatabaseConnectionError()
        });

    if (dbUser) {
        bcrypt.compare(password, dbUser.password, (err: any, result: any) => {
            //Comparing the hashed password
            if (err) {
                next(new InternalServerError())
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
                }
                return res.status(200).send({ token, user: retUser });
            } else {
                //Declaring the errors
                next(new UserError("Please enter the correct password"))
            }
        });
    } else {
        throw new UserError("User is not registered, Sign Up first")
    }
});

router.put('/', async (req: Request, res: Response) => {
    const { id, firstName, lastName, beginDayHour, endDayHour } = req.body.user;
    const currUserId = getUserId(req);

    if (parseInt(currUserId) !== id) {
        throw new UserError("You can only update your own user!");
    }

    const user = await updateUser(id, firstName, lastName, beginDayHour, endDayHour)
        .then(user => {
            return res.status(200).send(user);
        }).catch(error => {
            throw new DatabaseConnectionError();
        });
});

// const { token } = req.headers;
// const id = jwt.verify(token, process.env.SECRET_KEY);

// const { email, username, photo, cardNumber, expirationMonth, expirationYear } = req.body;

// try {
//     const user = await sequelize.models.users.findOne({ where: { id } });
//     if (!user) {
//         res.status(500).send({ message: `Could not update. User with id: ${id} does not exist` })
//     } else {
//         const valuesToUpdate = {
//             ...shouldUpdate(username, user.username) && {username},
//             ...shouldUpdate(email, user.email) && {email},
//             ...shouldUpdate(photo, user.photo) && {photo},
//             ...shouldUpdate(cardNumber, user.photo) && { card_number: cardNumber },
//             ...shouldUpdate(expirationMonth, user.card_expiration_year) && { card_expiration_month: expirationMonth },
//             ...shouldUpdate(expirationYear, user.card_expiration_year) && { card_expiration_year: expirationYear }
//         }
//         const columnNamesToUpdate = Object.keys(valuesToUpdate);
//         if (columnNamesToUpdate.length === 0) return res.status(200).send({ message: `No values were updated`, updatedValues: columnNamesToUpdate });
//         user.set(valuesToUpdate);
//         const updatedUser = await user.save();


//         return res.status(200).send({ message: `Successfully updated the following values: ${columnNamesToUpdate.join(', ')}`, updatedValues: columnNamesToUpdate, user: cleanUserObject(updatedUser.dataValues) });
//     }
// } catch (err) {
//     console.log(err);
//     res.status(err.status || 500).send({ message: `Could not update. An error occurred while trying to update user with id: ${id}` });
// }
// });

// router.post('/validateToken', async (req: Request, res: Response, next) => {
//     const { token, id } = req.body;

//     const user = await getUserById(id);

//     if (user) {
//         if (user.token === token) {
//             return res.sendStatus(200);
//         } else {
//             next(new UnauthorizedError())
//         }
//     } else {
//         return res.status(404).send('user is not registered');
//     }
// });


export { router as userRouter };

function next(arg0: UserError) {
    throw new Error("Function not implemented.");
}
