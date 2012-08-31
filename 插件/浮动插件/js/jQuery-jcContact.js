/*
 * jQuery - jcContact v1.10
 * Copyright(c) 2012 by Riddick-design 
 * Date: 2012-01-10
 * 使用jcContact可以方便地调滑动在线联系。
 * 相关参数 ：
   speed:400,         \\ 动画效果滑动速度
   position:'center'  \\ 按钮垂直位置，提供top,center,bottom 和 自定义像素(如100px)
   float:'left',      \\ 特效位置，提供left,right
   contentHidden:true \\ 是否隐藏，提供true,false
   '
 */
;(function($){
	$.fn.jcFloat = function(options) {
		var defaults = {
            speed:400,
			position:'center',
			float:'left',
			contentHidden:true
		};
		var options = $.extend(defaults,options);
		return this.each(function() {
		    var $div = $(this),
				$window =$(window);
				$window_h = $window.height(),
				$window_w = $window.width(),
				$div_h = $div.height(),
			    $content = $div.children('div').eq(0),
				$btn = $div.children('div').eq(1),
				$div_top = ($window_h - $div_h)/2,
				$close = $('a.close'),
				$content_w = $content.width();
				$btn.css({ 'position':'absolute','left':0,'top':0 });
				$div.css({ 'position':'absolute','left':0,'top':0,'width':$content_w+$btn.width() });
			$div.stop().animate({'top':$div_top},options.speed);
			$(window).scroll(function(){
				var _st = $(window).scrollTop();
				$div.stop().animate({'top':$div_top+_st},options.speed);
				switch (options.float){
				   case 'left':
					   $div.css('left',-$content_w);
					   break;
				   case 'right':
					   $div.css('left',$window_w-$div.width()+$content_w);
					   break;
				};	
			});
			$close.click(function(){
				$div.remove();	
				return false;
			});
			function btnTop(){
				switch (options.position){
				   case 'top':
					   $btn.css('top',0);
					   break;
				   case 'center':
					   $btn.css('top',($div_h-$btn.height())/2);
					   break;
				   case 'bottom':
					   $btn.css('top',($div_h-$btn.height()));
					   break;
				   default:
					   $btn.css('top',options.position);
					   break;
				};	
				return false;
			};
			if(options.float == 'left') {
				if(options.contentHidden){
					$div.css('left',-$content_w);
				} else {
					$div.css('left',0);
				};
				$btn.css('left',$content_w+2);
				btnTop();
				$btn.bind('mouseover',function(){
					$div.stop().animate({'left':0},options.speed/2);
					return false;
				});
				if(options.contentHidden){
					$div.bind('mouseleave',function(){
						$div.stop().animate({'left':-$content_w},options.speed/2);
						return false;
					});
				} else {
					$div.bind('mouseleave',function(){
						$div.stop().animate({'left':0},options.speed/2);
						return false;
					});
				};
			};
			if(options.float == 'right') {
				$('body').css('overflow-x','hidden');
				if(options.contentHidden){
					$div.css('left',$window_w-$div.width()+$content_w);
				} else {
					$div.css('left',$window_w-$div.width());
				};
				$content.css({ 'position':'relative','left':$btn.width() });
				$btn.css('left',0)
				btnTop();
				$btn.bind('mouseover',function(){
					$div.stop().animate({'left':$window_w-$div.width()},options.speed/2);
					return false;
				});
				if(options.contentHidden){
					$div.bind('mouseleave',function(){
						$div.stop().animate({'left':$window_w-$div.width()+$content_w},options.speed/2);
						return false;
					});
				} else {
					$div.bind('mouseleave',function(){
						$div.stop().animate({'left':$window_w-$div.width()},options.speed/2);
						return false;
					});
				};
			};
		});
	};
})(jQuery)