require('babel-polyfill')
const expect = require('chai').expect
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/first */
import sinon from 'sinon'
import Wechat from '../../../server/wechat-lib'

describe('isValidAccessToken test', () => {
  let wechatClient = null
  beforeEach(() => {
    wechatClient = new Wechat({
      appID: 'fake',
      appSecret: 'fake',
      getAccessToken: () => 'fake token',
      saveAccessToken: (token) => {}
    })
  })
  afterEach(() => {
    // stub.restore()
  })
  it('should return true if token is valid', () => {
    const token = {
      token: '123456789',
      expiresIn: (new Date()).getTime()
    }
    sinon.stub(wechatClient, 'fetchAccessToken')
      .callsFake(async () => {
        console.log('------------------------stub runs')
        return true
      })

    const status = wechatClient.isValidAccessToken(token)

    expect(status).to.be.true
  })
})
