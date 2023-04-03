// 起始码
export const PROTOCOL_START_CODE = '5559'

//  指令码
export const DIRECT_CODE_READ = '01'  //  读
export const DIRECT_CODE_WRITE = '02' //  写
export const DIRECT_CODE_CLEAN = '03' //  擦除
export const DIRECT_CODE_LINE_READ = '04' //  曲线 读
export const DIRECT_CODE_LINE_WRITE = '05' //  曲线 写
export const DIRECT_CODE_LINE_CLEAN = '06' //  曲线 擦除
export const DIRECT_CODE_TEST_READ = '07' //  测试 读
export const DIRECT_CODE_TEST_WRITE = '08' //  测试 写
export const DIRECT_CODE_TEST_CLEAN = '09' //  测试 擦除
export const DIRECT_CODE_CHARGE_DATE_READ = '0A' //  测试 读取充电统计数据

// 充电模式
export const chargeModeMap: Record<string, string> = {
    '0': '启动模式',
    '1': '待机模式',
    '2': '预充模式',
    '3': '恒流模式',
    '4': '恒压模式',
    "5": "浮充模式",
    '6': '充满模式',
    '7': '故障模式',
    '8': '测试模式一',
    '9': '测试模式二',
    '10': '定制模式',
    '81': '过热保护',
    '82': '过压保护',
    '83': '过流保护',
    '84': '短路保护',
    '85': '反接保护',
    '86': '超时保护',
    '87': '低压保护',
    '88': '低温保护',
}

//  风扇档位
export const fanLevelMap: Record<string, string> = {
    '0': '初始化',
    //   '1':	'1档',
    //   '2':	'2档',
    //   '3':	'3档',
    //   '4':	'4档',
    //   '5':	'5档',
    '1': 'X1',
    '2': 'X2',
    '3': 'X3',
    '4': 'X4',
    '5': 'X5',
    '254': '风扇关闭',
    '255': '无风扇',
}

//  服务回传报文
export const MESSAGE_STATUS_CODE_SUCCESS = '01' //  成功
export const MESSAGE_STATUS_CODE_FAIL = '02' //  失败
export const MESSAGE_STATUS_CODE_WRITE_USELESS_ADDRESS = '03' //  写入地址无效
export const MESSAGE_STATUS_CODE_WRITE_USELESS_DATA = '04' //  写入数据无效

// 开关 (1表示开，2表示关，3表示常开, 4表示常关
export const switchValueMap: Record<number, string> = {
    1: '开',
    2: '关',
    3: '常开',
    4: '常关',
}
