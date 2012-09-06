/*
 * jQuery - jcImg v1.0
 * Copyright(c) 2012 by Adam¡¯
 * Date: 2012-08-24
 * qq : 1741498
 */
;(function($){
	$.fn.jcImg= function(options) {
		var defaults = {
			Default : 1,
			speed : 400,
			height :64,
			width : 115,
			textBg : .8,
			page : 5
		};
		var options = $.extend(defaults,options);
		return this.each(function() {
            var $this = $(this),
				$imgs = $(this).find("img"),
				imgLen = 0,
				selectText = "",
				ImgIdx = 0,
				arrPath = [],
				arrTitle = [];
			// default info
			for(var x = 0; x < $imgs.length; x++){
				var $thisImg = $imgs.eq(x)
				if((x+1) == options.Default ){
					selectText = $thisImg.attr("title");
					ImgIdx = x;
					imgShow(ImgIdx);
				};
				arrTitle.push($thisImg.attr("title"))
				arrPath.push("<dd><div></div><img src="+ $thisImg.attr("src") +" height=" + options.height + " width=" + options.width+ " /></dd>");
				imgLen = x + 1;
			};
			// Creat Dom
			var fnText = function(text,idx,len){
					return "<div id='imgText'><b></b><p><span>" + text + "</span><samp>" + idx +" / " + len + "</samp></p></div>";
				},
				fnBtn = function(){
					return "<b id='prev'></b><b id='next'></b>";
				},
				fnSmallImg = function(){
					return "<div id='smallImg'><dl></dl><div id='imgHover'></div></div>"
				};
			$this.prepend(fnText(selectText,ImgIdx+1,imgLen) + fnBtn()).append(fnSmallImg());
			var $SmallImgS = $("#smallImg").find("dl"),
				$imgText = $("#imgText"),
			    $imgTextBg = $imgText.find("b"),
				$prev = $("#prev",$this),
				$next = $("#next",$this),
				$imgHover = $("#imgHover"),
				$span = $imgText.find("span"),
				$samp = $imgText.find("samp");
			$SmallImgS.html(arrPath.join(""));
			var imgSwidth = $SmallImgS.find("dd:eq(0)").outerWidth(true);
			imgScroll($imgHover,ImgIdx,imgSwidth,100);
			$SmallImgS.find("div").fadeTo(0,.5);
			$imgTextBg.fadeTo(0,options.textBg,function(){
				$(this).parents("div").show();	
			});
			// Control
			function imgShow(index){
				$this.find("li:eq(" + index + ")").fadeIn(options.speed).siblings().fadeOut(options.speed/2);
				return false;
			};
			function imgScroll(Dom,index,width,speed){
				Dom.show().stop().animate({"left":(index%options.page)*width },speed,function(){
					$SmallImgS.find("dd:eq("+ index +")").find("div").hide().parent().siblings().find("div").show();	
				});
				return false;
			};
			$SmallImgS.find("dd").mouseover(function(){
				ImgIdx = $(this).index();
				imgScroll($imgHover,ImgIdx,imgSwidth,150);
				imgShow(ImgIdx);
				$span.text(arrTitle[ImgIdx]);
				$samp.text((ImgIdx+1) + " / " + imgLen);
				
			});
			var pages = imgLen/options.page,
			    thisPage = 0,
				nLeft = options.page * imgSwidth;
				/*if(/^\d+$/.test(imgLen/options.page)){
					pages += 1;	
				};*/
			$prev.click(function(){
				$imgHover.hide(0,function(){
					$(this).css({"left":options.page*imgSwidth});
				});
				if(thisPage > 0 ) {
					thisPage--;
					$SmallImgS.animate({"left":-nLeft*thisPage},200);
				};
				return false;
			});
			$next.click(function(){
				$imgHover.hide(0,function(){
					$(this).css({"left":0});
				});
				if(thisPage < pages-1 ) {
					thisPage++;
					$SmallImgS.animate({"left":-nLeft*thisPage},200);
				};
				return false;
			});
	
		});
	};
})(jQuery)