import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";
import { getAllBlocks, getBlockDetails,getSaloonImages } from "../controllers/blockController.js";
import express from "express";

const router = express.Router();

router.route("/blocks").get(isAuthenticatedUser, getAllBlocks);
router.route("/block/:id").get(isAuthenticatedUser, getBlockDetails);
router.route("/block/saloon/image/:id").get(isAuthenticatedUser, getSaloonImages);

export default router;
