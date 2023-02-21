import {
  PROTOCOL_START_CODE,
  chargeModeMap,
  switchValueMap,
  fanLevelMap,
} from '../common/protocol_common'
import {ModBusCRC16} from './crc'
import {
    isString,
} from './lodash'
import moment from 'moment'

// 起始码、指令码、字节长度、起始地址、数据(写指令有效，读指令/擦除指令省略)、校验码组成。

//  生成报文
export const parseProtocolCodeMessage = (
  directCode: string,  //  指令码
  byteLength: string,  //  子节长度
  startByteAddress: string,  //  起始地址
  data: string,  //  数据(写指令有效，读指令/擦除指令省略)
) => {
  const frontCode = [
    PROTOCOL_START_CODE,
    directCode,
    byteLength,
    startByteAddress,
    data
  ].join('')
  //  校验码
  const checkCode = ModBusCRC16(frontCode)
  return [
    frontCode,
    checkCode,
  ].join('')
}

// 解析报文
export const analyzeProtocolCodeMessage = (
  codeMessage: string,
  fontBaseCode: string, //  除了起始码之外的固定码,

) => {
  const baseFrontCode = [
    PROTOCOL_START_CODE,
    fontBaseCode,
  ].join('')
  return codeMessage.substring(baseFrontCode.length, codeMessage.length - 4)
}


// ArrayBuffer转16进度字符串示例
export const ab2hex = (buffer: Buffer) => {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
}

//  16进制转10进制
export const parse16To10 = (value: string) => {
    return parseInt(value, 16)
}

const fillText = (str: string, length: number, fillText: string = '0') => {
    str = (new Array(length)).fill(fillText).join(fillText) + str;
    return str.substring(str.length - length, str.length);
}

//  10进制转16进制
export const parse10To16 = (value: number | string, byteLength: number = 1) => {
    let value16 = (isString(value) ? parseInt(value) : value).toString(16)
    if (byteLength) {
        const newVlaueLength = byteLength * 2
        return fillText(value16, newVlaueLength, '0')
    }
    return value16
}

//  电压10mV转V
export const parseVoltageOrCurrent10mVToV = (value: number) => {
    return value * 10 / 1000
}

//  电流电压V转10mV
export const parseVoltageOrCurrentVTo10mV = (value: number) => {
    return value * 1000 / 10
}

//  获取版本号
export const parseVsersionText = (value: string) => {
    const mainVersion = parse16To10(value.substr(0, 2))
    const secondVersion = parse16To10(value.substr(2, 2))
    return `${mainVersion}.${secondVersion}`
}

//  获取时间
export const parseDateText = (value: string) => {
    const year = parse16To10(value.substr(0, 2))
    const month = parse16To10(value.substr(2, 2))
    const day = parse16To10(value.substr(4, 2))
    return `20${year}/${month}/${day}`
}

//  充电器信息转换
export const parseProtocolCodeToChargerInfo = (code: string) => {
    const info: IChargerInfo = {
        batteryVoltage: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(0, 2 * 2))),     //  电池电压
        chargeSwitchValue: parse16To10(code.substr(4, 2 * 1)),
        chargeSwitch: switchValueMap[parse16To10(code.substr(4, 2 * 1))],           //  充电开关 
        // 保留 1byte
        maximumVoltage: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(8, 2 * 2))),    //  最大电压
        maximumCurrent: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(12, 2 * 2))),   //  最大电流
        outputVoltage: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(16, 2 * 2))),    //  输出电压
        outputCurrent: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(20, 2 * 2))),    //  输出电流
        chargingMode: chargeModeMap[parse16To10(code.substr(24, 2 * 1))],                       //  充电模式
        chargerTemperature: parse16To10(code.substr(26, 2 * 1)),                                //  充电器温度
        cutoffCurrent: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(28, 2 * 2))),       //  截止电流
        fanLevel: fanLevelMap[parse16To10(code.substr(32, 2 * 1))],                         //  风扇挡位
        chargingCapacity: parse16To10(code.substr(34, 2 * 2)) / 10,                              //  充电容量 0.1Ah
        chargingTime: parse16To10(code.substr(38, 2 * 2)),                                  //  充电时间
        dateOfManufacture: parseDateText(code.substr(42, 2 * 3)),                                        //  出厂日期 yy/mm/dd
        firmwareVersion: parseVsersionText(code.substr(48, 2 * 2)),  //  固件版本
        chargingTiming: parse16To10(code.substr(52, 2 * 2)),                                  //  充电定时
        timingRemaining: parse16To10(code.substr(56, 2 * 2)),                                  //  定时剩余
    }
    // console.log({
    //     parseProtocolCodeToChargerInfo: code,
    //     info,
    // })
    return info
}

