const router = require('koa-router')()
var redis = require("redis");
var client = redis.createClient();

router.prefix('/hall')

client.on("error", function(err) {
  console.log("Error " + err);
});

var dayArr=['日','一','二','三','四','五','六'];
//client.on("connect", runSample);

router.get('/getRoomList', async function (ctx, next) {
  let loginbean = ctx.session.loginbean;
  console.log('loginbean:'+loginbean);
  if(!loginbean){
  	ctx.body='登陆过期';
  	return;
  }
  let roomList = [];  //房间列表

  let roomNames = await new Promise(function(resolve,reject){
    client.lrange('room',0,-1,function(err,rs){
        resolve(rs);
    });
  })
  let len = roomNames.length;
  for(let i=0;i<len;i++){
    let roomInfo = await new Promise(function(resolve,reject){
      client.hgetall(roomNames[i],function(err,rs){
          resolve(rs);
      })
    })
    if(roomInfo!=null){   
      if(roomInfo.pwd==''){
        roomInfo.pwd='无';
      }else{
        roomInfo.pwd='有';
      }
   //   let time = roomInfo.createtime;
      //roomInfo.createtime = time.getDate();
      roomInfo.room=roomNames[i];
      roomList.push(roomInfo);
    }
  }
  console.log(roomList);
  ctx.body=roomList;
})

router.get('/newroom', async function (ctx, next) {
  let loginbean = ctx.session.loginbean;
  if(!loginbean){
  	ctx.body='登陆过期';
  	return;
  }
  //---------获取房间流水号----------
  let roomid = await new Promise(function(resolve,reject){
    client.hincrby('roomid','id',1,function(err,roomidRS){
          resolve(roomidRS);
    });
  })

  await client.lpush('room','room'+roomid);
  let roompwd = ctx.query.roompwd;
  let date = new Date();
  let time = '周'+dayArr[date.getDay()]+' '+((date.getHours()<10)? '0'+date.getHours():date.getHours())+":"+((date.getMinutes()<10)? '0'+date.getMinutes():date.getMinutes());
  await client.hmset('room'+roomid,'num',1,'start',0,'pwd',roompwd,'createtime',time);
  
  ctx.body='roomid='+roomid;
})


module.exports = router;