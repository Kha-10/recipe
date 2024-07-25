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
        return res.status(400).json({error : error.message})
    }
  },
  login: async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000})
        return res.json({user,token});
      } catch (error) {
          return res.status(400).json({error : error.message})
      }
  },
};

module.exports = UsersController;
