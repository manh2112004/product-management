const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const controller = require("../../controllers/admin/product-category-controller");
const validate = require("../../validates/admin/validate.product-category");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPath
);
router.patch("/changeStatus/:id/:status", controller.changeStatus);
router.get("/detail/:id", controller.detail);
router.get("/delete/:id", controller.deletePath);
module.exports = router;
