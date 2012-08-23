
function scroll(n){
temp=n;
document.getElementById("gundong").scrollTop=document.getElementById("gundong").scrollTop+temp;
if (temp==0) return;
setTimeout("scroll(temp)",20);
}
function getHeight() {
	 if(document.getElementById("gdheight").offsetHeight>340){
     document.getElementById("ssjt").style.display="block"; }
	 
      }
var listArray=new Array;
function shiyi(Num,img,picid,cssname){	
	xtcss(Num,picid);
	document.getElementById("shiyi_"+Num).src=img;
	document.getElementById("shiyi_"+Num).style.display="block";
	cssname.className=cssname.className="ss_xtli";	
	}
function sy_rw(){
	
	document.getElementById("sy_rw").style.display=document.getElementById("sy_rw").style.display=="block"?"none":"block";
	getHeight()	
	
	}
function ss_xt(){
	document.getElementById("ss_xt").style.display=document.getElementById("ss_xt").style.display=="block"?"none":"block";
	}
function ss_mendt(){
	document.getElementById("shiyi_men").style.display="block";
	document.getElementById("shiyi_women").style.display="none";
	document.getElementById("ss_women").src="images/rw_22.gif";
	document.getElementById("ss_men").src="images/rw_1.gif";
	document.getElementById("ss_men_xt").style.display="block";
	document.getElementById("ss_women_xt").style.display="none";
	}
function ss_womendt(){
	document.getElementById("shiyi_women").style.display="block";
	document.getElementById("shiyi_men").style.display="none";
	document.getElementById("ss_men").src="images/rw_11.gif";
	document.getElementById("ss_women").src="images/rw_2.gif";
	document.getElementById("ss_women_xt").style.display="block";
	document.getElementById("ss_men_xt").style.display="none";
	}

function scdiv(divname,Num,img,xtpic,picid){
	ssss='<img src='+ xtpic+ ' class="ss_xtli" width="40" height="50" id="pic'+picid + '"'+ 'onclick='+'"'+'shiyi('+  Num+",'"+img+"',"+picid+",this"+')"/>';
	var sft = document.getElementById(divname);
	var sc2 = document.createElement("div");
	sc2.id=picid+"child222";
	sft.appendChild(sc2);
	sc2.innerHTML=ssss;
	getHeight() 
	enCookie(Num,img,xtpic,picid)
}	
function xtcss(Num,picid){
	var divlength=new Array;
	for(ii=3;ii<9;ii++){ 
	divlength[ii]=document.getElementById("ss_xtxs_"+ii).getElementsByTagName("div").length;
	if(Num==ii){
		for(var i=0;i<divlength[ii];i++){
		document.getElementById("ss_xtxs_"+ii).childNodes[i].childNodes[0].className="ss_xtli1";}
			   }
				}	   
	if(document.getElementById("shiyi_"+Num).style.display=="block"){
	document.getElementById("pic"+picid).className="ss_xtli";
	}else{
		document.getElementById("pic"+picid).className="ss_xtli1";
		}	
	} 
function xt(Num,img,xtpic,picid){	

document.getElementById("ss_xtxs_"+Num).style.width=100+"%";
	var divlength=new Array
		for(i=3;i<9;i++){ 
		divlength[i]=document.getElementById("ss_xtxs_"+i).getElementsByTagName("div").length;
		}
		if(Num<6){	
		ss_mendt()
		document.getElementById("sy_rw").style.display="block";
		document.getElementById("shiyi_"+Num).src=img;
		document.getElementById("shiyi_"+Num).style.display="block";}
		else{
		ss_womendt()
		document.getElementById("sy_rw").style.display="block";
		document.getElementById("shiyi_"+Num).src=img;
		document.getElementById("shiyi_"+Num).style.display="block";}	
	if(isAdd(picid)){
			xtcss(Num,picid);	
			return;
			}
	listArray.push(picid);
			if(divlength[Num]<1){
					scdiv("ss_xtxs_"+Num,Num,img,xtpic,picid)
					
					}else{
						for(var i=0;i<divlength[Num];i++){
			document.getElementById("ss_xtxs_"+Num).childNodes[i].childNodes[0].className="ss_xtli1";}
						 scdiv("ss_xtxs_"+Num,Num,img,xtpic,picid)
						 
								}
							
					}
