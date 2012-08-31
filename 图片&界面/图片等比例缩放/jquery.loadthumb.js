/*
 * jQuery插件：
 * 图片预加载
 * 重置图片宽度，高度
 * 图片水平，垂直居中
 * Dev By CssRain.cn
 */
jQuery.fn.loadthumb = function(options) {
	options = $.extend({
		 src : "",
		 imgId : "myImgs",
		 parentId : "CRviewer"
	},options);
	var _self = this;
	_self.hide();
	var img = new Image();
	$(img).load(function(){
		imgDem = {};
		imgDem.w  = img.width;
		imgDem.h  = img.height;
		imgDem = $.imgResize({"w": $("#"+options.parentId).width() ,"h": $("#"+options.parentId).height()},{"w":imgDem.w,"h":imgDem.h});
		var imgMargins = $.imgCenter({"w": $("#"+options.parentId).width() ,"h": $("#"+options.parentId).height()},{"w":imgDem.w,"h":imgDem.h});
		$("#"+options.imgId).css({width:imgDem.w,height:imgDem.h,marginLeft:imgMargins.l,marginTop:imgMargins.t});
		_self.attr("src", options.src);
		_self.fadeIn("slow");
	}).attr("src", options.src);  //.atte("src",options.src)要放在load后面，
	return _self;
}
//重置图片宽度，高度插件 ( parentDem是父元素，imgDem是图片 )
jQuery.imgResize = function(parentDem,imgDem){
	if(imgDem.w>0 && imgDem.h>0){
		var rate = (parentDem.w/imgDem.w < parentDem.h/imgDem.h)?parentDem.w/imgDem.w:parentDem.h/imgDem.h;
		//如果 指定高度/图片高度  小于  指定宽度/图片宽度 ，  那么，我们的比例数 取 指定高度/图片高度。
		//如果 指定高度/图片高度  大于  指定宽度/图片宽度 ，  那么，我们的比例数 取 指定宽度/图片宽度。
		if(rate <= 1){   
			imgDem.w = imgDem.w*rate; //图片新的宽度 = 宽度 * 比例数
		    imgDem.h = imgDem.h*rate;
		}else{//  如果比例数大于1，则新的宽度等于以前的宽度。
			imgDem.w = imgDem.w;
			imgDem.h = imgDem.h;
		}
    }
	return imgDem;
}
//使图片在父元素内水平，垂直居中，( parentDem是父元素，imgDem是图片 )
jQuery.imgCenter = function(parentDem,imgDem){
	var left = (parentDem.w - imgDem.w)*0.5;
	var top = (parentDem.h - imgDem.h)*0.5;
	return { "l": left , "t": top};
}