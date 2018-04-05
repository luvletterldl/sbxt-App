(function($, owner) {
	//用于数据加载
	//必要参数：url 数据加载地址
	//  options 其他选项
	owner.DataLoad = function(url, options) {

		this.url = url;
		this.popoverElement = null;
		this.currentReqParams = null; //当前请求参数
		this.options = {
			promptArea: document.getElementById(options["promptArea"]), //信息提示区域
			initReqParams: options.initReqParams || {}, //初始化参数
			nextReqParams: options.nextReqParams || function(currentReqParams) { //下一页参数
				return currentReqParams;
			},
			//返回一个元素，用来绑定行操作.如果返回的不是一个dom元素，则不绑定任何操作
			proccessRow: options.proccessRow || function(rowData) { //处理每行数据

			},
			//primaryKey:"",//返回数据的主键字段
			/*每条记录需要的操作
				{
					type:"openwindow",//操作类型 openwindow类型是页面跳转  click是当前点击操作
					openwindowExtras:function(rowData){//openwindow额外参数 当openwindow有效 需要有返回值
						
					},
					clickOperation:function(rowData){//操作 当click 有效
						
					},
					showCondition:function(rowData,rowElement){//如果有显示条件，返回true的时候显示，false的时候隐藏
						return true
					}
					label:""//标签
				}
				*/
			itemOperations: options.itemOperations || [],
		};
		var wt = null;
		var _waitting = {
			show: function(waitingTitle) {
				//	console.log("开始show检查之前"+wt);
				if(wt) {
					//	console.log("需要先关闭");
					wt.close();
				}
				wt = plus.nativeUI.showWaiting(waitingTitle);
			},
			close: function() {
				wt.close();
			}
		};
		var _this = this;
		//初始化话弹出菜单
		var _initPopover = function(rowData, rowElement) {
			var popoverShow = true;
			var itemOperations = _this.options.itemOperations;
			var primaryKey = _this.options.primaryKey;
			if(itemOperations && itemOperations.length > 0) {
				if(_this.popoverElement == null) {
					var pop = owner.createElement("div", {
						attrs: {
							id: "popover" + new Date().getTime()
						},
						className: "mui-popover",
						innerHTML: "<ul class='mui-table-view'>" +
							"</ul> " +
							"</a>"
					});
					document.body.appendChild(pop);
					_this.popoverElement = pop;
				}
				var oView = _this.popoverElement.querySelector(".mui-table-view");
				oView.innerHTML = ""; //清空子元素
				var str = "";
				//循环
				for(var i = 0; i < itemOperations.length; i++) {
					var oper = itemOperations[i];
					var oli = null;
					var isShow = true;
					if(typeof oper.showCondition == 'function') {
						isShow = oper.showCondition(rowData, rowElement);
					}
					if(isShow) {
						if(oper.type == 'openwindow') {
							oli = owner.createElement("li", {
								attrs: {
									id: "li" + rowData[primaryKey],
									"data-primary": rowData[primaryKey],
									openwindow: oper.url,
									"openwindow-extras": JSON.stringify({
										rowData: oper.openwindowExtras(rowData) || {}
									})
								},
								className: "mui-table-view-cell mui-openwindow",
								innerHTML: "<a href='#'>" + oper.label + "</a>"
							});
							oView.appendChild(oli);
						} else {
							oli = owner.createElement("li", {
								attrs: {
									id: "li" + rowData[primaryKey],
									"data-primary": rowData[primaryKey]
								},
								className: "mui-table-view-cell",
								innerHTML: "<a href='#'>" + oper.label + "</a>"
							});
							oli.rowData = rowData; //保存当前行数据
							oli.clickOperation = oper.clickOperation;
							oli.addEventListener("tap", function() {
								this.clickOperation(this.rowData, rowElement);
								$("#" + _this.popoverElement.getAttribute("id")).popover('toggle');
							});
							oView.appendChild(oli);
						}
					} else {
						if(itemOperations.length == 1) popoverShow = false;
					}

				}
				return popoverShow;
			}
			return false;
		};

		var _nextPage = function() {
			//下一页
			_this.currentReqParams["pageNum"] = _this.currentReqParams["pageNum"] + 1;

			_list(_this.options.nextReqParams(_this.currentReqParams));
		};
		//加载数据
		var _list = function(params) {
			_waitting.show("正在加载数据...");
			owner.ajax(_this.url, {
				data: params,
				success: function(data) {
					if(data && data.list) {
						if(data.list.length > 0) {
							for(var i = 0; i < data.list.length; i++) {
								var dom = _this.options.proccessRow(data.list[i]);
								if(dom instanceof HTMLElement) { //如果是dom元素
									//绑定事件
									dom.rowData = data.list[i];
									dom.addEventListener("tap", function() {
										var rowElement = this;
										if(this.rowElement) rowElement = this.rowElement;
										var show = _initPopover(this.rowData, rowElement);
										//console.log("tap"+_this.popoverElement);
										if(show) {
											$("#" + _this.popoverElement.getAttribute("id")).popover('toggle', this);
										} else {
											$.toast("无可处理的操作");
										}

									});
								} else {
									//console.log(dom+"不是一个dom元素");
								}
							}
							_this.options.promptArea.innerHTML = "<a class='iconfont'></a>" +
								"<div class='mui-media-body'></div>";
							if(data.pageNum == data.pages) { //无更多了
								_this.options.promptArea.querySelector(".iconfont").className = "iconfont icon-meiyougengduoliao";
								_this.options.promptArea.querySelector(".mui-media-body").innerHTML = "没有更多了";
								_this.options.promptArea.removeEventListener("tap", _nextPage);
							} else {
								_this.options.promptArea.querySelector(".iconfont").className = "iconfont icon-gengduo";
								_this.options.promptArea.querySelector(".mui-media-body").innerHTML = "点击查看更多";
								_this.options.promptArea.addEventListener("tap", _nextPage);
							}
						} else if(data.pageNum == 1) { //无数据
							_this.options.promptArea.innerHTML = "<a class='iconfont'></a>" +
								"<div class='mui-media-body'></div>";
							_this.options.promptArea.querySelector(".iconfont").className = "iconfont icon-wushuju";
							_this.options.promptArea.querySelector(".mui-media-body").innerHTML = "无数据";
						}
					} else { //没有数据
						_this.options.promptArea.innerHTML = "<a class='iconfont icon-wushuju'></a>" +
							"<div class='mui-media-body'>无数据</div>";
						if(data.pageNum == 1) {
							_this.options.promptArea.querySelector(".iconfont").className = "iconfont icon-wushuju";
							_this.options.promptArea.querySelector(".mui-media-body").innerHTML = "无数据";
						}
					}
					_waitting.close();
				},
				error: function(xhr, type, error) {
					_waitting.close();
					plus.nativeUI.toast("数据加载异常");
				}
			});
		};
		//初始化
		this.load = function(params) {
			//初始化信息提示区域
			_this.options.promptArea.innerHTML = "";
			//查询数据
			if(typeof(params) == 'undefined') {
				params = {};
				params.pageNum = 1;
				params.pageSize = 20;
			}
			_this.currentReqParams = params ? params : (this.currentReqParams || this.options.initReqParams)
			owner.log.info(_this.currentReqParams);
			_list(this.currentReqParams);
		}
	};

}(mui, window.app));