const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware.js");
const dashboardRoutes = require("./dashboard-route.js");
const productRoutes = require("./product-route.js");
const productCategoryRoutes = require("./product-category-route.js");
const roleRoutes = require("./role-router.js");
const accountRoutes = require("./account-router.js");
const authRoutes = require("./auth-router.js");
const myAccountRoutes = require("./my-account-router.js");
const settingRoutes = require("../../routes/admin/setting-router.js");
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes
  );
  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);
  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRoutes
  );
  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
  app.use(PATH_ADMIN + "/auth", authRoutes);
  app.use(
    PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myAccountRoutes
  );
  app.use(PATH_ADMIN + "/setting", authMiddleware.requireAuth, settingRoutes);
};
