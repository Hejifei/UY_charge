
Page({
  data: {
    barhHeight: 0,
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
  }
})
