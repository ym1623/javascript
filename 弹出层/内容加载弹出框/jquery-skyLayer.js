/**
 * 功能： 加载内容到弹出框
 * 作者： SKY
 * 时间：2012.1.11
 * email：lavi_sky@163.com
 * 更改(2012.9.25):
 */
(function($){
	$.fn.skyLayer = function(options){
        var defaults={
			id:"id",//id必须防止重复
        	title:"标题" , //显示在弹出层的标题
        	url:""//要加载的内容地址
        }		
		var opts = $.extend(defaults, options);	
		var position = this.position();
		var left = position.left - this.width() - 5;
		var top = position.top + this.height() + 5;
		var html = '<div id="layer_'+opts.id+'" class="sky-layer" style="display:block;left:'+left+'px;top:'+top+'px;"><div class="holder"><div class="content"><div class="sky-tab clearfix"><a href="javascript:;">'+opts.title+'</a></div><div class="sky-sub-tab clearfix">';
		html += '<div id="loadurl"><div class="voloading"></div></div>';
		html +='</div><ul class="sky-detail clearfix"></ul></div><a class="sky-close" href="javascript:;"></a></div><a class="sky-tri" href="javascript:;"></a></div>';
		if($('#layer_'+opts.id).css('display')!='block')
		{
			if($('.sky-layer').attr('id')!='' && $('.sky-layer').attr('id')!=opts.id)
			{
				$('.sky-layer').remove();
			}
			this.after(html);
			$('#loadurl').load(opts.url)
		}else{
			$.fn.skyLayer.Sclose()
		}
		$('.sky-close').click(function(){
			$.fn.skyLayer.Sclose()
		})		
		$.fn.skyLayer.Sclose=function(){
			$('#layer_'+opts.id).remove();
		}	
	};	
})(jQuery)
