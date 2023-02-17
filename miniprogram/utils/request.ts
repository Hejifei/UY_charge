import {
  parseApiUrl,
  getUserToken,
} from './util'

interface IQuquestQuery {
  url: string
  data: object
  method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined
  successCallBack: Function
  failCallBack?: Function
}

export const Request = ({
  url,
  data = {},
  method = 'POST',
  successCallBack,
  failCallBack,
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
        if (failCallBack) {
            failCallBack(res)
        }
        // Toast.fail(res.data.msg)
      }
    }
  })
}