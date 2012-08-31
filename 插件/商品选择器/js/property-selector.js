(function(){
	jQuery.ajaxTabView = function(tabs,cnt,callback){
		$(tabs).each(function(i){
			$(this).click(function(evt){
				var lnk = $(this).find('a')[0], 
				    url = $(lnk).attr('href'), 
					key = url.split('/')[0], 
					value = url.split('/')[1], 
					curTab = $(this)[0];
				
				jQuery.ajax({
					url: key + '.html',
					type: 'GET',
					data: {
						key: value
					},
					dateType: 'html',
					success: function(html){
						$(cnt).show().html(html);
						if (callback) {
							callback();
						}
					},
					error: function(xhr){
						alert('错误：' + xhr.status);
					}
				});
				
				evt.preventDefault();
				evt.stopPropagation();
			});
		});
	};
})();

(function(){
	var selectedProperties = {
			values: {},
			keys: {}
		}, 
		header = null, 
		titles = null, 
		lists = null, 
		tabTag = '',
		isOnlyOne = {}, 
		lastSelectedTab = null, 
		selectedCounter = 0,
		indexOf = (Array.prototype.indexOf) ? function(a, val){
			return Array.prototype.indexOf.call(a, val);
		}: function(a, val){
		    var i = 0, len;
		    for (len = a.length; i < len; i = i + 1) {
				if (a[i] === val) {
					return i;
				}
			}
		
		    return -1;
	    };
		
	jQuery.PropertySelector = {	
		isOnlyOne: {},
		length: 0,
		/**
		 * @method select
		 * @param {Object} config
		 */
		select: function(config){
			var selector = this;
			
			header = (config && config.header) ? config.header : $("#property-header");
			titles = (config && config.titles) ? config.titles : $("#property-selector h3");
			lists = (config && config.lists) ? config.lists : $("#property-selector ul");
			tabTag = (config && config.tabTag) ? config.tabTag : 'li';
			
			lists.each(function(i){
				var tabs = $(this).find(tabTag), 
				    property = $(titles[i]).attr("id"), 
				    propertyText = $(titles[i]).text(),
				    keys = selectedProperties.keys,
				    values = selectedProperties.values; 
				
			    isOnlyOne[property] = (config && config.onlyone);
				selector.isOnlyOne[property] = isOnlyOne[property];
				
				values[property] = [];
				keys[property] = [];
				
				if (isOnlyOne[property]) {
					values[property].length = 1;
					keys[property].length = 1;
				}
				
				tabs.each(function(j){
					$(this).click(function(evt){
						var lnk = $($(this).find('a')[0]), value = lnk.attr('href').split('/')[1], valueText = $(this).text(), selectedKeyURL = property + '/' + value + '/', selectedKey = $('<a class="property" href="' + selectedKeyURL + '" tabindex="' + j + '" title="点击我可以取消选择">' + valueText + '</a>');
						selectedTab = $('#selected-' + property)[0];
						selectedTabTitle = $('#selected-' + property + '-title')[0];
						if (!selectedTab) {
							selectedTab = $('<span id="selected-' + property + '"></span>');
							header.append(selectedTab);
						}
						else {
							if (selectedTab) {
								$(selectedTab).show();
							}
						}
						
						if (!selectedTabTitle) {
							selectedTabTitle = $('<em id="selected-' + property + '-title"></em>').html(propertyText);
							$(selectedTab).append(selectedTabTitle);
						}
						
						if (isOnlyOne[property]) {
							values[property][0] = value;
							keys[property][0] = valueText;
							selectedCounter = 1;
							$(this).hide();
							$(lastSelectedTab).show();
							$($(selectedTab).find('a')[0]).remove();
							$(selectedTab).append(selectedKey);
							
							lastSelectedTab = $(this);
						}
						else {
							values[property].push(value);
							keys[property].push(valueText);
							selectedCounter += 1;
							$(this).hide();
							$(selectedTab).append(selectedKey);
						}
						
						$(selectedKey).click(function(evt){
							var tabIndex = $(this).attr('tabindex'), valueIndex = indexOf(value, values[property]);
							
							$(this).remove();
							if (isOnlyOne[property]) {
								selectedCounter = 0;
							}
							else {
								selectedCounter -= 1;
								if (selectedCounter < 0) {
									selectedCounter = 0;
								}
							}
							$(tabs[tabIndex]).show();
							if ($(selectedTab).find('a').length === 0) {
								$(selectedTab).hide();
							}
							
							values[property].splice(valueIndex, 1);
							
							selector.length = selectedCounter;
							
							evt.preventDefault();
							evt.stopPropagation();
						});
						
						selector.length = selectedCounter;
						
						evt.preventDefault();
						evt.stopPropagation();
					});
				});
			});
		},		
		getSelectedProperties: function(){
			return selectedProperties;
		},
		getSelectedValues: function(){
			return selectedProperties.values; 
		},
		getSelectedKeys: function(){
			return selectedProperties.keys; 
		},
		getSelectedValuesToURL: function(){
			var values = selectedProperties.values, value, key, i = 0, len = 0, url = '', decode = decodeURIComponent;
			
			for (key in values) {
				value = values[key];
				if (jQuery.isArray(value)) {
					$(value).each(function(k, val){
						if (val) {
							url += (url ? '&' : '') + key + '=' + decode(val);
						}
					});
				}
				else {
					if (value) {
						url += (url ? '&' : '') + key + '=' + decode(value);
					}
				}
			}
			
			return url;
		}
	};
})();