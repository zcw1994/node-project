
$(function(){

  $("#bannerAdd").click(function(){
    //进行ajax的数据发送提交
    $.post("/banner/add",{
      bannerName : $('#inputEmail3').val(),
      bannerUrl : $('inputPassword3').val()
    },function(res){//后台返回的数据 
      console.log(res);
      if (res.code===0) {
        //成功
      }else{
        alert('网络异常，请稍后重试');//放回错误信息给用户,真正的错误信息给自己看
        console.log(res.msg);
      }
      //操作完成后关闭模态框
      $('#myModal').modal('hide');
    })
    
  })
})