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
		var ptMin = (myPlayedTime.getMinutes() < 10) ? "0" + myPlayedTime.getMinutes() : myPlayedTime.getMinutes();
		var ptSec = (myPlayedTime.getSeconds() < 10) ? "0" + myPlayedTime.getSeconds() : myPlayedTime.getSeconds();
		$("#play_time").text(ptMin+":"+ptSec);
 
		var myTotalTime = new Date(totalTime);
		var ttMin = (myTotalTime.getMinutes() < 10) ? "0" + myTotalTime.getMinutes() : myTotalTime.getMinutes();
		var ttSec = (myTotalTime.getSeconds() < 10) ? "0" + myTotalTime.getSeconds() : myTotalTime.getSeconds();
		$("#total_time").text(ttMin+":"+ttSec);
	});
 
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
 
	function playListChange( src ) {
		$("#jquery_jplayer").changeAndPlay(src);
	}
	
	var playItem = 0;
	var myPlayListLength = $(".playlist_content li").length;
	function playListNext() {
		var index = (playItem+1 < myPlayListLength) ? playItem+1 : 0;
		var playListSrc= $(".playlist_content li:eq("+index+")").attr("src");
		playListChange( playListSrc );
	}
 
	function playListPrev() {
		var index = (playItem-1 >= 0) ? playItem-1 :myPlayListLength-1;
		var playListSrc= $(".playlist_content li:eq("+index+")").attr("src");
		playListChange( playListSrc );
	}

	/*音乐列表*/
	$("#playlist_list ul.playlist_content li").click(function(){
		var src = $(this).attr("jplayer");
		var songer =  $(this).attr("songer");
		var ablum = $(this).attr("ablum");
		var songname =  $(this).text();
		var songimg =  $(this).attr("songimg");
		$(".songName").text(songer);
		$(".songAblum").text(ablum);
		$(".playlist_content_songer_txt").text("正在播放:"+songname);
		$(".imgDiv img").attr('src',songimg);
		if(!$(this).hasClass("playlist_current")) {
			$('#jquery_jplayer').pause(); 
			$(".playlist_wrap").animate({left:"-298px"},500,function(){
				//播放mp3
				$("#jquery_jplayer").changeAndPlay(src);
				//触发歌曲名滚屏
				$(".playlist_content_songer_txt").parent().trigger("mouseleave");
			});
			$(".playlist_footer li").fadeOut(400,function(){
				$(".playlist_footer li.list_power").fadeIn()
			});
		}else{
			$(".playlist_wrap").animate({left:"-298px"},500,function(){
				//触发歌曲名滚屏
				$(".playlist_content_songer_txt").parent().trigger("mouseleave");
			});
			$(".playlist_footer li").fadeOut(400,function(){
				$(".playlist_footer li.list_power").fadeIn()
			});
		}
		$(this).addClass("playlist_current").siblings().removeClass("playlist_current").children(".player_tip").remove();
	}).hover(function() {
		if (!$(this).hasClass("playlist_hover")) {
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
	$(".playlist_content").mousewheel(function(objEvent, intDelta){
		if (intDelta > 0){
		   $(".list_up a").trigger("click");
		}
		else if (intDelta < 0){
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

});