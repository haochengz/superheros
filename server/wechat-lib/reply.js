
// const tip = `中文, English, 链接: <a href="http://www.google.com">点这里</a>`

export default async (ctx, next) => {
  const message = ctx.weixin
  console.log(message)

  if (message.MsgType === 'text') {
    ctx.body = message.Content
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      type: 'video',
      title: message.ThumbMediaId,
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [
      {
        title: message.Title,
        description: message.Description,
        picurl: 'https://mmbiz.qpic.cn/mmbiz_jpg/dzfa8parrg5qtatcu5hrixscubbbhyqcggm0crib51p74gsiar4rstzw1f43hhwnedzvspwp1jkztia8bsnbrpqzw/0',
        url: message.Url
      }, {
        title: message.Title,
        description: message.Description,
        picurl: 'https://mmbiz.qpic.cn/mmbiz_jpg/dzfa8parrg5qtatcu5hrixscubbbhyqcggm0crib51p74gsiar4rstzw1f43hhwnedzvspwp1jkztia8bsnbrpqzw/0',
        url: message.Url
      }
    ]
  }
}
