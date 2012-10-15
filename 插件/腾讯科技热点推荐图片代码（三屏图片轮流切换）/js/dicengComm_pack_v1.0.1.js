var TencntART=new Object();
TencntART.Browser=
{
	ie:/msie/.test(window.navigator.userAgent.toLowerCase()),
	moz:/gecko/.test(window.navigator.userAgent.toLowerCase()),
	opera:/opera/.test(window.navigator.userAgent.toLowerCase()),
	safari:/safari/.test(window.navigator.userAgent.toLowerCase())
};
TencntART.JsLoader=
{
	load:function(sUrl,fCallback)
	{
		var _script=document.createElement('script');
		_script.setAttribute('charset','gb2312');
		_script.setAttribute('type','text/javascript');
		_script.setAttribute('src',sUrl);
		document.getElementsByTagName('head')[0].appendChild(_script);
		if(TencntART.Browser.ie)
		{
			_script.onreadystatechange=function()
			{
				if(this.readyState=='loaded'||this.readyStaate=='complete')
				{
					fCallback();
				}
			};
		}else if(TencntART.Browser.moz)
		{
			_script.onload=function()
			{
				fCallback();
			};
		}else
		{
			fCallback();
		}
	}
};
var TencentArticl=new Object();
TencentArticl=
{
	$:function(v){return document.getElementById(v)},
	getEles:function(id,ele)
	{	
		
		 return this.$(id).getElementsByTagName(ele);
		// return document.getElementById(id).getElementsByTagName(ele);
	},
	tabId:"sildPicBar",
	tabDot:"dot",
	tabBox:"cnt-wrap",
	tabSilder:"cnt",
	tabSilderSon:"li",
	comtList:"ComList",
	rightBorder:"silidBarBorder",
	Count:function()
	{
		return this.getEles(this.tabSilder,this.tabSilderSon).length
	 },
	 Now:0,
	 pagenum:12,
	 isCmt:true,
	 isSild:true,
	 timer:null,
	 site:'news',
	 cmtId:'21572303',
	 cmtBase:'comment5',
	 sideTab:
	 {
		 heads:'tabTit',heads_ele:'span',bodys:'tabBody',bodys_ele:'ol'
	 },
	 SildTab:function(now)
	 {
		 this.Now=Number(now);
		 if(this.Now>Math.ceil(this.Count()/this.pagenum)-1)
		 {
			 this.Now=0;
		 }else if(this.Now<0)
		 {
			 this.Now=Math.ceil(this.Count()/this.pagenum)-1;
		 }
		 
		if(parseInt(this.$(this.tabSilder).style.left)>-156*parseInt(this.Now*4))
		{
			this.moveR();
		}else
		{
			this.moveL();
		}
		for(var i=0;i<Math.ceil(this.Count()/this.pagenum);i++)
		{
			if(i==this.Now)
			{
				this.getEles(this.tabId,"li")[this.Now].className="select";
			}else
			{
				
				
				this.getEles(this.tabId,"li")[i].className="";
			}
		}
	},
	moveR:function(setp)
	{
		var _curLeft=parseInt(this.$(this.tabSilder).style.left);
		var _distance=50;
		if(_curLeft>-156*parseInt(this.Now*4))
		{
			this.$(this.tabSilder).style.left=(_curLeft-_distance)+26+"px";
			window.setTimeout("TencentArticl.moveR()",1);
		}
	},
	moveL:function(setp)
	{
		var _curLeft=parseInt(this.$(this.tabSilder).style.left);
		var _distance=50;
		if(_curLeft<-156*parseInt(this.Now*4))
		{
			this.$(this.tabSilder).style.left=(_curLeft+_distance)-26+"px";
			window.setTimeout("TencentArticl.moveL()",1);
		}
	},
	pagePe:function(way)
	{
		if(way=="next")
		{
			this.Now+=1;
			this.SildTab(this.Now);
		}else
		{
			this.Now-=1;this.SildTab(this.Now);
		}
	},
	smallCk:function()
	{
		for(var i=0;i<Math.ceil(this.Count()/this.pagenum);i++)
		{
			if(i==0)
			{
				this.$(this.tabDot).innerHTML+="<li class='select' onclick='TencentArticl.SildTab("+i+")'></li>";
			}else
			{
				this.$(this.tabDot).innerHTML+="<li onclick='TencentArticl.SildTab("+i+")'></li>";
			}
		}
	},
	TabChang:function()
	{
		var eles=this.getEles(this.sideTab.heads,this.sideTab.heads_ele);
		var body=this.getEles(this.sideTab.bodys,this.sideTab.bodys_ele);
		for(var i=0;i<eles.length;i++)
		{
			(function()
				  {
					  var p=i;eles[p].onmouseover=function(){
						  	TencentArticl._TabChang(p,body,eles);
					   }
				  }
			)();
		}
	},
	_TabChang:function(n,body,obj)
	{
		for(var i=0;i<body.length;i++)
		{
			if(i==n)
			{
				body[n].className="block";obj[n].className="select";
			}else
			{
				body[i].className="none";obj[i].className="";
			}
		}
	},
	ComList:function()
	{
		/*TencntART.JsLoader.load('http://sum.comment.gtimg.com.cn/php_qqcom/gsum.php?site='+
		TencentArticl.site+'&c_id='+TencentArticl.cmtId+'',
			function()
			{
				
				setTimeout(SildTab(1),0);
			}
		);*/
		// setTimeout(TencentArticl.pagePe("next"),0);
		// TencentArticl.pagePe("next");
	},
	
	setFont:function(n)
	{
		this.$("Cnt-Main-Article-QQ").style.fontSize=n+"px";
	},
	onload:function()
	{
		/**
		 Èç¹ûÊÇFireFoxä¯ÀÀÆ÷
		**/
		if(TencntART.Browser.moz)
		{
			document.addEventListener("DOMContentLoaded",
				function()
				{
					TencentArticl.ints();
					setInterval("TencentArticl.pagePe('next')",2000);
				},
			null);
		}else
		{
			if(document.readyState=="complete")
			{
				TencentArticl.ints();
				setInterval("TencentArticl.pagePe('next')",2000);
			}else
			{
				document.onreadystatechange=function()
				{
					if(document.readyState=="complete")
					{
						TencentArticl.ints();
						setInterval("TencentArticl.pagePe('next')",2000);
					
					}
				}
			}
		}
	},
	ints:function()
	{
		if(this.isSild)
		{
			this.$(this.tabBox).style.position="relative";
			this.$(this.tabSilder).style.position="absolute";
			this.$(this.tabSilder).style.left=0+"px";
			this.getEles(this.tabId,"span")[1].onclick=function(){TencentArticl.pagePe("next");}
			this.getEles(this.tabId,"span")[0].onclick=function(){TencentArticl.pagePe("pre");}
			this.smallCk();
		}
		if(this.isCmt)
		{
			this.ComList();
			
		}
		
	}
}
Object.beget=function(o){var F=function(){};F.prototype=o;return new F();}