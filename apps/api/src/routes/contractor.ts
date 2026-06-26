import { Router, Request, Response } from "express";
import { prisma } from "../db/prisma";
import { generateUniqueSiteId } from "@constware/shared";

const router = Router();

router.post("/generate-client-id", async (req: Request, res: Response) => {
  const { siteId, clientName, clientPhone, clientEmail, contractorId } = req.body;
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: contractorId || "placeholder-uuid" }
    });

    const contractorName = profile?.fullName || "CW";
    const companyName = profile?.companyName || null;

    const clientAccessId = await generateUniqueSiteId(
      contractorName,
      companyName,
      new Date(),
      async (id) => {
        const match = await prisma.site.findFirst({
          where: { clientAccessId: id }
        });
        return !!match;
      }
    );

    await prisma.site.updateMany({
      where: {
        id: siteId,
        contractorId: contractorId
      },
      data: {
        clientAccessId,
        clientAccessEnabled: true,
        clientName: clientName || null,
        clientPhone: clientPhone || null,
        clientEmail: clientEmail || null,
      }
    });

    return res.json({ clientAccessId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/toggle-client-access", async (req: Request, res: Response) => {
  const { siteId, enabled, contractorId } = req.body;
  try {
    await prisma.site.updateMany({
      where: {
        id: siteId,
        contractorId: contractorId
      },
      data: { clientAccessEnabled: enabled }
    });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    // For both mock mode and production, the user ID can be parsed from Authorization header or custom headers
    let userId = req.headers["x-user-id"] || req.headers["authorization"]?.replace("Bearer ", "");
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ error: "Unauthorized. Access token is missing." });
    }

    // Retrieve profile details from Prisma database
    let profile = await prisma.profile.findUnique({
      where: { id: userId }
    });

    // If profile is not in postgres (e.g. running in mock mode or local database doesn't have it),
    // fallback gracefully to a mock object to prevent breaking local development.
    if (!profile) {
      return res.json({
        id: userId,
        firstName: "Abhay",
        lastName: "Singh",
        email: "abhay@constware.co",
        phone: "+91 9876543210",
        companyName: "ConstWare Dev Node",
        designation: "Contractor",
        avatarGrad: "bg-gradient-to-br from-primary to-orange-600"
      });
    }

    // Split name into first and last
    const fullName = profile.fullName || "";
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    return res.json({
      id: profile.id,
      firstName,
      lastName,
      email: profile.email || "",
      phone: profile.phone || "",
      companyName: profile.companyName || "",
      designation: "Contractor",
      avatarGrad: "bg-gradient-to-br from-primary to-orange-600"
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
