var exp = require('express')

var { Users, ShopCar, Goods, EasyUser } = require('../db')

const cookie = require("cookie-parser");
var router = exp.Router()


//------------注册----------------
router.post('/reg', (req, res) => {
    EasyUser.findOne({ name: req.body.name }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    msg: '该用户已存在',
                    code: 0,
                })
            } else {
                var easyUser = new EasyUser(req.body)
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
    EasyUser.findOne({ name: req.body.username }, (err, data) => {
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
    EasyUser.findOne({ name: req.body.username }, (err, data) => {
        if (!err) {
            if (data) {
                res.send(data)
            } else {
                console.log(data);
            }
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

module.exports = router
