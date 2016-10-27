# 支持多选的邮件自动补全提示插件
========

![example](./source/img/multiSelMail.gif)  

## 使用前提
**本插件需要jQuery库作为前提**，请自行引入  

## 简单使用
```
// 引入资源
<link rel="stylesheet" href="...multiSelMail.min.css">
<script src="...multiSelMail.min.js"></script>
// html元素
<div id="example"></div>
// js代码初始化
$('#example').multiSelMail();
```

关键说明1: **需要使用一个块级元素来初始化，且将会清空这个块级元素内容，之后输入框会占满整个元素，所以建议一开始固定好此块级元素高宽**  
关键说明2: **已选择的标签容器是绝对定位于输入框下的，难免会与输入框下原本的内容发生重叠，建议流出一定空白区域，最好能自定义一下这个标签容器**  

[查看更多示例](http://htmlpreview.github.com/?https://github.com/Cmd-Cmd/MultiSelMail/blob/master/index.html)

## 全部功能

### 基本默认功能
* 自动补全的尾缀有`@qq.com`、`@gmail.com`、`@126.com`、`@163.com`、`@sina.com`  
* 空格与回车按键作为选中待选项或以当前输入为选中项功能  
* 上下键用于在待选项中选择切换  
* ESC键取消掉当前输入  
* 点击已选标签删除掉此标签  

### 初始选项
```
通过初始化时的参数传入
$('#id').multiSelMail({
  mailList: ['@qq.com', '@gmail.com', '@126.com', '@163.com', '@sina.com'], // 邮箱自动补全的后缀列表
  single: false,                                                            // 是否开启单选模式
  style: {                                                                  // 追加样式表或直接写入行内样式
    input: {                                                                // 输入框样式
      class: '',                                                            // 追加输入框样式表
      css: {}                                                               // 写入输入框行内样式
    },
    list: {                                                                 // 下拉框样式
      class: '',                                                            // 追加下拉框样式表
      css: {}                                                               // 写入下拉框行内样式
    },
    listItem: {                                                             // 下拉框选项样式
      class: '',                                                            // 追加下拉框选项样式表
      css: {}                                                               // 写入下拉框选项行内样式
    },
    listItemReady: {                                                        // 下拉框备选项样式
      class: '',                                                            // 追加下拉框备选项样式表
      css: {}                                                               // 写入下拉框备选项行内样式
    },
    listItemHint: {                                                         // 下拉框高亮样式
      class: '',                                                            // 追加下拉框高亮样式表
      css: {}                                                               // 写入下拉框高亮行内样式
    },
    label: {                                                                // 已选标签容器样式
      class: '',                                                            // 追加已选标签容器样式表
      css: {}                                                               // 写入已选标签容器行内样式
    },
    labelItem: {                                                            // 已选标签样式
      class: '',                                                            // 追加已选标签样式表
      css: {}                                                               // 写入已选标签行内样式
    }
  },
  labelConId: '',                                                           // 自定义标签容器的ID
  confirm: true,                                                            // 是否进行邮箱格式验证
  confirmFunc: function(str){},                                             // 自定义邮箱验证函数，传入参数为待验证邮箱
  confirmFailStr: '',                                                       // 自动补全无选项且实时邮箱验证失败时的提示文字
  confirmFailFun: function(str){},                                          // 选中邮箱验证失败后执行的函数，传入参数为验证失败的邮箱
  confirmFailRep: function(str){},                                          // 选中邮箱重复后执行的函数，传入参数为重复的邮箱
  cancelSpace: false,                                                       // 取消空格自动选中功能
  cancelEnter: false,                                                       // 取消回车自动选中功能
  cancelEsc: false,                                                         // 取消ESC键取消当前输入功能
  cancelArrow: false,                                                       // 取消上下键选择待选项功能
  clickLabelFunc: function(str){}                                           // 点击已选标签时执行的函数，传入参数为点击的邮箱
})
```

### js可调用函数
```
var msm = $('#id').multiSelMail();
msm.getMails() - 获取当前已选中所有邮箱
msm.addMail(str, inx) - 添加已选中邮箱
    str - 邮箱地址
    inx - 插入顺序，可省，默认为插入到最后一个
msm.delMail(strOrInx, isNum) - 删除已选中邮箱
    strOrInx - 邮箱地址或顺序
    isNum - 当为true时第一个参数作为顺序，默认为false
msm.spliceMail(inx, num, strs...) - 添加/删除已选中邮箱
    inx - 添加/删除为位置
    num - 需要删除的数量
    strs... - 需要添加的邮箱地址
msm.editMail(strOrInx, str, isNum) - 编辑修改邮箱
    strOrInx - 邮箱地址或顺序
    str - 替换后的邮箱地址
    isNum - 当为true时，第一个参数作为顺序，默认为true
msm.setMail() - [仅单选模式]设置邮箱
msm.clrMail() - [仅单选模式]清除邮箱
```

## 功能说明
1. 单选模式下，`addMail`方法 *inx参数无效*，建议使用 **`setMail`** 方法  
2. 单选模式下，`delMail`方法 *所有参数无效*，建议使用 **`clrMail`** 方法  
3. 单选模式下，`splice`方法和`editMail`方法 *完全无效*  
4. 自定义标签容器时，自定义样式与原有样式均无效  
5. 自定义邮箱后缀表时，字符串请以 **@** 字符开头  

--------

# 开发历程
[之后补上csdn链接](#)  
小弟丑新一枚，第一次尝试写插件，虽然功能很简单但也被弄得晕头...  
还望走过路过的大佬给点建议与指正！欢迎各种批评与交流~
