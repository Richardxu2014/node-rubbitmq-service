'use strict' 
const elasticsearch = require('elasticsearch');
const config = require('../config');
const db = require('../db');

const esClient = new elasticsearch.Client({
    host: config.es.host,
    //log:'trace'
 });

 
class Member{
    constructor(memberInfo, logger){
        this.memberInfo = memberInfo;
        this.logger = logger;
    }

    // 增加 member 记录;  
    add(){
        db.visitor.create({ 
            name: this.memberInfo.name,
            age : this.memberInfo.age,
        }).then((member) => {
            this.logger.info("*** visitor member id: %s ", member.id );
        })
        .catch(err => {
            this.logger.warn(" add_member catch error: ",err);
        });
    }
}

module.exports = Member;



