/*
 Jh.js
 Jquery Portal layout 
 可拖拽布局 
 Copyright (C) Jh 2012.4.11
 @author xiaofan
*/
var Jh = {	
	Config:{//CLASS样式配置
		tableCls:"form-list",
		tdCls:"form-text",
		tdCls2:"single",
		ulCls : "tag-list",
		layCls :"layout-list",
		min :"min",
		mintext:"\u6536\u8D77",
		max :"max",
		maxtext:"\u5C55\u5F00",
		close :"close",
		closetext :"\u5173\u95ED",
		refreshtext:"\u5237\u65B0",
		refresh :"refresh",
		_groupItemContent : "itemContent",
		_groupItemHead : "itemHeader",
		_groupWrapperClass  : "groupWrapper",
		_groupItemClass : "groupItem"
	}	
};
Jh.Layout=function(me){
	var _left = "portal_l"	,
		_center ="portal_m",
		_right ="portal_r";
	return me = {
		location:{//三列容器
			left:_left,
			center:_center,
			right:_right		
		},
		locationId : {
			left:"#"+_left,
			center:"#"+_center,
			right:"#"+_right
		},
		layoutCss : {
			0:"1:3",
			1:"3:1",
			2:"1:2:1",
			3:"1:1:2",
			4:"2:1:1",
			5:"1:1:1"
		},
		layoutText : {
			0 :"w250 w750 wnone",
			1 :"w750 w250 wnone",
			2 :"w250 w500 w250",
			3 :"w250 w250 w500",
			4 :"w500 w250 w250",
			5 :"w250 w250 w250"
		}
	}
}();

