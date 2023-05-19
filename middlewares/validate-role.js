const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Trying to validate role without reading the token",
    });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not authorized to make this action`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Trying to validate role without reading the token",
      });
    }

    const { role } = req.user;

    if (!roles.includes(role)) {
      return res.status(401).json({
        msg: `This service require a user with one of this roles ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
