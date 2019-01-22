//提供给前端ajax调用的接口地址 ，即url 地址

const express = require('express');
//引入之前对banner内容的字段定义模块
const BannerModel = require('../models/banner');
const router = express.Router();

//添加banner： http://localhost.3000/banner/add
router.post('/add',function(req,res){
 var banner = new BannerModel({
    name:req.body.bannerName,
    imgUrl : req.body.bannerUrl
  });
  banner.save(function(error){
    if (error) {
      res.json({//ajax请求，再用ajax返回数据给前端,如果添加失败，返回前端code为-1，错误信息给上
        code : -1,
        msg:error.message
      })
    }else{//成功的话，返回code为0，信息为ok
      res.json ({
        code:0,
        msg : 'ok'
      })
    }
  })
});

//最后暴露出去
module.exports = router;