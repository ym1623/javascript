/* Twitter Status Tooltip by @Idered | http://designitcodeit.com/i/18 */
;(function ($) {

    var Twitter_status = {
        init: function() {
            $('[rel="twitter-status"]').each(function() {
                var $this = $(this),
                    id = $this.attr('href').split('/').pop();

                $this.hover(function() {
                    var status = $this.data('twitterStatus');

                    if (status) {
                        Twitter_status.createTemplate(status, $this)
                    } else {
                        if ( ! $this.hasClass('ts-loading')) {
                            Twitter_status.sendRequest(id, $this);
                            $this.addClass('ts-loading');
                        }
                    }
                }, function() {
                    $('.twitter-status').remove();
                });
            });
        }

        , tmpl: function(s,d){
            for(var p in d) s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
            return s;
        }

        , sendRequest: function(id, el) {

            $.ajax({
                type: 'GET',
                url: 'http://api.twitter.com/1/statuses/show/'+id+'.json',
                timeout: 5000,
                dataType: 'jsonp',
                beforeSend: function() {
                    Twitter_status.createWrapper(el, true);
                },
                success: function(data) {
                    var status = {
                        text: data.text,
                        image: data.user.profile_image_url,
                        username: data.user.screen_name,
                        name: data.user.name
                    };

                    el.data('twitterStatus', status).removeClass('ts-loading');

                    Twitter_status.createTemplate(status, el);
                }
            });
        }

        , createWrapper: function(el, preload) {
            $('.twitter-status').remove();

            var $wrapper = $('<div class="twitter-status"/>').addClass(preload ? ' preload' : '').appendTo('body'),
                offset = el.offset(),
                width   = $wrapper.width(),
                height  = $wrapper.height();

            $wrapper.css({
                top: offset.top + el.height() + 8,
                left: offset.left - (width - el.width() / 1) / 2
            });
        }

        , createTemplate: function(status, el) {
            if ($('.twitter-status').length == 0) Twitter_status.createWrapper(el, false);

            var $template = $(Twitter_status.tmpl(''.concat(
                    '<div class="ts-header">',
                        '<img src="{image}" alt="avatar" width="16" height="16">',
                        '<span class="ts-name">{name}</span> ',
                        '<span class="ts-username">@{username}</span>',
                    '</div>',
                    '<div class="ts-content">{text}</div>'
                ), status));


            $('.twitter-status').removeClass('preload').html($template.hide().fadeIn('fast'));
        }
    };

    Twitter_status.init();

})(jQuery);