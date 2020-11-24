

let {Users} = require("../db")
const mult = require("multer");
const fs = require("fs");


let storagePic = mult.diskStorage({
    destination:"static/users",
    filename:function(req, files, callback) {
        modifyImg(req, files, callback, "pic");
    }
})
let storageImg = mult.diskStorage({
    destination:"static/users",
    filename:function (req, files, callback) {
        modifyImg(req, files, callback, "img");
    }
})
let upload = mult({
    storage:storagePic
})
let imgLoad = mult({
    storage:storageImg
})

function modifyImg (req,files, callback, type) {
    // 先找到手机号
    Users.findOne({name:req.cookies.username},(err, data) => {
        if (!err && data) {
            fs.readdir("static/users",(err, item) => {
                // console.log(item)
                console.log(data._id)
                item.map(file => {
                    if (file.split(".").shift() == data._id+type) {
                        // 说明文件已经存在
                        try {
                            fs.unlinkSync(`static/users/${file}`);
                        }catch {
                            console.log("头像删除失败")
                        }
                        return true;
                    }
                });
                let name = data._id +type+ "." + files.originalname.split(".").pop();
                // console.log(name, "头像名称");
                req.body[type] = "/users/" + name;
                // console.log(1)
                callback(null, name);
            })
        }else {
            console.log(err);
            console.log("查到的用户数据为空")
        }
    }).lean();
    
}


let infoObj = {
    coder:0,
    msg:"",
    data:null,
}

function sendInfo(res, coder=0, msg="", data=null) {
    infoObj.coder = coder;
    infoObj.msg = msg;
    infoObj.data = data;
    res.send(infoObj);
    infoObj = {
        coder:0,
        msg:"",
        data:null,
    }
}

const exp = require("express");
const { info } = require("console");

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
    Users.findOne({name:req.cookies.username}, (err, data) => {
        if (!err) {
            // console.log(data, 27);
            res.render("me", data)
        }else {
            console.log(err);
        }
    }).lean();
})

// 编辑页面
router.get("/disEdit", (req, res) => {
    Users.findOne({name:req.cookies.username}, (err, data) => {
        if (!err) {
            // console.log(data, 39);
            res.render("disEdit", data)
        }else {
            console.log(err);
        }
    }).lean();
})
router.post("/editPic", upload.single("pic"), (req, res) => {
//    console.log(req.body);
   Users.updateOne({name: req.cookies.username},req.body,(err) => {
       if (!err) {
           // 
           sendInfo(res, 1, "更新成功")
       }else {
           console.log(err);
           console.log("用户信息更新失败");
       }
   })
} )
router.post("/editImg", imgLoad.single("img"), (req, res) => {
    // console.log(req.body)
    Users.updateOne({name: req.cookies.username},req.body,(err) => {
        if (!err) {
            // 
            sendInfo(res, 1,"更新成功")
        }else {
            console.log(err);
            console.log("用户信息更新失败");
        }
    })
})
// 修改名字
router.get("/editName", (req, res) => {
    // console.log(req.query)
    // 先查找到是否重名了
    Users.findOne(req.query, (err, data)=> {
        if (!err) {
            if (data) {
                // 说明名字重复，提示用户
                sendInfo(res, 0, "用户名已经存在");
            } else {
                // 说明名字不存在
                Users.findOneAndUpdate(req.cookies.username, req.query, (err, data) => {
                    if (!err) {
                        res.cookie("username", req.query.name);
                        sendInfo(res, 1, "修改成功");
                    }else {
                        console.log(err);
                        sendInfo(res, 0, "修改失败");
                    }
                }) 
            }
        } else {
            console.log("查找名字")
            console.log(err);
        }
    })
})
// 修改个人简介
router.post("/editSelf", (req, res) => {
    console.log(req.body);
    Users.findOneAndUpdate({name: req.cookies.username}, req.body, (err, data) => {
        if (!err) {
            sendInfo(res, 1, "修改成功");
        } else {
            console.log(err);
            console.log("修改个人简介失败");
            sendInfo(res, 0, "修改失败");
        }
    })
})




module.exports = router;