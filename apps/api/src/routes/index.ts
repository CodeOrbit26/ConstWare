import { Router } from "express";
import authRoutes from "./auth";
import clientRoutes from "./client";
import contractorRoutes from "./contractor";
import aiRoutes from "./ai";
import workersRoutes from "./workers";
import pricesRoutes from "./prices";
import weatherRoutes from "./weather";
import supervisorRoutes from "./supervisor";
import sitesRoutes from "./sites";

const router = Router();

router.use("/auth", authRoutes);
router.use("/client", clientRoutes);
router.use("/contractor", contractorRoutes);
router.use("/ai", aiRoutes);
router.use("/workers", workersRoutes);
router.use("/prices", pricesRoutes);
router.use("/weather", weatherRoutes);
router.use("/supervisor", supervisorRoutes);
router.use("/sites", sitesRoutes);

export default router;
