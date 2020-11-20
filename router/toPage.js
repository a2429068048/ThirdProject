// 页面跳转处理

const exp = require("express");

const router = exp.Router();

// ------- 首页 -------
router.get("/", (req, res) => {
    res.render("index");
})








// 模块导出
module.exports = router;