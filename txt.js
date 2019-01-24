const express = require('express');
//引入上传文件模块 multer
const multer = require('multer');
const path  = require('path');
const fs = require('fs');

//调用multer 得到一个 upload对象

const upload = multer({
  dest:'d:/tmp'//设置文件的存放目录
})
//得到express的实例
const app = express();

app.post('/upload',upload.single('avatar'),(req,res) => {
  res.send(req.file);
  //为了将图片生成一个url地址给客户端页面进行访问
  //先将文件移动到当前项目的public文件夹下

  //再对文件名做一些修改
  let newFileName = new Date().getTime()+'_'+req.file.originalname;
  let newFilePath = path.resolve(__dirname,'./public/uploads/' + newFileName)
  //再将 图片的路径存进数据库中
  try{
    let data = fs.readFileSync(req.file.path);
    fs.writeFileSync(newFilePath);
    fs.unlink(req.file.path);
  }catch(error){
    res.json({
      code : -1,
      msg :error.message
    })
  }
 
}) ;

app.listen(3000,function(){
  console.log('running......')
})