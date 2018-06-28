
import request from 'request-promise'
import api from './api'
import fs from 'fs'
import * as _ from 'lodash'
import { signature } from './util'

export default class Wechat {
  constructor(opts) {
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.getTicket = opts.getTicket
    this.saveTicket = opts.saveTicket

    this.fetchAccessToken()
    this.fetchTicket()
  }

  async request(opts) {
    opts = Object.assign({}, opts, {json: true})
    try {
      const resp = await request(opts)
      return resp
    } catch (error) {
      console.error(error)
    }
  }

  async fetchAccessToken() {
    let token = await this.getAccessToken()
    if (!token) {
      console.log('token fetching is null')
    }
    if (!this.isValidToken(token)) {
      token = await this.updateAccessToken()
      await this.saveAccessToken(token)
    }
    return token
  }

  async updateAccessToken() {
    const url = api.token.getToken + '&appid=' + this.appID + '&secret=' + this.appSecret
    const data = await this.request({url: url})
    const expires = parseInt(data.expires_in)
    const now = (new Date()).getTime()
    const expiresIn = now + (expires - 1200)
    data.expiresIn = expiresIn
    return data
  }

  async fetchTicket() {
    let ticket = await this.getTicket()
    if (!this.isValidToken(ticket)) {
      console.log('token is bad')
      ticket = await this.updateTicket()
      console.log('WHEN feching ticket')
      console.log(ticket)
      await this.saveTicket(ticket)
    }
    return ticket
  }

  async updateTicket() {
    const token = this.fetchAccessToken()
    const url = api.ticket.getTicket + '&access_token=' + token.token + '&type=jsapi'
    const data = await this.request({url: url})
    const now = (new Date()).getTime()
    const expiresIn = now + (6200 * 1000)
    data.expiresIn = expiresIn
    return data
  }

  isValidToken(token) {
    if (!token) {
      console.log('Passing a null value to isValidToken')
      console.log(token)
      return false
    } else if (!token.token) {
      console.log('Passing a value to isValidToken without token prop')
    } else if (!token.expiresIn) {
      console.log('Passing a value to isValidToken without expiresIn prop')
    }
    return (token.expiresIn - (new Date().getTime())) > 0
  }

  async handle(operation, ...args) {
    const token = await this.fetchAccessToken()
    const options = this[operation](token.token, ...args)
    const data = await this.request(options)
    console.log('--- THE DATA ---')
    console.log(data)
    return data
  }

  uploadMaterial(token, type, material, permanent) {
    let form = {}
    let url = api.temporary.upload

    if (permanent) {
      url = api.permanent.upload
      _.extend(form, permanent)
    }
    if (type === 'pic') {
      url = api.permanent.uploadNewsPic
    } else if (type === 'news') {
      url = api.permanent.uploadNews
      form = material
    } else {
      form.media = fs.createReadStream(material)
    }

    let uploadUrl = url + 'access_token=' + token
    if (!permanent) {
      uploadUrl += '&type=' + type
    } else if (type !== 'news') {
      form.access_token = token
    }

    const options = {
      method: 'POST',
      url: uploadUrl,
      json: true
    }

    if (type === 'news') {
      options.body = form
    } else {
      options.formData = form
    }

    return options
  }

  fetchMaterial(token, mediaId, type, permanent) {
    let form = {}
    let url = api.temporary.get
    let options = {
      method: 'POST'
    }

    if (permanent) {
      url = api.permanent.get
      form.media_id = mediaId
      form.access_token = token
      options.body = form
    }
    url += 'access_token=' + token
    options.url = url
    if (type === 'video') {
      url.replace('https://', 'http://')
    }
    if (!permanent) {
      url += '&media_id=' + mediaId
    }

    return options
  }

  deleteMaterial(token, mediaId) {
    const form = {
      media_id: mediaId
    }
    const url = api.permanent.delete + 'access_token=' + token + '&media_id=' + mediaId

    return {
      method: 'POST',
      url: url,
      body: form
    }
  }

  updateMaterial(token, mediaId, news) {
    const form = {
      media_id: mediaId
    }
    _.extend(form, news)
    const url = api.permanent.delete + 'access_token=' + token + '&media_id=' + mediaId

    return {
      method: 'POST',
      url: url,
      body: form
    }
  }

  countMaterial(token) {
    const url = api.permanent.count + 'access_token=' + token
    return {
      method: 'POST',
      url: url
    }
  }

  batchMaterial(token, options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 20

    const url = api.permanent.batch + 'access_token=' + token
    return {
      method: 'POST',
      url: url,
      body: options
    }
  }

  sign(ticket, url) {
    return signature(ticket, url)
  }
}
