const config = {
    rabbitMQ: {
        url:"amqp://test:123123@localhost:5672/testHost",
    },
	redis:{
        host:'localhost',
        port: 6379,
        password: '',
        exSecond: 3
    },
    es: {
        host: 'http://localhost:9200', 
        index:'test',
        collectionType:'collections',
        visitorType:'visitors',
        memberType:'members',
        passenger:'passenger',
        order:'order',
        orderList:'orderList',
        message:'message',
        locationRecord:'locationRecord',
    },
    db:{
        database:'testdb',
        username:'root',
        password:'pwd123123',
        options: {
            host:'localhost',
            dialect: 'mysql',
            logging: console.log,
            benchmark: false,
            freezeTableName: true,
            operatorsAliases: false,
            define: {
                underscored: false,
                timestamps: true,
                paranoid: true
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        }
        
    }
}

module.exports = config;