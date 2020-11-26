let {
    Users,
    Topic
} = require("../db")
const mult = require("multer");
const fs = require("fs");


let storagePic = mult.diskStorage({
    destination: "static/users",
    filename: function (req, files, callback) {
        modifyImg(req, files, callback, "pic");
    }
})
let storageImg = mult.diskStorage({
    destination: "static/users",
    filename: function (req, files, callback) {
        modifyImg(req, files, callback, "img");
    }
})
let upload = mult({
    storage: storagePic
})
let imgLoad = mult({
    storage: storageImg
})

function modifyImg(req, files, callback, type) {
    // 先找到手机号
    Users.findOne({
        name: req.cookies.username
    }, (err, data) => {
        if (!err && data) {
            fs.readdir("static/users", (err, item) => {
                // console.log(item)
                console.log(data._id)
                item.map(file => {
                    if (file.split(".").shift() == data._id + type) {
                        // 说明文件已经存在
                        try {
                            fs.unlinkSync(`static/users/${file}`);
                        } catch {
                            console.log("头像删除失败")
                        }
                        return true;
                    }
                });
                let name = data._id + type + "." + files.originalname.split(".").pop();
                // console.log(name, "头像名称");
                req.body[type] = "/users/" + name;
                // console.log(1)
                callback(null, name);
            })
        } else {
            console.log(err);
            console.log("查到的用户数据为空")
        }
    }).lean();

}


let infoObj = {
    coder: 0,
    msg: "",
    data: null,
}

function sendInfo(res, coder = 0, msg = "", data = null) {
    infoObj.coder = coder;
    infoObj.msg = msg;
    infoObj.data = data;
    res.send(infoObj);
    infoObj = {
        coder: 0,
        msg: "",
        data: null,
    }
}

const exp = require("express");
const {
    info, time
} = require("console");
const { mongo, Mongoose } = require("mongoose");
const { send } = require("process");

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

router.get("/message", (req, res) => {
    res.render("message");
})

router.get("/me", (req, res) => {
    Users.findOne({
        name: req.cookies.username
    }, (err, data) => {
        if (!err) {
            // console.log(data, 27);
            res.render("me", data)
        } else {
            console.log(err);
        }
    }).lean();
})

