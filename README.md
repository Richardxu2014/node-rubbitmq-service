#  基于 node 的RabbitMQ 消息处理为微服务

## 基于 node 的简单 接收和发送 RabbitMQ消息
Sequelize：  数据库ORM框架 [使用手册](http://docs.sequelizejs.com/manual/installation/getting-started.html)
amqplib： 


## 目录结构

``` shell
.
├── config.js      # 配置文件
├── controllers    # 业务逻辑代码
│   └── member.js
├── db.js          # 数据库配置
├── logs           # 日志文件夹
├── models         # 模型文件夹（数据库表对应模型）
│   └── member.js
├── package.json
├── package-lock.json
├── README.md
└── workers        # 具体的 worker文件， 每个 worker 独立运行
    └── member-worker.js


```

## worker 接收消息示例
``` javascript
    const queue = 'test1';
    // persistent: true 让发送的消息也是持久化的
    ch.assertQueue(queue, {durable: true}); //durable: true 开启消息持久化 当一个RabbitMQ服务退出或者中断的情况下，任务队列里面的消息不会丢失
    ch.prefetch(1);  // 指定某个worker同时最多只会派发到1个任务，一旦任务处理完成发送了确认通知，才会有新的任务派发过来。

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    ch.consume(queue, (msg) => {
        console.log(" [x] Received %s");
        console.log(msg);
        console.log( msg.content.toString());
        setTimeout(() => {
            console.log(" [x] Done");
            ch.ack(msg);  // 消费完成确认
        }, 1000);
    }, {noAck: false});  // noAck: false-开启消息确认，如果没有向RabbitMQ发送消息确认这个ack的标识，这个时候RabbitMQ会将它从新加入到队列中 

```

## 启动说明

``` shell
$ npm install
#开发模式
$ node ./workers/member-worker.js  
# 生产模式 
$ pm2 start ./workers/member-worker.js # 生产模式 

```
