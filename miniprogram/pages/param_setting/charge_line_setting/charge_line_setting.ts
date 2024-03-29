import { writeAndReadBLECharacteristicValue, } from '../../../utils/bluetooth_util'
import {
    parse10To16,
    parseProtocolCodeMessage,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargeLineSettingData,
    parseChargeLineSettingDataToProtocolCode,
} from '../../../utils/protocol_util'
import Dialog from '@vant/weapp/dialog/dialog';
import moment from 'moment'
import { isNull, isUndefined } from '../../../utils/lodash';

const app = getApp<IAppOption>()

Component({
    properties: {
        chargeLineSettingDataList: {
            type: Array,
            value: [],
        },
        voltage_range_max: {
            type: Number,
        },
        current_range_max: {
            type: Number,
        },
    },
    data: {
        lastTapTime: 0,
        deleteLastTapIndex: undefined,
        deleteLastTapTime: 0,
    },
    ready() {
        // const chargeCountData = analyzeProtocolCodeMessage('5559052a10000a00640064006400640064006400640064006400640064006400640064006400640064006400640064AC06', '052a1000')
        // const data = parseProtocolCodeToChargeLineSettingData(chargeCountData)
        // console.log({data})
        // this.setData({
        //   chargeLineSettingDataList: data,
        // })
        // setTimeout(() => {
        //     this.readChargeLine()
        // }, 500);
    },
    methods: {
        readChargeLine() {
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
            // '555904FF10002CD3'
            //  充电曲线读取
            const buffer = parseProtocolCodeMessage(
                '04',
                'FF',
                '1000',
                ''
            )
            console.log({
                buffer,
            }, '充电曲线读取')
            try {
                writeAndReadBLECharacteristicValue(
                    deviceId,
                    serviceId,
                    characteristicId,
                    buffer,
                )
            } catch (err) {
                console.log({ err }, 'getBaseInfoData')
            }
        },
        clearChargeLineConfirm() {
            // wx.showToast({
            //     title: "",
            //     icon: "loading",
            //     mask: true,
            //     duration: 2000,
            // });
            Dialog.confirm({
                title: '提示',
                message: '是否确认曲线重置?',
            }).then(() => {
                this.clearChargeLine()
            }).catch(() => {
                // on cancel
            });
        },
        clearChargeLine() {
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
            // '555906FF10002D6B'
            //  充电曲线擦除
            const buffer = parseProtocolCodeMessage(
                '06',
                'FF',
                '1000',
                ''
            )
            console.log({
                buffer,
            }, '充电曲线擦除')
            try {
                writeAndReadBLECharacteristicValue(
                    deviceId,
                    serviceId,
                    characteristicId,
                    buffer,
                )
            } catch (err) {
                console.log({ err }, 'getBaseInfoData')
            }
        },
        onInputChange(event) {
            const { index, name } = event.currentTarget.dataset
            const value = event.detail.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null
            const chargeLineSettingDataList = this.data.chargeLineSettingDataList
            //    @ts-ignore
            chargeLineSettingDataList[index][name] = value
            if (name === 'voltage_min' && index > 0) {
                chargeLineSettingDataList[index - 1]['voltage_max'] = value
            } else if (name === 'voltage_max' && index < (chargeLineSettingDataList.length - 1)) {
                chargeLineSettingDataList[index + 1]['voltage_min'] = value
            }
            this.setData({
                chargeLineSettingDataList: [...chargeLineSettingDataList]
            })
        },
        writeChargeLine() {
            wx.showToast({
                title: "",
                icon: "loading",
                mask: true,
                duration: 500,
            });
            let {current_range_max, voltage_range_max, chargeLineSettingDataList} = this.data
            // console.log({
            //     current_range_max,
            //     voltage_range_max,
            //     chargeLineSettingDataList,
            // })
            if (!current_range_max || !voltage_range_max) {
                wx.showToast({
                    title: '暂未读取到最大输出电流、最大输出电压, 请稍后再试!',
                    icon: "none",
                    duration: 2000
                });
                return
            }
            current_range_max = parseFloat(current_range_max)
            voltage_range_max = parseFloat(voltage_range_max)
            let errorText = ''
            for (let i = 0; i < chargeLineSettingDataList.length; i++) {
                let {voltage_min, voltage_max, eleCurrent} = chargeLineSettingDataList[i]
                if (isNull(voltage_min) || isUndefined(voltage_min)) {
                    errorText = `节点${i + 1}: 无效的起始电压值`
                    break
                }
                if (isNull(voltage_max) || isUndefined(voltage_max)) {
                    errorText = `节点${i + 1}: 无效的结束电压值`
                    break
                }
                if (isNull(eleCurrent) || isUndefined(eleCurrent)) {
                    errorText = `节点${i + 1}: 无效的电流值`
                    break
                }
                voltage_min = parseFloat(voltage_min)
                voltage_max = parseFloat(voltage_max)
                if (voltage_min > voltage_max) {
                    errorText = `节点${i + 1}: 起始电压不能大于结束电压`
                    break
                }
                if (voltage_min > voltage_range_max || voltage_max > voltage_range_max) {
                    errorText = `节点${i + 1}: 起始电压或结束电压不能大于最大输出电压 ${voltage_range_max}`
                    break
                }
                if (eleCurrent > current_range_max ) {
                    errorText = `节点${i + 1}: 电流不能大于最大输出电流 ${current_range_max}`
                    break
                }
            }
            if (errorText) {
                wx.showToast({
                    title: errorText,
                    icon: "none",
                    duration: 2000
                });
                return
            }

            const {
                deviceId,
                serviceId,
                characteristicId,
            } = app.globalData
            
            const dataCode = parseChargeLineSettingDataToProtocolCode(this.data.chargeLineSettingDataList)
            console.log({
                dataCode,
                chargeLineSettingDataList: this.data.chargeLineSettingDataList,
            })
            const buffer = parseProtocolCodeMessage(
                '05',
                parse10To16(1 + 2 + 4 * this.data.chargeLineSettingDataList.length),
                '1000',
                dataCode
            ).toUpperCase()
            // buffer = '5559050B10000203E803E807D004B009C4EEDB'
            // buffer = '5559050B100002000003E805DC0BB80B6822F8'
            console.log({
                buffer,
            }, '充电曲线写入')
            // 55 59 05 0B 10 00 02 00 00 03 E8 05 DC 0B B8 0B 68 22 F8
            // console.log({
            //     buffer,
            //     chargeLineSettingDataList: this.data.chargeLineSettingDataList,
            // })
            if (!deviceId || !serviceId || !characteristicId) {
                return
            }
            try {
                writeAndReadBLECharacteristicValue(
                    deviceId,
                    serviceId,
                    characteristicId,
                    buffer,
                )
            } catch (err) {
                console.log({ err }, 'getBaseInfoData')
            }
        },
        handleLineDataAdd () {
            const chargeLineSettingDataList = this.data.chargeLineSettingDataList
            const newLineData = {
                voltage_min: chargeLineSettingDataList.length === 0 ? null : chargeLineSettingDataList[chargeLineSettingDataList.length - 1].voltage_max,
                voltage_max: null,
                eleCurrent: null,
            }
            this.setData({
                chargeLineSettingDataList: [
                    ...chargeLineSettingDataList,
                    newLineData,
                ]
            })
        },
        handleDomClick(e){
            const lastTapTime = this.data.lastTapTime
            // let currentTime = e.timeStamp
            let currentTime = moment().valueOf()
            if (currentTime - lastTapTime < 800) {
                //执行双击操作
                this.handleLineDataAdd()
                this.setData({
                    lastTapTime: 0,
                })
                return
            }
            //更新点击时间
            this.setData({
                lastTapTime: currentTime,
            })
        },
        handleLineDataDelete(index: number) {
            const chargeLineSettingDataList = this.data.chargeLineSettingDataList
            const chargeLineSettingDataListNew = [...chargeLineSettingDataList]
            if (index === 0 && chargeLineSettingDataList.length > 1) {
                const nextChargeLineData = chargeLineSettingDataList[index + 1]
                chargeLineSettingDataListNew[index + 1] = {
                    ...nextChargeLineData,
                    voltage_min: chargeLineSettingDataListNew[0].voltage_min,
                    eleCurrent: chargeLineSettingDataListNew[0].eleCurrent,
                }
            } else if (index && index < (chargeLineSettingDataList.length - 1)) {
                const beforeData = chargeLineSettingDataList[index - 1]
                chargeLineSettingDataListNew[index + 1] = {
                    ...chargeLineSettingDataList[index + 1],
                    voltage_min: beforeData.voltage_max,
                }
            }
            chargeLineSettingDataListNew.splice(index, 1)
            this.setData({
                chargeLineSettingDataList: chargeLineSettingDataListNew
            })
        },
        handleDomDeleteClick(e) {
            const index = e.target.dataset.index;
            const {
                deleteLastTapTime,
                deleteLastTapIndex,
            } = this.data
            let currentTime = moment().valueOf()
            if ((currentTime - deleteLastTapTime < 800) && index === deleteLastTapIndex) {
                //执行双击操作
                // this.handleLineDataAdd()
                
                Dialog.confirm({
                    title: "操作",
                    message: `是否确认删除 节点${index + 1}`,
                })
                .then(() => {
                    this.handleLineDataDelete(index)
                this.setData({
                    deleteLastTapIndex: undefined,
                    deleteLastTapTime: 0,
                })
                })
                .catch(() => {
                    // console.log('error')
                    // on cancel
                });
                return
            }
            //更新点击时间
            this.setData({
                deleteLastTapTime: currentTime,
                deleteLastTapIndex: index,
            })
        }
    }

})