// 编辑页面
router.get("/disEdit", (req, res) => {
    Users.findOne({
        name: req.cookies.username
    }, (err, data) => {
        if (!err) {
            // console.log(data, 39);
            res.render("disEdit", data)
        } else {
            console.log(err);
        }
    }).lean();
})
router.post("/editPic", upload.single("pic"), (req, res) => {
    //    console.log(req.body);
    Users.updateOne({
        name: req.cookies.username
    }, req.body, (err) => {
        if (!err) {
            // 
            sendInfo(res, 1, "更新成功")
        } else {
            console.log(err);
            console.log("用户信息更新失败");
        }
    })
})
router.post("/editImg", imgLoad.single("img"), (req, res) => {
    // console.log(req.body)
    Users.updateOne({
        name: req.cookies.username
    }, req.body, (err) => {
        if (!err) {
            // 
            sendInfo(res, 1, "更新成功")
        } else {
            console.log(err);
            console.log("用户信息更新失败");
        }
    })
})
// 修改名字
router.get("/editName", (req, res) => {
    // console.log(req.query)
    // 先查找到是否重名了
    Users.findOne(req.query, (err, data) => {
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
                    } else {
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
    Users.findOneAndUpdate({
        name: req.cookies.username
    }, req.body, (err, data) => {
        if (!err) {
            sendInfo(res, 1, "修改成功");
        } else {
            console.log(err);
            console.log("修改个人简介失败");
            sendInfo(res, 0, "修改失败");
        }
    })
})


// 关注列表
router.get("/myfolow", (req, res) => {
    // 查找数据
    Users.findOne({
        name: req.cookies.username
    }, async (err, data) => {
        if (!err) {
            // console.log(1)
            let arr = []
            if (data.like && data.like.length) {
                data.like.forEach((user, index) => {
                    Users.findOne({
                        _id: user
                    }, (err, info) => {
                        if (!err) {
                            info.status = 1;
                            arr.push(info);
                        } else {
                            console.log(err);
                            console.log("关注列表遍历查找失败");
                        }
                        if (index == data.like.length - 1) {
                            // console.log(arr);
                            res.render("myFolow", {
                                data: arr
                            });
                        }
                    })
                })
            } else {
                res.render("myFolow", {
                    data: arr
                });
            }


        } else {
            console.log(err);
            console.log("查找失败")
        }
    })

})
// 移除关注
router.get("/removeLike", (req, res) => {
    Users.findOne({
        name: req.cookies.username
    }, (err, data) => {
        let id = data.id;
        if (!err) {
            data.like = data.like.filter(item => {
                if (item != req.query.id) {
                    return item;
                }
            })
            // console.log(data);
            Users.findOneAndUpdate({
                name: req.cookies.username
            }, data, err => {
                if (!err) {
                    // 查找关联表
                    Users.findOne({
                        _id: req.query.id
                    }, (err, data) => {
                        if (!err) {
                            data.flowme = data.flowme.filter(item => {
                                if (item != id) {
                                    return item;
                                }
                            });
                            Users.update({
                                _id: req.query.id
                            }, data, err => {
                                if (!err) {
                                    sendInfo(res, 1, "取消关注")
                                }
                            })
                        }
                    })
                } else {
                    console.log(err);
                    console.log("取消关注失败");
                }
            })
        } else {
            console.log(err);
            console.log("查找数据库失败--移除关注");
        }
    })
});
// 添加关注
router.get("/addLike", (req, res) => {
    Users.findOne({
        name: req.cookies.username
    }, (err, data) => {
        if (!err) {
            let id = data.id;
            data.like = data.like || [];
            if (!data.like.includes(req.query.id)) {
                data.like.push(req.query.id);
            }
            Users.findOneAndUpdate({
                name: req.cookies.username
            }, data, err => {
                if (!err) {
                    // 修改关注的对象的fllowme
                    Users.findOne({
                        _id: req.query.id
                    }, (err, data) => {
                        if (!err) {
                            data.flowme = data.flowme || [];
                            if (!data.flowme.includes(id)) {
                                data.flowme.push(id);
                            }
                            Users.findOneAndUpdate({
                                    _id: req.query.id
                                },data, err=> {
                                    if (!err) {
                                        sendInfo(res, 1, "添加关注");
                                    } else {
                                        console.log(err);
                                        console.log("更新对象失败2---addLike")
                                    }
                                })
                            
                        } else {
                            console.log(err);
                            console.log("更新对象失败1---addLike")
                        }
                    })

                } else {
                    console.log(err)
                    console.log("添加关注失败")
                }
            })
        } else {
            console.log(err)
            console.log("查找数据库失败---添加关注");
        }
    })
})
// 关注我列表
router.get("/flowme", (req, res) => {
    // 遍历自己的数组
    Users.findOne({
        name: req.cookies.username
    }, (err, data) => {
        let id = data.id;
        let me = data;
        if (!err) {
            let arr = [];
            // 遍历关注的我的
            if (data.flowme && data.flowme.length) {
                data.flowme.forEach((fuser, index) => {
                    // 查找对应关注人的信息
                    Users.findOne({
                        _id: fuser
                    }, (err, user) => {
                        if (!err) {
                            if (user.flowme.includes(id) && me.like.includes(user.id)) {
                                // 说明互相关注
                                user.status = 1;
                            }
                            arr.push(user);
                        } else {
                            console.log("数据库查询失败----/flowme-2")
                            console.log(err);
                        }
                        if (index == data.flowme.length - 1) {
                            res.render("myFolow", {
                                data: arr
                            })
                        }
                    })
                })
            } else {
                res.render("myFolow", {
                    data: arr
                })
            }
        } else {
            console.log("数据库查询失败----/flowme-1")
            console.log(err);
        }
    })
})
// 获得我的贴子
router.get("/topic", (req, res) => {
    // console.log(req.query);
    // 查找我的帖子
    Topic.find({nameId: req.query.id}, (err, data) => {
        // console.log(data);
        if (!err) {
            // 更新名字和头像
            if (data.length) {
                data.forEach((info, index) => {
                    Users.findOne({_id: info.nameId}, (err, user) => {
                      if (!err) {
                            info.name = user.name;
                            info.pic = user.pic;
                      } else {
                          console.log("我的帖子更新名字失败");
                          console.log(err);
                      }
                      if (index == data.length-1) {
                        sendInfo(res, 1, "查看成功", data);
                      }
                    })
                })
            } else {
                sendInfo(res, 1, "查看成功", data);
            }
            
        } else {
            console.log("查看我的帖子失败");
            console.log(err);
        }
    })
})
// 获得我的收藏
router.get("/collect", (req, res) => {
    console.log(req.query);
    Users.findOne({_id: req.query.id}, (err, data) => {
        if (!err) {
            let arr = []
            data.topics = data.topics || arr;
            if (data.topics.length) {
                data.topics.forEach((info, index) => {
                    // console.log(434)
                    Topic.findOne({_id: info}, (err, msg) => {
                        console.log(msg);
                        if (!err) {
                            // 更新数据的用户名和图片
                            Users.findOne({_id: msg.nameId}, (err, user) => {
                                if (!err) {
                                    msg.name = user.name;
                                    msg.pic = user.pic;
                                    arr.push(msg);
                                } else {
                                    console.log("我的帖子更新名字失败");
                                    console.log(err);
                                }
                                if (index == data.topics.length - 1) {
                                    sendInfo(res, 1, "获取成功", arr);
                                }
                              })
                            
                        } else {
                            console.log("帖子获取失败---collect");
                            console.log(err);
                        }
                    })
                })
            } else {
                console.log(1)
                sendInfo(res, 1, "测试", [])
            }
        } else {
            console.log("获得收藏数据库失败");
            console.log(err);
        }
    })
})


// 帖子图片设置
let topicStorage = mult.diskStorage({
    destination:"static/topics",
    filename:function (req, filse , callback) {
        let time = Date.now();
        let index = filse.originalname.lastIndexOf(".");
        let name = time + req.cookies.username + filse.originalname.slice(index);
        // console.log(name);
        req.body.time = time;
        req.body.img = name;
        callback(null, name);
    }
})
let topicUpload = mult({
    storage:topicStorage
})
// 发布帖子
router.post("/appendTopic", topicUpload.single("img"), (req, res) => {
    Users.findOne({name: req.cookies.username}, (err, data) => {
        if (!err) {
            // console.log(data);
            req.body.pic = data.pic;
            req.body.nameId = data.id;
            // console.log(req.body);
            let topic = new Topic(req.body);
            topic.save(err => {
                if (!err) {
                    sendInfo(res, 1, "发布成功");
                } else {
                    console.log("发布失败");
                    console.log(err);
                }
            })
            
        } else {
            console.log("查找用户失败---appendTopic1");
            console.log(err);
        }
    })
    
})




module.exports = router;