import { ModBusCRC16 } from '../../../utils/crc'
import { writeBLECharacteristicValue, } from '../../../utils/bluetooth_util'
import {
    parse10To16,
    parseProtocolCodeMessage,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargeLineSettingData,
    parseChargeLineSettingDataToProtocolCode,
} from '../../../utils/protocol_util'
// const app = getApp<IAppOption>()

Component({
    data: {
        chargeLineSettingDataList: [
            { voltage: 0, eleCurrent: 0 },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
            // { voltage: undefined, eleCurrent: undefined },
        ]
    },
    ready() {
        const chargeCountData = analyzeProtocolCodeMessage('5559040B100002000003E805DC0BB80B68E3F8', '040B1000')
        const data = parseProtocolCodeToChargeLineSettingData(chargeCountData)
        this.setData({
          chargeLineSettingDataList: data,
        })
    },
    methods: {
        readChargeLine() {
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
            })
            try {
                // writeBLECharacteristicValue(
                //   'deviceId': string,
                //   serviceId: string,
                //   characteristicId: string,
                //   buffer: ArrayBuffer,
                // )
            } catch (err) {
                console.log({ err }, 'getBaseInfoData')
            }
        },
        clearChargeLine() {
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
            })
            try {
                // writeBLECharacteristicValue(
                //   'deviceId': string,
                //   serviceId: string,
                //   characteristicId: string,
                //   buffer: ArrayBuffer,
                // )
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
            const dataCode = parseChargeLineSettingDataToProtocolCode(this.data.chargeLineSettingDataList)
            const buffer = parseProtocolCodeMessage(
                '05',
                parse10To16(2 + 4 * this.data.chargeLineSettingDataList.length),
                '1000',
                dataCode
            )
            // 55 59 05 0B 10 00 02 00 00 03 E8 05 DC 0B B8 0B 68 22 F8
            // console.log({
            //     buffer,
            //     chargeLineSettingDataList: this.data.chargeLineSettingDataList,
            // })
            try {
                // writeBLECharacteristicValue(
                //   'deviceId': string,
                //   serviceId: string,
                //   characteristicId: string,
                //   buffer: ArrayBuffer,
                // )
            } catch (err) {
                console.log({ err }, 'getBaseInfoData')
            }
        }
    }

})
