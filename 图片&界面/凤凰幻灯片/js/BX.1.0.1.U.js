/**
*BX 全局包 1.0.11
*编码：utf-8版本
*作者：bigtreexu
*网站：http://www.bigtreexu.com
*/
/*___BX GLOABLE___*/
var BX={
	version:'1.0.10.A',
	encoding:'utf-8',
	author:'bigtreexu'
};
BX.namespace=function(ns){
	if(!ns||!ns.length)
	{
		return null;
	}
	var _pr=ns.split('.');
	var _nx=BX;
	for(var i=0;i!=_pr.length;i++)
	{
		_nx[_pr[i]]=_nx[_pr[i]]||{};
		_nx=_nx[_pr[i]];
	}
}

/*___Predigest Application___*/
function $(el)
{
	if(!el)
	{
		return null;
	}
	else if(typeof el=='string')
	{
		return document.getElementById(el);
	}
	else if(typeof el=='object')
	{
		return el;
	}
}
/**
*将id，对象，id数组，对象数组加工成对应的对象数组
*@param 	{String||Object||Array} els id，对象，id数组，对象数组
*@return 	{Array} 对象数组
*/
function $A(els){
	var _els=[];
	if(els instanceof Array)
	{
		for(var i=0;i!=els.length;i++)
		{
			_els[_els.length]=$(els[i]);
		}
	}
	else if(typeof els=='object'&&typeof els['length']!='undefined'&&els['length']>0)
	{
		for(var i=0;i!=els.length;i++)
		{
			_els[_els.length]=$(els[i]);
		}
	}else
	{
		_els[0]=$(els);
	}
	return _els;
}
/*___Init___*/
BX.namespace('Dom');
/**
*BX DOM包 1.0.0
*utf-8版本
*http://www.bigtreexu.com
*/
BX.Dom={
	_batch:function(el,func)
	{
		var _el=$A(el);
		for(var i=0;i!=_el.length;i++)
		{
			if(_el[i])
			{
				func(_el[i]);
			}
		}
	},
	getMouseXY:function(e)
	{
		var _x=_y=0;
		_x=document.documentElement.scrollLeft;
		_y=document.documentElement.scrollTop;
		if(e.clientX||e.clientY)
		{
			_x+=e.clientX;
			_y+=e.clientY;
		}
		else if(e.pageX||e.pageY)
		{
			_x+=e.pageX;
			_y+=e.pageY;
		}
		return [_x,_y];
	},
	getXY:function(el)
	{
		var _x=_y=0;
		while(el)
		{
			_x+=el.offsetLeft;
			_y+=el.offsetTop;
			el=el.parentElement;
		}
		return [_x,_y];
	},
	getWH:function(el)
	{
		return [el.offsetWidth,el.offsetHeight];
	},
	setOpacity:function(els,val)
	{
		var _run=function(el)
		{
			el.style.MozOpacity=''+val/100;
			el.style.filter='Alpha(Opacity='+val+')';
		}
		this._batch(els,_run);
	},
	hide:function(els)
	{
		var _run=function(el)
		{
			el.style.display='none';
		}
		this._batch(els,_run);
	},
	show:function(els)
	{
		var _run=function(el)
		{
			el.style.display='block';
		}
		this._batch(els,_run);
	},
	getClass:function(el)
	{
		if($(el))
		{
			return $(el).className;
		}
		else
		{
			return;
		}
	},
	setClass:function(els,val)
	{
		var _run=function(el)
		{
			el.className=val;
		}
		this._batch(els,_run);
		
	},
	addClass:function(els,val)
	{
		if(!val)
		{
			return;
		}
		var _run=function(el)
		{
			var _cln=el.className.split(' ');
			for(var i=0;i!=_cln.length;i++)
			{
				if(_cln[i]==val)
				{
					return;
				}
			}
			if(el.className.length>0)
			{
				el.className=el.className+' '+val;
			}
			else
			{
				el.className=val;
			}
		}
		this._batch(els,_run);
	},
	hasClass:function(el,val)
	{
		var _bl=false;
		if($(el))
		{
			if(!el.className){return;}
			var _cln=el.className.split(' ');
			for(var i=0;i!=_cln.length;i++)
			{
				if(_cln[i]==val)
				{
					_bl=true;
					break;
				}
			}
		}
		return _bl;
	},
	removeClass:function(els,val)
	{
		if(!val)
		{
			return;
		}
		var _run=function(el)
		{
			var _cln=el.className.split(' ');
			var _s='';
			for(var i=0;i!=_cln.length;i++)
			{
				if(_cln[i]!=val)
				{
					_s+=_cln[i]+' ';
				}
			}
			if(_s==' ')
			{
				_s='';
			}
			if(_s.length!=0)
			{
				_s=_s.substr(0,_s.length-1);
			}
			el.className=_s;
		}
		this._batch(els,_run);
	},
	replaceClass:function(els,vala,valb)
	{
		if(!vala||!valb)
		{
			return;
		}
		var _run=function(el)
		{
			var _cln=el.className.split(' ');
			for(var i=0;i!=_cln.length;i++)
			{
				if(_cln[i]==vala)
				{
					_cln[i]=valb;
				}
			}
			el.className=_cln.join(' ');
		}
		this._batch(els,_run);
	},
	setStyle:function(els,styleName,styleValue)
	{
		var _run=function(el)
		{
			el.style[styleName]=styleValue;
		}
		this._batch(els,_run);
	},
	getStyle:function(el,styleName)
	{
		return el.style[styleName];
	},
	getElementsByClassName:function(parentEl,className,tagName){
		if(!parentEl||!className){
			return null;
		}
		var els=cds=[];
		cds=$(parentEl).childNodes;
		className=className.toUpperCase();
		for(var i=0;i<cds.length;i++){
			var _type=cds[i].nodeType;
			if(_type!=3&&_type!=8&&cds[i].className.toUpperCase()==className){
				if(!tagName||cds[i].nodeName.toUpperCase()==tagName.toUpperCase()){
					els[els.length]=cds[i];
				}
			}
		}
		return els;
	}
}

var O=BX.Dom;
