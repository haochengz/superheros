import template from './template'
import xml2js from 'xml2js'
import sha1 from 'sha1'

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (error, content) => {
      if (error) {
        reject(error)
      } else {
        resolve(content)
      }
    })
  })
}

function formatMessage(content) {
  let message = {}

  if (typeof content === 'object') {
    const keys = Object.keys(content)

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let item = content[key]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]

        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []
        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return message
}

function tpl(content, message) {
  let type = 'text'

  if (Array.isArray(content)) {
    type = 'news'
  } else if (!content) {
    content = 'Empty news'
  }

  if (content && content.type) {
    type = content.type
  }
  let info = Object.assign({}, {
    content: content,
    createTime: new Date().getTime(),
    type: type,
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName
  })

  return template(info)
}

function createNonce() {
  return Math.random().toString(36).substr(2, 15)
}

function createTimestamp() {
  return parseInt((new Date()).getTime() / 1000, 0) + ''
}

function raw(arg) {
  let keys = Object.keys(arg)
  keys = keys.sort()

  let newArg = {}
  keys.forEach(key => {
    newArg[key.toLowerCase()] = arg[key]
  })
  let str = ''
  for (let k in newArg) {
    str += '&' + k + '=' + newArg[k]
  }

  return str.substr(1)
}

function signIt(nonce, ticket, timestamp, url) {
  const ret = {
    jsapi_ticket: ticket,
    nonceStr: nonce,
    timestamp: timestamp,
    url: url
  }
  const str = raw(ret)
  const sha = sha1(str)

  return sha
}

function signature(ticket, url) {
  const nonce = createNonce()
  const timestamp = createTimestamp()
  const signature = signIt(nonce, ticket, timestamp, url)

  return {
    nonceStr: nonce,
    timestamp: timestamp,
    signature: signature
  }
}

export {
  parseXML,
  formatMessage,
  tpl,
  signature
}