//  充电曲线
export const parseProtocolCodeToChargeCountData = (code: string) => {
  const spaceMin = parse16To10(code.substr(0, 2 * 1))
  const data: {
    value: number
    name: string
    time: string
  }[] = []
  for (let i = 0; i < 10; i++) {
    const time = moment().subtract((9 - i) * spaceMin, 'minute').format('hh:mm')
    data.push(...[
      {
        value: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(2 + 4 * i, 2 * 2))),
        name: '电压',
        time,
      },
      {
        value: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(42 + 4 * i, 2 * 2))),
        name: '电流',
        time,
      }
    ])
  }
//   console.log({
//     data,
//   })
  return data
}

//  测试数据
export const parseProtocolCodeToTestData = (code: string) => {
  // 过热保护
  const overheatingProtection = parse16To10(code.substr(16, 2 * 2)) || 0
  // 过压保护
  const overvoltageProtection = parse16To10(code.substr(20, 2 * 2)) || 0
  // 过流保护
  const overcurrentProtection = parse16To10(code.substr(24, 2 * 2)) || 0
  // 短路保护
  const shortCircuitProtection = parse16To10(code.substr(28, 2 * 2)) || 0
  // 反接保护
  const reversePolarityProtection = parse16To10(code.substr(32, 2 * 2)) || 0
  const faultCount = [
    overheatingProtection,
    overvoltageProtection,
    overcurrentProtection,
    shortCircuitProtection,
    reversePolarityProtection,
  ].reduce((sum, current) => sum + current, 0)
  const data: ITestData = {
    // batteryVoltage: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(0, 2 * 2))),     //  电池电压
    //  极限电压
    limitVoltage: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(0, 2 * 2))),
    //  极限电流
    limitCurrent: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(4, 2 * 2))),
    //  累计开机
    countOfStartup: parse16To10(code.substr(8, 2 * 2)),
    //  累计工作
    countOfWork: parse16To10(code.substr(12, 2 * 2)),
    faultCount,
    // 过热保护
    overheatingProtection,
    // 过压保护
    overvoltageProtection,
    // 过流保护
    overcurrentProtection,
    // 短路保护
    shortCircuitProtection,
    // 反接保护
    reversePolarityProtection,
  }
  return data
}

//  解构充电曲线设置数据
export const parseProtocolCodeToChargeLineSettingData = (code: string) => {
    const length = parse16To10(code.substr(0, 2))
    const settingDataList: IChargeLineSettingItem[] = []
    let voltage_min = parseVoltageOrCurrent10mVToV(parse16To10(code.substr(2, 4)))
    for (let i = 0; i < length; i++) {
        const startIndex = 6 + 8 * i
        const voltage_max = parseVoltageOrCurrent10mVToV(parse16To10(code.substr(startIndex + 4, 2 * 2)))
        settingDataList.push({
            voltage_min,
            eleCurrent: parseVoltageOrCurrent10mVToV(parse16To10(code.substr(startIndex, 2 * 2))),
            voltage_max,
        })
        voltage_min = voltage_max
    }
    // console.log({
    //     length,
    //     code,
    //     settingDataList,
    // }, 'parseProtocolCodeToChargeLineSettingData')
    return settingDataList
}

//  充电曲线设置转换
export const parseChargeLineSettingDataToProtocolCode = (settingDataList: IChargeLineSettingItem[]) => {
    let code = parse10To16(settingDataList.length)
    settingDataList.forEach((data, idx) => {
        const {
            voltage_min,
            voltage_max,
            eleCurrent,
        } = data
        if (idx === 0) {
            code = code + parse10To16(parseVoltageOrCurrentVTo10mV(voltage_min), 2)
        }
        code = code + parse10To16(parseVoltageOrCurrentVTo10mV(eleCurrent), 2)
        code = code + parse10To16(parseVoltageOrCurrentVTo10mV(voltage_max), 2)
    })
    console.log({
        code,
        settingDataList,
    })
    return code
}