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
            
            // console.log(item)
            // console.log(data._id)
            // 查看是否有图片存在
            if (data[type]) {
                fs.unlinkSync("./static" + data[type])
            }
            let name = data._id + type + "." + files.originalname.split(".").pop();
            // console.log(name, "头像名称");
            req.body[type] = "/users/" + name;
            // console.log(1)
            callback(null, name);
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
const { resolve } = require("path");
const { rejects } = require("assert");

const router = exp.Router();

// dis首页
router.get("/index", (req, res) => {
    let userId;
    let send = {
        topUsers:[],
        content:[]
    }
    new Promise((resolve,rejects) => {
        Users.findOne({name: req.cookies.username}, (err, data) => {
            if (!err){
                if (data) {
                    userId = data.id;
                }
                resolve();
            } else {
                console.log("获取用户表失败---index");
                console.log(err);
            }
        })
    }).then(() => {
        Users.find((err, users) => {
            if (!err) {
                if (users.length) {
                    users.forEach((user, index) => {
                        user.flowme = user.flowme || [];
                        user.flowme.map(id => {
                            if (id == userId) {
                                // 说明已经关注了
                                user.isLike = true;
                                return true;
                            }
                        })
                        Topic.find({nameId:user.id}, (err, data) => {
                            if (!err && data) {
                                send.topUsers.push({
                                    designation:user.designation,
                                    pic:user.pic,
                                    name:user.name,
                                    topics:data,
                                    id:user.id,
                                    isLike:user.isLike
                                })
                            } else {
                                console.log(data);
                                console.log("获取topic失败---index")
                                console.log(err);
                            }
                            if (index == users.length - 1) {
                                Topic.find((err, data) => {
                                    if (!err) {
                                        send.content = data;
                                        // console.log(1);
                                        res.render("community", send);
                                    } else {
                                        console.log("获取topic失败2----index")
                                        console.log(err);
                                    }
                                })
                            }
                        })
                    })
                
                } else {
                    console.log(1);
                    res.render("community", send)
                }
                
            } else {
                console.log("用户表访问失败---index");
                console.log(err);
            }
        })
        
    })
    
})
// 获得所有帖子
router.get("/getTopics", (req, res) => {
    Users.findOne({name: req.cookies.username}, (err,data) =>{
        if (!err) {
            let id = data ? data.id : "";
            Topic.find((err, data) =>{
                if (!err) {
                    // 判断是否已经点赞过了
                    data.forEach((topic, index) => {
                        isGood(req,topic, id);
                    })
                    sendInfo(res, 1, "获得成功", data);
                } else {
                    console.log("帖子表获得失败----getTopics")
                    console.log(err);
                }
            }).lean();
        }else {
            console.log(err);
            console.log("获取登录用户失败---getTopics");
        }
    })
})
// 获得关注的人发布的帖子
router.get("/getFlowTopic", (req, res) => {
    // 先找到关注的人
    Users.findOne({name: req.cookies.username}, (err, user) => {
        let id = user.id;
        if (!err) {
            let arr = [];
            if (user.like) {
                user.like.forEach((userId, index) => {
                    Topic.find({nameId:userId}, (err, data) => {
                        if (!err) {
                            if (data) {
                                data.forEach(topic => {
                                    // 判断是否已经点赞
                                    isGood(req, topic, id);
                                    arr.push(topic);
                                })
                            }
                        } else {
                            console.log("访问帖子表失败---getFlowTopic");
                            console.log(err);
                        }
                        if (index == user.like.length -1) {
                            sendInfo(res, 1, "查询成功", arr);
                        }
                    }).lean();
                })
            } else {
                sendInfo(res, 1, "查询成功", arr);
            }
            
        } else {
            console.log("访问用户表失败---getFlowTopic");
            console.log(err);
        }
    })
})
// 搜索
router.get("/search", (req, res) => {
    // console.log(req.query.content);
    Users.findOne({name: req.cookies.username}, (err, data) => {
        if (!err && data) {
            let id = data.id;
            Topic.find({content:new RegExp(req.query.content, "g")},(err, data) => {
                if (!err) {
                    // console.log(data);
                    if (data.length) {
                        data.forEach((topic, index) => {
                            // 判断是否点赞或者收藏
                            isGood(req, topic, id);
                        })
                       
                    }
                    data.reverse();
                    res.render("disContent",{docTitle:"搜索结果",data});
                } else {
                    console.log("帖表访问失败----search");
                    console.log(err);
                }
            }).lean();        
        } else {
            console.log(data);
            console.log("访问User表失败---search");
            console.log(err);
        }
    })
})


