(function($){
	$.fn.selectedPopup = function(options) {
	var opts = $.extend({},
	$.fn.selectedPopup.defaults, options);
	return this.each(function() {
		var $this = $(this),
		_this = $this[0],
		$selectedText = '',
		reg = /^#/,
		regTwo = /^\./,
		str,switchs=true,
		showBox = document.createElement("div"),
		$selectStr = opts.showSelect.replace(/\s\S/, ''),
		sina = "<a target='_blank' href='http://v.t.sina.com.cn/share/share.php?title=",
		tencent = "<a target='_blank' href='http://v.t.qq.com/share/share.php?title=";
		if (reg.test($selectStr)) {
			$(showBox).attr("id", $selectStr.replace(reg, ''));
		} else if (regTwo.test($selectStr)) {
			$(showBox).attr("class", $selectStr.replace(regTwo, ''));
		}
		$this.bind({
			mouseup: function(e) {
				var x = e.clientX,
				y = e.clientY;
				process(e.button == 0,x,y);
			},
			mousedown: function(e) {
				$(showBox).stop().removeAttr('style').hide();
			},
			click: function(e) {
				e.stopPropagation();
			}
		});
		$(showBox).bind({
			mouseenter: function() {
				$(this).stop().fadeTo(100, 1);
			},
			mouseleave: function() {
				$(this).stop().fadeTo(2000, opts.opacityVal);
			}
		});
		 $(document).bind({
		 	click: function(e) {
				if ($selectedText != '') {
					e.target.tagName.toLowerCase() == 'html' && $(showBox).removeAttr("style").hide();
				}
			},
			keydown : function(e){
				if(e.ctrlKey && e.keyCode ==65){
		 			switchs = false;
		 		}
			}
		 });
		 function process(e,x,y){
		 	if(switchs){
		 		if ($.browser.msie) {
					$selectedText = document.selection.createRange().text;
				} else {
					if (_this.tagName.toLowerCase() == 'textarea') {
						$selectedText = $this.text().substring(this.selectionStart, this.selectionEnd);
					} else {
						$selectedText = document.getSelection().toString();
					}
				}
				if ($.trim($selectedText) && e) {
					$("body").append(showBox);
					var _info = $selectedText + '→→来自页面：' + $("title").text() + '&url=' + window.location.href;
					if (opts.insert instanceof Array) {
						for (var i = 0, j = opts.insert.length; i < j; i += 1) {
							opts.sharewhere[i] == "sina" && (opts.insert[i] = sina + _info + "'>" + opts.insert[i] + "</a>");
							opts.sharewhere[i] == "Tencent" && (opts.insert[i] = tencent + _info + "'>" + opts.insert[i] + "</a>");
						}
						str = opts.insert.join('');
					} else if (typeof opts.sharewhere == 'string') {
						str = opts.insert = (opts.sharewhere == "sina" ? sina: tencent) + _info + "'>" + opts.insert + "</a>";
					}
					$(showBox).empty().append(str).css({
						position: "absolute",
						zIndex: 2147483648,
						top: y - $(showBox).height(),
						left: x
					});
					if(!$(showBox).is(":animated")){
						$(showBox).hide().fadeIn(200)
					}
					if($(showBox).is(":visible")){
						$(showBox).fadeTo(2000, opts.opacityVal);
					}
				}
		 	}
		 	switchs = true;
		 }
	})
}
	$.fn.selectedPopup.defaults = {
		showSelect : "#smallbox",  //弹出窗口的id或者class
		insert : "<img src='images/sina.jpg' />", //显示的小图标，要说明的是这里与sharewhere参数是对应的同样多个的话也是数组形式,图片与sharewhere参数需对应
		opacityVal : 0.2,   //小图标的alpha值
		sharewhere : "sina"  //分享到哪？目前只支持sina和tencent,如果同时存在两个以数组方式给值，如["sina","tencent"]
	}
})(jQuery);