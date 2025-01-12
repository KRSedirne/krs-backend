import express from "express";
import { connectDatabase } from "./configs/dbConfig.js";
import globalConfig from "./configs/globalConfig.js";
import cors from "cors";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import seatRoutes from "./routes/seatRoute.js";
import reservationRoute from "./routes/reservationRoute.js";
import suspendedRoute from "./routes/suspendedRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import lockerRoute from "./routes/lockerRoute.js";
import adminRoute from "./routes/adminRoute.js";
import blockRoute from "./routes/blockRoute.js";
import swagger from "./configs/swagger.js";
import cron from "node-cron";
import { autoCancelLockerReservation, autoCheckReservation, autoCheckSuspendedUsers } from "./utils/autoCheckerFunctions.js";
import errorMiddleware from "./middlewares/errors.js";


const app = express();

// Connecting Database
connectDatabase();

// Use Libraries
app.use(cors())
app.use(express.json())
app.use(morgan("dev"));
app.use(cookieParser());

// Use all routes
app.use("/api/v1", seatRoutes);
app.use("/api/v1", reservationRoute);
app.use("/api/v1", suspendedRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", lockerRoute);
app.use("/api/v1", blockRoute);
app.use("/api/v1/admin", adminRoute);

// Use middlewares
app.use(errorMiddleware);

// schedule tasks to be run on the server
cron.schedule('0 0 * * *', autoCancelLockerReservation); // every day at 00:00
cron.schedule('0 0 * * *', autoCheckReservation); // every day at 00:00
cron.schedule('0 0 * * *', autoCheckSuspendedUsers); // every day at 00:00

const port = globalConfig.port || 5000;
const server = app.listen(port, () => {
    console.log(`Server started on PORT: ${port} in ${globalConfig.environment}`);
    swagger(app, port); // Initialize Swagger after server starts
});