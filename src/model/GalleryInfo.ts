export class GalleryInfo {
    private static LIST = [
        {
            type: 'mx-table', data: {
                title: '表格',
                subTitle: '',
                url: '/table/index1',
                code: `<mx-table sticky="true">
            <!-- 固定列，在table上配置left="true" -->
            <table class="table" left="true">
                <thead>
                    <tr>
                        {{for(let i=0;i<4;i++)}}
                        <th width="120">固定字段{{=i}}</th>
                        {{/for}}
                    </tr>
                </thead>
                <tbody>
                    {{for(let j=0;j<3;j++)}}
                    <tr>
                        {{for(let i=0;i<4;i++)}}
                        <td>固定内容{{=i}}</td>
                        {{/for}}
                    </tr>
                    <tr class="operation-tr">
                        <td colspan="4">
                            <a href="javascript:;" class="btn btn-white btn-small mr10">操作</a>
                            <a href="javascript:;" class="btn btn-white btn-small">操作</a>
                        </td>
                    </tr>
                    {{/for}}
                </tbody>
            </table>
            <!-- 滚动列，在table上直接配置center="true" -->
            <table class="table" center="true">
                <thead>
                    <tr>
                        {{for(let i=0;i<10;i++)}}
                        <th width="120">滚动{{=i}}</th>
                        {{/for}}
                    </tr>
                </thead>
                <tbody>
                    {{for(let j=0;j<3;j++)}}
                    <tr>
                        {{for(let i=0;i<10;i++)}}
                        <td>滚动内容{{=i}}</td>
                        {{/for}}
                    </tr>
                    <!-- 有操作项该行不可少 -->
                    <tr class="operation-tr">
                        <td colspan="10"></td>
                    </tr>
                    {{/for}}
                </tbody>
            </table>
        </mx-table>
        <mx-pagination class="table-pager-wrapper"
            total="100" 
            size="40" 
            page="1"/>`
            }
        },
        {
            type: 'mx-dropdown', data: {
                title: '下拉框',
                subTitle: '支持click展开和hover展开两种形式；下拉列表在组件内；支持双向绑定',
                url: '/dropdown/index',
                code: `<mx-dropdown class="w200" 
            searchbox="true" 
            selected="{{=selectedValue}}"
            list="{{@list}}"
            mx-change="select()" />`
            }
        },
        {
            type: 'mx-calendar', data: {
                title: '日历',
                subTitle: '支持双向绑定',
                url: '/calendar/index',
                code: `<mx-calendar.datepicker class="w200" 
            min="{{=min}}"
            max="{{=max}}"
            align="right"
            prefix="截止至"
            selected="{{=selected}}"
            mx-change="select()"/>`
            }
        },
        {
            type: 'mx-time', data: {
                title: '时分秒选择',
                subTitle: '支持双向绑定',
                url: '/time/index',
                code: `<mx-time class="w120" 
            id="{{=viewId}}_time"
            time="10:10:10"
            mx-change="change()" />`
            }
        },
        {
            type: 'mx-pagination', data: {
                title: '分页',
                subTitle: '',
                url: '/pagination/index',
                code: `<mx-pagination
            total="600" 
            sizes="{{@[20,40,50]}}"
            size="{{=size}}" 
            page="{{=page}}"
            mx-change="change()" />`
            }
        },
        {
            type: 'mx-tabs', data: {
                title: 'tab切换',
                subTitle: '一般适用于一级导航，支持双向绑定',
                url: '/tabs/index',
                code: ``
            }
        },
        {
            type: 'mx-editor', data: {
                title: '可编辑内容',
                subTitle: 'hover显示编辑按钮',
                url: '/editor/index',
                code: `<mx-editor
            tmpl="<span></span><span class='grey-solid-icon ml5'>打标</span>"
            content="{{=content}}"
            rules="{{@rules}}"
            mx-change="change()"></mx-editor>`
            }
        },
        {
            type: 'mx-search', data: {
                title: '搜索',
                subTitle: '支持选择类型搜索和普通搜索',
                url: '/search/index',
                code: `<mx-search class="w200"
            list="{{@list}}" 
            search-key="{{=searchKey}}"
            search-value="{{=searchValue}}"
            mx-change="search()"></mx-search>`
            }
        },
        {
            type: 'mx-suggest', data: {
                title: '可选项提示suggest',
                subTitle: '支持双向绑定',
                url: '/suggest/index',
                code: `<mx-suggest class="w250"
            selected="{{=selectedValue}}"
            placeholder="输入关键词搜索"
            list="{{@[{
                text: 'test1',
                value: 1
            }, {
                text: 'test12',
                value: 2
            }, {
                text: 'abc1',
                value: 3
            }, {
                text: 'abc2',
                value: 4
            }]}}"
            mx-change="suggest()"/>`
            }
        },
        {
            type: 'mx-switch', data: {
                title: '开关',
                subTitle: '支持双向绑定',
                url: '/switch/index',
                code: `<mx-switch class="mr20"
            state="{{=state}}"
            mx-change="toggle()"/>
        
        <a href="javascript:;" class="btn btn-brand" 
            mx-click="change()">切换状态</a>`
            }
        },
        {
            type: 'mx-tree', data: {
                title: 'tree 树状结构',
                subTitle: '支持双向绑定',
                url: '/tree/index',
                code: `<div class="mb20">
            <span class="color-9">当前已选中：</span>
            <span>{{=selected}}</span>
        </div>
        
        <mx-tree id="{{=viewId}}_tree"
            need-expand="true"
            has-line="true"
            list="{{@list}}"
            bottom-values="{{:selected{refresh:true}}}"></mx-tree>`
            }
        },
        {
            type: 'mx-cascade', data: {
                title: '级联选择',
                subTitle: '支持双向绑定',
                url: '/cascade/index',
                code: `<mx-cascade class="w200"
            selected="{{=selected}}"
            list="{{@list}}"
            mx-change="select()"></mx-cascade>
                `
            }
        },
        {
            type: 'mx-secradio', data: {
                title: '二级单选',
                subTitle: '',
                url: '/secradio/index',
                code: ``
            }
        },
        {
            type: 'mx-taginput', data: {
                title: '标签选择',
                subTitle: '支持双向绑定',
                url: '/taginput/index',
                code: `<a href="javascript:;" class="btn btn-brand" 
            mx-click="get()">获取选中值</a>
        
        <mx-taginput class="w280"
            id="{{=viewId}}_taginput"
            list="{{@list}}"
            selected="{{=selected}}"
            placeholder="请选择需要的值"/>`
            }
        },
        {
            type: 'mx-popmenu', data: {
                title: '更多菜单选择',
                subTitle: '',
                url: '/popmenu/index',
                code: `<mx-popmenu class="btn"
            menus="{{@[{
                value: 1,
                text: '操作1'
            }, {
                value: 2,
                text: '操作2'
            }, {
                value: 3,
                text: '操作3'
            }]}}"
            width="100"
            mx-change="select()">下中对齐</mx-popmenu>
        
        <mx-popmenu class="btn"
            menus="{{@[{
                value: 1,
                text: '操作1'
            }, {
                value: 2,
                text: '操作2'
            }, {
                value: 3,
                text: '操作3'
            }]}}"
            width="100"
            place="lt"
            mx-change="select()">左上对齐（lt）</mx-popmenu>
                    `
            }
        },
        {
            type: 'mx-uploader', data: {
                title: '上传',
                subTitle: '',
                url: '/uploader/index',
                code: `<mx-uploader class="btn btn-brand mr10"
            action="/creative/upload.action" 
            method="POST"
            name="images"
            multiple="true"
            accept="image/jpeg,image/png,image/jpg"
            mx-error="uploadError()"
            mx-success="uploadSuccess()">
            多个上传</mx-uploader>
        
        <mx-uploader class="btn btn-brand mr10"
            action="/creative/uploadImages.action" 
            method="POST"
            name="images"
            accept="image/jpeg,image/png,image/jpg"
            mx-error="uploadError()"
            mx-success="uploadSuccess()">
            单个上传</mx-uploader>
        
        <mx-uploader class="btn btn-disabled"
            action="/creative/uploadImages.action" 
            method="POST"
            name="images"
            disabled="true"
            accept="image/jpeg,image/png,image/jpg"
            mx-error="uploadError()"
            mx-success="uploadSuccess()">
            禁用上传</mx-uploader>`
            }
        },
        {
            type: 'mx-slider', data: {
                title: '单个滑块',
                subTitle: '',
                url: '/slider/index',
                code: `<mx-slider
            width="160"
            need-input="true"
            max="200"
            min="100"
            value="{{=cur}}"
            step="0.05"
            tip="元"
            mx-change="showValue()"/>`
            }
        },
        {
            type: 'mx-indics', data: {
                title: '指标默认配置及选择排序',
                subTitle: '',
                url: '/indics/index',
                code: ``
            }
        },
        {
            type: 'mx-status', data: {
                title: 'icon状态切换与显示',
                subTitle: '结合iconfont使用，用icon缩略显示当前状态属性',
                url: '/status/index',
                code: `<mx-status 
            opers="{{@opers}}" 
            selected="{{=cur.value}}"
            mx-change="change()"/>`
            }
        },
        {
            type: 'mx-dragsort', data: {
                title: '拖动排序',
                subTitle: '',
                url: '/dragsort/index',
                code: `<!-- mx-view 指到组件地址 -->
            <ul mx-view="app/gallery/mx-dragsort/index" 
                mx-dragfinish="drag()">
                {{each items as item}}
                <li class="item" data-value="{{=item}}">{{=item}}</li>
                {{/each}}
            </ul>
                            `
            }
        },
        {
            type: 'mx-copy', data: {
                title: '复制',
                subTitle: '该组件引入了第三方 https://clipboardjs.com/ 代码',
                url: '/copy/index',
                code: `<div class="mb20">
            <mx-copy copy-node="{{=viewId}}_text_1" class="btn btn-brand"
                mx-success="done()">复制</mx-copy>
            {{if success}}
            <span class="color-green ml20">复制成功</span>
            {{/if}}
        </div>
        <textarea cols="30" rows="4" id="{{=viewId}}_text_1">Magix棒棒的！</textarea>`
            }
        },
        {
            type: 'mx-color', data: {
                title: '颜色选择',
                subTitle: '',
                url: '/color/index',
                code: `<mx-color.picker class="w200"
            color="{{=color}}"
            mx-change="changeColor()"/>
                `
            }
        },
        {
            type: 'mx-popover', data: {
                title: '气泡提示',
                subTitle: '默认使用span标签生成，可自定义tag',
                url: '/popover/index',
                code: `<mx-popover class="btn"
            content="默认下中间对齐">默认下中间对齐</mx-popover>`
            }
        },
        {
            type: 'mx-popconfirm', data: {
                title: '气泡确认框',
                subTitle: '点击出确认浮层',
                url: '/popconfirm/index',
                code: ``
            }
        },
        {
            type: 'mx-loading', data: {
                title: 'loading加载',
                subTitle: '',
                url: '/loading/index',
                code: `let Magix = require('magix');
            let Loading = require('@../../mx-loading/index');
            let $ = require('$');
            
            module.exports = Magix.View.extend({
                tmpl: '@index.html',
                mixins: [Loading],
                render() {
                    this.updater.digest();
                },
                'show<click>'(e){
                    let that = this;
                    that.showLoading();
            
                    setTimeout(() => {
                        that.hideLoading();
                    }, 3000);
                }
            });`
            }
        },
        {
            type: 'mx-gtip', data: {
                title: '全局提示',
                subTitle: '',
                url: '/gtip/index',
                code: ``
            }
        },
        {
            type: 'mx-error', data: {
                title: '异常页面',
                subTitle: '',
                url: '/error/index',
                code: ``
            }
        },
        {
            type: 'mx-feedback', data: {
                title: 'feedback',
                subTitle: '',
                url: '/feedback/index',
                code: ``
            }
        },
        {
            type: 'mx-wanxiang', data: {
                title: '老版万象客服问答',
                subTitle: '',
                url: '/wanxiang/index',
                code: ``
            }
        },
        {
            type: 'mx-im', data: {
                title: 'IM',
                subTitle: '万象、钉钉、旺旺',
                url: '/im/wanxiang',
                code: ``
            }
        },
        {
            type: 'mx-chart', data: {
                title: '图表',
                subTitle: 'chartpark图表使用示例',
                url: '/chart/index',
                code: ``
            }
        },
        {
            type: 'mx-dialog', data: {
                title: '浮层',
                subTitle: 'Magix.View上挂载mxDialog（新开浮层），alert（提醒），confirm（二次确认），点击空白处自动关闭浮层',
                url: '/dialog/index',
                code: ``
            }
        },
        {
            type: 'mx-preview', data: {
                title: '缩略图和预览',
                subTitle: '支持图片，视频，html，文件链，套图（大小图）',
                url: '/preview/index',
                code: `<!-- 不配展示尺寸按实际尺寸展示 -->
            <mx-preview class="demo"
                type="image"
                url="//img.alicdn.com/tfscom/TB10l9lbgZC2uNjSZFnXXaxZpXa.png"
                max-width="100"
                max-height="100"/>
            
            <!-- click-url 点击预览图的跳转链接 -->
            <mx-preview class="demo"
                type="image"
                url="//img.alicdn.com/tfscom/TB10l9lbgZC2uNjSZFnXXaxZpXa.png"
                click-url="//www.taobao.com/"
                width="400"
                height="125"
                max-width="100"
                max-height="100"/>`
            }
        },
        {
            type: 'mx-carousel', data: {
                title: '轮播',
                subTitle: '',
                url: '/carousel/index',
                code: `<mx-carousel height="100" autoplay="true" active="1" triggers="true">
            <mx-carousel.panel>
                <div class="bg bg1">1</div>
            </mx-carousel.panel>
            <mx-carousel.panel>
                <div class="bg bg2">2</div>
            </mx-carousel.panel>
            <mx-carousel.panel>
                <div class="bg bg3">3</div>
            </mx-carousel.panel>
        </mx-carousel>`
            }
        },
        {
            type: 'mx-collapse', data: {
                title: '折叠面板',
                subTitle: '可以折叠/展开的内容区域',
                url: '/collapse/index',
                code: ``
            }
        },
        {
            type: 'mx-main', data: {
                title: '流程类 - 侧边导航分步流程',
                subTitle: '',
                url: '/main/index',
                code: ``
            }
        },
        {
            type: 'mx-grid', data: {
                title: 'grid布局',
                subTitle: '基于display:flex实现，简化api',
                url: '/grid/index',
                code: ``
            }
        },
        {
            type: 'mx-checkbox', data: {
                title: 'checkbox',
                subTitle: '包装indeterminate状态，只负责对样式进行控制',
                url: '/checkbox/index',
                code: ``
            }
        },
        {
            type: 'mx-btn', data: {
                title: '按钮',
                subTitle: '',
                url: '/btn/index',
                code: ``
            }
        },
        {
            type: 'mx-effects', data: {
                title: '打标',
                subTitle: '',
                url: '/effects/icon',
                code: ``
            }
        },
        {
            type: 'mx-title', data: {
                title: '标题',
                subTitle: '',
                url: '/title/index',
                code: `<div class="page-header">
            <span class="first-header">一级标题</span>
            <span class="page-tip">标题提示文案</span>
        </div>
                `
            }
        },
        {
            type: 'mx-header', data: {
                title: '阿里妈妈站点吊头',
                subTitle: '',
                url: '/header/index',
                code: ``
            }
        },
        {
            type: 'mx-footer', data: {
                title: '阿里妈妈通用吊底',
                subTitle: '',
                url: '/footer/index',
                code: ``
            }
        },
        {
            type: 'mx-area', data: {
                title: '业务组件 -选择地域',
                subTitle: '',
                url: '/area/index',
                code: ``
            }
        },
        {
            type: 'mx-duration', data: {
                title: '业务组件 - 时段折扣',
                subTitle: '',
                url: '/duration/index',
                code: ``
            }
        },
        {
            type: 'mx-hour', data: {
                title: '业务组件 - 时段选择',
                subTitle: '',
                url: '/hour/index',
                code: ``
            }
        }
    ];

    public static get(key: string) {
        return this.LIST.find(item => {
            return item.type === key;
        });
    }

}