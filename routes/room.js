const router = require('koa-router')()
var redis = require("redis");
var client = redis.createClient();

router.prefix('/room')

client.on("error", function(err) {
  console.log("Error " + err);
});



router.get('/', async function (ctx, next) {
  let loginbean = ctx.session.loginbean;
  console.log('loginbean:'+loginbean);
  if(!loginbean){
  	ctx.body='0';
  	return;
  }
  
  ctx.body='1';
})




module.exports = router;