"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getTasksAssignments = void 0;
const axios_1 = __importStar(require("axios"));
const getTasksAssignments = (tasks, events, workingHoursStart, workingHoursEnd) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("CALL TO ALGORITHM");
    const tasksJson = tasks.map((task) => {
        return Object.assign(Object.assign({}, task), { dueDate: task.dueDate.toLocaleString() });
    });
    const eventsJson = events.map((event) => {
        return Object.assign(Object.assign({}, event), { startTime: event.startTime.toLocaleString(), endTime: event.endTime.toLocaleString() });
    });
    const body = {
        tasks: tasksJson,
        events: eventsJson,
        workingHoursStart,
        workingHoursEnd
    };
    return yield axios_1.default.post(`${process.env.MICRO_SERVICE_URL}/assignment`, body)
        .then(res => {
        console.log("algorithm response assignment");
        console.log(res.data);
        const schedule = [];
        for (const [key, value] of Object.entries(res.data)) {
            schedule.push({
                taskId: Number(key),
                assignment: new Date(String(value))
            });
        }
        return schedule;
    })
        .catch((err) => {
        // console.error(err)
        // return err;
        throw new axios_1.AxiosError();
    });
});
exports.getTasksAssignments = getTasksAssignments;
