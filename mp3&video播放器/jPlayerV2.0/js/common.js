$(function(){
	$("#jquery_jplayer").jPlayer({
		swfPath:"js"
	});
 
	$("#jquery_jplayer").jPlayerId("play", "player_play");
	$("#jquery_jplayer").jPlayerId("pause", "player_pause");
	$("#jquery_jplayer").jPlayerId("stop", "player_stop");
	$("#jquery_jplayer").jPlayerId("loadBar", "player_progress_load_bar");
	$("#jquery_jplayer").jPlayerId("playBar", "player_progress_play_bar");
	$("#jquery_jplayer").jPlayerId("volumeMin", "player_volume_min");
	$("#jquery_jplayer").jPlayerId("volumeMax", "player_volume_max");
	$("#jquery_jplayer").jPlayerId("volumeBar", "player_volume_bar");
	$("#jquery_jplayer").jPlayerId("volumeBarValue", "player_volume_bar_value");
	 
	$("#jquery_jplayer").onProgressChange( function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
		var myPlayedTime = new Date(playedTime);
		//var ptMin = (myPlayedTime.getMinutes() < 10) ? "0" + myPlayedTime.getMinutes() : myPlayedTime.getMinutes();
		//var ptSec = (myPlayedTime.getSeconds() < 10) ? "0" + myPlayedTime.getSeconds() : myPlayedTime.getSeconds();
		var myTotalTime = new Date(totalTime);
		//var ttMin = (myTotalTime.getMinutes() < 10) ? "0" + myTotalTime.getMinutes() : myTotalTime.getMinutes();
		//var ttSec = (myTotalTime.getSeconds() < 10) ? "0" + myTotalTime.getSeconds() : myTotalTime.getSeconds();
		var secAll = dateDiff("S",myPlayedTime,myTotalTime);
		var sec = "00";
		var min = "00";
		//console.log( parseInt(secAll%60)<10  );
		if( parseInt(secAll%60)<10 ){
			sec = "0"+  parseInt(secAll%60);
		}else{
            sec = parseInt(secAll%60)
		}
		if((Math.floor(secAll/60)) <10 ){
			min = "0"+  (Math.floor(secAll/60));
		}else{
			min = (Math.floor(secAll/60));
		}
		$("#play_time").text(min+":"+sec);
	});
	/*
	使用方法: alert(dateDiff('h','2007-4-14','2007-4-19'));
	H 表示 hour , D 表示 day , M 表示minute , S 表示 second
	支持 豪秒，秒，分，时，天
	*/
	function dateDiff(interval, date1, date2){
			 var objInterval = {'D' : 1000*60*60*24,'H' : 1000*60*60,'M' : 1000*60,'S' : 1000};
			 interval = interval.toUpperCase();
			// var dt1 = Date.parse(date1.replace(/-/g,'/'));
			// var dt2 = Date.parse(date2.replace(/-/g,'/'));
			 var dt1 = date1;
			 var dt2 = date2;
			 try
			 {
				   return Math.round((dt2 - dt1) / eval('(objInterval.' + interval + ')'));
			 }catch(e)
			 {
				   return e.message;
			 }
	}
	$("#jquery_jplayer").onSoundComplete(endOfSong);
	function endOfSong() {
		playListNext();
	}

	$("#ctrl_prev").click( function() {
		playListPrev();
		return false;
	});
 
	$("#ctrl_next").click( function() {
		playListNext();
		return false;
	});
 
	function playListChange( src ,obj) {
		$("#player_progress,#play_time").remove();
		$('<div id="play_time"></div><div id="player_progress"><div id="player_progress_load_bar" class="jqjp_buffer"><div id="player_progress_play_bar"></div></div></div>').prependTo(obj);
		$(".playlist_content li a").removeClass("controllinkpause").addClass("controllink");
		$("a.controllink",obj).addClass("controllinkpause");
		$("#jquery_jplayer").changeAndPlay(src);
	}
	
	var playItem = 0;
	var myPlayListLength = $(".playlist_content li").length;
	function playListNext() {
		var currentIndex = $(".playlist_content li").index($(".playlist_current"));
		playItem = currentIndex;
		var index = (playItem+1 < myPlayListLength) ? playItem+1 : 0;
		var $liindex = $(".playlist_content li:eq("+index+")") ;
		var playListSrc= $liindex.attr("jplayer");
		playListChange(playListSrc , $liindex );//播放mp3
		$liindex.addClass("playlist_current").siblings().removeClass("playlist_current");
	}
 
	function playListPrev() {
		var currentIndex = $(".playlist_content li").index($(".playlist_current"));
		playItem = currentIndex;	
		var index = (playItem-1 >= 0) ? playItem-1 :myPlayListLength-1;
		var $liindex = $(".playlist_content li:eq("+index+")") ;
		var playListSrc= $liindex.attr("jplayer");
		playListChange(playListSrc , $liindex );//播放mp3
		$liindex.addClass("playlist_current").siblings().removeClass("playlist_current");
	}
	function play_zhijie() {
		var $liindex = $(".playlist_content li:eq(0)");
		var playListSrc= $liindex.attr("jplayer");
		playListChange(playListSrc , $liindex );//播放mp3
		$liindex.addClass("playlist_current").siblings().removeClass("playlist_current");
	}

	/*音乐列表*/
	$("#playlist_list ul.playlist_content li").click(function(){
		var src = $(this).attr("jplayer");
		if(!$(this).hasClass("playlist_current")) {
			$('#jquery_jplayer').pause(); 
			playListChange(src , $(this));//播放mp3
		}else{
			if(	$('#jquery_jplayer').data("flag") ){
				$("a",$(this)).removeClass("controllink controllinkpause").addClass("controllinkpause");
				$('#jquery_jplayer').play(); 
				$('#jquery_jplayer').data("flag",false);
			}else{
				$("a",$(this)).removeClass("controllink controllinkpause").addClass("controllink");
				$('#jquery_jplayer').pause(); 
				$('#jquery_jplayer').data("flag",true);
			}
		}
		$(this).addClass("playlist_current").siblings().removeClass("playlist_current");
	}).hover(function() {
		if (!$(this).hasClass("playlist_current")) {
			$(this).addClass("playlist_hover");
		}
	},function(){
		$(this).removeClass("playlist_hover");
	});

	/*歌曲名 自动滚屏*/
	var songerTime = "";
	var marginLeftWidth = $(".playlist_content_songer_txt").parent().width();
	function setTime() {
		$(".playlist_content_songer_txt").animate({marginLeft:"-=1px"},0,function(){
			if(Math.abs(parseInt($(this).css("marginLeft"))) >= marginLeftWidth){
				$(this).css("marginLeft",marginLeftWidth+"px");
			}
		});
	}
	$(".playlist_content_songer_txt").parent().hover(function(){
		if(songerTime){ clearInterval(songerTime);}
	},function(){
		songerTime = setInterval(function(){
			setTime();
		},30);
	});
	
	$(".list_reuturn a").click(function(){
		//停止歌曲名自动滚屏
		$(".playlist_content_songer_txt").parent().trigger("mouseenter");
		//切换到歌曲列表
		$(".playlist_wrap").animate({left:"20px"},500,function(){
			$(".playlist_footer li.list_power").fadeOut(200,function(){
				$(".playlist_footer li:not(.list_power)").fadeIn(200);
			});
		});
		return false;
	});

	//暂停后 播放音乐
	$("#player_play a").click(function(){
		$('#jquery_jplayer').play(); 
		return false;
	});
	//暂停音乐
	$("#player_pause a").click(function(){
		$('#jquery_jplayer').pause(); 
		return false;
	});

	/*上下翻*/
	var len = $(".playlist_content li").length;
	var per = 10;
	var num = Math.ceil(len/10);
	var i = 1;
	var height_top = $(".playlist_cc").outerHeight(true);
	//下翻
	$(".list_down a").click(function(){
		if(!$('.playlist_content').is(":animated")){
			if(i>=num){
				return false;
			}else{ 
				$('.playlist_content').animate({top:"-="+height_top+"px"},600);
			}
			i++;
		}
		return false;
	});
	//上翻
	$(".list_up a").click(function(){
		if(!$('.playlist_content').is(":animated")){
			if(i<=1){
				return false;
			}else{
				$('.playlist_content').animate({top:"+="+height_top+"px"},600);
			}
			i--;
		}
		return false;
	});
	/*鼠标滚轮事件*/
	$(".playlist_cc").mousewheel(function(objEvent, intDelta){
		if (intDelta > 0){
		   $(".list_up a").trigger("click");
		}else if (intDelta < 0){
		   $(".list_down a").trigger("click");
		}
	});
	//随便听听
	$(".list_ramdom a").click(function(){
		var index = Math.round(Math.random()*len);
		if(index<=len){
			$("#playlist_list ul.playlist_content li:eq("+index+")").trigger("click");
		}else{
			alert("暂时不支持随机播放!请稍后再试!");
		}
		return false;
	});
	/*上一首*/
	$(".list_up_one").click(function(){
		playListPrev();
		return false;
	});
	
	/*下一首*/
	$(".list_down_one").click(function(){
		playListNext();
		return false;
	});
	/*直接播放*/
	$(".list_play_zhi").click(function(){
		play_zhijie();
		return false;
	});
});