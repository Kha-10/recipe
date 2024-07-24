const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

const schema = mongoose.Schema;

const UserSchema = new schema ({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    }
});

UserSchema.statics.register = async function (username,email,password) {
    const userExists = await this.findOne({ email });
      if (userExists) {
        throw new Error ("User already exists");
      }
      const salt = await bcrypt.genSalt();
      const hashValue = await bcrypt.hash(password, salt);
      const user = await this.create({
        username,
        email,
        password: hashValue,
      });
    return user
}

module.exports = mongoose.model ("User",UserSchema)