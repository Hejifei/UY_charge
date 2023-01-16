import {
    bluetoothInit,
    getBluetoothAdapterState,
} from '../../utils/bluetooth_util'
import { Request } from '../../utils/request'
import {getUserInfo, parseApiUrl, setUserInfo} from '../../utils/util'
import Toast from '@vant/weapp/toast/toast';
// const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    isDebugModeVisible: false,
    debugCode: undefined,
    userInfo: getUserInfo(),
  },
  onLoad() {
  },
  onReady() {
    
    this.setData({
        userInfo: getUserInfo(),
    })
    console.log({
        getUserInfo: getUserInfo(),
        userInfo: this.data.userInfo,
    })
    const that = this
    wx.getSystemInfo({
        success(res) {
            const {windowHeight, screenHeight, statusBarHeight} = res
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

    // bluetoothInit().then(res => {
    //     Toast.success('蓝牙初始化成功!')
    //     console.log({
    //         success:res
    //     })
    // }).catch((res) => {
    //     Toast.fail(res.errMsg);
    //     console.log({
    //         fail:res
    //     })
    // })
    getBluetoothAdapterState().then(res => {
        console.log('蓝牙可用')
    }).catch((res) => {
        console.log('蓝牙不可用')
    })
  },
  getUserInfo(event: any) {
    console.log(event.detail, 'getUserInfo');
  },
  handleDebugCodeModalVisible() {
    this.setData({ isDebugModeVisible: true });
  },
  onClose() {
    this.setData({ isDebugModeVisible: false });
  },
  handleDebugCodeSave() {
      console.log({
        debugCode: this.data.debugCode,
      })
      this.onClose()
  },
  upload_file(filePath: string) {
    wx.showLoading({
        title: "上传中"
    });
    wx.uploadFile({
        url:  parseApiUrl('/api/upload/'),
        filePath,//图片路径
        name: "filename",
        formData: {
            token: this.data.userInfo.token,
            user_avatar: "filePath"
        },
        header: {
            "Content-Type": "multipart/form-data"
        },
        success: (res) => {
            const that = this
            const {data} = res
            try {
                const {url, code} = JSON.parse(data) as {
                    code: number
                    message: string
                    url: string
                    path: string
                }
                if (code === 200) {
                    Request({
                        url: '/api/user/perfectInformation',
                        data: {
                            nickname: that.data.userInfo.nickname,
                            headimgurl: url,
                        },
                        method: 'POST',
                        successCallBack: (res) => {
                            // console.log({ res }, '/api/user/perfectInformation')
                            setUserInfo({
                                ...getUserInfo(),
                                ...res.data,
                            })
                            this.setData({
                                userInfo: getUserInfo(),
                            })
                        },
                    })
                }
            } catch (err) {
                console.log({err})
            }
            // console.log({
            //     uploadSuccessRes: res,
            // })
            wx.hideLoading();
            wx.showToast({
                title: "上传成功",
                icon: "success",
                duration: 3000
            });
        },
        fail: function(res) {
            console.log({
                uploadFailRes: res,
            })
            wx.hideLoading();
            wx.showToast({
                title: "上传失败",
                icon: "none",
                duration: 3000
            });
        }
    });
},
  chooseImage() {
    wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res)=> {
            const {tempFilePaths} = res
            if (!tempFilePaths.length) {
                return
            }
            if(res.tempFiles[0].size > 1024 * 1024 * 2){
                wx.showModal({
                    title: "提示",
                    content: "选择的图片过大，请上传不超过2M的图片",
                    showCancel: !1,
                    success: (a) => {
                    }
                })
            }else{
                //把图片上传到服务器
                this.upload_file(tempFilePaths[0])
            }
            
            // console.log({
            //     res,
            // })
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        }
    })
  }
})
