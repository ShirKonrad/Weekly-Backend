import { connectToDb } from "./config";
import { NotFoundError } from "./errors/notFoundError";
import { errorHandler } from "./middlewares/errorHandler";
import { assignmentsUpdate } from "./services/job";
const cron = require("node-cron");
const compression = require("compression");

const app = require("./server")

// Try to reach to un-existing route
app.all("*", () => {
    throw new NotFoundError();
});

// A job that is running at 2:00AM every day
cron.schedule("0 0 1 * * *", function () {
    console.log("-------------------------");
    console.log("running the job.. time: " + new Date().toLocaleString());
    assignmentsUpdate()
});

app.use(errorHandler);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, async () => {
    console.log(`[Server]: I am running at ${process.env.SERVER_URL}`);
    await connectToDb();
});


