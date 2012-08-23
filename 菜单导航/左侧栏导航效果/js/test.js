var KB = function(str){
	this.nod = new Array();
	return this.init(str);
}
KB.prototype={
	version:'1.0',
	init: function(str){
		str = str||document;
		if(str.nodeType ) {
			return this;
		} else if ( typeof str == "string" ) {
				this.proStr = str;
				this.nodParent = document;
				var tm = str.split(":");
				if(tm.length>1){
					for(var i=0; i<tm.length; i++){
						this.getNodes(tm[i]);
					}
					return this;
				}else{
					return this.getNodes(str);
				}
				
		}
	},
	getNodes:function(str){
		this.proStr = str;
		if(str.indexOf('=')!=-1){
			this.getId();	
		}else if(str.indexOf('@')!=-1){
			this.getCN();	
		}else if(str.indexOf('&')!=-1){
			this.getN();
		}else{
			this.getEN();	
		}
		this.nodParent = this.nod[1];
		typeof this.nodParent == "undefined"?this.nodParent = document:this.nodParent;
		return this;
	},
	getChild:function(c){
		var f = new Array();
		if(typeof this.nod[0]=='undefined')return f;
		var s = this.nod[0].getElementsByTagName(c);
		for(var i=0; i<s.length; i++){
			f.push(s[i]);
		}
		return f;
	},
	getParent:function(){
		var arr = new Array();
		for(var i=1; i<this.nod.length; i++){
			arr.push(this.nod[i].parentNode);	
		}
		return arr;
	},
	getId : function(){
		var a = this.proStr.split('=');
		this.nod[0] = this.nod[1] = this.nodParent.getElementById(a[1]);
		return this;
	},
	getCN : function(){
		var a = this.proStr.split('@');
		var s = this.nodParent.getElementsByTagName(a[0]);
		var ii = 1;
		for(var i=0; i<s.length; i++){
			if((' '+s[i].className+' ').indexOf(' '+a[1]+' ')!=-1){
				this.nod[ii] = s[i];
				ii++;
			}
		}
		this.nod[0] = this.nod[1];
		return this;
	},
	getN : function(){
		var a = this.proStr.split('&');
		var s = this.nodParent.getElementsByTagName(a[0]);
		var ii = 1;
		for(var i=0; i<s.length; i++){
			if(s.item(i).getAttribute(a[1])){
				this.nod[ii] = s[i];
				ii++;
			}
		}
		this.nod[0] = this.nod[1];
		return this;
	},
	getEN : function(){
		var s = this.nodParent.getElementsByTagName(this.proStr);
		for(var i=0; i<s.length; i++){
			this.nod[i+1] = s[i];	
		}
		this.nod[0] = this.nod[1];
		return this;	
	},
	getNod: function(val){
		var t = this.nod.length-1;
		if(val<0)val=0;
		if(val>=t){this.nod[0]=this.nod[t];return this;}
		this.nod[0] = this.nod[val];
		this.nodParent = this.nod[0];
		return this;
	},
	val : function(num){
		if(!num)num=0;
		if(this.nod.length>0){
			for(var i=0; i<this.nod.length; i++){
				if(i==num){
					return 	this.nod[i].innerHTML;
				}
			}
		}
		return null;
	},
	value:function(val){
		if(val){
			return this.nod[0].value = val;
		}else{
			return this.nod[0].value;	
		}
	},
	setVal:function(val){
		this.nod[0].innerHTML = val;
	},
	hidden : function(){
		if(arguments.length==0){
			for(var i=0; i<this.nod.length; i++){
				this.nod[i].style.display = 'none';
			}
		}else{
			this.nod[arguments[0]].style.display = 'none';
		}
	},
	show : function(){
		if(arguments.length==0){
			for(var i=0; i<this.nod.length; i++){
				this.nod[i].style.display = 'block';
			}
		}else{
			this.nod[arguments[0]].style.display = 'block';
		}
	},
	setCss:function(pro,val){
		if(KB.bom.webkit){
			return	this.nod[0].style.cssText += pro+":"+val;	
		}
		pro = pro.replace('-','');
		for(var k in this.nod[0].style){
			if(pro.toLowerCase()==k.toLowerCase()){
				this.nod[0].style[k] = val;
				return;
			}
		}
	},
	css:function(str,target){
		var t = this.nod[0];
		if(target){this.nod[0] = target;}
		str = str.split(/=|,/);
		for(var i=0; i<str.length; i=i+2){
			this.setCss(str[i],str[i+1]);
		}
		this.nod[0] = t;
	},
	set:function(k,v){
		this.nod[0][k] = v;
		return this;
	},
	get:function(k){
		return typeof(this.nod[0][k])=='undefined'?null:this.nod[0][k];
	},
	request:{
		onload:function(){},
		pars:'',
		method:'',
		load:function(url){
			var t = new Date().getTime();
			url.indexOf('?')!=-1?this.url = url+'&ajaxt='+t:this.url=url+'?ajaxt='+t;
			if(window.ActiveXObject){
				this.xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}else if(window.XMLHttpRequest){
				this.xmlHttp=new XMLHttpRequest();
			}
			if(this.method.toLowerCase()=="post"){
			this.xmlHttp.open("POST",this.url,true);
			this.xmlHttp.setRequestHeader("content-length",this.pars.length);
			this.xmlHttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
			this.xmlHttp.setRequestHeader("Cache-Control","no-cache");
			this.xmlHttp.send(this.pars);
			}
			else{
				this.xmlHttp.open("GET",this.url,true);
				this.xmlHttp.setRequestHeader("Cache-Control","no-cache");
				this.xmlHttp.send(null);
			}
			var $A = this;
			this.xmlHttp.onreadystatechange = function(){
				if($A.xmlHttp.readyState==4){
					if($A.xmlHttp.status==200){
						$A.onload($A.xmlHttp);
					}else if($A.xmlHttp.status==404){
						try {
							$A.nofound();
						}catch(e){}
					}else if($A.xmlHttp.status==500){
						try {$A.webError();}catch(e){}
					}else{
						try {$A.error();}catch(e){}
					}
				}
			};
		}
	},
	dd:function(fun,target){
		if(!target)target=this.nod[0];
		new KB.dragDrop(fun,this.nod[0],target);
	},
	Click:function(func){
		KB.reg(this.nod[0],'click',func);
		return this;
	},
	nodeState:{},
	clicked:function(fun,type){
		var $f = this;
		for (var i = 1; i < this.nod.length; i++) {
			KB.reg($f.nod[i], 'click', fun);
			KB.reg($f.nod[i], 'click', function(){
				var f = $f.nodeState.nod;
				if($f.nodeState.nod){
					f.className = $f.nodeState.lastClass;
				}
				$f.nodeState.nod = $f.nod[i];
				$f.nodeState.lastClass = $f.nod[i].className;
				$f.nod[i].className = type;
			});
		}
		return this;
	},
	hover:function(type){
		var $g = new Array();
		var $f = this;
		for(var i=1; i<this.nod.length; i++){
			var t = this.nod[i].className;
			$g[i] = this.nod[i];
			KB.reg($g[i],'mouseover',function(){
				if($f.nodeState.nod){  
					if($g[i]==$f.nodeState.nod){return;}
				}
				$g[i].className = type;
			});
			KB.reg($g[i],'mouseout',function(){
				if($f.nodeState.nod){  
					if($g[i]==$f.nodeState.nod){return;}
				}
				$g[i].className = t;
			});
		}
		return this;
	},
	getWidth:function(){
		return this.nod[0].offsetWidth;
	},
	getHeight:function(){
		return this.nod[0].offsetHeight;
	},
	alpha:function(val,n){
		var t = 0;
		if(typeof(n)=='object'){
			this.nod[t] = n;
		}else{
			t = n;
			if(n==''||n==null){t=0}
		}
		var msie = KB.sys();
		if(msie.ie){
			this.nod[t].style.zoom = 1;
		}
		
		this.nod[t].style.opacity = val/10;
		this.nod[t].style.filter = 'alpha(opacity='+ val*10 +')';
		return this;
	}
}
KB.prototype.play = function(val){
	if(val==''||val==null){val=0;}
	this.alpha(0,val);
	var nod = this.nod[val];
	var proOp = 0;
	(function(){
			  	if(proOp==10){return;}
				proOp++;
			  	nod.style.opacity = proOp/10;
				nod.style.filter = 'alpha(opacity='+ proOp*10 +')';
				setTimeout(arguments.callee,50);
			  })();
}
KB.prototype.display = function(val){
	if(val==''||val==null){val=0;}
	this.alpha(10,val);
	var nod = this.nod[val];
	var proOp = 10;
	(function(){
			  	if(proOp==0){return;}
				proOp--;
			  	nod.style.opacity = proOp/10;
				nod.style.filter = 'alpha(opacity='+ proOp*10 +')';
				setTimeout(arguments.callee,50);
			  })();	
}
KB.prototype.domain = 'alibaba.com';
KB.prototype.cookie = document.cookie;
KB.prototype.getCookie = function(name){
	if(name){
		var list = this.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
  		if(list != null) return unescape(arr[2]); return null;
	}else{return this.cookie;}
}
KB.prototype.setCookie = function(name,value,date){
  if(!date)date=30;
  var Days = date; 
  var exp  = new Date();   
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  this.cookie = document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString()+";domain="+this.domain+";path=/";
}
KB.prototype.delCookie = function(name){
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=this.getCookie(name);
  if(cval!=null) this.cookie = document.cookie=name +"="+cval+";expires="+exp.toGMTString();
}
KB.sys = function(){
	var bom = {};
    var na = navigator.userAgent.toLowerCase();
    var t;
	(t = na.match(/webkit\/([\d.]+)/)) ? bom.webkit = t[1]:0;
    (t = na.match(/msie ([\d.]+)/)) ? bom.ie = t[1] :
    (t = na.match(/firefox\/([\d.]+)/)) ? bom.firefox = t[1] :
    (t = na.match(/chrome\/([\d.]+)/)) ? bom.chrome = t[1] :
    (t = na.match(/opera.([\d.]+)/)) ? bom.opera = t[1] :
    (t = na.match(/version\/([\d.]+).*safari/)) ? bom.safari = t[1] : 0;
	return bom;
};
KB.bom = KB.sys();
KB.reg = function(target, type, func){
		if (target.addEventListener){
        	target.addEventListener(type, func, false);
		}else if (target.attachEvent){
	        target.attachEvent("on" + type, func);
	    }else{ target["on" + type] = func;}
	}
