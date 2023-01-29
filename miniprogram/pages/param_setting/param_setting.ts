import {
    parseProtocolCodeMessage,
    parseVoltageOrCurrentVTo10mV,
    parse10To16,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargerInfo,
} from '../../utils/protocol_util'
import { Request } from '../../utils/request'
import {writeBLECharacteristicValue,} from '../../utils/bluetooth_util'
import '../../utils/lodash_fix'
import {
    isUndefined,
    isNull,
} from 'lodash'

const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    chargeSwitch: false,    //  充电开关
    electric_current_max: '', //  最大输出电流
    voltage_max: '',  //  最大输出电压
    charge_time: '',  //  充电定时
    isDebugModel: app.globalData.isDebugModel || false,
    configDefault: {
        charging_timing_default: '',
        output_current_default: '',
        output_current_ranage: '',
        output_voltage_default: '',
        output_voltage_ranage: '',
    }
  },
  onLoad() {
  },
  onShow() {
    this.getConfigDefaultValue()
    this.setData({
        isDebugModel: app.globalData.isDebugModel || false,
    })
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
  getConfigDefaultValue() {
    wx.showLoading({
        title: ""
    });
    try {
        Request({
            url: '/api/common/config',
            data: {},
            method: 'GET',
            successCallBack: (res: {data: IParamSettingDefaultValue}) => {
                // console.log({ res }, '/api/common/config')
                
                // todo 设备未配置值的时候插入默认值
                this.setData({
                    // voltage_max: res.output_voltage_default,
                    // electric_current_max: res.output_current_default,
                    // charge_time: res.charging_timing_default,
                    configDefault: res.data,
                })
                
                wx.hideLoading();
                
            },
        })
    } catch (err) {
        console.log({err})
        wx.hideLoading();
    }
  },
  onChargeSwitchChange({ detail }: {detail: boolean}) {
    // 需要手动对 checked 状态进行更新
    this.setData({chargeSwitch: detail});
  },
  clearElectricCurrentValue() {
    // 擦除充电器最大电压、最大电流
    // 55 59 03 04 00 04 50 55
    const buffer = parseProtocolCodeMessage(
        '03',
        '04',
        '0004',
        ''
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
  },
  resetElectricCurrent() {
    this.clearElectricCurrentValue()
    this.setData({
        electric_current_max: null,
    })
  },
  resetVoltage() {
    this.clearElectricCurrentValue()
    this.setData({
        voltage_max: null,
    })
  },
  clearChargeTime() {
    // 擦除充电器定时时间
    // 55 59 03 02 00 1A 30 5C
    const buffer = parseProtocolCodeMessage(
        '03',
        '02',
        '001A',
        ''
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
  },
  resetChargeTime() {
    this.clearChargeTime()
    this.setData({
        charge_time: null,
    })
  },
  //    设置充电器输出电流、电压
  setChargerVoltageAndCurrent() {
    const electric_current_max = this.data.electric_current_max
    const voltage_max = this.data.voltage_max
    const chargeSwitch = this.data.chargeSwitch
    const configDefault = this.data.configDefault
    const {
        output_voltage_ranage,
        output_current_ranage,
    } = configDefault
    if (!output_voltage_ranage || !output_current_ranage) {
        wx.showToast({
            title: '请配置最大输出电流或输出电压数据范围',
            icon: "none",
            duration: 3000
        })
        return
    }
    const [output_voltage_min, output_voltage_max] = output_current_ranage.split('-')
    const [output_current_min, output_current_max] = output_current_ranage.split('-')
    if (isUndefined(electric_current_max) || isNull(electric_current_max)) {
        wx.showToast({
            title: '请输入最大输出电流',
            icon: "none",
            duration: 3000
        })
        return
    }
    if (electric_current_max < output_current_min || electric_current_max > output_current_max) {
        wx.showToast({
            title: `请确保最大输出电流在${output_current_min}-${output_current_max}之间`,
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
    if (voltage_max < output_voltage_min || voltage_max > output_voltage_max) {
        wx.showToast({
            title: `请确保最大输出电压在${output_voltage_min}-${output_voltage_max}之间`,
            icon: "none",
            duration: 3000
        })
        return
    }
    const buffer = parseProtocolCodeMessage(
        '02',
        '06',
        '0002',
        parse10To16(chargeSwitch ? 1 : 2, 1) +
        '00' +
        parse10To16(parseVoltageOrCurrentVTo10mV(parseFloat(voltage_max)), 2) + 
        parse10To16(parseVoltageOrCurrentVTo10mV(parseFloat(electric_current_max)), 2)
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
    this.setChargerVoltageAndCurrent()
    this.setChargerSetTime()
  }
})
