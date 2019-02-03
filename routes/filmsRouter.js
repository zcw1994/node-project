
//引入需要的模块
const express = require('express');
const async = require('async');
const FilmsModel = require('../models/flimsModel');
const router = express.Router();

//添加影片信息  http://localhost:3000/films/add
router.post('/add', (req, res) => {
  //获取前端传递过来的参数
  var films = new FilmsModel({
    imgUrl: req.body.imgUrl,
    name: req.body.name,
    actors: req.body.actors,
    place: req.body.place,
    time: req.body.time,
    type: req.body.type,
    grade: req.body.grade
  });
  films.save((err) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      //保存到数据库成功
      res.json({
        code: 0,
        msg: 'ok'
      });
    }
  });

});

//查询数据库数据信息，并展示
router.get('/search', (req, res) => {

  //获取数据的总数量
  FilmsModel.find(function (err, data) {
    if (err) {
      console.log(err.message);
      res.json({
        code: -1,
        msg: err.msg
      })
    } else {
      res.json({
        code: 0,
        msg: 'ok',
        data: data
      })
    }
  })


});

//删除数据库信息中间件
router.post('/delete', (req, res) => {
  //获取前端传来的id
  let id = req.body.id;

  FilmsModel.findOneAndDelete({
    _id: id
  }).then(data => {
    console.log(data);
    if (data) {
      res.json({
        code: 0,
        msg: 'ok'
      });
    } else {
      return Promise.reject(new Error('未找到相关信息'));
    }
  }).catch(error => {
    console.log(error.message);
    res.json({
      code: -1,
      msg: error.message
    });
  });
});

//修改数据库信息的中间件
router.post('/update', (req, res) => {
  //获取数据
  let id = req.body.id;
  let filmsGrade = req.body.filmsGrade;
  let filmsUrl = req.body.filmsUrl;

  //修改数据库信息
  FilmsModel.updateMany({
    _id: id
  }, { $set: { grade: filmsGrade, imgUrl: filmsUrl } }).then((data) => {
    console.log(data);
    if (data.nModified > 0) {
      res.json({
        code: 0,
        msg: 'ok'
      })
    } else {
      return Promise.reject(new Error('修改失败'))
    }
  }).catch(err => {
    console.log(err);
    res.json({
      code: -1,
      msg: err.message
    })
  })

})


module.exports = router;
