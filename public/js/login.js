
(function(){

  var User = function(){
    //在下次操作发送请求之前，先判定上次请求数据是否响应回来，默认已经收到
    this.btnLock = false;
    this.dom = {
      Unameinput : $('#user_name'),
      pwdInput : $('#password'),
      submitBtn : $('#login'),
      checkLogin : $('#login-form'),
      changeLogin : $('.changeLogin'),
      changeRegister : $('.changeRegister'),
      form : $('form')
    }
  }

  User.prototype.bindDom = function(){
    var that = this;
    this.dom.submitBtn.click(function(){
      //点击发送请求之前，先判断是否有锁，即上次请求数据是否回应
      if (!that.btnLock) {//没锁，即回应成功之后，才能单击
        that.btnLock = true;//没锁的时候，就加锁，再发送请求
        that.handleLogin();
      }
    });

  }

  //登录方法
  User.prototype.handleLogin =function(){
    var that = this;
    $.post('/user/login', {
      userName: this.dom.Unameinput.val(),
      password: this.dom.pwdInput.val()
    },function(res){
      // console.log(res);      
      if (res.code===0) {
        //登录成功
        layer.msg('登录成功');
        setTimeout(() => {
          window.location.href = '/';//跳转回首页
        }, 1000);
       
      }else{
        //登入失败
        layer.msg(res.msg);
        that.dom.checkLogin.removeClass('shake_effect');
        setTimeout(function () {
          that.dom.checkLogin.addClass('shake_effect')
        }, 10);
      }
      //数据回应之后，将锁解开
      that.btnLock = false;
    })
  }

  //最后实例化一个对象
  $(function(){
    new User().bindDom()
  })
})();