
import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'

export const router = app => {
  const router = new Router()
  router.get('/wechat-hear', (ctx, next) => {
    require('../wechat')
    console.log('Received a get request from wechat.')
    const token = config.wechat.token
    const {
      signature,
      nonce,
      timestamp,
      echostr
    } = ctx.query

    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)

    console.log('Wechat authorization: ' + (sha === signature))
    if (sha === signature) {
      ctx.body = echostr
    } else {
      ctx.body = 'failed'
    }
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
