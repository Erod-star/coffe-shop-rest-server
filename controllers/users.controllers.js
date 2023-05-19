const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  // ? Promise.all trabaja todas las peticiones asincronas de una sola vez
  // ? en lugar de esperar una por una. Es util para utilizarla cuando se
  // ? quieren hacer multiples promesas a la vez que no dependan unas de otras

  // const users = await User.find(query).limit(Number(limit)).skip(Number(from));
  // const total = await User.countDocuments(query);

  // const resp = await Promise.all([
  //   User.countDocuments(query),
  //   User.find(query).limit(Number(limit)).skip(Number(from)),
  // ]);
  // res.json({ resp });

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(Number(limit)).skip(Number(from)),
  ]);
  res.json({ total, users });
};

const postUsers = async (req, res = response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // ? Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // ? Store in database
    await user.save();

    res.json({
      msg: "post API - Controller",
      user,
    });
  } catch (error) {
    console.log("::Error creating user");
    console.log(error);
  }
};

const putUsers = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  // TODO: Validate Id with database
  if (password) {
    // ? Encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json(user);
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "patch API - Controller",
  });
};

const deleteUsers = async (req = request, res = response) => {
  const { id } = req.params;

  // ? Delete user physically
  // const user = await User.findByIdAndDelete(id);

  // ? Delete user state
  const user = await User.findByIdAndUpdate(id, { state: false });
  const authUser = req.user;

  res.json({ user, authUser });
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
};
