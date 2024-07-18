const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

const RecipesController = {
  index: async (req, res) => {
    try {
      const recipe = await Recipe.find()
        .populate("category")
        .sort({ createdAt: -1 });
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internrt Server Error" });
    }
  },
  store: async (req, res) => {
    const { title, price, category } = req.body;
    const recipe = await Recipe.create({
      title,
      price,
      category,
    });
    return res.json(recipe);
  },
  show: async (req, res) => {
    try {
      let id = req.params.id;
      console.log(req.params);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }
      let recipe;

      recipe = await Recipe.findById(id).populate("category");
      if (recipe) {
        return res.json(recipe);
      }

      recipe = await Recipe.find({ category: id }).populate("category");
      if (recipe) {
        return res.json(recipe);
      }

      return res.status(404).json({ msg: "Recipe not found" });
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
      let recipe = await Recipe.findByIdAndDelete(id);
      if (!recipe) {
        return res.status(404).json({ msg: "recipe not found" });
      }
      return res.json(recipe);
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
      let recipe = await Recipe.findByIdAndUpdate(id, {
        ...req.body,
      });
      if (!recipe) {
        return res.status(404).json({ msg: "recipe not found" });
      }
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internrt Server Error" });
    }
  },
};

module.exports = RecipesController;
