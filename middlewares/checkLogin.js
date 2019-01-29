
//这个文件是用来做用户登录验证的一个中间件函数

module.exports = function(req,res,next){
  //得到nickName
  let nickName =  req.cookies.nickName;
  if (nickName) {
    //存在就调转想去的页面
    next()
  }else{
    //不存在就去登录页面
    res.redirect('/login.html');
  }

}