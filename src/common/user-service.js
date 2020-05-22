import BaseService from './base-service'
import wepy from '@wepy/core'
export default class UserService extends BaseService {
  constructor() {
    super()
  }
  async login(shareId) {
    const userId = this.getUserId()
    let data = null
    if (userId) {
      data = {
        userId
      }
    } else {
      const sys = wx.getSystemInfoSync()
      data = {
        shareId,
        platform: sys.AppPlatform // 客户端平台
      }
      let res = await wepy.wx.login()
      console.log(21, 'login', res)
      if (res && res.code) {
        data.code = res.code
      }
    }
    const res = await this.request('/api/login', data, 'POST')
    console.log(27, res.code)
    if (res.code === 0) {
      const {
            user,
            token
        } = res.data
      wx.setStorageSync('user', user)
      wx.setStorageSync('school', user.school)
      wx.setStorageSync('token', token)
      return true
    }
    return false
  }
}