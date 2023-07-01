import express from "express";
import cors from "cors";
import { router } from "./routes"

const compression = require("compression");
const app = express();

if (process.env.NODE_ENV == "development") {
    const swaggerUI = require("swagger-ui-express")
    const swaggerJsDoc = require("swagger-jsdoc")
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Weekly API",
                version: "1.0.0",
                description: "API for Weekly app.",
            },
            servers: [{url: "http://localhost:" + process.env.SERVER_PORT},],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        name: 'token',
                        in: 'header'
                    }
                }
            },
            security: [{
                bearerAuth: []
            }]
        },
        apis: ["src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
 } 

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(router);

module.exports = app;