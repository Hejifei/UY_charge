import { inArray, ab2hex, stringToArrayBuffer, arrayBufferToString } from '../../../utils/util'
import {SERVICE_ID_VALUE, CHARACTERISTIC_ID_VALUE} from '../../../common/index'
import {
    bluetoothInit,
    getBluetoothAdapterState,
    startBluetoothDevicesDiscovery,
    stopBluetoothDevicesDiscovery,
    getBluetoothDevices,
    createBLEConnection,
    getBLEDeviceServices,
    writeBLECharacteristicValue,
    bluetoothClose,
    getBLEDeviceCharacteristics,
    notifyBLECharacteristicValueChange,
    onBLECharacteristicValueChange,
} from '../../../utils/bluetooth_util'
import Toast from '@vant/weapp/toast/toast';
// const app = getApp<IAppOption>()

Page({
    data: {
        barhHeight: 0,
        titlePositionTop: 0,
        connected: false,
        deviceList: [
            // {
            //     id: 1,
            //     name: 'UY0001',
            // },
            // {
            //     id: 2,
            //     name: 'UY0002',
            // },
            // {
            //     id: 3,
            //     name: 'UY0003',
            // },
            // {
            //     id: 4,
            //     name: 'UY0004',
            // },
            // {
            //     id: 5,
            //     name: 'UY0005',
            // },
        ],
        descList: [
            '请确定设备以及开启连接模式;',
            '请确定设备以及开启连接模式;',
            '请确定设备以及开启连接模式;',
        ],
        // devices: [],
        // connected: false,
        chs: [],
        _discoveryStarted: false,   //  是否开始扫描
        deviceId: undefined, // 已连接蓝牙id
        canWrite: false,
    },
    onLoad() {
        console.log('onLoad')
        // console.log(ModBusCRC16('55590A293000'))
    },
    onShow() {
        console.log('onShow')
    },
    onUnload() {
        // 停止扫描
        stopBluetoothDevicesDiscovery()
        // this.closeBluetoothAdapter()
    },
    onReady() {
        console.log('onReady')
        const that = this
        wx.getSystemInfo({
            success(res) {
                const { windowHeight, screenHeight, statusBarHeight } = res
                const barhHeight = screenHeight - windowHeight
                let menu = wx.getMenuButtonBoundingClientRect()
                let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
                const navTopHeight = statusBarHeight + navBarHeight / 2 - 12
                that.setData({
                    barhHeight,
                    titlePositionTop: navTopHeight,
                })
            }
        })

        //  开始扫描
        this.openBluetoothAdapter()
    },
    changeBluetoothConnect(event: any) {
        const { id } = event.target.dataset
        if (id === this.data.connected) {
            return
        }
        this.setData({
            connected: id,
        })
    },
    async openBluetoothAdapter() {
        const that = this
        const failWhenBluetootoOpenCallback = () => {
            that.startBluetoothDevicesDiscovery()
        }
        try {
            await bluetoothInit(failWhenBluetootoOpenCallback)
            that.startBluetoothDevicesDiscovery()
        } catch (err) {
            // console.log({err})
            Toast.fail(err.errMsg);
        }
    },
    getBluetoothAdapterState() {
        const that = this
        getBluetoothAdapterState().then((res: any) => {
            if (res.discovering) {
                that.onBluetoothDeviceFound()
            } else if (res.available) {
                that.startBluetoothDevicesDiscovery()
            }
        })
    },
    async startBluetoothDevicesDiscovery() {
        if (this.data._discoveryStarted) {
            return
        }
        this.setData({
            _discoveryStarted: true,
        })
        try {
            await startBluetoothDevicesDiscovery()
            this.onBluetoothDeviceFound()
        } catch (err) {
            // console.log({err})
            Toast.fail(err.errMsg);
        }
    },
    async onBluetoothDeviceFound() {
        try {
            const res = await getBluetoothDevices()
            if (res.devices.length >= 1) {
                this.setData({
                    _discoveryStarted: false,
                })
            }
            // console.log({res,}, 'getBluetoothDevices')
            res.devices
                .filter(({name, connectable}) => {
                    return name.startsWith('UY')
                    // TODO
                    return name.startsWith('UY') && connectable
                })
                .forEach(device => {
                if (!device.name && !device.localName) {
                    return
                }
                const foundDevices = this.data.deviceList
                const newDeviceList = [...foundDevices]
                const idx = inArray(foundDevices, 'deviceId', device.deviceId)
                // const data = {}
                if (idx === -1) {
                    //  @ts-ignore
                    // data[`deviceList[${foundDevices.length}]`] = device
                    newDeviceList.push(device)
                } else {
                    //  @ts-ignore
                    // data[`deviceList[${idx}]`] = device
                    newDeviceList[idx] = device
                }
                console.log({
                    newDeviceList,
                })
                this.setData({
                    deviceList: [...newDeviceList],
                })
            })
        } catch (err) {
            this.setData({
                _discoveryStarted: false,
            })
            console.log({err}, 'onBluetoothDeviceFound')
            Toast.fail(err.errMsg);
            
        }
    },
    async createBLEConnection(e: any) {
        console.log('建立蓝牙连接')
        const ds = e.currentTarget.dataset
        const deviceId = ds.deviceId
        const name = ds.name
        const { id } = e.target.dataset
        if (id === this.data.connected) {
            return
        }
        try {
            await createBLEConnection(deviceId)
            const {services} = await getBLEDeviceServices(deviceId)
            console.log({
                services,
            })
            onBLECharacteristicValueChange().then(res => {
                console.log({
                    res,
                }, '接收蓝牙设备的推送')
            })
            for (let i = 0; i < services.length; i++) {
                if (services[i].isPrimary) {
                    const serviceId = services[i].uuid
                    const {characteristics} = await getBLEDeviceCharacteristics(deviceId, serviceId)
                    console.log({
                        characteristics,
                    }, 'getBLEDeviceCharacteristics')
                    for (let j = 0; j < characteristics.length; j++) {
                        let item = characteristics[j]
                        const characteristicId = item.uuid
                        if (item.properties.read) {
                            console.log('read')
                            // this.writeBLECharacteristicValue(
                            //     deviceId,
                            //     serviceId,
                            //     characteristicId,
                            // )
                            // onBLECharacteristicValueChange().then(res => {
                            //     console.log({
                            //         res,
                            //     }, '接收蓝牙设备的推送')
                            // })
                        //   wx.readBLECharacteristicValue({
                        //     deviceId,
                        //     serviceId,
                        //     characteristicId: item.uuid,
                        //   })
                        }
                        if (item.properties.write) {
                            console.log({
                                deviceId,
                                serviceId,
                                characteristicId,
                            }, '可写')
                            this.writeBLECharacteristicValue(
                                deviceId,
                                serviceId,
                                characteristicId,
                            )
                        //   this.setData({
                        //     canWrite: true
                        //   })
                        //   this.writeBLECharacteristicValue()
                        }
                        if (item.properties.notify || item.properties.indicate) {
                            notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId)
                            console.log('启用蓝牙notify功能')
                        }
                      }
                //   return
                }
              }
            console.log({
                services,
            })
            // await notifyBLECharacteristicValueChange(deviceId, SERVICE_ID_VALUE, CHARACTERISTIC_ID_VALUE)
            this.setData({
                connected: deviceId,
                name,
                deviceId,
            })
            //   todo 蓝牙连接成功需要下一步操作
            Toast.success('设备连接成功!');
            // this.getBLEDeviceServices(deviceId)
        } catch (err) {
            // console.log({err}, '蓝牙连接失败')
            Toast.fail(err.errMsg);
        }

        stopBluetoothDevicesDiscovery()
    },
    // closeBLEConnection() {
    //     if (!this.data.deviceId) {
    //         return
    //     }
    //     wx.closeBLEConnection({
    //         deviceId: this.data.deviceId as unknown as string
    //     })
    //     this.setData({
    //         connected: false,
    //         chs: [],
    //         canWrite: false,
    //     })
    // },
    // getBLEDeviceCharacteristics(
    //     deviceId: string,
    //     serviceId: string,
    // ) {
    //     // 读写服务的特征值
    //     wx.getBLEDeviceCharacteristics({
    //         deviceId,     // 搜索到设备的 deviceId
    //         serviceId,    // 上一步中找到的某个服务
    //         success: (res) => {
    //             console.log('getBLEDeviceCharacteristics success', res.characteristics)
    //             for (let i = 0; i < res.characteristics.length; i++) {
    //                 let item = res.characteristics[i]
    //                 if (item.properties.read) {   //  该特征值可读
    //                     wx.readBLECharacteristicValue({
    //                         deviceId,
    //                         serviceId,
    //                         characteristicId: item.uuid,
    //                     })
    //                 }
    //                 if (item.properties.write) {  //  该特征值可写
    //                     this.setData({
    //                         canWrite: true
    //                     })
    //                     //  @ts-ignore
    //                     this._deviceId = deviceId
    //                     //  @ts-ignore
    //                     this._serviceId = serviceId
    //                     //  @ts-ignore
    //                     this._characteristicId = item.uuid
    //                     this.writeBLECharacteristicValue()
    //                 }
    //                 if (item.properties.notify || item.properties.indicate) {
    //                     // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
    //                     wx.notifyBLECharacteristicValueChange({
    //                         deviceId,
    //                         serviceId,
    //                         characteristicId: item.uuid,
    //                         state: true,
    //                     })
    //                 }
    //             }
    //         },
    //         fail(res) {
    //             console.error('getBLEDeviceCharacteristics', res)
    //         }
    //     })
    //     // 操作之前先监听，保证第一时间获取数据
    //     wx.onBLECharacteristicValueChange((characteristic) => {
    //         const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
    //         const data = {}
    //         if (idx === -1) {
    //             data[`chs[${this.data.chs.length}]`] = {
    //                 uuid: characteristic.characteristicId,
    //                 value: ab2hex(characteristic.value)
    //             }
    //         } else {
    //             data[`chs[${idx}]`] = {
    //                 uuid: characteristic.characteristicId,
    //                 value: ab2hex(characteristic.value)
    //             }
    //         }
    //         // data[`chs[${this.data.chs.length}]`] = {
    //         //   uuid: characteristic.characteristicId,
    //         //   value: ab2hex(characteristic.value)
    //         // }
    //         this.setData(data)
    //     })
    // },
    async writeBLECharacteristicValue(
        deviceId: string,
        serviceId: string,
        characteristicId: string,
    ) {
        // 向蓝牙设备发送一个0x00的16进制数据
        // let buffer = new ArrayBuffer(1)
        // let dataView = new DataView(buffer)
        // dataView.setUint8(0, Math.random() * 255 | 0)
        const buffer = stringToArrayBuffer('5559011E000071E9')
        console.log('发送协议码', {
            buffer,
            value: arrayBufferToString(buffer),
        })
        try {
            await writeBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId,
                buffer
            )
        } catch (err) {
            // console.log({err}, '蓝牙连接失败')
            Toast.fail(err.errMsg);
        }
    },
    closeBluetoothAdapter() {
        bluetoothClose()
        this.setData({
            _discoveryStarted: false
        })
    },
})
