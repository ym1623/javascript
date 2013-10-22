/*******************************
 * @Author:Mr.Think
 * @Creation date:13-1-24 上午10:50
 * @Description:jQuery.Choose
 *******************************/
;
(function ($) {
    $.fn.iChoose = function (options) {
        var SELF=this;
        var iset = $.extend({}, $.fn.iChoose.defaults, options);
        var _h,pull=null;
        var main=$(iset.choMain);
        var chose=$(iset.choCls,main);
        var input=$(SELF);
        var tips=$(iset.tips,main);
        var cls=iset.selCls;
        var ids=$(iset.chsIds);
        var _l=iset.limit;
        //若无列表数据则中断
        if(iset.data.length==0){return false}
        //初始化下拉列表
        var tpl='<div class="'+iset.pullCls+'"><ul>';
        var tplArr=[];
        $.each(iset.data,function(k,v){
            tplArr.push('<li data-mid="'+ v.mid+'" data-name="'+ v.filterName.toUpperCase()+'" class="hook_visible hook_'+v.mid+'">'+ v.name+'</li>');
        });
        tpl=tpl+tplArr.join('')+'</ul></div>';
        if(pull==null){
            main.append(tpl);
        }
        pull=$('.'+iset.pullCls,main);
        _h=pull.find('li').outerHeight(true);
        pull.width(main.width()-2);
        //操作函数
        var Action={
            init:function(){
                //列表鼠标划过
                pull.delegate('li.hook_visible','mouseover',function(){
                    $(this).addClass(cls).siblings().removeClass(cls);
                });
                //选择列表
                pull.delegate('li.hook_visible','click',function(){
                    Action.choose($(this));
                });
                //点击弹出列表
                chose.click(function(){
                    Action.show();
                });
                //移除已选择
                chose.delegate('.'+iset.removeEl,'click',function(){
                    Action.undock($(this));
                });
            },
            move: function(dir) {
                //上下移动 - 上::str=up | 下::step=down;
                var index;
                var item=pull.find('li.hook_visible').filter(':visible');
                var cur=item.filter('.'+cls);
                cur.size()==0 ? index=-1 : index=item.index(cur);
                item.eq(dir=='up' ? (index<1 ? 0 : index-1) : index+1).addClass(cls).siblings().removeClass(cls);
                //移动时跟随滚动
                if(item.size()>_l){
                    //下翻滚动
                    if(dir=='down'){
                        pull.scrollTop((index+2-_l)*_h);
                    }
                    //上翻滚动
                    if(dir=='up'){
                        pull.scrollTop((index-1)*_h);
                    }
                }
            },
            choose:function(el){
                //列表选择
                var mid=el.attr('data-mid');
                var name=el.text();
                tips.before('<div class="'+iset.selItemCls+'"><span>'+name+'</span><a href="javascript:;" class="'+iset.removeEl+'" data-mid="'+mid+'">x</a></div>');
                input.focus();
                el.hide().removeClass('hook_visible');
                //返回选中列表id
                ids.val() =='' ? ids.val(mid) : ids.val(ids.val()+','+mid);
                pull.find('li.hook_visible:first').addClass(cls).siblings().removeClass(cls);
                this.upstyle();
            },
            undock:function(el){
                //删除已选
                var mid=el.attr('data-mid');
                var idsArr=ids.val().split(',');
                input.focus();
                el.parent().remove();
                idsArr=$.grep(idsArr,function(v,k){
                   return v != mid;
                });
                ids.val(idsArr.join(','));
                pull.find('li.hook_'+mid).show().addClass('hook_visible');
                this.upstyle();
            },
            show:function(){
                //显示列表
                pull.slideDown(100,function(){Action.match('')});
                pull.find('li.hook_visible:first').addClass(cls).siblings().removeClass(cls);
                $(SELF).focus();
                tips.hide();
                input.addClass(iset.inputWCls);
            },
            hide:function(){
                //隐藏列表
                pull.slideUp(100);
                $(SELF).blur();
                tips.show();
                input.removeClass(iset.inputWCls);
            },
            upstyle:function(type){
                //更新下拉列表样式 - 当已选换行时 --
                var len=pull.find('li.hook_visible').size();
                if(type=='match'){
                    len=pull.find('li:visible').size();
                }
                if(len<_l){
                    pull.height(_h*len);
                    if(len==0){
                        this.hide();
                    }
                }else{
                    pull.height(_h*_l);
                }
                pull.css('top',chose.outerHeight());
            },
            match:function(str){
                //过滤选择 - 拼音选择须插件支持
                var visible=pull.find('li.hook_visible');
                visible.each(function(){
                    var name=$(this).attr('data-name');
                    name.match(str.toUpperCase())!=null ? $(this).show() : $(this).hide();
                });
                if(visible.size()==0 && $('.'+iset.noResCls).size()==0){
                    pull.find('li:first').before('<li class="'+iset.noResCls+'">暂无可选择列表</li>')
                }
                this.upstyle('match');
            },
            blur:function(str){
                //非选择区域点击隐藏
                pull.find('li.hook_visible').each(function(){
                    var name=$(this).text();
                    if(name == str){
                        Action.choose($(this));
                    }
                });
                input.val('');
            }
        }
        Action.init();
        //键盘控制 - 绑定输入表单
        $(this).on({
            //键盘弹起
            'keyup change':function(){
                var val= $.trim(input.val());
                Action.match(val);
            },
            //失去焦点
            'blur':function(){
                var val= $.trim(input.val());
                Action.blur(val);
            },
            //键盘按下 -- 捕获键盘值，以执行对应事件
            /*
            8  - delete;
            27 - esc;
            38 - up;
            40 - down;
            9  - tab;
            13 - enter
             */
            'keydown':function(e){
                switch (e.keyCode) {
                    case 8:
                        if($.trim(input.val())==''){
                            e.preventDefault();
                            var last=chose.find('.'+iset.removeEl+':last');
                            if(last.size()>0){
                                Action.undock(last);
                            }
                        }
                        break;
                    case 27:
                        e.preventDefault();
                        Action.hide();
                        break;
                    case 38:
                        e.preventDefault();
                        Action.move('up');
                        break;
                    case 40:
                        e.preventDefault();
                        Action.move('down')
                        break;
                    case 9:
                    case 13:
                        e.preventDefault();
                        Action.choose(pull.find('.'+cls));
                        break;
                    default:
                        $.noop();
                }
            }
        });
        //点击非当前区域隐藏弹出层
        main.click(function(e){
            e.stopPropagation();
        });
        $(document).click(function(){
           Action.hide();
        });
    }
    $.fn.iChoose.defaults = {
        /*
        data:传入值，可以实时ajax传上，演示中是json值，具体格式可参考mod.udatas.js中的$.map(...)
        limit:每次显示的条数，其他滚动显示
        choMain:载入区域id
        pullCls:弹出列表的class
        choCls:已选择列表的外围class
        selItemCls:已选择的单个元素class
        removeEl:删除元素的class
        selCls:列表高亮的class
        inputWCls:input的class
        tips:默认提示值元素钩子
        noResCls:列表中无结果时的cls
        chsIds:已选择列表的id值，传给后端用的。（此值亦可用回调函数把值从插件中回传出来）
         */
        data:UDatas,
        limit:5,
        choMain:'#iChooseMain',
        pullCls:'icm-list',
        choCls:'.icm-box',
        selItemCls:'icm-item',
        removeEl:'icm-delete',
        selCls:'selected',
        inputWCls:'icm-input-w',
        tips:'.icm-cur-txt',
        noResCls:'hook_noresult',
        chsIds:'#iChooseIds'
    }
})(jQuery);