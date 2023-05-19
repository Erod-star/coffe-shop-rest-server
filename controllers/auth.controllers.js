const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // ? Validate email exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User / Password not correct - ::email::",
      });
    }

    // ? Validate user is active
    if (!user.state) {
      return res.status(400).json({
        msg: "User / Password not correct - ::state::",
      });
    }

    // ? Validate email
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User / Password not correct - ::password::",
      });
    }

    // ? Create JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Talk with the administrator",
    });
  }
};

module.exports = {
  login,
};
