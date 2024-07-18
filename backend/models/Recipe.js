const mongoose = require('mongoose')

const schema = mongoose.Schema;

const RecipeSchema = new schema ({
    title : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    category : {
        type : schema.Types.ObjectId,
        ref : 'Category',
        required : true,
    }
},{timestamps : true});

module.exports = mongoose.model ("Recipe",RecipeSchema)