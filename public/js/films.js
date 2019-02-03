
(function () {
  //定义构造函数

  var Films = function () {
    //定义空数组，转载数据
    this.filmsList = [];

    //需要用到的dom元素
    this.dom = {
      //新增的模态框
      addModal: $('#addModal'),
      //添加模态框中的输入框
      urlInput: $('#inputPassword3'),
      nameInput: $('#inputEmail3'),
      actorInput: $('#inputActor'),
      palceInput: $('#inputPlace'),
      timeInput: $('#inputTime'),
      typeInput: $('#inputType'),
      gradeInput: $('#inputGrade'),
      //添加模态框的确认添加按钮
      submitAdd: $('#filmsAdd'),
      //修改模态框
      exampleModal: $('#exampleModal'),
      //修改模态框的评分输入框和图片地址输入框
      updateGradeInput: $('#recipient-name'),
      updateUrlInput: $('#message-text'),
      //修改模态框的确认修改按钮
      submitUpdate: $('#bannerUpdate'),
      //修改模态框中的隐藏框
      hiddenInput: $('#message-hidden'),
      //需要渲染的ul
      ul: $('.filmsLIst')
    }
  }

  //添加数据库操作
  Films.prototype.add = function () {
    var that = this;
    $.post('/films/add', {
      name: this.dom.nameInput.val(),
      imgUrl: this.dom.urlInput.val(),
      actors: this.dom.actorInput.val(),
      place: this.dom.palceInput.val(),
      time: this.dom.timeInput.val(),
      type: this.dom.typeInput.val(),
      grade: this.dom.gradeInput.val()
    }, function (res) {//回调函数，判断是否添加操作成功
      if (res.code === 0) {
        layer.msg('添加成功');
        setTimeout(() => {
          that.search();
        }, 1000);
      } else {
        layer.msg('网络异常，请稍后再试')
      }
      //操作完成后，关闭模态框，及清空输入框的内容
      that.dom.addModal.modal('hide');
      that.dom.nameInput.val('');
      that.dom.urlInput.val('');
      that.dom.actorInput.val('');
      that.dom.palceInput.val('');
      that.dom.timeInput.val('');
      that.dom.typeInput.val('');
      that.dom.gradeInput.val('');
    });
  }

  //查询数据库操作
  Films.prototype.search = function () {
    var that = this;
    $.get('/films/search', function (result) {
      if (result.code === 0) {
        //查询数据成功
        layer.msg('查询成功');
        //将后台查询的数据存放起来
        that.filmsList = result.data;

        //调用渲染ul页面的方法
        that.renderUl();

      } else {
        console.log(result.msg);
        console.log(1)
        layer.msg('网络异常，请稍后再试');
      }
    });
  }

  //修改数据库操作
  Films.prototype.update = function () {
    var that = this;
    $.post('/films/update', {
      id: this.dom.hiddenInput.val(),
      filmsGrade: this.dom.updateGradeInput.val(),
      filmsUrl: this.dom.updateUrlInput.val()
    }, function (res) {
      if (res.code === 0) {
        //修改成功
        layer.msg('修改成功');

      } else {
        layer.msg('网络异常，请稍后再试');
      }
      //操作完成后，关闭模态框，及请空输入框的内容
      that.dom.exampleModal.modal('hide');
      that.dom.updateGradeInput.val('');
      that.dom.updateUrlInput.val('');
      setTimeout(() => {
        that.search();
      }, 1000);
    })
  }

  //dom元素操作的所有方法
  Films.prototype.bindDom = function () {
    var that = this;
    //点击确认新增按钮，调用add
    this.dom.submitAdd.click(function () {
      that.add();
    });
    //删除按钮的点击事件
    this.dom.ul.on('click', '.flimDelete', function () {
      //获取该标签自定义属性，即数据库中id
      var id = $(this).data('id');
      layer.confirm('您确定删除该影片所有信息嘛？', function () {
        $.post('/films/delete', {
          id: id
        }, function (data) {
          if (data.code === 0) {
            //删除成功
            layer.msg('删除成功');
          } else {
            layer.msg('网络异常，请稍后再试')
          }
          setTimeout(() => {
            that.search()
          }, 1000);
        })
      }, function () {
        console.log('取消');
      })

    });

    //修改按钮的点击事件，修改数据
    this.dom.ul.on('click', '.flimUpdate', function () {
      that.dom.hiddenInput.val($(this).data('id'));
      that.dom.updateGradeInput.val($(this).data('grade'));
      that.dom.updateUrlInput.val($(this).data('url'));

      that.dom.submitUpdate.click(function () {
        that.update();
      })
    })

  }

  //拿取数据库信息，渲染页面操作
  Films.prototype.renderUl = function () {
    for (let i = 0; i < this.filmsList.length; i++) {
      var item = this.filmsList[i];
      this.dom.ul.append(
        `
        <li class="nowFilmShow">
            <a href="javascript:;" class="filmItem">
              <div class="filmImg">
                <img src="${item.imgUrl}"
                  alt="">
              </div>
              <div class="filmDetail">
                <div class="filmName">
                  <span class="nowFlimName">${item.name}</span>
                  <span class="filmType">${item.type}</span>
                </div>
                <div class="filmGrade">
                  <span class="zcw-label">观众评分</span><span class="labelGrade">${item.grade}</span>
                </div>
                <div class="filmActors">
                  主演：${item.actors}
                </div>
                <div class="filmPlace">
                  ${item.place} | ${item.time}
                </div>
              </div>
              <div class="doFilm">
                  <object><a href="javascript:;" class="flimDelete" data-id="${item._id}">删除</a></object>
                  <object><a data-id="${item._id}" data-grade ="${item.grade}" data-url = "${item.imgUrl}" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" class="flimUpdate">修改</a></object>
              </div>
            </a>
          </li>
        `
      );
      // console.log(Number(item.grade));
      if (item.grade != undefined) {
        // console.log(item.grade)
        this.dom.ul.eq(i).find('.filmGrade').css('visibility', 'visible');
      } else {
        $('.filmGrade').css('visibility', 'hidden');
        // console.log(typeof(item.grade) );
      }
    }
  }



  //最后在页面渲染完成时，实例化flims
  $(function () {
    var films = new Films();
    //dom元素的方法调用
    films.bindDom();
    films.search();

  })

})()