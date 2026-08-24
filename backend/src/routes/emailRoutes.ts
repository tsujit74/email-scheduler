import { Router } from "express";
import {
  createCampaignEmails,
  getEmails,
} from "../controllers/emailController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post(
  "/campaigns/:campaignId/emails",
  createCampaignEmails,
);

router.get(
  "/campaigns/:campaignId/emails",
  getEmails,
);

export default router;