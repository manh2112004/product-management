const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/index.pug", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Tạo Nhóm quyền",
  });
};
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const records = new Role(req.body);
  await records.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
// [GET] /admin/roles/edit:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit.pug", {
      pageTitle: "Chỉnh sửa Nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [PATCH] /admin/roles/edit:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne({ _id: id }, req.body);
  req.flash("success", "Cập nhật nhóm quyền thành công");
  res.redirect("back");
};
// [GET] /roles/permissions
module.exports.permissions = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions.pug", {
    pageTitle: "Phân quyền",
    records: records,
  });
};
// [PATCH] /roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permission = JSON.parse(req.body.permissions);
  for (const item of permission) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
  }
  req.flash("success", "Cập nhật thành công");
  res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
};
