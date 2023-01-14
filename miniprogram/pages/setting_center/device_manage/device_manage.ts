
// const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    connected: 1,   //  已连蓝牙的id
    historyDeviceList: [
        // {
        //     id: 1,
        //     name: 'UY0001',
        // },
        // {
        //     id: 2,
        //     name: 'UY0002',
        // },
        // {
        //     id: 3,
        //     name: 'UY0003',
        // },
        // {
        //     id: 4,
        //     name: 'UY0004',
        // },
        // {
        //     id: 5,
        //     name: 'UY0005',
        // },
    ]
  },
  onLoad() {
  },
  onReady() {
    const that = this
    wx.getSystemInfo({
        success(res) {
            const {windowHeight, screenHeight, statusBarHeight} = res
            const barhHeight = screenHeight - windowHeight
            let menu = wx.getMenuButtonBoundingClientRect()
            let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
            const navTopHeight = statusBarHeight + navBarHeight / 2 - 12
            that.setData({
                barhHeight,
                titlePositionTop: navTopHeight,
            })
        }
    })
  },
  handleUnConnect() {
    if (!this.data.connected) {
        return
    }
      console.log('断开连接')
    this.setData({
        connected: 0,
    })
  },
  changeBluetoothConnect(event: any) {
    const {id} = event.target.dataset
    if (id === this.data.connected) {
        return
    }
    this.setData({
        connected: id,
    })
  },
  backPageToSettingCenter() {
    wx.redirectTo({
        url: '/pages/setting_center/setting_center'
    })
  },
  changePageToAddDevice() {
    wx.navigateTo({
        url: '/pages/setting_center/device_add/device_add',
    })
  }
})
