// 管理员的路由
const {Goods, ShopCar, Topic} = require("../db");
const multer = require("multer");
const exp = require("express");
const fs = require("fs");



const router = exp.Router();

router.get("/", (req, res) => {
    res.render("manage/indexM");
})

router.get("/shopInfo", (req, res) => {
   if (req.query.id) {
        Goods.findOne({_id:req.query.id}, (err, data) => {
            if (!err){
                if (data){
                    res.render("manage/goodsInfo", {
                        title: "商品修改",
                        goods:data
                    })
                } 
            } else {
                
                console.log("商品表展示失败");
                console.log(req.query.id)
                console.log(err);
            }
        })
   } else {
        res.render("manage/goodsInfo", {
            title:"商品添加",
            goods:{}
        });
   }
   
})

// 定义商品图片的文件夹
let storage = multer.diskStorage({
    destination:"static/shops",
    filename:function (req, file, cb) {
        // console.log(file);
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

// 查看商品
router.get("/goodsInfo", (req, res) => {
    Goods.find((err, data) => {
        if (!err) {
            res.render("./manage/allGoods", {data});
        } else {
            console.log("商品列表获取失败---goodsInfo");
            console.log(err);
        }
    })
})
// 删除商品
router.get("/deleteGood", (req, res) => {
    Goods.findOne({_id: req.query.id}, (err, data) => {
        if (!err) {
            // 删除文件
            fs.unlink("./static" + data.imgSrc, err => err && console.log(err));
            if (data.imgArr && data.imgArr.length) {
                data.imgArr.forEach(img => {
                    fs.unlink("./static" + img, (err) => err && console.log(err))
                }) 
            }
            if (data.imgArrtwo && data.imgArrtwo.length) {
                data.imgArrtwo.forEach(img => {
                    fs.unlink("./static" + img, (err) => err && console.log(err))
                }) 
            }
            Goods.deleteOne(data, err => {
                if (!err) {
                    // 删除购物车内容
                    
                    sendInfo(res, 1, "删除成功");
                } else {
                    console.log("用户表删除失败---deleteGood")
                    console.log(err);
                }
            });
        
        } else {
            console.log("商品信息表获取失败---deleteGood");
            console.log(err);
        }
    })
})

// 修改商品
router.get("/modifyGood", (req, res) => {

})

function sendInfo(res, coder=0, msg="", data=null) {
    res.send({coder, msg, data})
}


module.exports = router;