Jh.Util = {//工具类
	format : function (str, model) {//格式化指定键值的模板
		for (var k in model) {
			var re = new RegExp("{" + k + "}", "g");
			str = str.replace(re, model[k])
		}
		return str
	},
	refresh:function(){//刷新3个布局
		$("#"+Jh.Layout.left,"#"+Jh.Layout.center,"#"+Jh.Layout.right).sortable('refresh');
	},
	toBody:function(o){//往Body添加对象
		$("body").append(o);
	}
};
Jh.fn = function(me){//功能区
	return me = {
		init:function(data){//初始化
			me._ele = {};
			me._create();
			me._createWrap(data);
			me._bindEvent();
		},
		
		_create:function(){//创建自己
			var _box = $("<div id='header'/>");
			me.box = _box; 
			Jh.Util.toBody(_box);//往Body里添加自己
		},
		
		_createWrap:function(d){//创建外层容器
			var _table = me._createTable(Jh.Config.tableCls);
			me._ele.table = _table	
			me._createModuleList(d);
			me._createActionButton();
			me._addPanel(_table);			
		},
		
		_createTable:function(clsName){	//创建表格		
			var _t = $("<table/>").addClass(clsName);
			$("<tbody/>").append(me._createLayoutTr())
								  .append(me._createBaseTr())					 
								  .append(me._createActionTr())
								  .appendTo(_t);	
			return _t; 	
		},
		
		_createBaseTr:function(){//创建功能模块tr
			var	_td = me._createTd(Jh.Config.tdCls2),
				_tr = $("<tr>").append(me._createTd(Jh.Config.tdCls,"\u529F\u80FD\u6A21\u5757\u8BBE\u7F6E:"))
							   .append(_td);
			me._ele.mtd = _td;				   
			return _tr;
		},
		
		_createActionTr:function(){//创建按钮tr
			var _td = me._createTd(Jh.Config.tdCls2),
				_tr = $("<tr>").append(me._createTd(Jh.Config.tdCls))
							.append(_td);
			me._ele.atd = _td;	
			return _tr;
		},
		
		_createLayoutTr:function(){//创建布局
			var _td = me._createTd(Jh.Config.tdCls2),
				_div = $("<div/>").addClass(Jh.Config.layCls)
								  .append(me._createA("1:3"))
								  .append(me._createA("3:1"))
							 	  .append(me._createA("1:1:2"))
								  .append(me._createA("1:2:1"))
								  .append(me._createA("2:1:1"))
								  .append("<a href='javascript:void(0);' class='active' rel='1:1:1'>\u9ED8\u8BA4</a>")
								  .appendTo(_td),
				_tr = $("<tr>").append(me._createTd(Jh.Config.tdCls,"\u5E03\u5C40\u8BBE\u7F6E:")).append(_td);

			me._ele.layoutTd = _td;
			return _tr;
		},
		
		_createModuleList:function(data){//创建模块list
			var _ul = $("<ul/>").addClass(Jh.Config.ulCls);
			me._createLis(data.appL,_ul);
			me._createLis(data.appM,_ul);
			me._createLis(data.appR,_ul);
			me._ele.ul = _ul;
			_ul.appendTo(me._ele.mtd);
		},
		
		_createActionButton:function(){//创建功能按钮
			var _add = $("<a class='button b' href='#' >\u6DFB\u52A0\u6A21\u5757</a>");
			var _save= $("<a class='button b' href='#' >\u4FDD\u5B58\u914D\u7F6E</a>");
			me._ele.atd.append(_add).append(_save);
			me._bindAdd(_add);
			me._bindSave(_save);
		},		
		
		_createLis:function(obj,_ul){//创建li列表
			$.each(obj,function(key,name){				
				_ul.append(me._createLi(key,name));
			});	
		},
		
		_createA:function(text){//创建A
			return $("<a href='javascript:void(0);' rel='"+text+"'>"+text+"</a>");
		},
		
		_createLi:function(key,name){//创建li
			return $("<li/>").append("<a href='#' rel='"+key+"'>"+name+"</a>")
						.append("<span class='ok'></span>");
		},
		
		_createTd:function(clsName,text){//创建td
			var t = $("<td>").addClass(clsName);
			if(text!=undefined){
				t.text(text);
			}
			return  t; 
		},
		_addPanel:function(o){
			me.box.append(o);		
		},
		
		_bindAdd:function(obj){//添加模块
			obj.click(function(){
				 var clicked = function(){
					 var form = $(this).children('form'),
						 name = form.children('#modulename').val(),
						 key  = form.children("#modulekey").val(),	
						 layout = form.children("input[name='modulelayout']:checked").val(),
						 position ;
					if(layout=='left'){
						position = $("#"+Jh.Layout.location.left);
					}else if(layout=='center'){
						position = $("#"+Jh.Layout.location.center);
					}else{
						position = $("#"+Jh.Layout.location.right);
					}
					 me._ele.ul.append(me._createLi(key,name));//添加功能标签
					 position.append(Jh.Portal._createPortalOne(key,name));//添加portal
					 $.fallr('hide');
				 };
				 $.fallr('show', {
					 buttons : {
						 button1 : {text: '\u786E\u5B9A', onclick: clicked},
						 button2 : {text: '\u53D6\u6D88'}
					 },
					 content : '<form style="margin-left:20px">'+
								 '<p>\u6A21\u5757\u540D:</p><input type="text" size="15" id="modulename" />'+
								 '<p>\u6A21\u5757Code:</p><input type="text" size="15" id="modulekey" />'+
								 '<p>\u6A21\u5757\u4F4D\u7F6E:</p>\u5DE6:<input type="radio" name="modulelayout" checked="checked" value="left"/>&nbsp&nbsp'+
												 '\u4E2D:<input type="radio" name="modulelayout" value="center"/>&nbsp&nbsp'+
												 '\u53F3:<input type="radio" name="modulelayout" value="right"/>'+								
								'</form>',
					 icon    : 'add',
					 position: 'center'
				 });
			});
		
		},
		_bindSave:function(obj){//保存模块配置
			obj.click(function(){
				var	_l = $("#"+Jh.Layout.location.left).sortable('toArray'),
					_m = $("#"+Jh.Layout.location.center).sortable('toArray'),
					_r = $("#"+Jh.Layout.location.right).sortable('toArray'),
					_a = $("."+Jh.Config.layCls+" a"),
					_layout ="";
				_a.each(function(){
					if($(this).hasClass("active")){
						_layout = $(this).attr("rel");
					}
				});
				
				if(_layout=="1:1:1"){
					_layout="\u9ED8\u8BA4";
				}
				var	baseConfig="<p>left:["+_l+"]</p><p>center:["+_m+"]</p><p>right["+_r+"]</p>"+
							    "<p>\u5F53\u524D\u5E03\u5C40:"+_layout+"</p>";
					
				 $.fallr('show', {        
					 content : baseConfig,
					 position: 'center'
				 });
			
			
			});
		
		},
		
		_bindEvent:function(){//事件绑定
			me._moduleLiClick();
			me._layoutAClick();
		},
		
		_moduleLiClick:function(){//绑定模块LI单击事件
			$("."+Jh.Config.ulCls+" li").live("click",function(){
				var _this = $(this),
					_mName = _this.find("a").attr("rel"),//获取模块名
					_m = $("#"+_mName), //模块div 
					_d = _this.find(".ok");//对号
					
				if(_d.is(":visible")){//判断是否显示
					_d.hide();//隐藏对号
					_m.hide();//隐藏模块	
				}else{
					_d.show();//显示对号
					_m.show();//显示模块
				}
				Jh.Util.refresh();
				
			});
		},
		
		_layoutAClick:function(){//绑定布局列表A 单击事件
			$("."+Jh.Config.layCls+" a").click(function(){
				var _this = $(this);
				var _v = _this.attr("rel");
				me._ToLayout(_v);
				_this.addClass("active").siblings().removeClass("active");
			});
		},
		
		_ToLayout:function(v){//刷新布局
			var CssMode= Jh.Layout.layoutCss, //布局模式  
				CssText= Jh.Layout.layoutText,//css 
				ModulesId= Jh.Layout.locationId, //模块id
				CssTextId=0,//默认css数组编号
				ModuleItems="";//模块数组
			$.each(CssMode, function(m, mn){
				if(v==mn) CssTextId=m;//css 赋值
			});	
	
			$.each(ModulesId, function(s, sn){					
				var currentModule = $(sn),				
					cssName = CssText[CssTextId],
					ary = cssName.split(/\s+/);//得到当前布局css数组
				switch(s){
					case "left": s =0;
					break;
					case "center": s =1;
					break;
					case "right":s = 2;
				}	
				if(ary[s]=='wnone') {//出现布局由3->2的变化	,最右边栏目的内容搬到最左边
					ModuleItems=currentModule.sortable('toArray');//获取最新的的元素
					$.each( ModuleItems, function(m, mn){				
						$("#"+Jh.Layout.location.left).append($("#"+mn));//注意在两栏三栏间切换的时候 返回已经丢失的模块,而且只能够逐个添加元素，不可以一次添加多个
					});
					currentModule.empty();//摧毁原有的元素，以免重复出现冲突
				}		
				currentModule.removeClass("w250 w750 w500 wnone").addClass(ary[s]);//增加css
			});
	
		}
		
	}

}();
Jh.Portal = function(me){//Portal对象
	var _box = "<div id='portal'></div>",
		_template = {//模板
			l :"<div id='"+Jh.Layout.location.left+"' class='"+Jh.Config._groupWrapperClass+" w250'/>",
			m :"<div id='"+Jh.Layout.location.center+"' class='"+Jh.Config._groupWrapperClass+" w250'/>",
			r :"<div id='"+Jh.Layout.location.right+"' class='"+Jh.Config._groupWrapperClass+" w250'/>",
			portalWrap:"<div id='{key}' class='"+Jh.Config._groupItemClass+"'/>",
			itemHeader:"<div class='"+Jh.Config._groupItemHead+"'><h3>{name}</h3></div>",
			itemContent:"<div class='"+Jh.Config._groupItemContent+"'/>"
		};
	return me={	
		init:function(op){//初始化			
			me._create();
			me._bindData(op);
			me._bindEvent();
		},

		_create:function(){//创建
			me.box = $(_box);
			me._elements = {};		
			me._createModulesWrap();
			Jh.Util.toBody(me.box);	
		},	
		
		_bindData:function(op){//绑定数据
			$.each(op,function(key,item){				
				me._createPortal(key,item);
			});
		},
		
		_createModulesWrap:function(){//创建模块外层容器
			me._elements.m_l = $(_template.l);
			me._elements.m_m = $(_template.m);
			me._elements.m_r = $(_template.r);
			me._addPanel(me._elements.m_l);
			me._addPanel(me._elements.m_m);
			me._addPanel(me._elements.m_r);
		},
		
		_addPanel:function(o){//往容器里添加
			me.box.append(o);
		},
		
		_createPortal:function(key,item){//创建portal
			var mWrap ;
			switch(key){
			   case "appL":mWrap = me._elements.m_l;
				break;
			   case "appM":mWrap = me._elements.m_m;
				break;
			   case "appR":mWrap = me._elements.m_r;
				break;
			}
			
			$.each(item,function(k,o){				
				mWrap.append(me._createPortalOne(k,o));
			});
		
		},
		
		_createPortalOne:function(key,name){//创建单个portal item
			var itemHeader  =  me._createItemHeader(name),//header
			    itemContent =  me._createItemContent(),//content
			    portalWrap  = $(Jh.Util.format(_template.portalWrap,{"key":key}))
							.append(itemHeader)
							.append(itemContent);
			
			return portalWrap;
		},
		
		_createItemHeader:function(name){//创建Head
			var  _itemHeader = $(Jh.Util.format(_template.itemHeader,{"name":name})),//格式化header			
				_actionWrap =  me._createDiv("action").hide().appendTo(_itemHeader);//创建一个div
			
			me._createA(Jh.Config.refresh,Jh.Config.refreshtext,true).appendTo(_actionWrap);
			me._createA(Jh.Config.min,Jh.Config.mintext,true).appendTo(_actionWrap);
			me._createA(Jh.Config.max,Jh.Config.maxtext,false).appendTo(_actionWrap);
			me._createA(Jh.Config.close,Jh.Config.closetext,true).appendTo(_actionWrap);
			
			_itemHeader.hover(function(){//滑过标题出现删除图标
				$(this).find(".action").show();			
			},function(){
				$(this).find(".action").hide();
				
			});
			return _itemHeader;
		},
		
		_createItemContent:function(){//创建content
			var _content = $(_template.itemContent);
			$("<ul style='width:250px; height:150px;'><li>\u7A7A\u767D\u62D6\u62FD\u9875JquerySchool</li></ul>").appendTo(_content);
			return _content;
		},
		
		_createDiv:function(classname){
			var _div = $("<div/>").addClass(classname);
			return _div;
		},
		
		_createA:function(classname,title,isShow){//创建A 
			var _a = $("<a href='javascript:void(0);' class='"+classname+"' title='"+title+"'/>");
			if(!isShow){
				_a.hide();
			}
			return _a ;
		},

		_eventMin :function(){		
			$("."+Jh.Config.min).live("click",function(){//关闭面板
				var _me = $(this);
				var _groupItem = _me.parent().parent().parent();
				_groupItem.find("."+Jh.Config._groupItemContent).hide();
				_groupItem.find("."+Jh.Config.max).show();
				_me.hide();
			});	
		},
		
		_eventMax:function(){			
			$("."+Jh.Config.max).live("click",function(){//展开面板
				var _me = $(this),
					_groupItem = _me.parent().parent().parent();
				_groupItem.find("."+Jh.Config._groupItemContent).show();
				_groupItem.find("."+Jh.Config.min).show();
				_me.hide();
			});
		},
		
		_eventRemove:function(){
			$("."+Jh.Config.close).live("click",function(){//移除面板
				var _this  = $(this),
					_p  = _this.parent().parent().parent();//得到当前父级面板				
				_p.fadeOut('500',function(){//500毫秒后移除
					var _this = $(this);
					var _id = _this.attr("id");//得到模块id			
					var _a  = $(".tag-list").find("a[rel='"+_id+"']");
					_this.remove();
					_a.parent().remove();//移除功能列表中的li
				});			
			});
		},		
		
		_eventRefresh:function(){	
			$("."+Jh.Config.refresh).live("click",function(){//刷新
				var _me = $(this),
					_groupItem = _me.parent().parent().parent();
				_groupItem.find("ul").empty().append("<li>\u5237\u65B0\u4E86</li>");
			});
		},
		
		_eventSortable:function(){//绑定排序
			$("."+Jh.Config._groupWrapperClass).sortable({
				connectWith: "."+Jh.Config._groupWrapperClass,								
				opacity :"0.6",	
				dropOnEmpty:true
			}).disableSelection();	
		},
		
		_bindEvent:function(){	//绑定面板所有事件		
			me._eventSortable();
			me._eventRefresh();
			me._eventRemove();
			me._eventMax();
			me._eventMin();
		}	
	
	};
}();