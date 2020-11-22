// 数据库配置
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Flower");

const db = mongoose.connection;

db.on("open", () => {
    console.log("数据连接成功");
}).on("error", () => {
    console.log("数据连接失败");
})




// module.exports = {
//     // 导出对应的对象
// }