KB.delReg=function(target, type, func){
		if (target.removeEventListener){
        	target.removeEventListener(type, func, false);
		}else if (target.detachEvent){
			
	        target.detachEvent("on" + type, func);
		}else{ delete target["on" + type];}
}
KB.dragDrop = function(fun,nod,target){
	if (!target) {
		target = nod;
	}
	this.target = target;
	this.nod = nod;
	this.fun = fun;
	new KB('null').css('cursor=move',target);
	this.x = 0;
	this.y = 0;
	var $f = this;
	this.move=function(){
		var $i=arguments[0]||window.event;
		var mx = $i.pageX||$i.clientX;
		var my = $i.pageY||$i.clientY;
		var $j = mx-$f.x;
		var $k = my-$f.y;
		$f.nod.style.top=$k+'px';
		$f.nod.style.left=$j+'px';
	};
	this.down = function(){
		var r = new KB();
		KB.delReg(document.body,'mouseup',$f.up);
		KB.delReg(document.body,'mouseout',$f.up);
		var $i=arguments[0]||window.event;
		$f.x = $i.layerX||$i.offsetX;
		$f.y = $i.layerY||$i.offsetY;
		r.alpha(4,$f.nod);
		r.css('position=absolute',$f.nod);
		KB.reg(document.body,'mousemove',$f.move);
		KB.reg(document.body,'mouseup',$f.up);
		KB.reg(document.body,'mouseout',$f.up);
		delete r;
	};
	this.up = function(){
		new KB().alpha(10,$f.nod);
		KB.delReg(document.body,'mousemove',$f.move);
		KB.delReg(document.body,'mouseup',$f.up);
		KB.delReg(document.body,'mouseout',$f.up);
		$f.fun();
	};
	KB.reg(target,'mousedown',this.down);
}
KB.ready = function(func){ 
   if(!window.__load_events){
	   var init = function (){
          if (arguments.callee.done) return; 
          arguments.callee.done = true; 
          if (window.__load_timer) { 
              clearInterval(window.__load_timer); 
              window.__load_timer = null; 
          } 
          for (var i=0;i < window.__load_events.length;i++) { 
              window.__load_events[i](); 
          } 
          window.__load_events = null; 
      };
	  
      if (document.addEventListener) { 
          document.addEventListener("DOMContentLoaded", init, false); 
      }
	  if(window.attachEvent){
		/*document.write("<scr"+"ipt id=__ie_onload defer src=//0><\/scr"+"ipt>"); 
          var script = document.getElementById("__ie_onload"); 
          script.onreadystatechange = function() { 
              if (this.readyState == "complete") { 
                  init();
              } 
          }; */  
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				init();
			}
		});
	  }
      if (/WebKit/i.test(navigator.userAgent)) { 
          window.__load_timer = setInterval(function() { 
              if (/loaded|complete/.test(document.readyState)) { 
                  init();
              } 
          }, 10);
      } 
      window.onload = init; 
      window.__load_events = []; 
   }
   window.__load_events.push(func); 
};
KB.getPos = function(elementobj){
	var ms = KB.sys();
	var el = elementobj;
	if(el.parentNode === null || el.style.display == 'none'){ return false;}
	var parent = null;
	var pos = [];
	var box;
	if(el.getBoundingClientRect){
		box = el.getBoundingClientRect();
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		return {x:box.left + scrollLeft, y:box.top + scrollTop};
	}else if(document.getBoxObjectFor){box = document.getBoxObjectFor(el);
		var borderLeft = (el.style.borderLeftWidth)?parseInt(el.style.borderLeftWidth):0;
		var borderTop = (el.style.borderTopWidth)?parseInt(el.style.borderTopWidth):0;
		pos = [box.x - borderLeft, box.y - borderTop];
	}else{
		pos = [el.offsetLeft, el.offsetTop]; 
		parent = el.offsetParent;    
		if (parent != el) {         
			while (parent) {  
				pos[0] += parent.offsetLeft; 
				pos[1] += parent.offsetTop;  
				parent = parent.offsetParent; 
			}         
		}        
		if (ms.opera||(ms.safari && el.style.position == 'absolute' )) {
			pos[0] -= document.body.offsetLeft;
			pos[1] -= document.body.offsetTop;
		}     
	}
	if (el.parentNode) { parent = el.parentNode; }
	else { parent = null; }
	while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML'){
		pos[0] -= parent.scrollLeft;        
		pos[1] -= parent.scrollTop;
		if (parent.parentNode) { parent = parent.parentNode; }
		else { parent = null; }
	}
	return {x:pos[0], y:pos[1]};
}
KB.format = function(s,t){
	var f = new KB();
	try{
		if(t){
			var a = new Array();
			a.push(s[0]);
			a = a.concat(s);
			f.nod = a;
			return f;
		}
		f.nod[0]=f.nod[1] = s;
	}catch(e){}
	return f;
}
KB.grid = function(){
	
}
KB.isNode = function(id){if(!document.getElementById(id)){return false;}return true;}
KB.dailog = function(obj){KB.getZdiv();if(obj.id){};if(obj.title){}}
KB.openWindow = function(url,title){KB.getZdiv();}
KB.openTip = function(){}
KB.getZdiv = function(){
	if (!KB.isNode('kb_zdiv')) {
		var domdiv = document.createElement('div');
		domdiv.id = 'kb_zdiv';
		domdiv.className = 'kb_zdiv';
		domdiv.index = 9600;
		document.body.appendChild(domdiv);
		domdiv.style.width = document.body.offsetWidth+'px';
		domdiv.style.height = document.body.offsetHeight+'px';
	}else{
		new KB('div=kb_zdiv').show();
	}
}
KB.loading = function(){
	if (!KB.isNode('kb_loading')) {
		var domdiv = document.createElement('div');
		domdiv.id = 'kb_loading';
		domdiv.className = 'kb_loading';
		domdiv.index = 9700;
		document.body.appendChild(domdiv);
		domdiv.innerHTML = '<ins class="loading_gif"></ins><p class="font26">data loading...</p>';
		domdiv.style.width = document.body.offsetWidth+'px';
		domdiv.style.height = document.body.offsetHeight+'px';	
	}else{
		new KB('div=kb_loading').show();
	}	
}
KB.inputTip = function(nod,txt,class1,class2){
	/*(nod,txt,class1,class2)=>(input node, msg text, msg className, input's value className)*/
	(function(){nod.onfocus = function(){
		if(nod.value==txt){nod.value = '';nod.className = class2;}
	};
	})();
	(function(){
		nod.onblur = function(){
			if(nod.value==''){nod.value = txt;nod.className = class1;}
		};
	})()
}
KB.tab = new Array();
KB.regListChange = function(arr,name,class1,class2,fun){
	/*(arr,name,class1,class2,fun)=>(TAB array, reg eventName, clicked className, unclick className, API function)*/
		if(!KB.tab[name]){
			KB.tab[name]= {nod:'0'};
		}
		for(var i=0; i<arr.length; i++){
			(function(i){KB.reg(arr[i],'click',function(){fun(i);arr[KB.tab[name].nod].className = class2; arr[i].className = class1;KB.tab[name].nod = i;});})(i);	
		}
}
KB.regHover = function(k,class1,class2,unclass,fun){
	/*(k,class1,class2,unclass,fun)=>(KB object,hover className, nuhover className, click_active className, API function)*/
	for(var i=1; i<k.nod.length; i++){
		if(unclass.length>0){if(" "+k.nod[i].className+" ".indexOf(' '+unclass+' ')!=-1){continue;}}
		(function(i){
				KB.reg(k.nod[i],'mouseover',function(){
													 k.css('position=relative',k.nod[i]);
													 if(class1!=null){
													 	k.nod[i].className = class1;
													 }
													 if(fun){fun(k,i,true);} 
													 });
				KB.reg(k.nod[i],'mouseout',function(){
													k.css('position=static',k.nod[i]);
													if(class2!=null){
														k.nod[i].className = class2;
													}
													if(fun){fun(k,i,false);} 
													});
		})(i);
	}
}

