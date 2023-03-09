import Toast from '@vant/weapp/toast/toast';
import {get} from './lodash'
import { ab2hex, arrayBufferToString, string2Buffer, uint8Array2Str, } from './util';


const createBLEErrorCodeMap = {
    '0': '正常',
    '-1': '已连接',
    '10000': '未初始化蓝牙适配器',
    '10001': '当前蓝牙适配器不可用',
    '10002': '没有找到指定设备',
    '10003': '连接失败',
    '10004': '没有找到指定服务',
    '10005': '没有找到指定特征',
    '10006': '当前连接已断开',
    '10007': '当前特征不支持此操作',
    '10008': '其余所有系统上报的异常',
    '10009': 'Android 系统特有，系统版本低于 4.3 不支持 BLE',
    '10012': '连接超时',
    '10013': '连接 deviceId 为空或者是格式不正确',
}

// documents: https://juejin.cn/post/6854573218788261902
// 注意事项:
// 1.所有的蓝牙操作必须先蓝牙初始化，否则会返回错误（errCode=10000）
// 2.在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 wx.openBluetoothAdapter 会返回错误（errCode=10001），表示手机蓝牙功能不可用

// errCode list
// 10000:   蓝牙未初始化
// 10001:   用户蓝牙开关未开启或者手机不支持蓝牙

//  蓝牙初始化
export const bluetoothInit = async (
    failWhenBluetootoOpenCallback?: () => void
) => {
    return new Promise((resolve, reject) => {
        // 初始化蓝牙模块
        wx.openBluetoothAdapter({
            success: (res) => {
                console.log('蓝牙初始化成功!')
                resolve(res)
            },
            fail: (res) => {
                console.log({res})
                // 蓝牙开关未开启或手机不支持蓝牙时，会返回错误 (errCode=10001)
                if (res.errCode === 10001) {
                    // Toast.fail('蓝牙开关未开启或手机不支持蓝牙');
                    wx.showToast({
                        title: '未开启或手机不支持蓝牙',
                        icon: "error",
                        duration: 2000,
                    });
                    // wx.onBluetoothAdapterStateChange 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。开发者在开发中应该考虑兼容用户在使用小程序过程中打开/关闭蓝牙开关的情况，并给出必要的提示，提高可用性。
                    wx.onBluetoothAdapterStateChange(function (res) {
                        console.log('onBluetoothAdapterStateChange', res)
                        if (!res.available) {
                            return
                        }
                        // resolve(res)
                        // 开始搜寻附近的蓝牙外围设备
                        // that.startBluetoothDevicesDiscovery()
                        if (failWhenBluetootoOpenCallback) {
                            // failWhenBluetootoOpenCallback()
                        }
                    })
                } else if (res.errMsg === 'openBluetoothAdapter:fail already opened') {
                    resolve(res)
                } else {
                    console.log('蓝牙初始化失败', {res})
                    reject(res)
                }
            }
        })
    })
}

export const listenConnection = () => {
    console.log("listenConnection")
    wx.onBLEConnectionStateChange(function(res) {
      console.log("connectState", res);
      if (res.connected) {
        // Toast.success('连接成功!');
        console.log('连接成功')
        // that.showToast({
        //   title: "连接成功",
        // })
      } else {
        console.log('连接断开')
        // Toast.fail('连接断开')
        // that.showToast({
        //   title: "连接断开",
        // })
      }
    })
  }


//  释放蓝牙模块资源
export const bluetoothClose = () => {
    return new Promise((resolve, reject) => {
        wx.closeBluetoothAdapter({
            success(res) {
                console.log({res}, 'closeBluetoothAdapter')
                resolve(res)
            },
            fail(error) {
                console.log({error}, 'closeBluetoothAdapter')
                reject(error)
            }
        })
    })
}

//  检测蓝牙是否可用
export const getBluetoothAdapterState = () => {
    return new Promise((resolve, reject) => {
        wx.getBluetoothAdapterState({
            success(res) {
                // console.log(res)
                resolve(res)
            },
            fail(error) {
                reject(error)
            }
        })
    })
}

