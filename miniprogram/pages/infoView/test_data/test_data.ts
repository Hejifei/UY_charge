import {ModBusCRC16} from '../../../utils/crc'
import {writeBLECharacteristicValue,} from '../../../utils/bluetooth_util'
import {
  parseProtocolCodeMessage,
  analyzeProtocolCodeMessage,
  parseProtocolCodeToTestData,
} from '../../../utils/protocol_util'
Component({
    properties: {
    },
    data: {
      testData: {}
    },
    ready() {
        const chargeCountData =  analyzeProtocolCodeMessage('5559071220000BB80C2401F40195000900010002000300047535', '07122000')
        const data = parseProtocolCodeToTestData(chargeCountData)
        this.setData({
          testData: data,
        })
    },
    methods: {
        readData() {
            // '555907122000A8A2'
            //  读取充电统计数据
            const buffer = parseProtocolCodeMessage(
              '07',
              '12',
              '2000',
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
        },
        clearData() {
            // '5559090E20046A4F'
            //  读取充电统计数据
            const buffer = parseProtocolCodeMessage(
              '09',
              '0E',
              '2004',
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
        },
    },
  })
