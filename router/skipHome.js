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
router.get("/flower",(req,res) => {
    Goods.find({sort:/month/},(err,shop)=>{
        if (!err) {
            res.render('monthlyFlowers',{shop});
        }else{
            console.log(err);
        }
    })
})
// 礼品花束
router.get("/gift",(req,res) => {
    Goods.find({sort:/gift/},(err,shop)=>{
        if (!err) {
            res.render('gift',{shop});
        }else{
            console.log(err);
        }
    })
})
// 绿植多肉
router.get("/plants",(req,res) => {
    Goods.find({sort:/green/},(err,shop)=>{
        if (!err) {
            res.render('greenPlants',{shop});
        }else{
            console.log(err);
        }
    })
})
// 绿植搜索
router.get("/greenSearch", (req, res) => {
    res.render('greenSearch')
})
// F+物制所
router.get("/matter",(req,res) => {
    Goods.find({sort:/matter/},(err,shop)=>{
        if (!err) {
            res.render('matter',{shop});
        }else{
            console.log(err);
        }
    })
})
// 家居生活
router.get("/furnishing",(req,res) => {
    Goods.find({sort:/furnishing/},(err,shop)=>{
        if (!err) {
            res.render('furnishing',{shop});
        }else{
            console.log(err);
        }
    })
})
// 添加书籍
router.get("/addshoping", (req, res) => {
    res.render('addshop')
})


// 存数据库
router.get('/addshop',(req,res)=>{
    var shop=new Goods(req.query)
    shop.save((err)=>{
        if(!err){
            res.render('addshop')
            console.log('保存成功');
        }else{
            console.log(err);
        }
    })
})

// 包月鲜花
// 简花





module.exports = router;