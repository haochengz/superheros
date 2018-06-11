import mongoose from 'mongoose'
import config from '../config'
import fs from 'fs'
import { resolve } from 'path'

const modelsDir = resolve(__dirname, '../db/schema')

fs.readdirSync(modelsDir)
  .filter(file => ~file.search(/^[^.].*js$/))
  .forEach(file => require(resolve(modelsDir, file)))

export const db = app => {
  mongoose.set('debug', true)

  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    console.error('Lost connection from db, trying to re-conntect')
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', err => {
    console.error('Database connect fail')
    console.error(err)
  })

  mongoose.connection.on('open', async () => {
    console.log('Database connected ', config.db)
  })
}