// 对应用户帖子跳转
router.get("/detailTopic", (req, res) => {
    // console.log(req.query.id);
    Users.findOne({name: req.cookies.username}, (err, data) => {
        let id = data.id;
        if (!err) {
            Topic.find({nameId: req.query.id}, (err, data) => {
                if (!err) {
                    data.forEach(topic => {
                        isGood(req, topic, id);
                    });
                    data.reverse();
                    res.render("disContent", {data});
                } else {
                    console.log("帖表访问失败---/detailTopic");
                    console.log(err);
                }
            }).lean();
        } else {
            console.log("用户表访问失败---detailTopic");
            console.log("err");
        }
    })
})

// 商城跳转
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
            sendInfo(res, 1, "更新成功");
            // 修改对应的topic表
            // 更新一下帖子表的用户数据
            Topic.find({name: req.cookies.username},(err, topics) => {
                if (!err) {
                    if (topics.length) {
                        topics.forEach(topic => {
                            // console.log(topic)   
                            Topic.findOneAndUpdate({_id: topic.id}, {pic:req.body.pic}, err => {
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
            let index = 0;
            if (data.like && data.like.length) {
                data.like.forEach((user) => {
                    Users.findOne({
                        _id: user
                    }, (err, info) => {
                        if (!err) {
                            info.status = 1;
                            arr.push(info);
                            index++;
                        } else {
                            console.log(err);
                            console.log("关注列表遍历查找失败");
                        }
                        if (index == (data.like.length)) {
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
            let index = 0;
            if (data.flowme && data.flowme.length) {
                // console.log(data.flowme);
                data.flowme.forEach((fuser) => {
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
                            // console.log(index)
                            index++;
                        } else {
                            console.log("数据库查询失败----/flowme-2")
                            console.log(err);
                        }
                        if (index == (data.flowme.length )) {
                            // console.log(584)
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
            // console.log(data);
            // 更新名字和头像
            if (data.length) {
                data.forEach((info, index) => {
                    info.getGoods = info.getGoods || [];
                    if (info.getGoods.length) {
                        // console.log(1)
                        info.getGoods.forEach(userId => {
                            if (userId == req.query.id) {
                                // console.log(true)
                                info.status = 1;
                            } 
                        })
                    }
                    // console.log(info);
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
    }).lean();
})
// 获得我的收藏
router.get("/collect", (req, res) => {
    // console.log(req.query);
    // 当前用户
    Users.findOne({_id: req.query.id}, (err, data) => {
        if (!err) {
            let arr = []
            // 收藏列表
            data.topics = data.topics || arr;
            if (data.topics.length) {
                data.topics.forEach((info, index) => {
                    // console.log(434)
                    Topic.findOne({_id: info}, (err, msg) => {
                        // console.log(msg);
                        msg.getGoods = msg.getGoods || [];
                        if (msg.getGoods.length) {
                            msg.getGoods.forEach(userId => {
                                if (userId == req.query.id) {
                                    msg.status = 1;
                                }
                            })
                        }
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
                    }).lean();
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


// 点赞
router.get("/addGood", (req, res) => {
    // 找到当前用户的id
    addLAC(req, res, "getGoods");
    
})
// 取消点赞
router.get("/removeGood", (req, res) =>{
   reLAC(req, res, "getGoods")
})

// 收藏
router.get("/addCollect" ,(req, res) => {
    addLAC(req, res, "getCollect");
})
router.get("/removeCollect", (req, res) => {
    reLAC(req, res, "getCollect");
})


// 点赞和收藏的方法
function addLAC(req, res, target) {
    // console.log(req.query.id);
    Users.findOne({name:req.cookies.username}, (err, user) => {
        let id = user.id;
        user.topics = user.topics || [];
         // 找到对应的帖子
        if (!err) {
            // console.log(req.query.id);
            Topic.findOne({_id: req.query.id}, (err, data) => {
                if (!err) {
                    // 添加对应的id
                    let topicId = data.nameId;
                    data[target] = data[target] || [];
                    data[target].push(id);
                    if (target == "getCollect") {
                        // console.log(data.id);
                        user.topics.push(data.id);
                        // console.log(user.topics);
                    }
                    // 更新数据库
                    Topic.findOneAndUpdate({_id: req.query.id}, data, err => {
                        if (!err) {
                            sendInfo(res, 1, "点赞/收藏成功");
                            Users.findOne({_id:topicId}, (err, data) => {
                                if (!err) {
                                    // 收藏和点赞总量
                                    data.getGoods = data.getGoods || 0;
                                    data.getGoods++;
                                    data.topics = user.topics;
                                    Users.findOneAndUpdate({_id:topicId},data, err => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                } else {
                                    console.log("获取数据库失败---addLAC730");
                                    console.log(err);
                                }

                            })
                            
                            // user.getGoods++;
                            Users.update({_id: id}, user, (err) => {
                                if (err) {
                                    console.log("更新用户表失败---addGood")
                                }
                            });
                        } else {
                            console.log("更新数据库失败---addGood")
                            console.log(err);
                        }
                    }); 
                } else {
                    console.log(err);
                    console.log("addGood 查找数据库失败");
                }
            })
        } else {
            console.log("查找数据库失败---addGood");
            console.log(err);
        }
    })
}
// 取消点赞和收藏的方法
function reLAC(req, res, target) {
    // console.log(req.query.id);
    Users.findOne({name:req.cookies.username}, (err, user) => {
        let id = user.id;
         // 找到对应的帖子
        if (!err) {
            Topic.findOne({_id: req.query.id}, (err, data) => {
                if (!err) {
                    let topicId = data.nameId;
                    // 移除对应的id
                    data[target] = data[target].filter(userId => {
                        return userId != id;
                    })
                    if (target == "getCollect") {
                        user.topics = user.topics.filter(topic => {
                            return topic != req.query.id;
                        })
                    }
                    Topic.findOneAndUpdate({_id: req.query.id}, data, err => {
                        if (!err) {
                            sendInfo(res, 1, "取消点赞/收藏成功");
                            Users.findOne({_id:topicId}, (err, data) => {
                                if (!err) {
                                    data.topics = user.topics;
                                    data.getGoods--;
                                    Users.findOneAndUpdate({_id:topicId},data, err => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                } else {
                                    console.log("获取数据库失败---addLAC730");
                                    console.log(err);
                                }

                            })
                            
                            Users.update({_id: id}, user, (err) => {
                                if (err) {
                                    console.log("更新用户表失败---removeGood")
                                }
                            })
                        } else {
                            console.log("更新数据库失败---removeGood")
                            console.log(err);
                        }
                    }); 
                    
                } else {
                    console.log(err);
                    console.log("removeGood 查找数据库失败");
                }
            })
        } else {
            console.log("查找数据库失败---addGood");
            console.log(err);
        }
    })
    
}



// 查看是否有点赞和收藏
function isGood(req,topic,id) {
    topic.getGoods = topic.getGoods || [];
    topic.getCollect = topic.getCollect || [];
    if (topic.getGoods.length) {
        topic.getGoods.forEach(userId => {
            if (userId == id) {
                topic.status = 1;
            }
        })
    }
    if (topic.getCollect.length) {
        topic.getCollect.forEach(userId => {
            if (userId == id) {
                topic.isCollect = 1;
            }
        })
    }
    
}
// 查看是否有关注
function isLike() {

}

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
            req.body.name = req.cookies.username;
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