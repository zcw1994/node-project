//提供给前端ajax调用的接口地址 ，即url 地址

const express = require('express');
const async = require('async');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

//调用multer生成upload,并设置起始存放位置
const upload = multer({
  dest: 'D:/tmp'
})
//引入之前对banner内容的字段定义模块
const BannerModel = require('../models/bannerModel');
const router = express.Router();

//添加banner： http://localhost.3000/banner/add
router.post('/add', upload.single('bannerImg'), function (req, res) {
  //操作文件
  let newFileName = new Date().getTime() + '_' + req.file.originalname;//对文件进行重命名，防止不同客户传入相同的名字文件
  let newFilePath = path.resolve(__dirname, '../public/uploads/banners/', newFileName);

  try {
    //读取起始客户存放的文件
    let data = fs.readFileSync(req.file.path);
    //在将读取的数据添加到新路劲中，即public下
    fs.writeFileSync(newFilePath, data);
    //再删除客户起始存放的文件
    fs.unlinkSync(req.file.path);

    //存放到public成功后，就将该信息存放到数据库中，以便存取，以文件名+banner图的名字写入
    //实例连接数据库的模块
    let banner = new BannerModel({
      name: req.body.bannerName,
      imgUrl: "http://localhost:3000/uploads/banners/" + newFileName
    });
    //对数据库做添加操作
    banner.save().then(() => {
      res.json({
        code: 0,
        msg: 'ok'
      })
    }).catch(error => {
      res.json({
        code: -1,
        msg: error.message
      })
    })
  } catch (error) {
    res.json({
      code: -1,
      msg: error.message
    })
  }
});

//搜索或查询数据库中的数据 http://localhost:3000/banner/search
router.get('/search', function (req, res) {
  //分页
  //1.得到前端传送过来的参数：页数和每页显示的数量
  let pageNum = req.query.pageNum || 1;//当前的页数
  let pageSize = req.query.pageSize || 2;//每页现实的数量

  //获取数据的总数量,采用并行无关联
  async.parallel([
    function (cb) {
      BannerModel.find().countDocuments().then(num => {
        cb(null, num);
      }).catch(err => {
        cb(err);
      })
    },
    function (cb) {
      BannerModel
        .find()
        .skip(pageNum * pageSize - pageSize)
        .limit(Number(pageSize))
        .then(data => {
          cb(null, data)
        }).catch(err => {
          cb(err)
        })
    }
  ], function (err, result) {
    // console.log(result);
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      res.json({
        code: 0,
        msg: 'ok',
        totalNum: result[0],
        data: result[1],
        totalPage: Math.ceil(result[0] / pageSize)
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

//删除数据库信息  http://localhost:3000/banner/delete
router.post('/delete', function (req, res) {
  let id = req.body.id;
  BannerModel.findOneAndDelete({
    _id: id
  }).then((data) => {
    if (data) {
      res.json({
        code: 0,
        msg: 'ok'
      })
    } else {
      res.json({
        code: -1,
        msg: '未找到相关数据'
      })
    }
  }).catch(error => {
    res.json({
      code: -1,
      msg: error.message
    })
  })
})

//最后暴露出去
module.exports = router;