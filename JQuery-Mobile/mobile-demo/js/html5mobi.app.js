// 本地化命名空间
var utils = html5mobi.utils,
	controllers = html5mobi.controllers,
	website = html5mobi.website
// 模板
function tplCategories(item){
	return '<li data-icon="false"><a href="cate_discuz.html" data-urlcode="'+ item.UrlCode +'" data-catename="'+ item.Name +'" data-catedisuznum="'+ item.CountDiscussions +'">' + item.Name + '<span class="ui-li-count">'+ item.CountDiscussions +'</span></a></li>'
}
function tplDiscuz(array, items){
	for(var i in items){
		var item = items[i],
			poto = item.FirstPhoto
		if(poto){
			var poto_array = poto.split('/')
			poto = poto_array[0] + '/t' + poto_array[1]
		}else{
			poto = 'userpics/html5.jpg'
		}
		var lastName = item.LastName==null ? '' : item.LastName + '&nbsp;&nbsp;&nbsp;&nbsp;',
			memo = item.CountComments + '&nbsp;评论&nbsp;&nbsp;&nbsp;&nbsp; ' + item.CountViews + '&nbsp;浏览&nbsp;&nbsp;&nbsp;&nbsp; 最近更新：' + lastName + item.LastDate.split(' ')[0]
			li = '<li  data-icon="false"><a href="#discussion" data-id="'+ item.DiscussionID +'"><img src="'+ website +'/uploads/'+ poto +'"/><h3>' + item.Name + '</h3><p>'+ memo +'</p></a></li>'
			array.push(li)
	}
}
// 控制器业务处理中心
controllers.categories = {
	pagecreate : function(event){
		$.getJSON(website + '/categories.json?&callback=?',function(data) {
			var Categories = data.Categories,
				li_array = ['<li data-role="list-divider">所有分类</li>']
			for(var i in Categories){
				if(i==0) continue
				li_array.push(tplCategories(Categories[i]))
			}
			var $listview = $('#categories').find('ul[data-role="listview"]')
			$listview.html(li_array.join(''))
			$listview.listview('refresh')
			$listview.delegate('li a', 'click', function(e) {
			    utils.setParam('CateURLCode',$(this).data('urlcode'))
	 			utils.setParam('CateName',$(this).data('catename'))
	 			utils.setParam('CateDisuzNum',$(this).data('catedisuznum'))
			});
		})
	}
}
controllers.cate_discuz = {
	pagecreate : function(event){
		 $.getJSON(website + '/categories/'+ utils.getParam('CateURLCode') +'.json?callback=?',function(data) {
				var li_array = ['<li data-role="list-divider">'+ utils.getParam('CateName') +'<span class="ui-li-count">'+ utils.getParam('CateDisuzNum') +'</span></li>']
				tplDiscuz(li_array, data.DiscussionData)
				var $listview = $('#cate_discuz').find('ul[data-role="listview"]')
				$listview.html(li_array.join(''))
				$listview.listview('refresh')
				$listview.delegate('li a', 'click', function(e) {
				    utils.setParam('DiscussionID',$(this).data('id'))
				});
			}
	      );
	}
}
controllers.about = {
	pagecreate : function(event){
		  $.getJSON(website + '/discussion.json?DiscussionID=1&callback=?',function(data) {
				var $about = $('#about')
				$about.find('div.ui-body h1').html(data.Discussion.Name)
				$about.find('div.ui-body p').html(data.Discussion.Body)
			}
	      );
	}
}
controllers.discussion = {
	pageshow : function(event){
		 $.getJSON(website + '/discussion.json?DiscussionID='+ utils.getParam('DiscussionID') +'&callback=?',function(data) {
				var $discussion = $('#discussion')
				$discussion.find('div.ui-body h1').html(data.Discussion.Name)
				$discussion.find('div.ui-body p').html(data.Discussion.Body)
			}
	     );
	}
}
controllers.index = {
	pagecreate : function(event){
		  $.getJSON(website + '/discussions.json?page=1-10&callback=?',function(data) {
				var li_array = ['<li data-role="list-divider">热点讨论</li>']
				tplDiscuz(li_array, data.Announcements)
				tplDiscuz(li_array, data.Discussions)
				var $listview = $('#index').find('ul[data-role="listview"]')
				$listview.html(li_array.join(''))
				$listview.listview('refresh')
				$listview.delegate('li a', 'click', function(e) {
				    utils.setParam('DiscussionID',$(this).data('id'))
				});
			}
	      );
	}
}

var pages = [
	{id: 'categories', event:'pagecreate'},
	{id: 'cate_discuz', event:'pagecreate'},
	{id: 'about', event:'pagecreate'},
	{id: 'discussion', event:'pageshow'},
	{id: 'index', event:'pagecreate'}
]
html5mobi.run(pages)