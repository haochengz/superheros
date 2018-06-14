
import request from 'request-promise'

const getTokenURLPrefix = 'https://api.weixin.qq.com/cgi-bin/'
const getTokenAPI = {
  url: getTokenURLPrefix + 'token?grant_type=client_credential'
  /*
  https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
  fetch access token at this url
  */
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
    const url = getTokenAPI.url + '&appid=' + this.appID + '&secret=' + this.appSecret
    const data = await this.request({url: url})
    console.log('setting a new expire time for the token')
    const expiresIn = (new Date().getTime()) + (7200 * 1000)
    console.log(expiresIn)
    // expires two hours later
    data.expiresIn = expiresIn
    return data
  }

  isValidAccessToken(token) {
    console.log('checking access token')
    if (
      !token ||
      !token.token ||
      !token.expiresIn
    ) {
      return false
    }
    console.log('NOW: ' + (new Date().getTime()))
    console.log('EXP: ' + token.expiresIn)
    console.log('Hours to expire: ' + ((new Date().getTime()) - token.expiresIn) / (1000 * 60 * 60))
    return token.expiresIn < (new Date().getTime())
  }
}
