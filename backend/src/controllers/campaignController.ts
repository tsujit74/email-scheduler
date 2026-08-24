import { Request, Response, NextFunction } from "express";
import {
    cancelCampaignForUser,
  createCampaignForUser,
  getCampaignForUser,
  getCampaignsForUser,
} from "../services/campaignService";

export async function createCampaign(
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

    const { subject, body, startTime, delayBetweenEmails, hourlyLimit } =
      req.body;

    const campaign = await createCampaignForUser(req.user.id, {
      subject,
      body,
      startTime: new Date(startTime),
      delayBetweenEmails,
      hourlyLimit,
    });

    return res.status(201).json({
      success: true,
      campaign,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCampaigns(
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

    const campaigns = await getCampaignsForUser(req.user.id);

    return res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCampaign(
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

    const campaign = await getCampaignForUser(
      req.user.id,
      String(req.params.id),
    );

    return res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelCampaignController(
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

    const campaignId = String(req.params.id);

    const campaign = await cancelCampaignForUser(
      req.user.id,
      campaignId,
    );

    return res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    next(error);
  }
}
