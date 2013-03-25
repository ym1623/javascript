/* Download by http://www.codefans.net*/
function set_home(o,url){if(document.all&&!external.max_version){o.style.behavior='url(#default#homepage)';o.setHomePage(url);}
else window.open("http://bbs.1616.net/thread-1913-1-4.html");}
function getDomain(){return"."+location.hostname.split(".").slice(-2).join(".");}
function referrer(o){var r=document.referrer,n="referrer",hp=document.all?$('#hp')[0].isHomePage("http://www"+getDomain()):0,cr=J1616.Util.getCookie(n),i=-1,urls=["e","cnc"];if(!hp&&document.all){for(var k in urls){if(hp)break;hp=$('#hp')[0].isHomePage("http://www"+getDomain()+"/?"+urls[k]);}}
if(r){if(/http:\/\/(e.)?dnspod.com/i.test(r)){i=0;}
else if(/http:\/\/((test-)?w{3}.)?1616.net\/[a-zA-Z0-9_]+_lt2?.htm/i.test(r)){i=1;}
if(!hp){if(i>=0&&!cr){var _e=o.onclick;o.onclick=function(){set_home(this,"http://www"+getDomain()+"/?"+urls[i]);this.onclick=_e;return false;};J1616.Util.setCookie(n,"notip",null,null,getDomain());}}}}