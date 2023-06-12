import { ClientError } from "../errors/clientMessageError";

export type TaskAssignment = {
    taskId: number;
    assignment: Date;
}

export type ClientErrors = {
    [key: string]: ClientError
}