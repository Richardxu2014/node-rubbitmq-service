//这里采用sequelize这个框架 这个框架就是数据库的orm框架，意思就是通过定义对象的形式，框架映射成底层原生sql语言来执行
'use strict'

const config = require('./config');
const Sequelize = require('sequelize');//引入orm

const db = {
    sequelize: new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options)
}

// 引入model 数据 表

db.member = db.sequelize.import('models/member.js');  

module.exports = db; 