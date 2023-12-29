import mongoose from 'mongoose'

const MONGO_HOSTNAME = 'localhost'
const MONGO_PORT = '27017'
const MONGO_DB = 'testAuth'

const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

export const db = mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => console.log('Есть соединение...'),
    (err) => console.log('Ошибка соединения: ', err)
  )
