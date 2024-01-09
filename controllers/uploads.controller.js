const uploadController = async function (req, res, next) {
  console.log("\n req.file...", req.file);
  try {
    const image = req.file;
    if (image) {
      console.log("path", req.file.path);
      return res.json({
        file: req.file,
      });
    } else {
      return next({
        status: 400,
        message: "No file for upload",
      });
    }
  } catch (error) {
    console.log("upload error:", error);
    return res.json({
      message: error,
    });
  }
};
module.exports = {
  uploadController,
};
