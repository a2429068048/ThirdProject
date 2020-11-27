// 页面跳转处理

const exp = require("express");

const router = exp.Router();


const { Goods } = require('../db')



// ------- 首页 -------
router.get("/", (req, res) => {
    res.render("index");
})

// ---------限时团购---------
router.get("/groupBuy", (req, res) => {
    Goods.find({ sort: "groupBuy" }, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    })

})
// ---------新品推荐---------
router.get("/newpro", (req, res) => {
    Goods.find({ sort: "newpro" }, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    })
})
// ---------热卖专区---------
router.get("/hot", (req, res) => {
    Goods.find({ sort: "hot" }, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    })
})
// ---------发现好物---------
router.get("/goodThings", (req, res) => {
    Goods.find({ sort: "goodThings" }, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    })
})

//------- 发现 ---------
router.get("/discovery", (req, res) => {
    // console.log("测试")
    res.render("discovery");
})



//------- 登录 ----------
router.get('/login', (req, res) => {
    res.render('login')
})

//------- 注册 ----------
router.get('/register', (req, res) => {
    res.render('register')
})
//--------我的页面-------
router.get('/myselfs', (req, res) => {
    res.render('myself')
})
//---------编辑---------
router.get('/edit', (req, res) => {
    res.render('edit')
})
//-------个人信息-------
router.get('/info', (req, res) => {
    res.render('person')
})
//-----订单页面-----
router.get('/order', (req, res) => {
    res.render('order')
})
//-----会员页面------
router.get('/vip', (req, res) => {
    res.render('vip')
})
//-----我的奖励-----
router.get('/prize', (req, res) => {
    res.render('prize')
})
//-----我的证书-----
router.get('/certificate', (req, res) => {
    res.render("certificate")
})
//-----专区-----
router.get('/area', (req, res) => {
    res.render('area')
})
//-----活动-----
router.get('/christmas', (req, res) => {
    res.render('christmas')
})
//-----服务页面跳转-----
router.get('/give', (req, res) => {
    res.render('give')
})
router.get('/flower', (req, res) => {
    res.render('my_flower')
})
router.get('/card', (req, res) => {
    res.render('card')
})
router.get('/cheap', (req, res) => {
    res.render('cheap')
})
router.get('/flower_cards', (req, res) => {
    res.render('flower_cards')
})
router.get('/myServer', (req, res) => {
    res.render('myserver')
})
router.get('/myHelp', (req, res) => {
    res.render('myHelp')
})
router.get('/myAdvise', (req, res) => {
    res.render('myAdvise')
})


//-----查询卡单-----
router.get('/lookup', (req, res) => {
    res.render('lookup')
})

//-----优选-----
router.get('/good_select', (req, res) => {
    res.render('good_select')
})

//-----当日订单-----
router.get('/dayOrder', (req, res) => {
    res.render('dayOrder')
})
//-----添加礼品卡-----
router.get('/card_add', (req, res) => {
    res.render('card_add')
})




// 模块导出
module.exports = router;