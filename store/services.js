
import axios from 'axios'

const baseUrl = ''

class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/signature?url=${url}`)
  }
}

export default new Services()
