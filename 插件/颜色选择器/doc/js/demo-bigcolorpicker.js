$(function(){

	//颜色选择器例子注册事件
	$(".li-cursor").click(function(){
		var t = $("#" + $(this).attr("demo"));
		t.siblings().hide();
		t.show();
		$(this).addClass("demo-text")
			   .siblings().removeClass("demo-text");
		if($(this).attr("demo") == "demo7"){
			regist2();
		}else{
			regist1();
		}
	});			

	function regist1(){
		$("#demo1Text").unbind("click").bigColorpicker();
		$("#bn").unbind("click").bigColorpicker("#demo2Text");
		
		$("#bgImg").unbind("click").bigColorpicker(function(el,color){
			$(el).css("backgroundColor",color);
		});	
		
		$(":input[name='bnn']").unbind("click").bigColorpicker(function(el,color){
			$("#" + $(el).attr("data-target")).val(color);
		});	
		
		$(":input[name='textbatch']").unbind("click").bigColorpicker(function(el,color){
			$(el).val(color);
		});	
		
		$("a[name='bgImgBatch']").unbind("click").bigColorpicker(function(el,color){
			$(el).css("backgroundColor",color);
		});			
	}
	regist1();
	
	function regist2(){
		$("#demo7Text").bigColorpicker("#demo7Text","L",3);	
	}
})
