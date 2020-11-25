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
// 礼品花束
router.get("/gift", (req, res) => {
    res.render('gift')
})
// 绿植多肉
router.get("/plants", (req, res) => {
    res.render('greenPlants')
})
// 绿植搜索
router.get("/greenSearch", (req, res) => {
    res.render('greenSearch')
})
// F+物制所
router.get("/matter", (req, res) => {
    res.render('matter')
})
// 家居生活
router.get("/furnishing", (req, res) => {
    res.render('furnishing')
})


module.exports = router;