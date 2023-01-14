
// const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    connected: undefined,   //  已连蓝牙的id
    deviceList: [
        {
            id: 1,
            name: 'UY0001',
        },
        {
            id: 2,
            name: 'UY0002',
        },
        {
            id: 3,
            name: 'UY0003',
        },
        {
            id: 4,
            name: 'UY0004',
        },
        {
            id: 5,
            name: 'UY0005',
        },
    ],
    descList: [
        '请确定设备以及开启连接模式;',
        '请确定设备以及开启连接模式;',
        '请确定设备以及开启连接模式;',
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
  changeBluetoothConnect(event: any) {
    const {id} = event.target.dataset
    if (id === this.data.connected) {
        return
    }
    this.setData({
        connected: id,
    })
  },
})
