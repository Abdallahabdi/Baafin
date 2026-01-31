import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import { sendEmail } from "../utils/emailer.js";

export const getMatches = async (req, res) => {
  try {
    const lostItems = await LostItem.find();
    const foundItems = await FoundItem.find();

    let matches = [];

    lostItems.forEach(lost => {
      foundItems.forEach(async found => {
        let score = 0;

        // Title
        if (
          lost.title &&
          found.title &&
          lost.title.toLowerCase().includes(found.title.toLowerCase())
        ) score += 30;

        // Category
        if (lost.category === found.category) score += 25;

        // Color
        if (lost.color && lost.color === found.color) score += 25;

        // Location
        if (lost.location && lost.location === found.location) score += 20;

        if (score >= 40) {
          matches.push({
            lost,
            found,
            score
          });
        }
        if (score >= 80) {
             await sendEmail(
             lost.user.email,
              "🎉 Lost Item Match Found",
           `Your lost item "${lost.title}" has a strong match!`
  );
}
      });
    });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
