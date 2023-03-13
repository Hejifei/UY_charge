import { ab2hex } from '../../utils/util'
import {isNull, isUndefined, get} from '../../utils/lodash'
import {writeAndReadBLECharacteristicValue,} from '../../utils/bluetooth_util'
import Chart from './chart';
import { createElement } from '@antv/f2';
import {
    parseProtocolCodeMessage,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargerInfo,
    parseProtocolCodeToTestData,
} from '../../utils/protocol_util'
import { RESPONSE_MAP } from '../../common/index';

const app = getApp<IAppOption>()

// const data = {
//     voltage: 5.8,
//     current: 6,
//     chargeTime: 240,
//     percent: 0.2,
//     status: '充电中', 
// };

Page({
    data: {
        barhHeight: 0,
        titlePositionTop: 0,
        chargingTime: 0,
        isDebugModel: app.globalData.isDebugModel || false,
        connected: false, //  是否连接蓝牙
        // n: 1.5,     // 不规则三角形放大比例
        // m: 90,      // 得分
        // path: '',   // 表盘刻度线路径
        // x: -124,    // 得分进度条起点x
        // y: 0,       // 得分进度条起点y
        // timer: 0,  
        chargerInfo: {
            chargingMode: '--',
            chargingTiming: '--',
            timingRemaining: '--',
            chargingCapacity: '--',
            batteryVoltage: '--',
            chargerTemperature: '--',
        }, 
        testData: {
            limitVoltage: '--',
            limitCurrent: '--',
            countOfStartup: '--',
            countOfWork: '--',
            faultCount: '--',
            overheatingProtection: '--',
            overvoltageProtection: '--',
            overcurrentProtection: '--',
            shortCircuitProtection: '--',
            reversePolarityProtection: '--',
        },
        onRenderChart: () => {
            return createElement(Chart, {
                data: {
                    voltage: 0,
                    current: 0,
                    chargeTime: 0,
                    percent: 0,
                    status: '--', 
                },
            });
        }, 
    },
    onShow() {
        
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

        this.setData({
            isDebugModel: app.globalData.isDebugModel || false,
            connected: app.globalData.connected || false,
            chargingTime: undefined,
            // onRenderChart: () => {
            //     // return this.renderChart(data)
            //     return this.renderChart({
            //         voltage: 1,
            //         current: 2,
            //         chargeTime: 1,
            //         percent: 0.2,
            //         status: '-2222-', 
            //     })
            // },
        })

        // setTimeout(() => {
        //     console.log('renrender')
        //     this.setData({
        //         isDebugModel: app.globalData.isDebugModel || false,
        //         chargingTime: undefined,
        //         onRenderChart: () => {
        //             // return this.renderChart(data)
        //             return this.renderChart({
        //                 voltage: 1,
        //                 current: 2,
        //                 chargeTime: 1,
        //                 percent: 0.2,
        //                 status: '-2222-', 
        //             })
        //         },
        //     })
        // }, 1000);

        wx.onBLECharacteristicValueChange(res => {
            const value = ab2hex(res.value)
            console.log({
                res,
                value,
            }, '收到数据 onBLECharacteristicValueChange -------')
            if (value.startsWith('5559011e0000')) {
                const baseInfoResponseData =  analyzeProtocolCodeMessage(value, '011e0000')
                if (!baseInfoResponseData) {
                    return
                }
                const chargerInfo = parseProtocolCodeToChargerInfo(baseInfoResponseData)
                console.log({
                    chargerInfo,
                })
                // setChargerInfo(chargerInfo)
                const {
                    chargingTime,
                    outputVoltage,
                    outputCurrent,
                    chargingMode,
                    chargingTiming,
                    timingRemaining,
                } = chargerInfo
                console.log({
                    percent: (chargingTiming - timingRemaining) / chargingTiming,
                    percentOld: chargingTime / chargingTiming,
                })
                that.setData({
                    onRenderChart: () => {}
                }, () => {
                    that.setData({
                        chargingTime: chargingTiming - timingRemaining,
                        chargerInfo: {
                            ...chargerInfo,
                            chargingMode: that.parseValueTextShow(chargerInfo.chargingMode),
                            chargingTiming: that.parseValueTextShow(chargerInfo.chargingTiming),
                            timingRemaining: that.parseValueTextShow(chargerInfo.timingRemaining),
                            chargingCapacity: that.parseValueTextShow(chargerInfo.chargingCapacity),
                            batteryVoltage: that.parseValueTextShow(chargerInfo.batteryVoltage),
                            chargerTemperature: that.parseValueTextShow(chargerInfo.chargerTemperature),
                        },
                        onRenderChart: () => {
                            // return this.renderChart(data)
                            return that.renderChart({
                                voltage: outputVoltage,
                                current: outputCurrent,
                                chargeTime: chargingTime,
                                // percent: chargingTime / chargingTiming,
                                percent: (chargingTiming - timingRemaining) / chargingTiming,
                                status: chargingMode, 
                            })
                        },
                    })
                })
                // setTimeout(() => {
                    
                // }, 1000);
                
            } else if (value.startsWith('555907122000')) {
                const chargeCountData = analyzeProtocolCodeMessage(value, '07122000')
                const data = parseProtocolCodeToTestData(chargeCountData)
                const testData = {}
                Object.keys(data).forEach(key => {
                    testData[key] = this.parseValueTextShow(data[key])
                })
                this.setData({
                  testData: testData,
                })
            } else if (value.startsWith('55590901')) {
                const resultCode = analyzeProtocolCodeMessage(value, '0901')
                const tilte = '清除' + get(RESPONSE_MAP, [resultCode])
                wx.showToast({
                    title: tilte,
                    icon: "none",
                    duration: 3000
                });
            }
        })

        
        this.getBaseInfo()
    },
    parseValueTextShow(value: any) {
        if (isUndefined(value) || isNull(value)) {
            return '--'
        }
        return value
    },
    async getBaseInfo() {
        const {
            deviceId,
            serviceId,
            characteristicId,
        } = app.globalData
        if (!deviceId || !serviceId || !characteristicId) {
            return
        }
        const buffer = parseProtocolCodeMessage(
            '01',
            '1e',
            '0000',
            ''
        )
        console.log({
            buffer,
        }, '获取常规信息')
        try {
            writeAndReadBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId,
                buffer,
            )
        } catch (err) {
            console.log('getBaseInfo error: ', {err})
        }
    },
    renderChart(chartData: any) {
        return createElement(Chart, {
            data: chartData,
          });
    },
    goToConnectDevice() {
        wx.navigateTo({
            url: '/pages/setting_center/device_manage/device_manage',
        })
    }
})
