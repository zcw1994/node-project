
//定义user集合的路由
const express = require('express');
//生成路由的中间件函数
const router = express.Router();
const UserModel = require('../models/userModel');

//注册   /uesr/register
router.post('/register', (req, res) => {
  //得到数据
  let user = new UserModel(req.body);
  user.save().then((data) => {
    res.json({
      code: 0,
      msg: '注册成功'
    })
  }).catch(error => {
    console.log(error.message);
    res.json({
      code: -1,
      msg: error.message
    })
  })
})

//登录  /user/login
router.post('/login', (req, res) => {
  //获取数据
  let userName = req.body.userName;
  let password = req.body.password;
  //取数据库中查询用户
  UserModel.findOne({
    userName,//键和值名字相同即可简写
    password
  }).then(data => {
    // console.log(data);
    if (!data) {//data不存在
      res.json({
        code: -1,
        msg: '用户名和密码错误'
      })
    } else {//如果data有值，即该用户存在
      //设置cookie值
      res.cookie('nickName', data.nickName, {
        maxAge: 1000 * 60 * 10//十分钟的有效期
      });

      res.cookie('isAdmin', data.isAdmin, {
        maxAge: 1000 * 10 * 60
      })

      res.json({
        code: 0,
        msg: '登录成功',
        data: {
          nickName: data.nickName,
          isAdmin: data.isAdmin
        }
      })
    }
  }).catch(error => {
    console.log(error.message)
    res.json({
      code: -1,
      msg: error.message
    })
  })
})

module.exports = router;//最后将这个路由函数给暴露出去