//  蓝牙设备搜索初始化
export const startBluetoothDevicesDiscovery = () => {
    // console.log('蓝牙设备搜索初始化 startBluetoothDevicesDiscovery ')
    return new Promise((resolve, reject) => {
        console.log('蓝牙搜索初始化')
        wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: true,
            success(res) {
                console.log({res,}, 'startBluetoothDevicesDiscovery')
                resolve(res)
            },
            fail(error) {
                if (error.errMsg === 'startBluetoothDevicesDiscovery:fail Starting discovery failed') {
                    error.errMsg = '扫描失败'
                }
                console.log({error,}, 'startBluetoothDevicesDiscovery')
                reject(error)
            }
        })
    })
}

//  蓝牙设备搜索停止
export const stopBluetoothDevicesDiscovery = () => {
    wx.stopBluetoothDevicesDiscovery()
}

//  获取搜索的蓝牙设备
export const getBluetoothDevices: () => Promise<WechatMiniprogram.OnBluetoothDeviceFoundListenerResult> = () => {
    return new Promise((resolve, reject) => {
        wx.getBluetoothDevices({  //获取目前搜索到全部的蓝牙设备（只执行一次）
            success(res) {
                console.log({res}, 'getBluetoothDevices')
                
                if (res.devices.length > 0) {
                    resolve(res)
                } else {
                    setTimeout(()=>{
                        // if(res.devices.length < 1) { //小于1台设备的时候关闭蓝牙和停止搜索
                            
                        // }
                        // stopBluetoothDevicesDiscovery()
                        bluetoothClose()
                        // console.log('长时间未扫描到设备,自动停止搜索')
                        reject({
                            errMsg: '长时间未扫描到设备,自动停止搜索'
                        })
                    }, 15000)
                }
            }
        })
        wx.onBluetoothDeviceFound(res => {  //监听搜索的蓝牙-不断的寻找新的设备
            resolve(res)
        })
    })
}

//  通过蓝牙设备Id连接低功耗蓝牙设备
export const createBLEConnection = (deviceId: string) => {
    return new Promise((resolve, reject) => {
        wx.createBLEConnection({
            deviceId,
            success(res) {
                console.log({
                    res,
                }, '通过蓝牙设备Id连接低功耗蓝牙设备 createBLEConnection')
                resolve(res)
            },
            fail(error) {
                const {errCode, errMsg} = error
                const errText = get(createBLEErrorCodeMap, [errCode], errMsg)
                error.errMsg = errText
                console.log({error}, '蓝牙连接失败')
                reject(error)
            }
        })
    })
}

//  通过蓝牙设备Id断开与低功耗蓝牙设备的连接
export const closeBLEConnection = (deviceId: string) => {
    return new Promise((resolve, reject) => {
        console.log('closeBLEConnection before')
        wx.closeBLEConnection({
            deviceId,
            success(res) {
                console.log('蓝牙已断开', {res})
                resolve(res)
            },
            fail(error) {
                console.log({error}, '蓝牙断开连接失败')
                const {errCode, errMsg} = error
                const errText = get(createBLEErrorCodeMap, [errCode], errMsg)
                error.errMsg = errText
                reject(error)
            }
        })
    })
}

//  通过蓝牙设备Id获取蓝牙的所有服务
export const getBLEDeviceServices: (deviceId: string) => Promise<WechatMiniprogram.GetBLEDeviceServicesSuccessCallbackResult> = (deviceId) => {
    return new Promise((resolve, reject) => {
        wx.getBLEDeviceServices({
            deviceId,
            success(res) {
              resolve(res)
            },
            fail(error) {
                console.log({error}, '蓝牙Service获取失败')
                const {errCode, errMsg} = error
                const errText = get(createBLEErrorCodeMap, [errCode], errMsg)
                error.errMsg = errText
                reject(error)
            }
        })
    })
}

//  通过蓝牙特征值服务id和蓝牙设备Id获取蓝牙特征值读写的uuid
export const getBLEDeviceCharacteristics = (
    deviceId: string,
    serviceId: string,
) => {
    return new Promise((resolve, reject) => {
        wx.getBLEDeviceCharacteristics({
            deviceId,
            serviceId,
            success(res) {
                resolve(res)
            },
            fail(error) {
                console.log({error}, 'characteristicId获取失败')
                reject(error)
            }
        })
    }) as Promise<WechatMiniprogram.GetBLEDeviceCharacteristicsSuccessCallbackResult>
}

