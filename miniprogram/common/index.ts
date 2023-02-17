// export const REQUEST_URL = 'http://bluetooth.dev.zhangxinkeji.com'
export const REQUEST_URL = 'https://bluetooth.dev.zhangxinkeji.com'

//  serviceId
export const SERVICE_ID_VALUE = 'serviceId'
//  characteristicId
export const CHARACTERISTIC_ID_VALUE = 'characteristicId'


export const ERROR_CODE_NEED_LOGIN = 401  //  错误码,需要重新登录

export const tabbar_info_view_value = "info_view"   //  信息展示
export const tabbar_param_set_value = "param_set"   //  参数设置
export const tabbar_charge_line_value = "charge_line"   //  充电曲线
export const tabbar_setting_center_value = "settring_center"   //  设置中心

export const tabbar_data_list: {
    name: string
    value: string
    img_src: string
    url: string
    router: string
}[] = [
    {
        name: '信息展示',
        value: tabbar_info_view_value,
        img_src: '../assets/imgs/info_view.png',
        url: 'pages/infoView/infoView',
        router: '../infoView/infoView',
    },
    {
        name: '参数设置',
        value: tabbar_param_set_value,
        img_src: '../assets/imgs/param_setting.png',
        url: 'pages/param_setting/param_setting',
        router: '../param_setting/param_setting',
    },
    {
        name: '充电曲线',
        value: tabbar_charge_line_value,
        img_src: '../assets/imgs/charge_line.png',
        url: 'pages/charge_line/charge_line',
        router: '../charge_line/charge_line',
    },
    {
        name: '设置中心',
        value: tabbar_setting_center_value,
        img_src: '../assets/imgs/setting_center.png',
        url: 'pages/setting_center/setting_center',
        router: '../setting_center/setting_center',
    },
]

export const LOCAL_STORAGE_KEY_HISTORY_DEVICES = 'history_device_list'

// 服务回传报文
export const RESPONSE_MAP = {
    '01': '成功',
    '02': '失败',
    '03': '写入地址无效',
    '04': '写入数据无效',
}
