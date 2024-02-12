const fs = require("fs").promises;
const path = require("path");
const devFilePath = path.resolve(__dirname, "../public");

const directoryPath = devFilePath;

const deleteFile = async (fileName) => {
  try {
    const filePath = path.join(directoryPath, fileName);
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Ошибка при удалении файла ${fileName}: ${error.message}`);
  }
};

module.exports = deleteFile;
