/***
 * 漫画Jquery弹出层插件
 * 编写时间：2012年7月21号
 * version:manhuaDialog.1.0.js
***/
$(function() {
	$.fn.manhuaDialog = function(options) {
		var defaults = {
			Event : "click",								//触发响应事件
			title : "title",								//弹出层的标题
			type : "text",									//弹出层类型(text、容器ID、URL、Iframe)
			content : "content",							//弹出层的内容(text文本、容器ID名称、URL地址、Iframe的地址)
			width : 500,									//弹出层的宽度
			height : 400,									//弹出层的高度
			scrollTop : 200,								//层滑动的高度也就是弹出层时离顶部滑动的距离
			isAuto : false,									//是否自动弹出
			time : 2000,									//设置自动弹出层时间，前提是isAuto=true
			isClose : false,  								//是否自动关闭		
			timeOut : 2000									//设置自动关闭时间，前提是isClose=true
			
		};
		var options = $.extend(defaults,options);
		
		$("body").prepend("<div id='floatBoxBg'></div><div id='floatBox' class='floatBox'><div class='title'><h4></h4><span id='closeDialog'>X</span></div><div class='content'></div></div>");
		var $this = $(this);								//当然响应事件对象
		var $blank = $("#floatBoxBg");						//遮罩层对象
		var $title = $("#floatBox .title h4");				//弹出层标题对象
		var $content = $("#floatBox .content");				//弹出层内容对象
		var $dialog = $("#floatBox");						//弹出层对象
		var $close = $("#closeDialog");						//关闭层按钮对象
		var stc,st;
		$close.live("click",function(){
			$blank.animate({opacity:"0"},"normal",function(){$(this).hide();});
  			$dialog.animate({top:($(document).scrollTop()-parseInt(options.height))+"px"},"normal",function(){$(this).hide();});
			if(st){
				clearTimeout(st);//清除定时器
			}
			if(stc){
				clearTimeout(stc);//清除定时器
			}
		});		
		$content.css("height",parseInt(options.height)-70);
		//文本框绑定事件
		$this.live(options.Event,function(e){	
			$title.html(options.title);
			switch(options.type){
				case "url":									//当类型是地址的时候					
					$content.ajaxStart(function(){
						$(this).html("loading...");
					});
					$.get(options.content,function(html){
						$content.html(html);						
					});
					break;
				case "text":								//当类型是文本的时候
					$content.html(options.content);
					break;
				case "id":									//当类型是容器ID的时候
					$content.html($("#"+options.content+"").html());
					break;
				case "iframe":								//当类型是Iframe的时候
					$content.html("<iframe src=\""+options.content+"\" width=\"100%\" height=\""+(parseInt(options.height)-70)+"px"+"\" scrolling=\"auto\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\"></iframe>");
					break;
				default:									//默认情况下的时候
					$content.html(options.content);
					break;
			}
			
			$blank.show();
			$blank.animate({opacity:"0.5"},"normal");		
			$dialog.css({display:"block",left:(($(document).width())/2-(parseInt(options.width)/2))+"px",top:($(document).scrollTop()-parseInt(options.height))+"px",width:options.width,height:options.height});
			$dialog.animate({top:($(document).scrollTop()+options.scrollTop)+"px"},"normal");
			if (options.isClose){
				stc = setTimeout(function (){			
					$close.trigger("click");
					clearTimeout(stc);
				},options.timeOut);	
			}
			
		});	
		if (options.isAuto){
			st = setTimeout(function (){			
				$this.trigger(options.Event);
				clearTimeout(st);
			},options.time);	
		}
	}
});