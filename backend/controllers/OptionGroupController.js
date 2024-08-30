const OptionGroup = require("../models/OptionGroup");
const mongoose = require("mongoose");

const OptionGroupController = {
  index: async (req, res) => {
    try {
      const { query } = req.query;

      let optionGroup;

      if (query) {
        optionGroup = await OptionGroup.find({ title: new RegExp(query, "i") }).sort({
          createdAt: -1,
        });
      } else {
        optionGroup = await OptionGroup.find().sort({ createdAt: -1 });
      }

      return res.json(optionGroup);
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  store: async (req, res) => {
    try {
      const { title, options, fixedOptionValue, type, exactly, between, upto } =
        req.body;

      const optionData = {
        title,
        options,
        ...(type && { type }),
        ...(fixedOptionValue && { fixedOptionValue }),
        ...(exactly && { exactly }),
        ...(between && { between }),
        ...(upto && { upto }),
      };

      const optionGroup = await OptionGroup.create(optionData);

      return res.json(optionGroup);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Internal Server Error", error: error.message });
    }
  },

  show: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }
      let optionGroup = await OptionGroup.findById(id);
      if (!optionGroup) {
        return res.status(404).json({ msg: "optionGroup not found" });
      }
      return res.json(optionGroup);
    } catch (error) {
      return res.status(500).json({ msg: "Internrt Server Error" });
    }
  },
  destroy: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }
      let category = await OptionGroup.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ msg: "category not found" });
      }
      return res.json(category);
    } catch (error) {
      return res.status(500).json({ msg: "Internrt Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }
      let optionGroup = await OptionGroup.findByIdAndUpdate(id, {
        ...req.body,
      });
      if (!optionGroup) {
        return res.status(404).json({ msg: "optionGroup not found" });
      }
      return res.json(optionGroup);
    } catch (error) {
      return res.status(500).json({ msg: "Internrt Server Error" });
    }
  },
};

module.exports = OptionGroupController;
