import { Request } from "../../../utils/request";
import { getHistoryDevices } from "../../../utils/util";
import Dialog from "@vant/weapp/dialog/dialog";
import {
  createBLEConnection,
  notifyBLECharacteristicValueChange,
  closeBLEConnection,
} from "../../../utils/bluetooth_util";
const app = getApp<IAppOption>();

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    connected: "", //  已连蓝牙的id
    historyDeviceList: [
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
  },
  onLoad() {},
  onShow() {
    const that = this;
    wx.getSystemInfo({
      success(res) {
        const { windowHeight, screenHeight, statusBarHeight } = res;
        const barhHeight = screenHeight - windowHeight;
        let menu = wx.getMenuButtonBoundingClientRect();
        let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2;
        const navTopHeight = statusBarHeight + navBarHeight / 2 - 12;
        that.setData({
          barhHeight,
          titlePositionTop: navTopHeight,
        });
      },
    });
    this.setData({
      connected: app.globalData.deviceId || "",
    });
    this.getDeviceList();
  },
  async getDeviceList() {
    try {
      const data = await getHistoryDevices();
      console.log({
        deviceList: data,
      });
      this.setData({
        historyDeviceList: data,
      });
    } catch (err) {
      console.log({ err });
    }
  },
  //  记录设备连接记录
  uploadConnectRecord(title: string) {
    Request({
      url: "/api/user/connect",
      data: {
        title,
      },
      method: "POST",
      successCallBack: (res: any) => {
        console.log({ res }, "/api/user/connect");
      },
    });
  },
  handleUnConnect() {
    if (!this.data.connected) {
      return;
    }
    console.log("断开连接");
    this.closeBLEConnection();
  },
  closeBLEConnection() {
    const deviceId = this.data.connected;
    getApp().globalData.connected = false;
    getApp().globalData.deviceName = undefined;
    getApp().globalData.deviceId = undefined;
    getApp().globalData.serviceId = undefined;
    getApp().globalData.characteristicId = undefined;
    this.setData({
      connected: "",
    });
    closeBLEConnection(deviceId);
    // Toast.success('蓝牙已断开!');
    wx.showToast({
      title: "蓝牙已断开!",
      icon: "success",
      duration: 2000,
    });
  },
  async createBLEConnection(e: any) {
    const that = this;
    wx.showToast({
      title: "",
      icon: "loading",
      mask: true,
      duration: 2000,
    });
    // console.log('建立蓝牙连接')
    const ds = e.currentTarget.dataset;
    const deviceId = ds.deviceId;
    const name = ds.name;
    const id = ds.deviceId;
    // console.log({
    //     e,
    //     id,
    //     connected: this.data.connected,
    //     if: id === this.data.connected,
    //     text: id === this.data.connected ? '断开连接' : '建立连接',
    // })
    if (id === this.data.connected) {
      Dialog.confirm({
        title: "断开连接?",
        message: "此操作将断开您与以下设备的连接:" + name,
      })
        .then(() => {
          that.closeBLEConnection();
        })
        .catch(() => {
          // console.log('error')
          // on cancel
        });
      return;
    }
    const deviceInfo = this.data.historyDeviceList.filter(
      (item) => item.deviceId === deviceId
    )[0] as IHistoryDeviceItem;
    try {
      await createBLEConnection(deviceId);
      if (deviceInfo.notify) {
        await notifyBLECharacteristicValueChange(
          deviceId,
          deviceInfo.notify.serviceId,
          deviceInfo.notify.characteristicId
        );
      }
      if (deviceInfo.write) {
        getApp().globalData.connected = true;
        getApp().globalData.deviceName = name;
        getApp().globalData.deviceId = deviceId;
        getApp().globalData.serviceId = deviceInfo.write.serviceId;
        getApp().globalData.characteristicId =
          deviceInfo.write.characteristicId;
      }
      this.setData({
        connected: deviceId,
      });
      this.uploadConnectRecord(deviceId);
      // Toast.success('设备连接成功!');
      wx.showToast({
        title: "设备连接成功!",
        icon: "success",
        duration: 2000,
      });
    } catch (err) {
      // console.log({err}, '蓝牙连接失败')
      // Toast.fail(err.errMsg);
      wx.showToast({
        title: err.errMsg,
        icon: "error",
        duration: 2000,
      });
    }

    // stopBluetoothDevicesDiscovery()
  },
  backPageToSettingCenter() {
    wx.switchTab({
      url: "/pages/setting_center/setting_center",
    });
  },
  changePageToAddDevice() {
    wx.navigateTo({
      url: "/pages/setting_center/device_add/device_add",
    });
  },
});
