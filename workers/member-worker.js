const amqp = require('amqplib/callback_api');
const log4js = require('log4js');
const redis = require('redis');
const config = require('../config');

const Member = require('../controllers/member');

 //初始化 redis 对象
const redisClient = redis.createClient({
   host: config.redis.host,
   port: config.redis.port,
//    password: config.redis.password,
});

 //初始配置 log4js 对象
log4js.configure({
	appenders: {
		console: { type: 'console' },
		logfile: { 
			type: 'file', 
			filename: 'logs/member-worker.log',
			maxLogSize: 1024*1000,
			backups: 7, 
		},
   },
   categories: {
	   default: { appenders: ['logfile', 'console' ], level: 'info' }
   }
})

const logger = log4js.getLogger('logfile');  
// console.log = logger.info.bind(logger); 
// db.sequelize.log = logger.info.bind(logger); 


let isNull = (data)=>{ (data === "" || data === undefined || data === null) ? true : false; }

/*
	监听访客进店队列， 处理进店逻辑
	exchange : 'member' 
	routingKey : 'add'
*/ 
//  queue = entry
amqp.connect(config.rabbitMQ.url, {automatically_recover: false}, (err1, conn) => {
  conn.createChannel((err2, ch) => {

    const ex = 'member';  
	const routingKey = 'add';  
	//durable: true 开启消息持久化 当一个RabbitMQ服务退出或者中断的情况下，任务队列里面的消息不会丢失
    ch.assertExchange(ex, 'direct', {durable: true});

    ch.assertQueue('', {exclusive: true}, function(err, q) {

		ch.bindQueue(q.queue, ex, routingKey);
		logger.info('开始监听 exchange: %s ;  queue: %s . To exit press CTRL+C', ex, routingKey);

      	ch.consume(q.queue, function(msg) {
			logger.info("queue:%s 收到消息 :'%s'", msg.fields.routingKey, msg.content.toString());
        	const memberInfo = JSON.parse(msg.content.toString());

			// 验证参数是否齐全;
			if(isNull(memberInfo.name) || isNull(memberInfo.age)){
				logger.info("缺少参数！");
				return ch.ack(msg);  // 消费完成确认	
			}
			logger.info("==========开始消费消息=========");

			const redisKey = memberInfo.name + '_' + memberInfo.age;

			redisClient.get(redisKey, (err, isExist) => {
				if(err){
					logger.warn('获取redis key='+redisKey+'失败:'+err);
				}else{
					if(!isExist){ //   不存在： 
						// 1,redis 当前在店访客队列 增加记录;
						redisClient.setex(redisKey, config.redis.exSecond, 'true', (err, rs) => {
							if(err){
								logger.warn(" 添加到 redis 访客队列失败! key: %s, err: %s ", redisKey, err);
							}else{
								logger.info("*** 添加到 redis 访客队列成功! key: %s, exSecond: %s", redisKey, config.redis.exSecond);
							}
						});

						const member = new Member(memberInfo, logger);
						member.add();
					}
				}
			});
	  }, 
	  // noAck: false-开启消息确认，如果没有向RabbitMQ发送消息确认这个ack的标识，这个时候RabbitMQ会将它从新加入到队列中 
	  {noAck: false});
    });



  });
});