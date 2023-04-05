
Component({
    properties: {
        connected: {
            type: Boolean,
            value: undefined,
        },
    },
    data: {
    },
    created() {
    },
    methods: {
        changePageToDeviceManage() {
            wx.navigateTo({
                url: '/pages/setting_center/device_manage/device_manage',
            })
        },
    }
  })
