import {REQUEST_URL} from '../common/index'

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export const inArray = (arr: Record<string, any>, key: string, val: any) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === val) {
        return i;
      }
    }
    return -1;
  }
  
  // ArrayBuffer转16进度字符串示例
export const ab2hex = (buffer: number) => {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
}


export const parseApiUrl = (url: string): string => {
    const api = REQUEST_URL
    return `${api}${url}`
}

export const getUserInfo = () => {
    return wx.getStorageSync('userInfo')
}

export const setUserInfo = (info: object) => {
    return wx.setStorageSync('userInfo', info)
}

export const getUserToken = () => {
    return wx.getStorageSync('token')
}

export const setUserToken = (info: string) => {
    return wx.setStorageSync('token', info)
}

//  是否调试模式
export const getIsDebugModel: () => boolean = () => {
    // todo 默认值修改
    return wx.getStorageSync('IS_DEBUG_MODEL') || false
}
export const setIsDebugModel = (value: boolean) => {
    return wx.setStorageSync('IS_DEBUG_MODEL', value)
}


//  历史设备记录
export const getHistoryDeviceList: () => object[] = () => {
    return wx.getStorageSync('history_device_list') || []
}
export const setHistoryDeviceList = (value: object[]) => {
    return wx.setStorageSync('history_device_list', value)
}
