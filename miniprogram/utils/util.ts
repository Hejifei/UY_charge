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

export const getUserToken = () => {
    return wx.getStorageSync('token')
}

export const setUserToken = (info: string) => {
    return wx.setStorageSync('token', info)
}

export const parseApiUrl = (url: string): string => {
    const api = REQUEST_URL
    return `${api}${url}`
}
