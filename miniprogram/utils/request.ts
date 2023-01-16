import {
  parseApiUrl,
  getUserToken,
} from './util'
import { ERROR_CODE_NEED_LOGIN } from '../common/index'
import Toast from '@vant/weapp/toast/toast';

interface IQuquestQuery {
  url: string
  data: object
  method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined
  successCallBack: Function
}

export const Request = ({
  url,
  data = {},
  method = 'POST',
  successCallBack,
}: IQuquestQuery) => {
  wx.request({
    url: parseApiUrl(url),
    data: data,
    method,
    header: {
      'content-type': 'application/json', // 默认值
      'Authorization': getUserToken()
    },
    success(res: any) {
      // console.log({
      //   requestSuccess: res,
      //   code: res.data.code,
      //   if: res.data.code === 200
      // })
      // const data = res.data
      // if (data.code === 0) {
      //   wx.showToast({
      //     title: res.msg,
      //     icon: "none",
      //     duration: 3000
      //   });
      //   // Toast.fail(data.msg)
      //   return
      // }
      // if (data.code === ERROR_CODE_NEED_LOGIN) {
      //   Toast.fail(data.msg)
      //   setTimeout(() => {
      //     // wx.navigateTo({
      //     //   url: '/pages/login/login',
      //     // })
      //   }, 1000)
      //   return
      // }
      if (res.data.code === 200) {
        successCallBack(res.data)
      } else {
        console.log({
          err: res.data.message
        })
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 3000
        });
        Toast.fail(res.data.msg)
      }
    }
  })
}