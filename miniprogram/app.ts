import { bluetoothInit } from './utils/bluetooth_util'
import { Request } from './utils/request'
import { parseApiUrl, setUserInfo } from './utils/util'

// app.ts
App<IAppOption>({
    globalData: {
    },
    onLaunch() {
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
                                    console.log({ res }, '/api/ssoauth/')
                                    // todo
                                    // setUserInfo(res)
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
    },
})