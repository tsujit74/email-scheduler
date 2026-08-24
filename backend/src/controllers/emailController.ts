import { Request, Response, NextFunction } from "express";
import {
  addEmailsToCampaign,
  getCampaignEmails,
} from "../services/emailService";

export async function createCampaignEmails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const campaignId = String(req.params.campaignId);

    const { recipients } = req.body;

    if (!Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        message: "recipients must be an array",
      });
    }

    const emails = await addEmailsToCampaign(
      req.user.id,
      campaignId,
      { recipients },
    );

    return res.status(201).json({
      success: true,
      emails,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEmails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const campaignId = String(req.params.campaignId);

    const emails = await getCampaignEmails(
      req.user.id,
      campaignId,
    );

    return res.json({
      success: true,
      emails,
    });
  } catch (error) {
    next(error);
  }
}