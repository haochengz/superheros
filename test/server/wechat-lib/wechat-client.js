/* eslint-disable */
const expect = require('chai').expect
const wechatClient = require('../../../server/wechat-lib')

describe('wechat client module test', () => {
  it('should pass', () => {
    expect(wechatClient).to.be.ok
  })
})
