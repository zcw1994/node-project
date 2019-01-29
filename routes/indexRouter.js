//首页渲染的路由

const express = require('express');

const router = express.Router();
const checkLogin = require('../middlewares/checkLogin');

//首页： http://localhost.3000/
router.get('/',checkLogin, function (req, res) {
  // console.log(req.cookies);
  //在首页获取登录页返回的cookie信息，并进行相应的操作
  // let nickName = req.cookies.nickName;
  // let isAdmin = req.cookies.isAdmin ? true : false;
  // res.render('index', {
  //   nickName: nickName,
  //   isAdmin: isAdmin//是一个布尔值类型
  // });
  res.render('index', {
    nickName : req.cookies.nickName,
    isAdmin : Number(req.cookies.isAdmin) 
  });
});

//banner页面
router.get('/banner.html',checkLogin, (req, res) => {
   //在首页获取登录页返回的cookie信息，并进行相应的操作

  res.render('banner',{
    nickName : req.cookies.nickName,
    isAdmin : Number(req.cookies.isAdmin) 
  });
});

//登录页面
router.get('/login.html', (req, res) => {

  res.render('login');
});

//影片管理页面
router.get('/films.html',checkLogin, (req, res) => {
  res.render('films',{
    nickName : req.cookies.nickName,
    isAdmin : Number(req.cookies.isAdmin) 
  });
});

//影院管理页面
router.get('/cinema.html',checkLogin, (req, res) => {
  res.render('cinema',{
    nickName : req.cookies.nickName,
    isAdmin : Number(req.cookies.isAdmin) 
  } );
})

//最后暴露出去
module.exports = router;