// JavaScript Document
var $ = {
	addEvent : function(oTarget, fnHandler, sEventType){
		if (oTarget.addEventListener) {
			oTarget.addEventListener(sEventType, fnHandler, false);
		} else if (oTarget.attachEvent) {
			oTarget.attachEvent("on" + sEventType, fnHandler);
		} else {
			oTarget["on" + sEventType] = fnHandler;
		}
	},
	removeEvent : function(oTarget, fnHandler, sEventType) {
		if (oTarget.removeEventListener) {
			oTarget.removeEventListener(sEventType, fnHandler, false);
		} else if (oTarget.detachEvent) {
			oTarget.detachEvent("on" + sEventType, fnHandler);
		} else { 
			oTarget["on" + sEventType] = null;
		}
	},
	bind : function(object, fun) {
		return function() {
			return fun.apply(object, arguments);
		}
	},
	bindAsEventListener : function(object, fun) {
		return function(event) {
			return fun.call(object, (event || window.event));
		}
	},
	extend : function(destination,source){
		for(var o in source)
			destination[o] = source[o];
		return destination;
	},
	preventDefault : function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;	
		}	
	},
	getDetail : function(event){
		var detail = 0;
		if(event.wheelDelta){
			detail = - event.wheelDelta / 40;	
		}else{
			detail = event.detail;	
		}	
		return detail;
	},
	getWhich : function(event){
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}		
	},
	get : function(o){
		return document.getElementById(o);	
	},
	getPos : function (e) {
		e = e || window.event;
		var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
		var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
		
		return { 'pageX':x,'pageY':y };
	},
	getS : function (obj) {
		var iTop = obj.offsetTop;
		var iLeft = obj.offsetLeft;
		while (obj.offsetParent)
		{
			iTop += obj.offsetParent.offsetTop;
			iLeft += obj.offsetParent.offsetLeft;
			obj = obj.offsetParent;
		}
		return {top:iTop, left:iLeft}	
	},
	each : function(array, callback, thisObject){
		if(array.forEach){
			array.forEach(callback, thisObject);
		}else{
			for (var i = 0, len = array.length; i < len; i++) { callback.call(thisObject, array[i], i, array); 					            }
		}
	},
    getStyle : function( elem, name ) {
		 if (elem.style[name])
			 return elem.style[name];
		 else if (elem.currentStyle)
			 return elem.currentStyle[name];
		 else if (document.defaultView && document.defaultView.getComputedStyle) {
			 name = name.replace(/([A-Z])/g,"-$1");
			 name = name.toLowerCase();
			 var s = document.defaultView.getComputedStyle(elem,"");
			 return s && s.getPropertyValue(name);
		 } else
		 return null;
	}	
};

