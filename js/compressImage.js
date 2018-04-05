// 压缩图片
//path: file:///storage/emulated/0/zuiyou/166816763.jpg
function compressImage(path) {
	var myDate = new Date();
	var myMins = myDate.getMinutes();
	var mySecs = myDate.getSeconds();
	var myMillSec = myDate.getMilliseconds();
	console.log(myMins+":"+mySecs+":"+myMillSec);
	console.log("开始压缩图片：" + path);
	plus.nativeUI.showWaiting();
	plus.zip.compressImage({
			src: path,
			dst: path.slice(0, -4) + "-n.jpg",
			quality: 20,
			format: "jpg",
			overwrite: true,
			width: '50%',
		},
		function(i) {
			var myDateA = new Date();
			var myMinsA = myDateA.getMinutes();
			var mySecsA = myDateA.getSeconds();
			var myMillSecA = myDate.getMilliseconds();
			plus.nativeUI.closeWaiting();
			console.log("压缩图片成功：" + JSON.stringify(i));
			console.log("压缩前:"+myMins+":"+mySecs+":"+myMillSec+"压缩后:"+myMinsA+":"+mySecsA+":"+myMillSecA);
		},
		function(e) {
			plus.nativeUI.closeWaiting();
			console.log("压缩图片失败：" + JSON.stringify(e));
		});
	console.log(path);
}