const User = require("../models/User");
const createToken = require("../helpers/createJwt")

const UsersController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.register(username,email,password);
      const token = createToken(user._id);
      res.cookie('jwt',token,{httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000})
      return res.json({user,token});
    } catch (error) {
        return res.json({error : error.message})
    }
  },
  login: (req, res) => {
    return res.json({ msg: "login api hit" });
  },
};

module.exports = UsersController;
