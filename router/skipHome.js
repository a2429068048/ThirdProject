// 数据库
const exp = require("express");

const router = exp.Router();

const {Goods}=require('../db')

// ---------推荐-----------
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
// 跳转
// 包月鲜花
router.get("/flower", (req, res) => {
    res.render('monthlyFlowers')
})
router.get("/gift", (req, res) => {
    res.render('gift')
})


module.exports = router;