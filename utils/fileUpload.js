const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ServerError = require("../errors/ServerError");
const devFilePath = path.resolve(__dirname, "../public");
const { v4: uuidv4 } = require("uuid");
const deleteFile = require("./deleteFile");
const { imageConversionToWebp } = require("./imageProcessing");
const MAX_SIZE_TXT_FILE = 100 * 1024;

const filePath = devFilePath;

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

const storageImageFiles = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, filePath);
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}.${file.originalname.split(".").pop()}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/gif"].includes(file.mimetype)) {
    cb(null, true);
  } else if (
    file.mimetype === "text/plain" &&
    file.originalname.endsWith(".txt")
  ) {
    cb(null, true);
  } else {
    cb(new ServerError("Invalid file format"), false);
  }
};

const uploadFileMulter = multer({
  storage: storageImageFiles,
  fileFilter: fileFilter,
  limits: 5242880,
}).single("file");

module.exports.uploadFile = async (req, res, next) => {
  uploadFileMulter(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return next(new ServerError(`error`));
    } else if (err) {
      return next(
        new ServerError("the file must be in jpeg, jpg, png or txt format")
      );
    }

    if (req.file) {
      try {
        if (req.file.mimetype !== "text/plain") {
          const inputFilePath = req.file.path;
          const outputFileName = `${req.file.filename.split(".").shift()}.webp`;
          const outputFilePath = path.join(
            req.file.destination,
            outputFileName
          );

          await imageConversionToWebp(inputFilePath, outputFilePath);
          await deleteFile(req.file.filename);
          req.file.filename = outputFileName;
        }
        if (
          req.file.mimetype === "text/plain" &&
          req.file.size > MAX_SIZE_TXT_FILE
        ) {
          await deleteFile(req.file.filename);
          return next(
            new ServerError(`file file is over ${MAX_SIZE_TXT_FILE} bytes`)
          );
        }
      } catch (error) {
        await deleteFile(req.file.filename);
        return next(new ServerError("file error"));
      }
    }

    return next();
  });
};
