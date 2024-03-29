import Dialog from "@vant/weapp/dialog/dialog";
import { Request } from '../../utils/request'
import {parseApiUrl} from '../../utils/util'
const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    isDebugModeVisible: false,
    isNickNameChangeVisible: false,
    debugCode: undefined,
    userInfo: app.globalData.userInfo,
    isDebugModel: app.globalData.isDebugModel || false,
    nickName: '',
    connected: '',   //  已连蓝牙的id
  },
  onLoad() {
  },
  onShow() {
    
    this.setData({
        userInfo: app.globalData.userInfo,
        isDebugModel: app.globalData.isDebugModel || false,
        connected: app.globalData.deviceId || '',
    })
    console.log({
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
    
  },
  onChooseAvatar(e) {
    const {avatarUrl} = e.detail
    console.log({e, avatarUrl})
    this.upload_file(avatarUrl)
  },
  handleDebugCodeModalVisible() {
      if (this.data.isDebugModel) {
          
        Dialog.confirm({
            title: "退出调试模式?",
            message: "是否确认退出调试模式?",
        })
        .then(async () => {
            getApp().globalData.isDebugModel = false
            this.setData({
                debugCode: '',
                isDebugModel: app.globalData.isDebugModel,
            })
            wx.showToast({
                title: "退出调试模式成功!",
                icon: "success",
                duration: 2000,
            });
        })
        .catch(() => {
            // console.log('error')
            // on cancel
        });
        return
      }
    this.setData({ isDebugModeVisible: true });
  },
  closeDebugCodeModal() {
    this.setData({ isDebugModeVisible: false });
  },
  handleDebugCodeSave() {
      const that = this;
      const code = this.data.debugCode
      if (!code) {
        wx.showToast({
            title: '请输入验证码',
            icon: "none",
            mask: true,
            duration: 2000
        });
        return
      }
      this.closeDebugCodeModal()

      wx.showToast({
        title: '',
        icon: "loading",
        mask: true,
        duration: 2000
    });
      
      Request({
        url: '/api/user/activeCode',
        data: {
          code,
        },
        method: 'POST',
        successCallBack: (res: any) => {
            // console.log({ res }, '/api/user/activeCode')
            getApp().globalData.isDebugModel = true
            that.setData({
                debugCode: '',
                isDebugModel: app.globalData.isDebugModel,
            })
        },
        failCallBack: () => {
            getApp().globalData.isDebugModel = false
            that.setData({
                debugCode: '',
                isDebugModel: app.globalData.isDebugModel,
            })
            // console.log({
            //     code,
            //     debugCode: this.data.debugCode,
            //     data: this.data,
            // })
        }
      })
      
  },
  handleNickNameChangeModalVisible() {
    this.setData({ isNickNameChangeVisible: true });
  },
  closeNickNameChangeModal() {
    this.setData({ isNickNameChangeVisible: false });
  },
  handleNickNameChangeCodeSave() {
    const that = this
      // console.log({
      //   nickName: this.data.nickName,
      // })
      if (!this.data.nickName) {
        wx.showToast({
            title: '请输入昵称',
            icon: "none",
            mask: true,
            duration: 2000
        });
        return
      }

      wx.showToast({
        title: '',
        icon: "loading",
        mask: true,
        duration: 2000
        });
      
      Request({
        url: '/api/user/perfectInformation',
        data: {
            nickname: that.data.nickName,
            headimgurl: that.data.userInfo.headimgurl || '',
        },
        method: 'POST',
        successCallBack: (res) => {
            // console.log({ res }, '/api/user/perfectInformation')
            //  @ts-ignore
            getApp().globalData.userInfo = {
                ...app.globalData.userInfo,
                nickname: res.data.nickname,
            }
            this.setData({
                userInfo: app.globalData.userInfo,
            })
            wx.hideLoading();
            wx.showToast({
                title: "昵称更新成功!",
                icon: "success",
                duration: 3000
            });
            this.closeNickNameChangeModal()
        },
      })
      
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
                const {path, url, code} = JSON.parse(data) as {
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
                            headimgurl: path,
                        },
                        method: 'POST',
                        successCallBack: (res) => {
                            // console.log({ res }, '/api/user/perfectInformation')
                            getApp().globalData.userInfo = {
                              ...app.globalData.userInfo,
                              ...res.data,
                              headimgurl: url,
                            }
                            this.setData({
                                userInfo: app.globalData.userInfo,
                            })
                            wx.hideLoading();
                            wx.showToast({
                                title: "头像更新成功!",
                                icon: "success",
                                duration: 3000
                            });
                        },
                    })
                }
            } catch (err) {
                console.log({err})
            }
            // console.log({
            //     uploadSuccessRes: res,
            // })
            
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
