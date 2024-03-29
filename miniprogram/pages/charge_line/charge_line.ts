import {writeAndReadBLECharacteristicValue,} from '../../utils/bluetooth_util'
import {
  parseProtocolCodeMessage,
  analyzeProtocolCodeMessage,
  parseProtocolCodeToChargeCountData,
  ab2hex,
  parse16To10,
} from '../../utils/protocol_util'
import Chart from './chart';
import { createElement } from '@antv/f2';
// import Dialog from '@vant/weapp/dialog/dialog';

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
    connected: app.globalData.connected || false, //  是否连接蓝牙
    onRenderChart() {
        return createElement(Chart, {
          data: [],
        });
    },
    noDataText: '暂无数据',
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
    this.setData({
        connected: app.globalData.connected || false,
    })
    console.log({
        connected: app.globalData.connected || false,
    }, '充电曲线 弹窗显示')
    this.readData()
    wx.onBLECharacteristicValueChange(res => {
        const value = ab2hex(res.value)
        console.log({
            res,
            value,
        }, '收到数据 onBLECharacteristicValueChange -------')
        if (value.startsWith('55590a013000')) {
            this.setData({
                noDataText: '无充电记录数据',
            })
        } else if (value.startsWith('55590a')) {
            //  读取充电器信息
            // todo
            const baseInfoResponseData = analyzeProtocolCodeMessage(value, '0a293000')
            const dataLength = parse16To10(value.substring(6, 8))
            const countOfData = (dataLength - 1) / 4;
            this.setData({
                noDataText: '暂无数据'
            })
            this.renderChart(baseInfoResponseData, countOfData)
        }
    })
    

    // if (!app.globalData.connected) {
    //     Dialog.alert({
    //         title: '设备连接',
    //         message: '暂无设备连接,请连接设备',
    //         // theme: 'round-button',
    //         confirmButtonText: '连接设备',
    //         confirmButtonColor: 'green',
    //       }).then(() => {
    //         // on close
    //         wx.navigateTo({
    //             url: '/pages/setting_center/device_manage/device_manage',
    //         })
    //       });
    // }

    // const value = '55590A09300005055D055F01F001F3D027'
    // const baseInfoResponseData = analyzeProtocolCodeMessage(value, '0A093000')
    // const dataLength = parse16To10(value.substring(6, 8))
    // const countOfData = (dataLength - 1) / 4;
    // this.setData({
    //     noDataText: '暂无数据'
    // })
    // this.renderChart(baseInfoResponseData, countOfData)
  },
  changePageToDeviceManage() {
    wx.navigateTo({
        url: '/pages/setting_center/device_manage/device_manage',
    })
  },
  readData() {
    wx.showToast({
        title: "",
        icon: "loading",
        mask: true,
        duration: 500,
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
      'ff',
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
  renderChart(value: string, countOfData: number) {
    // const chargeCountData =  analyzeProtocolCodeMessage('0a00160018001a001c001e00200022002400260028000b000c000d000e000f00100011001200130014', '0A293000')
    // const chargeCountData =  analyzeProtocolCodeMessage('55590A2930000A07D00836089C0901096109CE0A2F0A8C0AEF00000BB80BB30BB10BB50BBD0BB90BAE0BA40BA10000A399', '0A293000')
    // const chargeCountData =  analyzeProtocolCodeMessage(value, '0A293000')
    // const re = /^[0]*$/;
    // || re.test(value)
    this.setData({
        isNoData: !value,
    })
    if (!value) {
        return
    }
    const data = parseProtocolCodeToChargeCountData(value, countOfData)
    console.log({
        value,
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
