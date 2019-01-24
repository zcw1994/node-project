
(function () {

  /* 定义一个构造函数，以便后面代码的规范及数据的缓存获取    性能优化：dom缓存*/
  var Banner = function () {
    //定义需要的一些数据
    this.pageNum = 1;
    this.pageSize = 2;
    this.totalPage = 0;//总页数，需要从数据库中获取
    this.bannerList = [];//用来存放数据库中的数据

    //需要用到的dom对象，先获取缓存起来，方便使用
    this.dom = {
      //需要追加信息的tbody
      table: $('#banner-table tbody'),
      //分页的ul
      pagination: $('#pagination'),
      //新增模态框的名字输入框和图片地址输入框
      nameInput: $('#inputEmail3'),
      urlInput: $('#inputPassword3'),
      //新增的模态框
      addModal: $('#addModal'),
      //模态框的确认添加按钮
      submitAdd: $('#bannerAdd'),
      //修改的模态框
      exampleModal: $('#exampleModal'),
      //修改模态框的名字输入框和图片地址输入框
      updateNameInput: $('#recipient-name'),
      updateUrlInput: $('#message-text'),
      //修改模态框的确认修改按钮
      submitUpdate: $('#bannerUpdate'),
      //做修改模态框中的隐藏框
      hiddenInput : $('#message-hidden')
    }

    //页面初始化的加载方法
    // this.init =function(){

    // }
  }

  //添加数据库数据方法
  Banner.prototype.add = function () {
    var that = this;
    $.post('/banner/add', {
      bannerName: this.dom.nameInput.val(),
      bannerUrl: this.dom.urlInput.val()
    }, function (res) {//回调函数，判断是否操作成功
      if (res.code == 0) {//获取后台传过来的数据
        layer.msg('添加成功');//返回前端页面
        //重新发送ajax请求数据，进行局部动态变化
        that.search();
      } else {
        layer.msg('网络异常，请稍后再试');
      }

      //操作完成后，关闭模态框，及请空输入框的内容
      that.dom.addModal.modal('hide');
      that.dom.nameInput.val('');
      that.dom.urlInput.val('');
    })

  }

  //查询方法
  Banner.prototype.search = function () {
    var that = this;
    $.get('/banner/search', {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }, function (result) {
      if (result.code === 0) {
        //查询成功
        layer.msg('查询成功');
        //将后台返回的数据信息装到BannerList里去
        that.bannerList = result.data;
        //将后台返回的总页数写到实例的totalPage里去
        that.totalPage = result.totalPage;

        //调用渲染table页面的方法
        that.renderTable();
        //调用渲染分页的方法
        that.renderPagination();
      } else {
        console.log(result.msg);
        layer.msg('网络异常，请稍后再试');
      }
    })
  }

  //修改方法
  Banner.prototype.update = function () {
    var that = this;
    $.post('/banner/update', {
      id: this.dom.hiddenInput.val(),
      bannerName: this.dom.updateNameInput.val(),
      bannerUrl: this.dom.updateUrlInput.val()
    }, function (res) {//回调函数，判断是否操作成功
      if (res.node == 0) {//获取后台传过来的数据
       
        //返回前端页面
        layer.msg('修改成功');
        // console.log('修改成功')
      } else {
        layer.msg('网络异常，请稍后再试');
      }

      //操作完成后，关闭模态框，及请空输入框的内容
      that.dom.exampleModal.modal('hide');
      that.dom.updateNameInput.val('');
      that.dom.updateUrlInput.val('');
      //重新发送ajax请求数据，进行局部动态变化
      that.search(); 
      // 调用渲染 table
      // that.renderTable();
      // 调用渲染 分页
      // that.renderPagination();
    })

  }

  //拿数据库中的数据渲染table信息
  Banner.prototype.renderTable = function () {
    //渲染之前，先将table页面的原有数据清空，以便再次渲染
    this.dom.table.html('');
    for (let i = 0; i < this.bannerList.length; i++) {
      var item = this.bannerList[i];
      this.dom.table.append(
        `
          <tr>
            <td>${item._id}</td>
            <td>${item.name}</td>
            <td>
              <img  class ="banner-img" src="${item.imgUrl}" alt="">
            </td>
            <td>
              <a data-id="${item._id}" class = "deleteInfo " href="javascript:;">删除</a>
              <a data-id="${item._id}" data-name ="${item.name}" data-url = "${item.imgUrl}" class="updateInfo" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">修改</a>
            </td>
          </tr>
        `
      )
    }
  }

  //渲染分页的方法
  Banner.prototype.renderPagination = function () {
    var prevClassName = this.pageNum === 1 ? "disabled" : "";
    var nextClassName = this.pageNum === this.totalPage ? "disabled" : "";
    //渲染之前，先将分页的 原有数据清空，以便再次渲染
    this.dom.pagination.html('');
    //先渲染上一页的标签
    this.dom.pagination.append(
      `
      <li class="${prevClassName}" data-num = "${this.pageNum - 1}">
        <a href="javascript:;" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
     </li>
      `
    )

    //根据具体的页数，循环渲染li数量
    for (var i = 1; i <= this.totalPage; i++) {
      var className = this.pageNum === i ? 'active' : ""
      this.dom.pagination.append(
        `
        <li class="${className}" data-num = "${i}"><a href="javascript:;">${i}</a></li>
        `
      )
    }

    //渲染下一页标签
    this.dom.pagination.append(
      `
        <li class="${nextClassName}" data-num = "${this.pageNum + 1}">
            <a href="javascript:;" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
      `
    )
  }

  //dom操作的所有方法
  Banner.prototype.bindDom = function () {
    var that = this;
    //点击确认新增按钮，调用add
    this.dom.submitAdd.click(function () {
      that.add();
    });

    //分页页数点击事件
    this.dom.pagination.on('click', 'li', function () {

      //点击得到当前的页数
      // console.log($(this).attr('data-num'))
      //attr 获取属性，如果为自定义属性，且用data-开头，即可直接使用data
      // console.log($(this).data('num')); 
      var num = Number($(this).data('num'));

      //判断当前点击的分页页数是否是当前页，即点击的是否为相同页，或者num<1或num>totalPage
      if (that.pageNum === num || num < 1 || num > that.totalPage) {
        return;//直接返回，就不会重新发送请求
      }
      //设置给this.pageNum
      that.pageNum = num;
      //再调用一次渲染页面方法
      that.search();

    })

    //删除按钮的点击事件，因为删除按钮是异步加载的，因此要使用事件委托，委托给其存在的父元素 
    this.dom.table.on('click', '.deleteInfo', function () {
      //得到id
      var id = $(this).data('id');
      layer.confirm('您确定删除吗？', function () {
        console.log('确定');
        $.post('/banner/delete', {
          id: id
        }, function (data) {
          console.log(data);
          if (data.code === 0) {
            //删除成功
            layer.msg('删除成功');
          } else {
            console.log(data.msg);
            layer.msg('网络有误，请稍后再试');
          }
          that.search();
        })
      }, function () {
        console.log('取消');
      })
    })

    //修改按钮的点击事件,修改数据
    this.dom.table.on('click', '.updateInfo', function () {
      that.dom.hiddenInput.val($(this).data('id'));
      that.dom.updateNameInput.val($(this).data('name'));
      that.dom.updateUrlInput.val($(this).data('url'));

      that.dom.submitUpdate.click(function(){
        that.update();
      })
    })
  }


  //最后在页面加载完毕后，实例化一个Banner
  $(function () {
    var banner = new Banner();
    //调用dom操作方法，才能对页面便签进行操作
    banner.bindDom();
    //默认渲染第一页
    banner.search();
  })
})()

















