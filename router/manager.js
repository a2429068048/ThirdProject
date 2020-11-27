// 管理员的路由
const {Goods} = require("../db");
const multer = require("multer");
const exp = require("express");
const fs = require("fs");



const router = exp.Router();

router.get("/", (req, res) => {
    res.render("manage/indexM");
})

router.get("/addGoods", (req, res) => {
    res.render("manage/addGoods");
})

// 定义商品图片的文件夹
let storage = multer.diskStorage({
    destination:"static/shops",
    filename:function (req, file, cb) {
        let index = file.originalname.lastIndexOf(".");
        let time = Date.now();
        let filename = time + file.originalname.slice(index);
        req.body.img = "/static/shops/" + filename;
        cb(null, filename);
    }
})
let upload = multer({
    storage
})
//添加商品
router.post("/insertGoods",upload.single("img"), (req, res) => {
    console.log(req.body);
    // fs.unlink("static/shops/" + req.body.img);
    let goods = new Goods(req.body);
    goods.save(err => {
        if (!err) {
            // 添加成功
            sendInfo(res, 1, "添加成功");
        } else {
            sendInfo(res, 0, "添加失败");
            console.log(err);
        }
    })
   
})

function sendInfo(res, coder=0, msg="", data=null) {
    res.send({coder, msg, data})
}


module.exports = router;