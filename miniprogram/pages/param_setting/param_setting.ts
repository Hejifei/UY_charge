

Page({
  data: {
    barhHeight: 0,
    chargeSwitch: false,    //  充电开关
    electric_current_max: null, //  最大输出电流
    voltage_max: null,  //  最大输出电压
    charge_time: null,  //  充电定时
  },
  onLoad() {
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
        // wx
        //     .createSelectorQuery()
        //     .in(this)
        //     .select(".van-tabbar")
        //     .boundingClientRect(function(res) {
        //         console.log({res}, 'xxx')
        //     }).exec()
  },
  onChargeSwitchChange({ detail }: {detail: boolean}) {
    // 需要手动对 checked 状态进行更新
    this.setData({chargeSwitch: detail});
  },
  resetElectricCurrent() {
    this.setData({
        electric_current_max: null,
    })
  },
  resetVoltage() {
    this.setData({
        voltage_max: null,
    })
  },
  resetChargeTime() {
    this.setData({
        charge_time: null,
    })
  },
  handleParamSettingSave() {
      console.log({
          data: this.data,
      })
  }
})
