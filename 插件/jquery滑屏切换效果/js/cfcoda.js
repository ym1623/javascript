//
// 	Code taken and adapted from CodaEffects.js - (C) 2007 Panic, Inc.
// 	http://www.panic.com
//  http://www.jb51.net
// 
//

var currentSection = "home-pane"; // The default loaded section on the page
var tabTag = "-tab";
var paneTag = "-pane";

// Scroll the page manually to the position of element "link", passed to us.

function ScrollSection(link, scrollArea, offset)
{

	// Store the last section, and update the current section

	if (currentSection == link) {
		return;
	}
	lastSection = currentSection;
	currentSection = link;
	
	// Change the section highlight.
	// Extract the root section name, and use that to change the background image to 'top', revealing the alt. state

    sectionTab = currentSection.split("-")[0] + tabTag;
    document.getElementById(sectionTab).className = 'active';
    if (lastSection) {
	   lastTab = lastSection.split("-")[0] + tabTag;
	    document.getElementById(lastTab).className = "inactive";
	}
    
	// Get the element we want to scroll, get the position of the element to scroll to
	
	theScroll = document.getElementById(scrollArea);
	position = findElementPos(document.getElementById(link));
	
	// Get the position of the offset div -- the div at the far left.
	// This is the amount we compensate for when scrolling
	
	if (offset != "") {
		offsetPos = findElementPos(document.getElementById(offset));
		position[0] = position[0] - offsetPos[0];
	}

	
	scrollStart(theScroll, theScroll.scrollLeft, position[0], "horiz");
	// return false;
}
function ScrollArrow(direction, toolbar, scrollArea, offset) {

	toolbarElem = document.getElementById(toolbar);
	toolbarNames = new Array();
    
	// Find all the <li> elements in the toolbar, and extract their id's into an array.
    
	if (toolbarElem.hasChildNodes())
	{
		var children = toolbarElem.childNodes;
		for (var i = 0; i < children.length; i++) 
		{
			if (toolbarElem.childNodes[i].tagName == "LI") {
				toolbarNames.push(toolbarElem.childNodes[i].id.split("-")[0]);
			}
		}
	}

	// Now iterate through our array of tab names, find matches, and determine where to go.

	for (var i = 0; i < toolbarNames.length; i++) {
		if (toolbarNames[i] == currentSection.split("-")[0]) {
			if (direction == "left") {
				if (i - 1 < 0) {
					gotoTab = toolbarNames[toolbarNames.length - 1];
				} else {
					gotoTab = toolbarNames[i - 1];
				}
			} else {
				if ((i + 1) > (toolbarNames.length - 1)) {
					gotoTab = toolbarNames[0];
				} else {
					gotoTab = toolbarNames[i + 1];
				}
			}
		}
	}
	
	// Go to the section name!
	
	ScrollSection(gotoTab+paneTag, scrollArea, offset);

}
var scrollanim = {time:0, begin:0, change:0.0, duration:0.0, element:null, timer:null};

function scrollStart(elem, start, end, direction)
{
	//console.log("scrollStart from "+start+" to "+end+" in direction "+direction);

	if (scrollanim.timer != null) {
		clearInterval(scrollanim.timer);
		scrollanim.timer = null;
	}
	scrollanim.time = 0;
	scrollanim.begin = start;
	scrollanim.change = end - start;
	scrollanim.duration = 20;
	scrollanim.element = elem;
	
	if (direction == "horiz") {
		scrollanim.timer = setInterval("scrollHorizAnim();", 15);
	}
	else {
		scrollanim.timer = setInterval("scrollVertAnim();", 15);
	}
}

function scrollVertAnim()
{
	if (scrollanim.time > scrollanim.duration) {
		clearInterval(scrollanim.timer);
		scrollanim.timer = null;
	}
	else {
		move = sineInOut(scrollanim.time, scrollanim.begin, scrollanim.change, scrollanim.duration);
		scrollanim.element.scrollTop = move; 
		scrollanim.time++;
	}
}

function scrollHorizAnim()
{
	if (scrollanim.time > scrollanim.duration) {
		clearInterval(scrollanim.timer);
		scrollanim.timer = null;
	}
	else {
		move = sineInOut(scrollanim.time, scrollanim.begin, scrollanim.change, scrollanim.duration);
		scrollanim.element.scrollLeft = move;
		scrollanim.time++;
	}
}
function findElementPos(elemFind)
{
	var elemX = 0;
	var elemY = 0;
	do {
		elemX += elemFind.offsetLeft;
		elemY += elemFind.offsetTop;
	} while ( elemFind = elemFind.offsetParent )

	//console.log("Found element "+elemFind+" at "+elemY+"/"+elemX);

	return Array(elemX, elemY);
}
function sineInOut(t, b, c, d)
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}
