import { inArray,} from '../../../utils/util'
import {
    bluetoothInit,
    getBluetoothAdapterState,
    startBluetoothDevicesDiscovery,
    stopBluetoothDevicesDiscovery,
    getBluetoothDevices,
    createBLEConnection,
    getBLEDeviceServices,
    getBLEDeviceCharacteristics,
    notifyBLECharacteristicValueChange,
    writeAndReadBLECharacteristicValue,
    closeBLEConnection,
} from '../../../utils/bluetooth_util'
import Toast from '@vant/weapp/toast/toast';
const app = getApp<IAppOption>()

Page({
    data: {
        barhHeight: 0,
        titlePositionTop: 0,
        name: '',
        connected: false,
        deviceList: [],
        descList: [
            '请确定设备以及开启连接模式;',
            '请确定设备以及开启连接模式;',
            '请确定设备以及开启连接模式;',
        ],
        chs: [],
        _discoveryStarted: false,   //  是否开始扫描
        // deviceId: undefined, // 已连接蓝牙id
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
        this.setData({
            connected: app.globalData.isDebugModel || false,
            name: app.globalData.deviceName,
        })
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

        // wx.onBLEConnectionStateChange((res) => {
        //     console.log("connectState", {res});
        //     if (res.connected) {
        //     //   Toast.success('连接成功!');
        //     } else {
        //         this.setData({
        //             connected: false,
        //             name: '',
        //         })
        //         //   Toast.fail('连接断开')
        //       // that.showToast({
        //       //   title: "连接断开",
        //       // })
        //     }
        //   })
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
        console.log({
            e,
            id,
            connected: this.data.connected,
        })
        if (id === this.data.connected) {
            closeBLEConnection(deviceId)
            getApp().globalData.connected = false 
            getApp().globalData.deviceId = undefined
            getApp().globalData.serviceId = undefined
            getApp().globalData.characteristicId = undefined
            this.setData({
                connected: false,
            })
            return
        }
        try {
            await createBLEConnection(deviceId)
            const {services} = await getBLEDeviceServices(deviceId)
            for (let i = (services.length - 1); i >= 0; i--) {
            // for (let i = 0; i < services.length; i++) {
                if (services[i].isPrimary) {
                    const serviceId = services[i].uuid
                    const {characteristics} = await getBLEDeviceCharacteristics(deviceId, serviceId)
                    // console.log({
                    //     characteristics,
                    // }, 'getBLEDeviceCharacteristics')
                    for (let j = 0; j < characteristics.length; j++) {
                        let item = characteristics[j]
                        const characteristicId = item.uuid
                        if (item.properties.notify || item.properties.indicate) {
                            await notifyBLECharacteristicValueChange(
                                deviceId,
                                serviceId,
                                characteristicId,
                            )
                            // console.log('启用蓝牙notify功能', {
                            //     deviceId, serviceId, characteristicId
                            // })
                        }
                        if (item.properties.read) {
                            // console.log('read')
                            // wx.readBLECharacteristicValue({
                            //     deviceId,
                            //     serviceId,
                            //     characteristicId,
                            //     success (res) {
                            //     //   console.log('readBLECharacteristicValue:', {res})
                            //     }
                            // })
                        }
                        if (item.properties.write) {
                            getApp().globalData.connected = true 
                            getApp().globalData.deviceId = deviceId
                            getApp().globalData.serviceId = serviceId
                            getApp().globalData.characteristicId = characteristicId
                            // console.log({
                            //     deviceId,
                            //     serviceId,
                            //     characteristicId,
                            // }, '可写')
                            setTimeout(() => {
                                writeAndReadBLECharacteristicValue(
                                    deviceId,
                                    serviceId,
                                    characteristicId,
                                    '5559011E000071E9'
                                )
                            }, 10000);
                        }
                        
                      }
                }
              }
            // console.log({
            //     services,
            // })
            this.setData({
                connected: deviceId,
                name,
                deviceId,
            })
            getApp().globalData.deviceName = name
            Toast.success('设备连接成功!');
        } catch (err) {
            // console.log({err}, '蓝牙连接失败')
            Toast.fail(err.errMsg);
        }

        // stopBluetoothDevicesDiscovery()
    },
    closeBluetoothAdapter() {
        // bluetoothClose()
        this.setData({
            _discoveryStarted: false
        })
    },
})
