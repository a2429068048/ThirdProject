// 数据库配置
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Flower");

const db = mongoose.connection;

db.on("open", () => {
    console.log("数据连接成功");
}).on("error", () => {
    console.log("数据连接失败");
})

//----- 用户表 -------
const userSchema = new mongoose.Schema({
    userId:Number,
    name:String,
    pic:String,
    img:String,
    selfInfo:String,
    like:String,
    designation:String,
    phone:Number,
    adress:String,
    sex:String,
    birdth:String,
    education:String,
    profession:String,
    marriage:String,
    incom:String,
    childrend:String,
    purpose:String,
    scene:String
})
// -------- 购物车列表 ----------
const shopCarSchema = new mongoose.Schema({
    userId:String,
    goodsId:String,
    time:Number
})
// ------- 商品列表 --------
const goodsListSchema = new mongoose.Schema({
    shopName:String,
    title:String,
    oldPrice:Number,
    newPrice:Number,
    goodsInfo:String,
    info:String,
    countDown:String,
    sort:String
})

const Users = mongoose.model("User",userSchema);
const ShopCar = mongoose.model("GoodsList", shopCarSchema);
const Goods = mongoose.model("Good", goodsListSchema);



module.exports = {
    // 导出对应的对象
    Users,
    ShopCar,
    Goods
}




