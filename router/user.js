var exp = require('express')

var { Users, ShopCar, Goods } = require('../db')

const cookie = require("cookie-parser");
const e = require('express');
var router = exp.Router()


//------------注册----------------
router.post('/reg', (req, res) => {
    Users.findOne({ name: req.body.name }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    msg: '该用户已存在',
                    code: 0,
                })
            } else {
                var easyUser = new Users(req.body)
                easyUser.save((err) => {
                    if (!err) {
                        res.send({
                            msg: '注册成功',
                            code: 1
                        })
                    } else {
                        res.send({
                            msg: '注册失败'
                        })
                    }
                })

            }
        } else {
            console.log(err);
        }
    })
})

//-------------登录---------------
router.post('/logins', (req, res) => {
    Users.findOne({ name: req.body.username }, (err, data) => {
        if (!err) {
            if (data) {
                if (data.psw == req.body.psw) {
                    var time = new Date()
                    time.setMonth(time.getMonth() + 1)
                    res.cookie('username', req.body.username, { expires: time })
                    res.send({
                        msg: '登录成功',
                        code: 1,
                    })
                } else {
                    res.send({ msg: '密码错误' })
                }

            } else {
                res.send({
                    msg: '该用户尚未注册',
                    code: 0
                })
            }
        } else {
            console.log(err);
        }
    })
})
//------编辑手机信息-------
router.post('/phone', (req, res) => {
    Users.findOne({ name: req.body.username }, (err, data) => {
        if (!err) {
            if (data) {
                res.send(data)
            }
            // else {
            //     console.log(data);
            // }
        } else {
            console.log(err);
        }
    })
})

//------刷新账号------
router.get('/out', (req, res) => {
    res.clearCookie('username')
    res.send('退出成功')
})

//-----编辑个人信息-------
router.post('/infomation', (req, res) => {
    var cookies = req.cookies['username']
    if (cookies) {
        req.body.name = cookies
        Users.findOne({ name: req.body.name }, (err, data) => {
            if (!err) {
                if (data) {
                    Users.update({ name: req.body.name }, req.body, (err) => {
                        if (!err) {
                            res.send({
                                code: 1,
                                msg: '保存成功'
                            })
                        } else {
                            console.log(err);
                        }
                    })
                } else {
                    var users = new Users(req.body)
                    users.save((err) => {
                        if (!err) {
                            res.send({
                                code: 1,
                                msg: '保存成功'
                            })
                        } else {
                            console.log(err);
                        }
                    })
                }
            } else {
                console.log(err);
            }
        })
    } else {
        res.send({
            code: 0,
            msg: '请先登录'
        })
    }
})

//-----edit页面加载个人信息-----
router.post('/edits', (req, res) => {
    Users.findOne({ name: req.body.username }, (err, data) => {
        if (!err) {
            data = JSON.stringify(data)
            data = JSON.parse(data)
            res.send(data)
        } else {
            console.log(err);
        }
    })
})

//-----加入购物车-----
router.post('/buy_car', (req, res) => {
    ShopCar.findOne({ goodsId: req.body.goodsId }, (err, data) => {
        if (!err) {
            if (data) {
                res.send('已经添加过了')
            } else {
                Goods.findOne({ _id: req.body.goodsId }, (err, data) => {
                    if (!err) {
                        if (data) {
                            req.body.nums = 1
                            req.body.time = new Date()
                            var goods = new ShopCar(req.body)
                            goods.save((err) => {
                                if (!err) {
                                    res.send('加入成功')
                                } else {
                                    console.log(err);
                                }
                            })
                        } else {
                            res.send('加入失败')
                        }
                    } else {
                        console.log(err);
                    }
                })
            }
        } else {
            console.log(err);
        }
    })
})

//-----购物车页面的渲染-----
router.post('/shops', (req, res) => {
    ShopCar.find({ userId: req.body.userId }, (err, data) => {
        if (!err) {
            res.send(data)
        } else {
            console.log(err);
        }
    })
})

router.post('/myBuy', (req, res) => {
    Goods.findOne({ _id: req.body.goodsId }, (err, data) => {
        if (!err) {
            console.log(data);
            res.send(data)
        } else {
            console.log(err);
        }
    })
})

// router.post('/turnss', (req, res) => {
//     ShopCar.update({ _id: req.body.id }, { nums: req.body.num }, (err) => {
//         if (!err) {
//             res.send()
//         } else {
//             console.log(err);
//         }
//     })
// })






module.exports = router