function isAdd(picid)
{
	for(var i=0;i<listArray.length;i++)
	{
		if(listArray[i]==picid)return true;	
	}	
	return false;
}	
function deletebutton(){
	document.getElementById("ssjt").style.display="none"; 
	var divnum=new Array
	for(i=3;i<9;i++){
	document.getElementById("shiyi_"+i).style.display="none";
	document.getElementById("shiyi_"+i).src="images/tm.gif";
	divnum[i]=document.getElementById("ss_xtxs_"+i);
	while(divnum[i].hasChildNodes()) {divnum[i].removeChild(divnum[i].firstChild);}
	}
	listArray.splice(0,listArray.length,"删除不重复数组- -##")
	delCookie()
}

function delCookie()//删除cookie
{	 username="";
    setCookie('username',username,365)
}


function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}

function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function checkCookie(){  

		username=getCookie('username') 
		if (username!=""){	
		var strCookie= username;
		//将多cookie切割为多个名/值对 
		var arrCookie=strCookie.split(";*"); 
		
		
		var arrCookie0=arrCookie[0].split("arr3;"); 
		var arrCookie00=new Array;
		for(var u=0;u<arrCookie0.length-1;u++){
	var Cookielength=new Array;
	 Cookielength[u]=arrCookie0[u].split("+"); 
	arrCookie00[u]='<div><img src='+ Cookielength[u][2]+ ' class="ss_xtli1" width="40" height="50" id="pic'+Cookielength[u][3] + '"'+ 'onclick='+'"'+'shiyi('+3+",'"+Cookielength[u][1]+"',"+Cookielength[u][3]+",this"+')"/></div>';
	document.getElementById("ss_xtxs_3").innerHTML=document.getElementById("ss_xtxs_3").innerHTML+arrCookie00[u];
		};
		
	
		var arrCookie1=arrCookie[1].split("arr3;"); 
		var arrCookie11=new Array;
		for(var u=0;u<arrCookie1.length-1;u++){
	var Cookielength1=new Array;
	 Cookielength1[u]=arrCookie1[u].split("+"); 
	arrCookie11[u]='<div><img src='+ Cookielength1[u][2]+ ' class="ss_xtli1" width="40" height="50" id="pic'+Cookielength1[u][3] + '"'+ 'onclick='+'"'+'shiyi('+4+",'"+Cookielength1[u][1]+"',"+Cookielength1[u][3]+",this"+')"/></div>';
	document.getElementById("ss_xtxs_4").innerHTML=document.getElementById("ss_xtxs_4").innerHTML+arrCookie11[u];
		};
		
		var arrCookie2=arrCookie[2].split("arr3;"); 
		var arrCookie22=new Array;
		for(var u=0;u<arrCookie2.length-1;u++){
	var Cookielength2=new Array;
	 Cookielength2[u]=arrCookie2[u].split("+"); 
	arrCookie22[u]='<div><img src='+ Cookielength2[u][2]+ ' class="ss_xtli1" width="40" height="50" id="pic'+Cookielength2[u][3] + '"'+ 'onclick='+'"'+'shiyi('+5+",'"+Cookielength2[u][1]+"',"+Cookielength2[u][3]+",this"+')"/></div>';
	document.getElementById("ss_xtxs_5").innerHTML=document.getElementById("ss_xtxs_5").innerHTML+arrCookie22[u];
		};
		
		var arrCookie3=arrCookie[3].split("arr3;"); 
		var arrCookie33=new Array;
		for(var u=0;u<arrCookie3.length-1;u++){
	var Cookielength3=new Array;
	 Cookielength3[u]=arrCookie3[u].split("+"); 
	arrCookie33[u]='<div><img src='+ Cookielength3[u][2]+ ' class="ss_xtli1" width="40" height="50" id="pic'+Cookielength3[u][3] + '"'+ 'onclick='+'"'+'shiyi('+6+",'"+Cookielength3[u][1]+"',"+Cookielength3[u][3]+",this"+')"/></div>';
	document.getElementById("ss_xtxs_6").innerHTML=document.getElementById("ss_xtxs_6").innerHTML+arrCookie33[u];
		};
		
		var arrCookie4=arrCookie[4].split("arr3;"); 
		var arrCookie44=new Array;
		for(var u=0;u<arrCookie4.length-1;u++){
	var Cookielength4=new Array;
	 Cookielength4[u]=arrCookie4[u].split("+"); 
	arrCookie44[u]='<div><img src='+ Cookielength4[u][2]+ ' class="ss_xtli1" width="40" height="50" id="pic'+Cookielength4[u][3] + '"'+ 'onclick='+'"'+'shiyi('+7+",'"+Cookielength4[u][1]+"',"+Cookielength4[u][3]+",this"+')"/></div>';
	document.getElementById("ss_xtxs_7").innerHTML=document.getElementById("ss_xtxs_7").innerHTML+arrCookie44[u];
		};
		
		var arrCookie5=arrCookie[5].split("arr3;"); 
		var arrCookie55=new Array;
		for(var u=0;u<arrCookie5.length-1;u++){
	var Cookielength5=new Array;
	 Cookielength5[u]=arrCookie5[u].split("+"); 
	arrCookie55[u]='<div><img src='+ Cookielength5[u][2]+ ' class="ss_xtli1" width="40" height="50" id="pic'+Cookielength5[u][3] + '"'+ 'onclick='+'"'+'shiyi('+8+",'"+Cookielength5[u][1]+"',"+Cookielength5[u][3]+",this"+')"/></div>';
	document.getElementById("ss_xtxs_8").innerHTML=document.getElementById("ss_xtxs_8").innerHTML+arrCookie55[u];
		};
		
	
	document.getElementById("shiyi_men").innerHTML=arrCookie[6];
		document.getElementById("shiyi_women").innerHTML=arrCookie[7];
		var str=arrCookie[8].split(",");
	for(var j=0;j<str.length;j++){
			listArray[j]=str[j]
			}
		
    }else{
	document.getElementById("ss_xtxs_3").innerHTML="";
	document.getElementById("ss_xtxs_4").innerHTML="";
	document.getElementById("ss_xtxs_5").innerHTML="";
	document.getElementById("ss_xtxs_6").innerHTML="";
	document.getElementById("ss_xtxs_7").innerHTML="";
	document.getElementById("ss_xtxs_8").innerHTML="";
	document.getElementById("shiyi_men").innerHTML=document.getElementById("shiyi_men").innerHTML;
	document.getElementById("shiyi_women").innerHTML=document.getElementById("shiyi_women").innerHTML;
	}
	

}


