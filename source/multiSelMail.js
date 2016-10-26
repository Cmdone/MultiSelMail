$.fn.multiSelMail = function(optIn) {
  // 默认选项
  var opt = {
    mailList: ['@qq.com', '@gmail.com', '@126.com', '@163.com', '@sina.com'], // 邮箱后缀列表
    single: false, // 是否单选
    style: { // 样式
      input: { // 输入框
        class: '',
        css: {}
      },
      list: {
        class: '',
        css: {}
      },
      listItem: {
        class: '',
        css: {}
      },
      listItemReady: {
        class: '',
        css: {}
      },
      listItemHint: {
        class: '',
        css: {}
      },
      label: {
        class: '',
        css: {}
      },
      labelItem: {
        class: '',
        css: {}
      }
    },
    labelConId: '',
    confirm: true,
    confirmFunc: undefined,
    confirmFailStr: '当前邮箱格式错误',
    confirmFailFun: function(str) {alert(str + '邮箱格式错误');},
    confirmFailRep: function(str) {alert(str + '邮箱已选择');},
    cancelSpace: false,
    cancelEnter: false,
    cancelEsc: false,
    cancelArrow: false,
    clickLabelFunc: undefined
  };
  $.extend(true, opt, optIn);

  var controller = new MultiSelMail(this); // 初始化对象

  var selInx = -1; // 上次输入时选中的提示索引
  var selList = []; // 可选索引
  var seledMail = (opt.single) ? '' : []; // 已选邮件列表

  // 输入框获得焦点
  controller.inp.on('focus input', function() {
    showBox();
  });

  // 点击区域非输入框或下拉框
  controller.inp.on('click', function() {
    return false;
  });
  controller.list.on('click', function() {
    return false;
  });
  $(document).on('click', function() {
    hideBox();
  });

  // 自动提示
  controller.inp.on('keyup', function(e) {
    if (!opt.cancelSpace && e.keyCode == 32) { // 空格
      var temp = controller.list.find('li.selMailOne.ready');
      if (temp.length == 1) {
        addMailLabel(temp.attr('data-mail'));
      } else {
        addMailLabel($(this).val().trim());
      }
    } else if (!opt.cancelEnter && e.keyCode == 13) { // 回车
      var temp = controller.list.find('li.selMailOne.ready');
      if (temp.length == 1) {
        addMailLabel(temp.attr('data-mail'));
      } else {
        addMailLabel($(this).val().trim());
      }
    } else if (!opt.cancelEsc && e.keyCode == 27) { // ESC
      hideBox();
    } else {
      renderList($(this).val()); // 渲染选择表
    }
  });

  // 下拉待选项 - 鼠标覆盖
  controller.list.on('mouseover', 'li.selMailOne', function() {
    controller.list.find('li.selMailOne')
                   .removeClass('ready')
                   .removeClass(opt.style.listItemReady.class)
                   .removeAttr('style');
    $(this).addClass('ready ' + opt.style.listItemReady.class)
          .css(opt.style.listItemReady.css);
    // 寻找序号
    var temp = $(this).attr('data-mail');
    if (temp != undefined) {
      selInx = opt.mailList.indexOf('@' + temp.split('@')[1]);
    }
  });

  // 下拉待选项 - 上下键
  controller.inp.on('keydown', function(e) {
    if (selList.length == 0 || opt.cancelArrow) {
      return;
    }
    if (e.keyCode == 40) { // 上键
      selInx++;
      while (selList.indexOf(selInx) == -1 && selInx < opt.mailList.length) {
        selInx++;
      }
      selInx = (selInx >= opt.mailList.length) ? selList[0] : selInx;
      e.preventDefault();
      renderList($(this).val());
    } else if (e.keyCode == 38) { // 下键
      selInx--;
      while (selList.indexOf(selInx) == -1 && selInx >= 0) {
        selInx--;
      }
      selInx = (selInx < 0) ? selList[selList.length - 1] : selInx;
      e.preventDefault();
      renderList($(this).val());
    }
  });

  // 点击列表项
  controller.list.on('click', 'li.selMailOne.ready', function() {
    addMailLabel($(this).attr('data-mail'));
  });

  // 点击标签
  controller.labels.on('click', 'span.selMailItem', function() {
    if ((typeof opt.clickLabelFunc).toLowerCase() == 'function') {
      opt.clickLabelFunc($(this).html());
    } else {
      delMailLabel($(this).html());
    }
  });

  // 添加新标签
  function addMailLabel(str, inx) {
    hideBox();
    if (!confirmMail(str)) {
      opt.confirmFailFun(str);
      if (opt.single) {
        controller.inp.val('');
      }
      return false;
    }
    if (seledMail.indexOf(str) != -1 && !opt.single) {
      opt.confirmFailRep(str);
      return false;
    }
    if (opt.single) { // 单选时
      seledMail = str;
    } else {
      if (inx >= 0 && inx < seledMail.length) {
        seledMail.splice(inx, 0, str);
      } else {
        seledMail.push(str);
      }
    }
    renderLabel();
  }

  // 删除标签
  function delMailLabel(str, inx) {
    if (opt.single) {
      seledMail = '';
    } else {
      if (inx == undefined) {
        inx = seledMail.indexOf(str);
      }
      if (inx >= 0 && inx < seledMail.length) {
        seledMail.splice(inx, 1);
      }
    }
    renderLabel();
  }

  // 渲染已选标签
  function renderLabel() {
    if (opt.single) {
      controller.inp.val(seledMail);
    } else {
      controller.labels.html('');
      for (var i = 0 ,len = seledMail.length; i < len; i++) {
        var temp = $('<span>').addClass('selMailItem')
                              .addClass(opt.style.labelItem.class)
                              .css(opt.style.labelItem.css)
                              .html(seledMail[i]);
        controller.labels.append(temp).append('\n');
      }
    }
  }

  // 验证邮箱格式
  function confirmMail(str) {
    if (!opt.confirm) {
      return true;
    } else if ((typeof opt.confirmFunc).toLowerCase() == 'function') {
      return opt.confirmFunc(str);
    } else {
      var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    }
  }

  // 渲染选择表
  function renderList(text) {
    controller.list.html('');
    selList = [];
    if (text.length == 0) {
      return;
    }
    // 提取前半部分，生成所有自动补全，再匹配输入渲染
    var key = text.split('@')[0];
    for (var i = 0, len = opt.mailList.length; i < len; i++) {
      var temp = key + opt.mailList[i];
      if (temp.indexOf(text) == 0) {
        selList.push(i);
        var tempLi = $('<li>').attr('data-mail', temp)
                              .addClass('selMailOne')
                              .addClass(opt.style.listItem.class)
                              .css(opt.style.listItem.css);
        if (selInx == i) {
          tempLi.addClass('ready ' + opt.style.listItemReady.class)
                .css(opt.style.listItemReady.css);
        }
        var tempSp = $('<span>').addClass('selMailHint')
                                .addClass(opt.style.listItemHint.class)
                                .css(opt.style.listItemHint.css);
        tempLi.append(tempSp.html(text)).append(temp.substr(text.length));
        controller.list.append(tempLi);
      }
    }
    // 邮箱验证提醒
    if (selList.length == 0) {
      var tempLi = $('<li>').addClass('selMailOne')
                            .addClass(opt.style.listItem.class)
                            .css(opt.style.listItem.css);
      tempLi.addClass('ready ' + opt.style.listItemReady.class)
            .css(opt.style.listItemReady.css);
      var tempSp = $('<span>').addClass('selMailHint')
                              .addClass(opt.style.listItemHint.class)
                              .css(opt.style.listItemHint.css);
      if (!confirmMail(text)) {
        tempLi.append(tempSp.html(opt.confirmFailStr));
      } else {
        tempLi.attr('data-mail', text);
        tempLi.append(tempSp.html(text));
      }
      controller.list.append(tempLi);
    }
  }

  // 下拉框弹出
  function showBox() {
    controller.list.css('display', 'block');
  };

  // 下拉框隐藏
  function hideBox() {
    controller.list.css('display', 'none').html('');
    if (!opt.single) {
      controller.inp.val('');
    }
    selInx = -1;
  };

  // 初始化控件对象
  function MultiSelMail(con) {
    this.container = con.addClass('selMailContainer'); // 容器
    // 已选标签
    if (opt.labelConId != '' && $('#' + opt.labelConId).length == 1) {
      this.labels = $('#' + opt.labelConId);
    } else {
      this.labels = $('<div>').addClass('selMailLabel ' + opt.style.label.class)
                              .css(opt.style.label.css);
    }

    // 下拉选择表
    this.list = $('<ul>').addClass('selMailBox ' + opt.style.list.class)
                         .css(opt.style.list.css);

    // 输入框
    this.inp = $('<input>').attr('type', 'text')
                           .addClass('selMailInput ' + opt.style.input.class)
                           .css(opt.style.input.css);

    // 初始化DOM结构
    this.container.html('');
    if (opt.labelConId == '' || $('#' + opt.labelConId).length != 1) {
      this.container.append(this.labels);
    }
    this.container.append(this.list)
                  .append(this.inp);
  }
  MultiSelMail.prototype.getMails = function() { // 获得已选所有标签
    return seledMail;
  };
  MultiSelMail.prototype.setMail = function(str) {
    if (opt.single) {
      addMailLabel(str);
    }
  };
  MultiSelMail.prototype.clrMail = function() {
    if (opt.single) {
      delMailLabel();
    }
  };
  MultiSelMail.prototype.addMail = function(str, inx) {
    addMailLabel(str.toString(), parseInt(inx));
  };
  MultiSelMail.prototype.delMail = function(str, isNum) {
    if (opt.single) {
      delMailLabel();
    } else {
      if (isNum) {
        delMailLabel('', parseInt(str));
      } else {
        delMailLabel(str.toString());
      }
    }
  };
  MultiSelMail.prototype.spliceMail = function(inx, num) {
    if (opt.single) {
      return;
    }
    for (var i = 0 ; i < num; i++) {
      delMailLabel('', parseInt(inx));
    }
    if (arguments.length > 2) {
      for (var i = arguments.length - 1; i >= 2; i--) {
        addMailLabel(arguments[i].toString(), parseInt(inx));
      }
    }
  };
  MultiSelMail.prototype.editMail = function(str1, str2, isNum) {
    if (opt.single) {
      return;
    }
    if (!isNum) {
      str1 = seledMail.indexOf(str1);
    }
    str1 = parseInt(str1);
    if (str1 >= 0 && str1 < seledMail.length) {
      if (!confirmMail(str2)) {
        opt.confirmFailFun(str2);
      } else if (seledMail.indexOf(str2) != -1) {
        opt.confirmFailRep(str2);
      } else {
        this.spliceMail(str1, 1, str2);
      }
    }
  };

  return controller;
};
