# Magix 辅助开发插件

## 功能

### 代码中图片链接hover展示图片功能


<img src="https://img.alicdn.com/tfs/TB1ivTrCuL2gK0jSZFmXXc7iXXa-877-376.gif" alt="js跳转" width="800"/>

### Gallery 组件悬浮提示功能

鼠标悬浮到Gallery组件的html标签上，能出现组件名称及文档链接

<img src="https://img.alicdn.com/tfs/TB1.7v9vAY2gK0jSZFgXXc5OFXa-690-366.gif" alt="js跳转" width="800"/>


### mx-view 跳转到定义功能

通过快捷键`Command键+鼠标点击`，编辑器调转到相应的页面

<img src="https://img.alicdn.com/tfs/TB18.26vuL2gK0jSZPhXXahvXXa-690-366.gif" alt="js跳转" width="800"/>

### 样式文件 跳转到定义功能

通过快捷键`Command键+鼠标点击`，编辑器调转到相应的样式页面

<img src="https://img.alicdn.com/tfs/TB1ZfAXvq61gK0jSZFlXXXDKFXa-690-366.gif" alt="js跳转" width="800"/>

### iconfont 输入提示功能

编辑 html 时，输入 ‘&’ 后，会提示所有iconfont 引用

<img src="https://img.alicdn.com/tfs/TB1cKrtkVP7gK0jSZFjXXc5aXXa-763-458.gif" alt="js跳转" width="800"/>

### iconfont 预览功能

支持多个iconfont项目引用，通过class name 进行提示。

<img src="https://img.alicdn.com/tfs/TB1wrcZkebviK0jSZFNXXaApXXa-763-458.gif" alt="js跳转" width="800"/>

### 自定义StatusBar快捷方式功能

<img src="https://img.alicdn.com/tfs/TB1.xXzgKbviK0jSZFNXXaApXXa-1284-676.gif" alt="js跳转" width="800"/>

### Rap 悬浮提示功能

<img src="https://img.alicdn.com/tfs/TB14Q39lQT2gK0jSZFkXXcIQFXa-687-515.gif" alt="悬浮提示功能" width="800"/>

### 失效 Rap 引用扫描功能

<img src="https://img.alicdn.com/tfs/TB1SYb6heT2gK0jSZFvXXXnFXXa-1284-676.gif" alt="js跳转" width="800"/>

### 跳转到Rap定义功能

在Magix 插件配置页面，可以设置 Rap跳转方式

<img src="https://img.alicdn.com/tfs/TB1a9BihUH1gK0jSZSyXXXtlpXa-1283-634.gif" alt="js跳转" width="800"/>

通过快捷键`Command键+鼠标点击`,支持 Rap 接口名称跳转到Rap2页面功能

<img src="https://img.alicdn.com/tfs/TB1z.D9hhv1gK0jSZFFXXb0sXXa-1051-557.gif" alt="js跳转" width="800"/>

通过`鼠标右键选择菜单`,支持 Rap 接口名称跳转到Rap2页面功能

<img src="https://img.alicdn.com/tfs/TB1dRMJhp67gK0jSZPfXXahhFXa-914-530.gif" alt="js跳转" width="800"/>

### magix3 模板语法高亮功能！

给 handlebars 实现新的 grammar 实现，自动支持 .tpl .html 扩展名的着色，如果你的扩展名不同，请在 配置中将你的扩展名指派给 handlebars

```javascript
"files.associations": {
        "*.xxx": "handlebars"
},
```

### html模板页与js页跳转

通过快捷键`Alt+Tab`、`Command键+鼠标点击 Magix tmpl属性值`、`右键快捷方式`，支持 html模板页与之相关联的js页跳转:

`Alt+Tab`
![js跳转](https://img.alicdn.com/tfs/TB1BSndOpzqK1RjSZFoXXbfcXXa-1139-555.gif)
`右键快捷方式`

<img src="https://img.alicdn.com/tfs/TB1WKYcOxTpK1RjSZFKXXa2wXXa-1139-555.gif" alt="js跳转" width="800"/>

`Command键+鼠标点击 Magix tmpl属性值`
<img src="https://img.alicdn.com/tfs/TB13IHhOpzqK1RjSZFCXXbbxVXa-1139-555.gif" alt="js跳转" width="800"/>

注意：由于跳转功能是基于 magix3的js/ts写法的语法分析，仅支持下面写法的跳转功能,特殊项目可联系 **@灼日** **@抱血** 添加适配

```javascript
  var Magix = require('magix');
  module.exports = Magix.View.extend(
    temp:'@index.html',
    init:function(){},
    render:function(){}
  );
```
### html mx-前缀函数跳转至定义

通过快捷键`MAC键+鼠标点击`，支持 html模板页函数跳转到与之相关联的js定义:

<img src="https://img.alicdn.com/tfs/TB1HcjaOBLoK1RjSZFuXXXn0XXa-1139-555.gif" alt="hstz" width="800"/>

### html magix mx-事件提示 

<img src="https://img.alicdn.com/tfs/TB17yPcOxTpK1RjSZFMXXbG_VXa-1139-555.gif" alt="hsts" width="800"/>

### html 模板代码折叠

<img src="https://img.alicdn.com/tfs/TB1LM_gOwHqK1RjSZFEXXcGMXXa-1139-555.gif" alt="Diamond" width="800"/>

## 加群有惊喜

<img src="https://img.alicdn.com/tfs/TB1iKi.OrPpK1RjSZFFXXa5PpXa-386-558.jpg" alt="Diamond" width="400"/>

## 版本说明

### 0.16.0

* 更新Gallery文档。
* 添加mx-table 转换 mx-stickytable 逻辑
### 0.15.1

插件只在Magix项目中展示相关菜单。
### 0.15

在左侧资源管理窗口和文本编辑窗口添加复制Magix相对路径功能。

### 0.14

接入GogoAST，支持GogoCode代码转换功能

### 0.13.8

异步文件读取、处理网络阻塞、避免 build 造成系统死机问题

### 0.13.2

优化文件监听、避免 build 造成系统死机问题

### 0.13.1

梳理无用 console 
处理 React代码转换 MuxInput 模板生成错误问题
添加VSCode关闭侧边窗体回收功能

### 0.13.0

代码中图片链接hover展示图片功能
修复 Magix html 模版代码遇到空格不能折叠问题
修复 mx-view 绝对路径不能跳转问题

### 0.12.0

修复代码编译后，扫描build文件夹，造成插件假死的问题
添加 Magix2.0+VUE 代码向 React Marquex 平台转换功能

### 0.11.0

优化 webview 打开方式，做到窗口复用
优化 StatusBar 设置，无需重启就能更新
添加 mx-view 跳转功能
添加 Magix Gallery 悬浮提示功能
添加 样式文件跳转功能

### 0.9.0

添加 Rap 悬浮提示功能
插件添加图标

### 0.8.1

Magix 项目信息获取异常 bugfix

### 0.8.0

Iconfont 图标悬浮提示
Iconfont 输入提示功能

### 0.6.2

自定义StatusBar快捷方式功能
失效 Rap 引用扫描功能
跳转到Rap定义功能

### 0.3.0

iconfont图标 悬浮展示

### 0.2.0

html 模板语法高亮

### 0.0.5

html 模板语法折叠功能

### 0.0.4

Diamond 快捷功能

### 0.0.3

函数自动提示

### 0.0.2

函数跳转功能

### 0.0.1

html页面与js跳转功能














