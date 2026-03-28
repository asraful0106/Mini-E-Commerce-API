// donation.route.ts
import { Router } from "express";
import {
  createDonationZodSchema,
  updateDonationZodSchema,
} from "./donation.validation.js";
import { DonationController } from "./donation.controller.js";
import { validateRequest } from "../../middlewares/validateReqest.js";

const router = Router();

// CRUD Routes
router.post(
  "/",
  validateRequest(createDonationZodSchema),
  DonationController.createDonation,
);

router.get("/", DonationController.getAllDonations);

router.get("/user/:userId", DonationController.getDonationsByUserId);

router.get("/:id", DonationController.getDonationById);

router.patch(
  "/:id",
  validateRequest(updateDonationZodSchema),
  DonationController.updateDonation,
);

router.delete("/:id", DonationController.deleteDonation);

// Analytics Routes
router.get("/stats", DonationController.getDonationStats);
router.get("/total-trees", DonationController.getTotalTreesDonated);

export const DonationRoutes = router;
