const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleLogin = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, picture } = await googleVerify(id_token);
    console.log("::googleUser", email);

    let user = await User.findOne({ email });

    if (!user) {
      // ? Create user from Google
      const data = {
        name,
        email,
        password: "g-pword",
        img: picture,
        google: true,
        role: "USER_ROLE",
      };

      user = new User(data);
      await user.save();
    }

    // ? If the user does not exist on my db
    if (!user.state) {
      return res.status(401).json({
        msg: "User blocked, talk with the administrator",
      });
    }

    // ? Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      msg: "The token could not be processed",
    });
  }
};

const renewToken = async (req = request, res = response) => {
  const { user } = req;

  // ? Create JWT
  const token = await generateJWT(user.id);

  res.json({ user, token });
};

module.exports = {
  login,
  googleLogin,
  renewToken,
};
