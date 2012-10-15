/*#############################################################
Name: b_RoundCurve Css圆角框组件--冰极峰
Version: 1.0
Author: biny
Email:szbiny@163.com
冰极峰博客地址：http://www.cnblogs.com/binyong
你可以免费使用和修改代码，但请保留完整的版权信息。

有如下五种调用方法：
	b_RoundCurve("bottom","#F8B3D0","#FFF5FA",1);//普通圆角框
	b_RoundCurve("left1","#AE0474","#FB7D3F",3,"h3","","image/bg5.gif");//标题用背景图片
	b_RoundCurve("right1","#863313","#84D4CA",3,"h3","#BAB556");//标题只用纯色背景
	b_RoundCurve("right2","orange","",3,"h3","");//标题不带背景色
	b_RoundCurve("top","#4C7C9B","",4);//圆角背景图片
	b_RoundCurve("img","#999","#FFF5FA",2);//圆角IMG图片
#################################################################*/

/*
  圆角函数--Author: biny
  传递7个参数
  1.class类名
  2.边框色
  3.主体内容区背景色
  4.风格切换方式，从1-5，5种圆角框样式，针对不同环境使用。
  5.标题的html结构标签名
  6.标题背景色
  7.标题背景图片路径（和6是相斥的，两个选择一个）
*/
function b_RoundCurve(classname,b_c,bg_c,state,tagname,titlebg,titleimg){	
	var divs=getElementsByClassName(classname);
	for(var i=0;i<divs.length;i++){
		var obj=divs[i];
		var path=window.location.href;//当前页面的路径
		path=path.substring(0,path.lastIndexOf('/')+1);
		//b标签的通用样式
		var comstyle="height:1px; font-size:1px;overflow:hidden; display:block;";
		//b标签的结构样式
		var b1="margin:0 5px;";//和b8相同
		var b2="margin:0 3px;border-right:2px solid; border-left:2px solid;";//和b7相同
		var b3="margin:0 2px;border-right:1px solid; border-left:1px solid;";//和b6相同
		var b4="margin:0 1px;border-right:1px solid; border-left:1px solid;height:2px;";//和b5相同
		var content="border-right:1px solid;border-left:1px solid;overflow:hidden;position:relative;";
		var bgColor="background:"+bg_c+";";//背景色
		
		//img图片的背景定位
		var imgPos2="background-position:-4px top;";
		var imgPos3="background-position:-2px -1px;";
		var imgPos4="background-position:-1px -2px;";
		var conPos="background-position:left -4px;";
		var imgPos5="background-position:-1px bottom;";
		var imgPos6="background-position:-2px bottom;";
		var imgPos7="background-position:-4px bottom;";
		
		//定义一些变量，这些变量包含不同的样式，在各种风格中拼合组装
		var imgBgStr,imgPos3,imgPos4,conPos,imgPos5,imgPos6,imgPos7;
		var b_img2,b_img3,b_img4,b_img5,b_img6,b_img7,c_img,imgurl;
		
		//五种不同的风格切换
		if(state==1){//最通常使用的线框
		    //组装样式
			b_img2=bgColor;
			b_img3=bgColor;
			b_img4=bgColor;
			c_img=bgColor;
			b_img5=bgColor;
			b_img6=bgColor;
			b_img7=bgColor;
	    }
		if(state==2){//如果是img图片方式，则用背景模拟圆角,注意IMG标签必须显式指定宽高，否则在safari中显示不出来。
			var imgObj=divs[i].getElementsByTagName('img')[0];
			var imgheight=imgObj.height;//图片高度
			var contentheight=imgheight-10;//中间图片的高度
			var imgweight=imgObj.width;//图片宽度
			obj.style.width=(imgweight+2)+"px";
			var imgsrc=imgObj.src.replace(path,'');//图片文件的相当路径
			var imgBgStr="background:url("+imgsrc+") no-repeat;";
			//组装样式
			conPos="height:"+contentheight+"px;width:"+imgweight+"px;overflow:hidden;";	
			
			b_img2=imgBgStr+imgPos2;
			b_img3=imgBgStr+imgPos3;
			b_img4=imgBgStr+imgPos4;
			c_img=conPos;
			b_img5=imgBgStr+"background-position:-1px -"+ (imgheight-4)+"px;";
			b_img6=imgBgStr+"background-position:-2px -"+ (imgheight-2)+"px;";
			b_img7=imgBgStr+"background-position:-4px -"+ (imgheight-1)+"px;";
			imgurl=imgsrc;
		}
		if(state==3){//如果是带标题方式，又可分为两种情况，一种直接用背景色，一种是用背景图片方式
		    var objh3=obj.getElementsByTagName(tagname)[0];
			if(titleimg!=null){//标题带水平平铺的背景图片
				var bgimg="background:url("+titleimg+") repeat-x;";
				b_img2=bgimg+imgPos2;
				b_img3=bgimg+imgPos3;
				b_img4=bgimg+imgPos4;
				//标题栏样式
				objh3.style.background="url("+titleimg+") repeat-x left -4px";
				objh3.style.borderBottomColor=b_c;
			}
			else{//标题不带水平平铺的背景图片
				var bg_c="background:"+titlebg+";";//背景色
				b_img2=bg_c;
				b_img3=bg_c;
				b_img4=bg_c;
				//标题栏样式
				objh3.style.background=titlebg;
				objh3.style.borderBottomColor=b_c;
			}
			//组装样式
			c_img=bgColor;
			b_img5=bgColor;
			b_img6=bgColor;
			b_img7=bgColor;

		}
		if(state==4){//如果是背景图片方式，则。。。
			//先从样式表中获取背景图片的样式,要求加入图片的容器明确定义宽度和高度，和背景图片，这是用在JS用来搜寻的依据。
			var bgimg=getStyle(obj,"backgroundImage");
			var bgWidth=getStyle(obj,"width");
			bgimg=bgimg.replace(path,"");
			bgimg=bgimg.substring(4,bgimg.length);
			bgimg=bgimg.substring(0,bgimg.length-1);
			var bgimgheight=getStyle(obj,"height");//图片的高度
			
			bgimgheight=bgimgheight.replace("px","");
			var contentheight=bgimgheight-10;//中间图片的高度,包含上下边框2px宽度
			bgWidth=bgWidth.replace("px","");
			bgWidth=bgWidth-2;
			
			bgimg=bgimg.replace("url(\"","");
			bgimg=bgimg.replace("\")","");//获得背景图片的全部径。
			path=path.substring(0,(path.lastIndexOf('/')+1));//页面地址
			bgimg=bgimg.replace(path,"");
			imgBgStr="background:url("+bgimg+") no-repeat;";
			obj.style.background="none";//将原始的背景图片隐藏
			//组装样式
			b_img2=imgBgStr+imgPos2;
			b_img3=imgBgStr+imgPos3;
			b_img4=imgBgStr+imgPos4;
			c_img=imgBgStr+conPos+"height:"+contentheight+"px;width:"+bgWidth+"px;";
			
			//关键代码，特别是对图片的定位，需要知道图片的高度。
			b_img5=imgBgStr+"background-position:-1px -"+ (bgimgheight-4)+"px;";
			b_img6=imgBgStr+"background-position:-2px -"+ (bgimgheight-2)+"px;";
			b_img7=imgBgStr+"background-position:-4px -"+ (bgimgheight-1)+"px;";
		}
		if(state==2 || state==4){
			conDivHeight="";
	    }
		else{
			var H=getStyle(obj,"height");//获到容器的高度
			H=H.replace("px","");//去掉单位
			conDivHeight="height:"+(H-8)+"px";//容器的高度伪装成css中的设置的一样
		}
		/*创建一个容器结构体*/
		var rDivStr="<b style='"+ comstyle+b1+"background:"+b_c+"'></b>";
		rDivStr+="<b style='"+ comstyle+b2+"border-color:"+b_c+";"+b_img2+"'></b>";
		rDivStr+="<b style='"+ comstyle+b3+"border-color:"+b_c+";"+b_img3+"'></b>";
		rDivStr+="<b style='"+ comstyle+b4+"border-color:"+b_c+";"+b_img4+"'></b>";
		rDivStr+="<div style='"+content+"border-color:"+b_c+";"+c_img+conDivHeight+"'>";
		rDivStr+="@d_P";
		rDivStr+="</div>";
		rDivStr+="<b style='"+ comstyle+b4+"border-color:"+b_c+";"+b_img5+"'></b>";
		rDivStr+="<b style='"+ comstyle+b3+"border-color:"+b_c+";"+b_img6+"'></b>";
		rDivStr+="<b style='"+ comstyle+b2+"border-color:"+b_c+";"+b_img7+"'></b>";
		rDivStr+="<b style='"+ comstyle+"margin:0 5px;background:"+b_c+"'></b>";
		
		var htmlText=divs[i].innerHTML;
		if(state==2){
			var str1=htmlText.replace("src=\"","src=\"*");
			var strsplit1=str1.split('*')[0];
			var strsplit2=str1.split('*')[1];
			var url=strsplit2.substring(0,strsplit2.indexOf('\"'));
			htmlText=strsplit1+imgurl+"\" style='border:0px;position:absolute;top:-4px;left:0px;'/>";
		}
		rDivStr=rDivStr.replace('@d_P',htmlText);
		divs[i].innerHTML=rDivStr;//替换结构
	}
}

