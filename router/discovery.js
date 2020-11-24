const exp = require("express");

const router = exp.Router();

router.get("/index", (req, res) => {
    res.render("community");
})


router.get("/shop", (req, res) => {
    res.redirect("/");
})

router.get("/append", (req, res) => {
    res.render("append");
})

router.get("/message",(req, res) => {
    res.render("message");
})

router.get("/me", (req,  res) => {
    res.render("me");
})

// 编辑页面
router.get("/disEdit", (req, res) => {
    res.render("disEdit");
})


module.exports = router;