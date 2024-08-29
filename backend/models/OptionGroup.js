const mongoose = require('mongoose')

const schema = mongoose.Schema;

const OptionsSchema = new schema ({
    name : {
        type : String,
        required : true,
    },
    price : {
        type : String,
        required : true,
    }
});

const OptionGroupSchema = new schema ({
    title : {
        type : String,
        required : true,
    },
    options : [OptionsSchema],
    fixedOptionValue : {
        type : String,
    },
    type :{
        type : String,
    },
    exactly : {
        type : Number,
    },
    between : {
        type : Number,
    },
    upto : {
        type : Number
    }
},{timestamps : true});

module.exports = mongoose.model ("OptionGroup",OptionGroupSchema)