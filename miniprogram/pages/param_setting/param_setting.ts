import {
    parseProtocolCodeMessage,
    parseVoltageOrCurrentVTo10mV,
    parse10To16,
    analyzeProtocolCodeMessage,
    parseProtocolCodeToChargerInfo,
    ab2hex,
    parseProtocolCodeToChargeLineSettingData,
} from '../../utils/protocol_util'
import { Request } from '../../utils/request'
import {writeAndReadBLECharacteristicValue,} from '../../utils/bluetooth_util'
import {
    isUndefined,
    isNull,
    get,
} from '../../utils/lodash'
import { RESPONSE_MAP } from '../../common/index';

const app = getApp<IAppOption>()

Page({
  data: {
    barhHeight: 0,
    connected: app.globalData.connected || false, //  是否连接蓝牙
    chargeSwitch: false,    //  充电开关
    chargeFullEndSwitch: false, //  充满关断
    electric_current_max: '', //  最大输出电流
    voltage_max: '',  //  最大输出电压
    charge_time: '',  //  充电定时
    isDebugModel: app.globalData.isDebugModel || false,
    configDefault: {
        charging_timing_default: '',
        output_current_default: '',
        output_current_ranage: '',
        output_voltage_default: '',
        output_voltage_ranage: '',
    },
  },
  onLoad() {
  },
  onShow() {
    this.getConfigDefaultValue()
    // const chargeCountData = analyzeProtocolCodeMessage('5559052a10000a00640000000000c8012c00000000019001f400000000025802bc00000000032003200000000003e8B267', '052a1000')
    // const data = parseProtocolCodeToChargeLineSettingData(chargeCountData)
    // console.log({data})
    // this.setData({
    //     chargeLineSettingDataList: data,
    // })
    this.setData({
        isDebugModel: app.globalData.isDebugModel || false,
        connected: app.globalData.connected || false,
        // chargeLineSettingDataList: [
        //     { voltage_min: 1, eleCurrent: 1, voltage_max: 10 },
        //     { voltage_min: 10, eleCurrent: 5, voltage_max: 20 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        //     // { voltage: 1, eleCurrent: 1 },
        // ]
    })
    console.log({
        isDebugModel: app.globalData.isDebugModel || false,
        connected: app.globalData.connected || false,
    }, '参数设置')
    const that = this
    wx.getSystemInfo({
        success(res) {
            const {windowHeight, screenHeight} = res
            const barhHeight = screenHeight - windowHeight
            that.setData({
                barhHeight,
            })
        }
    })
    wx.onBLECharacteristicValueChange(res => {
        const value = ab2hex(res.value)
        console.log({
            res,
            value,
        }, '收到数据 onBLECharacteristicValueChange -------')
        if (value.startsWith('5559011e0000')) {
            if (value === '5559011e000071e9') {
                this.getBaseInfo()
                console.log('啊啊啊啊啊,获取基础信息失败,再次获取基础信息!!!!')
                return
            }
            //  读取充电器信息
            const baseInfoResponseData =  analyzeProtocolCodeMessage(value, '011e0000')
            if (!baseInfoResponseData) {
                return
            }
            const info = parseProtocolCodeToChargerInfo(baseInfoResponseData)
            console.log({
                info,
            }, '获取基础信息')
            const chargeSwitchInfo = this.parseCodeValueToChargeSwitchValue(info.chargeSwitchValue)
            //  @ts-ignore
            this.setData({
                voltage_max: info.maximumVoltage,
                electric_current_max: info.maximumCurrent,
                charge_time: info.chargingTiming,
                // chargeSwitch: info.chargeSwitchValue === 1,
                ...chargeSwitchInfo,
            })
            this.readChargeLine()
        } else if (value.startsWith('55590301')) {
            const resultCode = analyzeProtocolCodeMessage(value, '0301')
            const tilte = '擦除' + get(RESPONSE_MAP, [resultCode])
            wx.showToast({
                title: tilte,
                icon: "none",
                duration: 3000
            });
        } else if (['555903020004b054', '5559030200063195', '55590302001a305c'].includes(value)) {
            const tilte = '擦除成功'
            wx.showToast({
                title: tilte,
                icon: "none",
                duration: 3000
            });
        } else if (value.startsWith('55590201015b00')) {
            wx.showToast({
                title: '数据写入成功',
                icon: "none",
                duration: 3000
            });
            this.getBaseInfo()
        } else if (value.startsWith('55590301010ac0') || value.startsWith('555906ff10002d6b')) {
            //  擦除
            wx.showToast({
                title: '数据擦除成功',
                icon: "none",
                duration: 3000
            });
            this.readChargeLine()
        } else if (value.startsWith('55590501')) {
            // 充电曲线写入
            const resultCode = analyzeProtocolCodeMessage(value, '0501')
            const tilte = '曲线写入' + get(RESPONSE_MAP, [resultCode])
            wx.showToast({
                title: tilte,
                icon: "none",
                duration: 3000
            });
        } else if (value.startsWith('555904')) {
            //  充电曲线读取
            const chargeCountData = analyzeProtocolCodeMessage(value, '040B1000')
            const data = parseProtocolCodeToChargeLineSettingData(chargeCountData)
            console.log({
                data,
            }, '充电曲线读取')
            this.setData({
              chargeLineSettingDataList: data,
            })
        } else if (value.startsWith('55590601')) {
            // 充电曲线擦除
            const resultCode = analyzeProtocolCodeMessage(value, '0601')
            const tilte = '曲线擦除' + get(RESPONSE_MAP, [resultCode])
            wx.showToast({
                title: tilte,
                icon: "none",
                duration: 3000
            });
        }
    })
    
    this.getBaseInfo()

    // if (!app.globalData.connected) {
    //     Dialog.alert({
    //         title: '设备连接',
    //         message: '暂无设备连接,请连接设备',
    //         // theme: 'round-button',
    //         confirmButtonText: '连接设备',
    //         confirmButtonColor: 'green',
    //       }).then(() => {
    //         // on close
    //         wx.navigateTo({
    //             url: '/pages/setting_center/device_manage/device_manage',
    //         })
    //       });
    // }
  },
  readChargeLine() {
    wx.showToast({
        title: "",
        icon: "loading",
        mask: true,
        duration: 1000,
    });
    const {
        deviceId,
        serviceId,
        characteristicId,
    } = app.globalData
    if (!deviceId || !serviceId || !characteristicId) {
        return
    }
    // '555904FF10002CD3'
    //  充电曲线读取
    const buffer = parseProtocolCodeMessage(
        '04',
        'FF',
        '1000',
        ''
    )
    console.log({
        buffer,
    }, '充电曲线读取')
    try {
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
    } catch (err) {
        console.log({ err }, 'getBaseInfoData')
    }
    },
  changePageToDeviceManage() {
    wx.navigateTo({
        url: '/pages/setting_center/device_manage/device_manage',
    })
  },
  parseChargeSwitchValueToCode() {
    const {
        chargeSwitch,
        chargeFullEndSwitch,
    } = this.data
    let codeValue = 1
    //  充电开关 开 充满关断 开 对应指令 01
    //  充电开关 关 充满关断 开 对应指令 02
    //  充电开关 开 充满关断 关 对应指令 03
    //  充电开关 关 充满关断 关 对应指令 04
    if (chargeSwitch && chargeFullEndSwitch) {
        codeValue = 1;
    } else if (!chargeSwitch && chargeFullEndSwitch) {
        codeValue = 2;
    } else if (chargeSwitch && !chargeFullEndSwitch) {
        codeValue = 3;
    } else if (!chargeSwitch && !chargeFullEndSwitch) {
        codeValue = 4;
    }
    return codeValue
  },
  parseCodeValueToChargeSwitchValue(value: number) {
    let chargeSwitch = false
    let chargeFullEndSwitch = false
    if ([1, 3].includes(value)) {
        chargeSwitch = true
    }
    if ([1, 2].includes(value)) {
        chargeFullEndSwitch = true
    }
    return {
        chargeSwitch,
        chargeFullEndSwitch,
    }
  },
  async getBaseInfo() {
    const {
        deviceId,
        serviceId,
        characteristicId,
    } = app.globalData
    if (!deviceId || !serviceId || !characteristicId) {
        return
    }
    wx.showLoading({
        title: ""
    });
    const buffer = parseProtocolCodeMessage(
        '01',
        '1e',
        '0000',
        ''
      )
    console.log({
        buffer,
    }, '获取基础信息')
    try {
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
        // todo
        setTimeout(() => {
            wx.hideLoading();
        }, 2000);
    } catch (err) {
        console.log('getBaseInfo error: ', {err})
        setTimeout(() => {
            wx.hideLoading();
        }, 2000);
    }
    },
  getConfigDefaultValue() {
    const {
      deviceName,
    } = app.globalData
    if (!deviceName) {
      return
    }
    wx.showLoading({
        title: ""
    });
    try {
        Request({
            url: '/api/common/config',
            data: {
              equ_no: deviceName,
            },
            method: 'GET',
            successCallBack: (res: {data: IParamSettingDefaultValue}) => {
                // console.log({ res }, '/api/common/config')
                
                // todo 设备未配置值的时候插入默认值
                this.setData({
                    // voltage_max: res.output_voltage_default,
                    // electric_current_max: res.output_current_default,
                    // charge_time: res.charging_timing_default,
                    configDefault: res.data,
                })
                
                wx.hideLoading();
                
            },
        })
    } catch (err) {
        console.log({err})
        wx.hideLoading();
    }
  },
  onChargeSwitchChange({ detail }: {detail: boolean}) {
    // 需要手动对 checked 状态进行更新
    this.setData({chargeSwitch: detail});
  },
  onChargeFullEndSwitchChange({ detail }: {detail: boolean}) {
    // 需要手动对 checked 状态进行更新
    this.setData({chargeFullEndSwitch: detail});
  },
  clearElectricCurrentValue(isVoltage: boolean) {
    const {
        deviceId,
        serviceId,
        characteristicId,
    } = app.globalData
    if (!deviceId || !serviceId || !characteristicId) {
        return
    }
    // 擦除充电器最大电压、最大电流
    // 55 59 03 04 00 04 50 55
    const buffer = parseProtocolCodeMessage(
        '03',
        '02',
        isVoltage ? '0004' : '0006',
        ''
    )
    console.log({buffer}, '擦除充电器最大电压、最大电流')
    try {
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
    } catch (err) {
        console.log({err}, 'getBaseInfoData')
    }
  },
  resetElectricCurrent() {
    wx.showToast({
        title: "",
        icon: "loading",
        mask: true,
        duration: 1000,
    });
    this.clearElectricCurrentValue(false)
    this.setData({
        electric_current_max: this.data.configDefault.output_current_default,
    })
  },
  resetVoltage() {
    wx.showToast({
        title: "",
        icon: "loading",
        mask: true,
        duration: 1000,
    });
    this.clearElectricCurrentValue(true)
    this.setData({
        voltage_max: this.data.configDefault.output_voltage_default,
    })
  },
  clearChargeTime() {
    const {
        deviceId,
        serviceId,
        characteristicId,
    } = app.globalData
    if (!deviceId || !serviceId || !characteristicId) {
        return
    }
    // 擦除充电器定时时间
    // 55 59 03 02 00 1A 30 5C
    const buffer = parseProtocolCodeMessage(
        '03',
        '02',
        '001A',
        ''
    )
    console.log({
        buffer,
    }, '擦除充电器定时时间')
    try {
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
    } catch (err) {
        console.log({err}, 'getBaseInfoData')
    }
  },
  resetChargeTime() {
    wx.showToast({
        title: "",
        icon: "loading",
        mask: true,
        duration: 1000,
    });
    this.clearChargeTime()
    this.setData({
        charge_time: this.data.configDefault.charging_timing_default,
    })
  },
  //    设置充电器输出电流、电压
  setChargerVoltageAndCurrent() {
    // const electric_current_max = this.data.electric_current_max
    // const voltage_max = this.data.voltage_max
    // const chargeSwitch = this.data.chargeSwitch
    const chargeSwitch = this.parseChargeSwitchValueToCode();
    const {
        deviceId,
        serviceId,
        characteristicId,
    } = app.globalData
    // const buffer = parseProtocolCodeMessage(
    //     '02',
    //     '06',
    //     '0002',
    //     parse10To16(chargeSwitch ? 1 : 2, 1) +
    //     '00' +
    //     parse10To16(parseVoltageOrCurrentVTo10mV(parseFloat(voltage_max)), 2) + 
    //     parse10To16(parseVoltageOrCurrentVTo10mV(parseFloat(electric_current_max)), 2)
    // )
    // console.log({
    //     buffer,
    // }, '保存最大输出电流、电压')
    const buffer = parseProtocolCodeMessage(
        '02',
        '01',
        '0002',
        parse10To16(chargeSwitch, 1)
    )
    console.log({
        buffer,
    }, '保存开关')
    if (!deviceId || !serviceId || !characteristicId) {
        return
    }
    try {
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
    } catch (err) {
        console.log({err}, 'getBaseInfoData')
    }

    //  充电器电流、电压 写入成功
    // '55590201015B00'
  },
  //    充电定时保存
  setChargerSetTime() {
    const charge_time = +this.data.charge_time
    const {
        deviceId,
        serviceId,
        characteristicId,
    } = app.globalData
    if (!deviceId || !serviceId || !characteristicId) {
        return
    }
    const buffer = parseProtocolCodeMessage(
        '02',
        '02',
        '001A',
        parse10To16(charge_time, 2)
    )
    console.log(
        buffer,
        '充电定时保存'
    )
    try {
        writeAndReadBLECharacteristicValue(
            deviceId,
            serviceId,
            characteristicId,
            buffer,
        )
    } catch (err) {
        console.log({err}, 'getBaseInfoData')
    }

    //  充电器电流、电压 写入成功
    // '55590201015B00'
  },
  handleParamSettingSave() {
    const electric_current_max = +this.data.electric_current_max
    const voltage_max = +this.data.voltage_max
    const chargeSwitch = this.data.chargeSwitch
    const configDefault = this.data.configDefault
    // const {
    //     output_voltage_ranage,
    //     output_current_ranage,
    // } = configDefault
    // if (!output_voltage_ranage || !output_current_ranage) {
    //     wx.showToast({
    //         title: '请配置最大输出电流或输出电压数据范围',
    //         icon: "none",
    //         duration: 3000
    //     })
    //     return
    // }
    
    // const [output_voltage_min, output_voltage_max] = output_current_ranage.split('-')
    // const [output_current_min, output_current_max] = output_current_ranage.split('-')
    // if (isUndefined(electric_current_max) || isNull(electric_current_max)) {
    //     wx.showToast({
    //         title: '请输入最大输出电流',
    //         icon: "none",
    //         duration: 3000
    //     })
    //     return
    // }
    // if (electric_current_max < output_current_min || electric_current_max > output_current_max) {
    //     wx.showToast({
    //         title: `请确保最大输出电流在${output_current_min}-${output_current_max}之间`,
    //         icon: "none",
    //         duration: 3000
    //     })
    //     return
    // }
    // if (isUndefined(voltage_max) || isNull(voltage_max)) {
    //     wx.showToast({
    //         title: '请输入最大输出电压',
    //         icon: "none",
    //         duration: 3000
    //     })
    //     return
    // }
    // if (voltage_max < output_voltage_min || voltage_max > output_voltage_max) {
    //     wx.showToast({
    //         title: `请确保最大输出电压在${output_voltage_min}-${output_voltage_max}之间`,
    //         icon: "none",
    //         duration: 3000
    //     })
    //     return
    // }
    const charge_time = +this.data.charge_time
    if (isUndefined(charge_time) || isNull(charge_time)) {
        wx.showToast({
            title: '请输入充电定时',
            icon: "none",
            duration: 3000
        })
        return
    }
    if (charge_time >= 65535) {
        wx.showToast({
            title: '数值有效范围: 0 ~ 65534',
            icon: "none",
            duration: 3000
        })
        return
    }
    wx.showToast({
        title: "",
        icon: "loading",
        mask: true,
        duration: 1000,
    });
    this.setChargerVoltageAndCurrent()
    this.setChargerSetTime()
  }
})
