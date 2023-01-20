import { getIsDebugModel } from '../../utils/util'
import {writeBLECharacteristicValue,} from '../../utils/bluetooth_util'
const app = getApp<IAppOption>()

import {
    parseProtocolCodeMessage,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargerInfo,
} from '../../utils/protocol_util'
// const app = getApp<IAppOption>()

Page({
    storeTypes: ['numHandle', 'protocolInfo'],
    data: {
        barhHeight: 0,
        titlePositionTop: 0,
        isDebugModel: app.globalData.isDebugModel || false,
        // n: 1.5,     // 不规则三角形放大比例
        // m: 90,      // 得分
        // path: '',   // 表盘刻度线路径
        // x: -124,    // 得分进度条起点x
        // y: 0,       // 得分进度条起点y
        // timer: 0,    
    },
    onShow() {
        this.setData({
            isDebugModel: app.globalData.isDebugModel || false,
        })
        // this.deawCircleProcess()
        const that = this
        wx.getSystemInfo({
            success(res) {
                const { screenHeight, statusBarHeight, safeArea } = res
                // const barhHeight = screenHeight - windowHeight
                const barhHeight = screenHeight - safeArea.height
                let menu = wx.getMenuButtonBoundingClientRect()
                let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
                const navTopHeight = statusBarHeight + navBarHeight / 2 - 12
                that.setData({
                    barhHeight,
                    titlePositionTop: navTopHeight,
                })
            }
        })
        this.getBaseInfoData()

        const baseInfoResponseData =  analyzeProtocolCodeMessage('5559011E00000B5401000B7C0BB80B2E0BB3033700F005007000121609130100007800667FA5', '011E0000')
        parseProtocolCodeToChargerInfo(baseInfoResponseData)
        // console.log({
        //     baseInfoResponseData,
        // })
    },
    async getBaseInfoData() {
      const buffer = parseProtocolCodeMessage(
        '01',
        '1e',
        '0000',
        ''
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


    }
    // calculateXy(Q: number, r: number) {
    //     if (Q === 0) {
    //         return { x: r, y: 0 }
    //     }
    //     if (Q === 180) {
    //         return { x: -r, y: 0 }
    //     }
    //     const tanQ = Math.tan((2 * Math.PI * Q) / 360) // 倾斜角度的正切值
    //     const y = Math.abs(Math.sqrt(1 / (tanQ * tanQ + 1)) * r * tanQ) // y始终大于0，所以取绝对值。
    //     const x = y / tanQ
    //     return {
    //         x,
    //         y,
    //     }
    // },
    // deawCircleProcess() {
    //     const max = 100 // 总分
    //     const r = 124 // 半径
    //     const angle = 180 - (this.data.m * 180) / max // 角度
    //     let Q = 180 // 初始角度
        
    //     // 添加动效
    //     this.setData({
    //         timer: setInterval(() => {
    //             if (Q < angle) {
    //                 clearInterval(this.data.timer)
    //             }
    //             Q -= 1
    //             const {
    //                 x,
    //                 y,
    //             } = this.calculateXy(Q, r)
    //             this.setData({
    //                 x,
    //                 y,
    //             })
    //         }, 10)
    //     })

    //     let newPath = ""
    //     for (let i = 0; i < 25; i++) {
    //         const deg = i * (180 / 24)
    //         // 刻度线外端：弧形半径为100
    //         const x1 = this.calculateXy(deg, 100).x
    //         const y1 = this.calculateXy(deg, 100).y
    //         // 刻度线内端：长线弧形半径为88，长线弧形半径为80
    //         // const calculateR = i % 4 === 0 ? 80 : 88
    //         const calculateR = i % 4 === 0 ? 1 : 1
    //         const x2 = this.calculateXy(deg, calculateR).x
    //         const y2 = this.calculateXy(deg, calculateR).y
    //         newPath += `M${x1} ${-y1} L${x2} ${-y2} `
    //     }
    //     this.setData({
    //         path: newPath
    //     })
    // }
})