// $(function () {

//   var pageNum = 1;
//   var pageSize = 2;
//   //页面初始化的时候，调用一次显示数据库影片信息的方法
//    search(pageNum, pageSize);

//   /* 分页选择操作 */
//   $('.pagination').delegate('li','click',function(){

//     var index = $('.pagination').find('.active').index();
//     if ($(this).find("a").attr('aria-label')) {
//      if ($(this).find("a").attr('aria-label')==='Previous') {

//         var changeNum =  $('.active').text() - 1;
//         // console.log(changeNum);
//         index-=1;
//         $('.pagination').find('li').eq(index).addClass('active').siblings().removeClass('active');
//         if (changeNum == 0) {
//           changeNum = 1;
//           $('.pagination').find('li').eq(1).addClass('active').siblings().removeClass('active');
//         }
//         $('#banner-table tbody').html('',search(changeNum, pageSize));
//      }else{
//       var changeNum = Number($('.active').text())+ 1;
//       index+=1;
//       $('.pagination').find('li').eq(index).addClass('active').siblings().removeClass('active');
//       // console.log(totalPage)
//       if (changeNum >= totalPage) {
//         changeNum = totalPage;
//         // console.log(changeNum);
//         $('.pagination').find('li').eq(totalPage).addClass('active').siblings().removeClass('active');

//       }
//       console.log(changeNum);
//       $('#banner-table tbody').html('',search(changeNum, pageSize))
//      }
//     }else{
//       $(this).addClass('active').siblings().removeClass('active');
//       var pageNum = $(this).text();
//       var pageSize = 2;
//       $('#banner-table tbody').html('',search(pageNum, pageSize))
//     }
//   });

//   /* 新增点击操作 */
//   $("#bannerAdd").click(function () {
//     //进行ajax的数据发送提交
//     $.post("/banner/add", {
//       bannerName: $('#inputEmail3').val(),
//       bannerUrl: $('#inputPassword3').val()
//     }, function (res) {//后台返回的数据 
//       console.log(res);
//       if (res.code === 0) {
//         //成功
//         layer.msg('添加成功')
//       } else {
//         layer.alert('网络异常，请稍后重试');//放回错误信息给用户,真正的错误信息给自己看
//         console.log(res.msg);
//       }
//       //操作完成后关闭模态框
//       $('#myModal').modal('hide');
//       //清空输入框的内容
//       $('#inputEmail3').val('');
//       $('#inputPassword3').val('');
//     })

//   });

//   /* 删除操作 */
//    $('.deleteInfo').click(function(){

//     console.log($(this).parent().parent().children().index(1));
//    })
// })


// /* 
// 获取banner数据的方法   提出来方便后期对数据的修改提交,复用
// @param {Number} pageNum 当前的页数
// @param {Number} pageSize 每页显示的条数
// */
// function search(pageNum, pageSize) {
//   

// }