/**
*	播放器接口集
*	by 何世孟
*	heshimeng1987@qq.com
**/
function _MusicPlay(){
	this.player = null;
};

_MusicPlay.prototype = {
	create: function(ID,swf){
		var html = '<object id="Player-'+ID+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="0" height="0">'+
				   '\n<param name="movie" value="'+swf+'" />'+
				   '\n<param name="quality" value="high" />'+
				   '\n<param name="allowScriptAccess" value="always" />'+
				   '\n<embed name="Player-'+ID+'" allowScriptAccess="always" src="'+swf+'" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="0" height="0"></embed>'+
				   '\n</object>',
			id = document.getElementById(ID);
		//id.style.display='none';
		id.style.width=0;
		id.style.height=0;
		id.style.overflow='hidden';
		id.innerHTML = html;
		this.player = window.document['Player-'+ID] || document.getElementById('Player-'+ID);
		
		this.playerUI.init();
	},
	play: function(url){
		this.player.jsPlay(url);
	},
	stop: function(){
		this.player.jsStop();
	},
	pause: function(){
		this.player.jsPause();
	},
	rePlay: function(){
		this.player.jsRePlay();
	},
	jumpPlay: function(pos){
		this.player.jsJumpPlay(pos);
	},
	setVolume: function(val){
		this.player.jsSetVolume(val);
	},
    each: function (obj, fn, args) {
            if (args) {
                if (obj.length == undefined) {
                    for (var i in obj)
                    fn.apply(obj, args);
                } else {
                    for (var i = 0, ol = obj.length; i < ol; i++) {
                        if (fn.apply(obj, args) === false) break;
                    }
                }
            } else {
                if (obj.length == undefined) {
                    for (var i in obj)
                    fn.call(obj, i, obj);
                } else {
                    for (var i = 0, ol = obj.length, val = obj[0]; i < ol && fn.call(val, i, val) !== false; val = obj[++i]) {}
                }
            }
            return obj;
    },
	//播放器UI,交互逻辑
	playerUI : {
	    init : function(){
			this.musicList = this.$('MusicList');
		    this.mp3List = this.musicList.getElementsByTagName('li');
			this.mp3 = this.musicList.getElementsByTagName('textarea');
			
			//加载进度条
			this.LoadProgressBar = this.$('LoadProgressBar');
			//播放进度条
			this.PlayProgressBar = this.$('PlayProgressBar');
			//当前播放进度按钮
			this.CurrentPlay = this.$('CurrentPlay');
			//歌曲播放当前时间
			this.CurTime = this.$('CurTime');
			//歌曲时间长度
			this.TotalTime = this.$('TotalTime');
			//当前声音大小按钮
			this.CurSound = this.$('CurSound');
			this.CurSoundBar = this.$('CurSoundBar');
			
			this.PrevBtn = this.$('PrevBtn');
			this.NextBtn = this.$('NextBtn');
			this.PlayBtn = this.$('PlayBtn');
			this.DownLoadBtn = this.$('DownLoadBtn');
			
			this.MusicListScroll = this.$('MusicList').getElementsByTagName('ul')[0];
			this.ListScrollBar = this.$('ListScrollBar');
			
			this.timeObj = null;
			
			//当前播放索引,开始-1，给判断是否是第一次播放。
			this.curIndex = -1;
			//歌曲总数
			this.total = this.mp3List.length;
			//播放列表点击播放
			
			this.dragStart = false;
			
			
			this.mp3ListEvent();
			this.dragPlayEvent();
			this.dragVolumeEvent();
			
			this.playBtnEvent();
			
			this.musicListScrollEvent();
		},
		$: function(id){
			return document.getElementById(id);
		},
		mp3ListEvent: function(){
			var that = MusicPlay , ui = this;
		    that.each(this.mp3List,function(i){
			     this.onclick = function(){
					ui.curIndex = i;
					//播放
					ui.uiPlayer();
				 }
			});
		},
		uiPlayer: function(){
			MusicPlay.each(this.mp3List,function(){
				this.className = '';
			});
			this.mp3List[this.curIndex].className='cur';
			MusicPlay.play(this.mp3[this.curIndex].value);
			this.DownLoadBtn.setAttribute('href',this.mp3[this.curIndex].value);
			this.PlayBtn.setAttribute('title','暂停');
			this.PlayBtn.className = 'play';
		},
		//加载过程,被as通讯的函数
		uiProgress: function(obj){
			this.LoadProgressBar.style.width = 200 * obj.loadedBytes/obj.totalBytes + 'px';
		},
		//播放过程，被as通讯的函数
		uiPlaying: function(obj){
			this.timeObj = obj;
			var value = Math.round(200 * obj.curTime/obj.timeLength);
			if(!this.dragStart){
				//设置播放进度条宽度
				this.PlayProgressBar.style.width = value + 'px';
				//设置播放进度按钮位置
				this.CurrentPlay.style.left = (value-10) + 'px';
			}	
			//设置时间
			this.CurTime.innerHTML = this.uiTimeFormat(obj.curTime);
			this.TotalTime.innerHTML = this.uiTimeFormat(obj.timeLength);
		},
		//当前歌曲播放完毕,被as通讯的函数
		uiPlayEnd: function(){
			this.uiNext();
		},
		//上一曲
		uiPrev: function(){
			this.curIndex = --this.curIndex < 0 ? this.total - 1 : this.curIndex;
			this.uiPlayer();
			this.PlayProgressBar.style.width = 0;
			this.CurrentPlay.style.left = '-10px';
		},
		//下一曲
		uiNext: function(){
			this.curIndex = ++this.curIndex >= this.total ? 0 : this.curIndex;
			this.uiPlayer();
			this.PlayProgressBar.style.width = 0;
			this.CurrentPlay.style.left = '-10px';			
		},
		dragPlayEvent: function(){
			Drag.init(this.CurrentPlay,null,-10,190,-5,-5);
			var that = this;
			this.CurrentPlay.onDragStart = function(){
				that.dragStart = true;
			}
			this.CurrentPlay.onDragEnd = function(x,y){
				var left = parseInt(x) + 10;
				MusicPlay.jumpPlay( that.timeObj.timeLength*left/200 );
				that.dragStart = false;
			}
			this.CurrentPlay.onDrag = function(x,y){
				var left = parseInt(x) + 10;
				that.PlayProgressBar.style.width = left + 'px';
			}
		},
		dragVolumeEvent: function(){
			Drag.init(this.CurSound,null,-10,40,-7,-7);
			var that = this;
			this.CurSound.onDrag = function(x,y){
				var left = parseInt(x) + 10;
				that.CurSoundBar.style.width = left + 'px';
				//所在位置的比例值,最多50px
				left /= 50;
				//Math.round(left/0.1)*0.1 四舍五入,且得到0.0数据格式
				MusicPlay.setVolume(Math.round(left/0.1)*0.1);
			}
		},
		playBtnEvent: function(){
			var that = this;
			this.PrevBtn.onclick = function(){
				if(that.curIndex == -1)that.curIndex = 1;
				that.uiPrev();
			}
			this.NextBtn.onclick = function(){
				that.uiNext();
			}
			this.PlayBtn.onclick = function(){
				if(that.curIndex == -1){
					that.uiNext();
				}else if(this.getAttribute('title') == '暂停'){
					this.setAttribute('title','播放');
					this.className = 'pause';
					MusicPlay.pause();
				}else if(this.getAttribute('title') == '播放'){
					this.setAttribute('title','暂停');
					this.className = 'play';
					MusicPlay.rePlay();
				}
			}
		},
		musicListScrollEvent: function(){
			var that = this;
			Drag.init(this.ListScrollBar,null,479,479,0,200);
			this.ListScrollBar.onDrag = function(x,y){
				that.MusicListScroll.style.top = -1*y/200*(that.MusicListScroll.offsetHeight-300) + 'px';
			}
		},
		//格式化时间
		uiTimeFormat: function(time){
		    time /= 1000;
		    return (parseInt(time / 60) + ':' + parseInt(time % 60)).replace(/\b(\w)\b/g, '0$1');		
		}
	}
};

