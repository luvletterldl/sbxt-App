//定位服务
//console.log("*****"+position.coords.altitude);
//latitude纬度x, longitude经度 y,altitude高度z
(function($,owner){
	owner.geolocation={};
	var geolocation=new BMap.Geolocation();
	owner.geolocation.postion=function(success){
		$.toast("正在获取定位...");
		geolocation.getCurrentPosition(function(pos){
			console.log("获取当前位置："+JSON.stringify(pos));
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				if(typeof success=='function')success(pos);
			}
			else {
				alert('failed'+this.getStatus());
			}        
			
		},{enableHighAccuracy: true});
	};
	owner.geolocation.postion=function(success){
		var options = {
			enableHighAccuracy: true,
			maximumAge: 1000
		}
		if(navigator.geolocation) { //浏览器支持geolocation 
			$.toast("开始定位");
			navigator.geolocation.getCurrentPosition(function(position){
				    owner.log.info(position.coords,"获取定位信息");
			        if(success)success(position.coords);
				}, function(error){
					console.log("获取定位信息失败:"+error);
					switch(error.code) {
						case 1:
							$.alert("位置服务被拒绝");
							break;
						case 2:
							$.alert("暂时获取不到位置信息");
							break;
						case 3:
							$.alert("获取信息超时");
							break;
						case 4:
							$.alert("未知错误");
							break;
					}
				}, options);
		} else { //浏览器不支持geolocation 
			$.alert("不支持定位功能");
		}
	}
}(mui,window.app));