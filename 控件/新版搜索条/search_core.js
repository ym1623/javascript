// JavaScript Document
$(function(){
//menu选取事件
$("#menu a").bind("click",function(){
var m=this.id;
switch(m)
{
//网页
case "m0":
		  $("#sps").html('<input type="radio"  name="sp" value="sp1"  checked="checked" />百度&nbsp;<input type="radio" name="sp" value="sp2" />Google&nbsp;<input type="radio" name="sp" value="sp3" />搜狗');
		  $("#kk").val("0");
		  break;
//mp3		  
case "m1":
		  $("#sps").html('<input type="radio"  name="sp"  value="sp1" checked="checked" />百度&nbsp;<input type="radio" name="sp" value="sp3" />搜狗&nbsp;<input type="radio" name="sp" value="sp4" />迅雷');	
		  $("#kk").val("1");
		  break;	  
//影视		  
case "m2":
          $("#sps").html('<input type="radio"  name="sp"  value="sp4" checked="checked" />迅雷&nbsp;<input type="radio" name="sp" value="sp5" />优酷');		  
		  $("#kk").val("2");
		  break;
//视频
case "m3":
		  $("#sps").html('<input type="radio" name="sp" value="sp4" checked="checked" />迅雷&nbsp;<input type="radio" value="sp1"  name="sp"   />百度&nbsp;<input type="radio" name="sp" value="sp2" />Google');	
		  $("#kk").val("3");	  
		  break;
//图片
case "m4":
		  $("#sps").html('<input type="radio"  name="sp" value="sp1"  checked="checked" />百度&nbsp;<input type="radio" name="sp" value="sp2" />Google');		  
		  $("#kk").val("4");
		  break;
//贴吧
case "m5":
		  $("#sps").html('<input type="radio"  name="sp"  value="sp1" checked="checked" />百度贴吧&nbsp;<input type="radio" name="sp" value="sp6" />来吧');		  
		  $("#kk").val("5");
		  break;
//图片
case "m6":
		  $("#sps").html('<a href="http://s.click.taobao.com/t_9?p=mm_13437741_0_0&l=http%3A%2F%2Fwww.tmall.com" target="_blank">淘宝商城</a>&nbsp;<a href="http://s.click.taobao.com/t_8?e=7HZ5x%2BOzds8BIPN6CFQUD%2BOD8Q%3D%3D&p=mm_13437741_0_0" target="_blank">正品女装</a>&nbsp;<a href="http://s.click.taobao.com/t_8?e=7HZ5x%2BOzd%2BdFiCvRmrqqUZcrow%3D%3D&p=mm_13437741_0_0" target="_blank">护肤美容</a>&nbsp;<a href="http://s.click.taobao.com/t_8?e=7HZ5x%2BOzdZRP%2B9K5fPy%2BhAm9Pw%3D%3D&p=mm_13437741_0_0" target="_blank">韩版饰品</a>&nbsp;<a href="http://s.click.taobao.com/t_8?e=7HZ5x%2BOzcg5RLdszGvafCyFhcg%3D%3D&p=mm_13437741_0_0" target="_blank">数码热销</a>');		  
		  $("#kk").val("6");
		  break;		 		  		  
	
		  
default:$("#sps").html('<input type="radio"  name="sp" value="sp1"  checked="checked" />百度&nbsp;<input type="radio" name="sp" value="sp2" />Google&nbsp;<input type="radio" name="sp" value="sp3" />搜狗');
		 $("#kk").val("0");
		 break;
		    
}

});


$("#menu a").bind("click",function(){
$("#menu a").each(function(i){
$(this).removeClass("cur");
});
$(this).addClass("cur");
});


//按钮提交事件
$("#submit").bind("submit",function(){
//判断搜索引擎
var sp;
//sp=$("input[type='radio']:checked").val();
sp=$("input[name='sp'][type='radio']:checked").val();
//var sp1=$("input[type='radio'][name='sp']");
//$.each(sp1,function(i,n){if(n.checked){sp=n.value;}});
var kk=$("#kk").val(); //获取标记，判断当前进行什么搜索
switch(sp)
{
//百度搜索
case "sp1":{
			switch(kk)
			{
				case "0":
						 $("#search").attr("action","http://www.baidu.com/s"); //网页
						 $("#key").attr("name","wd");
						 break;
				case "1":
						 $("#search").attr("action","http://mp3.baidu.com/m"); //mp3
						 $("#key").attr("name","word");
						 break;	
				case "3":
						 $("#search").attr("action","http://video.baidu.com/v"); //视频
						 $("#key").attr("name","word");
						 break;
				case "4":
						 $("#search").attr("action","http://image.baidu.com/i"); //图片
						 $("#sps").append('<input type="hidden" name="ct" value=201326592" />'); //视频搜索标记
						 $("#key").attr("name","word");
						 break;
				case "5":
						 $("#search").attr("action","http://tieba.baidu.com/f"); //贴吧
						 $("#key").attr("name","kw");
						 break;	
				default:
						 $("#search").attr("action","http://www.baidu.com/s"); //网页
						 $("#key").attr("name","wd");
						 break;		 	 		 		 	 
			}
			break;
			}	
//Google搜索			
case "sp2":{
			switch(kk)
			{
				case "0":
						 $("#search").attr("action","http://www.google.com.hk/search"); //网页
						 $("#key").attr("name","q");
						 break;	
				//Google搜索mp3编码出问题，暂时取消		 
				case "1":
						 $("#search").attr("action","http://www.google.cn/music/search"); //MP3
						 $("#key").attr("name","q");
						 $("#key").val(encodeURI($("#key").val())); //encodeURI编码
						 break;		
				case "3":
						 $("#search").attr("action","http://www.google.com.hk/search"); //视频
						 $("#sps").append('<input type="hidden" name="tbs" value="vid:1" />'); //视频搜索标记
						 $("#key").attr("name","q");
						 break;
				case "4":
						 $("#search").attr("action","http://images.google.com.hk/images"); //图片
						 $("#key").attr("name","q");
						 break; 
				default:
						 $("#search").attr("action","http://www.google.com.hk/search"); //网页
						 $("#key").attr("name","q");
						 break;
			}
			break;
			}
//搜狗搜索			
case "sp3":{
			switch(kk)
			{
				case "0":
						 $("#search").attr("action","http://www.sogou.com/web"); //网页
						 $("#key").attr("name","query");		
						 break;	
				case "1":
						 $("#search").attr("action","http://mp3.sogou.com/music.so"); //mp3
						 $("#key").attr("name","query");		
						 break;	
				default:
						 $("#search").attr("action","http://www.sogou.com/web"); //网页
						 $("#key").attr("name","query");		
						 break;	
			}
			 break;
			}

//迅雷搜索			
case "sp4":{
			switch(kk)
			{
				case "1":
						 $("#search").attr("action","http://mp3.gougou.com/search"); //mp3
						 $("#key").attr("name","search");		
						 break;	
				case "2":
						 $("#search").attr("action","http://movie.gougou.com/search"); //影视
						 $("#key").attr("name","search");		
						 break;	
				case "3":
						 $("#search").attr("action","http://video.gougou.com/search"); //视频
						 $("#key").attr("name","s");
						 break;		 
				default:
						 $("#search").attr("action","http://mp3.gougou.com/search"); //mp3
						 $("#key").attr("name","search");		
						 break;	
			}
			break;
			}
//优酷搜索			
case "sp5":$("#search").attr("action","http://www.soku.com/search_video/q_"+$("#key").val()); 
			$("#key").attr("name","q");		
			break;	
//来吧搜索			
case "sp6":$("#search").attr("action","http://laiba.tianya.cn/searchGroup.jsp");
			$("#key").attr("name","nameOrStockCode");		
			break;			
//淘宝搜索												
default:$("#search").attr("action","http://s8.taobao.com/search");	 //淘宝搜索
		 $("#sps").append('<input type="hidden" name="pid" value="mm_13437741_0_0" /><input type="hidden" name="commend" value="all" />');
		 $("#key").attr("name","q");						
		 break;
}

});

});



