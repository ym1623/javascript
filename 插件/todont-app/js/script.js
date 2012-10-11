/**
 *
 * 4#. Todon't - "Design it & Code it"
 *
 * Author: Idered <http://idered.pl>
 * Concept and design rights reserved.
 *
 */

(function($) {

  var o = $({});
  $.each(
    { "subscribe" : "on", "unsubscribe" : "off", "publish" : "trigger" },
    function ( fn, api ) {
      $[ fn ] = function() {
        o[ api ].apply( o, arguments );
      };
  });

  var Todont = {

    tasks: $('#tasks'),

    stats: {
      todonts: 0,
      fails: 0,
      total: 0
    },

    init: function() {
      
      $.subscribe('task/add', this.add);
      $.subscribe('task/add', this.statsUpdate);

      $.subscribe('task/done', this.done);
      $.subscribe('task/done', this.statsUpdate);

      $.subscribe('task/remove', this.remove);
      $.subscribe('task/remove', this.statsUpdate);

      this.initEvents();

    },

    initEvents: function() {

      $('#form-add-task').on('submit', function() {
        event.preventDefault();
        $.publish('task/add', '#add-task');
      });

      $('#tasks').delegate('.action-done', 'click', function() {
        var button = $(this);
        $.publish('task/done', button);
      });

      $('#tasks').delegate('.action-remove', 'click', function() {
        var button = $(this);
        $.publish('task/remove', button);
      });
      
    },

    add : function(e, input) {
      var task = $(input).val(),
      taskID = 'task-'+(++Todont.stats.total),
      $task = $('<li/>').attr('id', taskID).text(task);

      if (task !== '') {
        $task.append(
          '<div class="task-actions">' +
          '<a href="#done" class="action-done">Done</a>' +
          '<a href="#remove" class="action-remove">Remove</a>' +
          '</div>'
        );
        Todont.tasks.prepend($task);
        $(input).val('');
      }

    },

    done : function(e, button) {
      var task = $(button).parent().parent();

      task.toggleClass('failed');

      $(button).text(task.hasClass('failed') ? 'Undone' : 'Done');
    },

    remove : function(e, button) {
      $(button).parent().parent().remove();
    },

    statsUpdate: function() {
      var elements = Todont.tasks.children();

      Todont.stats.todonts = elements.not('.failed').length;
      Todont.stats.fails = elements.filter('.failed').length;
      Todont.stats.total = elements.length;

      $('#stats .todonts span').text(Todont.stats.todonts);
      $('#stats .fails span').text(Todont.stats.fails);
      $('#stats .total span').text(Todont.stats.total);
    }

  };

  Todont.init();

})(jQuery);