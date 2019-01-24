
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
      hiddenInput: $('#message-hidden')
    }

    //页面初始化的加载方法
    // this.init =function(){

    // }
  }

  // 新增的方法
  Banner.prototype.add = function () {
    var that = this;

    // 1. 实例化一个 FormData 对象
    var formData = new FormData();

    //2.给formData 对象添加属性，使其变得跟input框一样，方便ajax方法调用里面的数据
    formData.append('bannerName', this.dom.nameInput.val());
    //当input type类型为file时，不能直接获取他的val(),要先将其转化为dom对象，再获取它的files属性，得到的是一个伪数组，因为是添加一个文件，因此就获取它的第一个数据[0]
    // formData.append('bannerName',this.dom.urlInput.val());
    formData.append('bannerImg', this.dom.urlInput[0].files[0]);
    // console.log(formData)
    //ajax提交
    $.ajax({
      url: '/banner/add',
      method: 'POST',
      processData: false,
      contentType: false,
      data: formData,//传送给数据的时候，将formData赋值给它，即可获取
      success: function () {
        layer.msg('添加成功');
        //成功后，调用search 方法，让页面重新加载
        setTimeout(() => {
          that.search();
        }, 1000);
      },
      error: function (error) {
        console.log(error.message)
        layer.msg('网络异常,请稍后再试')
      },
      complete: function () {
        // 不管成功还是失败，都会进入的一个回调函数
        // 手动调用关闭的方法
        that.dom.addModal.modal('hide');
        // 手动清空输入框的内容
        that.dom.nameInput.val('');
        that.dom.urlInput.val('');
      }

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
      
      setTimeout(() => {
        that.search();
      }, 1000);
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
          // console.log(data);
          if (data.code === 0) {
            //删除成功
            layer.msg('删除成功');
          } else {
            console.log(data.msg);
            layer.msg('网络有误，请稍后再试');
          }
          
          setTimeout(() => {
            that.search();
          }, 1000);
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

      that.dom.submitUpdate.click(function () {
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

