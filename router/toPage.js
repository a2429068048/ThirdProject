// 页面跳转处理

const exp = require("express");

const router = exp.Router();

// ------- 首页 -------
router.get("/", (req, res) => {
    res.render("index");
})



//------- 发现 ---------
router.get("/discovery", (req, res) => {
    res.render("discovery");
})

//------- 社区 ----------
router.get("/community", (req, res) => {
    res.render("community");
})







// 模块导出
module.exports = router;