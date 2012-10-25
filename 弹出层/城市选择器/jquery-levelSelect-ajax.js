/*
通用数据水平层级选择控件
作者：绿豆糕
版本：v0.70
修改时间：2010年11月22日
要求数据格式：纯文本，数据项之间以","分隔，数据项数值和描述文本之间以":"分隔，可以在参数中自定义分隔符。
*/
;(function($){
//弹出层
$.openLayer = function(p){
	var param = $.extend({
		maxItems : 5,					//最多选取项数字限制
		showLevel : 5,					//显示级别
		oneLevel : true,				//是否限制选择相同级别的数据，可以不为同一个父节点，
										//false为不限制，可以同时选择不同级别的数据，true为限制。
		onePLevel : false,				//是否限制选择相同级别,并且是同一个父节点的数据，
										//false为不限制，可以同时选择不同级别的数据，true为限制。
										//此参数只有在oneLevel:true时才有效
		splitChar : ",:",				//数据分隔符，第一个字符为各项之间的分隔符，第二个为每项中id和显示字符串的分隔符。
		returnValue : "",				//以，分隔的选取结果id存放的位置id，默认为一个input。
		returnText : "",				//以，分隔的选取结果文字存放的位置id，可以为span，div等容器。
		title : "绿豆糕通用水平选择器 ver：0.70",				//弹出窗口标题
		width : 650,					//弹出窗口宽度
		span_width : {d1:70,d3:150},	//可以自定义每一层级数据项显示宽度，用来对其排版。
		url : "",						//ajax请求url
		pid : "0",						//父id
		shared : true,					//如果页面中有多于1个的弹出选择,是否共享缓存数据
		index : 1,						//如果页面中有多于1个的弹出选择,如果不共享之前的操作界面则必须设置不同的index值，否则不同的弹出选择共享相同的操作界面。
		cacheEnable : true,				//是否允许缓存
		dragEnable : true,				//是否允许鼠标拖动
		pText : ""
	},p||{});

	var fs = {
		init_Container : function(){	//初始化头部和内容容器
			//标题
			var TITLE = param.title + ",最多能选择 " + param.maxItems + " 项！";
			var CLOSE = "<span id='_cancel' style='cursor:pointer;'>[取消]</span>&nbsp;&nbsp;<span id='_ok' style='cursor:pointer;'>[确定]</span>";
			//头部
			var htmlDiv = "<div id='heads'><div id='headdiv'><span id='title'>" + TITLE + "</span><span id='close'>" + CLOSE + "</span></div>";
			//内容容器创建部分
			htmlDiv += "<div id='container'></div></div>";
			return htmlDiv;
		},
		init_area : function(){			//初始化数据容器
			var _container = $("#container");
			//已选择项容器
			var selArea = $("<div id='selArea'><div>已选择项目：</div></div>");
			_container.append(selArea); 
			if (param.maxItems == 1){ selArea.hide(); }

			//初始化第一层级数据容器，以后各级容器都clone本容器
			var d1 = $("<div id='d1'></div>");
			var dc = $("<div id='dc'></div>");

			_container.append(dc).append(d1);//加入数据容器中
			dc.hide();
			fs.add_data(d1);//添加数据
		},
		add_data : function(targetid){					//添加数据到容器，添加事件，初始化下一层次容器
			targetid.nextAll().remove();				//删除目标容器之后的所有同级别容器

			var pid = param.pid;						//查询数据的参数，父id
			var url = param.url;						//ajax查询url
			var data = "";								//返回数据变量

			if(param.cacheEnable){ data = _cache[pid];}	//如果cache开启则首先从cache中取得数据
			
			//如果cache中没有数据并且url和pid都设置了,发起ajax请求
			if ((data == null || data == "") &&  url != ""){
				$.ajax({
					type : "post",						//post方式
					url : url,							//ajax查询url
					data : {pid:pid},					//参数
					async : false,						//同步方式，便于拿到返回数据做统一处理
					beforeSend : function (){ },		//ajax查询请求之前动作，比如提示信息……
					success : function (d) {			//ajax请求成功后返回数据
						data = d;
						if(param.cacheEnable){ _cache[pid] = data;}		//cache允许,保存数据到cache
					}
				});
			}

			//cache和ajax都没有数据或者错误,添加提示信息返回
			if(data == "" || data == null){
				targetid.empty().show().append($("<span style='color:red;'>没有下级数据！</span>"));
				return;
			}

			var span_width = eval("param.span_width."+targetid.attr("id"));			//每个数据显示项的宽度
			span_width = (span_width == undefined ? param.span_width.d1:span_width );//没有设置的话，就使用第一个数据容器的值
			var inspan_width = ($.browser.msie)?1:3;								//内部文字和checkbox之间的距离
	
			var dat = data.split(param.splitChar.charAt(0));						//根据设定分隔符对数据做第一次分隔，获得数据项数组
			var html = [];															//格式化数据存放容器，为了提高效率，使用了数组
			var ss = [];
			//循环获得格式化的显示字符串
			for(var i = 0 ; i < dat.length ; i++){
				ss = dat[i].split(param.splitChar.charAt(1));		//第二次分隔，获得每个数据项中的数据值和显示字符串
				html.push("<span title='"+dat[i]+"' name='"+pid+"' style='width:"+span_width+"px;white-space:nowrap;float:left;'>");
				html.push("<input type='checkbox' value='" + ss[0] + "'>");
				html.push("<span name='"+targetid.attr("id")+"' style='margin-left:"+inspan_width+"px;'>" + ss[1] + "</span>");
				html.push("</span>");
			}
			targetid.empty().show().append($(html.join("")));		//格式化的html代码放入目标容器
			if(param.maxItems > 1){fs.change_status(targetid);}		//同步状态,单选状态无必要
				
			fs.add_input_event(targetid);							//加入input的事件绑定
			fs.add_span_event(targetid);							//加入span的事件绑定
		},
		init_event : function(){		//绑定已选择框中checkbox的事件，确定，取消事件响应
			$("#selArea").find(":input").live("click",function(){
				$(this).parent().remove();
				$("#container > div").find(":input[value="+this.value+"]").attr("checked",false);
			});
			$("#_cancel").click(function(){
				$("#bodybg").hide();
				$("#popupAddr").fadeOut();
			});
			$("#_ok").click(function(){
				var vals = "";
				var txts = "";
				$("#selArea").find(":input").each(function(i){
					vals += ("," + this.value);
					txts += ("," + $(this).next().text());
				});
				fs.set_returnVals(param.returnValue,vals);
				fs.set_returnVals(param.returnText,txts);
		
				$("#bodybg").hide();
				$("#popupAddr").fadeOut();
			});
		},
		change_status : function(targetid){ //切换不同元素，形成不同下级列表时候，同步已选择区的元素和新形成区元素的选中状态
			var selArea = $("#selArea");
			var selinputs = selArea.find(":input");
			var vals =[];

			if(selinputs.length > 0){
				selinputs.each(function(){ vals.push(this.value); });
			}
			targetid.find(":input").each(function(){
				if($.inArray(this.value,vals) != -1){ this.checked = true; }
			});
		},
		add_input_event : function(targetid){	//新生成的元素集合添加input的单击事件响应
			var selArea = $("#selArea");
			targetid.find(":input").click(function(){
				if (param.maxItems == 1){
					selArea.find("span").remove();
					$("#container > div").find(":checked:first").not($(this)).attr("checked",false);
					$(this).css("color","white");
					selArea.append($(this).parent().clone());
					$("#_ok").click();
				}else {
					if(this.checked && fs.check_level(this) && fs.check_num(this)){
						selArea.append($(this).parent().clone().css({"width":"","background":"","border":""}));
					}else{
						selArea.find(":input[value="+this.value+"]").parent().remove();
					}			
				}
			});
		},
		add_span_event : function(targetid){	//新生成的元素集合添加span的单击事件响应
			var maxlev = param.showLevel;
			var thislevel = parseInt(targetid.attr("id").substring(1));
	
			var spans = targetid.children("span");
			spans.children("span").click(function(e){
				if (maxlev > thislevel){
					var next=$("#dc").clone();
					next.attr("id","d"+(thislevel+1));
					targetid.after(next);
			
					spans.css({"background":"","border":"","margin":""});
					$(this).parent().css({"background":"orange","border":"1px ridge","margin":"-1"});
					param.pid = $(this).prev().val();
					fs.add_data(next,param);
				}else{
					alert("当前设置只允许显示" +  maxlev + "层数据！");
				}
			});
		},
		check_num : function(obj){	//检测最多可选择数量
			if($("#selArea").find(":input").size() < param.maxItems){
				return true;
			}else{
				obj.checked = false;
				alert("最多只能选择"+param.maxItems+"个选项");
				return false;
			}
		},
		check_level : function(obj){	//检测是否允许选取同级别选项或者同父id选项
			var selobj = $("#selArea > span");
			if(selobj.length ==0) return true;

			var oneLevel = param.oneLevel;
			if(oneLevel == false){
				return true;
			}else{
				var selLevel = selobj.find("span:first").attr("name");		//已选择元素的级别
				var thislevel = $(obj).next().attr("name");					//当前元素级别
				if(selLevel != thislevel) {
					obj.checked = false;
					alert("当前设定只允许选择同一级别的元素！");
					return  false;
				}else{
					var onePLevel = param.onePLevel;		//是否设定只允许选择同一父id的同级元素
					if (onePLevel == false) {
						return true;
					}else{
						var parentId = selobj.attr("name");					//已选择元素的父id
						var thisParentId = $(obj).parent().attr("name");	//当前元素父id
						if (parentId != thisParentId){
							obj.checked = false;
							alert("当前设定只允许选择同一级别并且相同上级的元素！");
							return false;
						}
						return true;
					}
				}
			}
		},
		set_returnVals : function(id,vals) {	//按"确定"按钮时处理、设置返回值
			if(id != ""){
				var Container = $("#" + id);
				if(Container.length > 0){
					if(Container.is("input")){
						Container.val(vals.substring(1));
					}else{
						Container.text(vals.substring(1));
					}
				}
			}	
		},
		init_style : function() {	//初始化css
			var _margin = 4;
			var _width = param.width-_margin*5;

			var css = [];
			var aotu = "border:2px groove";
			css.push("#popupAddr {position:absolute;border:3px ridge;width:"+param.width+"px;height:auto;background-color:#e3e3e3;z-index:99;-moz-box-shadow:5px 5px 5px rgba(0,0,0,0.5);box-shadow:5px 5px 5px rgba(0,0,0,0.5);filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=5,OffY=5,Color=gray);-ms-filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=5,OffY=5,Color='gray');}");
			css.push("#bodybg {width:100%;z-index:98;position:absolute;top:0;left:0;background-color:#fff;opacity:0.1;filter:alpha(opacity =10);}");
			css.push("#heads {width:100%;font-size:12px;margin:0 auto;}");
			css.push("#headdiv {color:white;background-color:green;font-size:13px;height:25px;margin:1px;" +aotu+"}");
			css.push("#title {line-height:30px;padding-left:20px;float:left;}");
			css.push("#close {float:right;padding-right:12px;line-height:30px;}");
			css.push("#container {width:100%;height:auto;}");
			css.push("#selArea {width:"+_width+"px;height:48px;margin:"+_margin+"px;padding:5px;background-color:#f4f4f4;float:left;"+aotu+"}");
			css.push("#pbar {width:"+_width+"px;height:12px;margin:4px;-moz-box-sizing: border-box;display:block;overflow: hidden;font-size:1px;border:1px solid red;background:#333333;float:left;}");
	
			var d_css = "{width:"+_width+"px;margin:"+_margin+"px;padding:5px;height:auto;background-color:khaki;float:left;"+aotu+"}";
			css.push("dc "+d_css);
			for (i = 1; i <=param.showLevel; i++) { css.push("#d" + i + " " + d_css); }
			$("head").append($("<style>"+css.join(" ")+"</style>"));
		}
	};

	if (window._cache == undefined || !param.shared ){ _cache = {}; }
	if (window._index == undefined) { _index = param.index; }

	fs.init_style();//初始化样式

	var popupDiv = $("#popupAddr");	//创建一个div元素
	if (popupDiv.length == 0 ) {
		popupDiv = $("<div id='popupAddr'></div>");
		$("body").append(popupDiv);
	}
	var yPos = ($(window).height()-popupDiv.height()) / 2;
	var xPos = ($(window).width()-popupDiv.width()) / 2;
	popupDiv.css({"top": yPos,"left": xPos}).show();
	
	var bodyBack = $("#bodybg");  //创建背景层
	if (bodyBack.length == 0 ) {
		bodyBack = $("<div id='bodybg'></div>");
		bodyBack.height($(window).height());
		$("body").append(bodyBack);
		popupDiv.html(fs.init_Container());	//弹出层内容
		fs.init_area();
		fs.init_event();
	}else {
		if (_index != param.index) {
			popupDiv.html(fs.init_Container(param));
			fs.init_area();
			fs.init_event();
			_index = param.index;
		}
	}

	if (param.dragEnable) {		//允许鼠标拖动
		var _move=false;		//移动标记
		var _x,_y;				//鼠标离控件左上角的相对位置
		popupDiv.mousedown(function(e){
			_move=true;
			_x=e.pageX-parseInt(popupDiv.css("left"));
			_y=e.pageY-parseInt(popupDiv.css("top"));
		}).mousemove(function(e){
			if(_move){
				var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
				var y=e.pageY-_y;
				popupDiv.css({top:y,left:x});//控件新位置
		}}).mouseup(function(){ _move=false; });
	}
	bodyBack.show();
	popupDiv.fadeIn();
}

})(jQuery)

