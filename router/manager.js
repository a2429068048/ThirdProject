// 管理员的路由
const {Goods, ShopCar} = require("../db");
const multer = require("multer");
const exp = require("express");
const fs = require("fs");



const router = exp.Router();

router.get("/", (req, res) => {
    res.render("manage/indexM");
})

router.get("/addGoods", (req, res) => {
    res.render("manage/goodsInfo", {
        title:"商品添加",
        goods:{}
    });
})

// 定义商品图片的文件夹
let storage = multer.diskStorage({
    destination:"static/shops",
    filename:function (req, file, cb) {
        console.log(file);
        let index = file.originalname.lastIndexOf(".");
        let time = Date.now();
        let filename = time + file.originalname.slice(index);
        if (file.fieldname == "imgArr") {
            // console.log(1);
            req.body.imgArr = req.body.imgArr|| [];
            req.body.imgArr.push("/shops/" + filename);
        } else if (file.fieldname == "imgArrtwo") {
            req.body.imgArrtwo = req.body.imgArrtwo || [];
            req.body.imgArrtwo.push("/shops/" + filename);
        } else {
            req.body.imgSrc = "/shops/" + filename;
        }
        
        cb(null, filename);
    }
})
let upload = multer({
    storage
})
// 添加商品
router.post("/insertGoods",upload.single("img"), (req, res) => {
    // console.log(req.body);
    // fs.unlink("static/shops/" + req.body.img);
    let goods = new Goods(req.body);
    goods.save((err,data)=> {
        if (!err) {
            // 添加成功
            // console.log(data);
            sendInfo(res, 1, "添加成功",{id : data.id});
        } else {
            sendInfo(res, 0, "添加失败");
            console.log(err);
        }
    })
   
})
// 添加轮播图图片
router.post("/insertImgArr", upload.array("imgArr"), (req, res) => {
    // console.log(req.body)
    // console.log(req.body.id);
    Goods.findOneAndUpdate({_id: req.body.id}, req.body, (err, data) => {
        if (!err) {
            sendInfo(res, 1, "添加成功",{id : data.id});
        }
    })
})
router.post("/goodsImgArrtwo", upload.array("imgArrtwo"), (req, res) => {
    // console.log(req.body.id);
    Goods.findOneAndUpdate({_id: req.body.id}, req.body, (err, data) => {
        if (!err) {
            sendInfo(res, 1, "添加成功",{id : data.id});
        }
    })
})

function sendInfo(res, coder=0, msg="", data=null) {
    res.send({coder, msg, data})
}


module.exports = router;