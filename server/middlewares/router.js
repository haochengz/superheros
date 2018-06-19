
import Router from 'koa-router'
import wechatMiddleware from '../wechat-lib/middleware'
import reply from '../wechat-lib/reply'
import config from '../config'
import { resolve } from 'path'

export const router = app => {
  const router = new Router()
  router.all('/wechat-hear', wechatMiddleware(config.wechat, reply))

  router.get('/upload', (ctx, next) => {
    let wechat = require('../wechat')
    let client = wechat.getWechat()
    let type = 'image'
    let file = resolve(__dirname, '../../kitten.jpg')
    let perm = JSON.stringify({
      description: {
        title: 'kitten',
        introduction: 'a cute kitten picture'
      }
    })

    client.handle('uploadMaterial', type, file, perm)
  })
  app
    .use(router.routes())
    .use(router.allowedMethods())
}
