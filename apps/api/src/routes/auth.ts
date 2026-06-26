import { Router, Request, Response } from "express";

const router = Router();

router.post("/client-login", async (req: Request, res: Response) => {
  try {
    const { clientAccessId } = req.body;

    if (!clientAccessId) {
      return res.status(400).json({ error: "clientAccessId is required." });
    }

    const cleanId = clientAccessId.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    if (cleanId.length !== 12 || !cleanId.startsWith("CW")) {
      return res.status(400).json({ error: "Invalid Code. Must be a 12-character ConstWare code." });
    }

    const mockSiteNames: Record<string, string> = {
      'CWABGV01ASGG': 'Green Valley Residency',
      'CWRIST15ASMU': 'Skyline Towers',
      'CWLGLB01ASBL': 'Lotus Business Park',
    };
    const siteName = mockSiteNames[cleanId] || `Project Site (${cleanId.slice(4, 6)})`;

    // Note: Setting cookies is normally done by Express response.cookie
    res.cookie("cw_client_site", cleanId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax"
    });

    return res.json({
      success: true,
      siteId: cleanId,
      clientAccessId: cleanId,
      siteName: siteName,
      redirectUrl: `/client/${cleanId}`
    });
  } catch (err) {
    return res.status(500).json({ error: "Server validation failed" });
  }
});

export default router;
