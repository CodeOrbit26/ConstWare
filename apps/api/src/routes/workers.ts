import { Router, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();

const getDataFilePath = (req: Request): string => {
  const userId = req.headers["x-user-id"];
  if (typeof userId === "string" && userId.trim() !== "") {
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
    if (safeUserId) {
      return path.join(process.cwd(), `data/workers_${safeUserId}.json`);
    }
  }
  return path.join(process.cwd(), "data/workers.json");
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const dataFilePath = getDataFilePath(req);
    // Ensure file exists
    try {
      await fs.access(dataFilePath);
    } catch {
      await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
      await fs.writeFile(dataFilePath, "[]", "utf-8");
    }
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const workers = JSON.parse(fileContent);
    return res.json(workers);
  } catch (error) {
    console.error("Error reading workers data:", error);
    return res.status(500).json({ error: "Failed to fetch workers" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newWorkerData = req.body;
    const dataFilePath = getDataFilePath(req);
    
    // Ensure file exists
    try {
      await fs.access(dataFilePath);
    } catch {
      await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
      await fs.writeFile(dataFilePath, "[]", "utf-8");
    }

    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const workers = JSON.parse(fileContent);
    
    const newWorker = {
      id: `w${Date.now()}`,
      ...newWorkerData,
      rating: newWorkerData.rating || 0,
      kycVerified: newWorkerData.kycVerified || false,
      completedProjects: newWorkerData.completedProjects || 0,
      reliabilityScore: newWorkerData.reliabilityScore || 100,
      status: newWorkerData.status || "available"
    };
    
    workers.push(newWorker);
    await fs.writeFile(dataFilePath, JSON.stringify(workers, null, 2));
    
    return res.status(201).json(newWorker);
  } catch (error) {
    console.error("Error adding worker:", error);
    return res.status(500).json({ error: "Failed to add worker" });
  }
});

export default router;
