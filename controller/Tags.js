const { Brand } = require("../modle/Brand");
const { Tags } = require("../modle/Tags");

exports.createTags = async (req, res) => {
  try {
    const { slug, value } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    const { id } = req.user;

    if (!slug || !value) {
      return res
        .status(400)
        .json({ message: "Label, value, and image are required." });
    }

    const newtag = new Tags({
      slug,
      value,
      userId: id,
    });

    const result = await newtag.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating brand:", err);
    res
      .status(400)
      .json({ message: "Failed to create brand.", error: err.message });
  }
};

exports.fetchTagsUserId = async (req, res) => {
  const { id } = req.user;

  try {
    const tag = await Tags.find({ userId: id });
    const totalTags = await Tags.countDocuments();

    res.set("X-Total-Count", totalTags);
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.fetchAllTags = async (req, res) => {
  try {
    const tag = await Tags.find();
    const totalTags = await Tags.countDocuments();

    res.set("X-Total-Count", totalTags);
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.fetchTagsByID = async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await Tags.findById(id);

    if (!tag) {
      return res.status(404).json({ message: "tags not found." });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error("Error fetching tags by ID:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.updateTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, value } = req.body;

    const tag = await Tags.findById(id);

    if (!tag) {
      return res.status(404).json({ message: "tag not found." });
    }

    if (slug) tag.slug = slug;
    if (value) tag.value = value;

    const updatedtags = await tag.save();

    res.status(200).json(updatedtags);
  } catch (err) {
    console.error("Error updating tag:", err);
    res
      .status(400)
      .json({ message: "Failed to update tag.", error: err.message });
  }
};

exports.deleteTags = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tags.findByIdAndDelete(id);

    if (!tag) {
      return res.status(404).json({ message: "tag not found." });
    }

    res.status(200).json({ message: "tag deleted successfully." });
  } catch (err) {
    console.error("Error deleting tag:", err);
    res
      .status(400)
      .json({ message: "Failed to delete tag.", error: err.message });
  }
};