_cache ={"0":"0100:北京市,0200:上海,0300:广东省,0500:天津市,0600:重庆市,0700:江苏省,0800:浙江省,0900:四川省,1000:海南省,1100:福建省,1200:山东省,1300:江西省,1400:广西,1500:安徽省,1600:河北省,1700:河南省,1800:湖北省,1900:湖南省,2000:陕西省,2100:山西省,2200:黑龙江省,2300:辽宁省,2400:吉林省,2500:云南省,2600:贵州省,2700:甘肃省,2800:内蒙古,2900:宁夏,3000:西藏,3100:新疆,3200:青海省,3300:香港,3400:澳门,3500:台湾,3600:国外"
,"0300":"0302:广州市,0303:惠州市,0304:汕头市,0305:珠海市,0306:佛山市,0307:中山市,0308:东莞市,0310:从化市,0314:韶关市,0315:江门市,0316:增城市,0317:湛江市,0318:肇庆市,0319:清远市,0320:潮州市,0321:河源市,0322:揭阳市,0323:茂名市,0324:汕尾市,0325:顺德市"
,"0700":"0702:南京市,0703:苏州市,0704:无锡市,0705:常州市,0706:昆山市,0707:常熟市,0708:扬州市,0709:南通市,0710:镇江市,0711:徐州市,0712:连云港市,0713:盐城市,0714:张家港市"
,"0800":"0802:杭州市,0803:宁波市,0804:温州市,0805:绍兴市,0806:金华市,0807:嘉兴市,0808:台州市,0809:湖州市,0810:丽水市,0811:舟山市,0812:衢州市"
,"0900":"0902:成都市,0903:绵阳市,0904:乐山市,0905:泸州市,0906:德阳市,0907:宜宾市,0908:自贡市,0909:内江市,0910:攀枝花市"
,"1000":"1002:海口市,1003:三亚市"
,"1100":"1102:福州市,1103:厦门市,1104:泉州市,1105:漳州市,1106:莆田市,1107:三明市,1108:南平市,1109:宁德市,1110:龙岩市"
,"1200":"1202:济南市,1203:青岛市,1204:烟台市,1205:潍坊市,1206:威海市,1207:淄博市,1208:临沂市,1209:济宁市,1210:东营市,1211:泰安市,1212:日照市,1213:德州市"
,"1300":"1302:南昌市,1303:九江市"
,"1400":"1402:南宁市,1403:桂林市,1404:柳州市,1405:北海市"
,"1500":"1502:合肥市,1503:芜湖市,1504:安庆市,1505:马鞍山市,1506:蚌埠市,1507:阜阳市,1508:铜陵市,1509:滁州市,1510:黄山市,1511:淮南市,1512:六安市,1513:巢湖市,1514:宣城市,1515:池州市"
,"1600":"1602:石家庄市,1603:廊坊市,1604:保定市,1605:唐山市,1606:秦皇岛市,1607:沧州市"
,"1700":"1702:郑州市,1703:洛阳市,1704:开封市"
,"1800":"1802:武汉市,1803:宜昌市,1804:黄石市,1805:襄樊市,1806:十堰市,1807:荆州市,1808:荆门市,1809:孝感市,1810:鄂州市"
,"1900":"1902:长沙市,1903:株洲市,1904:湘潭市,1905:衡阳市,1906:岳阳市,1907:常德市,1908:益阳市,1909:郴州市,1910:邵阳市,1911:怀化市,1912:娄底市,1913:永州市,1914:张家界市"
,"2000":"2002:西安市,2003:咸阳市,2004:宝鸡市,2005:铜川市,2006:延安市"
,"2100":"2102:太原市,2103:运城市,2104:大同市,2105:临汾市"
,"2200":"2202:哈尔滨市,2203:伊春市,2204:绥化市,2205:大庆市,2206:齐齐哈尔市,2207:牡丹江市,2208:佳木斯"
,"2300":"2302:沈阳市,2303:大连市,2304:鞍山市,2305:营口市,2306:抚顺市,2307:锦州市,2308:丹东市,2309:葫芦岛市,2310:本溪市,2311:辽阳市,2312:铁岭市"
,"2400":"2402:长春市,2403:吉林市,2404:辽源市,2405:通化市"
,"2500":"2502:昆明市,2503:曲靖市,2504:玉溪市,2505:大理市,2506:丽江市,2507:蒙自市,2508:开远市,2509:个旧市,2510:红河州"
,"2600":"2602:贵阳市,2603:遵义市"
,"2700":"2702:兰州市,2703:金昌市"
,"2800":"2802:呼和浩特市,2803:赤峰市,2804:包头市"
,"2900":"2902:银川市"
,"3000":"3002:拉萨市,3003:日喀则市"
,"3100":"3102:乌鲁木齐市,3103:克拉玛依市,3104:喀什地区市"
,"3200":"3202:西宁市"
,"1607":"16071:黄骅市,16072:海兴,16073:盐山,16074:孟村"
,"1602":"16021:正定,16022:无极,16023:新华区"
,"16071":"160711:城关镇,160712:吕桥镇,160713:齐家务,160714:官庄乡,160715:李村,160716:黄骅港"};						//缓存