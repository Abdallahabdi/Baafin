import FoundItem from "../models/FoundItem.js";

export const addFound = async (req, res) => {
  try {
    const item = await FoundItem.create({
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      user: req.user.id
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFound = async (req, res) => {
  const items = await FoundItem.find().populate("user");
  res.json(items);
};

export const getFoundById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id).populate("user");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// update, delete, view by id would follow similar patterns with checks  
export const updateFound = async (req, res) => {
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

    const item = await FoundItem.findById(req.params.id);
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

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// DELETE found item
export const deleteFound = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

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

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};
