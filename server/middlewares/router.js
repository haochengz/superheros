
import Router from 'koa-router'
import wechatMiddleware from '../wechat-lib/middleware'
import reply from '../wechat-lib/reply'
import config from '../config'

export const router = app => {
  const router = new Router()
  router.all('/wechat-hear', wechatMiddleware(config.wechat, reply))

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
