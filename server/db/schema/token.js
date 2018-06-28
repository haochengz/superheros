const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
  name: String,
  token: String,
  expiresIn: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

TokenSchema.statics = {
  async getAccessToken() {
    const token = await this.findOne({
      name: 'accessToken'
    }).exec()
    if (token && token.token) {
      token.accessToken = token.token
    }
    return token
  },
  async saveAccessToken(data) {
    let token = await this.findOne({
      name: 'accessToken'
    }).exec()

    if (!token) {
      token = new Token()
      token.name = 'accessToken'
    }
    token.token = data.accessToken || data.access_token
    token.expiresIn = data.expiresIn
    await token.save()
    return data
  },
  async getTicket() {
    const ticket = await this.findOne({
      name: 'ticket'
    }).exec()
    if (ticket && ticket.token) {
      ticket.accessToken = ticket.token
    }
    return ticket
  },
  async saveTicket(data) {
    let ticket = await this.findOne({
      name: 'ticket'
    }).exec()

    if (!ticket) {
      ticket = new Token()
      ticket.name = 'ticket'
    }
    ticket.token = data.ticket
    ticket.expiresIn = data.expiresIn
    await ticket.save()
    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)
