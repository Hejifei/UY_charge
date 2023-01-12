import {tabbar_data_list, tabbar_info_view_value} from '../../common/index'


Component({
    properties: {
        active: {
            type: String,
            value: undefined,
        },
    },
    data: {
        tabbar_data_list,
        // active: tabbar_info_view_value,
    },
    onLoad() {
        console.log('onLoad')
    },
    onShow() {
        console.log('onShow')
    },
    methods: {
        onChange(event: any) {
            const value: string = event.detail
            const router = tabbar_data_list.filter(item => item.value === value)[0]?.router
            wx.navigateTo({
                url: router,
            })
        },
    }
  })
