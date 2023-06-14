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
exports.generateSchedule = void 0;
const algo_1 = require("../api/algo");
function generateSchedule(tasks, events, dayHoursStart, dayHoursEnd) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, algo_1.getTasksAssignments)(tasks, events, dayHoursStart, dayHoursEnd);
    });
}
exports.generateSchedule = generateSchedule;