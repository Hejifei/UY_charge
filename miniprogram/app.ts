import { bluetoothInit } from './utils/bluetooth_util'
import { Request } from './utils/request'
import { setUserInfo, setUserToken } from './utils/util'

// app.ts
App<IAppOption>({
    globalData: {
      userInfo: undefined
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
                                    console.log({
                                      res: res.data,
                                      globaluserInfo: this.globalData.userInfo
                                    })
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
    },
})