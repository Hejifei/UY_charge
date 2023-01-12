import {tabbar_data_list, tabbar_info_view_value} from '../common/index'


Component({
    properties: {
        // active: {
        //     type: String,
        //     value: undefined,
        // },
    },
    data: {
        tabbar_data_list,
        active: tabbar_info_view_value,
    },
    // created attached detached
    // created() {
    //     console.log('created', {
    //         getCurrentPages: getCurrentPages(),
    //     })
    // },
    ready() {
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route
        const active = tabbar_data_list.filter(item => item.url === url)[0]?.value
        this.setData({
            active,
        })
        // console.log('ready', {
        //     getCurrentPages: getCurrentPages(),
        //     url,
        // })
    },
    // attached() {
    //     console.log('attached')
    // },
    // lifetimes: {
    //     attached: function() {
    //       // 在组件实例进入页面节点树时执行
    //       console.log('attached', {
    //         getCurrentPages: getCurrentPages(),
    //     })
    //     },
    //     detached: function() {
    //       // 在组件实例被从页面节点树移除时执行
    //       console.log('detached')
    //     },
    // },
    methods: {
        onChange(event: any) {
            const value: string = event.detail
            const router = tabbar_data_list.filter(item => item.value === value)[0]?.router
            wx.switchTab({
                url: router,
            })
            // this.setData({
            //     active: value,
            // })

            // console.log({
            //     value,
            //     router,
            //     data: this.data,
            // })
        },
    }
  })
