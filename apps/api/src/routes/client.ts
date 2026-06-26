import { Router, Request, Response } from "express";

const router = Router();

const defaultEmptySite = {
  name: "No Site Found",
  location: "N/A",
  progress: 0,
  status: "inactive",
  start_date: "",
  end_date: "",
  contractor: {
    name: "",
    company: "",
    phone: "",
  },
  latest_update: {
    summary: "No updates available.",
    date: "",
    workers_count: 0,
    photos: [],
  },
  milestones: [],
};

const mockSiteDatabase: Record<string, any> = {};

router.get("/site-data", async (req: Request, res: Response) => {
  try {
    const siteId = req.query.siteId as string;

    if (!siteId) {
      return res.status(400).json({ success: false, error: "Site ID is required" });
    }

    const normalizedId = siteId.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    if (mockSiteDatabase[normalizedId]) {
      return res.json({ success: true, data: mockSiteDatabase[normalizedId] });
    }

    for (const [code, data] of Object.entries(mockSiteDatabase)) {
      if (normalizedId.includes(code) || code.includes(normalizedId)) {
        return res.json({ success: true, data });
      }
    }

    if (normalizedId.includes("DEMO") || normalizedId.includes("TOKEN")) {
      return res.json({ success: true, data: defaultEmptySite });
    }

    if (normalizedId.startsWith("CW")) {
      const clientInitials = normalizedId.slice(2, 4);
      const siteInitials = normalizedId.slice(4, 6);
      
      return res.json({ 
        success: true, 
        data: {
          ...defaultEmptySite,
          name: `${siteInitials} Construction Alpha`,
          location: `Zone ${normalizedId.slice(10, 12) || "XX"}, ${clientInitials} District`,
          client_code: clientInitials
        }
      });
    }

    return res.status(404).json({ success: false, error: "Site ID not found. Please check and try again." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
