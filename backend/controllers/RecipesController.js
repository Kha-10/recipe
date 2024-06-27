const Recipe = require("../models/Recipe")
const mongoose = require ("mongoose")

const RecipesController = {
    index : async(req,res) => {
       try {
        const recipe = await Recipe.find().sort({createdAt : -1})
        return res.json(recipe)
       } catch (error) {
        return res.status(500).json({msg : "Internrt Server Error"})
       }
    },
    store : async(req,res) => {
        const {title,description,ingredients} = req.body
        const recipe = await Recipe.create({
        title,
        description,
        ingredients
        })
        return res.json(recipe)
    },
    show : async(req,res) => {
        try {
            let id = req.params.id
            if(!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({msg : "Invalid id"})
            }
            let recipe = await Recipe.findById(id)
            if(!recipe) {
             return res.status(404).json({msg : "recipe not found"})
            }
            return res.json(recipe)
        } catch (error) {
            return res.status(500).json({msg : "Internrt Server Error"})
        }
    },
    destroy : async(req,res) => {
        try {
            let id = req.params.id
            if(!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({msg : "Invalid id"})
            }
            let recipe = await Recipe.findByIdAndDelete(id)
            if(!recipe) {
             return res.status(404).json({msg : "recipe not found"})
            }
            return res.json(recipe)
        } catch (error) {
            return res.status(500).json({msg : "Internrt Server Error"})
        }
    },
    update : async(req,res) => {
        try {
            let id = req.params.id
            if(!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({msg : "Invalid id"})
            }
            let recipe = await Recipe.findByIdAndUpdate(id)
            if(!recipe) {
             return res.status(404).json({msg : "recipe not found"})
            }
            return res.json(recipe)
        } catch (error) {
            return res.status(500).json({msg : "Internrt Server Error"})
        }
    },
}

module.exports = RecipesController