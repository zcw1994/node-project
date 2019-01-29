
const db = require('../config/db');

const schema = new db.Schema({
  userName : {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nickName:{
    type: String,
    default: '普通用户'
  },
  isAdmin:{
    type: Number,
    default:0
  }
});
//基于schema使用db.model方法，第一个参数为集合名的单数，第二个参数即为schema方法，再将这个方法给暴露出去
module.exports = db.model('user',schema)