var ShortCut = {
	shut:false,
	init:function(){
		KB.reg(ShortCut.cutBtn.nod[0],'mouseover',ShortCut.show);
		KB.reg(ShortCut.cut.nod[0],'mouseout',ShortCut.hidden);
		new KB('b=short_cu').nod[0].title = ShortCut.title1;
	 	ShortCut.hidden();
	},
	open:function(){
		if(!ShortCut.shut){
			ShortCut.cut.show();
			ShortCut.cutBtn.hidden();	
			ShortCut.shut = false;
		}
	},
	show:function(){
		ShortCut.shut = false;
		ShortCut.open();
	},
	hidden:function(){
		if(!ShortCut.shut){
			ShortCut.shut = true;
			ShortCut.close();
		}	
	},
	close:function(){
		if(ShortCut.autoCu){ShortCut.shut = false;return;}
		if(ShortCut.shut){
			ShortCut.cut.hidden();
			ShortCut.cutBtn.show();	
		}
	},
	autoCu:false,
	cu:function(){
		if(ShortCut.autoCu){
			ShortCut.autoCu = false;
			ShortCut.cuBtn.className="icon57";
			ShortCut.cuBtn.title = ShortCut.title1;
		}else{
			ShortCut.autoCu = true;
			ShortCut.cuBtn.className="icon58";
			ShortCut.cuBtn.title = ShortCut.title2;
		}
	}
}
function DHchange(k,i,t){
	var s = k.getNod(i).getChild('div');
	if(s.length>0){
		if(t){
			KB.format(s[0]).show();
		}else{
			KB.format(s[0]).hidden();
		}
	}
}
var tips = {
		htmlstr:'<div class="tips_box"><div class="tips_content"></div><div class="tips_bottom">&nbsp;</div><div class="tips_arr_left" id="tips_arr"></div></div>'
	};
