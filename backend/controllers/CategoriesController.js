const Category = require("../models/Category")
const mongoose = require ("mongoose")

const CategoriesController = {
    index : async(req,res) => {
       try {
        const category = await Category.find().sort({createdAt : -1})
        return res.json(category)
       } catch (error) {
        return res.status(500).json({msg : "Internrt Server Error"})
       }
    },
    store : async(req,res) => {
        const {title} = req.body
        const categories = await Category.create({
        title
        })
        return res.json(categories)
    },
    show : async(req,res) => {
        try {
            let id = req.params.id
            if(!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({msg : "Invalid id"})
            }
            let category = await Category.findById(id)
            if(!category) {
             return res.status(404).json({msg : "category not found"})
            }
            return res.json(category)
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
            let category = await Category.findByIdAndDelete(id)
            if(!category) {
             return res.status(404).json({msg : "category not found"})
            }
            return res.json(category)
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
            let category = await Category.findByIdAndUpdate(id,{
                ...req.body
            })
            if(!category) {
             return res.status(404).json({msg : "category not found"})
            }
            return res.json(category)
        } catch (error) {
            return res.status(500).json({msg : "Internrt Server Error"})
        }
    },
}

module.exports = CategoriesController