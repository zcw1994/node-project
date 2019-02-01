
//引入需要的模块
const express = require('express');
const async = require('async');
const FilmsModel = require('../models/flimsModel');
const router = express.Router();

//添加影片信息  http://localhost:3000/films/add
router.post('/add',(req,res) =>{
  //获取前端传递过来的参数
  var films = new FilmsModel({
    imgUrl : req.body.imgUrl,
    name : req.body.name,
    actors : req.body.actors,
    place : req.body.place,
    time : req.body.time,
    type : req.body.type,
    grade: req.body.grade
  });
  films.save((err) => {
    if (err) {
      res.json({
        code : -1,
        msg : err.message
      });
    }else{
      //保存到数据库成功
      res.json({
        code : 0,
        msg : 'ok'
      });
    }
  });

});

//查询数据库数据信息，并展示
router.get('/search',(req,res) => {

  //获取数据的总数量
  FilmsModel.find(function(err,data){
    if (err) {
      console.log(err.message);
      res.json({
        code: -1,
        msg: err.msg
      })
    }else{
      res.json({
        code : 0,
        msg:'ok',
        data: data
      })
    }
  })


})

module.exports = router;
