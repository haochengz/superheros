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
    console.log('looking for access token from db')
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

    if (token) {
      if ('accessToken' in data) {
        token.token = data.accessToken
      } else if ('access_token' in data) {
        token.token = data.access_token
      } else {
        throw Error('Cannot find access token in response')
      }
      token.expiresIn = data.expiresIn
    } else {
      token = new Token({
        name: 'accessToken',
        token: data.accessToken,
        expiresIn: data.expiresIn
      })
    }
    await token.save()
    return data
  },
  async updateAccessToken() {}
}

const Token = mongoose.model('Token', TokenSchema)
