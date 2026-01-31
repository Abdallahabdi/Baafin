import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {
    // Admin kaliya
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await AuditLog.find()
      .populate("user", "username role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware si loo diiwaangeliyo ficillada
// export const logAction = (action, itemType) => {
//   return async (req, res, next) => {
//     try {
//       const itemId = res.locals.itemId; // Hel itemId laga soo dejiyey controllers
//       const user = req.user._id;

//       await AuditLog.create({
//         user,
//         action,
//         itemType,
//         itemId,
//         description: req.body.description,
//       });

//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };
