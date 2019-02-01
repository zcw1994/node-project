
//定义数据库字段类型的模块

const db = require('../config/db');

const schema = new db.Schema({
  imgUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  actors: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  grade:{
    type: String,
  }
});

module.exports = db.model('films', schema);