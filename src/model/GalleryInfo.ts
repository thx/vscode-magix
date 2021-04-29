export class GalleryInfo {
    private static LIST = [
        {
            type: 'mx-stickytable', data: {
                title: '表格',
                subTitle: '',
                url: '/stickytable/desc',
                code: ``
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
                code: ``
            }
        },
        {
            type: 'mx-pagination', data: {
                title: '分页',
                subTitle: '',
                url: '/pagination/index',
                code: ``
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
                code: ``
            }
        },
        {
            type: 'mx-search', data: {
                title: '搜索',
                subTitle: '支持选择类型搜索和普通搜索',
                url: '/search/index',
                code: ``
            }
        },
        {
            type: 'mx-suggest', data: {
                title: '可选项提示suggest',
                subTitle: '支持双向绑定',
                url: '/suggest/index',
                code: ``
            }
        },
        {
            type: 'mx-switch', data: {
                title: '开关',
                subTitle: '支持双向绑定',
                url: '/switch/index',
                code: ``
            }
        },
        {
            type: 'mx-tree', data: {
                title: 'tree 树状结构',
                subTitle: '支持双向绑定',
                url: '/tree/index',
                code: ``
            }
        },
        {
            type: 'mx-cascade', data: {
                title: '级联选择',
                subTitle: '支持双向绑定',
                url: '/cascade/index',
                code: ``
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
                code: ``
            }
        },
        {
            type: 'mx-popmenu', data: {
                title: '更多菜单选择',
                subTitle: '',
                url: '/popmenu/index',
                code: ``
            }
        },
        {
            type: 'mx-uploader', data: {
                title: '上传',
                subTitle: '',
                url: '/uploader/index',
                code: ``
            }
        },
        {
            type: 'mx-slider', data: {
                title: '单个滑块',
                subTitle: '',
                url: '/slider/index',
                code: ``
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
                code: ``
            }
        },
        {
            type: 'mx-dragsort', data: {
                title: '拖动排序',
                subTitle: '',
                url: '/dragsort/index',
                code: ``
            }
        },
        {
            type: 'mx-copy', data: {
                title: '复制',
                subTitle: '该组件引入了第三方 https://clipboardjs.com/ 代码',
                url: '/copy/index',
                code: ``
            }
        },
        {
            type: 'mx-color', data: {
                title: '颜色选择',
                subTitle: '',
                url: '/color/index',
                code: ``
            }
        },
        {
            type: 'mx-popover', data: {
                title: '气泡提示',
                subTitle: '默认使用span标签生成，可自定义tag',
                url: '/popover/index',
                code: ``
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
                code: ``
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
                code: ``
            }
        },
        {
            type: 'mx-carousel', data: {
                title: '轮播',
                subTitle: '',
                url: '/carousel/index',
                code: ``
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
                code: ``
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