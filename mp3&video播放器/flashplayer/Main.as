package {
	import flash.display.MovieClip;
	import flash.media.SoundChannel;
	import flash.net.URLRequest;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundLoaderContext;
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.text.TextField;
	import flash.media.SoundTransform;
	import flash.system.Security;


	public class Main extends MovieClip {
		private var sound:Sound;
		private var channel:SoundChannel;
		private var pausePosition = 0;
		private var buffer:SoundLoaderContext = new SoundLoaderContext(3000);
		private var firstTime:Boolean = true;
		private var loadedBytes:int;
		private var totalBytes:int;
		private var volumeTransform:SoundTransform;
		private var valumeValue:Number = 0.5;
		public function Main() {
			volumeTransform = new SoundTransform();
			ExternalInterface.addCallback("jsPlay",Play);
			ExternalInterface.addCallback('jsRePlay',RePlay);
			ExternalInterface.addCallback("jsStop",Stop);
			ExternalInterface.addCallback("jsPause",Pause);
			ExternalInterface.addCallback("jsJumpPlay",JumpPlay);
			ExternalInterface.addCallback("jsSetVolume",SetVolume);
			Security.allowDomain("*");
		}
		public function Play(url:String) {
			//判断是否是第一次播放
			if (firstTime) {
				firstTime = false;
			} else {
				Stop();
			}
			//播放过程中执行的逻辑
			addEventListener(Event.ENTER_FRAME,OnEnterFrame);
			sound = new Sound();
			sound.load(new URLRequest(url),buffer);
			//加载过程中执行的逻辑

			sound.addEventListener(ProgressEvent.PROGRESS,Progress);
			channel = sound.play(pausePosition);
			//播放完毕中执行的逻辑
			channel.addEventListener(Event.SOUND_COMPLETE,Complete);
			SetVolume(valumeValue);

		}
		//停止回到开头
		public function Stop() {
			if (! firstTime) {//防止切换的时候，重复调用过程
				removeEventListener(Event.ENTER_FRAME,OnEnterFrame);
				sound.removeEventListener(ProgressEvent.PROGRESS,Progress);
				channel.removeEventListener(Event.SOUND_COMPLETE,Complete);
				pausePosition = 0;
				channel.stop();
			}
		}
		//暂停播放
		public function Pause() {
			pausePosition = channel.position;
			channel.stop();
		}
		public function RePlay() {
			channel.stop();
			channel = sound.play(pausePosition);
			SetVolume(valumeValue);
		}
		//加载过程
		public function Progress(e:ProgressEvent) {
			loadedBytes = e.bytesLoaded;
			totalBytes = e.bytesTotal;
			ExternalInterface.call("MusicPlay.playerUI.uiProgress",{
			   loadedBytes : loadedBytes,
			   totalBytes : totalBytes
			   });
		}
		//跳跃播放
		public function JumpPlay(_position:int) {
			channel.stop();
			//从新设置channel，修正上一行channel指向的sound。;
			channel = sound.play(_position);
			SetVolume(valumeValue);
			channel.addEventListener(Event.SOUND_COMPLETE,Complete);
		}
		//播放过程
		public function OnEnterFrame(e:Event) {
			ExternalInterface.call("MusicPlay.playerUI.uiPlaying",{
			   curTime:channel.position,
			   timeLength:sound.length*totalBytes/loadedBytes
			   });
		}
		//完成后
		public function Complete(e:Event) {
			ExternalInterface.call("MusicPlay.playerUI.uiPlayEnd");
		}
		//控制声音;
		public function SetVolume(val:Number=0.5) {
			try {
				valumeValue = val;
				volumeTransform.volume = val;
				channel.soundTransform = volumeTransform;
			} catch (e) {
			}

		}
	}
}