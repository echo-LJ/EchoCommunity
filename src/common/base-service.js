import wepy from '@wepy/core'
export const baseUrl = 'https://www.baidu.com'
let _height = 0
let _statusBarHeight = 0
let _headHeight = 0
export default class BaseService {
  constructor() {
    try {
      if (_height === 0) {
        let res = wx.getSystemInfoSync()
        const { screenHeight, pixelRatio, statusBarHeight } = res
        _height = screenHeight * pixelRatio
        _statusBarHeight = statusBarHeight
        res = wx.getMenuButtonBoundingClientRect()
        if (res) {
          const { bottom, top } = res
          _headHeight = bottom + top - statusBarHeight
        }
      }
    } catch (error) {
      console.log(error)

    }
  }

  getUser() {
    return wx.getStorageSync('user')
  }
  getUserId() {
    const user = this.getUser()
    if (user) {
      return user.userId
    }
    return null
  }
  getUserType() {
    const user = this.getUser()
    if (user) {
      return user.userType
    }
    return null
  }
  async request(url, data, method) {
    const token = wx.getStorageSync('token') || ''
    wx.showNavigationBarLoading()
    return await wepy.wx.request({
      url: baseUrl + url,
      data,
      header: {
        token,
        'Content-Type': 'application/json',
        'from-wx': '16f9d417-03c3-45cc-90c7-d58e4e447ae6'
      },
      method
    }).then((res) => {
      console.log(res)
      console.log(url)
      wx.hideNavigationBarLoading()
      return res.data
    }).catch(() => {
      console.log(url)
      wx.hideNavigationBarLoading()
      return {
        code: -1
      }
    })
  }
} 