function enCookie(Num,img,xtpic,picid)
{ 
username=getCookie('username') 
var strCookie= username;

//将多cookie切割为多个名/值对 
var arrCookie=strCookie.split(";*"); 
var strCookie=arrCookie;
var ss=Num-3
for(i=0;i<9;i++){
	if(arrCookie[i]==""|| arrCookie[i]=="undefined"){
		arrCookie[i]="";
		}
	}
	if(arrCookie[ss]==""|| arrCookie[ss]=="undefined"){
		arrCookie[ss]=Num+"+"+img+"+"+xtpic+"+"+picid+"arr3;";
		}else{
			arrCookie[ss]=arrCookie[ss]+Num+"+"+img+"+"+xtpic+"+"+picid+"arr3;";
			}
	
	arrCookie[6]=document.getElementById("shiyi_men").innerHTML;
	arrCookie[7]=document.getElementById("shiyi_women").innerHTML;
	arrCookie[8]=listArray;
	
	delCookie()
	username=arrCookie[0]+";*"+arrCookie[1]+";*"+arrCookie[2]+";*"+arrCookie[3]+";*"+arrCookie[4]+";*"+arrCookie[5]+";*"+arrCookie[6]+";*"+arrCookie[7]+";*"+arrCookie[8];
    setCookie('username',username,365)

	}
