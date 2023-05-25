const path = require("path");
const fs = require("fs");

const { response, request } = require("express");
const cloudinary = require("cloudinary").v2;

const { uploadFileHelper } = require("../helpers");

const { User, Product } = require("../models");

cloudinary.config(process.env.CLOUDINARY_URL);
const placeholderPath = path.join(__dirname, "../assets/no-image.jpg");

const uploadFile = async (req = request, res = response) => {
  try {
    // const name = await uploadFileHelper(req.files, ["txt", "md"], "texts");
    const name = await uploadFileHelper(req.files, undefined, "imgs");
    res.json({ name });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

// ? Function reference
const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is not an user with the id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is not a product with the id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "This collection wasn't founded" });
  }

  // ? Clean previous images
  if (model.img) {
    const imagePath = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const name = await uploadFileHelper(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

const updateImageCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is not an user with the id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is not a product with the id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "This collection wasn't founded" });
  }

  // ? Clean previous images
  if (model.img) {
    const imageNameArr = model.img.split("/");
    const imageName = imageNameArr[imageNameArr.length - 1];
    const [public_id] = imageName.split(".");
    await cloudinary.uploader.destroy(public_id);
  }
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json(model);
};

const getImageById = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) res.json({ img: placeholderPath });
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) res.json({ img: placeholderPath });
      break;

    default:
      res.json({ img: placeholderPath });
  }

  if (model.img) {
    return res.json({ img: model.img });
  }
  res.json({ img: placeholderPath });
};

module.exports = {
  uploadFile,
  updateImage,
  getImageById,
  updateImageCloudinary,
};
