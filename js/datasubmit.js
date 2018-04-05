(function($, owner) {
	//用于数据加载
	//必要参数：url 数据加载地址
	//  options 其他选项
	owner.DataSubmit=function(options){
		this.fileurl=options.fileurl;//文件上传路径
		this.dataurl=options.dataurl;//数据上传路径
		this.whenFileUpload=options.whenFileUpload;//每次文件上传成功以后
		this.extras=null;
		this.extrasBeforeSubmit=options.extrasBeforeSubmit;//扩展参数提交之前
		this.extrasSubmitType = options.extrasSubmitType ||"post";//提交类型
		this.success=options.success;
		this.error=options.error;
		this.files=null;//当前文件
		this.index=0;//当前文件上传索引
		var _this=this;
		//创建一个提交任务
		this.task = null;
		var wt = null;
		_waitting={
            	show:function(waitingTitle){
            		console.log("开始show检查之前"+wt);
            		if(wt){
            			console.log("需要先关闭");
            			wt.close();
            		}
            		wt=plus.nativeUI.showWaiting(waitingTitle);
            		console.log("开始show之后"+wt);
            	},
            	close:function(){
            		wt.close();
            	}
        };
		function createTask(){
			_this.task = new owner.fileComponent.UploadTask({url:_this.fileurl,
			control:true,
			success:function(t, status){
					//成功以后：
					var m =_this.files[_this.index].lastIndexOf("/");
					var filename = _this.files[_this.index].substring(m+1,_this.files[_this.index].length);
					if(_this.whenFileUpload)_this.whenFileUpload(t, status,filename);//回调，用于记录返回值
					if(_this.index==_this.files.length-1){//最后一个，提交表单数据
						_submitForm();//
		    	    }else{
		    	       _this.index++;
					   _callback();//继续传下一个文件
		    	    }
				},
				error:function(t, status){
					if(window._btnMui)window._btnMui.button("reset");
					console.log("附件信息上传失败:"+status)
				}
			});
		}
		//最后的表单提交
		var _submitForm=function(){
			if(_this.extrasBeforeSubmit) _this.extras = _this.extrasBeforeSubmit(_this.extras);
			_waitting.show("提交表单数据...");
			
    		owner.ajax(_this.dataurl,{
				data :_this.extras,
				type:_this.extrasSubmitType,
				success:function(data){
					if(_this.success){
						_this.success(data);
					}
					_waitting.close();
				},
				error:function(xhr,type){
					if(_this.error){
						_this.error(xhr,type, error);
					}else{
						if(type=="timeout"){
				            plus.nativeUI.toast("连接服务超时");
    					}else{
    						plus.nativeUI.toast("服务异常");
    					}
					}
					_waitting.close();
				}
		   });
		}
		//成功回调函数
	    var _callback=function(){
    		var fileObj=new owner.fileComponent.File();
	    	fileObj.addFile("file",_this.files[_this.index]);
	    	createTask()
	    	_waitting.show("上传第["+(_this.index+1)+"]个文件,共"+_this.files.length+"个文件");
	    	_this.task.upload(fileObj);
	    };
		
		//提交数据{files:[path1,path2,path3],extras:{name1,value1}}
		this.submit=function(data){
			_this.files=data.files;
			_this.extras=data.extras;
			if(!_this.files || _this.files.length<=0){
				console.log("没有文件可上传");
				_submitForm();
			}else{
				_callback();
			}
		};
	};
	
}(mui, window.app));
