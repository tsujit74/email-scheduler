import { Router } from "express";
import {
    cancelCampaignController,
  createCampaign,
  getCampaign,
  getCampaigns,
} from "../controllers/campaignController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaign);
router.post(
  "/:id/cancel",
  requireAuth,
  cancelCampaignController,
);

export default router;