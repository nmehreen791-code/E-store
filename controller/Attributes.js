const { Attribute } = require("../modle/Attributes");

exports.addAttribute = async (req, res) => {
  const { id } = req.user;
  const { name, values } = req.body;

  try {
    const newAttribute = new Attribute({
      name,
      values,
      userId: id,
    });

    await newAttribute.save();
    res.status(201).json(newAttribute);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.getAttributes = async (req, res) => {
  const { id } = req.user;

  try {
    const attributes = await Attribute.find({ userId: id });

    if (!attributes.length) {
      return res.status(404).json({ message: "No attributes found." });
    }

    const totalAttribute = await Attribute.countDocuments();

    res.set("X-Total-Count", totalAttribute);

    res.status(200).json(attributes);
  } catch (error) {
    console.error("Error fetching attributes:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.deleteAttribute = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAttribute = await Attribute.findByIdAndDelete(id);
    if (!deletedAttribute) {
      return res.status(404).json({ error: "Attribute not found." });
    }
    res.status(200).json({ message: "Attribute deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.updateAttribute = async (req, res) => {
  const { id } = req.params;
  const { name, values } = req.body;

  try {
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      id,
      { name, values },
      { new: true, runValidators: true }
    );

    if (!updatedAttribute) {
      return res.status(404).json({ error: "Attribute not found." });
    }

    res.status(200).json(updatedAttribute);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};
