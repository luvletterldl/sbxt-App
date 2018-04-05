 (function($, owner) {
 	
 	    owner.domUtils={
 	    	//前一个兄弟节点
 	    	next:function(dom,expression){
 	    		if(dom.nextSibling==null){
 	    			return null;
 	    		}
 	    		if(!expression){
 	    			return dom.nextSibling
 	    		}
 	    	},
 	    	//后一个兄弟节点
 	    	previous:function(dom,expression){
 	    		if(dom.previousSibling==null){
 	    			return null;
 	    		}
 	    		if(!expression){
 	    			return dom.previousSibling
 	    		}else{
 	    			var previous = dom.previousSibling;
 	    			if(expression.indexOf("#")==0){//id选择器
 	    				var id=expression.substring(1,expression.length);
 	    				while(previous!=null && previous.getAttribute("id")!=id){
 	    					previous=previous.previousSibling;
 	    				}
 	    			}else if(expression.indexOf(".")==0){//class选择器
 	    				
 	    			}else{//元素tagName
 	    				while(previous!=null && (previous.nodeType!=1 || previous.tagName!=expression.toUpperCase())){
 	    					previous=previous.previousSibling;
 	    				}
 	    			}
 	    			return previous;
 	    		}
 	    	}
 	    };
 	    owner.insertAfter=function(newElement, targetElement){
			var parent = targetElement.parentNode;
			if(parent.lastChild == targetElement){
			  parent.appendChild(newElement);
			}else{
			  parent.insertBefore(newElement, targetElement.nextSibling);
			}
 	    };
		owner.validation={
			messages:{
				 //必须的
			   	 required:"不能为空",
			   	 //英文字母
			   	 letter:"必须为英文字母",
			   	 //整数类型
			   	 integer:"必须为整数",
			   	 //eq
			   	 eqTo:"两个值不相等",
			   	 maxLength:"最大长度为{0}",
			   	 minLength:"最小长度为{0}",
			   	 //双精度类型
			   	 double:"必须为双精度类型,如100.00",
			   	 //字母和数字
			   	 string:"必须为字母或数字",
			   	 //中文
			   	 chinese:"必须为中文",
			   	 //邮箱
			   	 email:"邮箱格式不正确",
			   	 //手机
			   	 mobile:"手机号格式不正确",
		         //url地址
		         url:"url格式不正确",
		         eleNum:"至少要有{0}个"
		    },
		    rules:{
			   	 //必须的
			   	 required:function(value){return value!=null && value!=""},
			   	 //英文字母
			   	 letter:function(value){return /^[a-zA-Z]+$/.test(value)},
			   	 //整数类型
			   	 integer:function(value){return /^[-+]?\d*$/.test(value)},
			   	 //eq
			   	 eqTo:function(value1,value2){return value1==value2},
			   	 maxLength:function(value,length){ 
			   	 	var realLength = 0, len = value.length, charCode = -1;
					for (var i = 0; i < len; i++) {
					    charCode = value.charCodeAt(i);
					    if (charCode >= 0 && charCode <= 128) realLength += 1;
					    else realLength += 2;
				    }
				    return realLength<=length;
			   	 },
			   	 minLength:function(value,length){ 
			   	 	var realLength = 0, len = value.length, charCode = -1;
					for (var i = 0; i < len; i++) {
					    charCode = value.charCodeAt(i);
					    if (charCode >= 0 && charCode <= 128) realLength += 1;
					    else realLength += 2;
				    }
				    return realLength>=length;
			   	 },
			   	 //双精度类型
			   	 double:function(value){return /^[-\+]?\d+(\.\d+)?$/.test(value)},
			   	 //字母和数字
			   	 string:function(value){return /^[a-zA-Z0-9_]+$/.test(value)},
			   	 //中文
			   	 chinese:function(value){return /^[\u0391-\uFFE5]+$/.test(value)},
			   	 //邮箱
			   	 email:function(value){return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)},
			   	 //手机
			   	 mobile:function(value){return /^1[3|4|5|8][0-9]\d{4,8}$/.test(value)},
		         //url地址
		         url:function(value){return  /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(value)},
		         eleNum:function(ele,tag,num){ 
		         	var es =ele.querySelectorAll(tag);
		         	if(es !=null && es.length >= num)return true;
		         	return false;
		         }
		   }
		}
		//返回type message
		var validateType=function(type){
			if(owner.validation.rules[type]!=null){
				return {rule:owner.validation.rules[type],message:owner.validation.messages[type]}
			}
			return null;
		};
		
		//解析参数
		//type,param
		var method=function(str){
			var start=str.indexOf("("),end=str.lastIndexOf(")");
			if(start<0 || end<0){
				return {name:str};
			}
			var p =str.substring(start+1,end);
			if(p.indexOf("\|")<0){
				return {name:str.substring(0,start),param:p};
			}else{
				return {name:str.substring(0,start),param:p.split("\|")};
			}
			
		};
		
		/*
		 * ele:
		 * id:xxxx,msg:错误提示,target:id对应的dom元素
		 */
		var appendError=function(ele){
		    var newDom =owner.createElement("p",{
      	    	attrs:{
      	    		for:ele.id,
      	    		style:"color: red;font-style: italic;"
      	    	},
      	    	className:"mui-text-center",
      	    	innerHTML:ele.msg
      	    });
      	    var parent=ele.target.parentNode;
      	    if(!parent.classList.contains("mui-input-row")){
      	    	owner.insertAfter(newDom,ele.target);
      	    }else{
      	    	owner.insertAfter(newDom,parent);
      	    }
		}
		/**移除异常
		 * 
		 * @param {Object} id 元素id
		 * @param {Object} dom 元素id对应的dom元素
		 */
		var removeError=function(id,dom){
      	    var parent=dom.parentNode;
      	    if(!parent.classList.contains("mui-input-row")){
      	    	var old=parent.querySelector("p[for='"+id+"']");
      	    	if(old){
      	    		parent.removeChild(old);
      	    	}
      	    }else{
      	    	var old=parent.parentNode.querySelector("p[for='"+id+"']");
      	    	if(old){
      	    		parent.parentNode.removeChild(old);
      	    	}
      	    }
		};
		
		/**
		 * 验证模式2
		 * dom--验证某个dom下的所有字节点，如果没有就从document下查找
		 * 通过validate-rule属性进行校验,多个用逗号分隔
		 * <input validate-rule="required,maxLength(5)">
		 */
		owner.validateModel2=function(dom){
			var result=[];
			dom=dom||document;
			var ds = dom.querySelectorAll("*[validate-rule]");//查询所有的包含validate-rule属性的节点
			for(var i=0;i<ds.length;i++){
				var d=ds[i],//当前dom对象
				    value=d.value;//当前dom对象的值
				    placeholder=d.getAttribute("placeholder"),
				    preMsg="",
				    rule=d.getAttribute("validate-rule");//当前验证规则
				    if(placeholder){
				    	preMsg=placeholder;
				    }else{
				    	label=owner.domUtils.previous(d,"label");//label标签
				        preMsg=(label==null?"":label.innerText);
				    }
				if(typeof rule ==="string"){//值为字符串类型才进行校验
					var types=rule.split(",");
	   	  			for(var j in types){
	   	  				var m=method(types[j]);//验证类型，参数
	   	  				var type=validateType(m.name);//验证类型对应的方法，消息提示
	   	  				console.log(m.name);
	   	  				if(type && m.name=='required'){//非空验证
	   	  					if(!type.rule(value)){
	   	  						result.push(preMsg+type.message);
	   	  						break;
	   	  					}
	   	  				}else if(type && m.name=='eleNum'){//元素个数
	   	  					if(!type.rule(d,m.param[0],m.param[1])){
	   	  						result.push(preMsg+type.message.replace("{0}",m.param[1]));
	   	  						break;
	   	  					}
	   	  				}else if(type && (value != null  || value!='')){
	   	  					if(!type.rule(value,m.param)){
	   	  						result.push(preMsg+type.message.replace("{0}",m.param));
	   	  						break;
	   	  					}
	   	  				}
	   	  			}
				}
			}
			if(result.length>0){
				if(window._btnMui)window._btnMui.button("reset");
				$.alert(result.join("<br/>"),"表单校验失败","确定",null,"div");
				return false;
			}
			return true;
		}
		
		//校验模式
		//[{rule:,msg}]
		owner.validateModel=function(eles){
			var result=[];//校验结果
			for(var i=0;i<eles.length;i++){
			 	var value=document.getElementById(eles[i].id).value;//当前校验元素
			 	//规则
			 	for(var rule in eles[i].rules){
			 		var m=method(rule),//当前校验方法,参数
				 	    msg=eles[i].rules[rule],//校验失败的消息提示
				 	    type=validateType(m.name);//验证类型对应的方法，消息提示
			 	    if(type && m.name=='required'){//非空验证
	  					if(!type.rule(value)){
	  						result.push(msg||type.message);
	  						break;
	  					}
	  				}else if(type && (value != null  || value!='')){
	  					if(!type.rule(value,m.param)){
	  						result.push(msg||type.message);
	  						break;
	  					}
	  				}  
			 	}
			}
			
			if(result.length>0){
				$.toast(result.join("<br/>"),{ duration:'long', type:'div' });
				return false;
			}
			return true;
			
		};
	   /**
	    * 数据校验验证:
	    * 两种方式：
	    * 1.[{required:true,message:'']
	    * 2.rules:"required,email"
	    * 
	    * {id: rules:[{required},{}]}
	    */
	   owner.validate=function(eles){
	   	  //
	   	  var result=[];
	   	  for(var i=0;i<eles.length;i++){
	   	  	var _ele=eles[i];
	   	  	var dom=document.getElementById(_ele.id);
	   	  	var value=dom.value;//dom值
   	  		var rule=_ele.rule;
   	  		if(typeof rule=="string"){//字符串类型
   	  			var types=rule.split(",");
   	  			for(var j in types){
   	  				var m=method(types[j]);//验证类型，参数
   	  				var type=validateType(m.name);//验证类型对应的方法，消息提示
   	  				if(type && m.name=='required'){//非空验证
   	  					if(!type.rule(value)){
   	  						result.push({id:_ele.id,msg:type.message,target:dom});
   	  						break;
   	  					}
   	  				}else if(type && (value != null  || value!='')){
   	  					if(!type.rule(value,m.param)){
   	  						result.push({id:_ele.id,msg:type.message.replace("{0}",m.param),target:dom});
   	  						break;
   	  					}
   	  				}
   	  			}
   	  		}
	   	    
	   	    //移除异常
	   	    removeError(_ele.id,dom);
	   	  }
	      
	      if(result.length>0){
	      	//错误处理
	      	for(var i=0;i<result.length;i++){
	      		console.log(result[i]);
	      		//
	      	    appendError(result[i]);
	      	}
	      	return false;
	      }
	      
	      return true;
	   };
}(mui, window.app));