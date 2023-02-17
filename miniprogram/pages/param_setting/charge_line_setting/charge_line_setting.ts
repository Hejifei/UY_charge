import { ModBusCRC16 } from '../../../utils/crc'
import { writeAndReadBLECharacteristicValue, writeBLECharacteristicValue, } from '../../../utils/bluetooth_util'
import {
    parse10To16,
    parseProtocolCodeMessage,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargeLineSettingData,
    parseChargeLineSettingDataToProtocolCode,
} from '../../../utils/protocol_util'
const app = getApp<IAppOption>()

Component({
    data: {
        chargeLineSettingDataList: [
            { voltage: 0, eleCurrent: 0 },
        ]
    },
    ready() {
        const chargeCountData = analyzeProtocolCodeMessage('5559040010001ce3', '040B1000')
        const data = parseProtocolCodeToChargeLineSettingData(chargeCountData)
        this.setData({
          chargeLineSettingDataList: data,
        })
    },
    methods: {
        readChargeLine() {
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
        clearChargeLine() {
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
            const {
                deviceId,
                serviceId,
                characteristicId,
            } = app.globalData
            if (!deviceId || !serviceId || !characteristicId) {
                return
            }
            const dataCode = parseChargeLineSettingDataToProtocolCode(this.data.chargeLineSettingDataList)
            const buffer = parseProtocolCodeMessage(
                '05',
                parse10To16(2 + 4 * this.data.chargeLineSettingDataList.length),
                '1000',
                dataCode
            )
            console.log({
                buffer,
            }, '充电曲线写入')
            // 55 59 05 0B 10 00 02 00 00 03 E8 05 DC 0B B8 0B 68 22 F8
            // console.log({
            //     buffer,
            //     chargeLineSettingDataList: this.data.chargeLineSettingDataList,
            // })
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
