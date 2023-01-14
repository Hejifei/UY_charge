
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
            let menu = wx.getMenuButtonBoundingClientRect()
            let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
            // let navStatusBarHeight = statusBarHeight + menu.height + (menu.top - navBarHeight * 2)
            console.log({
                statusBarHeight,
                navBarHeight,
                // navStatusBarHeight,
                res,
                menu,
            })
            const barhHeight = screenHeight - windowHeight
            that.setData({
                barhHeight,
                titlePositionTop: statusBarHeight + navBarHeight / 2 - 12,
            })
        }
    })
  },
  xxx() {
    
  },
})
