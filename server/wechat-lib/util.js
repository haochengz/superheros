import template from './template'
import xml2js from 'xml2js'

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
      let item = content[keys[i]]
      let key = keys[i]

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
  let info = {}
  let type = 'text'

  if (Array.isArray(content)) {
    type = 'news'
  } else if (!content) {
    content = 'Empty news'
  }

  if (content && content.type) {
    type = content.type
  }
  info = Object.assign({}, {
    content: content,
    createTime: new Date().getTime(),
    type: type,
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName
  })

  return template(info)
}

export {
  parseXML,
  formatMessage,
  tpl
}
