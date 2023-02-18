import {writeAndReadBLECharacteristicValue,} from '../../utils/bluetooth_util'
import {
  parseProtocolCodeMessage,
  analyzeProtocolCodeMessage,
  parseProtocolCodeToChargeCountData,
  ab2hex,
} from '../../utils/protocol_util'
import Chart from './chart';
import { createElement } from '@antv/f2';

const app = getApp<IAppOption>()

// const data = [
//     { value: 4, name: '电压', time: '2023-01-12 11:00:00' },
//     { value: 3, name: '电压', time: '2023-01-12 11:10:00' },
//     { value: 6, name: '电压', time: '2023-01-12 11:20:00' },
//     { value: 7, name: '电压', time: '2023-01-12 11:30:00' },
//     { value: 2.3, name: '电压', time: '2023-01-12 11:40:00' },
//     { value: 6.8, name: '电压', time: '2023-01-12 11:50:00' },
//     { value: 3.5, name: '电压', time: '2023-01-12 12:00:00' },
//     { value: 3, name: '电压', time: '2023-01-12 12:10:00' },
//     { value: 6.2, name: '电压', time: '2023-01-12 12:20:00' },
//     { value: 5.3, name: '电压', time: '2023-01-12 12:30:00' },

//     { value: 2, name: '电流', time: '2023-01-12 11:00:00' },
//     { value: 6, name: '电流', time: '2023-01-12 11:10:00' },
//     { value: 5, name: '电流', time: '2023-01-12 11:20:00' },
//     { value: 9, name: '电流', time: '2023-01-12 11:30:00' },
//     { value: 3.3, name: '电流', time: '2023-01-12 11:40:00' },
//     { value: 4.8, name: '电流', time: '2023-01-12 11:50:00' },
//     { value: 6.5, name: '电流', time: '2023-01-12 12:00:00' },
//     { value: 7, name: '电流', time: '2023-01-12 12:10:00' },
//     { value: 8.2, name: '电流', time: '2023-01-12 12:20:00' },
//     { value: 30.3, name: '电流', time: '2023-01-12 12:30:00' },
//     // { value: 62.7, name: '电流', date: '2011-10-01' },
//     // { value: 58, name: '电压', date: '2011-10-02' },
//     // { value: 59.9, name: '电流', date: '2011-10-02' },
//     // { value: 53.3, name: '电压', date: '2011-10-03' },
//     // { value: 59.1, name: '电流', date: '2011-10-03' },
//   ];

Page({
  data: {
    barhHeight: 0,
    onRenderChart() {
        return createElement(Chart, {
          data: [],
        });
    },
    isNoData: true,
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
  },
  onShow() {
    this.readData()
    wx.onBLECharacteristicValueChange(res => {
        const value = ab2hex(res.value)
        console.log({
            res,
            value,
        }, '收到数据 onBLECharacteristicValueChange -------')
        if (value.startsWith('55590a293000')) {
            //  读取充电器信息
            const baseInfoResponseData = analyzeProtocolCodeMessage(value, '011e0000')
            console.log({
                baseInfoResponseData,
            })
            this.renderChart(baseInfoResponseData)
            // const info = parseProtocolCodeToChargerInfo(baseInfoResponseData)
            // console.log({
            //     info,
            // })
            // //  @ts-ignore
            // this.setData({
            //     voltage_max: info.maximumVoltage,
            //     electric_current_max: info.maximumCurrent,
            //     charge_time: info.chargingTiming,
            //     chargeSwitch: info.chargeSwitchValue === 1,
            // })
        }
    })

    // this.renderChart('1')
  },
  readData() {
    wx.showToast({
        title: "",
        icon: "loading",
        mask: true,
        duration: 2000,
    });
    const {
        deviceId,
        serviceId,
        characteristicId,
    } = app.globalData
    if (!deviceId || !serviceId || !characteristicId) {
        return
    }
    //  读取充电统计数据
    const buffer = parseProtocolCodeMessage(
      '0A',
      '29',
      '3000',
      ''
    )
    console.log({
      buffer,
    })
    try {
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
    } catch (err) {
      console.log({err}, 'getBaseInfoData')
    }
  },
  renderChart(value: string) {
    // const chargeCountData =  analyzeProtocolCodeMessage('0a00160018001a001c001e00200022002400260028000b000c000d000e000f00100011001200130014', '0A293000')
    // const chargeCountData =  analyzeProtocolCodeMessage('55590A2930000A07D00836089C0901096109CE0A2F0A8C0AEF00000BB80BB30BB10BB50BBD0BB90BAE0BA40BA10000A399', '0A293000')
    const chargeCountData =  analyzeProtocolCodeMessage(value, '0A293000')
    const re = /^[0]*$/;
    this.setData({
        isNoData: re.test(chargeCountData),
    })
    if (re.test(chargeCountData)) {
        return
    }
    const data = parseProtocolCodeToChargeCountData(chargeCountData)
    console.log({
      chargeCountData,
      data,
    })
    this.setData({
        onRenderChart() {
            return createElement(Chart, {
              data: data,
            });
        },
    })
  }
})
