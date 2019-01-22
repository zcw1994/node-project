const BannerModel = require('../../config/db');

$(function () {

  var pageNum = 1;
  var pageSize = 2;
  //页面初始化的时候，调用一次显示数据库影片信息的方法
   search(pageNum, pageSize);

  /* 分页选择操作 */
  $('.pagination').delegate('li','click',function(){
   
    var index = $('.pagination').find('.active').index();
    if ($(this).find("a").attr('aria-label')) {
     if ($(this).find("a").attr('aria-label')==='Previous') {
       
        var changeNum =  $('.active').text() - 1;
        // console.log(changeNum);
        index-=1;
        $('.pagination').find('li').eq(index).addClass('active').siblings().removeClass('active');
        if (changeNum == 0) {
          changeNum = 1;
          $('.pagination').find('li').eq(1).addClass('active').siblings().removeClass('active');
        }
        $('#banner-table tbody').html('',search(changeNum, pageSize));
     }else{
      var changeNum = Number($('.active').text())+ 1;
      index+=1;
      $('.pagination').find('li').eq(index).addClass('active').siblings().removeClass('active');
      // console.log(totalPage)
      if (changeNum >= totalPage) {
        changeNum = totalPage;
        // console.log(changeNum);
        $('.pagination').find('li').eq(totalPage).addClass('active').siblings().removeClass('active');
        
      }
      console.log(changeNum);
      $('#banner-table tbody').html('',search(changeNum, pageSize))
     }
    }else{
      $(this).addClass('active').siblings().removeClass('active');
      var pageNum = $(this).text();
      var pageSize = 2;
      $('#banner-table tbody').html('',search(pageNum, pageSize))
    }
  });

  /* 新增点击操作 */
  $("#bannerAdd").click(function () {
    //进行ajax的数据发送提交
    $.post("/banner/add", {
      bannerName: $('#inputEmail3').val(),
      bannerUrl: $('#inputPassword3').val()
    }, function (res) {//后台返回的数据 
      console.log(res);
      if (res.code === 0) {
        //成功
        layer.msg('添加成功')
      } else {
        layer.alert('网络异常，请稍后重试');//放回错误信息给用户,真正的错误信息给自己看
        console.log(res.msg);
      }
      //操作完成后关闭模态框
      $('#myModal').modal('hide');
      //清空输入框的内容
      $('#inputEmail3').val('');
      $('#inputPassword3').val('');
    })

  });

  /* 删除操作 */
  //  $('.deleteInfo').click(function(){
  //   /* BannerModel.deleteOne({
  //     name:$(this).parent().parent().find()
  //   }) */
  //   console.log($(this).parent().parent().children().index(1));
  //  })
})


/* 
获取banner数据的方法   提出来方便后期对数据的修改提交,复用
@param {Number} pageNum 当前的页数
@param {Number} pageSize 每页显示的条数
*/
function search(pageNum, pageSize) {
  $.get('/banner/search', {
    pageNum: pageNum,
    pageSize: pageSize
  }, function (result) {
    if (result.code === 0) {
      //查询成功
      layer.msg('查询成功');
      totalPage = result.totalPage;
      // console.log(totalPage);
      //循环数据，再加载到页面
      for (let i = 0; i < result.data.length; i++) {
        var item = result.data[i];
          $('#banner-table tbody').append(
            `
              <tr>
                <td>${item._id}</td>
                <td>${item.name}</td>
                <td>
                  <img  class ="banner-img" src="${item.imgUrl}" alt="">
                </td>
                <td>
                  <a class = 'deleteInfo' href="javascript:;">删除</a>
                  <a class = 'updateInfo' href="javascript:;">修改</a>
                </td>
              </tr>
            `
          )  
        }
        // return totalPage;
    } else {
      console.log(result.msg);
      layer.msg('网络异常，请稍后再试');

    }
  })

}