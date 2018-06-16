import ejs from 'ejs'

const tpl = `
<xml>
  <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
  <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
  <CreateTime><%= createTime %></CreateTime>
  <MsgType><![CDATA[<%= type %>]]></MsgType>
  <% if (type === 'text') { %>
    <Content><![CDATA[<%- content %>]]></Content>
  <% } else if (type === 'image') { %>
    <Image>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Image>
  <% } else if (type === 'voice') { %>
    <Voice>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Voice>
  <% } else if (type === 'video') { %>
    <Video>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
      <Title><![CDATA[<%= content.title %>]]></Title>
      <Description><![CDATA[<%= content.description %>]]></Description>
    </Video>
  <% } else if (type === 'music') { %>
    <Music>
      <Title><![CDATA[<%= content.title %>]]></Title>
      <Description><![CDATA[<%= content.description %>]]></Description>
      <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
      <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[<%= content.mediaId %>]]></ThumbMediaId>
    </Music>
  <% } else if (type === 'news') { %>
    <ArticleCount><%= content.length %></ArticleCount>
    <Articles>
      <% content.forEach(function(item) { %>
        <item>
          <Title><![CDATA[<%= item.title %>]]></Title>
          <Description><![CDATA[<%= item.description %>]]></Description>
          <PicUrl><![CDATA[<%= item.picurl %>]]></PicUrl>
          <Url><![CDATA[<%= item.url %>]]></Url>
        </item>
      <% }) %>
    </Articles>
  <% } %>
</xml>
`
const compiled = ejs.compile(tpl)

export default compiled
