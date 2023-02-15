import store from './store/index'
import action from './store/actions/index'
import Provider from './weapp-redux/provider/index'
import { bluetoothInit } from './utils/bluetooth_util'
import { Request } from './utils/request'
import { ab2hex, setUserInfo, setUserToken } from './utils/util'
import {
    add,
    minus,
    asyncAdd,
    setNumHandleInitValue,
  } from './store/actions/numHandle';
let { Page, Component } = Provider(store, action)


// app.ts
App<IAppOption>({
    globalData: {
        userInfo: undefined,
        isDebugModel: false,
        deviceId: undefined,
        serviceId: undefined,
        characteristicId: undefined,
    },
    onLaunch() {
        setNumHandleInitValue(999)
        setTimeout(() => {
            setNumHandleInitValue(666)
        }, 2000);
        // 展示本地存储能力
        // const logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        wx.getUserInfo({
            success: res => {
                const {
                    encryptedData: encrypted_data,
                    iv,
                } = res
                wx.login({
                    success: res => {
                        // console.log({
                        //     wxLoginSuccessRes: res,
                        //     if: !!res.code,
                        // })
                        if (!!res.code) {
                            Request({
                                url: '/api/ssoauth/',
                                data: {
                                    encrypted_data,
                                    code: res.code,
                                    iv,
                                },
                                method: 'POST',
                                successCallBack: (res) => {
                                    // console.log({ res }, '/api/ssoauth/')
                                    // setUserInfo(res.data)
                                    this.globalData.userInfo = res.data
                                    // console.log({
                                    //   res: res.data,
                                    //   globaluserInfo: this.globalData.userInfo
                                    // })
                                    setUserToken(res.data.token)
                                },
                            })
                        }
                        // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    },
                    fail: res => {
                        console.log({
                            err: res,
                        })
                    }
                })
            },
            fail: res => {
                console.log({
                    getUserInfoFail: res,
                }, '获取用户信息失败')
            },
        })
        

        bluetoothInit().then(res => {
            // console.log('蓝牙初始化成功!')
            // console.log({
            //     success:res
            // })
        }).catch((res) => {
            console.log(res);
        })

        wx.onBLECharacteristicValueChange(res => {
            console.log({
                res,
                // value: hexToString(arrayBufferToString(res.value))
                // value: arrayBufferToString(res.value),
                value2: ab2hex(res.value),
                // uint8Array2Str: uint8Array2Str(res.value)
            }, '收到数据 onBLECharacteristicValueChange -------')
        })
    },
})