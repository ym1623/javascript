/**
 * Attaches itself on an input field, hiding it, adds a "view" container,
 * with the data from the container. Then adds the links for editing and
 * removal (if the user wants that as well).
 *
 * @author jimmiw
 * @site http://westsworld.dk
 * @version 0.1
 * @since 2010-09-08
 */
(function($) {
  // list of methods to call, see http://docs.jquery.com/Plugins/Authoring
  // for more information about this structure.
  var methods = {
    init: function(settings) {
      settings = $.extend({
        'edittext':'edit',
        'removetext':'remove',
        'removeable':false,
        'savetext':'save',
        'canceltext':'cancel',
        'autosave': null
      }, settings);

      // runs through the elements passed in, initializing the plugin
      this.each(function(i,elm) {
        initialize(elm);
      });

      /**
       * Initializes the inline edit element
       */
      function initialize(element) {
        // constructs some ID's for the different containers
        var containerId = 'editme_container_'+$('.editme').length,
        viewContainerId = 'view_'+containerId,
        editContainerId = 'edit_'+containerId,
        editLinkId = 'edit_link_'+editContainerId,
        removeLinkId = 'remove_link_'+editContainerId,
        saveButtonId = 'save_'+editContainerId,
        cancelLinkId = 'cancel_'+editContainerId;

        // constructs the html and adds it to the current page
        createAndAddHtml(element, containerId, viewContainerId, editContainerId, editLinkId, removeLinkId, saveButtonId, cancelLinkId);

        // adds the events
        addEvents(element, containerId, viewContainerId, editContainerId, editLinkId, removeLinkId, saveButtonId, cancelLinkId);
      }

      /**
       * Creates the HTML used in this plugin, using the given id's.
       * @param element the element we are attaching the plugin on
       */
      function createAndAddHtml(element, containerId, viewContainerId, editContainerId, editLinkId, removeLinkId, saveButtonId, cancelLinkId) {
        // constructs the containers HTML
        var containerHtml = '<div id="'+containerId+'" class="editme"></div>';
        // adds the editme container
        $(element).before(containerHtml);

        // constructs the VIEW html
        var viewContainerHtml = '<div id="'+viewContainerId+'" class="editme_view_container">';
        viewContainerHtml += '<span class="data">'+$(element).val()+'</span>';
        viewContainerHtml += '<span class="edit_link">[<a class="ajaxlink" id="'+editLinkId+'">'+settings.edittext+'</a>]</span>';
        if(settings.removeable) {
          viewContainerHtml += '<span class="remove_link">[<a class="ajaxlink" id="'+removeLinkId+'">'+settings.removetext+'</a>]</span>';
        }
        viewContainerHtml += '</div>';
        // adds the view container
        $('#'+containerId).append(viewContainerHtml);

        // constructs the EDIT html
        var editContainerHtml = '<div id="'+editContainerId+'" class="editme_edit_container" style="display:none;"></div>',
        saveButtonHtml = '<input type="button" value="'+settings.savetext+'" id="'+saveButtonId+'"/>',
        cancelLinkHtml = 'or <a class="ajaxlink" id="'+cancelLinkId+'">'+settings.canceltext+'</a>';
        
        // adds the edit container
        $('#'+containerId).append(editContainerHtml);
        // removes the element from the current page
        $(element).detach();
        // adds the element to the edit containet        
        // adds the element to the edit container
        // adds the save button and cancel link
        $('#'+editContainerId).
          append(element).
            append(saveButtonHtml).
              append(cancelLinkHtml);
      }

      /**
       * Adds the events used in this plugin, using the given id's
       */
      function addEvents(element,containerId, viewContainerId, editContainerId, editLinkId, removeLinkId, saveButtonId, cancelLinkId) {
        // adds the event for the edit link
        $('#'+editLinkId).click(function(e) {
          // starts the edit
          edit(viewContainerId, editContainerId);
        });
        // adds the event for the save button
        $('#'+saveButtonId).click(function(e) {
          save(editContainerId);
        });
        // adds the event for the cancel button
        $('#'+cancelLinkId).click(function(e) {
          // since cancel was clicked, we need the previous data back into the
          // input field. Take this from the "data"-span.
          $('#'+editContainerId+' input[type="text"]').val($('#'+viewContainerId+' span.data').text());
          // shows the view
          view(viewContainerId, editContainerId);
        });

        // handles the "enter key" event
        $(element).keydown(function(e){
          if(e.keyCode == 13) {
            save(editContainerId);
            // fixed for forms submitting data
            return false;
          }
        });

        // if removeable is active, add the event for the link
        if(settings.removeable) {
          $('#'+removeLinkId).click(function(e){
            $('#'+containerId).remove();
          });
        }
      }

      /**
       * Saves the data in the input field, and displays the view
       */
      function save(editId) {
        // if the user added a way of saving the data directly, call it.
        if(settings.autosave) {
          // calls the autosave function, with the current data
          settings.autosave(
            $('#'+editId+' input[type="text"]').val()
          );
        }
        else {
          // saves the data and displays the "show" view.
          $('#'+editId).editme('saved');
        }
      }

      /**
       * Starts the view mode
       */
      function view(viewId, editId) {
        // hides the edit container
        $('#'+editId).hide();
        // shows the view container
        $('#'+viewId).show();
      }

      /**
       * Starts the edit mode
       */
      function edit(viewId, editId) {
        // hides the view container
        $('#'+viewId).hide();
        // shows the edit container AND sets focus in the input field
        $('#'+editId).show().
          find('input[type="text"]').focus();
      }
    },
    
    /**
     * Use this function with the autosave option, so the "nice" view is
     * displayed and the input field hidden again
     */
    saved: function() {
      // Sets the new data in the display container's span element
      $(this).parents('.editme').find('span.data').text(
        $(this).parents('.editme').find('input[type="text"]').val()
      );
      
      // hides the edit container
      $(this).parents('.editme').find('.editme_edit_container').hide();
      // shows the display container
      $(this).parents('.editme').find('.editme_view_container').show();
    }
  };
  
  /**
   * Main entry point for the plugin.
   * @param method the method to call
   */
  $.fn.editme = function(method) {
    if(methods[method]) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if(typeof method === 'object' || !method) {
      return methods.init.apply( this, arguments );
    }
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.editme' );
    }

    return this;
  }
})(jQuery);