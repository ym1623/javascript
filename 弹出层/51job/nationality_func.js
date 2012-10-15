var nation = {
	// 国籍输出
	Show : function(){
		var output='',flag,output2='';
		for (var i in na){
			output+='<li onclick="nation.Chk(\''+i+'\')">'+na[i]+'</li>';
		}
		$('#drag').width('370px');
		$('#nationList').html('<ul>'+output+'</ul>');
		// 鼠标悬停变色
		$('#nationAlpha li').hover(function(){$(this).addClass('over')},function(){$(this).removeClass('over')});
	},
	Chk : function(id){
		$('#btn_nation').val(na[id]);
		$('#nation').val(id);
		boxAlpha();
	}
}

function nationSelect(){
	var dragHtml ='<div id="nationAlpha">';		//国籍
		dragHtml+='		<div id="nationList"></div>';//国籍列表
		dragHtml+='</div>';
	$('#drag_h').html('<b>请选择国籍</b><span onclick="boxAlpha()">关闭</span>');
	$('#drag_con').html(dragHtml);

	nation.Show();
	boxAlpha();
	draglayer();
}