/*
工具
*/
var Util = {};
/*
拖拽组件

*/
Util.Drag = function(container, drag, options){
	this.init(container, drag,options);	
}
Util.Drag.prototype = {
	constructor : Util.Drag,
	init : function(container,drag,options){
		options = options || {};
		this.container = container;	
		this.drag = drag;
		this.acceleration = options.acceleration || 1;
		this.x = 0;
		this.y = 0;
		this.restrict = options.restrict || false;
		this.restrictX = options.restrictX || false;
		this.restrictY = options.restrictY || false;
		this.Max = {
			top : 9999999,
			left : 9999999
		};	
		
		this.Min = {
			top : 0,
			left : 0
		};
		
		if(this.restrict){
			this.Max.top = this.container.clientHeight - this.drag.offsetHeight;
			this.Max.left = this.container.clientWidth - this.drag.offsetWidth;
		}
		
		this.startFunc = options.startFunc || function(){};
		this.moveFunc = options.moveFunc || function(){};
		this.endFunc = options.endFunc || function(){};
		
		this.Move = $.bindAsEventListener(this,this.move);
		this.Stop = $.bindAsEventListener(this,this.stop);
		this.drag.style.cursor = "move";	
		$.addEvent(this.drag,$.bindAsEventListener(this,this.start),"mousedown");
	},
	start : function(E){	
		this.x = E.clientX - this.drag.offsetLeft;
		this.y = E.clientY - this.drag.offsetTop;		
		$.addEvent(document,this.Move,"mousemove");
		$.addEvent(document,this.Stop,"mouseup");
		this.startFunc.call(this,E, this.container);
		if(document.all){
			$.addEvent(this.drag, this.Stop, "losecapture");
			this.drag.setCapture();
			E.cancelBubble = true;
		}else{
			$.addEvent(window, this.Stop, "blur");
			E.preventDefault();
		}
	},
	move : function(E){
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		this.moveFunc.call(this,E, this.drag, this.container);
		var tempLeft = E.clientX - this.x,
			tempTop = E.clientY - this.y;
		if(tempLeft % this.acceleration == 0){
			var left = 	Math.min(Math.max(tempLeft,this.Min.left),this.Max.left);
			if(!this.restrictX){
				this.drag.style.left = left + "px";
			}
		}
		if(tempTop % this.acceleration == 0){
			var top = Math.min(Math.max(tempTop, this.Min.top),this.Max.top);
			if(!this.restrictY){
				this.drag.style.top = top + "px";
			}	
		}		
	},
	stop : function(E){
		$.removeEvent(document,this.Move,"mousemove");
		$.removeEvent(document,this.Stop,"mouseup");
		this.endFunc.call(this,E, this.container);
		if(document.all){
			$.removeEvent(this.drag, this.Stop, "losecapture");
			this.drag.releaseCapture();
			E.cancelBubble = true;
		}else{
			$.removeEvent(window, this.Stop, "blur");
		}
	}
};

/*
Download by http://www.codefans.net
模拟滚动条
多细节方面参考了cloudgamer  Slider 滑动条效果
http://www.cnblogs.com/cloudgamer/archive/2008/12/24/Slider.html
*/

function Slider(options){
	this.init(options);
}

