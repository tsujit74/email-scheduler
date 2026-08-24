import { Router } from "express";
import {
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

export default router;