$(function(){

	var codeArray = [];
	$("pre").each(function(){
		codeArray.push($(this).html().replace("&lt;","<").replace("&gt;",">"));
	})
	
	//复制代码到剪切板
	$(".J-copy").each(function(i){
	    var txt = codeArray[i].replace("&lt;","<").replace("&gt;",">");
		if(window.clipboardData){
			$(this).html('<img src="../images/icon_copy.gif" style="cursor:pointer" />');
			$(this).click(function(){
				 window.clipboardData.setData("Text",codeArray[i]);
				 alert("\u5df2\u7ecf\u590d\u5236\u4ee3\u7801\u5230\u526a\u5207\u677f\uff01")//已经复制代码到剪切板！
			});
		}else{
			$(this).html('<embed height="15" width="14"  type="application/x-shockwave-flash" allowscriptaccess="always" quality="high" flashvars="clipboard=' + encodeURIComponent(codeArray[i]) + '" src="../js/clipboard_new.swf" wmode="transparent">');			
			$(this).mouseup(function(){
				alert("\u5df2\u7ecf\u590d\u5236\u4ee3\u7801\u5230\u526a\u5207\u677f\uff01")//已经复制代码到剪切板！
			});
		}
	})
	//语法高亮
	SyntaxHighlighter.all({"toolbar":false,"quick-code":false});
})