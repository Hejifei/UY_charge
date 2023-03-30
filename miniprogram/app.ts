import {
  bluetoothInit,
  getBluetoothAdapterState,
} from "./utils/bluetooth_util";
import {checkWechatVersion} from './utils/checkVersion'
import { Request } from "./utils/request";
import { setUserToken } from "./utils/util";

// app.ts
App<IAppOption>({
  globalData: {
    userInfo: undefined,
    isDebugModel: false,
    // isDebugModel: true,
    connected: false,
    reConnectedTimes: 0,    //  蓝牙断开重连次数
    deviceName: undefined,
    deviceId: undefined,
    serviceId: undefined,
    characteristicId: undefined,
  },
  onLaunch() {
    console.log('getUserInfo before')
    wx.login({
        success: (res) => {
          console.log({
              wxLoginSuccessRes: res,
              if: !!res.code,
          }, 'login success')
          wx.getUserInfo({
            success: (getUserInfores) => {
              console.log({
                getUserInfores,
              }, 'getUserInfo')
              const { encryptedData: encrypted_data, iv } = getUserInfores;
              if (!!res.code) {
                Request({
                  url: "/api/ssoauth/",
                  data: {
                    encrypted_data,
                    code: res.code,
                    iv,
                  },
                  method: "POST",
                  successCallBack: (fetchLoginres) => {
                    // console.log({ res }, '/api/ssoauth/')
                    // setUserInfo(res.data)
                    this.globalData.userInfo = fetchLoginres.data;
                      //   group_id 1 普通用户 2 管理员
                  //   this.globalData.isDebugModel = res.data.group_id === 2
                    // console.log({
                    //   res: res.data,
                    //   globaluserInfo: this.globalData.userInfo
                    // })
                    setUserToken(fetchLoginres.data.token);
                  },
                });
              }
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
            },
            fail: (res) => {
              console.log(
                {
                  getUserInfoFail: res,
                },
                "获取用户信息失败"
              );
            },
          });
          
        },
        fail: (res) => {
          console.log({
            err: res,
          }, 'login error');
        },
      });
    

    getBluetoothAdapterState()
      .then((res) => {
        console.log("蓝牙可用");
      })
      .catch((res) => {
        console.log("蓝牙不可用");
      });

    bluetoothInit()
      .then((res) => {
        console.log("蓝牙初始化成功!");
        // console.log({
        //     success:res
        // })
      })
      .catch((res) => {
        console.log({ res }, "蓝牙初始化异常!");
      });

    const listenConnection = () => {
      console.log("listenConnection");
      wx.onBLEConnectionStateChange((res) => {
        console.log("connectState", { res });
        //   this.globalData.connected = res.connected
        if (res.connected) {
            this.globalData.reConnectedTimes = 0
          // Toast.success('连接成功!');
          // that.showToast({
          //   title: "连接成功",
          // })
        } else {
        //   if (this.globalData.deviceId && this.globalData.reConnectedTimes <= 5) {
        //     this.globalData.reConnectedTimes = this.globalData.reConnectedTimes + 1
        //     const deviceId = this.globalData.deviceId;
        //     console.log({
        //       deviceId,
        //     });
        //     // bluetoothInit()
        //     wx.createBLEConnection({
        //       deviceId,
        //       success(res) {
        //         //   console.log(res)
        //         console.log("蓝牙重连成功!");
        //       },
        //     });
        //   } else if (this.globalData.deviceId && this.globalData.reConnectedTimes > 5) {
            // 重连5次仍然失败,断开连接,给出提示
            this.globalData = {
                ...this.globalData,
                connected: false,
                reConnectedTimes: 0,
                deviceName: undefined,
                deviceId: undefined,
                serviceId: undefined,
                characteristicId: undefined,
            }
            wx.showToast({
                title: '蓝牙连接已断开',
                icon: "none",
                duration: 3000
            });

        //   }
        }
      });
    };
    listenConnection();
    // wx.onBLECharacteristicValueChange(res => {
    //     const value = ab2hex(res.value)
    //     console.log({
    //         res,
    //         value,
    //     }, '收到数据 onBLECharacteristicValueChange -------')
    //     if (value.startsWith('5559011e0000')) {
    //         const baseInfoResponseData =  analyzeProtocolCodeMessage(value, '011e0000')
    //         const chargerInfo = parseProtocolCodeToChargerInfo(baseInfoResponseData)
    //         console.log({
    //             chargerInfo,
    //         })
    //         setChargerInfo(chargerInfo)
    //     }
    // })

    checkWechatVersion()
  },
});
