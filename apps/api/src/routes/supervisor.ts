import { Router, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();

const getSupervisorDataPath = (userId: string, filename: string): string => {
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(process.cwd(), `data/supervisor_${safeUserId}_${filename}`);
};

// GET /api/supervisor/site-context
router.get("/site-context", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    // Mock site details for supervisor
    const siteContext = {
      id: "site-1",
      name: "Green Valley Residency",
      location: "Sector 62, Noida, UP",
      supervisor: "Supervisor User",
      progress: 65.4,
      status: "active",
      budgetTotal: 12450000,
      clientName: "Rakesh Singhal",
    };
    return res.json(siteContext);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch site context" });
  }
});

// POST /api/supervisor/attendance/check-in
router.post("/attendance/check-in", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    const { latitude, longitude, status } = req.body;

    const dataPath = getSupervisorDataPath(userId, "attendance.json");
    try {
      await fs.access(dataPath);
    } catch {
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      await fs.writeFile(dataPath, "[]", "utf-8");
    }

    const fileContent = await fs.readFile(dataPath, "utf-8");
    const logs = JSON.parse(fileContent);

    const logEntry = {
      id: `att-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
      status: status || "Present",
    };

    logs.push(logEntry);
    await fs.writeFile(dataPath, JSON.stringify(logs, null, 2), "utf-8");

    return res.status(201).json(logEntry);
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit supervisor check-in" });
  }
});

// GET /api/supervisor/workers
router.get("/workers", async (req: Request, res: Response) => {
  try {
    // Return mock workers assigned to the supervisor's site (site-1)
    const workers = [
      { id: "w-sup-1", name: "Ramesh Kumar", phone: "9876543210", skill: "Mason", dailyWage: 600, status: "available" },
      { id: "w-sup-2", name: "Sita Ram", phone: "8765432109", skill: "Helper", dailyWage: 400, status: "available" },
      { id: "w-sup-3", name: "Vikram Singh", phone: "7654321098", skill: "Carpenter", dailyWage: 550, status: "available" },
    ];
    return res.json(workers);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch assigned workers" });
  }
});

// POST /api/supervisor/attendance/workers
router.post("/attendance/workers", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    const { date, records } = req.body;

    const dataPath = getSupervisorDataPath(userId, "workers_attendance.json");
    try {
      await fs.access(dataPath);
    } catch {
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      await fs.writeFile(dataPath, "{}", "utf-8");
    }

    const fileContent = await fs.readFile(dataPath, "utf-8");
    const logs = JSON.parse(fileContent);

    logs[date] = {
      timestamp: new Date().toISOString(),
      records,
    };

    await fs.writeFile(dataPath, JSON.stringify(logs, null, 2), "utf-8");
    return res.status(201).json({ success: true, date });
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit workers attendance" });
  }
});

// POST /api/supervisor/site/materials
router.post("/site/materials", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    const { name, quantity, unit } = req.body;

    const dataPath = getSupervisorDataPath(userId, "materials_used.json");
    try {
      await fs.access(dataPath);
    } catch {
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      await fs.writeFile(dataPath, "[]", "utf-8");
    }

    const fileContent = await fs.readFile(dataPath, "utf-8");
    const logs = JSON.parse(fileContent);

    const logEntry = {
      id: `mat-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      name,
      quantity: Number(quantity),
      unit,
      timestamp: new Date().toISOString(),
    };

    logs.push(logEntry);
    await fs.writeFile(dataPath, JSON.stringify(logs, null, 2), "utf-8");

    return res.status(201).json(logEntry);
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit material log" });
  }
});

// POST /api/supervisor/reports/dpr
router.post("/reports/dpr", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    const { notes, imageUrl } = req.body;

    const dataPath = getSupervisorDataPath(userId, "reports.json");
    try {
      await fs.access(dataPath);
    } catch {
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      await fs.writeFile(dataPath, "[]", "utf-8");
    }

    const fileContent = await fs.readFile(dataPath, "utf-8");
    const logs = JSON.parse(fileContent);

    const logEntry = {
      id: `report-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      notes,
      imageUrl: imageUrl || null,
      timestamp: new Date().toISOString(),
    };

    logs.push(logEntry);
    await fs.writeFile(dataPath, JSON.stringify(logs, null, 2), "utf-8");

    return res.status(201).json(logEntry);
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit progress report" });
  }
});

// GET /api/supervisor/attendance
router.get("/attendance", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    const dataPath = getSupervisorDataPath(userId, "attendance.json");
    try {
      await fs.access(dataPath);
    } catch {
      return res.json([]);
    }
    const fileContent = await fs.readFile(dataPath, "utf-8");
    return res.json(JSON.parse(fileContent));
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch attendance logs" });
  }
});

// GET /api/supervisor/site/materials
router.get("/site/materials", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    const dataPath = getSupervisorDataPath(userId, "materials_used.json");
    try {
      await fs.access(dataPath);
    } catch {
      return res.json([]);
    }
    const fileContent = await fs.readFile(dataPath, "utf-8");
    return res.json(JSON.parse(fileContent));
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch material logs" });
  }
});

// GET /api/supervisor/reports/dpr
router.get("/reports/dpr", async (req: Request, res: Response) => {
  try {
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    const dataPath = getSupervisorDataPath(userId, "reports.json");
    try {
      await fs.access(dataPath);
    } catch {
      return res.json([]);
    }
    const fileContent = await fs.readFile(dataPath, "utf-8");
    return res.json(JSON.parse(fileContent));
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch progress reports" });
  }
});

export default router;
