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
exports.tagRouter = void 0;
const dataNotFoundError_1 = require("../errors/dataNotFoundError");
const currentUser_1 = require("../helpers/currentUser");
const wrapAsyncRouter_1 = require("../helpers/wrapAsyncRouter");
const tag_1 = require("../services/tag");
const router = (0, wrapAsyncRouter_1.wrapAsyncRouter)();
exports.tagRouter = router;
router.get("/all-by-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield (0, tag_1.getAllTagsByUserId)((0, currentUser_1.getUserId)(req));
    if (!tags) {
        throw new dataNotFoundError_1.DataNotFoundError("Tags");
    }
    else {
        return res.status(200).send(tags);
    }
}));
