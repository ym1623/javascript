/* ********************************
 * 作者：胖胖的ALEX
 * 联系方式：zanbin168@qq.com
 * 日期：2012-05-02
 *********************************/
;(function($){
	/*表格隔行换色插件*/
	$.fn.zbTableColor = function(options){
		var options = $.extend({},{
			odd:'zbodd',
			even:'zbeven',			
			selected:'zbselected',
			zbhover:true,
			zbover:'zbover',
			zbcheckbox:true
		},options);
		$("tbody>tr:odd",this).addClass(options.odd);
		$("tbody>tr:even",this).addClass(options.even);
		//开启HOVER效果
		if(options.zbhover == true){
			$("tbody>tr",this).bind("mouseover",function(){
				$(this).addClass(options.zbover);
			}).bind("mouseout",function(){
				$(this).removeClass(options.zbover);
			})
		}
		//开启多选效果
		if(options.zbcheckbox == true){
			$("tbody>tr",this).click(function(){
				//判断是否选中
				var hasSelected = $(this).hasClass(options.selected);
				//如果选中，移除selected,否则加上selected
				$(this)[hasSelected?"removeClass":"addClass"](options.selected).find(':checkbox').attr('checked',!hasSelected);
			});
			//如果单选框默认情况下是选择的，则高亮
			$("tbody>tr:has(:checked)",this).addClass(options.selected);
			return this; //返回this ,使方法可链
		}
		
	}
	
	
})(jQuery);