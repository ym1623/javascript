(function (window, undefined) {
    if (window.ifeng) {
        return;
    }
    var ifeng = {},
	rfocusable = /^(?:button|input|object|select|textarea)$/i;
	var isPhotoImageLoaded = false;
	var staSign = true;
    Function.prototype.bind = function () {
        if (!arguments.length) return this;
        var _ = this,
            $ = Array.prototype.slice.call(arguments),
            A = $.shift();
        return function () {
            return _.apply(A, $.concat(Array.prototype.slice.call(arguments)))
        }
    };
    var removeListener;
    window.addListener = function (list, name, fn) {
        var bind, unbind, id = "EVENT";
        if (document.attachEvent) {
            bind = function (el, eventName, _fn) {
                _fn[id] = function () { _fn(event, el); };
                el.attachEvent('on' + eventName, _fn[id]);
            }
            unbind = function (el, eventName, _fn) {
                el.detachEvent('on' + eventName, _fn[id]);
            }
        } else if (document.addEventListener) {
            bind = function (el, eventName, _fn) {
                _fn[id] = function (e) { _fn(e, el); };
                el.addEventListener(eventName, _fn[id], false);
            }
            unbind = function (el, eventName, _fn) {
                el.removeEventListener(eventName, _fn[id], false);
            }
        }
        else {
            bind = function (el, eventName, _fn) {
                el['on' + eventName] = _fn;
            }
            unbind = function (el, eventName, _fn) {
                el['on' + eventName] = null;
            }
        }
        window.addListener = function (list, name, fn) {
            if (Object.prototype.toString.apply(list) != "[object Array]")
                list = [list];
            var i = -1, len = list.length;
            while (++i < len) {
                bind(list[i], name, fn);
            }
        };
        removeListener = window.removeListener = function (list, name, fn) {
            if (Object.prototype.toString.apply(list) != "[object Array]")
                list = [list];
            var i = -1, len = list.length;
            while (++i < len) {
                unbind(list[i], name, fn);
            }
        };
        addListener(list, name, fn);
    }

    function addStylesheetRules(rules) {
        var style = document.createElement('style');

        document.body.appendChild(style);
        if (!window.createPopup) { /* For Safari */
            style.appendChild(document.createTextNode(''));
        }
        var s = document.styleSheets[document.styleSheets.length - 1];
        for (var selector in rules) {
            if (s.insertRule) {
                s.insertRule(selector + '{' + rules[selector] + '}', s.cssRules.length);
            }
            else { /* IE */
                s.addRule(selector, rules[selector], -1);
            }
        }
    }

    var photoViewMode = {
        "loop": function (index) {//loop
            var t = this;
			index = parseInt(index);
            return {
                prev: index > 1 ? '#p=' + (index - 1) : '#p=' + (t.size ),
                next: index < t.size ? '#p=' + (index + 1) : '#p=0'  
            };
        },
        "skip": function (index) {//continue;
            var t = this;
			index = parseInt(index);
            return {
                prev: index > 1 ? '#p=' + (index - 1) : t.o.prevSet.href,
                next: index < t.size  ? '#p=' + (index + 1) : t.o.nextSet.href
            };
        }
    };

    ifeng.Gallery = function (options) {
        var t = this  ;
		this._timer =0 ;		
        var o = this.o = {  //for easy using
        	 activeThumbCls: "activeThumbCls", photoViewMode: photoViewMode.loop,   
             'btnOrig': $('btnOrig') , 'showallPic':$('showallPic'),  'photoIndex': $('photoIndex'),
             'picDiv':$('picDiv'),'photoView': $('photoView'),'photoPrev': $('photoPrev'), 'photoNext': $('photoNext'),'photo': $('photo'), 'photoPrevLoading':$('photoPrevLoading'),'picList_b':$('picList_b'),
             'photoLoading': $('photoLoading'),   'photoDesc': $('photoDesc'),
             'prevSet': $('prevSet'), 'nextSet': $('nextSet'),         
             'boxScrl': $('scrl'),'thumb': $('thumb'),  'bar': $('bar'), 'btnScrlPrev': $('scrlPrev'), 'btnScrlNext': $('scrlNext'),'scrlPrev_b':$('scrlPrev_b'),'scrlNext_b':$('scrlNext_b'),
             'moretab':$('moretab'),'moreLeft':$('moreLeft'),'moreRight':$('moreRight'),'imageListView':$('imageListView'),'btnPage':$('btnPage')
        }
        if (!options.activeThumbCls) {
            var rules = {};
            rules["." + o.activeThumbCls] = "border:1px solid #F9DF53;";
            addStylesheetRules(rules);
        }
        for (var i in o) {
            (options[i] && (o[i] = options[i]));
        }

		t.data =options.data || [];
        t.turn = photoViewMode[options.photoViewMode];

        t.photoIndex = {};
        t.photoInfo = [];

		o.thumbs =[];
		(function(){
			var list =  o.thumb.getElementsByTagName("li"),len= list.length;
			for(var i = 0;i<len;i++){
				o.thumbs.push(list[i]);
			}			
		})();
		 
        t.size = t.data.length;
		t.offsetSize = o.thumbs.length ;
		t.loadlazyQuene = []; 
		for(var i =  t.offsetSize  ; i < t.size;i++){
			t.loadlazyQuene.push(t.data[i]);
		}
        
	
        var pWidth = o.photoView.offsetWidth,
		pHeight = o.photoView.offsetHeight;
        uWidth = o.thumbs[0].offsetWidth,
		tWidth = uWidth * t.size,
		tCntWidth = o.thumb.parentNode.offsetWidth,
		tNum = Math.floor(tCntWidth / uWidth);

        tCntWidth = uWidth * tNum;
        O.setStyle(o.photoView, "width", pWidth + 'px');
        O.setStyle(o.thumb, "width", (tWidth+2) + 'px');//ie6兼容增加2px
        O.setStyle(o.boxScrl, "width", (tCntWidth + o.btnScrlPrev.offsetWidth * 2) + 'px');

        var bCntWidth = o.bar.parentNode.offsetWidth,
		bWidth = Math.max(36, Math.min(tCntWidth * bCntWidth / tWidth, bCntWidth));

        O.setStyle(o.bar, "width", bWidth + 'px');

        var i = -1, len = t.size;
 
        while (++i < len) {
            var self = t.data[i],
			
			id = self.img.substr(self.img.lastIndexOf('/')+1,self.img.lastIndexOf('.')-self.img.lastIndexOf('/')-1);
			var mult = Math.max(0, Math.min(i - Math.floor((tNum + 1) / 2) + 1, t.size - tNum));

            t.photoInfo.push({
                id: id,
                desc: self.title,
                img: self.img,
                timg: self.timg,
                listimg: self.listimg,
                pos: uWidth * mult,
                picwidth:self.picwidth,
                picheight:self.picheight,
                morelink:self.morelink
            });
            t.photoIndex[id] = i+1;
        }

        t.bar = new ifeng.Scroll(o.thumb, 'x', o.bar);

        addListener([o.btnScrlPrev, o.btnScrlNext, o.bar], 'click', function (event, dom) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        });
       addListener([o.btnScrlPrev, o.btnScrlNext ], 'dblclick', function (event, dom) {  // for clear selection area
             window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        });
        

        addListener(o.btnScrlPrev, 'mousedown', t.bar.start.bind(t.bar, 'forward'))
        addListener(o.btnScrlPrev, 'mouseup', t.bar.stop.bind(t.bar));
        addListener(o.btnScrlPrev, 'mouseout', t.bar.stop.bind(t.bar));
        addListener(o.btnScrlNext, 'mousedown', t.bar.start.bind(t.bar, 'backward'));
        addListener(o.btnScrlNext, 'mouseup', t.bar.stop.bind(t.bar));
        addListener(o.btnScrlNext, 'mouseout', t.bar.stop.bind(t.bar));

        var alist = [o.photoPrev, o.photoNext];
        i = -1, len = o.thumbs.length;  //add event for loaded li
        while (++i < len) {
            Array.prototype.push.call(alist, o.thumbs[i].getElementsByTagName("a")[0]);
        }
        addListener(alist, 'click', function (event, dom) {
            var oHash = t.parseObj(dom.href);

            if (oHash.p) {
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                t.showPhoto(oHash.p).changeHash('p=' + oHash.p);
            }
        });
        
		addListener(o.photoPrevLoading, 'load', function (ev, dom) {
            var oHash = t.parseObj(o.photoNext.href);
            if (oHash.p) {
                (new Image).src = t.photoInfo[parseInt(oHash.p) - 1].timg;
            }
        });


        var oHash = t.parseObj(window.location.hash);
		
		
		if(!oHash.p){
			staSign = false;
			t.changeHash("p=1");
		}
		
        //load left img 	
       
		(function(){	
			 var obj,  oFragmeng = document.createDocumentFragment(); //创建文档碎片; 
			 while((obj =t.loadlazyQuene.shift())!=null){
				var li = document.createElement("li");
				var a  = document.createElement("a"),
					id = obj.img.substr(obj.img.lastIndexOf('/')+1,obj.img.lastIndexOf('.')-obj.img.lastIndexOf('/')-1);     
								
					a.href = "#p=" + (t.size - t.loadlazyQuene.length);
					a.hidefocus = true ;
					a.innerHTML = "<img src=\""+obj.img + "\"/>" ;
					li.appendChild(a);
					o.thumbs.push(li); 
					oFragmeng.appendChild(li);       	 	           	 	   
					addListener( a , 'click' , function (event, dom) {     		   	  	
							var oHash = t.parseObj(dom.href);			            		
							if (oHash.p) {
								event.preventDefault ? event.preventDefault() : (event.returnValue = false);
								t.showPhoto(oHash.p).changeHash('p=' + oHash.p);
								
							}
						});  					 
				} 
			o.thumb.appendChild(oFragmeng);   	
		 })(); 
		t.showPhoto(oHash.p);
		//load sta
		ifeng.Gallery.prototype.loadSta();

        addListener(document, 'keydown', function (ev, dom) {
            if (!rfocusable.test((ev.target || ev.srcElement || document).nodeName)) {
                switch (ev.keyCode) {
                    case 37:
                        var href = o.photoPrev.getAttribute('href'),
						oHash = t.parseObj(href);

                        if (oHash.p) {
                            t.showPhoto(oHash.p).changeHash('p=' + oHash.p);	
                        } else {
                            window.location.href = href;
                        }
                        break;
                    case 39:
                        var href = o.photoNext.getAttribute('href'),
						oHash = t.parseObj(href);

                        if (oHash.p) {
                            t.showPhoto(oHash.p).changeHash('p=' + oHash.p);
                        } else {
                            window.location.href = href;
                        }
                        break;
                }
            }
        });


        
        /** start for full mode---begin**/     
        t.pageSize =(t.size % 12) == 0 ? Math.floor( t.size / 12) :  Math.floor( t.size / 12)+1; //大图有多少页，进行初始化
		t.currentPageIndex =0 ;
		t.interval = 15;
		t.ms = 15;
        
	  	for(var j=0 ; j  < t.pageSize ; j++ ){
	  	   		var  ul  = document.createElement("ul");
	  	   	  	for (var kk = j*12 ; kk < (j+1)*12 && kk < t.size ;kk++){
	  	   	  		 
	  	   	  		var photo =t.photoInfo[kk],  li = document.createElement("li"), i =document.createElement("i"),a =document.createElement("a"),img =document.createElement("img");
	  	   	  			 img.src =photo.listimg;
	  	   	  			 a.href="#p="+(kk+1);
	  	   	  			 a.target="";
			   			 addListener(a,"click", t.changeListMode.bind(t,kk));
			   			 a.appendChild(img);
			   			 li.appendChild(i)
			   			 li.appendChild(a);
			   			 ul.appendChild(li);
	  	   	  	} 
	  	   	  	o.imageListView.appendChild(ul);
	  	  }		
	  	if(t.pageSize==1){	 
			o.moreLeft.style.display = "none";
			o.moreRight.style.display = "none";
	  	}
	  		 
		for(var i = 0  ; i < t.pageSize ; i++ ){
			var a  = document.createElement('a');
				a . id = o.btnPage.id + "_" + i;
				a .innerHTML = "&nbsp;";
				i==0  && (a .className = o.activeThumbCls );
				o . btnPage.appendChild(a);
			    addListener(a , 'click', function(e,val){			    		 
			    	 	 var id  = val . id.replace(o.btnPage.id +"_","") ;		    	 	 
			    	 	 if(t.currentPageIndex != id){
			    	 	 	 val.className = o.activeThumbCls ;
			    	 	 	$(o.btnPage.id +"_"+t.currentPageIndex).className ="";			    	 	 	
			    	 	 	  t.currentPageIndex=parseInt(id);
							  t._timer = setInterval(t.listAnimate.bind(t),t.interval);
			    	 	 }		    	 	 			    	 	 
			    	})				
		}	
		addListener(o.moreLeft,"click",function(e){
			if(t.currentPageIndex >0 ){
				t.currentPageIndex = parseInt(t.currentPageIndex) -1;
				t._timer = setInterval(t.listAnimate.bind(t),t.interval);
				t.setActivePage();
			}
		})  
		addListener(o.moreRight,"click",function(e){
			if(t .currentPageIndex <= t .pageSize -2 ){     
				t.currentPageIndex = parseInt(t.currentPageIndex) +1;
				t._timer = setInterval(t.listAnimate.bind(t),t.interval);
				t.setActivePage();
			}
		})          
        addListener(o .showallPic,"click",t.changeListMode.bind(t))
        /** start for full mode---end**/  
        
    };

    ifeng.Gallery.prototype = {
	//加载图片页统计脚本
	loadSta : function() {
	    var head = document.getElementsByTagName('head');
	    var staScript = document.createElement('script');
	    var staUrl = "http://sta.ifeng.com/stadig/sta_collection_nopack.js";	
	    staScript.setAttribute('src', staUrl);
	    staScript.setAttribute('type', 'text/javascript');
	    head[0].appendChild(staScript);
	},
        showPhoto: function (id) {
            var t = this,
			index = isNaN(id) ? 1 : (parseInt(id ) < 1 ? 1 : (parseInt(id )> t.size? t.size : parseInt(id )) ),			
			info = t.photoInfo[index-1],
			turn = t.turn(index);			
			if(t.o.moretab.style.display == "block") {
				t.o.moretab.style.display = "none";
				t.o.picDiv.style.display = "block";
			}
            
            if (info.timg != t.o.photo.src || index ==1) {

                t.o.photoIndex.innerHTML = index  ;
                t.o.photoView.style.height = info.picheight +"px";	
				t.o.photoPrevLoading.width = info.picwidth  ;
                t.o.photoPrevLoading.height =info.picheight  ;
				t.o.photoPrevLoading.src = info.timg ? info.timg : info.img;
				$('photoimg').innerHTML= "<img src='"+info.timg+"' id='photo' style='filter:alpha(opacity=100);'/>";
                t.o.photoDesc.innerHTML = (info.morelink=='')? info.desc : info.desc + "<a href="+info.morelink+" target='_blank'>[详细]</a>";
                t.o.photoPrev.href = turn.prev;
                t.o.photoNext.href = turn.next;
                t.bar.onStart = function () {
                    var cur = O.getElementsByClassName(t.o.thumb, t.o.activeThumbCls),o= t.o;
                    (cur && O.removeClass(cur[0],  o.activeThumbCls));
                    O.addClass( o.thumbs[index-1],  o.activeThumbCls); 
                    if(index==1){
                    	o.scrlPrev_b.className="no";
                    	o.photoPrev.title = "上一图集";
                    }else if(t.size==index ){
                    	o.scrlNext_b.className="no";
                    	o.photoNext.title = "下一图集";
                    }else{
                    	o.scrlPrev_b.className="";
                    	o.scrlNext_b.className="";
                    	o.photoPrev.title = "上一张，支持 '← '翻页";
                    	o.photoNext.title = "下一张，支持 '→ '翻页";
                    }
                    if(t.size<=5){
                    	o.scrlPrev_b.className="no";
                    	o.scrlNext_b.className="no";
                    	o.scrlPrev_b.style.cursor="default";
                    	o.scrlNext_b.style.cursor="default";
                    	o.bar.className="drag_no";
                    }
                };
            t.bar.scrollTo(info.pos); 
            t.o.btnOrig && (t.o.btnOrig.href = info.timg);
            }
            return t;
        },

        resize: function ($img, size) {
            $img.removeAttribute('width');
            $img.removeAttribute('height');
            size = size || {};

            var rw = size.width ? $img.width / size.width : 0,
			rh = size.height ? $img.height / size.height : 0;

            if (rw > 1 || rh > 1) {
                rw > rh ? $img.width = size.width : $img.height = size.height;
            }
        },

        parseObj: function (hash) {
            var rhash = /[#&]([^&=]+)=([^&=]+)/ig,
			a = rhash.exec(hash),
			o = {};

            while (a) {
                o[a[1]] = a[2];
                a = rhash.exec(hash);
            }

            return o;
        },

        changeHash: function (hash) {
            window.location.hash = hash;
	    //load sta
	    if(staSign == true){
		    ifeng.Gallery.prototype.loadSta();
	    }
	    staSign = true;
            return this;
        },

        stats: function () {
            'function' === typeof vjEventTrack && vjEventTrack();
            'function' === typeof neteaseTracker && neteaseTracker();
        },
        
        setActivePage:function (){
        	var that = this , o= that.o, list = o.btnPage.getElementsByTagName("a"),index = that.currentPageIndex;
        	for(var i =0  ; i < list.length ; i++ ){
        		var ele = list[i];
        		if(ele.id  == o.btnPage.id +"_" + index ){
        			 ele.className = this.o.activeThumbCls;
        		}else{
        			 ele.className ="";
        		}
        	}      	
        } ,
		listAnimate:function(){		 
			 var  that=this, _style = that.o.imageListView.style, from = parseInt(_style.left), to = (that.currentPageIndex )*(-900);
			 if(from < to ){
					if(from + that.ms < to){
						_style.left = (from + that.ms) +"px";
						}else{
						_style.left = to + "px"; 
						clearInterval(that._timer);
					}
			 }else{
					if(from - that.ms >  to){
						_style.left = (from - that.ms) +"px";
						}else{
						_style.left = to + "px"; 
						clearInterval(that._timer);
					}
			 }
		},
		changeListMode:function(){
			var that = this, o = that.o, picDiv = o.picDiv,imageListView= o.imageListView,moretab= o.moretab,picList_b = o.picList_b,
			thumb=o.thumb,list_li=imageListView.getElementsByTagName("li"), thumb_li= thumb.getElementsByTagName("li"),
			showallPic= o.showallPic,btnOrig= o.btnOrig,
			e = arguments[arguments.length-2] || e || window.event;
			e &&(e.preventDefault ? e.preventDefault() : (e.returnValue = false));
			if(moretab.style.display == "none") {
				showallPic.className="return";
				showallPic.title = "返回幻灯模式";
				btnOrig.style.display="none";
				moretab.style.display="block";
				picDiv.style.display ="none";
				picList_b.style.display = "none";
				var allIndex  = 0;
				 
				for(var i=0; i < thumb_li.length ;i++){
						if(thumb_li[i].className == o.activeThumbCls){
							allIndex=i;
							 list_li[i].className = o.activeThumbCls;
						}else{
							list_li[i].className ="";
						}					
					}
				that.currentPageIndex =Math.floor( allIndex / 12) ; 
				imageListView.style.left =  that.currentPageIndex*(-900) +"px";
				that.setActivePage();
				
			}else{
				showallPic.className="ckap";
				showallPic.title="查看全部图片";
				btnOrig.style.display="block";
				moretab.style.display="none";
				picDiv.style.display ="block";
				picList_b.style.display = "block";
				var index = arguments[0]; 
				if(index != undefined  && typeof index =='number'){
			             var li = o.thumbs[index],dom = li.getElementsByTagName('a')[0],oHash = that.parseObj(dom.href),p = that.photoInfo[parseInt(index-1)];
		                     if (oHash.p) {
		                        that.showPhoto(oHash.p).changeHash('p=' + oHash.p);
		                     }
		                     that.bar.scrollTo(p.pos);			
				}
			}  
		}
    }
 
    var scrollMode = {
        forward: function (lpf) {
            var t = this, pos = t._bPos - lpf;
            pos = (pos > 0 ? pos : 0);
            t._setPos(pos);
            (pos == 0 && t.stop());
        },
        backward: function (lpf) {
            var t = this, pos = t._bPos + lpf;
            pos = (pos < t._bRange ? pos : t._bRange);
            t._setPos(pos);
            (pos == t._bRange && t.stop());
        }
    };

    ifeng.Scroll = function (body, axis, handle) {
        if (!arguments.length) {
            return;
        }

        var t = this;
        t.constructor = arguments.callee;

        t._axis = axis == 'y' ? 'y' : 'x';
        t._fix = t._axis == 'x' ? {
            pos: 'left',
            offsetSize: 'offsetWidth',
            pageAxis: 'pageX',
            offsetPos: 'offsetLeft',
            scrollPos: 'scrollLeft'
        } : {
            pos: 'top',
            offsetSize: 'offsetHeight',
            pageAxis: 'pageY',
            offsetPos: 'offsetTop',
            scrollPos: 'scrollTop'
        };

        t.fps = 13;
        t.lpf = 10;
        t.speed = 40;

        t._body = body;
        t._bCnt = body.parentNode;
        t._bPos = 0;
        t._bRange = Math.max(0, t._body[t._fix.offsetSize] - t._bCnt[t._fix.offsetSize]);

        if (handle !== undefined) {
            t._handle = handle;
            t._hCnt = handle.parentNode;
            t._hPos = 0;
            t._hRange = Math.max(0, t._hCnt[t._fix.offsetSize] - t._handle[t._fix.offsetSize]);

            t.bhRate = t._hRange ? t._bRange / t._hRange : 0;

            var mouse = new ifeng.Mouse(t._handle);
            mouse.mouseStart = t._mouseStart.bind(t);
            mouse.mouseDrag = t._mouseDrag.bind(t);
            mouse.mouseStop = t._mouseStop.bind(t);
            addListener(t._hCnt, 'click', t._mouseClick.bind(t));
        }
    };
       var fixEvent = function(event){
        	
           var  eObject ={};
           var doc = document.documentElement, body = document.body;
           if(event.pageX){
           		eObject['pageX']   =  event.pageX;
           		eObject['pageY']   =  event.pageY;
           }else{
				eObject['pageX'] = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft  || body && body.clientLeft || 0);
				eObject['pageY'] = event.clientY + (doc && doc.scrollTop  ||  body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);

           }  
           return eObject;                  
        }

    ifeng.Scroll.prototype = {
        start: function (toward, length) {
            var t = this;
            if (t._timer == undefined) {
                toward = toward == 'forward' ? 'forward' : 'backward';
                t._move = scrollMode[toward];
                var params = {
                    length: isNaN(length) ? -1 : parseInt(length)
                };
                t._timer = setInterval(t._scroll.bind(t, params), t.fps);
                t.onStart && t.onStart();
            }
        },
        stop: function () {
            var t = this;
            if (t._timer !== undefined) {
                clearTimeout(t._timer);
                t._timer = undefined;
                t.onStop && t.onStop();
            }
            return this;
        },
        scrollTo: function (length) {
            var t = this, distance = length - t._bPos;
            distance < 0 ? t.stop().start('forward', -1 * distance) : t.stop().start('backward', distance);
        },
        _scroll: function (params) {
            var t = this, lpf = t.lpf;
            if (params.length !== 0) {
                if (params.length > 0) {
                    lpf = Math.min(t.lpf * Math.ceil(params.length / t.speed), params.length);
                    params.length -= lpf;
                }
                t._move(lpf);
            } else {
                t.stop();
            }
        },
        _setPos: function (pos) {
            var t = this;
            t._bPos = pos;
            t._bCnt[t._fix.scrollPos] = t._bPos;
            if (t._handle) {
                t._hPos = t.bhRate ? pos / t.bhRate : 0;
                if(t._hPos == 0){
                	$("scrlPrev_b").className = "no";
                }else{
                	$("scrlPrev_b").className = "";
                }
                $("scrlNext_b").className = "";
                if(t._hPos >=t._hRange){
            		$("scrlNext_b").className = "no";
            		$("scrlPrev_b").className = "";
                }
                if(t._hRange==0){
                    $("scrlNext_b").className = "no";
            		$("scrlPrev_b").className = "no";
            		$("scrlPrev_b").style.cursor="default";
                    $("scrlNext_b").style.cursor="default";
                }
                O.setStyle(t._handle, t._fix.pos, t._hPos + 'px');
            }
        },
        _mouseStart: function (event) {
            var t = this;
            t._diffPos = fixEvent(event)[t._fix.pageAxis] - t._handle[t._fix.offsetPos];
            return true;
        },
        _mouseDrag: function (event) {
            var t = this, pos = Math.max(0, Math.min(event['clientX'] - t._diffPos, t._hRange));
			 
            t._setPos(pos * t.bhRate);
            return false;
        },
        _mouseStop: function (event) {
            return false;
        },
        _mouseClick: function (event) {
            var t = this, cnt = t._hCnt, cPos = cnt[t._fix.offsetPos];
            while (cnt.offsetParent) {
                cnt = cnt.offsetParent;
                cPos += cnt[t._fix.offsetPos];
            }
            t.scrollTo((fixEvent(event)[t._fix.pageAxis] - t._handle[t._fix.offsetSize] / 2 - cPos) * t.bhRate);
        }
    };

    ifeng.Mouse = function (element) {
        var t = this;
        element = $(element);
        addListener(element, 'mousedown', t._mouseDown.bind(t));
        addListener(element, 'click', function (event) {
            if (t._preventClickEvent) {
                t._preventClickEvent = false;
                event.cancelBubble = true;
                return false;
            }
        });

        if (navigator.userAgent.indexOf("MSIE") > -1) {
            this._mouseUnselectable = element.getAttribute('unselectable');
            element.setAttribute('unselectable', 'on');
        }
        this.started = false;
    };
    ifeng.Mouse.prototype = {
        _mouseDown: function (event) {
            var t = this;
			
            t._mouseStarted && t._mouseUp(event);
            t._mouseDownEvent = event;
			
            var btnIsLeft = event.which ? (event.which  == 1):(event.keyCode==0);
			 
            if (!btnIsLeft || !this.mouseCapture(event)) {
                return true;
            }

            if (t._mouseDistanceMet(event)) {
                t._mouseStarted = (t.mouseStart(event) !== false);
                if (!t._mouseStarted) {
                    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                    return true;
                }
            }
            t._mouseMoveDelegate = t._mouseMove.bind(t);
            t._mouseUpDelegate = t._mouseUp.bind(t);
			 
            addListener(document, 'mousemove', t._mouseMoveDelegate)
            addListener(document, 'mouseup', t._mouseUpDelegate);
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            return true;
        },
        _mouseMove: function (event) {
            var t = this;
			
            if (navigator.userAgent.indexOf("MSIE") > -1 && !event.button) {
                return t._mouseUp(event);
            }
			
            if (t._mouseStarted) {
			
                t.mouseDrag(event);
                return event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            }
			 
            t._mouseStarted = t.mouseStart(t._mouseDownEvent, event) !== false;
            t._mouseStarted ? t.mouseDrag(event) : t._mouseUp(event);
            return !t._mouseStarted;
        },
        _mouseUp: function (event) {
            var t = this;
            removeListener(document, 'mousemove', t._mouseMoveDelegate)
            removeListener(document, 'mouseup', t._mouseUpDelegate);
            if (t._mouseStarted) {
                t._mouseStarted = false;
                t._preventClickEvent = (event.target == t._mouseDownEvent.target);
                t.mouseStop(event);
            }
            return false;
        },
        _mouseDistanceMet: function (event) {
            var t = this;
            return Math.max(Math.abs(t._mouseDownEvent.clientX - fixEvent(event)['pageX']), Math.abs(t._mouseDownEvent.clienY - fixEvent(event)['pageY'])) >= 0;
        },
        mouseStart: function (event) { },
        mouseDrag: function (event) { },
        mouseStop: function (event) {},
        mouseCapture: function (event) { return true; }
    };



    window["ifeng"] = ifeng;

})(window);