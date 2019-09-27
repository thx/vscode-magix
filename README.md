# Magix 辅助开发插件

## 功能

### 自定义StatusBar快捷方式功能

<img src="https://img.alicdn.com/tfs/TB1.xXzgKbviK0jSZFNXXaApXXa-1284-676.gif" alt="js跳转" width="800"/>

### 失效 Rap 引用扫描功能

<img src="https://img.alicdn.com/tfs/TB1SYb6heT2gK0jSZFvXXXnFXXa-1284-676.gif" alt="js跳转" width="800"/>

### 跳转到Rap定义功能
通过快捷键`MAC键+鼠标点击`,支持 Rap 接口名称跳转到Rap2页面功能

<img src="https://img.alicdn.com/tfs/TB1z.D9hhv1gK0jSZFFXXb0sXXa-1051-557.gif" alt="js跳转" width="800"/>

### iconfont 预览功能

<img src="https://img.alicdn.com/tfs/TB1TROXX7L0gK0jSZFAXXcA9pXa-921-532.gif" alt="js跳转" width="800"/>

### magix3 模板语法高亮功能！

给 handlebars 实现新的 grammar 实现，自动支持 .tpl .html 扩展名的着色，如果你的扩展名不同，请在 配置中将你的扩展名指派给 handlebars

```javascript
"files.associations": {
        "*.xxx": "handlebars"
},
```

### html模板页与js页跳转

通过快捷键`Alt+Tab`、`MAC键+鼠标点击 Magix tmpl属性值`、`右键快捷方式`，支持 html模板页与之相关联的js页跳转:

`Alt+Tab`
![js跳转](https://img.alicdn.com/tfs/TB1BSndOpzqK1RjSZFoXXbfcXXa-1139-555.gif)
`右键快捷方式`
<img src="https://img.alicdn.com/tfs/TB1WKYcOxTpK1RjSZFKXXa2wXXa-1139-555.gif" alt="js跳转" width="800"/>
`MAC键+鼠标点击 Magix tmpl属性值`
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

### 0.0.1

html页面与js跳转功能

### 0.0.2

函数跳转功能

### 0.0.3

函数自动提示

### 0.0.4

Diamond 快捷功能

### 0.0.5

html 模板语法折叠功能

### 0.2.0

html 模板语法高亮

### 0.3.0

iconfont图标 悬浮展示

### 0.6.2

自定义StatusBar快捷方式功能
失效 Rap 引用扫描功能
跳转到Rap定义功能

