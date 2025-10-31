const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order-controller");
router.get("/", controller.index);
router.get("/:status", controller.changeStatus);
router.patch("/confirm/:id", controller.confirmOrder);
router.get("/detail/:id", controller.detail);
router.patch("/cancel/:id", controller.cancelOrder);
module.exports = router;
