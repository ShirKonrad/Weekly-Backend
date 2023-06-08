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
exports.saveEvents = exports.getAllEventsByUserIdAndDates = exports.getAllEventsByUserId = void 0;
const typeorm_1 = require("typeorm");
const event_1 = require("../models/event");
function getAllEventsByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield event_1.Event.find({
            where: {
                user: { id: userId },
                startTime: (0, typeorm_1.MoreThanOrEqual)(new Date())
            },
        });
    });
}
exports.getAllEventsByUserId = getAllEventsByUserId;
function getAllEventsByUserIdAndDates(userId, minDate, maxDate) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield event_1.Event.find({
            where: {
                user: { id: userId },
                startTime: (0, typeorm_1.Between)(minDate, maxDate),
            },
        });
    });
}
exports.getAllEventsByUserIdAndDates = getAllEventsByUserIdAndDates;
function saveEvents(events, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const newEvents = events.map((event) => {
            var _a;
            return event_1.Event.create(Object.assign(Object.assign({}, event), { tag: { id: (_a = event === null || event === void 0 ? void 0 : event.tag) === null || _a === void 0 ? void 0 : _a.id }, user: { id: userId } }));
        });
        return yield event_1.Event.insert(newEvents);
    });
}
exports.saveEvents = saveEvents;
