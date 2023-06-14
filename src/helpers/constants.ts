import { ClientErrors } from "./types";

export enum Priority {
    HIGH = 1,
    MEDIUM,
    LOW
}

export const clientErrors: ClientErrors = {
    SAVING_TASKS_FAILED: {
        code: 1,
        message: "Saving tasks or events failed",
    },
    GENERATE_SCHEDULE_FAILED: {
        code: 2,
        message: "We couldn't generate your schedule at the moment",
        extraMessage: "We saved the tasks for you so try to regenerate in a while"
    }
}