
// const app = getApp<IAppOption>()

Page({
  data: {
      chargeLineSettingDataList: [
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
          {voltage: undefined, eleCurrent: undefined},
      ]
  },
  onLoad() {
  },
  onInputChange(event) {
      const {index, name} = event.currentTarget.dataset
      const value = event.detail
      const chargeLineSettingDataList = this.data.chargeLineSettingDataList
      //    @ts-ignore
      chargeLineSettingDataList[index][name] = value
      this.setData({
        chargeLineSettingDataList: [...chargeLineSettingDataList]
      })
  },
  handleLineWrite() {
      console.log({
        chargeLineSettingDataList: this.data.chargeLineSettingDataList,
      })
  }
})
