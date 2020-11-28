// 管理员的路由
const {
    Goods,
    ShopCar,
    Topic,
    Users
} = require("../db");
const multer = require("multer");
const exp = require("express");
const fs = require("fs");
const { send } = require("process");



const router = exp.Router();
router.use(function (req,res,next) {
    // console.log(req.url)
    if (req.cookies.admin) {
        // console.log(1)
        next();
    } else  if (req.url == "/login" || req.url == "/exit") { 
        next()
    }else {
        res.render("manage/loginM");
    }
})
router.get("/", (req, res) => {
    res.render("manage/indexM");
})

router.get("/shopInfo", (req, res) => {
    if (req.query.id) {
        Goods.findOne({
            _id: req.query.id
        }, (err, data) => {
            if (!err) {
                if (data) {
                    res.render("manage/goodsInfo", {
                        title: "商品修改",
                        goods: data
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
            title: "商品添加",
            goods: {}
        });
    }

})

// 定义商品图片的文件夹
let storage = multer.diskStorage({
    destination: "static/shops",
    filename: function (req, file, cb) {
        // console.log(file);
        let index = file.originalname.lastIndexOf(".");
        let time = Date.now();
        let filename = time + file.originalname.slice(index);
        if (file.fieldname == "imgArr") {
            // console.log(1);
            req.body.imgArr = req.body.imgArr || [];
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
router.post("/insertGoods", upload.single("img"), (req, res) => {
    // console.log(req.body);
    // fs.unlink("static/shops/" + req.body.img);
    let goods = new Goods(req.body);
    goods.save((err, data) => {
        if (!err) {
            // 添加成功
            // console.log(data);
            sendInfo(res, 1, "添加成功", {
                id: data.id
            });
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
    Goods.findOneAndUpdate({
        _id: req.body.id
    }, req.body, (err, data) => {
        if (!err) {
            sendInfo(res, 1, "添加成功", {
                id: data.id
            });
        }
    })
})
router.post("/goodsImgArrtwo", upload.array("imgArrtwo"), (req, res) => {
    // console.log(req.body.id);
    Goods.findOneAndUpdate({
        _id: req.body.id
    }, req.body, (err, data) => {
        if (!err) {
            sendInfo(res, 1, "添加成功", {
                id: data.id
            });
        }
    })
})

// 查看商品
router.get("/goodsInfo", (req, res) => {
    Goods.find((err, data) => {
        if (!err) {
            res.render("./manage/allGoods", {
                data
            });
        } else {
            console.log("商品列表获取失败---goodsInfo");
            console.log(err);
        }
    })
})
// 删除商品
router.get("/deleteGood", (req, res) => {
    Goods.findOne({
        _id: req.query.id
    }, (err, data) => {
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
router.post("/modifyGood", upload.single("img"), (req, res) => {
    // console.log(req.body);
    Goods.findOne({
        _id: req.body.id
    }, (err, data) => {
        if (!err) {
            if (req.body.imgSrc) {
                // 说明修改了
                fs.unlinkSync("./static" + data.imgSrc);
            } else {
                // 说明没有修改
                req.body.imgSrc = data.imgSrc;
            }
            // 更新数据库
            Goods.findOneAndUpdate({
                _id: data.id
            }, req.body, (err) => {
                if (!err) {
                    sendInfo(res, 1, "修改成功", {
                        id: data.id
                    })
                } else {
                    console.log("更新商品表失败---Goods");
                    console.log(err);
                }
            });
        } else {
            console.log("商品列表访问失败---Goods");
            console.log(err);
        }
    })
})
// 修改商品轮播图
router.post("/modiyfImgArr", upload.array("imgArr"), (req, res) => {
    // console.log(req.body);
    Goods.findOne({
        _id: req.body.id
    }, (err, data) => {
        if (!err) {
            req.body.imgArr = req.body.imgArr || [];
            if (req.body.imgArr.length) {
                // 说明有修改
                if (data.imgArr.length) {
                    data.imgArr.forEach(img => {
                        fs.unlinkSync("./static" + img);
                    })
                }
            } else {
                req.body.imgArr = data.imgArr;
            }
            Goods.findOneAndUpdate({
                _id: data.id
            }, req.body, (err) => {
                if (!err) {
                    sendInfo(res, 1, "修改轮播图图片成功", {
                        id: data.id
                    });
                } else {
                    console.log("修改商品轮播图失败---modifyImgArr");
                    console.log(err);
                }
            })
        } else {
            console.log("商品表访问失败---modifImgArr");
            console.log(err);
        }
    })

})
// 修改商品详情图片
router.post("/modifyImgArrTwo", upload.array("imgArrtwo"), (req, res) => {
    // console.log(req.body);
    Goods.findOne({
        _id: req.body.id
    }, (err, data) => {
        if (!err) {
            req.body.imgArrtwo = req.body.imgArrtwo || [];
            if (req.body.imgArrtwo.length) {
                // 说明有修改
                if (data.imgArrtwo.length) {
                    data.imgArrtwo.forEach(img => {
                        fs.unlinkSync("./static" + img);
                    })
                }
            } else {
                req.body.imgArrtwo = data.imgArrtwo;
            }
            Goods.findOneAndUpdate({
                _id: data.id
            }, req.body, (err) => {
                if (!err) {
                    sendInfo(res, 1, "修改详情图片成功", {
                        id: data.id
                    });
                } else {
                    console.log("修改详情图片失败---modifyImgArrtwo");
                    console.log(err);
                }
            })
        } else {
            console.log("商品表访问失败---modifyImgArrtwo");
            console.log(err);
        }
    })

})



// 用户管理
// 添加用户页面
router.get("/addUser", (req, res) => {
    res.render("manage/userInfo", {
        title: "添加用户",
        user: {}
    })
})
// 修改用户界面
router.get("/toModifyUser", (req, res) => {
    // 查找对应的用户
    Users.findOne({
        _id: req.query.id
    }, (err, data) => {
        if (!err) {
            res.render("manage/userInfo", {
                title: "修改用户",
                user: data
            })
        } else {
            console.log("查询用户表失败---toModifyUser")
            console.log(err);
        }
    })
})
let userStorage = multer.diskStorage({
    destination: "static/users",
    filename: function (req, file, cb) {
        // console.log(file);
        let filename = Date.now() + file.originalname;
        req.body.pic = "/users/" + filename;
        cb(null, filename);
    }
})
let userUpload = multer({
    storage: userStorage
})

// 查看用户信息
router.get("/getUsers", (req, res) => {
    // 查看User表
    Users.find((err, data) => {
        if (!err) {
            res.render("manage/allUser", {
                data
            })
        } else {
            console.log("用户表访问失败---getUsers");
            console.log(err);
        }
    })
})
// 添加和修改用户
router.post("/doUser", userUpload.single("pic"), (req, res) => {
    // 保存用户信息
    if (req.body.id) {
        // 说明是修改
        Users.findOne({
            _id: req.body.id
        }, (err, data) => {
            if (!err) {
                // 删除之前的用户头像
                if (data.pic) { 
                    try {
                        if (req.body.pic) {
                            fs.unlinkSync("./static" + data.pic);
                        }
                    }catch{

                    }
                    finally {
                        // 更新数据库
                        Users.findOneAndUpdate({
                            _id: data.id
                        }, req.body, (err) => {
                            if (!err) {
                                sendInfo(res, 1, "修改成功");
                            } else {
                                console.log("数据库更新失败---insertUser1");
                                console.log(err);
                            }
                        })
                        // 更新一下帖子表的用户数据
                        Topic.find({nameId: data.id},(err, topics) => {
                            if (!err) {
                                if (topics.length) {
                                    topics.forEach(topic => {
                                        // console.log(topic)   
                                        Topic.findOneAndUpdate({_id: topic.id}, {name:req.body.name, pic:req.body.pic}, err => {
                                            if (err) {
                                                console.log("帖子表更新失败");
                                                console.log(err);
                                            }
                                        })
                                    })
                                }
                            } else {
                                console.log("帖子表查找失败---douser");
                                console.log(err);
                            }
                        })
                    
                    }


                }
            } else {
                console.log("用户表访问失败---insertUser");
                console.log(err);
            }
        })
    } else {
        // 添加
        Users.findOne({
            name: req.body.name
        }, (err, data) => {
            if (!err) {
                if (data) {
                    // 说明有数据
                    // 删除文件
                    fs.unlinkSync("./static" + req.body.pic);
                    sendInfo(res, 0, "用户已经存在");
                } else {
                    let user = new Users(req.body);
                    user.save(err => {
                        if (!err) {
                            sendInfo(res, 1, "添加用户成功");

                        } else {
                            console.log("添加用户失败----inserUser")
                            console.log(err);
                        }
                    })
                }
            } else {
                console.log("查找用户表失败---douser")
                console.log(err);
            }
        })
    }
})
// 删除用户
router.get("/deleteUser", (req, res) => {
    // 查找对应的用户
    Users.findOne({
        _id: req.query.id
    }, (err, data) => {
        if (!err) {
            if (data.pic) {
                // 头像存在删除
                fs.unlinkSync("./static" + data.pic);
            }
            if (data.img) {
                fs.unlinkSync("./static" + data.img);
            }
            Users.deleteOne({
                _id: data.id
            }, (err) => {
                if (!err) {
                    sendInfo(res, 1, "删除成功");
                } else {
                    console.log("删除用户失败---delteUser");
                    console.log(err);
                }
            })
        } else {
            console.log("用户表查失败---delteUser");
            console.log(err);
        }
    })
})



// 查看所有的帖子
router.get("/allTopics", (req, res) => {
    Topic.find((err, data) => {
        if (!err) {
            res.render("manage/allTopics", {data});
           
        } else {
            console.log("帖子表访问失败---allTopics");
            console.log(err);
        }
    })
});
// 删除帖子
router.get("/deleteTopic", (req, res) => {
    // 找到对应的帖子
    Topic.findOne({_id: req.query.id}, (err ,data) => {
        if (!err) {
            // 删除帖子发布的图片
            fs.unlinkSync("./static/topics/" + data.img);
            Topic.findOneAndDelete({_id: data.id}, err => {
                if (!err) {
                    sendInfo(res, 1, "删除成功");
                } else {
                    console.log("删除帖子失败");
                    console.log(err);
                }
            })
        } else {
            console.log("帖子表访问失败---deleteTopic")
            console.log(err);
        }
    })
})



// 管理员登录
router.post("/login", (req, res) => {
    // console.log(1);
    if (req.body.username == "admin" && req.body.psw == "123456") {
        let time = new Date()
        time.setMonth(time.getMonth() + 1)
        res.cookie("admin", req.body.username, {
            expires:new Date(time)
        })
        sendInfo(res, 1, "登录成功");
    } else {
        sendInfo(res, 0, "登录失败");
    }
})

// 退出登录
router.get("/exit", (req, res) => {

    res.clearCookie("admin");
    sendInfo(res, 1, "退出成功");
})

function sendInfo(res, coder = 0, msg = "", data = null) {
    res.send({
        coder,
        msg,
        data
    })
}


module.exports = router;