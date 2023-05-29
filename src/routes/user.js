"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_1 = require("../services/user");
const dataNotFoundError_1 = require("../errors/dataNotFoundError");
const databaseConnectionError_1 = require("../errors/databaseConnectionError");
const userError_1 = require("../errors/userError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = (0, express_1.Router)();
exports.userRouter = router;
// const cleanUserObject = (user) => {
//     delete user.password;
//     delete user.card_number;
//     delete user.token;
//     delete user.card_expiration_year;
//     delete user.card_expiration_month;
//     return user;
// };
router.get('/:id(\\d+)', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield (0, user_1.getUserById)(parseInt(id));
        if (user) {
            return res.status(200).send(user);
        }
        else {
            next(new dataNotFoundError_1.DataNotFoundError("User not found"));
        }
    }
    catch (err) {
        next(new databaseConnectionError_1.DatabaseConnectionError());
    }
}));
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, beginDayHour, endDayHour } = req.body.user;
        let dbUser = yield (0, user_1.getUserByEmail)(email);
        if (dbUser) {
            next(new userError_1.UserError("An account with this email already exists"));
        }
        else {
            let hashedPassword = bcrypt.hashSync(password, 10);
            yield (0, user_1.createUser)(firstName, lastName, email, hashedPassword, beginDayHour, endDayHour)
                .then((addedNewUser) => {
                const token = jwt.sign(addedNewUser.id, process.env.SECRET_KEY);
                return res.status(200).send({ token, user: addedNewUser });
            })
                .catch((error) => {
                next(new databaseConnectionError_1.DatabaseConnectionError());
            });
        }
    }
    catch (err) {
        next(new databaseConnectionError_1.DatabaseConnectionError());
    }
}));
router.post('/logIn', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body.params;
        let dbUser = yield (0, user_1.getUserByEmail)(email);
        if (dbUser) {
            bcrypt.compare(password, dbUser.password, (err, result) => {
                //Comparing the hashed password
                if (err) {
                    return res.status(500).send("Internal server error");
                }
                else if (result === true) {
                    //Checking if credentials match
                    const token = jwt.sign(dbUser === null || dbUser === void 0 ? void 0 : dbUser.id, process.env.SECRET_KEY);
                    const retUser = {
                        id: dbUser === null || dbUser === void 0 ? void 0 : dbUser.id,
                        firstName: dbUser === null || dbUser === void 0 ? void 0 : dbUser.firstName,
                        lastName: dbUser === null || dbUser === void 0 ? void 0 : dbUser.lastName,
                        email: dbUser === null || dbUser === void 0 ? void 0 : dbUser.email,
                        beginDayHour: dbUser === null || dbUser === void 0 ? void 0 : dbUser.beginDayHour,
                        endDayHour: dbUser === null || dbUser === void 0 ? void 0 : dbUser.endDayHour,
                    };
                    return res.status(200).send({ token, user: retUser });
                }
                else {
                    //Declaring the errors
                    next(new userError_1.UserError("Please enter the corrent password"));
                }
            });
        }
        else {
            next(new userError_1.UserError("User is not registered, Sign Up first"));
        }
    }
    catch (err) {
        next(new databaseConnectionError_1.DatabaseConnectionError());
    }
}));
router.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
