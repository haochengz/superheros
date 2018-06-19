import mongoose from 'mongoose'
import config from '../config'
import Wechat from '../wechat-lib'

const Token = mongoose.model('Token')

const wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    getAccessToken: async () => Token.getAccessToken(),
    saveAccessToken: async (token) => Token.saveAccessToken(token),
    getTicket: async () => Token.getTicket(),
    saveTicket: async (ticket) => Token.saveTicket()
  }
}

export const getWechat = () => {
  console.log(wechatConfig)
  const wechatClient = new Wechat(wechatConfig.wechat)
  return wechatClient
}
