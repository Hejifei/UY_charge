const app = getApp()

/**
 * 版本比较
 */
function versionCompare (ver1, ver2) { //版本比较
    // console.log("ver1" + ver1 + 'ver2' + ver2);
    var version1pre = parseFloat(ver1)
    var version2pre = parseFloat(ver2)
    var version1next = parseInt(ver1.replace(version1pre + ".", ""))
    var version2next = parseInt(ver2.replace(version2pre + ".", ""))
    if (version1pre > version2pre)
        return true
    else if (version1pre < version2pre)
        return false
    else {
        if (version1next > version2next)
            return true
        else
            return false
    }
}


/**
 * 微信版本检测
 * Android从微信 6.5.7 开始支持，iOS从微信 6.5.6 开始支持
 */
export const checkWechatVersion = () => {
    if (app.getPlatform() == 'android' && versionCompare('6.5.7', app.getVersion())) {
        wx.showModal({
            title: '提示',
            content: '当前微信版本过低，请更新至最新版本体验',
            showCancel: false
        })
    }else if (app.getPlatform() == 'ios' && versionCompare('6.5.6', app.getVersion())) {
        wx.showModal({
            title: '提示',
            content: '当前微信版本过低，请更新至最新版本体验',
            showCancel: false
        })
    }
}
