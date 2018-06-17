
require('babel-polyfill')
let expect = require('chai').expect
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const mongoose = require('mongoose')
require('../../../../server/middlewares/db')

describe('token schema test', () => {
  it('should pass this canary test', () => {
    expect(true).to.be.true
  })
  it('should retrieve the token model by mongoose', () => {
    const tokenModel = mongoose.model('Token')

    expect(tokenModel).to.be.ok
  })
})
