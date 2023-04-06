import {writeAndReadBLECharacteristicValue,} from '../../../utils/bluetooth_util'
import {
  parseProtocolCodeMessage,
} from '../../../utils/protocol_util'
import Dialog from '@vant/weapp/dialog/dialog';

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
        clearDataConfirm() {
            // wx.showToast({
            //     title: "",
            //     icon: "loading",
            //     mask: true,
            //     duration: 2000,
            // });
            Dialog.confirm({
                title: '提示',
                message: '是否确认擦除数据?',
            }).then(() => {
                this.clearData()
            }).catch(() => {
                // on cancel
            });
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
