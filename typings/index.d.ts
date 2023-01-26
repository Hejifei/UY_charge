/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    isDebugModel?: boolean
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface IProtocolInfo {
    chargerInfo?: IChargerInfo
}

interface IChargerInfo {
    batteryVoltage: number
    chargeSwitchValue: number
    chargeSwitch: string
    maximumVoltage: number
    maximumCurrent: number
    outputVoltage: number
    outputCurrent: number
    chargingMode: string
    chargerTemperature: number
    cutoffCurrent: number
    fanLevel: string
    chargingCapacity: number
    chargingTime: number
    dateOfManufacture: string
    firmwareVersion: string
    chargingTiming: number
    timingRemaining: number
}

interface ITestData {
  limitVoltage: number
  limitCurrent: number
  countOfStartup: number
  countOfWork: number
  faultCount: number
  overheatingProtection: number
  overvoltageProtection: number
  overcurrentProtection: number
  shortCircuitProtection: number
  reversePolarityProtection: number
}
