
import request from 'request-promise'

const urlPrefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  url: urlPrefix + 'token?grant_type=client_credential'
  // https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
}

export default class Wechat {
  constructor(opts) {
    this.opts = Object.assign({}, opts)

    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    console.log('Start a webchat client')

    this.fetchAccessToken()
  }

  async request(opts) {
    opts = Object.assign({}, opts, {json: true})
    try {
      const resp = await request(opts)
      console.log('requesting for a new access token, and receives:')
      console.log(resp)
      return resp
    } catch (error) {
      console.error(error)
    }
  }

  async fetchAccessToken() {
    console.log('fetching access token from wechat server')
    let token = await this.getAccessToken()
    console.log('token is: ', token)
    if (!this.isValidAccessToken(token)) {
      console.log('token is not valid: ', token)
      token = await this.updateAccessToken()
    }
    await this.saveAccessToken(token)
    console.log('saving the token: ', token)

    return token
  }

  async updateAccessToken() {
    console.log('updating access token from wechat server')
    const url = api.url + '&appid=' + this.appID + '&secret=' + this.appSecret
    const data = await this.request({url: url})
    const expiresIn = (new Date().getTime()) + (7200 * 1000)
    // expires two hours later
    data.expiresIn = expiresIn
    return data
  }

  isValidAccessToken(token) {
    console.log('checking access token')
    if (
      !token ||
      !token.saveAccessToken ||
      !token.expiresIn ||
      token.expiresIn >= (new Date().getTime())
    ) {
      console.log('access token is not valid')
      return false
    }
    return true
  }
}
