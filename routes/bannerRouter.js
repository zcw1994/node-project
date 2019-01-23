//提供给前端ajax调用的接口地址 ，即url 地址

const express = require('express');
const async =require('async');
const cheerio = require('cheerio');
const http  = require('http');
//引入之前对banner内容的字段定义模块
const BannerModel = require('../models/bannerModel');
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

//搜索或查询数据库中的数据 http://localhost:3000/banner/search
router.get('/search',function(req,res){
  //分页
  //1.得到前端传送过来的参数：页数和每页显示的数量
  let pageNum = req.query.pageNum || 1;//当前的页数
  let pageSize = req.query.pageSize || 2;//每页现实的数量

  //获取数据的总数量,采用并行无关联
  async.parallel([
    function(cb){
      BannerModel.find().countDocuments().then(num => {
        cb(null,num);
      }).catch(err => {
        cb(err);
      })
    },
    function(cb){
      BannerModel
      .find()
      .skip(pageNum * pageSize - pageSize)
      .limit(Number(pageSize))
      .then(data => {
        cb(null,data)
      }).catch(err => {
        cb(err)
      })
    }
  ],function(err,result){
    // console.log(result);
    if (err) {
      res.json({
        code:-1,
        msg : err.message
      });
    }else{
      res.json({
        code:0,
        msg:'ok',
        totalNum:result[0],
        data:result[1],
        totalPage : Math.ceil(result[0]/pageSize)
      }) 
    }
  })



 /* BannerModel.find(function(err,data){
   if (err) {
     console.log('查询失败',err.message)
     res.json({
       code:-1,
       msg:err.message
     })
   }else{
     console.log('查询成功');
     res.json({
        code:0,
        msg:'ok',
        data:data
     })
   }
 })*/

}) 


//最后暴露出去
module.exports = router;