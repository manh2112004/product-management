const Account = require("../models/account.model");
async function attachUserNames(records) {
  if (!Array.isArray(records)) return;
  await Promise.all(
    records.map(async (item) => {
      if (item.createdBy?.account_id) {
        const user = await Account.findById(item.createdBy.account_id);
        if (user) item.accountFullName = user.fullName;
      }
      const updatedBy = item.updatedBy?.slice(-1)[0];
      if (updatedBy?.account_id) {
        const userUpdated = await Account.findById(updatedBy.account_id);
        if (userUpdated) updatedBy.accountFullName = userUpdated.fullName;
      }
      if (item.children && item.children.length > 0) {
        await attachUserNames(item.children);
      }
    })
  );
}
module.exports = { attachUserNames };
