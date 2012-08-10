// 全局命名空间
var html5mobi = {
	author : '刚子',
	version: '1.0',
	website:'http://www.html5mobi.com'
}
// 工具包
html5mobi.utils = {
	setParam : function (name,value){
		localStorage.setItem(name,value)
	},
	getParam : function(name){
		return localStorage.getItem(name)
	}
}
// 业务控制中心，需应用实现
html5mobi.controllers = {}
// 事件注册
html5mobi.run = function(pages){
	var pages = pages,
	count = pages.length
	for(var i=0;i<count;i++){
		var page = pages[i],
			id = page.id
			e_array = page.event.split(',')
		for(var j=0; j <e_array.length;j++){
			var e = e_array[j]
			if($.trim(e).length == 0)
				continue
			$('#'+id).live(e, html5mobi.controllers[id][e])
		}
	}
}