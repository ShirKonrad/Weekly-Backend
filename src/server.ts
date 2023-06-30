import express from "express";
import cors from "cors";
import { router } from "./routes"

const compression = require("compression");

const app = express();

app.use(compression());
app.use(express.json());
app.use(cors());


app.use(router);

module.exports = app;