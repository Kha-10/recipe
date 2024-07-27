const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
const fs = require('fs').promises
const removeFile = require('../helpers/removeFile')

const RecipesController = {
  index: async (req, res) => {
    try {
      let limit = 6;
      const page = req.query.page || 1;
      const recipe = await Recipe.find()
        .populate("category")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      let totalPages = await Recipe.countDocuments();
      let totalPagesCount = Math.ceil(totalPages / limit);

      let pagination = {
        isNextPage: totalPagesCount == page ? false : true,
        isPreviousPage: page == 1 ? false : true,
        currentPage: page,
        links: [],
      };

      for (let index = 0; index < totalPagesCount; index++) {
        let number = index + 1;
        pagination.links.push({ number });
      }

      let response = {
        data: recipe,
        pagination,
      };
      return res.json(response);
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

      let path = __dirname+'/../public'+recipe.photo;
      await removeFile(path)
      
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

      let path = __dirname+'/../public'+recipe.photo;
      await removeFile(path)

      if (!recipe) {
        return res.status(404).json({ msg: "recipe not found" });
      }
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internrt Server Error" });
    }
  },
  upload: async (req, res) => {
    try {
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ msg: "Invalid id" });
        }
        let recipe = await Recipe.findByIdAndUpdate(id, {
          photo : '/' + req.file.filename
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