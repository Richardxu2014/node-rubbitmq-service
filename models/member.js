//定义 Visitor 表
'use strict'
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('members',{ // 表里的具体字段
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        name: DataTypes.STRING ,
        age: DataTypes.INTEGER ,  
        last_visit_time: {
            type: DataTypes.DATE ,
            defaults: new Date()
        },
    },{
        freezeTableName: true , // true-数据库中的表明与程序中的保持一致; false-数据库中的表名会以复数的形式命名
        timestamps: false,   // 是否添加 默认的 createdAt updatedAt deletedAt 字段
    });
}
