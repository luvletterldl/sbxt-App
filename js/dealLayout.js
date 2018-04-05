(function($, owner) {
	deall.dealGrids = function(data, element) {
		function colChoice(cols) {
			if(cols == 1) {
				divClassTemp = "mui-col-sm-12 div-ldl grid";
			} else if(cols == 2) {
				divClassTemp = "mui-col-sm-6 div-ldl grid";
			} else if(cols == 3) {
				divClassTemp = "mui-col-sm-4 div-ldl grid";
			} else if(cols == 4) {
				divClassTemp = "mui-col-sm-3 div-ldl grid";
			} else if(cols == 5) {
				divClassTemp = "mui-col-sm-5-1 div-ldl grid";
			} else if(cols == 6) {
				divClassTemp = "mui-col-sm-2 div-ldl grid";
			} else if(cols == 7) {
				divClassTemp = "mui-col-sm-7-1 div-ldl grid";
			} else if(cols == 8) {
				divClassTemp = "mui-col-sm-8-1 div-ldl grid";
			} else {
				divClassTemp = false;
				mui.alert("参数超出限制");
			}
			return divClassTemp;
		}

		function choiceCol(cols) {
			if(cols == 1) {
				divClassTemp = "mui-col-sm-12 ldl-div grid";
			} else if(cols == 2) {
				divClassTemp = "mui-col-sm-6 ldl-div grid";
			} else if(cols == 3) {
				divClassTemp = "mui-col-sm-4 ldl-div grid";
			} else if(cols == 4) {
				divClassTemp = "mui-col-sm-3 ldl-div grid";
			} else if(cols == 5) {
				divClassTemp = "mui-col-sm-5-1 ldl-div grid";
			} else if(cols == 6) {
				divClassTemp = "mui-col-sm-2 ldl-div grid";
			} else if(cols == 7) {
				divClassTemp = "mui-col-sm-7-1 ldl-div grid";
			} else if(cols == 8) {
				divClassTemp = "mui-col-sm-8-1 ldl-div grid";
			} else {
				divClassTemp = false;
				mui.alert("参数超出限制");
			}
			return divClassTemp;
		}
		var flag = false;
		var divClassTemp, allgrid;
		allgrid = data.col * data.row;
		console.log("行：" + data.col + ",列：" + data.row + ",格子总数:" + allgrid);
		var dacol = parseInt(data.col);
		for(var n = 0; n < allgrid; n += dacol) {
			flag = !flag;
			if(flag) {
				//正常顺序生成一行
				var liEle = app.createElement('li', {
					className: "ldl-li"
				});
				var outDiv = app.createElement('div', {
					className: "mui-row"
				});
				choiceCol(data.col);
				for(var i = 0; i < data.col; i++) {
					var innerDiv = app.createElement('div', {
						attrs: {
							"id": (n + i + 1),
						},
						innerHTML: (n + i + 1),
						className: divClassTemp
					});
					outDiv.appendChild(innerDiv);
					//					console.log("顺序添加一个内层div--" + (n + i + 1));
				}
				liEle.appendChild(outDiv);
				element.appendChild(liEle);
			} else {
				//倒序生成一行
				var liEle = app.createElement('li', {
					className: "ldl-li"
				});
				var outDiv = app.createElement('div', {
					className: "mui-row"
				});
				colChoice(data.col);
				for(var i = data.col; i > 0; i--) {
					var i = parseInt(i);
					var innerDiv = app.createElement('div', {
						attrs: {
							"id": (n + i)
						},
						innerHTML: (n + i),
						className: divClassTemp
					});
					outDiv.appendChild(innerDiv);
					//					console.log("倒序添加一个内层div" + (n + i));
				}
				liEle.appendChild(outDiv);
				element.appendChild(liEle);
			}
		}
		console.log("规划图生成一阶段完成");
	}
	//生成采样button
	deall.generateSampBtn = function(arr,insertSite) {
		for(var i = 0; i < arr.length; i++) {
			var sampBtn = app.createElement('button', {
				className: 'mui-btn mui-btn-red sampbtn',
				attrs: {
					'type': "button"
				},
				innerHTML:arr[i]
			});
			insertSite.appendChild(sampBtn);
			insertSite.style.display = 'block';
		}
	}
}(mui, window.deall = {}));