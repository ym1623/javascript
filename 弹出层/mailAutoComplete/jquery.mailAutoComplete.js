/**
 * @author lonely
 * @param {Object} domain
 */
(function($){
	$.fn.mailAutoComplete = function(domain){
		var domain = domain||["qq.com","yahoo.com","gmail.com","163.com","hotmail.com","aol.com","live.com","msn.com","mail.com",'email.com','facebook.com'];
		function box($input,callback){
			var _tpls=$('<div class="mailAutoComplete"></div>');
			_tpls.css({
				position:'absolute',
				left:($input.position().left)+'px',
				top:($input.position().top+$input.outerHeight())+'px',
				display:'none'
			});
			$input.after(_tpls);
			this._callback=callback||$.noop;
			this.input=$input;
			this.tpls=_tpls;
			this._unkeyfn=null;
		}
		box.prototype.tips=function(txt){
			var _txt=txt.replace(/@.*$/,''),
				tpls=this.tpls,
				$input=this.input;
			_txt=$.trim(_txt);
			if(!_txt){
				return ;
			}
			tpls.empty().show();
			tpls.css({
				left:($input.position().left)+'px',
				top:($input.position().top+$input.outerHeight())+'px',
			});
			if(this._unkeyfn){
				$(document).unbind('keyup',this._unkeyfn);
				this._unkeyfn=null;
			}
			if(/@.+/.test(txt)){
				var _domainlist=[];
				var ttxt=txt.replace(/^.*@/,'')
				for(var i=0;i<domain.length;i++){
					var dc=domain[i].toLowerCase(),
						tc=ttxt.toLowerCase();
					if(
						dc.indexOf(tc)>=0&&
						dc!=tc
						){
						_domainlist.push(domain[i]);
					}
				}
			}else{
				var _domainlist=domain;
			}
			this._create(_txt,_domainlist);
			this._event();
		}
		box.prototype._create=function(txt,domainlist){
			var tpls=this.tpls,
			_txt=$.trim(txt.replace(/^.*@/,'')),
			tplsitem=function(name,domain){
				return [
					'<div class="mailautocomplete_item">',
					name,
					'@',
					domain,
					'</div>'
					].join('');
			};
			$.each(domainlist,function(i,d){
				tpls.append(tplsitem(_txt,d));
			});
		}
		box.prototype._event=function(){
			var self=this,
				tpls=this.tpls,
				_cb = function(txt){
					self._callback($.trim(txt));
				},
				item=tpls.find('.mailautocomplete_item')
				avtc='mailautocomplete_item_avt'
				;
			if(item.length<=0){
				tpls.hide();
				return false;
			}
			item.first().addClass(avtc);
			item.click(function(){
				_cb($(this).text());
			}).mouseover(function(){
				$(this).addClass(avtc);
			}).mouseout(function(){
				$(this).removeClass(avtc);
			});
			var keyfn=function(e){
				switch(e.keyCode){
					case 40://down
						var m=false;
						item.each(function(i,d){
							var sd=$(d);
							if(sd.hasClass(avtc)){
								m=true;
								var n=sd.next();
								if(n.length){
									sd.removeClass(avtc);
									n.addClass(avtc);
									return false;
								}
							}
						})
						if(!m){
							item.first().addClass(avtc);
						}
					break;
					case 38://up
						var m=false;
						item.each(function(i,d){
							var sd=$(d);
							if(sd.hasClass(avtc)){
								m=true;
								var n=sd.prev();
								if(n.length){
									sd.removeClass(avtc);
									n.addClass(avtc);
									return false;
								}
							}
						})
						if(!m){
							item.last().addClass(avtc);
						}
					break;
					case 13://enter
						var m=false;
						item.each(function(i,d){
							var sd=$(d);
							if(sd.hasClass(avtc)){
								m=true;
								self.hide();
								_cb(sd.text());
								return false;
							}
						})
						if(!m){
							self.hide();
							_cb(item.first().text());
						}
					break;
				};
			}
			$(document).bind('keyup',keyfn);
			this._unkeyfn=keyfn;
		}
		box.prototype.hide=function(){
			if(this._unkeyfn){
				$(document).unbind('keyup',this._unkeyfn);
				this._unkeyfn=null;
			}
			this.tpls.hide();
		}
		return this.each(function(i,d){
			if(d.nodeName.toLowerCase()!='input'){
				return false;
			}
			var self=$(d);
			var pself=self.parent();
			var _p=pself.css('position');
			if(!(_p=='absolute'||_p=='fixed')){
				pself.css('position','relative');
			}
			self.attr('autocomplete','off');
			var boxo=new box(self,function(txt){
				self.val(txt);
			});
			var s=null;
			var t=null;
			var pro=function(){
				t&&clearTimeout(t);
				var vs=$(this).val();
				if(!$.trim(vs)){
					boxo.hide();
				}
				if(s!=vs){
					boxo.tips(vs);
					s=vs;
				}
			};
			var blur=function(){
				t=setTimeout(function(){
					boxo.hide();
				},200);
			}
			self.keyup(pro).focus(pro).blur(blur);
		})
	};
})(jQuery);