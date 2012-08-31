$(document).ready(function() {
    var Beacon={}
	//add fav
    $('#btn_fav').click(function(e) {
        var href = $(this).attr('href');
        var title = $(this).attr('title');
        var tag = $(this).attr('tag');
        if (document.all) {//ie
            window.external.addFavorite(href, title);
            e.preventDefault();
        } else if (window.sidebar) {//firefox
            window.sidebar.addPanel(title, href, "");
            e.preventDefault();
        } else if (window.opera && window.print) { //opera
            $(this).attr('rel', 'sidebar');
        } else if (window.chrome) {
            alert('谷歌浏览器请使用Ctrl+D收藏本页');
            e.preventDefault();
        } else {
            alert('您的浏览器不支持自动收藏功能，请手动收藏本页。');
            e.preventDefault();
        }
    });
    //check page_content
    if (!page_content || page_content.length == 0) {
        alert('page_content is null');
        return;
    }

    var book = $('#book');
    var left = $('#book #left');
    var right = $('#book #right');
    var left_w = $('#book #left').width();
    var left_bar = $('#book .arrow').eq(0);
    var right_bar = $('#book .arrow').eq(1);
    var flip = $('#book #flip');
    var flip_time = 1000;
    var sid = typeof spaceid != "undefined" ? spaceid : 2143768475;
    var current = start_page ? start_page : 0;
    var total = page_content.length;

    var isIE = false;
    var arVersion = navigator.appVersion.split("MSIE");
    var version = parseFloat(arVersion[1]);
    if (version > 0) {
        isIE = true;
        flip_time = 800;
        flip.find('.overlayer img').hide();
        flip.find('.overlayer').addClass('ie_r');
    }

    //check pager
    left.find('.pager').html((current + 1) + " / " + Math.ceil(total / 2));
    left_bar.click(function() {
        if (current - 2 >= 0) {
            //(new Image).src = "http://bj.data.cn.yahoo.com/sns?s=" + sid + "&t=" + Math.random() + "&r=" + encodeURIComponent(document.referrer);
            Beacon.ajax_refer = current / 2 + 1; // current index
            Beacon.ajax_url = current / 2;  // target index
            Beacon.ajax_isLastPage = 0; // 0 or 1
            //Beacon.ajaxRequest();

            current = current - 2;
            if (isIE) {
                flip.find('.overlayer').removeClass('ie_r').addClass('ie_l');
            } else {
                flip.find('img').attr('src', 'flip_l.png/flip_l.png');
            }
            flip.find('.container').css('background', 'url(flip_l.png/book_r.jpg) left top no-repeat');
            flip.find('.label').html(right.find('.label').html());
            flip.find('.content').html(page_content[current + 1]);
            flip.find('.pager').html('');
            left.find('.pager').html('');

            if (isIE) {
                left.find('.content').hide();
                window.setTimeout(function() {
                    if (page_content[current]) {
                        left.find('.content').html(page_content[current]).show();
                    } else {
                        left.find('.content').html('').show();
                    }
                }, flip_time / 4);
            } else {
                window.setTimeout(function() {
                    if (page_content[current]) {
                        left.find('.content').hide().html(page_content[current]).css({ opacity: 0.5, display: 'block' }).animate({ opacity: 1 }, (flip_time - (flip_time / 4)));
                    } else {
                        left.find('.content').html('');
                    }
                }, flip_time / 4);
            }

            flip.find('.container').stop().css({
                'margin-left': -526
            }).animate({
                'margin-left': 0
            }, flip_time, 'linear');

            flip.find('.overlayer').stop().css({
                'width': 100,
                'margin-left': -26
            }).animate({
                'width': 652,
                'margin-left': -195
            }, flip_time, 'linear');

            flip.stop().css({
                'left': 15,
                'display': 'block'
            }).animate({
                'left': 490
            }, flip_time, 'linear', function() {
                right.find('.content').html(flip.find('.content').html());
                left.find('.pager').html((current + 1 + 1) / 2 + " / " + Math.ceil(total / 2));
                slider.slider("value", (current + 1) * step);
                $(this).hide(0);
            });
        }
    });

    right_bar.click(function() {
        if (current + 2 <= total - 1) {
            //(new Image).src = "http://bj.data.cn.yahoo.com/sns?s=" + sid + "&t=" + Math.random() + "&r=" + encodeURIComponent(document.referrer);
            Beacon.ajax_refer = current / 2 + 1; // current index
            Beacon.ajax_url = current / 2 + 2;  // target index
            Beacon.ajax_isLastPage = 0; // 0 or 1
            //Beacon.ajaxRequest();

            current = current + 2;
            if (isIE) {
                flip.find('.overlayer').removeClass('ie_l').addClass('ie_r');
            } else {
                flip.find('img').attr('src', 'images/flip_r.png');
            }
            flip.find('.container').css('background', 'url(images/book_l.jpg) left top no-repeat');
            flip.find('.label').html('');
            flip.find('.content').html(page_content[current]);
            flip.find('.pager').html((current + 1 + 1) / 2 + " / " + Math.ceil(total / 2));
            flip.find('.overlayer').css({ 'width': '100%', 'margin-left': 0 });

            if (isIE) {
                right.find('.content').hide();
                window.setTimeout(function() {
                    if (page_content[current + 1]) {
                        right.find('.content').html(page_content[current + 1]).show();
                    } else {
                        right.find('.content').html('').show();
                    }
                }, flip_time / 4);
            } else {
                window.setTimeout(function() {
                    if (page_content[current + 1]) {
                        right.find('.content').hide().html(page_content[current + 1]).css({ opacity: 0.5, display: 'block' }).animate({ opacity: 1 }, (flip_time - (flip_time / 4)));
                    } else {
                        right.find('.content').html('');
                    }
                }, flip_time / 4);
            }

            flip.stop().css({
                'left': 850,
                'width': 100,
                'display': 'block'
            }).animate({
                'left': 15,
                'width': 652
            }, flip_time, 'linear', function() {
                left.find('.content').html(flip.find('.content').html());
                left.find('.pager').html((current + 1 + 1) / 2 + " / " + Math.ceil(total / 2));
                slider.slider("value", (current + 1) * step);
                $(this).hide(0);
            });
        }
    });

    var left_bar_w = left_bar.width();
    $('#book').hover(function(e) {
        left_bar.find('.mask').stop().animate({ opacity: 0.1 }, 200, 'linear').next().show();
        right_bar.find('.mask').stop().animate({ opacity: 0.1 }, 200, 'linear').next().show();
    }, function(e) {
        left_bar.find('.mask').animate({ opacity: 0 }, 500, 'linear', function() { $(this).next().hide(); });
        right_bar.find('.mask').animate({ opacity: 0 }, 500, 'linear', function() { $(this).next().hide(); });
    });

    //glide
    var step = parseInt($('.glide').width() / (Math.ceil(total / 2) * 2 - 1));
    var slider = $('.glide').slider({
        min: step,
        max: $('.glide').width(),
        step: step * 2,
        slide: function(event, ui) {
            $('.glide a').attr('title', (ui.value / step + 1) / 2 + '/' + Math.ceil(total / 2));
            if (ui.value / step > current) {
                current = ui.value / step - 2 - 1;
                right_bar.click();
            } else if (ui.value / step < current) {
                current = ui.value / step + 2 - 1;
                left_bar.click();
            }
        }
    });
    $('.glide a').attr('title', 1 + '/' + Math.ceil(total / 2)).attr('hidefocus', 'true').css('outline', '0').focus(function() { $(this).blur(); });


    //review
    (function() {
        var spacing = 166;
        var container = $('#review ul');
        var left = $('#review .ab_l');
        var right = $('#review .ab_r');
        var on_class = 'on';

        function checkStatus() {
            if (parseInt(container.css('left')) < 0) {
                left.unbind('click').one('click', leftClick).addClass(on_class);
            } else {
                left.removeClass(on_class);
            }
            if (parseInt(container.css('left')) > -(parseInt(container.css('width')) - (spacing * 5))) {
                right.unbind('click').one('click', rightClick).addClass(on_class);
            } else {
                right.removeClass(on_class);
            }
        }

        function leftClick(e) {
            e.preventDefault();
            if (parseInt(container.css('left')) < 14) {
                container.animate({
                    left: '+=' + (spacing * 5)
                }, 800, function() {
                    checkStatus();
                });
            }
        }

        function rightClick(e) {
            e.preventDefault();
            if (parseInt(container.css('left')) > -(parseInt(container.css('width')) - (spacing * 5)) + 14) {
                container.animate({
                    left: '-=' + (spacing * 5)
                }, 800, function() {
                    checkStatus();
                });
            }
        }
        container.css('width', spacing * container.children().length);
        checkStatus();
    })();
});
