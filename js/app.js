/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 owner 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	  //本地缓存
	  //数据
	  owner.data={
	  	  tmpClear:function(){
	  	  	var _this=this;
	  	  	  //缓存路径初始化
	  	  	plus.io.resolveLocalFileSystemURL( "_doc/", function(entry){
	  	  		var reader = entry.createReader();
	  	  	  		reader.readEntries(function(entries){
	  	  	  			_this._deleteAll(entries,0,function(){
	  	  	  				$.toast("临时文件清理成功");
	  	  	  			});
	  	  	  		}, function(e){
	  	  	  		   $.toast("读取文件失败:"+e.message);
	  	  	  	   });
               },
        	 function(e){
        	 	$.toast("获取临时目录失败:"+e.message);
        	 });
	  	  },
	  	  cachePath:function(){
	  	  	  return localStorage.getItem("$cachePath");
	  	  },
	  	  init:function(){//初始化
	  	  	console.log("开始初始化;;;;");
	  	  	var cache = localStorage.getItem("$data_cache");
	  	  	if(!cache){
	  	  		localStorage.setItem("$data_cache","{}");
	  	  	}
	  	  	//缓存路径初始化
	  	  	plus.io.resolveLocalFileSystemURL( "_documents/", function(entry){
	  	  		console.log("加载缓存路径::");
            	 	entry.getDirectory("cache",{create:true,exclusive:false},function(entry){
            	 		console.log("读取到缓存目录:"+entry.fullPath);
            	 		localStorage.setItem("$cachePath",entry.fullPath);
            	 		console.log("sessionStorage：："+localStorage.getItem("$cachePath"));
            	 	},function(e){
            	 	   console.log("获取缓存目录失败:"+e.message)
            	    });
            	 },
        	 function(e){
        	 	$.toast("获取缓存目录失败:"+e.message);
        	 });
	  	  },
	  	  putCache:function(key,value){
	  	  	var r=localStorage.getItem("$data_cache");
	  	  	var map={};
	  	  	if(r){
	  	  		map=JSON.parse(localStorage.getItem("$data_cache"));
	  	  	}
	  	  	map[key]=value;
	  	  	localStorage.setItem("$data_cache",JSON.stringify(map));
	  	  },
	  	  getFromCache:function(key){//
	  	  	var r=localStorage.getItem("$data_cache");
	  	  	if(r){
	  	  		return JSON.parse(localStorage.getItem("$data_cache"))[key];
	  	  	}else{
	  	  		return null;
	  	  	}
	  	  	 
	  	  },
	  	  _deleteAll:function(entries,i,callback){
	  	  	var _this=this;
	  	  	if(entries.length-1>=i){
	  	  		var entry=entries[i];
	  	  		entry.remove( function () {
				    console.log("删除:"+entry.name+"成功");
				    _this._deleteAll(entries,i+1,callback);
				}, function ( e ) {
				     console.log("删除:"+entry.name+"失败,忽略");
				    _this._deleteAll(entries,i+1,callback);
				});
	  	  	}else{
	  	  		callback();
	  	  	}
	  	  },
	  	  cacheClear:function(){//清理缓存
	  	  	  var _this=this;
	  	  	  localStorage.setItem("$data_cache","{}");
	  	  	  if(this.cachePath() != null){
	  	  	  	plus.io.resolveLocalFileSystemURL("file://"+this.cachePath(),function(entry){
	  	  	  		var reader = entry.createReader();
	  	  	  		reader.readEntries(function(entries){
	  	  	  			_this._deleteAll(entries,0,function(){
	  	  	  				$.toast("缓存清理成功");
	  	  	  			});
	  	  	  		}, function(e){
	  	  	  		   $.toast("读取文件失败:"+e.message);
	  	  	  	   });
	  	  	  	},function(){
	  	  	  		$.toast("清理缓存失败:"+e.message);
	  	  	  	});
	  	  	  }
	  	  }
	  }
	  
	  
	  /*
	   * 业务数据
	   */
	  owner.business={
	  	  propaganda_filesType:{
	  	  	"1":"政府职能部门",
	  	  	"2":"村长（主任）义务护线员",
	  	  	"3":"地块户主",
	  	  	"4":"门店店主",
	  	  	"5":"三机手"
	  	  }
	  };
	  
	  owner.GPS={
	  	//纬度1，经度1  纬度2，经度2 x表示当地的纬度,y表示当地的经度
	  	distance:function(lat1,lng1,lat2,lng2){
	  		if(typeof lat1=="string"){
	  			lat1=parseFloat(lat1);
	  		}
	  		if(typeof lng1=="string"){
	  			lng1=parseFloat(lng1);
	  		}
	  		if(typeof lat2=="string"){
	  			lat2=parseFloat(lat2);
	  		}
	  		if(typeof lng2=="string"){
	  			lng2=parseFloat(lng2);
	  		}
	  		console.log(lat1+"----"+(typeof lat1));
	  		console.log(lng1+"----"+(typeof lng1));
	  		console.log(lat2+"----"+(typeof lat2));
	  		console.log(lng2+"----"+(typeof lng2));
	  		function getRad(d){
		        return d*PI/180.0;
		    }
	  		var EARTH_RADIUS = 6378137.0;    //单位M
            var PI = Math.PI;
	        var f = getRad((lat1 + lat2)/2);
	        var g = getRad((lat1 - lat2)/2);
	        var l = getRad((lng1 - lng2)/2);
	        
	        var sg = Math.sin(g);
	        var sl = Math.sin(l);
	        var sf = Math.sin(f);
	        
	        var s,c,w,r,d,h1,h2;
	        var a = EARTH_RADIUS;
	        var fl = 1/298.257;
	        
	        sg = sg*sg;
	        sl = sl*sl;
	        sf = sf*sf;
	        
	        s = sg*(1-sl) + (1-sf)*sl;
	        c = (1-sg)*(1-sl) + sf*sl;
	        
	        w = Math.atan(Math.sqrt(s/c));
	        r = Math.sqrt(s*c)/w;
	        d = 2*w*a;
	        h1 = (3*r -1)/2/c;
	        h2 = (3*r +1)/2/s;
	        return parseInt(d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)));
	    }
	  };
	  owner.buttonSubmit = function(obj){
	  	  if(obj && obj.tagName=="BUTTON"){
	  	  	obj.setAttribute("data-loading-text","处理中")
	  	  	$(obj).button('loading');
	  	    window._btnMui=$(obj);
	  	  }
	  };
	   
	   //ids[] tab页签标识
	   //ids[{tabId:"item1",scrollId:"item1Scroll",callback:},"item2"]
	   //
	   owner.TabPullRefresh=function(arr){
		   	this.datas={};
		   	this.currentTab=null;
		   	var _self=this;
		   	var cs=[];//容器
		   	for(var i=0;i<arr.length;i++){
		   	  	var obj=arr[i];
		   	  	_self.datas[obj.tabId]={};
		   	  	_self.datas[obj.tabId].scrollId=obj.scrollId;
		   	  	_self.datas[obj.tabId].lastState=false;//当前tab对应的下拉状态--disable
		   	  	_self.datas[obj.tabId].init=false;//是否初始化过
				//这里高度不能太高，否则最下面的连接会反弹，看不到
				$(_self.datas[obj.tabId].scrollId)[0].style.height=(window.innerHeight-114)+"px";
				//console.log(_self.datas[obj.tabId].scrollId+"的高度：："+$(_self.datas[obj.tabId].scrollId)[0].style.height);
		        cs.push(obj.scrollId);
				_self.datas[obj.tabId].callback=obj.callback;
				
				if(obj.default){
		   	  		_self.currentTab=obj.tabId;
		   	  	}
	   	   }
		   	if(!_self.default){
		   		_self.currentTab=arr[0].tabId;
		   	}
		   _self.datas[_self.currentTab].init=true;//默认的就初始化
		   	var pullRefresh=new owner.PullRefresh(cs,{
		   	  	  	callback:function(){
		   	  	  		console.log("当前tab::"+_self.currentTab);
		   	  	  		_self.datas[_self.currentTab].callback();
		   	  	  	},
		   	  	  	disable:{
		   	  	  		after:function(){
		   	  	  			//console.log("disable后置true::");
		   	  	  			_self.datas[_self.currentTab].lastState=true;
		   	  	  		}
		   	  	  	},
		   	  	  	enable:{
		   	  	  		after:function(){
		   	  	  			//console.log("enable后置false::");
		   	  	  			_self.datas[_self.currentTab].lastState=false;
		   	  	  		}
		   	  	  	}
		   	 });
	   	   	for(var i=0;i<arr.length;i++){
	   	   		var obj=arr[i];
		   	  	_self.datas[obj.tabId].pullRefresh=pullRefresh;
	   	   }
	   	   
	   	   this.swith=function(tabId){
	   	   	   console.log("当前tab::"+tabId);
	   	   	   for(var pro in _self.datas){
	   	   	   	 owner.log.info(_self.datas[pro],"数据信息：："+pro);
	   	   	   }
	   	   	   _self.currentTab=tabId;
	   	   	   if(_self.datas[_self.currentTab].lastState){ //恢复状态
	   	   	   	  _self.datas[_self.currentTab].pullRefresh.disable();
	   	   	   }else{
	   	   	   	 _self.datas[_self.currentTab].pullRefresh.enable();
	   	   	   }
	   	   	   
	   	   	   if(!_self.datas[_self.currentTab].init){
   	  	  			console.log(_self.currentTab+"首次开始初始化");
   	  	  			_self.datas[_self.currentTab].init=true;//默认的就初始化
   	  	  			_self.datas[_self.currentTab].pullRefresh.beginPullToRefresh();
   	  	  		}
	   	   	  
	   	   };
	   	   this.endPullToRefresh=function(){
	    		_self.datas[_self.currentTab].pullRefresh.endPullToRefresh();
	    	};
	    	this.disable=function(){
	    		_self.datas[_self.currentTab].pullRefresh.disable();
	    	};
	    	this.enable=function(){
	    		_self.datas[_self.currentTab].pullRefresh.enable();
	    	};
	   	   
	   };
	    
	   //options--滚动容器contanier
	    owner.PullRefresh=function(container,options){
	    	this.currentView = plus.webview.currentWebview();
	    	this.disabled=false;
	    	this.elementType=0;//0表示单元素，1表示数组
	    	this.ios=($.os.plus && $.os.ios);//是否是ios
	    	this.line=false;//线路轨迹，false表示不需要下拉刷新
	    	if(typeof container=="string"){
	    		this.element=$(container);
	    		this.elementType=0;
	    	}else{
	    		this.element=[];
    			for(var i=0;i<container.length;i++){
    				this.element.push($(container[i]));
    			}
    			this.elementType=1;
	    	}
	    	
	    	
	    	//auto 自动触发，every每次触发后禁用。 如需再次触发，需要调用enable
	    	this.options=$.extend({auto:true,callback:function(){}},options,true);
	    	//owner.log.info(this.options,"参数");
	    	this.callback=this.options.callback;
	    	var _self=this;
	    	
	    	_handle=function(){
	    		_self.callback(_self);
				_self.endPullToRefresh();//结束下拉
				if(_self.elementType!=0){
					for(var i=0;i<_self.element.length;i++){
					   if(_self.element[i].scroll().y>0){
						console.log("需要滚动到顶部....");
						_self.element[i].scroll().scrollTo(0,0,1);
					   }
				    }
				}else{
					if(_self.element.scroll().y>0){
						console.log("需要滚动到顶部....");
						_self.element.scroll().scrollTo(0,0,1);
					}
				}
				
	    	};
	    	_init=function(diable,flag){
	    		if(flag){
	    			//console.log("初次初始化.....");
	    			_self.currentView.setPullToRefresh({
						support: !diable,
						color:'#2BD009',
						height:'50px',
						range: '100px',
						style: 'circle',
						offset:'10px'
					}, function() {
						_handle();
					});
	    		}else{
	    			console.log("-----更改状态");
	    			_self.currentView.setPullToRefresh({
						support: !diable,
						color:'#2BD009',
						height:'50px',
						range: '100px',
						style: 'circle',
						offset:'10px'
						});
	    		}
	    	};
	    	this.beginPullToRefresh=function(){
	    		//前置方法
	    		if(_self.options.beginPullToRefresh && _self.options.beginPullToRefresh.before)_self.options.beginPullToRefresh.before();
	    		console.log("----beginPullToRefresh");
	    		_self.currentView.beginPullToRefresh();
	    		//后置方法
	    		if(_self.options.beginPullToRefresh && _self.options.beginPullToRefresh.after)_self.options.beginPullToRefresh.after();
	    		
	    	};
	    	this.endPullToRefresh=function(){
	    		//前置方法
	    		if(_self.options.endPullToRefresh && _self.options.endPullToRefresh.before)_self.options.endPullToRefresh.before();
	    		//console.log("----endPullRefresh");
	    		_self.currentView.endPullToRefresh();
	    		//后置方法
	    		if(_self.options.endPullToRefresh && _self.options.endPullToRefresh.after)_self.options.endPullToRefresh.after();
	    		
	    		//_self.disable();
	    	};
	    	this.disable=function(){
	    		if(_self.options.disable && _self.options.disable.before)_self.options.disable.before();
	    		if(!_self.disabled){
	    			console.log("----disable");
	    		   _self.disabled=true;
	    		   _init(_self.disabled);
	    		}
	    		if(_self.options.disable && _self.options.disable.after)_self.options.disable.after();
	    		
	    	};
	    	this.enable=function(){
	    		if(_self.options.enable && _self.options.enable.before)_self.options.enable.before();
	    		if(_self.disabled){
	    			console.log("----enable");
		    		_self.disabled=false;
		    		_init(_self.disabled);
		    		//_handle();
	    		}
	    		if(_self.options.enable && _self.options.enable.after)_self.options.enable.after();
	    	};
	    	_init(false,true);
	    	if(_self.elementType==0){
	    		_self.element.scroll();
				_self.element[0].addEventListener("scrollend",function(e){
					console.log("触发了scrollend::"+e.detail.y+",最大:"+e.detail.maxScrollY);
					if(e.detail.y>=0){
							_self.enable();
							if(_self.ios &&  _self.line==true){
								console.log("ios系统，手动触发");
								_self.beginPullToRefresh();
								 _self.line=false;
							}
						}else if(e.detail.y<0){
		    				_self.disable();
		    				_self.line=false;
	    			}
				});
				_self.element[0].addEventListener("scroll",function(e){
					console.log("触发了scroll::"+e.detail.y+",最大:"+e.detail.maxScrollY);
					if(e.detail.y>=0){
							_self.enable();
							_self.line=true;
						}else if(e.detail.y<0){
		    				_self.disable();
		    				_self.line=false;
		    			}
				});
	    	}else{
	    		for(var i=0;i<_self.element.length;i++){
    				_self.element[i].scroll();
					_self.element[i][0].addEventListener("scrollend",function(e){
						//console.log("触发了scrollend::"+e.detail.y+",最大:"+e.detail.maxScrollY);
						if(e.detail.y>=0){
							_self.enable();
							if(_self.ios && _self.line==true){
								console.log("ios系统，手动触发");
								_self.beginPullToRefresh();
								_self.line=false;
							}
						}else if(e.detail.y<0){
		    				_self.disable();
		    				_self.line=false;
		    			}
					});
					_self.element[i][0].addEventListener("scroll",function(e){
						console.log("触发了scroll::"+e.detail.y+",最大:"+e.detail.maxScrollY);
						if(e.detail.y>=0){
							_self.enable();
							_self.line=true;
						}else if(e.detail.y<0){
		    				_self.disable();
		    				_self.line=false;
		    			}
					});
    			}
	    	}
	    	
			$("body").on("tap",".disable-pullrefresh",function(){
	    		 //console.log("来自disable-pullrefresh禁用 事件....");
	    		_self.disable();
	    	});
	    	$("body").on("tap",".enable-pullrefresh",function(){
	    		//console.log("来自enable-pullrefresh启用 事件....");
	    		_self.enable();
	    	});
			if(_self.options.auto){
				console.log("-----自动刷新");
				_handle();
			}
			 //实现ios平台原生侧滑关闭页面；
			if ($.os.plus && $.os.ios) {
				/*$.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
					_self.currentWebview.setStyle({
						'popGesture': 'none'
					});
				});*/
			}
			
			
	    }
	  
	    
	    
	    //禁用PullRefresh 需要class disable-pullrefresh
	  /*  owner.initHandlePullRefresh=function(container){
	    	$("body").on("tap",".disable-pullrefresh",function(){
	    		 console.log("来自disable-pullrefresh禁用 事件....");
	    		if(container && $(container))$(container).pullRefresh().disable();
	    	});
	    	$("body").on("tap",".enable-pullrefresh",function(){
	    		console.log("来自enable-pullrefresh启用 事件....");
	    		if(container && $(container))$(container).pullRefresh().enable();
	    	});
	    };*/
	    
	   //扩展PullRefresh插件，禁用下拉刷新
	   $.PullRefresh.disable=function(){
	      	var self = this;
	      	console.log("禁用下拉刷新....");
	   		self.options.webview.setPullToRefresh({
				support: false,
				color:self.options.down.color || '#2BD009',
				height: self.options.down.height || '50px',
				range: self.options.down.range || '100px',
				style: 'circle',
				offset: self.options.down.offset || '0px'
			}, function() {
				self.options.down.callback();
			});
			self.disabled=true;
			console.log("禁用下拉刷新完毕....");
	   };
	    //扩展PullRefresh插件，启用下拉刷新
	   $.PullRefresh.enable=function(){
	   		var self = this;
	      	console.log("启用下拉刷新....");
	      	owner.log.info(self.options.webview);
	   		self.options.webview.setPullToRefresh({
				support: true,
				color:self.options.down.color || '#2BD009',
				height: self.options.down.height || '50px',
				range: self.options.down.range || '100px',
				style: 'circle',
				offset: self.options.down.offset || '0px'
			}, function() {
				self.options.down.callback();
			});
			self.disabled=false;
			console.log("启用下拉刷新完毕....");
	   };
	
		owner.errorCode={
		"P_ACCOUNT_FORBIDDEN" : "用户被禁用.",
		"P_ACCOUNT_IS_FREEZE" : "用户帐号被冻结。",
		"P_ACCOUNT_NOTEFFECTIVE" : "用户未生效。",
		"P_DEFAULT_PORTAL_NOT_EXIST" : "默认门户不存在或者不可用。",
		"P_EXCEED_ONLINENUM" : "超过此用户最大在线数。",
		"P_LOGIN_NOSTAFF" : "用户帐号不存在。",
		"P_LOGIN_PASSWORD_ERROR" : "用户名或者密码错误。",
		"P_MSG_EXCEED_RETRY_LIMIT" : "您的账号已经被锁定。",
		"P_PASSWORD_EXPIRED" : "用户密码已过期，需要修改。",
		"P_PASSWORD_WILL_EXPIRED" : "用户密码即将在{0}天后过期。",
		"P_PASSWORD_IS_DEFAULT" : "用户密码和默认密码相同。",
		"P_USER_EXPIRED" : "用户已经过期。",
		"P_VERIFICATION_CODE_WRONG" : "验证码错误，请重新输入。",
		"P_LOGIN_FAIL_OTHER_REASON" : "因为其他原因登录失败，请联系管理员。",
		"P_ACCESS_FAIL" : "拒绝访问[{0}]。",
		"P_ENCRYPTION_FAIL" : "加密出错。",
		"P_PWD_LENGTH_EXCEED" : "密码长度不能超过60",
		"P_USER_LENGTH_ZERO" : "请输入用户名",
		"P_PWD_LENGTH_ZERO" : "请输入密码",
		"P_USER_LENGTH_EXCEED" : "用户名长度不能超过60",
		"S-LOGIN-00001" : "请重新登录",
		"S-LOGIN-00002" : "你已经被管理员从已经登录状态踢除，请重新登录。",
		"P-SYS-000" : "系统错误!",
		"P_MALICIOUS_TOKEN" : "发现恶意登录令牌!",
		"P_MALICIOUS_MAGIC" : "发现恶意鉴权码!",
		"P_DOWNLOAD_PATH_ERROR" : "不能下载当前路径下的文件。",
		"S-owner-10001" : "应用编码已经存在。",
		"S-owner-10004" : "应用被[{0}]引用。",
		"S-owner-10005" : "删除portal失败，因为portal被这个应用中的用户引用。",
		"S-SYS-00027": "session过期，需要重新登录",
		"S-owner-10006" : "不能删除自己。"
	};
	owner.log={};
	owner.log.console=true;
	function isJson(obj){  
	    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;   
	    return isjson;  
	}  
	owner.log.info = function(obj,desc){
		if(owner.log.console){
			desc =desc||"";
			var _objInfo = function(obj){
				var str="";
				for(var pro in obj ){
					str = str+pro+":"+obj[pro]+",";
				}
				var index=str.lastIndexOf(",");
				if(str && str.length==index+1)str=str.substring(0,index);
				return "{"+str+"}";
			};
			var _arrInfo=function(arr){
				var str="";
				if((typeof obj=='string' && obj.constructor==String) || !isNaN(obj)){
					for(var i=0;i<arr.length;i++){
					  str = str+arr[i]+",";
				   }
				}else{
					for(var i=0;i<arr.length;i++){
						str = str+_objInfo(arr[i])+",";
					}
				}
				
				var index=str.lastIndexOf(",");
				if(str && str.length==index+1)str=str.substring(0,index);
				return "["+str+"]";
			};
			if(obj instanceof Array){//数组类型
				console.log(desc+_arrInfo(obj));
			}else if((typeof obj=='string' && obj.constructor==String) || !isNaN(obj)){
				console.log(desc+obj); 
			}else{
				console.log(desc+_objInfo(obj));
			}
		}
	};
	//session
	//{"address":null,"contactInfo":null,"memo":null,"userName":"admin","userId":1,"spId":0,"userCode":"admin","phone":null,"portalId":1,"staffName":"ADMIN","logo":null,"staffId":1,"email":null}
	//用户对象，与服务器session数据对应
	owner.UserInfo=function(){
		this.staffName = null;
		this.userCode = null;
		this.userName = null;
		this.phone = null;
		this.email = null;
		this.address = null;
		this.userId = null;
		this.portalId=null;
		this.staffId=null;
		this.orgId=null;
		this.orgName=null;
	};
	
	
	//element样式操作
	owner.elementClass={
		//获取样式
		get:function(ele){
			var cs=ele.className||"";//样式字符串
			var strs=cs.split(" ");//分割
			var cArr=[];//样式数组
			for(var i=0;i<strs.length;i++){//获取每一个样式
				var str=strs[i].trim();
				if(str)cArr.push(str);
			}
			return cArr;
		},
		add:function(ele,classname){
			console.log("add前:"+ele.className);
			var cArr=owner.elementClass.get(ele);
			if(!owner.utils.arrays.contain(cArr,classname)){//如果没有就添加
				console.log(typeof cArr);
				cArr.push(classname);
				ele.className=cArr.join(" ");
			}
			console.log("add后:"+ele.className);
		},
		remove:function(ele,classname){
			console.log("remove前:"+ele.className);
			var cArr=owner.elementClass.get(ele);
			var index=owner.utils.arrays.index(cArr,classname);
			if(index >= 0){//如果有就删除
				cArr.splice(index,1);
				ele.className=cArr.join(" ");
				console.log(ele.className);
			}
			console.log("remove后:"+ele.className);
		}
	};
	
	//创建一个元素
	/*  attrs{
	 * 	
	 * }
	 * 
	 * 
	 */
	owner.createElement=function(eleName,opts){
		var createNode = document.createElement(eleName);
		for(var pro in opts.attrs){
			createNode.setAttribute(pro,opts.attrs[pro]);
		}
		//css样式设置 className 
		if(opts.className){
			createNode.className=opts.className;
		}
		//innerHTML
		if(opts.innerHTML){
			createNode.innerHTML=opts.innerHTML;
		}
		return createNode;
	};
	owner.seesionMap={
		"userName":"$userName",
		"userId":"$userId",
		"spId":"$spId",
		"userCode":"$spId",
		"phone":"$phone",
		"staffName":"$staffName",
		"staffId":"$staffId",
		"email":"$email",
		"address":"$address"
	};
	owner.defaultServerUrl="http://211.90.10.169:8080/lineCheck";
	var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c : cc < 0x800 ? (String.fromCharCode(0xc0 | (cc >>> 6)) + String.fromCharCode(0x80 | (cc & 0x3f))) : (String.fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + String.fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + String.fromCharCode(0x80 | (cc & 0x3f)));
        } else {
            var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
            return (String.fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + String.fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + String.fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + String.fromCharCode(0x80 | (cc & 0x3f)));
        }
    };
    var btoa = window.btoa ? function(b) {
        return window.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
	var _encode = function(u) {
        return btoa(utob(u))
    };
    
   
    owner.serverUrl=function(){
    	var serverUrl = localStorage.getItem("$serverUrl");
    	if(serverUrl && serverUrl !="undefined"){
    		
    		return serverUrl;
    	}else{
    		localStorage.setItem("$serverUrl",owner.defaultServerUrl);
    		return owner.serverUrl();
    	}
    };
   
    owner.getURL=function(url){
    	return getUrl(url);
    }
    function getUrl(url){
    	url = url.trim();
    	if(url.indexOf("http://")==0 || url.indexOf("https://")==0){
    		return url;
    	}else{
    		if(url.indexOf("/")==0){
    			return owner.serverUrl()+url;
    		}else{
    			return owner.serverUrl()+"/"+url;
    		}
    	}
    }
    
    owner.setServerUrl=function(url){
    	var serverUrl = localStorage.getItem("$serverUrl");
    	var msg ="";
    	if(serverUrl){
    		msg="原服务地址["+serverUrl+"]";
    	}
    	localStorage.setItem("$serverUrl",url);
    	msg = msg +"修改为"+"["+url+"]";
    	owner.log.info(msg);
    }
    owner.utils={};
    owner.utils.arrays={
    	//查找数组中是否包含val
    	contain:function(arr,val){
    		return owner.utils.arrays.index(arr,val)>=0;
    	},
    	index:function(arr,val){
    		if(arr){
    			for (var i=0;i<arr.length;i++) {
    				if(arr[i]==val){
    					return i;
    				}
    			}
    		}
    		return -1;
    	}
    };
    owner.utils.dateFormat=function(date,fmt){
    	
    	 var o = {
		        "M+": date.getMonth() + 1, //月份 
		        "d+": date.getDate(), //日 
		        "H+": date.getHours(), //小时 
		        "m+": date.getMinutes(), //分 
		        "s+": date.getSeconds(), //秒 
		        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		        "S+": date.getMilliseconds() //毫秒 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
    };
    //日期运算 type天，小时，分钟
    owner.utils.dateAdd=function(dateObj,value,type){
    	
    /*	var time = dateObj.valueOf();
    	if(type=='d'){
    		time = time+value*24*60*60*1000;
    	}else if(type == 'h'){
    		time = time+value*60*60*1000;
    	}else if(type == 's'){
    		time = time+value*60*1000;
    	}else{
    		throw new Error("不支持["+type+"]");
    	}
    	return new Date(time);*/
    	var newDate= new Date(dateObj.getTime());
    	if(type == 'M'){
    		newDate.setMonth(newDate.getMonth()+value);
    	}else if(type=='d'){
    		newDate.setDate(newDate.getDate()+value);
    	}else if(type == 'h'){
    		newDate.setHours(newDate.getHours()+value);
    	}else if(type == 'm'){
    		newDate.setMinutes(newDate.getMinutes()+value);
    	}else{
    		throw new Error("不支持["+type+"]");
    	}
    	return newDate;
    	
    };
    
    app.initDateTime=function(selector){
    	var _init=function(ele){
    		var _self = ele;
			var optionsJson = ele.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			_self.picker = new $.DtPicker(options);
			_self.picker.show(function(rs) {
				console.log("日期选择：："+rs.text);
				if(options.type && options.type=='datetime'){
					_self.value=rs.text+":00";
				}else{
					_self.value=rs.text;
				}
				_self.picker.dispose();
				_self.picker = null;
			});
    	};
    		$(selector).each(function(i, element) {
    			if(element.tagName=='INPUT')this.setAttribute("readonly",true);
				element.addEventListener('tap', function() {
					_init(this);
				}, false);
				
				var nextDom=element.nextElementSibling;
				if(nextDom && nextDom.tagName=="SPAN" && nextDom.classList.contains("mui-icon-extra-calendar")){
				 	nextDom.addEventListener("tap",function(){
				 		_init(element);
				 	});
				}
			});

    };
    
    owner.ajax=function(url,opts){
    	var srcUrl=url;
    	url=getUrl(url);
    	owner.log.info("请求地址:"+url);
    	var defaultOpts = {
    		data :opts.data,
    		type :opts.type || 'post',//HTTP请求类型
    		timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},
			dataType:opts.dataType || 'json',
			success:function(data){
				if(window._btnMui)window._btnMui.button("reset");
				owner.log.info(data,"来自["+url+"]响应数据:");
				if(opts.success)opts.success(data);
    			
    		},
    		error:function(xhr, type, error){
    			if(window._btnMui)window._btnMui.button("reset");
    			console.log(xhr+"---"+type+"---"+error+isJson(xhr.response));
    			console.log(xhr.response);
    			
    			//session过期判断 {"code":"S-SYS-00027","message":"Session超时","type":1}
    			if(type =='error' && xhr.response){
    				try {
					   var obj =JSON.parse(xhr.response);
						if(obj["code"]=='S-SYS-00027'){
							if(opts.error)opts.error(xhr, type, error);//回调
							plus.nativeUI.toast(owner.errorCode[obj["code"]]);//提示session过期
							console.log("session过期");
							owner.logout(null,true);
							return;
						}
					}catch(err){}
    			}
    			if(type=="timeout"){
					plus.nativeUI.toast("连接服务超时");
				}
				if(opts.error){
					opts.error(xhr, type, error);
				}else{
					plus.nativeUI.toast("服务异常"+error);
				}
    		}
    	}
    	$.ajax(url,defaultOpts);
    }
 
	/**
	 * 
	 * 加密
	 */
	owner.encode = function(u, urisafe){
        return !urisafe ? _encode(u) : _encode(u).replace(/[+\/]/g, function(m0) {
	            return m0 == '+' ? '-' : '_';
	        }).replace(/=/g, '');
	}
	
	/**
	 * 退出
	 * @param {Object} callback
	 */
	owner.logout = function(callback,state){
		localStorage.removeItem("$user");
		if(!state){
			owner.ajax("logout",{
				success:function(data){
					owner.log.info(data,"退出返回");
				},
				error:function(xhr, type, error){
				   owner.log.info(type,"退出返回");
				}
			});
		}
		if(callback)callback();
		var curl = plus.webview.currentWebview().getURL();
		//以www为准查找 路径问题
		var count=curl.split("www/")[1].split("/").length-1;
		var obj=[];
		for(var i=0;i<count;i++){
			obj.push("../")
		}
		var prefix=obj.join("");
		$.openWindow({
			id :"login.html",
			url:prefix+'login.html',
			show:{
				aniShow: 'pop-in'
			}
		});//跳转到登陆页面
	}
	owner.currentUser = function(){
		var $userText = localStorage.getItem('$user') || "{}";
		return JSON.parse($userText);
	}
	owner.continueLogin=function(btn,value,callback){
		var userInfo=document.getElementById("orgSubmitBtn").userInfo;
		var data=document.getElementById("orgSubmitBtn").staffMap[value];
		owner.ajax("staffjob/current",{
	         data:data,
	         success:function(data){
	         	$.toast("登录成功");
	         	userInfo["orgId"]=data["orgId"];
				userInfo["orgName"]=data["orgName"];
	         	localStorage.setItem("$user",JSON.stringify(userInfo));
	            callback();
	         },
	         error:function(xhr, type, error){$.toast("登录失败,无法切换到当前组织");
	            callback("登录失败");
	         }});
	};
	
	//显示可选组织
	function showOrgs(data,userInfo){
		$('#popover').popover('show');//显示
		var _select=document.getElementById("orgId");
		_select.innerHTML='';
		console.log(_select);
		var staffMap={};
		for(var i=0;i<data.length;i++){
			var opt=owner.createElement("option",{
				attrs:{
					value:data[i].staffJobId
				},
				innerHTML:data[i].jobName+"("+data[i].staffName+")"
			});
			_select.appendChild(opt);
			staffMap[data[i].staffJobId]=data[i];
		}
		document.getElementById("orgSubmitBtn").userInfo=userInfo;
		document.getElementById("orgSubmitBtn").staffMap=staffMap;
	}
	
	/**
	 * 用户管理模块
	 * userName:用户名
	 * password:密码
	 * remember:是否记录密码
	 */
	app.userManager={
		listUserNames:function(){
			var names=[];
			var users=this.getUser();
			var user=localStorage.getItem('$rememberPwd')||{};
			for(var u in users){
				names.push(u);
			}
			return names;
		},
		setUser:function(u){
			var users=this.getUser();
			users[u.userName]=u;
			localStorage.setItem("$users",JSON.stringify(users));
		},
		//获取用户
		getUser:function(userName){
			var users=localStorage.getItem("$users");
			if(users){
				users=JSON.parse(users);
			}else{
				users={};
			}
			if(userName){
				return users[userName];
			}else{
				return users;
			}
		},
		removeUser:function(userName){
			var users=JSON.parse(localStorage.getItem("$users"))||{};
			if(users[userName]){
				delete users[userName];
				localStorage.setItem("$users",JSON.stringify(users))
			}
			var user=localStorage.getItem('$rememberPwd');
			if(user){
				user=JSON.parse(user);
				if(user.userName==userName){
					localStorage.setItem('$rememberPwd',"");
				}
			}
		}
	};
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.userName = loginInfo.userName || '';
		loginInfo.userPwd = loginInfo.userPwd || '';
		if (loginInfo.userName.length <= 0) {
			return callback('请输入用户名');
		}
		if (loginInfo.userPwd.length <= 0) {
			return callback('请输入密码');
		}
		
		owner.ajax("login",{
			data:loginInfo,
			success:function(data){
				if(data.state == 0 && data.errorCode=="SUCCESS"){//登陆成功
					//加载当前用户信息
					owner.ajax("user/current?_="+(new Date()).valueOf(),{
						type:"get",
						success:function(data){
							var userInfo = new owner.UserInfo();
							for(var pro in userInfo){
								userInfo[pro]=data[pro];
						    }
							//获取当前protal信息
							owner.ajax("staffs/"+userInfo.staffId+"/orgjobs?_="+(new Date()).valueOf(),{
						               type:"get",
						               success:function(d){
						               	   if(d && d.length==1){
						               	   	  // showOrgs(d,userInfo);
						               	   	   owner.ajax("staffjob/current",{
										         data:d[0],
										         success:function(data){
										         	$.toast("登录成功");
										         	userInfo["orgId"]=d[0]["orgId"];
										         	userInfo["orgName"]=d[0]["orgName"];
										         	console.log("当前登录用户信息:"+JSON.stringify(userInfo));
										         	localStorage.setItem("$user",JSON.stringify(userInfo));
										         	$.toast("登录成功");
										         	owner.data.init();
										         	callback(null,true);
										         },
										         error:function(xhr, type, error){$.toast("登录失败,无法切换到当前组织");
										            callback("登录失败");
										         }});
							                   
						               	   }else if(d && d.length>1){
						               	   	   showOrgs(d,userInfo);
							                   callback();
						               	   }else{
						               	   	  $.toast("该用户没有对应的工作组织");
						               	   }
							            },
						               error:function(xhr, type, error){callback("无法获取用户对应的组织信息");}});
						},
						error:function(xhr, type, error){
							console.log("请求失败:"+xhr+"---"+type+"---"+error);
							callback("请求异常,无法获取当前用户信息");
						}
					});
					
				}else{
					var msg = owner.errorCode[data.errorCode];
					if(data.maxLoginRetry && data.loginFail){
						msg=msg+"登陆失败["+data.loginFail+"]次,最大登陆次数["+data.maxLoginRetry+"]次"
					}
					callback(msg);
				}
			},
			error:function(xhr, type, error){
				console.log(xhr+"---"+type+"---"+error);
				callback("请求异常");
			}
		});
		/*var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}*/
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	
	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	
	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	};

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
	};
	
	
	//页面交互
	owner.pageInteraction={
		//绑定初始化打开页面 参数是一个数组
		dataMapping:{},
		//[[ele:'触发打开页面的元素id',extras:要传入的参数,id:'页面id'，url：’页面url‘,obtain:获取数据回调}]
		initOpenwindow:function(arr){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(!obj.openwindow){
					$.preload({
					    url: obj.url,
					    id: obj.id,
					    extras:{rowData:obj.extras}
					});
				}else{//
					var view=plus.webview.getWebviewById(obj.id);
					if(view && view.preload){//之前是预加载的，close掉
						view.close();//关闭掉
					}
				}
				owner.pageInteraction.dataMapping[obj.id]=obj.obtain;
				//注册事件
				var o=document.getElementById(obj.ele);
				o.openId=obj.id;
				o.openwindow=obj.openwindow||false;
				o.openOpts={
					    url: obj.url,
					    id: obj.id,
					    extras:{rowData:obj.extras}
				};
				o.addEventListener("tap",function(){
					console.log("触发事件了打开:"+this.openId);
					if(this.openwindow){//以openwindow形式打开
						$.openWindow(this.openOpts);
					}else{
						plus.webview.show(plus.webview.getWebviewById(this.openId));//比如获取main.html这时候，this.openId的值就应该是main
					}
				});
			}
			//
			window.addEventListener('obtain',function(event){
				var src = event.detail.src;
				var data = event.detail.data;
				owner.pageInteraction.dataMapping[src](data);
			});
		},
		//读取传入过来的参数
		readExtras:function(){
			var self = plus.webview.currentWebview();
			return self.data||{};
		},
		
		//传值页面:注入数据 destPage目标页面id
		injection:function(data){
			//打开当前窗口的创建者
			 var destPage = plus.webview.currentWebview().opener();
			 if(!destPage)throw new Error("目标页面["+destPage+"]不存在");
			  //触发目标页面的obtain事件,让目标页面接受参数数据..src表示当前id  data是要回传的数据
			  //如果destPage不存在，或者事件不存在。将不会触发
			  var currentId=plus.webview.currentWebview().id;
			  console.log("当前页面:"+currentId);
			  $.fire(destPage,'obtain',{src:currentId,data:data});
			  //关闭当前页
			  $.back();
		}
	};
	//压缩图片
	owner.compressImage=function(files,callback,options){
		var _fn=function(name){
			var i = name.lastIndexOf(".");
			/*var i = path.lastIndexOf(".");
			return {path:path.substring(0,i)+"-small"+path.substring(i,path.length),
			type:path.substring(i+1,path.length)};*/
			return {name:name.substring(0,i)+"-small"+name.substring(i,name.length),
			type:name.substring(i+1,name.length)};
		}
		var _opt={
			limit:200,
			quality:20,
			overwrite:true,
			width:'50%'
		};
		_opt=$.extend(true,_opt,options||{});
		owner.resolveFile(files,function(path,metadata,iteminnercallback){
			if(metadata.size/1024<=_opt.limit){//小于两百k--忽略
				iteminnercallback({
					path:path,
					src:null,
					compress:false,
					metadata:metadata
				});
			}else{//压缩
				var v=owner.data.getFromCache(path);
				console.log("来自缓存：："+JSON.stringify(v));
				if(v){
					iteminnercallback(v);
				}else{
					var _p=_fn(metadata.name);
					var o=$.extend(true, {
						src:path,
						dst:"file://"+owner.data.cachePath()+_p.name,
						format:_p.type
					}, _opt);
					console.log("压缩参数："+JSON.stringify(o));
					plus.zip.compressImage(o,
					function(event){//压缩成功
						console.log("压缩成功"+JSON.stringify(event));
						var d={
					    	path:event.target,
						    src:path,
						    compress:true,
						    metadata:{
						    	"width":event.target,
						    	"height":event.height,
						    	"size":event.size
						    }
					  };
					  owner.data.putCache(path,d)
					    iteminnercallback(d);
					   },
					   function(e){
					   	console.log("压缩失败"+JSON.stringify(e));
					        $.toast("压缩异常:"+e.message);
					   }
					);
				}
				
			}
		},true,function(result){
			console.log("压缩处理结果:"+JSON.stringify(result));
			var rs=[];
			for(var i=0;i<result.length;i++){
				rs.push(result[i].path)
			}
			callback(rs);
		});
	};
	//读取文件files 文件列表 路径列表。callback读取每个文件时候的回调函数
	owner.resolveFile=function(files,itemcallback,iteminnercallback,callback){
		var result=[];
		var _innerFn=function(i){
			
			if(files.length-1>=i){
				path=files[i];
				plus.io.resolveLocalFileSystemURL(path, function( entry ) {
					//modificationTime: (Date 类型 )文件或目录的最后修改时间size: (Number 类型 )文件的大小
	        		entry.file(function(metadata){
	        			if(!iteminnercallback){
	        				result.push(itemcallback(path,metadata));
	        			    _innerFn(i+1);
	        			}else{
	        				itemcallback(path,metadata,function(md){
	        					result.push(md);
	        			        _innerFn(i+1);
	        				});
	        			}
	        			
	        		}, function(){
	        			$.toast("读取文件失败");
	        		}, false );
	        	});
			}else{
				callback(result);
			}
			
		}
		//数组
		if(Object.prototype.toString.call(files)!='[object Array]'){
			var _f=files;
			files=[];
			files.push(_f);
		}
		_innerFn(0);
	}
	
	//图片选择
	owner.imagePicker={
		 // 拍照添加文件
            appendByCamera:function(callback,options){
	                plus.camera.getCamera().captureImage(function(e){
	                	console.log("拍照开始时间:"+owner.utils.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss.SSS"));
	                    plus.io.resolveLocalFileSystemURL(e, function(entry) { 
	                    //	console.log("拍照图片："+JSON.stringify(entry));
	                    var path = entry.toLocalURL(); 
	                    if(options.compress){
	                    	owner.compressImage([path],function(result){
	                    		console.log("拍照结束时间:"+owner.utils.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss.SSS"));
	                		    callback(result);
	                	    });
	                    }else{
	                    	console.log("拍照结束时间:"+owner.utils.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss.SSS"));
	                        callback(path);
	                    }
	                    
	                    //就是这里www.bcty365.com 
	                    }, function(e) { 
	                        mui.toast("读取拍照文件错误：" + e.message); 
	                    }); 
	    
	                });    
            },
            // 从相册添加文件
            appendByGallery:function(callback,options){
            	console.log("222")
            	 
            	console.log("是否多选：："+options["multiple"]+",数量限制:"+options["maxinum"]);
                plus.gallery.pick(function(e){
                	//获取图片信息
                	/*plus.io.resolveLocalFileSystemURL( e.files[0], function( entry ) {
                		entry.getMetadata(function(metadata){
                			
                		}, function(){
                			$.toast("读取文件失败");
                		}, false );
                	});*/
                	console.log("从相册选择开始时间:"+owner.utils.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss.SSS"));
                	if(options.compress){
                		owner.compressImage(e.files,function(result){
                		   console.log("返回结果:"+JSON.stringify(result));
                		   console.log("从相册选择结束时间:"+owner.utils.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss.SSS"));
                		   callback(result);
                	    });
                	}else{
                		console.log("从相册选择结束时间:"+owner.utils.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss.SSS"));
                		callback(e.files);
                	}
                	
                   // callback(e.files);
                },function(e){
                	owner.log.info(e );  
                },{filter:"image",multiple:options["multiple"],maximum:options["maxinum"],system:false});
            }
	};
	//文件组件
	owner.fileComponent={
		
		//显示-ele元素  id附件id
		show:function(ele,id){
			owner.ajax('imageshow',{
				type:"get",
				data:{id:id},
				success:function(data){
					document.getElementById(ele).src=owner.serverUrl()+data.src;
				}
				});
		},
		
		//上传时候需要构造的文件对象
		File:function(){
			//[{key:path,},{key:path}]
			this.paths=[];
			//{name:value}
			this.extras={};
			this.addFile=function(name,path){
				var obj={};
				obj[name]=path;
				this.paths.push(obj);
			};
			this.addExtras=function(name,value){
				this.extras[name]=value;
			};
		},
		//文件选择器 type options选项  0表示图片文件，1表示普通文件
		FilePicker:function(id,options,type){
			if(!options)options={};
			var opts={
				pickCall:options.pickCall ||function(path){
					console.log("选择的路径是:"+path);
				},
				multiple:(options["multiple"]==true),
				beforeTap:options.beforeTap||function(){//点击之前的回调，主要用来设定每次启动相册可选择图片的最大个数
					
				},
				maxinum:options.maxinum||'Infinity',
				compress:true //是否压缩
			}; 
			if(type!=1)type=0;
			this.element=document.getElementById(id);
			if(type==0){ 
				this.element.addEventListener("tap",function(){
					console.log("文件上传按钮........");
					opts.maxinum = opts.beforeTap()||opts.maxinum;
					console.log("点击时候::最大图片个数："+opts.maxinum);
					plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
	                        {title:"拍照"},  
	                        {title:"从相册中选择"}  
	                    ]}, function(e){//1 是拍照  2 从相册中选择  
	                        switch(e.index){  
	                        case 1:owner.imagePicker.appendByCamera(opts.pickCall,{compress:opts.compress});break;  
	                        case 2:owner.imagePicker.appendByGallery(opts.pickCall,{multiple:opts.multiple,maxinum:opts.maxinum,compress:opts.compress});break;  
	                    }  
	                }); 
				});
			}else{
				
			}
		},
		UploadTask:function(options){
			var opts={
				url:options.url||"",
				waitingTitle:options.watitingTile ||'上传中...',
				waitingTitleShow:options.waitingTitleShow||true,//是否显示等待提示,默认是true
				success:options.success||function(){
					console.log("上传成功")
				},
				error:options.error||function(){
					
				}
			};
			var wt=null;
			//上传任务
			var task = plus.uploader.createUpload(owner.getURL(opts.url),  
						{ method:"POST",blocksize:204800,priority:100 },  
						function ( t, status ) {  
							// 上传完成  
							if ( status == 200 ) {  
							   opts.success(t,status);
							} else {  
							   opts.error(t,status);
							}  
							if(opts.waitingTitleShow)wt.close(); //关闭等待提示按钮
				       }
            );
            
            this.task=task;
            
            this.upload=function(fileObj){
            	if(!fileObj instanceof owner.fileComponent.File){
					throw new Error(imgObj+"is not a instance of imageComponent.image");
				}
            	//显示等待
			    if(opts.waitingTitleShow)wt=plus.nativeUI.showWaiting(opts.waitingTitle);
            	/*if(task && task.state) {
            		owner.log.info(task,"取消前");
            		console.log("先取消："+task.state);
            		plus.uploader.clear(task.state);
            		owner.log.info(task,"取消后");
            		console.log("取消后状态：：："+task.state);
            	}*/
            	//添加附属属性  特别注意：addData一定要在addFile之前
        		for(var pro in fileObj.extras){//只取一个
        			//task.addData(属性名，属性值);
        			task.addData(pro,fileObj.extras[pro]);
        		}
            	//添加文件
            	owner.log.info(fileObj.paths);
            	for(var i=0;i<fileObj.paths.length;i++){
            		for(var pro in fileObj.paths[i]){//只取一个
            			//task.addFile(路径,{key:属性名});
            			task.addFile(fileObj.paths[i][pro],{key:pro});
            			break;
            		}
            	}
            	task.start();
            }
		}
		
	};
	
	//窗口打开
	//需要class mui-openwindow  openwindow指定链接 openwindow-extras传参数
	owner.initOpenWindow=function(){
		$("body").on('tap','.mui-openwindow',function(){
		  //获取id
		  var url = this.getAttribute("openwindow");
		  if(!url){
		  	$.alert("该功能暂未开放");
		  	return;
		  }
		  var data = this.getAttribute("openwindow-extras");
		  if(data){
		  	data=eval("("+data+")");
		  }
		  owner.log.info(data,"打开["+url+"]传入的页面参数");
		  //打开新闻详情
		  mui.openWindow({
		    id:url,
		    url:url,
		    show:{
		    	aniShow: 'pop-in'
		    },
		     extras:data
		  });
       });
		
	};
	
	app.externalForce={
		signState:function(state){
			switch(n)
			{
				case 10:
				  return "已派单";
				case 20:
				  return "审核不通过";
				case 30:
				  return "审核通过";
				case 40:
				  return "已签单";
				case 50:
				  return "已督查";
				case 60:
				  return "班长验收";
				default:
				  return "未知";
			}
		}
	};
}(mui, window.app = {}));