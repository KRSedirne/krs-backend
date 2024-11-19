import express from "express";
import { connectDatabase } from "./configs/dbConfig.js";
import globalConfig from "./configs/globalConfig.js";
import cors from "cors";

const app = express();

// Connecting Database
connectDatabase();

// Use Libraries
app.use(cors())
app.use(express.json())

// Import all routes
import seatRoutes from "./routes/seat.js";
import rezervationRoutes from "./routes/rezervation.js";
import punishmentRoutes from "./routes/punishment.js";

// Use all routes
app.use("/api/v1", seatRoutes);
app.use("/api/v1", rezervationRoutes);
app.use("/api/v1", punishmentRoutes);


const server = app.listen(globalConfig.port || 4000, () => {
    console.log(`Server started on PORT: ${globalConfig.port} in ${globalConfig.environment}`);
})