const router = require('koa-router')()

router.prefix('/hall')

router.get('/getRoomList', async function (ctx, next) {
	console.log('aaaaaaaaa');
  let loginbean = ctx.session.loginbean;
  console.log('loginbean:'+loginbean);
 console.log(loginbean.nicheng);
  if(!loginbean){
  	ctx.body='登陆过期';
  	return;
  }
 //
  //ctx.body='session'+loginbean.nicheng;
let roompwd=  ctx.query.roompwd;
 ctx.body=roompwd;
})
module.exports = router
