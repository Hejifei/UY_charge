import {
    bluetoothInit,
    getBluetoothAdapterState,
} from '../../utils/bluetooth_util'
import Toast from '@vant/weapp/toast/toast';
// const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    isDebugModeVisible: false,
    debugCode: undefined,
  },
  onLoad() {
  },
  onReady() {
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
  }
})
