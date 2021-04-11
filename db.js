import mongoose from 'mongoose';

const MONGO_USERNAME = 'izherbin';
const MONGO_PASSWORD = '22uF5EcHm9';
const MONGO_HOSTNAME = '45.80.71.95';
const MONGO_PORT = '27017';
const MONGO_DB = 'Superiority';

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

export const db = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => console.log('Есть соединение...'),
  (err) => console.log('Ошибка соединения: ', err),
);
