import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'

export default function (options, reply) {
  return async function wechatMiddleware(ctx, next) {
    const token = options.token
    const {
      signature,
      nonce,
      timestamp,
      echostr
    } = ctx.query
    console.log('token: ', token)
    console.log('timestamp: ', timestamp)
    console.log('nonce: ', nonce)

    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)

    console.log('Step into wechat middleware')
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
        return true
      } else {
        ctx.body = 'Failed'
        return false
      }
    } else {
      if (sha !== signature) {
        console.log('verification failed')
        ctx.body = 'Failed'
        return false
      }
    }

    console.log('a post request and pass verification')
    const data = await getRawBody(ctx.req, {
      length: ctx.length,
      limit: '1mb',
      encoding: ctx.charset
    })

    const content = await util.parseXML(data)
    const message = util.formatMessage(content.xml)

    ctx.weixin = message

    await reply.apply(ctx, [ctx, next])

    const replyBody = ctx.body
    const msg = ctx.weixin
    const xml = util.tpl(replyBody, msg)

    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
    console.log('wechat middleware finish')
    console.log(ctx.body)
    return true
  }
}
