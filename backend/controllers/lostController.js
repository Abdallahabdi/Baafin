import LostItem from "../models/LostItem.js";
import AuditLog from "../models/AuditLog.js";

// Add new lost item
export const addLost = async (req, res) => {
  try {
    const item = await LostItem.create({
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      user: req.user.id, // user-ka hadda jira
    });

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      action: "CREATE",
      itemType: "LostItem",
      itemId: item._id,
      description: "Lost item created",
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all lost items
export const getLost = async (req, res) => {
  try {
    const items = await LostItem.find().populate("user");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get lost item by ID
export const getLostById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id).populate("user");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update lost item
export const updateLost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      color,
      location,
      contact,
      dateFound
    } = req.body;
    
    const item = await LostItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.title = title;
    item.description = description;
    item.category = category;
    item.color = color;
    item.location = location;
    item.contact = contact;
    item.dateFound = dateFound;
    item.user = req.user.id;

    // haddii image cusub la soo diray
    if (req.file) {
      item.imageUrl = `/uploads/${req.file.filename}`;
    }

    await AuditLog.create({
      user: req.user.id,
      action: "UPDATE",
      itemType: "LostItem",
      itemId: item._id,
    });

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete lost item
export const deleteLost = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔐 Hubi user & ownership
    if (
      !item.user ||
      !req.user ||
      (item.user.toString() !== req.user.id && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
// Log the deletion
    await AuditLog.create({
      user: req.user.id,
      action: "DELETE",
      itemType: "LostItem",
      itemId: item._id,
    });

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

