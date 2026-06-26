import { Router, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();

const getDataFilePath = (req: Request): string => {
  const userId = req.headers["x-user-id"];
  if (typeof userId === "string" && userId.trim() !== "") {
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
    if (safeUserId) {
      return path.join(process.cwd(), `data/sites_${safeUserId}.json`);
    }
  }
  return path.join(process.cwd(), "data/sites.json");
};

// GET all sites for the authenticated contractor
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
    const sites = JSON.parse(fileContent);
    return res.json(sites);
  } catch (error) {
    console.error("Error reading sites data:", error);
    return res.status(500).json({ error: "Failed to fetch sites" });
  }
});

// POST to create a new site
router.post("/", async (req: Request, res: Response) => {
  try {
    const newSiteData = req.body;
    const dataFilePath = getDataFilePath(req);
    
    // Ensure file exists
    try {
      await fs.access(dataFilePath);
    } catch {
      await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
      await fs.writeFile(dataFilePath, "[]", "utf-8");
    }

    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const sites = JSON.parse(fileContent);
    
    // Generate unique exactly 12-char client access code
    const randomSuffix = Math.random().toString(36).substring(2, 12).toUpperCase().padStart(10, 'X');
    const siteAccessCode = `CW${randomSuffix}`;

    const newSite = {
      id: `site-${Date.now()}`,
      name: newSiteData.name,
      location: newSiteData.location,
      supervisor: newSiteData.supervisor || "Not Assigned",
      workers: newSiteData.workers || 0,
      todayExpenses: newSiteData.todayExpenses || 0,
      progress: newSiteData.progress || 0,
      health: newSiteData.health || "green",
      budgetTotal: newSiteData.budgetTotal || 0,
      startDate: newSiteData.startDate || new Date().toISOString().split('T')[0],
      endDate: newSiteData.endDate || new Date().toISOString().split('T')[0],
      description: newSiteData.description || "",
      clientName: newSiteData.clientName || "",
      clientPhone: newSiteData.clientPhone || "",
      clientEmail: newSiteData.clientEmail || "",
      clientAccessId: siteAccessCode,
      siteAccessCode,
      clientAccessEnabled: true,
      status: newSiteData.status || "active",
      createdAt: new Date().toISOString()
    };
    
    sites.push(newSite);
    await fs.writeFile(dataFilePath, JSON.stringify(sites, null, 2));
    
    return res.status(201).json(newSite);
  } catch (error) {
    console.error("Error adding site:", error);
    return res.status(500).json({ error: "Failed to create site" });
  }
});

export default router;