// 注意事项:
// 1.必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件。
// 2.安卓平台上，在调用 notifyBLECharacteristicValueChange 成功后立即调用 writeBLECharacteristicValue 接口，在部分机型上会发生 10008 系统错误。

//  启用蓝牙notify功能，用来监听蓝牙之间的数据传输
export const notifyBLECharacteristicValueChange = (
    deviceId: string,
    serviceId: string,
    characteristicId: string,
) => {
    return new Promise((resolve, reject) => {
        wx.notifyBLECharacteristicValueChange({
            deviceId, //蓝牙设备ID
            serviceId, //蓝牙特征值服务id
            characteristicId, //蓝牙特征值读的uuid
            state: true, //是否启用 notify
            success(res) {
                // console.log({
                //     res,
                // }, '启用蓝牙notify功能，用来监听蓝牙之间的数据传输 返回值')
                resolve(res)
                // that.onBLECharacteristicValueChange()
                // setTimeout(()=>{
                //     that.writeBLECharacteristicValue(deviceId)
                // },200)
            },
            fail(error) {
                console.log({error}, '启用蓝牙notify功能失败')
                reject(error)
            }
        })
    }) as Promise<WechatMiniprogram.BluetoothError>
}

// 接收蓝牙设备的推送
export const onBLECharacteristicValueChange = () => {
    return new Promise((resolve, reject) => {
        wx.onBLECharacteristicValueChange(res => {
            console.log({
                res,
                // value: hexToString(arrayBufferToString(res.value))
                // value: arrayBufferToString(res.value),
                value2: ab2hex(res.value),
                // uint8Array2Str: uint8Array2Str(res.value)
            }, '收到数据 onBLECharacteristicValueChange')
            resolve(res)
        })
    }) as Promise<WechatMiniprogram.OnBLECharacteristicValueChangeListenerResult>
}

// 向低功耗蓝牙设备特征值中写入二进制数据
export const writeBLECharacteristicValue = (
    deviceId: string,
    serviceId: string,
    characteristicId: string,
    buffer: ArrayBuffer,
) => {
    return new Promise((resolve, reject) => {
        wx.writeBLECharacteristicValue({
            deviceId, //蓝牙设备id
            serviceId, //蓝牙特征值服务id
            characteristicId, //蓝牙特征值写的uuid
            value: buffer, 
            writeType: 'write',
            success (res) {
                console.log('蓝牙写成功', {res})
                resolve(res)
            },
            fail(error) {
                console.log({error}, '蓝牙写失败')
                reject(error)
            }
        })
    }) as Promise<WechatMiniprogram.BluetoothError>
}

//  读数据
export const readBLECharacteristicValue = (
    deviceId: string,
    serviceId: string,
    characteristicId: string,
) => {
    return new Promise((resolve, reject) => {
        wx.readBLECharacteristicValue({
            deviceId, //蓝牙设备id
            serviceId, //蓝牙特征值服务id
            characteristicId, //蓝牙特征值写的uuid
            success (res) {
                console.log('蓝牙读成功', {res})
                resolve(res)
            },
            fail(error) {
                console.log({error}, '蓝牙读失败')
                reject(error)
            }
        })
    }) as Promise<WechatMiniprogram.BluetoothError>
}

export const writeAndReadBLECharacteristicValue = async (
    deviceId: string,
    serviceId: string,
    characteristicId: string,
    value: string,
) => {
    return new Promise(async (resolve, reject) => {
        // const buffer = string2Buffer('5559011E000071E9')
        const buffer = string2Buffer(value)
        // console.log('发送协议码', {
        //     buffer,
        // })
        try {
            await writeBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId,
                buffer
            )
            await readBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId
            )
            resolve('')
        } catch (err) {
            console.log('writeAndReadBLECharacteristicValue', {err})
            // throw new Error(err.errMsg.split(':')[1])
            wx.showToast({
                title: err.errMsg.split(':').splice(1).join(','),
                icon: "none",
                duration: 3000
            });
            reject(err)
            // Toast.fail(err.errMsg);
        }
    })
}


