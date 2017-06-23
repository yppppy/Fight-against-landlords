const router = require('koa-router')()
var UserModels=require('../models/UserModels');
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.post('/zhuce', async function (ctx, next) {
	
		var user = new UserModels({});
			user.email = ctx.request.body['email'];
			user.pwd = ctx.request.body['pwd'];
			user.nicheng = ctx.request.body['nicheng'];
				user.role='1';
			user.createtime=new Date();
			console.log(user);
			 try{
  	   let rs = await user.save();
  	     ctx.status = 307;  //http重定向状态码
	   ctx.redirect('login');  
         	return;

			  }catch(err){
			  	let errMsg = err.message;
			  		if(errMsg.indexOf('$emailuiq')>-1){
				      ctx.body = 2;		//{type:0,msg:'email重复'};
				    }else if(errMsg.indexOf('$nichenguiq')>-1){
				      ctx.body = 3;		//{type:0,msg:'昵称重复'};
				    }else{
				      ctx.body = 0;		//{type:0,msg:'数据库错误'};
				    }
					return;
			}
      ctx.body = '收到参数';//res.send('收到参数');
    

})

router.post('/login', async function (ctx, next) {
			// let email=ctx.request.body['email'];//query['email'];
			// let pwd=ctx.request.body['pwd'];
			//  try{
			//   	let rs = await UserModels.findOne({email:email,pwd:pwd});
			//   	console.log(rs); 
			//   		if(rs==null){
			//   		ctx.body='email或密码错误';
			//   		return;
			//   	}

			//   }catch(err){
			//   console.log(err);
			  		
			// 		return;
			// }
   //  ctx.body= '登录成功';

   			 let user = {};
			user.email=ctx.request.body['email'];//query['email'];
			user.pwd=ctx.request.body['pwd'];

			let rs = await UserModels.findOne(user);
			if(rs){
				let loginbean={};
				loginbean.id=rs.id;
				loginbean.nicheng=rs.nicheng;
				loginbean.role=rs.role;
				ctx.session.loginbean=loginbean;
				ctx.body=loginbean;
			}else{
				ctx.body=0;
			}

});
module.exports = router
