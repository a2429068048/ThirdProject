// 页面跳转处理

const exp = require("express");

const router = exp.Router();

const {Goods}=require('../db')

// ------- 首页 -------
router.get("/", (req, res) => {
    res.render("index");
})
// ---------限时团购---------
router.get("/groupBuy", (req, res) => {
    Goods.find({sort:"groupBuy"},(err,data)=>{
        if (!err) {
            res.send(data);
        }else{
            console.log(err);
        }
    })
    
})
// ---------新品推荐---------
router.get("/newpro", (req, res) => {
    Goods.find({sort:"newpro"},(err,data)=>{
        if (!err) {
            res.send(data);
        }else{
            console.log(err);
        }
    })
})
// ---------热卖专区---------
router.get("/hot", (req, res) => {
    Goods.find({sort:"hot"},(err,data)=>{
        if (!err) {
            res.send(data);
        }else{
            console.log(err);
        }
    })
})
// ---------发现好物---------
router.get("/goodThings", (req, res) => {
    Goods.find({sort:"goodThings"},(err,data)=>{
        if (!err) {
            res.send(data);
        }else{
            console.log(err);
        }
    })
})


//------- 发现 ---------
router.get("/discovery", (req, res) => {
    res.render("discovery");
})

//------- 社区 ----------
router.get("/community", (req, res) => {
    res.render("community");
})







// 模块导出
module.exports = router;