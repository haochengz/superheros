
import Router from 'koa-router'
import wechatMiddleware from '../wechat-lib/middleware'
import reply from '../wechat-lib/reply'
import config from '../config'
import { signature } from '../controllers/signature'

export const router = app => {
  const router = new Router()
  router.all('/wechat-hear', wechatMiddleware(config.wechat, reply))
  router.get('/signature', signature)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