tips.init = function(){
	tips.createBox();
	var f = new KB('*&tips');
	KB.regHover(f,null,null,'',tips.active);
	if(tips.arr.length>0){
		tips.formatArr();
	}
}

tips.set = function(obj){
	tips.arr.push(obj);
}
tips.formatArr = function(){
	for(var i=0; i<tips.arr.length; i++){
		if(tips.arr[i].id&&tips.arr[i].text){
			var k = new KB('*='+tips.arr[i].id);
			k.set('tips',tips.arr[i].text);
			if(tips.arr[i].width){
				k.set('tipswidth',tips.arr[i].width);
			}
			(function(k){
				  	KB.regHover(k,null,null,'',tips.active);
				 })(k);	
		}
	}
}
tips.createBox = function(){
	var tipsdiv = document.createElement("div");
	tipsdiv.id = 'tips';
	tipsdiv.className = 'tips';
	tipsdiv.innerHTML = tips.htmlstr;
	document.body.appendChild(tipsdiv);
	KB.reg(tipsdiv,'mouseover',function(){tips.out=false;});
	KB.reg(tipsdiv,'mouseout',function(){tips.out=true;});
}
tips.xdebug = 0;
tips.ydebug = 0;
tips.i = '';
tips.width = 200;
tips.arr = new Array();
tips.active = function(k,num,t){
	if(tips.i==num){
		if(!t){tips.out = true; return;}	
	}
	tips.i=num;
	tips.out = false;
	var tip = new KB('div=tips');
	var srr = tip.getChild('div');
	var tipscontent = k.nod[num].getAttribute('tips');
	var tipswidth = tips.width;
	if(k.nod[num].getAttribute('tipswidth')){
		tipswidth =  k.nod[num].getAttribute('tipswidth');
	}
	tip.css('width='+tipswidth+'px');
	for(var i=0; i<srr.length; i++){
		if(srr[i].className == 'tips_bottom'){
			srr[i].style.width = tipswidth+'px';	
		}
		if(srr[i].className == 'tips_content'){
			srr[i].innerHTML = tipscontent;	
			srr[i].style.width = tipswidth-20+'px';
		}
	}
	var documentWidth = document.body.clientWidth;
	var documentHeight = document.body.clientHeight;
	var pos = KB.getPos(k.nod[num]);
	var g = k.nod[num].offsetWidth;
	var gg = k.nod[num].offsetHeight;
	var x = parseInt(pos.x)+g+tips.xdebug+5;
	var y = parseInt(pos.y)+tips.xdebug;
	var btn = new KB('div=tips_arr');
	tip.show();
	var tipheight = parseInt(tip.getHeight());
	if((x+parseInt(tipswidth))>documentWidth){
		x = x-g-tipswidth;
		btn.nod[0].className = 'tips_arr_right';
	}else{
		btn.nod[0].className = 'tips_arr_left';	
	}
	if((y+tipheight)>documentHeight){
		y = y+gg-tipheight;
		btn.css('top='+(tipheight-gg)+'px');
	}else{
		btn.css('top=15px');	
	}
	var tip = new KB('div=tips');
	tip.css('left='+x+',top='+y+',z-index=9800');

	tips.display();
}
tips.out = false;
tips.display = function(){
	if(tips.out){
		var tip = new KB('div=tips');
		tip.hidden();
	}else{
		setTimeout("tips.display()",1000);	
	}
}
KB.ready(tips.init);
imgIndex = 0;
imgClose = false;
function getImgBox(k, i, t) {
	var btn = new KB('span=imgicon');
	var box = new KB('div=imgbox');
	if (t) {
		imgClose = false;
		if(imgIndex==i){
			box.show();
			return;
		}
		imgIndex = i;
		var pos = KB.getPos(k.nod[i]);
		var x = parseInt(pos.x) + 120 + 'px';
		var y = parseInt(pos.y);
		if(y+250>document.body.clientHeight){
			btn.css('top=200px');
			y = y-200 ;
		}else{
			btn.css('top=30px');	
		}
		y+='px';
		box.css('left=' + x + ',top=' + y);
		box.getChild('img')[0].src = k.getNod(i).getChild('img')[0].src;
		box.getChild('img')[0].height = 250;
		box.getChild('img')[0].width = 250;
		box.show();
	} else {
		imgClose = true;
		setTimeout(closeImg,1000);
	}
}
function closeImg(){
	if(imgClose){
		new KB('div=imgbox').hidden();
	}
}
function report(id){
	this.id = id;
	return this.init();
}
report.numTitle = '';
report.prototype = {
	init:function(){
		this.format();
		return this.set();
	},
	format:function(){
		var g = new KB('*='+this.id).val().toLowerCase().replace(/<report>|<\/report>/g,'').split('<item>');
		this.list = new Array();
		this.MAXCOUNT = 0;
		if(g.length<=1){
			return this.list = null;
		}
		for(var i=1; i<g.length; i++){
			(function(str,p){
				var gs = str.split(/\[|:/);
				var tem = {};
				for(var j=1; j<gs.length; j+=2){
					
					var va = gs[j+1].replace('\]','');
					
					if(gs[j]=='count'){
						!/^\d+$/.test(va)?va=0:va=va;
						if(parseInt(va)>p.MAXCOUNT){
							p.MAXCOUNT=va;
						}
					}
					tem[gs[j]] = va;
				}
				p.list.push(tem);
			})(g[i].replace('}</item>',''),this)
		}
		return this.list;
	},
	setNull:function(){},
	set:function(){
		if(!this.list)this.list = null;
		if(this.list==null){
			return this.setNull();	
		}
		var str = '';
		for(var i=0; i<this.list.length; i++){
			var rgb = '#'+this.R+''+this.R+''+this.G+''+this.G+''+this.B+''+this.B;
			this.setNextColor();
			var num = this.list[i].count;
			if(i==0){
				str += '<div class="report_title" style="margin-top:0;">';	
			}else{
				str += '<div class="report_title">';	
			}
			str += '<span>'+this.list[i].name+'</span><b>('+report.numTitle+num+')</b></div>';
			str += '<div class="report_count" id="report_count_'+i+'" style="background-color:'+rgb+'"></div>';
		}
		new KB('*='+this.id).setVal(str);
		this.show();
	},
	show:function(){
		var g = new KB('*='+this.id).getWidth();
		var gof =parseInt(g)/this.MAXCOUNT;
		for(var i=0; i<this.list.length; i++){
			(function(i,p){
			var width = parseInt(p.list[i].count)*gof;
			new report.play(new KB('*=report_count_'+i),parseInt(width));
			})(i,this)
		}
	},
	setNextColor:function(){
		if(this.rgbexe=='g'){
			var gcolor = parseInt(this.G,16);
			gcolor -= 2;
			if(gcolor<0){
				this.G = '0';
				this.B = '0';
				this.rgbexe='b';
			}else{
				this.G = gcolor.toString(16);	
			}
		}else if(this.rgbexe == 'b'){
			var gcolor = parseInt(this.B,16);
			gcolor += 2;
			if(gcolor>15){
				this.R = 'f';
				this.B = 'f';
				this.rgbexe='r';
			}else{
				this.B = gcolor.toString(16);	
			}	
		}else if(this.rgbexe == 'r'){
			var gcolor = parseInt(this.R,16);
			gcolor -= 2;
			if(gcolor<0){
				this.R = '0';
				this.G = 'f';
				this.rgbexe='b';
			}else{
				this.R = gcolor.toString(16);	
			}
		}
	}
};
report.prototype.R = 'f';
report.prototype.G = 'f';
report.prototype.B = '0';
report.prototype.rgbexe = 'g';
report.play = function(obj,maxw){
	if(typeof(obj)=='undefined')return;
	var obj = obj;
	var maxw = maxw;
	(function(){
		var w = obj.getWidth();
		if(w + 30>=maxw){
			w +=5;	
		}else{
			w += 30;
		}
		if(w>=maxw){
			w=maxw;
			return obj.css('width='+w+'px');
		}
		obj.css('width='+w+'px');
		setTimeout(arguments.callee,50);	
	})();
	
}