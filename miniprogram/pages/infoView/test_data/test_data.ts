import {ModBusCRC16} from '../../../utils/crc'
import {writeAndReadBLECharacteristicValue, writeBLECharacteristicValue,} from '../../../utils/bluetooth_util'
import {
  parseProtocolCodeMessage,
  analyzeProtocolCodeMessage,
  parseProtocolCodeToTestData,
} from '../../../utils/protocol_util'
const app = getApp<IAppOption>()

Component({
    properties: {
        testData: {
            type: Object,
            value: undefined,
        },
    },
    data: {
    //   testData: {}
    },
    ready() {
        // const chargeCountData =  analyzeProtocolCodeMessage('5559071220000BB80C2401F40195000900010002000300047535', '07122000')
        // const data = parseProtocolCodeToTestData(chargeCountData)
        // this.setData({
        //   testData: data,
        // })
        this.readData()
    },
    methods: {
        readData() {
            const {
                deviceId,
                serviceId,
                characteristicId,
            } = app.globalData
            if (!deviceId || !serviceId || !characteristicId) {
                return
            }
            const buffer = parseProtocolCodeMessage(
                '07',
                '12',
                '2000',
                ''
            )
            //  读取充电统计数据
            try {
                writeAndReadBLECharacteristicValue(
                    deviceId,
                    serviceId,
                    characteristicId,
                    buffer
                )
            } catch (err) {
                console.log('getBaseInfo error: ', {err})
            }
        },
        clearData() {
            const {
                deviceId,
                serviceId,
                characteristicId,
            } = app.globalData
            if (!deviceId || !serviceId || !characteristicId) {
                return
            }
            const buffer = parseProtocolCodeMessage(
                '09',
                '0E',
                '2004',
                ''
              )
            //  读取充电统计数据
            try {
                writeAndReadBLECharacteristicValue(
                    deviceId,
                    serviceId,
                    characteristicId,
                    buffer
                )
            } catch (err) {
                console.log('getBaseInfo error: ', {err})
            }
        },
    },
  })