Slider.prototype = {
	constructor : Slider,
	init : function(options){
		options = $.extend({
			icontainer : "",
			idrag : "",
			plusBtn : "",
			reduceBtn : "",
			panel : "",
			content : "",
			direction : "top",
			acceleration : 5,
			sliderAcc : 1
		}, options || {});
		this.icontainer = $.get(options.icontainer);
		this.idrag = $.get(options.idrag);
		if(options.plusBtn){
			this.plusBtn = $.get(options.plusBtn);
			this.reduceBtn = $.get(options.reduceBtn);			
		}	
		this.direction = options.direction;
		if(options.content){
			this.content = $.get(options.content);
			this.panel = $.get(options.panel);
			
			this.maxSize = {
				"left" : this.panel.scrollWidth - this.content.clientWidth,
				"top" : this.panel.scrollHeight - this.content.clientHeight
			};
		}
		this.acceleration = options.acceleration;
		this.sliderAcc = options.sliderAcc;
		this.Max = {
			top : this.icontainer.clientHeight - this.idrag.offsetHeight,
			left : this.icontainer.clientWidth - this.idrag.offsetWidth		
		};
		this.Min = {
			top : 0,
			left : 0			
		};
		this.timer = null;
		this.dec = -1;
		this.isScroll = false;
		this.isDragAble = false;
		this.addEvent();
	},
	addEvent : function(){
		var self = this,
			isFireFox = navigator.userAgent.indexOf('Firefox') >= 0;
		self.fixedBug();
		if(self.plusBtn){
			$.addEvent(self.plusBtn, function(){
				self.goToward("up", self);
			}, "mousedown");
			$.addEvent(self.plusBtn, function(){
				clearTimeout(self.timer);
			}, "mouseup");	
			$.addEvent(self.reduceBtn, function(){
				self.goToward("down", self);
			}, "mousedown");
			$.addEvent(self.reduceBtn, function(){
				clearTimeout(self.timer);
			}, "mouseup");						
		}
		$.addEvent(self.icontainer, function(event){
			self.isDragAble || self.mouseClick(event, self);
		}, "click");
		
		$.addEvent(self.icontainer, function(event){
			self.scrollFunc(event, self);
		}, isFireFox ? "DOMMouseScroll" : "mousewheel");		
		
		$.addEvent(self.icontainer, function(event){
			self.keydown(event, self);
		}, "keydown");
		
		new Util.Drag(self.icontainer, self.idrag, {
			startFunc : function(E, $obj){
				self.isDragAble = true;
			},
			restrict : true, 
			restrictX : self.direction == "top" ? true : false, 
			restrictY : self.direction == "top" ? false : true,
			moveFunc : function(E, idrag, icontainer){
				if(self.content){
					self.callback(parseInt($.getStyle(idrag, self.direction)), self.Max[self.direction]);
				}
			},
			endFunc : function(E){		
				setTimeout(function(){
					self.isDragAble = false;
				},10);
			},
			acceleration : self.sliderAcc
		});		
	},
	run : function (self){
		var self = self || this,		
			style = self.idrag.style;
		if(self.timer){
			clearTimeout(self.timer);
		}
		var acc = self.dec > 0 ? self.acceleration : - self.acceleration;
		var posUp = Math.min(Math.max(parseInt($.getStyle(self.idrag, self.direction)) + acc,self.Min[self.direction]),self.Max[self.direction]);
		if(self.content){
			self.callback(posUp, self.Max[self.direction]);
		}
		style[self.direction] = posUp + "px";
		if(!self.isScroll){
			var arg = arguments.callee;
			self.timer = setTimeout(function(){
				arg.call(self);
			}, 10);
		}	
	},	
	callback : function(distance){
		this.content[this.direction == "top" ? "scrollTop" : "scrollLeft"] = (distance / this.Max[this.direction]) * this.maxSize[this.direction];
		this.fix(distance);	
	},
	fix : function(distance){
		if(distance >= this.Max[this.direction]){
			this.content[this.direction == "top" ? "scrollTop" : "scrollLeft"] = this.maxSize[this.direction];
		}		
	},	
	goToward : function (direction, self){
		self.isScroll = false;
		if(direction == "down"){
			self.dec = 10;
			self.run(self);
		}else{
			self.dec = -10;
			self.run(self);
		}		
	},
	mouseClick : function(event, self){
		var pos = $.getPos(event),
			offset = $.getS(self.idrag),
			dis = pos[self.direction == "top" ? "pageY" : "pageX"] - offset[self.direction],
			top = parseInt($.getStyle(self.idrag, self.direction)),
			lockTop = Math.min(Math.max(Math.ceil(dis) + top - self.idrag[self.direction == "top" ? "offsetHeight" : "offsetWidth"] / 2,self.Min[self.direction]),self.Max[self.direction]);		
		self.idrag.style[self.direction] = lockTop + "px";
		if(self.content){
			self.callback(parseInt($.getStyle(self.idrag, self.direction)), self.Max[self.direction]);	
		}
		$.preventDefault(event);	
	},	
	scrollFunc : function scrollFunc(event, self){
		self.dec = $.getDetail(event);
		self.isScroll = true;
		self.run();
		$.preventDefault(event);
	},	
	keydown : function scrollFunc1(event, self){
		var which = $.getWhich(event);
		if(which === 38){
			self.dec = - 10;
		}
		
		if(which === 40){
			self.dec = 10;
		}
		self.isScroll = true;
		self.run();
		$.preventDefault(event);
	},		
	fixedBug : function(){
		var self = this;
		this.icontainer.tabIndex = -1;
		document.all || (this.icontainer.style.outline = "none");
		if(!document.all){
			$.addEvent(this.icontainer, function(){
				self.icontainer.focus();
			}, "mouseover");
			$.addEvent(this.icontainer, function(){
				self.icontainer.blur();
			}, "mouseout");			
		}	
	}
};