const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFileHelper = (
  files,
  validExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const splitedName = file.name.split(".");
    const fileExtension = splitedName[splitedName.length - 1];

    if (!validExtensions.includes(fileExtension)) {
      return reject({
        msg: `The extension ${fileExtension} is not allowed, we expect the following extensions: ${validExtensions}`,
      });
    }

    const fileName = uuidv4() + "." + fileExtension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, fileName);

    file.mv(uploadPath, (error) => {
      if (error) {
        return reject(error);
      }

      resolve(fileName);
    });
  });
};

module.exports = {
  uploadFileHelper,
};
