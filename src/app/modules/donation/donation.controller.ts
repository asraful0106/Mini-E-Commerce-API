// donation.controller.ts
import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { DonationService } from "./donation.service.js";
import { sendResposne } from "../../utils/sendResponse.js";

export const DonationController = {
  createDonation: catchAsync(async (req: Request, res: Response) => {
    // console.log(req.body)
    const donation = await DonationService.createDonation(req.body);
    sendResposne(res, {
      statusCode: 201,
      success: true,
      message: "Donation created successfully",
      data: null,
    });
  }),

  getAllDonations: catchAsync(async (req: Request, res: Response) => {
    const donations = await DonationService.getAllDonations();
    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Donations retrieved successfully",
      data: donations,
    });
  }),

  getDonationsByUserId: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const donations = await DonationService.getDonationsByUserId(
      userId as string,
    );
    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "User donations retrieved successfully",
      data: donations,
    });
  }),

  getDonationById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const donation = await DonationService.getDonationById(id as string);
    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Donation retrieved successfully",
      data: donation,
    });
  }),

  updateDonation: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const donation = await DonationService.updateDonation(
      id as string,
      req.body,
    );
    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Donation updated successfully",
      data: donation,
    });
  }),

  deleteDonation: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await DonationService.deleteDonation(id as string);
    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Donation deleted successfully",
      data: null,
    });
  }),

  // Analytics Routes
  getDonationStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await DonationService.getDonationStats();
    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Donation statistics retrieved successfully",
      data: stats,
    });
  }),

  getTotalTreesDonated: catchAsync(async (req: Request, res: Response) => {
    const totalTrees = await DonationService.getTotalTreesDonated();
    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Total trees donated retrieved successfully",
      data: { totalTrees },
    });
  }),
};
