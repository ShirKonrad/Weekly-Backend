import express, { Request, Response } from "express";
import { router } from "./routes"

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello, this is Express + TypeScript');
// });

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`[Server]: I am running at https://localhost:${PORT}`);
});
