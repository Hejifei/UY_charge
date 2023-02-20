import { writeAndReadBLECharacteristicValue, } from '../../../utils/bluetooth_util'
import {
    parse10To16,
    parseProtocolCodeMessage,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargeLineSettingData,
    parseChargeLineSettingDataToProtocolCode,
} from '../../../utils/protocol_util'
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp<IAppOption>()

Component({
    properties: {
        chargeLineSettingDataList: {
            type: Array,
            value: [],
        },
    },
    data: {
        // chargeLineSettingDataList: [
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        //     { voltage: 0, eleCurrent: 0 },
        // ]
    },
    ready() {
        // const chargeCountData = analyzeProtocolCodeMessage('5559052a10000a00640064006400640064006400640064006400640064006400640064006400640064006400640064AC06', '052a1000')
        // const data = parseProtocolCodeToChargeLineSettingData(chargeCountData)
        // console.log({data})
        // this.setData({
        //   chargeLineSettingDataList: data,
        // })
    },
    methods: {
        readChargeLine() {
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
            const value = event.detail
            const chargeLineSettingDataList = this.data.chargeLineSettingDataList
            //    @ts-ignore
            chargeLineSettingDataList[index][name] = value
            this.setData({
                chargeLineSettingDataList: [...chargeLineSettingDataList]
            })
        },
        writeChargeLine() {
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
            
            const dataCode = parseChargeLineSettingDataToProtocolCode(this.data.chargeLineSettingDataList)
            console.log({
                dataCode,
                chargeLineSettingDataList: this.data.chargeLineSettingDataList,
            })
            const buffer = parseProtocolCodeMessage(
                '05',
                parse10To16(2 + 4 * this.data.chargeLineSettingDataList.length),
                '1000',
                dataCode
            )
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
        }
    }

})
