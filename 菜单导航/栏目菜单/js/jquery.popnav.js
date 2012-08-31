// Jquery.popnav Document
(function($){
	$.fn.extend({ 
		"popnav":function(options){    
			options=$.extend({
				_event:0
		    },options);	
		    
			if($(this).hasClass("popnav")){}
			else{
				$(this).addClass("popnav");
			};
			
			var obj = $(this),
				  box = $(".list-li",obj),
				  tabs = $(".list-p",box),
				  popbox = $(".popbox",box),
				  listbox =$(".listbox",popbox),
				  newsList = $(".news-list",popbox),
				  closeBtn = $(".close",popbox),
				  index;
			
			popbox.css({"display":"none"});
			
			if(options._event==1){
				tabs.click(function(){
					index=tabs.index(this);
					Play(index);
				});
			}else{
				tabs.mouseenter(function(){
					index=tabs.index(this);
					Play(index);
				});
			};
			
			popbox.mouseenter(function(){
					index=popbox.index(this);
					Play(index);
			});
			tabs.mouseleave(function(){
					closepopbox();
			});
			popbox.mouseleave(function(){
					closepopbox();
			});
			closeBtn.click(function(){
					closepopbox();
			})
				
			function Play(index){
					var Len = $(".dd-content-list",listbox.eq(index)).length;
					closepopbox();
					tabs.eq(index).addClass("list-current");
					popbox.eq(index).css({"display":"block",top:index*32-10});
					newsList.eq(index).css({height:30*Len+20});
			}
			function closepopbox(){
					tabs.removeClass("list-current");
					popbox.css({"display":"none"});
			}
		
		
		
		}
	})
})(jQuery)