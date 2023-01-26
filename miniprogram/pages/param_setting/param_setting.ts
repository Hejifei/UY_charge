import {
    parseProtocolCodeMessage,
    parseVoltageOrCurrentVTo10mV,
    parse10To16,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargerInfo,
} from '../../utils/protocol_util'
import {writeBLECharacteristicValue,} from '../../../utils/bluetooth_util'
import '../../utils/lodash_fix'
import {
    isUndefined,
    isNull,
} from 'lodash'

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
  onShow() {
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
    //  读取充电器信息
    const baseInfoResponseData =  analyzeProtocolCodeMessage('5559011E00000B5401000B7C0BB80B2E0BB3033700F005007000121609130100007800667FA5', '011E0000')
    const info = parseProtocolCodeToChargerInfo(baseInfoResponseData)
    //  @ts-ignore
    this.setData({
        voltage_max: info.maximumVoltage,
        electric_current_max: info.maximumCurrent,
        charge_time: info.chargingTiming,
        chargeSwitch: info.chargeSwitchValue === 1,
    })
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
  //    设置充电器输出电流、电压
  setChargerVoltageAndCurrent() {
    const electric_current_max = this.data.electric_current_max
    const voltage_max = this.data.voltage_max
    if (isUndefined(electric_current_max) || isNull(electric_current_max)) {
        wx.showToast({
            title: '请输入最大输出电流',
            icon: "none",
            duration: 3000
        })
        return
    }
    if (isUndefined(voltage_max) || isNull(voltage_max)) {
        wx.showToast({
            title: '请输入最大输出电压',
            icon: "none",
            duration: 3000
        })
        return
    }
    
    const buffer = parseProtocolCodeMessage(
        '02',
        '04',
        '0004',
        parse10To16(parseVoltageOrCurrentVTo10mV(voltage_max), 2) + 
        parse10To16(parseVoltageOrCurrentVTo10mV(electric_current_max), 2)
    )
    console.log({
        buffer,
      })
    try {
    // writeBLECharacteristicValue(
    //   'deviceId': string,
    //   serviceId: string,
    //   characteristicId: string,
    //   buffer: ArrayBuffer,
    // )
    } catch (err) {
        console.log({err}, 'getBaseInfoData')
    }
    console.log({
        data: this.data,
        voltage_max,
        electric_current_max,
        buffer,
    })

    //  充电器电流、电压 写入成功
    // '55590201015B00'
  },
  //    设置充电器输出电流、电压
  setChargerSetTime() {
    const charge_time = this.data.charge_time
    if (isUndefined(charge_time) || isNull(charge_time)) {
        wx.showToast({
            title: '请输入充电定时',
            icon: "none",
            duration: 3000
        })
        return
    }
    
    const buffer = parseProtocolCodeMessage(
        '02',
        '02',
        '001A',
        parse10To16(charge_time, 2)
    )
    try {
    // writeBLECharacteristicValue(
    //   'deviceId': string,
    //   serviceId: string,
    //   characteristicId: string,
    //   buffer: ArrayBuffer,
    // )
    } catch (err) {
        console.log({err}, 'getBaseInfoData')
    }
    console.log({
        data: this.data,
        charge_time,
        buffer,
    })

    //  充电器电流、电压 写入成功
    // '55590201015B00'
  },
  handleParamSettingSave() {
    // this.setChargerVoltageAndCurrent()
    this.setChargerSetTime()
  }
})
