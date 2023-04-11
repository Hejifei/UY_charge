import { Request } from '../../../utils/request'
Page({
  data: {
    barhHeight: 0,
    content: '',
  },
  onLoad() {
    // console.log(ModBusCRC16('55590A293000'))
  },
  onReady() {
    const that = this
    wx.getSystemInfo({
        success(res) {
            const {windowHeight, screenHeight} = res
            const barhHeight = screenHeight - windowHeight
            that.setData({
                barhHeight,
            })
        }
    })
    this.getInitData()
  },
  getInitData() {
    const that = this
      Request({
        url: '/api/common/aboutus',
        data: {},
        method: 'GET',
        successCallBack: (res) => {
            console.log({ res }, '帮助')
            const content = res.data.help
            this.setData({
              content,
            })
        },
      })
  }
})
