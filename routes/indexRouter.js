//首页渲染的路由

const express = require('express');

const router = express.Router();

//首页： http://localhost.3000/
router.get('/',function(req,res){
  res.render('index');
});

//banner页面
router.get('/banner.html',(req,res) => {
  res.render('banner');
});
//最后暴露出去
module.exports = router;