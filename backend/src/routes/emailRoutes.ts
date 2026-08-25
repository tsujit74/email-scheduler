import { Router } from "express";
import {
  createCampaignEmails,
  getEmail,
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

router.get(
  "/emails/:emailId",
  getEmail,
);


router.get(
  "/:campaignId/emails/:emailId",
  getEmail,
);

export default router;