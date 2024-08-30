const mongoose = require('mongoose')

const schema = mongoose.Schema;

const RecipeSchema = new schema ({
    title : {
        type : String,
        required : true,
    },
    photo : {
        type : String,
    },
    price : {
        type : String,
        required : true,
    },
    category : {
        type : schema.Types.ObjectId,
        ref : 'Category',
        required : true,
    },
    imgUrl : {
        type : String,
    },
    availability : {
        type : Boolean,
        default : false
    },
    startDate: {
        type: Date,
      },
    endDate: {
        type: Date,
      },
},{timestamps : true});

module.exports = mongoose.model ("Recipe",RecipeSchema)