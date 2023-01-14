
// const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
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
  xxx() {
    
  },
})
