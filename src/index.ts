import express, { Request, Response } from "express";
import { connectToDb } from "./config";
import { NotFoundError } from "./errors/notFoundError";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes"
import cors from "cors";
import { assignmentsUpdate } from "./services/job";
const cron = require("node-cron");

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

// Try to reach to unexisting route
app.all("*", () => {
    throw new NotFoundError();
});

// A job that is running at 2:00AM every day
cron.schedule("0 0 2 * * *", function () {
    console.log("-------------------------");
    console.log("running the job.. time: " + new Date().toLocaleString());
    assignmentsUpdate()
});

app.use(errorHandler);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, async () => {
    console.log(`[Server]: I am running at https://localhost:${PORT}`);
    await connectToDb();
});



