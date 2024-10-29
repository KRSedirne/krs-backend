import express from "express";
import { connectDatabase } from "./configs/dbConfig.js";
import globalConfig from "./configs/globalConfig.js";
import cors from "cors";

const app = express();

// Connecting Database
connectDatabase();

// Use Libraries
app.use(cors())

const server = app.listen(globalConfig.port || 4000, () => {
    console.log(`Server started on PORT: ${globalConfig.port} in ${globalConfig.environment}`);
})