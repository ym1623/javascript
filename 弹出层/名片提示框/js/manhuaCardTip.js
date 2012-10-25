/***
 * 漫画原创名片提示框Jquery插件
 * 编写时间：2012年8月24号
 * version:manhuaCardTip.js
***/
$(function() {
	$.fn.manhuaCardTip = function(options) {
		var defaults = {	
			Event : "mouseover", 						//触发响应事件
			position : "tl",							//箭头指向上(t)、箭头指向下(b)、箭头指向左(l)、箭头指向右(r)
			photo : "images/20120709100116.jpg",	//头像路径
			name : "漫画之迷",						//名称
			sex : "男",								//性别
			love : "女",							//爱好
			detail : "你知道吗？你是最棒滴。。"		//介绍
			
		};		
		var options = $.extend(defaults,options);	
		var bid = parseInt(Math.random()*100000);		
		$("body").prepend("<div id='userInfoDialog"+bid+"' class='userInfoDialog'><span></span><div class='out'><div class='in'><a href='http://www.jq-school.com/' title='查看资料'><img src='"+options.photo+"' alt='' /></a><div>名称："+options.name+"<br />性别："+options.sex+"<br />爱好："+options.love+"<br />介绍："+options.detail+"<br /><a href='http://www.jq-school.com/' class='btn btn-success btn-small' title='加关注'>+加关注</a>&nbsp;&nbsp;<a href='http://www.jq-school.com/' class='btn btn-success btn-small' title='加好友'>+加好友</a></div></div></div></div>");
		var $this = $(this);
		var $btip = $("#userInfoDialog"+bid);			
		$this.die().live(options.Event, function(){			
			var h = $(this).height();
			var offset = $(this).offset();			
			$btip.find("span").addClass("tl"); 
			$btip.css({
				"left":offset.left,
				"top":offset.top+h
			}).show();	
		});		
		$btip.die().live(options.Event, function(){
			$(this).show();									 
		}).live("mouseout", function(){				
			$(this).hide();																
		});
		
	}
});