window.MusicPlay = new _MusicPlay();

/**************************************************
 * dom-drag.js
 * 09.25.2001
 * www.youngpup.net
 **************************************************
 * 10.28.2001 - fixed minor bug where events
 * sometimes fired off the handle, not the root.
 **************************************************/

var Drag = {

	obj : null,

	init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
	{
		o.onmousedown	= Drag.start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;

		o.root = oRoot && oRoot != null ? oRoot : o ;

		if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
		if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;

		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	},

	start : function(e)
	{
		var o = Drag.obj = this;
		e = Drag.fixE(e);
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		o.root.onDragStart(x, y);

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		document.onmousemove	= Drag.drag;
		document.onmouseup		= Drag.end;

		return false;
	},

	drag : function(e)
	{
		e = Drag.fixE(e);
		var o = Drag.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if (o.xMapper)		nx = o.xMapper(y)
		else if (o.yMapper)	ny = o.yMapper(x)

		Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
		Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Drag.obj.lastMouseX	= ex;
		Drag.obj.lastMouseY	= ey;

		Drag.obj.root.onDrag(nx, ny);
		return false;
	},

	end : function()
	{
		document.onmousemove = null;
		document.onmouseup   = null;
		Drag.obj.root.onDragEnd(	parseInt(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"]), 
									parseInt(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"]));
		Drag.obj = null;
	},

	fixE : function(e)
	{
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};