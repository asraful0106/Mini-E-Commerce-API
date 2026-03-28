// donation.service.ts
import { Types } from "mongoose";
import type { IDonationInput } from "./donation.interface.js";
import { Donation } from "./donation.model.js";

export const DonationService = {
  async createDonation(payload: IDonationInput) {
    return await Donation.create(payload);
  },

  async getAllDonations() {
    return await Donation.find().sort({ createdAt: -1 });
  },

  async getDonationsByUserId(userId: string) {
    return await Donation.find({ user_id: new Types.ObjectId(userId) }).sort({
      createdAt: -1,
    });
  },

  async getDonationById(id: string) {
    return await Donation.findById(id);
  },

  async updateDonation(id: string, payload: Partial<IDonationInput>) {
    return await Donation.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  },

  async deleteDonation(id: string) {
    return await Donation.findByIdAndDelete(id);
  },

  async getDonationStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalStats] = await Donation.aggregate([
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalDonations: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
                totalTrees: { $sum: "$trees" },
              },
            },
          ],
          today: [
            {
              $match: { createdAt: { $gte: today } },
            },
            {
              $group: {
                _id: null,
                todayDonations: { $sum: 1 },
                todayAmount: { $sum: "$amount" },
                todayTrees: { $sum: "$trees" },
              },
            },
          ],
        },
      },
    ]);

    return {
      totalDonations: totalStats.total[0]?.totalDonations || 0,
      totalAmount: totalStats.total[0]?.totalAmount || 0,
      totalTrees: totalStats.total[0]?.totalTrees || 0,
      todayDonations: totalStats.today[0]?.todayDonations || 0,
      todayAmount: totalStats.today[0]?.todayAmount || 0,
      todayTrees: totalStats.today[0]?.todayTrees || 0,
    };
  },

  async getTotalTreesDonated() {
    const result = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalTrees: { $sum: "$trees" },
        },
      },
    ]);

    return result[0]?.totalTrees || 0;
  },
};
