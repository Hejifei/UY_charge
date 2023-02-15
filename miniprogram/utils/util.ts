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

export const getUserInfo: () => {
    city: string
    country: string
    gender: number
    headimgurl: string
    language: string
    nickname: string
    openid: string
    province: string
    token: string
    uid: number
    group_id: number
} = () => {
  return wx.getStorageSync('userInfo')
}

export const setUserInfo = (info: {
    city: string
    country: string
    gender: number
    headimgurl: string
    language: string
    nickname: string
    openid: string
    province: string
    token: string
    uid: number
    group_id: number
}) => {
  return wx.setStorageSync('userInfo', info)
}

export const getUserToken = () => {
  return wx.getStorageSync('token')
}

export const setUserToken = (token: string) => {
  return wx.setStorageSync('token', token)
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

//  uint8Array 转 string
export const  uint8ArrayToString = (fileData: number[]) => {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString
}
// var arr = [48,48,48,48]
// uint8ArrayToString(arr)  //"0000"

//  string 装 uint8Array 
export const stringToUint8Array = (str: string) => {
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
 
  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array
}
// stringToUint8Array('12313132') // Uint8Array(8)   [49, 50, 51, 49, 51, 49, 51, 50]

//  string 转 ArrayBuffer
export const stringToArrayBuffer = (str: string) => {
  var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
// stringToArrayBuffer('00000')
// 输出：ArrayBuffer(10) {}

//  arrayBuffer 转 string
export const arrayBufferToString = (buf: ArrayBuffer) => {
  //  @ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(buf)).replaceAll('\x00', '');
}


//   int 转 byte []
export const intTobytes = (n: number) => {
  var bytes = [];
  for (var i = 0; i < 2; i++) {
    bytes[i] = n >> (8 - i * 8);
  }
  return bytes;
}
// intTobytes(10) // [0, 10]

export const stringToHex = (str: string) => {
  var val="";
  for(var i = 0; i < str.length; i++){
    if(val == "")
      val = str.charCodeAt(i).toString(16);
    else {
      val += "," + str.charCodeAt(i).toString(16);
    }
  }
  return val;
}

export const hexToString = (str: string) => {

  var val="";
  
  let arr = str.split(",");
  
  for(var i = 0; i < arr.length; i++){
  
    // val += arr[i].fromCharCode(i);
    // val += String.fromCharCode(arr[i]);
    var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
    var charValue = String.fromCharCode(tmp);
    val += charValue
  }
  
  return val;
  
}


//  tools

/*
  16进制字符串转整形数组
*/
export const str2Bytes = (str) => {
    var len = str.length;
    if (len % 2 != 0) {
      return null;
    }
    var hexA = new Array();
    for (var i = 0; i < len; i += 2) {
      var s = str.substr(i, 2);
      var v = parseInt(s, 16);
      hexA.push(v);
    }
  
    return hexA;
  }
  
  /*
    整形数组转buffer
  */
export const array2Buffer = (arr) => {
    let buffer = new ArrayBuffer(arr.length)
    let dataView = new DataView(buffer)
    for (let i = 0; i < arr.length; i++) {
      dataView.setUint8(i, arr[i])
    }
  
    return buffer
  }
  
  /*
    16进制字符串转数组
  */
export const string2Buffer = (str: string) => {
    let arr = str2Bytes(str);
    return array2Buffer(arr)
  }
  
  /*
    ArrayBuffer转十六进制字符串
  */
  export const uint8Array2Str = (buffer) => {
    var str = "";
    let dataView = new DataView(buffer)
    for (let i = 0; i < dataView.byteLength; i++) {
      var tmp = dataView.getUint8(i).toString(16)
      if (tmp.length == 1) {
        tmp = "0" + tmp
      }
      str += tmp
    }
    return str;
  }
  

