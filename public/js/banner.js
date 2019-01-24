
(function () {
  /**
   * 定义这个文件操作的构造函数
   */
  var Banner = function () {
    // 定义这个页面需要的一些数据
    this.pageNum = 1;   // 当前的页码数
    this.pageSize = 2;  // 每页显示的条数
    this.totalPage = 0; // 总的页数
    this.bannerList = []; // banner数据

    // 需要用到的 dom 对象  性能优化 - dom缓存
    this.dom = {
      table: $('#banner-table tbody'), // table的tbody
      pagination: $('#pagination'),    // 分页的ul
      nameInput: $('#inputEmail3'),    // 名字的输入框
      urlInput: $('#inputPassword3'),  // url的输入框
      addModal: $('#addModal'),        // 新增的模态框
      submitAdd: $('#bannerAdd'),      // 确认新增的按钮

    }
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
    console.log(formData)
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

  // 查询的方法
  Banner.prototype.search = function () {
    var that = this;
    $.get('/banner/search', {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }, function (result) {
      if (result.code === 0) {
        layer.msg('查询成功');

        // 将 result.data 写入到 实例的 bannerList
        that.bannerList = result.data;
        // 将 result.totalPage 写入到 实例的 totalPage
        that.totalPage = result.totalPage;

        // 调用渲染 table
        that.renderTable();
        // 调用渲染 分页
        that.renderPage();

      } else {
        console.log(result.msg);
        layer.msg('网络异常，请稍后重试');
      }
    })
  }

  /**
   * 渲染table
   */
  Banner.prototype.renderTable = function () {
    this.dom.table.html('');
    for (var i = 0; i < this.bannerList.length; i++) {
      var item = this.bannerList[i];
      this.dom.table.append(
        `
          <tr>
            <td>${item._id}</td>
            <td>${item.name}</td>
            <td>
              <img class="banner-img" src="${item.imgUrl}"
              alt="">
            </td>
            <td>
              <a class="deleteInfo" data-id="${item._id}" href="javascript:;">删除</a>
              <a class="updateInfo" data-id="${item._id}" href="javascript:;">修改</a>
            </td>
          </tr>
        `
      )
    }
  }

  /**
   * 渲染分页
   */
  Banner.prototype.renderPage = function () {
    var prevClassName = this.pageNum === 1 ? 'disabled' : '';
    var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';
    // 0 清空
    this.dom.pagination.html('');
    // 添加上一页
    this.dom.pagination.append(
      `
      <li class="${prevClassName}" data-num="${this.pageNum - 1}">
        <a href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      `
    )

    // 根据 this.totalPage 循环渲染多少个 li
    for (var i = 1; i <= this.totalPage; i++) {
      var className = this.pageNum === i ? 'active' : '';
      this.dom.pagination.append(
        `
        <li class="${className}" data-num="${i}"><a href="#">${i}</a></li>
        `
      )
    }

    // 添加下一页
    this.dom.pagination.append(
      `
      <li class="${nextClassName}" data-num="${this.pageNum + 1}">
        <a href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
      `
    )
  }

  // 将所有 dom 事件的操作放在这里
  Banner.prototype.bindDOM = function () {
    var that = this;
    // 点击确认新增按钮需要调用 add
    this.dom.submitAdd.click(function () {
      that.add();
    })

    // 分页按钮点击事件
    this.dom.pagination.on('click', 'li', function () {
      // 1. 得到页码
      // attr 获取属性，如果是自定义属性并且用data-开头，我们可以更简单的使用 data
      var num = parseInt($(this).data('num'));

      // 1.1 判断是否点击的是相同页, 或者 < 1 或者 > 总页数
      if (that.pageNum === num || num < 1 || num > that.totalPage) {
        return;
      }

      // 2. 设置给 this.pageNum
      that.pageNum = num;

      // 3. 再次调用一下 this.search 
      that.search();
    })

    // 删除按钮点击
    this.dom.table.on('click', '.deleteInfo', function () {
      // 1. 得到id
      var id = $(this).data('id');

      // 2. 二次确认框
      layer.confirm('确认删除么', function () {
        // console.log('确认');
        $.post('/banner/delete',{
          id:id
        },function(res){
          console.log(res);
          if (res.code===0) {
            layer.msg('删除成功');
            
          }else{
            layer.msg('网络异常，请稍后再试')
          }
          setTimeout(() => {
            that.search();
          }, 1000);
        })
      }, function () {
        // console.log('取消');
      })
    })
  }


  // 最后
  $(function () {
    var banner = new Banner();
    banner.bindDOM();
    banner.search(); // 默认渲染第一页
  })
})();