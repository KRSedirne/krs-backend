import express from "express";
import { connectDatabase } from "./configs/dbConfig.js";
import globalConfig from "./configs/globalConfig.js";
import cors from "cors";
import morgan from 'morgan';
import seatRoutes from "./routes/seat.js";
import rezervationRoutes from "./routes/rezervation.js";
import punishmentRoutes from "./routes/punishment.js";
import lockerRoutes from "./routes/lockerRoute.js";
import swagger from "./configs/swagger.js";

const app = express();

// Connecting Database
connectDatabase();

// Use Libraries
app.use(cors())
app.use(express.json())
app.use(morgan("dev"));

// Use all routes
app.use("/api/v1", seatRoutes);
app.use("/api/v1", rezervationRoutes);
app.use("/api/v1", punishmentRoutes);
app.use("/api/v1", lockerRoutes);

const port = globalConfig.port || 5000;
const server = app.listen(port, () => {
    console.log(`Server started on PORT: ${port} in ${globalConfig.environment}`);
    swagger(app, port); // Initialize Swagger after server starts
});