$(function(){
	//页面加载
	var $window = $(window),
		$doc = $(document),
		$body = $("body"),
	    winWidth = $window.width(),
		docWidth = $doc.width(),
		docHeight = $doc.height(),
		winHeight = $window.height(),
		headHeight = $("#head").height(),
		$minute = $("#minute"),
		$container = $("#container"),
		minuteHeight = $minute.height(),
		afterheadHeight = $("#logowraper").height()+$("#navwraper").height()+30,
		speed = 250;
	//判断对象
	$container.animate({"top":headHeight},speed*1.5);
	$minute.slideDown(speed*1.5,function(){
		$("div",$("#headBtn")).addClass("s").fadeIn(100,function(){
				$("div",$("#headBtn")).click(function(){
					var _self = $(this);
					if(_self.hasClass("s")){
						$minute.children().fadeOut(speed,function(){
							$minute.stop().animate({"height":10},speed,function(){
								_self.removeClass("s").addClass("h");											 
							});									  
						});
						$container.stop().animate({"top":afterheadHeight},speed*1.5);
					} else {
							$minute.stop().animate({"height":minuteHeight},speed,function(){
								$minute.children().fadeIn(speed)
								_self.removeClass("h").addClass("s");											   						  
						});
						$container.stop().animate({"top":headHeight},speed*1.5);
					};
					return false;
				});						 
		});
	});
	$(window).scroll(function(){
		if($(this).scrollTop() > 100){
			$minute.children().fadeOut(speed,function(){
				$minute.stop().animate({"height":10},speed,function(){
					$("div",$("#headBtn")).removeClass("s").addClass("h");											 
				});									  
			});
			$container.stop().animate({"top":afterheadHeight},speed*1.5);
		} else if($(this).scrollTop() < 100) {
			$minute.stop().animate({"height":minuteHeight},speed,function(){
				$minute.children().fadeIn(speed)
				$("div",$("#headBtn")).removeClass("h").addClass("s");											   						  
			});
			$container.stop().animate({"top":headHeight},speed*1.5);
		};
	});
	//调用左边挂件
	$("#anchor").jcContact({
		defaultFun:function(wraper){
			$(wraper).find("a:last").css("background","none");
		},
		position:'center',
		posOffsetY : 24,
		scrollSpeed:600
		
	});
	$("#anchor2").jcContact({
		float:'right', 
		position:'center',
		posOffsetY : -20,
		scrollSpeed:450 
	});
	//调用gotop
	fnGoTop(fnEach($("#gotop")),800);
	//调用tips
	fnTips(fnEach($("*[tips]")),speed);
	//描点效果
	//fnGoFarme(fnEach($("#downClass").find("li")),fnEach($("div.downtitleWrap")),400);
	//调用links效果
	fnLinkScroll(fnEach($("a.linkscroll")),100,5);
	// 导航效果 调用（外层框架，菜单外框架，列表标签，指针标签，速度，列表跟进指针样式名）
	navScroll(fnEach($("#navwraper")),fnEach($("#nav")),fnEach($("#navmenu")),"dd","dt",speed,"curr");  
	srchEff(fnEach($("#srchText")),176,140,speed);
	//slider 调用
	$("#imgslider").jcSlider({
		speed: {   
			duration: speed
		},
		Default : 1,
		setMode:'fade',
		loadPath:'images/loading2.gif',
		setloadSize : {
			loadWidth : 37,
			loadHeight : 37 
		},
		autoPlay:true,
		autoTime:3000,
		arrow : false,
		numBtn:true,
		numBtnEvent:'mouseover', 
		numBtnPos:'right', 
		setNumBtn : {
			x : -5,
			y : 296
		},
		scaling:true,   
		setScaling : {
			width:712,  
			height:326 
		},
		text : true,
		setText : {
			pos : "bottom",
			bg : "#000",
			height : 40 ,
			opacity : .87,
			width : 712
		}
	});
	// tabs调用
	$("#tabs1").jcTabs();
	$("#tabs2").jcTabs({Default:1});
	function fnEach(Dom){
		if(Dom.length !=0 ){
			return Dom;
		} else {
			return $(null);
		};
	};
	//链接效果
	function fnLinkScroll(Dom,speed,x){
		Dom.hover(function(){
			a($(this),x,speed);
		},function(){
			a($(this),0,speed);
		});
		function a(t,v,s,a){
			//console.log(t)
			t.stop().animate({"left":v},s);
		};
	};
	//返回顶部
	function fnGoTop(Dom,s){
		$(window).scroll(function(){
			if($(this).scrollTop() > 400){
				Dom.fadeIn(s/4);
				Dom.click(function(){
					sfnSrollTop($("html,body"),s,"easeInOutQuart",0);
					return false;
				});
			} else{
				Dom.fadeOut(s/4);
			};
		});
		return false;
	};
	//锚点
	function fnGoFarme(o,eo,s){
		var i,eoLen = eo.length,
			oePosArr = [];
		for(i = 0; i < eoLen; i++){
			var curr = eo.eq(i);
			oePosArr.push(curr.offset().top-40);
		};
		o.click(function(){
			var IDX = $(this).index();
			$(this).addClass("curr").siblings().removeClass("curr");
			sfnSrollTop($("html,body"),s,"easeInOutQuart",oePosArr[IDX]);
		});
	};
	//scrollTop
	function sfnSrollTop(o,d,e,v){
		o.stop().animate({scrollTop: v}, { duration: d, easing: e });  
		return false;
	};
	//搜索
	function srchEff(Dom,maxWidth,minWdith,speed){
		var value = Dom.val();
		Dom.focusin(function(e){
			var _self = $(e.target);
			_self.animate({
				"width":maxWidth
			},speed).val("");
			return false;
		}).focusout(function(e){
			var _self = $(e.target);
			_self.animate({"width":minWdith},speed);
			if(_self.val() === "") {
				_self.val(value);
			};
			return false;
		});
		return false;
	};
	//tips
	function fnTips(list,speed){
		if(list.length === 0) { return false; };
		var tipsDom = "<div id='jcTips' style=\"display:none;\"><span></span><b></b><em></em></div>";
		$body.append(tipsDom);
		var $tips = $("#jcTips"),
		    $text = $tips.find("span");
		list.css("cursor","pointer")
		    .bind("mousemove",function(e){
			var _self = $(this),
			    tipsText =  _self.attr("tips"),
				X = e.pageX-30,
				Y = e.pageY - 40;
			$tips.css({"left":X,"top":Y}).find("span").text(tipsText).parents($tips).show();
		}).bind("mouseleave",function(){
			$tips.hide();
		});
		return false;
	};
	//导航
	function navScroll(navwrap,Dom,Menu,list,curr,speed,defClass){
		var $list = Dom.find(list),
			listLen = $list.length,
			$menuList = Menu.find("dl"),
			menuLen = $menuList.length;
			i=0,arrListInfo = [],
			bool = true,
			currIdx = 0;
		for(i = 0;i<listLen; i++){
			var othis = $list.eq(i),
			    sPath = othis.find("a").attr("href"),
				sText = othis.text(),
				nPosX = othis.position().left,z;
			arrListInfo.push([sText,nPosX,sPath]);
			if(othis.hasClass(defClass)&&bool){
				Dom.append("<dt style=\"display:none;left:"+nPosX+"px;\"><a href=\""+ sPath +"\"><span>"+ sText +"</span><em></em></a></dt>")
				   .find(curr)
				   .fadeIn(200);
				bool = false;
				currIdx = i;
			};
			for(z=0;z<menuLen;z++){
				var omenu = $menuList.eq(z);
				if(Number(omenu.attr("name")) == i){
					omenu.css("left",nPosX)
					     .find("dd:last a").css("background","none");
				};
			};
		};
		setTimeout(function(){
			$list.bind("mouseover",function(){
				var index = $(this).index();
				fnAnimate(Dom,arrListInfo,index,$menuList,true);
				return false;
			});
			navwrap.bind("mouseleave",function(){
				$menuList.fadeOut(speed);
				fnAnimate(Dom,arrListInfo,currIdx,$menuList,false);
				return false;
			});
		},speed);
		function fnMenuShow(d,y){
			if(y != -1){
				d.eq(y).fadeIn(speed).siblings().fadeOut(speed);
			};
			return false;
		};
		function fnAnimate(d,a,x,m,b){
			d.find(curr)
			   .stop()
			   .animate({
				"left": a[x][1]
				},speed,function(){
					$(this).find("a")
						   .attr("href",a[x][2])
						   .find("span")
						   .text(a[x][0])
						   //.fadeIn(100);
					if(b){
						m.fadeOut(speed);
						fnMenuShow(m,x-1);
					};
				})
				.find("span")
				.hide();
			return false;
		};
		return false;
	};
});

