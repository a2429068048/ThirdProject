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
    userId: Number,
    name: String,
    pic: String,
    img: String,
    selfInfo: String,
    like: Array,
    designation: String,
    phone: Number,
    adress: String,
    sex: String,
    birdth: String,
    education: String,
    profession: String,
    marriage: String,
    incom: String,
    childrend: String,
    purpose: String,
    scene: String,
    flowme: Array,
    getGoods: Number,
    // 收藏列表
    topics: Array,
})
// -------- 购物车列表 ----------
const shopCarSchema = new mongoose.Schema({
    userId: String,
    goodsId: String,
    time: Number
})
// ------- 商品列表 --------
const goodsListSchema = new mongoose.Schema({
    imgSrc: String,
    shopName: String,
    title: String,
    oldPrice: String,
    newPrice: String,
    goodsInfo: String,
    info: String,
    countDown: String,
    sort: String,
    imgArr:Array,
    imgArrtwo:Array,
}, {
    collection: 'goodsList'
})
const easyUserSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    psw: String,
})

// ---- 帖子表 ----
const topicSchema = new mongoose.Schema({
    pic:String,
    name:String,
    getGoods:Array,
    getCollect:Array,
    img:String,
    nameId:String,
    comment: Array,
    content: String,
    address: String,
    time:String
})

const Users = mongoose.model("User", userSchema);
const ShopCar = mongoose.model("Shop", shopCarSchema);
const Goods = mongoose.model("Good", goodsListSchema);
const EasyUser = mongoose.model("EasyUser", easyUserSchema);
const Topic = mongoose.model("Topic", topicSchema);

module.exports = {
    // 导出对应的对象
    Users,
    ShopCar,
    Goods,
    EasyUser,
    Topic
}




