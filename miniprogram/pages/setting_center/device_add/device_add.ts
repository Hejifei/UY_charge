import {
  getHistoryDevices,
  inArray,
  setHistoryDevices,
} from "../../../utils/util";
import { Request } from "../../../utils/request";
import Dialog from "@vant/weapp/dialog/dialog";
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
  closeBLEConnection,
  writeAndReadBLECharacteristicValue,
} from "../../../utils/bluetooth_util";
// import Toast from '@vant/weapp/toast/toast';
const app = getApp<IAppOption>();

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    name: "",
    connected: false,
    deviceList: [],
    descList: [
      "请确定设备以及开启连接模式;",
      "请确定设备以及开启连接模式;",
      "请确定设备以及开启连接模式;",
    ],
    chs: [],
    _discoveryStarted: false, //  是否开始扫描
    instruction: '',    //  连接说明
    // deviceId: undefined, // 已连接蓝牙id
  },
  onLoad() {
    console.log("onLoad");
    // console.log(ModBusCRC16('55590A293000'))
  },
  onShow() {
    console.log("onShow");
  },
  onUnload() {
    // 停止扫描
    stopBluetoothDevicesDiscovery();
    // this.closeBluetoothAdapter()
  },
  onReady() {
    this.setData({
      connected: app.globalData.deviceId || false,
      name: app.globalData.deviceName,
    });
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

    // getBluetoothAdapterState()
    //   .then((res) => {
    //     console.log("蓝牙可用");
    //   })
    //   .catch((res) => {
    //     console.log("蓝牙不可用");
    //   });
    //  开始扫描
    this.openBluetoothAdapter();

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
    this.getInitData()
  },
  getInitData() {
    const that = this
      Request({
        url: '/api/common/aboutus',
        data: {},
        method: 'GET',
        successCallBack: (res) => {
            // console.log({ res }, '关于我们')
            const instruction = res.data.instruction
            this.setData({
                instruction,
            })
        },
      })
  },
  async openBluetoothAdapter() {
    // wx.showToast({
    //     title: "",
    //     icon: "loading",
    //     mask: true,
    //     duration: 2000,
    // });
    wx.showLoading({
        title: '扫描中',
    })
    const that = this;
    const failWhenBluetootoOpenCallback = () => {
      that.startBluetoothDevicesDiscovery();
    };
    try {
    //   await bluetoothClose()
      await bluetoothInit(failWhenBluetootoOpenCallback);
      that.startBluetoothDevicesDiscovery();
    } catch (err) {
      // console.log({err})
      // Toast.fail(err.errMsg);
      wx.hideLoading()
      wx.showToast({
        title: err.errMsg,
        icon: "error",
        duration: 2000,
      });
    }
  },
  getBluetoothAdapterState() {
    const that = this;
    getBluetoothAdapterState().then((res: any) => {
        console.log({
            res,
        }, 'getBluetoothAdapterState')
      if (res.discovering) {
        that.onBluetoothDeviceFound();
      } else if (res.available) {
        that.startBluetoothDevicesDiscovery();
      }
    });
  },
  async startBluetoothDevicesDiscovery() {
    if (this.data._discoveryStarted) {
      return;
    }
    this.setData({
      _discoveryStarted: true,
    });
    try {
      await startBluetoothDevicesDiscovery();
      this.onBluetoothDeviceFound();
    } catch (err) {
      // console.log({err})
      // Toast.fail(err.errMsg);
      this.setData({
        _discoveryStarted: false,
      });
      wx.hideLoading()
      stopBluetoothDevicesDiscovery()
      wx.showToast({
        title: err.errMsg.split(':').splice(1).join(','),
        icon: "error",
        duration: 2000,
      });
    }
  },
  async onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
        // console.log({
        //     res,
        // })
        res.devices
        .filter(({ name, connectable }) => {
            return true
          return name.startsWith('UY')
          // TODO
        //   return name.startsWith('UY') && connectable
        //   return connectable;
        })
        .forEach((device) => {
          if (!device.name && !device.localName) {
            return;
          }
          const foundDevices = this.data.deviceList;
          const newDeviceList = [...foundDevices];
          const idx = inArray(foundDevices, "deviceId", device.deviceId);
          if (idx === -1) {
            //  @ts-ignore
            newDeviceList.push(device);
          } else {
            //  @ts-ignore
            newDeviceList[idx] = device;
          }
          newDeviceList.sort((deviceA, deviceB) => {
              return deviceB.RSSI - deviceA.RSSI
          })
          console.log({
            newDeviceList,
          })
          this.setData({
            deviceList: [...newDeviceList],
          });
        });
      })
      setTimeout(() => {
        wx.hideLoading()
        stopBluetoothDevicesDiscovery()
        this.setData({
            _discoveryStarted: false,
        });
      }, 10 * 1000)
      return
    try {
      const res = await getBluetoothDevices();
      if (res.devices.length >= 1) {
        this.setData({
          _discoveryStarted: false,
        });
        stopBluetoothDevicesDiscovery()
      }
      // console.log({res,}, 'getBluetoothDevices')
      res.devices
        .filter(({ name, connectable }) => {
          // return name.startsWith('UY')
          // TODO
          return name.startsWith('UY') && connectable
        //   return connectable;
        })
        .forEach((device) => {
          if (!device.name && !device.localName) {
            return;
          }
          const foundDevices = this.data.deviceList;
          const newDeviceList = [...foundDevices];
          const idx = inArray(foundDevices, "deviceId", device.deviceId);
          // const data = {}
          if (idx === -1) {
            //  @ts-ignore
            // data[`deviceList[${foundDevices.length}]`] = device
            newDeviceList.push(device);
          } else {
            //  @ts-ignore
            // data[`deviceList[${idx}]`] = device
            newDeviceList[idx] = device;
          }
          console.log({
            newDeviceList,
          });
          this.setData({
            deviceList: [...newDeviceList],
          });
        });
    } catch (err) {
      this.setData({
        _discoveryStarted: false,
      });
      stopBluetoothDevicesDiscovery()
      console.log({ err }, "onBluetoothDeviceFound");
      // Toast.fail(err.errMsg);
      wx.showToast({
        title: err.errMsg,
        icon: "error",
        duration: 2000,
      });
    }
  },
  async closeBLEConnection() {
    const { deviceId } = app.globalData;
    if (!deviceId) {
      return;
    }
    getApp().globalData.connected = false;
    getApp().globalData.deviceName = undefined;
    getApp().globalData.deviceId = undefined;
    getApp().globalData.serviceId = undefined;
    getApp().globalData.characteristicId = undefined;
    this.setData({
      connected: false,
      name: "",
    });
    // Toast.success('蓝牙已断开!');
    await closeBLEConnection(deviceId);
    wx.showToast({
        title: "蓝牙已断开!",
        icon: "success",
        duration: 2000,
      });
  },
  async createBLEConnection(e: any) {
    const that = this;
    // wx.showToast({
    //   title: "",
    //   icon: "loading",
    //   mask: true,
    //   duration: 2000,
    // });
    wx.showLoading({
        title: '连接中',
    })
    // console.log('建立蓝牙连接')
    const ds = e.currentTarget.dataset;
    const deviceId = ds.deviceId;
    const name = ds.name;
    const id = ds.deviceId;
    // console.log({
    //     e,
    //     id,
    //     connected: this.data.connected,
    // })
    if (id === this.data.connected) {
        wx.hideLoading()
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
    const deviceInfo: IHistoryDeviceItem = {
      name,
      deviceId,
    };
    try {
      await createBLEConnection(deviceId);
      const { services } = await getBLEDeviceServices(deviceId);
      for (let i = services.length - 1; i >= 0; i--) {
        // for (let i = 0; i < services.length; i++) {
        if (services[i].isPrimary) {
          const serviceId = services[i].uuid;
          const { characteristics } = await getBLEDeviceCharacteristics(
            deviceId,
            serviceId
          );
          // console.log({
          //     characteristics,
          // }, 'getBLEDeviceCharacteristics')
          for (let j = 0; j < characteristics.length; j++) {
            let item = characteristics[j];
            const characteristicId = item.uuid;
            if ((item.properties.notify || item.properties.indicate) && characteristicId.toLocaleLowerCase() === '0000ae02-0000-1000-8000-00805f9b34fb') {
              await notifyBLECharacteristicValueChange(
                deviceId,
                serviceId,
                characteristicId
              );
              deviceInfo.notify = {
                serviceId,
                characteristicId,
              };
              console.log('启用蓝牙notify功能', {
                  deviceId, serviceId, characteristicId
              })
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
              getApp().globalData.connected = true;
              getApp().globalData.deviceId = deviceId;
              getApp().globalData.serviceId = serviceId;
              getApp().globalData.characteristicId = characteristicId;
              deviceInfo.write = {
                serviceId,
                characteristicId,
              };
              console.log({
                  deviceId,
                  serviceId,
                  characteristicId,
              }, '可写')
              // setTimeout(() => {
              //     writeAndReadBLECharacteristicValue(
              //         deviceId,
              //         serviceId,
              //         characteristicId,
              //         '5559011E000071E9'
              //     )
              // }, 10000);
            }
          }
        }
      }
      // console.log({
      //     services,
      // })
      const deviceHistory = await getHistoryDevices();
      if (!deviceHistory.filter((item) => item.deviceId === deviceId).length) {
        deviceHistory.push(deviceInfo);
      }
      setHistoryDevices(deviceHistory);
      this.setData({
        connected: deviceId,
        name,
        deviceId,
      });
      getApp().globalData.deviceName = name;
      this.uploadConnectRecord(name);
      wx.hideLoading()
      // Toast.success('设备连接成功!');
      wx.showToast({
        title: "蓝牙已连接!",
        icon: "success",
        duration: 2000,
      });

      if (true) {
        setTimeout(() => {
            const {
            deviceId,
            serviceId,
            characteristicId,
        } = app.globalData
        const value = '电视机'
        // var gb2312 = TextCodec("GB2312","long",value)
        // console.log({
        //     value,
        //     gb2312,
        // })
        // const buffer = `${parse10To16(valueLength)}06${gb2312}CRC_HCRC_L`
        // const buffer = 'gb2312'
        const buffer = '0501032050'
        console.log('write before, 写的参数', {
            str: buffer,
            deviceId,
            serviceId,
            characteristicId,
        })
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
        console.log('write after')
        }, 2000);
      }
    } catch (err) {
      // console.log({err}, '蓝牙连接失败')
      // Toast.fail(err.errMsg);
      wx.hideLoading()
      wx.showToast({
        title: err.errMsg,
        icon: "error",
        duration: 2000,
      });
    }

    // stopBluetoothDevicesDiscovery()
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
  closeBluetoothAdapter() {
    // bluetoothClose()
    this.setData({
      _discoveryStarted: false,
    });
  },
});
