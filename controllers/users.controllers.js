const { request, response } = require("express");

const getUsers = (req = request, res = response) => {
  const { q, name = "No name", page = "1", limit } = req.query;

  res.json({
    msg: "get API - Controller",
    q,
    name,
    page,
    limit,
  });
};

const postUsers = (req, res = response) => {
  const { name, age } = req.body;

  res.json({
    msg: "post API - Controller",
    name,
    age,
  });
};

const putUsers = (req, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "put API - Controller",
    id,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "patch API - Controller",
  });
};

const deleteUsers = (req, res = response) => {
  res.json({
    msg: "delete API - Controller",
  });
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
};
