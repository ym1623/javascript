(function($) {
  $('.btn-counter').on('click', function(event, count) {
    event.preventDefault();

    var $this = $(this),
        count = $this.attr('data-count'),
        active = $this.hasClass('active'),
        multiple = $this.hasClass('multiple-count');

    // First method, allows to add custom function
    // Use when you want to do an ajax request
    /* if (multiple) {
        $this.attr('data-count', ++count);
        // Your code here
    } else {
        $this.attr('data-count', active ? --count : ++count).toggleClass('active');
        // Your code here
    } */

    // Second method, use when ... I dunno when but it looks cool and that's why it is here
    $.fn.noop = $.noop;
    $this.attr('data-count',
        ! active || multiple ? ++count : --count
    )[multiple ? 'noop' : 'toggleClass']('active');

  })
})(jQuery);