// 说明：准确获取指定元素 CSS 属性值
// 此函数的两个参数，elem为要获取的对象，name为样式属性，如“backgroundColor”
function getStyle( elem, name )
{
	//如果该属性存在于style[]中，则它最近被设置过(且就是当前的)
	if (elem.style[name])
	{
		return elem.style[name];
	}
	//否则，尝试IE的方式
	else if (elem.currentStyle)
	{
		return elem.currentStyle[name];
	}
	//或者W3C的方法，如果存在的话
	else if (document.defaultView && document.defaultView.getComputedStyle)
	{
		name = name.replace(/([A-Z])/g,"-$1");
		name = name.toLowerCase();
		//获取style对象并取得属性的值(如果存在的话)
		var s = document.defaultView.getComputedStyle(elem,"");
		return s && s.getPropertyValue(name);
	    //否则，就是在使用其它的浏览器
	}
	else
	{
		return null;
	}
}

/*根据类名获得对象
调用方法：var topicnum=getElementsByClassName("classname");
*/
function getElementsByClassName(searchClass, node,tag){  
	if(document.getElementsByClassName){return  document.getElementsByClassName(searchClass)}
	else{        
		node = node || document;        
		tag = tag || "*";        
		var classes = searchClass.split(" "),        
		elements = (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag),        
		patterns = [],         
		returnElements = [],        
		current,         
		match;        
		var i = classes.length;       
		while(--i >= 0){patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));}        
		var j = elements.length;       
		while(--j >= 0){            
			current = elements[j];           
			match = false;            
			for(var k=0, kl=patterns.length; k<kl; k++){                
				match = patterns[k].test(current.className);                
				if (!match)  break;           
			} 
			if (match)  returnElements.push(current);        
		}        
		return returnElements;   
	} 
}