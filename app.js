import express from "express";
import { connectDatabase } from "./configs/dbConfig.js";
import globalConfig from "./configs/globalConfig.js";
import cors from "cors";
import morgan from 'morgan';
import seatRoutes from "./routes/seatRoute.js";
import reservationRoutes from "./routes/reservationRoute.js";
import punishmentRoutes from "./routes/punishmentRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
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
app.use("/api/v1", reservationRoutes);
app.use("/api/v1", punishmentRoutes);
app.use("/api/v1", userRoute);
app.use("/api/v1", authRoute);

const port = globalConfig.port || 5000;
const server = app.listen(port, () => {
    console.log(`Server started on PORT: ${port} in ${globalConfig.environment}`);
    swagger(app, port); // Initialize Swagger after server starts
});