function CompleteScroll(flag){
	if(flag==0){
		$("html,body").animate({scrollTop: 0}, "slow");	
	}else{
		var s = $("body").height()-$(window).height();
		$("html,body").animate({scrollTop: s+60}, "slow");
	}
}
function ShowMsg(type,msg,url){				
  	var tipHtml = '';
	if (type =='loading'){
		tipHtml = '<img alt="" src="images/loading6.gif">'+(msg ? msg : '正在提交您的请求，请稍候...');
	} else if (type =='notice'){
		tipHtml = '<span class="gtl_ico_hits"></span>'+msg
	} else if (type =='error'){
		tipHtml = '<span class="gtl_ico_fail"></span>'+msg
	} else if (type =='succ'){
		tipHtml = '<span class="gtl_ico_succ"></span>'+msg
	}
	if ($('.msgbox_layer_wrap')) {
		$('.msgbox_layer_wrap').remove();
	}
	if (st){
		clearTimeout(st);
	}
	$("body").prepend("<div class='msgbox_layer_wrap'><span id='mode_tips_v2' style='z-index: 10000;' class='msgbox_layer'><span class='gtl_ico_clear'></span>"+tipHtml+"<span class='gtl_end'></span></span></div>");
	$(".msgbox_layer_wrap").show();
	var st = setTimeout(function (){
		$(".msgbox_layer_wrap").hide();
		clearTimeout(st);
		if (url!="")
		location.href=url;
	},2000);
}