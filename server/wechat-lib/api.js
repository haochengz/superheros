
const base = 'https://api.weixin.qq.com/cgi-bin/'

export default {
  token: {
    getToken: base + 'token?grant_type=client_credential'
  },
  ticket: {
    getTicket: base + 'ticket/getticket?'
  },
  temporary: {
    upload: base + 'media/upload?',
    get: base + 'media/get?'
  },
  permanent: {
    upload: base + 'material/add_material?',
    uploadNewsPic: base + 'media/uploadimg?',
    uploadNews: base + 'material/add_news?',
    get: base + 'material/get_material?',
    delete: base + 'material/del_material?',
    update: base + 'material/update_news?',
    count: base + 'material/get_materialcount?',
    batch: base + 'material/batchget_material?'
  }
}
