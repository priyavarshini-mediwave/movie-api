const express = require("express");
const router = express.Router();
const { multerupload } = require("../middlewares/multerupload.middleware");
const { uploadController } = require("../controllers/uploads.controller");
router.post("/upload", multerupload("").single("file"), uploadController);
module.exports = router;
