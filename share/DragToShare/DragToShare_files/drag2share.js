/* Drag2Share
 * Version 1.0
 * Author The-Di-Lab
 * URI: http://www.The-Di-Lab.com 
 */
(function($) {
	 $.fn.drag2share = function (options) {
	    //global variables
	    var defaults = {
	    		icons: 'icons',
	    		revertDrag: false,
                targets: "linkedin,technorati,delicious,yahoo,google,facebook,twitter,stumble"
        };
        		                
        var options =  $.extend(defaults, options);         
        var title = $("title").text() || document.title;        
        var currentUrl = window.location.href;
        var domain = document.domain;
        var tUlH=100;
        
         //share List
		var sList	= {
			linkedin 	    : "http://www.linkedin.com/shareArticle?mini=true&url={URL}&title={TITLE}&summary={DESCRIPTION}&source=",
			technorati 		: "http://www.technorati.com/faves?add={URL}",
			delicious 		: "http://del.icio.us/post?url={URL}&title={TITLE}",
			yahoo 			: "http://myweb2.search.yahoo.com/myresults/bookmarklet?u={URL}&t={TITLE}",
			google 			: "http://www.google.com/bookmarks/mark?op=edit&bkmk={URL}&title={TITLE}",
			facebook 		: "http://www.facebook.com/share.php?u={URL}",
			twitter 		: "http://twitter.com/?status={TITLE}%20-%20{SHORTURL}",
			stumble 	    : "http://www.stumbleupon.com/submit?url={URL}&title={TITLE}"
		};
		
		
        
   		//create target ul list     
        function createTarget(t){
        	var tUl= document.createElement('ul');
        	var imgSufix='.png';
        	tUl.id = 'drag2share-targets';
        	$.each(t.split(','), function(index, value) { 
				 var tLi = document.createElement('li');
				 tLi.id = value;
				 tLi.style.background  = 'url('+options.icons+'/'+value+imgSufix+') no-repeat 0 0';
				 $(tUl).append(tLi);
			});
			$(document.body).prepend(tUl);
			tUlH=($(tUl).height());
			tUl.style.top = '-'+parseInt(tUlH+20)+'px';
        }
        $('ul.drag2share-targets').length<1?createTarget(options.targets):'';
        
        //tip variable
        var createTip = function(e) {
			  //create tool tip if it doesn't exist
			  ($("#drag2share-tip").length === 0) ? $("<div>").html("<span>Drag to share this page<\/span><span class='arrow'><\/span>").
			  		attr("id", "drag2share-tip").css({ left:e.pageX + 30, top:e.pageY - 16 }).appendTo("body").fadeIn(1000) : null;
		};
		
		//helper
        function createHelper (obj){
        	return  "<img id='drag2share-thumb' src='" + $(obj).attr("src") + "'/>"
        			+"<span class='title'>" + title + "</span>"
        			+"<br/>"
        			+"<span class='url'>" + domain + "</span>";
        }
        
        //make obj draggable
        function makeDraggable(obj){        
        	obj.draggable({
        	  refreshPositions: true,
		      //create draggable helper
			  helper: function() {
			    return $("<div>").attr("id", "drag2share-helper").html(createHelper(this)).appendTo("body");
			  },
			  revert: options.revertDrag,
			  cursor: "pointer",
			  cursorAt: { left: -10, top: 20 },
			  zIndex: 999999,
			  //show overlay and targets
			  start: function(e) {
			    $("<div>").attr("id", "overlay").css("opacity", 0.5).css('height',$(document).height()).appendTo("body");
				$("#drag2share-tip").remove();
				$(this).unbind("mouseenter");
				$("#drag2share-targets").css("left", ($("body").width() / 2) - $("#drag2share-targets").width() / 2).animate({
					top: targetsTo()+'px'
				},500);			
			  },
			  //remove targets and overlay
			  stop: function() {
			    $("#drag2share-targets").animate({	
			    	top: '-'+parseInt(parseInt(targetsTo()))+'px'
			    },500);
				$(".drag2share-share").remove();
			    $("#overlay").remove();
				$(this).bind("mouseenter", createTip);
			  }
			});
        }
        
        function targetsTo(){
        		return parseInt( parseInt($(window).scrollTop())+100 );
        }
        
        //make obj droppable
        function makeDroppable(obj){   
        	$(obj).droppable({
			  tolerance: "pointer",
			  //show info when over target
			  over: function() { 
			  	$("#drag2share-helper").addClass('drag2share-active-helper');
			    $(".drag2share-share").remove(); 
			    $("<span>").text("Share on " + $(this).attr("id"))
			    		   .css("top",parseInt(parseInt($('#drag2share-targets').css('top'))-parseInt(tUlH))+'px')
			    		   .addClass("drag2share-share")
			    		   .appendTo("body").hide();	
			    $(".drag2share-share").css("left",parseInt($("body").width()/2 - $('.drag2share-share').width()/2)).fadeIn();
			  },
			  drop: function() {
			      $(this).fadeOut();			     
			      var id = $(this).attr("id");			      
			      var url = sList[id];
			      url= url.replace("{TITLE}", urlencode(title));
			      url= url.replace("{DESCRIPTION}", urlencode(title));
			      url= url.replace("{URL}", urlencode(currentUrl));
			      url= url.replace("{SHORTURL}", urlencode(currentUrl));
			      window.location.href  = url;
			  },			  
			  out: function(){
			    $("#drag2share-helper").removeClass('drag2share-active-helper');
			  	$(".drag2share-share").remove();
			  }		  
			});
        }
        
        //showTips
        function makeTips(obj){
        	obj.bind("mouseenter", createTip);		
			obj.mousemove(function(e) {
			  //move tooltip
	          $("#drag2share-tip").css({ left:e.pageX + 30, top:e.pageY - 16 });
	        });	  
		    obj.mouseleave(function() {
			  //remove tooltip
			  $("#drag2share-tip").remove();
		    });	        
        }
        
        // Encode url
		function urlencode(string) {
			if(string == undefined){
				return "";
			}
			return string.replace(/\s/g, '%20').replace('+', '%2B').replace('/%20/g', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40');
		}
        
        return this.each(function(){	
        	var thisObj = this;        	
        	//cache selector
			var images = $(thisObj);						
		    //make images draggable
		    makeDraggable(images);
			//make targets droppable
			makeDroppable($("#drag2share-targets li"));
			//make tips
			makeTips(images);
		 });
	   };
})(jQuery);