// 这个是服务器
const exp = require("express");
const body = require("body-parser");
const mutler = require("multer");
const template = require("art-template");
const cookie = require("cookie-parser");

// 创建服务器
const app = exp();


// 模板设置
app.engine(".html", require("express-art-template"));
app.set("view engine", "html");
app.set("views", "./views");
template.defaults.extname = ".html";


//设置静态文件夹
app.use(exp.static("static"));

// 设置cookie 
app.use(cookie());
// 设置post的body读取
app.use(body.urlencoded({ extended: true }));


// 用来放置路由接口
// 页面跳转（views）
app.use(require("./router/toPage"));

//用户路由接口
app.use('/myself', require("./router/user"));

// require("./db");
// 发现路由接口
app.use("/discovery", require("./router/discovery"));

app.use("/discovery", require("./router/discovery"));
// 数据库接口
app.use("/home", require("./router/skipHome"));



// 服务器端口监听
app.listen(3000, () => {
    console.log("server is runing...")
})

