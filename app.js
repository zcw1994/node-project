//项目接口文件
 const express  = require ('express');
const cookieParse = require('cookie-parser');
 const app = express();
 const path = require('path');

 //使用中间件函数
//处理req对cookie的获取的中间件函数
 app.use(cookieParse());
 //处理post请求传输的数据获取
 app.use(express.json());
 app.use(express.urlencoded({extended : true}));

 //路由中间件
 const indexRouter = require('./routes/indexRouter');
 const bannerRouter = require('./routes/bannerRouter');
 const userRouter =require('./routes/userRouter');
 const filmsRouter = require('./routes/filmsRouter');
 //静态文件托管
app.use(express.static(path.resolve(__dirname,'./public')));
 
//设置模板文件的位置，用的什么模板引擎
app.set('views',path.resolve(__dirname,'./views'));
app.set('view engine','ejs');

//路由文件的使用 
app.use('/',indexRouter);
app.use('/banner',bannerRouter);
app.use('/user',userRouter);
app.use('/films',filmsRouter);

 


 app.listen(3000,function(){
   console.log('running......')
 });